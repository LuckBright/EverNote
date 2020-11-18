<template>
  <el-dialog
    title
    :visible="dialogVisible"
    width="90%"
    :modal="false"
    class="ipdsearch"
    v-loading.fullscreen.lock="loadingSw"
    :before-close="handleClose"
  >
    <el-main class="inner" v-if="dialogVisible">
      <div class="patient_title f_bold f16" v-if="tableData.length || errTableData.length">
        {{!dispenseObj.oldCode ? '备药单号' : '批量备药单号'}}：{{dispenseObj.code}}
        <span
          class="inUse ml5"
          v-if="dispenseObj.inUse === 2"
        >（该备药单已作废）</span>
        <span class="inUse ml5" v-if="dispenseObj.oldCode">（原单号：{{dispenseObj.oldCode}}）</span>
        <el-button
          type="text"
          v-if="!errTableData.length && dispenseSettingObject.uddDispenseSettingObject && dispenseSettingObject.uddDispenseSettingObject.dispensePreparePrint == 1"
          @click="handlerSupplementPrint(true)"
          class="fr"
        >补打备药单</el-button>
      </div>
      <div class="list-msg patient_prescription">
        <div class="list_box">
          <div v-if="tableData.length" class="list">
            <div v-for="(item, index) in tableData" :key="index">
              <ipd-righttable
                :itemData="item"
                :thisIndex="tableData.length > 1 || errTableData.length ? index + 1 : 0"
                :isSee="1"
                @supplementPrint="supplementPrint"
                @updateStatus="updateStatus"
              ></ipd-righttable>
            </div>
          </div>
          <div v-if="errTableData.length" class="list">
            <div v-for="(item, index) in errTableData" :key="index">
              <ipd-righttable
                :itemData="item"
                :thisIndex="tableData.length ? tableData.length + index + 1 : index + 1"
                :isSee="1"
                :appendBody="true"
                @updateStatus="updateStatus"
              ></ipd-righttable>
            </div>
          </div>
          <everNoData v-if="!tableData.length && !errTableData.length"></everNoData>
        </div>
      </div>
      <!-- // (drugStatus==4 || drugStatus==5) &&  -->
    </el-main>
    <div slot="footer" class="list-btn dialog-footer" v-if="tableData.length">
      <el-row>
        <el-col :span="24">
          <div class="btn-container">
            <el-button
              v-if="tableData.length && errTableData.length"
              type="primary"
              @click="handlerSupplementPrint(false)"
              class="mr10"
            >重新生成备药单</el-button>
            <span class v-if="drugStatus == 4 && !errTableData.length">
              <el-button type="primary" @click="handleFinish(1)">备药完成</el-button>
            </span>
            <span class v-if="drugStatus == 5 && !errTableData.length">
              <el-button type="primary" @click="handleFinish(2)">发药</el-button>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <jcp-print
      :key="jcpKey"
      ref="jcpPrint"
      :hospitalType="hospitalType"
      :liveTableData="liveTableData"
      :liveNonFatherAdvice="liveNonFatherAdvice"
      :printPatientObj="printPatientObj"
      :liveType="liveType"
      :inpatientArea="inpatientArea"
      :fatherAdvice="fatherAdvice"
    ></jcp-print>
  </el-dialog>
</template>

