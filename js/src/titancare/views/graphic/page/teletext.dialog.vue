<template>
  <div class="teletext-dialog">
    <div class="item">
      <span class="name">{{data.doctorName}}</span>
      <span class="position">{{data.title}}</span>
    </div>
    <div class="item">
      <span class="label">互联网医院权限</span>
      <el-switch v-model="data.online" :disabled="!isModify" @change="changeOnline"></el-switch>
    </div>
    <template v-if="data.online">
      <div class="item">
      <span class="label">选择执业机构</span>
      <ever-select
        size="small"
        :options="options.orgIdOption"
        v-model="data.orgId"
        @change="getDepaList"
        filterable
        :disabled="!isModify"
      ></ever-select>
      </div>
      <div class="item">
        <span class="label">选择执业科室</span>
        <ever-select
          size="small"
          :options="options.tenantSubjectIdOption"
          v-model="data.departmentCode"
          @change="getTenantName"
          filterable
          :disabled="!isModify"
        ></ever-select>
      </div>
      <div class="item divider"></div>
      <div class="item title">
        视频问诊服务
      </div>
      <div class="item">
        <span class="label">是否开通服务</span>
        <el-switch v-model="videoData.status" :disabled="!isModify" @change="changeOnline"></el-switch>
        <span class="ml20">{{videoData.status ? '开通' : '未开通'}}</span>
      </div>
      <div class="item divider"></div>
      <div class="item title">
        图文问诊服务
      </div>
      <div class="item">
        <span class="label">是否开通服务</span>
        <el-switch v-model="imgData.status" :disabled="!isModify" @change="changeOnline"></el-switch>
        <span class="ml20">{{imgData.status ? '开通' : '未开通'}}</span>
      </div>
      <template v-if="imgData.status">
        <div class="item">
          <span class="label">设置默认服务</span>
          <el-select
            class="w200"
            size="small"
            v-model="imgData.serviceId"
            @change="getValue"
          >
            <el-option
              v-for="item in options.priceOptions"
              :key="item.id"
              :value="item.id"
              :label="item.label"
            ></el-option>
          </el-select>
          <span class="red ml20">
            医生无需排班时，请设置默认服务项目，否则无法接诊。
          </span>
        </div>
        <div class="item">
          <span class="label">修改服务价格</span>
          <el-input-number
            :min="0"
            :max="9999"
            v-model="imgData.price"
            size="small"></el-input-number>
          <span class="pl20">元/次</span>
        </div>
        <div class="item">
          <span class="label">医生自主定价</span>
          <el-switch v-model="imgData.allowCustom" :disabled="!isModify"></el-switch>
          <span class="ml5">{{imgData.allowCustom ? '允许' : '不允许'}}</span>
          <template v-if="imgData.allowCustom">
            <span class="pl20">设置价格上限</span>
            <el-input-number class="ml20"
                             :min="0"
                             :max="9999"
                             v-model="imgData.customPriceMax"
                             size="small"></el-input-number>
            <span class="pl20">元/次</span>
          </template>
        </div>
      </template>
      <div class="item divider"></div>
      <div class="item title">
        在线咨询服务
      </div>
      <div class="item">
        <span class="label">是否开通服务</span>
        <el-switch v-model="onlineData.status" :disabled="!isModify" @change="changeOnline"></el-switch>
        <span class="ml20">{{onlineData.status ? '开通' : '未开通'}}</span>
      </div>
      <template v-if="onlineData.status">
        <div class="item">
          <span class="label">设置默认服务</span>
          <el-select
            class="w200"
            size="small"
            v-model="onlineData.serviceId"
            @change="getOnlineValue"
          >
            <el-option
              v-for="item in options.priceOptions2"
              :key="item.id"
              :value="item.id"
              :label="item.label"
            ></el-option>
          </el-select>
          <span class="red ml20">
            医生无需排班时，请设置默认服务项目，否则无法接诊。
          </span>
        </div>
        <div class="item">
          <span class="label">修改服务价格</span>
          <el-input-number
            :min="0"
            :max="9999"
            v-model="onlineData.price"
            size="small"></el-input-number>
          <span class="pl20">元/次</span>
        </div>
        <div class="item">
          <span class="label">医生自主定价</span>
          <el-switch v-model="onlineData.allowCustom" :disabled="!isModify"></el-switch>
          <span class="ml5">{{onlineData.allowCustom ? '允许' : '不允许'}}</span>
          <template v-if="onlineData.allowCustom">
            <span class="pl20">设置价格上限</span>
            <el-input-number class="ml20"
                             :min="0"
                             :max="9999"
                             v-model="onlineData.customPriceMax"
                             size="small"></el-input-number>
            <span class="pl20">元/次</span>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import api from '@/titancare/api/homemanage/homemanageapi'
