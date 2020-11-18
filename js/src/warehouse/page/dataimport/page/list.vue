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
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      is-auto-height
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      :show-checkbox="true"
      :is-single-table="true"
      :maxBtnCount="6"
      :handleResult="handleResult"
      @eventChange="eventChange"
      @afterSearch="afterSearch">
    </ever-table>
  </div>
</template>
<script>
import urlMap from '@/util/urls'
import { request } from '@/util/req'

let querySchema = [
  {
    name: 'status',
    label: '模板状态',
    comp: 'el-select',
    props: {
      placeholder: '选择模板状态',
      filterable: true,
      clearable: true,
      valueKey: 'name',
      options: [
        { id: '1', name: '已上传' },
        { id: '0', name: '未上传' }
      ]
    }
  },
]

export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      url: urlMap.dataimport.templetRecord,
      allColumns: [
        {
          prop: 'id',
          label: '顺序号',
          width: '120'
        },
        {
          prop: 'templetName',
          label: '模板名称',
        },
        {
          prop: 'templateDataImportTime',
          label: '导入时间',
          width: '200'
        },
        {
          prop: 'templetState',
          label: '模板状态',
          width: '150',
          formatter ({ value }) {
            if (value === '1') {
              return '已上传'
            } else {
              return '未上传'
            }
          }
        },
        {
          prop: 'templateDataStatus',
          label: '数据导入状态',
          width: '120',
          customCellSpanClassFormatter ({ value }) {
            let _res = ''
            if (value === '2') {
              _res = 'cRed'
            } else if (value === '3') {
              _res = 'cGreen'
            }
            return _res
          },
          formatter ({ value }) {
            if (value === '1') {
              // -1未上传，1已上传，2导入失败，3导入成功，4部分成功
              return '已上传'
            } else if (value === '2') {
              return '导入失败'
            } else if (value === '3') {
              return '导入成功'
            } else if (value === '4') {
              return '部分成功'
            } else {
              return '未上传'
            }
          },
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '模板操作',
          width: '180',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: '_handler',
                label: '上传模板',
                upload: true,
                uploadAttrs: {
                  'on-success': (res) => {
                    this.handleUploadFile(res)
                  },
                  action: this.$ever.api + '/platform-extend/filemanage/upload',
                  data: {
                    templetId: row.id
                  }
                },
              },
              {
                prop: 'handleDownloadFile',
                label: '下载模板',
                disabled: true
              },
            ]
            baseBtns[0].disabled = !this.$hasPermission('Auth_menu_clinic_dataimport_importbtn')
            if (row.templetState === '-1') {
              baseBtns[1].disabled = true // 状态为禁用
            } else {
              baseBtns[1].disabled = false // 状态为禁用
            }
            return baseBtns
          }
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '数据操作',
          width: '400',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'handler1',
                label: '上传数据',
                upload: true,
                uploadAttrs: {
                  'on-success': (res, file) => {
                    this.handleUploadData(row, res.data)
                  },
                },
              },
              {
                prop: 'handleImportData',
                label: '导入数据',
              },
              {
                prop: 'handleDownloadErrorFile',
                label: '下载数据',
              },
              {
                prop: 'handleViewLog',
                label: '查看日志',
              },
            ]
            // 上传数据按钮逻辑
            baseBtns[0].disabled = false // 状态为可用

            // 导入数据按钮逻辑
            if (row.dataType === '2' && row.actionType === '1' && row.actionState === '1') {
              baseBtns[1].disabled = false // 状态为可用
            } else {
              baseBtns[1].disabled = true // 状态为禁用
            }
            // 下载错误数据按钮逻辑
            if (row.templateDataImportErrorUrl && row.templateDataImportErrorUrl.trim().length > 0) {
              baseBtns[2].disabled = false // 有文件地址可以下载
            } else {
              baseBtns[2].disabled = true
            }
            if (row.templateDataStatus === '1') {
              baseBtns[2].disabled = true
            }
            if (row.statusStr === '导入中') {
              baseBtns[0].disabled = true // 状态为禁用
              baseBtns[1].disabled = true // 状态为禁用
              baseBtns[2].disabled = true // 状态为禁用
            }
            return baseBtns
          }
        },
      ],
      querySchema,
      queryObj,
      responseData: {},
      getStatusTimer: ''  // 查询的定时器
    }
  },
  created () {
  },
  destroyed () {
    // 清空定时
    window.clearTimeout(this.getStatusTimer)
  },
  methods: {
    afterSearch (res) {
      this.responseData = res.result
      window.clearTimeout(this.getStatusTimer)
      if (this.responseData.length > 0) {
        this.startTimer()
      }
    },
    startTimer () {
      this.getStatusTimer = setTimeout(() => {
        this.startTimer()
      }, 3000)
      this.getAllStatusFun()
    },
    handleResult (res) {
      return res.data.map(item => ({ ...item, dataType: '', actionType: '', actionState: '', statusStr: '', templateDataImportTime: '', templateDataStatus: '', templateDataImportErrorUrl: '' }))
    },
    // 查询所有记录状态 等所有数据返回之后拿到所有id去查状态
    // 把redis返回的状态，{id:'1-01',status: '导入中'} 添加到当前的一行数据中，在针对每行记录获取对应的状态
    async getAllStatusFun () {
      if (this.responseData.length === 0) {
        return
      }
      let result = await request(urlMap.dataimport.getImportDataStatus, this.responseData.map(item => item.id))
      this.responseData.forEach(item => {
        let obj = result.data.find(it => {
          return it.id === item.id
        })
        if (obj) {
          // redis返回的状态，这块用的是字符串匹配
          item.statusStr = obj.status
          request(urlMap.dataimport.queryTempletActionLog, {
            id: item.id,
            offset: 0,
            pagesize: 1
          }).then(res => {
            if (res.head.errCode === 0 && res.data.length > 0) {
              item.dataType = res.data[0].dataType
              item.actionType = res.data[0].actionType
              item.actionState = res.data[0].actionState
              item.templateDataStatus = res.data[0].templateDataStatus
              item.templateDataImportTime = res.data[0].templateDataImportTime
              item.templateDataImportErrorUrl = res.data[0].templateDataImportErrorUrl
            }
          })
        }
      })
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    list () {
      this.$refs.table.list(true)
    },
    // 上传模板（空数据模板）修改为上传到平台接口文件存库里
    handleUploadFile (res) {
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '上传成功')
        this.list(false)
      }
    },
    // 下载模板（空数据模板）修改为调用平台接口下载文件
    handleDownloadFile (row) {
      window.open(this.$ever.api + '/' + urlMap.dataimport.platformDownLoad.prefix + urlMap.dataimport.platformDownLoad.url + '/' + row.id, '_self')
    },
    // 上传数据（带有数据的模板）
    handleUploadData (row, data) {
      request(urlMap.dataimport.upLoadTempletData, {
        'id': row.id,
        'templetName': row.templetName,
        'templetModule': row.templetModule,
        'dataType': '2',
        'actionType': '1',
        'actionState': '1',
        'fileId': data.fileId,
        'fileUrl': data.fileUrl
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '上传成功')
          this.list()
          console.log(row, 'row')
        }
      })
    },
    // 导入数据 调用业务方接口
    handleImportData (row) {
      if (!row.importUrl) {
        this.$messageTips(this, 'error', '导入数据接口为空，请检查数据')
        return
      }
      if (!row.templetDataUrl) {
        this.$messageTips(this, 'error', '数据文件还未上传，请上传数据文件！')
        return
      }
      // 这块的逻辑可以简化，等后端把数据都传到对象存储之后就可以把 /file/ 的逻辑去掉
      let _tmp = row.templetDataUrl
      let fileId = ''
      if (_tmp) {
        if (_tmp.includes('fileId=')) {
          fileId = _tmp.substring(_tmp.indexOf('fileId=') + 7)
        } else if (_tmp.includes('/file/')) {
          fileId = _tmp.substring(_tmp.indexOf('/file/') + 6)
        }
      }

      request(this.$ever.api + row.importUrl, {
        templateId: row.id,
        fileId: fileId,
        fileUrl: `${this.$ever.fileUrl2}${fileId}`,
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '数据导入中，导入过程需要时间较长，请等待。')
        } else {
          this.$messageTips(this, 'error', '数据导入失败')
        }
        this.list()
      })
    },
    // 下载模板（错误数据模板）
    handleDownloadErrorFile (row) {
      window.open(this.$ever.fileUrl2 + row.templateDataImportErrorUrl)
    },
    // 查看日志
    handleViewLog (row) {
      this.$router.push({
        name: 'datalog',
        params: { id: row.id }
      })
    },
  },
}
</script>
