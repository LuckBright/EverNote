<template>
  <div id="messagecontent">
    <ever-bread-crumb name="消息详情" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="layout_art">
        <h4><span>{{updateTime}}</span></h4>
        <article>
          <p>{{content}}
            <a v-if="dayKnotRoute && category !== 35" class="report ml20 f16" :href="`${$ever.rcmIndex}${dayKnotRoute}`" target="_blank">去处理</a>
            <a v-if="category === 35" class="report ml20 f16" :href="`${extend1}`" target="_blank">去处理</a>
          </p>
        </article>
      </div>
      <div class="layout_footer" v-if="!isHide">
        <el-button type="primary"  @click="linkDetail">立即处理</el-button>
      </div>
    </div>
    <item-dialog ref="itemDialog"  :inspectItem ='inspectItem'></item-dialog>
  </div>
</template>
<script>
  import progressapi from '../../warehouse/store/progressapi'
  import mainapi from '@/workspace/store/maingeneralapi'
  import itemDialog from '@/infusion/components/report.card.vue'
  import { MESSAGE_CHANNEL_DAY_KNOT } from '@/util/common'
  import urlMap from '@/msgcenter/store/urls'
  import { request } from '@/util/req'

  export default {
    data () {
      return {
        mainapi,
        id: this.$route.query.id,
        updateTime: '',
        content: '',
        url: '',
        isHide: true,
        eventStatus: '',
        formUrl: '',
        taskId: '',
        category: '',
        inspectItem: {},
        dayKnotRoute: '',
        extend1: '',
      }
    },
    watch: {
      '$route.query.id': {
        handler: function (val) {
          this.initData(val)
        }
      }
    },
    created () {
      if (this.$route.query.id) {
        this.initData()
      }
    },
    methods: {
      initData () {
        if (this.$route.query.id) {
          request(urlMap.msg.notice.getById, {id: this.$route.query.id}, 'get').then(rs => {
            if (rs.data) {
              this.updateTime = rs.data.updateTime && rs.data.updateTime
              this.content = rs.data.content && rs.data.content
              this.url = rs.data.url && rs.data.url
              this.category = rs.data.category && rs.data.category
              this.extend1 = rs.data.extend1 && rs.data.extend1
              MESSAGE_CHANNEL_DAY_KNOT.forEach(dayKnot => {
                if (rs.data.content) {
                  let itemCon = rs.data.content.slice(0, 5)
                  if (itemCon === dayKnot.param) {
                    this.dayKnotRoute = dayKnot.dayKnotRoute
                    this.content = rs.data.content.slice(6)
                  }
                }
              })
            }
            if (!this.url) {
              return false
            } else if (this.url.split('=')[2] === '1' || this.url.split('=')[2] === '2' || this.url.split('=')[2] === '4') {
              this.isHide = false
            } else if (this.url.split('=')[3] === 'oa') {
              this.isHide = false
              let id = this.url.split('&')[0].split('=')[1]
              progressapi.taskInfo({taskId: id}).then(rs => {
                if (!rs.variables) {
                  this.isHide = true
                } else {
                  this.eventStatus = rs.variables.eventStatus
                  this.formUrl = rs.variables.formUrl
                  this.taskId = id
                }
              })
            } else if (this.url.indexOf('visitSn') > -1) {
              let val = this.url
              let visitSn = val.split('=')[1].split('&')[0]
              let adviceType = parseInt(val.split('=')[2])
              this.mainapi.getInspectionReport(visitSn, adviceType).then(rs => {
                if (rs.data) {
                  this.isHide = false
                  this.inspectItem = rs.data
                }
              })
            }
          })
        }
      },
      linkDetail () {
        let status = this.url.split('=')[2]
        let id = this.url.split('=')[1].split('&')[0]
        if (this.category === 22 || this.category === 32) {
          this.$refs.itemDialog.openDialog(this.inspectItem)
        } else if (this.url.split('=')[3] === 'oa') {
          if (this.eventStatus === 'RESTART') {
            if (this.formUrl.indexOf('?') !== -1) {
              window.location.href = this.$ever.rcmIndex + this.formUrl + '&taskId=' + this.taskId
            } else {
              this.formUrl = this.formUrl.replace('/999', '')
              window.location.href = window.location.pathname + '#' + this.formUrl + '?taskId=' + this.taskId
            }
          } else {
            window.open(window.location.origin + this.$ever.warehouseIndex + '/goods/approval?' + this.url)
          }
        } else if (status === '1') {
          window.location.href = this.$ever.crmIndex + '/crm/feedbackhandle?id=' + id
        } else if (status === '2') {
          window.location.href = this.$ever.crmIndex + '/crm/feedbackdetail?id=' + id
        } else if (status === '4') {
          window.location.href = this.$ever.crmIndex + '/crm/feedcompete?id=' + id
        }
      }
    },
    components: {
      itemDialog
    }
  }
</script>
<style lang="scss" scoped>
  .report{color:#1c7bef !important;}
</style>
