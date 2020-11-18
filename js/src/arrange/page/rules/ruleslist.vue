<template>
  <div class="main">
    <div class="mainbox">
      <el-row class="mb20">
        <el-col>
          <el-select v-model="params.businessType" style="width:280px;" size="small">
            <el-option v-for="(item, i) in businessTypeData" :key="i" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <el-select v-model="params.status" style="width: 96px;" size="small">
            <el-option :value="-1" label="全部"></el-option>
            <el-option :value="1" label="启用中"></el-option>
            <el-option :value="0" label="停用中"></el-option>
          </el-select>
          <el-button size="small" plain="" @click="addRulesUse">新增规则</el-button>
        </el-col>
      </el-row>
      <el-row class="ruleslist">
        <el-col v-for="(item, i) in tableData" :key="i">
          <table width="100%" :class="{on: !item.id || item.isEdit}">
            <tr>
              <td width="30" align="center"><label v-if="item.id && !item.isEdit">{{i + 1}}</label></td>
              <td width="120" align="left">
                <template v-if="!item.id || item.isEdit">
                  <span class="hack"></span>
                  <div>
                    <el-button size="mini" type="primary" :disabled="isSubmit" @click="saveRulesUse">保存</el-button>
                    <el-button size="mini" @click="cancel">取消</el-button>
                  </div>
                </template>
                <template  v-else>
                  <el-switch
                  @change="changeSwitch(item)"
                  v-model="item.status"
                  :active-value="1"
                  :inactive-value="0"
                  ></el-switch>
                  <label>{{item.status ? '启用中' : '停用中'}}</label>
                </template>
              </td>
              <td width="50" align="center">
                <el-button type="text" v-if="item.id && !item.isEdit" @click="editUseItem(item, i)">编辑</el-button>
              </td>
              <td width="201">
                <strong class="hack" v-if="!item.id || item.isEdit">应用机构</strong>
                <ul>
                  <li v-if="!item.scopeOrganList[0]" class="all">全部机构</li>
                  <li v-for="(oragn, ii) in item.scopeOrganList" :key="ii">{{oragn.organName}}</li>
                  <li class="last" v-if="!item.id || item.isEdit"><i class="iconfont icon-tianjia1" @click="addOragn"></i></li>
                </ul>
              </td>
              <td width="201">
                <el-select size="small" v-model="currentEditItem.deptType" v-if="!item.id || item.isEdit">
                  <el-option v-for="(dept, ii) in deptTypeList" :value="dept.type" :label="dept.desc" :key="ii"></el-option>
                </el-select>
                <ul>
                  <li v-if="!item.scopeDeptList[0]" class="all">全部</li>
                  <li v-for="(dept, ii) in item.scopeDeptList" :key="ii">{{dept.deptName}}</li>
                  <li class="last" v-if="!item.id || item.isEdit"><i class="iconfont icon-tianjia1" @click="addDept"></i></li>
                </ul>
              </td>
              <td width="201">
                <el-select size="small" v-model="currentEditItem.resourceType" v-if="!item.id || item.isEdit">
                  <el-option v-for="(resource, ii) in resourceTypeList" :value="resource.type" :label="resource.desc" :key="ii"></el-option>
                </el-select>
                <ul>
                  <li v-if="!item.scopeResourceList[0]" class="all">全部</li>
                  <li v-for="(resource, ii) in item.scopeResourceList" :key="ii">{{resource.resourceName}}</li>
                  <li class="last" v-if="!item.id || item.isEdit"><i class="iconfont icon-tianjia1" @click="addResource"></i></li>
                </ul>
              </td>
              <td width="291">
                <el-select size="small" v-model="currentEditItem.serviceType" v-if="!item.id || item.isEdit">
                  <el-option v-for="(service, ii) in serviceTypeList" :value="service.type" :label="service.desc" :key="ii"></el-option>
                </el-select>
                <ul v-if="item.scopeServiceWay === 1">
                  <li v-if="!item.scopeServiceTypeList[0]" class="all">全部</li>
                  <li v-for="(service, ii) in item.scopeServiceTypeList" :key="ii">{{service.serviceSecondTypeName}}</li>
                  <li class="last" v-if="!item.id || item.isEdit"><i class="iconfont icon-tianjia1" @click="addService"></i></li>
                </ul>
                <ul v-if="item.scopeServiceWay === 2">
                  <li v-if="!item.scopeServiceList[0]" class="all">全部</li>
                  <li v-for="(service, ii) in item.scopeServiceList" :key="ii">{{service.serviceName}}</li>
                  <li class="last" v-if="!item.id || item.isEdit"><i class="iconfont icon-tianjia1" @click="addService"></i></li>
                </ul>
              </td>
              <td width="201">
                <template>
                  <span class="hack" v-if="!item.id || item.isEdit"></span>
                  <el-button type="text" @click="addRule(item)">{{item.ruleConfigId ? item.ruleConfigName :'选择使用规则'}}</el-button>
                </template>
              </td>
              <td></td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <ever-pagination
            style="padding: 10px 0; justify-content: flex-start"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :pagesize="params.pagesize"
            :total-count="totalCount"
            :current-page.sync="currentPage">
          </ever-pagination>
        </el-col>
      </el-row>
    </div>
    <oragn-dialog :show.sync="isShowOragnPop" v-model="selectOrgan"></oragn-dialog>
    <dept-dialog :show.sync="isShowDeptPop" v-model="selectDept"></dept-dialog>
    <rule-dialog :show.sync="isShowRulePop" v-model="selectRule"></rule-dialog>
    <resource-dialog :show.sync="isShowResourcePop" v-model="selectResource"></resource-dialog>
    <service-dialog
      :show.sync="isShowServicePop"
      v-model="selectService"
      :service-code="currentEditItem.serviceType"
      :service-way.sync="currentEditItem.scopeServiceWay"
      @getway="setServiceWay"></service-dialog>
  </div>
