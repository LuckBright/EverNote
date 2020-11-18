<template>
  <el-dialog
    :visible.sync="dialogVisible"
    class="sortdiag"
    width="510px"
    height="698px"
    :close-on-click-modal="false"
  >
    <div slot="title" class="ml10">
      报表类别和报表名称设置<span class="small">（可拖拽调整）</span>
    </div>
    <div class="cnt">
      <sorttree ref="tree"></sorttree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveBatchSet" :loading="loading"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import sorttree from '@/bi/page/statistics/sorttree'
import urls from '@/bi/store/urls'
import { request } from '@/util/req'

export default {
  props: ['visible'],
  data () {
    return {
      obj: {},
      disabled: false,
      loading: false,
      valueList: [],
      reportList: []
    }
  },
  components: {
    sorttree
  },
  methods: {
    async saveBatchSet () {
      this.loading = true
      const data = this.$refs.tree.data
      this.setOrderMap(data)
      const r = await request(urls.batchUpdateValueSetItem, this.valueList)
      const n = await request(urls.reportBatchUpdate, this.reportList)
      if (r.head.errCode === 0 && n.head.errCode === 0) {
        this.$message({ type: 'success', message: '更新成功' })
      }
      this.loading = false
    },
    setOrderMap (data) {
      const valueIds = this.$refs.tree.valueIds
      data.map((item, index) => {
        const obj = {}
        obj.id = item.id
        obj.orderNumber = index
        if (valueIds.includes(item.id)) {
          this.valueList.push(obj)
        } else {
          this.reportList.push(obj)
        }
        if (item.children && item.children.length > 0) {
          this.setOrderMap(item.children)
        }
      })
    }
  },
  computed: {
    dialogVisible: {
      set (val) {
        this.$emit('update:visible', val)
      },
      get () {
        return this.visible
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sortdiag {
  /deep/ .el-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #eee;
    }
    .small {
      font-size: 14px;
      color: #2a2a2a;
    }
  }
}
</style>
