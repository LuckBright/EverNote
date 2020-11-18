<template>
  <div class="layout_inner">
    <div class="text_box">
      <div>
        <ever-form2 :schema="schema" v-model="searchObj" :inline="true" ref="form">
          <template slot="practiceOrgIdList">
            <el-select
              v-model="searchObj.practiceOrgIdList"
              placeholder="全部机构"
              filterable
              @change="tenantSubjectChange"
              clearable
            >
              <el-option
                v-for="item in options.orgIdOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="tenantSubjectIdList">
            <el-select
              v-model="searchObj.tenantSubjectIdList"
              placeholder="全部科室"
              filterable
              clearable
            >
              <el-option
                v-for="item in options.tenantSubjectIdOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="skillsTitle2CodeList">
            <el-select
              v-model="searchObj.skillsTitle2CodeList"
              placeholder="全部职称"
              filterable
              clearable
            >
              <el-option
                v-for="item in options.sickAreaIdOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button @click="searchList(true)">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <div class="batch_btn">
        <el-button @click="batchClick">批量设置</el-button>
      </div>
      <div>
        <el-table
          v-loading.body="loading"
          :data="tableData"
          class="doctor-table"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          border
          stripe
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="姓名" prop="name" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="性别" prop="genderName" width="60"></el-table-column>
          <el-table-column label="手机号" prop="mobile" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column label="院内执业所在机构/科室" prop="orgName" show-overflow-tooltip></el-table-column>
          <el-table-column label="职称" prop="skillsTitle2Name" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="互联网医院状态" prop="webHospitalDoctor" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.webHospitalDoctor === '1' ? '开通' : '未开通'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <el-link type="primary" @click="seeInfoClick(scoped.row)">查看资料</el-link>
              <el-link
                type="success"
                style="margin-left: 40px;"
                @click="setUpClick(scoped.row)"
              >在线执业机构/科室/价格设置</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="offset"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <el-dialog
        title="业务设置"
        :visible.sync="dialogTableVisible"
        center
        width="95%"
        :close-on-click-modal="false"
      >
        <teletext-dialog
          v-if="dialogTableVisible"
          :result="dialogData"
          :options="options"
          :isAllSend="isAllSend"
          ref="dialogRef"
        ></teletext-dialog>
        <template slot="footer">
          <el-button @click="addInfoClick">保存</el-button>
          <el-button @click="closeDialogClick">取消</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/homemanage/homemanageapi'
import teletextDialog from './teletext.dialog'

