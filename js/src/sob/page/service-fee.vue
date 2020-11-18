<template>
  <div>
    <el-dialog
      title="关联科室"
      :visible.sync="dialog"
      class="ui_dialog_02 test"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :inline="true">
        <el-form-item label="机构" v-if="belong !== '2'">
          <sys-select v-model="orgId" :options="clinicList"></sys-select>
        </el-form-item>
        <el-form-item label="科室类型">
          <el-select v-model="provideType" placeholder="请选择">
            <el-option
              v-for="item in sysTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        ref="deptTable"
        :data="dptData"
        style="width: 100%;margin-top: 0;"
        @selection-change="handleSelection"
        :border="false"
      >
        <el-table-column type="selection" width="35" :selectable="selectable"></el-table-column>
        <el-table-column prop="name" label="科室名称">
					<template slot-scope="scope">
						<span>{{scope.row.name}}</span>
						<span v-if="scope.row.providerStatus !== 'Y' || scope.row.providerUsePermissionStatus !== 'Y'" class="row-disabled">(已禁用)</span>
					</template>
				</el-table-column>
        <el-table-column label="顺序">
          <template slot-scope="scope">
            <el-form
              class="custom-form"
              label-width="0"
              ref="sortform"
              :rules="sortRules"
              :model="dptData[scope.$index]"
            >
              <el-form-item prop="sort">
                <el-input
                  v-model.number="dptData[scope.$index].sort"
                  class="spcinput"
                  @change="change(scope)"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relationHandle">提交</el-button>
      </div>
    </el-dialog>
    <h4 style="margin: 0;">
      已关联科室
      <el-button type="primary" @click="dialog=true;" size="small" style="float:right; margin-bottom: 20px;">新增</el-button>
    </h4>
    <el-table :data="relatedData" style="width: 100%" :border="false">
      <el-table-column prop="sort" label="顺序">
        <template slot-scope="scope">
          <!-- <sys-value type="THC_BASE_SUBJECT2" :code="`${scope.row.providerType}`"></sys-value> -->
          <sort-edit :value="scope.row.sort" @change="editProviderSort($event, scope.row)"></sort-edit>
        </template>
      </el-table-column>
      <el-table-column prop="orgName" label="机构名称" v-if="belong !== '2'"></el-table-column>
      <el-table-column label="科室类型">
        <template slot-scope="scope">
          <sys-value type="THC_BASE_SUBJECT2" :code="`${scope.row.providerType}`"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="providerName" label="科室名称">
        <template slot-scope="scope">
          <span>{{scope.row.providerName}}</span>
          <span v-if="scope.row.providerStatus !== 'Y' || scope.row.providerUsePermissionStatus !== 'Y'" class="row-disabled">(已禁用)</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <ever-confirm :msg="'确定删除该项？'" action="删除" @confirm="removeRelation(scope.row.id)"></ever-confirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import servicefeeapi from '../store/servicefeeapi'
import departmentapi from '../store/departmentapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import sortEdit from '../components/sort.edit.vue'

