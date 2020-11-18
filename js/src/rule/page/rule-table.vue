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
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <table border="0" cellspacing="0" cellpadding="0" class="ruletable">
      <tr v-for="(tritem, trindex) in trdata">
        <template v-for="(tditem, tdindex) in tritem.tddata">
          <td @contextmenu.prevent="showMenu($event, tritem, trindex ,tditem, tdindex)" :class="tditem.type"
              :rowspan="leftrowspan(tditem.rowspan, tritem, trindex ,tditem, tdindex)"
              :colspan="topcolspan(tditem.colspan, tritem, trindex ,tditem, tdindex)"
              v-if="leftisrepeat(tritem, trindex ,tditem, tdindex) && topisrepeat(tritem, trindex ,tditem, tdindex)">
            <template v-if="(tditem.type === 'disable')">
              {{currentTable.decisionTableName}}
            </template>
            <template v-if="(tditem.type === 'top' || tditem.type === 'left')">
              <el-select size="mini" v-model="tditem.term" placeholder="请选择条件属性"
                         :class="{'term-select': true,'term-select-choose':tditem.term}" @change="(value) => { return tableSelectChange(tditem, value) }">
                <el-option
                  v-for="item in termprops"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </template>
            <template v-if="tditem.type === 'normal'">
              <el-select size="mini" v-model="tditem.term" placeholder="无"
                         :class="{'term-select': true,'term-select-choose':tditem.term && tditem.term !== 'empty'}" @change="tableSelectChange(tditem, trindex, tdindex)">
                <el-option
                  v-for="item in termprops2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>
            </template>
            <el-cascader
              :show-all-levels="!(tditem.term === 'constant')"
              v-show="tditem.term && tditem.term == 'constant' || tditem.term === 'variable'"
              separator="的"
              class="term-select"
              size="mini"
              v-model="tditem.valueArr"
              :options="getCascader(tditem.term)"
              :props="{ expandTrigger: 'hover' }"
              :placeholder="'请选择' + getLabel(tditem.term)"
              @change="changeCascader(tditem.rowspan, tritem, trindex ,tditem, tdindex)"
            />
            <template v-if="tditem.term && tditem.term === 'value'">
              <span v-show="!tditem.showEdit" @click="showEdit(tditem, ('input' + trindex + '#' + tdindex))" style="font-size: 12px; cursor: pointer">
                {{getJSONShowEdit(tditem.value)}}
              </span>
              <el-input :ref="'input' + trindex + '#' + tdindex"  v-show="tditem.showEdit" autofocus="autofocus" @blur="hideEdit(tditem)" @focusout="hideEdit(tditem)" inline=""  type="text" v-model="tditem.value" class="term-select"
                       size="mini"></el-input>
            </template>
            <template v-if="tditem.term && tditem.term === 'jsonvalue'">
              <span style="cursor: pointer" @click="showJsonDialog(tditem, trindex, tdindex)">
                 {{getJSONShowEdit(tditem.jsonvalue)}}
              </span>
            </template>
            <div v-if="tditem.computeObj" class="compute">
              <span v-for="(citem, cindex) in tditem.computeObj.children" :key="cindex">
                {{citem.suanType.label}} {{getComputeRes(citem)}}
                <span v-show="cindex !== (tditem.computeObj.children.length -1) ">
                  {{tditem.computeObj.biType.label}}
                </span>
              </span>
            </div>
          </td>
        </template>
      </tr>
      <div v-if="menuObj" class="td-menu" :style="{'left': + menuObj.left + 'px', 'top': + menuObj.top + 'px'}">
        <div class="menu-item"><a href="javascript:"
                                  @click="showTerm(menuObj.tritem, menuObj.trindex ,menuObj.tditem, menuObj.tdindex)">配置条件 </a>
        </div>
        <div class="menu-item"><a href="javascript:"
                                  @click="addRow(menuObj.tritem, menuObj.trindex ,menuObj.tditem, menuObj.tdindex)">添加条件行 </a>
        </div>
        <div class="menu-item"><a href="javascript:"
                                  @click="addCol(menuObj.tritem, menuObj.trindex ,menuObj.tditem, menuObj.tdindex)">添加条件列 </a>
        </div>
        <div class="menu-item"><a href="javascript:"
                                  @click="delRow(menuObj.tritem, menuObj.trindex ,menuObj.tditem, menuObj.tdindex)">删除行 </a>
        </div>
        <div class="menu-item"><a href="javascript:"
                                  @click="delCol(menuObj.tritem, menuObj.trindex ,menuObj.tditem, menuObj.tdindex)">删除列 </a>
        </div>
      </div>
    </table>
    <el-dialog
      title="配置条件"
      width="800px"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      v-if="dialogShow"
    >
      <org-tree
        @sureClose="sureClose"
        horizontal="horizontal"
        :data="(currentTdObj.tditem.computeObj ? [currentTdObj.tditem.computeObj] : false) || termTree || tree"
        :labelWidth="90"
        :labelClassName="labelClass"
        :render-content="renderContent"
        @on-node-click="onNodeClick"
        @on-node-mouseover="onNodeMouseOver"
        @on-node-mouseout="onNodeMouseOut"
        :variableCurrentOptions="variableCurrentOptions"
        :constantCurrentOptions="constantCurrentOptions"
      />
    </el-dialog>
    <el-dialog
      title="json值编辑"
      width="500px"
      :visible.sync="tdJsonDialog"
      :close-on-click-modal="false"
      v-if="tdJsonDialog"
    >
      <div>
        <el-form :model="jsonForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
          <el-form-item label="决策表显示值" prop="jsonDesc" style="line-height: 30px;">
            <div style="line-height: 30px;">
              <el-input type="text" v-model="jsonForm.jsonDesc"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="决策表返回json" prop="jsonObj" style="line-height: 30px;">
            <div style="line-height: 30px;">
              <el-input type="textarea" v-model="jsonForm.jsonObj"></el-input>
            </div>
          </el-form-item>
          <div style="text-align: right">
            <el-button size="small" type="primary" @click="saveJsonVal()">确定</el-button>
            <el-button size="small" @click="closeJsonDialog()">取消</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orgTree from '@/rule/components/orgtree'
