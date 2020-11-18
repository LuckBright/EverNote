<template>
  <div class="ruletable-box">
    <div class="btn-box">
      引用常量库:
      <el-select v-model="constantCheckList" multiple placeholder="请选择常量库" @change="getAllConstantById">
        <el-option
          v-for="item in constantOptions"
          :key="item.constantId"
          :label="item.constantName"
          :value="item.constantId">
        </el-option>
      </el-select>
      <span style="margin-left: 15px">引用变量库:</span>
      <el-select v-model="variableCheckList" multiple placeholder="请选择变量库" @change="getAllVariableById">
        <el-option
          v-for="item in variableOptions"
          :key="item.variableId"
          :label="item.variableName"
          :value="item.variableId">
        </el-option>
      </el-select>
      <!--      <span style="margin-left: 15px">规则表结果输出到:</span>-->
      <!--      <el-cascader-->
      <!--        value=""-->
      <!--        label=""-->
      <!--        v-show="tableTerm"-->
      <!--        separator="的"-->
      <!--        class="term-select"-->
      <!--        v-model="tableTermVariable"-->
      <!--        :options="variableCurrentOptions"-->
      <!--        :props="{ expandTrigger: 'hover' }"-->
      <!--        :placeholder="'请选择变量'"-->
      <!--      />-->
<!--      <el-button type="primary" @click="save">保存</el-button>-->
    </div>
    <org-tree
      :ruleTree="true"
      @sureClose="sureClose"
      horizontal="horizontal"
      :data="tree"
      :labelWidth="90"
      :labelClassName="labelClass"
      :render-content="renderContent"
      @on-node-click="onNodeClick"
      @on-node-mouseover="onNodeMouseOver"
      @on-node-mouseout="onNodeMouseOut"
      :variableCurrentOptions="variableCurrentOptions"
      :constantCurrentOptions="constantCurrentOptions"
    />
  </div>
</template>

