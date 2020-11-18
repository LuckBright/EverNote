<template>
  <div>
    <el-row style="margin-bottom:20px;">
      <el-col :span="24">
        <strong>收费项目</strong>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-select
          v-model="value"
          filterable
          remote
          reserve-keyword
          clearable
          :placeholder="filterPlaceholder"
          @change="change"
          :remote-method="remoteMethod"
          :value-key="'id'"
          style="width:100%;"
          :loading="loading">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item">
            <span class="rightMargin">{{`${item.name}`}}</span>
            <span class="rightMargin"><sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="item.serviceClassification"></sys-value></span>
            <span class="rightMargin">{{`${item.unitName || ''}`}}</span>
            <span class="rightMargin">{{`${item.spec || ''}`}}</span>
            <span class="rightMargin">{{`${item.price || ''}${item.price? '元': ''}`}}</span>
            <span class="rightMargin">{{`${item.code || ''}`}}</span>
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- <el-row style="margin-top:20px;text-align:right;">
      <el-col :span="24">
        <el-button type="primary" @click="prev">确认</el-button>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
import api from '../../store/packagemanagement/api'
import sysvalue from '@/warehouse/store/sysvalueapi'
export default {
  props: {
    visitType: {
      type: String,
      default: '1'
    },
    filterAdviceType: {
      type: String,
      default: ''
    },
    filterPlaceholder: {
      type: String,
      default: '请输入收费项目'
    }
  },
  data () {
    return {
      api,
      sysvalue,
      loading: false,
      params: {
        name: '',
        pagesize: 50,
        scene: 1,
        serviceClassificationList: []
      },
      value: [],
      valObj: {},
      options: [],
      timeout: null
    }
  },
  methods: {
    onEmpty () { // 添加医嘱项成功清空输入框
      this.value = ''
      this.remoteMethod('')
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        clearTimeout(this.timeout)
        this.timeout = window.setTimeout(() => {
          this.params.name = query
          api.searchForBrowser(this.params).then(rs => {
            this.options = rs.data
            this.loading = false
          })
        }, 300)
      } else {
        this.options = []
      }
    },
    change (val) {
      if (val) {
        this.valObj = val
        this.prev()
      } else {
        this.valObj = {}
      }
    },
    prev () {
      this.$emit('submitEvent', this.valObj)
    }
  },
  created () {
    if (!this.filterAdviceType) {
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(result => {
        let adviceType = []
        for (let item of result) {
          adviceType.push(item.id)
        }
        this.params.serviceClassificationList = adviceType
      })
    } else {
      this.params.serviceClassificationList = this.filterAdviceType.split(',')
    }
  }
}
</script>
<style scoped>
  .rightMargin {
    margin-right: 10px;
  }
</style>
