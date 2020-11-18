<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="startTime">
          <el-date-picker
            v-model="value"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :clearable="false"
          >
          </el-date-picker>
        </template>
        <template slot="visitOrgId">
          <ever-org-select
            width="100px"
            v-model="queryObj.visitOrgId"
            fields="id"
            @change="changeOrgId"
            :props="{ clearable: false }"
            :params="{ everQueryType: 'isLogin' }"
            type="select"
          >
          </ever-org-select>
        </template>
        <template slot="visitTenantSubjectCode">
          <ever-subject-select
            placeholder="全部科室"
            :props="{ collapseTags: true }"
            v-model="queryObj.visitTenantSubjectCode"
            multiple
            type="select"
            :params="params"
            fields="id"
          ></ever-subject-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="box-iframe">
      <iframe
        :src="url"
        style="width:100%;height:85vh;margin: 0 auto;"
        frameborder="0"
        v-if="show"
      ></iframe>
      <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
    </div>
  </div>
</template>

<script>
import storage from '@/util/storage'

let querySchema = [
  {
    name: 'startTime',
    label: '日期时间',
    comp: 'custom'
  },
  {
    name: 'visitOrgId',
    comp: 'custom',
    label: '机构名称',
  },
  {
    name: 'visitTenantSubjectCode',
    comp: 'custom',
    label: '科室名称',
  },
]
export default {
  created () {
    this.url += `${storage.getLocalStorage('TOKEN')}`
    this._url = this.url
    this.queryObj.startTime = this.$moment().subtract('days', 29).format('YYYY-MM-DD') + ' 00:00:00'
    this.queryObj.endTime = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
    this.value = [this.queryObj.startTime, this.queryObj.endTime]
    this.queryObj.visitOrgId = storage.getLocalStorage('CLINICID')
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.startTime = this.$moment().subtract('days', 29).format('YYYY-MM-DD') + ' 00:00:00'
    return {
      querySchema,
      queryObj,
      style: 'width:100%;height:85vh;',
      key: 0,
      url: `${this.$ever.api}/report-engine/reportJsp/showReportRedefine.jsp?rpx=phr_jgjzrc.rpx&x-access-token=`,
      show: false,
      value: ''
    }
  },
  watch: {
    queryObj: {
      handler (val) {
        for (let key in val) {
          if (val[key] == null) {
            val[key] = ''
          }
        }
        if (val.startTime && val.visitOrgId) {
          if (!val.startTime.includes(':')) {
            val.startTime += ' 00:00:00'
          }
          if (!val.endTime.includes(':')) {
            val.endTime += ' 23:59:59'
          }
        }
        this.key++
        this.mergeURL()
      },
      deep: true
    },
    value: {
      handler (val) {
        this.queryObj.startTime = val[0]
        this.queryObj.endTime = val[1]
      },
      deep: true
    }
  },
  methods: {
    changeOrgId () {
      this.queryObj.visitTenantSubjectCode = ''
    },
    resetSearchForm () {
      this.list()
    },
    /**
     * 请求列表
     */
    list () {
      this.key++
    },
    mergeURL () {
      this.show = false
      this.url = this._url
      const _obj = JSON.parse(JSON.stringify(this.queryObj))
      Object.keys(_obj).forEach(val => {
        if (Array.isArray(_obj[val])) {
          _obj[val] = _obj[val].join('","')
        }
        if (_obj[val].includes('.') || _obj[val].includes(',')) {
          this.url = this.url + ('&' + val + '=' + `"${_obj[val]}"`)
        } else {
          this.url = this.url + '&' + val + '=' + `${_obj[val]}`
        }
      })
      this.url = encodeURI(this.url)
      this.show = true
    }
  },
  components: {
  },
  computed: {
    params () {
      return {
        type1CodeList: ['01'],
        type2CodeList: [],
        orgId: this.queryObj.visitOrgId,
        everQueryType: 'out',
        status: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-iframe {
  position: relative;
}
</style>
