<template>
    <div class="dis-container">
      <div class="dis-search-header">
        <ever-bread-crumb name="设置摆药规则"  :showTitle="true"></ever-bread-crumb>
      </div>
      <div class="dis-main-content">
        <div class="dis-left-box">
          <div class="add-btn">
            <el-button type="primary" size="medium" @click="addRule">新增</el-button>
          </div>
          <div class="rule-list-box">
            <div class="set-item set-title">摆药规则名称</div>
            <div class="set-item disabled">全部</div>
            <div :class="{'set-item':true, 'checked': obj.id === item.id}"  v-for="(item, index) in ruleList" :key="index" @click="chooseRule(item)"
                v-show="item.ruleType !== 2">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="dis-right-box">
          <ever-form2 v-model="obj" ref="form" :schema="schema" label-width="80px" :rules="rules">
            <template slot="default">
              <div class="btn-box el-col el-col-24">
                <el-button v-show="!editFlag&&obj.id" type="primary" size="medium" @click="changeEdit(true)">编辑</el-button>
                <el-button v-show="editFlag&&obj.id"  size="medium" @click="changeEdit(false)">取消</el-button>
                <el-button v-show="editFlag"  type="primary" size="medium" @click="save">保存</el-button>
              </div>
            </template>
            <div slot="name">
              <template v-if="editFlag">
                <el-input v-model="obj.name" size="medium" placeholder="请输入规则名称"></el-input>
              </template>
              <template v-else>
                {{obj.name}} <el-button v-if="obj.name !== '未分类'" class="del-btn" type="danger" size="medium" @click="delRule(obj)">删除</el-button>
              </template>
            </div>
            <div class="config-item" slot="materialTypes">
              <el-tree
                :data="materialTypes"
                show-checkbox
                default-expand-all
                node-key="id"
                :default-checked-keys="obj.materialTypes || []"
                ref="materialTypes"
                highlight-current
                @check-change="materialTypesChange"
                :props="defaultProps">
              </el-tree>
            </div>
            <div class="config-item" slot="adviceTypes">
              <el-tree
                :data="adviceTypes"
                show-checkbox
                default-expand-all
                :default-checked-keys="obj.adviceTypes || []"
                node-key="id"
                ref="adviceTypes"
                highlight-current
                :props="defaultProps">
              </el-tree>
            </div>
            <div class="config-item" slot="dosageForms">
              <el-tree
                :data="dosageForms"
                :default-checked-keys="obj.dosageForms || []"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="dosageForms"
                highlight-current
                :props="defaultProps">
              </el-tree>
            </div>
            <div class="config-item" slot="employs">
              <el-tree
                :data="employs"
                :default-checked-keys="obj.employs || []"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="employs"
                highlight-current
                :props="defaultProps">
              </el-tree>
            </div>
            <div class="config-item" slot="poisons">
              <div style="padding:0 15px">
                毒麻精放 <br>
                <el-radio-group v-model="obj.poisons">
                  <el-radio :disabled="radioDisable" label="1">是</el-radio>
                  <div style="height: 10px"></div>
                  <el-radio :disabled="radioDisable" label="0">否</el-radio><br>
                </el-radio-group>
              </div>
            </div>
          </ever-form2>
        </div>
      </div>
    </div>
</template>

