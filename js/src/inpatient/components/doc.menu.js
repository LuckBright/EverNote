import {BLOOD_TYPE, MEDICAL_EXAMINATION, STATUS_1, dateFormat, isNull} from '@/util/common'

function check (rule, value, callback) {
  callback()
}

export const DOC_MENU = {
  100: {
    name: '入院管理',
    index: 1,
    children: [
      {
        name: '入院记录',
        code: '101',
        api: 'hosInRecord',
        // printCode: 'thc_phr.hospitalized_record_LNN_20180423',
        status: 1,
        tpltype: 6,
        documentType: 1000,
        schema: [
          {
            name: 'complain',
            label: '主诉',
            span: 22,
            props: {
              placeholder: '请输入主诉',
              maxlength: 200
            }
          },
          {
            name: 'presentIll',
            label: '现病史',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入现病史',
              maxlength: 1000
            }
          },
          {
            name: 'hosRecAllergic',
            label: '过敏史',
            comp: 'custom',
            span: 24
          },
          {
            name: 'pastIll',
            label: '既往史',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入既往史',
              maxlength: 1000
            }
          },
          {
            name: 'personalHis',
            label: '个人史',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入个人史',
              maxlength: 1000
            }
          },
          {
            name: 'marryHis',
            label: '婚育/月经史',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入婚育/月经史',
              maxlength: 1000
            }
          },
          {
            name: 'familyHis',
            label: '家族史',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入家族史',
              maxlength: 1000
            }
          },
          {
            name: 'physicalExamine',
            label: '体格检查',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入体格检查',
              maxlength: 1000
            }
          },
          {
            name: 'specialExamine',
            label: '专科检查',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入专科检查',
              maxlength: 1000
            }
          },
          {
            name: 'assistantExamine',
            label: '辅助检查',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入辅助检查',
              maxlength: 1000
            }
          },
          {
            name: 'hosRecDiagnosis',
            label: '初步诊断',
            comp: 'custom',
            span: 24
          }
        ],
        rules: {
          complain: [
            {required: true, message: '必填项，最多200字', trigger: 'change'}
          ],
          presentIll: [
            {required: true, message: '必填项，最多1000字', trigger: 'change'}
          ],
          hosRecAllergic: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          pastIll: [
            {required: true, message: '必填项，最多1000字', trigger: 'change'}
          ],
          personalHis: [
            {required: true, message: '必填项，最多1000字', trigger: 'change'}
          ],
          marryHis: [
            {required: true, message: '必填项，最多1000字', trigger: 'change'}
          ],
          specialExamine: [
            {required: true, message: '必填项，最多1000字', trigger: 'change'}
          ],
          physicalExamine: [
            {required: true, message: '必填项，最多1000字', trigger: 'change'}
          ],
          hosRecDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ]
        }
      },
      {
        name: '首次病程',
        code: '102',
        api: 'firstIllCourse',
        printCode: 'thc_phr.course_first_ill_course_ZHW_20180411',
        status: 1,
        tpltype: 7,
        documentType: 2000,
        schema: [
          {
            name: 'complain',
            label: '主诉',
            span: 22,
            props: {
              placeholder: '请输入主诉',
              maxlength: 200
            }
          },
          {
            name: 'presentIll',
            label: '现病史',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入现病史',
              maxlength: 1000
            }
          },
          {
            name: 'feature',
            label: '病历特点',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入病历特点',
              maxlength: 5000
            }
          },
          {
            name: 'hosRecDiagnosis',
            label: '初步诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'diagnoseReason',
            label: '诊断依据',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入诊断依据',
              maxlength: 5000
            }
          },
          {
            name: 'firDiagnosis',
            label: '鉴别诊断',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入鉴别诊断',
              maxlength: 5000
            }
          },
          {
            name: 'treatPlan',
            label: '诊疗计划',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入诊疗计划',
              maxlength: 5000
            }
          }
        ],
        rules: {
          complain: [
            {required: true, message: '必填项，最多200字', trigger: 'change'}
          ],
          presentIll: [
            {required: true, message: '必填项，最多1000字', trigger: 'change'}
          ],
          feature: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          hosRecDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          diagnoseReason: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          firDiagnosis: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          treatPlan: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ]
        }
      },
      {
        name: '再次/多次入院记录',
        code: '103',
        api: '',
        status: 0
      },
      {
        name: '24小时内入出院记录',
        code: '104',
        api: 'hoursHospitalRecord',
        printCode: 'thc_phr.hours_hospital_record_LNN_20180510',
        status: 1,
        tpltype: 17,
        schema: [
          {
            name: 'complain',
            label: '主诉',
            span: 22,
            props: {
              placeholder: '请输入主诉',
              maxlength: 200
            }
          },
          {
            name: 'hosinSituation',
            label: '入院情况',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入入院情况',
              maxlength: 500
            }
          },
          {
            name: 'admitDiagnosis',
            label: '入院诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'detail',
            label: '诊疗过程',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入诊疗过程',
              maxlength: 500
            }
          },
          {
            name: 'leaveDate',
            label: '出院时间',
            comp: 'el-date-picker',
            span: 22,
            props: {
              type: 'datetime',
              placeholder: '请选择出院时间'
            }
          },
          {
            name: 'situation',
            label: '出院情况',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入出院情况',
              maxlength: 500
            }
          },
          {
            name: 'leaveDiagnosis',
            label: '出院诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'doctorAdvice',
            label: '出院医嘱',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入出院医嘱',
              maxlength: 500
            }
          }
        ],
        rules: {
          complain: [
            {required: true, message: '必填项，最多200字', trigger: 'change'}
          ],
          hosinSituation: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          admitDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          leaveDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          leaveDate: [
            {required: true, message: '请选择出院时间', trigger: 'change', type: 'object'}
          ],
          detail: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          situation: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          doctorAdvice: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ]
        }
      },
      {
        name: '24小时入院死亡记录',
        code: '105',
        api: '',
        status: 0
      }
    ]
  },
  200: {
    name: '在院管理',
    index: 2,
    children: [
      {
        name: '病程记录',
        code: '201',
        api: 'hosCourseRecord',
        printCode: 'thc_phr.course_first_ill_course_ZHW_20180411',
        status: 1,
        schema: [
          {
            name: 'noteType',
            label: '病程类型',
            comp: 'custom',
            span: 22
          }
        ],
        children: [
          {
            name: '日常病程记录',
            code: '1',
            api: 'illCourse',
            status: 1,
            tpltype: 8,
            schema: [
              {
                name: 'detail',
                label: '详细信息',
                span: 22,
                props: {
                  type: 'textarea',
                  autosize: {minRows: 2},
                  placeholder: '请输入详细信息',
                  maxlength: 5000
                }
              }
            ],
            rules: {
              detail: [
                {required: true, message: '必填项，最多5000字', trigger: 'change'}
              ]
            }
          },
          {
            name: '上级医师查房记录',
            code: '2',
            api: 'roundsRecord',
            printCode: 'thc_phr.course_rounds_record_LNN_20180418',
            status: 1,
            tpltype: 9,
            schema: [
              {
                name: 'roundTime',
                label: '查房时间',
                comp: 'el-date-picker',
                span: 22,
                props: {
                  type: 'datetime',
                  placeholder: '请选择查房时间'
                }
              },
              {
                name: 'checkdoctorName',
                label: '查房医生',
                comp: 'custom',
                span: 22
              },
              {
                name: 'detail',
                label: '详细信息',
                span: 22,
                props: {
                  type: 'textarea',
                  autosize: {minRows: 2},
                  placeholder: '请输入详细信息',
                  maxlength: 5000
                }
              }
            ],
            rules: {
              detail: [
                {required: true, message: '必填项，最多5000字', trigger: 'change'}
              ],
              roundTime: [
                {required: true, message: '必填项', trigger: 'change', type: 'object'}
              ],
              checkdoctorName: [
                {validator: check, required: true, trigger: 'change'}
              ]
            }
          },
          {
            name: '疑难病例讨论记录',
            code: '3',
            api: '',
            status: 0
          },
          {
            name: '交接班记录',
            code: '4',
            api: '',
            status: 0
          },
          {
            name: '转科记录',
            code: '5',
            api: '',
            status: 0
          },
          {
            name: '抢救记录',
            code: '6',
            api: '',
            status: 0
          },
          {
            name: '有创诊疗操作记录',
            code: '7',
            api: '',
            status: 0
          },
          {
            name: '会诊记录',
            code: '8',
            api: '',
            status: 0
          },
          {
            name: '麻醉记录',
            code: '12',
            api: 'anaesRecord',
            status: 0
          },
          {
            name: '手术安全核查记录',
            code: '14',
            api: '',
            status: 0
          },
          {
            name: '手术清点记录',
            code: '15',
            api: '',
            status: 0
          },
          {
            name: '术后首次病程记录',
            code: '16',
            api: '',
            status: 0
          },
          {
            name: '麻醉术后访视记录',
            code: '17',
            api: '',
            status: 0
          },
          {
            name: '死亡病例讨论记录',
            code: '18',
            api: '',
            status: 0
          },
          {
            name: '病重患者护理记录',
            code: '19',
            api: '',
            status: 0
          }
        ]
      },
      {
        name: '术前小结',
        code: '202',
        api: 'sugPreSummary',
        printCode: 'thc_phr.course_sugery_pre_summary_LNN_20180418',
        status: 1,
        tpltype: 14,
        menu: true,
        schema: [
          {
            name: 'briefIllness',
            label: '简要病情',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入简要病情',
              maxlength: 5000
            }
          },
          {
            name: 'preSugDiagnosis',
            label: '术前诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'indication',
            label: '手术指征',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入手术指征',
              maxlength: 5000
            }
          },
          {
            name: 'sugeryName',
            label: '手术名称',
            comp: 'custom',
            span: 24
          },
          {
            name: 'anaesMethod',
            label: '麻醉方式',
            comp: 'custom',
            span: 24
          },
          {
            name: 'attention',
            label: '注意事项',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入既往史',
              maxlength: 5000
            }
          },
          {
            name: 'sum',
            label: '术前情况',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入术前情况',
              maxlength: 5000
            }
          }
        ],
        rules: {
          briefIllness: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          preSugDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          indication: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          sugeryName: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          anaesMethod: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          attention: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          sum: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ]
        }
      },
      {
        name: '术前讨论',
        code: '203',
        api: 'courseSugeryPreTalk',
        printCode: 'thc_phr.course_sugery_pre_talk_LXK_20180509',
        status: 1,
        tpltype: 16,
        menu: true,
        schema: [
          {
            name: 'talkDate',
            label: '讨论日期',
            comp: 'el-date-picker',
            span: 22,
            props: {
              placeholder: '请选择讨论日期'
            }
          },
          {
            name: 'talkPlace',
            label: '讨论地点',
            span: 22,
            props: {
              placeholder: '请输入讨论地点',
              maxlength: 200
            }
          },
          {
            name: 'compere',
            label: '主持人',
            comp: 'custom',
            span: 22
          },
          {
            name: 'attendee',
            label: '参加讨论者',
            comp: 'custom',
            span: 22
          },
          {
            name: 'discussOpinion',
            label: '讨论意见',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入讨论意见',
              maxlength: 5000
            }
          },
          {
            name: 'compereOpinion',
            label: '主持人小结意见',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入主持人小结意见',
              maxlength: 1000
            }
          }
        ],
        rules: {
          talkDate: [
            {required: true, message: '请选择讨论日期', trigger: 'change', type: 'object'}
          ],
          talkPlace: [
            {required: true, message: '必填项，最多200字', trigger: 'change'}
          ],
          compere: [
            {validator: check, required: true, trigger: 'change'}
          ],
          attendee: [
            {validator: check, required: true, trigger: 'change'}
          ],
          discussOpinion: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          compereOpinion: [
            {required: true, message: '必填项，最多1000字', trigger: 'change'}
          ]
        }
      },
      {
        name: '麻醉前访视记录',
        code: '204',
        api: 'anaesPreRecord',
        printCode: 'thc_phr.course_anaes_pre_record_LNN_20180413',
        status: 1,
        tpltype: 10,
        menu: true,
        schema: [
          {
            name: 'preSugDiagnosis',
            label: '术前诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'planSugName',
            label: '拟行手术名称',
            comp: 'custom',
            span: 24
          },
          {
            name: 'pastIll',
            label: '既往史',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入既往史',
              maxlength: 1000
            }
          },
          {
            name: 'physicalExamine',
            label: '体格检查',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入体格检查',
              maxlength: 1000
            }
          },
          {
            name: 'assistantExamine',
            label: '辅助检查',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入辅助检查',
              maxlength: 1000
            }
          },
          {
            name: 'asaLevel',
            label: 'ASA分级',
            comp: 'sys-type',
            props: {
              code: 'CV05.10.021',
              useValue: true
            }
          },
          {
            name: 'heartFuncLevel',
            label: '心功能分级',
            comp: 'sys-type',
            props: {
              code: 'THC_CPOE_HEART_GRADE',
              useValue: true
            }
          },
          {
            name: 'planAnaesMode',
            label: '拟行麻醉方式',
            comp: 'custom',
            span: 24
          },
          {
            name: 'doctorAdvice',
            label: '术前麻醉医嘱',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入术前麻醉医嘱',
              maxlength: 5000
            }
          },
          {
            name: 'attention',
            label: '麻醉注意问题',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入麻醉注意问题',
              maxlength: 5000
            }
          }
        ],
        rules: {
          preSugDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          planSugName: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          pastIll: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          physicalExamine: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          assistantExamine: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          planAnaesMode: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          doctorAdvice: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          attention: [
            {required: true, message: '必填项', trigger: 'change'}
          ]
        }
      },
      {
        name: '手术记录',
        code: '205',
        api: 'sugeryRecord',
        printCode: 'thc_phr.course_sugery_record_LNN_20180412',
        status: 1,
        tpltype: 11,
        menu: true,
        schema: [
          {
            name: 'sugeryDate',
            label: '手术时间',
            comp: 'el-date-picker',
            span: 22,
            props: {
              type: 'datetime',
              placeholder: '请选择手术时间'
            }
          },
          {
            name: 'preDiagnosis',
            label: '术前诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'diagnosis',
            label: '术中诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'sugeryName',
            label: '手术名称',
            comp: 'custom',
            span: 24
          },
          {
            name: 'anaesMethod',
            label: '麻醉方式',
            comp: 'custom',
            span: 24
          },
          {
            name: 'detail',
            label: '手术经过',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入手术经过',
              maxlength: 5000
            }
          }
        ],
        rules: {
          sugeryDate: [
            {required: true, message: '必填项', trigger: 'change', type: 'object'}
          ],
          preDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          diagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          sugeryName: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          anaesMethod: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          detail: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ]
        }
      }
    ]
  },
  300: {
    name: '出院管理',
    index: 3,
    children: [
      {
        name: '出院记录',
        code: '301',
        api: 'leaveRecord',
        printCode: 'thc_phr.leave_record_LNN_20180509',
        status: 1,
        tpltype: 12,
        schema: [
          {
            name: 'leaveDate',
            label: '出院时间',
            comp: 'el-date-picker',
            span: 22,
            props: {
              type: 'datetime',
              placeholder: '请选择出院时间'
            }
          },
          {
            name: 'admitDiagnosis',
            label: '入院诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'leaveDiagnosis',
            label: '出院诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'hosinSituation',
            label: '入院情况',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入入院情况',
              maxlength: 5000
            }
          },
          {
            name: 'detail',
            label: '治疗经过',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入治疗经过',
              maxlength: 5000
            }
          },
          {
            name: 'situation',
            label: '出院情况',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入出院情况',
              maxlength: 5000
            }
          },
          {
            name: 'doctorAdvice',
            label: '出院医嘱',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入出院医嘱',
              maxlength: 5000
            }
          }
        ],
        rules: {
          leaveDate: [
            {required: true, message: '请选择出院时间', trigger: 'change', type: 'object'}
          ],
          admitDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          leaveDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          hosinSituation: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          detail: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          situation: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          doctorAdvice: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ]
        }
      },
      {
        name: '病案首页',
        code: '302',
        api: 'hosRecordHomepage',
        printCode: 'thc_phr.leave_hos_record_hompage_LNN_20180510',
        status: 1,
        tpltype: 13,
        schema: [
          {
            name: 'leaveDiagnosis',
            label: '出院诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'pathology',
            label: '病理诊断',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入病理诊断',
              maxlength: 200
            }
          },
          {
            name: 'drugAllergy',
            label: '药物过敏',
            comp: 'custom',
            span: 24
          },
          {
            name: 'bloodType',
            label: '血型',
            comp: 'value-set',
            span: 22,
            props: {
              type: 'radio',
              options: BLOOD_TYPE
            }
          },
          {
            name: 'rhBloodType',
            label: 'Rh血型',
            comp: 'value-set',
            span: 22,
            props: {
              type: 'radio',
              options: MEDICAL_EXAMINATION
            }
          },
          {
            name: 'sugeryRecord',
            label: '手术记录',
            comp: 'custom',
            span: 24
          },
          {
            name: 'leaveMode',
            label: '离院方式',
            comp: 'custom',
            span: 24
          },
          {
            name: 'hosinAgainPlan',
            label: '是否有出院31天内再次入院计划',
            comp: 'custom',
            span: 24
          },
          {
            name: 'lifeAbilityScore',
            label: '日常生活能力评定量表得分',
            comp: 'custom',
            span: 24
          },
          {
            name: 'pathologyNumber',
            label: '病理号',
            span: 22,
            props: {
              placeholder: '请输入病理号',
              maxlength: 20
            }
          },
          {
            name: 'autopsy',
            label: '死伤患者尸检',
            comp: 'value-set',
            span: 22,
            props: {
              type: 'radio',
              options: STATUS_1
            }
          },
          {
            name: 'poisoningCause',
            label: '损伤中毒的外部原因',
            comp: 'custom',
            span: 24
          },
          {
            name: 'stuporTime',
            label: '颅脑损伤患者昏迷时间',
            comp: 'el-date-picker',
            span: 22,
            style: {
              marginTop: '10px'
            },
            props: {
              type: 'datetimerange',
              placeholder: '请选择颅脑损伤患者昏迷时间'
            }
          }
        ],
        rules: {
          leaveDiagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          pathology: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          drugAllergy: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          bloodType: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          rhBloodType: [
            {required: true, message: '必填项', trigger: 'change'}
          ],
          sugeryRecord: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          hosinAgainPlan: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          lifeAbilityScore: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          leaveMode: [
            {validator: check, required: true, trigger: 'blur'}
          ]
        }
      }
    ]
  },
  400: {
    name: '知情同意书',
    index: 4,
    schema: [
      {
        name: 'docType',
        label: '选择分类',
        comp: 'custom',
        span: 24
      },
      {
        name: 'content',
        label: '选择图片',
        comp: 'custom',
        span: 24
      }
    ],
    children: [
      {
        name: '手术同意书',
        code: '401',
        api: 'sugeryAgree',
        status: 1
      },
      {
        name: '麻醉同意书',
        code: '402',
        api: 'anaesAgree',
        status: 1
      },
      {
        name: '输血治疗知情同意书',
        code: '403',
        api: '',
        status: 0
      },
      {
        name: '特殊检查/治疗同意书',
        code: '404',
        api: '',
        status: 0
      },
      {
        name: '病危同意书',
        code: '405',
        api: '',
        status: 0
      },
      {
        name: '诊断证明',
        code: '406',
        api: 'diagnosisCertify',
        status: 1,
        tpltype: 15,
        schema: [
          {
            name: 'situation',
            label: '疾病概况',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入疾病概况',
              maxlength: 5000
            }
          },
          {
            name: 'diagnosis',
            label: '诊断',
            comp: 'custom',
            span: 24
          },
          {
            name: 'suggest',
            label: '建议',
            span: 22,
            props: {
              type: 'textarea',
              autosize: {minRows: 2},
              placeholder: '请输入建议',
              maxlength: 5000
            }
          }
        ],
        rules: {
          diagnosis: [
            {validator: check, required: true, trigger: 'blur'}
          ],
          situation: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ],
          suggest: [
            {required: true, message: '必填项，最多5000字', trigger: 'change'}
          ]
        }
      }
    ]
  }
}

