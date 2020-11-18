<template>
  <div class="variable-box">
    <el-row>
      <el-col class="variable-content" :span="12">
        <div class="searchbox">
          分类名称：
          <el-input v-model="parentSearchName" placeholder="请输入名称"></el-input>
          分类编码:
          <el-input v-model="parentSearchClass" placeholder="请输入类路径"></el-input>
          <el-button type="primary" @click="showAddDialog">添加</el-button>
        </div>
        <template>
          <el-table
            highlight-current-row
            :data="searchCurrentVariable"
            @current-change="handleCurrentChange"
            :max-height="tableMaxheight()"
            ref="variableTable"
            style="width: 100%">
            <el-table-column
              prop="constantObjectTypeName"
              label="分类名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="constantObjectTypeCode"
              label="分类编码"
              >
            </el-table-column>
            <el-table-column
              label="操作"
              width="110">
              <template slot-scope="scope">
                <el-button @click="showAddDialog(scope.row, 'edit')" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row, 'obj')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-col>
      <el-col class="variable-content" :span="12">
        <div class="searchbox">
          属性编码：
          <el-input v-model="propSearchCode" placeholder="请输入名称"></el-input>
          属性名称:
          <el-input v-model="propSearchName" placeholder="请输入数据类型"></el-input>
          <el-button type="primary" @click="showAddPropDialog">添加</el-button>
        </div>
        <template>
          <el-table
            :data="searchCurrentVariableChildren"
            :max-height="tableMaxheight()"
            style="width: 100%">
            <el-table-column
              prop="constantObjectPropertyName"
              label="属性名称"
             >
            </el-table-column>
            <el-table-column
              prop="constantObjectPropertyCode"
              label="属性编码"
            >
            </el-table-column>
            <el-table-column
              prop="constantObjectPropertyDataType"
              label="数据类型"
              width="180"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="110">
              <template slot-scope="scope">
                <el-button @click="showAddPropDialog(scope.row, 'edit')" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row, 'prop')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-col>
    </el-row>
    <el-dialog
      title="添加常量对象"
      width="600px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="resetForm"
    >
      <ever-form2
        v-model="dialogQueryObj"
        ref="dialogForm"
        :schema="dialogQuerySchema"
        :label-Width="80"
        :rules="rules"
      >
        <template slot="default">
          <div style="text-align: right">
            <el-button size="small" type="primary" @click="addSave()">确定</el-button>
            <el-button size="small" @click="closeAddDialog()">取消</el-button>
          </div>
        </template>
      </ever-form2>
    </el-dialog>
    <el-dialog
      title="添加常量对象属性"
      width="600px"
      :visible.sync="dialogPropVisible"
      :close-on-click-modal="false"
      @close="resetPropForm"
    >
      <ever-form2
        v-model="dialogPropQueryObj"
        ref="dialogPropForm"
        :schema="dialogPropQuerySchema"
        :label-Width="80"
        :rules="porprules"
      >
        <template slot="default">
          <div style="text-align: right">
            <el-button size="small" type="primary" @click="addPropSave()">确定</el-button>
            <el-button size="small" @click="closeAddPropDialog()">取消</el-button>
          </div>
        </template>
      </ever-form2>
    </el-dialog>
  </div>
</template>

<script>
import {request} from '@/util/req'

