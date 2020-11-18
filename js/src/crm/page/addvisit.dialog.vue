<template>
  <el-dialog title="添加随访" :visible.sync="dialog" @close="closeDialog"  id="addvisit" class="ui_dialog_02">
    dialog 添加随访。。。。
  </el-dialog>
</template>
<script>
  import api from '../store/memberactivityapi'
  export default {
    data () {
      return {
        api: api,
        dialog: false,
        errMsg: false,
        tableData: [],
        selected: '',
        initUpdateVal: ''
      }
    },
    watch: {
      dialog (val) {
        val && this.getClassList()
      }
    },
    methods: {
      getClassList () {
        this.api.list().then(rs => {
          rs.data.resultList.length > 0 && rs.data.resultList.forEach(item => {
            item.isUpdate = false
          })
          this.tableData = rs.data.resultList
        })
      },
      inputFocus () {
        this.errMsg = false
      },
      addClassItem () {
        this.tableData.unshift({name: '', number: 0, isUpdate: true})
      },
      updateClassItem (val) {
        this.initUpdateVal = val.name
        val.isUpdate = true
      },
      cancelClassItem (i) {
        this.tableData[i].isUpdate = false
        this.tableData[i].name = this.initUpdateVal
        this.errMsg = false
        if (!this.tableData[i].id) {
          this.deleteClassItem(i)
        }
      },
      deleteClassItem (i, id) {
        if (id) {
          this.api.del({id: id}).then(rs => {
            if (rs.head.errCode === 0) {
              this.tableData.splice(i, 1)
            }
          })
        } else {
          this.tableData.splice(i, 1)
        }
      },
      saveClassItem (rs) {
        if (!rs.name) {
          this.errMsg = true
          return false
        }
        this.api.create(rs).then(rs => {
          this.dialog = false
        })
      },
      closeDialog () {
        this.$emit('close', false)
      }
    }
  }
</script>
