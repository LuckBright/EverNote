<template>
  <div id="service-select">
    <el-dialog title="物资分类" :visible.sync="dialog" class="ui_dialog_02" :close-on-click-modal="false">
      <el-table
        :data="toRelatedData"
        ref="multipleTable"
        height="320"
        @selection-change="handleSelectionChange"
        row-key="id"
        border>
        <el-table-column
          type="selection"
          align="center"
          :selectable="checkSelectable"
          reserve-selection
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="物资分类">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogClose"><i class="iconfont icon-quxiao"></i>取消</el-button>
        <el-button type="primary" @click="saveSelectVal"><i class="iconfont icon-tijiao"></i>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import relapi from '../store/departmentserviceapi'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  export default {
    props: ['catetoriesIds'],
    data () {
      return {
        toRelatedData: [],
        selectedVal: [],
        dialog: false,
        loading: false,
        flag: ''
      }
    },
    created () {
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
        this.toRelatedData = res
        let typeoptions = []
        res.forEach(item => {
          if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
            typeoptions.push(item)
          }
        })
        this.toRelatedData = typeoptions
      })
    },
    methods: {
      onDialogClose () {
        this.dialog = false
      },
      onDialogOpen (flag, initSelect) {
        console.log(initSelect, '原有的项目')
        this.dialog = true
        this.flag = flag
        setTimeout(() => {
          if (!this.$refs.multipleTable) {
            return false
          }
          this.$refs.multipleTable.clearSelection()
          if (initSelect && initSelect.length > 0) {
            initSelect.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row, true)
            })
          }
        }, 0)
      },
      handleSelectionChange (selects) {
        this.selectedVal = []
        // this.catetoriesIds.forEach(item => {
        //   this.selectedVal.push(Object.assign({}, item))
        // })
        selects.forEach(item => {
          this.selectedVal.push(item)
        })
      },
      saveSelectVal () {
        this.$emit('selectChange', this.selectedVal)
        this.onDialogClose()
      },
      checkSelectable (row) {
        return !row.checked
      },
      query (refresh) {
        this.loading = true
        this.toRelatedData = []
        this.loading = true
        sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
          this.toRelatedData = res
          let typeoptions = []
          res.forEach(item => {
            if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
              typeoptions.push(item)
            }
          })
          this.toRelatedData = typeoptions
          this.toRelatedData.forEach((item, index) => {
            this.catetoriesIds.forEach(item1 => {
              if (item.id === item1.rangeId) {
                this.toRelatedData.splice(index, 1, item1)
              }
            })
          })
        })
      }
    },
    watch: {
      dialog (newVal) {
        if (newVal) {
          this.query()
        }
      }
    }
  }
</script>
<style scoped>
#service-select .el-dialog__body{padding-top:0; background: #fff;}
#service-select .el-form .el-form-item{margin-right: 10px;}
</style>