const dialogQuerySchema = [
  {
    name: 'constantObjectTypeName',
    label: '分类名称',
    props: {
      clearable: true,
    }
  },
  {
    name: 'constantObjectTypeCode',
    label: '分类编码',
    props: {
      clearable: true,
    }
  }
]
const dialogPropQuerySchema = [
  {
    name: 'constantObjectPropertyCode',
    label: '属性编码',
    props: {
      clearable: true,
    }
  },
  {
    name: 'constantObjectPropertyName',
    label: '属性名称',
    props: {
      clearable: true,
    }
  },
  {
    name: 'constantObjectPropertyDataType',
    label: '属性数据类型',
    comp: 'select',
    props: {
      options: []
    }
  }
]
import dataTypes from '@/rule/assets/data-type'
export default {
  name: 'variable-main',
  props: ['currentConstantObj', 'decisionTableBiztypes'],
  data () {
    const dialogQueryObj = this.$ever.createObjFromSchema(dialogQuerySchema)
    const dialogPropQueryObj = this.$ever.createObjFromSchema(dialogPropQuerySchema)
    return {
      dataTypes,
      checkParentConstant: {},
      currentConstant: [],
      dialogVisible: false,
      dialogPropVisible: false,
      dialogQueryObj,
      dialogQuerySchema,
      dialogPropQueryObj,
      dialogPropQuerySchema,
      parentSearchName: '',
      parentSearchClass: '',
      propSearchName: '',
      propSearchCode: '',
      tableData: [],
      rules: {
        constantObjectTypeName: [
          { required: true, message: '请输入常量对象名称', trigger: 'blur' }
        ],
        constantObjectTypeCode: [
          { required: true, message: '请输入常量类路径', trigger: 'blur' }
        ]
      },
      porprules: {
        constantObjectPropertyCode: [
          { required: true, message: '请输入属性编码', trigger: 'blur' },
        ],
        constantObjectPropertyName: [
          { required: true, message: '请输入常量对象属性名称', trigger: 'blur' }
        ],
        constantObjectPropertyDataType: [
          { required: true, message: '请输入常量属性数据类型', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    searchCurrentVariable () {
      let tempTable = this.currentConstant ? this.currentConstant : []
      console.log('tempTable', tempTable)
      return tempTable.filter((item) => {
        return item.constantObjectTypeName.indexOf(this.parentSearchName) > -1 && item.constantObjectTypeCode.indexOf(this.parentSearchClass) > -1
      })
    },
    searchCurrentVariableChildren () {
      let childrenTableData = (this.checkParentConstant && this.checkParentConstant.constantObjectId) ? (this.checkParentConstant.ruleDbConstantObjectPropertyList ? this.checkParentConstant.ruleDbConstantObjectPropertyList : []) : []
      return childrenTableData.filter((item) => {
        return item.constantObjectPropertyCode.indexOf(this.propSearchCode) > -1 && item.constantObjectPropertyName.indexOf(this.propSearchName) > -1
      })
    }
  },
  created () {
    this.dialogPropQuerySchema.forEach((item) => {
      if (item.name === 'constantObjectPropertyDataType') {
        item.props.options = this.dataTypes
      }
    })
  },
  watch: {
    currentConstantObj: {
      handler (val) {
        this.getCurrentVariable()
      },
      immediate: true
    }
  },
  methods: {
    tableMaxheight () {
      return document.body.clientHeight - 120
    },
    handleCurrentChange (val) {
      this.checkParentConstant = val
    },
    resetForm () {
      this.dialogQueryObj.constantObjectTypeName = ''
      this.dialogQueryObj.constantObjectTypeCode = ''
    },
    resetPropForm () {
      this.dialogPropQueryObj.constantObjectPropertyName = ''
      this.dialogPropQueryObj.constantObjectPropertyCode = ''
      this.dialogPropQueryObj.constantObjectPropertyDataType = ''
    },
    getCurrentVariable () {
      request('/rule-engine/db/constant/getByIdList', {idList: [this.currentConstantObj.constantId]}).then(res => {
        if (res.head.errCode === 0) {
          this.currentConstant = res.data.length > 0 ? res.data[0].ruleDbConstantObjectList : []
          console.log('this.currentConstant', this.currentConstant)
          if (this.currentConstant.length === 0) {
            this.checkParentConstant = {}
          }
          this.$refs.variableTable.clearSelection()
          if (this.checkParentConstant && this.checkParentConstant.constantObjectId) {
            let temprow = this.currentConstant.find((item, index) => {
              return item.constantObjectId === this.checkParentConstant.constantObjectId
            })
            this.$refs.variableTable.setCurrentRow(temprow)
          } else {
            if (this.currentConstant[0]) {
              this.$refs.variableTable.setCurrentRow(this.currentConstant[0])
            } else {
              this.$refs.variableTable.clearSelection()
            }
          }
        }
      })
    },
    handleClick (data) {
      console.log(data)
    },
    showAddDialog (item, type) {
      if (type === 'edit') {
        this.dialogQueryObj = JSON.parse(JSON.stringify(item))
      } else {
        delete this.dialogQueryObj.constantObjectId
      }
      this.dialogVisible = true
    },
    showAddPropDialog (item, type) {
      if (!(this.checkParentConstant && this.checkParentConstant.constantObjectId)) {
        this.$messageTips(this, 'warning', '请选择常量对象')
        return
      }
      if (type === 'edit') {
        this.dialogPropQueryObj = JSON.parse(JSON.stringify(item))
      } else {
        delete this.dialogPropQueryObj.constantObjectPropertyId
      }
      this.dialogPropVisible = true
    },
    closeAddDialog () {
      this.dialogVisible = false
    },
    closeAddPropDialog () {
      this.dialogPropVisible = false
    },
    addSave () {
      if (this.dialogQueryObj.constantObjectId) {
        this.currentConstant.forEach((item, index) => {
          if (item.constantObjectId === this.dialogQueryObj.constantObjectId) {
            this.$set(this.currentConstant, index, this.dialogQueryObj)
          }
        })
      } else {
        this.currentConstant.push(this.dialogQueryObj)
      }
      let tempParam = Object.assign({}, this.currentConstantObj, {ruleDbConstantObjectList: this.currentConstant})
      request('/rule-engine/db/constant/update', tempParam).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.closeAddDialog()
          this.getCurrentVariable()
        }
      }).catch(() => {
        this.getCurrentVariable()
      })
    },
    addPropSave () {
      if (this.dialogPropQueryObj.constantObjectPropertyId) {
        this.checkParentConstant.ruleDbConstantObjectPropertyList.forEach((item, index) => {
          if (item.constantObjectPropertyId === this.dialogPropQueryObj.constantObjectPropertyId) {
            this.$set(this.checkParentConstant.ruleDbConstantObjectPropertyList, index, this.dialogPropQueryObj)
          }
        })
      } else {
        if (Array.isArray(this.checkParentConstant.ruleDbConstantObjectPropertyList)) {
          this.checkParentConstant.ruleDbConstantObjectPropertyList.push(this.dialogPropQueryObj)
        } else {
          this.checkParentConstant.ruleDbConstantObjectPropertyList = [{...this.dialogPropQueryObj}]
        }
      }
      this.currentConstant.forEach((item, index) => {
        if (item.constantObjectId === this.checkParentConstant.constantObjectId) {
          this.$set(this.currentConstant, index, this.checkParentConstant)
        }
      })
      let tempParam = Object.assign({}, this.currentConstantObj, {ruleDbConstantObjectList: this.currentConstant})
      request('/rule-engine/db/constant/update', tempParam).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.closeAddPropDialog()
        }
        this.getCurrentVariable()
      }).catch(() => {
        this.getCurrentVariable()
      })
    },
    handleDelete (item, type) {
      this.$confirm('确定删除此常量, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'prop') {
          this.currentConstantObj.delRuleDbConstantObjectPropertyIdList = [item.constantObjectPropertyId]
        } else {
          this.currentConstantObj.delRuleDbConstantObjectIdList = [item.constantObjectId]
        }
        console.log('this.currentConstant', this.currentConstant)
        let tempParam = Object.assign({}, this.currentConstantObj, {ruleDbConstantObjectList: this.currentConstant})
        request('/rule-engine/db/constant/update', tempParam).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '操作成功')
            if (type === 'obj' && item.constantObjectId === this.checkParentConstant.constantObjectId) {
              this.checkParentConstant = {}
            }
            this.getCurrentVariable()
          }
        })
      }).catch((e) => {
        return false
      })
    },
  }
}
</script>

<style lang="less" scoped>
  .variable-box{
    /deep/ .el-table{
      margin: 0;
    }
    /deep/ .el-input {
      width: auto;
    }
    /deep/ .el-input {
      width: auto;
      margin-right: 10px;
    }
    .searchbox{
      font-size: 14px;
      padding: 10px;
      box-sizing: border-box;
    }
    .variable-content{
      box-sizing: border-box;
      padding: 0 5px;
    }
  }
</style>
