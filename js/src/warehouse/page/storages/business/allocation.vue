<template>
  <div>
    <ever-bread-crumb name="调拨" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <div v-if="dismarntleFlag">
          <h4 v-if="!objId">第一步：基本信息</h4>
          <h4 v-else>基本信息</h4>
          <ever-form2
            v-model="obj"
            ref="form"
            :nosubmit="true"
            :rules="rules"
            :span="12"
            :schema="schema">
          </ever-form2>
          <h4 v-if="!objId">第二步：添加商品</h4>
          <h4 v-else></h4>
          <!-- 商品表单 -->
          <div class="listinfo">
            <div class="table">
              <!-- 查看显示区域 -->
              <el-table
                empty-text="请先选择收货库房"
                :class="[obj.items && obj.items.length ? '' : 'table2']"
                :data="obj.purchaseRequisitionItem">
                <el-table-column show-overflow-tooltip prop label width="10"></el-table-column>
                <el-table-column show-overflow-tooltip prop label width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <!-- 显示表格区域 -->
                <el-table-column
                  prop="name"
                  label="商品名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop
                  width="150"
                  align="center"
                  label="单位">
                  <template slot-scope="scope">
                    <span>{{scope.row.unitName || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="usableNum"
                  width="150"
                  align="center"
                  label="可用库存">
                </el-table-column>
                <el-table-column
                  prop=""
                  width="150"
                  align="center"
                  label="调拨数量">
                  <template slot-scope="scope">
                    <el-input
                      :class="{border_red: scope.row.red}"
                      placeholder="调拨数量"
                      style="width: 100px"
                      v-model="scope.row.num"
                      type="number"
                      @focus="handleStorageNum(scope.row.num)"
                      @blur="handleCheckNum(scope.row, true)"
                      size="small"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="80"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="danger"
                        @click.native.prevent="handleDeleteRow(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 查询添加区域 -->
              <el-table
                v-ever-bind-enter="{ cycle: true }"
                style="width: 100%"
                :class="[obj.purchaseRequisitionItem.length ? 'additem2' : 'additem']"
                v-if="obj.items.length"
                :data="obj.items">
                <el-table-column show-overflow-tooltip prop label width="10"></el-table-column>
                <el-table-column show-overflow-tooltip prop label width="50"></el-table-column>
                <el-table-column
                  prop="name"
                  label="商品名称">
                  <template slot-scope="scope">
                    <material-select
                      ref="remoteselect"
                      :params="queryParams"
                      :needObjFlag="true"
                      @change="handleSelect">
                    </material-select>
                  </template>
                </el-table-column>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="150"
                  align="center"
                  label="单位">
                  <template slot-scope="scope">
                    <span>{{scope.row.unitName || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="150"
                  align="center"
                  label="可用库存">
                  <template slot-scope="scope">
                    <span v-if="scope.row.usableNum">{{scope.row.usableNum}}</span>
                    <span v-else>{{'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="150"
                  align="center"
                  label="调拨数量">
                  <template slot-scope="scope">
                    <el-input
                      type="Number"
                      @blur="handleCheckNum(scope.row, false)"
                      style="width: 100px"
                      placeholder="调拨数量"
                      v-model="scope.row.num">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop=""
                  width="80"
                  align="center"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      type="primary"
                      @click.native.prevent="handleAddRow(scope.row)">添加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 提交成功展示的页面 -->
        <div v-if="!dismarntleFlag">
          <p class="success">调拨单提交成功！</p>
          <span class="success_text">调拨单对应出库单已生成，请发货仓库进行调拨出库操作。</span>
          <div>
            <div class="table">
              <div class="clearfloat">
                <h4 class="fl">调拨的商品详情</h4>
                <div class="number fl">
                  <span>单号：</span>
                  <a class="blue cur"
                    @click="$router.push('/storages/business/allocationess/' + dismantleSuccess)"
                  >{{dismarntleCode}}</a>
                </div>
              </div>
              <el-table
                :data="dismarntleSuccessList"
                style="width: 100%">
                <el-table-column show-overflow-tooltip prop label width="50">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="商品名称">
                  <template slot-scope="scope">
                    <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
                  </template>
                </el-table-column>
                <el-table-column prop label="规格" align="center" width="80px">
                  <template slot-scope="scope">
                    <span>{{scope.row.spec || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop
                  show-overflow-tooltip
                  width="100"
                  label="单位"
                  align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.unitName || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="num"
                  align="center"
                  width="100"
                  label="调拨数量">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 底部提交区域 -->
        <div v-if="dismarntleFlag" class="panel-footer">
          <el-button
            type="primary"
            size="small"
            :loading="unRepeatedBtn"
            :disabled="this.obj.purchaseRequisitionItem.length ? false : true"
            @click="submitData('list')">提交调拨单</el-button>
        </div>
      </div>
    </div>
    <!-- 可用库存小于调拨数量提示弹窗 -->
    <el-dialog
      title="提示"
      class="edit_dialog"
      :visible.sync="visible"
      width="20%">
      <div class="alg_c" style="height: 100px; lineHeight: 100px;">当前实际库存已经更新，请重新核对调拨数量</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlerCread" size="small">取 消</el-button>
        <el-button type="primary" @click="handlerUpdate" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import inventoryqueryApi from '@/warehouse/store/getmaterialinfoapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import storageroomApi from '@/warehouse/store/storageroomapi'
import allocationapi from '@/warehouse/page/storages/store/allocationapi.js'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'
import { PACKAGE_CODE, debounce, TRADITIONAL_CHINESE_MEDICINE, CHINESE_PATENT_MEDICINE, STORAGE_ROOM_TYPE } from '@/util/common'

let schema = [
  {
    name: 'storageRoomId',
    label: '收货库房',
    comp: 'ever-remoteMethod',
    props: {
      api: storageroomApi,
      initoptions: [],
      filter: '1002',
      filterName: 'type',
      params: {},
      isSilentQuery: true
    },
    span: 8
  },
  {
    name: 'reasons',
    label: '调拨原因',
    span: 8,
    props: {
      maxlength: 200
    }
  }
]
const NONNEGATIVE_INTEGER = /^[0-9]{1,10}$/ // 正整数正则
export default {
  mixins: [getstorage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.purchaseRequisitionItem = []
    obj.items = []
    return {
      TRADITIONAL_CHINESE_MEDICINE, // 中药饮片
      CHINESE_PATENT_MEDICINE, // 中药颗粒
      STORAGE_ROOM_TYPE,
      objId: this.$route.params.id,
      schema,
      obj,
      visible: false,
      dismarntleFlag: true, // 未提交之前展示的页面
      inventoryqueryApi,
      PACKAGE_CODE,
      allocationapi,
      queryParams: { materialType: '', offset: 0, pagesize: 9999, state: 0, isNeedStock: true },
      dismarntleSuccessList: [], // 提交成功之后的表单数据
      dismantleSuccess: '', // 单据id
      dismarntleCode: '', // 单据code
      tableCode: {},
      dismantleFail: '',
      REMOTE_METHODS_PLACEHOLDER,
      storageNum: '', // 记录原始调拨数量
      stockItemList: [], // 缺货之后的list
      unRepeatedBtn: false, // loading
      storageArr: [],
      rules: {
        storageRoomId: { required: true, message: '必填项', trigger: 'blur' }
      }
    }
  },
  created () {
    this.initInfo()
    this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').props.params = Object.assign({ isInvented: this.isInvented, storageRoomId: this.storageId }, this.queryParams)
  },
  methods: {
    initInfo () { // 重置所有参数
      let params = JSON.parse(JSON.stringify(this.queryParams))
      params.isInvented = this.isInvented
      params.storageRoomId = ''
      storageroomApi.list(params).then(res => {
        if (res) this.storageArr = res.list
      })
      this.queryParams.storageRoomId = this.storageId
      this.queryParams.materialType = ''
      this.tableCode = Object.assign({}, this.tableCode, {
        localMaterialId: '',
        classifyId: '',
        spec: '',
        unitName: '',
        materialName: '',
        usableNum: '',
        unitId: '',
        materialType: '',
        num: ''
      })
    },
    handlerCread () { // 重置所有的缺货数据
      this.visible = false
      this.stockItemList = []
    },
    handlerUpdate () { // 更新页面可用库存
      this.visible = false
      this.obj.purchaseRequisitionItem.forEach(item => {
        this.stockItemList.forEach(stock => {
          if (item.localMaterialId === stock.localMaterialId) {
            this.$set(item, 'usableNum', stock.usableNum)
            this.$set(item, 'red', true)
          }
        })
      })
    },
    handleStorageNum (num) { // 记录原始调拨数量
      this.storageNum = num
    },
    handleCheckNum (row, flag) { // 调拨数量输入框
      if (Number(row.num) <= 0 && row.num) {
        this.titleTips(flag, row, '调拨数量不允许为0或负数')
      }
      if (Number(row.num) > Number(row.usableNum)) {
        return this.titleTips(flag, row, '调拨数量大于可用库存数量')
      }
      if (row.red && (Number(row.num) <= Number(row.usableNum))) row.red = false
      const dataType = row.classifyId || ''
      let reg = /^([1-9]\d*|0)(\.\d{1,4})?$/
      let pieces = ![TRADITIONAL_CHINESE_MEDICINE, CHINESE_PATENT_MEDICINE].includes(dataType)
      if (pieces && !NONNEGATIVE_INTEGER.test(row.num) && row.num) { // 除“中药饮片”和“中药颗粒”外其他类型的商品，限制出库数量录入小数
        this.titleTips(flag, row, '该商品只能按正整数出库')
      }
      if (!reg.test(row.num) && !pieces) {
        this.titleTips(false, row, '“中药饮片”和“中药颗粒”最多允许录入4位小数')
      }
    },
    titleTips (flag, row, text) {
      if (flag) {
        row.num = this.storageNum
      } else {
        row.num = ''
        return this.$messageTips(this, 'warning', `${text}请重新录入`)
      }
    },
    handleAddRow (data) { // 查询添加操作
      if ((data['num'] <= 0 || data['num'] === '') && data.localMaterialId) return this.$messageTips(this, 'warning', '请填写调拨数量后再添加')
      for (let i = 0; i < this.obj.purchaseRequisitionItem.length; i++) {
        if (data.localMaterialId === this.obj.purchaseRequisitionItem[i].localMaterialId) {
          this.$messageTips(this, 'warning', '该商品已经添加')
          return
        }
      }
      if (data.localMaterialId) {
        this.obj.purchaseRequisitionItem.push(data)
        this.$nextTick(() => {
          let temCode = JSON.parse(JSON.stringify(this.tableCode))
          for (let key in temCode) {
            temCode[key] = ''
          }
          this.$set(this.obj.items, 0, temCode)
          if (this.$refs.remoteselect) {
            this.$refs.remoteselect.select = ''
            this.$refs.remoteselect.options = []
          }
        })
      } else {
        this.$messageTips(this, 'warning', '请选择商品后再添加')
      }
    },
    handleSelect (data) { // 查询选择商品
      if (data) {
        for (let key in this.obj.items[0]) {
          let item = this.obj.items[0]
          if (key === 'num') {
            item[key] = ''
          } else if (key === 'unitId') {
            item[key] = data.unitId
          } else {
            item[key] = data[key] || ''
          }
        }
      } else {
        for (let key in this.obj.items[0]) {
          let item = this.obj.items[0]
          item[key] = ''
        }
      }
    },
    submitData: debounce(function (list) { // 提交调拨单
      let params = {
        toStorageRoomId: this.obj.storageRoomId, // 收货库房
        requsitionStorageRoomId: this.storageId, // 发货库房
        reasons: this.obj.reasons, // 调拨原因
        itemList: []
      }
      let itemList = []
      this.obj.purchaseRequisitionItem.forEach(item => {
        itemList.push({
          num: item.num, // 调拨数量
          unitId: item.unitId, // 可用库存
          materialType: item.materialType, // 商品类型
          localMaterialId: item.localMaterialId // 商品id
        })
      })
      params.itemList = [...itemList]
      this.unRepeatedBtn = true
      allocationapi.createAllotBound(params).then(res => {
        if (res) {
          if (res.stockItemList && res.stockItemList.length) { // 这个时候说明可用库存小于调拨数量
            res.stockItemList.forEach(item => {
              this.stockItemList.push({ // 所有可用库存小于调拨数量的list
                usableNum: item.num,
                localMaterialId: item.localMaterialId
              })
            })
            this.visible = true
          } else {
            this.dismarntleFlag = false
            this.dismantleSuccess = res.id
            this.dismarntleCode = res.code
            this.dismarntleSuccessList = [...this.obj.purchaseRequisitionItem]
          }
          this.unRepeatedBtn = false
        }
      })
    }),
    handleDeleteRow (index) { // 删除当前数据
      this.obj.purchaseRequisitionItem.splice(index, 1)
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    async _setList (flag) { // 获取表单数据
      if (flag) {
        if (!this.obj.purchaseRequisitionItem.length) {
          for (let key in this.tableCode) {
            this.tableCode[key] = ''
          }
          this.obj.items[0] ? this.obj.items[0] = this.tableCode : this.obj.items.push(this.tableCode)
        }
      } else {
        this.obj.items = []
        this.obj.purchaseRequisitionItem = []
      }
    },
  },
  watch: {
    'obj.storageRoomId' (val) {
      if (!val) this.obj.purchaseRequisitionItem = []
      if (val) {
        let toStorageRoom // 收货库房
        let storageRoom // 本库房
        this.storageArr.forEach(item => {
          if (item.id === this.storageId) {
            storageRoom = JSON.parse(item.materialType)
          }
          if (item.id === val) {
            toStorageRoom = JSON.parse(item.materialType)
          }
        })
        let materArr = []
        toStorageRoom.map(mater => {
          const index = storageRoom.findIndex(keys => { return mater === keys })
          if (~index) {
            materArr.push(storageRoom[index])
          }
        })
        this.queryParams.classifyIds = materArr
      }
      if (val && !this.obj.purchaseRequisitionItem.length) {
        this._setList(true)
      } else {
        if (!this.obj.purchaseRequisitionItem.length) {
          this._setList(false)
        } else {
          this._setList(true)
        }
      }
    },
    deep: true
  },
}

</script>
<style scoped lang="less">
.edit_dialog /deep/ .el-dialog__footer {
  text-align: center;
}
.border_red /deep/ .el-input__inner {
  border-color: red;
}
.success {
  color: #16c277;
}
.success_text {
  font-size: 14px;
  color: #666666;
}
.number {
  margin: 0 0 0 20px;
  line-height: 36px;
}
.clearfloat:after {
  content: "";
  text-overflow: ellipsis;
  clear: both;
}
.clearfloat {
  zoom: 1;
}
</style>
