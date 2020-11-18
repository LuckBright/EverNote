<template>
  <div v-if="!CUSTOMSYSTEMTYPE.includes(item.payload.data.type)" :class="item.form === $route.query.creatorId ? 'chat-sender' : 'chat-receiver'">
    <div><img :src="photoUrl(item.avatar)" v-if="item.payload.data.type !== 'TW_QUESTION'"></div>
    <div class="custombox info">
      <el-card class="box-card" v-if="item.payload.data.type === 'TW_QUESTION'">
        <div slot="header">
          <dl class="gray patient clearfix">
            <dt>
              <img :src="photoUrl(item.avatar)" style="width:40px;height:40px;" />
            </dt>
            <dd>
              <h4><span>{{item.payload.data.content.info.patientInfo.name}}</span> <label>{{visitTypeText}}</label></h4>
              <p>
                {{item.payload.data.content.info.patientInfo.ageShowText}}
                {{item.payload.data.content.info.patientInfo.mobile}}
                {{item.payload.data.content.info.patientInfo.birthday}}
              </p>
            </dd>
          </dl>
        </div>
        <dl class="describe">
          <dt>病情描述</dt>
          <dd>{{item.payload.data.content.info.question}}</dd>
        </dl>
        <dl class="imgfile">
          <dt>历史诊断资料</dt>
          <dd v-if="item.payload.data.content.info.images">
            <viewer :images="getImageList(item.payload.data.content.info.images)" :options="options" class="images">
              <img class="mr10" :src="$ever.fileUrl2 + img" v-for="(img, i) in item.payload.data.content.info.images.split(',')" :key="i" :data-src="$ever.fileUrl2 + img" style="width: 60px; height: 60px; border-radius:4px;cursor: pointer;" />
            </viewer>
          </dd>
        </dl>
      </el-card>
      <el-card class="box-card" v-if="item.payload.data.type ==='PRECONSULTATION'">
        <div slot="header">
          <dl class="gray">
            <dt><strong>{{item.payload.data.content.questionName}}</strong></dt>
          </dl>
        </div>
        <center><el-link @click="linkPage(questionUrl)">查看详情</el-link></center>
      </el-card>
      <el-card class="box-card" v-if="item.payload.data.type ==='MEDICAL_RECORDS'">
        <div slot="header">
          <dl class="gray">
            <dt><strong>{{item.payload.data.content.title}}的病历</strong></dt>
          </dl>
        </div>
        <dl class="describe">
          <dd>诊断：{{item.payload.data.content.diagnosis || '--'}}</dd>
          <dd>主诉：{{item.payload.data.content.mainComplaint || '--'}}</dd>
        </dl>
        <center><el-link @click="$alert('此消息类型无法展示，请在APP中查看')">查看病历详情</el-link></center>
      </el-card>
      <el-card class="box-card" v-if="item.payload.data.type === 'GOODS'">
        <div slot="header">
          <dl class="gray goods clearfix">
            <dt>
              <el-image :src="item.payload.data.content.icon"></el-image>
            </dt>
            <dd>
              <h4><span>{{item.payload.data.content.goodsName}}</span></h4>
              <p>￥ {{item.payload.data.content.price}}</p>
            </dd>
          </dl>
        </div>
        <center><el-link :href="item.payload.data.content.goodsUrl" target="_blank">查看详情</el-link></center>
      </el-card>
      <el-card class="box-card" v-if="item.payload.data.type === 'TW_RPLIST'">
        <div slot="header">
          <dl class="gray rplist clearfix">
            <dt>
              <strong>处方清单</strong>
            </dt>
          </dl>
        </div>
        <dl class="describe">
          <dt>开具了建议清单 共 {{item.payload.data.content.count}} 种</dt>
          <dd>{{item.payload.data.content.text}}</dd>
        </dl>
        <!--<center><el-link href="#" target="_blank">查看处方详情</el-link></center>-->
      </el-card>
      <el-card class="box-card" v-if="item.payload.data.type === 'OCR'">
        <div slot="header">
          <dl class="gray rplist clearfix">
            <dt>
              <strong>{{item.payload.data.content.recordName}}</strong>
            </dt>
          </dl>
        </div>
        <dl class="describe">
          <dt>医院名称：{{item.payload.data.content.hospitalName}}</dt>
          <dd>报告时间：{{item.payload.data.content.recordTime}}</dd>
          <dd>
            <el-image
              style="width: 50px;"
              :src="$ever.fileUrl2 + item.payload.data.content.url"
              :preview-src-list="[$ever.fileUrl2 + item.payload.data.content.url]"
              >
            </el-image>
          </dd>
        </dl>
      </el-card>
    </div>
  </div>
  <div class="chat-tips" v-else-if="CUSTOMSYSTEMTYPE.includes(item.payload.data.type) && item.payload.data.content.info.doctor">
    <span>{{item.payload.data.content.info.doctor}}</span>
  </div>
