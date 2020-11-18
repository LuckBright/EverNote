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
            v-model="visitOrgId"
            placeholder="全部机构"
            fields="id"
            :props="{ clearable: true, multiple: true, collapseTags: true }"
            :params="{ everQueryType: 'isLogin' }"
            ref="orgEl"
            multiple
            @change="getAll"
            type="select"
          >
          </ever-org-select>
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
        :key="key"
        v-if="show"
      ></iframe>
      <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
    </div>
  </div>
</template>

<script>
import storage from '@/util/storage'
import { request } from '@/util/req'
import orgUrlMap from '@/manages/page/organization/utils/urls'
let multiSchema = [
  {
    name: 'startTime',
    label: '日期时间',
    comp: 'custom'
  },
  {
    name: 'visitOrgId',
    comp: 'custom',
    label: '机构名称'
  }
]
let singleSchema = [
  {
    name: 'startTime',
    label: '日期时间',
    comp: 'custom'
  },
  {
    name: 'visitOrgId',
    comp: 'ever-org-select',
    label: '机构名称',
    props: {
      type: 'select',
      fields: 'id',
      props: {
        clearable: false
      },
      params: {
        everQueryType: 'isLogin'
      }
    }
  }
]
export default {
  props: ['code', 'collapseTags'],
  data () {
    let querySchema
    if (this.collapseTags) {
      querySchema = multiSchema
    } else {
      querySchema = singleSchema
    }
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      queryObj,
      querySchema,
      visitOrgId: '',
      style: 'width:100%;height:85vh;',
      key: 0,
      show: false,
      value: '',
      url: `${this.$ever.api}/report-engine/reportJsp/showReportRedefine.jsp?rpx=phr_${this.code}.rpx&x-access-token=`
    }
  },
  watch: {
    queryObj: {
      handler (val) {
        for (let key in val) {
          if (val[key] == null) {
            val[key] = ''
          }
          if (Array.isArray(val[key])) {
            val[key] = val[key].join('","')
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
    resetSearchForm () {
      this.list()
    },
    list () {
      this.key++
    },
    getAll (val) {
      if (!val || !val.length) {
        this.queryObj.visitOrgId = this.allIds
      } else {
        this.queryObj.visitOrgId = val
      }
    },
    mergeURL () {
      this.show = false
      this.url = this._url
      Object.keys(this.queryObj).forEach(val => {
        if (this.queryObj[val].includes('.') || this.queryObj[val].includes(',')) {
          this.url = this.url + ('&' + val + '=' + `"${this.queryObj[val]}"`)
        } else {
          this.url = this.url + '&' + val + '=' + `${this.queryObj[val]}`
        }
      })
      this.show = true
    }
  },
  components: {
  },
  async created () {
    this.url += `${storage.getLocalStorage('TOKEN')}`
    this._url = this.url
    this.queryObj.startTime = this.$moment().subtract('days', 29).format('YYYY-MM-DD') + ' 00:00:00'
    this.queryObj.endTime = this.$moment().format('YYYY-MM-DD') + ' 23:59:59'
    this.value = [this.queryObj.startTime, this.queryObj.endTime]
    if (!this.collapseTags) {
      this.queryObj.visitOrgId = storage.getLocalStorage('CLINICID')
    }
    const res = await request(orgUrlMap.org.loadByStaffId, { staffId: localStorage.getItem('USERID'), staffLoginOrgPermission: '1' })
    this.allIds = res.data.pageList.map(item => { return item.id })
    if (this.collapseTags) {
      this.queryObj.visitOrgId = this.allIds
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.box-iframe {
  position: relative;
}
</style>
