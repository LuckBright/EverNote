<template>
  <div id="createDiagnosis">
    <el-form
      :model="obj"
      :api="api"
      :rules="rules"
      ref="createDiagnosis"
      label-width="0px"
      label-position="center"
    >
      <!--        <el-row class="lh40">-->
      <!--          <el-col :span="3">编码分类：</el-col>-->
      <!--          <el-col :span="21">集团诊断</el-col>-->
      <!--        </el-row>-->
      <el-row class="lh40">
        <el-col :span="3">诊断分类：</el-col>
        <el-col :span="21">
          <el-form-item label prop="diseaseType">
            <el-select :disabled="!!obj.id" v-model="obj.diseaseType"  @change="diseaseTypeChange" placeholder="请选择诊断类型">
              <el-option
                v-for="item in diseaseTypeOption"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">诊断版本：</el-col>
        <el-col :span="21">
          <el-form-item label prop="diseaseType">
            <el-select :disabled="true" v-model="obj.diseaseVersionCode" clearable placeholder="请选择诊断版本">
              <el-option
                v-for="item in (diseaseVersionOptionCom || [])"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">诊断类别：</el-col>
        <el-col :span="21">
          <el-form-item label prop="diseaseClass">
            <el-select v-model="obj.diagnosticCategory" clearable placeholder="请选择诊断版本">
              <el-option
                v-for="item in (diseaseClassOptionCom || [])"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">诊断名称：</el-col>
        <el-col :span="21">
          <el-form-item label prop="diseaseName">
            <el-input :disabled="!!obj.id" v-model="obj.diseaseName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">英文名称：</el-col>
        <el-col :span="21">
          <el-form-item label prop="diseaseNameEn">
            <el-input v-model="obj.diseaseNameEn"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">诊断编码：</el-col>
        <el-col :span="21">
          <el-form-item label prop="diseaseCode">
            <el-input :disabled="!!obj.id" v-model="obj.diseaseCode"></el-input>
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
          <el-form-item label prop="groupIdList">
            <el-select v-model="obj.groupIdList" multiple placeholder="请选择分组">
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
      <el-row class="lh40">
        <el-col :span="3">编码识别列：</el-col>
        <el-col :span="20">
          <el-form-item label ><el-input v-model="obj.diagnosticCodeColumn"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">章代码：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.chapterCode"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">章代码范围：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.chapterCodeRange"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">章的名称：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.chapterName"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">节代码：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.sectionCode"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">节代码范围：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.sectionCodeRange"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">节名称：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.sectionName"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">类目代码：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.categoryCode"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">类目名称：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.categoryName"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">亚目代码：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.subheadingCode"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">亚目名称：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.subheadingName"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">细目代码：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.detailCode"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">细目名称：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.detailName"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">主要编码：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.mainCode"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">主要编码标志：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.mainCodingSigns"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">附加编码：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.additionalCoding"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">有效标志：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.validFlag"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">工伤使用标志：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.workInjuryUseSign"></el-input></el-form-item>
        </el-col>
      </el-row>
      <el-row class="lh40">
        <el-col :span="3">生育使用标志：</el-col>
        <el-col :span="21">
          <el-form-item label ><el-input v-model="obj.birthSign"></el-input></el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button @click="clickBtn" type="primary">确认</el-button>
      </span>
  </div>
</template>
<script>
import byname from './byname.vue'
import api from '@/warehouse/store/groupdiagnosisapi'
export default {
  props: ['diseaseVersionOption', 'diseaseTypeOption', 'diseaseClassOption', 'updObj'],
  data () {
    let obj = {}
    obj.form = {
      bynameData: [
        {
          name: ''
        }
      ]
    }
    return {
      diseaseVersionCodeObj: {'1': 'CHN-MED-00', '2': 'ICD-10-01-ZDY', '3': 'ICD-9-01-ZDY'},
      api,
      obj,
      visible: false,
      content: {},
      rules: {
        diseaseType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        diseaseName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        diseaseCode: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      options: [],
    }
  },
  computed: {
    diseaseVersionOptionCom () {
      let res = this.diseaseVersionOption.filter((item, index) => {
        return item.parentId === 'THC_DISEASE_TYPE.' + this.obj.diseaseType
      })
      return res
    },
    diseaseClassOptionCom () {
      let res = this.diseaseClassOption.filter((item, index) => {
        return item.parentId === 'THC_DISEASE_TYPE.' + this.obj.diseaseType
      })
      return res
    }
  },
  created () {
    this.getGroup()
    if (this.updObj.id) {
      this.open(this.updObj)
    }
  },
  methods: {
    diseaseTypeChange () {
      this.obj.diseaseVersionCode = this.diseaseVersionCodeObj[this.obj.diseaseType]
      let tempVersionObj = this.diseaseVersionOption.find((item) => {
        return this.obj.diseaseVersionCode === item.code
      })
      this.obj.diseaseVersionName = tempVersionObj.name
    },
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
      this.$emit('close')
    },
    clickBtn () {
      let params = {
        diseaseCodeCategory: '集团诊断',
        ...(this.obj)
      }
      // diseaseCode: this.obj.diseaseCode,
      // diseaseName: this.obj.diseaseName,
      // diseaseNameEn: this.obj.diseaseNameEn,
      // groupIdList: this.obj.groupIdList,
      // diseaseType: this.obj.diseaseType,
      // diseaseVersionCode: this.obj.diseaseVersionCode,
      // diseaseVersionName: this.obj.diseaseVersionName,
      let apiurl = 'createDiagnosis'
      if (this.obj.id) {
        params.id = this.obj.id
        apiurl = 'updateDiagnosis'
      }
      params.diseaseAlias = this.obj.form.bynameData.map(v => {
        if (v && v.name) {
          return v.name
        }
      }).join(',')
      this.$refs.createDiagnosis.validate(valid => {
        if (valid) {
          this.api[apiurl](params).then(rs => {
            if (rs.head.errCode) {
              return false
            }
            this.$notify({
              type: 'success',
              title: '成功',
              message: '操作成功',
              duration: 3000
            })
            let obj1 = {
              form: { bynameData: [{ name: '' }] },
              groupIdList: [],
              diseaseName: '',
              diseaseNameEn: '',
              diseaseCode: ''
            }
            Object.assign(this.obj, obj1)
            this.$emit('clickBtn', 1)
            this.close()
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
#createDiagnosis .el-row.lh40 .el-col-3 {
  height: 40px;
  line-height: 40px;
}
.el-dialog .el-dialog__body {
  padding: 0px 20px !important;
}
.el-col-3 {
  text-align: right;
}
</style>

