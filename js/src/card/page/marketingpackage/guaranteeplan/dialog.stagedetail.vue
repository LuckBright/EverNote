<template>
  <el-dialog
    title="阶段设置"
    width="700px"
    :visible.sync="dialogVisible"
    class="ui_dialog_02 stage"
    :close-on-click-modal="true"
    left
  >
    <ever-form2
      :schema="schema"
      v-model="obj"
      :span="24"
      :api="api"
      :rules="rules"
      :label-width="'70px'"
      :info="true"
      ref="dptform">
      <div slot="default"></div>
      <template slot="runMethod">
          <el-radio v-model="obj.runMethod" :label="0" :disabled="true">与计划任务一起启动</el-radio>
          <el-radio v-model="obj.runMethod" :label="1" :disabled="true">动态启动</el-radio>
          <div v-if="obj.runMethod === 1">
            距离<span class="ml5 mr5">{{obj.dependTaskName}}</span>阶段后
            <span class="wid40 ml20 mr5">{{obj.dependPeriod ? obj.dependPeriod.day : ''}}</span>天
            <span class="wid40 mr5">{{obj.dependPeriod ? obj.dependPeriod.hour : ''}}</span>时
            <span class="wid40 mr5">{{obj.dependPeriod ? obj.dependPeriod.minute : ''}}</span>分
            <span class="ml20">启动</span>
          </div>
      </template>
    </ever-form2>
  </el-dialog>
</template>

<script>
import api from '@/card/store/guaranteeplan/api.js'
let schema = [
  {
    name: 'name',
    label: '阶段名称',
    props: {
      disabled: true
    }
  },
  {
    name: 'runMethod',
    label: '启动方式',
    comp: 'custom'
  }
]
export default {
  props: {
    detailId: {
      type: String,
      default: ''
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.runMethod = 0
    obj.dependTaskId = ''
    obj.dependPeriod = {
      day: 0,
      hour: 0,
      minute: 0
    }
    obj.dependTaskName = ''
    return {
      api,
      obj,
      schema,
      radio: '0',
      stageSelect: [],
      day: '',
      hour: '',
      minute: '',
      dialogVisible: false,
      rules: {}
    }
  },
  methods: {
    open () {
      this.resetForm()
      if (this.detailId) this.getInstance()
      this.dialogVisible = true
    },
    resetForm () {
      this.obj.id = ''
      this.obj.name = ''
      this.obj.runMethod = 0
      this.obj.dependTaskId = ''
      this.day = ''
      this.obj.dependPeriod = {
        day: 0,
        hour: 0,
        minute: 0
      }
    },
    getInstance () {
      api.getInstance({
        id: this.detailId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj = {...rs.data}
          this.obj.dependPeriod = rs.data.dependPeriod || {}
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wid40{width: 60px;}
.stage{
  /deep/ .el-dialog__title{
    padding-left:10px !important;
  }
  /deep/ .el-form .el-form-item__label {
    justify-content: flex-start;
    padding: 0 0 0 10px;
    color:  #999999;
  }
}
</style>
