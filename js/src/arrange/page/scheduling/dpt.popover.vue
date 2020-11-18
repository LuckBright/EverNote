<template>
  <el-popover
    placement="bottom"
    width="400"
    trigger="click"
  >
  <el-row>
    <el-col :span="20" class="title-sty mb10">
      <span class="mr10">{{titleData.orgName}}</span>
      <span class="mr10">{{titleData.dptName}}</span>
      <span>{{titleData.docName}}</span>
    </el-col>
    <el-col :span="4" align="right">
      <i v-show="isHideen" class="iconfont icon-bianji" @click="edit"></i>
    </el-col>
  </el-row>
    <el-row>
      <el-col  v-for="(item, index) in services" :key="index" class="mb10">
        <span class="wid130">
          {{['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode) ? item.serviceName : '服务能力'}}
        </span>
        <span v-show="item.frequencyType === 1" class="c9">
          <span  :key="index">{{item.frequencyAmount}}分钟/个</span><span></span>
        </span>
        <span v-show="item.frequencyType === 2" class="c9">
          <span  :key="index">每班次</span><span>{{item.frequencyVolume}}个</span>
        </span>
      </el-col>
      <el-col>
        <span class="wid130">
          {{name}}
        </span>
        <span v-for="(item,index) in timeranges" :key="index">
          <span class="mr5">{{item.startTime.substring(0,5)}}-{{item.endTime.substring(0,5)}}</span>
        </span>
      </el-col>
    </el-row>
    <div slot="reference" @click="showPopover(index, $event)">{{name}}</div>
  </el-popover>
</template>
<script>
import api from '@/arrange/store/workapi'
export default {
  props: {
    'name': {
      type: String,
      default: ''
    },
    'index': {
      type: Number,
      default: null
    },
    'instanceId': {
      type: String,
      default: ''
    },
    'titleData': {
      type: Object,
      default: () => {}
    },
    'categoryCode': {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      api,
      services: [],
      timeranges: [],
      isHideen: true
    }
  },
  methods: {
    async showPopover (index, ev) {
      this.isHideen = !this.$moment(this.titleData.date).isBefore(this.$moment().format('YYYY-MM-DD'), 'day')
      this.api.getByInstanceId({'instanceId': this.instanceId}).then(rs => {
        if (rs.head.errCode === 0) {
          this.services = rs.data.services
          this.timeranges = rs.data.timeranges
        }
      })
    },
    edit (val) {
      this.$bus.$emit('showdpt', this.instanceId, this.titleData)
    }
  }
}
</script>
<style lang="scss" scoped>
  .title-sty{
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    letter-spacing: 0.5px;
    line-height: 14px;
  }
  .wid130{
    width:130px;
    display:inline-block;
  }
  .c9{
    color: #999999;
    display:inline-block;
  }
</style>

