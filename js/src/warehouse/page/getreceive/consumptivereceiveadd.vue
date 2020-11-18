<template>
  <div>
    <ever-bread-crumb name="领用" @back="backTo"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>填写基础信息</h4>
        <ever-form2
          :schema="receiveSchema"
          v-model="obj"
          :rules="rules"
          :nosubmit="true">
        </ever-form2>
        <!-- 物资列表 -->
        <h4>添加物资</h4>
        <el-table
          border
          :data="tableData"
          empty-text="请先填写基础信息">
          <el-table-column label="物资名称" align="center" min-width="400">
            <template slot-scope="scope">
              <material-select
                v-if="scope.row.add && scope.$index === tableData.length - 1"
                ref="remoteselect"
                :params="queryParams"
                :needObjFlag="true"
                @change="handleSelect">
              </material-select>
              <span v-else class="fl">{{scope.row.materialName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center">
            <template slot-scope="scope">
              {{scope.row.spec || tableDefaultCellValue}}
            </template>
          </el-table-column>
          <el-table-column label="可用库存" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.usableNum != null">
              {{scope.row.usableNum}}{{scope.row.packagUnitName}}
              </span>
              <span v-else>{{tableDefaultCellValue}}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用数量" align="center" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.localMaterialId">
                <div class="fl">
                  <el-input
                    :class="{border_red: scope.row.red}"
                    placeholder="领用数量"
                    style="width: 100px"
                    v-model="scope.row.num"
                    type="number"
                    @blur="handleCheckNum(scope.row, false)"
                    size="small"
                  ></el-input>
                  {{scope.row.packagUnitName}}
                </div>
                <div class="fl w_60 stockRed">
                  <span class="red" v-if="scope.row.num > scope.row.usableNum">缺货</span>
                </div>
              </span>
              <span v-else>{{tableDefaultCellValue}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <i
                class="iconfont icon-bingli-shanchu"
                @click="handlerDelter(scope.$index)"
                :class="{'mr15': scope.$index === tableData.length - 1, 'red': !btnGray, 'cGray': btnGray}"
                v-if="tableData.length > 1 || (tableData.length === 1 && scope.row.localMaterialId)">
              </i>
              <i
                v-if="scope.$index === tableData.length - 1"
                @click="handlerAdd(scope.row, scope.$index)"
                :class="{ 'blue': !btnGray, 'cGray': btnGray }"
                class="iconfont icon-tianjiabingli">
                </i>
            </template>
          </el-table-column>
        </el-table>

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
import storageroomApi from '@/warehouse/store/storageroomapi.js'
import storage from '@/util/storage'
import api from './receiveapi'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'
import { checkNonNegativeInteger, CHINESE_MEDICINE_TYPE, debounce } from '@/util/common'
import { receiveSchema } from '@/warehouse/page/storages/business/store/batch.columns.js'

export default {
  data () {
    let obj = this.$ever.createObjFromSchema(receiveSchema)
    return {
      tableData: [],
      sectionOptions: [],
      storageroomArr: [],
      pathName: '',
      oldVal: '',
      valKey: '',
      btn: '',
      receiveSchema,
      obj,
      tableDefaultCellValue,
      unRepeatedBtn: false,
      queryParams: { offset: 0, pagesize: 9999, storageRoomId: '', state: 0, isNeedStock: true },
      rules: {
        storageRoomId: { required: true, message: '必填项', trigger: 'change' },
        sectionId: { required: true, message: '必填项', trigger: 'change' }
      }
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
  watch: {
    '$route' (val) {
      this._initPath(val.path)
    },
    'obj.storageRoomId' (val, oldval) {
      this.oldVal = oldval
      this.getOpen(val, oldval, 'storageRoomId', '发货库房')
    },
    // 'obj.sectionId' (val, oldval) {
    //   this.oldVal = oldval
    //   this.getOpen(val, oldval, 'sectionId', '领用科室')
    // },
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
  created () {
    this._initPath(this.$route.path)
    this.getSections()
    this._getStorageRoom()
    const { params } = this.$route
    if (params && params.id) {
      api.getById({ ids: [params.id], isCopy: 1 }).then(res => {
        if (res && res.length) {
          let data = res[0]
          let needTable = []
          let noNeedTable = []
          this.obj.sectionId = data.sectionId
          this.obj.storageRoomId = data.storageRoomId
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
          if (noNeedTable.length) {
            this.$messageTips(this, 'warning', `${noNeedTable.join('')}无效，已为您删除。`, '提示', 2500, true)
          }
          this.tableData = [...needTable, {add: true}]
        }
      })
    }
  },
  methods: {
    // 切换
    getOpen (val, oldval, valKey, msg) {
      if (this.tableData.length && !this.tableData[0].localMaterialId && this.$refs.remoteselect) {
        this.$refs.remoteselect.options = []
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
    // 提交||暂存
    submitData: debounce(function (submitClick) {
      const { storageRoomId, sectionId, description = '', id = false, code = false } = this.obj
      let params = {
        pageType: 'consumptivereceive',
        materialType: '',
        storageRoomId,
        sectionId,
        description
      }
      let itemList = []
      let submit = false
      let noUsableNum = false
      this.tableData.forEach(item => {
        const { localMaterialId, num, usableNum } = item
        if (localMaterialId && num === '') submit = true
        if (localMaterialId) {
          if (usableNum === null) noUsableNum = true
          itemList.push(item)
        }
      })
      params.applyItemList = itemList
      if (id) params.id = id
      if (code) params.code = code
      if (submit) return this.everWarning('物资列表还有信息未录入')
      if (noUsableNum) return this.everWarning('物资可用库存为空，请重新录入')
      this.unRepeatedBtn = true
      api[submitClick ? 'submitApply' : 'temporaryStorage'](params).then(res => {
        if ((res instanceof Object && Object.keys(res).length)) {
          if (submitClick) {
            if (res.flag) {
              let { list } = res
              this.$router.push(`/goods/consumptivereceive/${list.length > 1 ? list[0] + `?id=${list[1]}` : list[0]}`)
            } else {
              let msgData = res.list.map(msg => `<div>${msg}</div>`)
              return this.$messageTips(this, 'warning', `${msgData.join('')}无效，请您点击删除`, '提示', 2500, true)
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
    }),
    // @blur 领用数量
    handleCheckNum (row) {
      if (row.num === '') return this.titleTips(row, '请填写领用数量，请重新录入')
      if (Number(row.num) <= 0 && row.num) {
        return this.titleTips(row, '领用数量不允许为0或负数，请重新录入')
      }
      const dataType = row.classifyId || ''
      let reg = /^([1-9]\d*|0)(\.\d{1,4})?$/
      let pieces = !CHINESE_MEDICINE_TYPE.includes(dataType)
      if (pieces && !checkNonNegativeInteger(row.num) && row.num) { // 除“中药饮片”和“中药颗粒”外其他类型的商品，限制出库数量录入小数
        return this.titleTips(row, '该商品只能按正整数出库')
      }
      if (!reg.test(row.num) && !pieces) {
        return this.titleTips(row, '“中药饮片”和“中药颗粒”最多允许录入4位小数')
      }
      if (row.red) row.red = false
    },
    // 操作添加物资
    handlerAdd (row) {
      if (this.btnGray) return
      if (row) {
        const { localMaterialId, num } = row
        if (!localMaterialId) return this.everWarning('请选择物资再点击添加')
        if (num <= 0 || num === '') return this.everWarning('请填写领用数量后再添加')
        this.$set(row, 'add', false)
        this.tableData.push({ add: true })
        this.$nextTick(() => {
          setTimeout(_ => {
            if (this.$refs.remoteselect && this.$refs.remoteselect.$el.querySelectorAll('input')) {
              this.$refs.remoteselect.$el.querySelectorAll('input')[0].focus()
            }
          }, 100)
        })
      }
    },
    // 操作删除物资
    handlerDelter (index) {
      if (this.btnGray) return
      if (this.tableData.length === 1) {
        this.tableData = [{ add: true }]
        this.$nextTick(_ => {
          if (this.$refs.remoteselect) {
            this.$refs.remoteselect.select = ''
            this.$refs.remoteselect.options = []
          }
        })
      } else {
        this.tableData.splice(index, 1)
        if (this.tableData[this.tableData.length - 1].localMaterialId) {
          this.tableData[this.tableData.length - 1].add = false
        }
      }
    },
    // 下拉添加物资
    handleSelect (v) {
      if (v) {
        const { localMaterialId, classifyId, spec, materialName, unitId, usableNum, packagUnitName, materialSkuId } = v
        if (v && this.tableData.some(item => item.localMaterialId === localMaterialId)) {
          this.$nextTick(_ => {
            this.$refs.remoteselect.select = ''
            this.$refs.remoteselect.options = []
          })
          return this.everWarning('当前物资已经存在列表中')
        }
        let metaerObj = {
          localMaterialId,
          classifyId,
          num: '',
          spec: spec,
          add: true,
          materialName,
          unitId,
          usableNum,
          packagUnitName,
          materialSkuId
        }
        this.$set(this.tableData, this.tableData.length - 1, metaerObj)
      } else {
        this.$set(this.tableData, this.tableData.length - 1, { add: true })
      }
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
          res.data.resultList.map(item => {
            this.sectionOptions.push({
              id: item.id,
              name: item.tenantSubjectName
            })
          })
          this.$ever.getFieldFromSchema(this.receiveSchema, 'sectionId').props.options = this.sectionOptions
        }
      })
    },
    // 获取发货库房
    _getStorageRoom () {
      let schemaProps = this.$ever.getFieldFromSchema(this.receiveSchema, 'storageRoomId').props
      storageroomApi.list({ materialType: '', name: '', isInvented: 0, offset: 0, pagesize: 99999 }).then(res => {
        if (res && res.list) {
          schemaProps.options = this.storageroomArr = JSON.parse(JSON.stringify(res.list))
        }
      })
    },
    // 领用数量统一提示方法
    titleTips (row, text) {
      row.num = ''
      this.$set(row, 'red', true)
      return this.everWarning(`${text}`)
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
<style lang="less" scoped>
.border_red /deep/ .el-input__inner {
  border-color: red;
}
.stockRed {
  height: 28px;
  line-height: 28px;
  font-weight: 700;
}
</style>
