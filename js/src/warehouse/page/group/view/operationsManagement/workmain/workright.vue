<template>
  <div class="right">
    <div class="head" v-show="newcreate">{{!chakan?'查看':'修改'}}班次规则</div>
    <div class="head" v-show="!newcreate">新建班次</div>
    <div v-show="firstcom" class="please">请从左侧选择班次，以查看详情或修改。</div>
    <el-form
      v-show="!firstcom"
      id="workform"
      label-width="80px"
      label-position="right"
      :model="form"
      :rules="rules"
      ref="timeTrunkform"
    >
      <el-row>
        <el-form-item label></el-form-item>
      </el-row>
      <el-row v-show="chakan">
        <el-col :span="24">
          <el-form-item label>
            <el-button type="primary" @click="submitEvent" :disabled="isDisabled">保存</el-button>
            <el-button type="primary" plain @click="cancel">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-show="!chakan">
          <el-form-item label>
            <el-button type="primary" plain @click="canEdit">修改</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="启用">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="2"
              :disabled="edit"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="w350">
          <el-form-item label="班次名" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入班次名称" class="wb100" :disabled="edit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="w350">
          <el-form-item label="班次类型" prop="categoryCode">
            <el-select v-model="form.categoryCode" placeholder="请选择班次类型" :disabled="edit" class="wb100">
              <el-option
                v-for="item in classesArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item, i) in form.timeranges" :key="i" type="flex" class="w350">
        <el-form-item
          :label="i === 0 ? '排班时段' : ''"
          :prop="'timeranges.' + i + '.startDate'"
          :rules="{required: true, message: '必填项', trigger: ['blur', 'change']}"
        >
          从：
          <el-time-select
            :disabled="edit"
            :class="chakan?'wid':'wid2'"
            :clearable="true"
            v-model="item.startDate"
            placeholder="开始"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '23:50',
              maxTime: item.endDate
            }"
          ></el-time-select>
        </el-form-item>
        <el-form-item
          label
          label-width="0"
          :prop="'timeranges.' + i + '.endDate'"
          :rules="{required: true, message: '必填项', trigger: ['blur', 'change']}"
        >
          <span style="margin-left:10px;margin-right:5px">到：</span>

          <el-time-select
            :disabled="edit"
            :class="chakan?'wid':'wid2'"
            :clearable="true"
            v-model="item.endDate"
            placeholder="结束"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00',
              minTime: item.startDate
            }"
          ></el-time-select>
        </el-form-item>
        <el-form-item label label-width="0" v-show="!edit" class="icon1">
          <i class="iconfont icon-delete mrl10" v-if="i > 0" @click="delWorkTime(i)"></i>
          <i class="iconfont icon-tianjia mrl10" @click="addWorkTime" v-if="i === 0"></i>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import choose from '@/warehouse/page/components/choose.vue'
