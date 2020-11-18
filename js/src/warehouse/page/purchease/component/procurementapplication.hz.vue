<template>
  <div>
    <h4>{{!objId || listData.status === 812 ? '添加物资' : '物资明细'}}</h4>
    <el-table
      :border="true"
      v-ever-bind-enter="{resetHead: 2}"
      empty-text="请先填写基础信息"
      :data="tableData">
      <el-table-column prop label width="60" align="center">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column prop="name" label="物资名称">
        <template slot-scope="scope" align="center">
          <material-select
            ref="remoteselect"
            :params="queryParams"
            :apiName="'getLocalSettingListTelanUOrg'"
            :needObjFlag="true"
            @change="handleSelect"
            v-if="scope.$index === tableData.length - 1 && (!objId || ['812', '814'].includes(`${listData.status}`)) && !scope.row.add"
          ></material-select>
          <span v-else>
            <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop label="规格" align="center" width="80px">
        <template slot-scope="scope">
          <span>{{scope.row.spec || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop label="供应商" align="center" width="260px" v-if="!~routePath.indexOf('focusprocurementdetail')">
        <template slot-scope="scope">
          <ever-form2
            v-if="listData.status"
            :schema="supplierSchema"
            v-model="scope.row"
            :nosubmit="true"
            class="supplierForm"
            :rules="rules" :key="scope.$index">
            <template slot="supplierLocalId" v-if="listData.status == 1">
              <ever-select
                v-model="scope.row.supplierLocalId"
                :options="supplierOptions"
                :index='scope.$index'
                @input="handlerSupplier(scope.row)">
              </ever-select>
            </template>
            <template v-else slot="supplierLocalInfo">
              {{scope.row.supplierName}}
            </template>
          </ever-form2>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop label="合同" align="center" width="260px" v-if="!~routePath.indexOf('focusprocurementdetail')">
        <template slot-scope="scope">
          <span v-if="listData.status == 1">
            <ever-select
              v-if="listData.status == 1"
              v-model="scope.row.contractId"
              :options="scope.row.contractList"
              :clearable="true"
              :index='scope.$index'
              @clear="handlerContrct(scope.row, scope.$index, true)"
              @visibleChange="handlerClickSuppliers"
              @change="handlerContrct(scope.row, scope.$index)">
            </ever-select>
            <span v-else>-</span>
          </span>
          <span v-else>
            <span v-if="scope.row.contractName">
              {{scope.row.contractName}}
            </span>
            <span v-else>-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="汇总数量" align="center" v-if="['1', '2'].includes(`${listData.status}`)">
        <template slot-scope="scope">
          {{scope.row.summaryNum}}{{scope.row.packagUnitName}}
        </template>
      </el-table-column>
      <el-table-column prop label="采购数量" align="center" width="150px">
        <template slot-scope="scope">
          <div style="position: relative;line-height: 28px;" v-if="scope.row.localMaterialId">
            <el-input
              v-if="!objId || ['1', '812'].includes(`${listData.status}`) || (listData.status === 814 && !listData.addNewCode)"
              class="priceInput fl"
              style="width: 100px;"
              placeholder="采购数量"
              v-model="scope.row.num"
              type="number"
              size="small"
              @change="handleTotalAmount(scope.row)"
            ></el-input>
            <span v-else>
              {{scope.row.num}}{{scope.row.packagUnitName}}
            </span>
            <span style="display: block;width:22px;height:19px;" class="fl ml5" v-if="!objId || ['812', '814', '1'].includes(`${listData.status}`)">
              {{scope.row.packagUnitName}}
            </span>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop label="采购单价" align="center" width="150px" v-if="!~routePath.indexOf('focusprocurementdetail')">
        <template slot-scope="scope">
          <div  style="position: relative;" v-if="scope.row.localMaterialId">
            <el-input-number
              class="priceInput"
              v-if="!objId || ['1', '812', '814'].includes(`${listData.status}`)"
              placeholder="采购单价"
              v-model="scope.row.price"
              :controls="false"
              :disabled="scope.row.supplyMode === 2"
              size="small"
              @change="handlePrice(scope.row, scope.$index)"
              :precision="4">
            </el-input-number>
            <span v-else>
              {{scope.row.price | formatToFinacial(4)}}
            </span>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop label="采购金额" align="center" width="150px" v-if="!~routePath.indexOf('focusprocurementdetail')">
        <template slot-scope="scope">
          <span v-if="scope.row.totalPrice">{{scope.row.totalPrice | formatToFinacial(4)}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" v-if="!objId || listData.status === 812 || (listData.status === 814 && !listData.addNewCode)">
        <template slot-scope="scope">
          <i
            class="iconfont icon-bingli-shanchu"
            @click="handlerDelter(scope.$index)"
            :class="{'mr15': scope.$index === tableData.length - 1, 'blue': !btnGray, 'cGray': btnGray}"
            v-if="tableData.length > 1">
          </i>
          <el-button
            type="text"
            @click="handlerAdd(scope.row, scope.$index)"
            v-if="scope.$index === tableData.length - 1"
            >
            <i
            class="iconfont icon-tianjiabingli"
            :class="{ 'blue': !btnGray, 'cGray': btnGray }">
            </i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 采购总金额 -->
    <div style="width: 100%;height: 30px;" v-if="['1', '2'].includes(`${listData.status}`)">
      <span class="fr"><span class="f14 con">采购总金额：</span><span class="fon">{{totalSum}}元</span></span>
    </div>
  </div>
</template>

<script>
import remoteSelect from '@/warehouse/page/joinstorage/remoteselect.vue'
import api from '@/warehouse/page/storages/store/procurementapi.js'
import localApi from '@/warehouse/store/getmaterialinfoapi.js' // 查询物资接口
import supplierpriceapi from '@/warehouse/store/supplierpriceapi.js' // 获取机构下所有的供应商
import contrctApi from '../contract/api/contrct.js' // 合同接口
import {
  SPEC_CODE,
  MATERILA_CODE,
  floatTool,
  CHINESE_MEDICINE_TYPE,
  checkAmountIntensiveReading,
  APPROVAL_CODE,
  PACKAGE_CODE} from '@/util/common'
let supplierSchema = [
  {
    name: 'supplierLocalId',
    label: '',
    style: 'margin-left: 0',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'supplierLocalInfo',
    label: '',
    style: 'margin-left: 0',
    span: 24,
    comp: 'custom'
  }
]
const parse = /^(\+)?\d*$/ // 是否有小数
export default {
  props: {
    listData: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      objId: this.$route.params.id,
      rules: {
        supplierLocalId: { required: true, message: '必填项', trigger: 'change' }
      },
      totalSum: '',
      tableData: [],
      supplierSchema,
      localApi,
      SPEC_CODE,
      PACKAGE_CODE,
      aa: '',
      bb: '',
      MATERILA_CODE,
      APPROVAL_CODE,
      CHINESE_MEDICINE_TYPE,
      supplierpriceapi,
      contrctApi,
      supplierOptions: [], // 供应商
      status: this.$route.query.status, // 为1则代表暂存页面
      routePath: this.$route.path,
      queryParams: { offset: 0, splitFlag: 0, pagesize: 20, state: 0, orderByClassify: true, supplyMode: 1 },
    }
  },
  watch: {
    '$route' (val) {
      if (val) {
        this.objId = this.$route.params.id
        this.gerSupplier()
      }
    },
    listData: {
      handler (v) {
        if (v.itemDtos) v.items = v.itemDtos
        let status = ['812', '814'].includes(`${v.status}`)
        if (!this.objId || status || this.status) {
          this.queryParams.storageRoomId = v.storageRoomId
        }
        if (Array.isArray(v.items) && v.items.length) {
          v.items.forEach(key => {
            if (key.num && key.price) {
              key.totalPrice = floatTool.multiply(key.price, key.num)
            }
          })
        }
        this.tableData = v.items || []
      },
      deep: true,
      immediate: true
    },
    tableData: { // 列表选择的数据
      handler (v) {
        if (v) {
          if (v && this.objId) {
            this.countTotal(v)
          }
          this.$emit('change', v, this.totalSum)
        }
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    remoteSelect
  },
  computed: {
    btnGray () {
      if (this.tableData && this.tableData.length && this.tableData.length === 1) {
        const data = this.tableData[0]
        let { localMaterialId, num } = data
        if (localMaterialId && num) {
          return false
        } else {
          return true
        }
      }
    }
  },
  created () {
    this.gerSupplier()
  },
  methods: {
    info (flag) {
      if (flag) {
        this.$refs.remoteselect.options = []
      } else {
        this.tableData = []
        setTimeout(_ => { this.tableData = [{ iName: '' }] }, 100)
      }
    },
    countTotal (v) { // 计算总金额
      let count = ''
      let newObj = JSON.parse(JSON.stringify(v))
      count += this.calcTotalPrice(newObj, 'totalPrice')
      this.totalSum = count
    },
    calcTotalPrice (data, price) { // 计算总金额
      let totalPrice = 0
      let ids = []
      for (let i = 0; i < data.length; i++) {
        if ((!ids.includes(data[i].localMaterialId)) && data[i][price]) {
          totalPrice = floatTool.add(data[i][price] || 0, totalPrice).toFixed(4)
          ids.push(data[i].localMaterialId)
        }
      }
      return !isNaN(totalPrice) ? this.$filters.formatToFinacial(String(totalPrice), 4) : 0.0000
    },
    handlePrice (v) { // 计算采购金额
      if (v.price <= 0 || v.price === '') {
        v.price = ''
        return this.everWarning('采购单价为0或未输入，请重新录入')
      }
      v.totalPrice = floatTool.multiply(v.price, v.num)
    },
    handlerContrct (row, index, flag) { // 合同联动采购单价
      // 如果选择合同为代销则单价不允许修改
      if (row.contractList && row.contractList.length) {
        let contrct = row.contractList.find(contrct => { return row.contractId === contrct.id })
        if (flag) contrct = row.defaultContrct
        if (contrct) {
          row.supplyMode = contrct.purchaseSaleType === 1 ? 1 : 2
          row.price = contrct.unitPrice ? contrct.unitPrice : undefined
          row.totalPrice = floatTool.multiply(row.price, row.num)
        } else {
          row.supplyMode = 1
        }
      }
      this.$nextTick(() => {
        this.$set(this.tableData, index, row)
      })
    },
    handlerClickSuppliers (v, index, select) { // 供应商联动合同
      if (!this.tableData[index].defaultClick) {
        this.tableData[index].contractList = []
        this.getContrctList(this.tableData[index], this.tableData[index].supplierLocalId)
        this.tableData[index].defaultClick = true
      }
    },
    handlerSupplier (row, defaultClick) { // 供应商联动合同
      if (row && row.supplierLocalId) {
        this.getContrctList(row, row.supplierLocalId)
        setTimeout(() => {
          this.$set(row, 'contractId', '')
          this.$set(row, 'price', row.defaultContrct ? row.defaultContrct.unitPrice || undefined : undefined)
          row.totalPrice = floatTool.multiply(row.price, row.num)
        }, 300)
        row.defaultClick = true
      }
    },
    gerSupplier () { // 获取供应商
      supplierpriceapi.queryLocal({ filterOverdueRecord: true }).then(res => { // 获取供应商
        if (res && res.length) {
          res = res.map(supplier => {
            return {
              id: supplier.id,
              name: supplier.supplierObject ? supplier.supplierObject.name : ''
            }
          })
          this.supplierOptions = res
        }
      })
    },
    async getContrctList (row, id) { // 获取合同
      if (id) {
        let contrctParmas = {
          offset: 0,
          pagesize: 9999,
          status: 1,
          materialId: row.localMaterialId,
          supplierLocalId: id,
          isDefault: 1
        }
        await api.queryContractListBySupplier(contrctParmas).then(res => { // 没有选择合同的时候传默认合同
          let contractList = []
          if (res && res.length) {
            row.defaultContrct = ''
            contractList = res.filter(item => { // 只取合同状态为有效的
              // 2020-2-21 日 安佰强金口一张就要注释拼接
              // item.name = item.purchaseSaleType === 1 ? '（购销）' + item.name : '（代销）' + item.name
              if (item.status === 5) row.defaultContrct = item
              if (row.contractId === item.id || (!row.contractId && row.defaultContrct.id === item.id)) row.supplyMode = item.purchaseSaleType
              return item.status === 1
            })
          } else {
            contractList = []
          }
          this.$set(row, 'contractList', contractList)
        })
      }
    },
    async handleSelect (v) { // 点击物资
      if (v && this.tableData.some(item => item.localMaterialId === v.localMaterialId)) {
        this.$nextTick(_ => {
          this.$refs.remoteselect.select = ''
        })
        return this.everWarning('当前物资已经存在列表中')
      }
      if (v) {
        let metaerObj = Object.assign({
          materialType: v.classifyId, // 物资类型
          num: '', // 采购数量
          totalPrice: '', // 采购总金额
          add: false,
          supplierLocalId: '',
          contractList: [],
          contractId: '',
          unitId: v.unitId
        }, v)
        // 点击物资带出最后一次操作的供应商、合同、价格
        let resInfo = ''
        await api.getLastPurchaseOrderInfo({ localMaterialId: v.localMaterialId }).then(res => {
          resInfo = res
        })
        if (resInfo && resInfo.supplierLocalId) {
          metaerObj.supplierLocalId = resInfo.supplierLocalId
          metaerObj.price = resInfo.price
          // 获取该供应商对应的合同的列表
          this.getContrctList(metaerObj, resInfo.supplierLocalId)
          setTimeout(() => {
            if (metaerObj.defaultContrct.id === resInfo.contractId) {
              metaerObj.contractId = ''
            } else {
              metaerObj.contractId = resInfo.contractId
            }
          }, 500)
        }
        this.$set(this.tableData, this.tableData.length - 1, metaerObj)
      } else {
        this.$set(this.tableData, this.tableData.length - 1, { iName: '' })
      }
    },
    handleTotalAmount (data) { // 采购数量
      if (data.num <= 0 || data.num === '') {
        data.num = ''
        return this.everWarning('采购数量不允许为0或负数，请重新录入')
      }
      let dataType = data.classifyId || ''
      if (data.materialType) dataType = data.materialType
      if (CHINESE_MEDICINE_TYPE.includes(dataType)) { // 中药类型
        const num = checkAmountIntensiveReading({ price: data.num.toString(), num: 4 })
        if (!num) {
          data.num = ''
          return this.everWarning('中药类型采购数量最多四位小数，请重新录入')
        }
      } else {
        if (!parse.test(data.num)) {
          data.num = ''
          return this.everWarning('该物资只允许录入整数，请重新录入')
        }
      }
      data.totalPrice = floatTool.multiply(data.price, data.num)
    },
    handlerAdd (v, index) { // 添加物资
      if (v) {
        const rows = Object.assign({}, v)
        if (!rows.localMaterialId) return this.everWarning('请选择物资再点击添加')
        if (rows['num'] <= 0 || rows['num'] === '') {
          return this.everWarning('请填写采购数量后再添加')
        }
        const newRows = this.tableData.find((item, index) => { if (index !== this.tableData.length - 1) return item.localMaterialId === rows.localMaterialId })
        if (newRows) {
          return this.everWarning('该物资已添加，请修改物资后再点击添加')
        } else {
          if (rows.localMaterialId) {
            this.tableData.push(rows)
            this.tableData[index].add = true // 代表已经添加的物资
            this.$set(this.tableData, this.tableData.length - 1, { iName: '' })
            // 点击添加最后一行输入框自动聚焦
            this.$nextTick(_ => {
              setTimeout(_ => {
                if (this.$refs.remoteselect && this.$refs.remoteselect.$el.querySelectorAll('input')) {
                  this.$refs.remoteselect.$el.querySelectorAll('input')[0].focus()
                }
              }, 100)
            })
          }
        }
      }
    },
    handlerDelter (index) { // 删除物资
      this.tableData.splice(index, 1)
      if (this.tableData[this.tableData.length - 1].localMaterialId) this.tableData[this.tableData.length - 1].add = true
    },
  },
}

</script>
<style lang="less" scoped>
.stripTips {
   height: 14px;
   line-height: 14px;
   color: #333333;
   font-size: 14px;
   .strip {
     width: 3px;
     height: 14px;
     background: #1C7BEF;
   }
 }
 .fon {
    color: #222222;
    font-size: 20px;
    font-family: PingFangSC-Medium;
  }
  .con {
    color: #919191;
  }
 .supplierForm /deep/ .el-row .el-form-item {
    margin-bottom: 0px!important;
    /deep/ .el-form-item__content {
      margin-left: 0!important;
    }
 }
</style>
