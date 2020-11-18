<template>
  <div class="layout_inner">
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      :isQuery="true"
      :inline="true"
      @query="list(true)"
    >
      <template slot="btns">
        <div>
          <el-button type="primary" size="small" @click="list(true)">查询</el-button>
          <el-button @click="reset" size="small">重置</el-button>
        </div>
      </template>
      <div class="btns">
        <el-button
          v-if="isCf"
          type="primary"
          size="small"
          @click="downloadDirectory"
        >下载医保目录</el-button>
        <el-button
          v-if="isCf"
          type="primary"
          size="small"
          @click="downloadComparison"
        >下载对照关系</el-button>
        <!-- 山东乐陵医保目录查询 -->
        <el-button
          v-if="!isCf && queryObj.insuranceOrgId == sdllCode"
          :disabled="medicalDirQueryDis"
          type="primary"
          size="small"
          @click="medicalDirQuery"
        >医保目录查询</el-button>
        <!-- 三亚医保添加同步审核结果 -->
        <el-button
          v-if="!isCf && queryObj.insuranceOrgId == sysqzyyCode"
          type="primary"
          size="small"
          @click="syncApprovalRes"
        >同步审核结果</el-button>
        <el-button v-if="!isCf" type="primary" size="small" @click="synchronization">本地目录同步</el-button>
        <el-button type="primary" size="small" @click="templateDownload">数据导出</el-button>
        <ever-upload1
          v-if="!isCf"
          ref="upload"
          class="upload"
          v-model="fileName"
          @success="dataImport"
          type="doc"
          :limit="1"
          :showFileList="false"
          uploadTxt="数据导入"
        ></ever-upload1>
        <el-button
          v-if="!isCf && !uploadExcludeOrgs.includes(queryObj.insuranceOrgId)"
          type="primary"
          size="small"
          @click="upload(false)"
          :disabled="uploadBtn || tableData.length===0"
        >上传至医保中心</el-button>
      </div>
    </ever-form2>
    <el-table
      :data="tableData"
      stripe
      class="medicalTable"
      row-key="serviceId"
      :expand-row-keys="entexpands"
      v-loading="loading"
      v-if="insure"
    >
      <el-table-column prop type="expand">
        <template slot-scope="props">
          <!-- 第二层 -->
          <el-table
            stripe
            :data="props.row.mapList"
            @selection-change="(val) => handleSelectionChange(val, props.$index)"
            empty-text="暂无数据"
          >
            <el-table-column width="50"></el-table-column>
            <el-table-column v-if="!isCf" show-overflow-tooltip type="selection" width="55"></el-table-column>
            <el-table-column show-overflow-tooltip label="保险公司" prop="insuranceOrgName"></el-table-column>
            <el-table-column show-overflow-tooltip label="医保编码" prop="centralDirCode"></el-table-column>
            <el-table-column label="收费等级" prop="chargeLevel">
              <template slot-scope="scope">{{scope.row.chargeLevel | medicalChargeLevel}}</template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="医保名" prop="centralDirName"></el-table-column>
            <el-table-column show-overflow-tooltip label="目录类别" prop="dirType">
              <template
                slot-scope="scope"
              >{{scope.row.dirType === 0 ? '药品': scope.row.dirType === 1 ? '诊疗': '服务设施'}}</template>
            </el-table-column>
            <el-table-column v-if="!isCf" show-overflow-tooltip prop="specification" label="规格"></el-table-column>
            <el-table-column show-overflow-tooltip prop="drugForm" label="剂型"></el-table-column>
            <el-table-column v-if="!isCf" show-overflow-tooltip prop="manufacturer" label="生产厂商"></el-table-column>
            <el-table-column v-if="!isCf" show-overflow-tooltip prop="approvalNumber" label="批准文号"></el-table-column>
            <el-table-column v-if="!isCf" show-overflow-tooltip label="对照人" prop="comparePerson"></el-table-column>
            <el-table-column v-if="!isCf" show-overflow-tooltip label="上传时间" prop="updateTime"></el-table-column>
            <el-table-column v-if="!isCf" show-overflow-tooltip label="上传状态" prop="uploadStatusName"></el-table-column>
            <el-table-column v-if="!isCf" show-overflow-tooltip label="备注" prop="remark"></el-table-column>
            <el-table-column v-if="!isCf" label="操作" width="220" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" @click="emitPairCode(scope.row, props)">编辑</el-button>
                <!-- 山东乐陵不需要上传医保 -->
                <el-button
                  v-if="!uploadExcludeOrgs.includes(scope.row.insuranceOrgId)"
                  type="primary"
                  @click="upload(scope.row, props)"
                >上传医保</el-button>
                <el-button type="danger" @click="handleDelete(scope.row, props)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column v-if="isCf" show-overflow-tooltip prop="serviceCode" label="项目编码"></el-table-column>
      <el-table-column show-overflow-tooltip prop="serviceName" label="项目名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="genericName" label="通用名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="unitName" label="单位"></el-table-column>
      <el-table-column show-overflow-tooltip prop="salePrice" label="单价"></el-table-column>
      <el-table-column show-overflow-tooltip prop="specification" label="规格"></el-table-column>
      <el-table-column show-overflow-tooltip prop="drugForm" label="剂型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="manufacturer" label="生产厂商"></el-table-column>
      <el-table-column show-overflow-tooltip prop="approvalNumber" label="批准文号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="serviceClassificationName" label="分类"></el-table-column>
      <el-table-column v-if="!isCf" show-overflow-tooltip prop="uploadSuccessNum" label="对码平台数"></el-table-column>
      <el-table-column v-if="!isCf" prop="outprop7" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="addPairCode(scope.row)">新增对码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
    <el-dialog
      v-if="receiveInfo.visible"
      width="80%"
      :title="receiveInfo.title"
      :close-on-click-modal="false"
      class="bill-dialog"
      :visible.sync="receiveInfo.visible"
      append-to-body
    >
      <div>
        <el-table :data="receiveInfo.data">
          <el-table-column show-overflow-tooltip prop="serviceName" label="药品名"></el-table-column>
          <el-table-column show-overflow-tooltip prop="genericName" label="通用名"></el-table-column>
          <el-table-column show-overflow-tooltip prop="unitName" label="单位"></el-table-column>
          <el-table-column show-overflow-tooltip prop="salePrice" label="单价"></el-table-column>
          <el-table-column show-overflow-tooltip prop="specification" label="规格"></el-table-column>
          <el-table-column show-overflow-tooltip prop="drugForm" label="剂型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="manufacturer" label="生产厂商"></el-table-column>
          <el-table-column show-overflow-tooltip prop="approvalNumber" label="批准文号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="serviceClassificationName" label="分类"></el-table-column>
        </el-table>
        <ever-form2
          :schema="addSchema"
          v-model="addQueryObj"
          :rules="rules"
          :nosubmit="true"
          ref="form"
          :span="6"
          :info="true"
          labelWidth="80px"
          label-position="right"
        >
          <template slot="insuranceOrgId">
            <medicalOrgList
              v-model="addQueryObj.insuranceOrgId"
              @change="insuranceChange"
              :clearable="clearable"
              :defaultFirst="false"
            ></medicalOrgList>
          </template>
          <template slot="dirType">
            <ever-select v-model="addQueryObj.dirType" :options="typeOptions" @change="typeChange"></ever-select>
          </template>
          <template slot="dirCode">
            <el-select
              v-model="receiveInfo.codeValue"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              @change="seleChange"
              :loading="receiveInfo.diaLoading"
            >
              <el-option
                v-for="item in receiveInfo.options"
                :key="item.dirCode"
                :label="item.dirCode"
                :value="item.dirCode"
              >
                <span>{{ item.dirName }}</span>
                <span v-if="item.dirCode" class="optionItem">/{{ item.dirCode }}</span>
                <span v-if="item.specification" class="optionItem">/{{ item.specification }}</span>
                <span v-if="item.drugForm" class="optionItem">/{{ item.drugForm }}</span>
                <span v-if="item.manufacturer" class="optionItem">/{{ item.manufacturer }}</span>
                <span v-if="item.approvalNumber" class="optionItem">/{{ item.approvalNumber }}</span>
              </el-option>
            </el-select>
          </template>
        </ever-form2>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="receiveInfo.visible = false">取消</el-button>
        <el-button type="primary" @click="addBtn">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMedicalItemList,
  queryUploadStatus,
  templateDownload,
  dataImport,
  selectByParam, // 查询中心编码
  insert,
  updateById,
  getMedicalOrgList,
  loadNewData,
  compareNew,
  deleteById
} from '@/rcm/store/otmdiscomponent/insurancesignin.js'
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import list from '@/util/list'
import { medicalChargeLevel, tyUploadStatus, cfUploadStatus } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { hljybCode, sysqzyyCode, sdllCode, gdcfybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { updateUploadingStatus } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
import { updateYyxmInfoBySxh } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import { downloadMedicare, downloadMatch } from '@/rcm/store/otmdiscomponent/gd.localhost.api.js'
let schema = [
  {
    label: '保险公司',
    name: 'insuranceOrgId',
    comp: medicalOrgList,
    props: {
      clearable: true
    },
  }, {
    label: '目录类别',
    name: 'dirType',
    comp: 'ever-select',
    props: {
      options: [{
        id: '0',
        name: '药品'
      },
      {
        id: '1',
        name: '诊疗'
      },
      {
        id: '2',
        name: '服务设施'
      }]
    }
  }, {
    label: '项目名称',
    name: 'serviceName'
  }, {
    name: 'serviceClassification',
    label: '分类',
    comp: 'sys-type',
    props: {
      useValue: true,
      code: 'THC_WH_OBJECT_SUB_TYPE'
    },
    span: 6
  }, {
    label: '医保编码',
    name: 'centralDirCode'
  }, {
    label: '对照状态',
    name: 'uploadStatus',
    comp: 'ever-select',
    props: {
      options: tyUploadStatus
    },
  }, {
    label: '',
    name: 'btns',
    comp: 'custom',
  }
]
let addSchema = [
  {
    label: '医保公司',
    name: 'insuranceOrgId',
    comp: 'custom'
  },
  {
    label: '目录类别',
    name: 'dirType',
    comp: 'custom'
  },
  {
    label: '中心编码',
    name: 'dirCode',
    comp: 'custom'
  },
  {
    label: '中心名称',
    name: 'dirName',
    props: {
      disabled: true
    }
  }
]
let rules = {
  insuranceOrgId: [{
    required: true,
    message: '请选择医保公司',
    trigger: 'change'
  }],
  dirCode: [{
    required: true,
    message: '请选择中心编码',
    trigger: 'change'
  }],
  dirType: [{
    required: true,
    message: '请选择目录类别',
    trigger: 'change'
  }]
}
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    let addQueryObj = this.$ever.createObjFromSchema(addSchema)
    return {
      schema,
      queryObj,
      addSchema,
      addQueryObj,
      rules,
      tableSelection: [],
      uploadBtn: false,
      fileName: '',
      receiveInfo: {
        title: '新增对码',
        visible: false,
        data: [],
        options: [],
        diaLoading: false,
        codeValue: '',
        serviceId: '',
        serviceName: ''
      },
      typeOptions: [
        { id: '0', name: '药品' },
        { id: '1', name: '诊疗' },
        { id: '2', name: '服务设施' }
      ],
      clearable: false,
      medicalOrgoptions: [],
      entexpands: [],
      serviceId: '',
      hljybCode,
      sysqzyyCode,
      sdllCode,
      gdcfybCode,
      uploadExcludeOrgs: [sdllCode],
      medicalDirQueryDis: false,
      insure: true,
      tyUploadStatus,
      cfUploadStatus
    }
  },
  methods: {
    downloadDirectory () {
      this.loading = true
      downloadMedicare().then(rs => {
        if (!rs.head.errCode) {
          this.$messageTips(this, 'success', '下载医保目录成功')
        } else {
          this.$messageTips(this, 'error', '下载医保目录失败')
        }
        this.loading = false
      }, rj => {
        this.loading = false
        this.$messageTips(this, 'error', '下载医保目录失败')
      })
    },
    downloadComparison () {
      this.loading = true
      downloadMatch().then(rs => {
        if (!rs.head.errCode) {
          this.$messageTips(this, 'success', '下载对照关系成功')
        } else {
          this.$messageTips(this, 'error', '下载对照关系失败')
        }
        this.loading = false
      }, rj => {
        this.loading = false
        this.$messageTips(this, 'error', '下载对照关系失败')
      })
    },
    addPairCode (row) {
      this.receiveInfo.data = [row]
      this.receiveInfo.id = ''
      this.receiveInfo.serviceId = row.serviceId
      this.receiveInfo.serviceName = row.serviceName
      this.receiveInfo.title = '新增对码'
      this.receiveInfo.visible = true
      this.serviceId = row.serviceId
    },
    emitPairCode (row, props) {
      this.receiveInfo.data = [props.row]
      this.receiveInfo.id = row.id
      this.receiveInfo.serviceId = props.row.serviceId
      this.receiveInfo.serviceName = props.row.serviceName
      this.receiveInfo.title = '编辑对码'
      this.receiveInfo.visible = true
      this.addQueryObj.insuranceOrgId = row.insuranceOrgId
      this.addQueryObj.dirType = String(row.dirType)
      this.addQueryObj.dirCode = row.centralDirCode
      this.receiveInfo.codeValue = row.centralDirCode
      this.addQueryObj.dirName = row.centralDirName
      this.receiveInfo.options = [{ dirCode: row.centralDirCode, dirName: row.centralDirName }]
      this.serviceId = props.row.serviceId
    },
    handleDelete (row, props) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id
        }
        // 黑龙江医保的删除居然要macId
        if (row.insuranceOrgId === this.hljybCode) {
          params.macId = this.macId
        }
        return deleteById(params)
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.serviceId = props.row.serviceId
        this.list()
      })
    },
    addBtn () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let info = this.receiveInfo.options.find(item => { return this.receiveInfo.codeValue === item.dirCode }) || ''
          let params = {
            dirType: this.addQueryObj.dirType,
            insuranceOrgId: this.addQueryObj.insuranceOrgId,
            insuranceOrgName: this.medicalOrgoptions.find(item => { return this.addQueryObj.insuranceOrgId === item.id }).insureOrgShortName,
            centralDirCode: this.receiveInfo.codeValue,
            centralDirName: info ? info.dirName : '',
            serviceId: this.receiveInfo.serviceId,
            hospitalItemName: this.receiveInfo.serviceName
          }
          if (this.receiveInfo.id) {
            params.id = this.receiveInfo.id
            updateById(params).then(rs => {
              if (rs.head.errCode === 0) {
                this.$messageTips(this, 'success', '编辑对码成功')
                this.receiveInfo.visible = false
                this.receiveInfo.codeValue = ''
                this.list()
              } else {
                this.$messageTips(this, 'error', '编辑对码失败')
              }
            })
          } else {
            insert(params).then(rs => {
              if (rs.head.errCode === 0) {
                this.$messageTips(this, 'success', '新增对码成功')
                this.receiveInfo.visible = false
                this.receiveInfo.codeValue = ''
                this.list()
              } else {
                this.$messageTips(this, 'error', '新增对码失败')
              }
            })
          }
        }
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.receiveInfo.diaLoading = true
        setTimeout(() => {
          this.receiveInfo.diaLoading = false
          let params = {
            dirCode: query,
            page: 1,
            pagesize: 10
          }
          if (this.addQueryObj.dirType) {
            params.dirType = this.addQueryObj.dirType
          }
          if (this.addQueryObj.insuranceOrgId) {
            params.insuranceOrgId = this.addQueryObj.insuranceOrgId
          }
          selectByParam(params).then(rs => {
            if (rs.data && rs.data.list) {
              this.receiveInfo.options = rs.data.list
            }
          })
        }, 300)
      } else {
        this.options = []
      }
    },
    seleChange (val) {
      let info = this.receiveInfo.options.find(item => { return item.dirCode === val })
      this.addQueryObj.dirCode = info.dirCode
      this.addQueryObj.codeValue = info.dirName
      this.addQueryObj.dirName = info.dirName
      this.addQueryObj.dirType = String(info.dirType)
      this.addQueryObj.insuranceOrgId = info.insuranceOrgId
    },
    // 三亚专用同步审核结果
    syncApprovalRes () {
      updateUploadingStatus({ macId: this.macId }).then(res => {
        this.list(true)
      }).catch((err) => {
        console.log('err', err)
      })
    },
    synchronization () {
      loadNewData().then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '本地目录同步成功')
          this.list()
        } else {
          this.$messageTips(this, 'error', '本地目录同步失败')
        }
      })
    },
    // 山东乐陵医保目录查询
    medicalDirQuery () {
      this.medicalDirQueryDis = true
      let params = {
        macId: this.macId,
        insuranceOrgId: sdllCode,
        sbjgbh: '37140101',
        jsonPara: {
          filetype: 'json'
        }
      }
      updateYyxmInfoBySxh(params).then(res => {
        const count = res.data
        this.$messageTips(this, 'success', `本次更新了${count}条目录信息`)
        this.medicalDirQueryDis = false
      }).catch((err) => {
        console.log('err', err)
        this.medicalDirQueryDis = false
      })
    },
    list (flag) {
      this.loading = true
      if (flag) {
        this.current = 1
        this.page = 0
      }
      let obj = JSON.parse(JSON.stringify(this.queryObj))
      delete obj.btns
      let params = { pageSize: this.pagesize, page: this.current, ...obj }
      if (this.isCf && params.uploadStatus) { // 长峰对照状态筛选参数做单独处理
        params['mapStatus'] = Number(params.uploadStatus)
        delete params.uploadStatus
      }
      getMedicalItemList(params).then(res => {
        res.data.list.forEach(item => {
          item.selection = []
        })
        this.tableData = res.data.list
        this.totalCount = res.data.total
        if (this.serviceId) { // 刷新数据后默认展开操作的数据
          this.entexpands = [this.serviceId]
        }
        this.loading = false
      }, err => {
        this.loading = false
        console.log('err', err)
      })
    },
    reset () {
      // 保存当前医保机构，重置后再赋值回来
      let insuranceOrgId = this.queryObj.insuranceOrgId
      this.$refs.form.resetForm()
      this.queryObj.insuranceOrgId = insuranceOrgId
      this.list(true)
    },
    handleSelectionChange (selection, index) {
      this.tableData[index]['selection'] = selection
      this.tableSelection = selection
    },
    upload (row, props) {
      if (props) {
        this.serviceId = props.row.serviceId
      }
      let params = {}
      if (row) {
        params = { ids: [row.id], macId: this.macId, insuranceOrgId: row.insuranceOrgId }
      } else {
        let ids = []
        this.tableData.forEach(item => {
          item.selection.forEach(lab => {
            ids.push(lab.id)
          })
        })
        params = { ids: ids, macId: this.macId, insuranceOrgId: this.queryObj.insuranceOrgId }
      }
      // 先查询上次上传状态, 如果上传完了，接着操作,如果没有上传完，禁止
      queryUploadStatus(params).then(res => {
        // console.log('res', res)
        this.showConfirm(res.data, params)
      }, err => {
        console.log('err', err)
      })
    },
    showConfirm (data, params) {
      this.$confirm(`此次共上传${data.querySize}条数据,需要时间大约${data.forecastTime}秒，是否确定上传?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doUpload(params)
      }).catch(() => {
      })
    },
    doUpload (params) {
      this.uploadBtn = true
      // 调接口上传
      compareNew(params).then(res => {
        this.uploadBtn = false
        this.$messageTips(this, 'success', '正在上传，请稍后查询上传结果')
        this.list(true)
      }, err => {
        this.uploadBtn = false
        console.log('err', err)
      })
    },
    // 模板下载
    templateDownload () {
      let params = { insuranceOrgId: this.queryObj.insuranceOrgId }
      templateDownload(params).then(res => {
        if (!res.data) {
          this.$messageTips(this, 'error', '未找到导出文件路径！')
        } else {
          window.open(this.$ever.fileUrl2 + res.data.fileId)
        }
      })
    },
    // 数据导入
    dataImport (uploadData) {
      let params = { insuranceOrgId: this.queryObj.insuranceOrgId, fileId: uploadData.fileId, fileName: this.$refs.upload.fileList[0].name }
      dataImport(params).then(res => {
        this.$refs.upload.fileList = []
        let result = res.data
        let message = `本次共处理数据${result.totalSize}条，新增${result.addSize}条，更新${result.updateSize}条，失败${result.failSize}条${result.failSize > 0 ? `，失败数据已导出到文件，请修改之后再次上传。` : ``}`
        this.$messageTips(this, 'success', message)
        if (result.failSize > 0) {
          let failFileId = result.failFileId
          if (failFileId) {
            window.open(this.$ever.fileUrl2 + failFileId)
          } else {
            this.$messageTips(this, 'error', '后台文件导出异常，请稍后再试！')
          }
        }
        this.list(true)
      }, err => {
        this.$refs.upload.fileList = []
        console.log('err', err)
      })
    },
    insuranceChange () {
      this.addQueryObj.dirCode = ''
      this.receiveInfo.codeValue = ''
      this.addQueryObj.dirName = ''
      this.receiveInfo.options = []
    },
    typeChange () {
      this.addQueryObj.dirCode = ''
      this.receiveInfo.codeValue = ''
      this.addQueryObj.dirName = ''
      this.receiveInfo.options = []
    },
    checkParams () {
      if (!this.queryObj.insuranceOrgId) {
        this.$messageTips(this, 'error', '请先选择保险公司')
        return false
      }
      return true
    },
  },
  filters: {
    medicalChargeLevel (val) {
      return medicalChargeLevel[val]
    }
  },
  computed: {
    isCf () {
      return this.queryObj.insuranceOrgId === this.gdcfybCode
    }
  },
  created () {
    let params = {
      corpType: '0', // 基本医疗保险
      offset: 0,
      page: 1,
      pagesize: 20
    }
    getMedicalOrgList(params).then(res => {
      this.medicalOrgoptions = res.data
    })
  },
  components: {
    medicalOrgList
  },
  watch: {
    'receiveInfo.visible': {
      handler: function (val, oldval) {
        if (!val) {
          this.addQueryObj.insuranceOrgId = ''
          this.addQueryObj.dirType = ''
          this.addQueryObj.dirCode = ''
          this.receiveInfo.codeValue = ''
          this.receiveInfo.id = ''
          this.addQueryObj.dirName = ''
        }
      }
    },
    'queryObj.insuranceOrgId': {
      handler: function (val) {
        if (val === this.gdcfybCode) {
          this.$ever.getFieldFromSchema(this.schema, 'uploadStatus').props.options = this.cfUploadStatus
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'uploadStatus').props.options = this.tyUploadStatus
        }
        this.insure = false
        this.$nextTick(_ => {
          this.insure = true
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
.btns {
  float: right;
}
.btns .el-button + .el-button {
  margin-left: 0px;
}
.btns span.upload {
  display: inline-block;
}
.btns span.upload div {
  display: inline-block;
}
.layout_inner {
  display: flex;
  flex-direction: column;
}
.medicalTable {
  overflow: auto;
}
.medicalTable /deep/ .el-table__expanded-cell {
  padding: 0;
  & .el-table {
    margin: 0;
  }
}
.optionItem {
  color: #8492a6;
  font-size: 13px;
}
</style>
