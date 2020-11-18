<template>
  <el-dialog
    :visible.sync="visible"
    width="800"
    class="tpl-add-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
  >
    <span slot="title" class="tpl-add-title">{{$t('创建处方模版')}}</span>
    <div class="tpl-add-dialog">
      <ever-form2
        class="ever_form_spe label_bold"
        ref="tplForm"
        :nosubmit="true"
        :rules="rules"
        :schema="schema"
        v-model="formData"
        labelWidth="0"
      >
        <template slot="tplType">
          <el-select v-model="formData.tplType" disabled :placeholder="$t('请选择')" class="tpl-type-select">
            <el-option value="1" :label="$t('个人模版')"></el-option>
          </el-select>
        </template>
      </ever-form2>
      <el-table
        :data="tplTableList"
        style="width: 100%"
        :cell-class-name="columnStyle"
        :span-method="columnSpan"
        border
        ref="tplTable"
        @selection-change="selectAdvice">
        <el-table-column type="selection" width="20"></el-table-column>
        <el-table-column
          :label="$t('类型')"
          width="80">
          <template slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceType" :showEn="true"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('医嘱')">
          <template slot-scope="scope">
            <el-table
              style="width: 100%"
              :data="scope.row.list"
              :show-header="false"
              class="el-table-child no-border"
              border
              :cell-class-name="adviceCellClass">
              <el-table-column width="200">
                <template slot-scope="scopeChild">
                  <template v-if="['303', '304'].includes(scopeChild.row.serviceType)">
                    <span v-for="(drug, d) in scopeChild.row.adviceFeesDtoList" :key="d" class="labWrap">
                      <label class="bold">{{drug.serviceName}}</label>
                      <label style="top:-6px" class="lab" v-if="drug.footnote">
                        (<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="drug.footnote"></sys-value>)
                      </label>
                      <label style="bottom:-6px;" class="lab">{{drug.count}}{{drug.countUnitName}}</label>
                    </span>
                  </template>
                  <template v-else>
                    <span>{{adviceCon(scope.row.list.length, scopeChild)}}</span>
                    <template v-if="scopeChild.row.doctorAdviceType">
                      <service-set-items :item="scopeChild.row"></service-set-items>
                    </template>
                    <template v-else>
                      <drug-info
                        class="bold"
                        v-if="['301', '302'].includes(scopeChild.row)"
                        :drug-obj="scope.row"
                      ></drug-info>
                      <span class="bold" v-else>{{scopeChild.row.serviceName}}</span>
                    </template>
                  </template>
                  <i class="iconfont icon-charge" 
                    :class="{'icon-jia': String(scopeChild.row.chargeLevel) === '1', 
                    'icon-CombinedShape': String(scopeChild.row.chargeLevel) === '2', 
                    'icon-bing': String(scopeChild.row.chargeLevel) === '3',
                    'icon-menzhen-lixiu': String(scope.row.chargeLevel) === '4'}"></i>
                  <template v-if="scopeChild.row.specialClassify">
                    <el-tooltip v-for="code in scopeChild.row.specialClassify.split(',')" :key="code">
                      <template v-if="specialClassify[code]">
                        <span slot="content">{{specialClassify[code].name}}</span>
                        <svg class="icon fontMargin" aria-hidden="true">
                          <use :xlink:href="'#' + specialClassify[code].icon"></use>
                        </svg>
                      </template>                                          
                    </el-tooltip>
                  </template>
                  <template v-if="scopeChild.row.antibioticType">
                    <el-tooltip v-for="code in scopeChild.row.antibioticType.split(',')" :key="code">
                      <template v-if="specialClassify[code]">
                        <span slot="content">{{specialClassify[code].name}}</span>
                        <svg class="icon fontMargin" aria-hidden="true">
                          <use :xlink:href="'#' + specialClassify[code].icon"></use>
                        </svg>
                      </template>
                    </el-tooltip>
                  </template>
                  <template v-if="scopeChild.row.highRisk">
                    <el-tooltip v-if="specialClassify[scopeChild.row.highRisk]">
                      <span slot="content">{{specialClassify[scopeChild.row.highRisk].name}}</span>
                      <svg class="icon fontMargin" aria-hidden="true">
                        <use :xlink:href="'#' + specialClassify[scopeChild.row.highRisk].icon"></use>
                      </svg>
                    </el-tooltip>
                  </template>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scopeChild">
                  <advice-item-show :item="scopeChild.row" :visit-type="1"></advice-item-show>
                </template>
              </el-table-column>
              <el-table-column width="160">
                <template slot-scope="scopeChild">
                  <span v-if="scopeChild.row.entrust">{{scopeChild.row.entrust}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('嘱托')"
          width="160">
        </el-table-column>
         <el-table-column
          :label="$t('执行科室')"
          width="100">
          <template slot-scope="scope">
            <div class="execute-provider" :title="scope.row.executeProviderName">{{scope.row.executeProviderName}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer">
      <el-button @click="close">{{$t('取消')}}</el-button>
      <el-button type="primary" :loading="waiting" @click="saveTemplate" :disabled="!selectTpls.length">{{$t('提交')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import api from '@/sob/store/tmpl.api.js'
  import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
  import drugInfo from '@/inpatient/components/drug.info'
  import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
  import i18n from '@/assets/locals/index'
  import { specialClassify } from '../doctor.state'

  const schema = [
    {
      // 模版名称
      name: 'tplName',
      label: '',
      span: 24,
      props: {
        placeholder: i18n.t('请输入模版标题，不超过20个字符'),
        maxlength: 20
      }
    },
    {
      // 模版类型
      name: 'tplType',
      label: '',
      comp: 'custom'
    }
  ]
  export default {
    components: {adviceItemShow, drugInfo, serviceSetItems},
    props: {
      'dialogShow': {
        type: Boolean,
        default: true
      },
      'tableList': {
        type: Array,
        default: []
      },
      'defaultSelects': {
        type: Array,
        default: []
      },
      baseInfo: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        formData: {
          tplName: '',
          tplType: '1',
        },
        waiting: false,
        selectTpls: []
      }
    },
    computed: {
      visible: {
        get: function () {
          return this.dialogShow
        },
        set: function (val) {
          this.$emit('update:dialogShow', val)
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.rules = {
          tplName: [{ required: true, message: '必填项', trigger: 'blur' }],
        }
        this.schema = schema
        this.specialClassify = specialClassify
        this.tplTableList = this.getList(this.tableList)
      },
      getList (list) {
        let data = JSON.parse(JSON.stringify(list))
        let newList = []
        let mainGroupObj = {}
        data.forEach(item => {
          item.status = 0
          Object.assign(item, item.adviceJson)
          delete item.shopSetItemId
          delete item.adviceJson
          delete item.extendFieldJson
          if (!mainGroupObj[item.mainGroupId]) {
            mainGroupObj[item.mainGroupId] = {}
            mainGroupObj[item.mainGroupId].sort = item.serialNumber // 排序
            mainGroupObj[item.mainGroupId].serviceType = item.serviceType // 类型
            mainGroupObj[item.mainGroupId].storeroomName = item.storeroomName // 库房
            mainGroupObj[item.mainGroupId].executeProviderName = item.executeProviderName // 执行科室
            mainGroupObj[item.mainGroupId].source = item.source // 执行科室
            mainGroupObj[item.mainGroupId].list = [item]
          } else {
            let mainGroup = mainGroupObj[item.mainGroupId]
            mainGroup.sort = mainGroup.sort > item.serialNumber ? item.serialNumber : mainGroup.sort
            if (item.mainFlag === 1) {
              mainGroup.list.unshift(item)
            } else {
              mainGroup.list.push(item)
            }
          }
        })
        newList = Object.values(mainGroupObj).sort((a, b) => (a.sort > b.sort ? 1 : -1))
        return newList
      },
      selectAdvice (val) {
        this.selectTpls = []
        val.sort((a, b) => {
          return a.sort > b.sort ? 1 : -1
        }).forEach(item => {
          this.selectTpls.push(...item.list)
        })
      },
      adviceCon (len, scope) {
        if (len > 1) {
          if (scope.$index === 0) {
            return '┏'
          } else if (scope.$index === len - 1) {
            return '┗'
          } else {
            return '┣'
          }
        }
        return ''
      },
      getSaveData () {
        let providerId = this.baseInfo.providerId
        let providerName = this.baseInfo.providerName
        return {
          content: JSON.stringify(this.selectTpls),
          templateName: this.formData.tplName,
          templateType: 1,
          sceneType: 1,
          templateSource: 1,
          providerId,
          providerName,
          id: '-1'
        }
      },
      saveTemplate () {
        this.waiting = true
        this.$refs.tplForm.$refs.form.validate(valid => {
          if (!valid) {
            this.waiting = false
            return
          }
          api.createOrUpdate(this.getSaveData()).then(res => {
            this.waiting = false
            if (res.head.errCode) {
              return false
            }
            this.close()
            this.$messageTips(this, 'success', '处方模版保存成功', '成功')
          })
        })
      },
      close () {
        this.$emit('update:dialogShow', false)
      },
      columnSpan ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 2) {
          return [1, 2]
        } else if (columnIndex > 2 && columnIndex < 4) {
          return [0, 0]
        }
      },
      columnStyle ({columnIndex}) {
        if (columnIndex === 2) {
          return 'advice-span'
        }
      },
      adviceCellClass ({columnIndex}) {
        if (columnIndex === 1 || columnIndex === 2) {
          return 'advice-border-right'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tpl-add-dialog {
    .execute-provider {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .tpl-add-title {
      font-size: 18px;
    }
    /deep/ .el-dialog {
      min-width: 900px;
    }
    .eline {
      margin-right: 30px;
    }
    // padding: 0 15px;
    .form-label {
      line-height: 2.3;
    }
    .radio-type {
      line-height: 2.3;
    }
    .margin-top-10 {
      margin-top: 10px;
    }
    .tpl-type-select {
      width: 100%;
      margin-top: 5px;
    }
    /deep/ .el-table {
      .tpl-header-cell {
        border-right: none;
      }
      .el-table__body td {
        padding: 0;
      }
      .el-table-column--selection {
        border-right: none;
        .cell {
          padding: 0 0 0 5px;
        }
      }
      .advice-border-right {
        border-right: 1px #ddd solid;
      }
      .advice-span {
        border-right: none;
        padding: 0;
        .cell {
          padding: 0
        }
        .el-table-child {
          border: none;
          .cell {
            padding: 0 10px;
          }
        }
        .el-table-child:last-child {
          border-bottom: none;
        }
        .el-table {
          .cell {
            padding-left: 10px;
          }
        }
      }
    }
    .labWrap {
      position: relative;
      line-height: 30px;
      display: inline-block;
      margin-right: 35px;
    }
    .lab {
      font-size: 12px;
      position: absolute;
      right: -48px;
      width: 48px;
      transform: scale(0.9, 0.9);
      font-weight: 400;
    }
    /deep/ .el-table-child {
      // border-bottom: 1px solid #ccc;
      margin: 0;
      /deep/ .el-table__row {
        
        .icon-charge {
          color: #009944;
        }
      }
    }
  }
</style>
