<template>
  <div>
    <ever-bread-crumb name="采购申请" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <!-- 基本信息 -->
        <basic-info :schema="schema" :obj="obj" :customStyle="true"></basic-info>
        <!-- 采购单列表 -->
        <pro-sup-table v-if="obj.status === 815" :tableData="obj.purchaseOrders" :loading="false"></pro-sup-table>
        <!-- 采购申请单物资列表 -->
        <procurement-table
          :id="obj.id"
          :tableData="obj.items"
          :showTips="showType === 'new'"
          :cancel="([813, 814, 821].includes(obj.status)) && currentUser === obj.createBy"
          :edit="showType === 'new' || (obj.status === 814 && currentUser === obj.createBy)"
          :showExport="obj.status === 815"
          @submit="handleSubmit"
          @cancel="handleCancel">
        </procurement-table>
        <!-- 审批流程 -->
        <approval v-if="showType === 'edit' && obj.taskLogs && obj.taskLogs.length" :disabled="true" :data="obj.taskLogs"></approval>
      </div>
    </div>
    <!-- 加载loading -->
    <loading-cover :loading="loading">
      <h2 slot="title" v-if="showType === 'edit'">加载中</h2>
      <template v-if="showType === 'new'">
        <p>针对库存已预警的物资尽快创建采购申请；</p>
        <p>定期进行日常补货采购计划，确保物资数量稳定在安全库存区间内。</p>
      </template>
    </loading-cover>
    <!-- 成功提示 -->
    <success-info :data="submitSuccess"></success-info>
  </div>
</template>
<script>
import api from '../../store/procurementapi'
import { debounce, patch } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import basicInfo from '@/warehouse/page/components/procurement/basicinfo'
import procurementTable from '@/warehouse/page/components/procurement/procurementtable'
import loadingCover from '@/warehouse/page/components/procurement/loadingcover'
import approval from '@/warehouse/page/components/procurement/approval'
import successInfo from '@/warehouse/page/components/procurement/successinfo'
import proSupTable from '@/warehouse/page/components/procurement/prosuptable'

let schema = [
  {
    name: 'storageRoomName',
    label: '收货仓库',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applicantName',
    label: '申请人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createTime',
    label: '创建时间',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'statusName',
    label: '状态',
    comp: 'readonlyitem',
    span: 6
  }
]

export default {
  mixins: [getstorage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.items = []
    return {
      currentUser: this.$store.state.currentUser.userId, // 当前用户
      showType: '', // 展示方式 new：新建草稿 / edit：编辑详情
      schema, // 基本信息schema
      obj, // 基本信息对象
      loading: false, // 加载
      submitData: {}, // 要提交的数据
      submitSuccess: { // 提交成功模版
        title: '采购申请单提交成功！',
        flag: false,
        data: {}
      },
      submitTemplate: { // 提交弹窗模版
        content1: '是否将已经勾选物资生成采购申请单？',
        content2: '您的采购申请还没最终审核通过，取消后不能恢复，请确认是否取消？'
      }
    }
  },
  created () {
    if (this.$route.params.id === 'new') { // 申请单草稿
      this.showType = 'new'
      this.createLog()
    } else { // 申请单详情
      this.showType = 'edit'
      this.getDetail(this.$route.params.id)
    }
  },
  methods: {
    // 创建采购申请单草稿
    createLog () {
      this.loading = true
      api.createNewPurchaseApplyLog({ storageRoomId: this.storageId }).then(res => {
        this.loading = false
        Object.assign(this.obj, res)
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取采购申请单详情
    getDetail (id, notLoading) {
      if (!notLoading) this.loading = true
      api.getPurchaseApplyInfo({ id }).then(res => {
        Object.assign(this.obj, res)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交数据
    handleSubmit (data) {
      this.submitData = data
      if (this.$route.params.id === 'new') {
        this.$confirm(this.submitTemplate.content1, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitConfirm()
        }).catch(() => { })
      } else {
        this.submitConfirm()
      }
    },
    // 确认提交
    submitConfirm: debounce(function () {
      if (this.showType === 'new') {
        this.submitData.logId = this.obj.id
        api.submitPurchaseApply(this.submitData).then(res => {
          if (res && Object.keys(res).length) {
            this.$messageTips(this, 'success', '提交成功')
            this.submitSuccess.flag = true
            this.submitSuccess.data = res
          }
        })
      } else {
        this.submitData.id = this.obj.id
        this.submitData.materialType = this.obj.materialType
        this.submitData.storageRoomId = this.obj.storageRoomId
        api.updatePurchaseApply(this.submitData).then(res => {
          this.getDetail(this.obj.id, false)
          if (res && Object.keys(res).length) {
            this.$messageTips(this, 'success', '更新成功')
          }
        })
      }
    }),
    // 取消数据
    handleCancel () {
      this.$confirm(this.submitTemplate.content2, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelConfirm()
      }).catch(() => { })
    },
    // 确认取消
    cancelConfirm: debounce(function () {
      api.cancelPurchaseApplyById({ id: this.obj.id }).then(res => {
        if (res && Object.keys(res).length) {
          this.getDetail(res.id)
          this.$messageTips(this, 'success', '取消成功')
        }
      })
    }),
    ...patch
  },
  watch: {
    '$route' (val) {
      if (val.params.id) {
        this.submitSuccess.flag = false
        this.submitSuccess.data = {}
        this.showType = 'edit'
        this.getDetail(val.params.id)
      }
    }
  },
  components: {
    basicInfo,
    loadingCover,
    procurementTable,
    approval,
    successInfo,
    proSupTable
  }
}
</script>

<style lang="scss" scoped>
  .layout_inner {
    padding: 20px;
    .panel-body {
      padding: 0;
    }
  }
</style>
