<template>
  <div>
    <el-dialog :title="echoData.id ? '编辑条件' : '条件设置'" :visible.sync="dialogVisible" class="ui_dialog_02 spe setting">
      <el-alert
        title="提醒：设置每一项条件都满足，视模版条件满足，同一项条件有多个数值，满足一个视该条件项满足。"
        type="error"
        center
        class="f12 mb20"
        style="background: #FFC1C1 100%;font-size: 12ppx;color: #333333;">
      </el-alert>
      <!-- formCode: {{formCode}}<br>
      obj.valueJudge: {{obj.valueJudge}}<br>
      inputValue: {{inputValue}} -->
      <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="24"
        :label-width="'70px'"
        :label-position="'right'"
        class="f14 ml105"
        :nosubmit="true">
        <template slot="propertyId">
         <ever-select
          :options="propertyList"
          v-model="obj.propertyId"
          :placeholder="'条件名称'"
          :filterable="true"
          :clearable="true"
        ></ever-select>
        </template>
        <template slot="valueJudge">
         <ever-select
          :options="valueJudge"
          v-model="obj.valueJudge"
          :placeholder="'取值方式'"
          :clearable="true"
        ></ever-select>
        </template>
        <template slot="inputCondition">
          <age-range-picker v-if="formCode === 'ageRange'"  v-model="agerangeValue" :showAll="showAll"></age-range-picker>
          <el-input  v-if="formCode === 'input'" placeholder="请输入" v-model="inputValue"></el-input>
          <search-select 
            ref="searchselect"
            v-show="formCode === 'select'"
            v-model="selectValue"
            :propertyId="selectPropertyId">
          </search-select>
          <el-radio-group v-if="formCode === 'radio'" v-model="radioValue">
            <el-radio :label="option.id" v-for="option in radioList" :key="option.id">{{option.name}}</el-radio>
          </el-radio-group>
        </template>
      </ever-form2>
      <div slot="footer" class="dialog-footer mt10">
        <el-button type="primary" @click="save" :loading="buttonLoading">保存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="echoData.id" @click="deleteDetail">删 除</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { relationList } from '@/follow/util/model'
