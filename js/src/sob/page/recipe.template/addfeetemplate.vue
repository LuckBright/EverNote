<template>
  <div class="template-detail">
    <ever-bread-crumb ref="breadCrumb" show-edit-fnt="false" :have-return="true">
      <span class="tpml-back" slot="title" @click.stop="$refs.breadCrumb.prevBack">{{obj.id !== '-1' ? '编辑模版' : '新建模版'}}</span>
    </ever-bread-crumb>
    <div id="addtemplate" class="add-template">
      <div class="layout_inner">
        <ever-form2
          class="ever_form_spe label_bold"
          ref="tplForm"
          :nosubmit="true"
          :rules="rules"
          :schema="schema"
          v-model="obj"
          labelWidth="80px"
        ></ever-form2>
      </div>
      <div class="layout_inner template-table">
        <ever-table
          border
          id="fee-wait-table"
          ref="feeTable"
          :loading="false"
          :columns="columns"
          :data="tableListData"
          :is-pagination="false"
          :is-drag-table="true"
          :is-record-url-params="false"
          :not-select-checkbox="true"
        >
          <template slot="count" slot-scope="scope">
            <span>{{scope.row.count + scope.row.countUnitName}}</span>
          </template>
          <template slot="price" slot-scope="scope">
            <span>¥{{(scope.row.price || 0).toFixed(2)}}</span>
          </template>
          <template slot="total" slot-scope="scope">
            <span>¥{{(scope.row.count * scope.row.price).toFixed(2)}}</span>
          </template>
          <template slot="finType" slot-scope="scope">
            <sys-value type="THC_RCM_FIN_TYPE" :code="scope.row.finType && scope.row.feesJson.finType"></sys-value>
          </template>
          <template slot="operation" slot-scope="scope">
            <el-button type="text" class="editor-btn" @click="editor(scope)">编辑</el-button>
            <el-button type="text" class="delet-btn" @click="del(scope)">删除</el-button>
          </template>
        </ever-table>
        <el-button type="primary" @click="saveTemplate" :disabled="!tableListData.length">保存</el-button>
      </div>
      <div class="layout_inner footarea">
        <prescription
          ref="pres"
          :key="randomKey"
          :is-add-tpl="true"
          :order-source="1"
          :handle-disabled="false"
          :base-info="baseInfo"
          :search-type="2"
          :sub-order-source="13"
          :filter-advice-type="filterAdviceType"
          @submit="submitOrders"
        ></prescription>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/sob/store/tmpl.api.js'
import form from '@/util/form'
import prescription from './fee.tpl.orders.vue'
import i18n from '@/assets/locals/index'
import feeOrderapi from '@/inpatient/components/fee.orders/api'

