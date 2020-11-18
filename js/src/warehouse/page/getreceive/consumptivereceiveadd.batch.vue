<template>
  <div>
    <ever-bread-crumb name="领用" @back="backTo"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>填写基础信息</h4>
        <ever-form2
          :schema="receiveSchema"
          v-model="obj"
          ref="form"
          :rules="rules"
          :nosubmit="true">
        </ever-form2>

        <h4>添加物资</h4>
        <batch-table
          v-model="tableData"
          :queryParams="queryParams"
          ref="batchTable"
          numName="领用">
        </batch-table>
        <!-- 按钮组 -->
        <div class="footer">
          <el-button class="w_100" type="primary" size="small" :disabled="btnGray" :loading="unRepeatedBtn" @click="submitData(true)">提交</el-button>
          <el-button type="primary" size="small" :disabled="btnGray" :loading="unRepeatedBtn" @click="submitData(false)">暂存</el-button>
          <el-button size="small" :loading="unRepeatedBtn" @click="$router.go(-1)">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import supplyapi from '@/warehouse/page/supplyapi/supplyapi.js'
import api from '@/warehouse/page/getreceive/receiveapi.js'
import storageroomApi from '@/warehouse/store/storageroomapi.js'
import storage from '@/util/storage'
import { receiveSchema } from '@/warehouse/page/storages/business/store/batch.columns.js'
import { debounce } from '@/util/common'

