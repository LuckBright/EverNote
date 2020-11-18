<template>
  <div class="layout_inner">
    <el-row class="main-head">
      <el-col :span="16">
        <ever-query-form :schema="querySchema" v-model="obj" @query="query"></ever-query-form>
      </el-col>
      <el-col v-if="type !== 'import'" :span="8" style="text-align: right">
        <column-filter v-model="priceColumnsFilter"></column-filter>
        <price-mutil
          v-if="isPriceEdit"
          sourceModule="cpoe"
          :is-tenant="false"
          @publishSuccess="publishSuccess"
        ></price-mutil>
        <price-submit-button
          v-if="isPriceEdit"
          size="small"
          type="primary"
          class="price-submit-btn"
          source="org"
          sourceModule="cpoe"
          :disabled="!priceChangeList.length"
          @submit="priceSubmit"
        ></price-submit-button>
        <div class="main-option" v-if="belong === '1'">
          <el-button type="primary" @click="openServiceImportDialog()">导入诊疗项目</el-button>
          <template v-if="$hasPermission('Auth_menu_clinic_medicalset_service_btn')">
            <router-link :to="'/group/serviceadd'">
              <el-button type="primary">新建</el-button>
            </router-link>
          </template>
        </div>
        <el-button v-if="$hasPermission('Auth_menu_clinic_medicalset_service_export')"  size="small" type="primary" @click="exportExcel" :loading='loading'>{{loadingStr}}</el-button>
        <!-- 产品说暂时不要 -->
        <!-- <el-button v-else-if="belong === '2' && isPermission" type="primary" @click="selectImport">同步上级数据</el-button> -->
      </el-col>
    </el-row>
    <el-table class="service-table" v-loading.body="loading" :data="tableData" style="width: 100%" :border="false" :key="priceColumnsFilter.length">
      <!-- <el-table-column type="index" label="序号" align="center" width="70"></el-table-column> -->
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="serviceClassification" label="系统分类">
        <template slot-scope="scope">
          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
        </template>
      </el-table-column>
      <el-table-column v-if="belong === '1'" prop="relateOrgList" label="关联机构">
        <template slot-scope="scope">{{relateOrgList(scope.row.relateOrgList)}}</template>
      </el-table-column>
      <el-table-column prop="finType" label="业务分类" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.finType">--</span>
            <sys-value v-else type="THC_RCM_FIN_TYPE" :code="scope.row.finType"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="isAdvice" label="收费项" align="center"  width="80">
          <template slot-scope="scope">
            <span v-if="!scope.row.isAdvice">--</span>
            <span v-else-if="scope.row.isAdvice===1">是</span>
            <span v-else>{{+String(scope.row.isAdvice)[1] ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="spec" label="规格" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.spec">--</span>
            <span v-else>{{scope.row.spec}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="unit" label="销售单位" align="center"  width="120">
          <template slot-scope="scope">
            <span v-if="!scope.row.unit">--</span>
            <sys-value v-else type="THC_WH_DOSE_UNIT" :code="scope.row.unit"></sys-value>
          </template>
        </el-table-column>
      <el-table-column prop="isValid" label="状态" width="100">
        <template slot-scope="scope">
          <el-tooltip :disabled="!!scope.row.isValid" content="集团已停用,无法启用" placement="top" effect="light" :open-delay="500">
            <el-switch
              :disabled="!scope.row.isValid"
              :value="!!(scope.row.orgServiceRelation && scope.row.orgServiceRelation.isValid)"
              @input="(val) => scope.row.orgServiceRelation.isValid = val"
              @change="(val) => changeIsValid(val, scope.row)"></el-switch>
          </el-tooltip>
          {{scope.row.orgServiceRelation.isValid ? '启用' : '停用'}}
        </template>
      </el-table-column>
      <template v-for="item in priceColumns">
        <el-table-column
          v-if="item.display"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          align="right"
          style="margin-right:34px"
        >
          <template slot-scope="scope">
            <price-td
              :disabled="!isPriceEdit || ((!+String(scope.row.isAdvice)[1]) && scope.row.isAdvice !== 1)"
              :row="priceList[scope.row.id] || {}"
              :td-key="item.prop"
              :td-key-name="item.label"
              :id="scope.row.id"
              :change="priceChang"
              :key="item.prop"
            ></price-td>
          </template>
        </el-table-column>
      </template>
      <el-table-column prop label="操作" width="70" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-if="$hasPermission('Auth_menu_clinic_medicalset_service_btn')"
            @click="$router.push(`/${belong === '1' ? 'group' : 'warehouse'}/services/${belong}/${scope.row.id}`)"
          >{{belong === '2' ? '详情' : '编辑'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
    <import-select-dialog ref="importSelect" @update="updateList"></import-select-dialog>
    <service-import-dialog :visible.sync="serviceImportFlag"></service-import-dialog>
  </div>
</template>

<script>
import api from '../../store/serviceapi'
import editapi from '../../store/serviceeditapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import list from '@/util/list'
import importSelectDialog from './import.dialog'
import serviceImportDialog from '../service.import.dialog'
import manageApi from '@/manages/page/prescription/managesapi'
import storage from '@/util/storage'
import priceInfo, {priceTd} from '@/manages/components/price.manage/price.info'
import columnFilter from '@/manages/components/price.manage/column.filter.vue'
import priceMutil from '@/manages/components/price.manage/price.mutil.vue'
import priceSubmitButton from '@/manages/components/price.manage/price.submit.vue'
import download from '@/sob/store/download.file.js'
let getList = api.list
export default {
  mixins: [list, download],
  data () {
    let schema = [
      {
        name: 'serviceClassificationList',
        type: 'cascader',
        label: '系统分类',
        options: [],
        clearable: true,
        filterable: true
      },
      {
        name: 'finType',
        type: 'systype',
        code: 'THC_RCM_FIN_TYPE',
        useValue: true,
        label: '业务分类',
        clearable: true,
        style: {width: '120px'}
      },
      {
        name: 'isValid',
        type: 'systype',
        code: 'THC_SOB_AVAILABLE_STATE',
        useValue: true,
        label: '状态',
        clearable: true
      },
      {
        name: 'name',
        type: 'text',
        label: '项目名称',
        clearable: true
      },
      {
        name: 'isAdvice',
        type: 'checkbox',
        label: '',
        style: {
          marginTop: '7px'
        },
        options: [
          { id: 10, name: '医嘱项' },
          { id: 11, name: '收费项' }
        ]
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.serviceClassificationList = []
    obj.isAdvice = []
    return {
      api: Object.assign({}, api),
      tableData: [],
      querySchema: schema,
      obj,
      serviceImportFlag: false,
      belong: this.$route.params.belong,
      isSending: false,
      isPermission: false,
      priceColumns: [],
      priceChangeList: [],
      isPriceEdit: false,
      priceColumnsFilter: []
    }
  },
  props: ['type'],
  components: {
    importSelectDialog,
    serviceImportDialog,
    columnFilter,
    priceMutil,
    priceSubmitButton,
    priceTd: priceTd()
  },
  created () {
    this.queryObj.filterMaterial = true
    this.queryObj.usePermission = 1
    this.api.list = async (params) => {
      let res = await getList(params)
      if (res.head && res.head.errCode === 0 && res.data && res.data.length) {
        let data = res.data
        let orgId = data[0].orgId
        let itemIdList = data.map(item => item.id)
        await this.getPriceList({orgId, itemIdList})
      }
      return res
    }
    this.getPermission()
    this.getClassOptions()
    this.getPricePermission()
  },
  methods: {
    getClassOptions () {
      sysvalue.cascade(
        'THC_WH_OBJECT_TYPE', ['798']).then(options => {
          if (options[0] && options[0].children) {
            this.$ever.getFieldFromSchema(this.querySchema, 'serviceClassificationList').options = options[0].children
          }
        })
    },
    relateOrgList (data) {
      let str = ''
      if (data && data.length) {
        data.forEach((item, index) => {
          if (index === 0) {
            str += item.orgName
          } else {
            str += `，${item.orgName}`
          }
        })
      }
      return str
    },
    query () {
      if (this.loading) return
      this.priceChangeList = []
      this.queryObj.filterMaterial = true
      this.queryObj.usePermission = 1
      this.current = 1
      this.offset = 0
      this.list()
    },
    updateList () {
      this.query()
    },
    openServiceImportDialog () {
      this.serviceImportFlag = true
    },
    selectImport () {
      this.$refs.importSelect.open()
    },
    async importTenantService () {
      this.isSending = true
      const res = await editapi.importTenantService()
      if (res) {
        this.isSending = false
        this.$messageTips(this, 'success', '同步成功！', '提示')
        this.updateList()
      } else {
        this.isSending = false
      }
    },
    updateData () {
      this.isSending = true
      api.updateData().then((rs) => {
        this.isSending = false
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', rs.head.errMsg, '提示')
        } else {
          this.$messageTips(this, 'error', rs.head.errMsg, '提示')
        }
      })
    },
    changeIsValid (isValid, row) {
      let info = row.orgServiceRelation || {}
      let params = {
        orgId: info.orgId,
        ids: [info.serviceId],
        isValid: isValid ? 1 : 0
      }
      this.api.updateValidStatus(params).then(res => {
        this.query()
      })
    },
    // 同步上级机构医嘱项权限
    getPermission () {
      const clinicId = storage.getLocalStorage('CLINICID')
      manageApi.getTreeNodes({
        outOrgGetOrgListByConditionReqDTO: {idList: [clinicId]}
      }).then(res => {
        if (res.length && res[0].parentCode !== '0') {
          manageApi.getClinicManageConfigForRecord({
            orgid: clinicId,
            type: 117
          }).then(res => {
            if (res.isConfig) {
              this.isPermission = true
            } else {
              this.isPermission = false
            }
          })
        }
      })
    },
    getPricePermission () {
      const clinicId = storage.getLocalStorage('CLINICID')
      manageApi.getClinicManageConfigForRecord({
        orgid: clinicId,
        type: 122
      }).then(res => {
        if (!res.isConfig) {
          this.isPriceEdit = true
        } else {
          this.isPriceEdit = false
        }
      })
    },
    publishSuccess () {
      this.query()
    },
    priceSubmit (submit, param) {
      param.data = [{
        orgId: this.$store.state.currentUser.organizationId,
        items: this.priceChangeList
      }]
      submit(param).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '调价发布成功')
          this.query()
        }
      })
    },
    async getPriceList (params) {
      let info = await priceInfo.getPriceConfig(params, 'item')
      this.priceColumns = info.columns.map(item => {
        item.display = true
        return item
      })
      this.priceColumnsFilter = info.columns
      this.priceList = info.data
    },
    priceChang (orgId, data) {
      if (
        (data.originalPrice !== null && +data.originalPrice === data.currentPrice) ||
        (data.originalPrice === null && data.currentPrice === '')
      ) {
        if (this.priceChangeList.length) {
          let list = []
          this.priceChangeList.forEach(item => {
            if (item.scene === data.scene && item.itemId === data.itemId) return
            list.push(item)
          })
          this.priceChangeList = list
        }
      } else {
        if (this.priceChangeList.length) {
          let isAdd = true
          this.priceChangeList.forEach(item => {
            if (item.scene === data.scene && item.itemId === data.itemId) {
              isAdd = false
              item.currentPrice = data.currentPrice
            }
          })
          isAdd && this.priceChangeList.push(data)
        } else {
          this.priceChangeList.push(data)
        }
      }
    }
  },
  watch: {
    obj: {
      handler (val) {
        this.queryObj = Object.assign({}, this.queryObj, val)
        if (this.queryObj.isAdvice.length === 2) {
          this.queryObj.isAdviceList = [11]
        } else if (this.queryObj.isAdvice[0] === 10) {
          this.queryObj.isAdviceList = [10, 11]
        } else if (this.queryObj.isAdvice[0] === 11) {
          this.queryObj.isAdviceList = [1, 11]
        } else {
          this.queryObj.isAdviceList = []
        }
        delete this.queryObj.isAdvice
      },
      immediate: true,
      deep: true
    },
    'tableData' (val) {
      if (val.length) {
        val.forEach(e => {
          e.serviceType = String(e.serviceType)
        })
      }
    },
    '$route.params.belong' (val, oldVal) {
      this.belong = val
      this.query()
    },
    'priceColumnsFilter' (val) {
      this.priceChangeList = []
      let valObj = {}
      val.forEach(item => {
        valObj[item.prop] = true
      })
      this.priceColumns.forEach(item => {
        if (valObj[item.prop]) {
          item.display = true
        } else {
          item.display = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .service-table {
    /deep/ .price-txt {
      display: inline-block;
      width: 60px;
      white-space: nowrap;
      text-align: right;
      float: right;
    }
  }
</style>
