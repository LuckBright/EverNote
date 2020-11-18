<template>
  <div id="schedulingform">
    <history
      class="mb20"
      :template="template"
      :organ="organ"
      :value="value"
      :add="add"
      @apply="setApply"
    ></history>
    <el-form label-width="80px" label-position="right" :model="form" v-if="template" ref="form">
      <el-row>
        <el-col :span="24" class="pdr20 mrb20 line">
          <el-form-item label="日期" prop="date" :rules="rules.required">
            <el-date-picker
              v-model="form.date"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pdr10">
          <el-form-item label="科室" prop="dept" :rules="rules.requiredObject">
            <dept-cascader
              v-model="form.dept"
              :organ-id="params.organId"
              :template-type="template.timeTrunkType"
              style="width:100%"
            ></dept-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pdr10">
          <el-form-item label="班次" prop="timeTrunk" :rules="rules.requiredObject">
            <el-select
              v-model="form.timeTrunk"
              placeholder="请选择"
              value-key="timeTrunkId"
              class="wb100"
            >
              <el-option
                v-for="(item, i) in workList"
                :label="item.timeTrunkName"
                :value="item"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="pdr10 mrb20 line">
          <el-form-item
            :label="template.resourceType.name"
            prop="resource"
            :rules="rules.requiredObject"
          >
            <resource
              v-model="form.resource"
              :code="template.resourceType.code"
              :dept-id="params1.deptId"
              :organ-id="organ.organId"
              class="wb100"
            ></resource>
          </el-form-item>
        </el-col>
        <template v-if="template.templetResourceTypeList">
          <el-col
            :span="12"
            class="pdr10 mrb20 line"
            v-for="(item, i) in template.templetResourceTypeList"
            :key="i"
          >
            <el-form-item :label="item.resourceType.name">
              <resource
                v-model="form.resourceArrangeResourceList[i]"
                :code="item.resourceType.code"
                :dept-id="params1.deptId"
                :organ-id="organ.organId"
                class="wb100"
              ></resource>
            </el-form-item>
          </el-col>
        </template>
        <el-col
          :span="12"
          class="pdr10 mrb20 line"
          v-if="!template.templetResourceTypeList || !template.templetResourceTypeList[0] || template.templetResourceTypeList.length % 2 === 0"
        >
          <el-form-item>&nbsp;&nbsp;</el-form-item>
        </el-col>
        <el-col :span="24" class="pdr10">
          <el-form-item label="服务" prop="resourceArrangeServiceList" :rules="rules.requiredArray">
            <el-select
              v-model="form.resourceArrangeServiceList"
              multiple
              placeholder="请选择服务"
              value-key="serviceId"
              class="wb100"
            >
              <el-option
                v-for="(item, i) in serviceList"
                :label="item.serviceName"
                :value="item"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mrb20 line">
          <template v-if="form.timeTrunk">
            <template v-for="(time, k) in form.timeTrunk.trunkTimeRanges">
              <div
                class="mb20 timeline"
                style="padding-left:40px;"
                :key="k"
              >班次时段：{{time.startTime}} - {{time.endTime}}</div>
              <el-row
                v-for="(item, i) in form.timeRangeList[k].resourceArrangeTimeRangeList"
                :key="i"
                style="padding-left:10px;"
              >
                <el-col :span="5" class="pdr10">
                  <el-form-item label-width="0">
                    <el-time-select
                      v-model="item.startTime"
                      placeholder="开始时间"
                      value-format="HH:mm"
                      :picker-options="{
                        start: '00:00',
                        step: '00:10',
                        end: '23:50',
                        minTime: getMinTime(item.startTime)
                      }"
                      style="width:100%"
                    ></el-time-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="pdr10">
                  <el-form-item label-width="0">
                    <el-time-select
                      v-model="item.endTime"
                      placeholder="结束时间"
                      value-format="HH:mm"
                      :picker-options="{
                        start: '00:00',
                        step: '00:10',
                        end: '24:00',
                        minTime: item.startTime,
                        maxTime: getMaxTime(item.endTime)
                      }"
                      style="width:100%"
                    ></el-time-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="pdr10">
                  <el-form-item label-width="0">
                    <el-select v-model="item.arrangeType" placeholder="请选择" class="wb100">
                      <el-option :value="1" label="按时长"></el-option>
                      <el-option :value="2" label="按数量"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="pdr10" v-if="item.arrangeType === 1">
                  <el-form-item label-width="0">
                    <el-input
                      class="numIpt"
                      v-model="item.serviceTimeSlice"
                      placeholder="时间"
                      :controls="false"
                      onkeypress="return (event.keyCode=46 ||(event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))"
                      :min="null"
                    >
                      <span slot="append">分</span>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4" class="pdr10" v-if="item.arrangeType === 1">
                  <el-form-item label-width="0">
                    <el-input
                      class="numIpt"
                      v-model="item.sliceVolume"
                      placeholder="容量"
                      :controls="false"
                      onkeypress="return ((event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))"
                      :min="null"
                    >
                      <span slot="append">人</span>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="pdr10" v-if="item.arrangeType === 2">
                  <el-form-item label-width="0">
                    <el-input
                      class="numIpt"
                      v-model="item.totalVolume"
                      placeholder="容量"
                      :controls="false"
                      onkeypress="return ((event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))"
                      :min="null"
                    >
                      <span slot="append">人</span>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2" align="center">
                  <el-form-item label-width="0">
                    <i class="iconfont icon-delete" v-if="i > 0" @click="delTimeRange(k, i)"></i>
                    <i class="iconfont icon-tianjia" v-if="i === 0" @click="addTimeRange(k)"></i>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" align="left">
          <el-form-item>
            <el-button
              type="primary"
              @click="submitEvent"
              v-ever-click-once="disabled"
              :disabled="disabled"
            >保存</el-button>
            <el-button type @click="resetForm">清空</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import history from '@/arrange/page/scheduling/history.vue'
