<template>
    <div>
       <el-select
        v-model="diagnosisId"
        filterable
        clearable
        remote
        :multiple="isMore?isMore:false"
        value-key="id"
        :reserve-keyword="false"
        placeholder="请输入关键词"
        :remote-method="searchDiagnosisList"
        :loading="diagnosisListLoading">
        <el-option
        v-for="item in diagnosisOptions"
        :key="item.id"
        :label="item.name"
        :value="isItem?item:item.id">
        <div class="disease_warp">
          <span>{{item.diseaseCodeCategory}}</span>
          <span>{{item.diseaseCode}}</span>
          <span>{{item.name}}</span>
        </div>
        </el-option>
    </el-select>
    </div>
</template>
<script>
import urlMap from '@/util/urls'
import {request} from '@/util/req'
import {debounce1 as debounce} from '@/util/common'
export default {
  props: ['value', 'isMore', 'isItem', 'isLoad'],
  data () {
    return {
      disOptions: [],
      diagnosisId: '',
      diagnosisListLoading: false,
      diagnosisOptions: []
    }
  },
  watch: {
    value (val) {
      this.diagnosisId = val
    },
    diagnosisId (val) {
      this.$emit('input', val)
    },
    isLoad (val) {
      if (val) {
      }
    }
  },
  methods: {
    // 远程搜索诊断
    searchDiagnosisList: debounce(function (query) {
      this.diagnosisListLoading = true
      request(urlMap.searchDiagnose, {name: query || ''}, 'get').then(res => {
        this.diagnosisListLoading = false
        if (res.head.errCode === 0) {
          this.diagnosisOptions = res.data.resultList.map(item => ({
            id: item.id,
            diseaseCode: item.diseaseCode,
            name: item.diseaseName,
            diseaseCodeCategory: item.diseaseCodeCategory,
          }))
        }
      })
    }, 200)
  }
}
</script>
<style scoped>
.disease_warp span{display: inline-block;padding: 0 5px;}
</style>

