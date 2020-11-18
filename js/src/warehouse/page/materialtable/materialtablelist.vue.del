<template>
  <div>
    <ever-bread-crumb name="物资列表" :path="path"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="pos_re">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <el-button type="primary" class="btn pos_ab" @click="handleCreateMaterial">创建物资</el-button>
        <div class="settle_inner">
          <el-menu class="settlemenu">
            <el-menu-item
              @click="$router.push('/warehouse/materialtables/drugs')"
              :class="$route.name === 'materialDrugs' ? 'is-active' : 'is-inactive'"
              index="inventoryQuery"
            >药品</el-menu-item>
            <el-menu-item
              @click="$router.push('/warehouse/materialtables/expandables')"
              :class="$route.name === 'materialExpandables' ? 'is-active' : 'is-inactive'"
              index="enterQuery"
            >耗材</el-menu-item>
            <el-menu-item
              @click="$router.push('/warehouse/materialtables/equipments')"
              :class="$route.name === 'materialEquipments' ? 'is-active' : 'is-inactive'"
              index="commodityflow"
            >设备</el-menu-item>
          </el-menu>
        </div>
        <el-table v-loading.body="loading" :data="tableData" border>
          <el-table-column prop="code" label="编码" min-width="180"></el-table-column>
          <el-table-column prop label="类型">
            <template slot-scope="scope">
              <span>{{setName(typeOpts, scope.row.drugType || scope.row.consumptiveType || scope.row.equipmentType)}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="300" prop="name" label="物资名称">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="blue"
                @click="handleLookDetail(scope.row.id, activeName, scope.row.localMaterialId, scope.row)"
              >
                {{scope.row.name}}
                <span v-if="scope.row.byname">- {{scope.row.byname}}</span>
                <span v-if="scope.row.manufacturerObject">- {{scope.row.manufacturerObject.name}}</span>
              </el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="spec" label="规格">
          <template slot-scope="scope">
            <span>{{_materialSpec(scope.row)}}</span>
          </template>
          </el-table-column>-->
          <el-table-column width="180" prop="ratifyCode" label="注册证号/批准文号">
            <template slot-scope="scope">{{scope.row.ratifyCode || scope.row.registerCode}}</template>
          </el-table-column>
          <el-table-column width="60" prop="localMaterialState" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialState == 0">启用</span>
              <span v-else class="font red">禁用</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="180" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.localMaterialId != 0">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleEdit(scope.row.id, activeName, scope.row.localMaterialId, scope.row)"
                >编辑</el-button>
                <el-button
                  type="success"
                  size="small"
                  v-if="scope.row.localMaterialState == 1"
                  @click="handleEnableOrDisable(scope.row.localMaterialId, 0)"
                >启用</el-button>
                <el-button
                  type="danger"
                  size="small"
                  v-else
                  @click="handleEnableOrDisable(scope.row.localMaterialId, 1)"
                >禁用</el-button>
              </div>
              <el-button
                v-if="scope.row.localMaterialId == 0"
                type="info"
                size="small"
                @click="handleRelationLocal(scope.row.id, activeName, scope.row.localMaterialId, scope.row)"
              >引用至本地</el-button>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </div>
    </div>
    <el-dialog width="360px" :visible.sync="toggleDialog" custom-class="ui_dialog_01">
      <div style="height:160px;padding: 20px 25px 0; font-size: 20px" class="alg_c">
        <h4>操作提示</h4>
        <p style="font-size: 16px; color: #000;">确定将该物资{{currentState == 1 ? '禁用' : '启用'}}？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel" type="primary">取消</el-button>
        <el-button @click="handleDialogConfirm" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import drugapi from '@/warehouse/store/drugapi'
import globalEquipmentApi from '@/warehouse/store/globalequipmentapi'
import materialapi from '@/warehouse/store/materialapi'
import list from '@/util/list'
import sysvalue from '@/warehouse/store/sysvalueapi'
import localDrugSettingApi from '@/warehouse/store/localdrugsettingapi'
import setname from '@/util/setstatusname'
import { MATERIALTYPE_TYPE, CHINESE_MEDICINE_TYPE } from '@/util/common'
let querySchema = [
  {
    name: 'name',
    label: '商品名称',
    placeholder: '商品名/通用名/注册证号/批准文号',
    style: 'width: 430px'
  },
  {
    name: 'drugType',
    label: '类型',
    type: 'select',
    options: []
  }
]
let drugTypeList = [
  { id: 301, name: '西药' },
  { id: 302, name: '中成药' },
  { id: 303, name: '中药饮片' },
  { id: 304, name: '中药颗粒' }
]
let materTypeList = [
  { id: 299, name: '办公耗材' },
  { id: 300, name: '医用耗材' }
]
let equipmentTypeList = [
  { id: 503, name: '办公设备' }
]
export default {
  mixins: [list, setname],
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.drugType = ''
    queryObj.consumptiveType = ''
    queryObj.equipmentType = ''
    return {
      api: '',
      querySchema,
      queryObj,
      typeOpts: [],
      path: this.$route.path,
      count: 0,
      activeName: 'drugs',
      pathName: this.$route.name,
      toggleDialog: false,
      currentState: 1,
      dialogParams: {}
    }
  },
  mounted () {
    this._getList(this.$route.name)
  },
  created () {
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
      this.typeOpts = res
    })
  },
  methods: {
    initSchema (name) {
      if (querySchema[1]) querySchema.splice(1, 1)
      if (name === 'materialDrugs') {
        querySchema.push({
          name: 'drugType',
          label: '类型',
          type: 'select',
          options: drugTypeList
        })
        this.queryObj.equipmentType = this.queryObj.consumptiveType = ''
      }
      if (name === 'materialExpandables') {
        querySchema.push({
          name: 'consumptiveType',
          label: '类型',
          type: 'select',
          options: materTypeList
        })
        this.queryObj.drugType = this.queryObj.equipmentType = ''
      }
      if (name === 'materialEquipments') {
        querySchema.push({
          name: 'equipmentType',
          label: '类型',
          type: 'select',
          options: equipmentTypeList
        })
        this.queryObj.consumptiveType = this.queryObj.drugType = ''
      }
    },
    handleLookDetail (id, activeName, localId, v) {
      let curTab = this.path.split('/').pop()
      localId = localId || 0
      if (CHINESE_MEDICINE_TYPE.includes(v.drugType)) {
        this.$router.push(`/warehouse/materialsee/${id}?source=${curTab}&localId=${localId}&drugType=${v.drugType}`)
      } else {
        this.$router.push(`/warehouse/materialsee/${id}?source=${curTab}&localId=${localId}`)
      }
    },
    handleDialogConfirm () {
      localDrugSettingApi.updateState(this.dialogParams).then(result => {
        this.handleDialogCancel()
        if (result && !result.state) return
        this.$messageTips(this, 'success', `物资${this.dialogParams.state === 1 ? '禁用' : '启用'}成功`, '提示')
        this.list()
      })
    },
    handleDialogCancel () {
      this.toggleDialog = false
    },
    handleEnableOrDisable (id, state) {
      this.currentState = state
      this.dialogParams = { id, state }
      this.toggleDialog = true
    },
    handleRelationLocal (id, activeName, localId, v) {
      let curTab = this.path.split('/').pop()
      if (curTab === 'drugs') v.materialType = MATERIALTYPE_TYPE[0].id
      if (curTab === 'expandables') v.materialType = MATERIALTYPE_TYPE[1].id
      if (curTab === 'equipments') v.materialType = MATERIALTYPE_TYPE[2].id
      v.globalMaterialId = v.id
      delete v.id
      // 管理方式 默认为数量管理 1
      v.isNum = 1
      let supplierArr = []
      v.supplierLocalProductVos = supplierArr
      localDrugSettingApi.createOrUpdate(v).then(res => {
        if (res && res.id) {
          if (CHINESE_MEDICINE_TYPE.includes(v.drugType)) {
            this.$router.push(`/warehouse/materialsee/${id}?source=${curTab}&localId=${res.id}&reset=1&drugType=${v.drugType}`)
          } else {
            this.$router.push(`/warehouse/materialsee/${id}?source=${curTab}&localId=${res.id}&reset=1&goTo=1`)
          }
          this.$messageTips(this, 'success', '关联本地成功', '提示')
        }
      })
    },
    handleEdit (id, activeName, localId, v) {
      let curTab = this.path.split('/').pop()
      if (CHINESE_MEDICINE_TYPE.includes(v.drugType)) {
        if (localId !== '0') {
          this.$router.push(`/warehouse/materialsee/${id}?source=${curTab}&localId=${localId}&reset=1&drugType=${v.drugType}`)
        } else {
          this.$router.push(`/warehouse/materialsee/${id}?source=${curTab}&localId=${localId}&reset=1&goTo=1&drugType=${v.drugType}`)
        }
      } else {
        if (localId !== '0') {
          this.$router.push(`/warehouse/materialsee/${id}?source=${curTab}&localId=${localId}&reset=1`)
        } else {
          this.$router.push(`/warehouse/materialsee/${id}?source=${curTab}&localId=${localId}&reset=1&goTo=1`)
        }
      }
    },
    handleCreateMaterial () {
      this.$router.push('/warehouse/creatematerialadd')
    },
    _getList (name) {
      this.pathName = name
      this.queryObj.name = ''
      if (name === 'materialDrugs') {
        this.api = drugapi
        this.querySchema[1].options = drugTypeList
      }
      if (name === 'materialExpandables') {
        this.api = materialapi
        this.querySchema[1].options = materTypeList
      }
      if (name === 'materialEquipments') {
        this.api = globalEquipmentApi
        this.querySchema[1].options = equipmentTypeList
      }
      this.list()
    }
  },
  watch: {
    '$route' (v) {
      this.path = v.path
      if (this.pathName !== v.name) {
        this.initSchema(v.name)
        this._getList(v.name)
      }
    }
  }
}
</script>
<style scoped>
.pos_ab.btn {
  right: 20px;
  top: 35px;
  z-index: 9;
}
.tabs {
  margin-top: -10px;
}
.el-table {
  margin-top: 20px;
}
.settle_inner {
  margin: 0;
}
.settle_inner .settlemenu {
  background-color: #fff;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #000;
  line-height: 16px;
  border-bottom: 1px solid #eee;
  border-radius: 4px 4px 0 0;
  padding: 0 20px;
}
.settlemenu .el-menu-item {
  padding: 0 15px;
  background-color: #fff;
  font-size: 16px;
}
.settlemenu .el-menu-item {
  height: 50px;
  line-height: 50px;
  border-bottom: 3px solid transparent;
  display: inline-block;
}
.settlemenu .el-menu-item:hover,
.settlemenu .el-menu-item.is-active {
  border-bottom: 3px solid #1c7bef;
}
.settlemenu /deep/ .el-menu-item.is-inactive {
  border-bottom: none !important;
}
.settlemenu.el-menu {
  border-right: none;
}
</style>

