<template>
  <div v-if="value" class="ever_diagnosis_wrap">
    <el-autocomplete
      select-when-unmatched
      v-model="value.diseaseName"
      custom-item="custom-item-li"
      :fetch-suggestions="(name, callback) => {querySearchAsync(name, callback)}"
      placeholder="请输入诊断内容"
      @select="(val) => {handleSelect(val)}"
    ></el-autocomplete>
    <div class="tips_txt">{{value.diseaseCode}}</div>
  </div>
</template>

<script>
import api from '@/workspace/store/medicalapi'
import Vue from 'vue'
Vue.component('custom-item-li', {
  functional: true,
  render: function (h, ctx) {
    let item = ctx.props.item
    return h('li', ctx.data, [
      h('span', { attrs: { class: 'name' } }, [item.value]),
      h('label', { attrs: { class: 'code' } }, [item.diseaseCode])
    ])
  },
  props: {
    item: { type: Object, required: true }
  }
})
export default {
  props: ['value', 'type'],
  data () {
    return {
      api,
      loading: false,
      manulist: [],
      diseaseId: null,
      positionData: [],
      currentDisease: {},
      rules: {
        diseaseType: [
          { required: true, message: '必填项', trigger: ['blur', 'change'], type: 'number' }
        ],
        diseaseName: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    remoteMethod (name, index) {
      if (!name) {
        this.manulist = []
      } else {
        this.loading = true
        api.searchDiagnose({
          type: this.value[index].diseaseType || 2,
          origId: this.$store.state.currentUser.organizationId,
          name: name
        }).then(res => {
          this.loading = false
          this.manulist = res.data.resultList
          this.value[index].diseaseOrigId = this.getDiseaseOrigId({ value: name })
        })
      }
    },
    querySearchAsync (name, callback) {
      this.api.searchDiagnose({
        type: this.value.diseaseType || 2,
        origId: this.$store.state.currentUser.organizationId,
        name: name
      }).then(rs => {
        this.loading = false
        rs.data.resultList.forEach(item => {
          item.value = item.diseaseName
        })
        this.diagnoseList = rs.data.resultList
        this.value.diseaseOrigId = this.getDiseaseOrigId({ value: name })
        callback(rs.data.resultList)
      })
    },
    handleSelect (val) {
      let params = {}
      params.visitNumber = this.$route.query.visitSn
      params.scene = 1
      params.apply = { sn: '100-01', facts: [] }
      params.apply.facts.push({
        diseaseStatus: val.status,
        diseaseName: val.diseaseName,
        diseaseCode: val.diseaseCode
      })
      this.currentDisease = val
      this.value.position = ''
      this.value.diseaseCode = val.diseaseCode
      this.value.diseaseOrigId = val.id || this.getDiseaseOrigId(val)
    },
    getDiseaseOrigId (val) {
      let ids = this.manulist.filter(item => {
        return item.value === val.value
      })
      return ids.length > 0 ? ids[0].id : null
    }
  }
}
</script>

<style lang="scss" scoped>
.ever_diagnosis_wrap {
  overflow: hidden;
  .tips_txt {
    line-height: 20px;
    font-size: 12px;
    color: #999;
    padding: 0 10px;
  }
  .el-autocomplete {
    width: 100%;
    /deep/ .el-input-group__append {
      /deep/ .el-input__inner {
        color: #666;
        border-color: transparent !important;
      }
    }
  }
}
</style>
