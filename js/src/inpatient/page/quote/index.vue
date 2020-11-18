<template>
  <el-drawer class="bg drawer"
             :visible="visible"
             @update:visible="close"
             direction="btt"
             :append-to-body="false"
             :modal="false"
             :wrapperClosable="false"
             size="100%">
    <div slot="title">
      <el-row class="tabs">
        <el-col :span="12"
                class="tabs-con">
          <el-tabs v-model="activeName"
                   class="nav_tabs">
            <el-tab-pane v-for="(item, index) in tabs"
                         :key="item"
                         :label="item"
                         :name="`${index}`"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12"
                v-show="activeName !== '3'">
          <el-button size="mini"
                     type="primary"
                     class="mg"
                     @click="quote">引用</el-button>
          <el-radio v-model="quoteType"
                    label="1" v-show="activeName !== '2'">默认</el-radio>
          <el-radio v-show="
              docType !== TEXT && curNode.code !== 'YI_BAN_HU_LI_JI_LU_DAN' && activeName !== '2'
            "
                    v-model="quoteType"
                    label="2">表格</el-radio>
          <!-- <el-radio v-model="quoteType" label="3">全部</el-radio> -->
        </el-col>
      </el-row>
    </div>
    <div class="body">
      <yi-zhu ref="yizhu"
              :visit-num="visitNum"
              :patient-id="patientId"
              :quote-type="quoteType"
              v-if="activeName === '0'"
              :cur-node="curNode"></yi-zhu>
      <jian-yan ref="jianyan"
                v-if="load[1]"
                :visit-num="visitNum"
                :patient-id="patientId"
                :quote-type="quoteType"
                :cur-node="curNode"
                v-show="activeName === '1'"></jian-yan>
      <jian-cha ref="jiancha"
                v-if="load[2] && activeName === '2'"
                :visit-num="visitNum"
                :patient-id="patientId"
                :quote-type="quoteType"
                :cur-node="curNode"></jian-cha>
      <q-history ref="history"
                 v-if="load[3] && activeName === '3'"
                 :visit-num="visitNum"
                 :patient-id="patientId"
                 :dpt-id="dptId"
                 :cur-node="curNode"
                 :quote-type="quoteType"></q-history>
      <q-tiwen ref="temperature"
               v-if="load[4] && activeName === '4'"
               :visit-num="visitNum"
               :patient-id="patientId"
               :dpt-id="dptId"
               :quote-type="quoteType"
               :cur-node="curNode"></q-tiwen>
    </div>
  </el-drawer>
</template>

<script>
import yiZhu from './component/yizhu'
import jianYan from './component/jianyan'
import jianCha from './component/jiancha'
import qHistory from './component/history'
import qTiwen from './component/temperature'

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
      load: {},
      FORM,
      TEXT,
      activeName: '0',
      quoteType: TEXT,
      docType: '',
      tabs: ['医嘱', '检验', '检查', '既往病历', '体温单']
    }
  },
  computed: {},
  created () {
    this.docType = this.curNode.designerId
  },
  mounted () { },
  watch: {
    activeName (val) {
      this.load[val] = true
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
        case '4':
          this.$refs.temperature.quote()
          break
      }
    }
  },
  components: {
    yiZhu,
    jianYan,
    jianCha,
    qHistory,
    qTiwen
  }
}
</script>
<style scoped lang="scss">
.drawer {
    position: relative !important;
    height:330px !important;
  /deep/.el-drawer{
    display: flex;
    flex-direction: column;
    .el-drawer__body{
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }
    .el-drawer__close-btn{
      outline: none;
    }
  }
  .body {
    padding: 5px 10px;
    width: 100%;
    flex: 1;
    overflow: auto;
  }
  .nav_tabs {
    /deep/.el-tabs__header .el-tabs__item {
      border-left: none;
      height: 25px;
      line-height: 25px;
      &.is-active{
        padding-right: 10px;
      }
    }
    /deep/ .el-tabs__nav-wrap {
      background: white;
    }
  }
  /deep/ .el-drawer__header {
    margin: 0px;
    padding: 3px 10px;
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
</style>