<script>
import search from '@/warehouse/views/drug/component/search'
import urlObj from '@/warehouse/views/drug/api/focusdispenseapi'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import { request } from '@/util/req'
let schema = [
  {
    name: 'name',
    label: '规则名称：',
    comp: 'custom',
    span: 24
  },
  {
    name: 'materialTypes',
    comp: 'custom',
    labelWidth: '0',
    col: { cla: 'tree-item' },
  },
  {
    name: 'adviceTypes',
    comp: 'custom',
    labelWidth: '0',
    col: { cla: 'tree-item' },
  },
  {
    name: 'dosageForms',
    comp: 'custom',
    labelWidth: '0',
    col: { cla: 'tree-item' },
  },
  {
    name: 'employs',
    comp: 'custom',
    labelWidth: '0',
    col: { cla: 'tree-item' },
  },
  {
    name: 'poisons',
    comp: 'custom',
    labelWidth: '0',
    col: { cla: 'tree-item' },
    // span: 24,
    // props: {
    //   options: [{ name: '1', value: '是' }, { name: '0', value: '否' }]
    // }
  },
]
export default {
  name: 'dispensingtask',
  mixins: [getStorage],
  components: {
    search
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.poisons = '0'
    return {
      editFlag: true,
      materialTypesDisable: ['303', '304'],
      obj,
      schema,
      name: 'setrule',
      ruleList: [],
      materialTypes: [],
      adviceTypes: [],
      dosageForms: [],
      configs: {},
      employs: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
          {
            validator: this.checkName,
            trigger: 'blur'
          }
        ],
        materialTypes: [
          { type: 'array', required: true, message: '必填项', trigger: 'blur' }
        ],
        adviceTypes: [
          { type: 'array', required: true, message: '必填项', trigger: 'blur' }
        ],
        dosageForms: [
          { type: 'array', required: true, message: '必填项', trigger: 'blur' }
        ],
        employs: [
          { type: 'array', required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      radioDisable: false
    }
  },
  created () {
    this.getConfigs()
    this.getRules()
  },
  watch: {
    editFlag: function (val) {
      this.disableTree(!val)
      if (val) {
        this.materialTypesChange()
      }
    }
  },
  methods: {
    changeEdit (flag) {
      this.editFlag = flag
    },
    save () {
      this.obj.storageRoomId = this.storageId
      this.obj.materialTypes = this.$refs.materialTypes.getCheckedKeys(true)
      this.obj.adviceTypes = this.$refs.adviceTypes.getCheckedKeys(true)
      this.obj.dosageForms = this.$refs.dosageForms.getCheckedKeys(true)
      this.obj.employs = this.$refs.employs.getCheckedKeys(true)
      this.$refs.form.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }
        let params = { ...this.obj }
        params.poisons = Array.isArray(this.obj.poisons) ? this.obj.poisons : [this.obj.poisons]
        let url = urlObj.saveRule
        if (this.obj.id) {
          url = urlObj.updRule
        }
        request(url, params, 'post').then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '保存成功')
            if (!this.obj.id) {
              this.obj = res.data
              this.obj.poisons = res.data.poisons[0]
            }
            this.getRules()
            this.editFlag = false
          }
        })
      })
    },
    delRule (item) {
      this.$confirm('确认删除规则' + item.name, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request(urlObj.delRule, {
          id: item.id,
          storageRoomId: this.storageId
        }, 'post').then(_ => {
          this.$messageTips(this, 'success', '删除成功')
          this.resetForm()
          this.getRules(true)
        })
      }).catch(() => { })
    },
    addRule (refes) {
      if (!refes && !this.obj.id) {
        this.$messageTips(this, 'warning', '请保存当前摆药规则后新增')
      }
      this.editFlag = true
      this.resetForm()
    },
    resetForm () {
      this.$refs.form.resetForm(true)
      this.obj.poisons = '0'
      this.$refs.materialTypes.setCheckedNodes([])
      this.$refs.adviceTypes.setCheckedNodes([])
      this.$refs.dosageForms.setCheckedNodes([])
      this.$refs.employs.setCheckedNodes([])
      this.obj.materialTypes = []
      this.obj.adviceTypes = []
      this.obj.dosageForms = []
      this.obj.employs = []
      delete this.obj.id
    },
    getRules (refes) {
      request(urlObj.getRuleList, { storageRoomId: this.storageId }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.ruleList = res.data
          if (refes) {
            if (this.ruleList && this.ruleList.length) {
              this.$nextTick(() => {
                this.chooseRule(this.ruleList[0])
              })
            } else {
              this.addRule(true)
            }
          }
        }
      })
    },
    chooseRule (item) {
      this.editFlag = false
      this.disableTree(true)
      this.obj = { ...item }
      this.obj.poisons = item.poisons ? item.poisons[0] : 0
      this.$refs.materialTypes.setCheckedNodes(item.materialTypes)
      this.$refs.adviceTypes.setCheckedNodes(item.adviceTypes)
      this.$refs.dosageForms.setCheckedNodes(item.dosageForms)
      this.$refs.employs.setCheckedNodes(item.employs)
    },
    disableTree (tempDisable) {
      this.radioDisable = tempDisable
      this.handelConfig(this.configs, tempDisable)
    },
    checkName (rule, value, callback) {
      if (this.obj.id) {
        callback()
        return
      }
      request(urlObj.checkName, { name: value, storageRoomId: this.storageId }, 'post').then(res => {
        if (res.data) {
          callback(new Error('该规则名称已存在'))
        } else {
          callback()
        }
      })
    },
    getConfigs () {
      request(urlObj.getConfigs, {}, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.configs = res
          this.handelConfig(res, false)
        }
      })
    },
    handelConfig (res, disabled) {
      this.materialTypes = [{ id: 10000, label: '物资类型', disabled: true, children: this.formateConfigs(res.data.materialType, disabled) }]
      this.adviceTypes = [{ id: 10000, label: '医嘱类型', disabled: disabled, children: this.formateConfigs(res.data.adviceType, disabled) }]
      this.dosageForms = [{ id: 10000, label: '剂型', disabled: disabled, children: this.formateConfigs(res.data.dosageForm, disabled) }]
      this.employs = [{ id: 10000, label: '给药途径', disabled: disabled, children: this.formateConfigs(res.data.employ, disabled) }]
    },
    formateConfigs (data, disabled) {
      let configArr = []
      for (let key in data) {
        // json对象在键名是数字的情况下，会被自动排序(跟后端协商后在每个键名前添加了一个空格)
        configArr.push({
          label: data[key],
          id: key.trim(),
          disabled: disabled
        })
      }
      return configArr
    },
    materialTypesChange (data, ischeck) {
      if (!this.editFlag) return
      let checks = this.$refs.materialTypes.getCheckedKeys(true)
      let isZ = this.materialTypesDisable.findIndex((item, index) => {
        return checks.indexOf(item) > -1
      })
      let checkDisable = (item) => {
        if (checks.length === 0) {
          return false
        } else if (isZ > -1) {
          return !(this.materialTypesDisable.indexOf(item.id) > -1)
        } else {
          return this.materialTypesDisable.indexOf(item.id) > -1
        }
      }
      this.materialTypes[0].children.map((item, index) => {
        this.$set(item, 'disabled', checkDisable(item))
      })
    }
  }
}
</script>

