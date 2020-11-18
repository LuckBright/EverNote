<template>
  <div class="search_tableList">
    <ever-form2
      class="input-style"
      :schema="schema"
      v-model="searchObj"
      labelWidth="70px"
      ref="form"
    >
      <template slot="default">
        <el-button
          style="margin-left: 70px"
          type="primary"
          icon="el-icon-search"
          @click="searchListClick"
        >查询</el-button>
        <el-button icon="el-icon-refresh" @click="clearSearch">重置</el-button>
        <el-button class="allAdoptBtn" @click="getCount" v-if="isShowAllBtn">批量审核</el-button>
      </template>
    </ever-form2>
    <div class="tables">
      <el-tabs v-model="activeName" @tab-click="tabsClick">
        <el-tab-pane :label="tabsName.tab1" name="first">
          <table-and-page ref="noAdopt" @changePage="searchList" @changeRow="changeRow"></table-and-page>
        </el-tab-pane>
        <el-tab-pane :label="tabsName.tab2" name="second">
          <table-and-page ref="adopt" @changePage="searchList" @changeRow="changeRow"></table-and-page>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="isShowdialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <span class="dialogSpan">审核意见</span>
      <el-input
        type="textarea"
        :rows="5"
        maxlength="100"
        placeholder="请输入内容"
        v-model.trim="dialogValue"
      ></el-input>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="sendClick">批量审核</el-button>
        <el-button @click="isShowdialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableAndPage from './tableandpage'
import api from '@/titancare/api/operation'
let schema = [
  {
    name: 'patientName',
    label: '患者信息',
    comp: 'text',
    props: {
      placeholder: '请输入患者姓名'
    }
  },
  {
    name: 'createDate',
    label: '开方日期',
    comp: 'el-date-picker',
    props: {
      type: 'date',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'orderDoctorSignature',
    label: '开方医生',
    comp: 'text',
    props: {
      placeholder: '请输入开方医生'
    }
  }
]
export default {
  components: {
    tableAndPage
  },
  props: ['tabsName', 'isShowAllBtn'],
  data () {
    let searchObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      searchObj,
      schema,
      activeName: 'first',
      auditStatus: 0,
      isShowdialog: false,
      title: '',
      dialogValue: '',
      dispensing: null
    }
  },
  mounted () {
    this.searchListClick()
    this.dispensing = this.tabsName.tab1 === '待发药'
  },
  methods: {
    clearSearch () {
      this.$refs.form.resetForm()
      this.$refs.noAdopt.tableData = []
      this.$refs.noAdopt.total = 0
      this.$refs.adopt.tableData = []
      this.$refs.adopt.total = 0
      this.searchList()
    },
    searchList () {
      this.$emit('changeRow', '')
      if (this.auditStatus) {
        this.$refs.adopt.searchList(this.searchObj, this.auditStatus, this.dispensing)
      } else {
        this.$refs.noAdopt.searchList(this.searchObj, this.auditStatus, this.dispensing)
      }
      this.$emit('rowId')
    },
    tabsClick (val) {
      this.auditStatus = val.label === this.tabsName.tab1 ? 0 : 1
      this.auditStatus === 0 ? this.$refs.noAdopt.searchList(this.searchObj, 0, this.dispensing)
        : this.$refs.adopt.searchList(this.searchObj, 1, this.dispensing)
      this.$emit('changeShow', Boolean(this.auditStatus))
    },
    searchListClick () {
      this.$refs.noAdopt.offset = 1
      this.$refs.adopt.offset = 1
      this.searchList()
    },
    changeRow (row) {
      this.$emit('changeRow', row)
    },
    getCount () {
      api.getUnAuditCount().then(res => {
        if (!res.errCode) {
          this.title = '批量审批-批量审核当前' + res.data + '个待审核处方'
          this.isShowdialog = true
        } else {
          this.$notify({
            title: '警告',
            message: '没有待审核',
            type: 'warning'
          })
        }
      })
    },
    sendClick () {
      let params = {
        platformAccountId: '',
        auditOpinion: this.dialogValue,
        auditStatus: 0,
        recipeOrderId: '',
        thcDoctor: {
          thcDoctorId: localStorage.getItem('USERID'),
          thcDoctorName: localStorage.getItem('USERNAMECARE')
        }
      }
      api.setBatchAuditPass(params).then(res => {
        if (!res.errCode) {
          this.$notify({
            title: '成功',
            message: '审核成功',
            type: 'success'
          })
          this.searchListClick()
          this.isShowdialog = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.search_tableList {
  width: 450px;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  .input-style {
    width: 95%;
    margin-bottom: 20px;
  }
  .input-style /deep/ .el-date-editor.el-input,
  .input-style /deep/ .el-select {
    width: 100%;
  }
  .dialogSpan {
    display: inline-block;
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
  }
  /deep/ .el-dialog__wrapper .el-dialog {
    width: 400px;
  }
}
</style>
