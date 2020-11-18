<template>
<div id="establishpackage">
  <el-dialog :title="logTitle" :visible.sync="v" width="80%" class='order ui_dialog_02 spe ' :close-on-click-modal="false" v-loading="logLoding">
    <ever-form2
      class="diy-form"
      :schema="querySchema"
      v-model="queryObj1"
      ref="form2"
      label-position="right"
      :inline="true"
      :is-query="true"
      v-ever-bind-enter
      @query="list(true)"
    >
      <template slot="patientInfo">
        <ever-patient-select ref='inputSeach' v-model="queryObj1.patientId" @select="infoChange" :allowCreate="false" class="focus-packlist"></ever-patient-select>
      </template>
      <template slot="setmealType">
        <el-select v-model="queryObj1.setmealType" placeholder="请选择">
          <el-option
            v-for="item in options.tcfl"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="list(true)">查询</el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <el-form label-width="68px" style="margin-top:20px;">
      <el-form-item label="人员信息">
        <el-select v-model="infos" multiple filterable placeholder="选择角色" style="width:100%">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <ever-form2
      v-if="dialogVisible"
      :schema="querySchema2"
      v-model="queryObj2"
      ref="form"
      :rules="rules"
      :inline="true"
      :nosubmit="true"
    >
      <template slot="contactUnit">
        <el-select v-model="queryObj2.contactUnit" clearable placeholder="请选择">
          <el-option
            v-for="item in options.wldw"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="channelType">
        <el-select v-model="queryObj2.channelType" placeholder="请选择" style="width:100px;">
          <el-option
            v-for="item in options.lx"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="limitUseDate">
        <el-date-picker
          v-model="queryObj2.limitUseDate"
          type="date"
          style="width:150px;"
          value-format="yyyy-MM-dd hh:mm:ss"
          :disabled="eidtDisabled"
          placeholder="选择日期">
        </el-date-picker>
      </template>
      <div slot="default"></div>
    </ever-form2>
    <!-- v-if="historyData.length>0" -->
    <div class="dataContainer">
      <div>
        <div class="diy-tbody">
          <span>可购套餐</span>
          <span>标准售价</span>
          <span>原价</span>
          <span>数量</span>
        </div>
          <el-tree
            :data="data"
            ref="tree"
            show-checkbox
            node-key="id"
            @check-change="handleCheckChange"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span class="diy-tr">{{ data.totalPriceDiss | formatToFinacial}}</span>
              <span class="diy-tr">{{ data.totalPrices | formatToFinacial}}</span>
              <span class="diy-tr">{{ data.totalCount||1}}</span>
            </span>
          </el-tree>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <span>选中售价合计：<p style="color:#ee4433;display:inline-block;margin-right:20px;">￥{{totalAmount | formatToFinacial}}</p></span>
      <el-button @click="closeLog">取消</el-button>
      <el-button type="primary" :loading="payLoading" @click="pay">确认</el-button>
    </span>
  </el-dialog>
  </div>
</template>
<script>

import api from '../../store/packageapi.js'
import { objSortBy, MEPC_ID } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'

