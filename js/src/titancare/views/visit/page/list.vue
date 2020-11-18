<template>
  <div class="layout_inner">
    <div class="main_head">
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :inline="true"
        @query="list(true)">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list(true)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" @click="newadd">新增</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      border
      is-auto-height
      :columns="allColumns"
      :params.sync="queryObj"
      :url="url"
      method="get"
      :maxBtnCount="5"
      request="requestIh"
      @eventChange="eventChange">
      <template slot="status" slot-scope="scope">
        <div v-if="scope.row.status === 1">
          未发布
        </div>
        <div v-else style="display:flex;">
          <span class="mr10">已发布</span>
          <el-image
            v-if="scope.row.qrCodeFile"
            style="width: 20px; height: 20px"
            :src="$ever.fileUrl2 + scope.row.qrCodeFile"
            :preview-src-list="[$ever.fileUrl2 + scope.row.qrCodeFile]"
          >
            <template slot="error">
              <i class="el-icon-warning-outline"></i>
            </template>
          </el-image>
        </div>
      </template>
    </ever-table>
    <new-add ref="newadd" :category="category"></new-add>
  </div>
</template>
<script>
import newAdd from './newadd.vue'
import bus from '@/util/eventbus'
import { requestIh } from '@/util/req'
import urlMap from '@/titancare/utils/urls.js'
import { routerArr } from './routeconfig'

let querySchema = [
  {
    name: 'status',
    label: '发布状态：',
    comp: 'el-select',
    props: {
      placeholder: '发布状态',
      options: [
        { id: '1', name: '未发布' },
        { id: '2', name: '已发布' }
      ],
      clearable: true
    }
  },
  {
    name: 'name',
    comp: 'el-input',
    label: '预问诊名称：',
    props: {
      placeholder: '请输入内容',
      clearable: true
    }
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.orgId = localStorage.getItem('CLINICID') || localStorage.getItem('TENANTID')
    queryObj.pageSize = 20
    return {
      querySchema,
      queryObj,
      category: '1',
      status: '1',
      rowData: {},
      allColumns: [
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '350',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'preview',
                label: '查看'
              },
            ]
            if (row.status !== 2) {
              baseBtns = baseBtns.concat([
                {
                  prop: 'modify',
                  label: '编辑'
                },
                'del',
              ])
            }
            if (row.status === 1) {
              baseBtns = baseBtns.concat([
                {
                  prop: 'publish',
                  label: '发布'
                },
              ])
            }
            return baseBtns
          }
        },
        {
          prop: 'name',
          label: '预问诊名称',
        },
        {
          prop: 'gender',
          label: '性别',
          formatter: ({ row }) => {
            return row.visitType === 1 ? '初诊' : '复诊'
          },
        },
        {
          prop: 'status',
          label: '发布状态',
          slot: 'status'
        },
        {
          prop: 'weight',
          label: '权重',
        },
        {
          prop: 'modifyTime',
          label: '更新时间',
        },
      ],
      url: urlMap.preConsultation.search,
    }
  },
  created () {
  },
  watch: {
    '$route': {
      handler (val) {
        switch (val.name) {
          case 'group':
            this.queryObj.category = '1'
            this.category = '1'
            break
          case 'org':
            this.queryObj.category = '2'
            this.category = '2'
            break
          case 'dpt':
            this.queryObj.category = '3'
            this.category = '3'
            break
          case 'personage':
            this.queryObj.category = '4'
            this.category = '4'
            break
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    list () {
      this.$refs.table.list(true)
    },
    eventChange ({ prop, row, col }) {
      this[prop] && this[prop](row)
    },
    newadd () {
      this.$refs.newadd.dialogVisible = true
    },
    del (row) {
      requestIh(urlMap.preConsultation.deleteById, { id: row.id }).then(res => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
        this.list()
      }, _ => { })
    },
    modify (row) {
      this.rowData = row
      this.$router.push({
        name: routerArr[Number(row.category) - 1] + 'edit',
        query: {
          id: row.questionId,
          categoryId: row.category
        }
      })
    },
    publish (row) {
      this.rowData = row
      this.$router.push({
        name: routerArr[Number(row.category) - 1] + 'answer',
        params: {
          id: row.questionId,
          categoryId: row.category
        }
      })
    },
    preview (val) {
      window.open(this.$ever.host + this.$ever.surveyIndex + '/survey/preview/' + val.questionId + '/1/2/1')
    }
  },
  beforeDestroy () {
    bus.$emit('modify', this.rowData)
  },
  components: {
    newAdd
  }
}
</script>
