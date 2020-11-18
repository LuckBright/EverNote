<template>
  <div :class="{'detail-container': true, 'is-frame': fromType === 'crm'}">
        <el-tooltip
          class="item"
          effect="dark"
          :content="starStatus === 1 ? '取消关注' : '关注'"
          placement="bottom"
          v-if="!['crm','resident','inpatient'].includes(fromType)"
        >
          <span @click="debouncedStarChange" class="star iconfont icon-shoucang fr"  :class="{'active-star': starStatus === 1}"></span>
        </el-tooltip>

    <div v-if="!['crm','resident','inpatient'].includes(fromType)" class="detail-header" ref="topHeader">
      <ever-bread-crumb name="患者详情" :isCustomBack="true" @back="back" :showTitle="true"></ever-bread-crumb>
      <div class="detail-header-inner" v-loading="!currentVisitData && !noVisit">
        <common-head
          v-if="currentVisitData || noVisit"
          :patientId="patientId"
          ref="patientHeader"
          :visitNumber="currentVisitData ? currentVisitData.visitSerialNumber : ''"
          :key="currentVisitData.visitSerialNumber"
          :dptId="currentVisitData ? currentVisitData.admissionTenantSubjectId : ''"
          :code="currentVisitData ? (currentVisitData.visitTypeCode === '1' ? '901' : (currentVisitData.visitTypeCode === '3' ? '902' : '903')) : '901'"
          :hospitalizedNumber="currentVisitData ? currentVisitData.visitSerialNumber : ''"
        />
      </div>
    </div>
    <div class="detail-main">
      <div class="detail-main-inner no-visit-box" v-if="noVisit">
        暂无诊疗记录
      </div>
      <div v-if="['crm','resident','inpatient'].includes(fromType) ? (!noVisit && currentVisitData) : (!noVisit)" class="detail-main-inner" v-loading="!currentVisitData && !noVisit">
        <typecheckbox @change="getDateList" :all-codes.sync="hadTypeCodes"></typecheckbox>
        <div class="detail-main-left">
          <div class="date-box">
            <div class="date-box-inner">
              <template v-for="(item, index) in dateList">
                <div class="date-item" v-if="item.visitSerialTypeCode  == '3' ? item.admissionDate : item.hospitalizedTime">
                  <template>
                    <div :class="{'date-month':true, 'checked': nowCheckDate === item.visitSerialNumber}" @click="changeDate(item, 'click')">{{getMonth($moment(item.visitSerialTypeCode  == '3' ? item.admissionDate : item.hospitalizedTime).format('YYYY-MM-DD'))}}</div>
                    <div class="date-year">
                      <el-tooltip popper-class="date-year-tip"  placement="bottom">
                        <div slot="content">
                          <p>机构：{{item.visitOrgName}}</p>
                          <p>科室：{{item.visitTenantSubjectName}}</p>
                          <p>医生：{{item.visitDoctorName}}</p>
                        </div>
                        <el-button type="text">
                          <i class="icon el-icon-more"></i>
                        </el-button>
                      </el-tooltip>
                      {{getYear($moment(item.visitSerialTypeCode  == '3' ? item.admissionDate : item.hospitalizedTime).format('YYYY-MM-DD'))}}
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>
          <div class="menu-box">
            <ul>
              <template v-for="(item, index) in menus">
                <li v-if="!(crmNotMenus.includes(item.url) && fromType === 'crm') || fromType !== 'crm'"  :class="{'checked':checked(item.url)}" @click="goMenuLink(item.url)">
                  <i :class="'iconfont ' + item.icon"></i>
                  {{item.name}}
                  <i class="icon el-icon-arrow-right"></i>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div class="detail-main-right" v-if="showRouter">
          <router-view :key="$route.query.visitSerialNumber"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonHead from '@/inpatient/components/common.head.js'
