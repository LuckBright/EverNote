<template>
  <el-container>
    <el-header style="padding: 0 !important; height: auto;">
      <div class="f14 clearfix header-con" :class="!$route.query.directoryId ? 'directoryActive' : ''">
        <span class="f_bold pointer" @click.capture.stop="handleRootClick">{{directoryPackageName}}</span>
        <i class="fr cBlue iconfont icon-tianjia" @click.capture.stop="handleAddDirectory" v-if="!isGroupControl && (packageDetails && !packageDetails.isClinic)"></i>
      </div>
    </el-header>
    <el-main :style="isGroup ? 'padding: 0 !important; height: calc(100vh - 180px);' : 'padding: 0 !important; height: calc(100vh - 228px);'">
      <el-row id="cardlikeNew">
        <el-col v-show="newDirectoryFlag" class="directoryActive cardlike">
          <ever-form2 class="plr15" :schema="schemaDirectory" v-model="objCreate" ref="formCreate" :rules="rules" labelWidth="80px" @submit="submitCreateOrUpdate('formCreate')">
            <template slot="orderNum">
              <ever-number v-model="objCreate.orderNum" placeholder="请输入目录顺序" number-type="number"></ever-number>
            </template>
            <template slot="default">
              <el-col>
                <el-form-item>
                  <el-button type="primary" class="querybtn" @click="submitCreateOrUpdate('formCreate')">确定</el-button>
                  <el-button class="querybtn" @click="resetForm()">取消</el-button>
                </el-form-item>
              </el-col>
            </template>
          </ever-form2>
        </el-col>
        <el-col v-if="tableData.length">
          <el-row>
            <el-col v-for="(item, key) in tableData" :key="key" class="directory f14" :class="isDirectoryId == item.id ? 'directoryActive directoryFixed' : ''">
              <!-- 下面是试试左右结构 -->
              <div :class="$route.query.directoryId == item.id ? 'plr15 directoryActive' : 'plr15'" @click="handleClick(item)">
                <div style="height: 26px; line-height: 26px;">
                  <div class="leftside">
                    <span class="f_bold">{{item.name}}</span>
                  </div>
                  <div class="rightside">
                    <div class="iconContainer" v-if="!isGroupControl && (packageDetails && !packageDetails.isClinic)">
                      <i class="f16 iconfont icon-bingli-bianji" :class="isDirectoryId == item.id ? 'cBlue' : 'cGray'" @click="directoryEdit(item)"></i>
                      <package-confirm @confirm="directoryDelete(item)" :msg="(((item.setMealDetails && item.setMealDetails.length > 0) ? '该目录下已添加了项目，' : '') + '确定要删除吗？')" :iconType="1"></package-confirm>
                    </div>
                  </div>
                </div>
                <div class="pb10"><span>顺序:{{item.orderNum}}</span></div>
                <el-row>
                  <el-col :span="12" v-if="item.isAll">项目全选</el-col>
                  <el-col :span="12" v-if="item.isNext">关联下一目录</el-col>
                </el-row>
              </div>
              <el-col v-show="isDirectoryId == item.id" style="padding: 10px 15px 0; border-top: 1px solid #bbbbbb;" :class="isDirectoryId == item.id ? 'mt10' : ''">
                <el-row>
                  <ever-form2 :schema="schemaDirectory" v-model="objUpdate" ref="formUpdate" :rules="rules" labelWidth="80px" @submit="submitCreateOrUpdate('formUpdate', key)">
                    <template slot="orderNum">
                      <ever-number v-model="objUpdate.orderNum" placeholder="请输入目录顺序" number-type="number"></ever-number>
                    </template>
                    <template slot="default">
                      <el-col>
                        <el-form-item>
                          <el-button type="primary" class="querybtn" @click="submitCreateOrUpdate('formUpdate', key)">确定</el-button>
                          <el-button class="querybtn" @click="handleCancel()">取消</el-button>
                        </el-form-item>
                      </el-col>
                    </template>
                  </ever-form2>
                </el-row>
              </el-col>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-else>
          <ever-no-data></ever-no-data>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import api from '@/card/store/packagemanagement/api'
import PackageConfirm from '@/card/page/packagemanagement/packageconfirm'
import { checkNonNegativeInteger, MEPC_ID } from '@/util/common'
import { STAFF_TYPE } from '@/crm/util/common'

