<template>
  <div class="variable-box">
    <el-row>
      <el-col class="variable-content" :span="24">
        <div class="searchbox" style="text-align: right">
<!--          <el-button type="primary" @click="showAddDialog">添加</el-button>-->
        </div>
        <template>
          <ever-table
            :border="true"
            ref="table"
            is-auto-height
            class=""
            row-key="id"
            :show-index="false"
            :columns="columns"
            :data="tableData"
            :maxBtnCount="6">
            <template slot="jjd" slot-scope="scope">
              <template>
                {{scope.row.name}}
              </template>
            </template>
            <template slot="jjdcode" slot-scope="scope">
              <template>
                {{scope.row.code}}
              </template>
            </template>
            <template slot="jygz" slot-scope="scope">
              <template v-for="(item, index) in getRuleList(scope.row.code)">
               {{item.ruleName}}
                <template v-if="index !== getRuleList(scope.row.code).length - 1">
                  、
                </template>
              </template>
            </template>
            <template slot="op" slot-scope="scope">
              <template>
                <el-button @click="showAddDialog(scope.row, 'edit')" type="text" size="small">编辑</el-button>
                <el-button @click="goEmpty(scope.row, 'del')" type="text" size="small">清空</el-button>
              </template>
            </template>
          </ever-table>
        </template>
      </el-col>
    </el-row>
    <el-dialog
      title="编辑校验规则"
      width="600px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="resetForm"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="校验点" prop="region" style="line-height: 30px;">
         <div style="line-height: 30px;">
           {{ruleForm.checkPoint.name}}
         </div>
        </el-form-item>
        <el-form-item label="校验规则" prop="region" v-for="(citem, cindex) in ruleForm.checkRulesList" :key="cindex">
          <el-select v-model="citem.ruleType" placeholder="请选择活动区域" @change="selectChange(cindex)">
            <el-option label="决策表" value="decision_table"></el-option>
            <el-option label="决策树" value="decision_tree"></el-option>
          </el-select>
          <el-select v-model="citem.ruleId" placeholder="请选择校验规则">
            <el-option v-for="(item, index) in getRuleOptions(citem.ruleType, cindex)" :label="item.decisionTableName" :value="item.decisionTableId" :key="item.decisionTableId"></el-option>
          </el-select>
          <i class="icon el-icon-circle-plus-outline" @click="addRuleSelect(cindex)"></i>
          <i v-show="ruleForm.checkRulesList.length > 1" class="icon el-icon-remove-outline"@click="delRuleSelect(cindex)"></i>
        </el-form-item>
        <div style="text-align: right">
          <el-button size="small" type="primary" @click="addSave()" :loading="sureLoading">确定</el-button>
          <el-button size="small" @click="closeAddDialog()">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {request} from '@/util/req'