export function jsonMenu (docCode, docChildCode, data) {
  let diseaseInit = [{diseaseType: 2, diseaseName: '', diseaseOrigId: '', diagnoseType: '', comment: '', diagnoseList: [], diseaseCode: '', position: '', positionData: []}]
  // let diseaseShowInit = [{diseaseType: 2, diseaseName: '', diseaseOrigId: '', diagnoseType: '', diagnoseList: [], diseaseCode: '', hosInDetail: '', curativeEffect: ''}]
  let sugeryInit = [{name: '', code: ''}]
  // let sugeryRecordInit = [{name: '', code: '', date: '', level: '', operator: [], assistant: [], anesthesiologist: [], anaes: '', incisionLevel: '', healingCategory: ''}]
  let allergicInit = [{allergen: '', remark: ''}]
  let drugAllergyInit = {isTrue: false, value: [{allergen: '', remark: ''}]}
  let statusShowInit = {isTrue: false, value: [{txt: '', remark: ''}]}
  let anaesMethodInit = [{mode: '', comment: ''}]
  let lifeAbilityScoreInit = {before: '', after: ''}
  let leaveModeInit = {key: '', txt: ''}
  let newData = Object.assign({}, data)
  if (data.leaveDate) {
    newData.leaveDate = new Date(data.leaveDate)
  }
  if (data.roundTime) {
    newData.roundTime = new Date(data.roundTime)
  }
  if (data.sugeryDate) {
    newData.sugeryDate = new Date(data.sugeryDate)
  }
  if (data.talkDate) {
    newData.talkDate = new Date(data.talkDate)
  }
  if (docCode === '101') {
    newData.hosRecAllergic = data.hosRecAllergic ? JSON.parse(data.hosRecAllergic) : allergicInit
    newData.hosRecDiagnosis = data.hosRecDiagnosis ? JSON.parse(data.hosRecDiagnosis) : diseaseInit
  } else if (docCode === '102') {
    newData.hosRecDiagnosis = data.hosRecDiagnosis ? JSON.parse(data.hosRecDiagnosis) : diseaseInit
  } else if (docCode === '104') {
    newData.admitDiagnosis = data.admitDiagnosis ? JSON.parse(data.admitDiagnosis) : diseaseInit
    newData.leaveDiagnosis = data.leaveDiagnosis ? JSON.parse(data.leaveDiagnosis) : diseaseInit
  } else if (docCode === '201') {
    if (docChildCode === '2') {
      newData.checkdoctorName = data.checkdoctorName ? JSON.parse(data.checkdoctorName) : []
    }
  } else if (docCode === '202') {
    newData.preSugDiagnosis = data.preSugDiagnosis ? JSON.parse(data.preSugDiagnosis) : diseaseInit
    newData.anaesMethod = data.anaesMethod ? JSON.parse(data.anaesMethod) : anaesMethodInit
    newData.sugeryName = data.sugeryName ? JSON.parse(data.sugeryName) : sugeryInit
  } else if (docCode === '203') {
    newData.compere = data.compere ? JSON.parse(data.compere) : ''
    newData.attendee = data.attendee ? JSON.parse(data.attendee) : []
  } else if (docCode === '204') {
    newData.planAnaesMode = data.planAnaesMode ? JSON.parse(data.planAnaesMode) : anaesMethodInit
    newData.preSugDiagnosis = data.preSugDiagnosis ? JSON.parse(data.preSugDiagnosis) : diseaseInit
    newData.planSugName = data.planSugName ? JSON.parse(data.planSugName) : sugeryInit
  } else if (docCode === '205') {
    newData.anaesMethod = data.anaesMethod ? JSON.parse(data.anaesMethod) : anaesMethodInit
    newData.preDiagnosis = data.preDiagnosis ? JSON.parse(data.preDiagnosis) : diseaseInit
    newData.diagnosis = data.diagnosis ? JSON.parse(data.diagnosis) : diseaseInit
    newData.sugeryName = data.sugeryName ? JSON.parse(data.sugeryName) : sugeryInit
  } else if (docCode === '301') {
    newData.admitDiagnosis = data.admitDiagnosis ? JSON.parse(data.admitDiagnosis) : diseaseInit
    newData.leaveDiagnosis = data.leaveDiagnosis ? JSON.parse(data.leaveDiagnosis) : diseaseInit
  } else if (docCode === '302') {
    let sugeryRecord = []
    let stuporTime = ''
    if (data) {
      if (data.sugeryRecord) {
        sugeryRecord = JSON.parse(data.sugeryRecord)
        sugeryRecord.map(item => {
          item.date = new Date(item.date)
          return item
        })
      }
      if (data.stuporTime) {
        let arr = []
        stuporTime = JSON.parse(data.stuporTime)
        if (stuporTime.length) {
          stuporTime.map(item => {
            arr.push(new Date(item))
          })
          stuporTime = arr
        }
      }
    }
    newData.drugAllergy = data.drugAllergy ? JSON.parse(data.drugAllergy) : drugAllergyInit
    newData.leaveDiagnosis = data.leaveDiagnosis ? JSON.parse(data.leaveDiagnosis) : []
    newData.sugeryRecord = sugeryRecord
    newData.hosinAgainPlan = data.hosinAgainPlan ? JSON.parse(data.hosinAgainPlan) : statusShowInit
    newData.lifeAbilityScore = data.lifeAbilityScore ? JSON.parse(data.lifeAbilityScore) : lifeAbilityScoreInit
    newData.leaveMode = data.leaveMode ? JSON.parse(data.leaveMode) : leaveModeInit
    newData.stuporTime = stuporTime
    newData.poisoningCause = data.poisoningCause ? JSON.parse(data.poisoningCause) : diseaseInit
  } else if (docCode === '406') {
    newData.diagnosis = data.diagnosis ? JSON.parse(data.diagnosis) : diseaseInit
  }
  return newData
}

