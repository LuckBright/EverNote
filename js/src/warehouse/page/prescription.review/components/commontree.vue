<!--
  通用树形结构   「 支持 添加一级分类 无数级子分类  编辑当前分类  禁用当前分类 」

-->
<template>
  <div class="custom-tree-container" :class="!isSelectAdd ? 'common-tree-box' : 'common-tree-box isselectadd'">
    <div :class="!isSelectAdd ? 'block' : ''">
      <el-tree
        ref="treebox"
        :data="listData"
        :props="props"
        node-key="id"
        @node-click="scrollToBottom"
        :default-expanded-keys="fullkeys"
        :render-content="renderContent">
      </el-tree>
      <div class="tree-bottom-box pt10 pb10" v-if="!isSelectAdd">
        <el-button v-if="oneCheck" type="primary" plain @click="openParent">+ 创建一级分类</el-button>
        <el-row v-else>
          <el-col :span="15"><el-input maxlength="500" ref="parentRef" v-model="indexinput" placeholder="分类名称"></el-input></el-col>
          <el-col :span="8" class="ml20">
            <el-button type="primary" @click="parentAppend">保存</el-button>
            <el-button @click="oneCheck = true">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['treeData', 'api', 'isSelectAdd', 'statusType'],
  data () {
    return {
      listData: [],
      props: {
        label: 'contentText',
        children: 'subList'
      },
      indexinput: '',
      oneCheck: true,
      fullkeys: [],
      isRemove: '0'
    }
  },
  created () {
    let parmas = {
      level: 1
    }
    if (this.statusType) parmas.status = this.statusType
    this.api.list(parmas).then(res => {
      if (res) {
        this.loopData(res, 'switch', false)
        this.loopData(res, 'showBtn', 1)
        this.listData = res
      }
    })
  },
  methods: {
    scrollToBottom (data, node, e) {
      this.$emit('scrollToBottom', e)
    },
    loopData (data, str, zr, status) {
      if (data.length) {
        data.forEach(item => {
          item[str] = status || zr
          this.$set(item, str, status || zr)
          if (item.subList) {
            if (str === 'showBtn' && item.status === 2) {
              this.loopData(item.subList, str, zr, 2)
            } else {
              this.loopData(item.subList, str, zr)
            }
          }
        })
      }
    },
    openParent () {
      this.oneCheck = false
      this.$nextTick(() => {
        this.$refs.parentRef.focus()
      })
    },
    parentAppend () {
      if (this.indexinput) {
        let params = {
          contentText: this.indexinput
        }
        this.api.createdAndUpdate(params).then(res => {
          if (res) {
            res.switch = false
            res.showBtn = 1
            this.listData.push(res)
            this.indexinput = ''
            this.oneCheck = true
          }
        })
      }
    },
    setDataAllArr (data) {
      let dataAllArr = []
      function loopFn (obj) {
        if (obj.parent) {
          loopFn(obj.parent)
          dataAllArr.push({id: obj.data.id, name: obj.data.contentText})
        }
      }
      loopFn(data)
      return dataAllArr
    },
    selectAdd (data, e, store) {
      e.stopPropagation()
      this.$emit('thisSelectData', data, this.setDataAllArr(store.nodesMap[data.id]))
    },
    append (data, e, stu) {
      e.stopPropagation()
      this.isRemove = stu
      const newChild = { id: (Math.random() * 10 + ''), contentText: '', subList: [], switch: true, showBtn: data.status }
      if (!data.subList) {
        this.$set(data, 'subList', [])
      }
      if (data.subList.length === 0 || data.subList[data.subList.length - 1].contentText !== '') {
        data.subList.push(newChild)
        this.fullkeys = [data.parentId ? data.parentId : data.id, data.id]
        this.$nextTick(() => {
          setTimeout(_ => {
            this.$refs.treebox.store.nodesMap[newChild.id].expanded = true
            this.$el.querySelector('input') && this.$el.querySelector('input').focus()
          }, 200)
        })
      }
    },
    status (node, data, e) {
      e.stopPropagation()
      // this.fullkeys = [data.parentId ? data.parentId : data.id, data.id]
      let params = {
        id: data.id,
        status: data.status === 1 ? 2 : 1
      }
      this.api.editStatus(params).then(res => {
        if (res) {
          if (data.status === 1) {
            this.$set(data, 'status', 2)
            if (data.subList.length) this.loopData(data.subList, 'showBtn', 2, 2)
            this.$messageTips(this, 'success', '禁用成功')
          } else {
            this.$set(data, 'status', 1)
            if (data.subList.length) this.loopData(data.subList, 'showBtn', 1, 1)
            this.$messageTips(this, 'success', '启用成功')
          }
        }
      })
    },
    statusSwitch (node, data, switchs, e, ss) {
      e.stopPropagation()
      this.isRemove = ss || this.isRemove
      data.switch = switchs
      this.$set(data, 'switch', switchs)
      let newChild = Object.assign({}, data)
      let inxObject = this.findIndexs(node, data)
      if (this.isRemove === '1') {
        this.remove(node, data)
      } else {
        inxObject.subList.splice(inxObject.index, 1, newChild)
      }
    },
    remove (node, data) {
      let inxObject = this.findIndexs(node, data)
      inxObject.subList.splice(inxObject.index, 1)
    },
    findIndexs (node, data) {
      const parent = node.parent
      const subList = parent.data.subList || parent.data
      const index = subList.findIndex(d => d.id === data.id)
      return { index: index, subList: subList }
    },
    save (node, data, e) {
      e.stopPropagation()
      this.indexinput = this.$refs.treebox.$el.querySelector('.el-input__inner').value
      if (this.indexinput) {
        const parent = node.parent
        let params = {
          id: data.id || '',
          contentText: this.indexinput
        }
        if (parent) params.parentId = parent.data.id
        if (params.id.indexOf('.') !== -1) delete params.id
        this.api.createdAndUpdate(params).then(res => {
          if (res) {
            // this.$set(node, 'data', res)
            this.$set(node.data, 'contentText', res.contentText)
            this.$set(node.data, 'parentId', res.parentId)
            this.$set(node.data, 'id', res.id)
            this.$set(node.data, 'switch', false)
            // this.$set(data, 'subList', res.subList)
            this.$set(data, 'status', res.status)
            // this.statusSwitch(node, data, false, e, '0')
            this.indexinput = ''
            this.$messageTips(this, 'success', '操作成功')
          }
        })
      }
    },
    renderContent (h, { node, data, store }) {
      let buttonShow, inputShow
      if (node.data.showBtn && node.data.showBtn === 1 && !node.data.switch) {
        if (!this.isSelectAdd) {
          buttonShow = (
            <span>
              <el-button type="primary" size="mini" plain on-click={(e) => this.append(data, e, '1')}>创建子分类</el-button>
              <el-button type="primary" size="mini" plain on-click={(e) => this.statusSwitch(node, data, true, e, '0')}>编辑</el-button>
              <el-button type={node.data.status === 1 ? 'danger' : 'success'} size="mini" plain on-click={(e) => this.status(node, data, e)}>{node.data.status === 1 ? '禁用' : '启用'}</el-button>
            </span>
          )
        } else {
          if (!data.subList.length) {
            buttonShow = (
              <span>
                <el-button type="primary" size="mini" plain on-click={(e) => this.selectAdd(data, e, store)}>添加</el-button>
              </span>
            )
          }
        }
      } else {
        if (node.data.switch) {
          buttonShow = (
            <span>
              <el-button type="primary" size="mini" on-click={(e) => this.save(node, data, e)}>保存</el-button>
              <el-button size="mini" plain on-click={(e) => this.statusSwitch(node, data, false, e)}>取消</el-button>
            </span>
          )
        } else {
          buttonShow = ('')
        }
      }
      if (!node.data.switch) {
        inputShow = (
          <span style="padding-right: 10px">{node.data.contentText}</span>
        )
      } else {
        inputShow = (
          <span style="width:90%" class="el-input"><input class="el-input__inner" maxlength="500" value={node.data.contentText}></input></span>
        )
      }
      return (
        <div class="custom-tree-node">
          {inputShow}
          {buttonShow}
        </div>
      )
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
.common-tree-box {
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  background: #fff;
}
.common-tree-box /deep/ .el-tree {
  padding: 0px;
  border-top: 1px solid #ccc;
}
.isselectadd {
  padding: 0;
  border: 0;
  box-shadow: 0 0 0;
}
.block {
  border: 1px solid #ccc;
  border-top: 0;
}
.common-tree-box /deep/ .el-tree-node {
  &:first-child {
    border-top: none;
  }
  border-top: 1px solid #f1f1f1;
  white-space: normal;
}
.common-tree-box /deep/ .custom-tree-node {
  line-height: 18px;
  flex: 1;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  padding-left: 8px;
}
.common-tree-box /deep/ .el-tree-node__content {
  height: auto;
  padding: 7px 0;
}
.tree-bottom-box {
  padding-right: 8px;
  padding-left: 8px;
  border-top: 1px solid #ccc;
  background: #f2f2f2;
}
</style>
