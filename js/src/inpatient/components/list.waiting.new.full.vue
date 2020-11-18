<template>
  <div class="list_waiting_new_full flex_column_1_hidden">
    <div class="condition" @keyup.enter='search'>
      <el-input class="input" v-model="searchValue" placeholder="请输入姓名或床号" width="200px">
        <i @click="search" slot="suffix" class="el-input__icon iconfont icon-shuxuegongzuotai-cha"></i>
      </el-input>
      <span style="float:right" @click='closefull'>
        <i style="fontSize:25px" class='iconfont icon-zhedie'></i>
      </span>
    </div>
    <el-row class="title">我的患者({{list.length}})</el-row>
    <el-row>
      <ever-table
      ref='multipleTableRef'
      table-class="flex_layout_scroll patient-queue"
      :data="list"
      :columns="columns"
      :isAutoCheckRow='false'
      :isRecordUrlParams='false'
      :notSelectCheckbox='true'
      :config-option="configOption"
      >
      <template slot="patientName" slot-scope="scope">
        <el-row>
         <el-col  :span='16' class="name">
            <div  @click='rowClick(scope)'>{{scope.row.patientName}}</div>
          </el-col>
          <el-col :span='4'>
            <i v-if='scope.row.icon == "first"' class="iconfont icon-guanlian3"></i>
            <i v-else-if='scope.row.icon == "last"' class="iconfont icon-guanlian4"></i>
            <i v-else-if='scope.row.icon == "center"' class="iconfont icon-guanlian5"></i>
            &nbsp;
          </el-col>
          <el-col :span='4' v-if='scope.row.status=== 3'>
            <p class="out">出</p>
          </el-col>
        </el-row>
      </template>
      <template slot="sex" slot-scope="scope">
       <span>{{scope.row.sex | formatSex}}</span>
      </template>
      <template slot="admitPaymentMethod" slot-scope="scope">
       <sys-value type="CV07.10.005" :code="scope.row.admitPaymentMethod"></sys-value>
      </template>
      <template slot="nursinglevel" slot-scope="scope">
        <span v-if='scope.row.nursinglevel === "1"'>特级护理</span>
        <span v-else-if='scope.row.nursinglevel === "2"'>一级护理</span>
        <span v-else-if='scope.row.nursinglevel === "3"'>二级护理</span>
        <span v-else-if='scope.row.nursinglevel === "4"'>三级护理</span>
        <span v-else>--</span>
      </template>
    </ever-table>
    </el-row>
    <el-row class="title">科室患者({{list2.length}})</el-row>
    <el-row>
      <ever-table
      ref='multipleTableRef'
      table-class="flex_layout_scroll patient-queue"
      :data="list2"
      :columns="columns"
      :isAutoCheckRow='false'
      :isRecordUrlParams='false'
      :notSelectCheckbox='true'
      :config-option="configOption"
      >
      <template slot="patientName" slot-scope="scope">
        <el-row>
          <el-col  :span='16' class="name">
            <div  @click='rowClick(scope)'> {{scope.row.patientName}}</div>
          </el-col>
          <el-col :span='4'>
            <i v-if='scope.row.icon == "first"' class="iconfont icon-guanlian3"></i>
            <i v-else-if='scope.row.icon == "last"' class="iconfont icon-guanlian4"></i>
            <i v-else-if='scope.row.icon == "center"' class="iconfont icon-guanlian5"></i>
            &nbsp;
          </el-col>
          <el-col :span='4' v-if='scope.row.status == "3"'>
            <p class="out">出</p>
          </el-col>
        </el-row>
      </template>
      <template slot="sex" slot-scope="scope">
       <span>{{scope.row.sex | formatSex}}</span>
      </template>
      <template slot="admitPaymentMethod" slot-scope="scope">
       <sys-value type="CV07.10.005" :code="scope.row.admitPaymentMethod"></sys-value>
      </template>
      <template slot="nursinglevel" slot-scope="scope">
        <span v-if='scope.row.nursinglevel === "1"'>特级护理</span>
        <span v-else-if='scope.row.nursinglevel === "2"'>一级护理</span>
        <span v-else-if='scope.row.nursinglevel === "3"'>二级护理</span>
        <span v-else-if='scope.row.nursinglevel === "4"'>三级护理</span>
        <span v-else>--</span>
      </template>
    </ever-table>
    </el-row>
  </div>
