<template>
  <div class="layout_inner">
    <div class="main_head" align="right">
      <el-button type="primary" @click="openQrCode">日报二维码</el-button>
      <el-button type="primary" @click="addNew">增加</el-button>
    </div>
    <ever-table
      ref="table"
      is-auto-height
      row-key="id"
      :columns="allColumns"
      :params.sync="params"
      :url="url"
      request="requestIh"
      @eventChange="eventChange">
    </ever-table>
    <new-dialog ref="newdialog" :visible.sync="newdialog" @addnew="list(true)"></new-dialog>
  </div>
</template>

<script>
import newDialog from '@/titancare/views/business/page/newapply.vue'
import qrcode from '@chenfengyuan/vue-qrcode'
import { requestIh } from '@/util/req'
import urlMap from '@/titancare/utils/urls.js'

export default {
  data () {
    return {
      newdialog: false,
      qrcodeUrl: '',
      url: urlMap.daily.getDailyPushList,
      params: {},
      allColumns: [
        {
          prop: 'username',
          label: '姓名',
        },
        {
          prop: 'gender',
          label: '性别',
          formatter: ({ row }) => {
            return this.$filters.formatSex(row.gender)
          },
        },
        {
          prop: 'telephone',
          label: '手机号',
        },
        {
          prop: 'managementOrgName',
          label: '管理机构',
        },
        {
          prop: 'wechatOpenId',
          label: '微信openId',
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          label: '操作',
          width: '350',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'handleSend',
                label: '推送日报'
              },
              'del'
            ]
            return baseBtns
          }
        }
      ]
    }
  },
  methods: {
    list () {
      this.$refs.table.list(true)
    },
    eventChange ({ prop, row, col }) {
      this[prop] && this[prop](row)
    },
    handleSend (row) {
      let params = {
        dailyPushDTOList: []
      }
      params.dailyPushDTOList.push({
        'managementOrgId': row.managementOrgId,
        'managementOrgName': row.managementOrgName,
        'wechatOpenId': row.wechatOpenId
      })
      requestIh(urlMap.daily.scheduledDaily, params).then(res => {
        if (res.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '日报推送中，请留意微信公众号消息',
            type: 'success'
          })
        }
      }, _ => { })
    },
    openQrCode () {
      this.qrcodeUrl = this.$ever.host + this.$ever.reportIndex + '/apply?x-tenant-id=' + localStorage.getItem('TENANTID')
      const h = this.$createElement
      this.$msgbox({
        title: '日报二维码',
        customClass: 'qrcodeWrap',
        center: true,
        showConfirmButton: false,
        message: h(qrcode, {
          props: {
            value: this.qrcodeUrl,
            options: {
              size: 100
            }
          },
          style: {
            margin: '0 auto'
          }
        })
      }).catch(_ => { })
    },
    del (row) {
      requestIh(urlMap.daily.deleteDailyPushById.prefix + urlMap.daily.deleteDailyPushById.url + '/' + row.id, {}, 'get').then(res => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success'
        })
        this.list()
      }, _ => { })
    },
    addNew () {
      this.newdialog = true
    },
  },
  components: {
    newDialog
  }
}
</script>
<style scoped lang="scss">
.applycontainer {
  padding: 10px;
}
.btnright {
  margin: 10px 0;
  text-align: right;
}
.pagination {
  text-align: right;
}
</style>
