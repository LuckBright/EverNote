<template>
  <!-- 汇总弹框 -->
  <el-dialog :visible.sync="miniDialog" custom-class="ui_dialog_01" center>
    <div class="dialog_box">
      <div v-for="(item, index) in getList" :key="index">
        <div v-if="item.data.length">
          <h3>{{item.title}}</h3>
          <el-table
            :data="item.data"
            :max-height="200"
            border>
            <el-table-column prop="materialName" label="物资名称">
              <template slot-scope="{row:{materialName}}">
                {{materialName || tableDefaultCellValue}}
              </template>
            </el-table-column>
            <el-table-column prop="spec" label="规格" width="100">
              <template slot-scope="{row:{spec}}">
                {{spec || tableDefaultCellValue}}
              </template>
            </el-table-column>
            <el-table-column prop="num" label="数量" width="100">
              <template slot-scope="{row:{num, packagUnitName}}">
                {{num ? `${num}${packagUnitName}` : tableDefaultCellValue }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="miniDialog = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    summartList: {
      type: Array,
      default: () => []
    },
    showSummaryBtn: Boolean
  },
  computed: {
    /** 根据状态进行退药数据分组
     * examineFlag: 0 待审核数据
     * status: 9 待退库数据
     * status: 10 已退库数据
    */
    successList () {
      let toAudit = []
      let toWithdrawing = []
      let alreadyWithdrawing = []
      this.summartList.length && this.summartList.forEach(item => {
        const task = item.taskItemList ? item.taskItemList[0] : item
        const { examineFlag, status } = task
        if (examineFlag === 0) {
          toAudit.push(task)
        } else if (status === 20 && examineFlag !== 1) {
          toWithdrawing.push(task)
        } else if (status === 21 && examineFlag !== 1) {
          alreadyWithdrawing.push(task)
        }
      })
      return [
        { title: '待审核', data: toAudit },
        { title: '待退库', data: toWithdrawing },
        { title: '已退库', data: alreadyWithdrawing }
      ]
    },
    // 针对各分组数据进行汇总去重
    getList () {
      return this.successList.map(key => {
        if (key.data.length) key['data'] = this.setList(key.data)
        return key
      })
    },
  },
  watch: {
    // 汇总无数据时置灰按钮
    successList: {
      handler (v) {
        let show = Object.keys(v).every(key => !v[key].data.length)
        this.$emit('update:showSummaryBtn', show)
      },
      deep: true
    }
  },
  methods: {
    setList (arr) {
      return arr.reduce((pre, cur) => {
        cur = Object.assign({}, cur)
        const { localMaterialId, num } = cur
        let find

        if ((find = pre.find(item => item.localMaterialId === localMaterialId))) {
          find.num += num
          return [...pre]
        } else {
          return pre.concat(cur)
        }
      }, [])
    },
    open () {
      this.miniDialog = true
    }
  },
  data () {
    return {
      miniDialog: false,
      list: [
        { title: '待审核', data: [], key: '0' },
        { title: '待退库', data: [], key: '1' },
        { title: '已退库', data: [], key: '2' }
      ]
    }
  },
}

</script>
<style scoped lang="less">
.dialog_box {
  padding: 10px 20px;
  min-height:160px;
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
}
</style>
