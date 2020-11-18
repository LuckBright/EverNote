<template>
  <el-dialog :title="title" :visible.sync="visibleFlag" class="ui_dialog_02 spe">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column label="煎法" prop="name"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="importUsage">导入</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from '@/sob/store/surcharge'
import sysvalue from '@/warehouse/store/sysvalueapi'
export default {
  props: ['title'],
  data () {
    return {
      tableData: [],
      code: 'THC_SYS_DECOCTION_OF_TCM',
      visibleFlag: false,
      selectIds: []
    }
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
      const res = await Promise.all([sysvalue.listOnce(this.code), api.getDecoctsList()]).then(res => {
        let codes = res[0] || []
        let list = res[1].data || []
        let data = []
        if (!list.length) return codes
        let listObj = {}
        list.forEach(item => {
          listObj[item.code] = true
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
            this.selectIds.push({
              code: item.id,
              decoct_name: item.name
            })
          }
        })
      }
    },
    async importUsage () {
      if (!this.selectIds || !this.selectIds.length) {
        return this.$messageTips(this, 'warning', '请选择要导入的煎法', '提示')
      }
      const res = await api.saveDecoctsBatch(this.selectIds)
      if (res) {
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
