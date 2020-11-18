<template>
  <div id="editDiagnosis">
    <el-dialog :visible.sync="visible" title="编辑诊断" class="ui_dialog_02 spe">
      <el-form :model="obj" :rules="rules" ref="ruleForm" label-width="0px" label-position="center">
<!--        <el-row class="lh40">-->
<!--          <el-col :span="3">编码分类：</el-col>-->
<!--          <el-col :span="21">{{obj.diseaseCodeCategory}}</el-col>-->
<!--        </el-row>-->
        <el-row class="lh40">
          <el-col :span="3">诊断分类：</el-col>
          <el-col :span="21">
            <el-form-item label prop="diseaseType">
              <el-select v-model="obj.diseaseType" :disabled="true"  placeholder="请选择诊断类型">
                <el-option
                  v-for="item in diseaseTypeOption"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code + ''"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh40">
          <el-col :span="3">诊断名称：</el-col>
          <el-col :span="21">{{obj.diseaseName}}</el-col>
        </el-row>
        <el-row class="lh40">
          <el-col :span="3">诊断编码：</el-col>
          <el-col :span="21">{{obj.diseaseCode}}</el-col>
        </el-row>
        <el-row class="lh40">
          <el-col :span="3">英文名称：</el-col>
          <el-col :span="21">
            <el-form-item label prop="diseaseNameEn">
              <el-input v-model="obj.diseaseNameEn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" style="height:40px;line-height:40px;">诊断别名：</el-col>
          <el-col :span="21">
            <el-form :model="obj.form" class="bynameData" ref="bynameData">
              <byname
                v-for="(temp, index) in obj.form.bynameData"
                ref="temp"
                :temp="temp"
                :key="index"
                :lgth="obj.form.bynameData.length"
                :num="index"
                @addrow="addrow"
                @delrow="delrow"
              ></byname>
            </el-form>
          </el-col>
        </el-row>
        <el-row class="lh40">
          <el-col :span="3">分组：</el-col>
          <el-col :span="21">
            <el-form-item label prop="group">
              <el-select v-model="obj.group" :disabled="obj.diseaseType === 3"  multiple placeholder="请选择分组">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button @click="clickBtn" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import byname from './byname.vue'
import api from '@/warehouse/store/groupdiagnosisapi'
export default {
  props: ['diseaseTypeOption'],
  data () {
    let obj = {}
    obj.form = {
      bynameData: [
        {
          name: ''
        }
      ]
    }
    obj.group = []
    obj.diseaseType = ''
    return {
      api,
      obj,
      visible: false,
      content: {},
      rules: {
        diseaseType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
      },
      options: [],
    }
  },
  created () {
    this.getGroup()
  },
  methods: {
    addrow () {
      this.obj.form.bynameData.push({
        name: ''
      })
    },
    delrow (index) {
      if (index === 0 && this.obj.form.bynameData.length === 1) {
        this.clearItem()
      } else {
        this.obj.form.bynameData.splice(index, 1)
      }
    },
    clearItem () {
      this.obj.form.bynameData = [{
        name: ''
      }]
    },
    open (val) {
      this.getGroup()
      this.obj.form = {
        bynameData: [
          {
            name: ''
          }
        ]
      }
      this.obj = Object.assign({}, this.obj, val)
      this.obj.diseaseType = this.obj.diseaseType + ''
      if (val && val.groupList) {
        this.obj.group = val.groupList.map(v => {
          return v.id
        })
      }
      if (val && val.diseaseAlias) {
        this.obj.form.bynameData = val.diseaseAlias.split(',').map(v => {
          let object = {}
          object.name = v
          return object
        })
      }
      this.visible = true
    },
    close () {
      this.visible = false
    },
    clickBtn () {
      let params = {
        id: this.obj.id,
        diseaseNameEn: this.obj.diseaseNameEn || '',
        groupIdList: this.obj.group,
        diseaseType: this.obj.diseaseType,
      }
      if (this.obj.form && this.obj.form.bynameData) {
        params.diseaseAlias = this.obj.form.bynameData.map(v => {
          if (v && v.name) {
            return v.name
          }
        }).join(',')
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.api.updateDiagnosis(params).then(rs => {
            if (rs.head.errCode) {
              return false
            }
            this.$notify({
              type: 'success',
              title: '成功',
              message: '更新成功',
              duration: 3000
            })
            this.$emit('clickBtn', 1)
            this.visible = false
          })
        }
      })
    },
    getGroup () {
      this.api.getGroup({ rangeCode: 3, orgId: this.$store.state.currentUser.organizationId }).then(rs => {
        if (rs && rs.data) {
          this.options = rs.data
        }
      })
    }
  },
  components: {
    byname
  }
}
</script>
<style lang='scss' scoped>
#editDiagnosis .el-row.lh40 {
  /*height: 40px;*/
  line-height: 40px;
}
.el-dialog .el-dialog__body {
  padding: 0px 20px !important;
}
.el-col-3 {
  text-align: right;
}
</style>

