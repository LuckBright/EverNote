<template>
  <div class="printdetail flex_row_full_hidden">
    <div class="main_wrap flex_col_1_hidden">
        <div v-if="code==='ZHU_YUAN_BING_AN_SHOU_YE'" class="medical_index flex_col_1_auto">
          <el-button type="primary" @click="printMedicalIndex">打印</el-button>
          <!-- <el-button type="primary" @click="printMedicalIndex({preview:true})">预览</el-button> -->
          <el-button type="primary" @click="back=!back">正反面</el-button>
          <medical-index
            ref="medicalIndex"
            :patientId="patientId || $route.query.patientId"
            :visitId="visitId || $route.query.visitId"
            :dptId="dptId || $route.query.dptId"
            :readonly="true"
            :key="uuid"
            :back="back">
          </medical-index>
        </div>
        <div
          v-else-if="code==='TI_WEN_JI_LU_DAN'"
          class="check_tiwen flex_column_full flex_column_full_hidden">
          <check-tiwen
              class="flex_column_full_hidden"
              :authority="2"
              :patient-id="patientId || $route.query.patientId"
              :patient-name="patientName|| $route.query.patientName"
              :visit-id="visitId || $route.query.visitId"></check-tiwen>
        </div>
      <div v-else-if="dataId" class="flex_col_1_auto">
        <tpl-doc
          v-if="designerId==='2'"
          class="flex_col_1_auto"
          :visit-id="visitId || $route.query.visitId"
          :patient-id="patientId || $route.query.patientId"
          :dpt-id="dptId || $route.query.dptId"
          :data-id="dataId"
          :schema-id="schemaId"
          ref="tpldoc"
          :key="uuid"
          :editable="false"
          :doctype="doctype"
        >
        </tpl-doc>
        <tpl-form
          v-else-if="designerId==='1'"
          ref="tplform"
          :data-id="dataId"
          v-model="form"
          :key="uuid"
          :schema-id="schemaId"
          :allDisabled="true"
        ></tpl-form>
      </div>
      <everNoData tipTxt="请选择需要查看的病历"
              v-else></everNoData>
    </div>
    <div class="sidebar_wrap flex_column_full">
      <div class="print_btn pl">
        <el-button type="primary" @click="getPrintData">打印</el-button>
        <el-checkbox v-model="preview">需要预览</el-checkbox>
        <span>{{printedNum}}/{{printTotal}}</span>
        <slot name="close"></slot>
      </div>
      <div class="record_tree flex_col_1_auto">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="nursing">
            <template slot="title" class="pl">
              <svg class="icon"
                   aria-hidden="true">
                <use xlink:href="#icon-huliwenshu"></use>
              </svg>
              <div class="pl">护理文书</div>
            </template>
            <div class="pl content">
              <el-tree
                show-checkbox
                node-key="id"
                ref="nursingtree"
                :data="nursingList"
                :props="defaultProps"
                @check="checkChange"
                @node-click="handleNodeClick"
                >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <svg class="icon"
                      aria-hidden="true"
                      v-if="!data.isInstance">
                    <use :xlink:href="`#${data.icon}`"></use>
                  </svg>
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </el-collapse-item>
          <el-collapse-item name="doctor">
            <template slot="title">
              <svg class="icon"
                   aria-hidden="true">
                <use xlink:href="#icon-binglishuxie"></use>
              </svg>
              <div class="pl">病历书写</div>
            </template>
            <div class="pl content">
              <el-tree
                show-checkbox
                node-key="id"
                ref="doctortree"
                :data="doctorList"
                :props="defaultProps"
                @node-click="handleNodeClick"
                @check-change="checkChange"
               >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <svg class="icon"
                      aria-hidden="true"
                      v-if="!data.isInstance">
                    <use :xlink:href="`#${data.icon}`"></use>
                  </svg>
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>
<script>
import urlMap from '@/emr/urls'
import { request } from '@/util/req'
import tplDoc from '@/form/components/tpldoc'
import medicalIndex from '@/components/medicalindex/index'
import tplForm from '@/form/components/tplform'
// import tmpChart from '@/components/temperature.chart/temperaturechart'
import checkTiwen from '@/inpatient/page/medicalrecord/check.tiwen'
import uuidv4 from 'uuid/v4'
import storage from '@/util/storage'
import recordprint from './recordprint.js'
import {commandLog} from '@/phr/mixin/operationLog.js'
export default {
  mixins: [recordprint],
  props: {
    patientId: {
      type: String,
      default: ''
    },
    visitId: {
      type: String,
      default: ''
    },
    dptId: {
      type: String,
      default: ''
    },
    printLength: {
      type: Number,
      default: 0
    },
    patientName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeNames: ['nursing', 'doctor'],
      uuid: uuidv4(),
      dataId: '',
      schemaId: '',
      code: '',
      designerId: '',
      doctype: '1',
      back: false,
      printTotal: 0,
      printedNum: 0,
      preview: true,
      form: {},
      url: urlMap.recordManage.getCategoryTreeExistMedical,
      nursingList: [],
      doctorList: [],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      }
    }
  },
  created () {
    this.initRefresh()
  },
  methods: {
    emptyPrintData () {
      this.printData = []
      this.$emit('update:printLength', 0)
    },
    // 刷新页面初始化
    initRefresh () {
      this.getNursingTree()
      this.getDoctorTree()
      let data = storage.getLocalStorage('recordPrintData')
      let recordData = data ? JSON.parse(data) : null
      if (recordData) {
        this.handleNodeClick(recordData)
      }
    },
    printMedicalIndex (settings) {
      commandLog({// 需要加备注
        content: `打印病案首页`,
        opModuleOne: '病案管理-病历打印-病案首页',
        opType: 'PRINT',
        patientId: this.patientId,
        patientName: this.patientName,
        visitNumber: this.visitId
      })
      this.$refs.medicalIndex && this.$refs.medicalIndex.print(settings)
    },
    // 批量打印按钮
    async getPrintData () {
      if (this.code === 'TI_WEN_JI_LU_DAN') {
        this.code = ''
        this.dataId = ''
      }
      // 获取选中的病例id
      let checkedRecords = this.mergeCheckedNodes()
      let recordIds = this.getInstanceIds(checkedRecords)
      // 获取需要打印的内容
      let res = await request(urlMap.recordManage.batchPrint, recordIds)
      // 打印队列里面的数据
      this.printData = this.resetArrByCode(res.data)
      if (!this.printData.length) {
        this.$messageTips(this, 'warning', '请选择需要打印的病历')
        return false
      }
      this.index = 0
      this.printTotal = this.printData.length
      this.$emit('update:printLength', this.printTotal)
      this.batchPrint()
    },
    handleNodeClick (data, node) {
      // 体温单
      let specialCodes = ['TI_WEN_JI_LU_DAN']
      if (specialCodes.includes(data.code)) {
        storage.setLocalStorage('recordPrintData', JSON.stringify(data))
        this.code = data.code
        this.emptyPrintData()
        return false
      }
      if (data.isInstance) {
        storage.setLocalStorage('recordPrintData', JSON.stringify(data))
        // 病案首页
        if (data.code !== 'ZHU_YUAN_BING_AN_SHOU_YE') {
          this.dataId = data.id
          this.schemaId = data.formTemplateId
          this.designerId = data.designerId
          if (data.designerId === '2') {
            this.doctype = data.type
          }
        }
        this.uuid = uuidv4()
        this.code = data.code
      }
    },
    setDisabled (data) {
      let disabledCodes = ['ZHU_YUAN_BING_AN_SHOU_YE', 'TI_WEN_JI_LU_DAN']
      data.forEach(item => {
        if (disabledCodes.includes(item.code)) {
          this.$set(item, 'disabled', true)
          if (item.nodes && item.nodes.length > 0) {
            this.setDisabled(item.nodes)
          }
        }
      })
    },
    async getNursingTree () { // 护理文书需要的接口
      let res = await request(this.url, {
        type: '3', // 护理文书
        visitNumber: this.visitId || this.$route.query.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.nursingList = res.data
        this.setDisabled(this.nursingList)
      }
    },
    async getDoctorTree () {
        // 电子病历实例树
      let res = await request(this.url, {
        type: '1', // 1-住院医生 2-门诊 3-护理
        visitNumber: this.visitId || this.$route.query.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.doctorList = res.data
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            if (this.progressCodes.includes(item.code)) {
              this.getPrintContinueRecords()
            }
          })
        }
        this.setDisabled(this.doctorList)
      }
    }
  },
  components: {
    tplDoc,
    tplForm,
    medicalIndex,
    checkTiwen
  }
}
</script>
<style lang="scss" scoped>
.flex_row_full_hidden{
    display: flex;
    flex-direction: row;
    height:100%;
    overflow:hidden;
  }
