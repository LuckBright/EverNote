<template>
  <el-menu
    :default-active="active"
    class="el-menu-vertical-demo"
    :unique-opened="true"
    :router="true">
    <el-menu-item index="/demo">demo</el-menu-item>
    <el-menu-item index="/demo/layout/rightclkdemo">右击组件</el-menu-item>
    <el-menu-item index="/demo/layout/basecommonheaddemo">患者信息头</el-menu-item>
    <el-menu-item index="/demo/layout/address">Address 地区选择</el-menu-item>
    <el-menu-item index="/demo/layout/agedemo">Age 年龄</el-menu-item>
    <el-menu-item index="/demo/layout/slidewindowdemo">Slidewindow 飘窗</el-menu-item>
    <el-menu-item index="/demo/layout/systypedemo">Systype 值集选择</el-menu-item>
    <el-menu-item index="/demo/layout/evertable">EverTable 表格</el-menu-item>
    <el-menu-item index="/demo/layout/form">ever 表单</el-menu-item>
    <el-menu-item index="/demo/layout/breadcrumbdemo">breadCrumb 面包屑返回</el-menu-item>
    <el-menu-item index="/demo/layout/uploaddemo">ever-upload 上传</el-menu-item>
    <el-menu-item index="/demo/layout/downloaddemo">doc-download 下载</el-menu-item>
    <el-menu-item index="/demo/layout/basesubjectselectdemo">EverSubjectSelect 科室选择器</el-menu-item>
    <el-menu-item index="/demo/layout/baseorgselectdemo">EverOrgSelect 机构选择器</el-menu-item>
    <el-menu-item index="/demo/layout/basestaffselectdemo">EverStaffSelect 人员选择器</el-menu-item>
    <el-menu-item index="/demo/layout/basespacedemo">EverRoomSelect 空间管理选择器</el-menu-item>
    <el-menu-item index="/demo/layout/bus">bus 通信demo</el-menu-item>
    <el-menu-item index="/demo/layout/date">ElDatePicker 日期</el-menu-item>
    <el-menu-item index="/demo/layout/patientselect">patientselect 患者搜索</el-menu-item>
    <el-menu-item index="/demo/layout/idcardreaddemo">idcardreaddemo 读取身份证获取数据</el-menu-item>
    <el-menu-item index="/demo/layout/iccardreaddemo">iccardreaddemo 读取社保卡获取数据</el-menu-item>
    <el-menu-item index="/demo/layout/pagerdemo">EverPagination 翻页</el-menu-item>
    <el-menu-item index="/demo/layout/contacts">contacts 联系人</el-menu-item>
    <el-menu-item index="/demo/layout/filters">filters 数据格式化方法</el-menu-item>
    <el-menu-item index="/demo/layout/userauthorize">userauthorize 用户授权方法</el-menu-item>
    <el-menu-item index="/demo/layout/sendmsgdemo">sendMessage2 发送短信</el-menu-item>
    <el-menu-item index="/demo/layout/reportdialogdemo">reportCard 查看报告</el-menu-item>
    <el-menu-item index="/demo/layout/reportdemo">reportViewIframe 帆软统计报表</el-menu-item>
    <el-menu-item index="/demo/layout/processflowdemo">approvalFlows 审批流</el-menu-item>
    <el-menu-item index="/demo/layout/phrplugin">phrplugin 患者phr</el-menu-item>
    <el-menu-item index="/demo/layout/editordemo">everEditor 富文本编辑器</el-menu-item>
    <el-menu-item index="/demo/layout/print">打印</el-menu-item>
    <el-menu-item index="/demo/layout/medicalrecordplugin">medicalRecordPlugin 病历</el-menu-item>
    <el-menu-item index="/demo/layout/confirmdemo">everConfirm 二次确认</el-menu-item>
    <el-menu-item index="/demo/layout/nodatademo">everNoData 数据为空</el-menu-item>
    <el-menu-item index="/demo/layout/numberdemo">everNumber 数字</el-menu-item>
    <el-menu-item index="/demo/layout/exportsqldemo">everExportSql 导出sql</el-menu-item>
    <el-menu-item index="/demo/layout/icondemo">icon 图标</el-menu-item>
    <el-menu-item index="/demo/layout/agedemo">age 年龄</el-menu-item>
    <el-menu-item index="/demo/layout/mapdemo">map 地图</el-menu-item>
    <el-menu-item index="/demo/layout/i18ndemo">i18ndemo 多语言</el-menu-item>

    <el-menu-item index="/demo/layout/dialog">elDialog 弹窗</el-menu-item>
    <el-menu-item index="/demo/layout/create">everform2 新建</el-menu-item>
    <el-menu-item index="/demo/layout/edit/1">everform2 编辑</el-menu-item>
    <el-menu-item index="/demo/layout/scroll">scroll 滚动加载</el-menu-item>
    <el-menu-item index="/demo/layout/schema">批量编辑开单属性</el-menu-item>
    <el-menu-item index="/demo/layout/helpdemo">帮助中心</el-menu-item>
  </el-menu>
</template>
<script>
export default {
  data () {
    return {
      active: '/demo'
    }
  },
  watch: {
    '$route': {
      handler (val) {
        this.active = val.path
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="less">
.el-menu-item{height:40px;line-height:40px; font-size: 14px}
</style>
