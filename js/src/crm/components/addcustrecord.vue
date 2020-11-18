<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" class="ui_dialog_02 spe pd" size="small">
    <el-row>
        <el-form :model="addMes" :rules="rules" ref="ruleForm">
          <el-col :span="22" :offset="1">
            <el-form-item prop="type">
              <!-- <el-select v-model="addMes.type" placeholder="请选择行为类型" style="width:100%">
                <el-option :label="item.name" :value="item.id" v-for="(item, index) in curTypeData" :key="index"></el-option>
              </el-select> -->
              <ever-select v-model="addMes.type" :options="curTypeData" placeholder="请选择行为类型"></ever-select>
            </el-form-item>
          </el-col>
          <el-col :span="22" :offset="1">
            <el-form-item prop="content">
              <el-input type="textarea" :rows="5" v-model="addMes.content" maxlength="500" placeholder="请输入客户的行为记录"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="23" align="right" class="line">
            <el-button @click="saveBehavRecord">添加</el-button>
          </el-col>
        </el-form>
    </el-row>
  </el-dialog>
</template>
<script>
  import api from '../store/recordapi'

  export default {
    props: ['title', 'visible', 'typeData'],
    data () {
      return {
        api,
        dialogVisible: false,
        typeVisible: false,
        manageTypeData: [],
        curTypeData: [],
        addMes: {
          type: '',
          content: '',
          patientId: this.$route.params.patientId ? this.$route.params.patientId : null
        },
        rules: {
          type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请输入行为记录', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      'visible': {
        handler: function (val) {
          if (!val) {
            this.addMes.type = ''
            this.addMes.content = ''
          }
          this.dialogVisible = val
          !this.curTypeData.length ? this.curTypeData.push(...this.typeData) : this.curTypeData
          if (val) {
            setTimeout(() => {
              this.$refs.ruleForm.resetFields()
            })
          }
        },
        immediate: true
      },
      'dialogVisible': {
        handler: function (val) {
          this.$emit('update', val)
        },
        immediate: true
      }
    },
    methods: {
      // 管理行为类型
      manageType () {
        this.manageTypeData = []
        if (this.curTypeData && this.curTypeData.length) {
          this.manageTypeData = JSON.parse(JSON.stringify(this.curTypeData))
        } else {
          this.manageTypeData.push({name: ''})
        }
      },
      // 删除类型
      deleteType (item, index) {
        if (this.manageTypeData.length > 1) {
          if (!item.id) {
            this.manageTypeData.splice(index, 1)
            return false
          }
        } else {
          if (!item.id) {
            this.manageTypeData = [{name: ''}]
            return false
          }
        }
        this.$confirm('是否删除此条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteCustType({id: item.id}).then(rs => {
            if (this.manageTypeData.length > 1) {
              this.manageTypeData.splice(index, 1)
            } else {
              this.manageTypeData = [{name: ''}]
            }
            this.curTypeData = this.manageTypeData.filter(item => {
              return item.id
            })
            this.typeVisible = true
          })
        }).catch((e) => {
          this.typeVisible = true
        })
      },
      // 添加类型
      addType (item, index) {
        this.manageTypeData.push({name: ''})
      },
      // 保存管理行为类型
      saveManagType () {
        this.typeVisible = false
        let params = this.manageTypeData.filter(item => {
          return item.name
        })
        api.saveManagType(params).then(rs => {
          if (rs && rs.length > 0) {
            this.curTypeData = rs
            this.$emit('update-type', this.curTypeData)
          }
        })
      },
      // 添加客户行为记录保存
      saveBehavRecord () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            api.addBehavRecord(this.addMes).then(rs => {
              if (rs) {
                this.$emit('add-behav-record', rs)
                this.dialogVisible = false
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
<style scoped>
  .deleteType, .addType {color: #bbbbbb;}
</style>
