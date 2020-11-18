<template>
  <div>
    <ever-bread-crumb  @back="backTo" is-custom-back></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        :rules="rules"
        :schema="schema"
        :class="objId ? 'form' : ''"
        ref="form"
        v-model="obj">
        <!-- 新增供应商 -->
        <template slot="addsupplier">
          <span v-if="!objId || originalObj.status === 2">
            若为新供应商请点击
            <el-button type="text" @click="handlerSupplier" size="small">新增供应商</el-button>
          </span>
        </template>
        <!-- 合同附件 -->
        <template slot="contractFileUrls">
          <div v-if="!obj.contractFileUrls.length && objId && !edit">
            <span class="cGray">无</span>
          </div>
          <div v-else>
            <span v-if="!objId || (objId && edit)">单个文件大小不超过100M，最多上传10个文件</span>
            <!-- 下载全部附件 -->
            <batch-download
              v-if="(objId && obj.contractFileUrls.length)"
              @downFile="downFile"
              ref="exportDownload"
              :size="'small'"
              :btnType="'text'"
              :disabled="!edit"
              :list="batchDownload"
              btnTxt="下载全部附件"
            ></batch-download>
          </div>
          <upload-file2
            v-if="(objId && !obj.contractFileUrls.length && edit) || !objId || (objId && obj.contractFileUrls.length)"
            ref="uploadFJ"
            id="uploadFJ"
            listType="text"
            @process="handlerProcess"
            @input="handlerUpload"
            :btnSize="'small'"
            :showDialog="true"
            :btnDisabled="edit"
            :btnShow="(objId && !edit) || (obj.contractFileUrls.length >= 10 || cacheUpload.length >= 10)"
            :list="listArr"
            :beforeUploadCustomize="beforeUploadCustomize"
            :tips="'单个文件大小不超过100M，最多上传10个文件'"
            class="formUpload"
            :class="{
              'listUpload': (objId && obj.contractFileUrls.length && !edit),
              'candelNone': !edit && objId,
              'listUploads':  (obj.contractFileUrls.length === 10 || cacheUpload.length === 10),
              'showDown': objId && obj.contractFileUrls.length }"
            :maxNum="10"
            @success="hanlderSuccess"
            uploadApiType="ucloud">
          </upload-file2>
        </template>
        <!-- 物资详情 -->
        <template slot="materialsItems">
          <material-details :supplierLocalId="obj.supplierLocalId.id" @change="handlerMater" :disabled="edit"></material-details>
        </template>
        <!-- 操作按钮组 -->
        <div slot="default" class="ml120">
          <el-button type="primary" size="small" @click="submit" :loading="btnloading" v-if="!objId" class="w_100">提交</el-button>
          <el-button size="small" type="primary" v-if="objId && !edit && (originalObj.status === 2 || originalObj.status === 1)" @click="handlerEdit" class="w_60">编辑</el-button>
          <el-button size="small" type="primary" v-if="objId && edit" @click="submit" class="w_60" :loading="btnloading">保存</el-button>
          <el-button @click="cancel" size="small" v-if="!objId" class="w_60">取消</el-button>
          <el-button size="small" type="danger" v-if="objId && originalObj.status === 2" @click="handleDelete" class="w_60" :loading="btnloading">删除</el-button>
          <el-button size="small" type="danger" v-if="objId && originalObj.status === 1" @click="handlerTermination" class="w_60" :loading="btnloading">终止</el-button>
          <el-button size="small" type="primary" v-if="objId && originalObj.status === 4" @click="handlerTermination" class="w_60" :loading="btnloading">启用</el-button>
        </div>
      </ever-form2>
    </div>
    <!-- 新增供应商 -->
    <supplier-dialog ref="supplierdialog" @change="updateSupplier"></supplier-dialog>
  </div>
</template>

