<!--  -->
<template>
  <el-dialog
    title="报表权限设置"
    :visible="visible"
    @update:visible="changeVisible"
    :close-on-click-modal="false"
  >
    <div v-loading="loading">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree
        v-if="!loading"
        :props="props"
        :data="data"
        show-checkbox
        node-key="hisReportCode"
        ref="tree"
        :default-expanded-keys="defaultKeys"
        :default-checked-keys="defaultKeys"
        :filter-node-method="filterNode"
      >
      </el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" :loading="loading"
        >保 存</el-button
      >
      <el-button @click="changeVisible(false)">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import urlMap from '@/systemset/urls'
import valueUrl from '@/util/urls'
import urls from '@/auth/store/urls'
import { request } from '@/util/req'
const { getReportIdListByRoleId, reportModify } = urls.report
export default {
  props: {
    visible: Boolean,
    role: Object
  },
  data () {
    return {
      url: urlMap.report.search,
      props: {
        label: 'name'
      },
      data: [],
      loading: false,
      filterText: '',
      roleId: this.role.roleId,
      defaultKeys: [],
      recordBottom: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },

  components: {},

  computed: {},

  async created () {
    this.getData()
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1 || data.parentName.indexOf(value) !== -1
    },
    confirm (val) {
      const keys = this.$refs.tree.getCheckedKeys(true).filter(item => { return !!item })
      this.reportModify(keys)
    },
    changeVisible (val) {
      this.$emit('update:visible', val)
    },
    async getData () {
      this.loading = true
      await this.getReportIdListByRoleId()
      await this.getParent()
      await this.getAllChildren()
      this.loading = false
    },
    async getAllChildren () {
      const res = await request(this.url, { pagesize: 10000, offset: 0 })
      this.recordBottom.map(parent => {
        res.data.resultList.map((child) => {
          const keyArr = child.hisSubModule.split(',')
          const index = keyArr.length - 1
          const key = keyArr[index]
          if (key === parent.code) {
            child.name = child.hisReportName
            child.parentName = parent.name + ',' + parent.parentName
            parent.children.push(child)
          }
        })
      })
    },
    async getReportIdListByRoleId () {
      const res = await request(getReportIdListByRoleId, { roleId: this.roleId })
      if (res && res.data && Array.isArray(res.data)) {
        this.defaultKeys = res.data.map(item => item.reportCode)
      }
    },
    async reportModify (reportCodeList) {
      this.loading = true
      const res = await request(reportModify, { roleId: this.roleId, reportCodeList })
      if (res && res.head && res.head.errCode === 0) {
        this.$message({ type: 'success', message: '保存成功' })
      } else {
        this.$message({ type: 'error', message: '保存失败' })
      }
      this.loading = false
      this.changeVisible(false)
    },
    async getParent () {
      const res = await request(valueUrl.valueSet.getValueSetItemByCodeForWeb, { pagesize: 10000, offset: 0, setCode: 'THC_SYS_REPORT_TYPE' })
      this.data = res.data.map(item => {
        item.children = item.valueSetItems || []
        item.parentName = ''
        this.formatParent(item, item.children)
        return item
      })
    },
    formatParent (parent, children) {
      if (Array.isArray(children) && children.length) {
        children.map((item, index) => {
          item.children = item.valueSetItems || []
          item.parentId = parent.id
          item.parentName = parent.name
          item.secondChild = true
          this.formatParent(item, item.children)
        })
      } else {
        this.recordBottom.push(parent)
        return children
      }
    },
  }
}

</script>
<style lang='scss' scoped>
</style>
