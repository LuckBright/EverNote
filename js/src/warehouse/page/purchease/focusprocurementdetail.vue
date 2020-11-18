<template>
  <div>
    <ever-bread-crumb name="集中采购申请" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <!-- 基本信息 -->
        <basic-info :schema="schema" :obj="obj" @changeStorage="handleBasicInfoChange" :rules="rules"></basic-info>
        <!-- 采购单列表 -->
        <!-- <pro-sup-table v-if="obj.status === 815" :tableData="obj.purchaseOrders" :loading="false"></pro-sup-table> -->
        <!-- 采购申请单物资列表 -->
        <procurement-application :listData="obj" ref="procurementList" @change="getMaterList"></procurement-application>
        <!-- 按钮组 -->
        <div>
          <el-button
            type="primary"
            size="small"
            style="width: 100px;"
            @click="submit(821)"
            :disabled="btnDisabled"
            :loading="btnLoading"
            v-if="!objId || obj.status === 812 || (obj.status === 814 && !obj.addNewCode)"
          >提交</el-button>
          <el-button type="primary" size="small" @click="submit(812)" :loading="btnLoading" :disabled="btnDisabled" v-if="!objId || status">暂存</el-button>
          <el-button size="small" @click="examineOpen" v-if="obj.status === 821 && operation" :loading="btnLoading" type="primary">审核</el-button>
          <el-button size="small" @click="handleCancle" v-if="objId && obj.status === 821 && !status && !operation" :loading="btnLoading">取消</el-button>
          <el-button size="small" @click="handlerCancel" v-if="!objId || status || obj.status === 812 || (obj.status === 814 && !obj.addNewCode)" :loading="btnLoading">返回</el-button>
        </div>
      </div>
    </div>
    <!-- 加载loading -->
    <loading-cover :loading="loading">
      <h2 slot="title">加载中</h2>
    </loading-cover>
    <!-- 成功提示 -->
    <success-info :data="submitSuccess"></success-info>
    <!-- 取消弹窗 -->
    <canceldrug-dialog ref="cancelDrug" @change="clickCancel"></canceldrug-dialog>
    <!-- 提示框 -->
    <!-- 审核弹窗 -->
    <el-dialog
    title="审核"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape='false'
    :show-close='true'
    width="420px">
      <el-input
          type="textarea"
          placeholder="请填写审核意见，驳回必填"
          v-model="textarea"
          maxlength="100"
          class="mheight"
          show-word-limit
        >
        </el-input>
      <div class="alg_c mt10">
        <el-button type="primary" size="small" @click="handlerConsent(815)">同意</el-button>
        <el-button type="primary" size="small" @click="handlerConsent(814)" :disabled="!textarea">驳回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '../storages/store/procurementapi'
import storageroomApi from '@/warehouse/store/storageroomapi'
import procurementApplication from '@/warehouse/page/purchease/component/procurementapplication.hz.vue' // 新版采购申请物资列表
import { debounce, patch, FULL_STATE } from '@/util/common'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import basicInfo from '@/warehouse/page/components/procurement/basicinfo'
import procurementTable from '@/warehouse/page/components/procurement/procurementtable'
import loadingCover from '@/warehouse/page/components/procurement/loadingcover'
import successInfo from '@/warehouse/page/components/procurement/successinfo'
import proSupTable from '@/warehouse/page/components/procurement/prosuptable'
import setName from '@/util/setstatusname'
import canceldrugDialog from '@/warehouse/page/purchease/component/canceldrug.vue' // 取消弹窗

let newSchema = [
  {
    name: 'storageRoomId',
    label: '收货库房',
    comp: 'sys-select',
    props: {
      options: [],
      clearable: false
    },
    span: 6
  },
  {
    name: 'remark',
    label: '备注',
    props: {
      maxlength: 50,
      placeholder: ' '
    },
    span: 12
  }
]

let editSchema = [
  {
    name: 'code',
    label: '采购申请单号:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'statusName',
    label: '采购申请单状态:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applicantName',
    label: '采购申请人:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applyTime',
    label: '采购申请时间:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'storageRoomName',
    label: '收货库房:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'remark',
    label: '备注:',
    comp: 'custom',
    span: 6
  }
]

let cancelSchema = [
  {
    name: 'abolitionReason',
    label: '取消原因:',
    comp: 'custom',
    span: 6
  },
  {
    name: 'abolitionTime',
    label: '取消时间:',
    comp: 'readonlyitem',
    span: 6
  }
]

let examineSchmea = [
  {
    name: 'confirmerName',
    label: '审核人:',
    comp: 'readonlyitem',
    props: {
      nocGray: true
    },
    span: 6
  },
  {
    name: 'auditOpinion',
    label: '审核意见:',
    comp: 'custom',

    span: 6
  },
  {
    name: 'confirmTime',
    label: '审核时间:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'clinicName',
    label: '机构:',
    props: {
      nocGray: true
    },
    comp: 'readonlyitem',
    span: 6
  }
]