</template>

<script>
import ihapi from '@/ihsystem/store/webihapi'
export default {
  props: ['item'],
  data () {
    return {
      CUSTOMSYSTEMTYPE: ['SYS_PLAIN', 'TW_WAIT_FOR_FINISH', 'TW_STATUS_CHANGED'],
      ihapi,
      options: {
        title: false,
        url: 'data-src'
      },
      visitType: {
        5: '图文问诊',
        6: '视频问诊',
        7: '在线咨询'
      },
      visitTypeText: '',
      avatar: require('@/assets/avtarbg.png')
    }
  },
  created () {
    if (this.$route.query.visitType) {
      this.visitTypeText = this.visitType[this.$route.query.visitType]
    }
    // console.log(this.item)
  },
  methods: {
    linkPage (val) {
      this.$emit('link', val)
    },
    photoUrl (val) {
      let url = ''
      if (val && val.indexOf('http') > -1) {
        url = val
      } else if (val) {
        url = this.$ever.fileUrl2 + val
      } else {
        url = this.avatar
      }
      return url
    },
    getImageList (ids) {
      if (!ids) return
      let arr = ids.split(',')
      return arr.map(img => {
        return this.$ever.fileUrl2 + img
      })
    }
  },
  computed: {
    questionUrl () {
      let questionId = this.item.payload.data.content.questionId
      let visitNumber = this.item.payload.data.content.visitNumber
      let queryParams = encodeURIComponent(JSON.stringify({flag: visitNumber}))
      return `${this.$ever.host}${this.$ever.surveyIndex}/survey/answer/${questionId}/-1/previewOnly?u=${queryParams}`
    }
  }
}
</script>
<style scoped src="../assets/im.css"></style>
<style scoped>
  dl,dt,dd,h3,h4,p {margin: 0;padding: 0;}
  .info dl.describe,
  .info dl.imgfile{margin-bottom: 5px;}
  .info dl > dt {font-size: 14px; color: #000;}
  .info dl > dd {font-size: 12px; color: #666; padding: 5px 0;}
  .info {text-indent: 0;}
  .info .el-card {border: none;}
  .info /deep/ .el-card__body {padding: 7px;}
  .info /deep/ .el-card__header {padding: 0; color: #333; border-bottom: solid 1px solid #ddd;}
  dl.gray {padding: 10px; position: relative; margin: 0; display: block; }
  dl.gray > dt {color: #666;}
  dl.gray > dd > h4 {font-weight: normal; font-size: 14px; color: #000;}
  dl.gray > dd > p {font-size: 12px; margin-top: 7px; color: #000;}

  dl.patient > dt {display: block; width: 40px; height: 40px; position: absolute; top: 15px; left: 5px;}
  dl.patient > dt img {width: 100%; border-radius: 10%;}
  dl.patient > dd {padding-left: 45px; margin: 0;}
  dl.patient > dd h4 {font-size: 14px;}
  dl.patient > dd h4 label {display: inline-block; height: 16px; line-height: 16px; text-align: center; background: #3DB6D0; color: #fff; border-radius: 3px; padding: 1px 7px; font-size: 12px; font-weight: normal;}
  dl.patient > dd p {font-size: 12px;}

  dl.goods > dt {display: block; width: 60px; height: 60px; position: absolute; top: 5px; left: 5px;}
  dl.goods > dt .el-image {width: 100%; border-radius: 10%;}
  dl.goods > dd {padding-left: 65px; margin: 0; height: 52px;}
  dl.goods > dd h4 {font-size: 14px;display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; height: 40px; font-weight: normal;}
  dl.goods > dd p {font-size: 14px; color: #990317;}
  .chat-tips {clear: both; font-size: 12px; text-align: center; line-height: 1.75; padding: 10px 50px; margin-bottom: 10px; color:#999;}
</style>
