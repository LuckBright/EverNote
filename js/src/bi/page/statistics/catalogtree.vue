<!--  -->
<template>
  <div class="catalog" :class="{ w0: !showSelect }">
    <div class="head">
      <searchbox :options="options" @change="handleChange"></searchbox>
    </div>
    <div class="content">
      <el-tree
        v-if="!loading"
        @node-click="nodeClick"
        :props="props"
        :data="data"
        node-key="hisReportCode"
        ref="tree"
        :default-expanded-keys="defaultKeys"
      >
        <span
          :class="[
            'custom-tree-node',
            {
              'parent-node': !data.parentName,
              'line-tree-node': setTreeLine(data),
              current: data.hisReportCode === reportCode,
            },
          ]"
          :style="{ '--left': 12 + 18 * (node.level - 1) + 'px' }"
          slot-scope="{ node, data }"
        >
          <span
            ><i
              v-if="!data.parentName || data.secondChild"
              :class="[
                'iconfont',
                {
                  'icon-nav-shouru-BI': !data.parentName,
                  b: !data.parentName,
                  'icon-zhishidian': data.secondChild,
                  second: data.secondChild,
                },
              ]"
            ></i
            >{{ node.label }}</span
          >
        </span>
      </el-tree>
    </div>
    <div
      class="fixed-btn"
      @click="showSelect = !showSelect"
      :class="{ r0: !showSelect }"
    >
      <i class="iconfont icon-PathCopy f12-icon" v-show="showSelect"></i>
      <i class="iconfont icon-next f12-icon" v-show="!showSelect"></i>
    </div>
  </div>
</template>