import api from '@/arrange/store/workapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import storage from '@/util/storage'
import { classesArr } from './model.js'
export default {
  props: {
    'onfirst': {
      type: [Boolean, Number],
      default: false
    },
    'onchoose': {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'onfirst' (v) {
      this.$refs.timeTrunkform.resetFields()
      this.firstcom = false
      this.newcreate = false
      this.edit = false
      this.chakan = true
      this.clear++
      this.resetForm()
    },
    'onchoose' (v) {
      if (v) {
        this.resetForm()
        this.firstcom = false
        this.newcreate = true
        this.chakan = false
        this.edit = true
        this.fillData(JSON.parse(JSON.stringify(v)))
      }
    }
  },
  data () {
    return {
      api,
      storage,
      schedulingapi,
      firstcom: true,
      newcreate: true,
      isDisabled: false,
      clear: 1,
      chakan: false,
      edit: true,
      disabled: false,
      orgItemList: [],
      isSubmit: false,
      checked: false,
      obj: {},
      reflesh: 1,
      categoryCode: 'COMMON',
      classesArr,
      form: {
        name: '',
        categoryCode: '',
        status: 1,
        timeranges: [{ startDate: '', endDate: '' }]
      },
      rules: {
        name: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        categoryCode: [
          { required: true, message: '请选择班次类型', trigger: ['change'] }
        ]
      }
    }
  },
  methods: {
    canEdit () {
      this.edit = false
      this.chakan = true
    },
    cancel () {
      if (this.newcreate === false) {
        this.resetForm(true)
        this.edit = true
        this.$refs.timeTrunkform.resetFields()
      } else {
        this.firstcom = false
        this.chakan = false
        this.edit = true
      }
    },
    fillData (v) {
      this.form.timeranges = v.timeranges ? v.timeranges : [{ startDate: '', endDate: '' }]
      this.form.categoryCode = v.categoryCode
      this.form.id = v.id ? v.id : null
      this.form.status = v.status ? v.status : 2
      this.form.name = v.name
    },
    addWorkTime () {
      this.form.timeranges.push({ startDate: '', endDate: '' })
    },
    delWorkTime (index) {
      this.form.timeranges.splice(index, 1)
    },
    submitEvent () {
      this.$refs.timeTrunkform.validate(valid => {
        if (valid) {
          for (var i = 0; i < this.form.timeranges.length - 1; i++) {
            for (var j = i + 1; j < this.form.timeranges.length; j++) {
              let item1 = this.form.timeranges[i]
              let item2 = this.form.timeranges[j]
              if (item1.endDate <= item2.startDate || item2.endDate <= item1.startDate) {
              } else {
                this.$notify({
                  title: '提醒',
                  message: '班次时间段不能有重合',
                  type: 'info'
                })
                return
              }
            }
          }
          this.isDisabled = true
          this.api.createOrupdate(this.form).then(rs => {
            if (rs.head.errCode === 0) {
              this.$notify({
                title: '成功',
                message: '班次保存成功',
                type: 'success'
              })
              this.chakan = false
              this.edit = true
              this.isSubmit = false
              this.form.id = rs.data.id
              this.$emit('update', this.reflesh++)
            }
          })
          setTimeout(() => {
            this.isDisabled = false
          }, 1000)
        }
      })
    },
    resetForm () {
      this.form = {
        id: null,
        categoryCode: '',
        name: '',
        status: 1,
        timeranges: [{ startDate: '', endDate: '' }]
      }
    },
    getOrgList () {
      this.schedulingapi.getOrgList().then(rs => {
        rs.data.map(item => {
          this.orgItemList.push({ organId: '' + item.clinicId, organName: item.clinicName })
        })
      })
    }
  },
  components: {
    choose
  }
}
</script>
<style scoped>
.right {
  margin-left: 50px;
  margin-top: 20px;
}
.head {
  font-family: PingFangSC-Medium;
  font-size: 24px;
  color: #000000;
  letter-spacing: 0.86px;
  line-height: 36px;
  border-bottom: 1px solid #98aec3;
  padding-bottom: 15px;
}
.wid {
  width: 110px;
}
.wid2 {
  width: 130px;
}
.please {
  margin-top: 17px;
}
.w350 {
  width: 420px;
}
.icon1 {
  margin-left: 22px;
}
.graywrap {
  position: relative;
}
.gray {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 99;
}
.warnmsg {
  position: absolute;
  padding: 6px 8px 6px 24px !important;
  border: 1px solid #ee4433;
  background-color: #ffdede;
  border-radius: 2px;
  color: #000 !important;
  font-size: 14px;
  line-height: 1;
  top: auto !important;
  margin-top: 4px;
  right: 0;
  left: auto !important;
  z-index: 999;
}
.warnmsg::after {
  font-family: "iconfont" !important;
  font-size: 14px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: "\E7B2";
  color: #ee4433;
  position: absolute;
  left: 6px;
  top: 6px;
}
.warnmsg::before {
  content: "";
  position: absolute;
  display: block;
  width: 8px;
  height: 8px;
  background-color: #ffdede;
  top: -5px;
  right: 30px;
  border: 1px solid #ee4433;
  transform: rotate(45deg);
  border-right: 0;
  border-bottom: 0;
  z-index: 1;
}
</style>
