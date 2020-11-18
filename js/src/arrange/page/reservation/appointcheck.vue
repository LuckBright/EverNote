<template>
  <div id="inspect">
    <div class="layout_box inspect">
      <div class="layout_inner">
        <h4>查询患者</h4>
        <el-form :model="queryObj" :inline="true" ref="queryObj" class="triageForm">
          <el-form-item label-width="0px" prop="patient.name">
            <ever-patient-select
              v-if="show"
              v-model="queryObj.patient.name"
              @select="selectPatient"
              :allow-create="true"
              @newuser="resetPatient"
            ></ever-patient-select>
          </el-form-item>
          <el-form-item label-width="20px" prop="date">
            <el-date-picker v-model="queryObj.date" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label-width="20px" prop="date">
            <el-button @click="query">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="wrapper">
          <el-table
            v-loading.body="loading"
            :show-header="true"
            highlight-current-row
            @current-change="handleCurrentChange"
            :data="tabData"
            border
            style="width:100%"
          >
            <el-table-column prop="date" label="患者姓名"></el-table-column>
            <el-table-column prop="date" label="性别"></el-table-column>
            <el-table-column prop="date" label="出生日期"></el-table-column>
            <el-table-column prop="date" label="手机号"></el-table-column>
            <el-table-column prop="date" label="购买时间" width="260"></el-table-column>
            <el-table-column prop="date" label="套餐名称" width="260"></el-table-column>
            <el-table-column prop="date" label="体检进度">
              <template slot-scope="scope">
                <span class="cBlue">0/10</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="报告状态" width="100">
              <template slot-scope="scope">待审核</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="layout_box inspect_bot">
      <div class="layout_inner">
        <h4>预约体检</h4>
        <el-form :model="obj" :inline="true" ref="queryObj" class="triageForm">
          <el-form-item label-width="0px" prop="date">
            <el-date-picker v-model="obj.date" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-time-select
              placeholder="起始时间"
              v-model="obj.time"
              :picker-options="{
                      start: '08:30',
                      step: '00:15',
                      end: '18:30'
                    }"
            ></el-time-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="save">保存</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-table
            v-loading.body="loading"
            :show-header="true"
            :data="tabData"
            border
            style="width:100%"
          >
            <el-table-column prop="date" label="科室"></el-table-column>
            <el-table-column prop="date" label="医生">
              <template slot-scope="scope">
                <span class="cBlue">0/10</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="服务"></el-table-column>
            <el-table-column prop="date" label="状态"></el-table-column>
            <el-table-column prop label="日期" width="260">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.date" type="date" placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop label="时间">
              <template slot-scope="scope">
                <el-time-select
                  v-model="scope.row.time"
                  :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                  placeholder="选择时间"
                ></el-time-select>
              </template>
            </el-table-column>
          </el-table>
          <div class="final">
            *已完成:
            <span>超声,</span>
            无需预约:
            <span>身高检测</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import sourcedetailapi from '@/arrange/store/sourcedetailapi'
import list from '@/util/list'
import sourceapi from '@/arrange/store/sourceapi'
export default {
  mixins: [list],
  data () {
    return {
      sourceapi,
      sourcedetailapi,
      show: true,
      loading: true,
      deptList: [],
      queryObj: {
        date: '',
        patient: {
          agebirthday: '',
          name: '',
          sex: '',
          birthday: '',
          age: '',
          mobile: ''
        }
      },
      obj: {},
      currentRow: {},
      tabData: [{
        id: '1',
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        time: '8:30'
      }, {
        id: '12',
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        time: '8:30'
      },
      {
        id: '12',
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        time: '8:30'
      },
      {
        id: '12',
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        time: '7:30'
      }
      ]
    }
  },
  created () {
  },
  methods: {
    save () {
      console.log(6)
    },
    appoint () {
      console.log(9)
    },
    handleCurrentChange (val) {
      console.log(val)
      this.currentRow = val
    },
    getArrangeResource (params) {
      this.sourceapi.getArrangeResource(params).then(rs => {
        if (rs && rs.data) {
          rs.data = rs.data.map((v, i) => {
            let obj = {
              id: v.resourceId,
              name: v.resourceName
            }
            return obj
          })
          this.$ever.getFieldFromSchema(this.schema, 'patientId').options = rs.data
        }
      })
    },
    selectPatient (val) {
      console.log(val, '患者')
      this.queryObj.patient = val
      this.queryObj.patientId = val.id
      if (val && val.id) {
      }
    },
    resetPatient () {
      this.queryObj.patient = {
        agebirthday: '',
        name: '',
        sex: '',
        birthday: '',
        age: '',
        mobile: ''
      }
    }
  },
  components: {
  }
}
</script>
<style scoped>
.inspect {
  margin-top: 10px;
}
.cBlue {
  color: #1c7bef;
}
.inspect .wrapper {
  height: 200px;
  overflow: auto;
}
.inspect_bot {
  margin-top: 10px;
}
#inspect h4 {
  margin: 0px 0px 10px 0px;
  border-left: 3px solid #1c7bef;
  padding-left: 4px;
}
.lh40 {
  line-height: 40px;
}
.final {
  font-size: 12px;
  color: #666666;
}
</style>

