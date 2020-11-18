<template>
  <div :class="{'detail-container': true}">
    <div class="detail-header">
    </div>
    <div class="detail-main">
      <div class="detail-main-inner">
        <div class="detail-main-left">
          <div class="menu-box">
            <div class="btn-box">
              <el-select v-model="currentType" clearable placeholder="请选择">
                <el-option
                  v-for="item in decisionTableBiztypes"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
              <el-button type="primary" @click="showAddDialog">添加</el-button></div>
            <div class="searchbox">
              <el-input v-model="currentName" placeholder="请输入内容"></el-input>
            </div>
            <ul>
              <template v-for="(item, index) in ruleTreeList">
                <li v-show="(currentName === '' || item.variableName.indexOf(currentName) > -1) && (currentType === '' || currentType === item.variableBiztypeCode)" :class="{'checked': currentVariable.variableId === item.variableId}"
                    @click="chooseVariable(item)">
                  {{item.variableName}}
                  <i class="icon el-icon-delete" @click="handleDelete(item)"></i>
                  <i class="icon el-icon-edit-outline" @click="showAddDialog(item, 'edit')"></i>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div class="detail-main-right">
          <variable v-if="currentVariable.variableId" :decisionTableBiztypes="decisionTableBiztypes" :currentVariableObj="currentVariable"></variable>
        </div>
      </div>
    </div>
    <el-dialog
      title="添加变量库"
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
        <template slot="variableBiztypeCode">
          <el-select v-model="dialogQueryObj.variableBiztypeCode" clearable placeholder="请选择">
            <el-option
              v-for="item in decisionTableBiztypes"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </template>
        <template slot="default">
          <div style="text-align: right">
            <el-button size="small" type="primary" @click="addSave()">确定</el-button>
            <el-button size="small" @click="closeAddDialog()">取消</el-button>
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
    name: 'variableName',
    label: '变量库名称',
    props: {
      clearable: true,
    }
  },
  {
    name: 'variableBiztypeCode',
    label: '业务类型',
    comp: 'custom',
    props: {
      options: []
    }
  }
]
import variable from './variable'
export default {
  components: {
    variable
  },
  data () {
    const dialogQueryObj = this.$ever.createObjFromSchema(dialogQuerySchema)
    return {
      ruleTypes: [],
      decisionTableBiztypes: [
      ],
      currentType: '',
      currentName: '',
      dialogVisible: false,
      currentVariable: {},
      currentVariableTree: [],
      menuObj: null,
      ruleTreeList: [
        {
          name: '普通决策表',
          id: 1,
        },
        {
          name: '中药十八反',
          id: 2,
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogQueryObj,
      dialogQuerySchema,
      rules: {
        variableName: [
          { required: true, message: '请输入决策表名称', trigger: 'blur' }
        ],
        variableBiztypeCode: [
          { required: true, message: '请输入决策表名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.dialogQueryObj.tenantId = this.$store.state.currentUser.tenantId
    this.dialogQuerySchema.forEach((item, index) => {
      if (item.name === 'variableBiztypeCode') {
        item.props.options = this.decisionTableBiztypes
      }
    })
    this.getList()
    this.getRuleTypes()
  },
  methods: {
    getRuleTypes () {
      request('thc-platform-core/valueSetItem/getValueSetItemByCodeForWeb', { 'setCode': 'RULE_SERVICE_TYPE', 'currentPage': 1, 'page': 1, 'pagesize': 1000, 'offset': 0 }).then(res => {
        if (res.head.errCode === 0) {
          this.decisionTableBiztypes = res.data
          this.dialogQuerySchema.forEach((item) => {
            if (item.name === 'variableBiztypeCode') {
              item.props.options = res.data
            }
          })
        }
      })
    },
    handleDelete (item) {
      this.$confirm('确定删除此变量库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // row.splice(index, 1)
        // return this.api.del(row[index].id)
        return this.del(item)
      }).catch((e) => {
        return false
      })
    },
    del (item) {
      request('/rule-engine/db/variable/deleteById', item).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.getList()
        }
      })
    },
    chooseVariable (item) {
      this.currentVariable = item
    },
    getList () {
      request('/rule-engine/db/variable/pageList', {offset: 0, pagesize: 1000}).then(res => {
        if (res.head.errCode === 0) {
          this.ruleTreeList = res.data.resultList
        }
      })
    },
    resetForm () {
      this.dialogQueryObj = this.$ever.createObjFromSchema(dialogQuerySchema)
      this.resetObj()
    },
    resetObj () {
      this.dialogQueryObj.tenantId = this.$store.state.currentUser.tenantId
      this.dialogQuerySchema.forEach((item, index) => {
        if (item.name === 'variableBiztypeCode') {
          item.props.options = this.decisionTableBiztypes
        }
      })
    },
    addSave () {
      let tempTypeObj = this.decisionTableBiztypes.find((item, index) => {
        return item.code === this.dialogQueryObj.variableBiztypeCode
      })
      if (tempTypeObj) {
        this.dialogQueryObj.variableBiztypeName = tempTypeObj.name
      }
      console.log(this.dialogQueryObj)
      let url = '/rule-engine/db/variable/insert'
      if (this.dialogQueryObj.variableId) {
        url = '/rule-engine/db/variable/update'
      }
      request(url, this.dialogQueryObj).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '保存成功')
          this.closeAddDialog()
          this.getList()
        }
      })
    },
    getTabelById (id) {
      request('/rule-engine/decision/table/getById', {decisionTableId: id}).then(res => {
        if (res.head.errCode === 0) {
          this.dialogQueryObj = res.data
        }
      })
    },
    closeAddDialog () {
      this.dialogVisible = false
    },
    showAddDialog (item, type) {
      if (type === 'edit') {
        this.dialogQueryObj = {...item}
      }
      this.dialogVisible = true
    },
    goMenuLink (url) {
      this.$router.push({
        path: url,
        query: {
          fromType: this.$route.query.fromType,
        }
      })
    },
  },
  mounted () {
    document.addEventListener('click', () => {
      this.menuObj = null
    })
  }
}
</script>