export default {
  components: { sortEdit },
  props: ['belong', 'objDetail', 'flag', 'advideType', 'clinicList'],
  data () {
    var validatePass = (rule, value, callback) => {
      // let obj = this.dptData.filter((v, u) => {
      //   return (v && v.sort) === value
      // })
      if (typeof value !== 'number' && value) {
        callback(new Error('顺序必须为数字'))
      // } else if (obj.length > 1 && value) {
      //   callback(new Error('顺序不能重复'))
      } else {
        callback()
      }
    }
    return {
      sysTypeList: [],
      orgId: '',
      queryName: null,
      remoteMethod: this.queryUnRelated,
      relatedData: [],
      serviceId: this.$route.params.id,
      dialog: false,
      items: [],
      relationType: '1',
      arrId: [],
      activeType: '1',
      dptData: [],
      serviceProviderRList: [],
      sortRules: {
        sort: [{ validator: validatePass }]
      },
      scene: '',
      timer: '',
      provideType: ''
    }
  },
  async created () {
    let res = await sysvalue.listOnce('THC_BASE_SUBJECT2')
    res = res.filter(item => {
      return item.parentId === '01' || item.parentId === '02'
    })
    if (res.length) {
      this.sysTypeList = res
      this.provideType = res[0].code
    }
    if (this.flag) {
      this.relationType = this.flag
    }
    this.relationList()
  },
  methods: {
    delayExe (fn, time = 200, arg) {
      if (this.timer) {
        window.clearTimeout(this.timer)
      }
      this.timer = window.setTimeout(() => {
        fn(arg)
        this.timer = ''
      }, time)
    },
    deleteRow (index, arr) {
      arr.splice(index, 1)
    },
    async queryProviderList () {
      if (this.$refs.deptTable) this.$refs.deptTable.clearSelection()
      this.dptData = []
      if (this.belong === '1' && !this.orgId) {
        return
      }
      let params = {
        serviceId: this.serviceId,
        relationType: this.flag, // 1-开单科室 2-执行科室
        adviceType: String(this.objDetail.isSet) === '1' ? 2 : 1, // 医嘱分类：1-收费项目；2-组套
        providerTypes: [this.provideType]
      }
      if (this.advideType) {
        params.adviceType = this.advideType
      }
      try {
        const res = await servicefeeapi.getProviderNot(params) // 获取未关联的科室
        if (res) {
          res.forEach(item => {
            this.dptData.push({
              id: item.providerId,
              name: item.providerName,
              sort: '',
              providerType: item.providerType,
              providerStatus: item.providerStatus,
              providerUsePermissionStatus: item.providerUsePermissionStatus
            })
          })
          const vm = this
          if (this.$refs.deptTable) {
            this.relatedData.forEach(selectedItem => {
              if (selectedItem.scene === Number(vm.scene)) {
                this.dptData.forEach(item => {
                  if (selectedItem.providerId === item.sectionRecordId) {
                    this.$refs.deptTable.toggleRowSelection(item, true)
                  }
                })
              }
            })
          }
        } else {
          this.dptData = []
        }
      } catch (err) {
        this.dptData = []
      }
    },
    queryUnRelated (query) {
      query = query && query.trim()
      departmentapi.getService({ name: query }).then(result => {
        this.items.filter(v => {
          return v.relationType === '1'
        })
        this.items = result.data
      })
    },
    relationList () {
      let params = {
        serviceId: this.serviceId,
        relationType: this.flag,
        adviceType: String(this.objDetail.isSet) === '1' ? 2 : 1
      }
      if (this.advideType) {
        params.adviceType = this.advideType
      }
      servicefeeapi.getServicefee(params).then(results => {
        this.relatedData = results.data
      })
    },
    change (scope) {
      this.serviceProviderRList.forEach(item => {
        if (scope.row.id === item.providerId) {
          item.sort = scope.row.sort
        }
      })
    },
    handleSelection (select) {
      if (select && select.length) {
        this.serviceProviderRList = []
        select.forEach(item => {
          this.serviceProviderRList.push({
            providerId: item.id,
            providerType: item.providerType,
            sort: item.sort
          })
        })
      }
    },
    async relationHandle () {
      if (!this.serviceProviderRList || !this.serviceProviderRList.length) {
        return this.$messageTips(this, 'warning', '请选择要关联的科室', '提示')
      }
      let isValidate = false
      // let list = []
      // let n = 0
      let max = 0
      this.serviceProviderRList.forEach(item => {
        if (typeof item.sort === 'number') {
          if (max < item.sort) {
            max = item.sort
          }
        }
      })
      this.serviceProviderRList.forEach(item => {
        if (!item.sort) {
          item.sort = ++max
        } else {
          if (typeof item.sort !== 'number') {
            isValidate = true
          }
        }
      })
      if (!isValidate) {
        let params = {
          serviceId: this.serviceId,
          serviceProviderRList: this.serviceProviderRList,
          relationType: this.flag, // 1-开单科室；2-执行科室
          adviceType: String(this.objDetail.isSet) === '1' ? 2 : 1 // 医嘱分类：1-收费项目；2-组套
        }
        if (this.advideType) {
          params.adviceType = this.advideType
        }
        const res = await servicefeeapi.createServiceProviderRBatch(params)
        this.delayExe(this.addTip, 500, res)
      }
    },
    addTip (res) {
      if (res && res.head && res.head.errCode === 0) {
        this.dialog = false
        this.relationList()
        this.$messageTips(this, 'success', '操作成功', '成功')
      }
    },
    removeRelation (id) {
      this.delayExe(() => {
        servicefeeapi.deleteService([id]).then(_ => {
          this.relationList()
        })
      }, 500)
    },
    editProviderSort (sort, row) {
      let params = {
        serviceProviderRList: [{
          id: row.id,
          sort
        }]
      }
      servicefeeapi.updateProviderSort(params).then(res => {
        this.relationList()
      })
    },
    selectable (row) {
      return row.providerStatus === 'Y' && row.providerUsePermissionStatus === 'Y'
    }
  },
  watch: {
    dialog (val) {
      if (val === true) {
        this.queryProviderList()
      }
    },
    provideType () {
      this.queryProviderList()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table .el-form /deep/ .el-form-item {
  margin-bottom: 0;
}
.el-table .el-form /deep/ .el-form-item__content {
  line-height: auto;
}
.type_tabs {
  /deep/.el-tabs__header {
    margin: 0;
  }
}
.spcinput {
  width: 70px;
  /deep/.el-input__inner {
    height: 25px;
    line-height: 25px;
  }
}
/deep/ .el-table {
  .el-table__body {
    td {
      .el-form-item__error {
        top: 31%;
        left: 80px;
      }
    }
  }
}
.row-disabled {
	color: red;
}
</style>

