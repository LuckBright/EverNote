<template>
  <div>
    <ever-bread-crumb :name="num === 2 ? '复制角色' : (objId === '-1' ? '新建角色' : '编辑角色')" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="flex_column_1_hidden layout_inner">
      <div class="main-head">
        <ever-form-model
          ref="form"
          :schema="schema"
          :api="api"
          :rules="rules"
          v-model="obj"
          label-position="right"
        ></ever-form-model>
      </div>
      <div class="flex_col_1_auto main-wrap">
        <div class="tree-container">
          <span class="tree-label">权限</span>
          <div class="role-tree">
            <el-tree
              ref="mytree"
              show-checkbox
              node-key="menuId"
              :data="treeObj"
              :default-expand-all="false"
              :default-expanded-keys="checkedKey"
              :default-checked-keys="checkedKey"
              :props="defaultProps"
              v-loading="loading"
              :filter-node-method="filterNode">
              <div class="custom-tree-node" slot-scope="{ node, data }">
                <span :class="{'group-node': !data.menuId}">{{ getNodeDisplay(node) }}</span>
                <div v-if="data.btnList && data.btnList.length > 0" class="btnwar">
                  <!-- <div class="all">
                    <el-checkbox v-model="selectAllFlag" @change="selAllBtnRes(data.btnList)">全选</el-checkbox>
                  </div> -->
                  <el-checkbox
                    v-for="(item, index) in data.btnList"
                    :key="index"
                    border
                    size="small"
                    :checked="checkedBtnKey.includes(item.rid)"
                    @change="(val) => {changeBtnRes(val, item)}"
                    :true-label="item.rid"
                    false-label="">{{item.name}}</el-checkbox>
                </div>
              </div>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="panel-footer" style="padding-left:140px;">
        <el-button type="primary" v-ever-click-once="disabled" :disabled="disabled" @click="submitForm('form')" v-if="objId === '-1'">创建</el-button>
        <el-button type="primary" v-ever-click-once="disabled" :disabled="disabled" @click="submitForm('form')" v-if="objId !== '-1'">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/auth/store/roleapi'
import resourceApi from '@/auth/store/resourceapi'

var schema = [
  {
    name: 'name',
    label: '角色名称'
  }
]

export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      objId: this.$route.params.id,
      num: this.$route.params.num,
      api,
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      checkedKey: [],
      treeObj: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      parentIdMap: {},
      loading: true,
      disabled: false,
      checkedBtnKey: [],
      selectAllFlag: false
    }
  },
  watch: {
    // tree选择的时候 勾选“全选”触发的方法
    'selectAllFlag' (val) {
      this.handleSelectAll(val)
    }
  },
  methods: {
    selAllBtnRes (data) {
    },
    handleSelectAll (flag) {
    },
    // 勾选按钮时候修改按钮的选中集合
    changeBtnRes (data, node) {
      if (data && !this.checkedBtnKey.includes(data)) {
        this.checkedBtnKey.push(data)
      } else {
        let _index = this.checkedBtnKey.findIndex(item => {
          return item === node.rid
        })
        this.checkedBtnKey.splice(_index, 1)
      }
    },
    filterNode (value, data) {
      return data.type === 1
    },
    // 获取勾选权限的全集（包括菜单选中的，和半选中的）和按钮勾选的
    getCheckedId () {
      return this.$refs.mytree.getCheckedKeys().concat(this.$refs.mytree.getHalfCheckedKeys()).concat(this.checkedBtnKey)
    },
    // 编辑回显的时候需要把一些有child的数据去掉，因为如果有这些数据的话会导致下面的子集也都被勾选上
    fixHalfCheckedBug (ids) {
      let arr = []
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        if (!this.parentIdMap[id]) {
          arr.push(id)
        }
      }
      this.checkedKey = arr
    },
    // 提交角色数据
    submitForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.obj.roleId = this.objId
          this.obj.roleName = this.obj.name
          this.obj.menuIdList = this.getCheckedId()
          this.obj.menuIdList = this.obj.menuIdList.filter(item => {
            if (item) {
              return item
            }
          })
          this.obj.deptIdList = []
          this.obj.num = this.num
          api.createOrUpdate(this.obj).then(result => {
            if (result.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功', '提示')
              this.$router.push({
                name: 'roles'
              })
            } else {
              this.obj.role = this.obj.name
            }
          })
        }
      })
    },
    _recursion (data, name, arr) {
      data.forEach(item => {
        if (item[name]) {
          this._recursion(item[name], name, arr)
        }
        arr.push(item)
      })
    },
    getParentId (treeData) {
      for (let i = 0; i < treeData.length; i++) {
        let item = treeData[i]
        if (Array.isArray(item.list) && item.list.length !== 0) {
          if (item.menuId) {
            this.parentIdMap[item.rid] = true
          }
          this.getParentId(item.list)
        }
      }
    },
    getNodeDisplay (node) {
      return (node.level === 1 || node.level === 2) ? node.label : (node.data.color && node.data.color.trim() ? (node.label + (node.data.color.startsWith('#') ? '' : `（${node.data.color}）`)) : node.label)
    },
  },
  created () {
    // 获取资源列表，根据角色id查询角色内的资源，然后匹配打钩
    resourceApi.listTree().then(result => {
      this.treeObj = result.menuList
      this.getParentId(result.menuList)
      let arr = []
      this._recursion(this.treeObj, 'list', arr)
      let tmpArr = arr.map(item => item.rid).filter(item => {
        if (item) {
          return item
        }
      })
      this.loading = false
      if (this.objId !== '-1') {
        api.getById(this.objId).then(result => {
          result.role.permissionInfos = result.role.menuIdList
          this.fixHalfCheckedBug(result.role.menuIdList)
          this.obj.id = this.objId
          this.obj.name = result.role.name
          this.obj.menuList = result.role.menuIdList
          let cleanRids = result.role.menuIdList.filter(item => {
            if (item) {
              return item
            }
          })
          var btnList = cleanRids.filter(item => {
            return !tmpArr.includes(item)
          })
          this.checkedBtnKey = btnList
          this.$refs.mytree.filter()
        })
      }
      // this.checkedKey = ['36', '38']
    })
  },
}
</script>

<style scoped>
.tree-container {
  padding-left: 110px;
  display: flex;
  font-size: 14px;
}
.tree-label {
  display: inline-block;
  margin-left: -30px;
}
.filter {
  margin-left: 10px;
}
.role-tree .el-tree /deep/ .el-tree-node__content {
  height: auto;
  line-height: 24px;
  align-items: flex-start
}

.el-tree /deep/ .el-tree-node__expand-icon.expanded{
}
.role-tree .btnwar {border: 1px solid #ddd;padding: 10px;border-radius: 3px; white-space: normal; width: 600px; margin: 5px 0;}
.role-tree .btnwar:empty{display: none}
.role-tree .btnwar .el-checkbox {
  margin-bottom:5px
}

.role-tree .btnwar .el-checkbox.is-bordered.el-checkbox--small {
  margin: 0 5px 5px 10px
}
</style>