export function setInitData (docCode, docChildCode, data) {
  let InitData = {}
  let diseaseInit = [{diseaseType: 2, diseaseName: '', diseaseOrigId: '', diagnoseType: '', comment: '', diagnoseList: [], diseaseCode: '', position: '', positionData: []}]
  // let diseaseShowInit = [{diseaseType: 2, diseaseName: '', diseaseOrigId: '', diagnoseType: '', diagnoseList: [], diseaseCode: '', hosInDetail: '', curativeEffect: ''}]
  let sugeryInit = [{name: '', code: ''}]
  // let sugeryRecordInit = [{name: '', code: '', date: '', level: '', operator: [], assistant: [], anesthesiologist: [], anaes: '', incisionLevel: '', healingCategory: ''}]
  let allergicInit = [{allergen: '', remark: ''}]
  let drugAllergyInit = {isTrue: false, value: [{allergen: '', remark: ''}]}
  let statusShowInit = {isTrue: false, value: [{txt: '', remark: ''}]}
  let anaesMethodInit = [{mode: '', comment: ''}]
  let lifeAbilityScoreInit = {before: '', after: ''}
  let leaveModeInit = {key: '', txt: ''}
  if (docCode === '101') {
    InitData = {
      hasAllergicHis: (data && !isNull(data.hasAllergicHis)) ? data.hasAllergicHis : true,
      hosRecAllergic: (data && data.hosRecAllergic) ? data.hosRecAllergic : JSON.parse(JSON.stringify(allergicInit)),
      hosRecDiagnosis: (data && data.hosRecDiagnosis) ? data.hosRecDiagnosis : JSON.parse(JSON.stringify(diseaseInit))
    }
  } else if (docCode === '102') {
    InitData = {
      hosRecDiagnosis: (data && data.hosRecDiagnosis) ? data.hosRecDiagnosis : JSON.parse(JSON.stringify(diseaseInit))
    }
  } else if (docCode === '104') {
    InitData = {
      admitDiagnosis: (data && data.admitDiagnosis) ? data.admitDiagnosis : JSON.parse(JSON.stringify(diseaseInit)),
      leaveDiagnosis: (data && data.leaveDiagnosis) ? data.leaveDiagnosis : JSON.parse(JSON.stringify(diseaseInit))
    }
  } else if (docCode === '201') {
    if (docChildCode === '2') {
      InitData = {
        checkdoctorName: (data && data.checkdoctorName) ? data.checkdoctorName : []
      }
    }
  } else if (docCode === '202') {
    InitData = {
      preSugDiagnosis: (data && data.preSugDiagnosis) ? data.preSugDiagnosis : JSON.parse(JSON.stringify(diseaseInit)),
      anaesMethod: (data && data.anaesMethod) ? data.anaesMethod : JSON.parse(JSON.stringify(anaesMethodInit)),
      sugeryName: (data && data.sugeryName) ? data.sugeryName : JSON.parse(JSON.stringify(sugeryInit))
    }
  } else if (docCode === '203') {
    InitData = {
      compere: (data && data.compere) ? data.compere : '',
      attendee: (data && data.attendee) ? data.attendee : []
    }
  } else if (docCode === '204') {
    InitData = {
      planAnaesMode: (data && data.planAnaesMode) ? data.planAnaesMode : JSON.parse(JSON.stringify(anaesMethodInit)),
      preSugDiagnosis: (data && data.preSugDiagnosis) ? data.preSugDiagnosis : JSON.parse(JSON.stringify(diseaseInit)),
      planSugName: (data && data.planSugName) ? data.planSugName : JSON.parse(JSON.stringify(sugeryInit))
    }
  } else if (docCode === '205') {
    InitData = {
      anaesMethod: (data && data.anaesMethod) ? data.anaesMethod : JSON.parse(JSON.stringify(anaesMethodInit)),
      preDiagnosis: (data && data.preDiagnosis) ? data.preDiagnosis : JSON.parse(JSON.stringify(diseaseInit)),
      diagnosis: (data && data.diagnosis) ? data.diagnosis : JSON.parse(JSON.stringify(diseaseInit)),
      sugeryName: (data && data.sugeryName) ? data.sugeryName : JSON.parse(JSON.stringify(sugeryInit))
    }
  } else if (docCode === '301') {
    InitData = {
      admitDiagnosis: (data && data.admitDiagnosis) ? data.admitDiagnosis : JSON.parse(JSON.stringify(diseaseInit)),
      leaveDiagnosis: (data && data.leaveDiagnosis) ? data.leaveDiagnosis : JSON.parse(JSON.stringify(diseaseInit))
    }
  } else if (docCode === '302') {
    let sugeryRecord = []
    if (data && data.sugeryRecord) {
      sugeryRecord = data.sugeryRecord
      sugeryRecord.map(item => {
        item.date = new Date(item.date)
        return item
      })
    }
    // let stuporTime = ''
    // if (data && data.stuporTime) {
    //   stuporTime = []
    //   data.stuporTime.map(item => {
    //     stuporTime.push(new Date(item))
    //   })
    // }
    let drugAllergy = ''
    if ((data && data.drugAllergy)) {
      drugAllergy = data.drugAllergy
      if (!drugAllergy.value || !drugAllergy.value.length) {
        drugAllergy.value = drugAllergyInit.value
      }
    } else {
      drugAllergy = JSON.parse(JSON.stringify(drugAllergyInit))
    }
    let hosinAgainPlan = ''
    if ((data && data.hosinAgainPlan)) {
      hosinAgainPlan = data.hosinAgainPlan
      if (!hosinAgainPlan.value || !hosinAgainPlan.value.length) {
        hosinAgainPlan.value = statusShowInit.value
      }
    } else {
      hosinAgainPlan = JSON.parse(JSON.stringify(statusShowInit))
    }
    InitData = {
      hasAllergicHis: (data && !isNull(data.hasAllergicHis)) ? data.hasAllergicHis : true,
      drugAllergy: drugAllergy,
      leaveDiagnosis: (data && data.leaveDiagnosis) ? data.leaveDiagnosis : [],
      sugeryRecord: sugeryRecord,
      hosinAgainPlan: (data && data.hosinAgainPlan) ? data.hosinAgainPlan : JSON.parse(JSON.stringify(statusShowInit)),
      lifeAbilityScore: (data && data.lifeAbilityScore) ? data.lifeAbilityScore : JSON.parse(JSON.stringify(lifeAbilityScoreInit)),
      leaveMode: (data && data.leaveMode) ? data.leaveMode : JSON.parse(JSON.stringify(leaveModeInit)),
      poisoningCause: (data && data.poisoningCause) ? data.poisoningCause : JSON.parse(JSON.stringify(diseaseInit))
    }
  } else if (docCode === '406') {
    InitData = {
      diagnosis: (data && data.diagnosis) ? data.diagnosis : JSON.parse(JSON.stringify(diseaseInit))
    }
  }
  return InitData
}

