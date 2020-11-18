<template>
  <div :class="{'org-tree-node': true, 'is-leaf': isLeaf(data, 'children')}">
    <div class="org-tree-node-label">
      <div class="org-tree-node-label-inner">
        <template v-if="!ruleTree">
          <template v-if="data.type === 'root' && !ruleTree">
            <el-select  v-model="biType" @change="changeVal('biType', biType, biTypeOptions)" name="" placeholder="请选条件">
              <el-option v-for="(item, index) in biTypeOptions" :value="item.value" :label="item.label" :key="item.label"></el-option>
            </el-select>
          </template>
          <template v-if="data.type !== 'root' || ruleTree">
            <el-select v-if="!(data.type === 'root' && ruleTree)" v-model="suanType" @change="changeVal('suanType', suanType, suanTypeOptions)" name="" placeholder="请选条件">
              <el-option v-for="(item, index) in suanTypeOptions" :value="item.value" :label="item.label" :key="item.label"></el-option>
            </el-select>
            <el-select v-show="suanType !== '' || (data.type === 'root' && ruleTree)" name="" v-model="dataType" @change="changeVal('dataType', dataType, dataTypeOptions)" placeholder="请选动作类型">
              <el-option v-for="(item, index) in dataTypeOptions" :value="item.value" :label="item.label" :key="item.label"></el-option>
            </el-select>
            <template  v-if="dataType === 'constant'">
              <el-cascader
                width="150"
                value=""
                label=""
                separator="的"
                class="term-select"
                v-model="cValue"
                :options="constantCurrentOptions"
                :props="{ expandTrigger: 'hover' }"
                :placeholder="'请选择常量'"
                @change="changeVal('cValue', cValue, [])"
              />
            </template>
            <template  v-if="dataType === 'variable'">
              <el-cascader
                width="150"
                value=""
                label=""
                separator="的"
                class="term-select"
                v-model="vValue"
                :options="variableCurrentOptions"
                :props="{ expandTrigger: 'hover' }"
                :placeholder="'请选择变量'"
                @change="changeVal('vValue', vValue, variableCurrentOptions)"
              />
            </template>
            <el-input v-if="dataType === 'value'" type="text" v-model="inputVal" @input="changeVal('inputVal', inputVal)"
                      style="width: 50px; padding: 0"></el-input>
          </template>
          <a href="javascript:" v-if="data.type === 'root' || ruleTree" @click="addChildren">添加</a>
          <a href="javascript:" v-if="data.type !== 'root'" @click="delme">删除</a>
        </template>
        <template v-if="ruleTree">
          <template v-if="data.nodeType !== 'action'">
            <el-select class="suan-select" v-show="data.nodeType === 'normal'" v-model="suanType" @change="changeVal('suanType', suanType, suanTypeOptions)" name="" placeholder="请选条件">
              <el-option  v-for="(item, index) in suanTypeOptions" :value="item.value" :label="item.label" :key="item.label"></el-option>
            </el-select>
            <el-select class="datatype-select" v-show="data.nodeType !== 'action'" name="" v-model="dataType" @change="changeVal('dataType', dataType, dataTypeOptions)" placeholder="请选动作类型">
              <el-option v-show="(data.nodeType === 'variable' && item.value === 'variable') || (data.nodeType === 'normal')" v-for="(item, index) in dataTypeOptions" :value="item.value" :label="item.label" :key="item.label"></el-option>
            </el-select>
            <template  v-if="dataType === 'constant'">
              <el-cascader
                width="150"
                value=""
                label=""
                separator="的"
                class="term-select"
                v-model="cValue"
                :options="constantCurrentOptions"
                :props="{ expandTrigger: 'hover' }"
                :placeholder="'请选择常量'"
                @change="changeVal('cValue', cValue)"
              />
            </template>
            <template  v-if="dataType === 'variable'">
              <el-cascader
                width="150"
                value=""
                label=""
                separator="的"
                class="term-select"
                v-model="vValue"
                :options="variableCurrentOptions"
                :props="{ expandTrigger: 'hover' }"
                :placeholder="'请选择变量'"
                @change="changeVal('vValue', vValue, variableCurrentOptions)"
              />
            </template>
            <el-input v-if="dataType === 'value'" type="text" v-model="inputVal" @input="changeVal('inputVal', inputVal)"
                      style="width: 80px; padding: 0"></el-input>
          </template>
          <template v-if="data.nodeType === 'action'">
            <div style="display: inline-block">
              <div v-for="(aitem, aindex) in data.actionList" style="margin-bottom: 5px">
                <i v-show="data.actionList.length > 1" class="el-icon-remove-outline" style="cursor: pointer" @click="delActionList(aindex)"></i>
                <el-select class="datatype-select" name="" v-model="aitem.dataType" @change="changeVal('dataType', aitem.dataType, dataTypeOptions, aindex)" placeholder="请选动作类型">
                  <el-option v-for="(item, index) in dataTypeOptions" :value="item.value" :label="item.label" :key="item.label"></el-option>
                </el-select>
                <template  v-if="aitem.dataType === 'constant'">
                  <el-cascader
                    width="150"
                    value=""
                    label=""
                    separator="的"
                    class="term-select"
                    v-model="aitem.cValue"
                    :options="constantCurrentOptions"
                    :props="{ expandTrigger: 'hover' }"
                    :placeholder="'请选择常量'"
                    @change="changeVal('cValue', aitem.cValue, [], aindex)"
                  />
                </template>
                <template  v-if="aitem.dataType === 'variable'">
                  <el-cascader
                    width="150"
                    value=""
                    label=""
                    separator="的"
                    class="term-select"
                    v-model="aitem.vValue"
                    :options="variableCurrentOptions"
                    :props="{ expandTrigger: 'hover' }"
                    :placeholder="'请选择变量'"
                    @change="changeVal('vValue', aitem.vValue, variableCurrentOptions, aindex)"
                  />
                </template>
                <el-input v-if="dataType === 'value'" type="text" v-model="aitem.inputVal" @input="changeVal('inputVal', inputVal, [], aindex)"
                          style="width: 80px; padding: 0"></el-input>
              </div>
            </div>
          </template>

          <el-dropdown @command="handleCommand" trigger="click" style="cursor: pointer">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="normal" v-if="data.nodeType !== 'action'" @click="addChildren('normal')">添加条件</el-dropdown-item>
              <el-dropdown-item command="variable" v-if="data.nodeType === 'normal'" @click="addChildren('variable')">添加变量</el-dropdown-item>
              <el-dropdown-item command="action" v-if="data.nodeType === 'normal'" @click="addChildren('action')">添加动作</el-dropdown-item>
              <el-dropdown-item command="actionInner" v-if="data.nodeType === 'action'" @click="addChildren('action')">添加动作</el-dropdown-item>
              <el-dropdown-item command="del" v-if="data.nodeType !== 'root'" @click="delme">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
    </div>

    <div class="org-tree-node-children" v-if="!isLeaf(data, 'children')">
      <template v-if="data.children">
        <org-tree-node
          :ruleTree="ruleTree"
          @sureClose="sureClose"
          v-for="(node, index) in data.children"
          :variableCurrentOptions="variableCurrentOptions"
          :constantCurrentOptions="constantCurrentOptions"
          :data="node" :key="node.id" @delParentChild="delParentChild"
          @delChild="delChild" @addChild="addChild"></org-tree-node>
      </template>
    </div>
  </div>