<script>
import api from './api/contrct.js'
import supplierDialog from '@/warehouse/page/purchease/contract/component/supplierdialog.vue' // 供应商
import supplierpriceapi from '@/warehouse/store/supplierpriceapi.js' // 获取机构下所有的供应商
import supplierLocalApi from '@/warehouse/store/supplierlocalapi.js'
import contractUpload from './component/contrctupload.vue'
import batchDownload from './component/batchdownload' // 批量下载
import materialDetails from '@/warehouse/page/purchease/contract/component/materialsItems.vue' // 物资详情组件
import { DOWNLOAD_FILE } from '@/warehouse/views/util/constant.js'
const STATUS = { '1': { id: 1, name: '有效' }, '2': { id: 2, name: '未开始' }, '3': { id: 3, name: '过期' }, '4': { id: 4, name: '终止' }, }
let schema = []
let schemaList = [
  {
    name: 'name',
    label: '合同名称',
    props: {
      maxlength: 30
    },
    span: 12
  },
  {
    name: 'contractNo',
    label: '合同编号',
    props: {
      maxlength: 30
    },
    span: 12
  },
  {
    name: 'supplierLocalId',
    label: '供应商',
    comp: 'ever-select',
    props: {
      placeholder: '请选择供应商',
      options: [],
      needObjFlag: true
    },
    span: 12
  },
  {
    name: 'startDate',
    label: '开始日期',
    comp: 'el-date-picker',
    style: 'width: 100%;',
    props: {
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      disabled: false,
    },
    span: 6
  },
  {
    name: 'endDate',
    label: '结束日期',
    comp: 'el-date-picker',
    style: 'width: 100%;',
    props: {
      type: 'date',
      valueFormat: 'yyyy-MM-dd',
      disabled: false,
    },
    span: 6
  },
  {
    name: 'addsupplier',
    label: '',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'purchaseSaleType',
    label: '供销方式',
    comp: 'radio',
    props: {
      options: [{ id: '购销', name: 1 }]
      //  刘笑宇 12-3 10:33
      //  @熊志清(平常心) 帮忙把代销藏起来
      // options: [{ id: '购销', name: 1 }, { id: '代销', name: 2 }]
    },
    span: 12
  },
  {
    name: 'signDate',
    label: '签订日期',
    comp: 'el-date-picker',
    style: 'width: 43%;',
    props: {
      type: 'date',
      disabled: false,
      valueFormat: 'yyyy-MM-dd'
    },
    span: 12
  },
  {
    name: 'contractFileUrls',
    label: '合同附件',
    comp: 'custom',
    span: 24
  },
  {
    name: 'materialsItems',
    label: '物资详情',
    comp: 'custom',
    span: 24
  },
]
let readSchema = [
  {
    name: 'contractNo',
    label: '合同编号',
    comp: 'readonlyitem',
    span: 12
  },
  {
    name: 'name',
    label: '合同名称',
    comp: 'readonlyitem',
    span: 12
  },
  {
    name: 'supplierLocalId',
    label: '供应商',
    comp: 'readonlyitem',
    class: 'suppliersty',
    span: 12
  },
  {
    name: 'daterange',
    label: '有效期',
    comp: 'readonlyitem',
    span: 12
  },
  {
    name: 'purchaseSaleType',
    label: '供销方式',
    comp: 'readonlyitem',
    span: 12
  },
  {
    name: 'signDate',
    label: '签订日期',
    comp: 'readonlyitem',
    props: {
      nocGray: true,
    },
    span: 12
  },
  {
    name: 'status',
    label: '合同状态',
    comp: 'readonlyitem',
    span: 24
  },
  {
    name: 'contractFileUrls',
    label: '合同附件',
    comp: 'custom',
    span: 24
  },
  {
    name: 'materialsItems',
    label: '物资详情',
    comp: 'custom',
    span: 24
  },
]