export default {
  name: 'variable-main',
  props: ['currentVariableObj', 'decisionTableBiztypes'],
  data () {
    return {
      sureLoading: false,
      allSetRules: [],
      tableData: [],
      ruleForm: {
        checkPoint: {},
        checkRulesList: [{
          ruleId: '',
          ruleType: ''
        }]
      },
      dialogVisible: false,
      dialogPropVisible: false,
      checkPointOptions: [],
      ruleTableOption: [],
      ruleTreeOption: [],
      columns: [
        {
          prop: 'jjd',
          label: '检查点',
          slot: 'jjd',
          width: '200'
        },
        {
          prop: 'jjdcode',
          label: '检查点CODE',
          slot: 'jjdcode',
          width: '220'
        },
        {
          prop: 'jygz',
          label: '校验规则',
          slot: 'jygz'
        },
        {
          prop: 'op',
          label: '操作',
          slot: 'op',
          width: '120'
        }
      ],
      rules: {
        constantObjectTypeName: [
          { required: true, message: '请输入常量对象名称', trigger: 'blur' }
        ],
        constantObjectTypeCode: [
          { required: true, message: '请输入常量类路径', trigger: 'blur' }
        ]
      },
    }
  },
  created () {
    this.getCheckPoint()
    this.getList()
    this.getRuleTable()
  },
  methods: {
    addRuleSelect (index) {
      this.ruleForm.checkRulesList.splice(index + 1, 0, {
        ruleId: '',
        ruleType: ''
      })
    },
    delRuleSelect (index) {
      this.ruleForm.checkRulesList.splice(index, 1)
    },
    getRuleOptions (ruleType, citem) {
      if (ruleType === 'decision_table') {
        return this.ruleTableOption
      } else if (ruleType === 'decision_tree') {
        return this.ruleTreeOption
      } else {
        return []
      }
    },
    selectChange (index) {
      this.$set(this.ruleForm.checkRulesList[index], 'ruleId', '')
    },
    getCheckPoint () {
      request('thc-platform-core/valueSetItem/getValueSetItemByCodeForWeb', { 'setCode': 'THC_RULE_BIZ_CHECKPOINT', 'currentPage': 1, 'page': 1, 'pagesize': 1000, 'offset': 0 }).then(res => {
        if (res.head.errCode === 0) {
          this.checkPointOptions = res.data
          this.tableData = res.data
        }
      })
    },
    getRuleTable () {
      request('/rule-engine/decision/table/pageList').then(res => {
        if (res.head.errCode === 0) {
          this.ruleTableOption = res.data.resultList
        }
      })
    },
    handleCurrentChange (val) {
      this.checkParentVariable = val
    },
    resetForm () {
      this.ruleForm = {
        checkPoint: {},
        checkRulesList: [{
          ruleId: '',
          ruleType: ''
        }]
      }
    },
    resetPropForm () {
      this.dialogPropQueryObj.variableObjectPropertyName = ''
      this.dialogPropQueryObj.variableObjectPropertyCode = ''
      this.dialogPropQueryObj.variableObjectPropertyDataType = ''
    },
    getRuleList (code) {
      let templist = []
      this.allSetRules.forEach((item, index) => {
        if (item.bizCode === code) {
          templist.push(item)
        }
      })
      return templist
    },
    getList () {
      this.tableLoading = true
      request('/rule-engine/run/checkpoint/pageList').then((res) => {
        this.tableLoading = false
        if (res.head.errCode === 0) {
          this.allSetRules = res.data.resultList
          console.log('allSetRules', this.allSetRules)
        }
      })
    },
    getListByCode () {
      this.tableLoading = true
      request('/rule-engine/run/checkpoint/pageList', {bizCode: this.ruleForm.checkPoint.code}).then((res) => {
        this.tableLoading = false
        if (res.head.errCode === 0) {
          if (res.data.resultList && res.data.resultList.length !== 0) {
            this.ruleForm.checkRulesList = res.data.resultList
          } else {
            this.ruleForm.checkRulesList = [{
              ruleId: '',
              ruleType: ''
            }]
          }
        }
      })
    },
    handleClick (data) {
      console.log(data)
    },
    showAddDialog (item, type) {
      if (type === 'edit') {
        this.ruleForm.checkPoint = {...item}
        this.getListByCode()
      }
      this.dialogVisible = true
    },
    showAddPropDialog (item, type) {
      if (!(this.checkParentVariable && this.checkParentVariable.variableObjectId)) {
        this.$messageTips(this, 'warning', '请选择变量对象')
        return
      }
      if (type === 'edit') {
        this.dialogPropQueryObj = {...item}
      }
      this.dialogPropVisible = true
    },
    closeAddDialog () {
      this.dialogVisible = false
    },
    closeAddPropDialog () {
      this.dialogPropVisible = false
    },
    goEmpty (tdObj) {
      this.$confirm('确定清空此检查点规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addSave(tdObj)
      }).catch(() => {

      })
    },
    addSave (tdObj) {
      let configList = this.ruleForm.checkRulesList
      let bizCode = this.ruleForm.checkPoint.code
      if (tdObj && tdObj.code) {
        configList = []
        bizCode = tdObj.code
      }
      let isEmpty = false
      configList.forEach((item, index) => {
        if (item.ruleId === '') {
          isEmpty = true
          return
        }
        let tempRuleObj = this.ruleTableOption.find((ritem, index) => {
          return ritem.decisionTableId === item.ruleId
        })
        item.ruleCode = tempRuleObj.decisionTableCode
        item.ruleName = tempRuleObj.decisionTableName
        item.bizCode = this.ruleForm.checkPoint.code
      })
      if (isEmpty) {
        this.$messageTips(this, 'warning', '已添加校验规则不能为空')
        return
      }
      console.log('this.ruleForm.checkRulesList', this.ruleForm.checkRulesList)
      this.sureLoading = true
      request('/rule-engine/run/checkpoint/save', { configList: configList, bizCode: bizCode }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.closeAddDialog()
          this.getList()()
        }
        this.sureLoading = false
      }).catch(() => {
        this.sureLoading = false
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
  .ruleForm {
    .icon {
      font-size: 20px;
      cursor: pointer;
      :hover{
        opacity: 0.8;
      }
    }
  }
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
