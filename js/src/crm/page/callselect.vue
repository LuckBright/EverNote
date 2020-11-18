<template>
  <el-dialog title="选择通话记录" :visible.sync="dialogVisible" class="ui_dialog_02">
    <div id="userselect" class="mb20">
      <el-table
        :data="tableData"
        @selection-change="setSelectData"
        @current-change="setCurrentData"
        ref="selectCallTable"
        row-key="id"
        max-height="387"
        height="387"
        class="mb20"
        highlight-current-row
        border
      >
        <el-table-column type="selection" reserve-selection width="50" v-if="!isradio"></el-table-column>
        <el-table-column v-if="isradio" width="55" align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.row" v-model="radioed">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="sn" label="记录编号" width="120"></el-table-column>
        <el-table-column prop="patientName" label="客户姓名" width="150"></el-table-column>
        <el-table-column prop="calling" label="被叫号码" width="160" align="center"></el-table-column>
        <el-table-column prop="createTime" label="通话时间" width="180" align="center"></el-table-column>
        <el-table-column label="通话时长" width="120" align="center">
          <template slot-scope="scope">{{scope.row.duration ? scope.row.duration + '秒' : '无'}}</template>
        </el-table-column>
        <el-table-column label="试听录音" min-width="180">
          <template slot-scope="scope">
            <audio :src="scope.row.url" controls="controls" v-if="scope.row.url">不支持 audio</audio>
            <span v-else>无</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeEvent">取消</el-button>
      <el-button type="primary" @click="saveSelectVal">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '../store/callapi'

export default {
  props: ['initdata', 'isradio', 'patientId', 'visible'],
  data () {
    return {
      api: api,
      selected: [],
      radioed: '',
      tableData: [],
      dialogVisible: false
    }
  },
  watch: {
    radioed (val) {
      this.selected = [val]
    },
    visible (val) {
      this.dialogVisible = val
      return val && this.api.getUserCall({
        patientId: this.patientId,
        type: 1
      }).then(rs => {
        this.tableData = rs.data
        if (rs.data) {
          this.radioed = rs.data.filter(item => {
            return item.id === this.initdata.id
          })[0]
        }
      })
    },
    dialogVisible (val) {
      this.$emit('update', val)
    }
  },
  created () {
    if (this.isradio) {
      this.radioed = this.initdata
    } else {
      this.selected = this.initdata || []
    }
  },
  methods: {
    closeEvent () {
      this.$emit('update', false)
      this.closeAudio()
    },
    saveSelectVal () {
      if (this.selected[0]) {
        this.$emit('select', this.selected)
        this.$emit('update')
        this.closeAudio()
      } else {
        this.$messageTips(this, 'error', '警告：请选择一段录音或者取消')
      }
    },
    setSelectData (val) {
      this.selected = val
    },
    setCurrentData (val) {
      if (val) {
        this.radioed = val
        this.selected = [val]
      }
    },
    closeAudio () {
      let audios = this.$refs.selectCallTable.$el.getElementsByTagName('audio')
      for (let i = 0; i < audios.length; i++) {
        audios[i].pause()
      }
    }
  }
}
</script>
<style scoped>
#userselect .el-form {
  margin-left: -15px;
}
#userselect .el-form .el-form-item {
  margin-right: 0;
  margin-left: 15px;
}
#userselect .el-table td,
#userselect .el-table th {
  line-height: initial;
}
</style>