export default {
  data () {
    let endDateCheck = (rule, value, callback) => {
      if (this.obj.startDate && (value < this.obj.startDate)) {
        callback(new Error('结束日期不能早于开始日期'))
      } else {
        callback()
      }
    }
    let startDateCheck = (rule, value, callback) => {
      if (this.obj.endDate && (value > this.obj.endDate)) {
        callback(new Error('开始日期不能晚于结束日期'))
      } else {
        callback()
      }
    }
    // let signDateCheck = (rule, value, callback) => {
    //   if (this.obj.startDate && (value < this.obj.startDate)) {
    //     callback(new Error('签订日期不能早于开始时间'))
    //   } else {
    //     callback()
    //   }
    // }
    schema = this.createObject().schema
    let obj = this.createObject().obj
    obj.purchaseSaleType = 1
    obj.materialsItems = []
    obj.contractFileUrls = []
    return {
      schema,
      obj,
      newObj: {},
      edit: false,
      value1: '',
      cacheUpload: [], // 上传列表数据
      btnloading: false,
      rules: {
        name: [
          { required: true, message: '请输入 2 - 30 位的合同名称', trigger: 'blur', min: 2 }
        ],
        contractNo: [
          { required: true, min: 2, message: '请输入 2 - 30 位的合同编号', trigger: 'blur' }
        ],
        supplierLocalId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        startDate: [
          { required: true, trigger: 'blur', message: '必填项' },
          { validator: startDateCheck, }
        ],
        endDate: [
          { required: true, trigger: 'blur', message: '必填项' },
          { validator: endDateCheck }
        ],
        // signDate: [
        //   { trigger: 'change', validator: signDateCheck }
        // ]
      },
      supplierLocalApi,
      supplierpriceapi,
      api,
      isProcess: true,
      fileArr: [], // 合同附件
      originalObj: {}, // 缓存的原始的obj
      supplierObj: '', // 缓存的原始的供应商对象
      objId: this.$route.params.id,
      supplierId: this.$route.query.supplierId,
      uploadDisabled: true,
      batchDownload: [],
      supplierOptions: [], // 供应商options
      listArr: [], // 回显合同附件
    }
  },
  created () {
    if (this.objId) {
      this.getFormData()
    }
    this.getSupplier()
  },
  beforeDestroy () {
    const upload = document.querySelector('#uploadFJ')
    if (upload) {
      upload.removeEventListener('click', this.handleEventListener, false)
    }
  },
  watch: {
    edit: {
      handler (v) {
        let purchaseSaleType = this.$ever.getFieldFromSchema(this.schema, 'purchaseSaleType')
        let startDate = this.$ever.getFieldFromSchema(this.schema, 'startDate')
        let supplier = this.$ever.getFieldFromSchema(this.schema, 'supplierLocalId')
        if (v && this.objId) {
          if (this.originalObj.status === 1) { // 合同为有效状态
            purchaseSaleType.props.disabled = true
            startDate.props.disabled = true
            supplier.props.disabled = true
          }
        } else if (!v && !this.objId) {
          purchaseSaleType.props.disabled = false
          startDate.props.disabled = false
          supplier.props.disabled = false
        }
      },
      deep: true,
      immediate: true
    },
    obj: {
      handler (v) {
        this.$nextTick(() => {
          if (this.$route.params.id) {
            let uploadLi = document.querySelectorAll('ul.el-upload-list li.el-upload-list__item')
            let liList = [] // 实时DOM数据
            uploadLi.forEach((item, index) => { // 此处是为了获取最新的li最新的DOM集合,删除合同附件数据之后DOM没有更新
              if (item.className !== 'el-upload-list__item is-success focusing el-list-leave el-list-leave-active') {
                liList.push(item)
              }
            })
            if (!liList.length) return
            v.contractFileUrls.forEach((file, index) => {
              const span = document.createElement('i')
              span.className = 'el-icon-download cur blue'
              span.key = index
              liList[index].appendChild(span)
            })
            const upload = document.querySelector('#uploadFJ')
            if (upload) {
              // 先移除元素上的点击事件，再添加，确保方法不会重复绑定多次，浪费性能
              upload.removeEventListener('click', this.handleEventListener, false)
              upload.addEventListener('click', this.handleEventListener, false)
            }
          }
          this.batchDownload = []
          this.objId && v.contractFileUrls.forEach(item => {
            let urlList = item.url.split('=')
            urlList.length && this.batchDownload.push({
              downFile: item.name,
              url: this.$ever.fileUrl + DOWNLOAD_FILE + urlList[1]
            })
          })
        })
        if (v.endDate && v.startDate < v.endDate) {
          this.$refs.form.$refs.form.validateField('endDate')
        }
        if (v.startDate && v.endDate > v.startDate) {
          this.$refs.form.$refs.form.validateField('startDate')
        }
      },
      deep: true
    },
  },
  methods: {
    // 单文件下载
    handleEventListener (e) {
      if (e.target.className === 'el-icon-download cur blue') {
        let fileSuffix = this.obj.contractFileUrls[e.target.key].name
        let urlList = this.obj.contractFileUrls[e.target.key].url.split('=')
        // 下载调用平台新接口
        let api = this.$ever.fileUrl + DOWNLOAD_FILE + urlList[1]
        this.downloadDoc(api, fileSuffix)
      }
    },
    downloadDoc (url, name) {
      let a = document.createElement('a')
      a.style.display = 'none'
      a.target = '_blank'
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    backTo () {
      this.$router.go(-1)
      this.$router.query = {
        addcon: 'addcon'
      }
    },
    handlerProcess (event, file, fileList) { // 是否有文件在上传
      this.cacheUpload = fileList
      if (event.percent === 100 && this.obj.contractFileUrls.length === fileList.length) {
        this.isProcess = true
      } else {
        this.isProcess = false
      }
    },
    updateSupplier (flag) {
      if (flag) {
        this.getSupplier()
        setTimeout(_ => {
          this.$nextTick(_ => {
            this.obj.supplierLocalId = flag.name
          })
        }, 1000)
      }
    },
    handlerMater (v) { // 相当于 v-model 物资详情字段
      if (v) {
        const newTable = JSON.parse(JSON.stringify(v))
        this.obj.materialsItems = []
        newTable.map((item, index) => {
          if (item.materialsId) {
            item.sort = index + 1
            this.obj.materialsItems.push(item)
          }
        })
      }
    },
    handleDelete () { // 删除合同
      this.$confirm(`确认要删除当前${this.obj.contractNo}的合同吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.btnloading = true
        api.deleteContract({ id: this.objId }).then(res => {
          if (res) {
            this.$messageTips(this, 'success', '删除合同成功')
            setTimeout(_ => {
              this.backTo()
            }, 500)
          } else {
            this.getFormData()
          }
          this.btnloading = false
        })
      }).catch(() => {
      })
    },
    getSupplier () { // 获取供应商options
      supplierpriceapi.queryLocal({ filterOverdueRecord: true }).then(res => { // 获取供应商
        if (res && res.length) {
          res = res.map(supplier => {
            return {
              id: supplier.id,
              name: supplier.supplierObject ? supplier.supplierObject.name : ''
            }
          })
          this.supplierOptions = res
          const suppOp = this.$ever.getFieldFromSchema(this.schema, 'supplierLocalId')
          if (suppOp.props) suppOp.props.options = res
          if (this.supplierId) this.obj.supplierLocalId = this.supplierOptions.find(item => { return item.id === this.supplierId })
        }
      })
    },
    handlerUpload (list) { // 删除上传附件
      this.isProcess = true
      this.cacheUpload = list
      if (this.edit || !this.objId) {
        if (list && list.length) {
          if (list[0].response || list[0].upload) {
            this.obj.contractFileUrls = []
            list.forEach(item => {
              if (item.status === 'success') {
                this.obj.contractFileUrls.push({
                  name: item.name,
                  url: item.upload ? item.upload.url : item.response.data.fileUrl
                })
              }
            })
          }
        } else {
          this.obj.contractFileUrls = []
        }
      }
    },
    beforeUploadCustomize (file) {
      if (file.size > 1024 * 1024 * 100) {
        this.$message.error('上传文件大小不能超过 100MB!')
        return false
      }
    },
    downFile () { // 下载全部附件
      if (this.obj.contractFileUrls && this.obj.contractFileUrls.length) {
        this.$refs.exportDownload.downfile(this.batchDownload)
      }
    },
    handlerTermination () { // 启用、终止合同
      if (!this.isProcess) { // 附件上传中提示
        this.$confirm(`附件正在上传中，请上传完成后再点击终止`, '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
        })
        return
      }
      this.$confirm(`确认要${this.originalObj.status === 4 ? '启用' : '终止'}当前${this.obj.contractNo}的合同吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {}
        params = this.handleDate(params)
        params.status = params.status === 4 ? 3 : 4
        params.purchaseSaleType = this.obj.purchaseSaleType === '购销' || this.obj.purchaseSaleType === 1 ? 1 : 2
        let url = []
        params.contractFileUrls.length && params.contractFileUrls.map(item => {
          url.push({
            name: item.name,
            url: item.url
          })
        })
        params.contractFileUrls = url
        this.btnloading = true
        api.updateContrct(params).then(res => {
          this.btnloading = false
          if (res) {
            this.obj.status = this.originalObj.status === 4 ? '有效' : '终止'
            this.originalObj.status = params.status === 4 ? 4 : 1
            this.getFormData()
            this.edit = false
            this.schema = this.createObject().schema
            this.obj = this.createObject().obj
            return this.$messageTips(this, 'success', `${this.originalObj.status === 4 ? '终止' : '启用'}合同成功`)
          }
        })
      }).catch(() => {
      })
    },
    handlerEdit () { // 编辑
      this.schema = schemaList
      this.obj = this.$ever.createObjFromSchema(schemaList)
      this.obj = this.newObj
      this.edit = true
      this.uploadDisabled = true
      this.obj.daterange = [this.obj.startDate, this.obj.endDate]
      this.$ever.getFieldFromSchema(this.schema, 'supplierLocalId').props.options = this.supplierOptions
      let supplier = this.supplierOptions.find(supplier => { return supplier.name === (typeof this.obj.supplierLocalId === 'string' ? this.obj.supplierLocalId : this.obj.supplierLocalId.name) })
      this.obj.supplierLocalId = supplier
      this.obj.startDate = this.obj.startDate.split(' ')[0]
      this.obj.endDate = this.obj.endDate.split(' ')[0]
    },
    createObject () { // 处理schema
      schema = this.$route.params.id ? readSchema : schemaList
      return {
        schema,
        obj: this.$ever.createObjFromSchema(schema)
      }
    },
    getFormData () { // 获取查看页面数据
      api.getById({ id: this.objId }).then(res => {
        if (res) {
          const data = Object.keys(res)
          data.length && data.map(key => {
            this.obj[key] = res[key]
          })
          this.newObj = JSON.parse(JSON.stringify(this.obj))
          this.listArr = res.contractFileUrls
          this.originalObj = res
          this.obj.supplierLocalId = res.supplierLocalId.name
          this.obj.purchaseSaleType = this.obj.purchaseSaleType === 1 ? '购销' : '代销'
          this.obj.status = STATUS[this.obj.status].name
          this.obj.signDate = this.obj.signDate ? this.obj.signDate.split(' ')[0] : ''
          this.obj.daterange = `${this.obj.startDate.split(' ')[0]} 至 ${this.obj.endDate.split(' ')[0]}`
        }
      })
    },
    handlerSupplier () { // 新增供应商
      this.$refs.supplierdialog.open()
    },
    hanlderSuccess (file) { // 上传成功
      if (file) {
        this.obj.contractFileUrls.push({
          name: file.relName,
          url: file.name
        })
        // 上传成功，更改上传中状态
        let e = {}
        e.percent = 100
        this.handlerProcess(e, {}, this.obj.contractFileUrls)
      }
    },
    submit () { // 表单提交
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.btnloading = true
          let params = {}
          params = this.handleDate(params)
          if (!this.isProcess) { // 附件上传中提示
            this.$confirm(`附件正在上传中，请上传完成后提交。`, '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
            }).catch(() => {
            })
            this.btnloading = false
            return
          }
          let flag = params.materialsItems.length && params.materialsItems.find(item => { return !item.purchasePrice })
          if (flag) {
            this.btnloading = false
            return this.$messageTips(this, 'warning', '请填写采购单价再提交')
          }
          api[this.objId ? 'updateContrct' : 'addCreate'](params).then(res => {
            if (res) {
              this.$messageTips(this, 'success', `${this.$route.params.id ? '修改成功' : '创建成功'}`)
              setTimeout(_ => {
                this.backTo()
              }, 500)
            }
          })
          setTimeout(_ => {
            this.btnloading = false
          }, 500)
        }
      })
    },
    handleDate (date) { // 处理提交的数据
      date = Object.assign({}, date, this.obj)
      if (this.objId) {
        date.status = this.originalObj.status
      }
      let supplier = this.supplierOptions.find(supplier => { return supplier.name === (typeof this.obj.supplierLocalId === 'string' ? this.obj.supplierLocalId : this.obj.supplierLocalId.name) })
      date.supplierLocalId = supplier
      delete date.daterange
      delete date.addsupplier
      date.startDate = date.startDate ? date.startDate + ' 00:00:00' : ''
      date.endDate = date.endDate ? date.endDate + ' 23:59:59' : ''
      return date
    },
    cancel () { // 表单取消
      let cancel
      Object.keys(this.obj).forEach(key => {
        if (key !== 'purchaseSaleType') {
          if ((!Array.isArray(this.obj[key]) && this.obj[key]) || (Array.isArray(this.obj[key]) && this.obj[key].length)) {
            cancel = true
          }
        }
      })
      if (cancel) {
        this.$confirm('您填写的内容尚未提交，是否要离开页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.backTo()
        }).catch(() => {
        })
      } else {
        this.backTo()
      }
    },
  },
  components: {
    supplierDialog,
    contractUpload,
    materialDetails,
    batchDownload
  }
}

</script>
<style scoped lang="less">
.el-button + .el-button {
  margin-left: 15px;
}
.form /deep/ .el-form-item .el-form-item__label {
  color: #999;
}
.suppliersty {
  height: 80px;
}
.listUploads {
  line-height: 0px;
}
.listUpload {
  line-height: 0px;
}
.candelNone /deep/ .el-upload-list {
  .el-icon-close {
    display: none;
  }
}
.formUpload /deep/ .el-upload-list {
  .el-upload-list__item-status-label {
    top: 0px;
  }
  .el-icon-close {
    position: absolute;
    top: 5px;
  }
  .el-icon-download {
    position: absolute;
    top: 5px;
    right: -15px;
  }
}
.showDown /deep/ .el-upload-list {
  width: 105%;
  .el-upload-list__item-status-label {
    top: 0px;
    right: 25px;
  }
  .el-icon-download {
    position: absolute;
    top: 5px;
    right: 2px;
  }
  .el-icon-close {
    position: absolute;
    top: 5px;
    right: 25px;
  }
}

</style>
