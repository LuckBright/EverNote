export default {
  '预约信息': {
    'type': 'object',
    'properties': {
      'appointmentChannel': {
        'type': 'string',
        'description': '预约途径'
      },
      'appointmentComment': {
        'type': 'string',
        'description': 'text comment 预约备注'
      },
      'appointmentCreatorOrgId': {
        'type': 'string',
        'description': '预约创建人机构id'
      },
      'appointmentCreatorOrgName': {
        'type': 'string',
        'description': '预约创建人机构名称'
      },
      'appointmentCreatorTenantSubjectId': {
        'type': 'string',
        'description': '预约创建人科室id'
      },
      'appointmentCreatorTenantSubjectName': {
        'type': 'string',
        'description': '预约创建人科室名称'
      },
      'appointmentDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '预约日期'
      },
      'appointmentDoctorId': {
        'type': 'string',
        'description': '预约的医生id'
      },
      'appointmentDoctorName': {
        'type': 'string',
        'description': '预约的医师姓名'
      },
      'appointmentEndTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '预约结束时间'
      },
      'appointmentId': {
        'type': 'string',
        'description': '预约信息id'
      },
      'appointmentModifyUserOrgId': {
        'type': 'string',
        'description': '预约修改人机构id'
      },
      'appointmentModifyUserOrgName': {
        'type': 'string',
        'description': '预约修改人机构名称'
      },
      'appointmentModifyUserTenantSubjectId': {
        'type': 'string',
        'description': '预约修改人科室id'
      },
      'appointmentModifyUserTenantSubjectName': {
        'type': 'string',
        'description': '预约修改人科室名称'
      },
      'appointmentNumber': {
        'type': 'string',
        'description': '预约单号'
      },
      'appointmentNumberCode': {
        'type': 'string',
        'description': '预约的号别代码'
      },
      'appointmentNumberTypeCode': {
        'type': 'string',
        'description': '预约的号别类型代码'
      },
      'appointmentNumberTypeName': {
        'type': 'string',
        'description': '预约的号别类型名称'
      },
      'appointmentOrgCode': {
        'type': 'string',
        'description': '预约的机构代码'
      },
      'appointmentOrgId': {
        'type': 'string',
        'description': '预约的机构id'
      },
      'appointmentOrgName': {
        'type': 'string',
        'description': '预约的机构名称'
      },
      'appointmentPatientMobile': {
        'type': 'string',
        'description': '预约人电话'
      },
      'appointmentPatientName': {
        'type': 'string',
        'description': '预约人姓名'
      },
      'appointmentRoomCode': {
        'type': 'string',
        'description': '预约的诊间代码'
      },
      'appointmentRoomId': {
        'type': 'string',
        'description': '预约诊间id'
      },
      'appointmentRoomName': {
        'type': 'string',
        'description': '预约的诊间名称'
      },
      'appointmentSendSmsFlag': {
        'type': 'string',
        'description': '预约是否已发短信'
      },
      'appointmentServiceId': {
        'type': 'string',
        'description': '预约的项目编号'
      },
      'appointmentServiceName': {
        'type': 'string',
        'description': '预约的项目名称'
      },
      'appointmentStartTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '预约开始时间'
      },
      'appointmentStatusCode': {
        'type': 'string',
        'description': '预约状态代码'
      },
      'appointmentStatusName': {
        'type': 'string',
        'description': '预约状态名称'
      },
      'appointmentTenantId': {
        'type': 'string',
        'description': '预约的租户id'
      },
      'appointmentTenantName': {
        'type': 'string',
        'description': '预约的租户名称'
      },
      'appointmentTenantSubjectCode': {
        'type': 'string',
        'description': '预约的科室代码'
      },
      'appointmentTenantSubjectId': {
        'type': 'string',
        'description': '预约科室id'
      },
      'appointmentTenantSubjectName': {
        'type': 'string',
        'description': '预约的科室名称'
      },
      'appointmentTimeSolt': {
        'type': 'string',
        'format': 'date-time',
        'description': '预约时间段'
      },
      'appointmentTypeCode': {
        'type': 'string',
        'description': '预约类型代码'
      },
      'appointmentTypeName': {
        'type': 'string',
        'description': '预约类型名称'
      },
      'appointmentVisitDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '预约就诊日期'
      },
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'insuranceOrg': {
        'type': 'string',
        'description': '保险机构'
      },
      'insuranceProductId': {
        'type': 'string',
        'description': '保险产品id'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'isSignIn': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否签到。0，否；1，是'
      },
      'md5': {
        'type': 'string',
        'description': 'md5'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'orgName': {
        'type': 'string',
        'description': '机构名称'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientMobile': {
        'type': 'string',
        'description': '患者手机号'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'signInTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '签到时间'
      },
      'smsContent': {
        'type': 'string',
        'description': '短信内容'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'visitTypeCode': {
        'type': 'string',
        'description': 'visit分类代码'
      },
      'visitTypeName': {
        'type': 'string',
        'description': 'visit分类名称'
      }
    }
  },
  '挂号信息': {
    'type': 'object',
    'properties': {
      'createByOrgId': {
        'type': 'string',
        'description': '创建机构id'
      },
      'createByOrgName': {
        'type': 'string',
        'description': '创建机构名称'
      },
      'createByTenantSubjectId': {
        'type': 'string',
        'description': '创建科室id'
      },
      'createByTenantSubjectName': {
        'type': 'string',
        'description': '创建科室名称'
      },
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'doctorId': {
        'type': 'string',
        'description': '医师编码'
      },
      'doctorName': {
        'type': 'string',
        'description': '医师姓名'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'isSendShortMsg': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否已发短信。0，否；1，是'
      },
      'isSignIn': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否签到。0，否；1，是'
      },
      'md5': {
        'type': 'string',
        'description': 'md5'
      },
      'modifyOrgId': {
        'type': 'string',
        'description': '修改机构id'
      },
      'modifyOrgName': {
        'type': 'string',
        'description': '修改机构名称'
      },
      'modifyTenantSubjectId': {
        'type': 'string',
        'description': '修改科室id'
      },
      'modifyTenantSubjectName': {
        'type': 'string',
        'description': '修改科室名称'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'noCode': {
        'type': 'string',
        'description': '号别代码'
      },
      'noName': {
        'type': 'string',
        'description': '号别名称'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'orgName': {
        'type': 'string',
        'description': '机构名称'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'registerId': {
        'type': 'string',
        'description': '挂号信息id'
      },
      'registerNo': {
        'type': 'string',
        'description': '挂号单号'
      },
      'registerRemark': {
        'type': 'string',
        'description': '挂号备注'
      },
      'registerTypeCode': {
        'type': 'string',
        'description': '挂号类型代码'
      },
      'registerTypeName': {
        'type': 'string',
        'description': '挂号类型名称'
      },
      'registerWayCode': {
        'type': 'string',
        'description': '挂号途径代码'
      },
      'registerWayName': {
        'type': 'string',
        'description': '挂号途径名称'
      },
      'signInTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '签到时间'
      },
      'smsContent': {
        'type': 'string',
        'description': '短信内容'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'tenantSubjectCode': {
        'type': 'string',
        'description': '集团科室代码'
      },
      'tenantSubjectName': {
        'type': 'string',
        'description': '集团科室名称'
      },
      'visitDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '就诊日期'
      },
      'visitPlace': {
        'type': 'string',
        'description': '就诊地点'
      },
      'visitSequenceNumber': {
        'type': 'string',
        'description': '就诊序号'
      }
    }
  },
  '预检信息': {
    'type': 'object',
    'properties': {
      'bloodOxygen': {
        'type': 'string',
        'description': '血氧'
      },
      'bloodTransfusionHistory': {
        'type': 'string',
        'description': '输血史'
      },
      'bmi': {
        'type': 'string',
        'description': '身体质量指数'
      },
      'bodyTemperature': {
        'type': 'number',
        'description': '体温'
      },
      'chiefComplaint': {
        'type': 'string',
        'description': '主诉'
      },
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'diastolicPressure': {
        'type': 'string',
        'description': '舒张压'
      },
      'familyHistory': {
        'type': 'string',
        'description': '家族史'
      },
      'heartRate': {
        'type': 'string',
        'description': '心率'
      },
      'height': {
        'type': 'string',
        'description': '身高'
      },
      'infectiousHistory': {
        'type': 'string',
        'description': '传染病史'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'isPregnant': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否怀孕'
      },
      'lastMenstrualPeriod': {
        'type': 'string',
        'description': '末次月经'
      },
      'marriageChildbearingHistory': {
        'type': 'string',
        'description': '婚育史'
      },
      'md5': {
        'type': 'string',
        'description': 'md5'
      },
      'medicineAllergyHistory': {
        'type': 'string',
        'description': '药物过敏史'
      },
      'medicineAllergyName': {
        'type': 'string',
        'description': '药物过敏名称'
      },
      'menstrualHistory': {
        'type': 'string',
        'description': '月经史'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'nonMedicinalAllergyHistory': {
        'type': 'string',
        'description': '非药物过敏史'
      },
      'nonMedicinalAllergyName': {
        'type': 'string',
        'description': '非药物过敏名称'
      },
      'orgCode': {
        'type': 'string',
        'description': '机构代码'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'orgName': {
        'type': 'string',
        'description': '机构名称'
      },
      'pastHistory': {
        'type': 'string',
        'description': '既往史'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'personHistory': {
        'type': 'string',
        'description': '个人史'
      },
      'preCheckDoctorId': {
        'type': 'string',
        'description': '预检医师id'
      },
      'preCheckDoctorName': {
        'type': 'string',
        'description': '预检医师姓名'
      },
      'preCheckId': {
        'type': 'string',
        'description': '预检信息id'
      },
      'preCheckTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '预检时间'
      },
      'pulse': {
        'type': 'string',
        'description': '脉搏'
      },
      'respiratory': {
        'type': 'string',
        'description': '呼吸'
      },
      'surgeryHistory': {
        'type': 'string',
        'description': '手术史'
      },
      'systolicPressure': {
        'type': 'string',
        'description': '收缩压'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'tenantSubjectCode': {
        'type': 'string',
        'description': '集团科室代码'
      },
      'tenantSubjectName': {
        'type': 'string',
        'description': '集团科室名称'
      },
      'vaccinationHistory': {
        'type': 'string',
        'description': '预防接种史'
      },
      'weight': {
        'type': 'number',
        'description': '体重'
      }
    }
  },
  '就诊信息': {
    'type': 'object',
    'properties': {
      'admissionAreaId': {
        'type': 'string',
        'description': '入院病区id'
      },
      'admissionAreaName': {
        'type': 'string',
        'description': '入院病区名称'
      },
      'admissionBedId': {
        'type': 'string',
        'description': '入院床号id'
      },
      'admissionBedName': {
        'type': 'string',
        'description': '入院床号名称'
      },
      'admissionDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '入院日期'
      },
      'admissionDiagnosis': {
        'type': 'string',
        'description': '入院诊断'
      },
      'admissionDiagnosisJson': {
        'type': 'string',
        'description': '入院诊断json'
      },
      'admissionOrgId': {
        'type': 'string',
        'description': '入院机构id'
      },
      'admissionOrgName': {
        'type': 'string',
        'description': '入院机构名称'
      },
      'admissionRoomId': {
        'type': 'string',
        'description': '入院病房id'
      },
      'admissionRoomName': {
        'type': 'string',
        'description': '入院病房名称'
      },
      'admissionRouteCode': {
        'type': 'string',
        'description': '入院途径代码'
      },
      'admissionRouteName': {
        'type': 'string',
        'description': '入院途径名称'
      },
      'admissionSituationId': {
        'type': 'string',
        'description': '入院病情id'
      },
      'admissionSituationName': {
        'type': 'string',
        'description': '入院病情名称'
      },
      'admissionTenantId': {
        'type': 'string',
        'description': '入院租户id'
      },
      'admissionTenantName': {
        'type': 'string',
        'description': '入院租户名称'
      },
      'admissionTenantSubjectId': {
        'type': 'string',
        'description': '入院科室id'
      },
      'admissionTenantSubjectName': {
        'type': 'string',
        'description': '入院科室名称'
      },
      'admissionTypeCode': {
        'type': 'string',
        'description': '入院方式代码'
      },
      'admissionTypeName': {
        'type': 'string',
        'description': '入院方式名称'
      },
      'attendingDoctorId': {
        'type': 'string',
        'description': '主治医生id'
      },
      'attendingDoctorName': {
        'type': 'string',
        'description': '主治医师名称'
      },
      'chiefPhysicianId': {
        'type': 'string',
        'description': '主任医师id'
      },
      'chiefPhysicianName': {
        'type': 'string',
        'description': '主任医师名称'
      },
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'dischargeBedCode': {
        'type': 'string',
        'description': '出院床号代码'
      },
      'dischargeBedId': {
        'type': 'string',
        'description': '出院床号id'
      },
      'dischargeBedName': {
        'type': 'string',
        'description': '出院床号名称'
      },
      'dischargeDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '出院日期'
      },
      'dischargeSickAreaId': {
        'type': 'string',
        'description': '出院病区id'
      },
      'dischargeSickAreaName': {
        'type': 'string',
        'description': '出院病区名称'
      },
      'dischargeSickRoomId': {
        'type': 'string',
        'description': '出院病房id'
      },
      'dischargeSickRoomName': {
        'type': 'string',
        'description': '出院病房名称'
      },
      'dischargeTenantSubjectId': {
        'type': 'string',
        'description': '出院科室id'
      },
      'dischargeTenantSubjectName': {
        'type': 'string',
        'description': '出院科室名称'
      },
      'dischargeTypeCode': {
        'type': 'string',
        'description': '出院方式代码'
      },
      'dischargeTypeName': {
        'type': 'string',
        'description': '出院方式名称'
      },
      'entranceTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '入科时间'
      },
      'firstVisitFlag': {
        'type': 'string',
        'description': '初诊标识'
      },
      'furtherEducationDoctorId': {
        'type': 'string',
        'description': '进修医师id'
      },
      'furtherEducationDoctorName': {
        'type': 'string',
        'description': '进修医师名称'
      },
      'hospitalizationDoctorId': {
        'type': 'string',
        'description': '住院医师id'
      },
      'hospitalizationDoctorName': {
        'type': 'string',
        'description': '住院医师名称'
      },
      'hospitalizationStatusCode': {
        'type': 'string',
        'description': '住院状态代码'
      },
      'hospitalizationStatusName': {
        'type': 'string',
        'description': '住院状态名称'
      },
      'hospitalizedTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '实际接诊入院时间就诊时间'
      },
      'internId': {
        'type': 'string',
        'description': '实习医师id'
      },
      'internName': {
        'type': 'string',
        'description': '实习医师名称'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'isDischargeFromHospital': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否出院。0，否；1，是'
      },
      'isNewborn': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否新生儿。0，否；1，是'
      },
      'isOperation': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否手术。0，否；1，是'
      },
      'leaveHospitalTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '实际结诊出院时间'
      },
      'leaveHospitalWayCode': {
        'type': 'string',
        'description': '离院方式代码'
      },
      'leaveHospitalWayName': {
        'type': 'string',
        'description': '离院方式名称'
      },
      'medicalInsuranceTypeCode': {
        'type': 'string',
        'description': '医疗保险类别代码'
      },
      'medicalInsuranceTypeName': {
        'type': 'string',
        'description': '医疗保险类别名称'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'noTypeCode': {
        'type': 'string',
        'description': '号别类型代码'
      },
      'noTypeName': {
        'type': 'string',
        'description': '号别类型名称'
      },
      'nurseLevelCode': {
        'type': 'string',
        'description': '护理等级代码'
      },
      'nurseLevelName': {
        'type': 'string',
        'description': '护理等级名称'
      },
      'orgId': {
        'type': 'string',
        'description': '机构ID'
      },
      'outSubjectTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '出科时间'
      },
      'outpatientInpatientDoctorId': {
        'type': 'string',
        'description': '门诊医生住院医生id'
      },
      'outpatientInpatientDoctorName': {
        'type': 'string',
        'description': '门诊医生住院医生名称'
      },
      'outpatientIsAppointResource': {
        'type': 'string',
        'description': '门诊是否指定医生'
      },
      'outpatientVisitTypeCode': {
        'type': 'string',
        'description': '门诊具体就诊类型代码'
      },
      'outpatientVisitTypeName': {
        'type': 'string',
        'description': '门诊具体就诊类型名称'
      },
      'patientAge': {
        'type': 'string',
        'description': '患者年龄'
      },
      'patientDiseaseCode': {
        'type': 'string',
        'description': '住院者疾病状态代码'
      },
      'patientDiseaseName': {
        'type': 'string',
        'description': '住院者疾病状态名称'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'paymentMethodCode': {
        'type': 'string',
        'description': '付费方式代码'
      },
      'paymentMethodName': {
        'type': 'string',
        'description': '付费方式名称'
      },
      'plannedInHospitalTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '计划接诊入院时间'
      },
      'primaryNurseId': {
        'type': 'string',
        'description': '责任护士id'
      },
      'primaryNurseName': {
        'type': 'string',
        'description': '责任护士名称'
      },
      'qualityControlDoctorId': {
        'type': 'string',
        'description': '质控医师id'
      },
      'qualityControlDoctorName': {
        'type': 'string',
        'description': '质控医师名称'
      },
      'qualityControlNurseId': {
        'type': 'string',
        'description': '质控护士id'
      },
      'qualityControlNurseName': {
        'type': 'string',
        'description': '质控护士名称'
      },
      'receiveDoctorId': {
        'type': 'string',
        'description': '接收医师id'
      },
      'receiveDoctorName': {
        'type': 'string',
        'description': '接收医师名称'
      },
      'receptionNurseId': {
        'type': 'string',
        'description': '接诊护士id'
      },
      'receptionNurseName': {
        'type': 'string',
        'description': '接诊护士名称'
      },
      'registerChannelCode': {
        'type': 'string',
        'description': '挂号渠道代码'
      },
      'registerChannelName': {
        'type': 'string',
        'description': '挂号渠道名称'
      },
      'registerTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '挂号时间'
      },
      'secondChiefPhysicianId': {
        'type': 'string',
        'description': '副主任医师id'
      },
      'secondChiefPhysicianName': {
        'type': 'string',
        'description': '副主任医师名称'
      },
      'signInTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '签到时间'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'visitAreaId': {
        'type': 'string',
        'description': '就诊病区id'
      },
      'visitAreaName': {
        'type': 'string',
        'description': '就诊病区名称'
      },
      'visitBedId': {
        'type': 'string',
        'description': '就诊病床id'
      },
      'visitBedName': {
        'type': 'string',
        'description': '就诊病床名称'
      },
      'visitCount': {
        'type': 'number',
        'description': '就诊次数'
      },
      'visitDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '就诊日期'
      },
      'visitDoctorId': {
        'type': 'string',
        'description': '就诊医师id'
      },
      'visitDoctorName': {
        'type': 'string',
        'description': '就诊医师名称'
      },
      'visitEndFlag': {
        'type': 'string',
        'description': '就诊是否结束'
      },
      'visitOrgId': {
        'type': 'string',
        'description': '就诊机构代码'
      },
      'visitOrgName': {
        'type': 'string',
        'description': '就诊机构名称'
      },
      'visitReason': {
        'type': 'string',
        'description': '就诊原因'
      },
      'visitRecordId': {
        'type': 'string',
        'description': '就诊记录id'
      },
      'visitRegisteredCode': {
        'type': 'string',
        'description': '就诊号别代码'
      },
      'visitRegisteredName': {
        'type': 'string',
        'description': '就诊号别名称'
      },
      'visitRoomId': {
        'type': 'string',
        'description': '就诊病房id'
      },
      'visitRoomName': {
        'type': 'string',
        'description': '就诊病房名称'
      },
      'visitSerialNumber': {
        'type': 'string',
        'description': '就诊流水号'
      },
      'visitSerialTypeCode': {
        'type': 'string',
        'description': '就诊流水类型'
      },
      'visitSourceCode': {
        'type': 'string',
        'description': '就诊来源代码'
      },
      'visitSourceName': {
        'type': 'string',
        'description': '就诊来源名称'
      },
      'visitStatusCode': {
        'type': 'string',
        'description': '就诊状态代码'
      },
      'visitStatusName': {
        'type': 'string',
        'description': '就诊状态名称'
      },
      'visitTenantId': {
        'type': 'string',
        'description': '就诊租户id'
      },
      'visitTenantName': {
        'type': 'string',
        'description': '就诊租户名称'
      },
      'visitTenantSubjectCode': {
        'type': 'string',
        'description': '就诊科室代码'
      },
      'visitTenantSubjectName': {
        'type': 'string',
        'description': '就诊科室名称'
      },
      'visitTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '到诊时间'
      },
      'visitTypeCode': {
        'type': 'string',
        'description': '就诊类型代码'
      },
      'visitTypeName': {
        'type': 'string',
        'description': '就诊类型名称'
      }
    }
  },
  '转科信息': {
    'type': 'object',
    'properties': {
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'md5': {
        'type': 'string',
        'description': 'md5'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'operatonDoctorCode': {
        'type': 'string',
        'description': '操作医生代码'
      },
      'operatonDoctorName': {
        'type': 'string',
        'description': '操作医生名称'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'orgName': {
        'type': 'string',
        'description': '机构名称'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'transferedInBedId': {
        'type': 'string',
        'description': '转入床位id'
      },
      'transferedInBedName': {
        'type': 'string',
        'description': '转入床位名称'
      },
      'transferedInDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '转入日期'
      },
      'transferedInOperatorId': {
        'type': 'string',
        'description': '转入操作人id'
      },
      'transferedInOperatorName': {
        'type': 'string',
        'description': '转入操作人名称'
      },
      'transferedInTenantSubjectCode': {
        'type': 'string',
        'description': '转入科室代码'
      },
      'transferedInTenantSubjectName': {
        'type': 'string',
        'description': '转入科室名称'
      },
      'transferedOutBedId': {
        'type': 'string',
        'description': '转出床位id'
      },
      'transferedOutBedName': {
        'type': 'string',
        'description': '转出床位名称'
      },
      'transferedOutOperatorId': {
        'type': 'string',
        'description': '转出操作人id'
      },
      'transferedOutOperatorName': {
        'type': 'string',
        'description': '转出操作人名称'
      },
      'transferedOutReason': {
        'type': 'string',
        'description': '转出原因'
      },
      'transferedOutTenantSubjectCode': {
        'type': 'string',
        'description': '转出科室代码'
      },
      'transferedOutTenantSubjectName': {
        'type': 'string',
        'description': '转出科室名称'
      },
      'transferedOutTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '转出时间'
      },
      'transferedSubjectId': {
        'type': 'string',
        'description': '转科信息id'
      },
      'transferedSubjectTypeCode': {
        'type': 'string',
        'description': '转科类型代码'
      },
      'transferedSubjectTypeName': {
        'type': 'string',
        'description': '转科类型名称'
      }
    }
  },
  '医嘱信息': {
    'type': 'object',
    'properties': {
      'adviceOrderNumber': {
        'type': 'string',
        'description': '开立医嘱号'
      },
      'adviceStopById': {
        'type': 'string',
        'description': '停止人id'
      },
      'adviceStopByName': {
        'type': 'string',
        'description': '停止人姓名'
      },
      'antibioticTypeCode': {
        'type': 'string',
        'description': '毒麻精放code'
      },
      'antibioticTypeName': {
        'type': 'string',
        'description': '毒麻精放分类名称'
      },
      'channelId': {
        'type': 'string',
        'description': '渠道id'
      },
      'channelName': {
        'type': 'string',
        'description': '渠道名称'
      },
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'days': {
        'type': 'number',
        'description': '天数'
      },
      'doctorAdviceContent': {
        'type': 'string',
        'description': '医嘱详情'
      },
      'doctorAdviceContentJson': {
        'type': 'string',
        'description': '医嘱项目内容json'
      },
      'doctorAdviceDoctorStopTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '医嘱医生停止时间'
      },
      'doctorAdviceDoctorStopUserId': {
        'type': 'string',
        'description': '医嘱医生停止者id'
      },
      'doctorAdviceDoctorStopUserName': {
        'type': 'string',
        'description': '医嘱医生停止者名称'
      },
      'doctorAdviceExecuteStatusCode': {
        'type': 'string',
        'description': '医嘱执行状态代码'
      },
      'doctorAdviceExecuteStatusName': {
        'type': 'string',
        'description': '医嘱执行状态名称'
      },
      'doctorAdviceExecuteTenantSubjectId': {
        'type': 'string',
        'description': '医嘱执行科室id'
      },
      'doctorAdviceExecuteTenantSubjectName': {
        'type': 'string',
        'description': '医嘱执行科室名称'
      },
      'doctorAdviceId': {
        'type': 'string',
        'description': '医嘱id'
      },
      'doctorAdviceItemTypeCode': {
        'type': 'string',
        'description': '医嘱项目类型代码'
      },
      'doctorAdviceItemTypeName': {
        'type': 'string',
        'description': '医嘱项目类型名称'
      },
      'doctorAdviceName': {
        'type': 'string',
        'description': '医嘱名称'
      },
      'doctorAdviceNullifyDoctorId': {
        'type': 'string',
        'description': '医嘱作废医生id'
      },
      'doctorAdviceNullifyDoctorName': {
        'type': 'string',
        'description': '医嘱作废医生名称'
      },
      'doctorAdviceNullifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '医嘱作废时间'
      },
      'doctorAdviceNurseStopTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '医嘱护士停止时间'
      },
      'doctorAdviceNurseStopUserId': {
        'type': 'string',
        'description': '医嘱护士停止者id'
      },
      'doctorAdviceNurseStopUserName': {
        'type': 'string',
        'description': '医嘱护士停止者名称'
      },
      'doctorAdviceOpenDoctorId': {
        'type': 'string',
        'description': '医嘱开立者id'
      },
      'doctorAdviceOpenSignName': {
        'type': 'string',
        'description': '医嘱开立者签名'
      },
      'doctorAdviceOpenTenantSubjectId': {
        'type': 'string',
        'description': '医嘱开立科室id'
      },
      'doctorAdviceOpenTenantSubjectName': {
        'type': 'string',
        'description': '医嘱开立科室名称'
      },
      'doctorAdviceOpenTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '医嘱开立日期时间'
      },
      'doctorAdviceRemark': {
        'type': 'string',
        'description': '医嘱备注信息'
      },
      'doctorAdviceSkinTestFlag': {
        'type': 'string',
        'description': '医嘱是否皮试'
      },
      'doctorAdviceStartTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '医嘱开始时间'
      },
      'doctorAdviceStatusCode': {
        'type': 'string',
        'description': '医嘱状态代码'
      },
      'doctorAdviceStatusName': {
        'type': 'string',
        'description': '医嘱状态名称'
      },
      'doctorAdviceStopTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '医嘱停止时间'
      },
      'doctorAdviceTypeCode': {
        'type': 'string',
        'description': '医嘱类型代码'
      },
      'doctorAdviceTypeName': {
        'type': 'string',
        'description': '医嘱类型名称'
      },
      'doctorAdviceVerifyDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '医嘱核对日期'
      },
      'doctorAdviceVerifyTenantSubjectId': {
        'type': 'string',
        'description': '医嘱核对科室id'
      },
      'doctorAdviceVerifyTenantSubjectName': {
        'type': 'string',
        'description': '医嘱核对科室名称'
      },
      'doctorAdviceVerifyUserId': {
        'type': 'string',
        'description': '医嘱核对者id'
      },
      'doctorAdviceVerifyUserName': {
        'type': 'string',
        'description': '医嘱核对者名称'
      },
      'executes': {
        'type': 'array',
        'description': '患者医嘱执行信息列表',
        'items': {
          '$ref': '#/definitions/患者医嘱执行信息'
        }
      },
      'frequency': {
        'type': 'string',
        'description': '频次'
      },
      'highRiskCode': {
        'type': 'string',
        'description': '高危药物code'
      },
      'highRiskName': {
        'type': 'string',
        'description': '高危药物分类名称'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'md5': {
        'type': 'string',
        'description': 'md5'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'orgName': {
        'type': 'string',
        'description': '机构名称'
      },
      'outpatientPrescriptions': {
        'type': 'array',
        'description': '门诊处方信息列表',
        'items': {
          '$ref': '#/definitions/门诊处方'
        }
      },
      'parentChildAdviceFlag': {
        'type': 'string',
        'description': '父子医嘱标识'
      },
      'parentChildGroupId': {
        'type': 'string',
        'description': '父子医嘱组id'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'quantity': {
        'type': 'number',
        'description': '数量'
      },
      'quantityUnit': {
        'type': 'string',
        'description': '数量单位'
      },
      'reorganizationMark': {
        'type': 'string',
        'description': '重整标志'
      },
      'serviceId': {
        'type': 'string',
        'description': '服务id'
      },
      'specialClassifyCode': {
        'type': 'string',
        'description': '抗菌药物code'
      },
      'specialClassifyName': {
        'type': 'string',
        'description': '抗菌药物分类名称'
      },
      'specification': {
        'type': 'string',
        'description': '规格'
      },
      'storageName': {
        'type': 'string',
        'description': '库房名称'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'visitTypeCode': {
        'type': 'string',
        'description': '就诊类型代码'
      },
      'visitTypeName': {
        'type': 'string',
        'description': '就诊类型名称'
      }
    }
  },
  '诊断信息': {
    'type': 'object',
    'properties': {
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'diagnosisCode': {
        'type': 'string',
        'description': '诊断代码'
      },
      'diagnosisDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '诊断日期'
      },
      'diagnosisDoctorId': {
        'type': 'string',
        'description': '诊断医师id'
      },
      'diagnosisDoctorName': {
        'type': 'string',
        'description': '诊断医生名称'
      },
      'diagnosisId': {
        'type': 'string',
        'description': '诊断信息id'
      },
      'diagnosisName': {
        'type': 'string',
        'description': '诊断名称'
      },
      'diagnosisRemark': {
        'type': 'string',
        'description': '诊断备注'
      },
      'diagnosisSerialNumber': {
        'type': 'string',
        'description': '诊断序号'
      },
      'diagnosisTenantSubjectId': {
        'type': 'string',
        'description': '诊断科室id'
      },
      'diagnosisTypeCode': {
        'type': 'string',
        'description': '诊断类别代码'
      },
      'diagnosisTypeName': {
        'type': 'string',
        'description': '诊断类别名称'
      },
      'diseaseCodeCategory': {
        'type': 'string',
        'description': '诊断编码分类'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'md5': {
        'type': 'string',
        'description': 'md5'
      },
      'medicalRecordCategoryCode': {
        'type': 'string',
        'description': '病历分类代码'
      },
      'medicalRecordCategoryName': {
        'type': 'string',
        'description': '病历分类名称'
      },
      'medicalRecordCreateTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '病历记录时间'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'receptionTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '接诊时间'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'visitInpatientOrgId': {
        'type': 'string',
        'description': '就诊入院机构id'
      },
      'visitInpatientOrgName': {
        'type': 'string',
        'description': '就诊入院机构名称'
      },
      'visitInpatientTenantSubjectName': {
        'type': 'string',
        'description': '就诊入院科室名称'
      },
      'visitSerialNumber': {
        'type': 'string',
        'description': '诊断流水号'
      },
      'visitSerialTypeCode': {
        'type': 'string',
        'description': '诊断类型码'
      },
      'visitTypeCode': {
        'type': 'string',
        'description': '就诊类型代码'
      },
      'visitTypeName': {
        'type': 'string',
        'description': '就诊类型名称'
      }
    }
  },
  '问诊信息': {
    'type': 'object',
    'properties': {
      'affectedPartPicture': {
        'type': 'string',
        'description': '患处图片'
      },
      'answerTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '回答时间'
      },
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'diagnosis': {
        'type': 'string',
        'description': '诊断'
      },
      'diagnosisTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '诊断时间'
      },
      'diseaseDescription': {
        'type': 'string',
        'description': '病情描述'
      },
      'doctorId': {
        'type': 'string',
        'description': '医生id'
      },
      'doctorName': {
        'type': 'string',
        'description': '医生姓名'
      },
      'inquiryFinishTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '问诊完成时间'
      },
      'inquiryPrice': {
        'type': 'number',
        'description': '问诊价格'
      },
      'inquiryStatus': {
        'type': 'string',
        'description': '问诊状态'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'md5': {
        'type': 'string',
        'description': 'md5'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'orderNo': {
        'type': 'string',
        'description': '订单号'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'orgName': {
        'type': 'string',
        'description': '机构名称'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientInfo': {
        'type': 'string',
        'description': '患者信息json'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientVisitId': {
        'type': 'string',
        'description': '患者问诊信息id'
      },
      'paymentTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '支付时间'
      },
      'refundTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '退费时间'
      },
      'serviceId': {
        'type': 'string',
        'description': '服务id'
      },
      'serviceItems': {
        'type': 'string',
        'description': '服务项json'
      },
      'serviceName': {
        'type': 'string',
        'description': '服务名称'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'visitSerialNumber': {
        'type': 'string',
        'description': '就诊流水号'
      },
      'visitSerialTypeCode': {
        'type': 'string',
        'description': '就诊类型'
      }
    }
  },
  '体征信息': {
    'type': 'object',
    'properties': {
      'admissionTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '入院日期时间'
      },
      'afterSurgeryOrChildbirthDays': {
        'type': 'number',
        'description': '手术或分娩后天数'
      },
      'bodyTemperature': {
        'type': 'number',
        'description': '体温'
      },
      'childbirthTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '分娩时间'
      },
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'diagnoseCode': {
        'type': 'string',
        'description': '疾病诊断代码'
      },
      'diastolicPressure': {
        'type': 'string',
        'description': '舒张压'
      },
      'dischargeDate': {
        'type': 'string',
        'format': 'date-time',
        'description': '出院日期'
      },
      'diseaseObserveMeasure': {
        'type': 'string',
        'description': '病情观察与措施'
      },
      'emergencyTreatmentNo': {
        'type': 'string',
        'description': '急诊编号'
      },
      'headCircumference': {
        'type': 'number',
        'description': '头围'
      },
      'height': {
        'type': 'string',
        'description': '身高'
      },
      'hospitalizedNumber': {
        'type': 'string',
        'description': '住院流水号'
      },
      'inpatientNumber': {
        'type': 'string',
        'description': '住院号'
      },
      'intakeName': {
        'type': 'string',
        'description': '入量名称'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'medicalRecordCreatorId': {
        'type': 'string',
        'description': '创建病历医生护士id'
      },
      'medicalRecordCreatorName': {
        'type': 'string',
        'description': '创建病历医生护士名称'
      },
      'medicalRecordId': {
        'type': 'string',
        'description': '病历id'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'nurseSignName': {
        'type': 'string',
        'description': '护士签名'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'outpatientNumber': {
        'type': 'string',
        'description': '门诊编号'
      },
      'outpatientSerialNumber': {
        'type': 'string',
        'description': '门诊流水号'
      },
      'outputCode': {
        'type': 'string',
        'description': '出量代码'
      },
      'outputName': {
        'type': 'string',
        'description': '出量名称'
      },
      'pacemakerHeartRate': {
        'type': 'string',
        'description': '起搏器心率'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'patientSignId': {
        'type': 'string',
        'description': '患者体征信息id'
      },
      'preparation': {
        'type': 'string',
        'description': '备量'
      },
      'pulseRate': {
        'type': 'string',
        'description': '脉率'
      },
      'realHospitalStayDayNum': {
        'type': 'number',
        'description': '实际住院天数'
      },
      'realInputHospitalStayDayNum': {
        'type': 'string',
        'description': '实入量'
      },
      'recordTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '记录日期时间'
      },
      'respiratoryFrequency': {
        'type': 'string',
        'description': '呼吸频率'
      },
      'signatureTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '签名日期时间'
      },
      'storeLargeData': {
        'type': 'string',
        'description': '存入大数据量'
      },
      'surgeryTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '手术时间'
      },
      'systolicPressure': {
        'type': 'string',
        'description': '收缩压'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'treatmentOrgCode': {
        'type': 'string',
        'description': '医疗机构代码'
      },
      'treatmentOrgName': {
        'type': 'string',
        'description': '医疗机构名称'
      },
      'useBreathingMachineId': {
        'type': 'string',
        'description': '使用呼吸机标志'
      },
      'visitInpatientSerialNumber': {
        'type': 'string',
        'description': '就诊或者住院流水号'
      },
      'visitTypeCode': {
        'type': 'string',
        'description': '就诊类型代码'
      },
      'visitTypeName': {
        'type': 'string',
        'description': '就诊类型名称'
      },
      'waistCircumference': {
        'type': 'string',
        'description': '腹围'
      },
      'weight': {
        'type': 'number',
        'description': '体重'
      },
      'writeMedicalSubjectId': {
        'type': 'string',
        'description': '写病历科室id'
      },
      'writeMedicalSubjectName': {
        'type': 'string',
        'description': '写病历科室名称'
      }
    }
  },
  '过敏信息': {
    'type': 'object',
    'properties': {
      'allergenSourceCode': {
        'type': 'string',
        'description': '过敏源代码'
      },
      'allergenSourceName': {
        'type': 'string',
        'description': '过敏源名称'
      },
      'allergenTypeCode': {
        'type': 'string',
        'description': '过敏类型代码'
      },
      'allergenTypeName': {
        'type': 'string',
        'description': '过敏类型名称'
      },
      'allergenValue': {
        'type': 'string',
        'description': '该字段对应的值'
      },
      'allergyReaction': {
        'type': 'string',
        'description': '过敏反应'
      },
      'allergyRemark': {
        'type': 'string',
        'description': '过敏备注'
      },
      'createTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '创建时间'
      },
      'creatorId': {
        'type': 'string',
        'description': '创建人id'
      },
      'creatorName': {
        'type': 'string',
        'description': '创建人名称'
      },
      'doctorId': {
        'type': 'string',
        'description': '医生id'
      },
      'doctorName': {
        'type': 'string',
        'description': '医生姓名'
      },
      'findAllergyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '发现过敏时间'
      },
      'isDeleted': {
        'type': 'integer',
        'format': 'int32',
        'description': '是否删除。0，否；1，是'
      },
      'medicalRecordCreateTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '病历记录时间'
      },
      'medicalRecordDataId': {
        'type': 'string',
        'description': '病历数据id'
      },
      'medicalRecordInstanceId': {
        'type': 'string',
        'description': '病历实例id'
      },
      'modifyTime': {
        'type': 'string',
        'format': 'date-time',
        'description': '更新时间'
      },
      'modifyUserId': {
        'type': 'string',
        'description': '修改人id'
      },
      'modifyUserName': {
        'type': 'string',
        'description': '修改人名称'
      },
      'orgCode': {
        'type': 'string',
        'description': '机构代码'
      },
      'orgId': {
        'type': 'string',
        'description': '机构id'
      },
      'orgName': {
        'type': 'string',
        'description': '机构名称'
      },
      'patientAllergenId': {
        'type': 'string',
        'description': '患者过敏信息id'
      },
      'patientId': {
        'type': 'string',
        'description': '患者id'
      },
      'patientName': {
        'type': 'string',
        'description': '患者姓名'
      },
      'patientNumber': {
        'type': 'string',
        'description': '患者档案号'
      },
      'tenantId': {
        'type': 'string',
        'description': '租户id'
      },
      'tenantName': {
        'type': 'string',
        'description': '租户名称'
      },
      'tenantSubjectId': {
        'type': 'string',
        'description': '集团科室id'
      },
      'tenantSubjectName': {
        'type': 'string',
        'description': '集团科室名称'
      },
      'visitSerialNumber': {
        'type': 'string',
        'description': '就诊流水号'
      },
      'visitSerialTypeCode': {
        'type': 'string',
        'description': '就诊流水类型'
      }
    }
  },
}