import {request} from '@/util/req'
export default {
  props: ['currentTable'],
  components: {
    orgTree
  },
  data () {
    return {
      jsonForm: {
        jsonDesc: '',
        jsonObj: ''
      },
      rules: {
        jsonDesc: [
          { required: true, message: '决策表显示值', trigger: 'blur' }
        ],
        jsonObj: [
          { required: true, message: '决策表返回json', trigger: 'blur' }
        ]
      },
      tdJsonDialog: false,
      currertSelectTd: {},
      currentClickTd: {},
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
          id: 1,
          children: [{
            label: 'Label ',
            id: 11,
          }]
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
      currentTdObj: {},
      lrowNum: 1,
      lcolNum: 0,
      trowNum: 0,
      tcolNum: 1,
      trdata: [{
        type: 'top',
        tddata: [
          {value: '', colspan: 1, rowspan: 1, type: 'disable', id: 0},
          {value: '', colspan: 1, rowspan: 1, type: 'top', id: 1}
        ]
      }, {
        type: 'left',
        tddata: [
          {value: '', colspan: 1, rowspan: 1, type: 'left', id: 2},
          {value: '', colspan: 1, rowspan: 1, type: 'normal', id: 3}
        ]
      }],
      decisionTableBiztypes: []
    }
  },
  watch: {
    currentTable: {
      handler (val) {
        console.log(val)
        this.getDetail()
      },
      immediate: true
    }
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
    saveJsonVal () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          try {
            console.log(this.jsonForm.jsonObj, this.jsonForm.jsonDesc)
            console.log(JSON.parse(JSON.stringify(this.jsonForm.jsonObj)))
            this.trdata[this.currertSelectTd.trindex].tddata[this.currertSelectTd.tdindex].jsonvalue = JSON.stringify({
              ruleResultResDTO: {
                outPutDesc: this.jsonForm.jsonDesc,
                ruleResultConstantPropertyDTOList: JSON.parse(JSON.stringify(this.jsonForm.jsonObj))
              }
            })
            this.tdJsonDialog = false
          } catch (e) {
            this.$messageTips(this, 'warning', 'json格式错误')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeJsonDialog () {
      this.tdJsonDialog = false
    },
    getJSONShowEdit (val) {
      if (!val) {
        return '点击输入'
      }
      try {
        let tempObj = JSON.parse(val)
        if (tempObj.ruleResultResDTO) {
          return tempObj.ruleResultResDTO.outPutDesc
        } else {
          return val
        }
      } catch (e) {
        return val
      }
    },
    showEdit (tditem, id) {
      this.$set(tditem, 'showEdit', true)
      // tditem.showEdit = true
      setTimeout((item, index) => {
        this.$refs[id][0].focus()
      })
    },
    hideEdit (tditem) {
      this.$set(tditem, 'showEdit', false)
      // tditem.showEdit = false
    },
    getComputeRes (data) {
      if (data.dataType.value === 'constant') {
        return data.cValueChildren.label
      } else if (data.dataType.value === 'variable') {
        return data.vValueChildren.label
      } else if (data.dataType.value === 'value') {
        return data.inputVal
      }
    },
    sureClose (data) {
      this.dialogShow = false
      this.trdata[this.currentTdObj.trindex]['tddata'][this.currentTdObj.tdindex].computeObj = JSON.parse(JSON.stringify(data[0]))
      console.log(this.trdata)
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
      request('/rule-engine/decision/table/getById', {offset: 0, pagesize: 1000, decisionTableId: this.currentTable.decisionTableId}).then(res => {
        if (res.head.errCode === 0) {
          let decisionTableJson = JSON.parse(res.data.decisionTableJson)
          if (!decisionTableJson) return
          this.constantCheckList = decisionTableJson.constantCheckList
          this.variableCheckList = decisionTableJson.variableCheckList
          this.tableTerm = decisionTableJson.tableTerm
          this.tableTermVariable = decisionTableJson.tableTermVariable
          this.trdata = decisionTableJson.tableData
          this.lrowNum = decisionTableJson.lrowNum
          this.lcolNum = decisionTableJson.lcolNum
          this.trowNum = decisionTableJson.trowNum
          this.tcolNum = decisionTableJson.tcolNum
          this.getAllVariableById()
          this.getAllConstantById()
          this.trdata.forEach((item, index) => {
            item.tddata.forEach((titem, tindex) => {
              if (titem.type === 'normal') {
                titem.showEdit = ''
              }
            })
          })
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
      console.log(this.trdata)
      let leftRow = []
      let topRow = []
      let outputRow = []
      // eslint-disable-next-line no-unused-vars
      let isEmpty = false
      this.trdata.forEach((tritem, trindex) => {
        tritem.tddata.forEach((tditem, tdindex) => {
          if (tditem.type === 'left') {
            if (!tditem.valueArr || tditem.valueArr.length === 0) {
              isEmpty = true
              return
            }
            let computeObject = {
              columnNumber: tdindex,
              rowNumber: trindex - this.trowNum - 1,
              dataType: 'variable',
              computeObject: {
                cellColumnNumber: tdindex,
                cellRowNumber: trindex - this.trowNum - 1,
                variableObjectClass: '',
                variableObjectName: '',
                variableObjectPropertyCode: '',
                variableObjectPropertyName: '',
                decisionTableId: this.currentTable.decisionTableId,
                computePosition: 'left'
              }
            }
            this.variableCurrentOptions.forEach((item, index) => {
              if (item.value === tditem.valueArr[0]) {
                computeObject.computeObject.variableObjectClass = item.variableObjectClass
                computeObject.computeObject.variableObjectName = item.variableObjectName
              }
              item.children.forEach((sitem, sindex) => {
                if (tditem.valueArr[1] === sitem.value) {
                  computeObject.computeObject.variableObjectPropertyCode = sitem.variableObjectPropertyCode
                  computeObject.computeObject.variableObjectPropertyName = sitem.variableObjectPropertyName
                }
              })
              computeObject.computeObject.computeFormula = tditem.computeObj ? this.getComputeFormula(tditem, computeObject.computeObject) : ''
            })
            leftRow.push(computeObject)
          } else if (tditem.type === 'top') {
            if (!tditem.valueArr || tditem.valueArr.length === 0) {
              isEmpty = true
              return
            }
            let computeObject = {
              columnNumber: tdindex - 1,
              rowNumber: trindex,
              dataType: 'variable',
              computeObject: {
                cellColumnNumber: tdindex - this.lcolNum - 1,
                cellRowNumber: trindex,
                cellVariableObjectPropertyId: tditem.valueArr[1],
                decisionTableId: this.currentTable.decisionTableId,
                computePosition: 'top'
              }
            }
            this.variableCurrentOptions.forEach((item, index) => {
              if (item.value === tditem.valueArr[0]) {
                computeObject.computeObject.variableObjectClass = item.variableObjectClass
                computeObject.computeObject.variableObjectName = item.variableObjectName
              }
              item.children.forEach((sitem, sindex) => {
                if (tditem.valueArr[1] === sitem.value) {
                  computeObject.computeObject.variableObjectPropertyCode = sitem.variableObjectPropertyCode
                  computeObject.computeObject.variableObjectPropertyName = sitem.variableObjectPropertyName
                }
              })
              computeObject.computeObject.computeFormula = tditem.computeObj ? this.getComputeFormula(tditem, computeObject.computeObject) : ''
            })
            topRow.push(computeObject)
          } else if (tditem.type === 'normal') {
            let outputObject = {
              columnNumber: tdindex - this.lcolNum - 1,
              rowNumber: trindex - this.trowNum - 1,
              dataType: tditem.term,
              outputObject: {
                cellColumnNumber: tdindex - this.lcolNum - 1,
                cellRowNumber: trindex - this.trowNum - 1,
                cellValueConstantObjectPropertyId: '',
                constantObjectPropertyCode: '',
                constantObjectPropertyName: '',
                cellValueVariableObjectPropertyId: '',
                cellValue: '',
                cellValueTypeCode: tditem.term,
                cellValueTypeName: this.getLabel(tditem.term)
              }
            }
            let normalIsEmputy = false
            if (tditem.term === 'constant') {
              this.constantCurrentOptions.forEach((item, index) => {
                item.children.forEach((sitem, sindex) => {
                  if (tditem.valueArr[1] === sitem.value) {
                    normalIsEmputy = true
                    outputObject.outputObject.cellValue = sitem.constantObjectPropertyCode
                    outputObject.outputObject.cellValueConstantObjectPropertyId = sitem.cellValueConstantObjectPropertyId
                    outputObject.outputObject.constantObjectPropertyCode = sitem.constantObjectPropertyCode
                    outputObject.outputObject.constantObjectPropertyName = sitem.constantObjectPropertyName
                  }
                })
              })
            } else if (tditem.term === 'variable') {
              if (tditem.valueArr.length !== 0) {
                outputObject.outputObject.cellValueVariableObjectPropertyId = tditem.valueArr[1]
                normalIsEmputy = true
              }
            } else if (tditem.term === 'value') {
              outputObject.outputObject.cellValue = tditem.value
              normalIsEmputy = true
            } else if (tditem.term === 'jsonvalue') {
              outputObject.outputObject.cellValue = tditem.jsonvalue
              normalIsEmputy = true
            }
            if (normalIsEmputy) {
              outputRow.push(outputObject)
            }
          }
        })
      })
      if (isEmpty) {
        this.$messageTips(this, 'warning', '请选择计算属性')
        return
      }
      // if (!(this.tableTermVariable && Array.isArray(this.tableTermVariable))) {
      //   this.$messageTips(this, 'warning', '请选单元格属性')
      //   return
      // }
      let output = {
        outputColumnNumber: 0,
        decisionTableId: this.currentTable.decisionTableId,
        variableObjectPropertyId: this.tableTermVariable[1]
      }
      let constantList = this.constantCheckList.map((item, index) => {
        return {
          reftype: 'constant',
          decisionTableId: this.currentTable.decisionTableId,
          refid: item
        }
      })

      let variableList = this.variableCheckList.map((item, index) => {
        return {
          reftype: 'variable',
          decisionTableId: this.currentTable.decisionTableId,
          refid: item
        }
      })

      console.log(leftRow, topRow, outputRow, output, constantList, variableList)
      let decisionTableJson = {
        constantCheckList: this.constantCheckList,
        variableCheckList: this.variableCheckList,
        tableTerm: this.tableTerm,
        tableTermVariable: this.tableTermVariable,
        tableData: this.trdata,
        lrowNum: this.lrowNum,
        lcolNum: this.lcolNum,
        trowNum: this.trowNum,
        tcolNum: this.tcolNum,
      }
      this.addSave(Object.assign({}, this.currentTable, { leftRow, topRow, outputRow, output, constantList, variableList, decisionTableJson: JSON.stringify(decisionTableJson) }))
    },
    /**
     * 格式化计算公式
     * @param tditem
     * @param computeObj
     * @returns {string}
     */
    getComputeFormula (tditem, computeObj) {
      let binaryType = tditem.computeObj.biType.value === '1' ? '&&' : '||'
      let tempSting = ''
      tditem.computeObj.children.forEach((item, index) => {
        // eslint-disable-next-line no-unused-vars
        let cvalue = ''
        if (item.dataType.value === 'value') {
          cvalue = item.inputVal
        } else {
          cvalue = item.cValueChildren.constantObjectPropertyCode
        }
        tempSting += '<THC>' +
          '<F>' + item.suanType.value + '</F>' +
          '<V>' + computeObj.variableObjectClass + '#' + computeObj.variableObjectPropertyCode + '</V>' +
          '<C>' + cvalue + '</C>' +
          '</THC>'
        if (index !== tditem.computeObj.children.length - 1) {
          tempSting = tempSting + binaryType
        }
      })
      return tempSting
    },
    addSave (params) {
      request('/rule-engine/decision/table/update', params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.dialogVisible = false
          this.$emit('refresh')
        }
      })
    },
    showMenu (e, tritem, trindex, tditem, tdindex) {
      if (trindex === 0 && tdindex === 0) {
        return
      }
      this.currentTdObj = {
        tritem: tritem,
        trindex: trindex,
        tditem: tditem,
        tdindex: tdindex,
        left: e.clientX,
        top: e.clientY
      }
      this.menuObj = {
        tritem: tritem,
        trindex: trindex,
        tditem: tditem,
        tdindex: tdindex,
        left: e.clientX,
        top: e.clientY
      }
    },
    leftrowspan (rowspan, tritem, trindex, tditem, tdindex) {
      let temprowspan = 1
      this.trdata.forEach((ftritem, ftrindex) => {
        ftritem.tddata.forEach((ftditem, ftdindex) => {
          if (ftdindex === tdindex && trindex < ftrindex && ftditem.id === tditem.id && ftditem.type === 'left') {
            temprowspan++
          }
        })
      })
      if (trindex === 0 && tdindex === 0) {
        temprowspan = rowspan
      }
      return temprowspan
    },
    topcolspan (colspan, tritem, trindex, tditem, tdindex) {
      let tempcolspan = 1
      tritem.tddata.forEach((ttditem, ttdindex) => {
        if (ttdindex > tdindex && ttditem.id === tditem.id && ttditem.type === 'top') {
          tempcolspan++
        }
      })
      if (trindex === 0 && tdindex === 0) {
        tempcolspan = colspan
      }
      return tempcolspan
    },
    leftisrepeat (tritem, trindex, tditem, tdindex) {
      let tempflag = true
      this.trdata.forEach((ftritem, ftrindex) => {
        ftritem.tddata.forEach((ftditem, ftdindex) => {
          if (ftdindex === tdindex && trindex > ftrindex && ftditem.id === tditem.id && ftditem.type === 'left') {
            tempflag = false
          }
        })
      })
      return tempflag
    },
    topisrepeat (tritem, trindex, tditem, tdindex) {
      let tempflag = true
      tritem.tddata.forEach((ttditem, ttdindex) => {
        if (ttdindex < tdindex && ttditem.id === tditem.id && ttditem.type === 'top') {
          tempflag = false
        }
      })
      return tempflag
    },
    findlastabout (tritem, trindex, tditem, tdindex) {
      let temptrIndex = trindex
      this.trdata.forEach((ftritem, ftrindex) => {
        ftritem.tddata.forEach((ftditem, ftdindex) => {
          if (ftdindex === tdindex && ftditem.id === tditem.id) {
            temptrIndex = ftrindex
          }
        })
      })
      return temptrIndex
    },
    delRow (tritem, trindex, tditem, tdindex) {
      if (tditem.type === 'top') {
        let tempIndex = -1
        this.trdata.forEach((item, index) => {
          if (item.type === 'top') {
            tempIndex++
          }
        })
        if (tempIndex > 0) {
          if (trindex === 0) {
            this.trdata[1].tddata.unshift({...this.trdata[0].tddata[0]})
          }
          this.trdata.splice(trindex, 1)
          this.trdata[0].tddata[0].rowspan--
        }
        this.trowNum--
      } else if (tditem.type === 'left') {
        let leftrowspan = this.leftrowspan(tditem.rowspan, tritem, trindex, tditem, tdindex)
        let lettrowNum = this.trdata.length - this.trowNum - 1
        if (leftrowspan === lettrowNum) {
          alert('至少保留一行')
          return
        }
        this.trdata.splice(trindex, leftrowspan)
      }
    },
    addRow (tritem, trindex, tditem, tdindex) {
      if (tditem.type === 'top') {
        let temptddata = []
        let tempres = [...this.trdata[this.trowNum].tddata]
        tempres.forEach((item, index) => {
          if (item.type === 'top') {
            temptddata.push({
              value: '',
              colspan: 1,
              rowspan: 1,
              type: 'top',
              id: new Date().getTime() + index + 'row',
              term: ''
            })
          }
        })
        if (this.trowNum === 0) {
          tempres.splice(0, 1)
        }
        this.trdata.splice(this.trowNum + 1, 0, {
          type: 'top',
          tddata: temptddata
        })
        this.trdata[0].tddata[0].rowspan++
        this.trowNum++
      } else if (tditem.type === 'left') {
        let beforeTd = []
        let afterTd = []
        tritem.tddata.forEach((item, index) => {
          if (item.type === 'left') {
            if (index < tdindex) {
              beforeTd.push({value: '', colspan: 1, rowspan: 1, type: 'left', id: item.id})
            } else {
              beforeTd.push({
                value: '',
                colspan: 1,
                rowspan: 1,
                type: 'left',
                id: new Date().getTime() + index + 'row'
              })
            }
          }
        })
        this.trdata[0].tddata.forEach((item) => {
          if (item.type === 'top') {
            afterTd.push({value: '', colspan: 1, rowspan: 1, type: 'normal', showEdit: false}) // 暂时先写死 top添加列时在改
          }
        })

        let temptr = {
          type: 'left',
          tddata: beforeTd.concat(afterTd)
        }
        let showinseterIndex = this.findlastabout(tritem, trindex, tditem, tdindex)
        this.trdata.splice(showinseterIndex + 1, 0, temptr)
      }
    },
    addCol (tritem, trindex, tditem, tdindex) {
      if (tditem.type === 'left') {
        this.trdata.forEach((item, index) => {
          if (index > this.trowNum) {
            item.tddata.splice(this.lcolNum + 1, 0, {
              value: '',
              colspan: 1,
              rowspan: 1,
              type: 'left',
              id: new Date().getTime() + index + 'col',
              term: ''
            })
          }
        })
        this.trdata[0].tddata[0].colspan++
        this.lcolNum++
      } else if (tditem.type === 'top') {
        let topcolspan = this.topcolspan(tditem.colspan, tritem, trindex, tditem, tdindex)
        this.trdata.forEach((item, index) => {
          if (item.type === 'top') {
            let temptd = {}
            if (index < trindex) {
              if (index === 0) {
                temptd = {
                  value: '',
                  colspan: 1,
                  rowspan: 1,
                  type: 'top',
                  id: item.tddata[tdindex + 1].id,
                  valueArr: item.tddata[tdindex + 1].valueArr,
                  term: item.tddata[tdindex + 1].term,
                }
              } else {
                temptd = {
                  value: '',
                  colspan: 1,
                  rowspan: 1,
                  type: 'top',
                  id: item.tddata[tdindex].id,
                  valueArr: item.tddata[tdindex + 1].valueArr,
                  term: item.tddata[tdindex + 1].term,
                }
              }
            } else {
              temptd = {
                value: '',
                colspan: 1,
                rowspan: 1,
                type: 'top',
                id: new Date().getTime() + index + 'row'
              }
            }
            item.tddata.splice(tdindex + topcolspan + 1, 0, temptd)
          } else {
            item.tddata.splice(this.lcolNum + tdindex + 1, 0, {
              value: '',
              colspan: 1,
              rowspan: 1,
              type: 'normal',
              showEdit: false,
              id: new Date().getTime() + index + 'row'
            })
          }
        })
      }
    },
    delCol (tritem, trindex, tditem, tdindex) {
      if (tditem.type === 'left' && this.lcolNum !== 0) {
        this.trdata.forEach((item, index) => {
          if (index > this.trowNum) {
            item.tddata.splice(tdindex, 1)
          }
        })
        this.trdata[0].tddata[0].colspan--
        this.lcolNum--
      } else if (tditem.type === 'top') {
        let topcolspan = this.topcolspan(tditem.colspan, tritem, trindex, tditem, tdindex)
        let topcollength = this.trdata[0].tddata.length
        if (topcolspan === topcollength - 1) {
          alert('至少保留一列')
          return
        }
        this.trdata.forEach((item, index) => {
          let delindex = tdindex
          if (trindex === 0 && index !== 0) {
            delindex--
          }
          if (index === 0 && trindex !== 0) {
            item.tddata.splice(delindex + 1, topcolspan)
          } else {
            if (item.type === 'top') {
              item.tddata.splice(delindex, topcolspan)
            } else if (item.type === 'left') {
              item.tddata.splice(delindex + this.lcolNum + 1, topcolspan)
            }
          }
        })
      }
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