</template>
<script>
import api from '@/arrange/store/rulesuseapi'
import oragnDialog from '@/arrange/page/rules/oragnpop.vue'
import deptDialog from '@/arrange/page/rules/deptpop.vue'
import ruleDialog from '@/arrange/page/rules/rulepop.vue'
import resourceDialog from '@/arrange/page/rules/resourcepop.vue'
import serviceDialog from '@/arrange/page/rules/servicepop.vue'
export default {
  data () {
    return {
      api,
      isAdd: false,
      isSubmit: false,
      editIndex: -1,
      currentEditItem: '',
      currentActiveItem: '',
      isShowOragnPop: false,
      isShowDeptPop: false,
      isShowRulePop: false,
      isShowResourcePop: false,
      isShowServicePop: false,
      deptTypeList: [],
      resourceTypeList: [],
      serviceTypeList: [],
      businessTypeData: [
        {
          label: '门诊医生预约接诊',
          value: 'OUTPATIENT_DOCTOR'
        },
        {
          label: '检查预约',
          value: 'EXAMINE'
        },
        {
          label: '处置预约',
          value: 'TREATMENT'
        },
        {
          label: '门诊手术预约',
          value: 'OUTPATIENT_SURGERY'
        }
      ],
      tableData: [],
      selectOrgan: [],
      selectDept: [],
      selectResource: [],
      selectService: [],
      selectServiceWay: 1,
      selectRule: '',
      totalCount: 0,
      currentPage: 1,
      params: {
        businessType: 'OUTPATIENT_DOCTOR',
        status: 1,
        offset: 0,
        pagesize: 10
      }
    }
  },
  watch: {
    'selectOrgan' (val) {
      this.tableData[this.editIndex].scopeOrganList = val
      this.currentEditItem.scopeOrganList = val
    },
    'selectDept' (val) {
      let isAll = val.filter(item => {
        return item.deptId === '-1'
      })[0]
      this.currentEditItem.scopeDeptList = isAll ? val.filter(item => {
        return item.deptId === '-1'
      }) : val.filter(item => {
        return item.deptId !== '-1'
      })
      this.tableData[this.editIndex].scopeDeptList = this.currentEditItem.scopeDeptList
    },
    'selectResource' (val) {
      this.currentEditItem.scopeResourceList = val
      this.tableData[this.editIndex].scopeResourceList = this.currentEditItem.scopeResourceList
    },
    'selectRule' (val) {
      this.tableData[this.editIndex].ruleConfigId = val.id
      this.tableData[this.editIndex].ruleConfigName = val.name
      this.currentEditItem.ruleConfigId = val.id
      this.currentEditItem.ruleConfigName = val.name
    },
    'selectService' (val) {
      this.tableData[this.editIndex].scopeServiceWay = this.currentEditItem.scopeServiceWay
      if (this.currentEditItem.scopeServiceWay === 1) {
        this.currentEditItem.scopeServiceTypeList = val
        this.tableData[this.editIndex].scopeServiceTypeList = val
        this.currentEditItem.scopeServiceList = []
      } else {
        this.currentEditItem.scopeServiceList = val
        this.tableData[this.editIndex].scopeServiceList = val
        this.currentEditItem.scopeServiceTypeList = []
      }
    },
    'params': {
      handler () {
        this.getList()
      },
      deep: true
    }
  },
  created () {
    this.$bus.$on('onError', val => {
      this.isSubmit = false
    })
    this.getDeptType()
    this.getResourceType()
    this.getServiceType()
    this.getList()
  },
  methods: {
    getList () {
      let params = Object.assign({}, this.params)
      this.isAdd = false
      if (this.params.status === -1) {
        params.status = ''
      }
      this.api.list(params).then(rs => {
        this.tableData = rs.data
        this.totalCount = rs.totalCount
      })
    },
    getDeptType () {
      this.api.getDeptType().then(rs => {
        this.deptTypeList = rs.data
      })
    },
    getResourceType () {
      this.api.getResourcetType().then(rs => {
        this.resourceTypeList = rs.data
      })
    },
    getServiceType () {
      this.api.getServiceType().then(rs => {
        this.serviceTypeList = rs.data
      })
    },
    addOragn () {
      this.isShowOragnPop = true
    },
    addDept () {
      this.isShowDeptPop = true
    },
    addRule (item) {
      if (!item.isEdit) {
        return false
      }
      if (!item.id && !item.ruleConfigId) {
        this.selectRule = ''
        this.isShowRulePop = true
      } else if (this.currentEditItem.id === item.id) {
        this.isShowRulePop = true
      } else {
        return false
      }
    },
    addResource () {
      this.isShowResourcePop = true
    },
    addService () {
      this.isShowServicePop = true
    },
    addRulesUse () {
      if (this.isAdd) {
        return false
      }
      if (this.editIndex > -1) {
        this.$set(this.tableData[this.editIndex], 'isEdit', false)
      }
      let item = {
        id: '',
        status: 1,
        isEdit: true,
        businessType: this.params.businessType,
        ruleConfigId: '',
        ruleConfigName: '',
        scopeOrganList: [],
        deptType: '1',
        scopeDeptList: [],
        resourceType: 'DOCTOR',
        scopeResourceList: [],
        serviceType: '799',
        scopeServiceWay: 1,
        scopeServiceTypeList: [],
        scopeServiceList: []
      }
      this.isAdd = true
      this.selectOrgan = []
      this.selectDept = []
      this.selectResource = []
      this.selectService = []
      this.selectRule = ''
      this.selectServiceWay = 1
      this.tableData.unshift(item)
      this.currentEditItem = item
      this.editIndex = 0
    },
    cancel () {
      setTimeout(() => {
        if (this.isAdd) {
          this.tableData.shift()
          this.isAdd = false
          this.editIndex = -1
        } else {
          this.currentEditItem.isEdit = false
          this.tableData[this.editIndex] = this.currentActiveItem
        }
        this.$forceUpdate()
      }, 0)
    },
    editUseItem (item, index) {
      if (this.isAdd) {
        this.$messageTips(this, 'warning', '正在添加规则使用，请先保存或取消')
        return false
      }
      if (this.editIndex > -1) {
        this.tableData[this.editIndex] = this.currentActiveItem
      }
      this.selectOrgan = item.scopeOrganList
      this.selectDept = item.scopeDeptList
      this.selectResource = item.scopeResourceList
      this.selectService = item.scopeServiceWay === 1 ? item.scopeServiceTypeList : item.scopeServiceList
      this.selectRule = {id: item.ruleConfigId, name: item.ruleConfigName}
      this.editIndex = index
      this.currentEditItem = Object.assign({}, item)
      this.currentActiveItem = Object.assign({}, item)
      this.$set(this.tableData[index], 'isEdit', true)
      this.$forceUpdate()
    },
    setServiceWay (val) {
      this.currentEditItem.scopeServiceWay = val
    },
    saveRulesUse () {
      if (!this.currentEditItem.ruleConfigId) {
        this.$messageTips(this, 'warning', '请选择一个规则')
        return false
      }
      this.isSubmit = true
      this.api.saveRules(this.currentEditItem).then(rs => {
        if (!rs.head.errCode) {
          this.$messageTips(this, 'success', '保存成功')
          this.cancel()
          this.isSubmit = false
          setTimeout(_ => {
            this.getList()
          }, 100)
        }
      })
    },
    changeSwitch (val) {
      this.api.setRulesStatus({id: val.id, status: val.status}).then(rs => {
        if (val.status && rs.data && !rs.data.checkResultVO.passed) {
          val.status = 0
          this.$messageTips(this, 'warning', rs.data.checkResultVO.message)
          return false
        }
        this.getList()
      })
    },
    handleSizeChange (val) {
      this.params.pagesize = val
      this.currentPage = 1 // 切换size时，自动重置current
      this.params.offset = (this.currentPage - 1) * this.params.pagesize
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
    }
  },
  components: {
    oragnDialog,
    deptDialog,
    ruleDialog,
    resourceDialog,
    serviceDialog
  }
}
</script>

