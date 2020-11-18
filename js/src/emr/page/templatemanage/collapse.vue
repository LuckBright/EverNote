<template>
    <div class="collapse_w" :class="{'dpt_collapse':businessType===3}">
        <el-collapse v-model="activeNames">
          <el-collapse-item :name="item.id" v-for='item in collapse' :key='item.id'>
            <template slot="title">
              <i class="header-icon iconfont icon-domn"></i>
              <i class="title-icon iconfont" :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
              <el-tree
                :ref="'tree' + item.id"
                :data="treeData[item.id]"
                :props="defaultProps"
                node-key="id"
                @node-contextmenu="getNode"
                @node-click="handleNodeClick"
                default-expand-all
                highlight-current	>
                  <span
                    class="custom-tree-node"
                    slot-scope="{node, data}"
                    :class="{'line-tree-node': setTreeLine(data, item.id), 'default_color': data.categoryDepts && data.categoryDepts.length}"
                    :style="{'--left': 15 + 18 * (node.level - 1) + 'px'}">
                    <template v-if="data.isTemplate">
                      <el-tooltip  placement="left" effect="light" v-if="data.categoryDepts && data.categoryDepts.length">
                        <span slot="content">默认模板</span>
                        <i class="icon-neirong" :class="{'icon-review': Number(data.auditStatus) === 2 && String(businessType) !== '2'}"></i>
                      </el-tooltip>
                      <i class="icon-neirong" :class="{'icon-review': Number(data.auditStatus) === 2 && String(businessType) !== '2'}" v-else></i>
                    </template>
                    <template v-else>
                      <i class="icon-wenjian"></i>
                    </template>
                    <span :title="node.label && node.label.length > 10 ? node.label : ''">{{ node.label }}</span>
                  </span>
              </el-tree>
          </el-collapse-item>
        </el-collapse>
        <contextmenu
          :businessType="businessType"
          :class-name="className"
          :menu="menuList"
          @select="handleOperate"></contextmenu>
    </div>