import resource from '@/arrange/page/scheduling/resource.vue'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import workapi from '@/arrange/store/workapi'
import api from '@/arrange/store/schedulingapi'
import storage from '@/util/storage'
export default {
  props: ['template', 'dptItemList', 'organ', 'value', 'add', 'num'],
  data () {
    return {
      api,
      workapi,
      config: '',
      workList: [],
      serviceList: [],
      trunkTimeRanges: [],
      deptList: '',
      disabled: false,
      params: {},
      params1: {
        organId: storage.getLocalStorage('CLINICID'),
        deptId: '',
        deptType: 1,
        searchType: '',
        serviceClassification: ''
      },
      form: {
        templetId: '',
        date: '',
        dept: '',
        organDto: '',
        resource: '',
        timeTrunk: '',
        resourceArrangeServiceList: [],
        resourceArrangeResourceList: [],
        timeRangeList: []
      },
      rules: {
        required: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        requiredObject: [
          { required: true, message: '必填项', trigger: 'change', type: 'object' }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: 'change', type: 'array' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return Date.now() > time.getTime() + 24 * 60 * 60 * 1000
        }
      }
    }
  },
  watch: {
    'template' (val) {
      this.form.templetId = val.id
      this.form.resourceArrangeResourceList = []
      if (val.templetResourceTypeList && val.templetResourceTypeList[0]) {
        val.templetResourceTypeList.map(item => {
          this.form.resourceArrangeResourceList.push('')
        })
      }
      this.params.timeTrunkType = val.timeTrunkType
      this.params1.serviceClassification = val.serviceClassfication
      this.getWorkList()
      this.getServiceList()
    },
    'organ' (val) {
      this.form.organDto = val
      this.params.organId = val.organId
      this.getWorkList()
    },
    'form.dept': {
      handler (val) {
        if (val) {
          this.params.deptIds = [val.id]
          this.getWorkList()
          this.params1.deptId = val.id
          this.params1.deptType = 1
          this.getServiceList()
          this.$bus.$emit('deptIdPass', val)
        } else {
          this.serviceList = []
        }
      },
      deep: true
    },
    'form.timeTrunk': {
      handler (val) {
        if (this.value.timeRangeList) {
          return false
        }
        if (!val) {
          this.form.timeRangeList = []
          return false
        }
        let data = []
        val.trunkTimeRanges.map(item => {
          item.startTime = item.startTime.substr(0, 5)
          item.endTime = item.endTime.substr(0, 5)
          data.push({ timeTrunkTimerangeId: item.id, resourceArrangeTimeRangeList: [{ startTime: '', endTime: '', arrangeType: 1, limitedQuantity: '', serviceTimeSlice: '', sliceVolume: '', totalVolume: '' }] })
          return item
        })
        this.form.timeRangeList = data
      },
      deep: true
    },
    'num': {
      handler (val) {
      }
    },
    'value.id': {
      handler (val) {
        if (!val) {
          return false
        }
        let _trunkTimeRanges = []
        let data = []
        this.workapi.list(this.params).then(rs => {
          if (rs.head.errCode) {
            return false
          }
          rs.data.resultList.map(item => {
            data.push({ timeTrunkId: item.id, timeTrunkName: item.name, trunkTimeRanges: item.timeTrunkTimeRanges })
          })
          _trunkTimeRanges = data.filter(item => {
            return item.timeTrunkId === this.value.timeTrunkId
          })[0].trunkTimeRanges
          _trunkTimeRanges.map(item => {
            item.startTime = item.startTime.substr(0, 5)
            item.endTime = item.endTime.substr(0, 5)
            return item
          })
          this.$set(this.form.timeTrunk, 'trunkTimeRanges', _trunkTimeRanges)
        })
        this.form.dept = {id: this.value.deptId, name: this.value.deptName, deptId: this.value.deptId, deptName: this.value.deptName}
        this.params1.deptType = '1'
        this.getServiceList()
        this.form = {
          templetId: this.value.templetId,
          dept: { id: this.value.deptId, name: this.value.deptName, deptName: this.value.deptName, deptId: this.value.deptId },
          organDto: this.organ,
          resource: { resourceId: this.value.resourceId, resourceName: this.value.resourceName },
          timeTrunk: { timeTrunkId: this.value.timeTrunkId, timeTrunkName: this.value.timeTrunkName },
          resourceArrangeServiceList: this.value.resourceArrangeServiceList,
          resourceArrangeResourceList: this.value.resourceArrangeResourceList || [],
          timeRangeList: this.value.timeRangeList
        }
        if (this.num) {
          delete this.form.id
          this.$set(this.form, 'date', '')
        } else {
          this.form.id = this.value.id
          this.$set(this.form, 'date', this.$moment(this.value.date).format('YYYY-MM-DD'))
        }
      },
      deep: true
    },
    'add': {
      handler (val) {
        this.resetForm()
        this.form.date = val.date
        this.form.dept = { deptId: val.resource.deptId, deptName: val.resource.deptName, id: val.resource.deptId, name: val.resource.deptName }
        this.form.resource = { resourceId: val.resource.resourceId, resourceName: val.resource.resourceName }
      },
      deep: true
    }
  },
  created () {
    this.setArrangeConfig()
  },
  methods: {
    setArrangeConfig () {
      this.api.getArrangeConfig('CHARGE_PROJECT_CHANGE_LIMIT').then(rs => {
        this.config = rs.data
      })
    },
    submitEvent () {
      this.form.resourceArrangeResourceList = this.form.resourceArrangeResourceList.filter(item => {
        return item && item !== ''
      })
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.api.updateArrange(this.form).then(rs => {
          if (rs.errCode) {
            return false
          }
          this.$notify({
            type: 'success',
            title: '操作成功',
            message: '排班已经保存成功',
            duration: 1000
          })
          this.resetForm()
          this.$refs.form.resetFields()
          this.$emit('update', true)
        })
      })
    },
    resetForm () {
      this.form = {
        templetId: this.template.id,
        date: '',
        dept: '',
        organDto: this.organ,
        resource: '',
        timeTrunk: '',
        resourceArrangeServiceList: [],
        resourceArrangeResourceList: [],
        timeRangeList: []
      }
    },
    addTimeRange (k) {
      this.form.timeRangeList[k].resourceArrangeTimeRangeList.push({ startTime: '', endTime: '', arrangeType: 1, limitedQuantity: '', serviceTimeSlice: '', sliceVolume: '', totalVolume: '' })
    },
    delTimeRange (k, i) {
      this.form.timeRangeList[k].resourceArrangeTimeRangeList.splice(i, 1)
    },
    getWorkList () {
      this.workapi.list(this.params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        let data = []
        rs.data.resultList.map(item => {
          if (item.isWork === 1) {
            data.push({ timeTrunkId: item.id, timeTrunkName: item.name, trunkTimeRanges: item.timeTrunkTimeRanges })
          }
        })
        this.workList = data
      })
    },
    getServiceList () {
      let data = []
      this.params1.searchType = this.config ? this.config.configValue : ''
      this.api.getArrangeService(this.params1).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        rs.data.map(item => {
          data.push({ serviceId: item.id + '', serviceName: item.name })
        })
        this.serviceList = data
      })
    },
    getArrange (val) {
      this.applyValue = val
    },
    getMinTime (str) {
      if (!str || str === '00:00') {
        return ''
      }
      let date = new Date('1970/1/1 ' + str)
      date.setMinutes(date.getMinutes() - 1)
      return this.$moment(date).format('HH:mm')
    },
    getMaxTime (str) {
      if (!str) {
        return ''
      }
      let date = new Date('1970/1/1 ' + str)
      date.setMinutes(date.getMinutes() + 1)
      let timeStr = this.$moment(date).format('HH:mm')
      return timeStr === '00:01' ? '24:01' : timeStr
    },
    setApply (val) {
      this.$emit('apply', val)
    }
  },
  components: {
    history,
    resource,
    deptCascader
  }
}
</script>
<style scoped>
#schedulingform {
  padding: 10px;
  background: #fff;
  height: 85vh;
}
#schedulingform .wb100 {
  width: 100%;
}
#schedulingform .pdr10 {
  padding-right: 10px;
}
#schedulingform .pdr20 {
  padding-right: 20px;
}
#schedulingform .prb20 {
  padding-bottom: 20px;
}
#schedulingform .mrl10 {
  margin-left: 10px;
}
#schedulingform .mrb20 {
  margin-bottom: 20px;
}
#schedulingform .timeline {
  padding-bottom: 20px;
  border-bottom: 1px dashed #ddd;
  font-size: 14px;
}
#schedulingform .iconfont {
  color: #999;
}
#schedulingform /deep/ .el-form-item {
  margin-bottom: 0;
  padding-bottom: 20px;
}
#schedulingform /deep/ .title {
  color: #000;
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 10px;
}
#schedulingform /deep/ .line {
  border-bottom: 1px solid #ddd;
}
#schedulingform /deep/ .mrb20 {
  margin-bottom: 20px;
}
#schedulingform /deep/ .el-date-editor--date,
#schedulingform /deep/ .el-date-editor--time {
  width: 100%;
}
#schedulingform /deep/ .el-date-editor--timerange {
  margin-top: 2px;
}
#schedulingform /deep/ .numIpt {
  width: 100%;
}
</style>
