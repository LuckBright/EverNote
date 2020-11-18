<template>
  <div class="dis-container">
    <div class="dis-search-header">
      <ever-form2 ref="manageForm"  :inputQuery='false' :schema="pageType == 2 ? querySchema : querySchemaSend" v-model="queryObj" :inline="true" :is-query="true" @query="queryHandler(true)">
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="queryHandler(true)">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="dis-main-content">
      <div class="dis-left-box">
        <div class="area-search">
          <el-input
            size="small"
            suffix-icon='el-icon-search'
            placeholder="输入病区"
            v-model="queryArea"
            clearable
          ></el-input>
        </div>
        <div class="dis-qu-list">
          <div class="area-list-box" v-show="areaList.length !== 0">
            <div :class="{'item-area':true}" v-for="(item, index) in areaList"
                  :key="index"
                 v-show="(!queryArea || item.areaName.indexOf(queryArea) > -1) && (filterArea.includes(item.areaId) || filterArea.length === 0)"
                 :index="index+'parent'">
              <div :class="{'area-title':true, 'checked': item.areaId  === active}"  @click="choseArea(item)">{{item.areaName}}</div>
              <template v-if="pageType === 1">
                <div v-for="(subitem, subindex) in ruleList" :index="index+'sub'" v-show="active === item.areaId" :key="subindex">
                  <div
                     :title="subitem.name"
                     :class=" {'area-rules':true, 'checked': subitem.id  === ruleactive}"
                     @click="choseRule(subitem)"
                     v-show="subitem.id === '-1' || (listData[0] && (listData[0].ruleList.includes(subitem.id) && listData[0].ruleList[0] !== '-2'))"
                  >
                  {{ subitem.name }}
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div v-show="areaList.length === 0" class="noarea-tips">
            暂无病区
          </div>
        </div>
        <a href="javascript:" v-show="pageType === 1" class="go-setrule" @click="goSetRule">
          <i class="iconfont icon-shezhi1 ml10"></i>
          设置摆药规则</a>
      </div>
      <div class="dis-right-box" v-loading="loading">
        <div class="no-data-box" v-show="listData.length === 0">
          暂无数据
        </div>
        <list-table :listData="listData"
                    :key="active + ruleactive"
                    :pageType="pageType"
                    @goSend="goSend"
                    v-if="refreshThePage && listData.length"
                    @update-all-column="updateAllColumn"
                    @goDispensing="goDispensing"></list-table>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/util/req'
