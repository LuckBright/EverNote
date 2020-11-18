<template>
  <div>
    <ever-bread-crumb name="拆零单" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <h2 class="alg_c">拆零管理</h2>
      <div class="serach_box" v-if="!objId">
        <el-row :gutter="20">
          <el-col :span="8" align="right">
            <span style="line-height: 36px;">选择物资</span>
          </el-col>
          <el-col :span="8">
            <material-select
              ref="remoteselect"
              :params="queryParams"
              :needObjFlag="true"
              apiName="getSplitFlag"
              @change="handleSelect">
            </material-select>
            <!-- <ever-remote-method
              :api="getMaterialInfoApi"
              :showKeys="true"
              :isObjSearch="true"
              :simpleQuery="true"
              ref="remoteselect"
              :value="remoteName"
              :params="queryParams"
              @input="handleSelect"
              :placeholder="REMOTE_METHODS_PLACEHOLDER"
              :needObjFlag="true"
              apiName="getSplitFlag">
            </ever-remote-method> -->
          </el-col>
          <el-col :span="8">
            <el-button style="width: 120px" type="primary" @click="handleQuerySelect">选择</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="content_box mt20 alg_c" v-if="!localMaterialId && !successFull">
        <p class="nodata">请先选择需要拆零的物资</p>
      </div>
      <div class="content_box mt20" v-if="!successFull && localMaterialId">
        <div>
          <!-- before -->
          <el-row :gutter="20" type="flex" justify="center" v-if="localMaterialId">
            <el-col :span="10">
              <h3 v-if="beforeObj.materialName">
                <material-show-name v-if="beforeObj.materialName" :materialName="beforeObj.materialName" :icons="beforeObj.icons"></material-show-name>
              </h3>
              <ul class="content_list">
                <li
                  v-if="beforeObj.unitName"
                >包装单位：{{beforeObj.unitName}}</li>
                <li v-if="beforeObj.spec">
                  包装规格：{{beforeObj.spec}}
                </li>
              </ul>
            </el-col>
            <el-col :span="4">
              <div class="pos_re">
                <div class="square pos_ab"></div>
                <div class="arrow-right pos_ab"></div>
              </div>
            </el-col>
            <el-col :span="10">
              <div v-if="afterObj.localMaterialId">
                <h3 v-if="afterObj.materialName">
                  <material-show-name v-if="afterObj.materialName" :materialName="afterObj.materialName" :icons="afterObj.icons"></material-show-name>
                </h3>
                <ul class="content_list">
                  <li v-if="afterObj.unitName">
                    包装单位：{{afterObj.unitName}}
                  </li>
                  <li v-if="afterObj.spec">
                    包装规格：{{afterObj.spec}}
                  </li>
                </ul>
              </div>
              <div
                v-if="!obj.flag && localMaterialId"
                class="font red alg_c"
                v-html="obj.errorMessage"
              ></div>
            </el-col>
          </el-row>
          <!-- after -->
          <el-row
            :gutter="20"
            type="flex"
            justify="center"
            class="rows"
            v-if="obj.flag && afterObj.localMaterialId"
          >
            <el-col :span="10">
              <ul class="content_list" v-if="obj.beforeObject.isExpiryDate">
                <li>
                  选择批号：
                  <el-select v-model="batchVal" placeholder="请选择批号" @change="handleSelectBatch">
                    <el-option
                      v-for="item in batchOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </li>
                <li v-if="batchVal">生产日期：{{produceDate | formatDateByExp('YYYY-MM-DD')}}</li>
                <li v-if="batchVal">到期日期：{{validityDate | formatDateByExp('YYYY-MM-DD')}}</li>
                <li
                  v-if="batchVal"
                >当前库存：{{usableNum}} {{obj.beforeObject ? obj.beforeObject.name : ''}}</li>
              </ul>
              <ul v-else>
                <li>当前库存：{{usableNum}} {{beforeObj.unitName}}</li>
              </ul>
            </el-col>
            <el-col :span="4">
              <div class="alg_c padding">
                <p>拆零数量</p>
                <el-input
                  @blur="handleSplitNumber(splitNum)"
                  class="padding"
                  v-model="splitNum"
                  type="number"
                ></el-input>
              </div>
            </el-col>
            <el-col :span="10">
              <div>
                预计增加库存：
                <span v-if="num">
                  <span class="font red">{{num}}</span>
                  <span>{{afterObj.unitName}}</span>
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="alg_c mt20" v-if="localMaterialId && afterObj.localMaterialId && !successFull">
        <el-button
          type="primary"
          style="width: 120px"
          :disabled="submitDisabled"
          @click="handleSubmit"
          :loading="unRepeatedBtn"
        >提交</el-button>
      </div>
      <div class="content_box alg_c mt20" v-if="successFull">
        <!-- <p>{{successFullName}}</p> -->
        <h2>拆零完成</h2>
      </div>
      <div class="record" v-if="tableData.length">
        <h4>拆零记录</h4>
        <el-table :data="tableData">
          <el-table-column
            prop="code"
            align="center"
            label="拆零单号"
            width="200"
          >
            <template slot-scope="scope">
              <a
                @click="$router.push('/storages/business/splitsee/' + scope.row.id)"
              >{{scope.row.code}}</a>
            </template>
          </el-table-column>
          <el-table-column label="拆零商品">
            <template slot-scope="scope">
              <material-show-name
                v-if="scope.row.splitNumberItemList[0].beforeObject.materialName"
                :materialName="scope.row.splitNumberItemList[0].beforeObject.materialName"
                :icons="scope.row.icons">
              </material-show-name>
            </template>
          </el-table-column>
          <el-table-column prop align="center" label="规格" width="200">
            <template slot-scope="scope">
              <span>{{scope.row.splitNumberItemList[0].beforeObject.spec || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" align="right" label="拆零数量" width="100">
            <template
              slot-scope="scope"
            >{{scope.row.splitNumberItemList[0].numBefore + ' ' + scope.row.splitNumberItemList[0].beforeObject.unitName}}</template>
          </el-table-column>
          <el-table-column prop align="center" label="创建人" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.updatedBy">{{scope.row.updatedBy}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间" width="160"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import sets from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import remoteSelect from '../../joinstorage/remoteselect'
import splitApi from '../store/splitapi'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'
import { dateFormat, patch, SPEC_CODE, parserJSON, PACKAGE_CODE, SEARCH_CODE } from '@/util/common'
import { PARSE_SPECIAL_REG } from '@/warehouse/util/reg.js'

export default {
  mixins: [sets, getstorage],
  data () {
    return {
      getMaterialInfoApi,
      SPEC_CODE,
      SEARCH_CODE,
      parserJSON,
      PACKAGE_CODE,
      remoteName: '',
      PARSE_SPECIAL_REG,
      queryParams: { offset: 0, pagesize: 100, storageRoomId: '' },
      localMaterialId: '',
      splitNum: '',
      num: '',
      objId: this.$route.params.id,
      batchVal: '',
      produceDate: '',
      validityDate: '',
      usableNum: '',
      beforeObj: {},
      afterObj: {},
      obj: {},
      batchOptions: [],
      successFull: false,
      flag: false,
      tableData: [],
      successFullName: '',
      REMOTE_METHODS_PLACEHOLDER,
      unRepeatedBtn: false // 控制重复提交
    }
  },
  methods: {
    handleSubmit () {
      if (!this._validatorSplitNumber()) return
      let params = {
        status: 111,
        storageRoomId: this.storageId,
        materialType: this.obj.afterObject.classifyId,
        splitNumberItemList: [
          {
            materialType: this.obj.afterObject.classifyId,
            storageRoomId: this.storageId,
            localMaterialIdBefore: this.obj.beforeObject.localMaterialId,
            localMaterialIdAfter: this.obj.afterObject.localMaterialId,
            numBefore: this.splitNum,
            numAfter: this.num,
            batchNum: this.batchVal,
            produceDate: this.produceDate,
            validityDate: this.validityDate,
            unitIdBefore: this.beforeObj.unitId || '',
            unitIdAfter: this.afterObj.unitId || ''
          }
        ]
      }
      this.unRepeatedBtn = true
      splitApi.create(params).then(result => {
        this.unRepeatedBtn = false
        if (!this.objId) this.$refs.remoteselect.select = ''
        if (result && result.flag) {
          splitApi.getById(result.splitNumber.id).then(res => {
            this.successFull = true
            // this.successFullName = res.splitNumberItemList[0].beforeObject.spec || ''
            this._getSplitList()
          })
        }
      })
    },
    handleQuerySelect () {
      // 初始化所有数据
      this.beforeObj = {}
      this.afterObj = {}
      this.obj = {}
      this.batchOptions = []
      this.successFull = false
      this.batchVal = ''
      this.splitNum = ''
      this.num = ''

      if (!this.localMaterialId) {
        return this.$messageTips(this, 'warning', '请先选择物资', '提示信息')
      }
      if (!this.flag && !this.objId) {
        return this.$messageTips(this, 'warning', '该物资是唯一码管理，不允许拆零', '提示信息')
      }
      let params = {
        localMaterialId: this.localMaterialId,
        materialType: this.materialType,
        storageRoomId: this.storageId
      }
      splitApi.getBySpu(params).then(result => {
        if (result) {
          this.beforeObj = result.beforeObject
          this.afterObj = result.afterObject
          this.obj = result
          result.stockContainerVoList.forEach(item => {
            item.name = item.batchNum
            item.id = item.batchNum
          })
          this.batchOptions = result.stockContainerVoList
          // 拆零纯数量管理
          if (result.beforeObject && result.beforeObject.isNum && !result.beforeObject.isManageAlone && !result.beforeObject.isExpiryDate && result.stockContainerVoList && result.stockContainerVoList.length) this.usableNum = result.stockContainerVoList[0].usableNum
        }
      })
    },
    handleSplitNumber (v) {
      if (v === '') return
      //   this.splitNum = parseInt(v)
      if (!this._validatorSplitNumber()) return
      if (this.obj.beforeObject.isExpiryDate && !this.batchVal) {
        return this.$messageTips(this, 'warning', '请先选择批次再拆零', '提示')
      }
      if (this.splitNum) this.num = this.splitNum * this.beforeObj.packageToPrepareRatio
    },
    handleSelectBatch (v) {
      let index = this.batchOptions.findIndex(item => {
        return item.id === v
      })
      this.produceDate = this.batchOptions[index].produceDate ? dateFormat(this.batchOptions[index].produceDate, 'YYYY-MM-DD HH:mm:ss') : ''
      this.validityDate = this.batchOptions[index].validityDate ? dateFormat(this.batchOptions[index].validityDate, 'YYYY-MM-DD HH:mm:ss') : ''
      this.usableNum = this.batchOptions[index].usableNum
      if (this.splitNum) this.num = this.splitNum * this.beforeObj.packageToPrepareRatio
    },
    handleSelect (data) {
      this.localMaterialId = ''
      this.flag = true
      this.localMaterialId = data.localMaterialId
      if (data.isManageAlone === 1) {
        this.flag = false
        this.$refs.remoteselect.select = ''
        return this.$messageTips(this, 'warning', '该物资是唯一码管理，不允许拆零', '提示信息')
      }
      data && this.handleQuerySelect()
    },
    _getSplitList () {
      // 当天（0点到24点）之间完成的拆零单 -- 拆零记录
      let params = {
        startDate: this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endDate: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        storageRoomId: this.storageId
      }
      splitApi.list(params).then(result => {
        if (result && result.list) this.tableData = result.list
      })
    },
    _info () {
      // this.queryParams.materialType = this.materialType
      this.queryParams.storageRoomId = this.storageId
    },
    _validatorSplitNumber () {
      //   const parse = /^(\+)?\d*$/
      //   if (!parse.test(this.splitNum) || this.splitNum <= 0) {
      if (!PARSE_SPECIAL_REG.test(this.splitNum)) {
        this.splitNum = ''
        this.$messageTips(this, 'warning', '拆零数量请输入大于0的正整数，请重新录入', '提示')
        return false
      }
      return true
    },
    ...patch
  },
  computed: {
    submitDisabled () {
      return !this.batchVal || this.splitNum <= 0
    }
  },
  created () {
    this._info()
    this._getSplitList()
    if (this.objId) {
      this.localMaterialId = this.objId
      this.handleQuerySelect()
    }
  },
  components: {
    remoteSelect
  }
}
</script>
<style lang="scss" scoped>
.serach_box {
  background: #f4f4f4;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 20px;
}
.content_box {
  border: 1px solid #eee;
  padding: 20px 30px;
  min-height: 150px;
}
.pos_re {
  top: 50%;
  margin-left: 50px;
  margin-top: -30px;
}
.square {
  width: 80px;
  height: 30px;
  top: 12px;
  background: #eee;
  left: 0
}
.arrow-right {
  left: 80px;
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-left: 30px solid #eee;
}
h3 {
  font-size: 16px;
}
h2.alg_c {
  padding: 5px 15px 15px;
}
.content_box h2 {
  color: #008000;
  font-size: 28px;
}
.content_list {
  line-height: 40px;
  font-size: 14px;
}
.rows {
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.nodata {
  line-height: 200px;
}
// .el-input-number /deep/ .el-input__inner { text-align: center}
</style>
