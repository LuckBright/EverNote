<!--  -->
<template>
  <div class="catalog" v-loading="loading">
    <div class="header">
      <span class="text">序号</span>
      <span class="text">名称</span>
    </div>
    <div class="content">
      <el-tree
        v-if="!loading"
        :props="props"
        :data="data"
        node-key="hisReportCode"
        ref="tree"
        draggable
        default-expand-all
        :allow-drop="allowDrop"
        @node-drop="dragEnd"
      >
        <span
          :data-id="data.id"
          :class="[
            'custom-tree-node',
            {
              'parent-node': !data.parentName,
            },
          ]"
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
  </div>
</template>

<script>
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
      valueIds: []
    }
  },
  watch: {
    '$route.params.code' (val) {
      this.$emit('change-code', val)
    },
  },
  components: {
    searchbox
  },

  computed: {},

  created () {
    this.init()
  },

  methods: {
    allowDrop (draggingNode, dropNode, type) {
      const draggingCode = draggingNode.data.hisSubModule
      const dropCode = dropNode.data.hisSubModule
      return draggingCode === dropCode && type !== 'inner'
    },
    async init () {
      this.loading = true
      await this.getParent()
      await this.getAllChildren()
      this.loading = false
    },
    async getParent () {
      this.allData = {}
      const res = await request(valueUrl.valueSet.getValueSetItemByCodeForWeb, { pagesize: 10000, offset: 0, setCode: 'THC_SYS_REPORT_TYPE' })
      this.data = res.data.map((item, index) => {
        item.children = item.valueSetItems || []
        item.parentId = ''
        item.parentName = ''
        item.hisSubModule = 'parent'
        this.allData[item.id] = item
        this.valueIds.push(item.id)
        this.formatParent(item, item.children) // 记录报表值集的最低级数组
        return item
      })
    },
    formatParent (parent, children) {
      if (Array.isArray(children) && children.length) {
        children.map((item, index) => {
          item.children = item.valueSetItems || []
          item.parentId = parent.id
          item.parentName = parent.name
          item.hisSubModule = parent.code
          item.secondChild = true
          this.valueIds.push(item.id)
          this.allData[item.id] = item
          this.formatParent(item, item.children)
        })
      } else {
        this.recordBottom.push(parent)
        return children
      }
    },
    async getAllChildren () {
      const res = await request(urlMap.report.search, { pagesize: 10000, offset: 0 })
      this.recordBottom.map(parent => {
        res.data.resultList.map((child, index) => {
          const keyArr = child.hisSubModule.split(',')
          const length = keyArr.length - 1
          const key = keyArr[length]
          if (key === parent.code) {
            child.name = child.hisReportName
            parent.children.push(child)
          }
          this.allData[child.id] = child
        })
      })
      const data = this.data.filter(item => {
        if (!item.children.length) {
          return false
        } else {
          return this.hadChild(item)
        }
      })
      this.data = this.sortData(data)
      this.setSerialNumber()
    },
    setSerialNumber (parent) {
      this.data.map((parent, index) => {
        parent.serialNumber = index + 1 + ''
        this.formatSerialNumber(parent)
      })
      const vm = this
      setTimeout(() => {
        const els = document.querySelectorAll('.el-tree-node__content')
        const arr = [...els]
        arr.map((el, index) => {
          const id = el.children[1].getAttribute('data-id')
          console.log('id :>> ', id)
          const serialNumber = vm.allData[id].serialNumber
          const numberTime = serialNumber.split('.').length
          el.setAttribute('data-index', serialNumber)
          el.style.setProperty('--left', `-${(numberTime - 1) * 18}px`)
          el.style.setProperty('--right', `${(numberTime - 1) * 18}px`)
        })
      }, 1000)
    },
    dragEnd () {
      this.setSerialNumber()
    },
    formatSerialNumber (parent) {
      parent.children.map((item, index) => {
        item.serialNumber = `${parent.serialNumber}.${index + 1}`
        if (item.children && item.children.length) {
          this.formatSerialNumber(item)
        }
      })
    },
    sortData (data) {
      return data.sort((a, b) => {
        if (a && a.children) {
          a.children = this.sortData(a.children)
        }
        if (b && b.children) {
          b.children = this.sortData(b.children)
        }
        return a.orderNumber - b.orderNumber
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
  width: 490px;
  margin: 0 auto;
  box-sizing: border-box;
  .header {
    box-sizing: border-box;
    height: 22px;
    border-bottom: 1px solid #eeeeee;
    .text {
      font-size: 14px;
      font-weight: bold;
      margin-right: 80px;
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
        border-bottom: 1px solid #eeeeee;
        &::before {
          content: attr(data-index);
          display: inline-block;
          margin-left: var(--left);
          margin-right: var(--right);
          width: 100px;
          bottom: 0px;
          right: 0px;
        }
      }
      .parent-node {
        width: 90%;
        font-size: 15px;
        color: #000000;
        position: relative;
        padding-bottom: 10px;
      }
    }
  }
  .content {
    height: 400px;
    overflow: auto;
  }
}
</style>