</template>

<script>
import { GENERATE_SHORT_UUID as U } from '@/bi/util/reportsetuuid'
export default {
  name: 'OrgTreeNode',
  props: {
    ruleTree: {
      type: Boolean,
      default: false
    },
    data: Object,
    props: Object,
    variableCurrentOptions: {
      type: Array,
      default: () => []
    },
    constantCurrentOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      biTypeOptions: [
        {
          label: '并且',
          value: '1',
        },
        {
          label: '或者',
          value: '2',
        },
      ],
      dataTypeOptions: [
        {
          label: '常量',
          value: 'constant',
        },
        {
          label: '变量',
          value: 'variable',
        },
        {
          label: '输入值',
          value: 'value',
        },
      ],
      suanTypeOptions: [
        {
          label: '包含',
          value: 'allContain',
        },
        {
          label: '不包含',
          value: 'notContain',
        },
        {
          label: '大于',
          value: 'greaterThan',
        },
        {
          label: '大于或等于',
          value: 'greaterThanOrEqualTo',
        },
        {
          label: '小于',
          value: 'lessThan',
        },
        {
          label: '小于或等于',
          value: 'lessThanOrEqualTo',
        },
        {
          label: '等于',
          value: 'equalTo',
        },
        {
          label: '不等于',
          value: 'notEqualTo',
        },
        {
          label: '相同(区分大小写',
          value: 'equal',
        },
        {
          label: '不相同(区分大小写）',
          value: 'notEqual',
        },
        {
          label: '相同(不分大小写)',
          value: 'equalIgnoreCase',
        },
        {
          label: '不相同(不分大小写)',
          value: 'notEqualIgnoreCase',
        },
        {
          label: '开始于',
          value: 'startWith',
        },
        {
          label: '不开始于',
          value: 'notStartWith',
        },
        {
          label: '结束于',
          value: 'endWith',
        },
        {
          label: '不结束于',
          value: 'notEndWith',
        },
        {
          label: '在集合',
          value: 'allIn',
        },
        {
          label: '不在集合',
          value: 'notIn',
        },
      ],
      dataType: '',
      suanType: '',
      inputVal: '',
      biType: '',
      vValue: '',
      cValue: '',
    }
  },
  created () {
    console.log(this.constantCurrentOptions)
  },
  watch: {
    data: {
      handler (val) {
        if (val) {
          if (val.type === 'root' && val.biType) {
            this.biType = val.biType.value
          } else if (val.dataType) {
            this.dataType = val.dataType.value
            this.suanType = val.suanType ? val.suanType.value : ''
            this.inputVal = val.inputVal ? val.inputVal : ''
            this.vValue = val.vValueParent ? [val.vValueParent.value, val.vValueChildren.value] : ''
            this.cValue = val.cValueParent ? [val.cValueParent.value, val.cValueChildren.value] : ''
            console.log(this.cValue)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    delActionList (index) {
      this.data.actionList.splice(index, 1)
    },
    handleCommand (command) {
      if (command === 'del') {
        this.delme()
      } else {
        this.addChildren(command)
      }
    },
    isLeaf (data, prop) {
      return !(Array.isArray(data[prop]) && data[prop].length > 0)
    },
    delme () {
      this.$emit('delParentChild', this.data.id)
    },
    addChild () {
      this.$emit('addChild', this.data.id)
    },
    delChild () {
      this.$emit('delChild', this.data.id)
    },
    addChildren (nodeType = 'normal') {
      if (nodeType === 'actionInner') {
        this.data.actionList.push({})
        return
      }
      let variableNodeId = this.data.variableNodeId || this.data.id
      if (this.data.nodeType === 'variable') {
        variableNodeId = this.data.id
      }
      let node = {
        parentNodeId: this.data.id,
        variableNodeId: variableNodeId,
        label: '新节点',
        id: U(),
        nodeType
      }
      if (nodeType === 'action') {
        node.actionList = [{}]
      }
      if (this.data.children) {
        this.data.children.push(node)
      } else {
        this.$set(this.data, 'children', [node])
      }
      console.log(this.data)
      // this.$emit('addChild', this.data.id)
    },
    sureClose () {
      this.$emit('sureClose')
    },
    delParentChild (delId) {
      let delindex = this.data.children.findIndex((item) => {
        return delId === item.id
      })
      if (delindex !== -1) {
        this.data.children.splice(delindex, 1)
      }
      this.$emit('delChild', this.data.id)
    },
    changeVal (type, data, options, aindex) {
      console.log(data)
      if (type === 'vValue') {
        this.variableCurrentOptions.forEach((item, index) => {
          if (item.value === data[0]) {
            let tempParentObj = {...item}
            delete tempParentObj.children
            delete tempParentObj.ruleDbVariableObjectList
            delete tempParentObj.ruleDbVariableObjectPropertyList
            if (aindex || aindex === 0) {
              this.data.actionList[aindex]['vValueParent'] = tempParentObj
            } else {
              this.data['vValueParent'] = tempParentObj
            }
          }
          item.children.forEach((citem, cindex) => {
            let tempcitem = {...citem}
            if (citem.value === data[1]) {
              if (aindex || aindex === 0) {
                delete tempcitem.ruleDbVariableObjectPropertyList
                this.data.actionList[aindex]['vValueChildren'] = tempcitem
              } else {
                this.data['vValueChildren'] = tempcitem
              }
            }
          })
        })
      } else if (type === 'cValue') {
        this.constantCurrentOptions.forEach((item, index) => {
          if (item.value === data[0]) {
            let tempParentObj = {...item}
            delete tempParentObj.children
            delete tempParentObj.ruleDbConstantObjectPropertyList
            if (aindex || aindex === 0) {
              this.data.actionList[aindex]['cValueParent'] = tempParentObj
            } else {
              this.data['cValueParent'] = tempParentObj
            }
          }
          item.children.forEach((citem, cindex) => {
            if (citem.value === data[1]) {
              if (aindex || aindex === 0) {
                this.data.actionList[aindex]['cValueChildren'] = citem
              } else {
                this.data['cValueChildren'] = citem
              }
            }
          })
        })
      } else if (type === 'inputVal') {
        if (aindex) {
          this.data.actionList[aindex]['type'] = data
        } else {
          this.data[type] = data
        }
      } else {
        this.data[type] = options.find((item, index) => {
          return item.value === data
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .org-tree-node-label-inner{
    .suan-select{
      /deep/ .el-input{
        width: 90px;
      }
    }
    .datatype-select{
      /deep/ .el-input{
        width: 90px;
      }
    }
    /deep/ .el-input{
      width: 140px;
    }
  }

</style>
