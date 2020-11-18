<template>
  <el-dialog
    title="停止医嘱提示"
    :visible.sync="visibleFlag"
    class="ui_dialog_02"
    width="1000px"
    @close="close"
    :close-on-click-modal="false"
  >
    <div class="main-wrap" v-if="visibleFlag">
      <advice-show-table
        ref="adviceShow"
        :visitType="3"
        :loading="loading"
        :showData="tableData"
        :rowClass="rowClass"
        :columns="columns"
        :contextList="contextList"
        :arraySpan="arraySpan"
        :noBorderSpan="noBorderSpan"
        :show-checkbox="true"
        @menu="getMenuList"
        @contextSelect="contextSelect"
        @selectionChange="selectionChange"
      ></advice-show-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type @click="close">取消</el-button>
      <el-button
        type="primary"
        @click="stopAdvice"
        :loading="stopLoding"
        :disabled="!selectData.length"
      >停止</el-button>
    </div>
  </el-dialog>
</template>

<script>
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import i18n from '@/assets/locals/index'
import recipeapi from '@/workspace/store/recipeapi'
import { objRemove, objFind } from '@/util/common'

export default {
  props: ['list', 'hospitalizedNumber', 'patientId'],
  data () {
    return {
      loading: false,
      tableData: [],
      rowClass: 'mgtContextRow',
      contextList: [
        { id: '1', name: '停止医嘱', disabled: false, methodName: 'printApply' },
      ],
      arraySpan: ['termType'],
      noBorderSpan: ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust', 'status'],
      selectData: [],
      visibleFlag: false,
      stopLoding: false,
      isDone: false // 是否停止过医嘱
    }
  },
  components: {
    adviceShowTable
  },
  created () {
    this.columns = this.getColumns()
    this.selectIds = []
  },
  methods: {
    // 停止医嘱
    stopAdvice () {
      this.stopLoding = true
      this.isDone = true
      let ids = this.selectIds.map(item => {
        return item.id
      })
      let params = {
        doctorAdviceIdList: ids,
        patientId: this.patientId,
        hospitalizedNumber: this.hospitalizedNumber
      }
      // params.forEach(item => {
      //   item.stopBy = this.$store.state.currentUser.userId
      // })
      recipeapi.stopInpatientDoctorAdvice(params).then(rs => {
        this.stopLoding = false
        if (!rs) {
          this.$messageTips(this, 'warning', '操作失败')
          return false
        }
        objRemove(this.tableData, (val) => {
          return objFind(this.selectIds, {id: val.id})
        })
        let len = this.tableData.length - 1
        this.selectIds = []
        this.$messageTips(this, 'success', '停止医嘱申请已发送成功')
        if (!this.tableData.length) {
          this.close()
          return
        }
        this.$set(this.tableData, len, this.tableData[len])
      })
    },
    handleSelectionChange (val) {
      this.selectIds = []
      if (val && val.length) {
        val.map(item => {
          if (item.adviceArr && item.adviceArr.length) {
            item.adviceArr.map(sitem => {
              this.selectIds.push(sitem.id)
            })
          }
        })
      }
    },
    open () {
      this.visibleFlag = true
    },
    close () {
      this.$emit('close', this.isDone)
      this.visibleFlag = false
      this.isDone = false
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        return [1, 2]
      } else if (columnIndex === 5) {
        return [0, 0]
      }
    },
    // 右键操作按钮列表触发事件回调
    getMenuList ({ index }) {
      // this.contextList.forEach((v) => {
      //   v.disabled = !this.getStatusShow(this.fuziData[this.tableData[index].mainGroupId], index, v.id)
      // })
    },
    // 右键操作按钮列表点击回调
    contextSelect ({ item, index }) {
      // this[item.methodName](this.fuziData[this.tableData[index].mainGroupId], index)
    },
    // checkbox 复选回调
    selectionChange (selection) {
      this.selectData = selection
      this.selectIds = []
      this.selectData.forEach(v => {
        this.selectIds.push({id: v.id})
      })
    },
    getColumns () {
      return [
        {
          prop: 'startTime',
          label: i18n.t('开始时间'),
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'termType',
          label: i18n.t('长/临'),
          showOverflowTooltip: true,
          minWidth: '5%',
          formatter: ({value}) => {
            return value === 0 ? '临时' : '长期'
          }
        },
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: i18n.t('类型'),
          minWidth: '6%',
          sortable: true,
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: i18n.t('名称'),
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: i18n.t('内容'),
          minWidth: '20%',
          undraggable: true,
          required: true
        },
        {
          prop: 'entrust',
          label: i18n.t('嘱托'),
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          slot: 'status',
          prop: 'status',
          label: i18n.t('状态'),
          showOverflowTooltip: true,
          minWidth: '6%'
        }
      ]
    }
  },
  watch: {
    list: {
      handler (val) {
        if (!val || !val.length) {
          this.tableData = []
          return
        }
        this.tableData = JSON.parse(JSON.stringify(val))
        this.$nextTick(() => {
          this.$refs.adviceShow && this.$refs.adviceShow.toggleAllSelection()
        })
      },
      deep: true,
      immediate: true
    }
  },
}
</script>
<style lang="scss" scoped>
.main-wrap {
  .el-table-child {
    /deep/.el-table__body {
      width: 100% !important;
    }
    /deep/ .el-table__row {
      td {
        border-bottom: 1px solid #ccc !important;
        &:first-child {
          .cell {
            padding-left: 0;
          }
        }
      }
      &:last-child {
        td {
          border-bottom: none !important;
        }
      }
    }
  }
}
</style>