<script>
import { GENERATE_SHORT_UUID as U } from '@/bi/util/reportsetuuid'
import orgTree from '@/rule/components/orgtree'
import {request} from '@/util/req'
export default {
  props: ['currentTree'],
  components: {
    orgTree
  },
  data () {
    return {
      nodeTypeObj: {normal: 'condition', variable: 'choose', action: 'action'},
      tableTermVariable: '',
      tableTerm: 'variable',
      constantCheckList: [],
      variableCheckList: [],
      constantOptions: [],
      variableOptions: [],
      constantCurrentOptions: [],
      variableCurrentOptions: [],
      dialogShow: false,
      termTree: null,
      tree: [
        {
          type: 'root',
          label: 'Owner',
          id: U(),
          nodeType: 'variable',
          parentNodeId: 0,
        }
      ],
      termprops: [
        {
          value: 'variable',
          label: '选择变量'
        }
      ],
      termprops2: [
        {
          value: 'variable',
          label: '选择变量'
        },
        {
          value: 'constant',
          label: '选择常量'
        },
        {
          value: 'value',
          label: '输入值'
        },
        {
          value: 'jsonvalue',
          label: '输入json值'
        },
        {
          value: 'empty',
          label: '清空条件'
        }
      ],
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则'
        }]
      }],
      menuObj: null,
      decisionTableBiztypes: [],
      treeList: [],
      treeBaseList: []
    }
  },
  watch: {

  },
  mounted () {
    document.addEventListener('click', () => {
      this.menuObj = null
    })
  },
  created () {
    this.getRuleTypes()
    this.getConstantList()
    this.getVariableList()
    this.getDetail()
  },
  methods: {
    formateBaseTree (datas) {
      for (let i in datas) {
        this.treeBaseList.push(datas[i])
        if (datas[i].children) {
          this.formateBaseTree(datas[i].children)
        }
      }
    },
    formateTree (datas) {
      for (let i in datas) {
        let formula = ''
        if (datas[i].nodeType === 'normal') {
          formula = this.getComputeFormula(datas[i])
        }
        let ruleDecisionTreeOutputList = []
        if (datas[i].nodeType === 'action') {
          datas[i].actionList.forEach((item, index) => {
            let ruleDecisionTreeOutputObj = {
              decisionTreeId: this.currentTree.decisionTreeId,
              nodeId: datas[i].id,
              outputActionTypeCode: item.dataType,
              outputIndex: parseInt(index) + 1,
              tenantId: this.$store.state.currentUser.tenantId,
              outputValueFormula: ''
            }
            if (item.dataType === 'constant') {
              ruleDecisionTreeOutputObj.constantObjectPropertyName = item.cValueChildren.constantObjectPropertyName
              ruleDecisionTreeOutputObj.constantObjectPropertyId = item.cValueChildren.cellValueConstantObjectPropertyId
              ruleDecisionTreeOutputObj.constantObjectPropertyCode = item.cValueChildren.constantObjectPropertyCode
              ruleDecisionTreeOutputObj.outputValue = item.cValueChildren.constantObjectPropertyName
            } else if (item.dataType === 'variable') {
              debugger
              ruleDecisionTreeOutputObj.variableObjectPropertyCode = item.vValueChildren.variableObjectPropertyCode
              ruleDecisionTreeOutputObj.variableObjectPropertyName = item.vValueChildren.variableObjectPropertyName
              ruleDecisionTreeOutputObj.variableObjectClass = item.vValueParent.variableObjectClass
              ruleDecisionTreeOutputObj.variableObjectName = item.vValueParent.variableObjectName
            } else if (item.dataType === 'value') {
              ruleDecisionTreeOutputObj.outputValue = item.inputVal
            }
            ruleDecisionTreeOutputList.push(ruleDecisionTreeOutputObj)
          })
        }
        this.treeList.push({
          computeFormula: formula,
          nodeId: datas[i].id,
          nodeIndex: parseInt(i) + 1,
          nodeTypeCode: this.nodeTypeObj[datas[i].nodeType],
          decisionTreeId: this.currentTree.decisionTreeId,
          parentNodeId: datas[i].parentNodeId,
          variableObjectClass: datas[i].vValueParent ? datas[i].vValueParent.variableObjectClass : '',
          variableObjectName: datas[i].vValueParent ? datas[i].vValueParent.variableObjectName : '',
          variableObjectPropertyCode: datas[i].vValueChildren ? datas[i].vValueChildren.variableObjectPropertyCode : '',
          variableObjectPropertyName: datas[i].vValueChildren ? datas[i].vValueChildren.variableObjectPropertyName : '',
          ruleDecisionTreeOutputList: ruleDecisionTreeOutputList
        })
        if (datas[i].children) {
          this.formateTree(datas[i].children)
        }
      }
    },
    getFormulaVariable (data) {
      let res = this.treeBaseList.find((item, index) => {
        return item.id === data.variableNodeId
      })
      return res
    },
    getComputeFormula (item) {
      let tempSting = ''
      let cvalue = ''
      if (item.dataType.value === 'value') {
        cvalue = '<C>' + item.inputVal + '</C>'
      } else if (item.dataType.value === 'constant') {
        cvalue = '<C>' + item.cValueChildren.constantObjectPropertyCode + '</C>'
      } else if (item.dataType.value === 'variable') {
        cvalue = '<V>' + item.vValueChildren.variableObjectPropertyCode + '</V>'
      }
      let variable = this.getFormulaVariable(item)
      tempSting += '<THC>' +
        '<F>' + item.suanType.value + '</F>' +
        '<V>' + variable.vValueParent.variableObjectClass + '#' + variable.vValueChildren.variableObjectPropertyCode + '</V>' + cvalue +
      '</THC>'
      return tempSting
    },
    sureClose (data) {
      console.log('trdata', data)
      let root = data[0]
      if (this.sureTreeNodeEmpty(root, root.nodeType)) {
        this.$messageTips(this, 'warning', '请选填决策树节点内容')
        return
      } else if (root.children && (this.isEmpty(root.children))) {
        this.$messageTips(this, 'warning', '请选填决策树节点内容')
      }
      this.formateBaseTree(data)
      this.treeList = []
      this.formateTree(data)
      let decisionTreeJson = {tree: data, constantCheckList: this.constantCheckList, variableCheckList: this.variableCheckList}
      let paramTreeObj = Object.assign({}, this.currentTree, {decisionTreeJson: JSON.stringify(decisionTreeJson), ruleDecisionTreeNodeList: this.treeList})
      console.log('this.treeList', this.treeList)
      this.sureSave(paramTreeObj)
    },
    sureSave (params) {
      console.log(params)
      request('/rule-engine/decision/tree/update', params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.$emit('refresh')
        }
      })
    },
    isEmpty (childrenData) {
      // eslint-disable-next-line no-unused-vars
      let isEmpty = false
      childrenData.forEach((item, index) => {
        if (this.sureTreeNodeEmpty(item, item.nodeType)) {
          isEmpty = true
        } else {
          if (item.children) {
            isEmpty = this.isEmpty(item.children)
          }
        }
        if (isEmpty) {
          return
        }
      })
      return isEmpty
    },
    sureTreeNodeEmpty (data, nodeType) {
      let isEmpty = false
      if (nodeType === 'normal' && !data.suanType) {
        isEmpty = true
      } else if (!data.dataType && nodeType !== 'action') {
        isEmpty = true
      } else if (nodeType !== 'action' && data.dataType.value === 'variable' && (!data.vValueParent || !data.vValueChildren)) {
        isEmpty = true
      } else if (nodeType !== 'action' && data.dataType.value === 'constant' && (!data.cValueParent || !data.cValueChildren)) {
        isEmpty = true
      } else if ((data.dataType.value === 'value') && !data.inputVal) {
        isEmpty = true
      } else if (nodeType === 'action') {
        data.actionList.forEach((item, index) => {
          if (item.dataType.value === 'variable' && (!item.vValueParent || !item.vValueChildren)) {
            isEmpty = true
          } else if (!item.dataType.value === 'constant' && (!item.cValueParent || !item.cValueChildren)) {
            isEmpty = true
          } else if ((item.dataType.value === 'value') && !item.inputVal) {
            isEmpty = true
          }
        })
      }
      return isEmpty
    },
    tableSelectChange (tditem, trindex, tdindex) {
      if (tditem.term === 'empty') {
        this.$set(tditem, 'term', '')
      } else if (tditem.term === 'jsonvalue') {
        this.showJsonDialog(tditem, trindex, tdindex)
      }
    },
    showJsonDialog (tditem, trindex, tdindex) {
      this.currertSelectTd = {tditem, trindex, tdindex}
      this.tdJsonDialog = true
    },
    getCascader (val) {
      if (val === 'variable') {
        return this.variableCurrentOptions
      } else if (val === 'constant') {
        return this.constantCurrentOptions
      } else {
        return []
      }
    },
    getAllConstantById () {
      request('/rule-engine/db/constant/getByIdList', {idList: this.constantCheckList}).then(res => {
        if (res.head.errCode === 0) {
          let tempOption = res.data.length > 0 ? this.handelAllConstant(res.data) : []
          this.constantCurrentOptions = []
          tempOption.forEach((item) => {
            item.value = item.constantObjectId
            item.label = item.constantObjectTypeName
            item.children = []
            item.ruleDbConstantObjectPropertyList.forEach((subitem) => {
              item.children.push({
                value: subitem.constantObjectPropertyId,
                label: subitem.constantObjectPropertyName,
                constantObjectPropertyCode: subitem.constantObjectPropertyCode,
                constantObjectPropertyName: subitem.constantObjectPropertyName,
                cellValueConstantObjectPropertyId: subitem.constantObjectPropertyId,
              })
            })
          })
          this.constantCurrentOptions = tempOption
        }
      })
    },
    handelAllConstant (data) {
      let tempArr = []
      data.forEach((item, index) => {
        tempArr = tempArr.concat(item.ruleDbConstantObjectList)
      })
      return tempArr
    },
    getAllVariableById () {
      request('/rule-engine/db/variable/getByIdList', {idList: this.variableCheckList}).then(res => {
        if (res.head.errCode === 0) {
          let tempOption = res.data.length > 0 ? this.handelAllVariable(res.data) : []
          this.variableCurrentOptions = []
          tempOption.forEach((item) => {
            item.value = item.variableObjectId
            item.label = item.variableObjectName
            item.variableObjectClass = item.variableObjectClass
            item.variableObjectName = item.variableObjectName
            item.children = []
            item.ruleDbVariableObjectPropertyList.forEach((subitem) => {
              item.children.push({
                value: subitem.variableObjectPropertyId,
                label: subitem.variableObjectPropertyName,
                variableObjectPropertyCode: subitem.variableObjectPropertyCode,
                variableObjectPropertyName: subitem.variableObjectPropertyName,
              })
            })
          })
          this.variableCurrentOptions = tempOption
        }
      })
    },
    handelAllVariable (data) {
      let tempArr = []
      data.forEach((item, index) => {
        tempArr = tempArr.concat(item.ruleDbVariableObjectList)
      })
      return tempArr
    },
    getConstantList () {
      request('/rule-engine/db/constant/pageList', {offset: 0, pagesize: 1000}).then(res => {
        if (res.head.errCode === 0) {
          this.constantOptions = res.data.resultList
        }
      })
    },
    getVariableList () {
      request('/rule-engine/db/variable/pageList', {offset: 0, pagesize: 1000}).then(res => {
        if (res.head.errCode === 0) {
          this.variableOptions = res.data.resultList
        }
      })
    },
    getDetail () {
      request('/rule-engine/decision/tree/getById', {offset: 0, pagesize: 1000, decisionTreeId: this.currentTree.decisionTreeId}).then(res => {
        if (res.head.errCode === 0) {
          let decisionTreeJson = JSON.parse(res.data.decisionTreeJson)
          if (!decisionTreeJson || res.data.decisionTreeJson === '{}') return
          this.constantCheckList = decisionTreeJson.constantCheckList
          this.variableCheckList = decisionTreeJson.variableCheckList
          this.tree = decisionTreeJson.tree
          this.getAllVariableById()
          this.getAllConstantById()
        }
      })
    },
    getRuleTypes () {
      request('thc-platform-core/valueSetItem/getValueSetItemByCodeForWeb', { 'setCode': 'RULE_SERVICE_TYPE', 'currentPage': 1, 'page': 1, 'pagesize': 1000, 'offset': 0 }).then(res => {
        if (res.head.errCode === 0) {
          this.decisionTableBiztypes = res.data
        }
      })
    },
    showTerm  (tritem, trindex, tditem, tdindex) {
      if (tditem.termTree) {
        this.termTree = tditem.termTree
      } else {
        this.termTree = null
      }
      this.dialogShow = true
    },
    labelClass (data) {
      return 'bg_node'
    },
    renderContent (h, data) {
      return data.label
    },
    onNodeClick (e, data) {
      console.log('CLICK', e)
    },
    onNodeMouseOver (e, data) {
      // alert('MOUSE OVER - ')
    },
    onNodeMouseOut (e, data) {
      console.log('MOUSEOUT', e)
    },
    getLabel (term) {
      let templabel = this.termprops2.find((item, index) => {
        return item.value === term
      })
      if (templabel) {
        return templabel.label
      }
    },
    changeCascader (rowspan, tritem, trindex, tditem, tdindex) {
      this.trdata.forEach((ftritem, ftrindex) => {
        ftritem.tddata.forEach((ftditem, ftdindex) => {
          if (tditem.type === 'left' && tdindex === ftdindex && ftditem.type === 'left') {
            ftditem.term = tditem.term
            ftditem.valueArr = tditem.valueArr
          } else if (tditem.type === 'top' && trindex === ftrindex && ftditem.type === 'top') {
            ftditem.valueArr = tditem.valueArr
            ftditem.term = tditem.term
          }
        })
      })
    },
    save () {
    },
  }
}
</script>

