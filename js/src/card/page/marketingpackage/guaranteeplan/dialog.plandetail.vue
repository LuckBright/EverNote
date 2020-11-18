<template>
  <el-dialog
    title="任务设置"
    width="700px"
    :visible.sync="dialogVisible"
    class="ui_dialog_02"
    :close-on-click-modal="true"
    left
  >
    <ever-form2
      :schema="schema"
      v-model="obj"
      :span="24"
      :api="api"
      :rules="rules"
      :info="true"
      ref="planform"
    >
      <div slot="default"></div>
      <template slot="exeType">
        {{ obj.exeType }}
      </template>
      <template slot="executeMethod">
        <el-radio
          v-model="obj.executeMethod"
          :label="1"
          v-show="obj.category !== 3"
          :disabled="true"
          >短信</el-radio
        >
        <el-radio v-model="obj.executeMethod" :label="2" :disabled="true"
          >微信</el-radio
        >
        <div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4 }"
            :disabled="true"
            placeholder="请输入内容"
            v-model="obj.executeJson"
          >
          </el-input>
        </div>
      </template>
      <template slot="executeExtendJson">
        <div>
          {{ obj.templateName }}-
          <span v-if="doctorAdviceList.length">
            <span
              v-for="(item, index) in doctorAdviceList"
              :key="item.serviceId"
              >{{ item.serviceName }}
              <span v-show="index !== doctorAdviceList.length - 1">，</span>
            </span>
          </span>
          <span v-else>暂无</span>
        </div>
        <el-dialog
          title="详情"
          append-to-body
          :visible.sync="visible"
          width="50%"
        >
        </el-dialog>
      </template>
      <template slot="type">
        <el-radio v-model="radio" label="1" :disabled="true">短视频</el-radio>
        <div>
          <el-tag class="mr" v-if="videoObj && videoObj.url" @click="openVideo()">{{videoObj.name}}</el-tag>
        </div>
      </template>
      <template slot="plantype">
        <div>
          <el-checkbox v-model="obj.isLoop" :disabled="true"
            >周期内循环执行</el-checkbox
          >
          <div class="inline" v-show="obj.isLoop">
            任务周期<span class="wid40">{{ obj.periodDay || '--' }}</span
            >天 每隔<span class="wid40">{{
              obj.periodFrequency ? obj.periodFrequency.day : '--'
            }}</span
            >天
            <span class="wid40">{{
              obj.periodFrequency ? obj.periodFrequency.hour : '--'
            }}</span
            >时
            <span class="wid40">{{
              obj.periodFrequency ? obj.periodFrequency.minute : '--'
            }}</span
            >分 启动
          </div>
        </div>
      </template>
      <template slot="status">
        {{ EXECUTESTATUS[obj.executeStatus] }}
      </template>
      <template slot="doplantime">
        <div v-for="item in obj.exeInstances" :key="item.id">
          {{ item.executeTime }}
          <span class="ml10">{{ EXECUTESTATUS[item.executeStatus] }}</span>
        </div>
      </template>
    </ever-form2>
  </el-dialog>
</template>

<script>
import api from '@/card/store/guaranteeplan/api.js'
import { EXECUTESTATUS } from '@/card/util/cardcommon.js'
let schema = [
  {
    name: 'exeType',
    label: '任务类型',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '子任务名称',
    props: {
      disabled: true
    }
  },
  {
    name: 'executeMethod',
    label: '发送通道',
    comp: 'custom'
  },
  {
    name: 'plantype',
    label: '任务执行',
    comp: 'custom'
  },
  {
    name: 'status',
    label: '执行状态',
    comp: 'custom'
  },
  {
    name: 'executeTime',
    label: '启动任务时间',
    comp: 'readonlyitem',
  },
  {
    name: 'doplantime',
    label: '执行任务时间',
    comp: 'custom',
  }
]
let schema2 = [
  {
    name: 'exeType',
    label: '任务类型',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '子任务名称',
    props: {
      disabled: true
    }
  },
  {
    label: '医嘱内容',
    name: 'executeExtendJson',
    comp: 'custom'
  },
  {
    name: 'plantype',
    label: '任务执行',
    comp: 'custom'
  },
  {
    name: 'status',
    label: '执行状态',
    comp: 'custom'
  },
  {
    name: 'executeTime',
    label: '启动任务时间',
    comp: 'readonlyitem',
  },
  {
    name: 'doplantime',
    label: '执行任务时间',
    comp: 'custom',
  }
]
let schema3 = [
  {
    name: 'exeType',
    label: '任务类型',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '子任务名称',
    props: {
      disabled: true
    }
  },
  {
    name: 'type',
    label: '内容类型',
    comp: 'custom'
  },
  {
    name: 'executeMethod',
    label: '发送通道',
    comp: 'custom'
  },
  {
    name: 'executeJson',
    comp: 'custom'
  },
  {
    name: 'plantype',
    label: '任务执行',
    comp: 'custom'
  },
  {
    name: 'status',
    label: '执行状态',
    comp: 'custom'
  },
  {
    name: 'executeTime',
    label: '启动任务时间',
    comp: 'readonlyitem',
  },
  {
    name: 'doplantime',
    label: '执行任务时间',
    comp: 'custom',
  }
]
export default {
  props: {
    detailId: {
      type: String,
      default: ''
    },
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.executeMethod = null
    obj.executeJson = ''
    obj.periodDay = ''
    obj.periodFrequency = {
      day: 0,
      hour: 0,
      minute: 0
    }
    return {
      api,
      obj,
      schema,
      EXECUTESTATUS,
      dialogVisible: false,
      rules: {},
      visible: false,
      doctorAdviceList: [],
      radio: '1',
      videoObj: {}
    }
  },
  methods: {
    open () {
      this.resetForm()
      if (this.detailId) this.getById()
    },
    resetForm () {
      this.obj.id = ''
      this.obj.name = ''
      this.obj.executeMethod = null
      this.obj.executeJson = ''
      this.obj.periodDay = ''
      this.obj.periodFrequency = {
        day: 0,
        hour: 0,
        minute: 0
      }
    },
    formatDoctorAdvice (data) {
      this.doctorAdviceList = []
      this.schema = schema2
      const a = JSON.parse(data.executeExtendJson)
      if (a != null && data.executeExtendJson !== '{}') {
        data.templateName = a.templateName
        const arr = JSON.parse(a.content)
        if (Array.isArray(arr)) {
          arr.map(item => {
            item.adviceFeesDtoList.map(a => {
              this.doctorAdviceList.push(a)
            })
          })
        }
      } else {
        data.templateName = ''
      }
    },
    formatVideo (data) {
      this.schema = schema3
      this.videoObj = JSON.parse(data.executeExtendJson)
    },
    formatContent (data) {
      this.schema = schema
    },
    openVideo () {
      window.open(this.videoObj.url)
    },
    getById () {
      api.getInstance({
        id: this.detailId
      }).then(rs => {
        if (rs.head.errCode === 0) {
          if (rs.data.category === 2) {
            this.formatDoctorAdvice(rs.data)
            rs.data.exeType = '医嘱'
          }
          if (rs.data.category === 3) {
            this.formatVideo(rs.data)
            rs.data.exeType = '患教'
          }
          if (rs.data.category === 1) {
            this.formatContent(rs.data)
            rs.data.exeType = '通知'
          }
          this.obj = { ...rs.data }
        }
        this.dialogVisible = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wid40 {
  width: 60px;
}
.mr {
  margin: 5px;
  cursor: pointer;
}
.inline {
  display: inline-block;
}
</style>
