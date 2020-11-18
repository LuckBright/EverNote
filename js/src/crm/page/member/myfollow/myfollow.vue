<template>
  <div>
     <el-row>
      <el-col align="right">
        <el-button  @click="addfollow" type="primary">添加随访</el-button>
      </el-col>
    </el-row>
      <ever-table
      ref="table"
      border
      :columns="columns"
      :url="url"
      :params="params"
      :show-index="true"
      index-label
      :fixed-height="23"
      fixed-elements="js-fixed-header js-classify"
      @update:params="changeParams"
      >
        <template slot="name" slot-scope="scope">
          <a
          style="color: #217DE3;"
          class="ellipsis"
          :href="$ever.followIndex + '/follow/taskmanage/detail/' + scope.row.id"
          target="_blank"
          >{{scope.row.name}}</a>
        </template>
      </ever-table>
        <add-follow ref="addFollow" :isInterclinic="false" :isMember="true" :patientIds="patientId"></add-follow>
  </div>
</template>

<script>
import urlMap from '@/util/urls'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import addFollow from '@/follow/page/template/dialog-addfollow'
import { listDestValue } from '@/util/common'
import { materialStatus } from '@/follow/util/model'
export default {
  components: {
    addFollow
  },
  data: function () {
    return {
      deptList: [],
      classify: null,
      url: urlMap.follow.task.selectJobListById,
      patientId: this.$route.params.patientId,
      detailUrl: this.$route.path,
      columns: [
        {
          prop: 'name',
          label: '随访计划名',
          type: 'eventText',
          slot: 'name'
        },
        {
          prop: 'doctorName',
          label: '就诊医生',
        },
        {
          prop: 'orgName',
          label: '机构',
        },
        {
          prop: 'deptName',
          label: '科室',
        },
        {
          prop: 'creatorName',
          label: '创建人',
          formatter: ({ value }) => {
            if (value === 'system') {
              return '系统'
            } else {
              return value
            }
          }
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'status',
          label: '状态',
          formatter: ({ value }) => listDestValue(materialStatus, parseInt(value))
        }
      ],
      params: {},
      queryObj: {}
    }
  },
  mounted () {
  },
  created () {
    this.$bus.$off('addmemberfollow')
    this.$bus.$on('addmemberfollow', val => {
      if (val) {
        if (this.params.patientId) {
          this.list(true)
        }
      }
    })
  },
  methods: {
    addfollow () {
      this.$refs.addFollow.open()
    },
    list (searchFirstPage = true) {
      this.params = {
        _uuid: U(),
        searchFirstPage,
        patientId: this.patientId
      }
    },
    changeParams (params) {
      this.queryObj = { ...this.queryObj, ...params }
      this.list(false)
    }
  }
}
</script>

<style scoped>
.status-group {
  margin: 0;
  padding: 0;
}
.status-group li {
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #d9dee5;
  cursor: pointer;
}
.status-group li > div:nth-child(1) {
  margin-left: 48px;
}
.status-group li > div:nth-child(2) {
  margin-right: 12px;
}
.on {
  background: #2980e0;
  color: #ffffff;
}
.classify {
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #000000;
  margin-top: 10px;
  font-weight: 700;
}
.el-form--inline /deep/ .el-form-item.dn {
  display: none;
}
</style>
