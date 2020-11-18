<template>
  <div id="sourcechart">
    <div class="el-breadcrumb ever_breadcrumb"></div>
    <div>
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        :is-query="true"
        @query="querylink()"
        class="pdt20"
      >
        <template slot="sourceName">
          <el-select v-model="value2" placeholder="请选择">
            <el-option v-for="item in options2" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </template>
      </ever-form2>
      <el-row>
        <el-col :span="8">
          <el-card class="sourcelist">
            <div @click="linkSourcelist">
              <p>新增渠道</p>
              <p>
                <span @click="linkQueryWeek()">{{mainobj.channelWeekNum}}</span>个
              </p>
              <p>总渠道数：{{mainobj.channelTotalNum}}个</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="sourcelist ml20">
            <div @click="linkSourcemeber">
              <p>新增客户</p>
              <p>
                <span @click="linkQueryMem()">{{mainobj.memberWeekNum}}</span>人
              </p>
              <p>总客户数：{{mainobj.memberTotalNum}}人</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="sourcelist ml20">
            <div @click="linkSourcekpi">
              <p>新增业绩</p>
              <p>
                <span @click="linkQueryKpi()">{{mainobj.settleWeekNum}}</span>元
              </p>
              <p>总业绩：{{mainobj.settleTotalNum | formatToFinacial}}元</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '../store/sourceapi'
import reportapi from '@/bi/store/reportsetapi'
import list from '@/util/list'

let querySchema = [
  {
    name: 'sourceName',
    label: '',
    comp: 'custom',
    span: 4
  },
  {
    name: 'content',
    clearable: false,
    label: '',
    comp: 'el-input',
    props: {
      placeholder: '请输入关键字'
    },
    span: 6
  }
]
export default {
  mixins: [list],
  data () {
    let start = this.$moment().startOf('isoWeek').format('YYYY-MM-DD')
    let end = this.$moment().format('YYYY-MM-DD')
    let times = []
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      queryObj,
      querySchema,
      obj: {},
      start,
      end,
      times,
      mainobj: {},
      reportapi,
      value2: '',
      options2: [
        {
          id: 'sourceName',
          label: '渠道名称'
        },
        {
          id: 'memberName',
          label: '客户姓名'
        }
      ],
      api
    }
  },
  created () {
    this.getStatistics()
  },
  methods: {
    linkDetailPage (id) {
      this.$router.push({ path: '/crm/sourcedetail', query: { id: id } })
    },
    linkSourcelist () {
      this.$router.push({ path: '/crm/sourcelist' })
    },
    linkSourcemeber () {
      this.$router.push({ path: '/crm/sourcemember' })
    },
    linkQueryMem () {
      this.times.push(this.start, this.end)
      this.$router.push({ path: '/crm/sourcemember', query: { q: JSON.stringify({ start: this.start, end: this.end, times: this.times }) } })
      event.stopPropagation()
    },
    linkQueryWeek () {
      this.times.push(this.start, this.end)
      this.$router.push({ path: '/crm/sourcelist/', query: { q: JSON.stringify({ start: this.start, end: this.end, times: this.times }) } })
      event.stopPropagation()
    },
    getStatistics () {
      this.api.getStatistics().then(rs => {
        if (rs.data) {
          this.mainobj = rs.data
        }
      })
    },
    linkSourcekpi () {
      this.$router.push({ path: '/crm/sourcekpi' })
    },
    linkQueryKpi () {
      this.times.push(this.start, this.end)
      this.$router.push({ path: '/crm/sourcekpi', query: { q: JSON.stringify({ start: this.start, end: this.end, times: this.times }) } })
      event.stopPropagation()
    },
    addCreatesource () {
      this.$router.push({ name: 'createsource', path: 'createsource' })
    },
    querylink () {
      let querykey
      querykey = this.value2
      if (querykey && this.queryObj.content) {
        if (querykey === 'sourceName') {
          this.$router.push({ path: '/crm/sourcelist/', query: { q: JSON.stringify({ name: this.queryObj.content }) } })
        } else if (querykey === 'memberName') {
          this.$router.push({ path: '/crm/sourcemember/', query: { q: JSON.stringify({ name: this.queryObj.content }) } })
        }
      }
    }
  },
  components: {
  }
}
</script>
<style scoped>
#sourcechart .title .el-col {
  height: 36px;
  line-height: 36px;
}
#sourcechart .title .el-col strong {
  font-size: 18px;
}
#sourcechart .title .el-col span {
  font-size: 12px;
}
#sourcechart .tab {
  vertical-align: top;
}
#sourcechart .tab .el-button {
  margin: 0;
  border-radius: 0;
  width: 25%;
}
.sourcelist {
  height: 180px;
  vertical-align: middle;
  font-size: 14px;
  color: #666666;
  font-family: PingFangSC-Regular;
}
.sourcelist p {
  text-align: center;
}
.sourcelist span {
  color: #000;
  font-size: 19px;
  font-weight: bold;
}
.content {
  height: 320px;
}
.nest {
  height: 500px;
}
.ml20 {
  margin-left: 20px;
}
.mt20 {
  margin-top: 20px;
}
.pdt20 {
  padding-top: 20px;
}
.sourcecontent {
  padding: 0 20px 20px 20px;
  margin-top: 20px;
}
</style>