<style scoped>
  .mainbox {background: #fff; font-size: 14px; padding: 20px; overflow: auto; height: 100%;}
  .ruleslist {border-top: 1px solid #BCC9D7;}
  .ruleslist .el-col{padding: 10px 0; border-bottom: 1px solid #BCC9D7;}
  .ruleslist .el-col table {box-sizing: border-box;table-layout: fixed; border-collapse: collapse;border-spacing: 0; }
  .ruleslist .el-col table tr td {vertical-align: top;}
  .ruleslist .el-col table tr td .el-button--text{padding: 0 10px; line-height: 25px;}
  .ruleslist .el-col table tr td .el-select{margin-bottom: 10px;}
  .ruleslist .el-col table tr td {padding:10px;}
  .ruleslist .el-col table tr td > * {line-height: 25px;}
  .ruleslist .el-col table tr td ul {padding: 0; margin: 0; list-style: none;border-left: 1px solid #BCC9D7;}
  .ruleslist .el-col table tr td ul li,
  .ruleslist .el-col table tr td span.all{display: block; line-height: 25px; padding-left: 10px;}
  .ruleslist .el-col table tr td ul li.last{padding-top: 5px;}
  .ruleslist .el-col table.on {border: 1px solid #BCC9D7; background: #FFFEEF;}
  .ruleslist .el-col table tr td .hack{display: block; height: 32px; margin-bottom: 10px; line-height: 32px; padding-left: 10px;}
</style>
