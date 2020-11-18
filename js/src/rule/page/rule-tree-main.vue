<template>
  <div :class="{'detail-container': true}">
    <div class="detail-header">
    </div>
    <div class="detail-main">
      <div class="detail-main-inner">
        <div class="detail-main-left">
          <div class="menu-box">
            <div class="btn-box">
              <el-select v-model="ruleType" clearable placeholder="请选择">
                <el-option
                  v-for="item in decisionTableBiztypes"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
              <el-button type="primary" @click="showAddDialog">添加</el-button></div>
            <div class="searchbox">
              <el-input v-model="ruleName" placeholder="请输入内容"></el-input>
            </div>
            <ul>
              <template v-for="(item, index) in ruleTreeList">
                <li v-show="(ruleName === '' || item.decisionTreeName.indexOf(ruleName) > -1) && (!ruleType || item.decisionTreeBiztypeCode === ruleType)" :class="{'checked': currentTree.decisionTreeId === item.decisionTreeId}"
                    @click="goMenuLink(item)">
                  {{item.decisionTreeName}}
                  <i class="icon el-icon-delete" @click.stop="handleDelete(item)"></i>
                  <i class="icon el-icon-edit-outline" @click.stop="showAddDialog(item, 'edit')"></i>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div class="detail-main-right" style="overflow: auto">
          <template  v-if="this.currentTree.decisionTreeId">
            <rule-tree @refresh="refresh" :currentTree="currentTree"></rule-tree>
          </template>
        </div>
      </div>
    </div>
    <el-dialog
      title="添加决策树"
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
        <template  slot="decisionTreeBiztypeCode">
          <el-select v-model="dialogQueryObj.decisionTreeBiztypeCode" clearable placeholder="请选择">
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
    name: 'decisionTreeName',
    label: '决策树名称',
    props: {
      clearable: true,
    }
  },
  {
    name: 'decisionTreeCode',
    label: '决策树code',
    props: {
      clearable: true,
    }
  },
  {
    name: 'decisionTreeBiztypeCode',
    label: '业务类型',
    comp: 'custom',
    props: {
      options: []
    }
  }
]
import ruleTree from './rule-tree'
export default {
  components: {
    ruleTree
  },
  data () {
    const dialogQueryObj = this.$ever.createObjFromSchema(dialogQuerySchema)
    return {
      ruleType: '',
      ruleName: '',
      dialogVisible: false,
      currentTree: {},
      compotents: {
        ruleTree
      },
      menuObj: null,
      ruleTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogQueryObj,
      dialogQuerySchema,
      rules: {
        decisionTreeName: [
          { required: true, message: '请输入决策树名称', trigger: 'change' }
        ],
        decisionTreeCode: [
          { required: true, message: '请输入决策树code', trigger: 'change' }
        ],
        decisionTreeBiztypeCode: [
          { required: true, message: '请选择策树业务类型', trigger: 'change' }
        ]
      },
      decisionTableBiztypes: []
    }
  },
  created () {
    this.resetObj()
    this.getRuleTypes()
    this.getList()
  },
  methods: {
    resetObj () {
      this.dialogQueryObj.decisionTableTypeCode = 1
      this.dialogQueryObj.decisionTableTypeName = '交叉决策树'
      this.dialogQueryObj.tenantId = this.$store.state.currentUser.tenantId
      this.dialogQuerySchema.forEach((item, index) => {
        if (item.name === 'decisionTreeBiztypeCode') {
          item.props.options = this.decisionTableBiztypes
        }
      })
    },
    refresh () {
      this.getList()
    },
    handleDelete (item) {
      this.$confirm('确定删除此决策树, 是否继续?', '提示', {
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
      request('/rule-engine/decision/tree/deleteById', item).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.getList()
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
    getList () {
      request('/rule-engine/decision/tree/pageList').then(res => {
        if (res.head.errCode === 0) {
          this.ruleTreeList = res.data.resultList
        }
      })
    },
    resetForm () {
      this.dialogQueryObj = this.$ever.createObjFromSchema(dialogQuerySchema)
      this.resetObj()
    },
    addSave () {
      this.$refs.dialogForm.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        let tempTypeObj = this.decisionTableBiztypes.find((item, index) => {
          return item.code === this.dialogQueryObj.decisionTreeBiztypeCode
        })
        if (tempTypeObj) {
          this.dialogQueryObj.decisionTreeBiztypeName = tempTypeObj.name
        }
        let url = '/rule-engine/decision/tree/insert'
        if (this.dialogQueryObj.decisionTreeId) {
          url = '/rule-engine/decision/tree/update'
        } else {
          this.dialogQueryObj.decisionTreeJson = '{}'
        }
        request(url, this.dialogQueryObj).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功')
            this.dialogVisible = false
            this.getList()
          }
        })
      })
    },
    getTabelById (id) {
      request('/rule-engine/decision/table/getById', {decisionTreeId: id}).then(res => {
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
    goMenuLink (item) {
      this.currentTree = {}
      setTimeout(() => {
        this.currentTree = {...item}
      }, 100)
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
        z-index: 10;
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
          position: relative;
          z-index: 10;
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
