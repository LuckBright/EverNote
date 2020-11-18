let filters = {
  filters: {
    hospitalOrgCategory (value) { // 医疗机构类别
      switch (value) {
        case '01':
          return '综合性医院'
        case '02':
          return '药店'
        case '03':
          return '门诊部'
        case '04':
          return '诊所'
        case '05':
          return '专科病防治医院'
        case '06':
          return '社区卫生服务机构'
        case '07':
          return '卫生院'
        case '08':
          return '精神病院'
        case '09':
          return '专科医院'
        case '10':
          return '中医院'
        default:
          return ''
      }
    },
    hospitalLevel (value) { // 医院等级
      switch (value) {
        case '01':
          return '一级医院'
        case '02':
          return '二级医院'
        case '03':
          return '三级医院'
        default:
          return ''
      }
    },
    hospitalFeeLevel (value) { // 医院收费等级|实际医院级别
      switch (value) {
        case '1':
          return '一级'
        case '2':
          return '二级'
        case '3':
          return '三级'
        default:
          return ''
      }
    },
    prescriptionRight (value) { // 医保处方权
      switch (value) {
        case '0':
          return '不可以录入处方'
        case '1':
          return '可以录入处方'
        default:
          return ''
      }
    },
    doctorLevel (value) { // 医师级别
      switch (value) {
        case '1':
          return '主任医师'
        case '2':
          return '副主任医师'
        case '3':
          return '主治医师'
        case '4':
          return '医师'
        case '5':
          return '助理医师'
        default:
          return ''
      }
    },
    doctorLevelCode (value) { // 医师级别汉字转code
      switch (value) {
        case '主任医师':
          return '1'
        case '副主任医师':
          return '2'
        case '主治医师':
          return '3'
        case '医师':
          return '4'
        case '助理医师':
          return '5'
        default:
          return ''
      }
    },
    title (value) { // 职称
      switch (value) {
        case '01':
          return '高级'
        case '02':
          return '中级'
        case '03':
          return '初级'
        default:
          return ''
      }
    },
    administrativePosition (value) { // 行政职务
      switch (value) {
        case '030':
          return '部、省级'
        case '033':
          return '相当部、省级'
        case '040':
          return '副部、副省级'
        case '043':
          return '相当副部、副省级'
        case '050':
          return '司、局、地、厅级'
        case '051':
          return '巡视员'
        case '053':
          return '相当司局级'
        case '060':
          return '副司、副局、副地、副厅级'
        case '061':
          return '助理巡视员'
        case '063':
          return '相当副司局级'
        case '070':
          return '县、处级'
        case '071':
          return '调研员'
        case '073':
          return '相当处级'
        case '080':
          return '副县、副处级'
        case '081':
          return '助理调研员'
        case '083':
          return '相当副处级'
        case '090':
          return '科级'
        case '093':
          return '相当科级'
        case '100':
          return '副科级'
        case '103':
          return '相当副科级'
        case '110':
          return '科员级'
        case '120':
          return '办事员级'
        case '190':
          return '无行政职务级别'
        default:
          return ''
      }
    },
    gender (value) { // 性别
      switch (value) {
        case '1':
          return '男'
        case '2':
          return '女'
        case '9':
          return '未说明性别'
        default:
          return ''
      }
    },
    diseasesCategory (value) { // 疾病种类
      switch (value) {
        case '1':
          return '心血管系统疾病'
        case '2':
          return '消化系统疾病'
        case '3':
          return '代谢内分泌疾病'
        case '4':
          return '造血系统疾病'
        case '5':
          return '肾脏疾病'
        case '6':
          return '神经系统疾病'
        case '7':
          return '免疫系统疾病'
        case '8':
          return '传染病'
        case '9':
          return '呼吸系统疾病'
        case '10':
          return '恶性肿瘤'
        case '11':
          return '精神病'
        case '12':
          return '残疾'
        case '13':
          return '泌尿系统'
        case '14':
          return '其他'
        default:
          return ''
      }
    },
    doctorCategory (value) { // 医院人员类别
      switch (value) {
        case '1':
          return '医师'
        case '2':
          return '医技人员'
        case '3':
          return '药剂人员'
        case '4':
          return '操作员'
        default:
          return ''
      }
    },
    approvalMark (value) { // 审批标志
      switch (value) {
        case '0':
          return '待审批'
        case '1':
          return '审批通过'
        case '2':
          return '审批未通过'
        case '3':
          return '审批已结算'
        default:
          return ''
      }
    },
    inHospitalStatus (value) { // 在院状态
      switch (value) {
        case '0':
          return '不在院'
        case '1':
          return '在院'
        default:
          return ''
      }
    },
    medicalCategory (value) { // 医疗类别
      switch (value) {
        case '11':
          return '普通门诊'
        case '13':
          return '门诊慢性病'
        case '14':
          return '急诊抢救'
        case '16':
          return '异地特定病种门诊'
        case '21':
          return '普通住院'
        case '22':
          return '日间病床'
        case '23':
          return '转省外住院'
        case '24':
          return '精神病住院'
        case '25':
          return '异地就医'
        case '26':
          return '单病种'
        case '61':
          return '产前检查'
        case '62':
          return '计划生育手术'
        case '63':
          return '生育定额住院'
        case '64':
          return '生育普通住院'
        case '81':
          return '工伤普通门诊'
        case '84':
          return '工伤普通住院'
        case '88':
          return '工伤体检'
      }
    }
  }
}
export default filters