</template>
<script>
import contextmenu from '@/emr/components/tree.contextmenu'
import confirm from '@/util/confirm'
import update from '@/emr/mixins/update.js'// vuex存储数据
let menuList = [
  {
    name: '新建',
    id: 'create',
    disabled: false,
    operate: 'create',
    visible: true
  },
  {
    name: '刷新',
    id: 'refresh',
    disabled: false,
    border: true,
    operate: 'refresh',
    visible: true
  },
  {
    name: '编辑',
    id: 'edit',
    disabled: false,
    border: false,
    operate: 'edit',
    visible: true
  },
  {
    name: '审核',
    id: 'review',
    disabled: false,
    border: false,
    operate: 'review',
    visible: true
  },
  {
    name: '撤销审核',
    id: 'cancelR',
    disabled: false,
    border: false,
    operate: 'cancelR',
    visible: false
  },
  {
    name: '删除',
    id: 'delete',
    disabled: false,
    border: true,
    operate: 'delete',
    visible: true
  },
  {
    name: '上移',
    id: 'up',
    disabled: false,
    border: false,
    operate: 'up',
    visible: true
  },
  {
    name: '下移',
    id: 'down',
    disabled: false,
    border: false,
    operate: 'down',
    visible: true
  },
]
export default {
  name: 'collapse',
  components: {
    contextmenu
  },
  mixins: [update],
  props: {
    collapse: Array,
    businessType: [String, Number], // 模版类型
    treeData: {// 完整的树
      type: Object,
      default () {
        return {}
      }
    },
    showTpl: {
      type: Boolean,
      default: false
    },
    currentLeaf: { // 当前选中的树节点
      type: [Object, String],
      default () {
        return {}
      }
    },
    reviewAble: {  // 是否有审核权限
      type: Boolean
    }
  },
  watch: {
    'businessType': {
      handler (val) {
        this.activeNames = []
        // 个人模板  不显示审核
        if (String(val) === '2') {
          this.menuList.map((item, index) => {
            if (item.id === 'review' || item.id === 'cancelR') {
              this.$set(item, 'visible', false)
            }
          })
        } else {
          this.menuList.map((item, index) => {
            if (item.id === 'review') {
              this.$set(item, 'visible', true)
            }
          })
        }
      }
    },
    'currentLeaf': {
      handler (val) {
        if (val && val.collapseId) {
          // 打开collapse 高亮tree节点
          this.activeNames = [val.collapseId]
          this.$refs['tree' + val.collapseId][0].setCurrentKey(val)
          this.handleNodeClick(val)
          // 清空其他树上上次选择的节点
          Object.keys(this.$refs).forEach(collapse => {
            if (collapse !== 'tree' + val.collapseId) {
              this.$refs[collapse][0].setCurrentKey(null)
            }
          })
          // 滑动到tree高亮节点位置
          this.$nextTick(() => {
            setTimeout(() => {
              let node = document.querySelector('.el-tree-node.is-current')
              let offset = this.getOffset(node, 0)
              let collapseH = document.querySelector('.collapse_wrap').clientHeight
              offset = offset - parseInt(collapseH / 2) - 50
              document.querySelector('.collapse_wrap').scrollTo(0, offset)
            }, 350)
          })
        }
      }
    }
  },
  data () {
    return {
      parent: null,
      tpl_icon: '#icon-bingli-muban1', // 模版图标
      type_icon: '#icon-bingli-leixing', // 病历类型图标
      className: 'el-tree-node__content',
      curNode: {},
      menuList,
      activeNames: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      }
    }
  },
  created () {
    this.parent = this.getParent(this.$parent)
  },
  methods: {
    getOffset (node, n) {
      if (!node.className) {
        return n
      } else {
        n += node.offsetTop
        return this.getOffset(node.offsetParent, n)
      }
    },
    setTreeLine (data, id) {
      return this.checkEcho(this.treeData[id], data.id)
    },
    checkEcho (data, id) {
      let flag = false
      data.forEach((item, index) => {
        if (flag) return
        if (item.id === id) {
          if (index !== data.length - 1) {
            if (item.nodes && item.nodes.length && data[index + 1].nodes && data[index + 1].nodes.length) {
              flag = true
            }
          }
        } else {
          if (item.nodes && item.nodes.length) {
            flag = this.checkEcho(item.nodes, id)
          }
        }
      })
      return flag
    },
    getParent (root) {
      if (!root) return console.error('使用此组建请设置组件名称')
      const parentNames = ['templatemanage', 'infusion_editor']
      let parent = root
      if (parentNames.includes(parent.$options.name)) {
        return parent
      } else {
        parent = parent.$parent
        return this.getParent(parent)
      }
    },
    async handleNodeClick (data) { // 点击左键触发
      console.log(this.parent.$options.name)
      if (!data.isTemplate) return false
      if (this.templateChange) {
        confirm(this, {
          confirmCallBack: () => {
            this.parent.saveTpl()
            // this.$emit('saveTpl')
          },
          cancelCallBack: () => {
            this.parent.editTpl(data)// 此处需要考虑一下是否应该是编辑
            this.setAsyncChange(false)
          }
        })
      } else {
        this.parent.editTpl(data)
      }
    },
    handleOperate (obj) {
      let setOperate = (operateType) => {
        const operations = {
          'create': this.parent.contextmenuAdd,
          'refresh': this.parent.contextmenuRefresh,
          'edit': this.parent.contextmenuEdit,
          'review': this.parent.contextmenuReview,
          'cancelR': this.parent.contextmenuReview,
          'delete': this.parent.contextmenuRemove,
          'up': this.parent.contextmenuUpOrDown,
          'down': this.parent.contextmenuUpOrDown
        }
        const upDown = {
          'up': 1,
          'down': 2
        }
        operations[operateType](this.curNode, upDown[operateType])
      }

      if (this.templateChange && ['create', 'edit'].includes(obj.operate)) {
        confirm(this, {
          confirmCallBack: () => {
            this.parent.saveTpl()
          },
          cancelCallBack: () => {
            // 调用了父级的initUpdate
            // this.parent.initUpDate()
            this.setAsyncChange(false)
            setOperate(obj.operate)
          }
        })
      } else {
        setOperate(obj.operate)
        return false
      }
    },
    getNode (event, data, node, cur) {
      if (data.isTemplate) {
        this.menuList.map((item, index) => {
          if (['refresh', 'edit', 'delete', 'review', 'cancelR'].includes(item.id)) {
            this.$set(item, 'disabled', false)
            if (item.id === 'review') {
              this.$set(item, 'visible', String(this.businessType) !== '2' && !(data.auditStatus === 2))
              if (!this.reviewAble && String(this.businessType) === '3') this.$set(item, 'disabled', true)
            }
            if (item.id === 'cancelR') {
              this.$set(item, 'visible', String(this.businessType) !== '2' && data.auditStatus === 2)
              if (!this.reviewAble && String(this.businessType) === '3') this.$set(item, 'disabled', true)
            }
          } else {
            this.$set(item, 'disabled', true)
            if (['review', 'cancelR'].includes(item.id) && String(this.businessType) !== '2') {
              this.$set(item, 'visible', item.id === 'review')
            }
          }
        })
      } else {
        this.menuList.map((item, index) => {
          if (['create', 'refresh', 'up', 'down'].includes(item.id)) {
            this.$set(item, 'disabled', false)
          } else {
            this.$set(item, 'disabled', true)
            if (['review', 'cancelR'].includes(item.id) && String(this.businessType) !== '2') {
              this.$set(item, 'visible', item.id === 'review')
            }
          }
        })
      }
      this.curNode = data
    }
  }
}
</script>
<style lang="scss" scoped>
.br{
  border-right:1px solid #ccc;
}
.collapse_wrap{
  background: #F9F9F9;
}
.el-collapse {
  border-color: #eee;
}
.el-collapse /deep/.el-collapse-item__header{
  padding-left: 5px;
  border: none;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 25px;
    right: 10px;
    bottom: 0;
    height: 1px;
    background: #eee;
  }
  .el-collapse-item__arrow {
    display: none;
  }
  .header-icon {
    transform: rotate(-90deg);
    color: #7F838E;
    font-size: 16px;
    margin-right: 4px;
    transition: transform .3s;
  }
  .title-icon {
    color: #1C7BEF;
    margin-right: 4px;
    font-size: 17px;
  }
  span {
    font-size: 15px;
  }
}
.el-collapse /deep/.el-collapse-item__header.is-active{
  .header-icon {
    transform: rotate(0deg);
    transition: transform .3s;
  }
}
.el-collapse /deep/ .el-collapse-item__content {
  padding-left: 12px;
}
.el-collapse /deep/.el-collapse-item__wrap{
  padding: 8px 0;
  border: none;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 25px;
    right: 10px;
    bottom: 0;
    height: 1px;
    background: #eee;
  }
}
/deep/ .el-tree {
  .el-tree-node {
    position: relative;
    .el-tree-node__content {
      background: transparent;
      .el-tree-node__expand-icon {
        padding: 0 5px 5px 5px;
        width: 18px;
        height: 16px;
      }
    }
    .icon-neirong {
      width: 16px;
      height: 16px;
      float: left;
      margin: 4px 5px 0 0;
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
      background-image: url(../../../assets/img/blmb/neirong-huise-01.png);
    }
    .icon-review {
      width: 16px;
      height: 16px;
      float: left;
      margin: 4px 5px 0 0;
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
      background-image: url(../../../assets/img/blmb/xuanzhong-hui.png);
    }
    .icon-wenjian {
      width: 16px;
      height: 16px;
      float: left;
      margin: 4px 5px 0 0;
      background-size: 100% 100%;
      background-position: center center;
      background-repeat: no-repeat;
      background-image: url(../../../assets/img/blmb/wenjian1.png);
    }
    .custom-tree-node {
      width: calc(100% - 5px);
      margin-right: 10px;
      padding-left: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .line-tree-node {
      &:after {
        content: '';
        position: absolute;
        width: 1px;
        top: 21px;
        bottom: -6px;
        left: var(--left);
        background: #D8D8D8;
      }
    }
    .default_color{
      .icon-neirong {
        background-image: url(../../../assets/img/blmb/neirong-01.png);
      }
      .icon-review {
        background-image: url(../../../assets/img/blmb/xuanzhong-lan.png);
      }
    }
    &:not(.is-expanded) > .el-tree-node__content {
      .line-tree-node {
        &:after {
          width: 0px;
          transition: all .5s;
        }
      }
    }
    &.is-current > .el-tree-node__content {
      background: transparent;
      .custom-tree-node {
        background: #E9F2FB;
        border-radius: 2px;
        color: #1C7BEF;
      }
      .default_color {
        color: #000;
      }
      .icon-neirong {
        background-image: url(../../../assets/img/blmb/neirong-01.png);
      }
      .icon-review {
        background-image: url(../../../assets/img/blmb/xuanzhong-lan.png);
      }
      .icon-wenjian {
        background-image: url(../../../assets/img/blmb/wenjian2.png);
      }
    }
    &:hover > .el-tree-node__content {
      background: transparent;
    }
    &:not(.is-current) > .el-tree-node__content:hover > .custom-tree-node {
      background: #1C7BEF;
      border-radius: 2px;
      color: #fff;
      .icon-neirong {
        background-image: url(../../../assets/img/blmb/neirong-white.png);
      }
      .icon-review {
        background-image: url(../../../assets/img/blmb/xuanzhong-white.png);
      }
      .icon-wenjian {
        background-image: url(../../../assets/img/blmb/wenjian-white.png);
      }
    }
  }
  .el-tree-node__expand-icon {
    &:not(.is-leaf) {
      color: #7F838E;
      font-size: 16px;
    }
  }
}
</style>
