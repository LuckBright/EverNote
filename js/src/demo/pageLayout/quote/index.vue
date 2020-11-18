<template>
  <el-drawer
    class="bg drawer"
    :visible="visible"
    @update:visible="close"
    direction="btt"
    :append-to-body="false"
    :modal="false"
    :wrapperClosable="false"
    size="100%"
  >
    <div slot="title">
      <el-row class="tabs">
        <el-col :span="12" class="tabs-con">
          <el-tabs v-model="activeName">
            <el-tab-pane v-for="(item,index) in tabs" :key="item" :label="item" :name="`${index}`"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12" class="mr">
          <el-button size="mini" type="primary" class="mg" @click="quote">引用</el-button>
          <el-radio v-model="quoteType" label="1">默认</el-radio>
          <el-radio v-show="activeName !== '2' && activeName !== '3' && docType !== TEXT" v-model="quoteType" label="2">表格</el-radio>
          <!-- <el-radio v-model="quoteType" label="3">全部</el-radio> -->
        </el-col>
      </el-row>
    </div>
    <div class="body">
      <yi-zhu
        ref="yizhu"
        :visit-num="visitNum"
        :patient-id="patientId"
        :quote-type="quoteType"
        v-show="activeName === '0'"
      ></yi-zhu>
      <jian-yan
        ref="jianyan"
        :visit-num="visitNum"
        :patient-id="patientId"
        :quote-type="quoteType"
        v-show="activeName === '1'"
      ></jian-yan>
      <jian-cha
        ref="jiancha"
        :visit-num="visitNum"
        :patient-id="patientId"
        :quote-type="quoteType"
        v-show="activeName === '2'"
      ></jian-cha>
      <q-history
        ref="history"
        :visit-num="visitNum"
        :patient-id="patientId"
        :dpt-id="dptId"
        :quote-type="quoteType"
        v-show="activeName === '3'"
      ></q-history>
    </div>
  </el-drawer>
</template>

<script>
import yiZhu from './component/yizhu'
import jianYan from './component/jianyan'
import jianCha from './component/jiancha'
import qHistory from './component/history'
const FORM = '2'
const TEXT = '1'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    visitNum: {
      type: String,
      required: true
    },
    patientId: {
      type: String,
      required: true
    },
    dptId: {
      type: String,
      required: true
    },
    curNode: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      FORM,
      TEXT,
      activeName: '0',
      quoteType: TEXT,
      docType: '',
      tabs: ['医嘱', '检验', '检查', '既往病历'],
    }
  },
  computed: {},
  created () {
    this.docType = this.curNode.designerId
  },
  mounted () {},
  watch: {
    activeName () {
      this.quoteType = TEXT
    },
    curNode (val) {
      this.docType = val.designerId
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    quote () {
      switch (this.activeName) {
        case '0':
          this.$refs.yizhu.quote()
          break
        case '1':
          this.$refs.jianyan.quote()
          break
        case '2':
          this.$refs.jiancha.quote()
          break
        case '3':
          this.$refs.history.quote()
          break
      }
    }
  },
  components: {
    yiZhu,
    jianYan,
    jianCha,
    qHistory
  }
}
</script>
<style scoped lang="scss">
.drawer {
  .body {
    padding: 5px 10px;
    width: 100%;
    height: 100%px;
    overflow: auto;
  }
  .tabs .tabs-con /deep/ .el-tabs__nav-wrap {
    background: white;
  }
  /deep/ .el-drawer__header {
    margin: 0px;
    padding: 3px;
    border-bottom: 1px solid #dddddd;
  }
  /deep/ .el-tabs__nav-wrap:after {
    width: 0px;
  }
  /deep/ .el-tabs__active-bar {
    height: 0px;
  }
}
.bg {
  background-color: #f9f9f9;
}
.mg {
  margin-right: 30px;
  margin-left: 10px;
}
.mr {
  margin-top: 5px;
}
</style>