import menus from '@/phr/assets/json/menus'
import { mapState, mapMutations } from 'vuex'
import {request} from '@/util/req'
import urls from '@/phr/api/urls'
import { debounce } from 'lodash'
import typecheckbox from '@/phr/page/patientdetail/components/typecheckbox'
export default {
  components: {
    commonHead,
    typecheckbox
  },
  data () {
    return {
      crmNotMenus: [
        '/phr/patientdetail/abstract',
        '/phr/patientdetail/follow',
      ],
      noVisit: false,
      patientId: '',
      showRouter: false,
      nowCheckDate: 1,
      menus,
      dateList: [],
      pagequery: {},
      currentVisitData: null,
      starStatus: -1,
      hadTypeCodes: [],
      once: false,
    }
  },
  computed: {
    ...mapState(['phrPatientActive']),
    fromType () {
      return this.$route.query.fromType
    }
  },
  created () {
    this.pagequery = {...this.$route.query.pagequery}
    if (this.$route.query.patientId || this.$route.params.patientId) {
      this.patientId = this.$route.query.patientId || this.$route.params.patientId
      let tempPatientObj = {...this.phrPatientActive}
      tempPatientObj.patientId = this.$route.query.patientId
      this.setPhrPatientActive(tempPatientObj)
      this.getFollowStatus(this.patientId)
    }
    this.debouncedStarChange = debounce(this.handleStarChange, 300)
  },
  mounted () {
    this.getDateList()
  },
  methods: {
    ...mapMutations(['setPhrPatientActive']),
    checked(url) {
      if (!url) return false
      if (this.fromType === 'resident' || this.fromType === 'inpatient') {
        url = '/' + url.split('/').pop()
      }
      return this.$route.path.indexOf(url) > -1
    },
    getMonth (date) {
      let tempDateArr = date.split('-')
      return tempDateArr[1] + '-' + tempDateArr[2]
    },
    async getFollowStatus (patientId) {
      const res = await request(urls.search.status, {patientId})
      this.starStatus = res && res.data && res.data.status
    },
    async handleStarChange () {
      this.starStatus = this.starStatus > 0 ? -1 : 1
      await request(urls.search.switch, {patientId: this.patientId})
    },
    getYear (date) {
      let tempDateArr = date.split('-')
      return tempDateArr[0]
    },
    getDateList (visitSerialTypeCodes = ['1', '3', '5']) {
      request(urls.dateList,
        {
          rid: 'Auth_menu_phr_patientdetail',
          patientId: this.$route.query.patientId || this.$route.params.patientId,
          visitSerialTypeCodes,
          page: 1,
          pageSize: 1000,
          pagesize: 1000,
          offset: 0
        }
      ).then((res) => {
        if (res.head.errCode === 0) {
          this.dateList = res.data.resultList
          if (!this.once) {
            this.getTypeCodes()
            this.once = true
          }
          if (this.dateList.length > 0) {
            this.changeDate(this.dateList[0])
          } else {
            this.noVisit = true
          }
          this.showRouter = true
        }
      })
    },
    getTypeCodes () {
      for (let i = 0; i < this.dateList.length; i++) {
        const item = this.dateList[i]
        if (!this.hadTypeCodes.includes(item.visitSerialTypeCode)) {
          this.hadTypeCodes.push(item.visitSerialTypeCode)
        }
        if (this.hadTypeCodes.length >= 3) { // 三种类型都有跳出
          return
        }
      }
    },
    back () {
      this.$router.push({
        path: '/phr/patientlist',
        query: {
          ...this.pagequery
        }
      })
    },
    changeDate (item, type) {
      this.visitSerialNumber = item.visitSerialNumber
      this.currentVisitData = item
      this.setPhrPatientActive(item)
      this.nowCheckDate = item.visitSerialNumber
      // if (type === 'click' && ['crm'].includes(this.$route.query.fromType)) {
      //   setTimeout(() => {
      //     this.$bus.$emit(commonHeadEvent.refresh)
      //   })
      // }
      let path = this.$route.path === '/phr/patientdetail' ? (this.fromType === 'crm' ? '/phr/patientdetail/preview' : '/phr/patientdetail/abstract') : this.$route.path
      let _tmp = this.$route.query
      delete _tmp.q
      this.$router.push({
        path: path,
        query: {
          ..._tmp, // 住院的需求，如果有问题去掉时候通知下cpoe
          fromType: this.fromType,
          visitSerialTypeCode: item.visitSerialTypeCode || this.phrPatientActive.visitSerialTypeCode,
          visitSerialNumber: item.visitSerialNumber || this.phrPatientActive.visitSerialNumber,
          patientId: this.$route.query.patientId || this.$route.params.patientId,
          hospitalizedNumber: item.hospitalizedNumber,  // '2020-01'
          outpatientSerialNumber: item.outpatientSerialNumber, // '2020-02'
          visitTypeCode: item.visitTypeCode
        }
      })
      // this.$router.replace({
      //   path: '/phr/patientdetail/refresh',
      //   query: {
      //     t: Date.now()
      //   }
      // })
    },
    goMenuLink (url) {
      let arr = url.split('/')
      url = this.fromType === 'resident' ? '/resident/patientmgt/patientdetail/' + arr[arr.length - 1] : url
      url = this.fromType === 'inpatient' ? '/inpatient/patientmgt/patientdetail/' + arr[arr.length - 1] : url
      let _tmp = this.$route.query
      delete _tmp.q
      this.$router.push({
        path: url,
        query: {
          ..._tmp,
          fromType: this.fromType,
          visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
          visitSerialNumber: this.$route.query.visitSerialNumber || this.phrPatientActive.visitSerialNumber,
          patientId: this.$route.query.patientId || this.phrPatientActive.patientId,
          hospitalizedNumber: this.$route.query.hospitalizedNumber || this.phrPatientActive.hospitalizedNumber,
          outpatientSerialNumber: this.$route.query.outpatientSerialNumber || this.phrPatientActive.outpatientSerialNumber
        }
      })
    },
    getHeaderHeight () {
      return this.$refs.topHeader.clientHeight
    }
  },
}
</script>

