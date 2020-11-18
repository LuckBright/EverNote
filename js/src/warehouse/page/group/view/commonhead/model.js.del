// import { tableColWidth } from '@/util/table-config'
// import { listDestValue } from '@/util/common'
// export const statusList = [
//   {
//     id: 1,
//     name: '启用'
//   },
//   {
//     id: 0,
//     name: '禁用'
//   },
// ]
// export const typeList = [
//   {
//     id: 1,
//     name: '文本'
//   },
//   {
//     id: 2,
//     name: '自定义'
//   },
// ]
// export const fontSizeList = [
//   {
//     id: '12px',
//     name: '12px',
//   },
//   {
//     id: '14px',
//     name: '14px',
//   },
//   {
//     id: '16px',
//     name: '16px',
//   },
//   {
//     id: '18px',
//     name: '18px',
//   },
// ]
// export const fontFamilyList = [
//   {
//     id: 'PingFangSC-Regular',
//     name: 'PingFangSC-Regular',
//   },
//   {
//     id: '宋体',
//     name: '宋体',
//   },
//   {
//     id: '黑体',
//     name: '黑体',
//   },
//   {
//     id: '微软雅黑',
//     name: '微软雅黑',
//   },
// ]
// export const iconPositionList = [
//   {
//     id: 1,
//     name: '标签左边',
//   },
//   {
//     id: 2,
//     name: '值右边',
//   },
//   {
//     id: 3,
//     name: '标签右边',
//   },
//   {
//     id: 4,
//     name: '值左边',
//   },
// ]
// const predefineColors = [
//   '#68C899',
//   '#1C7BEF',
//   '#FAAD14',
//   '#EE4433',
//   '#999999', // label 颜色
//   '#151515', // value 颜色
// ]
// export const headerConfigColumns = [
//   {
//     prop: 'op',
//     label: '操作',
//     width: 150,
//     type: 'btns',
//     btns: ['edit', 'del']
//   },
//   {
//     prop: 'sourceTypeName',
//     label: '业务模块',
//   },
//   {
//     prop: 'type',
//     label: '分类',
//     formatter ({value}) {
//       return listDestValue(typeList, value)
//     }
//   },
//   {
//     prop: 'paramKey',
//     label: '关键字',
//   },
//   {
//     prop: 'paramValue',
//     label: '配置名称',
//   },
//   {
//     prop: 'displayName',
//     label: '显示名称',
//   },
//   {
//     prop: 'isShowName',
//     label: '只显示值',
//     formatter ({value}) {
//       return value === 1 ? '是' : '否'
//     }
//   },
//   {
//     prop: 'fontFamily',
//     label: '字体',
//   },
//   {
//     prop: 'fontSize',
//     label: '字号',
//   },
//   {
//     prop: 'labelColor',
//     label: '标签颜色',
//   },
//   {
//     prop: 'valueColor',
//     label: '值颜色',
//   },
//   {
//     prop: 'fontWeight',
//     label: '加粗',
//     formatter ({value}) {
//       return value ? '是' : '否'
//     }
//   },
//   {
//     prop: 'icon',
//     label: '图标',
//   },
//   {
//     prop: 'iconPosition',
//     label: '图标位置',
//     formatter ({value}) {
//       return listDestValue(iconPositionList, value)
//     }
//   },
//   {
//     prop: 'creatorName',
//     label: '操作人',
//   },
//   {
//     prop: 'status',
//     label: '启用',
//     formatter ({value}) {
//       return value === 1 ? '是' : '否'
//     }
//   },
//   {
//     prop: 'createTime',
//     label: '时间',
//     width: tableColWidth.dateW105,
//     formatter ({value}) {
//       return value ? value.slice(0, 10) : ''
//     }
//   },
//   {
//     prop: 'comment',
//     label: '备注',
//   },
// ]
// export const schema = [
//   {
//     name: 'source',
//     label: '业务模块',
//     comp: 'sys-type',
//     props: {
//       disabled: false,
//       code: 'THC_SYS_PROJECT',
//       useObject: true,
//       objSimple: true,
//       // filtercodes: ['03.02', '03.03', '03.04', '03.05']
//     },
//     span: 12,
//   },
//   {
//     name: 'type',
//     label: '分类',
//     comp: 'select',
//     parentClass: 'w',
//     props: {
//       options: typeList,
//       disabled: false,
//     },
//     span: 12,
//   },
//   {
//     name: 'componentName',
//     label: '自定义组件名称',
//     parentClass: '',
//     props: {
//       disabled: false,
//     },
//     span: 12,
//   },
//   {
//     name: 'paramKey',
//     label: '关键字',
//     props: {
//       disabled: false,
//     },
//     span: 12,
//   },
//   {
//     name: 'paramValue',
//     label: '配置名称',
//     span: 12,
//   },
//   {
//     name: 'displayName',
//     label: '显示名称',
//     span: 12,
//   },
//   {
//     name: 'isShowName',
//     label: '只显示值',
//     comp: 'el-switch',
//     span: 12,
//   },
//   {
//     name: 'fontSize',
//     label: '字号',
//     comp: 'select',
//     parentClass: 'w',
//     props: {
//       options: fontSizeList
//     },
//     span: 12,
//   },
//   {
//     name: 'fontFamily',
//     label: '字体',
//     comp: 'select',
//     parentClass: 'w',
//     props: {
//       options: fontFamilyList
//     },
//     span: 12,
//   },
//   {
//     name: 'fontWeight',
//     label: '是否加粗',
//     comp: 'el-switch',
//     span: 12,
//   },
//   {
//     name: 'labelColor',
//     label: '标签颜色',
//     comp: 'el-color-picker',
//     props: {
//       predefine: predefineColors,
//     },
//     span: 12,
//   },
//   {
//     name: 'valueColor',
//     label: '值颜色',
//     comp: 'el-color-picker',
//     props: {
//       predefine: predefineColors,
//     },
//     span: 12,
//   },
//   {
//     name: 'backgroundColor',
//     label: '背景颜色',
//     comp: 'el-color-picker',
//     props: {
//       predefine: predefineColors,
//     },
//     span: 12,
//   },
//   {
//     name: 'icon',
//     label: '图标',
//     span: 12,
//   },
//   {
//     name: 'iconPosition',
//     label: '图标位置',
//     comp: 'select',
//     parentClass: 'w',
//     props: {
//       options: iconPositionList
//     },
//     span: 12,
//   },
//   {
//     name: 'comment',
//     label: '备注信息',
//     span: 12,
//   },
//   {
//     name: 'status',
//     label: '状态',
//     comp: 'select',
//     parentClass: 'w',
//     props: {
//       options: statusList
//     },
//     span: 12,
//   },
// ]
// export const rules = {
//   source: [
//     { required: true, message: '必填项', trigger: 'change' }
//   ],
//   type: [
//     { required: true, message: '必填项', trigger: 'change' }
//   ],
//   componentName: [
//     { required: true, message: '必填项', trigger: 'change' }
//   ],
//   paramKey: [
//     { required: true, message: '必填项', trigger: 'change' }
//   ],
//   paramValue: [
//     { required: true, message: '必填项', trigger: 'change' }
//   ],
//   displayName: [
//     { required: true, message: '必填项', trigger: 'change' }
//   ],
// }
// export const stationConfigColumns = [
//   {
//     prop: 'code',
//     label: '工作站编号',
//   },
//   {
//     prop: 'name',
//     label: '工作站名称',
//   },
//   {
//     prop: 'creatorName',
//     label: '创建人',
//   },
//   {
//     prop: 'createTime',
//     label: '生效时间',
//   },
//   {
//     prop: 'updaterName',
//     label: '修改人',
//   },
//   {
//     prop: 'isOpen',
//     label: '折叠/展开',
//     slot: 'isOpen',
//     slotHeader: 'isOpenHeader',
//   },
//   {
//     prop: 'updateTime',
//     label: '修改时间',
//   },
//   {
//     prop: 'op',
//     label: '操作',
//     type: 'btns',
//     btns: ['edit', 'del'],
//   },
// ]
// export const stationSchema = []
// export const stationRules = {}
// export const querySchema = [
//   {
//     name: 'station',
//     label: '选择工作站',
//     comp: 'select',
//     parentClass: 'w',
//     props: {
//       options: []
//     },
//     span: 12,
//   },
// ]
//
// export function groupListToObjList (list, groupedOptions = {
//   key: 'sourceTypeName',
//   labelKey: 'paramValue', // 用于展示出来的属性
//   flagKey: 'isSeparate', // 用于判断是否为 分隔数据
//   uKey: 'id', // 唯一标识
// }) {
//   // 根据类型，找到该类型在resultList中最后一次出现的位置
//   // const getSpliceIndex = (resultList, type) => {
//   //
//   // }
//   const result = []
//   list.forEach((item, index) => {
//     // 若这一项所在的分类已经被录入到result中了，这将这一项 插入到该分类的最后一项后边
//     const existItem = result.find(res => res[groupedOptions.labelKey] === item[groupedOptions.key] && res[groupedOptions.flagKey])
//     if (existItem) {
//       result.push(item)
//       // result.splice(getSpliceIndex(result, item[groupedOptions.key], 0, item))
//     } else {
//       // 将 "分隔数据" 添加到 数组中
//       result.push({
//         [groupedOptions.labelKey]: item[groupedOptions.key], // 分隔数据显示的值 例如 分类
//         [groupedOptions.flagKey]: true,
//         [groupedOptions.uKey]: (item[groupedOptions.uKey] || '') + index,
//       }, {...item, isFirst: true})
//     }
//   })
//   return result
// }
