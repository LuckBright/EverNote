<!--  -->
<template>
  <div class="monitor">
    <div class="title">
      数据监控
      <div class="fr channel-box">
        <span class="channel-label">选择数据通道:</span>
        <el-select v-model="channel" placeholder="" @change="changeChannel">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.channelName"
            :value="item.channelDatasourceTypeCode"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="mr">
      <span class="text">数据总览</span>
      <span class="small-text"><i class="circle blue"></i> 总数据量</span>
      <span class="small-text"><i class="circle green"></i> 已同步</span>
      <span class="small-text"><i class="circle error"></i> 未同步</span>
    </div>
    <annular-box
      :key="annularKey"
      :total="totalCount"
      :correct-count="correctCount"
      :error-count="errorCount"
    ></annular-box>
    <!-- <div class="icon-brief">
      <i class="little-box weiqiyong"></i>未启用<i
        class="little-box tingzhi"
      ></i>
      停止 <i class="little-box yichang"></i>异常
    </div> -->
    <el-tabs v-model="activeName" :key="tabsKey" :before-leave="beforeLeave">
      <el-tab-pane label="所有工作站数据" name="first">
        <card-el
          v-for="item in dataList"
          :key="item.id"
          :obj="item"
          @get-list="getList"
        ></card-el>
        <ever-no-data v-if="!dataList.length" tipTxt="暂无数据"></ever-no-data>
      </el-tab-pane>
      <el-tab-pane label="错误工作站数据" name="second"
        ><card-el
          v-for="(item, index) in errList"
          :key="index"
          :obj="item"
          @get-list="getList"
        ></card-el>
        <ever-no-data v-if="!errList.length" tipTxt="暂无数据"></ever-no-data>
      </el-tab-pane>
      <el-tab-pane name="third">
        <div slot="label" class="icon-brief">
          <i class="little-box weiqiyong"></i>未启用
          <i class="little-box tingzhi"></i>停止
          <i class="little-box yichang"></i>异常
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import annularBox from './components/annular'
import cardEl from './components/card'
import { request } from '@/util/req'
import urls from '@/manages/urls'
const monitor = urls.monitor
export default {
  data () {
    return {
      activeName: 'first',
      totalCount: 0,
      correctCount: 0,
      errorCount: 0,
      dataList: [],
      errList: [],
      channel: 'default',
      options: [],
      annularKey: 0,
      tabsKey: 0
    }
  },
  components: {
    annularBox,
    cardEl
  },
  computed: {},
  created () {
    this.getList()
    this.getChannels()
  },
  mounted () { },
  methods: {
    beforeLeave (activeIndex, oldActiveIndex) {
      if (activeIndex === 'third') {
        return false
      }
    },
    changeChannel (value) {
      this.getList()
    },
    async getChannels () {
      const res = await request(monitor.channel, { channelCode: 'thc_phr' })
      if (res && res.data && Array.isArray(res.data.resultList)) {
        const arr = res.data.resultList
        arr.map(item => {
          if (item.channelDatasourceTypeCode === 'default') {
            item.channelName = 'THC数据通道'
          }
        })
        this.options = res.data.resultList
      }
    },
    async getList () {
      this.tabsKey++
      this.annularKey--
      this.totalCount = 0
      this.correctCount = 0
      this.errorCount = 0
      this.dataList = []
      const response = await request(monitor.list, { typeCode: 'thc_phr', channelDatasourceTypeCode: this.channel })
      if (response.data.resultList && response.data.resultList.length) {
        this.dataList = response.data.resultList

        this.dataList.map((item) => {
          this.totalCount += Number(item.viewCount)
          this.correctCount += Number(item.tableCount)
          this.errorCount += Number(item.viewCount - item.tableCount)
          if (Number(item.errMsg) !== -1 && item.errMsg !== null && item.errMsg.length !== 32) {
            this.errList.push(item)
          }
        })
        this.errorCount = Math.abs(this.totalCount - this.correctCount)
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.monitor {
  height: 100%;
  padding-top: 15px;
  padding-left: 15px;
  padding-left: 15px;
  box-sizing: border-box;
  overflow: auto;
  background-color: #ffffff;
  color: #333333;
  position: relative;
  .channel-box {
    margin-right: 20px;
    .channel-label {
      color: #999999;
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .title {
    font-size: 16px;
    color: #040c1f;
    font-weight: bold;
  }
  .mr {
    margin-bottom: 10px;
  }
  .text {
    font-size: 14px;
    font-weight: 900;
  }
  .small-text {
    font-size: 12px;
    font-weight: 100;
  }
  .circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    margin-left: 10px;
  }
  .blue {
    background-color: #1c7bef;
    margin-left: 10px;
  }
  .green {
    background-color: #63d6c3;
  }
  .error {
    background-color: #ff817f;
  }
  .relative {
    position: relative;
  }
  .icon-brief {
    font-size: 12px;
    font-weight: normal;
    color: #bbb;
    cursor: default;
    // position: absolute;
    // top: 269px;
    // left: 261px;
    // font-size: 10px;
    // color: #bbbbbb;
    // line-height: 15px;
    .little-box {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin: 0 5px;
    }
    .weiqiyong {
      background: #d8d8d8;
    }
    .tingzhi {
      background: #f2706e;
    }
    .yichang {
      background: #f2a06e;
    }
  }
}
</style>