<style lang="less" scoped>
  .detail-container {
    height: 100%;
    position: relative;
    display: flex;
    flex-flow: column;
    .star {
      position: absolute;
      left: 157px;
      top: 3px;
      color: #C5C5C5; 
    }
    .active-star {
      color:  #FAAD14
    }
    &.is-frame{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #ffff;
      z-index: 9999;
    }
  }
  .detail-header{
    /*height: 104px;*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*z-index: 10;*/
    .detail-header-inner{
      background: #FFFFFF;
      box-shadow: 0 3px 5px 0 rgba(62,82,97,0.06);
      position: relative;
      z-index: 1;
      /deep/ .common_head{
        margin-bottom: 0px;
      }
    }
  }
  .detail-main{
    flex: 1;
    width: 100%;
    height: 0;
    flex-shrink: 0;
    box-sizing: border-box;
    /*padding-top: 104px;*/
    position: relative;
    .detail-main-inner{
      width: 100%;
      height: 100%;
      position: relative;
      &.no-visit-box{
        padding: 30px;
        text-align: center;
        color: #999;
      }
      .detail-main-left{
        display: flex;
        width: 226px;
        height: 100%;
        background: #FDFDFF;
        box-shadow: 0 0 13px 0 rgba(136,136,136,0.13);
        top: 1px;
        left: 0;
        position: absolute;
        padding-top: 50px;
        box-sizing: border-box;
        .date-box{
          width: 80px;
          flex-shrink: 0;
          height: 100%;
          overflow: auto;
          &::-webkit-scrollbar{
            display: none;
          }
          /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
          /*&::-webkit-scrollbar{*/
          /*  width: 1px;*/
          /*  height: 1px;*/
          /*  background-color: #f5f5f5;*/
          /*}*/
          /*!*定义滚动条的轨道，内阴影及圆角*!*/
          /*&::-webkit-scrollbar-track{*/
          /*  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
          /*  border-radius: 10px;*/
          /*  background-color: #f5f5f5;*/
          /*}*/
          /*!*定义滑块，内阴影及圆角*!*/
          /*&::-webkit-scrollbar-thumb{*/
          /*  !*width: 10px;*!*/
          /*  height: 20px;*/
          /*  border-radius: 10px;*/
          /*  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);*/
          /*  background-color: #555;*/
          /*}*/
          .date-box-inner{
            min-height: 100%;
            position: relative;
            &:after{
              content: '';
              display: block;
              position: absolute;
              width: 2px;
              height: 100%;
              border-left: 1px dotted #DADCE0;
              border-right: 1px solid #DADCE0;
              top: 0;
              right: 7px;
            }
            .date-item{
              font-size: 14px;
              color: #999999;
              padding: 0 18px 0 0;
              text-align: right;
              position: relative;
              z-index: 9;
              height: 100px;
              .date-month{
                font-weight: bold;
                border-radius: 2px;
                margin-left: 15px;
                text-align: center;
                padding: 2px 0;
                cursor: pointer;
                &.checked{
                  background: #4484C9;
                  color: #fff;
                }
              }
              .date-year{
                font-size: 12px;
                color: #999999;
                padding: 0;
                margin-right: 5px;
                .el-icon-more{
                  transform: rotate(90deg) scale(0.8);
                  position: relative;
                  right: -4px;
                  font-size: 10px;
                }
                /deep/ button{
                  margin: 0;
                  padding: 0;
                  color: #999999;
                }
              }
              &:after{
                content: '';
                display: block;
                position: absolute;
                right: 0px;
                top: 0;
                width: 10px;
                height: 10px;
                background: #5DB58A;
                border: 4px solid #F8F9FA;
                border-radius: 200px;
              }
            }
          }
        }
        .menu-box{
          flex: 1;
          height: 100%;
          position: relative;
          top: -5px;
          overflow: auto;
          /*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*/
          &::-webkit-scrollbar{
            width: 3px;
            height: 3px;
            background-color: #f5f5f5;
            border-radius: 50px;
          }
          /*定义滚动条的轨道，内阴影及圆角*/
          &::-webkit-scrollbar-track{
            -webkit-box-shadow: inset 0 0 6px rgb(239, 239, 239);
            border-radius: 50px;
            background-color: #f5f5f5;
          }
          /*定义滑块，内阴影及圆角*/
          &::-webkit-scrollbar-thumb{
            width: 3px;
            height: 200px;
            border-radius: 200px;
            -webkit-box-shadow: inset 0 0 6px rgb(248, 248, 248);
            background-color: #8f8f8f;
          }
          ul{
            padding: 0;
            margin: 0;
            font-size: 12px;
            color: #333333;
            .iconfont{
              color: #878D94;;
              font-size: 13px;
            }
            .el-icon-arrow-right{
              float: right;
            }
            li{
              padding: 8px 20px;
              cursor: pointer;
              &:hover{
                color: #4484C9 ;
                .iconfont{
                  color: #4484C9 ;
                }
              }
              &.checked{
                color: #4484C9;
                font-weight: bold;
                .iconfont{
                  color: #4484C9 ;
                  font-weight: normal;
                }
              }
            }

          }
        }
      }
      .detail-main-right{
        width: 100%;
        height: 100%;
        padding-left: 226px;
        box-sizing: border-box;
      }
    }
  }
</style>