let schema = [
  {
    name: 'practiceOrgIdList',
    comp: 'custom'
  },
  {
    name: 'tenantSubjectIdList',
    comp: 'custom'
  },
  {
    name: 'skillsTitle2CodeList',
    comp: 'custom'
  },
  {
    name: 'webHospitalDoctor',
    comp: 'el-select',
    props: {
      placeholder: '互联网医院状态',
      options: [
        { id: '0', name: '未开通' },
        { id: '1', name: '开通' }
      ],
      clearable: true
    }
  },
  {
    name: 'serviceType',
    comp: 'el-select',
    props: {
      placeholder: '服务类型',
      options: [
        { id: '', name: '全部服务类型' },
        { id: '1', name: '视频问诊' },
        { id: '2', name: '图文问诊' },
      ]
    }
  },
  {
    name: 'mobileList',
    comp: 'text',
    props: {
      placeholder: '请输入医生手机号',
      clearable: true
    }
  },
  {
    name: 'nameList',
    comp: 'text',
    props: {
      placeholder: '请输入医生姓名',
      clearable: true
    }
  }
]
export default {
  components: {
    teletextDialog
  },
  data () {
    let searchObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      schema,
      searchObj,
      loading: false,
      tableData: [],
      offset: 1,
      pagesize: 10,
      total: 0,
      options: {
        orgIdOption: [],
        tenantSubjectIdOption: [],
        sickAreaIdOption: []
      },
      dialogTableVisible: false,
      dialogData: [],
      params: {
        practiceOrgIdList: [],
        tenantSubjectIdList: [],
        skillsTitle2CodeList: [],
        mobileList: [],
        webHospitalDoctor: '',
        nameList: []
      },
      isAllSend: false, // 批量：true, 单个 fasle
      allIds: [],
      row: {},
      isClickSearch: false
    }
  },
  created () {
    this.getOrgList()
    this.getTable(this.params)
    this.sickAreaChange()
  },
  methods: {
    /**
     * 获取table数据
     */
    getTable (params) {
      this.loading = true
      params.pagesize = this.pagesize
      params.offset = (this.offset - 1) * this.pagesize
      params.typeCodeList = ['DOCTOR']
      params.skillsTitle1CodeList = ['06']
      api.getTableList({
        outStaffGetStaffListByConditionReqDTO: params,
        outOrgGetOrgListByConditionReqDTO: {
          'idList': params.practiceOrgIdList
        },
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          'orgIdList': params.practiceOrgIdList

        }
      }).then(res => {
        if (res.errCode === 0) {
          this.total = res.data.totalCount
          res.data.resultList.forEach((items, index) => {
            if (items.tsStaffOrganizationList[0]) {
              let lastorgName = items.tsStaffOrganizationList[0].name
              let deptName = ''
              items.tsStaffOrganizationList[0].tsStaffSubjectList = items.tsStaffOrganizationList[0].tsStaffSubjectList.splice(0, 2)
              items.tsStaffOrganizationList[0].tsStaffSubjectList.forEach(p => {
                if (p.orgSubjectName) {
                  deptName = deptName + '/' + p.orgSubjectName
                }
              })
              items.orgName = lastorgName + deptName
            }
          })
          this.tableData = res.data.resultList
          this.loading = false
          if (params.practiceOrgIdList[0] && params.tenantSubjectIdList[0] && params.skillsTitle2CodeList[0]) {
            this.isClickSearch = true
          } else {
            this.isClickSearch = false
          }
        }
      })
    },
    // 获取机构1
    getOrgList () {
      api.getOrgListByCondition().then(res => {
        if (res.errCode === 0) {
          res.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.code
            obj.name = item.name
            this.options.orgIdOption.push(obj)
          })
        }
      })
    },
    // 获取科室select
    tenantSubjectChange (id) {
      this.searchObj.tenantSubjectIdList = ''
      this.options.tenantSubjectIdOption = []
      let params = {
        orgIdList: [id],
        type2CodeList: ['01.02'],
        offset: 0,
        pagesize: 1000
      }
      api.getTenant(params).then(res => {
        if (res.errCode === 0) {
          res.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.name = item.tenantSubjectName
            this.options.tenantSubjectIdOption.push(obj)
          })
        }
      })
    },
    // 获取职称select
    sickAreaChange (id) {
      api.getValueListBySetCode({ 'setCode': ['THC_WH_RYZC2'] }).then(res => {
        if (res.errCode === 0) {
          let list = res.data.resultList.filter(item => item.parentId === 'THC_WH_RYZC1.06')
          list.forEach(item => {
            let obj = {}
            obj.id = item.code
            obj.name = item.name
            this.options.sickAreaIdOption.push(obj)
          })
        }
      })
    },
    // 多选
    handleSelectionChange (val) {
      this.allIds = val
    },
    handleCurrentChange (val) {
      this.offset = val
      let params = this.setInfo()
      this.getTable(params)
    },
    handleSizeChange (val) {
      this.pagesize = val
      let params = this.setInfo()
      this.getTable(params)
    },
    setInfo () {
      let newObj = { ...this.searchObj }
      for (let key in newObj) {
        newObj[key] = newObj[key] ? [newObj[key]] : []
      }
      newObj.webHospitalDoctor = newObj.webHospitalDoctor[0] ? newObj.webHospitalDoctor[0] : ''
      return newObj
    },
    /**
     * 获取医生列表
     */
    searchList (isTrue) {
      if (isTrue) this.offset = 1
      let params = this.setInfo()
      this.getTable(params)
    },

    /**
     * 单个操作
     */
    setUpClick (row) {
      this.row = row
      this.isAllSend = false
      api.getServiceItem({
        doctorId: row.id,
        config: {
          headers: {
            'x-org-id': row.orgId
          }
        }
      }).then(res => {
        if (res.errCode === 0) {
          if (res.data && res.data.id) {
            this.dialogData = [res.data]
            this.dialogData[0].status = !!res.data.status
            this.dialogData[0].online = res.data.online === 1
            this.dialogData[0].allowCustom = res.data.allowCustom === 1
            this.dialogData[0].allowCustomPatient = res.data.allowCustomPatient === 1
            this.dialogData[0].serviceName = '图文问诊'
          } else {
            this.dialogData.length = 0
            this.dialogData = [{
              department: '', // 科室名称
              departmentCode: '', // 科室id
              doctorId: row.id, // id
              doctorName: row.name, // 医生名称
              finType: '', // 财务分类
              id: '', // id
              itemCode: '', // 收费code
              itemName: '', // 收费名称
              itemType: '', // 收费类型
              online: row.webHospitalDoctor === '1', // 互联网权限
              orgId: '', // 机构id
              orgName: '', // 科室名称
              price: '', // 自定义价格
              priceName: '', // 系统定价
              serviceId: '', // 价格id
              serviceName: '图文问诊', // 业务类型
              serviceTypeCode: '1', // 写死
              settlementType: '', // 结算类型
              status: false, // 是否开通
              tenantId: row.tenantId, // 集团ID
              tenantName: '', // 集团名称
              title: '', // 医生职称
              titleCode: '', // 医生编码
              allowCustom: false, // 允许医生定价
              customPriceMax: '', // 价格上限
              allowCustomPatient: false // 允许给患者定价

            }]
          }
          this.dialogTableVisible = true
        }
      })
    },

    /**
     * 批量操作
     */
    batchClick () {
      if (this.isClickSearch) {
        if (this.allIds.length) {
          this.getDocStatus(this.allIds)
        } else {
          this.$notify({
            title: '警告',
            message: '请选择操作数据',
            type: 'warning'
          })
        }
      } else {
        this.$notify({
          title: '警告',
          message: '请先统一科室，统一职称查询',
          type: 'warning'
        })
      }
    },
    /**
     * 保存业务设置
     */
    addInfoClick () {
      let params = Object.assign({}, this.$refs.dialogRef.dialogData[0])
      let reg = /((^[1-9]\d*)|^0)((\.\d{0,2}){0,1})$/

      if (params.status) {
        if (!params.orgId || !params.serviceId || !params.departmentCode) {
          this.$notify({
            title: '警告',
            message: '请完善信息，必填(所在机构,所在科室, 系统定价)',
            type: 'warning'
          })
          return false
        }
        let priceInfo = params.price + ''
        if (priceInfo && priceInfo !== 'null') {
          let priceValue = priceInfo.search(reg)
          if (priceValue === -1 || priceInfo > 9999) {
            this.$notify({
              title: '警告',
              message: '请输入正确自定义价格（保留两位小数），且不能大于9999',
              type: 'warning'
            })
            return false
          }
        } else {
          this.$notify({
            title: '警告',
            message: '请输入自定义价格',
            type: 'warning'
          })
          return false
        }
      }
      params.allowCustom = this.$refs.dialogRef.dialogData[0].allowCustom ? 1 : 0
      params.status = this.$refs.dialogRef.dialogData[0].status ? 1 : 0
      params.online = this.$refs.dialogRef.dialogData[0].online ? 1 : 2
      let online = this.$refs.dialogRef.dialogData[0].online

      if (online && params.status && params.allowCustom) {
        let price = params.customPriceMax + ''
        if (price && price !== 'null') {
          let isTrue = price.search(reg)
          if (isTrue === -1 || price > 9999) {
            this.$notify({
              title: '警告',
              message: '请输入正确价格（保留两位小数），且不能大于9999',
              type: 'warning'
            })
            return false
          }
        } else {
          this.$notify({
            title: '警告',
            message: '请输入价格上限',
            type: 'warning'
          })
          return false
        }
      }
      params.allowCustomPatient = this.$refs.dialogRef.dialogData[0].allowCustomPatient ? 1 : 0
      this.addSend(params)
    },
    /**
     * 保存发送
     */
    addSend (params) {
      if (this.isAllSend) {
        let list = []
        this.allIds.forEach(item => {
          let obj = {}
          obj.doctorId = item.id
          obj.doctorName = item.name
          list.push(obj)
        })
        let obj = { doctorList: list, vo: { ...params } }
        api.creatServiceItemBatch(obj).then(res => {
          if (res.errCode === 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.closeDialogClick()
            this.searchList()
          }
        })
      } else {
        params.title = this.row.skillsTitle2Name
        params.titleCode = this.row.skillsTitle2Code
        api.creatServiceItem(params).then(res => {
          if (res.errCode === 0) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.closeDialogClick()
            this.searchList()
          }
        })
      }
    },
    /**
     * 医生自定义
     */
    closeDialogClick () {
      this.dialogTableVisible = false
      this.dialogData.length = 0
    },
    /**
     查看资料 */
    seeInfoClick (val) {
      window.open(this.$ever.warehouseIndex + '/warehouse/org/staff/detail/' + val.id + '/edit?isView=1')
    },

    /**
     * 查询是否有未关闭的图文问诊
     * */
    getDocStatus (list) {
      let idList = []
      list.forEach(item => {
        let obj = {}
        obj.doctorId = item.id
        obj.doctorName = item.name
        idList.push(obj)
      })
      let params = {
        idList,
        tenantId: localStorage.getItem('TENANTID')
      }
      api.weatherHaveCounselBeingProcessed(params).then(rs => {
        if (!rs.errCode) {
          if (rs.data.length) {
            let text = rs.data.join(',')
            const h = this.$createElement
            this.$notify({
              title: '设置提醒',
              type: 'warning',
              message: h('span', { style: 'color: black' }, text + '医生有未完成图文问诊，无法进行更改操作。')
            })
          } else {
            this.isAllSend = true
            this.dialogData = [{
              department: '', // 科室名称
              departmentCode: '', // 科室id
              doctorId: '', // id
              doctorName: '', // 医生名称
              finType: '', // 财务分类
              id: '', // id
              itemCode: '', // 收费code
              itemName: '', // 收费名称
              itemType: '', // 收费类型
              online: false, // 互联网权限
              orgId: '', // 机构id
              orgName: '', // 科室名称
              price: '', // 自定义价格
              priceName: '', // 系统定价
              serviceId: '', // 价格id
              serviceName: '图文问诊', // 业务类型
              serviceTypeCode: '1', // 写死
              settlementType: '', // 结算类型
              status: false, // 是否开通
              tenantId: '', // 集团ID
              tenantName: '', // 集团名称
              title: this.allIds[0].skillsTitle2Name, // 医生职称
              titleCode: this.allIds[0].skillsTitle2Code, // 医生编码
              allowCustom: false, // 允许医生定价
              customPriceMax: '', // 价格上限
              allowCustomPatient: false // 允许给患者定价
            }]
            this.dialogTableVisible = true
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .text_box {
    padding: 20px;
    /deep/ .el-form-item {
      width: 130px;
    }
    /deep/ .el-table th.gutter {
      display: table-cell !important;
    }
    .batch_btn {
      margin-bottom: 10px;
      float: right;
    }
    .pagination {
      float: right;
    }
    .switch_span {
      margin-left: 10px;
    }
  }
</style>
