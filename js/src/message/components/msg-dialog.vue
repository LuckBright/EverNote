<template>
  <el-popover
    placement="bottom"
    @show="msgShow"
    width="400"
    trigger="hover"
    popper-class="ever_popover_01 msg_popover"
    :open-delay="500"
    :class="msgCountShow < 10 ? 'mr10' : 'mr20'"
  >
    <div class="layout_box">
      <ul class="msglist">
        <li v-for="(item, i) in msgList" :key="i">
          <div @click="readMsg(item)">
            <p>
              <i></i>
              <b style="fontWeight:normal" v-html='formatEnter(item.content)' ></b>
              <a
                v-if="[22, 32].indexOf(item.category) > -1  && item.url !== null"
                class="report"
                @click="showReport(item)"
              >查看报告</a>
              <a
                v-if="item.category === 28 && item.url !== null"
                class="report"
                @click.stop="csalook(item)"
              >查看手术通知单</a>
              <a
                v-if="item.dayKnot"
                class="report f14"
                :href="`${$ever.rcmIndex}${item.dayKnot}`"
                target="_blank"
              >去处理</a>
              <a
                v-if="item.category && item.category === 12"
                class="report"
                @click.stop="goAudit(item)"
              >去审核</a>
              <!--              category = 35表示 跳转到 一个新到路径地址 -->
              <a
                v-if="item.category === 35 && item.extend1"
                class="report f14"
                @click.stop="toUrl(item)"
              >去处理</a>
            </p>
            <span>{{item.createTime}}</span>
          </div>
        </li>
        <li v-if="msgList.length === 0" class="bgcolor" style="cursor: pointer" @click="goList">
          <img :src="'' | fixImgSrc(3)" />
          <p>暂无未读消息</p>
        </li>
      </ul>
      <a :href="$ever.mainIndex + '/msgcenter/list'" class="boxfooter" v-if="msgList.length > 0">查看全部</a>
    </div>
    <el-badge :value="msgCountShow" class="spe_el-badge item" slot="reference">
      <i class="iconfont icon-message-copy"></i>
    </el-badge>
  </el-popover>
</template>

