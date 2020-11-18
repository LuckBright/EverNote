<template>
  <div>
    <ever-bread-crumb name="盘点" :path="'/storages/check/checklist'" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body basic-info">
        <h4>盘点单信息</h4>
        <el-form class="readform mt10" label-width="80px">
          <el-row :class="[status === STOCKSTATUS[2].id ? 'bor_bom_1' : 'mb10']">
            <el-col :span="5">
              <el-form-item label="盘点单号:">
                <span>{{info.code}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="盘点库房:">
                <span>{{info.storageRoomName || ''}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="盘点范围:">
                <span v-if="info.inventoryRange">{{setName(INVENTORY_RANGE, info.inventoryRange)}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="盘点人:">
                <span>{{info.checkUser ? info.checkUser : ''}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="盘点时间:">
                <span>{{info.createTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5" v-if="status === STOCKSTATUS[2].id">
              <el-form-item label="确认人:">
                <span>{{info.auditUserName ? info.auditUserName : ''}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5" v-if="status === STOCKSTATUS[2].id">
              <el-form-item label="确认时间:">
                <span>{{info.auditTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="说明:">
                <span>{{info.description}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form class="readform mt5" label-width="120px" v-if="status === STOCKSTATUS[2].id">
          <el-col :span="24" class="mb10">
              <el-col :span="5">
                <el-form-item label="账面成本金额:">
                  <span>{{info.costPaper}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="实盘成本金额:">
                  <span>{{info.costReal}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="盘盈成本金额:">
                  <span>{{info.costWin}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="盘亏成本金额:">
                  <span>{{info.costLose}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="实盘销售价金额:">
                  <span>{{info.saleReal}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="盘盈销售价金额:">
                  <span>{{info.saleWin}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="盘亏销售价金额:">
                  <span>{{info.saleLose}}</span>
                </el-form-item>
              </el-col>
            </el-col>
        </el-form>
        <!-- <el-colclass="mt15" style="padding-bottom: 15px">

        </el-colclass=> -->
        <div class="main-option pos_re" :class="{mb10: status === STOCKSTATUS[2].id}">
          <h4 class="panel-hr">盘点单明细</h4>
          <doc-download
            v-if="status === STOCKSTATUS[2].id"
            :id="infoId"
            size="mini"
            class="pos_ab"
            style="left: 120px; bottom: 0px"
            @downFile="downFile"
            @exportStatus="changeStatus"
            ref="childMethodt"
            btnTxt="导出盘点报告"
          ></doc-download>
          <el-checkbox
            v-if="status > STOCKSTATUS[0].id"
            v-model="offDiffAll"
            @change="hanndleChangeCheckbox($event, 'offDiffAll')">
            <span class="blue">只看有差异的物资</span>
          </el-checkbox>
          <el-row v-if="status === STOCKSTATUS[0].id">
            <el-col class="mt10">
              <el-col :span="16">
                <ever-form2 :schema="searchSchema" v-model="searchObject" :inline="true" style="text-align:left">
                  <!-- 物资搜索 -->
                  <template slot="localMaterialId">
                    <material-select
                      :params="queryParams"
                      :apiName="'getInventoryTakingLocalSettingList'"
                      ref="materialSelete"
                      style="width: 400px"
                      size="small"
                      :multiple="true"
                      :collapse-tags="true"
                      @change="handleSelect($event, 'localMaterialId')">
                    </material-select>
                  </template>
                  <!-- 货位号搜索 -->
                  <template slot="FreightId">
                    <remote-select
                      ref="remoteselect"
                      :placeholder="'请输入货位号'"
                      :queryParams="queryParams"
                      size="small"
                      :apiName="'getInventoryTakingtFreightList'"
                      :api="api"
                      @selectSave="handleSelect($event, 'FreightId')"
                    ></remote-select>
                  </template>
                  <!-- 优先查看实物数量未填写的 -->
                  <template slot="offNum">
                    <el-checkbox v-model="searchObject.offNum" @change="hanndleChangeCheckbox($event, 'offNum')">优先查看实物数量未填写的</el-checkbox>
                  </template>
                  <!-- 优先查看有差异的物资 -->
                  <template slot="offDiff">
                    <el-checkbox v-model="searchObject.offDiff" @change="hanndleChangeCheckbox($event, 'offDiff')">优先查看有差异的物资</el-checkbox>
                  </template>
                  <template slot="default">
                    <span></span>
                  </template>
                </ever-form2>
              </el-col>
              <el-col :span="8" style="text-align:right">
                <doc-download
                  :id="infoId"
                  @downFile="downFile"
                  @exportStatus="changeStatus"
                  ref="childMethods"
                  btnTxt="导出盘点单"
                ></doc-download>
                <upload-file2
                  @success="uploadSuccess"
                  ref="uploadfile"
                  btnTxt="导入盘点单"
                  previewInline="true"
                  uploadApiType="ucloud"
                  :coverPrev="true"
                  :maxNum="2"
                ></upload-file2>
              </el-col>
            </el-col>
          </el-row>
        </div>
        <pl-table
        v-if="tableData.length"
        :data="tableData"
        :key="status"
        :border="true"
        class="w ever-table nomargin"
        :height="tableData.length > 5 ? 350 : ''"
        ref="plTable"
        use-virtual
        :row-height="50"
        :row-key="'id'"
        @table-body-scroll="tableBodyScroll"
        v-ever-bind-enter>
        <pl-table-column
          min-width="300"
          header-align="center"
          prop="name">
          <template slot-scope="{}" slot="header">
            <span style="cursor: pointer;" @click="sortChangeName">
              物资名称
              <span class="sortbox">
                <i class="top iconfont icon-up" :class="{sortactive: searchObject.orderType == 3}"></i>
                <i class="down iconfont icon-domn" :class="{sortactive: searchObject.orderType == 4}"></i>
              </span>
            </span>
          </template>
          <template slot-scope="scope">
            <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
          </template>
        </pl-table-column>
        <pl-table-column
          align="center"
          prop
          width="90"
          label="规格">
          <template slot-scope="scope">
            <span v-if="scope.row.spec">{{scope.row.spec}}</span>
            <span v-else>-</span>
          </template>
        </pl-table-column>
        <pl-table-column
          align="center"
          width="90"
          label="包装单位">
          <template slot-scope="scope">
            <span v-if="scope.row.unitName">{{scope.row.unitName}}</span>
            <span v-else>-</span>
          </template>
        </pl-table-column>
        <pl-table-column
          width="100"
          align="center">
          <template slot-scope="{}" slot="header">
            <span style="cursor: pointer;" @click="sortChangeContainer">
              货位号
              <span class="sortbox">
                <i class="top iconfont icon-up" :class="{sortactive: searchObject.orderType == 1}"></i>
                <i class="down iconfont icon-domn" :class="{sortactive: searchObject.orderType == 2}"></i>
              </span>
            </span>
          </template>
          <template slot-scope="scope">
            <span v-html="scope.row.containerCodes ? scope.row.containerCodes.join('<br>') : '-'"></span>
          </template>
        </pl-table-column>
        <pl-table-column
          align="center"
          label="生产批号"
          width="120"
          prop="batchNum">
        </pl-table-column>
        <pl-table-column
          v-if="pricingModel"
          align="center"
          label="系统批号"
          width="150"
          prop="sysBatchCode">
        </pl-table-column>
        <pl-table-column
          align="center"
          label="有效期"
          width="95"
          prop="validityDate">
          <template slot-scope="scope">
            <span v-if="scope.row.validityDate">{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
            <span v-else>-</span>
          </template>
        </pl-table-column>
        <pl-table-column
          v-if="pricingModel"
          align="right"
          label="采购单价"
          width="100"
          prop="price">
        </pl-table-column>
        <pl-table-column
          v-if="pricingModel"
          align="right"
          label="销售价"
          width="100"
          prop="salePrice">
        </pl-table-column>
        <pl-table-column
          v-if="pricingModel && status === STOCKSTATUS[0].id"
          align="right"
          label="批次可用数量"
          width="120"
          prop="usableNum">
        </pl-table-column>
        <pl-table-column
          width="100"
          align="right"
          prop="stockNum"
          label="账面数量"
          :formatter="formatter.numUintFormatter"
        ></pl-table-column>
        <pl-table-column
          width="120"
          prop="num"
          align="right">
          <template slot="header" slot-scope="{}">
            <el-tooltip class="item" effect="dark" :content="iconColor ? '点击填充默认值' : '点击清空实物数量'" placement="top-start">
            <span>实物数量 <i v-if="status < STOCKSTATUS[1].id" @click="handleDefaultNum" class="iconfont icon-gaiyue1" :class="{iconcolor: !iconColor}"></i></span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-input
            v-if="status === STOCKSTATUS[0].id"
              type="number"
              @focus="numFocus($event, scope.row.num)"
              v-model="scope.row.num"
              class="numtextr"
              :class="{error: (showError && (scope.row.num == '' || scope.row.num == null || scope.row.num == undefined)) || scope.row.error}"
              size="small"
              @blur="handleBlur($event, scope.row, scope.$index, scope)"
            ></el-input>
            <span v-else>{{scope.row.num}}</span>
          </template>
        </pl-table-column>
        <pl-table-column
          width="100"
          align="center"
          prop="inventoryResults"
          label="结果">
          <template slot-scope="scope">
            <span :key="scope.row.localMaterialId + scope.$index" :class="{fontcolor1: scope.row.inventoryResults == 1, fontcolor2: scope.row.inventoryResults == 2}" v-if="scope.row.inventoryResults">{{setName(STOCKRESULT, scope.row.inventoryResults)}}</span>
          </template>
        </pl-table-column>
        <pl-table-column
          width="80"
          align="right"
          label="盘亏数量">
          <template slot-scope="scope">
            <span
              v-if="scope.row.inventoryResults == 2"
            >{{floatTool.subtract(scope.row.stockNum, scope.row.num) || ''}}</span>
          </template>
        </pl-table-column>
        <pl-table-column
          width="80"
          align="right"
          label="盘盈数量">
          <template slot-scope="scope">
            <span
              v-if="scope.row.inventoryResults == 1"
            >{{floatTool.subtract(scope.row.num, scope.row.stockNum) || ''}}</span>
          </template>
        </pl-table-column>
      <pl-table-column v-if="status === STOCKSTATUS[0].id " width="70" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.ifNewAdd"
              type="danger"
              plain
              size="small"
              @click="deleteLocalDdata(scope.row, scope.$index)"
            >删除</el-button>
          </template>
        </pl-table-column>
      </pl-table>

        <el-row type="flex" justify="end">
          <div class="op_ab mt20" style="flex: 1">
            <el-button
            v-if="status === STOCKSTATUS[0].id"
              type="primary"
            @click="updateStatus(STOCKSTATUS[1].id)"
            >提交盘点数据</el-button>
            <el-button
            v-if="status === STOCKSTATUS[1].id && $hasPermission('Auth_menu_treasury_businessmanagement_inventory_confirmbtn')"
              type="primary"
            @click="updateStatus(STOCKSTATUS[2].id)"
            >确认盘点结果</el-button>
            <el-button
            v-if="status === STOCKSTATUS[1].id"
              type="primary"
            @click="updateStatus(STOCKSTATUS[0].id)"
            >修改盘点结果</el-button>
            <el-button
            v-if="status < STOCKSTATUS[2].id"
            @click="updateStatus(STOCKSTATUS[3].id)"
            >取消盘点</el-button>
          <el-button v-if="status === STOCKSTATUS[0].id" type="text" @click="hanldAddDataShow">
              添加漏盘批号
              <i
                class="el-icon--right"
                :class="!hanldAddDataShowHide ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
              ></i>
            </el-button>
          </div>
        </el-row>
      </div>
      <!-- 添加漏盘数据 -->
      <add-localsetting-data
        @addUpdateSuccess="addUpdateSuccess"
        v-if="hanldAddDataShowHide && info.inventoryRange"
        :inventoryTakingId="infoId"
        :patentDataLength="tableData.length"
        :inventoryRange="info.inventoryRange"
        :storageRoomId="queryParams.storageRoomId"
      ></add-localsetting-data>
    </div>
    <dialog-slot title=" " :dialogSlot.sync="dialogSlot">
      <div>
        <div class="warningtext">
          <i class="iconfont icon-yuangan"></i>
          <span>盘点过程中有<b class="fontcolor2" style="padding: 0 3px">{{dialogTableData.length}}</b>条物资发生库存变动，无法提交盘点结果，<br>您可以“修改盘点结果”，或“取消盘点“后重新进行盘点。</span>
        </div>
        <el-table
          :data="dialogTableData">
          <el-table-column label="物资名称" width="400">
            <template slot-scope="scope">
              {{scope.row.materialName}}
            </template>
          </el-table-column>
          <el-table-column label="规格" prop="spec"></el-table-column>
          <el-table-column label="生产批号" prop="batchNum"></el-table-column>
          <el-table-column label="账面数量" align="right" prop="stockNum"></el-table-column>
          <el-table-column label="实时库存数量" align="right" prop="usableNum"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer alg_c">
        <el-button type="primary" @click="dialogSlot = !dialogSlot">确认</el-button>
      </div>
    </dialog-slot>
  </div>
</template>
<script>
import api from '@/warehouse/store/drugstocktakingapi'
// import 'pl-table/themes/index.css'
import { STOCKSTATUS, STOCKRESULT, SPU_SPEC_CODE, debounce, PACKAGE_CODE, floatTool, patch, SPEC_CODE, PRODUCER, INVENTORY_RANGE, CHINESE_MEDICINE_TYPE, FLOAT_REG, PARSE_REG } from '@/util/common'
import sets from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import remoteSelect from '../../joinstorage/remoteselect'
import addLocalsettingData from './addlocalsettingdata'
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import * as formatter from '@/warehouse/util/formatter'
import { REMOTE_METHODS_PLACEHOLDER, DOWNLOAD_FILE } from '@/warehouse/views/util/constant'
import { PlTable, PlTableColumn } from 'pl-table'
import storage from '@/util/storage'

export default {
  mixins: [sets, getstorage, storage],
  data () {
    return {
      infoId: this.$route.params.id,   //  盘点单号Id
      status: parseInt(this.$route.params.num),  //  盘点单状态
      info: {},     //   盘点单基础数据
      api,
      PRODUCER,
      PACKAGE_CODE,
      SPEC_CODE,
      SPU_SPEC_CODE,
      CHINESE_MEDICINE_TYPE,
      INVENTORY_RANGE, //   盘点范围
      STOCKSTATUS,     //   盘点单状态
      STOCKRESULT,     //   盘点单盘点结果
      inventoryResults: false,
      dialogSlot: false,
      showError: false,
      iconColor: false,
      tableLoading: false,
      noTableLoading: false,
      offDiffAll: false,
      searchSchema: [
        {
          name: 'localMaterialId',
          label: '物资名称',
          comp: 'custom'
        },
        {
          name: 'FreightId',
          label: '货位号',
          comp: 'custom'
        },
        {
          name: 'offNum',
          comp: 'custom'
        },
        {
          name: 'offDiff',
          comp: 'custom'
        }
      ],
      searchObject: {
        offNum: false,
        offDiff: false,
        orderType: 0,
        FreightId: '',
        localMaterialId: [],
      },
      loadingGif: 'static/assets/Loading-120.gif',
      tableData: [],
      primaryData: [],
      dialogTableData: [],
      pricingModel: Number(storage.getLocalStorage('IS_BATCHPRICE') || 0),
      queryParams: { storageRoomId: '', name: '', inventoryTakingId: this.$route.params.id },
      floatTool,
      thisNum: 0,
      exportType: 1,
      uploadPandianUrl: '',
      hanldAddDataShowHide: false,
      current: 1,
      offset: 0,
      formatter,
      countTableData: [],
      scrollSwitch: false,
      scrollTop: 0,
      scrollDirection: '',
      REMOTE_METHODS_PLACEHOLDER,
      thisIndexTableData: 0,
      pagesize: 9999,
      totalCount: 0
    }
  },
  methods: {
    ...patch,
    numFocus (event, num) {
      event.target.select()
      this.thisNum = num
    },
    handleDefaultNum () {
      let tableData = this.tableData
      let isAllNum = tableData.some(item => { return item.num !== '' && item.num !== null && item.num !== undefined })
      if (isAllNum) {
        if (this.iconColor) {
          this.$confirm('当前列存在已填写数据，是否覆盖？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否'
          }).then(({ value }) => {
            tableData.forEach(item => {
              item.num = item.stockNum
            })
            this.changeThisNum(tableData)
          })
        } else {
          this.$confirm('清空后数据不可恢复，是否继续操作？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否'
          }).then(({ value }) => {
            tableData.forEach(item => {
              item.num = ''
            })
            this.changeThisNum(tableData)
          })
        }
      } else {
        tableData.forEach(item => {
          item.num = item.stockNum
        })
        this.changeThisNum(tableData)
      }
    },
    sortChangeName () {
      if (this.searchObject.orderType === 3) {
        this.searchObject.orderType = 4
      } else {
        this.searchObject.orderType = 3
      }
      this.handleSearchSort()
    },
    sortChangeContainer () {
      if (this.searchObject.orderType === 1) {
        this.searchObject.orderType = 2
      } else {
        this.searchObject.orderType = 1
      }
      this.handleSearchSort()
    },
    materialSortTableData (order, data) {
      let _this = this
      let thisTableData = JSON.parse(JSON.stringify(data))
      if (!order) return thisTableData
      thisTableData.sort(function (a, b) {
        return _this.arrayCustomSort(a, b, order)
      })
      if (order === 1) {
        let codeSort = thisTableData.filter(item => item.containerCodes).sort(function (a, b) {
          return _this.arrayCustomSort(a, b, order)
        })
        thisTableData = codeSort.concat(thisTableData.filter(item => !item.containerCodes))
      }
      return thisTableData
    },
    arrayCustomSort (item1, item2, order) {
      let cps = []
      if (order < 3) {
        cps.push(this.handleIfSort(item1, item2, order, 'containerCodes', order))
      } else {
        cps.push(this.handleIfSort(item1, item2, order, 'name', 4))
      }
      for (var j = 0; j < cps.length; j++) {
        if (cps[j] === 1 || cps[j] === -1) {
          return cps[j]
        }
      }
      return false
    },
    handleIfSort (item1, item2, order, name, num) {
      if (!item1[name]) {
        return order === num ? -1 : 1
      } else {
        if (!item2[name]) {
          return order === num ? 1 : -1
        } else {
          if ((name === 'containerCodes' && item1[name][0] > item2[name][0]) || item1[name] > item2[name]) {
            return order === num ? 1 : -1
          } else {
            return order === num ? -1 : 1
          }
        }
      }
    },
    handleBlur (e, data, index, scope) {
      if (CHINESE_MEDICINE_TYPE.includes(data.classifyId)) {
        if (!FLOAT_REG.test(e.target.value)) {
          this.$messageTips(this, 'error', '当前行实物数量输入有误，实物数量仅支持录入非负整数，请检查后再试')
          e.target.value = ''
          data.inventoryResults && delete data.inventoryResults
          let findobj = this.primaryData.find(item => item.localMaterialId === data.localMaterialId && item.batchNum === data.batchNum)
          findobj.inventoryResults && delete findobj.inventoryResults
          findobj.num = ''
        } else {
          if (data.num && this.pricingModel) {
            if (data.stockNum - data.num > data.usableNum) {
              data.error = true
              return this.$messageTips(this, 'error', `${data.materialName},${data.sysBatchCode},盘亏数量不可大于批次可用数量。`)
            }
            data.error = false
          }
          this.changeThisNum(data, index, e)
        }
      } else {
        if (!PARSE_REG.test(e.target.value)) {
          this.$messageTips(this, 'error', '当前行实物数量输入有误，实物数量仅支持录入非负整数，请检查后再试')
          e.target.value = ''
          data.inventoryResults && delete data.inventoryResults
          let findobj = this.primaryData.find(item => item.localMaterialId === data.localMaterialId && item.batchNum === data.batchNum)
          findobj.inventoryResults && delete findobj.inventoryResults
          findobj.num = ''
        } else {
          if (data.num && this.pricingModel) {
            if (data.stockNum - data.num > data.usableNum) {
              data.error = true
              return this.$messageTips(this, 'error', `${data.materialName},${data.sysBatchCode},盘亏数量不可大于批次可用数量。`)
            }
            data.error = false
          }
          this.changeThisNum(data, index, e)
        }
      }
    },
    downFile () {
      if (this.info.reportFileId) {
        this.$refs.childMethodt.downfile(DOWNLOAD_FILE + this.info.reportFileId)
      } else {
        let params = {
          materialType: this.materialType,
          inventoryTakingId: this.infoId,
          storageRoomId: this.storageId
        }
        if (this.status === STOCKSTATUS[2].id) {
          params['status'] = STOCKSTATUS[2].id
        }
        params['orderType'] = this.searchObject.orderType
        this.api.downloadFile(params).then(result => {
          if (this.status === STOCKSTATUS[2].id) {
            this.$refs.childMethodt.downfile(DOWNLOAD_FILE + result.fileName)
          } else {
            this.$refs.childMethods.downfile(DOWNLOAD_FILE + result.fileName)
          }
        })
      }
    },
    changeStatus (a) {
      if (a) {
        this.$messageTips(this, 'success', '导出盘点单成功')
      }
    },
    deleteLocalDdata (data, index) {
      const { num, stockNum, id } = data
      let newData = Object.assign({ num, id, stockNum, isDelete: 1, inventoryTakingId: this.infoId, status: this.status })
      this.api.updateInventoryTakingItem([newData]).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '删除当前数据成功')
          // 删除当前行数据
          this.tableData.splice(index, 1)
          if (!this.tableData.length) {
            this.current = 1
            this.offset = 0
            this.getInfo()
          }
        }
      })
    },
    addUpdateSuccess (v) {
      this.getInfo('last')
    },
    hanldAddDataShow () {
      this.hanldAddDataShowHide = !this.hanldAddDataShowHide
    },
    editThisNum (data) {
      this.tableData.forEach((item, index) => {
        if (item.id === data.id) {
          this.$set(this.tableData[index], 'thisEdit', true)
        } else {
          item.thisEdit = false
        }
      })
    },
    handleSelect (v, type) {
      this.searchObject[type] = v
      this.handleSearchSort()
    },
    tableBodyScroll ({ scrollTop, scrollLeft, table }, event) {
      if (!this.scrollSwitch) {
        this.scrollTop = scrollTop
      }
    },
    changeThisNum (data, index, e) {
      let ids = []
      if (Array.isArray(data)) {
        data.forEach(item => {
          ids.push({ id: item.id, stockNum: item.stockNum, num: item.num, status: this.status, inventoryTakingId: this.$route.params.id })
        })
      } else {
        if (data.num === this.thisNum) return false
        ids.push({ id: data.id, stockNum: data.stockNum, num: data.num, status: this.status, inventoryTakingId: this.$route.params.id })
      }
      this.api.updateInventoryTakingItem(ids).then(res => {
        if (res) {
          if (index) {
            this.scrollSwitch = true
            this.$set(data, 'inventoryResults', res[0].inventoryResults)
            data.inventoryResults = res[0].inventoryResults
            let findobj = this.primaryData.find(item => item.localMaterialId === this.tableData[index].localMaterialId && item.batchNum === this.tableData[index].batchNum)
            findobj.inventoryResults = res[0].inventoryResults
            findobj.inventoryResults === null && delete findobj.inventoryResults
            findobj.num = data.num
            this.$nextTick(() => {
              this.$refs.plTable.pagingScrollTopLeft(this.scrollTop, 0)
              this.scrollSwitch = false
            })
          } else {
            this.noTableLoading = true
            this.getInfo()
          }
        }
      })
    },
    uploadSuccess (result) {
      var params = {
        'materialType': this.materialType,
        'inventoryTakingId': this.infoId
      }
      params = Object.assign(params, result)
      this.api.uploadFile(params).then(result => {
        if (result.success) {
          this.$messageTips(this, 'success', '导入盘点单成功！')
          this.getInfo()
        } else {
          this.$refs.uploadfile.clearFiles()
        }
      })
    },
    handleSearchSort () {
      let materialArr = []
      let offNumArr = []
      // 根据物资 localMaterialId 搜索
      if (this.searchObject.localMaterialId) {
        materialArr = this.primaryData.filter(item => this.searchObject.localMaterialId.flat().includes(item.localMaterialId))
      }
      // 根据货位号 搜索
      if (this.searchObject.FreightId && this.searchObject.FreightId.code) {
        materialArr = materialArr.concat(this.primaryData.filter(item => item.containerCodes && item.containerCodes[0] === this.searchObject.FreightId.code && !materialArr.some(child => child.localMaterialId === item.localMaterialId)))
      }
      // 优先查看未填写数量的
      if (this.searchObject.offNum) {
        if (materialArr.length) {
          materialArr = materialArr.filter(item => !item.num).concat(materialArr.filter(item => item.num))
        } else {
          offNumArr = this.primaryData.filter(item => !item.num)
        }
      }
      // // 优先查看有差异的
      if (this.searchObject.offDiff) {
        if (materialArr.length) {
          if (this.searchObject.offNum) {
            materialArr = materialArr.filter(item => !item.num).concat(materialArr.filter(item => item.inventoryResults < 3), materialArr.filter(item => item.num && (!item.inventoryResults || item.inventoryResults === 3)))
          } else {
            materialArr = materialArr.filter(item => item.inventoryResults < 3).concat(materialArr.filter(item => !item.inventoryResults || item.inventoryResults === 3))
          }
        } else {
          if (offNumArr.length) {
            offNumArr = offNumArr.concat(this.primaryData.filter(item => item.inventoryResults < 3))
          } else {
            offNumArr = this.primaryData.filter(item => item.inventoryResults < 3)
          }
        }
      }
      let filtersArr = this.primaryData.filter(item => {
        return !materialArr.some(mater => mater.localMaterialId === item.localMaterialId) && !offNumArr.some(mater => mater.localMaterialId === item.localMaterialId && mater.batchNum === item.batchNum)
      })
      this.tableData = materialArr.concat(offNumArr, this.materialSortTableData(this.searchObject.orderType, filtersArr))
    },
    hanndleChangeCheckbox: debounce(function (v, type) {
      if (type === 'offDiffAll') {
        this.tableData = this.primaryData.filter(item => (v && item.inventoryResults < 3) || !v)
      } else {
        this.handleSearchSort()
      }
    }),
    //  更新数据刷新页面
    afterSave (status) {
      this.offDiffAll = false
      this.$router.replace(`/storages/check/checkstocktaking/${this.infoId}/${status}`)
      this.getInfo('update')
    },
    //  更新盘点单状态
    updateStatus: debounce(function (status) {
      let params = {
        inventoryTakingId: this.infoId,
        status: status,
        storageRoomId: this.storageId
      }
      if (status === STOCKSTATUS[2].id) {
        this.$confirm('是否确认盘点结果并对盘盈/盘亏数据进行出入库单处理？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          this._apiUpdata(params)
        })
      } else if (status === STOCKSTATUS[3].id) {
        this.$confirm('盘点单取消后不能恢复，请确认是否取消盘点？', '确认是否取消盘点', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          this._apiUpdata(params)
        })
      } else if (status === STOCKSTATUS[1].id) {
        let findIndex = null
        this.showError = false
        let arr = []
        this.tableData.some((item, index) => {
          if (item.num === null || item.num === '' || item.num === undefined || (this.pricingModel && item.error)) {
            findIndex = index
            this.showError = true
            return true
          }
        })
        // 2020.05.27 周静要求提示实数数量不能为空的时候带上具体物资
        this.tableData.forEach(key => {
          if (key.num === null || key.num === '' || key.num === undefined) {
            arr.push(`<div>${key.materialName}</div>`)
          }
        })
        if (!this.showError) {
          this._apiUpdata(params)
        } else {
          this.$nextTick(() => {
            if (document.querySelectorAll('.numtextr')[findIndex]) document.querySelectorAll('.numtextr')[findIndex].children[0].focus()
            return this.tableData[findIndex].error ? this.$messageTips(this, 'error', `${this.tableData[findIndex].materialName},${this.tableData[findIndex].sysBatchCode},盘亏数量不可大于批次可用数量。`) : this.$messageTips(this, 'warning', `${arr.join('')}实物数量不能为空`, '提示', 2500, true)
          })
        }
      } else {
        // 清除搜索框条件
        this.$nextTick(() => {
          setTimeout(() => {
            if (this.$refs.materialSelete) this.$refs.materialSelete.select = ''
            if (this.$refs.remoteselect) this.$refs.remoteselect.select = ''
          }, 200)
        })
        this._apiUpdata(params)
      }
    }),
    _apiUpdata (params) {
      if (params.status === STOCKSTATUS[2].id) {
        this.api.audiInventory({ inventoryTakingId: params.inventoryTakingId, oldStatus: this.status }).then(result => {
          if (result) {
            if (result.diffStockNumList && result.diffStockNumList.length) {
              this.dialogTableData = result.diffStockNumList
              this.dialogSlot = true
            } else {
              this.afterSave(params.status)
            }
          }
        })
      } else {
        params.oldStatus = this.status
        this.api.updateStatus(params).then(result => {
          if (result) {
            this.afterSave(params.status)
          }
        })
      }
      this.hanldAddDataShowHide = false
      this.inventoryResults = false
    },
    //  获取盘点单信息
    getInfo (obj) {
      var params = {
        inventoryTakingId: this.infoId,
        offset: this.offset,
        orderType: this.searchObject.orderType,
        pagesize: this.pagesize
      }
      if (obj !== 'update') {
        params = Object.assign(params, obj)
      }
      if (!this.noTableLoading) this.tableLoading = true
      this.api.getItemById(params).then(result => {
        if (result && result.data) {
          // this.offset = 0
          this.info = Object.assign({}, result.data)
          result.data.items && result.data.items.length && result.data.items.map(item => {
            if ((item.num === 0 && !item.inventoryResults) || typeof item.num === 'undefined') item.num = ''
          })
          this.countTableData = []
          this.thisIndexTableData = 0
          this.tableData = result.data.items || []
          this.primaryData = JSON.parse(JSON.stringify(this.tableData))
          this.totalCount = result.data.totalCount
          // 建辉让改的状态，双页面同时操作情况下可以更新状态，但是路由不会变化，好像不会影响操作
          this.status = result.data.status
          this.status === STOCKSTATUS[0].id && this.handleSearchSort()
          if (result.data.diffStockNumItemList && result.data.diffStockNumItemList.length) {
            this.$alert(`盘点过程中有<b class="cRed">${result.data.diffStockNumItemList.length}</b>条物资发生库存变动，将为您刷新到最新账面数量。`, '提示', {
              confirmButtonText: '确认',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }).then(({ value }) => {
              this.changeThisNum(result.data.diffStockNumItemList)
            })
          }
        }
        this.noTableLoading = false
        this.$nextTick(_ => {
          this.tableLoading = false
          if (obj === 'last') {
            this.$refs.plTable.scrollBottom()
          }
        })
      })
    }
  },
  created () {
    this.queryParams.storageRoomId = this.storageId
    this.getInfo()
    this.uploadPandianUrl = this.$ever.api + '/warehouse/inventoryTaking/importExcelInventoryTakingWithItemNew/'
  },
  watch: {
    '$route.params': {
      handler (v) {
        this.status = parseInt(v.num)
      },
      deep: true
    },
    'tableData' (v) {
      if (v.length) {
        this.iconColor = v.some(item => {
          return item.num === '' || item.num === null || item.num === undefined
        })
      }
    }
  },
  components: {
    remoteSelect,
    dialogSlot,
    PlTable,
    PlTableColumn,
    addLocalsettingData
  }
}
</script>
<style lang="scss" scoped>
// .main-option {line-height: 36px; height: 36px;}
.main-option h4 {
  margin: 0;
  float: left;
}
.download_export {
  margin-right: 10px;
}
.upload-demo {
  display: inline-block;
}
.basic-info {
  h4 {
    padding: 0;
    padding-left: 10px;
    margin: 0;
    border-left: 3px solid #1c7bef;
    line-height: 18px;
  }
  .schema {
    margin-top: 10px;
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    /deep/ .el-col .el-form-item {
      margin-bottom: 0;
      border-left: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      // border-right: 0;
      .el-form-item__label {
        background-color: #eee;
        border-right: 1px solid #ccc;
        padding-right: 15px;
      }
      .el-form-item__content {
        padding-left: 15px;
        line-height: 32px;
      }
    }
    /deep/ .el-form-item__content {
      padding-right: 15px;
    }
  }
  .hr {
    padding: 0;
    margin: 10px 0 15px;
    border-color: #ddd;
  }
  .dsosee {
    /deep/ .el-button--primary {
      background-color: none;
      border-color: none;
    }
  }
  /deep/ .el-cascader {
    width: 100%;
  }
}
.fontsize {
  font-size: 14px;
  width: 85px;
  display: inline-block;
  line-height: 36px;
}
.numtextr /deep/ .el-input__inner{
  text-align: right;
}
.fontcolor1{
  color: #67C23A;
}
.fontcolor2{
  color: #F56C6C;
}
.numtextr.error /deep/ .el-input__inner{
  border: 1px solid #F56C6C;
}
.icon-gaiyue1{
  font-size: 12px;
  padding-left: 5px;
  color: #999;
}
.iconcolor{
  color: #1C7BEF;
}
.warningtext{
  line-height: 22px;
  font-size: 14px;
  padding-bottom: 10px;
  padding-left: 30px;
  .icon-yuangan{
    font-size: 36px;
    color: #F56C6C;
    vertical-align: top;
  }
  span{
    display: inline-block;
    margin-left: 30px;
  }
}
.scrollul{
  margin: 0;
  padding-left: 0;
  overflow: scroll;
  height: 300px;
  border-bottom: 1px solid #ccc;
  position: relative;
}
.noscroll{
  overflow: hidden;
  height: auto;
}
.notabledata{
  margin: 0;
  /deep/ .el-table__body-wrapper{
    display: none
  }
}
.nodata{
  text-align: center;
  font-size: 14px;
  color: #666;
  line-height: 298px;
  border:1px solid #ccc;
  border-top: 0;
}
.scrollloading{
  text-align: center;
  border: 1px solid #ccc;
  border-top: 0;
  height: 100%;
  padding-top: 40px;
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  width: 100%;
  z-index: 1111;
}
.nomargin {
  margin: 0;
  border-top: 0;
}
.plTableBox {
  /deep/ .el-table{
    margin: 0;
  }
}
</style>