export default {
  data () {
    let obj = this.$ever.createObjFromSchema(receiveSchema)
    return {
      pathName: '',
      tableData: [],
      unRepeatedBtn: false,
      queryParams: { offset: 0, pagesize: 9999, storageRoomId: '', state: 0, isNeedStock: true },
      receiveSchema,
      obj,
      rules: {
        storageRoomId: { required: true, message: '必填项', trigger: 'change' },
        sectionId: { required: true, message: '必填项', trigger: 'change' }
      }
    }
  },
  components: {
    batchTable: () => import('@/warehouse/page/storages/business/component/batch.table.vue')
  },
  watch: {
    '$route' (val) {
      this._initPath(val.path)
    },
    'obj.storageRoomId' (val, oldval) {
      this.oldVal = oldval
      this.getOpen(val, oldval, 'storageRoomId', '发货库房')
    },
    obj: {
      handler (v) {
        if (v.storageRoomId) {
          this.queryParams.storageRoomId = v.storageRoomId
        } else {
          this.tableData = []
        }
        if (v.storageRoomId && !this.tableData.length) {
          this.tableData = [{ add: true }]
        }
      },
      deep: true
    }
  },
  computed: {
    btnGray () {
      if (this.tableData && this.tableData.length && this.tableData.length === 1) {
        const data = this.tableData[0]
        let { localMaterialId, num } = data
        if (localMaterialId && num > 0) {
          return false
        } else {
          return true
        }
      } else {
        return !this.tableData.length
      }
    }
  },
  created () {
    this._initPath(this.$route.path)
    this.init()
    const { params } = this.$route
    if (params && params.id) this.getDetails(params.id, 1)
  },
  methods: {
    submitData: debounce(function (submitClick) {
      this.$refs.form.$refs.form.validate(vali => {
        if (vali) {
          const { storageRoomId, sectionId, description = '', id = false, code = false } = this.obj
          let params = {
            pageType: 'consumptivereceive',
            materialType: '',
            storageRoomId,
            sectionId,
            description,
            pricingModel: 1
          }
          let itemList = []
          let submit = false
          for (let i = 0; i < this.tableData.length; i++) {
            const { localMaterialId, num } = this.tableData[i]
            if (localMaterialId && num === '') submit = true
            // 如果有未填写的领用数量跳出循环
            if (submit) break
            if (localMaterialId) {
              itemList.push(this.tableData[i])
            }
          }
          params.applyItemList = itemList
          if (id) params.id = id
          if (code) params.code = code
          if (submit) return this.everWarning('物资列表还有信息未录入')
          api[submitClick ? 'submitApply' : 'temporaryStorage'](params).then(res => {
            if ((res instanceof Object && Object.keys(res).length)) {
              if (submitClick) {
                if (res.flag) {
                  let { list } = res
                  this.$router.push(`/goods/consumptivereceive/${list[0]}?isBatch=true`)
                } else {
                  if (res.message) {
                    return this.$messageTips(this, 'warning', `${res.message.message}`, '提示', 2500, true)
                  } else {
                    let msgData = res.list.map(msg => `<div>${msg}</div>`)
                    return this.$messageTips(this, 'warning', `${msgData.join('')}无效，请您点击删除`, '提示', 2500, true)
                  }
                }
              } else {
                this.obj.id = res.id
                this.obj.code = res.code
              }
            }
            return this.everSuccess(`${submitClick ? '提交' : '暂存'}成功`)
          })
          setTimeout(() => {
            this.unRepeatedBtn = false
          }, 300)
        }
      })
    }),
    // 切换
    getOpen (val, oldval, valKey, msg) {
      if (this.tableData.length && !this.tableData[0].localMaterialId && this.$refs.batchTable.remoteselect) {
        this.$refs.batchTable.remoteselect.options = []
      }
      // @flag 物资列表是否已经添加物资
      let flag = this.tableData.find(item => item.localMaterialId)
      if ((val && oldval && val !== oldval) && flag) {
        if (this.btn !== 7) { // 点击取消阻止触发弹窗
          let dom = document.querySelectorAll('.el-form .el-input__inner')
          if (dom && dom.length) dom.forEach(item => { item.blur() })
          this.$confirm(`领用单中已经添加物资，如需修改${msg}，将自动清空所有物资`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tableData = []
            setTimeout(_ => { this.tableData = [{ add: true }] }, 100)
            this.$refs.batchTable.resetTable()
          }).catch(() => {
            this.handlerCancelStorage()
          })
          this.valKey = valKey
          this.btn = 4
        } else { // 还原btn状态
          this.btn = 0
        }
      }
    },
    // 取消更换库房
    handlerCancelStorage () {
      if (![0, 1, 2, 3, 5].includes(this.btn)) {
        this.obj[this.valKey] = this.oldVal ? this.oldVal : ''
        this.btn = 7
      }
    },
    init () {
      this.getSections()
      this._getStorageRoom()
    },
    getDetails (id, isCopy) {
      api.getById({ ids: [id], isCopy }).then(res => {
        if (res && res.length) {
          let data = res[0]
          let needTable = []
          let noNeedTable = []
          this.obj.sectionId = data.sectionId
          this.obj.storageRoomId = data.storageRoomId
          this.obj.description = data.description
          if (data.status === 51) {
            this.obj.id = data.id
            this.obj.code = data.code
          }
          data.applyItemList.forEach(item => {
            if (!item.materialState) {
              needTable.push(item)
            } else {
              noNeedTable.push(`<div>${item.materialName}</div>`)
            }
          })
          // 删除禁用状态物资
          if (noNeedTable.length) {
            this.$messageTips(this, 'warning', `${noNeedTable.join('')}无效，已为您删除。`, '提示', 2500, true)
          }
          this.tableData = [...needTable, {add: true}]
        }
      })
    },
    // 获取领用科室
    getSections () {
      let params = {
        orgIdList: [storage.getStorageByClinic('CLINICID') || ''],
        pagesize: 10000,
        offset: 0,
        usePermissionStatus: 'Y'
      }
      supplyapi.getTenantSubjectListByCondition(params).then(res => {
        if (res && res.data) {
          let arr = []
          res.data.resultList.forEach(item => {
            arr.push({
              id: item.id,
              name: item.tenantSubjectName
            })
          })
          this.$ever.getFieldFromSchema(this.receiveSchema, 'sectionId').props.options = arr
          if (arr.length === 1) {
            this.obj.sectionId = arr[0].id
          }
        }
      })
    },
    // 获取发货库房
    _getStorageRoom () {
      let schemaProps = this.$ever.getFieldFromSchema(this.receiveSchema, 'storageRoomId').props
      storageroomApi.list({ materialType: '', name: '', isInvented: 0, offset: 0, pagesize: 99999 }).then(res => {
        if (res && res.list) {
          schemaProps.options = this.storageroomArr = JSON.parse(JSON.stringify(res.list))
          if (res.list.length === 1) this.obj.storageRoomId = this.storageroomArr[0].id
        }
      })
    },
    _initPath (path) {
      if (path.indexOf('/csa/warehouse') > -1) {
        this.pathName = '/csa/warehouseuses'
      } else {
        this.pathName = '/goods/consumptivereceives'
      }
    },
    backTo () {
      if (this.pathName === '/csa/warehouseuses') {
        this.$router.push(this.pathName)
      } else {
        this.$router.go(-1)
      }
    }
  }
}

</script>