<script>
import urlMap from '@/msgcenter/store/urls'
import { request } from '@/util/req'
import { wsConnect, MESSAGE_CHANNEL_DAY_KNOT } from '@/util/common/'
import formatEnter from '@/infusion/page/treat/format.enter.js'
export default {
  mixins: [formatEnter],
  data () {
    return {
      mostShow: '',
      msgCount: 0,
      msgList: []
    }
  },
  created () {
    this.querySocket()
    this.getMsgList(true)
  },
  computed: {
    'msgCountShow' () {
      if (this.msgCount >= 99) {
        return '99+'
      } else if (this.msgCount <= 0) {
        this.msgCount = 0
        return ''
      } else {
        return this.msgCount
      }
    }
  },
  methods: {
    goList () {
      window.location.href = this.$ever.mainIndex + '/msgcenter/list'
    },
    evil (fn) {
      let Fn = Function
      return new Fn('return ' + fn)()
    },
    toUrl (item) {
      this.onlyreadMsg(item.id)
      window.open(item.extend1)
    },
    goAudit (item) {
      let obj = this.evil(item.extend1)
      this.onlyreadMsg(item.id)
      window.location.href = window.origin + window.location.pathname + '#/crm/schedulingaudit?arrangeTempletId=' + obj.arrangeTempletId + '&arrangeTempletName=' + obj.arrangeTempletName + '&arrangeMonth=' + obj.arrangeMonth + '&depId=' + obj.depId + '&depName=' + obj.depName + '&orgId=' + obj.orgId + '&orgName=' + obj.orgName + '&id=' + obj.checkLogId + '&status=' + obj.status
    },
    getMsgList () {
      request(urlMap.msg.notice.getUnReadList, {}, 'get').then(rs => {
        if (!rs) {
          return false
        }
        if (rs.data) {
          if (rs.data.resultList) {
            rs.data.resultList.forEach(item => {
              MESSAGE_CHANNEL_DAY_KNOT.forEach(dayKnot => {
                if (item.content) {
                  let itemCon = item.content.slice(0, 5)
                  if (itemCon === dayKnot.param) {
                    item.dayKnot = dayKnot.dayKnotRoute
                    item.content = item.content.slice(6)
                  }
                }
              })
            })
            this.msgList = rs.data.resultList
          }
          this.msgCount = rs.data.totalCount
        }
      })
    },
    readMsg (item) {
      this.onlyreadMsg(item.id)
      window.open(this.$ever.mainIndex + 'msgcenter/content?id=' + item.id)
    },
    onlyreadMsg (id) {
      request(urlMap.msg.notice.read, { id: id }, 'get').then(rs => {
        this.getMsgList(true)
      })
    },
    csalook (item) {
      this.onlyreadMsg(item.id)
      this.$emit('csalook', item.url.split('=')[1])
    },
    showReport (item) {
      let val = item.url
      let isNew = val.indexOf('https')
      if (isNew > -1) {
        window.location.href = val
      } else {
        let executeId = val.split('&')[0].split('=')[1]
        let serviceId = val.split('&')[1].split('=')[1]
        let serviceType = val.split('&')[2].split('=')[1]
        let code = val.split('&')[3].split('=')[1]
        let patientId = val.split('&')[4].split('=')[1]
        this.$emit('show', {
          serviceType,
          serviceId,
          executeId,
          code,
          patientId
        })
      }
      this.onlyreadMsg(item.id)
      event.stopPropagation()
    },
    querySocket () {
      wsConnect('/exchange/exchange.direct.notices.messageTip/' + localStorage.getItem('USERID'), (client, d) => {
        let body = JSON.parse(d.body)
        if (body.category && body.category === '30') {
          this.$notify.success({
            title: '处方审核提醒',
            duration: 60000,
            message: '您有新的处方, 请尽快审核'
          })
        }
        if (body.action === 2) {
          this.msgCount--
        } else {
          this.msgCount++
        }
      })
    },
    msgShow () {
      this.getMsgList()
    }
  }
}
</script>
<style scoped>
.el-popover.msg_popover a.boxfooter {
  display: block;
  color: #1c7bef;
  text-align: center;
  background: #f8f8f8;
  padding: 14px 0;
  font-size: 16px;
  text-decoration: none;
}
.el-popover.msg_popover a.boxfooter:hover {
  text-decoration: none;
}
.el-badge {
  line-height: 18px;
}
.bgcolor {
  background: #ffffff;
}
.bgcolor p {
  text-align: center;
  color: #999999;
}
.msglist {
  border-bottom: 1px solid #ddd;
  width: 400px;
  max-width: 800px;
  max-height: 306px;
  overflow: auto;
  padding: 0;
  margin: 0;
}
.msglist li {
  padding: 6px 20px;
  cursor: pointer;
  background: #ffffff;
}
.msglist li:hover {
  background: #fcf8fe;
}
.msglist li a {
  line-height: 1.5;
  margin-bottom: 5px;
  color: #000;
  text-decoration: none;
  display: inline-block;
}
.msglist li span {
  color: #999999;
}
.msglist li div p {
  /* max-height: 60px; */
  line-height: 20px;
  /* display: -webkit-box; */
  overflow: hidden;
  text-overflow: ellipsis;
  /* white-space: nowrap; */
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
}
.msglist li p i {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #ee4433;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 4px;
}
.msglist li img {
  display: inline-block;
  text-align: center;
  margin-left: 38%;
  width: 25%;
  height: 25%;
}
.report {
  color: #1c7bef !important;
  margin-left: 20px;
}
.mr10{
  margin-right:10px;
}
.mr20{
  margin-right:20px;
}
</style>