.printdetail{
  .check_tiwen,.medical_index{
    margin:0 auto;
  }
  .com_no_data{
    margin:auto;
  }
  .main_wrap{
    display:flex;
  }
  .sidebar_wrap {
    width: 280px;
    border-left: 1px solid #ccc;
    border-top:1px solid #ccc;
  }
  .pl{
    padding-left:15px;
  }
  .print_btn{
    padding:10px 0 10px 15px;
  }
  .record_tree{
    border-top:1px solid #ccc;
    /deep/.is-disabled{
      visibility: hidden;
      // display: none;
    }
  }
  /deep/.el-collapse {
    border-top: none;
    border-bottom: 1px solid #ddd;
  }
  /deep/.el-collapse-item__header {
    padding-left: 10px;
    border-bottom: #ddd;
    background-image: linear-gradient(180deg, #ffffff 0%, #f4f4f4 100%);
  }
  /deep/.el-collapse-item__header.is-active {
    border-bottom-color: #f9f9f9;
  }
  /deep/.el-collapse-item__wrap {
    border-bottom-color: transparent;
  }
  /deep/.el-badge__content.is-fixed {
    transform: translateY(0%) translateX(445%);
  }
  /deep/ .el-collapse-item__content {
    line-height: 30px;
    font-size: 14px;
  }
}
</style>