export default {
  mixins: [getstorage, setName],
  data () {
    return {
      showType: '', // 展示方式 new：新建草稿 / edit：编辑详情
      schema: '', // 基本信息schema
      rules: {
        storageRoomId: { required: true, message: '必填项', trigger: 'change' }
      },
      obj: '', // 基本信息对象
      taskId: '', // 审批taskId
      initParams: { // 查询库房对应物资动态参数
        // materialType: '',
        storageRoomId: ''
      },
      storageroomApi,
      loading: false, // 加载
      btnLoading: false, // 加载
      submitData: {}, // 要提交的数据
      backObj: false, //
      submitSuccess: { // 提交成功模版
        title: '采购申请单提交成功！',
        flag: false,
        data: {}
      },
      dialogVisible: false,
      textarea: '', // 审核原因
      tipMsg: '', // 提示语
      btn: '',
      tableData: [], // 提交的表格数据
      objId: this.$route.params.id,
      routePath: this.$route.path,
      storageRoomId: this.$route.query.storageRoomId, // 库房带过来的库房id
      oldVal: '', // 缓存的上一次库房id
      status: this.$route.query.status, // 为1则代表暂存页面
      operation: this.$route.query.operation, // 为1则代表暂存页面
      submitTemplate: { // 提交弹窗模版
        content1: '是否确认将已勾选物资生成正式采购单？'
      },
      FULL_STATE
    }
  },
  created () {
    if (!this.$route.params.id || this.$route.query.status) { // 新增采购申请单或者是暂存
      this.showType = 'new'
      this.schema = newSchema
      this.obj = this.$ever.createObjFromSchema(newSchema)
      if (this.status) {
        this.getDetail(this.$route.params.id, true)
      } else {
        this.obj.items = []
      }
      storageroomApi.list().then(res => { // 获取库房
        if (res && res.list.length) {
          this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').props.options = res.list
          if (res.list.length === 1 && !this.status) { // 只有一个库房时自动带出来
            this.obj.storageRoomId = res.list[0].id
          }
        }
      })
    } else { // 申请单详情
      this.showType = 'edit'
      this.schema = editSchema
      this.obj = this.$ever.createObjFromSchema(editSchema)
      this.obj.items = []
      this.getDetail(this.$route.params.id)
    }
    if (this.storageRoomId) {
      this.obj.storageRoomId = this.storageRoomId
      this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').props.disabled = true
    }
  },
  computed: {
    btnDisabled () {
      if (this.tableData && this.tableData.length && this.tableData.length === 1) {
        const data = this.tableData[0]
        let { localMaterialId, num } = data
        if (localMaterialId && num) {
          return false
        } else {
          return true
        }
      } else {
        return !this.tableData.length
      }
    }
  },
  methods: {
    handlerConsent (status) { // 同意审核 && 驳回 审核
      let params = { id: this.obj.id, status: status, auditOpinion: this.textarea }
      api.focusUpdateApplyStatus(params).then(res => {
        if (Object.keys(res).length) {
          this.$router.push('/goods/procureapply')
          return this.everSuccess(`${status === 814 ? '驳回' : '审核'}采购申请单成功`)
        }
      })
    },
    examineOpen () { // 审核
      this.dialogVisible = true
    },
    handlerCancelStorage () { // 更改库房提示取消，恢复原库房
      if (!this.backObj) this.obj.storageRoomId = this.oldVal
      if (this.backObj) this.backObj = false
      this.btn = 7
    },
    getMaterList (v) {
      if (v) this.tableData = v
    },
    submit: debounce(function (state) { // 提交 && 暂存
      let params = {
        storageRoomId: this.obj.storageRoomId,
        remark: this.obj.remark
      }
      let itemsArr = []
      let flag = false
      let data = JSON.parse(JSON.stringify(this.tableData))
      data.forEach(item => {
        const { localMaterialId, num, materialType, supplierLocalId, contractId, price, supplyMode, iName, defaultContrct, unitId } = item
        if (iName !== '') {
          if (!num) {
            flag = true
          }
          itemsArr.push({
            localMaterialId: localMaterialId,
            num: num,
            unitId: unitId,
            materialType: materialType,
            supplierLocalId: supplierLocalId,
            contractId: !contractId ? defaultContrct ? defaultContrct.id : '' : contractId,
            // totalPrice: totalPrice,
            price: price,
            supplyMode: supplyMode
          })
        }
      })
      params.items = itemsArr
      params.status = state
      if (this.objId && this.obj.status !== 814) params.id = this.objId
      if (flag) return this.everWarning('物资列表还有信息未录入')
      this.btnLoading = true
      if (!this.obj.addNewCode && this.obj.status === 814) params.rejectId = this.objId
      api['focusCreatePurchaseApply'](params).then(res => {
        if (Object.keys(res).length) {
          this.objId = res.id
          this.obj.status = res.status
          if (state === 821) { // 提交成功，跳转到查看页面
            this.status = false
            this.$router.replace(`/goods/focusprocurementdetail/${res.id}`)
          } else {
            this.status = true
            // this.$router.push(`/goods/focusprocurementdetail/${res.id}?status="true"`)
          }
          this.$messageTips(this, 'success', `${state === 821 ? '提交' : '保存'}成功`)
        }
        this.btnLoading = false
      })
    }),
    handleCancle () { // 取消采购申请单
      this.$refs.cancelDrug.open()
    },
    clickCancel (text) { // 确认取消
      api.focusCancelPurchaseApplyById({ id: this.obj.id, status: 816, abolitionReason: text }).then(res => {
        if (Object.keys(res).length) this.getDetail(this.obj.id)
      })
    },
    handlerCancel () { // 返回
      this.btn = 3
      let cancel
      Object.keys(this.obj).forEach(key => {
        if ((!Array.isArray(this.obj[key]) && this.obj[key]) || (Array.isArray(this.obj[key]) && this.obj[key].length)) {
          cancel = true
        }
      })
      if (cancel) {
        this.$confirm('您填写的内容尚未提交，是否要离开页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
          this.backObj = true
        }).catch(() => {
        })
      } else {
        this.$router.go(-1)
      }
    },
    // 获取采购申请单详情
    getDetail (id, notLoading) {
      if (!notLoading) this.loading = true
      api.focusGetPurchaseApplyInfo({ id }).then(res => {
        if (res) {
          const newRes = JSON.parse(JSON.stringify(res))
          let newObj = {}
          if (this.status && newRes.status === 812) { // 暂存数据处理
            newObj = {
              items: newRes.items,
              storageRoomId: newRes.storageRoomId,
              remark: newRes.remark,
              status: newRes.status
            }
            Object.assign(this.obj, newObj)
            this.obj.items.forEach(item => { item.add = true })
          } else {
            let cancelSchemas = JSON.parse(JSON.stringify(editSchema))
            // 显示取消状态的schema
            if (newRes.status === 816) {
              cancelSchemas.splice(4, 0, ...cancelSchema, ...examineSchmea)
            } else if (['814', '815', '821'].includes(`${newRes.status}`)) { // 已驳回显示的schema
              cancelSchemas.splice(4, 0, ...examineSchmea)
            }
            this.schema = cancelSchemas
            Object.assign(this.obj, newRes)
          }
          this.obj.items.forEach(data => {
            data.add = true
            if (data.contractList && data.contractList.length) {
              const defaultContrct = data.contractList.find(key => { return key.status === 5 })
              data.defaultContrct = !defaultContrct ? '' : defaultContrct // 找到默认合同
              data.contractList = data.contractList.filter(keys => { return keys.status === 1 }) // 过滤掉默认合同
              if (data.defaultContrct && data.contractId === data.defaultContrct.id) {
                data.contractId = ''
              }
            }
          })
        }
        this.loading = false
        if (res.taskLogs && res.taskLogs.length) {
          for (let i = 0, len = res.taskLogs.length; i < len; i++) {
            if (!res.taskLogs[i].end) {
              this.taskId = res.taskLogs[i].taskId
              return false
            }
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 基本信息变更
    handleBasicInfoChange (data) {
      if (Object.keys(data).length) {
        this.initParams.storageRoomId = data.id
        // this.initParams.materialType = data.materialType
      } else {
        this.initParams.storageRoomId = ''
        // this.initParams.materialType = ''
      }
    },
    ...patch
  },
  watch: {
    obj: {
      handler (v) {
        if (!this.objId || this.status) {
          if (v.storageRoomId && !v.items.length) {
            v.items = [{ iName: '' }]
          }
        }
      },
      deep: true
    },
    'dialogVisible' (val) {
      if (!val) this.textarea = ''
    },
    'obj.storageRoomId' (val, oldval) {
      if (this.tableData.length && !this.tableData[0].localMaterialId) {
        this.$refs.procurementList.info(true)
      }
      this.oldVal = oldval
      if (val && oldval && val !== oldval && this.obj.items.length && this.obj.items[0].localMaterialId) {
        this.tipMsg = `采购申请单中已经添加物资，如需修改收货库房，将自动清空已添加的物资`
        if (this.btn !== 7) { // 点击取消阻止触发弹窗
          let dom = document.querySelector('.el-form .el-input__inner')
          if (dom) dom.blur()
          this.$confirm(`采购申请单中已经添加物资，如需修改收货库房，将自动清空已添加的物资`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs.procurementList.info()
            this.obj.items = []
          }).catch(() => {
            this.handlerCancelStorage()
          })
          this.btn = 4
          return
        } else {
          this.btn = 0
        }
      }
    },
    '$route' (val) {
      if (val.params.id) {
        this.objId = this.$route.params.id
        this.submitSuccess.flag = false
        this.submitSuccess.data = {}
        this.showType = 'edit'
        this.schema = editSchema
        this.obj = this.$ever.createObjFromSchema(editSchema)
        this.obj.items = []
        this.getDetail(val.params.id)
      }
    }
  },
  components: {
    basicInfo,
    loadingCover,
    procurementTable,
    successInfo,
    proSupTable,
    procurementApplication,
    canceldrugDialog
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
.mheight /deep/ .el-textarea__inner{
  height: 200px;
}
</style>
