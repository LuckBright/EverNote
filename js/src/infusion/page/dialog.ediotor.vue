<template>
  <el-dialog
    title="报告编辑"
    :visible="visible"
    class="dialog_editor"
    :append-to-body="true"
    :modal-append-to-body="true"
    :close-on-click-modal='false'
    width='90%'
    @close="close">
    <common-head
      class="layout_wrap_01"
      code='012'
      v-if='patient.patientId'
      :patientId="patient.patientId"
      :visitNumber='patient.visitNumber || patient.hospitalizedNumber'>
    </common-head>
    <div class="clearfix" style="position:relative;flex:1">
      <div class='lefteditor'>
        <editor ref="editor" v-bind='bind' @success='success' @drop='getPatientInfo("drop")' @save='saved' :key='key' @load_template_list='handleClick(businessType)'></editor>
      </div>
      <div class='righttemplate'>
        <!-- && !(li.executeResult && li.executeResult.formDataId) -->
        <div class="template" v-if="Object.keys(this.treeData).length ">
          <div class="tem_title clearfix">
            <p @click="handleClick('0')" :class="businessType === '0' ? 'active' :''">集团模板</p>
            <p @click="handleClick('2')" :class="businessType === '2' ? 'active' :''">个人模板</p>
          </div>
          <template-collapse
            :showBr="false"
            :collapse="$route.params.serviceType == '801' ? [{code: '801', name: '检验模版', id: '1'}] : [{code: '800', name: '检查模版', id: '2'}]"
            :treeData="treeData"
            @editTpl="editTpl">
          </template-collapse>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/inpatient/store/resident.js'
import infusionApi from '@/infusion/store/infusion.js'
import { request } from '@/util/req'
import editor from '@/infusion/page/infusion.editor'
import urlMap from '@/infusion/urlsfortech.js'
import appointmentapi from '@/arrange/store/appointmentapi.js'
import templateCollapse from '@/emr/page/templatemanage/collapse'
import commonHead from '@/inpatient/components/common.head.js'
import { isJsonString } from '@/util/common'

let showJson = [
  {
    name: '标本类型',  // 值集
    code: 'specimenTypeName',
    span: 3
  },
  {
    name: '检验指导',  // 文本
    code: 'checkGuidance',
    span: 4
  },
  {
    name: '医保类型',  // 自己解析
    code: 'insuranceIdentification',
    insuranceIdentification: true,
    span: 4
  },
  {
    name: '部位',
    code: 'positionName',
    span: 4
  },
  {
    name: '检查目的', // 文本
    code: 'examineTarget',
    span: 4
  },
  {
    name: '简要病史', // 文本
    code: 'illHis',
    span: 4
  },
  {
    name: '频次', // 文本
    code: 'useFreqName',
    span: 4
  },
  {
    name: '嘱托', // 文本
    code: 'entrust',
    span: 6
  }
]
export default {
  name: 'infusion_editor',
  components: {editor, templateCollapse, commonHead},
  data () {
    return {
      api,
      appointmentapi,
      showJson,
      schema: {
        element: null
      },
      editable: true,
      visible: false,
      patient: {},
      treeData: {},
      key: 0,
      businessType: '0',
      report: {

      }
    }
  },
  computed: {
    bind () {
      return {
        patient: this.patient,
      }
    },
    // collapse () {
    //   if (this.$route.params.serviceType === '801') return [{code: '801', name: '检验模版', id: '1'}]
    //   else if (this.$route.params.serviceType === '800') return [{code: '800', name: '检查模版', id: '2'}]
    //   // return [
    //   //   {code: '801', name: '检验模版', id: '1'},
    //   //   {code: '800', name: '检查模版', id: '2'},
    //   //   // {code: '', name: '词条模版', id: '5'}
    //   // ]
    // }
  },
  methods: {
    handleClick (businessType) {
      this.businessType = businessType
      request(urlMap.templateManage.getTemplateTree, {businessType})
      .then(res => {
        this.treeData = res.data
      })
    },
    saveTpl () {

    },
    close () {
      this.$confirm('现在退出，可能存在未保存的修改！', '提示', {
        confirmButtonText: '保存并关闭',
        cancelButtonText: '直接关闭',
        type: 'warning',
        closeOnClickModal: false,
      }).then(() => {
        this.$refs.editor.saveRecord()
        this.visible = false
      }).catch(() => {
        this.visible = false
      })
    },
    saved () {
      this.$emit('success')
    },
    success () {
      this.visible = false
      this.$emit('success')
    },
    async getPatientInfo (type) {
      this.visible = true
      this.key++
      if (type === 'drop') {
        this.$emit('success')
        this.$set(this.patient, 'formDataId', '')
        this.handleClick('0')
      }
      this.$nextTick(_ => {
        this.$refs.editor.init()
      })
    },
    async getinfo (patient) {
      isJsonString
      let res = await infusionApi.getResultByExecuteId({
        executeId: patient.executeId
      })
      this.report = res && res.data ? res.data : {}
      if (!this.report.formDataId) {
        this.handleClick('0')
      } else {
        this.patient = Object.assign(this.patient, this.report)
        this.$nextTick(_ => {
          this.$refs.editor.init()
        })
      }
    },
    async open (patient) {
      this.patient = patient
      this.visible = true
      this.getinfo(patient)
      this.getPatientInfo()
    },
    editTpl (data) {
      this.$refs.editor.getTpl(data)
    }
  },
}
</script>
<style lang='scss' scoped>
.dialog_editor{
  .layout_wrap_01{
    border-bottom: 1px solid #ccc;
    flex: 0 1;
  }
  /deep/ .el-dialog__body{
    // height: 600px;;
     min-height: 500px;
     display: flex;
     flex-direction: column;
  }
  button {
    padding-left: 15px;
    padding-right: 15px;
  }
  .lefteditor{
    padding-right: 310px;
  }
  .righttemplate{
    border-left: 1px solid #ccc;
    padding-left: 10px;;
    position: absolute;
    height: 100%;
    right: 0;
    top:0;
    width: 300px;;
    display: flex;
    flex-direction: column;;
    .template{
      flex: 1;
      overflow: auto;;
      padding-bottom: 20px;
      .tem_title{
        p{
          float: left;
          width: 50%;
          box-sizing: border-box;
          text-align: center;
          cursor:pointer;
          &:last-child{
            border-left: 1px solid #ccc;
          }
        }
        .active{
          color: #1C7BEF;
        }
      }
    }
    // .echoinfo{
    //     flex: 1;
    //     overflow-y: auto;
    //     padding: 20px 10px;
    //   div{
    //     line-height: 35px;
    //     font-size: 14px;;
    //   }
    // }
    .fixed{
      flex: 0 1 200px;
      overflow-y: auto;
    }
  }
  .patient_info{
    background-color: #F0F5FA;
    padding: 0 10px;
    font-size: 14px;
    color: #2B333D;
    line-height: 36px;
    text-align: center;
    display: flex;
    justify-content:space-between;
    p{
      margin: 0;
      span{
        color: #999;
      }
    }
    .width{
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .name{
      font-weight: 700;
      span{
        float: right;
        width: 1px;
        padding: 8px 0;
        margin-top: 10px;
        margin-left: 10px;
        background-color: #979797;
        opacity: .3;
      }
    }
  }

}
</style>
