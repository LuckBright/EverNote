<template>
  <div id='telescopic' class="telescopic" :class='width'>
    <div class="title">
      患者列表
      <i class="icon el-icon-d-arrow-right" @click='telescopic("lang")' v-if='width === "short" || width === "close"'></i>
      <i class="icon el-icon-d-arrow-left" @click='telescopic("short")' v-if='width === "lang"'></i>
    </div>
    <div class="condition">
      <el-input class="input" clearable @input='get_list' v-model="condition.message" placeholder="患者姓名／编号／住院病案号" width='200px'></el-input>
      <el-select class="input" v-model="condition.condition" placeholder="请选择" @change='check_box_change'  v-if='from.indexOf("birth") == -1'>
        <el-option
          v-for="item in condition.condition_option"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
      <el-checkbox-group
        v-if='$route.path.indexOf("resident") > -1'
        v-model="condition.check_box"
        :min="1"
        @change='check_box_change' >
        <el-checkbox v-for="item in condition.check_box_arr" :label="item.id"  :key="item.id">{{item.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="table">
      <el-table
        ref='elTable'
        empty-text="暂时没有数据"
        :data="tableData"
        class="no-border"
        highlight-current-row
        @row-click='rowClick'>
        <el-table-column
          prop="hospitalizedBedName"
          show-overflow-tooltip
          width='63px'
          label="床号">
        </el-table-column>
        <el-table-column
          prop="patient.name"
          show-overflow-tooltip
          width='90px'
          label="姓名">
          <template slot-scope="scope">
              <div v-if="scope.row.type == 1"><span class="scale"><i class="icon iconfont icon-guanlian2"></i></span>{{scope.row.patient.name}}</div>
              <div v-else-if="scope.row.type == 2"><span class="scale"><i class="icon iconfont icon-guanlian"></i></span>{{scope.row.patient.name}}</div>
              <div v-else-if="scope.row.type == 3"><span class="scale"><i class="icon iconfont icon-guanlian1"></i></span>{{scope.row.patient.name}}</div>
              <div v-else>{{scope.row.patient.name}}</div>
            </template>
        </el-table-column>
        <el-table-column
          prop="patient.sex"
          show-overflow-tooltip
          width='38px'
          label="性别">
          <template slot-scope="scope">
            {{scope.row.patient.sex | formatSex}}
          </template>
        </el-table-column>
        <el-table-column
          prop="patient.birthday"
          show-overflow-tooltip
          width='67px'
          label="年龄">
          <template slot-scope="scope">
            {{scope.row.birthday || scope.row.patient.birthday  | birthdayComputed}}
          </template>
        </el-table-column>
        <el-table-column
          prop="hospitalizedDoctorName"
          width='62px'
          show-overflow-tooltip
          label="医生">
        </el-table-column>
        <el-table-column
          prop="patient.patientOrg.inpatientNumber"
          width='95px'
          show-overflow-tooltip
          v-if='width === "lang"'
          label="住院号">
          <template></template>
        </el-table-column>
        <el-table-column
          prop="diagnosisName"
          width='180px'
          show-overflow-tooltip
          v-if='width === "lang"'
          label="诊断">
        </el-table-column>
        <el-table-column
          prop="providerName"
          width='113px'
          show-overflow-tooltip
          v-if='width === "lang"'
          label="所属科室">
        </el-table-column>
        <el-table-column
          prop="hospitalizedTime"
          width='90px'
          show-overflow-tooltip
          v-if='width === "lang"'
          label="入院时间">
          <template slot-scope="scope">
            {{scope.row.hospitalizedTime | formatDateByExp("YYYY-MM-DD")}}
          </template>
        </el-table-column>
        <el-table-column
          prop="patient.mobile"
          width='104px'
          show-overflow-tooltip
          v-if='width === "lang"'
          label="联系方式">
        </el-table-column>
        <!-- <el-table-column
          prop="status"
          width='195px'
          show-overflow-tooltip
          v-if='width === "lang"'
          label="患者状态">
        </el-table-column> -->
      </el-table>
    </div>
    <el-pagination
      background
      small
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      class="pagination"
      :page-size='20'
      :total="totalCount">
    </el-pagination>
    <div class="showBar" ref='showBar' @click='telescopic("close")' @mousedown='mousedown($event,"showBar")' >患者列表</div>
</div>
</template>

<script>
  import api from '../store/resident'
  import storage from '@/util/storage.js'
  import {domClickHandle} from '@/util/common'
  import mousemove from '@/util/mousemove'
  export default {
    props: ['from'],
    mixins: [mousemove],
    data () {
      return {
        width: 'close', // 默认关闭
        condition: {
          message: '',
          check_box: ['currentDoc'],
          check_box_arr: [
            {
              name: '我的患者',
              id: 'currentDoc'
            },
            {
              name: '科室患者',
              id: 'currentProvider'
            },
            {
              name: '所有患者',
              id: 'all'
            }
          ],
          condition: 'inHos',
          condition_option: [
            {
              id: 'inHos',
              label: '在院患者'
            },
            {
              id: 'waittingInhos',
              label: '待入科患者'
            },
            {
              id: 'waittingOutHos',
              label: '待出科患者'
            },
            {
              id: 'notArchive',
              label: '未归档患者'
            },
            {
              id: 'isArchive',
              label: '已归档患者'
            },
            {
              id: 'cancelEntrance',
              label: '退科患者'
            }
          ]
        },
        tableData: [],
        totalCount: 0,
        offset: 0,
        areaId: ''
      }
    },
    created () {
      domClickHandle('telescopic', _ => {
        this.width = 'close'
      })
    },
    mounted () {
      document.ondragover = function (e) { e.preventDefault() }
      if (this.from.indexOf('birth') > -1) {
        this.areaId = storage.getSessionStorage('birthSpaceId')
      } else {
        this.areaId = storage.getSessionStorage('spaceId')
      }
      this.get_list()
      this.mousedownInit('showBar')
    },
    methods: {
      handleCurrentChange (val) {
        this.offset = (val - 1) * 20
        this.get_list()
      },
      check_box_change () {
        if (this.condition.check_box.length > 1) {
          this.condition.check_box.shift()
        }
        this.get_list()
      },
      rowClick (row, column, event) {
        if (this.$bus._events['docs:save']) {
          this.$bus.$emit('docs:save', this.changePatient.bind(this, row), row.patientId)
        } else {
          this.changePatient(row)
        }
      },
      async get_list () {
        this.tableData = []
        let obj = {
          offset: this.offset,
          pagesize: 20,
          patientMsg: this.condition.message,
          condition: this.condition.condition,
          doctorType: this.env() === 'h' ? 2 : 1,     // 1医生   2护士
          areaId: this.areaId, // String 必填 病区id(待定)
          hospitalizedAreaId: this.areaId
        }
        if (this.$route.path.indexOf('resident') > -1) {
          obj.rangeOfPatients = this.condition.check_box.join('')
        }
        if (!obj.areaId) return
        let result = {}
        if (this.from.indexOf('birth') > -1) {
          result = await api.getObstetricPatientList(obj).catch(_ => {})
        } else {
          result = await api.getHosPatientListByCondition(obj).catch(_ => {})
        }
        if (!result) return
        let arr = []
        result.data = result.data || []
        for (let i = 0; i < result.data.length; i++) {
          result.data[i].patient = result.data[i].patient || {} // 处理脏数据没有患者信息
          if (result.data[i].child.length === 0) {
            arr.push(result.data[i])
          } else {
            // type 来区分名字左侧的图标
            result.data[i].type = 1 // 名字左边起始态
            arr.push(result.data[i])
            for (let j = 0; j < result.data[i].child.length; j++) {
              // 拼凑和大人一样的字段
              let obj = {
                patient: {
                  name: result.data[i].child[j].patientName,
                  sex: result.data[i].child[j].sex,
                  age: result.data[i].child[j].age,
                  inpatientNumber: result.data[i].child[j].patientNumber,
                  patientId: result.data[i].child[j].patientId,
                  hospitalizedNumber: result.data[i].child[j].hospitalizedNumber,
                  isChild: 1,
                  hosStatus: result.data[i].child[j].hosStatus, // 11
                  hosStatusFlag: result.data[i].child[j].hosStatusFlag,
                  areaId: result.data[i].child[j].hospitalizedAreaId,
                  providerId: result.data[i].child[j].providerId
                }
              }
              obj = Object.assign(obj, result.data[i].child[j])
              if ((j + 1) === result.data[i].child.length) {
                obj.type = 3 // 名字左边末态
              } else {
                obj.type = 2 // 名字左边中间态
              }
              arr.push(obj)
            }
          }
        }
        this.tableData = arr
        this.totalCount = result.totalCount
        if (!this.$route.query.patientId) {
          this.width = 'short'
        }
      },
      changePatient (data) {
        let query = {
          patientId: data.patientId,
          hospitalizedNumber: data.hospitalizedNumber,
          providerId: data.providerId,
          areaId: data.hospitalizedAreaId,
          dptId: data.providerId,
          hosStatus: data.hosStatus, // 11
          hosStatusFlag: data.hosStatusFlag// 0
        }
        query.neonateInBed = data.neonateInBed
        if (data.patient && data.patient.isChild === 1) { // 判断是孩子还是大人
          query.isChild = 1
        } else {
          query.visitNumber = data.visitNumber
        }
        let obj = {
          path: this.$route.path,
          query: query
        }
        if (this.$route.params.dataId) {
          if (this.$route.path.indexOf('resident') === -1) {
            obj.path = `/inpatient/patientmgt/docs/${this.$route.params.id}/-1`
          } else {
            obj.path = `/resident/patientmgt/docs/${this.$route.params.id}/-1`
          }
        }
        this.$router.push(obj)
        this.width = 'close'
      },
      telescopic (type) {
        if (this.moved) return
        this.width = this.width === 'close' ? 'short' : type
      },
      env () { // h--护士   y--医生
        return this.$route.path.indexOf('resident') > -1 ? 'ys' : 'hs'
      }
    }
  }
</script>
<style lang='scss'>
  .scroll {
    max-height: calc(100vh - 230px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      z-index: 11;
      width: 6px;
    }
    &::-webkit-scrollbar:horizontal {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      width: 6px;
      background: #b4bccc;
    }
    &::-webkit-scrollbar-corner {
        background: #fff;
    }
    &::-webkit-scrollbar-track {
      background: #fff;
    }
    &::-webkit-scrollbar-track-piece {
      background: #fff;
      width: 6px;
    }
  }
  .short{
    width: 320px;
    left:0;
    box-shadow: 10px 0px 10px rgba(0,0,0,.05);
    .el-table{
      height: calc( 100vh - 280px)!important;
    }
  }
  .close{
     width: 320px;
     left:-320px;
  }
  .lang{
    width: 902px;
    left:0;
    box-shadow: 10px 0px 10px rgba(0,0,0,.05);
    .condition{
      .input{
        margin-right: 10px;
      }
    }
     .el-table{
      height: calc( 100vh - 200px)!important;
      }
  }
  #telescopic{
    box-sizing:border-box;
    height: 100%;
    background: #fff;
    position: fixed;
    top:0;
    z-index:100;
    transition: all ease-out .4s;
    padding-top:50px;
    .el-checkbox-group{
      margin-top:8px;
      margin-bottom:8px;
      float: left;
      width: 320px;
      .el-checkbox {
        margin-right: 0!important;
      }
    }
    .el-table th, .el-table td {
        padding: 0 !important;
        height: 28px;
    }
    .el-tabs__header{
      padding-left: 10px;
    }
    .el-checkbox{
      width: 30%;
    }
    .el-checkbox__label{
      padding-left: 2px;
    }
    .el-checkbox + .el-checkbox {
        margin-left: 5px;
    }
    .el-table--scrollable-x .el-table__body-wrapper {
        overflow-x: hidden;
    }
    .el-table{
      overflow-y: scroll;
      border:none;
      font-size:14px;
      &::-webkit-scrollbar{
            width: 2px;
            background-color: #fff;
        }
      .cell, th > div, th div{
        padding-right:0;
        padding-left:5px;
      }
      .scale{
        display: inline-block;
        font-size: 12px;
        transform: scaleX(.6) scaleY(.6);
      }
    }
    .title{
      font-size: 16px;
      color: #000;
      line-height: 45px;
      padding:0 10px;
      .icon{
        float: right;
        padding: 14px 0 14px 14px;
        cursor: pointer;
      }
      .el-icon-d-arrow-right:before,.el-icon-d-arrow-left:before{
        color: #1C7BEF;
        font-weight: 900;
      }
    }
    .condition{
      padding:0 10px;
      .input{
        float: left;
        width:300px;
        margin-bottom: 10px;
      }
    }
    .pagination{
      width:300px;
      position: absolute;
      bottom: 10px;
      left:0;
      text-align: right;
    }
    .showBar{
      position: absolute;
      right:-30px;
      cursor: pointer;
      top:100px;
      width: 20px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      text-align: center;
      background: #1C7BEF;
      color: #fff;
      font-size: 14px;
      padding:10px 5px;
    }
  }
</style>
