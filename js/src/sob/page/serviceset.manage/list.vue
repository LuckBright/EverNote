<template>
  <div>
    <!-- <ever-bread-crumb :name="(belong === '1' ? '集团' : '') + '组套管理'" :path="(belong === '1' ? '/group' : '/warehouse') + '/serviceset/' + belong"></ever-bread-crumb> -->
    <div class="layout_inner">
      <el-row class="main-head">
        <el-col :span="20">
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        </el-col>
        <el-col class="main-option" :span="4">
          <el-button v-if="$hasPermission('Auth_menu_clinic_medicalset_service_set_export')"  size="small" type="primary" @click="exportExcel" :loading='loading'>{{loadingStr}}</el-button>
          <router-link
            v-if="$hasPermission('Auth_menu_clinic_medicalset_serviceset_btn') && belong === '1'"
            :to="'/group/servicesetadd'"
          >
            <el-button type="primary">新建</el-button>
          </router-link>
          <!-- 产品说暂时不要 -->
          <!-- <el-button type="primary" @click="importSelectItems" v-if="belong === '2' && isPermission">同步上级数据</el-button> -->
        </el-col>
      </el-row>
      <el-table v-loading.body="loading" :data="tableData" :border="false">
        <!-- <el-table-column type="index" label="序号" align="center" width="70"></el-table-column> -->
        <el-table-column prop="name" label="组套名称"></el-table-column>
        <el-table-column label="组套分类">
          <template slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceSetClassification"></sys-value>
          </template>
        </el-table-column>
        <el-table-column v-if="belong === '1'" prop="relateOrgList" label="关联机构">
          <template slot-scope="scope">{{relateOrgList(scope.row.relateOrgList)}}</template>
        </el-table-column>
        <!-- <el-table-column prop="spec" label="规格" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.spec">--</span>
            <span v-else>{{scope.row.spec}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="unit" label="销售单位" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.unit">--</span>
            <sys-value v-else type="THC_WH_DOSE_UNIT" :code="scope.row.unit"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="isValid" label="状态" align="center">
          <template slot-scope="scope">
            <el-tooltip :disabled="!!scope.row.isValid" content="集团已停用,无法启用" placement="top" effect="light" :open-delay="500">
              <el-switch
                :disabled="!scope.row.isValid"
                :value="!!scope.row.orgServiceSetRelation.isValid"
                @input="(val) => scope.row.orgServiceSetRelation.isValid = val"
                @change="(val) => changeIsValid(val, scope.row)"></el-switch>
            </el-tooltip>
                {{scope.row.orgServiceSetRelation.isValid ? '启用' : '停用'}}
            <!-- <sys-value type="THC_SOB_AVAILABLE_STATE" :code="scope.row.isValid"></sys-value> -->
          </template>
        </el-table-column>
        <template v-for="item in priceColumns">
        <el-table-column
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          align="right"
        >
          <template slot-scope="scope">
            <span>{{getPrice(scope.row.serviceSetPriceList, item.prop)}}</span>
          </template>
        </el-table-column>
      </template>
        <el-table-column prop label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              v-if="$hasPermission('Auth_menu_clinic_medicalset_serviceset_btn')"
              @click="$router.push(`/${belong === '1' ? 'group' : 'warehouse'}/serviceset/${belong}/${scope.row.id}?orgId=${scope.row.orgId}`)"
            >{{belong === '1' ? '编辑' : '详情'}}</el-button>
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
    </div>
    <import-select-dialog ref="importSelect" @update="updateList"></import-select-dialog>
  </div>
</template>

<script>
import api from '../../store/servicesetapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import list from '@/util/list'
import importSelectDialog from './import.dialog'
import manageApi from '@/manages/page/prescription/managesapi'
import storage from '@/util/storage'
import {getPriceBaseColumns} from '@/manages/components/price.manage/price.info'
import download from '@/sob/store/download.file.js'
let schema = [
  {
    name: 'serviceClassificationList',
    type: 'cascader',
    label: '组套分类',
    options: [],
    clearable: true,
    filterable: true
  },
  {
    name: 'isValids',
    type: 'systype',
    code: 'THC_SOB_AVAILABLE_STATE',
    useValue: true,
    label: '状态',
    clearable: true
  },
  {
    name: 'name',
    type: 'text',
    label: '组套名称',
    clearable: true
  }
]
export default {
  mixins: [list, download],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.serviceClassificationList = []
    obj.usePermission = 1
    // obj.belongType = this.$route.params.belong
    return {
      api,
      tableData: [],
      querySchema: schema,
      queryObj: obj,
      belong: this.$route.params.belong,
      isPermission: false,
      priceColumns: []
    }
  },
  components: {
    importSelectDialog
  },
  async created () {
    this.priceColumns = await getPriceBaseColumns()
    this.getPermission()
    this.getClassOptions()
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
      if (this.queryObj.serviceClassificationList && this.queryObj.serviceClassificationList.length) {
        this.queryObj.serviceClassification = this.queryObj.serviceClassificationList[0]
        if (this.queryObj.serviceClassificationList.length > 1) {
          this.queryObj.threeServiceClassify = this.queryObj.serviceClassificationList[1]
        } else {
          this.queryObj.threeServiceClassify = ''
        }
      } else {
        this.queryObj.serviceClassification = ''
        this.queryObj.threeServiceClassify = ''
      }
      if (this.queryObj.isValids) {
        this.queryObj.isValid = Number(this.queryObj.isValids)
      } else {
        delete this.queryObj.isValid
      }
      this.queryObj.usePermission = 1
      // this.queryObj.managerPermission = 0
      this.current = 1
      this.offset = 0
      this.list()
    },
    importSelectItems () {
      this.$refs.importSelect.open()
    },
    updateList () {
      this.query()
    },
    changeIsValid (isValid, row) {
      // this.loading = true
      let params = {
        serviceSetIds: [row.id],
        isValid: isValid ? 1 : 0
      }
      this.api.updateValidStatus(params).then(res => {
        this.query()
      })
    },
    // 同步上级机构组套权限
    getPermission () {
      const clinicId = storage.getLocalStorage('CLINICID')
      manageApi.getTreeNodes({
        outOrgGetOrgListByConditionReqDTO: {idList: [clinicId]}
      }).then(res => {
        if (res.length && res[0].parentCode !== '0') {
          manageApi.getClinicManageConfigForRecord({
            orgid: clinicId,
            type: 118
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
    // 组套价格
    getPrice (priceList, prop) {
      if (!priceList || !priceList.length) {
        return '--'
      }
      for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].scene === prop) {
          return +priceList[i].price
        }
      }
      return '--'
    }
  },
  watch: {
    '$route.params.belong' (val) {
      this.belong = val
      // this.queryObj.belongType = val
      this.query()
    },
    'queryObj.serviceClassificationList' (val) {
      this.query()
    }
  }
}
</script>
