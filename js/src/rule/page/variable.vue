<template>
  <div class="variable-box">
    <el-row>
      <el-col class="variable-content" :span="12">
        <div class="searchbox">
          名称：
          <el-input v-model="parentSearchName" placeholder="请输入名称"></el-input>
          类路径:
          <el-input v-model="parentSearchClass" placeholder="请输入类路径"></el-input>
          <el-button type="primary" @click="showAddDialog">添加</el-button>
        </div>
        <template>
          <el-table
            :max-height="tableMaxheight()"
            highlight-current-row
            :data="searchCurrentVariable"
            @current-change="handleCurrentChange"
            ref="variableTable"
            style="width: 100%">
            <el-table-column
              prop="variableObjectName"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="variableObjectClass"
              label="类路径"
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
            :max-height="tableMaxheight()"
            :data="searchCurrentVariableChildren"
            style="width: 100%">
            <el-table-column
              prop="variableObjectPropertyName"
              label="属性名称"
             >
            </el-table-column>
            <el-table-column
              prop="variableObjectPropertyCode"
              label="属性名称"
            >
            </el-table-column>
            <el-table-column
              prop="variableObjectPropertyDataType"
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
      title="添加变量对象"
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
      title="添加变量对象属性"
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
    name: 'variableObjectName',
    label: '变量对象名称',
    props: {
      clearable: true,
    }
  },
  {
    name: 'variableObjectClass',
    label: '变量类路径',
    props: {
      clearable: true,
    }
  }
]
const dialogPropQuerySchema = [
  {
    name: 'variableObjectPropertyCode',
    label: '属性编码',
    props: {
      clearable: true,
    }
  },
  {
    name: 'variableObjectPropertyName',
    label: '属性名称',
    props: {
      clearable: true,
    }
  },
  {
    name: 'variableObjectPropertyDataType',
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
  props: ['currentVariableObj', 'decisionTableBiztypes'],
  data () {
    const dialogQueryObj = this.$ever.createObjFromSchema(dialogQuerySchema)
    const dialogPropQueryObj = this.$ever.createObjFromSchema(dialogPropQuerySchema)
    return {
      dataTypes,
      checkParentVariable: {},
      currentVariable: [],
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
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      rules: {
        variableObjectName: [
          { required: true, message: '请输入变量对象名称', trigger: 'blur' }
        ],
        variableObjectClass: [
          { required: true, message: '请输入变量类路径', trigger: 'blur' }
        ]
      },
      porprules: {
        variableObjectPropertyCode: [
          { required: true, message: '请输入属性编码', trigger: 'blur' },
        ],
        variableObjectPropertyName: [
          { required: true, message: '请输入变量对象属性名称', trigger: 'blur' }
        ],
        variableObjectPropertyDataType: [
          { required: true, message: '请输入变量属性数据类型', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    searchCurrentVariable () {
      let tempTable = this.currentVariable ? this.currentVariable : []
      return tempTable.filter((item) => {
        return item.variableObjectName.indexOf(this.parentSearchName) > -1 && item.variableObjectClass.indexOf(this.parentSearchClass) > -1
      })
    },
    searchCurrentVariableChildren () {
      let childrenTableData = (this.checkParentVariable && this.checkParentVariable.variableObjectId) ? (this.checkParentVariable.ruleDbVariableObjectPropertyList ? this.checkParentVariable.ruleDbVariableObjectPropertyList : []) : []
      return childrenTableData.filter((item) => {
        return item.variableObjectPropertyCode.indexOf(this.propSearchCode) > -1 && item.variableObjectPropertyName.indexOf(this.propSearchName) > -1
      })
    }
  },
  created () {
    this.dialogPropQuerySchema.forEach((item) => {
      if (item.name === 'variableObjectPropertyDataType') {
        item.props.options = this.dataTypes
      }
    })
  },
  watch: {
    currentVariableObj: {
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
      this.checkParentVariable = val
    },
    resetForm () {
      this.dialogQueryObj.variableObjectName = ''
      this.dialogQueryObj.variableObjectClass = ''
    },
    resetPropForm () {
      this.dialogPropQueryObj.variableObjectPropertyName = ''
      this.dialogPropQueryObj.variableObjectPropertyCode = ''
      this.dialogPropQueryObj.variableObjectPropertyDataType = ''
    },
    getCurrentVariable () {
      request('/rule-engine/db/variable/getByIdList', {idList: [this.currentVariableObj.variableId]}).then(res => {
        if (res.head.errCode === 0) {
          this.currentVariable = res.data.length > 0 ? res.data[0].ruleDbVariableObjectList : []
          console.log('this.currentVariable', this.currentVariable)
          if (this.currentVariable.length === 0) {
            this.checkParentVariable = {}
          }
          this.$refs.variableTable.clearSelection()
          if (this.checkParentVariable && this.checkParentVariable.variableObjectId) {
            let temprow = this.currentVariable.find((item, index) => {
              return item.variableObjectId === this.checkParentVariable.variableObjectId
            })
            this.$refs.variableTable.setCurrentRow(temprow)
          } else {
            if (this.currentVariable[0]) {
              this.$refs.variableTable.setCurrentRow(this.currentVariable[0])
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
      }
      this.dialogVisible = true
    },
    showAddPropDialog (item, type) {
      if (!(this.checkParentVariable && this.checkParentVariable.variableObjectId)) {
        this.$messageTips(this, 'warning', '请选择变量对象')
        return
      }
      if (type === 'edit') {
        this.dialogPropQueryObj = JSON.parse(JSON.stringify(item))
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
      if (this.dialogQueryObj.variableObjectId) {
        this.currentVariable.forEach((item, index) => {
          if (item.variableObjectId === this.dialogQueryObj.variableObjectId) {
            this.$set(this.currentVariable, index, this.dialogQueryObj)
          }
        })
      } else {
        this.currentVariable.push(this.dialogQueryObj)
      }
      let tempParam = Object.assign({}, this.currentVariableObj, {ruleDbVariableObjectList: this.currentVariable})
      request('/rule-engine/db/variable/update', tempParam).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.closeAddDialog()
        }
        this.getCurrentVariable()
      }).catch(() => {
        this.getCurrentVariable()
      })
    },
    addPropSave () {
      if (this.dialogPropQueryObj.variableObjectPropertyId) {
        this.checkParentVariable.ruleDbVariableObjectPropertyList.forEach((item, index) => {
          if (item.variableObjectPropertyId === this.dialogPropQueryObj.variableObjectPropertyId) {
            this.$set(this.checkParentVariable.ruleDbVariableObjectPropertyList, index, this.dialogPropQueryObj)
          }
        })
      } else {
        if (Array.isArray(this.checkParentVariable.ruleDbVariableObjectPropertyList)) {
          this.checkParentVariable.ruleDbVariableObjectPropertyList.push(this.dialogPropQueryObj)
        } else {
          this.checkParentVariable.ruleDbVariableObjectPropertyList = [{...this.dialogPropQueryObj}]
        }
      }
      this.currentVariable.forEach((item, index) => {
        if (item.variableObjectId === this.checkParentVariable.variableObjectId) {
          this.$set(this.currentVariable, index, this.checkParentVariable)
        }
      })
      let tempParam = Object.assign({}, this.currentVariableObj, {ruleDbVariableObjectList: this.currentVariable})
      request('/rule-engine/db/variable/update', tempParam).then(res => {
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
      this.$confirm('确定删除此变量, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'prop') {
          this.currentVariableObj.delRuleDbVariableObjectPropertyIdList = [item.variableObjectPropertyId]
        } else {
          this.currentVariableObj.delRuleDbVariableObjectIdList = [item.variableObjectId]
        }
        console.log('this.currentVariable', this.currentVariable)
        let tempParam = Object.assign({}, this.currentVariableObj, {ruleDbVariableObjectList: this.currentVariable})
        request('/rule-engine/db/variable/update', tempParam).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '操作成功')
            if (type === 'obj' && item.variableObjectId === this.checkParentVariable.variableObjectId) {
              this.checkParentVariable = {}
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
