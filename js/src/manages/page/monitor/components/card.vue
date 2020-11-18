<!--  -->
<template>
  <div :class="{ 'card-box': true, error: isError,unusual: isUnusual,correct: isCorrect,'no-data': noData}">
    <div class="title-box">
      <span class="inline title" :title="obj.jobName">{{ obj.jobName }}</span>
      <svg v-if="isError" class="icon twinkling f16" style="vertical-align:top" aria-hidden="true" @click="showError(obj)">
        <use xlink:href="#icon-cuowu1"></use>
      </svg>
      <img v-if="isCorrect" src="./correct.gif" style="vertical-align:top">
      <svg v-if="isUnusual" class="icon twinkling f16" style="vertical-align:top" aria-hidden="true">
        <use xlink:href="#icon-yichang3"></use>
      </svg>
    </div>
    <div class="center text">总数量</div>
    <div class="number center" :title="obj.viewCount">
      {{ obj.viewCount | numberStr }}
    </div>
    <div class="bottom-box">
      <div class="height">
        <span class="text">已同步</span>
        <span class="correct-text" :title="obj.tableCount">{{
          obj.tableCount | numberStr
        }}</span>
      </div>
      <div>
        <span class="text">未同步</span>
        <span class="error-text" :title="errCount">{{ errCount | numberStr }}</span>
      </div>
    </div>
    
    <el-dialog
      title="错误详细信息"
      :visible.sync="dialogVisible"
      width="60%"
      >
      <div v-html="errMsg"></div>
    </el-dialog>

    <span :title="loading ? '同步中' : '重新同步'" class="format">
       <svg  v-if="isError || isUnusual" class="icon f16" :class="{'twinkling': loading}" style="vertical-align:top" aria-hidden="true" @click="formatData">
        <use xlink:href="#icon-menzhenshoufei-zhuanhuan"></use>
       </svg>
    </span>
  </div>
</template>

<script>
import { request } from '@/util/req'
import urls from '@/systemset/urls'
const dataswitch = urls.dataswitch
export default {
  props: {
    obj: {
      type: Object,
      required: true
    },
    channel: String
  },
  data () {
    return {
      dialogVisible: false,
      errMsg: '',
      loading: false
    }
  },
  filters: {
    numberStr (val) {
      if (val > 999) {
        const str = val + ''
        return str.substring(0, str.length - 3) + '.' + str.substring(str.length - 3, str.length - 2) + 'K'
      } else {
        return Number(val)
      }
    }
  },
  components: {},

  computed: {
    errCount () {
      return Math.abs(Number(this.obj.viewCount) - Number(this.obj.tableCount))
    },
    isError () {
      return Number(this.obj.errMsg) !== -1 && this.obj.errMsg !== null && this.obj.errMsg.length !== 32
    },
    isUnusual () {
      return (Number(this.obj.errMsg) === -1 || this.obj.errMsg.length === 32) && this.errCount > 0
    },
    isCorrect () {
      return !this.isError && this.errCount === 0 && !this.noData
    },
    noData () {
      return Math.abs(Number(this.obj.viewCount)) === 0
    }
  },

  mounted () { },

  methods: {
    showError (obj) {
      this.dialogVisible = true
      this.errMsg = obj.errMsg
    },
    async formatData () {
      if (this.loading) return
      this.loading = true
      const obj = {runType: 0, id: this.obj.id, channelDatasourceTypeCode: this.obj.channelDatasourceTypeCode}
      const res = await request(dataswitch.excute, obj)
      if (res && res.head && res.head.errCode === 0) {
        this.$message({
          message: '成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '失败',
          type: 'success'
        })
      }
      this.loading = false
      this.$emit('get-list')
    }
  }
}

</script>
<style lang='scss' scoped>
.card-box {
  box-sizing: border-box;
  display: inline-block;
  width: 178px;
  height: 190px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 10px;
  border: 3px solid white;
  position: relative;
  .format {
    position: absolute;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
  }
  .format:hover {
    color: #1c7bef;
  }
  // font-family: 'Microsoft YaHei';
  // font-family: 'SimHei';
  // font-weight: normal
}
.card-box:hover {
  border-color: #1C7BEF
}
.bottom-box {
  padding: 10px;
  font-size: 14px;
}
.correct-text {
  color: #13907c;
}
.error {
  background: #F2706E;
  border-color: #F2706E;
  color: white;
  .error-text {
    color: white;
  }
  .correct-text {
    color: white;
  }
}
.error-text {
  color:  #FF8180;
}
.unusual {
  border-color: #F2A06E;
}
.no-data {
  background: #DEDEDE;
  border-color: #DEDEDE;
}
.pointer {
  cursor: pointer;
}
.center {
  text-align: center;
}
.red {
  color: #de553d;
  position: relative;
  bottom: 6px;
  left: 6px;
}
.number {
  font-size: 40px;
  margin-bottom: 5px;
  font-weight: 300;
  font-family: 'SimHei';
}
.border {
  border: 4px solid #f2706e;
}
.title-box {
  padding: 6px;
}
.title {
  padding: 2px;
  font-size: 14px;
  font-weight: bold;
}
.inline {
  display: inline-block;
  width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text {
  font-size: 14px;
  margin-top: 20px;
  color: #999
}
.height {
  height: 21px;
}
.error_content {
  width: 80vw;
}
</style>