import ageRangePicker from '@/components/agerangepicker'
import searchSelect from './search.select.vue'
let schema = [
  {
    name: 'propertyId',
    label: '条件名称:',
    comp: 'custom',
    span: 24
  },
  {
    name: 'valueJudge',
    label: '取值方式:',
    comp: 'custom',
    span: 24
  },
  {
    name: 'inputCondition',
    label: '输入条件:',
    comp: 'custom',
    span: 24
  },
]
export default {
  props: {
    'templateData': {
      type: Object,
      default: () => {}
    },
    'echoData': {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      schema,
      obj: {
        valueJudge: '',
        propertyId: ''
      },
      dialogVisible: false,
      propertyList: [],
      relationList,
      formCode: '',
      keyName: '',
      radioList: [],
      inputValue: '',
      radioValue: {},
      selectValue: [],
      selectPropertyId: '',
      buttonLoading: false,
      customData: [],
      valueJudge: [],
      customAnalysis: {},
      propertyValue: {},
      agerangeValue: {
        start: {
          year: 0,
          month: 0
        },
        end: {
          year: 130,
          month: 0
        }
      },
      showAll: true
    }
  },
  created () {},
  watch: {
    'obj.propertyId': {
      async handler (val, oldVal) {
        this.propertyList.filter(items => {
          if (items.id === val) {
            this.formCode = items.keyName === 'age' ? 'ageRange' : items.formCode
            this.customData = items.customData || []
            this.customAnalysis = items.customAnalysis || {}
            this.valueJudge = []
            if (items.formCode === 'radio') {
              this.radioList = items.customData.filter(item => {
                item.id = item[items.customAnalysis.primaryColumn]
                item.name = item[items.customAnalysis.showColumn]
                return item
              })
            } else if (items.formCode === 'select') {
              this.selectValue = []
              this.selectPropertyId = items.propertyId
            }
            items.valueJudges.filter(item => {
              this.relationList.filter(rval => {
                if (rval.id === item) {
                  this.obj.valueJudge = ''
                  this.valueJudge.push(rval)
                }
              })
            })
          }
        })
      },
      deep: true
    },
    'radioValue': {
      handler (val) {
        this.customData.filter(item => {
          if (item[this.customAnalysis.primaryColumn] === val) {
            this.propertyValue = item
          }
        })
      },
      deep: true
    },
    'dialogVisible': {
      handler (val) {
        this.resetData()
      },
      deep: true
    },
    'obj.valueJudge': {
      handler (val) {
        if (this.formCode === 'ageRange') {
          this.showAll = val === 8
          this.propertyValue = val === 8 ? [this.agerangeValue.start, this.agerangeValue.end] : this.agerangeValue.start
        }
      },
      deep: true
    }
  },
  methods: {
    async open (val) {
      this.dialogVisible = true
      await this.getProperty(val)
    },
    setEchodata () {
      let val = this.echoData
      this.obj.propertyId = val.propertyId
      this.formCode = val.formCode
      this.$nextTick(_ => { // 防止propertyId 监听后重置数据
        this.obj.valueJudge = val.valueJudge
      })
      if (this.formCode === 'input') {
        if (val.keyName === 'age') {
          if (val.valueJudge === 8) {
            let params = {
              start: val.propertyValue[0],
              end: val.propertyValue[1]
            }
            this.agerangeValue = JSON.parse(JSON.stringify(params))
          } else {
            let params = {
              start: val.propertyValue,
              end: {year: 130, month: 0}
            }
            this.agerangeValue = JSON.parse(JSON.stringify(params))
          }
        } else {
          this.inputValue = val.propertyValue
        }
      } else if (this.formCode === 'radio') {
        this.radioValue = val.propertyValue[val.customAnalysis.primaryColumn]
      } else if (this.formCode === 'select') {
        this.selectPropertyId = val.propertyId
        this.$nextTick(_ => {
          if (val.customAnalysis.primaryColumn !== 'id') {
            this.selectValue = val.propertyValue.map(item => {
              item.id = item[val.customAnalysis.primaryColumn]
              item.name = item[val.customAnalysis.showColumn]
              return item
            })
          } else {
            this.selectValue = val.propertyValue
          }
          this.$refs.searchselect.setOptions(this.selectValue)
        })
      }
    },
    reset () {
      this.$refs.addtag.$refs.form.resetFields()
    },
    close () {
      this.dialogVisible = false
    },
    save () {
      if (!this.obj.propertyId || !this.obj.valueJudge) {
        this.$messageTips(this, 'warning', '请完善信息后再进行操作')
        return
      }
      let propertyValue = ''
      if (this.formCode === 'input') {
        propertyValue = this.inputValue
      } else if (this.formCode === 'ageRange') {
        propertyValue = JSON.stringify(this.propertyValue)
      } else if (this.formCode === 'radio') {
        propertyValue = JSON.stringify(this.propertyValue)
      } else if (this.formCode === 'select') {
        propertyValue = JSON.stringify(this.selectValue)
      }
      let params = {
        templateId: this.templateData.templateId,
        templateName: this.templateData.templateName,
        item: {
          propertyId: this.obj.propertyId,
          valueJudge: this.obj.valueJudge,
          propertyValue: propertyValue
        }
      }
      let modify = {
        id: this.echoData.id,
        propertyId: this.obj.propertyId,
        valueJudge: this.obj.valueJudge,
        propertyValue: propertyValue
      }
      this.buttonLoading = true
      let url = this.echoData.id ? urlMap.follow.propertyRule.modifyRuleItem : urlMap.follow.propertyRuleTemplate.createRule
      request(url, this.echoData.id ? modify : params).then(res => {
        this.buttonLoading = false
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功!')
          this.dialogVisible = false
          this.$emit('update')
        }
      })
    },
    async getProperty (val) {
      request(urlMap.follow.property.searchEnable, {}, 'get').then(rs => {
        if (rs.head.errCode === 0 && rs.data.resultList) {
          this.propertyList = rs.data.resultList
          val && this.setEchodata()
        }
      })
    },
    resetData () {
      this.selectValue = []
      this.radioValue = {}
      this.selectPropertyId = ''
      this.inputValue = ''
      this.obj.valueJudge = ''
      this.obj.propertyId = ''
      this.formCode = ''
      this.agerangeValue = {
        start: {
          year: 0,
          month: 0
        },
        end: {
          year: 130,
          month: 0
        }
      }
    },
    deleteDetail () {
      this.$confirm('请确认是否删除', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        request(urlMap.follow.propertyRule.deleteRuleItem, {id: this.echoData.id}).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功!')
            this.dialogVisible = false
            this.$emit('update')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  },
  components: {
    ageRangePicker,
    searchSelect
  }
}
</script>
<style scoped>
.setting /deep/.el-alert__title {
    font-size: 12px;
    line-height: 18px;
}
.setting /deep/ .el-alert.is-light .el-alert__closebtn {
    color: #FFFFFF;
}
.setting /deep/ .el-form .el-form-item__label {
  color: #999;
}
.ml105{margin-left: 105px;}
</style>

