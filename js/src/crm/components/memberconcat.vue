<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="ui_dialog_02">
    <div id="userselect">
      <el-row>
        <el-col :span="24">
          <p class="tips"><span class="tipspan"><i class="iconfont icon-menzhen-jingshi mgr10"></i>此功能建议仅在客户姓名或证件号码录入错误时使用，请谨慎使用</span></p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-input class="cInput" placeholder="客户编号(错误)" v-model="relateSn"></el-input>
          <span class="mgside20">关联到</span>
          <el-input class="cInput" placeholder="客户编号(正确)" v-model="sn"></el-input>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="saveSelectVal">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import api from '../store/empiapi'
  export default {
    props: ['initdata', 'title', 'visible', 'patientId'],
    data () {
      return {
        api: api,
        sn: '',
        relateSn: '',
        dialogVisible: false
      }
    },
    watch: {
      visible (val) {
        this.dialogVisible = val
      },
      dialogVisible (val) {
        this.$emit('update', val)
      }
    },
    created () {
    },
    methods: {
      closeEvent () {
        this.$emit('close', false)
      },
      saveSelectVal () {
        let obj = {}
        obj['sn'] = this.sn
        obj['relateSn'] = this.relateSn
        this.api.forceRelate(obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.$notify({
              type: 'success',
              message: '关联成功'
            })
            this.$emit('close', false)
          }
        })
      }
    }
  }
</script>
<style scoped>
  .tips{background: rgba(255,156,0,0.10);height:34px;}
  .tipspan{margin-top:10px;margin-left:20px;height:20px;float:left;color:#FF9C00;}
  .mgr10{margin-right:10px;}
  .mgside20{margin:0px 20px;}
  .cInput{width:290px;}
</style>
