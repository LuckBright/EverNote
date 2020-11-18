<template>
  <div class="oa runqian">
    <temp
      v-if="code"
      :key="code"
      :code="code"
      :pageObject="pageObject">
    </temp>
  </div>
</template>
<script>
import temp from '@/bi/page/temp.vue'
import { runqianArr } from './reportconfig'
import { Trim } from '@/util/common'

export default {
  components: {
    temp
  },
  props: {
    'rqCode': {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      code: '',
      runqianArr,
      pageObject: {
        name: '医技执行项目汇总表（润乾）',
        code: 'report_work_mt_zxltjmx_new',
        schema: ['orgId', 'deptId', 'doctorId', {
          name: 'itemType',
          label: '项目名称', // 项目名称
          span: 4,
        }, 'visitStartDate'],
        defaultQueryObj: {
          orgId: localStorage.getItem('CLINICID'),
          startTime: this.$moment().format('YYYY-MM-DD 00:00:00'),
          endTime: this.$moment().format('YYYY-MM-DD 23:59:59'),
        },
      }
    }
  },
  created () {
  },
  watch: {
    'rqCode': {
      handler (val) {
        if (val) {
          this.code = val
          this.handleReportShow(val)
        }
      },
      deep: true,
      immediate: true
    },
    '$route.query.code': {
      handler (val) {
        if (val) {
          this.code = val
          this.handleReportShow(val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleReportShow (code) {
      let tmp = this.runqianArr.filter(item => {
        return Trim(item.code) === Trim(code)
      })
      if (tmp.length > 0) {
        this.pageObject = tmp[0]
      } else {
        this.pageObject = {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.runqian {
  height: calc(100vh - 114px);
  /deep/ .layout_inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    .box-iframe {
      flex: 1;
      overflow: auto;
      & > iframe {
        height: 99% !important;
      }
    }
  }
}
</style>
