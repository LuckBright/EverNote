<template>
  <div>
    <ever-bread-crumb name="库房管理" path="/warehouse/storagerooms"></ever-bread-crumb>
    <div class="layout_inner">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="ever_tabs_top">
        <el-tab-pane label="基本信息" name="essentialInfo">
          <add-storageroom></add-storageroom>
        </el-tab-pane>
        <el-tab-pane label="人员管理" name="staffInfo">
          <div class="main-head">
            <div class="mb20">
              <span class="employeeInfo">员工姓名</span>
              <template>
                <ever-staff-remote-select
                  size="small"
                  class="remote-select"
                  v-model="querySchema"
                  ref="remoteselect"
                  :remote-method="queryRemote"
                  filterable
                  remote
                  :params="params"
                  @change="handleSelect"
                  placeholder="请输入所要添加员工姓名"
                  obj="true"
                  :showKeys="['name', 'sex', 'departmentName']"
                  :delOptions="tableData.length ? tableData : []"
                ></ever-staff-remote-select>
              </template>
              <el-button @click="addEmployeeInfo(queryObj)" size="medium" type="primary">添加</el-button>
            </div>
          </div>
          <div class="storeroom_personnel_details">库房人员详情</div>
          <div v-if="cacheTableDate.length">
            <el-table :data="cacheTableDate" style="width: 100%">
              <el-table-column show-overflow-tooltip align="center" prop label="姓名">
                <template slot-scope="scope">
                  <span v-if="scope.row.staffObject">{{scope.row.staffObject.name}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop label="性别">
                <template slot-scope="scope">
                  <span v-if="scope.row.genderName">{{scope.row.genderName}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop label="人员状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.statusName">{{scope.row.statusName}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop label="操作">
                <template slot-scope="scope">
                  <ever-confirm
                    width="228px"
                    placement="left"
                    :msg="'是否将该员工从库房人员中移除？'"
                    action="移除"
                    @confirm="del(scope.row.id)"
                  ></ever-confirm>
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
          <ever-no-data v-else tipTxt="还未添加任何人员信息"></ever-no-data>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import staffapi from '@/warehouse/store/staffapi'
import storageroomapi from '../store/storageroomapi'
import storage from '@/util/storage'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import everStaffRemoteSelect from '@/components/staffremoteselect'
import addStorageroom from './storageroom.new'
var obj = {}
obj.staffObj = ''
export default {
  mixins: [list, storage, getStorage],
  data () {
    return {
      obj,
      activeName: 'essentialInfo',
      querySchema: {},
      params: {
        offset: 0,
        pagesize: 20
      },
      tableData: [],
      cacheTableDate: []
    }
  },
  methods: {
    emptyFn () {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    },
    async _setStorageItem () {
      let initstorageId = storage.getLocalStorage('INIT_STORAGE_ID') || storage.getLocalStorage('STORAGE_ID')
      let initstorageFlag = false
      let storageList = await storageroomapi.list({ userType: 1 })
      if (storageList && storageList.list && storageList.list.length) {
        storageList.list.forEach(item => {
          if (item.id === initstorageId) initstorageFlag = true
        })
        let storageItem = []
        storageItem = storageList.list
        if (!initstorageFlag) {
          storage.removeLocalStorage('INIT_STORAGE_ID')
          storage.removeLocalStorage('STORAGE_ID')
          storage.removeLocalStorage('STORAGE_ID_VUEX')
        }
        storage.setLocalStorage('STORAGE_ITEM', JSON.stringify(storageItem))
      } else {
        this.removeStorage()
      }
    },
    removeStorage () {
      storage.removeLocalStorage('STORAGE_ID')
      storage.removeLocalStorage('STORAGE_ITEM')
      storage.removeLocalStorage('INIT_STORAGE_ID')
      storage.removeLocalStorage('MATERIAL_TYPE')
      storage.removeLocalStorage('STORAGE_ID_VUEX')
    },
    handleClick (tab, event) {
      this.queryObj = {}
      this.staffFlag = false
      this.medicineFlag = false
      if (tab.name === 'staffInfo') {
        this.staffFlag = true
        this.api = staffapi
        this.listApiName = 'getStaffRoleList'
        this.queryObj = { nodeId: this.$route.params.id, roleType: 1 }
        this.list(this.queryObj)
      } else if (tab.name === 'medicinesetting') {
        // this.medicineFlag = true
        // this.getDispenseSetting()
      } else if (tab.name === 'essentialInfo') {
        // this.editMaterialType = true
        // this.$refs.essentialInfo.getDetail()
      }
    },
    queryRemote (query) {
      return query && query.name ? staffapi.list(query) : this.emptyFn()
    },
    handleSelect (obj) {
      this.obj.staffObj = {
        id: obj.id ? obj.id : ''
      }
    },
    addEmployeeInfo () {
      if (!this.obj.staffObj.id) {
        this.$messageTips(this, 'warning', '请选择需要添加的人员')
        return
      }
      let params = {
        staffId: this.obj.staffObj.id,
        nodeId: this.$route.params.id,
        roleType: 1
      }
      staffapi.createStaffRole(params).then(res => {
        this.list()
        this.querySchema = {}
        this._setStorageItem()
        this.removeStorage()
      })
    },
  },
  components: {
    addStorageroom,
    everStaffRemoteSelect
  },
  created () {

  },
  watch: {
    'tableData' (val) {
      if (this.staffFlag && (val.length || this.cacheTableDate.length === 1)) {
        this.cacheTableDate = val
      } else if (this.medicineFlag && val.length) {
        this.medicineTableData = this._medicineEach(val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ever_tabs_top {
  margin: -10px;
  min-height: calc(100vh - 140px);
}
.el-form {
  min-height: calc(100vh - 230px);
}
.w200 {
  width: 200px !important;
}
.leftw180 {
  margin-left: -100px;
  i.titleLabel {
    display: inline-block;
    width: 4px;
    margin-right: 10px;
    height: 18px;
    position: relative;
    top: 3px;
    background: #1c7bef;
    border-radius: 2px;
  }
}
.el-form-item__content > div {
  margin-left: 30px;
}
.storeroom_personnel_details {
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  color: #666666;
}
.main-head {
  border-bottom: 1px solid #eee;
  padding: 0 0 20px 0;
}
.employeeInfo {
  font-size: 14px;
  color: #666666;
}
.remote-select {
  width: 320px !important;
  // margin: 0 38px 0 10px;
}
.imgWidth {
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  img {
    width: 100%;
  }
}
.queryClass {
  margin: 0 !important;
  width: 49.7% !important;
  display: inline-block;
}
</style>