import { warehouse as axios } from '@/warehouse/store/api'
import search from '@/warehouse/views/drug/component/search'
import listTable from '@/warehouse/views/drug/component/dispensing.task.list'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import urlObj from '@/warehouse/views/drug/api/focusdispenseapi'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
let schema = [
  {
    name: 'billscode',
    label: '摆药单',
    style: {
      width: '150px'
    },
    props: {
      placeholder: '请输入摆药单号',
      clearable: true,
    }
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'material-select',
    style: REMOTE_METHODS_WIDTH,
    class: 'remoteWidth',
    props: {
      params: { materialType: '' }
    },
  },
  {
    label: '患者',
    name: 'patientId',
    comp: 'ever-patient-select',
    style: {
      width: '320px',
      display: 'block'
    },
    props: {
      placeholder: '输入患者姓名、患者档案号、就诊卡号、住院号',
      clearable: true,
      'suffixIcon': 'el-icon-search'
    }
  },
  {
    label: '执行科室',
    name: 'executeProviderId',
    comp: 'ever-select',
    style: {
      width: '150px'
    },
    props: {
      options: []
    }
  },
]
let schemaSend = [
  {
    name: 'patientId',
    label: '患者',
    comp: 'ever-patient-select',
    style: {
      width: '320px',
      display: 'block'
    },
    props: {
      placeholder: '输入患者姓名、患者档案号、就诊卡号、住院号',
      clearable: true,
      'suffixIcon': 'el-icon-search'
    }
  },
  {
    label: '执行科室',
    name: 'executeProviderId',
    comp: 'ever-select',
    style: {
      width: '150px'
    },
    props: {
      options: []
    }
  },
]
export default {
  name: 'dispensingtask',
  mixins: [getStorage],
  components: {
    search,
    listTable
  },
  props: ['listData', 'pageType'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      queryChoose: false,
      loading: false,
      querySchema: schema,
      querySchemaSend: schemaSend,
      queryObj: queryObj,
      queryArea: '',
      name: 'dispensingtask',
      active: '1',
      ruleactive: '1',
      areaList: [],
      ruleList: [],
      tempRuleList: [],
      tableData: [],
      filterArea: [],
      searchFlag: false,
      refreshThePage: true // 销毁右边列表组件重新加载
    }
  },
  created () {
    this.initExecuteProviderOptions()
    this.getRules()
    this.getAreas()
  },
  computed: {
    // 当前库房流程配置数据
    currentProcessConfig () {
      return this.$store.state.processConfig.thisStorageroomProcessConfig
    },
    // 流程id
    processConfigurationId () {
      return this.currentProcessConfig.id
    },
    // 当前流程配置code  100001 100002 100003 等
    processId () {
      return this.currentProcessConfig.processId
    }
  },
  watch: {
    queryArea: function (val) {
      if (val === '') {
        if (this.queryChoose && this.areaList.length !== 0 && this.areaList[0].areaId !== this.queryObj.areaId) {
          this.chooseFirst()
        }
        this.queryChoose = false
      }
    },
    listData: function (val) {
      if (val && val.length !== 0 && this.searchFlag) {
        this.filterAreaData(val, this.pageType === 2)
      }
    }
  },
  methods: {
    updateAllColumn () {
      // 一种类型的表格改变列的配置了，相同类型的表格都要同步配置
      this.refreshThePage = false
      this.loading = true
      setTimeout(() => {
        this.$nextTick(() => {
          this.refreshThePage = true
        })
        setTimeout(() => {
          this.loading = false
        }, 600)
      }, 300)
    },
    // 获取执行科室
    async initExecuteProviderOptions () {
      let params = {
        containOtherStorageroom: 0,
        storageRoomId: this.storageId,
        processId: this.processId,
        processConfigurationId: this.processConfigurationId,
        type: this.$route.path.indexOf('/outpaitent') > -1 ? 1 : 3,
        orderType: this.$route.path.indexOf('back') > -1 ? 2 : 1
      }
      await axios.cancelPost('order/searchProviderList', params).then(res => {
        if (res && res.length) {
          this.$ever.getFieldFromSchema(this.querySchema, 'executeProviderId').props.options = res.map(item => {
            return {
              id: item.executeProviderId,
              name: item.executeProviderName
            }
          })
          this.$ever.getFieldFromSchema(this.querySchemaSend, 'executeProviderId').props.options = res.map(item => {
            return {
              id: item.executeProviderId,
              name: item.executeProviderName
            }
          })
        }
      })
    },
    filterAreaData (data, fresh) {
      this.filterArea = []
      if (this.pageType === 2) {
        this.filterArea = data.map((item, index) => {
          return item.areaId
        })
      } else {
        data.map((item, index) => {
          item.itemList.forEach((sitem, sindex) => {
            this.filterArea.push(sitem.areaId)
          })
        })
      }
      this.chooseFirst(fresh)
    },
    changeLoading (status, data) {
      this.refreshThePage = !status
      setTimeout(() => {
        this.loading = status
      }, 1000)
      if (!status && data.length !== 0 && this.pageType === 2) {
        this.active = data[0].areaId
        this.queryObj.areaId = data[0].areaId
      }
    },
    choseArea (item) {
      this.ruleList = []
      if (this.queryArea !== '') {
        this.queryChoose = true
      }
      this.active = item.areaId
      this.queryObj.areaId = item.areaId
      this.queryObj.areaName = item.areaName
      this.choseRule({ id: '-1' })
      setTimeout(() => {
        this.ruleList = this.tempRuleList
      }, 500)
    },
    choseRule (item) {
      this.ruleactive = item.id
      if (item.id === '-1') {
        // delete this.queryObj.materialTypes
        // delete this.queryObj.adviceTypes
        // delete this.queryObj.dosageForms
        // delete this.queryObj.employs
        // delete this.queryObj.poisons
        delete this.queryObj.ruleType
        delete this.queryObj.ruleId
        this.queryObj.ruleType = 0
      } else {
        // this.queryObj.materialTypes = item.materialTypes
        // this.queryObj.adviceTypes = item.adviceTypes
        // this.queryObj.dosageForms = item.dosageForms
        // this.queryObj.employs = item.employs
        // this.queryObj.poisons = item.poisons
        this.queryObj.ruleId = item.id
        this.queryObj.ruleType = item.ruleType
      }
      this.queryHandler(false)
    },
    queryHandler (flag) {
      this.searchFlag = flag
      if (flag && (!this.queryObj.billscode && !this.queryObj.localMaterialId && !this.queryObj.patientId)) {
        this.filterArea = []
        this.chooseFirst()
        return
      }
      this.$emit('getList', this.queryObj, flag)
    },
    handleOpen (data) {
    },
    handleClose () { },
    handleSelectionChange () { },
    getRules () {
      request(urlObj.getRuleList, { storageRoomId: this.storageId }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.ruleList = res.data || []
          if (this.ruleList.length !== 0) {
            this.ruleList.push({
              id: '-2',
              name: '未分类',
              ruleType: 2,
            })
          }
          this.ruleList.unshift({
            id: '-1',
            name: '全部'
          })
          this.tempRuleList = [...this.ruleList]
        }
      })
    },
    /**
     * 获取病区
     */
    getAreas (callback) {
      // getAreaList
      let statusList = [2]
      let isPrintList = this.pageType === 1 ? [0] : [1, 2]
      let tempurl = this.pageType === 2 ? urlObj.getAreasNew : urlObj.getAreas
      request(tempurl, { statusList, isPrintList, status: 2 }, 'post').then(res => {
        if (res.head.errCode === 0) {
          this.areaList = res.data
          if (this.areaList.length !== 0) {
            // 当前任务列表无数据，但是病区全部还有数据，手动模拟执行一次点击病区查询任务列表数据
            this.choseArea(this.areaList[0])
            let hasFlag = false
            if (this.queryObj.areaId) {
              hasFlag = this.areaList.find((item, index) => {
                return item.areaId === this.queryObj.areaId
              })
            }
            if (!hasFlag) {
              this.chooseFirst()
            }
            if (callback) {
              callback()
            }
          }
          if (this.areaList.length === 0) {
            this.$emit('clearList')
          }
        }
      })
    },
    chooseFirst (fresh) {
      // autherBy@lvyang
      // fixedBy@xiongzhiqing 没有处理areaList没有内容的情况，会导致执行报错
      try {
        let tempAreaId = this.filterArea.length === 0 ? this.areaList[0].areaId : this.filterArea[0]
        this.active = tempAreaId
        this.queryObj.areaId = tempAreaId
        this.queryObj.areaName = (this.areaList.find((item, index) => { return tempAreaId === item.areaId })).areaName
        if (!fresh) {
          this.choseRule({ id: '-1' })
        }
      } catch (e) {
        this.getAreas()
      }
    },
    /**
     * 跳转设置规则
     */
    goSetRule () {
      this.$router.push({
        path: this.$route.path + '/setrule'
      })
    },
    /**
     * 调用父组件摆药
     * @param data
     * @param callback
     */
    goDispensing (data, callback) {
      this.$emit('goDispensing', data, callback)
    },
    /**
     * 调用父组件发药
     * @param data
     * @param callback
     */
    goSend (data, callback) {
      this.$emit('goSend', data, callback)
    }
  }
}
</script>