export default {
  props: {
    dialogVisible: { // 控制组件显隐藏
      type: Boolean,
      default: false
    },
    initoptions: { // 初始化销售类型和销售人员默认值
      type: Object,
      default () {
        return {}
      }
    },
    isGroup: { // 是否团体下单
      type: Boolean,
      default: false
    },
    groupInfos: { // 团体下单时团体下的患者id
      type: Array,
      default () {
        return []
      }
    },
    infoInputFocus: { // 患者姓名筛选看是否需要自动focus效果
      type: Boolean,
      default: false
    },
    isReturnInfos: { // 下单成功后是否返回当前下单患者信息
      type: Boolean,
      default: false
    }
  },
  data () {
    let rules = {
      saleMan: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      limitUseDate: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    let ruless = {
      patientId: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    let querySchema = [
      {
        label: '套餐分类',
        name: 'setmealType',
        comp: 'custom'
      },
      {
        label: '科室',
        name: 'fitDptId',
        comp: 'ever-subject-select',
        props: {
          type: 'select',
          fields: 'orgSubjectCode'
        }
      },
      {
        label: '套餐名称',
        name: 'name'
      }
    ]
    let querySchema2 = [
      {
        label: '销售员',
        name: 'saleMan',
        comp: 'ever-staff-select',
        props: {
          fields: 'id',
          clearable: true,
          type: 'select'
        },
        span: 4
      },
      {
        label: '使用期限',
        name: 'limitUseDate',
        comp: 'custom',
        span: 12
      }
    ]
    var queryObj1 = this.$ever.createObjFromSchema(querySchema)
    var queryObj2 = this.$ever.createObjFromSchema(querySchema2)
    queryObj1.patientId = ''
    queryObj2['saleManName'] = '' // 销售人员名称
    queryObj2.channelType = '2'
    queryObj1.status = 3
    let patientInit = {
      name: '',
      birthday: '',
      sex: '',
      patientNumber: ''
    }
    return {
      rules,
      ruless,
      logTitle: '套餐下单',
      objSortBy,
      patientInit,
      logLoding: false,
      visible: false,
      patientId: (this.patient && this.patient.id) || '',
      data: [],
      queryObj1,
      queryObj2,
      querySchema,
      querySchema2,
      infos: [], // 团体下单患者id集合
      selectionArrs: [], // 必选项目id集合
      selectionIds: [], // 有效项目id集合
      selectionObj: [], // 有效项目的所有信息集合
      eidtDisabled: false, // 使用期限是否可以修改
      minCounts: {}, //
      personnelInfo: (this.patient && this.patient.id) ? this.patient : JSON.parse(JSON.stringify(patientInit)),
      returnInfo: {},
      totalAmount: '', // 合计金额
      options: {
        wldw: [],
        lx: [
          { id: '1', name: '院内' },
          { id: '2', name: '院外' }
        ],
        tcfl: []
      },
      roles: [],
      payLoading: false
    }
  },
  methods: {
    init () {
      this.initOptions()
      this.initSchemaVal()
      this.initGroupInfos()
    },
    list () { // 如果传patient时则自动初始化基本信息
      this.getTreeData({ categoryId: this.queryObj1.setmealType, status: 3, name: this.queryObj1.name, fitDptId: this.queryObj1.fitDptId }) // 根据套餐分类查询套餐
    },
    initGroupInfos () { // 团体下单时初始化人员信息
      this.logTitle = '团体下单'
      if (!this.isGroup) return
      this.roles = this.groupInfos
      let arr = []
      this.roles.forEach(item => {
        arr.push(item.id)
      })
      this.infos = arr
    },
    initSchemaVal () { // 初始化基本信息默认选中数据
      this.getTypeOptions()
      if (this.schemaVal) {
        this.queryObj2 = Object.assign(this.queryObj2, this.schemaVal)
      }
    },
    initOptions () { // 获取筛选条件options
      this.queryObj2.saleMan = this.$store.state.currentUser.userId
      this.queryObj2.saleManName = this.$store.state.currentUser.name
      api.getInsurance().then(result => {
        for (var insur of result.data) {
          insur.name = insur.insuranceOrgCnName
          insur.id = String(insur.id)
        }
        this.options.wldw = result.data
      })
    },
    infoChange (val) { // 患者姓名获取基本信息
      if (val && val.id) {
        this.queryObj1.patientId = val.id
        this.personnelInfo = val
        this.returnInfo = val
        this.personnelInfo.birthday = val.birthday ? val.birthday.split(' ')[0] : ''
        this.personnelInfo.patientNumber = (val.outpatientNumber !== 'temporary' && val.outpatientNumber) || (val.patientNumber !== 'temporary' && val.patientNumber)
      } else {
        this.personnelInfo = JSON.parse(JSON.stringify(this.patientInit))
      }
    },
    getTreeData (params) {
      this.totalAmount = 0
      this.logLoding = true
      api.searchAvailable(params).then(result => {
        this.initTreeData(result.data.resultList)
      })
    },
    initTreeDataCallback (item, val, lab) {
      lab['parentId'] = val.id
      lab['dptId'] = val.dptId || '' // 将目录所对应的分检科室放到项目上
      lab['grandpaId'] = item.id
      lab['setMealName'] = item.name
      lab['id'] = item.id + '&~&' + val.id + '&~&' + lab.id // 所有的套餐都放在一个tree下，不同套餐下的项目会出现重复，拼接上二级目录id设置默认选项时使用
    },
    initTreeData (data) { // 将底层数据都打上父级和爷级的id，并且设置disabled
      this.foreEachTreeData(data, this.initTreeDataCallback)
      this.data = data
      setTimeout(_ => {
        this.initSelection()
        this.logLoding = false
      }, 500)
    },
    initSelection () {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(this.selectionArrs)
      }
    },
    foreEachTreeData (data, callback) { // 格式化tree数据
      for (let i = data.length - 1; i > -1; i--) {
        let item = data[i]
        item.isTC = true
        if (item.setMealCatalogs) {
          item.children = []
          item.label = item.name
          item.setMealCatalogs.forEach((val, index) => {
            val.children = []
            val.isTwo = true
            val.isAll = val.isAll === 1 // 判断是否全选
            val.isNext = val.isNext === 1
            val.nextIsAll = item.children[index - 1] ? item.children[index - 1]['isAll'] : false
            val.isTwoLevel = item.categoryId === MEPC_ID // 判断是否是体检项目，只有体检项目的二级目录可以追加项目
            val['parentId'] = item.id
            val.label = val.name
            if (val.setMealDetails) {
              val.children = []
              val.setMealDetails.forEach(lab => {
                if (lab.serviceName) {
                  lab.isAll = val.isAll // 判断是否全选
                  lab.isNext = val.isNext // 判断是否关联下一目录
                  lab.nextIsAll = val.nextIsAll
                  lab.label = lab.serviceName
                  lab.totalPrices = lab.totalPrice
                  lab.totalPriceDiss = lab.totalPriceDis
                  callback(item, val, lab)
                  val.children.push(lab)
                }
              })
            }
            if (val.setMealDetails.length > 0) {
              item.children.push(val)
            }
          })
        }
        if (item.setMealCatalogs && item.setMealDetails && item.setMealDetails.length > 0) { // 根目录数据也放到二级目录的数组中
          let totalPrices = 0
          let totalPriceDiss = 0
          let children = []
          item.setMealDetails.forEach(lab => {
            if (lab.serviceName) {
              lab.isgen = true
              lab.label = lab.serviceName
              lab.totalPrices = lab.totalPrice
              lab.totalPriceDiss = lab.totalPriceDis
              totalPrices += lab.totalPrices
              totalPriceDiss += lab.totalPriceDiss
              callback(item, item, lab)
              children.push(lab)
            }
          })
          let diygen = {
            totalPriceDiss: totalPriceDiss,
            totalPrices: totalPrices,
            label: '根目录',
            id: item.id,
            children: children,
            setMealDetails: item.setMealDetails
          }
          item.setMealCatalogs.unshift(diygen)
        }
        if (!item.children || item.children.length === 0) {
          data.splice(i, 1)
        }
      }
    },
    handleCheckChange (data, type, c) {
      if (data.isTC) {
        this.initTotalAmount()
        this.initDuration()
        return
      }
      let arr = []
      let arr2 = []
      let v = []
      let twoId = ''
      if (data.isTwo) { // 点击的是二级目录
        v = this.data.find(item => item.id === data.parentId) // 获取所对应的套餐
        twoId = data.id
      } else if (data.grandpaId && data.parentId) { // 点击的是项目
        v = this.data.find(item => item.id === data.grandpaId)
        twoId = data.parentId
      }
      for (var i = 0; i < v.children.length; i++) {
        let item = v.children[i]
        arr.push({ id: item.id, isAll: item.isAll, isNext: item.isNext })
        arr2.push(item.id)
      } // 以上代码是获取点击都当前勾选框所对应都二级目录，并且将该二级目录所对应套餐的所有二级目录放到数组中
      if (type) { // 如果是选中 则从上往下判断
        if (data.isNext) { // 假如关联了下一目录
          let b = arr.splice(arr2.indexOf(twoId), arr.length)
          let c = []
          for (let i = 1; i < b.length; i++) {
            let item = b[i]
            if (b[i - 1]['isNext'] && item.isAll) { // 当前目录被上一级目录关联，并且本身是项目全选
              c.push(item.id)
            } else {
              break
            }
          }
          let curCheck = this.$refs.tree.getCheckedKeys(true)
          c = c.concat(curCheck)
          this.$refs.tree.setCheckedKeys(c)
        } else { // 假如没有关联下一目录

        }
      } else { // 如果是取消选中 则从下往上判断
        let b = false
        let lastTwo = arr[arr2.indexOf(twoId) - 1]
        if (lastTwo && lastTwo.isNext) {
          let t = v.children.find(item => item.id === lastTwo.id)
          let arr = []
          t.children.forEach(item => {
            arr.push(item.id)
          })
          let curCheck = this.$refs.tree.getCheckedKeys(true)
          let newArr = new Set(curCheck.concat(arr))
          if (newArr.size < arr.length + curCheck.length) { // 如果当前取消目录的上一个目录有已选中的项目，则他不能取消
            b = true
            let checkArr = [data.id, ...curCheck]
            this.$refs.tree.setCheckedKeys(checkArr)
          }
          if (b) {
            this.$messageTips(this, 'error', '请先取消上一目录的选中状态')
          }
        }
      }
      let a = false
      if (data.grandpaId && data.parentId && data.isAll) { // 只有点击底层项目时判断该二级目录是否需要全部选择
        let halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes()
        let json = this.$refs.tree.getCheckedKeys(true)
        halfCheckedNodes.forEach(item => {
          if (item.isTwo && item.children.length > 0 && item.isAll) {
            a = true
            let arr2 = []
            item.children.forEach(lab => {
              arr2.push(lab.id)
            })
            arr2.push(...json)
            this.$refs.tree.setCheckedKeys(arr2)
          }
        })
      }
      if (a && !type) {
        this.$messageTips(this, 'error', '请点击目录取消')
      }
      this.initTotalAmount()
      this.initDuration()
    },
    initTotalAmount () { // 计算有效项目的总价格
      let moneyArr = this.$refs.tree.getCheckedNodes(true)
      let allmoney = 0
      moneyArr.forEach(item => {
        allmoney += Number(item.totalPriceDiss)
      })
      this.totalAmount = allmoney
    },
    initDuration () { // 根据所选套餐中最长的有效期初始化使用期限
      let tcArr = this.$refs.tree.getCheckedNodes()
      let durationNum = 0
      tcArr.forEach(item => {
        if (item.isTC && Number(item.validPeriod) > durationNum) {
          durationNum = Number(item.validPeriod)
          this.eidtDisabled = item.canupdate !== 1
        }
      })
      this.queryObj2.limitUseDate = this.$moment(new Date()).add(durationNum, 'M').format('YYYY-MM-DD HH:mm:ss')
    },
    closeLog () {
      this.$emit('update:dialogVisible', false)
    },
    initInfos () { // 团体下单格式化infos数据
      let arr = []
      this.infos.forEach(item => {
        let obj = {}
        let infoObj = this.roles.find(val => val.id === item) || {}
        obj.patientId = infoObj.id
        obj.setMealTeamId = infoObj.teamId
        arr.push(obj)
      })
      return arr
    },
    async pay () { // 验证信息
      let that = this
      this.payLoading = true
      that.$refs.form.$refs.form.validate(valid => {
        if (!that.personnelInfo.name && !this.isGroup) {
          that.$messageTips(this, 'error', '患者信息不能为空')
          this.payLoading = false
        } else if (this.isGroup && this.infos.length === 0) {
          that.$messageTips(this, 'error', '请至少选择一个人员')
          this.payLoading = false
        } else if (valid) {
          this.selectionObj = this.$refs.tree.getCheckedNodes(true)
          that.ifExistDisabled()
        } else {
          this.payLoading = false
        }
      })
    },
    async ifExistDisabled () { // 验证是否有已停用项目
      let details = this.initPayTreeInfo()
      if (details.length === 0) {
        this.$messageTips(this, 'error', '请选择套餐')
        return
      }
      if (this.count()) return // 判断套餐选中项目数是否达标
      let params = {}
      if (this.isGroup) {
        let ids = this.initInfos()
        params = Object.assign({ teamPatientIds: ids }, this.queryObj1, this.queryObj2)
      } else {
        params = Object.assign({}, this.queryObj1, this.queryObj2)
        if (!params.patientId) params.patientId = this.patientId
      }
      params['details'] = details
      // this.isHistory(params)
      let isService = await api.ifExistDisabledService(this.initParams(params)) // 验证是否有已被停用的项目
      if (isService.data) {
        this.$confirm(isService.data, '信息提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.groupSave(params)
        }).catch(() => {
          this.payLoading = false
        })
      } else {
        this.groupSave(params)
      }
    },
    groupSave (params) { // 团体下单只需要生成订单不需要走一站式支付
      api.groupSave(params).then(result => {
        this.$emit('update:dialogVisible', false)
        this.$emit('establishCallback', true)
        this.$messageTips(this, 'success', '下单成功')
        this.payLoading = false
      })
    },
    initParams (data) {
      let params = JSON.parse(JSON.stringify(data))
      params.details.forEach(item => {
        delete item.detailes
      })
      return params
    },
    count () { // 验证套餐选中项目数是否达标
      let arr = ''
      this.data.forEach(item => {
        if (this.minCounts[item.id] && item.minCount > this.minCounts[item.id]) {
          arr += `套餐${item.name}最低起售数量为${item.minCount}个，现已选${this.minCounts[item.id]}个项目。`
        }
      })
      if (arr) {
        this.$messageTips(this, 'error', arr)
      }
      return !!arr
    },
    initPayTreeInfo () { // 将选中有效项目重新组装
      this.dptIds = []
      let arrs = []
      let obj = {} // 有选中项套餐的选中个数
      this.selectionObj.forEach(item => {
        if (!item.isTwo && !item.isTC) {
          this.dptIds.push(item.dptId || '')
          let ids = item.id.split('&~&')
          if (obj[ids[0]]) {
            obj[ids[0]] += 1
          } else {
            obj[ids[0]] = 1
          }
          arrs.push({
            setMealId: item.grandpaId,
            setMealCatalogId: item.isgen ? '' : item.parentId, // 如果时根目录中的项目时，这个参数传空
            setMealDetailId: item.isAppend ? '' : ids[2], // isAppend为true时为追加项目，id为前端生成，保存时删掉
            serviceId: item.serviceId,
            setMealName: item.setMealName,
            itemNum: item.totalCount,
            totalPrice: item.totalPrice,
            totalPriceDis: item.totalPriceDis,
            price: item.price,
            priceDis: item.priceDis,
            detailes: item.detailes || '',
            isSet: item.isSet || ''
          })
        }
        // this.xmObj[item.serviceId] = item.label
      })
      this.minCounts = obj
      return arrs
    },
    isTwoLevel (node) {
      // 判断是否是二级目录
      return !!node.isTwoLevel
    },
    waitSendList (val) {
      let obj = {}
      if (!val[0]) {
        return []
      }
      // this.orderByWaitData()
      val = objSortBy(val, 'isMain')
      val.map(v => {
        if (obj[v.adviceId]) {
          obj[v.adviceId].push(v)
        } else {
          obj[v.adviceId] = [v]
        }
      })
      return obj
    },
    formatDateTime (inputTime) {
      var date = new Date(inputTime)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      var second = date.getSeconds()
      minute = minute < 10 ? ('0' + minute) : minute
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    emptyData () { // 关闭弹窗时清空数据
      this.personnelInfo = JSON.parse(JSON.stringify(this.patientInit))
      this.queryObj1.patientInfo = ''
      this.queryObj1.setmealType = ''
      this.queryObj1.patientId = ''
      this.queryObj2.contactUnit = ''
      this.queryObj2.channelType = '2'
      this.queryObj2.saleMan = ''
      this.queryObj2.limitUseDate = ''
      this.data = []
      this.historyData = []
      this.dptIds = []
    },
    getTypeOptions () {
      sysvalue.listOnce('THC_MEAL_CLASSIFY_CODE').then(result => {
        this.queryObj1.setmealType = result[0]['id']
        this.options.tcfl = result
        this.getTreeData({ categoryId: this.queryObj1.setmealType, status: 3 })
      })
    },
  },
  computed: {
    v: {
      get () {
        return this.dialogVisible
      },
      set (val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  watch: {
    'patient': {
      handler (val) {
        if (val && val.id) {
          this.patientId = val.id
          this.personnelInfo = val
        } else {
          this.patientId = ''
          this.personnelInfo = JSON.parse(JSON.stringify(this.patientInit))
        }
      },
      deep: true
    },
    'queryObj1.patientId' (val) {
      if (val) {
        this.patientId = val
        this.init()
      } else {
        if (this.patient && this.patient.id) {
          this.patientId = this.patient.id
        } else {
          this.patientId = ''
        }
      }
    },
    'dialogVisible': {
      handler: function (val, oldval) {
        if (val) {
          this.payLoading = false
          this.init()
          if (this.patient && this.patient.id) {
            this.patientId = this.patient.id
            this.personnelInfo = this.patient
          } else {
            this.patientId = ''
            this.personnelInfo = JSON.parse(JSON.stringify(this.patientInit))
          }
          if (this.infoInputFocus) {
            this.$nextTick(() => {
              this.$refs.inputSeach.$el.getElementsByTagName('input')[0].focus()
            })
          }
        } else {
          this.emptyData()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @media screen and (max-width: 1599px) {
    .order /deep/ .el-dialog__body {
      max-height: 600px !important;
      min-height: 550px !important;
    }
  }
  @media screen and (min-width: 1600px) {
    .order /deep/ .el-dialog__body {
      max-height: 750px !important;
    }
  }
  #establishpackage{
    .order {
      line-height: 100% !important;
      /deep/ .el-dialog__body{
        padding-top: 0px;
      }
      /deep/ .el-dialog {
        margin-top:5vh !important;
      }
      .el-dialog__footer{
        border-top: 1px solid #EEEEEE;
      }
      .diy-form{
        border-bottom: 1px solid #eeeeee;
      }
      /deep/ .el-tree-node__content{
        height: 30px;
        border-bottom: 1px solid #eeeeee;
        border-left: 1px solid #eeeeee;
        border-right: 1px solid #eeeeee;
      }
      .personnel-info{
        margin:10px 0;
        font-size: 14px;
        span{
          margin-right:20px;
          color: #000;
        }
        label{
          color: #666666;
        }
      }
      .dataContainer{
        height: calc(~"100vh - 350px");
        overflow: scroll;
      }
      .el-form{
        /deep/ label{
          color: #666666;
        }
      }
      .custom-tree-node {
        margin: 15px 0;
        position: relative;
        width: 100%;
        font-size: 16px;
      }
      .diy-tbody{
        height: 50px;
        line-height: 50px;
        background-color: #EEEEEE;
        span{
          float: right;
          width: 100px;
          text-align: right;
          padding-right:10px;
          box-sizing: border-box;
        }
        :first-child{
          float: left;
          padding-left: 10px;
        }
      }
    }
  }
  .diy-tr{
      width: 100px;
      height: 10px;
      float: right;
      text-align: right;
      padding-right: 10px;
      box-sizing: border-box;
  }
  .type-btn{
    margin: 0 0 0 10px;
    display: inline-block;
    font-size: 12px;
    border-radius: 2px;
    width:45px;
    text-align: center;
    height:25px;
    line-height: 25px;
  }
  .type-btn-1{
    border: 1px solid #EE4433;
    color:#EE4433;
  }
  .type-btn-2{
    border: 1px solid #FF9C00;
    color:#FF9C00;
  }
  .custom-tree-node {
    font-size:14px !important;
  }
</style>

