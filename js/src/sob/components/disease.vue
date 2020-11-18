<template>
  <div>
    <el-autocomplete
      v-model.trim="item.diseaseName"
      popper-class="zhenduan-autocomplete"
      custom-item="custom-item-li"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入诊断内容"
      @select="handleSelect">
       <el-select v-model="item.position" filterable placeholder="部位" slot="append" v-if="item.positionData && item.positionData.length > 0" style="width: 60px;">
        <el-option
          v-for="opt in item.positionData"
          :key="opt.id"
          :label="opt.position"
          :value="opt.position">
        </el-option>
      </el-select>
    </el-autocomplete>
    <div class="graylabel" v-if="item.diseaseName && item.diseaseCode">({{item.diseaseCode}})</div>
  </div>
</template>
<script type="text/javascript">
  import api from '@/workspace/store/medicalapi'
  export default {
    props: ['value'],
    data () {
      return {
        loading: false
      }
    },
    computed: {
      'item': {
        set (val) {
          this.$emit('input', val)
        },
        get () {
          return this.value
        }
      }
    },
    methods: {
      querySearchAsync (name, callback) {
        if (!name) {
          this.item.position = ''
          callback([])
          return false
        }
        api.searchDiagnose({
          type: this.item.diseaseType || 2,
          origId: this.$store.state.currentUser.organizationId,
          name: name
        }).then(rs => {
          this.loading = false
          rs.data.resultList.forEach(item => {
            item.value = item.diseaseName
          })
          this.diagnoseList = rs.data.resultList
          this.item.diseaseOrigId = this.getDiseaseOrigId({value: name})
          callback(rs.data.resultList)
        })
      },
      handleSelect (val) {
        let params = {}
        params.visitNumber = this.$route.query.visitSn
        params.scene = 1
        params.apply = {sn: '100-01', facts: []}
        params.apply.facts.push({
          diseaseStatus: val.status,
          diseaseName: val.diseaseName,
          diseaseCode: val.diseaseCode
        })
        // this.currentDisease[index] = val
        this.item.position = ''
        this.item.diseaseCode = val.diseaseCode
        this.item.diseaseOrigId = val.id || this.getDiseaseOrigId(val)
        this.getPosition(this.item.diseaseOrigId).then(data => {
          if (data && data.length > 0) {
            // this.item.positionData = data
            this.$set(this.item, 'positionData', data)
          } else {
            // this.item.positionData = []
            this.$set(this.item, 'positionData', [])
          }
        })
      }
    }
  }
</script>
