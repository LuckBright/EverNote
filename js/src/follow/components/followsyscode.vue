<template>
  <div class="common-box">
    <div class="common-header h76">
      <el-button
        size="small"
        type="primary"
        @click="newCode"
        v-if="needauth? $hasPermission('Auth_menu_follow_settings') : true"
      >新建分类</el-button>
    </div>
    <div class="common-content p0">
      <el-tree
        class="tree follow-syscode-tree"
        ref="tree"
        :data="treeData"
        :props="defProps"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :expand-on-click-node="true"
        :highlight-current="true"
        @node-click="handleNodeClick"
        :indent="24"
      >
        <!-- :indent="0" -->
        <span
          class="tree-node"
          slot-scope="{node}"
        >
          <span class="syscode-name">{{node.label}}</span>
          <el-dropdown
            v-if="node.data.id !== 'all' && needauth && $hasPermission('Auth_menu_follow_settings')"
            class="fr"
            @command="handleCommand(node, $event)"
          >
            <span class="el-dropdown-link">
              <i class="icon iconfont icon-shenpi_zhankai cGray"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">编辑名称</el-dropdown-item>
              <el-dropdown-item command="del">删除</el-dropdown-item>
              <el-dropdown-item command="addSub" v-if="totalParent(node.data) !== 3 && !node.data.isThird">增加子项</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            v-if="node.data.id !== 'all' && !needauth"
            class="fr"
            @command="handleCommand(node, $event)"
          >
            <span class="el-dropdown-link">
              <i class="icon iconfont icon-shenpi_zhankai cGray"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">编辑名称</el-dropdown-item>
              <el-dropdown-item command="del">删除</el-dropdown-item>
              <el-dropdown-item command="addSub" v-if="totalParent(node.data) !== 3 && !node.data.isThird">增加子项</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-tree>
      <el-dialog
        width="300px"
        :title="dialog.title"
        :close-on-click-modal="false"
        :visible.sync="dialog.visible"
      >
        <!--      极简表单 只有一个输入框-->
        <ever-form2
          ref="dialogForm"
          v-model="dialog.form"
          :schema="dialog.schema"
          :rules="dialog.rules"
          :nosubmit="true"
          label-width="0"
        ></ever-form2>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="cancel">取消</el-button>
          <el-button
            type="primary"
            @click="submit"
            :loading="dialog.submitLoading"
          >确定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <el-cascader
    placeholder="输入分类名称可搜索..."
    v-model="value"
    :options="treeData"
    :props="{ checkStrictly: true }"
    filterable
    clearable>
    </el-cascader> -->
  </div>
</template>