<style lang="less" scoped>
  .searchbox{
    display: flex;
    padding: 5px 10px 0;
  }
  .detail-container {
    height: 100%;
    position: relative;
    display: flex;
    flex-flow: column;
    &.is-frame {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #ffff;
      z-index: 999;
    }
  }
  .detail-header {
    .detail-header-inner {
      min-height: 67px;
      background: #FFFFFF;
      box-shadow: 0 3px 5px 0 rgba(62, 82, 97, 0.06);
      /deep/ .common_head {
        padding-bottom: 0px;
      }
    }
  }
  .detail-main {
    /deep/ .el-dialog__header{
      padding-bottom: 0;
    }
    flex: 1;
    width: 100%;
    height: 0;
    flex-shrink: 0;
    box-sizing: border-box;
    /*padding-top: 104px;*/
    position: relative;
    .detail-main-inner {
      width: 100%;
      height: 100%;
      position: relative;
      &.no-visit-box {
        padding: 30px;
        text-align: center;
        color: #999;
      }
      .detail-main-left {
        display: flex;
        width: 226px;
        height: 100%;
        background: #FDFDFF;
        box-shadow: 0 0 13px 0 rgba(136, 136, 136, 0.13);
        top: 1px;
        left: 0;
        position: absolute;
        padding-top: 14px;
        box-sizing: border-box;
        .menu-box {
          flex: 1;
          height: 100%;
          position: relative;
          top: -5px;
          overflow: auto;
          .btn-box{
            padding: 0 10px;
            display: flex;
            button{
              margin-left: 5px;
            }
          }
          /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
          &::-webkit-scrollbar {
            width: 3px;
            height: 3px;
            background-color: #f5f5f5;
            border-radius: 50px;
          }
          /*定义滚动条的轨道，内阴影及圆角*/
          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgb(239, 239, 239);
            border-radius: 50px;
            background-color: #f5f5f5;
          }
          /*定义滑块，内阴影及圆角*/
          &::-webkit-scrollbar-thumb {
            width: 3px;
            height: 200px;
            border-radius: 200px;
            -webkit-box-shadow: inset 0 0 6px rgb(248, 248, 248);
            background-color: #8f8f8f;
          }
          ul {
            padding: 5px 0 0;
            margin: 0;
            font-size: 12px;
            color: #333333;
            .iconfont {
              color: #878D94;;
              font-size: 13px;
            }
            .el-icon-arrow-right, .el-icon-delete, .el-icon-edit-outline {
              float: right;
              margin-left: 5px;
              &:hover {
                color: darkred;
              }
            }
            li {
              padding: 8px 20px;
              cursor: pointer;
              &:hover {
                color: #4484C9;
                .iconfont {
                  color: #4484C9;
                }
              }
              &.checked {
                color: #4484C9;
                .iconfont {
                  color: #4484C9;
                }
              }
            }
          }
        }
      }
      .detail-main-right {
        width: 100%;
        height: 100%;
        padding-left: 226px;
        box-sizing: border-box;
      }
    }
  }
</style>
