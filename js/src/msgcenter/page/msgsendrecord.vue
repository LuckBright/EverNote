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
        <template slot="times">
          <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
        </template>
        <template slot="receiverId">
          <ever-patient-select v-model="queryObj.receiverId"></ever-patient-select>
        </template>
      </ever-form2>
    </div>

    <ever-table
      ref="table"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      :is-auto-height="true"
      :is-single-table="true"
    ></ever-table>
  </div>
</template>

<script>
import urlMap from '@/msgcenter/store/urls'

var querySchema = [
  {
    name: 'times',
    label: '发送时间',
    comp: 'custom'
  },
  {
    name: 'orgId',
    comp: 'ever-org-select',
    label: '机构',
    props: {
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
    name: 'receiverId',
    comp: 'custom',
    label: '接收人',
  },
  {
    name: 'status',
    label: '状态',
    comp: 'el-select',
    props: {
      placeholder: '选择发送状态',
      filterable: true,
      clearable: true,
      valueKey: 'name',
      options: [
        { id: '1', name: '发送成功' },
        { id: '0', name: '发送失败' }
      ]
    }
  },
]

export default {
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.optType = (this.$route.matched[0].meta.manage === true) ? 0 : 1
    return {
      url: urlMap.msg.sms.getRecordList,
      allColumns: [
        {
          prop: 'id',
          label: '短信ID',
          align: 'center',
          width: '200'
        },
        {
          prop: 'senderName',
          label: '发送人',
          width: '120'
        },
        {
          prop: 'orgName',
          label: '发送机构',
          width: '200',
        },
        {
          prop: 'receiverName',
          label: '接收人',
          width: '150',
        },
        {
          prop: 'deptName',
          label: '科室',
          width: '180',
        },
        {
          prop: 'content',
          label: '短信内容',
          showOverflowTooltip: true,
        },
        {
          prop: 'createTime',
          label: '发送时间',
          width: '160',
        },
        {
          prop: 'status',
          label: '发送状态',
          width: '100',
          formatter ({ value }) {
            if (value) {
              return '发送成功'
            } else {
              return '发送失败'
            }
          },
        },
      ],
      querySchema: querySchema.slice(),
      queryObj,
      isManage: this.$route.matched[0].meta.manage,
      params: {}
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
  },
  watch: {
    'queryObj.orgId' (val) {
      this.$ever.getFieldFromSchema(querySchema, 'deptId').props.params = {
        orgId: val
      }
      this.queryObj.deptId = ''
    }
  }
}
</script>
