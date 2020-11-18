<template>
  <div>
    <ever-bread-crumb :name="!id ? '创建模版' : '编辑模版'"></ever-bread-crumb>
    <div class="flex_col_1_auto layout_inner">
      <el-row>
        <el-col :span="16">
          <ever-form2
            v-model="obj"
            ref="form"
            :schema="schema"
            :rules="rules"
            labelWidth="120px">
            <template slot="tempTypeId">
              <el-select
                v-model="obj.tempTypeId"
                filterable
                clearable
                placeholder="选择类型"
                @change="changeType">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            <template slot="content">
              <el-input
                type="textarea"
                v-model="obj.content"
                :rows="6"
                :maxlength="500"
                placeholder="请输入短信模板内容"
              ></el-input>
            </template>
            <template slot="contentCtrl">
              <div class="btnBox">
                <div>
                  <span>插入动态数据</span>
                  <span class="cGray">(可以选择动态数据插入到消息内容)</span>
                </div>
                <div class="btnBoxCnt">
                  <template v-for="item in chooseList">
                    <el-button
                      type="primary"
                      @click="clkbtn(item.name)"
                      plain
                      v-html="item.desc+'{'+item.name+'}'"
                      :data-name="item.name"
                    ></el-button>
                  </template>
                </div>
              </div>
            </template>
            <template slot="tmpApplyRanges1">
              <set-use-range2
                v-model="obj.selObj"
                :clinicId="clinicId"
                :is-bloc="true"
              ></set-use-range2>
            </template>
            <!-- <template slot="tmpApplyRanges">
              <set-use-range
                v-model="obj.tmpApplyRanges"
                @tackThisToBackend="getData"
                :clinicId="clinicId"
              ></set-use-range>
            </template> -->
            <template slot="status">
              <el-switch
                v-model="obj.status"
                active-text="启用"
                inactive-text="禁用"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </template>
            <template slot="default">
              <el-form-item style="clear:both">
                <el-button type="primary" @click="submit">保存</el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
// import setUseRange from './setuserange'
import setUseRange2 from './setuserange2'
import urlMap from '@/msgcenter/store/urls'
import { request } from '@/util/req'

let schema = [
  {
    name: 'name',
    label: '模版名称',
    props: {
      maxlength: 40
    }
  },
  {
    name: 'tempTypeId',
    label: '业务类型',
    comp: 'custom'
  },
  {
    name: 'content',
    label: '消息内容',
    comp: 'custom'
  },
  {
    name: 'contentCtrl',
    label: '',
    comp: 'custom'
  },
  {
    name: 'tmpApplyRanges1',
    label: '使用范围',
    comp: 'custom',
    parentClass: 'custom-form-item not-required'
  },
  // {
  //   name: 'tmpApplyRanges',
  //   label: '使用范围',
  //   comp: 'custom',
  //   parentClass: 'custom-form-item not-required'
  // },
  {
    name: 'status',
    label: '是否启用',
    comp: 'custom',
    props: {
      options: [{ name: 1, id: '生效' }, { name: 0, id: '失效' }]
    }
  }
]

export default {
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.status = 1
    obj.selObj = {
      applyOrgIds: [],
      applyDeptIds: []
    }
    return {
      schema,
      obj,
      arr: [],
      typeList: '',
      chooseList: '',
      dataList: [],
      id: this.$route.params.id,
      rules: {
        name: [
          { required: true, message: '请输入模版名称', trigger: 'blur' }
        ],
        tempType: [
          { required: true, message: '请选择模版分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入模版内容', trigger: 'blur' }
        ],
      },
      isManage: this.$route.matched[0].meta.manage,
      clinicId: ''
    }
  },
  created () {
    this.getClassList()
    this.getMsgById()
    this.setOptType()
  },
  watch: {
    // 'obj': {
    //   handler: function (val) {
    //     val.applyOrgIds = val.selObj.applyOrgIds
    //     val.applyDeptIds = val.selObj.applyDeptIds
    //     if (val.tempTypeId) {
    //       this.getParamsByTmpId(val.tempTypeId)
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
  },
  methods: {
    setOptType () {
      if (!this.isManage) {
        this.obj.optType = 1
        this.clinicId = localStorage.getItem('CLINICID').toString()
      } else {
        this.obj.optType = 0
      }
    },
    getMsgById () {
      if (this.id === '-1') {
        return
      }
      request(urlMap.msg.msgTemplate.getTemplateById, {
        templateId: this.id
      }, 'get').then(rs => {
        this.obj.id = rs.data.id
        this.obj.name = rs.data.name
        this.obj.content = rs.data.content
        this.obj.tempTypeId = rs.data.tempTypeId
        this.obj.status = rs.data.status
        this.obj.selObj.applyOrgIds = rs.data.applyOrgIds
        this.obj.selObj.applyDeptIds = rs.data.applyDeptIds
        if (rs.data.tempTypeId) {
          this.getParamsByTmpId(rs.data.tempTypeId)
        }
        this.setOptType()
      })
    },
    submit () {
      this.$refs.form.$refs.form.validate((valid) => {
        if (valid) {
          this.obj.applyOrgIds = this.obj.selObj.applyOrgIds
          this.obj.applyDeptIds = this.obj.selObj.applyDeptIds
          request(urlMap.msg.msgTemplate.createOrUpdate, this.obj).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.$router.push({ name: 'messagelist' })
            } else {
              this.$messageTips(this, 'error', '保存失败')
            }
          })
        }
      })
    },
    // objsaved (res) {
    //   if (res.head.errCode === 0) {
    //     this.$messageTips(this, 'success', '保存成功')
    //     this.$router.push({ name: 'messagelist' })
    //   } else {
    //     this.$messageTips(this, 'error', '保存失败')
    //   }
    // },
    clkbtn (name) {
      this.obj.content = `${this.obj.content}{${name}}`
    },
    // 根据类别显示参数
    getParamsByTmpId (tmpId) {
      if (tmpId && this.typeList.length > 0) {
        let obj = this.typeList.filter(item => {
          if (item.id === tmpId) {
            return item
          }
        })
        this.chooseList = JSON.parse(obj[0].params)
      } else {
        return
      }
    },
    // 修改分类的时候渲染动态参数
    changeType (val) {
      this.obj.content = ''
      this.getParamsByTmpId(val)
    },
    // 渲染业务分类
    getClassList () {
      request(urlMap.msg.msgTemplate.getTypeList, {}, 'get').then(rs => {
        this.typeList = rs.data
      })
    },
  },
  components: {
    // setUseRange,
    setUseRange2
  }
}
</script>
<style scoped>
#createmessage .el-input-group__append .el-button {
  background: #1c7bef;
  border-radius: 0;
  color: #fff;
}
.btnBox {
  background-color: #f5f5f5;
  padding: 10px;
}
.btnBox .btnBoxCnt .el-button:first-child {
  margin-left: 10px;
}
.btnBox .btnBoxCnt .el-button {
  margin-bottom: 5px;
}
</style>
