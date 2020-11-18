<template>
  <el-dialog :title="title" :visible.sync="visibleFlag" class="ui_dialog_02 spe">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="用法" prop="name"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="importUsage">导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '../../store/service.usage'
import sysvalue from '@/warehouse/store/sysvalueapi'
export default {
  props: ['title'],
  data () {
    return {
      tableData: [],
      code: 'CV06.00.102',
      visibleFlag: false,
      selectIds: []
    }
  },
  created () {
    // this.getUsageList()
  },
  methods: {
    async open () {
      await this.getUsageList()
      this.visibleFlag = true
    },
    close () {
      this.visibleFlag = false
    },
    async getUsageList () {
      const res = await Promise.all([sysvalue.listOnce(this.code), api.list()]).then(res => {
        let codes = res[0] || []
        let list = res[1].data || []
        let data = []
        if (!list.length) return codes
        let listObj = {}
        list.forEach(item => {
          listObj[item.usage] = true
        })
        codes.forEach(item => {
          if (!listObj[item.id]) {
            data.push(item)
          }
        })
        return data
      }).catch(() => {
        return []
      })
      if (res && res.length) {
        this.tableData = res
      } else {
        this.tableData = []
      }
    },
    handleSelectionChange (val) {
      this.selectIds = []
      if (val && val.length) {
        val.map(item => {
          if (item && item.id) {
            this.selectIds.push({ usage: item.id })
          }
        })
      }
    },
    async importUsage () {
      if (!this.selectIds || !this.selectIds.length) {
        return this.$messageTips(this, 'warning', '请选择要导入的用法', '提示')
      }
      const res = await api.importUsageAddtionList(this.selectIds)
      if (res && res.head && res.head.errCode === 0) {
        this.close()
        this.$emit('update')
        this.$messageTips(this, 'success', '导入成功', '成功')
      }
    }
  },
  watch: {
    code () {
      this.getUsageList()
    }
  }
}
</script>
