<template>
  <el-dialog title="类型管理" :visible.sync="dialog" @close="closeDialog"  id="classList" class="ui_dialog_02">
    <el-row class="mb20">
      <el-col><el-button type="primary" icon="puls" @click="addClassItem">添加分类</el-button></el-col>
    </el-row>
    <el-alert
      v-show="errMsg"
      title="请输入分类名称"
      type="error">
    </el-alert>
    <el-table :data="tableData">
      <el-table-column label="类型名称" min-width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" v-if="scope.row.isUpdate" @focus="inputFocus"></el-input>
          <label v-else>{{scope.row.name}}</label>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="渠道数量" width="120" align="center"></el-table-column>
      <el-table-column prop="validityPeriod" label="会员有效期" width="120" align="center">
        <template slot-scope="scope">
          <el-select v-model="value" placeholder="请选择" v-if="scope.row.isUpdate">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div v-else>
            <label v-if="scope.row.validityPeriod === 13">永久</label>
            <label v-else>{{scope.row.validityPeriod}}个月</label>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="autoAdd" label="需要自主添加" width="120" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isUpdate">
            <el-radio-group v-model="autoradio">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <div v-else>
            <label v-if="scope.row.autoAdd === false">否</label>
            <label v-else>是</label>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <div v-if="!scope.row.isUpdate">
            <el-button type="text" @click="updateClassItem(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteClassItem(scope.$index, scope.row.id)">删除</el-button>
          </div>
          <div v-if="scope.row.isUpdate">
            <el-button type="text" @click="saveClassItem(scope.row)">保存</el-button>
            <el-button type="text" @click="cancelClassItem(scope.$index)">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
  import api from '../store/sourceapi'
  export default {
    data () {
      return {
        api: api,
        dialog: false,
        errMsg: false,
        tableData: [],
        selected: '',
        initUpdateVal: '',
        autoradio: '0',
        options: [
          {
            value: 1,
            label: '1个月'
          },
          {
            value: 2,
            label: '2个月'
          },
          {
            value: 3,
            label: '3个月'
          },
          {
            value: 4,
            label: '4个月'
          },
          {
            value: 5,
            label: '5个月'
          },
          {
            value: 6,
            label: '6个月'
          },
          {
            value: 7,
            label: '7个月'
          },
          {
            value: 8,
            label: '8个月'
          },
          {
            value: 9,
            label: '9个月'
          },
          {
            value: 10,
            label: '10个月'
          },
          {
            value: 11,
            label: '11个月'
          },
          {
            value: 12,
            label: '12个月'
          },
          {
            value: 13,
            label: '永久'
          }
        ],
        value: ''
      }
    },
    watch: {
      dialog (val) {
        val && this.getClassList()
      }
    },
    methods: {
      getClassList () {
        this.api.getTypelist().then(rs => {
          if (rs.data.length > 0) {
            rs.data.forEach(item => {
              item.isUpdate = false
            })
            this.tableData = rs.data
          }
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
        this.autoradio = val.autoAdd ? 1 : 0
        this.value = val.validityPeriod
        val.isUpdate = true
      },
      cancelClassItem (i) {
        this.tableData[i].isUpdate = false
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
        delete rs.isUpdate
        delete rs.number
        rs.validityPeriod = this.value
        rs.autoAdd = this.autoradio
        this.api.typecreate(rs).then(rs => {
          if (rs.data) {
            this.$emit('save')
            this.dialog = false
          }
        })
      },
      closeDialog () {
        this.$emit('close', false)
      }
    }
  }
</script>
<style scoped>
  #classList .el-table .cell{padding: 7px 12px;}
  #classList .el-table .cell .el-input input{background: #F8F8F8;color: #666666;}
  #classList .el-alert--error{background: #fee;color: #fa5555}
</style>
