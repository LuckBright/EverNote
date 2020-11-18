<template>
  <el-dialog
  :title="titleData.orgName +' ' + titleData.dptName + ' ' + titleData.docName"
  :visible.sync="dialogVisible"
  :show-close="false"
  class="ui_dialog_02  spe dpt">
    <ever-form2
      class="form-required-color"
      :schema="schema"
      v-model="obj"
      :span="24"
      :api="api"
      :rules="rules"
      ref="dptform">
      <div slot="default"></div>
      <template slot="classes">
        <div class="without">
          <el-radio-group v-model="timetrunkId">
            <div v-for="(val, index) in classesList" :key="index" class="radio-container ml10 mt5">
              <el-radio :label="val.id">{{val.name}}</el-radio>
            </div>
          </el-radio-group>
        </div>
      </template>
      <template slot="service">
        <div v-for="(el, elindex) in services" :key="elindex" class="mr120">
          <el-form-item :label="['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode) ? '医事服务：' : '服务能力：'">
            <el-select v-model="el.serviceId" class="wid103" v-if="['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode)">
              <el-option
                v-for="(item, index) in ruleList"
                :key="index"
                :value="item.serviceId"
                :label="item.serviceName">
              </el-option>
            </el-select>
            <el-select v-model="el.frequencyType" class="wid74">
              <el-option
                v-for="(item, index) in categoryCode === 'OUTPATIENT_SURGERY' ? [frequency[1]] : frequency"
                :key="index"
                :value="item.value"
                :label="item.label"
                :disabled="item.disabled">
              </el-option>
            </el-select>
            <span v-show="el.frequencyType === 1">
              <el-input-number class="mr5" v-model="el.frequencyAmount" :min="1" :max="1440"></el-input-number>
              <span class="c9">分钟/人</span>
            </span>
            <span v-show="el.frequencyType === 2">
              <el-input-number class="mr5" v-model="el.frequencyVolume" :min="1" :max="1440"></el-input-number>
              <span class="c9">个号</span>
            </span>
            <el-button type="text" v-if='elindex > 0' @click="delrow(elindex)"><i class="iconfont icon-delete"></i></el-button>
            <el-button type="text" v-if="['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode)" @click="addrow"><i class="iconfont icon-tianjia"></i></el-button>
          </el-form-item>
        </div>
      </template>
    </ever-form2>
    <el-row>
      <el-col :span="24" align="right">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button type="" @click="dialogVisible=false">取消</el-button>
        <el-button v-if="isEdit" type="" @click="delItem">删除</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import api from '@/arrange/store/schedulingapi'
