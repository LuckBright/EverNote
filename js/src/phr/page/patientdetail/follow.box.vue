<template>
  <div class="follow-box">
    <div class="lh30">
      <span class="follow-label-title follow-label">任务类型：</span>
      <span class="follow-label-res">{{category}}</span>
    </div>
    <div class="lh30">
      <span class="follow-label-title follow-label">执行方式：</span>
      <span class="follow-label-res">{{methodName}}</span>
    </div>
    <div class="lh30">
      <span class="follow-label-title follow-label">发送时间：</span>
      <span class="follow-label-res">{{followData.taskInst.executeTime || followData.taskInst.createTime}}</span>
    </div>
    <!--    除了问卷 都显示任务内容-->
    <template v-if="followData.taskInst.category !== 4">
      <div class="lh30">
        <span class="follow-label-title follow-label">任务内容：</span>
        <span class="follow-label-res" v-if="followData.taskInst.executeJson">{{followData.taskInst.executeJson}}</span>
        <template v-if="followData.taskInst.executeExtendJson">
          <div v-if="followData.taskInst.category === 3">
            <video height="400" controls="controls" muted
                   :preload="JSON.parse(followData.taskInst.executeExtendJson).uploadFace">
              <source :src="JSON.parse(followData.taskInst.executeExtendJson).url" type="video/mp4"/>
            </video>
          </div>
          <template v-if="followData.taskInst.category === 5">
            <div v-if="followData.taskInst.contentType === 4"><img
              v-if="JSON.parse(followData.taskInst.executeExtendJson).picture"
              :src="JSON.parse(followData.taskInst.executeExtendJson).picture" width="300"/></div>
            <span v-if="followData.taskInst.contentType === 5 && followData.taskInst.executeExtendJson">
                                {{JSON.parse(followData.taskInst.executeExtendJson).tenantDeptName}} -
                                {{JSON.parse(followData.taskInst.executeExtendJson).doctorName}} -
                                {{JSON.parse(followData.taskInst.executeExtendJson).serviceName}}
                              </span>
          </template>
        </template>
      </div>
    </template>
    <template v-if="followData.taskInst.category === 4">
      <!--      展示问卷-->
      <iframe
        v-if="followData.taskInst.executeExtendJson"
        :src="getSurveyUrl(followData.taskInst.executeExtendJson)"
        width="100%"
        height="100%"
        frameborder="0"
        class="phr-survey-iframe"
      ></iframe>
    </template>
    <template v-if="followData.taskInst.loop">
      <div class="lh30">
        <span class="follow-label-title follow-label">是否循环：</span>
        <span class="follow-label-res">{{'是'}}</span>
      </div>
      <div class="lh30">
        <span class="follow-label-title follow-label">任务周期：</span>
        <span class="follow-label-res">{{followData.taskInst.periodDay}} 天</span>
      </div>
      <div class="lh30">
        <span class="follow-label-title follow-label">执行时间：</span>
        <span class="follow-label-res">{{periodFrequencyHour + ':' + periodFrequencyMinute}}</span>
      </div>
      <div class="lh30">
        <span class="follow-label-title follow-label">执行频次：</span>
        <span class="follow-label-res">每 {{periodFrequencyDay }} 天 / 次</span>
      </div>
      <div class="table-line">
        <div class="follow-label-title follow-label">任务执行：</div>
        <ever-table
          class="records-log"
          :columns="recordsColumns"
          :is-record-url-params="false"
          :data="followData.exeInsts"
        ></ever-table>
      </div>
    </template>
  </div>
</template>
<script>

  import { tableColWidth } from '@/util/table-config'
  import { listDestValue } from '@/util/common'
  import { categoryList } from '@/phr/page/patientdetail/follow.models'
  import { taskStatus } from '@/follow/util/model'

  const methodNameList = [
    {
      id: 0,
      name: '短信',
    },
    {
      id: 1,
      name: '短信',
    },
    {
      id: 2,
      name: '微信',
    },
  ]
  export default {
    props: {
      followData: Object,
    },
    data () {
      return {
        roadMap: {
          '0': '短信',
          '1': '微信',
          '2': '站内信',
        },
        jobTypeMap: {
          '1': '事件提醒',
          '2': '短信提醒',
          '3': '电话提醒',
          '4': '挂号',
          '5': '商城商品',
          '6': '保障计划',
        },
        columns: [
          {
            prop: 'executeTime',
            label: '执行时间',
            align: 'left',
            width: tableColWidth.datetimeAllW160,
            formatter: ({ value }) => {
              if (value) {
                return this.$moment(value).format('YYYY-MM-DD HH:mm:ss')
              }
            },
          },
          {
            prop: 'executeName',
            label: '执行人',
            align: 'center',
            width: tableColWidth.name7W120,

          },
          {
            prop: 'executeContent',
            label: '执行情况记录',
          },
        ],
        recordsColumns: [
          {
            prop: 'executeTime',
            label: '预计任务执行时间',
          },
          /*
          {
            prop: 'executorName',
            label: '执行人',
          },
          {
            prop: 'executeType',
            label: '执行方式',
            formatter: ({ value }) => listDestValue(executeTypeList, value)
          },
          */
          {
            prop: 'executeStatus',
            label: '执行状态',
            formatter: ({ value }) => listDestValue(taskStatus, value)
          }
        ]
        // playerOptions: this.followData.customClassification === '8' ? {
        //   muted: true,
        //   language: 'en',
        //   playbackRates: [ 0.7, 1.0, 1.5, 2.0 ],
        //   height: '360',
        //   sources: [ {
        //     type: 'video/mp4',
        //     // src: JSON.parse(this.followData.taskContent).url,
        //     src: 'http://vjs.zencdn.net/v/oceans.mp4',
        //   } ],
        //   poster: JSON.parse(this.followData.taskContent).uploadFace,
        // } : {
        //   muted: true,
        //   language: 'en',
        //   playbackRates: [ 0.7, 1.0, 1.5, 2.0 ],
        //   height: '360',
        // },
      }
    },
    computed: {
      category () {
        return listDestValue(categoryList, this.followData.taskInst.category)
      },
      methodName () {
        return this.followData.taskInst.executeMethod ? listDestValue(methodNameList, this.followData.taskInst.executeMethod) : '短信'
      },
      periodFrequencyHour () {
        return JSON.parse(this.followData.taskInst.periodFrequencyJson || '{}').hour || ''
      },
      periodFrequencyMinute () {
        return JSON.parse(this.followData.taskInst.periodFrequencyJson || '{}').minute || ''
      },
      periodFrequencyDay () {
        return JSON.parse(this.followData.taskInst.periodFrequencyJson || '{}').day || ''
      },
    },
    watch: {},
    created () {
      console.log(this.followData)
    },
    methods: {
      getSurveyUrl (id) {
        return `${this.$ever.host}${this.$ever.surveyIndex}/survey/answer/${id}/-1/previewOnly`
      },
    },
  }
</script>
<style lang="less" scoped>
  .follow-label-title {

  }

  .follow-label-res {
  }

  .follow-box {
    padding: 10px;
    font-size: 12px;

    .task_content {
      padding-left: 35px;
    }
  }
  .table-line {
    line-height: 30px;
    .follow-label-title {
      float: left;
      width: 60px;
    }
    .records-log {
      float: left;
      width: 600px;
    }
  }
</style>
