<template>
  <!-- <div class="patientList" :class="{isShowPatienList:isShow}">
    <div class="btn" @click="showPatient" :class="{isShowPatienListBtn:isShow}">患者列表</div>
    <div class="settle_body payStyle"> -->
  <slide-window
    :width="530"
    :paddingTop="90"
    :show="isShow"
    @getData="showPatient">
    <template slot="handler">
      <span style="width:1em; line-height:1.2em">患者列表</span>
    </template>
    <template slot="default">
      <div class="flex-column h100">
        <div class="main-head pl10 pr10">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            @query="query"
            class="main-form patientlist-q">
            <template slot="tradeType">
              <sys-select
                style="text-align:left;"
                v-model="queryObj.tradeType"
                type="checkbox"
                :options="tradeType"
                @change="list()"
              ></sys-select>
            </template>
            <template slot="btn">
              <div class="buttons">
                <el-button type="primary" @click="list()">查询</el-button>
                <el-button v-if="hosType!=3" @click="clearquery()">重置</el-button>
              </div>
            </template>
            <div></div>
          </ever-form2>
        </div>
          <!-- :height="hosType==3?'calc(100vh - 280px)': 'calc(100vh - 325px)'" -->
        <div class="flex1box">
          <el-table
            :data="tableData"
            style="width: 100%"
            class="no-border table-hover-blue highlight-current-row ever-table-wrap"
            @row-click="handledetail">
            <el-table-column prop="admitDeptName" show-overflow-tooltip label="科室"></el-table-column>
            <el-table-column prop="inpatientNumber" label="病案号" width="150"></el-table-column>
            <el-table-column prop="patientName" show-overflow-tooltip label="姓名"></el-table-column>
            <el-table-column v-if="hosType!=2" prop="hosStatus" label="状态">
              <template slot-scope="scope">{{scope.row.status | filstatus}}</template>
            </el-table-column>
            <el-table-column prop="admitTime" label="入院时间" width="105">
              <template slot-scope="scope">
                <div v-if="scope.row.admitTime">{{$moment(scope.row.admitTime).format('YYYY-MM-DD')}}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="hosType==2" prop="dischargeTime" label="出院时间" width="105">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.dischargeTime"
                >{{$moment(scope.row.dischargeTime).format('YYYY-MM-DD')}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <ever-pagination
          class="ptb10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount"
          :current="current"
          :small="true"
          :layout="'prev, pager, next'"
        ></ever-pagination>
      </div>
    </template>
  </slide-window>
</template>
<script>
import list from '@/util/list'
import { getPatientList } from '@/rcm/store/hospital/hospital'
const tradeType = ['3', '4', '6', '7', '8']
import SlideWindow from '@/components/slidewindow'

export default {
  components: {
    SlideWindow
  },
  mixins: [list],
  props: ['hosType'], // 1未出院，2已出院/待召回，3全部
  data () {
    let schema = [
      {
        label: '住院科室',
        name: 'providerId',
        comp: 'everSubjectSelect',
        props: {
          clearable: true,
          type: 'select',
          fields: 'id'
        },
      },
      {
        label: '病案号/卡号',
        name: 'patientMsg',
        props: {
          placeholder: '请输入姓名/病案号/卡号'
        }
      },
      {
        label: '状态',
        name: 'tradeType',
        comp: 'custom'
      },
      {
        label: '',
        name: 'btn',
        comp: 'custom',
        col: {
          style: 'text-align:center;'
        }
      }
    ]
    if (this.hosType !== 1) {
      schema.splice(2, 1)
    }
    var obj = this.$ever.createObjFromSchema(schema)
    obj.requestSwitch = true
    obj.tradeType = tradeType
    return {
      tradeType: [
        { id: 3, name: '待入科' },
        { id: 4, name: '已入科' },
        { id: 6, name: '待出科' },
        { id: 7, name: '已出科' },
        { id: 8, name: '办理出院' }
      ],
      querySchema: schema,
      queryObj: obj,
      cardloading: false,
      isShow: false,
      orderDeptOptions: [],
      show: false
    }
  },
  filters: {
    filstatus (val) {
      switch (Number(val)) {
        case 1:
          return '非正式档案'
        case 2:
          return '待入院'
        case 3:
          return '待入科'
        case 4:
          return '已入科'
        case 5:
          return '待转科'
        case 6:
          return '待出科'
        case 7:
          return '已出科'
        case 8:
          return '办理出院'
        case 9:
          return '出院已结算'
        default:
          return '错误'
      }
    }
  },
  methods: {
    clearquery () {
      this.queryObj.providerId = ''
      this.queryObj.patientMsg = ''
      this.queryObj.tradeType = tradeType
    },
    handledetail (row) {
      let chargedetail = {
        id: row.id,
        patientId: row.patientId,
        ipNo: row.hospitalizedNumber, // 住院流水号
        providerId: row.admitDeptId,
        visitNumber: row.visitNumber,
        ipStatus: row.status, // 在院状态
        patientName: row.patientName || '',
        birthday: row.birthday || '',
        sexName: row.sex === '1' ? '男' : '女'
      }
      let path = ''
      // 前面两个逻辑里的路由adt都没注册，跳转已经不正常了。toCheck （4.11.1）
      if (this.hosType === 2) {
        path = '/adt/recall'
      } else if (this.hosType === 1) {
        path = '/adt/dischargemanagement/dischargemanage'
      } else {
        chargedetail.isList = true
        path = '/adt/costlistsearch'
      }
      this.$router.push({
        path: path,
        query: chargedetail
      })
      this.$emit('getdata')
      this.showPatient()
    },
    showPatient () {
      // this.isShow = !this.isShow
      // if (this.isShow)
      this.list()
    },
    // 患者列表
    async list () {
      if (this.queryObj.tradeType.includes(0)) {
        this.queryObj.hosStatusList = tradeType
      } else {
        this.queryObj.hosStatusList = this.queryObj.tradeType
      }
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        patientMsg: this.queryObj.patientMsg,
        admitDeptId: this.queryObj.providerId
      }
      try {
        let data = ''
        if (this.hosType === 2) {
          params['statusList'] = ['9']
          data = await getPatientList(params)
        } else if (this.hosType === 1) {
          params['statusList'] = this.queryObj.hosStatusList
          data = await getPatientList(params)
        } else {
          // statusList不传，默认查所有
          let paramss = Object.assign({}, params)
          if (!paramss.patientMsg) {
            delete paramss.patientMsg
          }
          if (!paramss.providerId) {
            delete paramss.providerId
          }
          data = await getPatientList(paramss)
        }
        this.tableData = data.data && data.data.resultList
        this.totalCount = data.data && data.data.totalCount
        this.cardloading = false
      } catch (err) {
        console.log(err)
        this.cardloading = false
      }
    }
  }
}
</script>
<style scoped lang="less">
.patientlist-q {
  .el-form-item {
    width: 100%;
  }
  .el-form-item .el-form-item__label {
    width: 120px;
    height: 32px;
    line-height: 32px;
  }
  .el-form-item .el-form-item__content {
    line-height: 32px;
    width: 384px;
  }
  .el-checkbox-group {
    float: left;
    line-height: 32px;
  }
  .buttons {
    text-align: left;
  }
}
</style>