// 工作站和计费规则code对应关系
const feeMap = {
  tech: 'YJ-001', // 医技
  csa: 'SMGL-001', // 手麻
  inpatient: 'ZYHS-001' // 住院
}
let schema = [
  {
    name: 'templateName',
    label: '模版名称',
    span: 6,
    props: {
      placeholder: '请输入模版名称',
      maxlength: 20
    }
  }
]
export default {
  mixins: [form],
  components: {prescription},
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.id = ''
    obj.content = ''
    return {
      api,
      obj,
      userId: this.$store.state.currentUser.userId,
      baseInfo: this.$route.query,
      waitSendData: [],
      callbackData: '',
      subDisabled: false,
      showDpt: false,
      rules: {
        templateName: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      tableListData: [],
      randomKey: Math.random(),
      filterAdviceType: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // this.filterAdviceType = '10000,10001,10002,10003,10004,10005,10006,10009,175801,2124,2125,2126,2466,2467,341,503,504,553,799,800,800001,800002,800003,800004,800005,800006,800007,801,801001,801002,801003,802,80201,80202,832,867'
      this.obj.id = this.$route.params.id
      this.baseInfo.userId = this.userId
      this.space = this.$route.matched[0].meta.space
      this.getFeeConfig(feeMap[this.space])
      this.setEditData()
      this.schema = schema
      // 列配置
      this.columns = this.getColumns()
    },
    refresh () {
      this.randomKey = Math.random()
    },
    // 编辑等待区域的医嘱
    editFeeOrder (items) {
      this.callbackData = items
    },
    submitOrders (data, type, done, fail) {
      if (!data) {
        done && done()
        return
      }
      this.tableListData.push(data)
      done && done()
    },
    setEditData () {
      if (this.obj.id === '-1' || !this.obj.id) {
        return false
      }
      api.getById(this.obj.id).then(rs => {
        if (!rs) {
          this.tableListData = []
          return
        }
        Object.assign(this.obj, rs)
        let data = JSON.parse(rs.content)
        this.tableListData = data
      })
    },
    saveTemplate () {
      if (!this.tableListData.length) {
        return
      }
      this.subDisabled = true
      this.$refs.tplForm.$refs.form.validate(v => {
        if (!v) {
          this.subDisabled = false
          return false
        }
        let id = this.obj.id
        let params = {
          content: JSON.stringify(this.tableListData),
          templateName: this.obj.templateName,
          templateSource: 2, // templateSource - 1 医嘱模板、2 补费模板
          id
        }
        params = Object.assign({}, params, this.$route.query)
        api.createOrUpdate(params).then(rs => {
          if (rs.head.errCode) {
            this.subDisabled = false
            return false
          }
          this.$messageTips(this, 'success', '模版保存成功', '成功')
          this.$router.push({ name: 'feeTemplateList', query: {type: this.$route.query.templateType} })
        })
      })
    },
    del (scope) {
      this.tableListData.splice(scope.$index, 1)
      this.refresh()
    },
    editor (scope) {
      this.$bus.$emit('edit:feeorder', scope.row, () => {
        this.tableListData.splice(scope.$index, 1)
        // this.refresh()
      })
    },
    // 获取补费配置
    async getFeeConfig (workspace) {
      let res = await feeOrderapi.getChargeConfig({sceneCode: workspace})
      if (res) {
        this.filterAdviceType = res[workspace] || ''
      } else {
        this.filterAdviceType = ''
      }
    },
    getColumns () {
      return [
        {
          prop: 'serviceName',
          label: i18n.t('收费项目'),
          minWidth: '20%',
          showOverflowTooltip: true
        },
        {
          prop: 'spec',
          label: i18n.t('规格'),
          minWidth: '7%',
          showOverflowTooltip: true
        },
        {
          slot: 'count',
          prop: 'count',
          label: i18n.t('数量'),
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          slot: 'price',
          prop: 'price',
          label: i18n.t('单价'),
          showOverflowTooltip: true,
          minWidth: '10%',
        },
        {
          slot: 'finType',
          prop: 'finType',
          label: i18n.t('业务分类'),
          showOverflowTooltip: true,
          minWidth: '10%',
        },
        {
          slot: 'operation',
          prop: 'operation',
          label: i18n.t('操作'),
          showOverflowTooltip: true,
          minWidth: '10%',
          undraggable: true
        }
      ]
    }
  },
  watch: {
    '$store.state.currentUser': {
      handler (val) {
        this.userId = val.userId
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.template-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tpml-back {
  cursor: pointer;
}
.add-template {
  flex: 1;
  display: flex;
  flex-direction: column;
  .layout_inner {
    background-color: transparent;
  }
  .template-table {
    flex: 1;
    background-color: none;
  }
  .footarea {
    background-color: none;
    position: relative;
    padding: 10px;
    margin-top: 5px;
    border-top: 1px solid #dadce0;
  }
  .execute-provider {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /deep/ .el-table {
    tr {
      .noBottomBorder {
        border-bottom: none;
      }
      .pad-rt-30 {
        .cell {
          padding-right: 30px;
        }
      }
      &:hover {
        td {
          background: transparent;
        }
      }
      .topCell {
        .cell {
          margin-bottom: -4px;
        }
      }
      .middleCell {
        .cell {
          margin-top: -4px;
          margin-bottom: -4px;
        }
      }
      .bottomCell {
        .cell {
          margin-top: -4px;
        }
      }
      .cell {
        .namesWrap {
          display: flex;
          .leftIcons {
            width: 6px;
            margin-right: 8px;
            position: relative;
            .top {
              border-top: 3px solid;
              border-left: 3px solid;
              width: 100%;
              position: absolute;
              top: 8px;
              bottom: 0;
            }
            .middle {
              border-left: 3px solid;
              width: 100%;
              position: absolute;
              top: 0;
              bottom: 0;
            }
            .bottom {
              border-bottom: 3px solid;
              border-left: 3px solid;
              width: 100%;
              height: 10px;
              position: absolute;
              top: 0;
            }
          }
          .cellMain {
            flex: 1;
            .labWrap {
              position: relative;
              margin: 5px 40px 5px 0;
              line-height: 1.5;
              word-wrap: break-word;
              display: inline-block;
              .lab {
                font-size: 12px;
                position: absolute;
                right: -48px;
                width: 48px;
                transform: scale(0.9, 0.9);
              }
            }
          }
        }
      }
    }
    .selectbg {
      background: #FEF5BE;
      &:hover {
        background: #FEF5BE !important;
      }
    }
    .iconfont {
      color: #999;
    }
    .icon-charge {
      color: #009944;
    }
    .iconYouji {
      color: #FF4F00;
      position: absolute;
      top: 1px;
      right: 0;
      font-size: 24px;
    }
  }
  .noRelateDpt {
    margin: 0;
    color: #ee4433;
  }
  .editor-btn {
    color: #409eff
  }
  .delet-btn {
    color: #f56c6c
  }
}

</style>

