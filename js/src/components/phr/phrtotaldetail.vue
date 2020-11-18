<template>
    <div class="phr_total_detail">
        <phr-total-search v-model="queryObj"></phr-total-search>
        <div class="phr_total_detail_wrap">
          <template
            v-if="hisList.length>0"
          >
          <el-row
            v-for="(hisItem, index) in hisList" :key="index"
            class="licontainer"
          >
            <el-col :span="4" class="hisnavleft">
              <el-row :gutter="10" style="margin-left:0px;">
                <el-col :span="20" style="padding:10px; border:1px solid #eee; border-right:none; height:90px;">
                  <div class="fn-14" style="color:#333;">{{hisItem.hospitalizedTime	?$moment(hisItem.hospitalizedTime	).format('YYYY-MM-DD'):''}}</div>
                  <div class="fn-14 hidden_text">
                    <el-tooltip effect="dark" :content="`${hisItem.visitTenantSubjectName} ${hisItem.outpatientInpatientDoctorName}`" placement="bottom">
                      <span style="font-size:14px; font-weight:bold;">{{hisItem.visitTenantSubjectName}} {{hisItem.outpatientInpatientDoctorName}}</span>
                    </el-tooltip>
                  </div>
                  <div class="fn-12"  style="color:#999;">{{hisItem.visitOrgName || '--'}}</div>
                </el-col>
                <el-col
                  :span="4"
                  style="height:90px; color:#fff; max-width:30px; display:table;"
                  :class="{'bgblue':hisItem.visitTypeCode === 1,'bggreen':hisItem.visitTypeCode === 3}"
                  >
                  <div style="display:table-cell;
            vertical-align:middle;
            text-align: center;
            width:100%; ">{{hisItem.visitTypeName}}</div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="19" class="navright borderleft">
              <span class="navmark" :class="{'curnavmark': hisItem.showTag}"></span>
              <div
                @click="showInfo(index)"
                class="titlecolor mgl15"
              >
                <div class="histitle">
                  <span>{{hisItem.visitTypeName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span v-if="hisItem.mainDiagnosis">{{hisItem.mainDiagnosis}} --</span>
                  <span v-if="hisItem.outpatientInpatientDoctorName">{{hisItem.outpatientInpatientDoctorName}} --</span>
                  <span v-if="hisItem.visitTenantSubjectName">{{hisItem.visitTenantSubjectName}}</span>
                  <span v-if="hisItem.visitTypeDetailName">-- {{hisItem.visitTypeDetailName}}</span>
                  <span
                    v-if="hisItem.outpatientNumber"
                  >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{hisItem.outpatientNumber}}</span>
                </div>
                <i
                  class="iconfont icon-xia icon-open"
                  :class="{rotate180: hisItem.showTag, rotate0: !hisItem.showTag}"
                ></i>
              </div>
              <transition>
                <div class="infoContainer mgt15" v-if="hisItem.showTag">
                  <p>
                    <span @click="hisItem.diagShow=!hisItem.diagShow" class="conTitle">
                      <span>诊断信息</span>
                      <i
                        class="iconfont icon-xia"
                        :class="{rotate180: hisItem.diagShow, rotate0: !hisItem.diagShow}"
                      ></i>
                    </span>
                  </p>
                  <transition>
                    <div class="mgl30">
                      <phr-detail-zhenduan
                        v-if="hisItem.diagShow"
                        :params="hisItem"
                        ></phr-detail-zhenduan>
                    </div>
                  </transition>
                  <p>
                    <span @click="hisItem.medicalShow=!hisItem.medicalShow" class="conTitle">
                      <span>病历信息</span>
                      <i
                        class="iconfont icon-xia"
                        :class="{rotate180: hisItem.medicalShow, rotate0: !hisItem.medicalShow}"
                      ></i>
                      <!-- <el-button
                        type="small"
                        style="margin-left:20px"
                        @click.stop="printMedicalInfo(hisItem)"
                      >
                        <i
                          class="iconfont icon-dayinji- el-icon--left"
                          style="font-size:13px;margin:0 2px 0;"
                        ></i>打印病历
                      </el-button> -->
                    </span>
                  </p>
                  <transition>
                    <div class="mgl30">
                      <phr-detail-bingli
                        v-if="hisItem.medicalShow"
                        :params="hisItem">
                      </phr-detail-bingli>
                    </div>
                  </transition>
                  <p>
                    <span @click="hisItem.drugShow=!hisItem.drugShow" class="conTitle">
                      <span>西药/中成药医嘱信息</span>
                      <i
                        class="iconfont icon-xia"
                        :class="{rotate180: hisItem.drugShow, rotate0: !hisItem.drugShow}"
                      ></i>
                    </span>
                  </p>
                  <transition>
                    <div class="mgl30" v-if="hisItem.drugShow">
                      <phr-detail-yizhu
                        v-if="hisItem.drugShow"
                        :params="hisItem"
                        :medicineType="2"
                      ></phr-detail-yizhu>
                    </div>
                  </transition>
                  <p>
                    <span @click="hisItem.drugZnShow=!hisItem.drugZnShow" class="conTitle">
                      <span>中草药医嘱信息</span>
                      <i
                        class="iconfont icon-xia"
                        :class="{rotate180: hisItem.drugZnShow, rotate0: !hisItem.drugZnShow}"
                      ></i>
                    </span>
                  </p>
                  <transition>
                    <div class="mgl30" v-if="hisItem.drugZnShow">
                      <phr-detail-yizhu
                        v-if="hisItem.drugZnShow"
                        :params="hisItem"
                        :medicineType="1"
                      ></phr-detail-yizhu>
                    </div>
                  </transition>
                  <p>
                    <span @click="hisItem.inspectShow=!hisItem.inspectShow" class="conTitle">
                      <span>检查信息</span>
                      <i
                        class="iconfont icon-xia"
                        :class="{rotate180: hisItem.inspectShow, rotate0: !hisItem.inspectShow}"
                      ></i>
                    </span>
                  </p>
                  <transition>
                    <div class="mgl30">
                      <phr-detail-jiancha
                    v-if="hisItem.inspectShow"
                    :params="hisItem"></phr-detail-jiancha>
                    </div>
                  </transition>
                  <p>
                    <span @click="hisItem.spItemShow=!hisItem.spItemShow" class="conTitle">
                      <span>检验信息</span>
                      <i
                        class="iconfont icon-xia"
                        :class="{rotate180: hisItem.spItemShow, rotate0: !hisItem.spItemShow}"
                      ></i>
                    </span>
                  </p>
                  <transition>
                    <div class="mgl30">
                      <phr-detail-jianyan
                      v-if="hisItem.spItemShow"
                      :params="hisItem">
                      </phr-detail-jianyan>
                    </div>
                  </transition>
                  <p>
                    <span @click="hisItem.otherShow=!hisItem.otherShow" class="conTitle">
                      <span>其他医嘱信息</span>
                      <i class="iconfont icon-xia"
                        :class="{rotate180: hisItem.otherShow, rotate0: !hisItem.otherShow}"
                      ></i>
                      </span>
                    </p>
                  <transition>
                    <div class="mgl30">
                      <phr-detail-qitayizhu
                        v-if="hisItem.otherShow"
                        :params="hisItem"
                      ></phr-detail-qitayizhu>
                    </div>
                  </transition>
                  <p>
                    <span @click="hisItem.costShow=!hisItem.costShow" class="conTitle">
                      <span>费用信息</span>
                      <i
                        class="iconfont icon-xia"
                        :class="{rotate180: hisItem.costShow, rotate0: !hisItem.costShow}"
                      ></i>
                    </span>
                  </p>
                  <transition>
                    <div class="mgl30">
                      <phr-detail-feiyong
                        v-if="hisItem.costShow"
                        :params="hisItem"
                      ></phr-detail-feiyong>
                    </div>
                  </transition>
                </div>
              </transition>
            </el-col>
          </el-row>
          </template>
          <el-row v-else class="nodata">
            <el-col :span="24">
              <ever-no-data></ever-no-data>
            </el-col>
          </el-row>
        </div>
    </div>
</template>
<script>
import phrTotalSearch from './phr.total.search'
import phrDetailZhenduan from './phr.detail.zhenduan'
import phrDetailJiancha from './phr.detail.jiancha'
import phrDetailJianyan from './phr.detail.jianyan'
import phrDetailYizhu from './phr.detail.yizhu'
import phrDetailFeiyong from './phr.detail.feiyong'
import phrDetailBingli from './phr.detail.bingli'
import phrDetailQitayizhu from './phr.detail.qitayizhu'
import phrTotalApi from '@/workspace/store/phrtotal'
import api from '@/patientinfo/store/phr/historyapi'
import check from './check.js'

export default {
  mixins: [check],
  props: {
    patientId: {
      type: String,
      default: ''
    }
  },
  components: {
    phrTotalSearch,
    phrDetailZhenduan,
    phrDetailJiancha,
    phrDetailJianyan,
    phrDetailYizhu,
    phrDetailBingli,
    phrDetailFeiyong,
    phrDetailQitayizhu
  },
  data () {
    return {
      queryObj: {},
      api,
      hisList: []
    }
  },
  methods: {
    getHisInfo (val) {
      let params = Object.assign({}, {patientId: this.patientId}, val)
      if (!params || !params.visitTypeCode) {
        return
      }
      phrTotalApi.getVisitRecordAll(params).then(res => {
        if (!res) return false
        res.forEach((item, index) => {
          item.diagShow = false
          item.drugShow = false
          item.drugZnShow = false
          item.medicalShow = false
          item.inspectShow = false
          item.spItemShow = false
          item.otherShow = false
          item.costShow = false
        })
        this.hisList = res
      })
    },
    showInfo (index) {
      if (!this.hisList[index].showTag) {
        this.$set(this.hisList[index], 'showTag', true)
      } else {
        this.$set(this.hisList[index], 'showTag', false)
      }
    },
    // 打印病历
  //   async printMedicalInfo (val) {
  //     let toPrint = {
  //       code: '',
  //       params: {
  //         id: ''
  //       },
  //       printParams: {
  //         preview: false,
  //         settings: {
  //           portrait: false,
  //           marginTop: 0,
  //           marginRight: 0,
  //           marginBottom: 0,
  //           marginLeft: 0
  //         }
  //       }
  //     }
  //     let res = await api.getmedicalInfo({ 'visitId': val.visitSn })
  //     if (res.data && res.data.data) {
  //       toPrint.code = res.data.data.printCode
  //       toPrint.params.id = res.data.id
  //     } else {
  //       this.$messageTips(this, 'warning', '获取帆软打印模版失败', '提示')
  //     }
  //   }
  },
  watch: {
    queryObj: {
      handler (obj) {
        if (this.patientId) {
          this.getHisInfo(obj)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss">
.hidden_text{
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.historyCom {
  background-color: #fff;
  height: calc(100% - 150px);
  box-shadow: 0 0 8px 0 rgba(204, 204, 204, 0.36);
}
.hisnavleft {
  text-align: right;
  overflow: hidden;
}
.bgf {
  background: #ffffff;
}
.fn-14 {
  font-size: 14px;
  color: #000;
  line-height:24px;
}
.fn-12 {
  font-size: 12px;
  color: #000;
  line-height:20px;
}
.navleft {
  float: left;
}
.navleft_title{
  max-width:100px;
}
.fixwidth {
  width: 900px !important;
}
.iconType {
  width: 16px;
  height: 38px;
  border-radius: 2px;
  border: 1px solid #1c7bef;
  margin: 6px 8px 6px 2px;
}
.iconType span {
  color: #fff;
  font-size: 12px;
  float: left;
  line-height: 16px;
  margin-top: 4px;
  text-align: center;
}
.mgl15 {
  margin-left: 15px;
}
.histitle {
  padding-top: 9px;
  padding-left: 10px;
  max-width: 800px;
  font-size: 14px;
  font-weight:bold;
  display: inline-block;
}
.navright {
  color: #000;
  min-height: 88px;
  position: relative;
  margin-left:15px;
}
.navright .navmark {
  position: absolute;
  background: #fff;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #ccc;
  top: 9px;
  left: -8px;
}
.navright .curnavmark {
  background: #1c7bef !important;
  border: 1px solid #1c7bef !important;
}
.curTitle {
  background: #1c7bef !important;
  color: #fff;
}
.titlecolor {
  background: #eeeeee;
  height: 34px;
  border-radius: 4px;
}
.round {
  width: 12px;
  height: 12px;
  background: #ebedef;
  border: 1px solid #999999;
  border-radius: 50%;
  right: -33px;
  top: 12px;
}
.icon-open {
  margin-right: 13px;
  padding: 8px 0;
  color: #999999;
  float: right;
  font-size: 14px;
}
.licontainer {
  width: 100%;
  min-width: 1200px;
  margin: 5px 0;
}
// .infoContainer{min-height:270px;}
.infoContainer,
p {
  color: #1c7bef;
  padding-left: 7px;
  overflow: hidden;
}
.infoContainer {
  margin-bottom: 10px;
}
.infoContainer p{
  margin:0;
  margin-top:20px;
}

.blue {
  color: #1c7bef;
}
.borderleft {
  border-left: 2px dashed #dadce0;
  display: inline-block;
}
.mgl30 {
  margin-left: 7px;
}
.rotate180 {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
.rotate0 {
  transform: rotate(360deg);
  transition: transform 0.3s;
}
.maintltle {
  padding-top: 10px;
  padding-left: 25px;
}
.bgblue {
  background-color: #3F82D3;
}
.bggreen {
  background-color: #5DB58A;
}
.overtext {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
}
.conTitle {
  display: inline-block;
  cursor: pointer;
  color: #333333;
  border-left: 4px solid #1C7BEF;
  padding-left: 10px;
}
.conTitle span{
  font-size: 16px;
  font-weight:bold;
}
.conTitle i {
  display: inline-block;
  margin: 0 5px;
  font-size: 12px;
  color:#bbb;
}
.otherInfo {
  float: left;
  width: 50%;
}
.nodata {
  text-align: center;
  padding: 220px 0 300px;
}
.nodata img {
  width: 100px !important;
}
.nodata p {
  color: #000;
  font-size: 14px;
}
.sidemenu {
  margin-left: 10px;
}
.wmedical {
  /deep/.el-table__body {
    overflow: hidden;
    td {
      padding: 0 !important;
    }
  }
  .el-table-child {
    overflow: hidden;
    /deep/ .el-table__row {
      td {
        padding: 8px 0 !important;
      }
    }
  }
}
.maintltle {
  /deep/ .el-form-item {
    margin-right: 20px;
    .el-form-item__label {
      padding: 0 15px 0 0;
      justify-content: flex-start;
    }
  }
}
.docDialog {
  /deep/.el-dialog__body {
    padding-top: 5px;
  }
}
</style>