</template>
<script>
import onstorage from '@/inpatient/util/onstorage.js'
import socket from '@/inpatient/util/socket.js'
import api from '../store/hospitalleftlistapi'
import { HOSPITAL_RESIDENT_FULL } from '@/util/table-config'
import { isJsonString } from '@/util/common'
// 搜索优化、定位、多选
export default {
  mixins: [socket, onstorage],
  props: {
    'titleArr': Array,
    'providerId': String,
    'isCancel': Boolean,
    'isClickClass': {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      columns: [
        {
          prop: 'bedName',
          label: '床号',
        }, {
          slot: 'patientName',
          prop: 'patientName',
          label: '患者信息',
        }, {
          slot: 'sex',
          prop: 'sex',
          label: '性别',
        }, {
          prop: 'birthday',
          label: '出生日期',
        }, {
          prop: 'ageShowText',
          label: '年龄',
        }, {
          prop: 'hospitalDay',
          label: '入科天数',
        }, {
          prop: 'hospitalTime',
          label: '入科时间',
        }, {
          prop: 'diagnosisArray',
          label: '入院诊断',
        }, {
          prop: 'admitDoctorName',
          label: '住院医生',
        }, {
          prop: 'primaryNurseName',
          label: '责任护士',
        }, {
          slot: 'nursinglevel',
          prop: 'nursinglevel',
          label: '护理等级',
        }, {
          slot: 'admitPaymentMethod',
          prop: 'admitPaymentMethod',
          label: '支付方式',
        }, {
          prop: 'areaName',
          label: '所在病区',
        }
      ],
      configOption: {id: HOSPITAL_RESIDENT_FULL},
      searchValue: '',
      list: [],
      listLength: 0,
      list2: [],
      list2Length: 0
    }
  },
  created () {
    this.space = this.$route.matched[0].meta.space || 'inpatient'
  },
  mounted () {
    this.search()
  },
  methods: {
    closefull () {
      this.$emit('closefull', false)
    },
    rowClick ({row}) {
      this.$emit('closefull', false)
      this.$emit('waitingdbclick', row)
    },
    search () {
      this.getDoctorInpatientList()
      this.getProviderInpatientList()
    },
    async getDoctorInpatientList () {
      let res = await api.getListInfo('getDoctorInpatientList', {
        search: this.searchValue,
        providerId: this.providerId
      })
      if (res.head.errCode === 0) {
        let list = res.data
        this.list = this.export(list)
        this.listLength = list.length
      }
    },
    async getProviderInpatientList () {
      let res = await api.getListInfo('getProviderInpatientList', {
        providerId: this.providerId,
        search: this.searchValue
      })
      if (res.head.errCode === 0) {
        let list = res.data
        let arr = []
        list.forEach(ele => {
          arr = arr.concat(ele.inPatientMsgs)
        })
        this.list2 = this.export(arr)
        this.list2Length = arr.length
      }
    },
    export (list) {
      let arr = []
      list.forEach(element => {
        arr.push(element)
        if (element.neonateList && element.neonateList.length > 0) {
          element.icon = 'first'
          element.neonateList.forEach((neno, index) => {
            neno.bedName = element.bedName
            neno.areaName = element.areaName
            neno.icon = index === element.neonateList.length - 1 ? 'last' : 'center'
            arr.push(neno)
          })
        }
      })
      arr.forEach(element => {
        element.hospitalDay = this.day(element.hospitalTime)
        if (element.hospitalTime)element.hospitalTime = this.$moment(element.hospitalTime).format('YYYY-MM-DD HH:mm')
        element.birthday = element.birthday || element.birth
        element.birthday = element.birthday ? this.$moment(element.birthday).format('YYYY-MM-DD') : '--'
        if (element.iconList) {
          for (let item in element.iconList) {
            element[item] = element.iconList[item]
          }
        }
        if (element.diagnosisArray && !!isJsonString(element.diagnosisArray)) {
          let arr = JSON.parse(element.diagnosisArray)
          element.diagnosisArray = arr[0] && arr[0].diseaseName || '--'
        } else {
          element.diagnosisArray = '--'
        }
      })
      return arr
    },
    day (time) {
      if (time === null || time === undefined) return '--'
      time = this.$moment(time).format('YYYY-MM-DD')
      let day = Math.ceil(this.$moment().diff(time) / 3600 / 24 / 1000) - 1
      return day === 0 ? '1天' : day + '天'
    },
  },
  watch: {
    'searchValue': function (val) {
      if (!val) {
        this.getDoctorInpatientList()
        this.getProviderInpatientList()
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.list_waiting_new_full {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  background-color: #fff;
  z-index: 100;
  transition: all ease-out 0.4s;
  overflow:scroll;
  padding:10px;
  .input {
    width: 198px;
    font-size: 12px;
    /deep/ .el-input__icon{
      padding: 8px;
    }
  }
  .name{
    &:hover{
      cursor: pointer;
      color: #1c7bef;
      text-decoration: none;
    }
  }
   .out {
    width: 18px;
    font-size: 12px;
    height: 18px;
    margin: 0;
    border: 1px solid #DCDCDC;
    border-radius: 50%;
    text-align: center;
    line-height: 18px;
    background-color: #DCDCDC;
    color: #A9A9A9;
  }
  .title{
    font-size: 14px;
    line-height: 20px;
    padding-top: 10px;
  }  
}
</style>