<script>
import urls from '@/auth/store/urls'
import urlMap from '@/systemset/urls'
import valueUrl from '@/util/urls'
import { request } from '@/util/req'
import searchbox from '@/bi/page/statistics/searchbox'
export default {
  props: {},
  data () {
    return {
      props: {
        label: 'name',
        children: 'children'
      },
      data: [],
      recordBottom: [], // 记录报表值集的最低级数组
      loading: false,
      options: [],
      defaultKeys: [],
      showSelect: true
    }
  },
  watch: {
    '$route.query.code' (val) {
      this.$emit('change-code', val)
    },
    showSelect (val) {
      this.$emit('change-size', val)
    }
  },
  components: {
    searchbox
  },

  computed: {
    reportCode () {
      return this.$route && this.$route.query.code
    },
    showCodeList () {
      return this.$route && this.$route.meta && this.$route.meta.showCodeList
    }
  },

  created () {
    this.init()
  },

  methods: {
    handleChange (val) {
      const data = this.data // 收起其他展开的节点
      this.data = []
      this.$router.push({ name: 'bicatalog', query: { code: val.hisReportCode } })
      this.defaultKeys = [val.hisReportCode]
      this.$nextTick(() => {
        this.data = data
      })
    },
    nodeClick (data) {
      if (!data.children) {
        this.$router.push({ name: 'bicatalog', query: { code: data.hisReportCode } })
      }
    },
    setTreeLine (data) {
      return this.checkShowLine(this.data, data.id)
    },
    checkShowLine (arr, id) {
      let flag = false
      arr.map((item, index) => {
        if (this.parentIds.includes(id)) return false
        if (flag) return true
        if (item.id === id) {
          if (arr[index + 1] && arr[index + 1].children && arr[index + 1].children.length) {
            flag = true
          }
        } else {
          if (item.children && item.children.length) {
            flag = this.checkShowLine(item.children, id)
          }
        }
      })
      return flag
    },
    async init () {
      if (this.reportCode) {
        this.defaultKeys.push(this.reportCode)
      }
      this.$emit('update:load', true)
      await this.getAuth()
      await this.getParent()
      await this.getAllChildren()
      this.$emit('update:load', false)
    },
    async getAuth () {
      const res = await request(urls.report.getReportInfo)
      this.authIds = []
      if (res && res.data && Array.isArray(res.data)) {
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i]
          if (item && item.id) {
            this.authIds.push(item.id)
          }
        }
      }
    },
    async getParent () {
      this.parentIds = [] // 记录不需要显示line的节点
      const res = await request(valueUrl.valueSet.getValueSetItemByCodeForWeb, { pagesize: 10000, offset: 0, setCode: 'THC_SYS_REPORT_TYPE' })
      this.data = res.data.filter(item => {
        item.children = item.valueSetItems || []
        item.parentId = ''
        item.parentName = ''
        this.parentIds.push(item.id) // 记录不需要显示line的节点
        if (this.showCodeList && this.showCodeList.length) {
          if (this.showCodeList.includes(item.code)) {
            this.formatParent(item, item.children)
            return true
          }
          return false
        } else {
          this.formatParent(item, item.children) // 记录报表值集的最低级数组
        }
        return true
      })
    },
    sortData (data) {
      if (data.length === 1 && data[0].children && data[0].children.length > 1) {
        data[0].children.sort((a, b) => {
          if (a && a.children) {
            a.children = this.sortData(a.children)
          }
          if (b && b.children) {
            b.children = this.sortData(b.children)
          }
          return a.orderNumber - b.orderNumber
        })
        return data
      }
      if (data.length > 1) {
        return data.sort((a, b) => {
          if (a && a.children) {
            a.children = this.sortData(a.children)
          }
          if (b && b.children) {
            b.children = this.sortData(b.children)
          }
          return a.orderNumber - b.orderNumber
        })
      }
      return data
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
    async getAllChildren () {
      const res = await request(urlMap.report.search, { pagesize: 10000, offset: 0 })
      let hisReportCode = ''
      this.recordBottom.map(parent => {
        res.data.resultList.map((child) => {
          if (!this.authIds.includes(child.id)) { // 过滤掉没有权限的
            return
          }
          const keyArr = child.hisSubModule.split(',')
          const index = keyArr.length - 1
          const key = keyArr[index]
          if (key === parent.code) {
            if (!hisReportCode) { // 记录没有reportCode时打开的code
              hisReportCode = child.hisReportCode
            }
            child.name = child.hisReportName
            child.parentName = parent.name + ',' + parent.parentName // 搜索节点用
            parent.children.push(child)
          }
        })
      })
      const data = this.data.filter(item => { // 过滤没有报表的一级节点
        if (!item.children.length) {
          return false
        } else {
          return this.hadChild(item)
        }
      })
      if (!this.reportCode) {
        this.$router.push({ name: 'bicatalog', query: { code: hisReportCode } })
        this.defaultKeys.push(this.reportCode)
      }
      this.data = this.sortData(data)
      // console.log('this.data :>> ', this.data)
      this.formatOptions(this.data)
    },
    formatOptions (arr) {
      arr.map(item => {
        if (!item.children) {
          this.options.push(item)
        }
        if (item.children && item.children.length) {
          this.formatOptions(item.children)
        }
      })
    },
    hadChild (item) {
      item.children = item.children.filter(n => {
        if (!n.children) {
          return true
        } else {
          return !!n.children.length
        }
      })
      return !!item.children.length
    }
  }
}
</script>
<style lang='scss' scoped>
.catalog {
  display: flex;
  flex-direction: column;
  width: 300px;
  border-radius: 0 4px 4px 0;
  height: calc(100% - 60px);
  box-sizing: border-box;
  position: fixed;
  transition: all 0.3s;
  &.w0 {
    width: 0px;
    .head {
      display: none;
    }
    .content {
      display: none;
    }
  }
  .fixed-btn {
    width: 16px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    opacity: 0.8;
    background: #2faa2f;
    border-radius: 0 5px 5px 0;
    position: absolute;
    top: 88px;
    right: -16px;
    cursor: pointer;
    transition: all 0.3s;
    &.r0 {
      right: -5px;
    }
    .f12-icon {
      font-size: 12px;
    }
  }
  /deep/.el-tree {
    .el-tree-node {
      position: relative;
      .custom-tree-node {
        width: calc(100% - 5px);
        margin-right: 10px;
        padding-left: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 8px 5px;
        user-select: none;
      }
      .el-tree-node__content > .el-tree-node__expand-icon {
        padding: 4px;
      }
      .el-tree-node__content {
        background: transparent;
      }
      .el-tree-node__expand-icon {
        color: #7f838e;
        font-size: 16px;
      }
      .el-tree-node__expand-icon.is-leaf {
        color: transparent;
        font-size: 16px;
      }
      .b {
        color: #1c7bef;
        margin-right: 8px;
      }
      .current {
        background: #e9f2fb;
        border-radius: 2px;
        color: #1c7bef;
      }
      .second {
        margin-right: 5px;
        margin-left: 0px;
        font-size: 14px;
        color: #999;
      }
      &:hover > .el-tree-node__content {
        background: transparent;
      }
      .el-tree-node__content:hover > .custom-tree-node {
        background: #1c7bef;
        border-radius: 2px;
        color: #fff;
        .b {
          color: white;
        }
      }
      &.is-current > .el-tree-node__content {
        background: transparent;
      }
      .el-tree-node__content {
        padding: 5px 0px;
      }
      .parent-node {
        width: 90%;
        font-size: 15px;
        color: #000000;
        position: relative;
        padding-bottom: 10px;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          border-bottom: 1px solid #eeeeee;
          bottom: 0px;
          right: 0px;
        }
      }
      .line-tree-node {
        &:after {
          content: '';
          position: absolute;
          width: 1px;
          top: 26px;
          bottom: -6px;
          left: var(--left);
          background: #d8d8d8;
        }
      }
      &:not(.is-expanded) > .el-tree-node__content {
        .line-tree-node {
          &:after {
            width: 0px;
            transition: all 0.5s;
          }
        }
      }
    }
  }
  .head {
    height: 70px;
    min-height: 70px;
    background: #f9fcff;
    border-bottom: 1px solid #dfdfdf;
    /deep/ .el-input__inner {
      height: 32px;
      line-height: 32px;
      padding-right: 20px;
      padding-left: 6px;
    }
    /deep/ .el-input__icon {
      width: 25px;
      line-height: 32px;
    }
    .filter {
      border-radius: 4px;
      height: 33px;
      width: 280px;
      box-sizing: border-box;
      margin-left: 10px;
      margin-top: 10px;
    }
  }
  .content {
    flex: 1;
    background: #ffffff;
    padding: 10px 0px;
    padding-left: 5px;
    overflow: auto;
  }
}
</style>
