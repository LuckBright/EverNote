<!--  -->
<template>
  <div>
    <div class="analysis">
      <div>
        <p>
          <img src="../../../../assets/img/shijian.png" alt="" />
        </p>
        <p class="p-shuju">
          <span class="span-shuju">{{ liveObj.time }}</span>
        </p>
        <p>
          <span class="span-label">直播时间</span>
        </p>
      </div>
      <div class="center-div">
        <p>
          <img src="../../../../assets/img/renshu.png" alt="" />
        </p>
        <p class="p-shuju">
          <span class="span-shuju">{{ liveObj.watchNum }}</span>
        </p>
        <p>
          <span class="span-label">观看人数</span>
        </p>
      </div>
      <div>
        <p>
          <img src="../../../../assets/img/liaotian.png" alt="" />
        </p>
        <p class="p-shuju">
          <span class="span-shuju">{{ liveObj.chatNum }}</span>
        </p>
        <p>
          <span class="span-label">聊天人数</span>
        </p>
      </div>
      <div>
        <p>
          <img src="../../../../assets/img/zixun.png" alt="" />
        </p>
        <p class="p-shuju">
          <span class="span-shuju">{{ liveObj.numberOfConsulting }}</span>
        </p>
        <p>
          <span class="span-label">咨询人数</span>
        </p>
      </div>
      <div class="center-div">
        <p>
          <img src="../../../../assets/img/shuliang.png" alt="" />
        </p>
        <p class="p-shuju">
          <span class="span-shuju">{{ liveObj.saleGoodsNum }}</span>
        </p>
        <p>
          <span class="span-label">带货总数量</span>
        </p>
      </div>
      <div>
        <p>
          <img src="../../../../assets/img/jine.png" alt="" />
        </p>
        <p class="p-shuju">
          <span class="span-shuju">{{ liveObj.saleTotalCount }}</span>
        </p>
        <p>
          <span class="span-label">带货总金额</span>
        </p>
      </div>
    </div>
    <div class="clearfix">
      <a :href="downloadUrl" ref="download" download="咨询数据"></a>
      <el-button type="primary" class="fr" @click="exportInfo">导出带货数据</el-button>
    </div>
    <ever-table
      ref="table"
      :columns="columns"
      :url="url"
      :params.sync="form"
      :isRecordUrlParams="false"
    ></ever-table>
  </div>
</template>

<script>
import api from '@/titancare/api/content/live.js'
import playback from '@/titancare/api/content/playback'

export default {
  props: {
    liveRoom: Object
  },
  data () {
    return {
      form: {
        liveId: this.liveRoom.videoRecordId || this.liveRoom.id
      },
      url: api.getLiveMailInfo(),
      downloadUrl: '',
      liveObj: {
        time: '00:00:00',
        watchNum: 0,
        chatNum: 0,
        saleGoodsNum: 0,
        saleTotalCount: 0,
        numberOfConsulting: 0
      },
      columns: [
        {
          prop: 'orderCode',
          label: '订单号',
        },
        {
          prop: 'goodsName',
          label: '商品名称',
        },
        {
          prop: 'buyerName',
          label: '购买人',
        },
        {
          prop: 'unitPrice',
          label: '单价（元）',
          formatter ({ value }) {
            return Number(value) * 0.01
          }
        },
        {
          prop: 'realPayAmount',
          label: '实收金额（元）',
          formatter ({ value }) {
            return Number(value) * 0.01
          }
        },
        {
          prop: 'orderTime',
          label: '下单时间',
        },
      ]
    }
  },

  components: {},

  computed: {
    liveId () {
      return this.liveRoom.videoRecordId || this.liveRoom.id
    }
  },

  created () {
    this.getInfo()
  },

  methods: {
    getInfo () {
      api.getDurationAndNumberOfViewers({ id: this.liveId }).then(rs => {
        if (!rs.errCode) {
          let t = rs.data.liveTimeSecond / 1000
          let h = this.info(Math.floor(t / 60 / 60 % 24))
          let m = this.info(Math.floor(t / 60 % 60))
          let s = this.info(Math.floor(t % 60))
          this.liveObj.time = h + ':' + m + ':' + s
          this.liveObj.watchNum = rs.data.watchNum
          this.liveObj.chatNum = rs.data.chatNum
          this.liveObj.saleGoodsNum = rs.data.saleGoodsNum
          this.liveObj.saleTotalCount = rs.data.saleTotalCount * 0.01
          this.liveObj.numberOfConsulting = rs.data.numberOfConsulting
        }
      })
    },
    info (val) {
      return val < 10 ? '0' + val : val
    },
    async exportInfo () {
      const res = await playback.exportMailInfo({liveId: this.liveId})
      this.downloadUrl = res.data.domain + res.data.fileUrl
      this.$nextTick(() => {
        this.$refs.download.click()
      })
    },
  }
}

</script>
<style lang='scss' scoped>
.analysis {
  display: flex;
  margin: 20px;
  & > div {
    flex-grow: 1;
  }
  .center-div {
    border-left: 1px solid #f8f8f8;
    border-right: 1px solid #f8f8f8;
  }
  p {
    margin: 0;
    text-align: center;
    .span-label {
      color: #999;
      font-size: 12px;
    }
    .span-shuju {
      color: #000;
      font-size: 18px;
      font-weight: 700;
    }
  }
  .p-shuju {
    margin: 12px 0;
  }
}
</style>
