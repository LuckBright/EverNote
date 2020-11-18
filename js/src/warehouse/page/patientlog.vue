<template>
  <div class="layout_inner">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="opTime">
          <ever-range-picker date-type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                             outformat="YYYY-MM-DD HH:mm:ss" :start.sync="queryObj.start" :end.sync="queryObj.end"></ever-range-picker>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
<!--            <el-button size="small" @click="resetForm()">重置</el-button>-->
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div class="expand-all js-expand-all">
      <span class="flag-box">日志记录</span>
      <el-button type="text" size="small" @click="toggleExpand">{{allExpanded ? '全部收起' : '全部展开'}}</el-button>
    </div>
    <ever-table
      ref="table"
      :columns="columns"
      :url="url"
      :row-class-name="rowClassName"
      show-expand
      table-class="no-padding-expanded-cell"
      fixed-elements="js-main-head js-expand-all"
      :params.sync="queryObj"
      @afterSearch="afterSearch"
    >
      <template slot="opType" slot-scope="scope">
        <template v-if="scope.row.opType">
          <sys-value type="THC_SYS_OP_TYPE" :code="scope.row.opType"></sys-value>
        </template>
      </template>
      <template slot="expand" slot-scope="scope">
        <ul class="expand-ul" v-if="scope.row.contentDtos && scope.row.contentDtos.length">
          <li class="expand-item" v-for="(item, index) in scope.row.contentDtos" :key="index">
            <span class="field">{{item.field}}</span>
            <span class="before" v-html="getResult(item.before, item.after).before"></span>
            <span class="arrow"><i class="iconfont icon-zhuyuan-yizhu-tonggu"></i></span>
            <span class="after" v-html="getResult(item.before, item.after).after"></span>
          </li>
        </ul>
      </template>
    </ever-table>
  </div>
</template>
<script>
  import urlMap from '@/util/urls'
  import {tableColWidth} from '@/util/table-config'
  import {dateFormat} from '@/util/common'
  import {compareStr} from '@/util/compare-string'
  import './assets/index.scss'
  import storage from '@/util/storage'

  // todo 查询入参需要和宏伟再定一下
  const querySchema = [
    {
      name: 'opBy',
      props: {
        placeholder: '操作人姓名/登录账号',
      },
    },
    {
      name: 'opType',
      comp: 'sys-type',
      props: {
        placeholder: '操作类型',
        code: 'THC_SYS_OP_TYPE'
      }
    },
    {
      name: 'orgId',
      comp: 'ever-org-select',
      props: {
        type: 'select',
        fields: 'id',
        placeholder: '机构',
        params: {
          everQueryType: 'isLogin'
        }
      }
    },
    {
      name: 'patientInfo',
      props: {
        placeholder: '患者姓名/档案号',
        clearable: true,
      },
    },
    {
      name: 'module',
      props: {
        placeholder: '输入业务模块',
        clearable: true,
      },
    },
    {
      name: 'opTime',
      comp: 'custom',
      parentClass: 'common-datetime-range-picker',
      props: {
        valueformat: 'yyyy-MM-dd HH:mm:ss',
        showformat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择时间',
      },
    },
  ]
  export default {
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.opTimeParam = ''
      queryObj.start = ''
      queryObj.end = ''
      queryObj.orgId = storage.getLocalStorage('CLINICID')
      return {
        url: urlMap.userOpLogInfo.getUserOpLogInfos,
        columns: [
          {
            prop: 'opByName',
            label: '操作人',
            formatter ({row}) {
              return `${row.opByName}${row.patientMobile ? `[${row.patientMobile}]` : ''}`
            }
          },
          {
            prop: 'opType',
            label: '操作类型',
            slot: 'opType',
            showOverflowTooltip: true,
          },
          {
            prop: 'patientName',
            label: '患者姓名',
            formatter ({row}) {
              return `${row.patientName}${row.patientNo ? `[${row.patientNo}]` : ''}`
            }
          },
          {
            prop: 'opModuleOne',
            label: '业务模块',
            formatter ({row}) {
              return `${row.opModuleOne || ''}${row.opModuleTwo ? `/${row.opModuleTwo}` : ''}`
            }
          },
          {
            prop: 'opTime',
            label: '操作日期',
            width: tableColWidth.datetimeAllW160,
            formatter ({value}) {
              return dateFormat(value)
            }
          },
        ],
        querySchema,
        queryObj,
        allExpanded: false,
        tableData: [],
      }
    },
    created () {
    },
    mounted () {
      this.list(false)
    },
    watch: {
      'queryObj.opTime' () {
        this.queryObj.opTime = this.queryObj.opTime ? dateFormat(this.queryObj.opTime) : ''
      }
    },
    methods: {
      list (searchFirstPage = true) {
        this.$refs.table.list(searchFirstPage)
      },
      getResult (before, after) {
        const res = compareStr(before, after)
        return {
          before: `${res.map(item => item.type === 'same' ? item.value : `<span class="diff-before">${item.str1}</span>`).join('')}`,
          after: `${res.map(item => item.type === 'same' ? item.value : `<span class="diff-after">${item.str2}</span>`).join('')}`,
        }
      },
      rowClassName ({row}) {
        if (!(row.contentDtos && row.contentDtos.length)) {
          return 'non-expand-row'
        } else {
          return ''
        }
      },
      toggleExpand () {
        this.allExpanded = !this.allExpanded
        this.tableData.forEach(item => {
          if (item.contentDtos && item.contentDtos.length) {
            this.$refs.table.$refs.everTable.toggleRowExpansion(item, this.allExpanded)
          }
        })
      },
      afterSearch ({result}) {
        this.tableData = result
        // 查询完成之后，根据当前的展开状态处理数据
        this.$nextTick(() => {
          this.tableData.forEach(item => {
            if (item.contentDtos && item.contentDtos.length) {
              this.$refs.table.$refs.everTable.toggleRowExpansion(item, this.allExpanded)
            }
          })
        })
      },
      resetForm () {
        this.$refs.form.resetForm()
        this.list()
      },
    },
  }
</script>
<style scoped lang="less">
.expand-ul {
  padding-left: 58px;
}
.expand-item {
  line-height: 30px;
  display: flex;
  .field {
    width: 7%;
  }
  .arrow {
    width: 5%;
    text-align: center;
    .icon-zhuyuan-yizhu-tonggu {
      color: #bbb;
    }
  }
  .before {
    width: 40%;
    text-align: right;
  }
  .after {
    width: 40%;
  }
}
.expand-all {
  display: flex;
  justify-content: space-between;
}

// 实现文字前3像素宽的蓝条
.flag-box {
  padding-left: 8px;
  position: relative;
  line-height: 32px;

  &::before {
    content: '';
    position: absolute;
    width: 3px;
    height: 14px;
    background: #1c7bef;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
}
</style>