<style  lang="less" scoped>
  .area-list-box{
    border-top: solid 1px #ededed;
    border-bottom: none;
    color: #333;
    .area-title{
      border-bottom: solid 1px #ededed;
      height: 32px;
      line-height: 32px;
      padding-left: 20px;
      cursor: pointer;
      font-size: 14px;
      background: #F4F4F4;
      font-weight: bold;
      &:hover{
        background: #efefef;
      }
      &.checked{
        background: #ddd;
      }
    }
    .area-rules{
      border-bottom: solid 1px #ededed;
      height: 30px;
      line-height: 30px;
      padding-left: 35px;
      cursor: pointer;
      font-size: 14px;
      color: #333;
      background: #ffff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover{
        background: #1C7BEF;
        color: #fff;
      }
      &.checked{
        background: #1C7BEF;
        color: #fff;
      }
    }
  }
  .dis-container .dis-search-header /deep/ .el-input{
    margin-bottom: 10px;
  }
  .dis-container .dis-search-header /deep/ .remoteWidth .el-input{
    width: 350px;
    margin-bottom: 10px;
  }
  .el-menu-parent{
    border-right:  1px solid #ededed;
    border-left:  1px solid #ededed;
    border-bottom:  1px solid #ededed;
  }
  .dis-container /deep/ .el-menu{
    .el-menu-item{
      border-top:  1px solid #ededed;
      height: 40px;
      line-height: 40px;
    }
  }
  .dis-container /deep/.el-submenu{
    border-top: 1px solid #ededed;
  }
  .dis-container /deep/.el-submenu .el-menu-item{
    min-width: auto;
  }
  .dis-container /deep/ .el-submenu__title{
    height: 40px;
    line-height: 40px;
  }
  .dis-main-content{
    height: calc(~'100vh - 135px');
    position: relative;
    .dis-left-box{
      height: 100%;
      width: 250px;
      background: #F8F9FA;
      width: 250px;
      position: absolute;
      box-shadow: 0 0 8px 0 rgba(204,204,204,0.36);
      left: 0;
      top: 0;
      box-sizing: border-box;
      .area-search{
        padding: 12px 12px 2px 12px;
      }
      .dis-qu-list{
        margin-top: 10px;
        height: calc(~'100vh - 225px');
        overflow: auto;
        margin-bottom: 10px;
        background: transparent;
      }
      .go-setrule{
        color: #1c7bee;
        font-size: 14px;
        cursor: pointer;
        margin: 0 0 3px 0;
      }
    }
    .dis-right-box{
      height: 100%;
      overflow: auto;
      margin-left: 251px;
      padding-left: 0px;
      box-sizing: border-box;
      background: #fff;
      .no-data-box{
        height: 100%;
        display: flex;
        box-sizing: border-box;
        align-content: center;
        align-items: center;
        justify-content: center;
        background: transparent;
        color: #999;
      }
    }
    .noarea-tips{
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      border-top:none;
      align-content: center;
      align-items: center;
      justify-content: center;
      background: #fff;
      color: #999;
      font-size: 14px;

    }
  }
</style>