<script>
import IpdRighttable from '../components/ipd.righttable'
import api from '../store/dispenseapi'
import { DISPENSING_STATUS, SEARCH_CODE, SPU_SPEC_CODE, DOSAGE } from '@/util/common'
import JcpPrint from '@/warehouse/page/components/jcp.print'
import mixinsDespen from '../ipd/mixins_despen'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixinsnew'
import dispenseSettingMixin from '@/warehouse/util/dispense.setting.mixin'
export default {
  mixins: [getStorage, mixinsDespen, sendDrug, hospitalPrintMixins, dispenseSettingMixin],
  props: {
    searchObject: {
      type: Object,
      default: () => ({})
    },
    opdSearchList: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    IpdRighttable,
    JcpPrint
  },
  data () {
    return {
      SEARCH_CODE,
      SPU_SPEC_CODE,
      DOSAGE,
      DISPENSING_STATUS,
      tableData: [],
      errTableData: [],
      drugStatus: 4,
      dispenseObj: {},
      dialogVisible: false,
      loadingSw: false
    }
  },
  methods: {
    supplementPrint (v) {

    },
    diglogFunction () {
      api.reprintDispense({ id: this.dispenseObj.id }).then(res => {
        if (res) {
          this.$store.commit('updateDispenseCode', res.codes)
          this._rePrint()
          this.$messageTips(this, 'success', '重新生成备药单成功')
          this.getDispenseList(res.codes)
          this.$emit('updateSearchOpd', true)
        }
      })
    },
    handlerSupplementPrint (flag) { // 补打备药单
      if (flag) {
        this._rePrint()
      } else {
        this.$confirm('重新生成的备药单将不包含异常药包', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.diglogFunction()
        })
      }
    },
    _rePrint () {
      this._initPrint()
      this.liveTableData = {
        tableData: this.tableData,
        barCode: this.dispenseObj.code
      }
      this.$nextTick(_ => {
        this.handlerPrint()
      })
    },
    updateStatus (v) {
      this.getDispenseList()
      this.$emit('updateSearchOpd', true)
    },
    findaTableData (res) {
      if (res && res.code) {
        this.dispenseObj = res
        let countObject = this._findArray(res.uddDispenseList || [])
        this.tableData = countObject.newArr
        this.drugStatus = res.uddDispenseList[0].status
        this.errTableData = countObject.errArr
      } else {
        this.dialogVisible = false
      }
    },
    getDispenseList (codes) {
      this.loadingSw = true
      api.getDispenseForUdd({ code: codes || this.searchObject.searchValue }).then(res => {
        this.findaTableData(res)
        this.loadingSw = false
      })
    },
    handleFinish (type) {
      const params = {
        id: this.dispenseObj.id,
        status: this.drugStatus + 1, // 服务端自己取药包状态
        storageRoomId: this.storageId
      }
      api.updateStatus(params).then(res => {
        // 更改药包状态为待发药
        if (res.flag) {
          this.$messageTips(this, 'success', `${type === 1 ? '备药' : '发药'}完成`)
          this.$emit('updateSearchOpd', true)
          this.getDispenseList()
        } else {
          this.getDispenseList()
        }
      })
    },
    handleClose (v) {
      this.dialogVisible = false
    },
    _findArray (arr, str) {
      //  获取到的数组中区分 正常处方和异常处方  arr原数组  str要区分的匹配值
      let newArr = []
      let errArr = []
      arr.forEach(item => {
        if (item.identification || item.status === 7) {
          errArr.push(item)
        } else {
          newArr.push(item)
        }
      })
      //  输出一个对象 newArr为正常处方  errArr为异常处方
      return { newArr: newArr, errArr: errArr }
    }
  },
  watch: {
    'dialogVisible' (v) {
      if (v) {
        // this.getDispenseList()
      } else {
        this.$emit('closeSearchPop', true)
        this.tableData = []
        this.errTableData = []
      }
    },
    'opdSearchList' (v) {
      this.findaTableData(v)
    }
  }
}
</script>

<style scoped lang="scss">
.ipdsearch /deep/ .el-dialog {
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
  .el-dialog__body {
    padding: 10px;
    padding-bottom: 0;
    .patient_title {
      margin-bottom: 15px;
    }
  }
  .el-dialog__footer {
    text-align: center;
    margin-top: 15px;
    border-top: 1px solid #ccc;
    padding-top: 15px;
    margin-top: 0px;
  }
  .patient_prescription {
    overflow-y: auto;
    height: 350px;
  }
}
.patient_list {
  padding: 0 10px;
}
</style>