import './teletext.dialog.less'
// import serviceApi from '@/titancare/api/business/index'

export default {
  props: [ 'result', 'isAllSend' ],
  data () {
    return {
      // 是否需要自定义
      // showImg: false,
      data: {},
      api,
      options: {
        orgIdOption: [],
        tenantSubjectIdOption: [],
        priceOptions: [],
        priceOptions2: [],
      },
      dialogData: this.result,
      isDisabledMaxPrice: true,
      isShowPrice: false,
      disabledOrgId: true, // 开通业务
      disabledAll: true, // 开通互联网医院1
      isModify: true, // 判断是否有未完成的图文问诊 true 可修改
      imgData: {},
      videoData: {},
      onlineData: {},
    }
  },
  created () {
    this.imgData = this.getData(this.result.find(item => item.serviceTypeCode === '1') || {})
    this.videoData = this.getData(this.result.find(item => item.serviceTypeCode === '4') || {})
    this.onlineData = this.getData(this.result.find(item => item.serviceTypeCode === '8') || {})
    this.data = {
      ...(this.imgData.serviceTypeCode ? this.imgData : this.videoData),
    }
    // this.data = { ...this.result }
    this.getOrgList()
    // this.dialogData.forEach((item, index) => {
    //   this.isDisabledMaxPrice = Number(item.allowCustom) !== 1
    //   this.disabledOrgId = Number(item.status) !== 1
    //   this.disabledAll = Number(item.online) !== 1
    //   this.isShowPrice = item.itemCode === 'TWWZZDY'
    this.getDepaList(this.data.orgId, true)
    // })
    if (!this.isAllSend) {
      this.getDocStatus()
    }
    // serviceApi.getServiceItemConfig.call(this).then(rs => {
    //   if (!rs.errCode) {
    //     this.showImg = !rs.data.arrange
    //   }
    // })
  },
  methods: {
    getData (data) {
      return {
        ...data,
        status: !!data.status,
        online: data.online === 1,
        allowCustom: data.allowCustom === 1,
        allowCustomPatient: data.allowCustomPatient === 1,
      }
    },
    oninput (p, v, type) {
      p[type] = (v.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    // 获取机构
    getOrgList () {
      api.getOrgListByCondition().then(res => {
        if (res && res.errCode === 0) {
          res.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.code
            obj.name = item.name
            this.options.orgIdOption.push(obj)
          })
        }
      })
    },
    getDepaList (id, isFirst) {
      if (isFirst === undefined) {
        this.data.departmentCode = ''
        this.data.serviceId = ''
        this.isShowPrice = false
      }
      this.options.tenantSubjectIdOption = []
      this.options.priceOptions = []
      this.options.priceOptions2 = []
      if (id) {
        this.getPrice(id)
        this.getPrice(id, '2')
      }
      let params = {
        orgIdList: [ id ],
        type2CodeList: [ '01.02' ],
        offset: 0,
        pagesize: 1000,
      }
      api.getTenant(params).then(res => {
        if (res && res.errCode === 0) {
          res.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.name = item.tenantSubjectName
            this.options.tenantSubjectIdOption.push(obj)
          })
        }
      })
      this.options.orgIdOption.forEach(item => {
        if (item.id === id) this.data.orgName = item.name
      })
    },
    getTenantName (id) {
      this.options.tenantSubjectIdOption.forEach(item => {
        if (item.id === id) this.data.department = item.name
      })
    },
    getValue (id) {
      this.options.priceOptions.forEach(item => {
        if (item.id === id) {
          this.imgData.itemName = item.name
          this.imgData.itemCode = item.code
          this.imgData.itemType = item.serviceClassification
          this.imgData.finType = item.finType
          this.imgData.price = item.price
          this.isShowPrice = item.priceName === '自定义'
        }
      })
    },
    getOnlineValue (id) {
      this.options.priceOptions2.forEach(item => {
        if (item.id === id) {
          this.onlineData.itemName = item.name
          this.onlineData.itemCode = item.code
          this.onlineData.itemType = item.serviceClassification
          this.onlineData.finType = item.finType
          this.onlineData.price = item.price
          this.isShowPrice = item.priceName === '自定义'
        }
      })
    },
    getPrice (orgId, type = '1') {
      let params = {
        'serviceName': type === '1' ? '图文问诊' : '在线咨询',
        config: {
          'headers': {
            'x-org-id': orgId,
            'titan-org-id': orgId,
          },
        },
      }
      api.getPriceList(params).then(res => {
        if (res.errCode === 0) {
          if (type === '1') {
            this.options.priceOptions = res.data.resultList.map(item => ({
              ...item, label: item.priceName,
            }))
          } else if (type === '2') {
            this.options.priceOptions2 = res.data.resultList.map(item => ({
              ...item, label: item.priceName,
            }))
          }
          // res.data.resultList.forEach(item => {
          //   let obj = Object.assign({}, item)
          //   obj.id = item.id
          //   obj.label = item.priceName
          //   if (type === '1') {
          //     this.options.priceOptions.push(obj)
          //   } else if (type === '2') {
          //     this.options.priceOptions2.push(obj)
          //   }
          // })
        }
      })
    },
    /**
     * 医生定价开关
     */
    changeAllowCustom (status) {
      this.isDisabledMaxPrice = status === false
      this.data.customPriceMax = ''
      this.data.allowCustomPatient = false
    },
    /**
     * 是否开通图文问诊
     */
    changeStatus (status) {
      this.disabledOrgId = !status
    },
    /**
     是否开通互联网医院 */
    changeOnline (status) {
      this.disabledAll = !status
    },
    /**
     *查询当前医生是否有未完成的图文问诊
     * */
    getDocStatus () {
      let params = {
        idList: [ { doctorId: this.data.doctorId, doctorName: this.data.doctorName } ],
        tenantId: this.data.tenantId,
      }
      api.weatherHaveCounselBeingProcessed(params).then(rs => {
        if (!rs.errCode) {
          if (rs.data.length) {
            this.isModify = false
            this.tipText()
          }
        }
      })
    },
    /**
     * 不可修改提示
     * */
    tipText () {
      this.$notify({
        title: '设置提醒',
        type: 'warning',
        message: '当前医生有未完成图文问诊，无法进行更改操作。否则将影响医生的接诊和开方操作。',
      })
    },
  },
  watch: {
    'result': function (val, old) {
      this.dialogData = val
    },
  },
}
</script>
<style lang='less' scoped>
  /*.teletext-dialog {*/
  /*  /deep/.el-table__body-wrapper*/
  /*    .el-table__body*/
  /*    .el-input*/
  /*    .el-input-group__append {*/
  /*    border: 1px solid #e4e7ed;*/
  /*  }*/
  /*}*/
  /*.switch_span {*/
  /*  margin-left: 5px;*/
  /*}*/
</style>
