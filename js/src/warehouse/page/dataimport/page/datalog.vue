<template>
  <div>
    <ever-bread-crumb name="查看日志" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-table
        ref="table"
        :columns="allColumns"
        :url="url"
        :params.sync="queryObj"
        :is-auto-height="true"
        @eventChange="eventChange"
      ></ever-table>
    </div>
  </div>
</template>
<script>
import urlMap from '@/util/urls'

export default {
  data () {
    return {
      url: urlMap.dataimport.queryTempletActionLog,
      allColumns: [
        {
          prop: 'templetName',
          label: '模板名称',
          // width: '150'
        },
        // {
        //   prop: 'templetModule',
        //   label: '所属模块',
        // },
        {
          prop: 'createTime',
          label: '日期',
          width: '250'
        },
        {
          prop: 'actionType',
          label: '操作类型',
          width: '200',
          formatter ({ value }) {
            if (value === '1') {
              return '上传'
            } else if (value === '2') {
              return '下载'
            } else if (value === '3') {
              return '导入'
            } else if (value === '4') {
              return '清理数据'
            } else {
              return ''
            }
          }
        },
        {
          prop: 'actionState',
          label: '状态',
          width: '200',
          formatter ({ value }) {
            if (value === '1') {
              return '成功'
            } else {
              return '失败'
            }
          }
        },
        {
          prop: 'creator',
          label: '操作人',
          width: '250'
        },
        // {
        //   prop: 'ever-op', // 该列的唯一标示
        //   type: 'btns',
        //   width: '150',
        //   label: '操作',
        //   btns: ({ row }) => {
        //     let btnArr = [
        //       {
        //         prop: 'handleDownloadFile',
        //         label: '下载日志数据',
        //       }
        //     ]
        //     if (!row.fileUrl) {
        //       btnArr = []
        //     }
        //     return btnArr
        //   },
        // },
      ],
      loading: false,
      queryObj: {
        id: this.$route.params.id
      }
    }
  },
  methods: {
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    list () {
      this.$refs.table.list(true)
    },
    // 下载日志
    // handleDownloadFile (row) {
    //   window.open(row.fileUrl, '_blank')
    //   // let rs = await request(urlMap.dataimport.queryTempletModule)
    // }
  },
  components: {
  }
}
</script>
