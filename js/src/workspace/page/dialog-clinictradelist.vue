<template>
  <el-dialog title="50日跨院就诊记录信息" :visible.sync="dialogTableVisible" class="ui_dialog_02" width="1000px" :append-to-body="true">
    <div class="trade-header" v-if="shareInfo">
      <el-row>
        <el-col :span="6" v-if="shareInfo.micode"><span>医疗机构编码：{{shareInfo.micode}}</span></el-col>
        <el-col :span="8"><span>社保号：{{cardNum}}</span></el-col>
        <el-col :span="10" v-if="shareInfo.serverdatetime"><span>中心端系统日期时间：{{shareInfo.serverdatetime}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><span>查询准许标识：{{Number(shareInfo.allowqueryflag) ? '是' : '否'}}</span></el-col>
        <el-col :span="10" v-if="shareInfo.signinfo"><span>签名信息：{{shareInfo.signinfo}}</span></el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" class="layout_box">
      <el-tab-pane label="原始交易信息" name="1">
        <tradelist-card :cardNum="this.cardNum"></tradelist-card>
      </el-tab-pane>
      <el-tab-pane label="药品明细信息" name="2">
        <druglist-card :cardNum="this.cardNum"></druglist-card>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import api from '../store/mainheaderapi'
  import tradelistCard from './tradelistcard'
  import druglistCard from './druglistcard'

  export default {
    props: ['icno'],
    data () {
      return {
        dialogTableVisible: false,
        activeName: '1',
        cardNum: '',
        api,
        shareInfo: ''
      }
    },
    methods: {
      open () {
        this.cardNum = this.icno
        this.dialogTableVisible = true
        this.shareInfo = ''
        api.getByIcon(this.icno).then(res => {
          if (res.head.errCode === 0 && res.data.length) {
            this.shareInfo = res.data[0]
          }
        })
      }
    },
    components: {
      tradelistCard,
      druglistCard
    }
  }
</script>
<!--增加了scoped   目前 .el-input-group__append input 样式影响了全局-->
<style scoped>
  .ui_dialog_02.custom .el-dialog .el-dialog__header span{font-size: 16px;font-weight: bold;}
  .ui_dialog_02.custom .el-dialog .el-dialog__header span i{font-size:14px;font-style: normal;color: #666;margin-left: 10px;font-weight: normal;}
  .ui_dialog_02.custom .el-dialog .el-dialog__body .el-form-item__content{text-align: left;}
  .ui_dialog_02.custom .el-dialog .el-dialog__body .el-col-10{width:95%;margin-left: -10px;}
  .ui_dialog_02.custom .el-dialog .el-dialog__body .el-col-10 .el-autocomplete{width:100%;}

  .ui_dialog_02.custom .el-dialog .el-dialog__body .readylyShow .el-col{line-height: 36px;margin-bottom: 5px;}
  .ui_dialog_02.custom .el-dialog .el-dialog__body .readylyShow label{display: inline-block; width:98px;text-align: right;}
  .ui_dialog_02.custom .el-dialog .el-dialog__body .readylyShow .contact{display: inline-block;vertical-align: top;}
  .ui_dialog_02.custom .el-dialog .el-dialog__body .readylyShow .contact p{margin:0;}
  .ui_dialog_02.custom .el-dialog .el-dialog__body .readylyShow .contact p span{margin-right: 15px;}
  .el-input-group__append input{width:200px;}
  .trade-header{ padding:20px; background-color: #eee; line-height: 1.5;}
  .trade-header span{ margin-right:50px;}
</style>