<style lang="less" scoped>
  .td-menu{
    a{
      color: #666;
      font-size: 12px;
      display: block;
      padding: 5px 0;
      &:hover{
        color: #0f78f3;
      }
    }
  }
  .btn-box{
    padding-bottom: 10px;
  }
  .ruletable-box{
    display: inline-block;
    box-sizing: border-box;
    padding: 10px;
    font-size: 14px;
  }
  .ruletable {
    border-collapse: collapse;
    .compute{
      font-size: 12px;
    }
    .td-menu {
      display: inline-block;
      position: fixed;
      width: 150px;
      height: auto;
      background: #fff;
      border: solid 1px #ddd;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 10px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
      &::before {
        position: absolute;
        top: -7px;
        left: 9px;
        display: inline-block;
        border-right: 7px solid transparent;
        border-bottom: 7px solid #ccc;
        border-left: 7px solid transparent;
        border-bottom-color: rgba(0, 0, 0, 0.2);
        content: '';
      }
      &::after {
        position: absolute;
        top: -6px;
        left: 10px;
        display: inline-block;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #ffffff;
        border-left: 6px solid transparent;
        content: '';
      }
    }
    td {
      border: solid 1px #ccc;
      padding: 5px 10px;
      min-height: 125px;
      box-sizing: border-box;
      text-align: center;
      &.disable {
        background: #f8f8f8;
      }
      &.top {
        background: #f3f8ff;
      }
      &.left {
        background: #f5fdf1;
      }
      position: relative;
      &:hover {
        .td-menu {
          display: block;
        }
      }
    }
    .term-select {
      /deep/ .el-input__inner {
        padding-left: 5px;
        background: transparent;
        text-align: center;
        border: hidden;
        color: #666;
        display: inline-block;
      }
      &.el-input {
        display: inline-block;
        width: auto;
        border: solid 1px #ccc;
      }
      /deep/ .el-input__suffix{
        display: none !important;
      }
      /deep/ .el-input__inner::-webkit-input-placeholder {
        color: #666;
      }
      /deep/  .el-input.el-input--suffix .el-input__inner {
        padding-right: 0;
        padding-left: 0;
      }
      &.term-select-choose {
        width: 5px;
        height: 5px;
        background: red;
        margin-right: 0;
        border-radius: 200px;
        position: relative;
        overflow: hidden;
      }
    }
  }
</style>
