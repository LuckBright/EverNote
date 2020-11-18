<template>
  <div class="common-box h" style="width: 100%;height: 100%;padding:0px;">
      <div class="common-header">
      <span>{{subData.name}}</span>
      </div>
      <div class="common-content" style="height: 100%;" v-if="subData">
        <div class="w700">
          <el-form :model="subData" class="myform" label-width="90px">
            <el-form-item label="任务类型：">
              <label>{{subData.category | filterMaterialType}}</label>
            </el-form-item>
            <el-form-item label="执行方式：">
              <label>{{subData.executeMethod | filterSendType}}</label>
            </el-form-item>
            <el-form-item label="任务内容：" v-if="subData.category !== 4">
              <label v-if="subData.executeJson">{{subData.executeJson}}</label>
              <div v-if="subData.executeExtendJson">
                <p v-if="subData.category === 3"><video v-if="JSON.parse(subData.executeExtendJson).url" :src="JSON.parse(subData.executeExtendJson).url" controls="controls" width="300" height="200"></video></p>
                <template v-if="subData.category === 5">
                  <p v-if="subData.contentType === 4"><img v-if="JSON.parse(subData.executeExtendJson).picture" :src="JSON.parse(subData.executeExtendJson).picture" width="300"/></p>
                  <span v-if="subData.contentType === 5">
                    {{JSON.parse(subData.executeExtendJson).tenantDeptName}} - 
                    {{JSON.parse(subData.executeExtendJson).doctorName}} - 
                    {{JSON.parse(subData.executeExtendJson).serviceName}}
                  </span>
                </template>
              </div>
            </el-form-item>
            <el-form-item label="是否循环：" v-if="subData.isLoop">
              <label>{{subData.isLoop ? '是' : '否'}}</label>
            </el-form-item>
            <el-form-item label="任务周期：" v-if="subData.isLoop">
              <label>{{subData.periodDay}} 天</label>
            </el-form-item>
            <el-form-item label="执行时间：" v-if="subData.isLoop">
              <label>{{subData.periodFrequency.hour + ':' + subData.periodFrequency.minute}}</label>
            </el-form-item>
            <el-form-item label="执行频次：" v-if="subData.isLoop">
              <label>每 {{subData.periodFrequency.day }} 天 / 次</label>
            </el-form-item>
          </el-form>
        </div>
        <div class="iframebox" v-if="subData.category === 4" style="width: 100%; height: 100%;">
          <iframe
            v-if="!iframeBoxLoading && subData && subData.executeExtendJson"
            :src="`${this.$ever.host}${followMap.preview}${subData.executeExtendJson}/1/1/1`"
            width="100%"
            height="100%"
            frameborder="0"
          ></iframe>
        </div>
      </div>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import storage from '@/util/storage'
import { pattern, followMap } from '@/follow/util/model'
import selectTaskUser from '@/follow/components/select-task-user.vue'
import taskSetting from '@/follow/components/task-setting.vue'
import '@/follow/util/filters'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'

export default {
  props: ['isShow', 'subData', 'isEdit', 'templateStatus'],
  data () {
    return {
      pattern,
      followMap,
      serviceList: [],
      token: storage.getStorageByClinic('TOKEN'),
      iframeBoxLoading: false,
      params: {},
      edcEdit: false,
      rules: {
        optional: [
          {required: false}
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['change'], type: 'array' }
        ]
      }
    }
  },
  watch: {
    'subData': {
      handler (val) {
        this.iframeBoxLoading = true
        this.getData()
        setTimeout(_ => {
          this.iframeBoxLoading = false
        }, 100)
      }
    }
  },
  created () {
    // this.taskPanel.pattern = this.isEdit
  },
  methods: {
    getData () {
      // console.log(this.subData)
      let data = this.subData
      console.log(data)
    },
    getArrangeServiceList (orgId) {
      request(urlMap.arrangeServiceList, { orgId: orgId, searchType: 2, serviceClassification: '799' }).then(rs => {
        if (rs && rs.data && rs.data[0]) {
          this.serviceList = rs.data.map(v => {
            return {
              serviceId: v.id,
              serviceName: v.name
            }
          })
        } else {
          this.serviceList = []
        }
      })
    }
  },
  components: { selectTaskUser, taskSetting }
}
</script>
<style scoped>
.w700 {width: 100%;}
.myform /deep/ .el-form-item {margin-bottom: 5px;}
.myform /deep/ .el-form-item__label {min-height: 40px; line-height: 40px; font-weight: bold;}
.iframebox {height:100%}
.wid40{width: 60px;}
.img-wid{width:100px; height:100px;}
</style>
