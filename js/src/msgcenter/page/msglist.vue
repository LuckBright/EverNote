<template>
  <div class="layout_inner">
    <div class="main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true">
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list(true)">查询</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="text" style="cursor: default" v-if="isManage">每日发送短信最大数量为：{{maxCount}}</el-button>
            <el-button type="primary" @click="modifyMax()" v-if="isManage">修改数量</el-button>
            <el-button type="primary" @click="modifyRange()" :disabled="disabled">批量设置使用范围</el-button>
            <el-button type="primary" @click="edit({id: -1})">添加模版</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      :show-checkbox="true"
      :is-auto-height="true"
      :is-single-table="true"
      :is-record-url-params="false"
      @eventChange="eventChange"
      @selection-change="handleSelectionChange"
    ></ever-table>
    <dialog-max ref="dialogmax" @success="getDayMaxSendCount"></dialog-max>
    <dialog-use-range
      ref="dialogrange"
      :visible.sync="visibleRange"
      :templateIds="selectIds"
      @refresh="list"
    ></dialog-use-range>
  </div>
</template>
<script>
import dialogMax from './dialog.max'
import dialogUseRange from './dialog.use.range'
import urlMap from '@/msgcenter/store/urls'
import { request } from '@/util/req'

let querySchema = [
  {
    name: 'tempTypeId',
    comp: 'select',
    label: '分类',
    props: {
      options: [],
    }
  },
  {
    name: 'orgId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
      isOrg: false,
      type: 'select',
      fields: 'id',
    }
  },
  {
    name: 'deptId',
    comp: 'ever-subject-select',
    label: '科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
    }
  },
  {
    name: 'status',
    label: '状态',
    comp: 'el-select',
    props: {
      placeholder: '选择模板状态',
      filterable: true,
      clearable: true,
      valueKey: 'name',
      options: [
        { id: 1, name: '启用' },
        { id: 0, name: '禁用' }
      ]
    }
  }
]

export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      url: urlMap.msg.msgTemplate.getTemplatelist,
      allColumns: [
        {
          prop: 'id',
          label: '模版ID',
          width: '120'
        },
        {
          prop: 'type',
          label: '所属分类',
          width: '150'
        },
        {
          prop: 'name',
          label: '模版名称',
          showOverflowTooltip: true,
        },
        {
          prop: 'creator',
          label: '录入者',
          width: '150'
        },
        {
          prop: 'id',
          label: '状态',
          width: '150',
          formatter ({ value }) {
            if (value) {
              return '启用'
            } else {
              return '禁用'
            }
          },
        },
        {
          prop: 'createTime',
          label: '创建时间',
          align: 'center',
          width: '150'
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '150',
          align: 'center',
          btns: [
            'edit',
            'del',
          ],
        },
      ],
      querySchema: querySchema.slice(),
      queryObj,
      loading: false,
      visibleRange: false,
      maxCount: '',
      disabled: true,
      selectIds: [],
      isManage: this.$route.matched[0].meta.manage,
    }
  },
  created () {
    if (!this.isManage) {
      this.querySchema.splice(1, 1)
      this.queryObj.orgId = localStorage.getItem('CLINICID') || ''
      this.queryObj.optType = 1
    } else {
      this.queryObj.optType = 0
    }
    this.getClassList()
    this.getDayMaxSendCount()
  },
  watch: {
    // 机构变化之后 科室的值要清空掉
    'queryObj.orgId' (val) {
      this.$ever.getFieldFromSchema(querySchema, 'deptId').props.params = {
        orgId: val
      }
      this.queryObj.deptId = ''
    }
  },
  methods: {
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    // 选中内容
    handleSelectionChange (val) {
      this.selectIds = []
      val.forEach(item => {
        this.selectIds.push(item.id)
      })
      if (this.selectIds.length > 1) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 修改短信范围
    modifyRange () {
      this.visibleRange = true
    },
    // 修改最大数量
    modifyMax () {
      this.$refs.dialogmax.open()
    },
    // 获取最大数量
    getDayMaxSendCount () {
      request(urlMap.msg.sms.getDayMaxSend, {}, 'get').then(res => {
        if (res.head.errCode === 0) {
          this.maxCount = (res.data === -1) ? '不限制' : res.data
        }
      })
    },
    edit ({ id }) {
      this.$router.push({
        name: 'messageedit',
        params: { id: id }
      })
    },
    linkCreatePage () {
      this.$router.push({ name: 'messageedit', params: { id: -1 } })
    },
    list (flag) {
      this.$refs.table.list(flag)
    },
    del ({ id }) {
      request(urlMap.msg.msgTemplate.deleteTemplate, { templateId: id }, 'get').then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '删除成功')
          this.list(true)
        }
      })
    },
    // 设置分类的下拉选项
    getClassList () {
      request(urlMap.msg.msgTemplate.getTypeList, {}, 'get').then(rs => {
        this.$ever.getFieldFromSchema(this.querySchema, 'tempTypeId').props.options = rs.data
      })
    },
  },
  components: {
    dialogMax,
    dialogUseRange,
  }
}
</script>