<script>
  import {request} from '@/util/req'
  import urlMap from '@/util/urls'
  import { convertListToTree, getAllParent, validateSpace } from '../util/fn'
  import {debounce1 as debounce} from '@/util/common'

  const typeIdMap = {
    template: 5, // 模板分类
  }
  export default {
    props: {
      typeId: {
        type: [String, Number],
        default: typeIdMap.template,
      }, // 类型
      needauth: {
        type: Boolean,
        default: false,
      }, // 类型
    },
    data () {
      const schema = [{
        name: 'name',
        props: {
          placeholder: '输入类别名称',
        },
      }]
      const form = this.$ever.createObjFromSchema(schema)
      return {
        value: [],
        defProps: {children: 'children', label: 'name'},
        treeData: [], // 树状数据
        defaultExpandedKeys: ['all'], // 默认只展开全部
        dialog: {
          visible: false,
          title: '编辑类别',
          form,
          schema,
          rules: {
            name: [
              { required: true, message: '必填项', trigger: 'change', validator: validateSpace },
              { min: 1, max: 20, message: '请输入1-20个字符', trigger: 'change' },
            ],
          },
          submitLoading: false,
          disabled: true,
        },
        crtNode: null,
        originData: [],
        currentParentNum: 0,
      }
    },
    created () {
      this.getTree()
    },
    methods: {
      getTree () {
        request(urlMap.follow.syscode.findByTypeId, {typeId: this.typeId}).then(res => {
          if (res.head.errCode === 0) {
            this.originData = res.data || []
            this.initTree()
          }
        })
      },
      totalParent (node) {
        let arrayParent = getAllParent(node)
        return arrayParent.length || 0
      },
      initTree () {
        this.treeData = convertListToTree([{
          name: '全部',
          id: 'all',
          code: '0', // 一级分类的parentCode为0
          parentCode: null,
        }, ...this.originData])
      },
      handleNodeClick (data) {
        this.currentParentNum = this.totalParent(data)
        this.$emit('nodeClick', data)
      },
      newCode () {
        this.dialog.type = 'new'
        this.crtNode = this.$refs.tree.getNode('all')
        this.dialog.visible = true
        this.dialog.form.name = ''
        this.dialog.title = '新增类别'
        setTimeout(() => {
          this.$nextTick(() => {
            // reset表单
            this.$refs.dialogForm.resetForm()
            this.dialog.form.name = ''
          })
        }, 100)
      },
      edit (node) {
        this.dialog.type = 'edit'
        this.crtNode = node
        this.dialog.visible = true
        this.dialog.form.name = node.data.name
        this.dialog.title = '编辑类别'
      },
      del (node) {
        this.$confirm('您确定要删除该类别吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          request(urlMap.follow.syscode.deleteById, {id: node.data.id}).then((res) => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '删除成功!')
              // 本地删除子节点
              this.$refs.tree.remove(node)
              if (node.parent) {
                this.$emit('nodeClick', node.parent.data)
              }
            }
          })
        })
      },
      addSub (node) {
        this.dialog.type = 'addSub'
        this.crtNode = node
        this.dialog.visible = true
        this.dialog.form.name = ''
        this.dialog.title = '新增子类别'
        setTimeout(() => {
          this.$nextTick(() => {
            // reset表单
            this.$refs.dialogForm.resetForm()
            this.dialog.form.name = ''
          })
        }, 100)
      },
      submit () {
        // 验证表单
        this.$refs.dialogForm.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          // 执行 new addSub edit
          this.dialog.submitLoading = true
          debounce(() => {
            if (this.dialog.type === 'edit') {
              request(urlMap.follow.syscode.modify, {
                id: this.crtNode.data.id,
                name: this.dialog.form.name,
                typeId: this.typeId,
              }).then(res => {
                if (res.head.errCode === 0) {
                  this.$messageTips(this, 'success', '编辑成功!')
                  // 重新加载树
                  const crtData = this.originData.find(item => item.id === this.crtNode.data.id)
                  crtData.name = this.dialog.form.name
                  this.initTree()
                  this.dialog.visible = false
                }
                this.dialog.submitLoading = false
              })
            } else if (this.dialog.type === 'new' || this.dialog.type === 'addSub') {
              request(urlMap.follow.syscode.create, {
                typeId: this.typeId,
                name: this.dialog.form.name,
                parentCode: this.dialog.type === 'new' ? '0' : this.crtNode.data.code,
              }).then(res => {
                if (res.head.errCode === 0) {
                  this.$messageTips(this, 'success', '新增成功!')
                  this.getTree()
                  if (this.currentParentNum === 2) {
                    res.data.isThird = true
                  } else {
                    res.data.isThird = false
                  }
                  this.$refs.tree.append(res.data, this.crtNode)
                  // 新增分类成功之后，展开当前分类
                  if (this.dialog.type === 'addSub') {
                    this.defaultExpandedKeys = [...this.defaultExpandedKeys, this.crtNode.data.id]
                  }
                  this.$refs.dialogForm.resetForm()
                  this.dialog.form.name = ''
                  this.dialog.visible = false
                  this.dialog.submitLoading = false
                }
                this.dialog.submitLoading = false
              })
            }
          }, 400)()
        })
      },
      cancel () {
        this.$refs.dialogForm.resetForm()
        this.dialog.form.name = ''
        this.dialog.visible = false
      },
      handleCommand (node, $event) {
        this[$event](node)
      },
    },
  }
</script>

<style scoped>
.h76 {
  height: 72px !important;
  padding-left: 30px !important;
}
.common-box /deep/ .follow-syscode-tree.el-tree > .el-tree-node > .el-tree-node__content {
  padding-left: 24px !important;
}
</style>