import wapi from '@/arrange/store/workapi'
let schema = [
  {
    name: 'service',
    comp: 'custom'
  },
  {
    name: 'classes',
    label: '班次：',
    comp: 'custom'
  }
]
export default {
  props: {
    'titleData': {
      type: Object,
      default: () => {}
    },
    'isEdit': {
      type: Boolean,
      default: false
    },
    'instanceId': {
      type: String,
      default: ''
    },
    'categoryCode': {
      type: String,
      default: ''
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      obj,
      schema,
      wapi,
      classesList: [],
      ruleList: [],
      services: [
        {
          serviceId: '',
          frequencyType: null,
          frequencyAmount: null,
          frequencyVolume: null
        }
      ],
      id: '',
      timetrunkId: '',
      dialogVisible: false,
      visible: false,
      frequency: [
        {
          value: 1,
          label: '按频次',
          disabled: false
        },
        {
          value: 2,
          label: '按数量',
          disabled: false
        }
      ],
      rules: {},
      resourceType: '',
      resourceId: ''
    }
  },
  watch: {
    'dialogVisible': {
      handler (val) {
        this.services[0].frequencyType = this.categoryCode === 'OUTPATIENT_SURGERY' ? 2 : 1
      },
      deep: true
    }
  },
  methods: {
    open () {
      this.dialogVisible = true
      this.getClasslist(this.categoryCode)
      this.getByCode(this.categoryCode)
      if (['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(this.categoryCode)) {
        this.getService()
      }
      this.resetKey()
      if (this.isEdit) {
        this.getById()
      }
    },
    resetKey () {
      this.services = [
        {
          serviceId: '',
          frequencyType: 1,
          frequencyAmount: null,
          frequencyVolume: null
        }
      ]
      this.timetrunkId = ''
    },
    save () {
      let params = {
        orgId: this.titleData.orgId,
        instanceId: this.instanceId,
        tenantDeptId: this.titleData.dptId,
        arrangeTime: this.titleData.date,
        timetrunkId: this.timetrunkId,
        services: this.services,
        categoryCode: this.categoryCode,
        resourceType: this.resourceType,
        resourceId: this.titleData.doctorId
      }
      if (!this.timetrunkId) {
        this.$messageTips(this, 'warning', '请选择班次', '警告')
        return false
      }
      let flag = false
      flag = this.services.every(item => {
        if (['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(this.categoryCode)) {
          if (item.frequencyType === 1) {
            item.frequencyVolume = 1
            return item.serviceId && item.frequencyAmount
          } else if (item.frequencyType === 2) {
            return item.serviceId && item.frequencyVolume
          }
        } else {
          if (item.frequencyType === 1) {
            item.frequencyVolume = 1
            return item.frequencyAmount
          } else if (item.frequencyType === 2) {
            return item.frequencyVolume
          }
        }
      })
      if (!flag) {
        this.$messageTips(this, 'warning', '请填写完整的医事服务信息', '警告')
        return false
      }
      this.wapi.createBydpt(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.dialogVisible = false
          this.instanceId ? this.$messageTips(this, 'success', '修改排班记录成功') : this.$messageTips(this, 'success', '添加排班记录成功')
          this.$emit('update')
        }
      })
    },
    delItem (val) {
      this.$confirm('删除排班可能会影响已经预约的患者，请确认后谨慎操作', '您是否确认要删除此排班?', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.wapi.delByInstanceId({
          'id': this.instanceId
        }).then(rs => {
          if (rs.head.errCode === 0) {
            this.dialogVisible = false
            this.$emit('update')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getClasslist (val) {
      let params = {
        categoryCode: val
      }
      this.wapi.list(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.classesList = rs.data
        }
      })
    },
    getService () {
      let params = {
        'doctorId': this.titleData.doctorId,
        'tenantDeptId': this.titleData.dptId,
        'orgId': this.titleData.orgId,
        'categoryCode': this.categoryCode
      }
      this.wapi.getService(params).then(rs => {
        if (rs.head.errCode === 0) {
          if (rs.data && rs.data.length === 1) {
            this.servicesData(rs)
            this.services[0].serviceId = rs.data[0].serviceId
            this.services[0].serviceName = rs.data[0].serviceName
            this.services[0].frequencyAmount = this.services[0].frequencyType === 1 ? rs.data[0].frequencyAmount : null
            this.services[0].frequencyVolume = rs.data[0].frequencyVolume
          } else {
            this.servicesData(rs)
          }
        }
      })
    },
    servicesData (rs) {
      this.ruleList = []
      rs.data && rs.data.map(item => {
        let tempObj = {
          serviceId: '',
          serviceName: ''
        }
        tempObj.serviceId = item.serviceId
        tempObj.serviceName = item.serviceName
        this.ruleList.push(tempObj)
      })
    },
    addrow () {
      if (this.services.length < 5) {
        this.services.push({
          serviceId: '',
          frequencyType: 1,
          frequencyAmount: null,
          frequencyVolume: null
        })
      } else {
        this.$notify({
          type: 'warning',
          message: '最多选择5种服务'
        })
      }
    },
    delrow (index) {
      this.services.splice(index, 1)
    },
    getById () {
      this.wapi.getByInstanceId({'instanceId': this.instanceId}).then(rs => {
        if (rs.head.errCode === 0) {
          this.services = rs.data.services
          this.timetrunkId = rs.data.timetrunkId
        }
      })
    },
    getByCode (val) {
      wapi.getByCode({
        code: val
      }).then(rs => {
        if (rs.head.errCode === 0 && rs.data) {
          this.resourceType = rs.data.resourceType
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .dpt /deep/ .el-dialog,{
    background: #F0F5FA;
    border: 1px solid #999999;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,0.35);
    border-radius: 2px;
  }
  .dpt /deep/ .el-dialog__body {
    background: #F0F5FA;
  }
  .without{
    width:282px;
    background: #FFFFFF;
    border: 1px solid #BCC9D7;
    border-radius: 2px;
    height: 130px;
    max-height: 130px;
    overflow-y: auto;
  }
  .radio-container{height:20px;}
  .radio-container /deep/ .el-radio:last-child{
    margin-top:5px;
  }
  .wid103{width:103px;height:36px;}
  .wid74{
    width:74px;
    background: #FFFFFF;
    border-radius: 2px;
    height:32px;
  }
  .c9{
    color: #999999;
  }
  .mr120{
    margin-left: -120px;
  }
</style>