let schemaDirectory = []
let schemaPackage = [
  {
    label: '目录名称',
    name: 'name',
    comp: 'sys-text',
    props: {
      type: 'text',
      placeholder: '请输入目录名称'
    }
  },
  {
    label: '顺序',
    name: 'orderNum',
    comp: 'custom'
  },
  {
    label: '项目全选',
    name: 'isAll',
    comp: 'sys-select',
    props: {
      type: 'singleCheckbox',
      labelNumber: true
    },
    span: 12
  },
  {
    label: '关联下一目录',
    name: 'isNext',
    comp: 'sys-select',
    props: {
      type: 'singleCheckbox',
      labelNumber: true
    },
    span: 12,
    labelWidth: '100px'
  }
]
let schemaMEPC = [
  {
    label: '目录名称',
    name: 'name',
    comp: 'sys-text',
    props: {
      type: 'text',
      placeholder: '请输入目录名称'
    }
  },
  {
    label: '顺序',
    name: 'orderNum',
    comp: 'custom'
  },
  // {
  //   name: 'dptId',
  //   label: '开单科室',
  //   comp: 'everSubjectSelect',
  //   props: {
  //     clearable: true,
  //     type: 'select',
  //     fields: 'id',
  //     isOrg: true
  //   },
  //   span: 12
  // },
  // {
  //   label: '分检医生',
  //   name: 'doctorId',
  //   comp: 'ever-select',
  //   props: {
  //     placeholder: '分检医生',
  //     options: []
  //   },
  //   span: 12
  // },
  {
    label: '项目全选',
    name: 'isAll',
    comp: 'sys-select',
    props: {
      type: 'singleCheckbox',
      labelNumber: true
    },
    span: 12
  },
  {
    label: '关联下一目录',
    name: 'isNext',
    comp: 'sys-select',
    props: {
      type: 'singleCheckbox',
      labelNumber: true
    },
    span: 12,
    labelWidth: '100px'
  }
]
let validateNonNegativeInteger = (rule, value, callback) => {
  if (value === undefined || value === null || value === '') {
    callback(new Error('顺序不能为空'))
  } else if (!checkNonNegativeInteger(value)) {
    callback(new Error('顺序必须为大于等于0的正整数(10位数以内)'))
  } else {
    callback()
  }
}
export default {
  props: ['packageDetails', 'isGroupControl'],
  data () {
    return {
      tableData: [],
      MEPC_ID, // 体检套餐分类id
      orderNumArr: [],
      // doctorOptions: [],
      isDirectoryId: null,
      schemaDirectory,
      objUpdate: {},
      objCreate: {},
      cacheObj: {},
      rules: { orderNum: [{ required: true, validator: validateNonNegativeInteger, trigger: 'blur', type: 'number' }], name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }] },
      categoryId: this.$route.query.categoryId, // 套餐分类
      objId: this.$route.query.packageId,
      newDirectoryFlag: false, // 新建目录
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0,
      directoryPackageName: ''
    }
  },
  created () {
    this._initial()
  },
  methods: {
    submitCreateOrUpdate (fromSubmit, index) { // 创建&更新
      let submitFrom = fromSubmit === 'formCreate' ? this.$refs[fromSubmit] : this.$refs[fromSubmit][index]
      submitFrom.$refs.form.validate(valid => {
        if (valid) {
          let params = {setMealId: this.$route.query.packageId}
          if (fromSubmit === 'formUpdate') {
            Object.assign(params, this.cacheObj, { id: this.objUpdate.id })
            for (let key in this.objUpdate) {
              for (let key1 in params) {
                if (key === key1) params[key1] = this.objUpdate[key]
              }
            }
          } else {
            Object.assign(params, this.objCreate)
          }
          if (!this.checkorderNumIsExist({checkNum: params.orderNum, currentIndex: index})) return this.$messageTips(this, 'warning', '您填写的顺序号已存在请填写其他的顺序号！')
          params.isGroup = this.isGroup
          if (this.$route.meta.type === 'plan') {
            params.orderId = this.$route.query.orderId
          }
          api.createOrUpdateDirectory(params).then(result => {
            if (result) {
              if (fromSubmit === 'formCreate') {
                this.$messageTips(this, 'success', '新增目录成功')
              } else {
                this.$messageTips(this, 'success', '信息更新成功')
                this.handleCancel()
              }
            }
            this.resetForm()
            this.refreshList()
          })
        }
      })
    },
    handleAddDirectory () { // 添加新目录
      let initialVal = 0
      this.tableData.forEach(item => {
        if (item.orderNum > initialVal) {
          initialVal = item.orderNum
        }
      })
      this.objCreate.orderNum = initialVal + 10
      this.handleRootClick()
      this.isDirectoryId = null
      this.newDirectoryFlag = true
      const cardlikeNew = document.querySelector('#cardlikeNew')
      cardlikeNew.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
    },
    // 点击目录
    handleClick (item) {
      this.newDirectoryFlag = false
      this.$router.replace({
        path: this.$route.path,
        query: {...this.$route.query, directoryId: item.id, orderNum: item.orderNum, name: item.name}
      })
    },
    // 点击根目录
    handleRootClick () {
      // 点击根目录去掉url中目录信息
      let query = Object.assign({}, this.$route.query)
      delete query.directoryId
      this.$router.replace({
        path: this.$route.path,
        query
      })
    },
    directoryEdit (item) {
      this.isDirectoryId = item.id
      Object.assign(this.objUpdate, item)
    },
    directoryDelete (item) {
      let params = {id: item.id, isGroup: this.isGroup}
      if (this.$route.meta.type === 'plan') {
        params.orderId = this.$route.query.orderId
      }
      api.deleteDirectory(params).then(result => {
        this.$messageTips(this, 'success', '目录删除成功')
        this.refreshList()
      })
    },
    handleCancel () {
      this.isDirectoryId = null
    },
    resetForm () {
      this.newDirectoryFlag = false
      Object.assign(this.objCreate, this.cacheObj)
    },
    // 新增或者更改之后刷新列表
    refreshList () {
      let params = {id: this.$route.query.packageId, isGroup: this.isGroup}
      if (this.$route.meta.type === 'plan') {
        params.orderId = this.$route.query.orderId
      }
      api.getPackageById(params).then(result => {
        if (result && result.data) this._initialData(result.data)
      })
    },
    checkorderNumIsExist ({checkNum, currentIndex}) {
      let checkRetuen = 'checkRetuen'
      if (this.orderNumArr.length) {
        for (let item of this.orderNumArr) {
          if (checkNum === item) {
            checkRetuen = null
            if (currentIndex > -1 && this.tableData[currentIndex].orderNum === item) checkRetuen = 'checkRetuen'
          }
        }
      }
      return checkRetuen
    },
    createObject () { // 初始创建schema&obj
      this.categoryId === MEPC_ID ? schemaDirectory = schemaMEPC : schemaDirectory = schemaPackage
      return {
        schemaDirectory,
        obj: this.$ever.createObjFromSchema(schemaDirectory)
      }
    },
    _getdptArr (data) { // 获取科室对应医生
      let params = { tenantSubjectIdList: [data.id], typeCodeList: [STAFF_TYPE[0].id] }
      api.getStaffList(params).then(res => {
        if (res && res.data) this.$ever.getFieldFromSchema(this.schemaDirectory, 'doctorId').props.options = res.data.resultList || []
      })
    },
    _initialData (resData) {
      this.orderNumArr = []
      if (resData && resData.setMealCatalogs) this.tableData = resData.setMealCatalogs
      if (resData && resData.categoryId) this.categoryId = resData.categoryId
      this.directoryPackageName = resData.name
      // 将套餐下所有目录的顺序存储起来进行比对
      for (let item of this.tableData) {
        this.orderNumArr.push(item.orderNum)
      }
      this._initial()
      // 左侧新增后相应的name在下一步时添加遍历
      this.$bus.$emit('changeTable', this.tableData)
    },
    async _initial () { // 初始值
      this.schemaDirectory = this.createObject().schemaDirectory
      this.objUpdate = this.createObject().obj
      this.objCreate = this.createObject().obj
      this.cacheObj = JSON.parse(JSON.stringify(this.objCreate))
    }
  },
  watch: {
    'packageDetails': {
      handler: function (val) {
        // 获取套餐目录信息
        if (val) this._initialData(val)
      },
      immediate: true,
      deep: true
    },
    '$route.query.categoryId': {
      handler: function (val) {
        // 获取套餐目录信息
        if (val) {
          this.categoryId = val
          this._initial()
        }
      },
      immediate: true
    },
    // 根据科室id获取医生列表，从sob接口更换warehouse接口,sob不维护了
    'objUpdate.dptId': {
      handler: function (val) {
        if (val) this._getdptArr(val)
      }
    },
    'objCreate.dptId': {
      handler: function (val) {
        if (val) this._getdptArr(val)
      }
    }
  },
  components: {
    PackageConfirm
  }
}
</script>
<style lang="less" scoped>
  .header-con {
    background-color: rgb(238, 238, 238);
    line-height: 40px;
    border-bottom: 1px solid rgb(187, 187, 187);
    padding: 0px 35px 0 15px;
    height: 40px;
    z-index: 99;
    .pointer {
      display: inline-block;
      width: 100%;
    }
    .iconfont {
      position: absolute;
      top: 0;
      right: 10px;
    }
  }
  .plr15 {padding: 10px 15px;}
  .cardlike{
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: .3s;
    border-bottom: 1px solid #bbbbbb;
  }
  .directoryActive{background: #EAF2FC;}
  .directoryFixed { position: fixed; width: 352px; z-index: 99; top: 30%; border-top: 1px solid rgb(187, 187, 187); }
  .directory {border-bottom: 1px solid #bbbbbb;}
  .directory .leftside{float:left;width:80%;}
  .directory .rightside{float:right;width:20%;text-align: right;line-height:26px;}
  .directory .iconContainer {
    vertical-align: middle;
  }
</style>
