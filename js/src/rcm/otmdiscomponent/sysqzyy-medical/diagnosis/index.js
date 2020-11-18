/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-24 15:10:19
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-24 18:44:01
 * 诊断信息维护表格
 */
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export const rules = {
  'visitNumber': [{ required: true, message: '必填项', trigger: 'blur' }],
  'diagnosisSeq': [{ required: true, message: '必填项', trigger: 'blur' }],
  'diagnosisDate': [{ required: true, message: '必填项', trigger: 'blur' }],
  'diagnosisInfomation': [{ required: true, message: '必填项', trigger: 'change' }],
}
export const schema = [
  {
    name: 'registerId',
    label: '就诊登记ID',
    span: 9,
    props: {
      disabled: true,
    },
    isMaintain: true
  },
  {
    name: 'visitNumber',
    label: '就诊流水号',
    span: 9,
    props: {
      disabled: true,
    },
    isMaintain: true
  },
  {
    name: 'rowCustom',
    span: 24,
    comp: 'custom',
    parentClass: 'noMargin',
    isRow: true
  },
  {
    name: 'diagnosisInfomation',
    label: '诊断信息',
    comp: () => import('@/rcm/otmdiscomponent/medicaldiagnose.vue'),
    props: {
      insuranceOrgId: sysqzyyCode
    },
    span: 9,
    isDynamic: true
  },
  {
    name: 'diagnosisDate',
    label: '诊断日期',
    comp: 'datePicker',
    props: {
      outformat: 'yyyyMMdd'
    },
    span: 9,
    isDynamic: true
  },
  {
    name: 'diagnosisSeq',
    comp: 'custom',
    label: '诊断顺序',
    span: 6,
    isMaintain: true,
    isDynamic: true
  },
  {
    name: 'desc',
    label: '症状描述',
    comp: 'textarea',
    props: {
      maxlength: 1000,
      showWordLimit: true
    },
    span: 24
  },
  {
    name: 'remark',
    label: '备注',
    comp: 'textarea',
    props: {
      maxlength: 100,
      showWordLimit: true
    },
    span: 24
  },
]
