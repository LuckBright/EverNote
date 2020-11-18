<template>
  <div id="baseinfo">
    <el-row class="table">
      <div v-if="!filedData.length" style="display: flex;justify-content:center;">
        <div class="imgContainer">
          <div class="pt40 pl20">
            <span>没有启用任何条件筛选配置<br></span>
            <span class="pl30">点击右上角添加</span>
          </div>
        </div>
      </div>
      <div v-else v-for="item in filedData" :key="item.id" class="mb10 height">
        <el-col :span="5" class="cGray alg_r ">{{item.name + ' :'}}</el-col>
        <el-col :span="18" class="pl10">
          <span v-if="!item.isDynamic">
            <span v-if="item.keyName !== 'age'">
              {{relationList.map(v => v.id === item.valueJudge ? v.name : '').join().replace(/,/g, '')}}
              {{item.customAnalysis && item.customAnalysis.showColumn ? item.propertyValue[item.customAnalysis.showColumn] : item.propertyValue}}
            </span>
            <span v-else>
              <span v-if="item.valueJudge === 8">
                {{item.propertyValue.map(v => ((v.year ? v.year + '岁' : '') + (v.month ? v.month + '月' : ''))).join().replace(/,/g, ' - ')}}
              </span>
              <span v-else>
                {{relationList.map(v => v.id === item.valueJudge ? v.name : '').join().replace(/,/g, '')}}
                {{(item.propertyValue.year + '岁') + (item.propertyValue.month + '月')}}
              </span>
            </span>
          </span>
          <span v-if="item.isDynamic">
            {{relationList.map(v => v.id === item.valueJudge ? v.name : '').join().replace(/,/g, '')}}
            {{item.customAnalysis && item.customAnalysis.showColumn && item.propertyValue.map(val => val[item.customAnalysis.showColumn]).join()}}
          </span>
        </el-col>
        <el-col :span="1">
          <i v-if="showBtn" class="cGray iconfont icon-bingli-bianji f12" @click="showDetail(item)"></i>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
import { request } from '@/util/req'
import { relationList } from '@/follow/util/model'
import urlMap from '@/util/urls'
export default {
  props: {
    'templateId': {
      type: String,
      default: ''
    },
    'showBtn': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      filedData: [],
      relationList
    }
  },
  created () {
    this._setFormInitData()
  },
  methods: {
    async _setFormInitData () {
      await request(urlMap.follow.propertyRuleTemplate.getByTemplateId, {
        templateId: this.templateId
      }, 'get').then(rs => {
        if (!rs.data) {
          this.filedData = []
          return
        }
        if (rs.head.errCode === 0 && rs.data.rule) {
          this.filedData = rs.data.rule.items
          this.$emit('showLength', rs.data.rule.items.length)
        }
      })
    },
    showDetail (val) {
      this.$emit('showDetail', val)
    }
  }
}
</script>
<style scoped>
.height {
  min-height:20px;
}
.imgContainer{
  width: 230px;
  height: 183px;
  background-image: url(../../../assets/img/bubble.png);
  background-repeat: no-repeat;
}
.pt40{
  padding-top: 70px;
}
</style>
