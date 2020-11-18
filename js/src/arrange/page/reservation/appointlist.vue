<template>
  <div id="appointlist">
    <div class="flex_column_1_hidden layout_inner">
      <appoint-list :operator="true" :type="1" :reset="reset" @edit="editAppoint">
        <el-button type="primary" class="ml10" @click="addAppoint">添加预约</el-button>
        <el-button type="" class="ml10" @click="showRemarks=true">备注管理</el-button>
      </appoint-list>
      <add-appoint :show.sync="showAddAppoint" :init="init" @success="appointSuccess"></add-appoint>
      <remarks-list :show.sync="showRemarks"></remarks-list>
      <send-message ref="sendmessage" :users="sendPatient" :disabled="true" :allparams="allparams"></send-message>
    </div>
  </div>
</template>
<script>
  import appointList from '@/arrange/page/register/dialog-appointlist.vue'
  import remarksList from '@/arrange/page/register/dialog-remarks.vue'
  import addAppoint from '@/arrange/page/register/addappoint.vue'
  import sendMessage from '@/crm/page/sendmessage'
  export default {
    data () {
      return {
        init: '',
        reset: '',
        sendPatient: '',
        showAddAppoint: false,
        showRemarks: false,
        allparams: {}
      }
    },
    methods: {
      addAppoint () {
        this.init = ''
        this.showAddAppoint = true
      },
      editAppoint (val) {
        this.init = val
        this.showAddAppoint = true
      },
      appointSuccess (val) {
        this.showAddAppoint = false
        this.reset = new Date().getTime()
      }
    },
    created () {
      this.$bus.$on('form:handMessage', v => {
        this.allparams = v
        this.allparams.msgType = 108
        if (this.$refs.sendmessage && this.$refs.sendmessage.sendVisible !== undefined) {
          this.$refs.sendmessage.sendVisible = true
        }
      })
    },
    components: {
      appointList,
      remarksList,
      addAppoint,
      sendMessage
    }
  }
</script>
<style scoped>
  #appointlist{margin-top: 0;}
</style>
