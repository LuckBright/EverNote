<template>
  <el-dialog title="活动管理" :visible.sync="dialog" @close="closeDialog"  id="activitylist" class="ui_dialog_02">
    <el-row class="mb20">
      <el-col><el-button type="primary" icon="puls" @click="addClassItem">添加</el-button></el-col>
    </el-row>
    <el-alert
      v-show="errMsg"
      title="请输入分类名称"
      type="error">
    </el-alert>
    <el-table :data="tableData">
      <el-table-column label="活动名称" min-width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" v-if="scope.row.isUpdate" @focus="inputFocus"></el-input>
          <label v-else>{{scope.row.name}}</label>
        </template>
      </el-table-column>
      <el-table-column prop="templateNum" label="会员数量" width="120" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <div v-if="!scope.row.isUpdate">
            <el-button type="text" @click="updateClassItem(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteClassItem(scope.$index, scope.row.id)">删除</el-button>
          </div>
          <div v-else>
            <el-button type="text" @click="saveClassItem(scope.row)">保存</el-button>
            <el-button type="text" @click="cancelClassItem(scope.$index)">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