<style  lang="less" scoped>
  .dis-main-content{
    /deep/ .el-input {
      width: 400px;
    }
    height: calc(~'100vh - 120px');
    position: relative;
    .dis-left-box{
      height: 100%;
      background: #F8F9FA;
      width: 250px;
      position: absolute;
      box-shadow: 0 0 8px 0 rgba(204,204,204,0.36);
      left: 0;
      top: 0;
      box-sizing: border-box;
      padding: 10px 0;
      overflow: auto;
      .add-btn{
        margin-left: 15px;
      }
      .rule-list-box{
        border-top: solid 1px #ededed;
        border-bottom: none;
        margin-top: 10px;
        .set-item{
          border-bottom: solid 1px #ededed;
          font-size: 14px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          background: #fff;
          &:hover{
            cursor: pointer;
            background: #1C7BEF ;
            color: #fff;
          }
          &.checked{
            background: #1C7BEF ;
            color: #fff;
          }
          &.set-title{
            font-weight: bold;
            background: #F4F4F4 !important;
            color: #333 !important;
          }
          &.disabled{
            background: #f9f9f9 !important;
            color: #333;
          }
        }
      }
    }
    .dis-right-box{
      margin-left: 251px;
      box-sizing: border-box;
      height: 100%;
      background: #fff;
      padding: 10px 15px;
      overflow: auto;
      position: relative;
      .del-btn{
        position: absolute;
        right: 10px;
        top: 0px;
      }
    }
    /deep/ .tree-item{
      display: inline-block !important;
      width: auto;
      margin-top: 10px;
    }
    /deep/ .el-form .el-form-item.is-required:not(.not-required) .is-checked .el-checkbox__inner, .el-form .el-form-item.is-required:not(.not-required) .is-checked .el-radio__inner{
      background: #1c7bef !important;
    }
    .config-item{
      display: inline-block;
      margin: 0 15px 0 0;
      border: solid 1px #ededed;
      width: 210px;
      height: 250px;
      overflow: auto;
      background: #F4F5F7;
      /deep/ .el-tree{
        background: #F4F5F7;
      }
    }
    .btn-box{
      width: 100%;
    }
  }
</style>
