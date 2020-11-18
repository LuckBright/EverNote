<template>
  <div class="abstract-container">
    <div class="abstract-item" v-for="(item, index) in abstractData" :key="index">
      <abstract-table :tableObj="item"></abstract-table>
    </div>
  </div>
</template>

<script>
import abstractTable from '@/phr/component/detail.abstract.table'
import urls from '@/phr/api/urls'
import { listDestValue } from '@/util/common'
const executeStatusList = [
  {
    id: 0,
    name: '待审核'
  },
  {
    id: 1,
    name: '待执行'
  },
  {
    id: 2,
    name: '执行中'
  },
  {
    id: 3,
    name: '完成'
  },
  {
    id: 4,
    name: '终止'
  },
  {
    id: 5,
    name: '失败'
  },
  {
    id: 6,
    name: '过期'
  },
  {
    id: 7,
    name: '审核未通过'
  },
]
export default {
  name: 'abstract',
  components: {
    abstractTable
  },
  data () {
    return {
      abstractData: [
        {
          url: urls.yuyueList,
          moreUrl: '/phr/patientdetail/appointment',
          title: '预约信息',
          columns: [
            {
              prop: 'appointmentDate',
              label: '预约日期',
              formatter: ({value}) => {
                return value ? this.$moment(value).format('YYYY-MM-DD') : '--'
              }
            },
            {
              prop: 'visitTypeName',
              label: '预约类型',
            },
            {
              prop: 'appointmentTenantSubjectName',
              label: '预约科室',
            }
          ]
        },
        {
          url: urls.guahaoList,
          moreUrl: '/phr/patientdetail/register',
          title: '挂号信息',
          columns: [
            {
              prop: 'visitDate',
              label: '挂号日期',
              formatter: ({value}) => {
                return value ? this.$moment(value).format('YYYY-MM-DD') : '--'
              }
            },
            {
              prop: 'noName',
              label: '挂号号别',
            },
            {
              prop: 'tenantSubjectName',
              label: '挂号科室',
            },
            {
              prop: 'doctorName',
              label: '挂号医师',
            },
            {
              prop: 'registerWayName',
              label: '挂号方式',
            }
          ]
        },
        {
          url: urls.yujianList,
          moreUrl: '/phr/patientdetail/preview',
          title: '预检信息',
          columns: [
            {
              prop: 'preCheckTime',
              label: '预检日期'
            },
            {
              prop: 'preCheckDoctorName',
              label: '预检医师',
            },
            {
              prop: 'height',
              label: '身高',
              formatter: ({value}) => {
                return value ? value + 'CM' : '--'
              }
            },
            {
              prop: 'weight',
              label: '体重',
              formatter: ({value}) => {
                return value ? value + 'CM' : '--'
              }
            },
            {
              prop: 'diastolicPressure',
              label: '血压',
              formatter: ({value, row, col}) => {
                return row.systolicPressure ? '收缩压：' + row.systolicPressure + '，舒张压：' + row.diastolicPressure : '--'
              }
            }
          ]
        },
        {
          url: urls.jiuzhenList,
          moreUrl: '/phr/patientdetail/consultations',
          title: '就诊信息',
          columns: [
            {
              prop: 'hospitalizedTime',
              label: '就诊日期',
            },
            {
              prop: 'visitTypeName',
              label: '就诊类型',
            },
            {
              prop: 'visitTenantSubjectName',
              label: '就诊科室',
            },
            {
              prop: 'visitDoctorName',
              label: '就诊医师',
            },
            {
              prop: 'visitStatusName',
              label: '就诊状态',
            }
          ]
        },
        {
          url: urls.zhuankeList,
          moreUrl: '/phr/patientdetail/change',
          title: '转科信息',
          columns: [
            {
              prop: 'transferedInDate',
              label: '转科日期',
            },
            {
              prop: 'transferedSubjectTypeName',
              label: '转科类型',
            },
            {
              prop: 'transferedOutTenantSubjectName',
              label: '转出科室',
            },
            {
              prop: 'transferedInTenantSubjectName',
              label: '转入科室',
            },
            {
              prop: 'transferedOutReason',
              label: '转出原因',
            }
          ]
        },
        {
          url: urls.doctoradviceList,
          moreUrl: '/phr/patientdetail/doctoradvice',
          title: '医嘱信息',
          columns: [
            {
              prop: 'doctorAdviceOpenTime',
              label: '开立日期',
              formatter: ({value}) => {
                if (value) {
                  return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
                } else {
                  return ''
                }
              }
            },
            {
              slot: 'categoryCode',
              prop: 'categoryCode',
              label: '医嘱类型',
              // slot: 'setName',
              width: 100,
            },
            {
              prop: 'doctorAdviceName',
              label: '医嘱名称',
            },
            {
              prop: 'doctorAdviceContent',
              label: '医嘱内容',
            },
            {
              slot: 'status',
              prop: 'doctorAdviceStatusName',
              label: '医嘱状态',
              width: 100,
            },
          ],
        },
        {
          url: urls.diagnosisList,
          moreUrl: '/phr/patientdetail/diagnosis',
          title: '诊断信息',
          columns: [
            {
              prop: 'receptionTime',
              label: '诊断日期',
              formatter: ({value, row, col}) => {
                return row.modifyTime ? row.modifyTime : row.createTime
              }
            },
            {
              prop: 'diagnosisTypeName',
              label: '诊断类别',
            },
            // {
            //   prop: 'diagnosisSerialNumber',
            //   label: '诊断序号',
            // },
            {
              prop: 'diagnoseItems',
              label: '诊断名称',
              showOverflowTooltip: true,
              formatter: ({value}) => {
                let tempname = ''
                value.forEach((item, index) => {
                  tempname = tempname + item.diagnosisName + ' '
                })
                return tempname
              }
            },
            {
              prop: 'diagnosisDoctorName',
              label: '诊断医师',
              showOverflowTooltip: true,
            }
          ]
        },
        // {
        //   url: urls.shoushuList,
        //   moreUrl: '/phr/patientdetail/operation',
        //   title: '手术信息',
        //   columns: [
        //     {
        //       prop: 'applicationDate',
        //       label: '手术日期',
        //     },
        //     {
        //       prop: 'surgeryName',
        //       label: '手术名称',
        //     },
        //     {
        //       prop: 'surgeryTargetPositionName',
        //       label: '手术部位',
        //     },
        //     {
        //       prop: 'surgeryLevelName',
        //       label: '手术级别',
        //     },
        //     {
        //       prop: 'surgeryDoctorName',
        //       label: '手术医师',
        //     }
        //   ]
        // },
        {
          url: '/thc-phr/cpoe/treatment/patient-summary-list',
          moreUrl: '/phr/patientdetail/treatment',
          title: '治疗信息',
          columns: [
            {
              prop: 'doctorAdviceExecuteTime',
              label: '治疗日期',
            },
            {
              prop: 'treatmentName',
              label: '操作名称',
            },
            // {
            //   prop: 'operationTargetPositionName',
            //   label: '操作部位',
            // },
            // {
            //   prop: 'patientName',
            //   label: '操作方法',
            // },
            {
              prop: 'operatorName',
              label: '操作医师',
            }
          ]
        },
        {
          url: '/thc-phr/cpoe/examine/listExamineResult',
          moreUrl: '/phr/patientdetail/inspect',
          title: '检查信息',
          columns: [
            {
              prop: 'examineExecuteDatetime',
              label: '检查日期',
            },
            {
              prop: 'examineName',
              label: '检查名称',
            },
            {
              prop: 'examineExecuteDoctorName',
              label: '检查医师',
            },
            // {
            //   prop: 'examineMeshine',
            //   label: '检查设备',
            // },
            {
              prop: 'reportDoctorSignature',
              label: '报告医师',
            }
          ]
        },
        {
          url: '/thc-phr/cpoe/inspection/patient-summary-list',
          moreUrl: '/phr/patientdetail/test',
          title: '检验信息',
          columns: [
            {
              prop: 'inspectionExecuteDate',
              label: '检验日期',
            },
            {
              prop: 'specimenTypeName',
              label: '检验类别',
            },
            {
              prop: 'inspectionServiceName',
              label: '检验项目',
            },
            {
              prop: 'inspectionExecutorName',
              label: '检验医师',
            },
            {
              prop: 'reportDoctorName',
              label: '报告医师',
            }
          ]
        },
        {
          url: urls.bingliList,
          moreUrl: '/phr/patientdetail/records',
          title: '病历信息',
          columns: [
            {
              prop: 'visitDate',
              label: '就诊日期',
            },
            {
              prop: 'docName',
              label: '病历类型',
            },
            {
              prop: 'docAuthorName',
              label: '书写医师',
            },
            {
              prop: 'docStatus',
              label: '病历状态',
            }
          ]
        },
        {
          url: urls.getPhrInquiringInfoBySerialNumber,
          moreUrl: '/phr/patientdetail/interrogation',
          title: '问诊信息',
          columns: [
            {
              prop: 'createTime',
              label: '问诊日期',
            },
            {
              prop: 'answerTime',
              label: '接诊日期',
            },
            {
              prop: 'doctorName',
              label: '问诊医师',
            },
            {
              prop: 'diseaseDescription',
              label: '病情描述',
            }
          ]
        },
        {
          url: urls.preTable,
          moreUrl: '/phr/patientdetail/preinterrogation',
          title: '预问诊信息',
          columns: [
            {
              prop: 'sendTime',
              label: '预问诊日期',
            },
            {
              prop: 'sendDoctor',
              label: '发送医生'
            },
            {
              prop: 'templateName',
              label: '预问诊模板',
            },
            {
              prop: 'status',
              label: '预问诊状态',
              formatter ({value}) {
                return Number(value) === 0 ? '已发送' : '已结束'
              }
            },
          ]
        },
        {
          url: urls.tizhengList,
          moreUrl: '/phr/patientdetail/sign',
          title: '体征信息',
          columns: [
            {
              prop: 'recordTime',
              label: '记录日期',
            },
            {
              prop: 'bodyTemperature',
              label: '体温',
              formatter: ({value}) => {
                return value ? value + '℃' : '--'
              }
            },
            {
              prop: 'respiratoryFrequency',
              label: '呼吸',
              formatter: ({value}) => {
                return value ? value + '次/分钟' : '--'
              }
            },
            {
              prop: 'pulseRate',
              label: '脉搏',
              formatter: ({value}) => {
                return value ? value + '次/分' : '--'
              }
            },
            {
              prop: 'diastolicPressure',
              label: '血压',
              formatter: ({value, row, col}) => {
                return row.systolicPressure ? '收缩压：' + row.systolicPressure + '，舒张压：' + row.diastolicPressure : '--'
              }
            },
            {
              prop: 'nurseSignName',
              label: '记录人',
            }
          ]
        },
        {
          url: urls.allergyList,  // 请求接口地址
          moreUrl: '/phr/patientdetail/allergy', // 跳转路由
          title: '过敏信息',
          columns: [ // 表格列数据
            {
              prop: 'medicalRecordCreateTime',
              label: '记录日期',
              // slot: 'setName',
              formatter: ({value}) => {
                if (value) {
                  return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
                } else {
                  return ''
                }
              }
            },
            {
              prop: 'allergenTypeName',
              label: '过敏类型',
            },
            {
              prop: 'allergenSourceName',
              label: '过敏名称',
            },
            {
              prop: 'doctorName',
              label: '记录人',
            }
          ]
        },
        {
          url: urls.followUpSummary,
          moreUrl: '/phr/patientdetail/follow',
          title: '随访信息',
          columns: [
            {
              prop: 'createTime',
              label: '创建时间',
            },
            {
              prop: 'name',
              label: '随访计划',
            },
            {
              prop: 'creatorName',
              label: '创建人',
            },
            {
              prop: 'executeStatus',
              label: '状态',
              formatter: ({value}) => {
                return listDestValue(executeStatusList, value)
              }
            },
          ]
        }
      ]
    }
  },
  created () {
    if (this.$route.query.fromType === 'resident' || this.$route.query.fromType === 'inpatient') {
      let url = this.$route.query.fromType === 'inpatient' ? '/inpatient/patientmgt/patientdetail' : '/resident/patientmgt/patientdetail'
      this.abstractData.forEach(ele => {
        ele.moreUrl = ele.moreUrl.replace('/phr/patientdetail', url)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .abstract-container{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px 10px 0 10px;
    overflow: auto;
    .abstract-item{
      width: 50%;
      float: left;
      box-sizing: border-box;
      padding:0 0 10px 10px;
    }
  }
</style>
