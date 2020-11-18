<template>
  <div class='list_waiting'>
    <div class="title">
      待入科患者列表
    </div>
    <div class="condition">
      <el-input class="input" @input='get_list' v-model="message" placeholder="患者姓名／编号／住院病案号" width='200px'></el-input>
    </div>
    <div class="table">
      <el-table
        ref='elTable'
        empty-text="暂时没有数据"
        :data="tableData"
        @row-click='rowClick'
        class='no-border'
        :row-class-name="tableRowClassName ">
        <el-table-column
          prop="patientName"
          show-overflow-tooltip
          width='100px'
          label="姓名">
          <template slot-scope="scope">
            <span> {{scope.row.patientName}}</span>
            <i class="icon iconfont icon-tuike tuike" v-if='scope.row.hosStatusFlag == 4'></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="patient.sex"
          show-overflow-tooltip
          width='40px'
          label="性别">
          <template slot-scope="scope">
            <span v-if='scope.row.patient && scope.row.patient.sex'> {{scope.row.patient.sex | formatSex}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="patient.birthday"
          show-overflow-tooltip
          width='60px'
          label="年龄">
          <template slot-scope="scope">
            <span v-if='scope.row.patient && scope.row.patient.birthday'> {{scope.row.patient.birthday | birthdayComputed}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      small
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="20"
      layout="prev, pager, next"
      :total="totalCount">
    </el-pagination>
    </div>
</div>
</template>

<script>
  import api from '../store/resident.js'
  import storage from '@/util/storage.js'
  export default {
    props: ['from', 'areaId'],
    data () {
      return {
        storage,
        message: '',
        patient: '',
        tableData: [],
        currentPage: 1,
        totalCount: 0,
        dragstartArr: [],
        offset: 0,
      }
    },
    created () {
    },
    mounted () {
      this.$bus.$on('global:listwating', this.get_list)
      document.ondragover = function (e) { e.preventDefault() }
      // if (this.from.indexOf('birth') > -1) {
      //   this.areaId = storage.getSessionStorage('birthSpaceId')
      // } else {
      //   this.areaId = storage.getSessionStorage('spaceId')
      // }
      this.get_list()
    },
    methods: {
      tableRowClassName ({row, rowIndex}) {
        if (row.hosStatusFlag === 3) {
          return 'warning-row'
        }
        return ''
      },
      handleCurrentChange (val) {
        if (val > 1) {
          this.offset = val * 10
        } else {
          this.offset = 0
        }
        this.get_list()
      },
      rowClick (row, column, event) {
        console.log(row)
        console.log(column)
      },
      async get_list () {
        let obj = {
          offset: this.offset,
          pagesize: 20,
          queryCriteria: this.message,
          areaId: this.areaId // String 必填 病区id(待定)
        }
        if (obj.areaId) {
          let result = await api.getPendingSectionPatient(obj)
          if (!(result.data instanceof Array)) result.data = []
          this.tableData = result.data
          this.tableData.patient = this.tableData.patient || {}
           // this.tableData.push({'hosStatus': 1, 'patientName': '张三', 'hospitalizedAreaName': '病区1', 'hospitalizedNumber': '123123', 'patientId': 'MhbPDI8qll4a2G8V45k', 'inHosStatus': 11, 'hospitalizedAreaId': '12', 'providerId': '1', 'patient': {'birthday': '2016-01-01', 'career': '', 'newWeight': null, 'marry': null, 'pic': null, 'inpatientNumber': null, 'contact': null, 'company': '', 'outpatientNumber': '', 'patientNumber': '', 'id': 'MhbPDI8qll4a2G8V45k', 'sn': '80016786', 'origId': 4, 'pregnant': '0', 'address': '{}', 'bodyCheckNumber': null, 'hospWeight': null, 'sex': '1', 'mobile': '13241497979', 'isMonth': 32, 'telephone': '010-23336666', 'emergencyNumber': null, 'isNewborn': null, 'isDay': 984, 'phrAccountId': null, 'contactList': null, 'iden': null, 'contactMobie': null, 'name': '爱仕达', 'household': null, 'sourceName': null, 'age': 2}, 'hosStatusFlag': 0, 'providerName': '眼科'})
          this.totalCount = result.totalCount
          setTimeout(() => {
            let domArr = document.getElementById('list_waiting').getElementsByClassName('el-table__body')[0].getElementsByTagName('tr')
            for (let i = 0; i < domArr.length; i++) {
              domArr[i].setAttribute('draggable', true)
              domArr[i].removeEventListener('dragstart', this.dragstartArr[i], false)
              this.dragstartArr[i] = (ev) => {
                console.log('源对象开始被拖动')
                console.log(this.tableData[i])
                ev.dataTransfer.setData('text/plain', JSON.stringify(this.tableData[i]))
              }
              domArr[i].addEventListener('dragstart', this.dragstartArr[i], false)
            }
          })
        }
      }
    }
  }
</script>
<style lang='scss'>
.el-table .warning-row {
    background: #edf5fd;
  }
  .list_waiting{
    width: 200px;
    box-shadow: 10px 0px 10px rgba(0,0,0,.05);
    box-sizing:border-box;
    height: 100%;
    background: #fff;
    position: fixed;
    top:0;
    left:0;
    z-index:100;
    transition: all ease-out .4s;
    padding-top:50px;
    .tuike{
      position: absolute;
      top:11px;
      right:0px;
      font-size: 14px;
      z-index: 2;
      color: #1C7BEF;
      line-height: 16px;
    }
    .el-table__body-wrapper {
      height: calc(100vh - 230px);
      overflow-y: auto;
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
    .el-pagination{
      text-align: right;
    }
    .condition{
      .input{
        width: 178px!important;
        font-size: 12px;
      }
    }
    .el-checkbox-group{
      margin-top:8px;
      margin-bottom:8px;
      float: left;
      width: 320px;
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
      overflow-y: auto;
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
      font-weight: 600;
      line-height: 40px;
      padding:0 10px;
    }
    .condition{
      padding:0 10px;
      .input{
        float: left;
        width:300px;
        margin-bottom: 10px;
      }
    }
  }
</style>
