import { basePrefix as prefix } from '@/util/urls.base'

const urlMap = {
  // 短信管理
  msg: {
    msgTemplate: {
      getTemplatelist: { url: 'msg/template/list', prefix: prefix.extend },
      getTemplateById: { url: 'msg/template/getById', prefix: prefix.extend },
      deleteTemplate: { url: 'msg/template/delete', prefix: prefix.extend },
      createOrUpdate: { url: 'msg/template/save', prefix: prefix.extend },
      getTypeList: { url: 'msg/template/type/list', prefix: prefix.extend }, // 获取机构下所有模版分类
      setApplyRange: { url: 'msg/template/setApplyRange', prefix: prefix.extend }, // 批量设置机构科室
      getTemplateListByDept: { url: 'msg/template/org/list', prefix: prefix.extend }, // 查询机构科室下面的短信模板
    },
    sms: {
      getRecordList: { url: 'msg/sms/sendhis/list', prefix: prefix.extend }, // 获取短信列表
      setDayMaxSend: { url: 'msg/sms/config/setDayMaxSend', prefix: prefix.extend }, // 设置发送短信的最大数量
      getDayMaxSend: { url: 'msg/sms/config/getDayMaxSend', prefix: prefix.extend }, // 获取可以发送短信的最大数量
      setMsgManual: { url: 'msg/sms/send/manual', prefix: prefix.extend }, // 手动发短信
    },
    notice: {
      getUnReadList: { url: 'msg/doctor/notice/getUnReadList', isStatic: false, prefix: prefix.extend }, // 获取未读消息列表
      read: { url: 'msg/doctor/notice/read', prefix: prefix.extend }, // 点击消息，已读接口
      search: { url: 'msg/doctor/notice/search', isStatic: false, prefix: prefix.extend }, // 查询列表
      getById: { url: 'msg/doctor/notice/getById', isStatic: false, prefix: prefix.extend }, // 查询某一条消息
    }
  }
}

export default urlMap
