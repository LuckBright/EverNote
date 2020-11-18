<template>
  <div class="layout_inner h100">
    <el-main class="common-el common-no-border-top h">
      <el-row align="right">
        <el-col class="mt10 ml10">
          <span>适用科室：{{sendData.depts && sendData.depts.map(item => item.objName).join()}}</span>
          <span class="ml10">初复诊： {{sendData.visitType === 1 ? '初诊' : '复诊'}}</span>
        </el-col>
        <el-col class="ml10 mt10 mb10">
          <el-button type="primary" @click="goback()">返回</el-button>
          <el-button type="primary" @click="previewSurvey">预览</el-button>
          <el-button type="primary" @click="save(false)">保存</el-button>
          <el-button type="primary" @click="publish">发布</el-button>
        </el-col>
      </el-row>
      <iframe v-if="this.$ever.host" ref="survey" id="RMid" :src="qUrl" frameborder="0" style="width:100%;height:100%;"></iframe>
    </el-main>
  </div>
</template>
<script>
import bus from '@/util/eventbus'
import { routerArr } from './routeconfig'

export default {
  data () {
    return {
      // api,
      surveyId: this.$route.query.id,
      categoryId: this.$route.query.categoryId,
      loading: true,
      url: '',
      qUrl: '',
      sendData: {},
    }
  },
  beforeCreate () {
    bus.$on('visitdetail', val => {
      bus.sendData = val
    })
    bus.$on('modify', val => {
      bus.modifyData = val
    })
  },
  mounted () {
    let tempObj = Object.assign({}, bus.sendData, bus.modifyData)
    this.sendData = tempObj
  },
  created () {
    // api.getapi({ 'tenantId': `${storage.getLocalStorage('TENANTID')}` }).then(rs => {
    //   this.url = 'http://' + rs.data.fullGroupDomainName
    // })
    this.qUrl = this.$ever.host + this.$ever.surveyIndex + '/survey/design/0/' + this.surveyId
    this.bindPostMessage()
  },
  methods: {
    save (flag) {
      const iframe = this.$refs.survey
      const msg = {
        data: {},
        from: 'Survey-save',
        fromIP: window.location.origin,
        type: flag ? 'publish' : 'save'
      }
      iframe.contentWindow.postMessage(msg, '*')
    },
    publish () {
      this.save(true)
    },
    bindPostMessage () {
      window.addEventListener('message', this.postMessageEvent, false)
    },
    postMessageEvent (e) {
      if (e.data.from === 'Survey' && e.data.type === 'submit-done') {
        e.data.msgType === 'save' && this.$notify({ message: '保存成功', type: 'success' })
        if (e.data.msgType === 'publish') {
          this.$router.push({
            name: routerArr[Number(this.categoryId) - 1] + 'answer',
            params: {
              id: this.surveyId,
              categoryId: this.sendData.category
            }
          })
        } else {
          this.goback()
        }
      }
    },
    previewSurvey () {
      const iframe = this.$refs.survey
      const msg = {
        from: 'Survey-preview',
        fromIP: window.location.origin,
        type: 'preview',
        flag: '2',
        previewType: '1'
      }
      iframe.contentWindow.postMessage(msg, '*')
    },
    goback () {
      this.$router.push({
        name: routerArr[Number(this.categoryId) - 1]
      })
    }
  },
  destroyed () {
    window.removeEventListener('message', this.postMessageEvent, false)
    bus.$emit('modify', this.sendData)
  }
}
</script>