export function dataFormat (docCode, docChildCode, data) {
  if (data.leaveDate) {
    data.leaveDate = dateFormat(data.leaveDate, 'YYYY-MM-DD HH:mm:ss')
  }
  if (data.roundTime) {
    data.roundTime = dateFormat(data.roundTime, 'YYYY-MM-DD HH:mm:ss')
  }
  if (data.sugeryDate) {
    data.sugeryDate = dateFormat(data.sugeryDate, 'YYYY-MM-DD HH:mm:ss')
  }
  if (data.talkDate) {
    data.talkDate = dateFormat(data.talkDate, 'YYYY-MM-DD HH:mm:ss')
  }
  if (docCode === '101') {
    data.hosRecAllergic = data.hosRecAllergic ? JSON.stringify(data.hosRecAllergic) : ''
    data.hosRecDiagnosis = data.hosRecDiagnosis ? JSON.stringify(data.hosRecDiagnosis) : ''
  } else if (docCode === '102') {
    data.hosRecDiagnosis = data.hosRecDiagnosis ? JSON.stringify(data.hosRecDiagnosis) : ''
  } else if (docCode === '104') {
    data.admitDiagnosis = data.admitDiagnosis ? JSON.stringify(data.admitDiagnosis) : ''
    data.leaveDiagnosis = data.leaveDiagnosis ? JSON.stringify(data.leaveDiagnosis) : ''
  } else if (docCode === '201') {
    if (docChildCode === '2') {
      data.checkdoctorName = data.checkdoctorName ? JSON.stringify(data.checkdoctorName) : ''
    }
  } else if (docCode === '202') {
    data.preSugDiagnosis = data.preSugDiagnosis ? JSON.stringify(data.preSugDiagnosis) : ''
    data.anaesMethod = data.anaesMethod ? JSON.stringify(data.anaesMethod) : ''
    data.sugeryName = data.sugeryName ? JSON.stringify(data.sugeryName) : ''
  } else if (docCode === '203') {
    data.compere = data.compere ? JSON.stringify(data.compere) : ''
    data.attendee = data.attendee ? JSON.stringify(data.attendee) : ''
  } else if (docCode === '204') {
    data.planAnaesMode = data.planAnaesMode ? JSON.stringify(data.planAnaesMode) : ''
    data.preSugDiagnosis = data.preSugDiagnosis ? JSON.stringify(data.preSugDiagnosis) : ''
    data.planSugName = data.planSugName ? JSON.stringify(data.planSugName) : ''
  } else if (docCode === '205') {
    data.anaesMethod = data.anaesMethod ? JSON.stringify(data.anaesMethod) : ''
    data.preDiagnosis = data.preDiagnosis ? JSON.stringify(data.preDiagnosis) : ''
    data.diagnosis = data.diagnosis ? JSON.stringify(data.diagnosis) : ''
    data.sugeryName = data.sugeryName ? JSON.stringify(data.sugeryName) : ''
  } else if (docCode === '301') {
    data.admitDiagnosis = data.admitDiagnosis ? JSON.stringify(data.admitDiagnosis) : ''
    data.leaveDiagnosis = data.leaveDiagnosis ? JSON.stringify(data.leaveDiagnosis) : ''
  } else if (docCode === '302') {
    if (data.sugeryRecord && data.sugeryRecord.length) {
      data.sugeryRecord.map(item => {
        item.date = dateFormat(item.date, 'YYYY-MM-DD HH:mm:ss')
        return item
      })
    }
    let stuporTime = ''
    if (data.stuporTime && data.stuporTime.length) {
      stuporTime = []
      data.stuporTime.map(item => {
        stuporTime.push(dateFormat(item, 'YYYY-MM-DD HH:mm:ss'))
      })
    }
    let drugAllergy = {isTrue: false, value: []}
    if (data && data.drugAllergy) {
      drugAllergy = JSON.parse(JSON.stringify(data.drugAllergy))
      let drugAllergyVal = []
      if (drugAllergy.isTrue && drugAllergy.value && drugAllergy.value.length) {
        drugAllergy.value.forEach(item => {
          drugAllergyVal.push({allergen: {
            id: item.allergen.id,
            name: item.allergen.name,
            byname: item.allergen.byname,
            globalMaterialId: item.allergen.globalMaterialId,
            localMaterialId: item.allergen.localMaterialId
          }})
        })
      }
      drugAllergy.value = drugAllergyVal
    }
    data.drugAllergy = drugAllergy ? JSON.stringify(drugAllergy) : ''
    data.leaveDiagnosis = data.leaveDiagnosis ? JSON.stringify(data.leaveDiagnosis) : ''
    data.sugeryRecord = data.sugeryRecord ? JSON.stringify(data.sugeryRecord) : ''
    data.hosinAgainPlan = data.hosinAgainPlan ? JSON.stringify(data.hosinAgainPlan) : ''
    data.lifeAbilityScore = data.lifeAbilityScore ? JSON.stringify(data.lifeAbilityScore) : ''
    data.leaveMode = data.leaveMode ? JSON.stringify(data.leaveMode) : ''
    data.stuporTime = stuporTime ? JSON.stringify(stuporTime) : ''
    data.poisoningCause = data.poisoningCause ? JSON.stringify(data.poisoningCause) : ''
  } else if (docCode === '406') {
    data.diagnosis = data.diagnosis ? JSON.stringify(data.diagnosis) : ''
  }
  return data
}
