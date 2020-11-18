<template>
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  class="ui_dialog_02 spe">
    <el-form v-model="form">
      <template v-for="(item, row) in form">
        <el-row :gutter="10" v-if="!item.deleted" :key="row">
          <el-col :span="7">
            <el-form-item>
              <el-select v-model="item.timeTrunk" value-key="timeTrunkId" style="width:100%">
                <el-option v-for="(item, i) in workList" :key="i" :value="item" :label="item.timeTrunkName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-select v-model="item.organ" value-key="organId" style="width:100%">
                <el-option v-for="(item, i) in orgItemList" :key="i" :value="item" :label="item.organName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-select v-model="item.arrangeUse" style="width:100%">
                <el-option :value="1" label="出诊"></el-option>
                <el-option :value="2" label="休息"></el-option>
                <el-option :value="3" label="陪诊"></el-option>
                <el-option :value="4" label="其它"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" align="left">
            <el-form-item>
              <i class="iconfont icon-tianjia mr20" @click="addItem" v-if="row === 0"></i>
              <i class="iconfont icon-delete" v-if="row > 0" @click="delItem(row, item)"></i>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <el-row>
      <el-col :span="24" align="right">
        <el-button type="" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import api from '@/arrange/store/schedulingapi'
import workapi from '@/arrange/store/workapi'
export default {
  props: ['show', 'arrange', 'date', 'resource'],
  data () {
    return {
      api,
      workapi,
      title: '添加排班',
      dialogVisible: false,
      orgItemList: [],
      workList: [],
      form: [{
        id: '',
        resource: this.resource,
        date: this.date,
        organ: '',
        timeTrunk: '',
        arrangeUse: ''
      }]
    }
  },
  watch: {
    show (val) {
      if (val) {
        if (!this.orgItemList[0]) {
          this.getOrgList()
        }
        if (!this.workList[0]) {
          this.getWorkList()
        }
        if (this.arrange[0]) {
          this.title = '编辑排班'
          this.form = this.arrange.map(item => {
            return {
              id: item.id,
              resource: this.resource,
              date: this.date,
              organ: {organId: item.organId, organName: item.organName},
              timeTrunk: {timeTrunkId: item.timeTrunkId, timeTrunkName: item.timeTrunkName},
              arrangeUse: item.arrangeUse
            }
          })
        } else {
          this.title = '添加排班'
          this.form = [{
            id: '',
            resource: this.resource,
            date: this.date,
            organ: '',
            timeTrunk: '',
            arrangeUse: ''
          }]
        }
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('update:show', val)
    }
  },
  created () {

  },
  methods: {
    getOrgList () {
      this.orgItemList = []
      this.api.getOrgList().then(rs => {
        rs.data.map(item => {
          this.orgItemList.push({organId: '' + item.clinicId, organName: item.clinicName})
        })
      })
    },
    getWorkList () {
      this.workapi.list(this.params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        let data = []
        rs.data.resultList.map(item => {
          if (item.isWork === 1) {
            data.push({ timeTrunkId: item.id, timeTrunkName: item.name, trunkTimeRanges: item.timeTrunkTimeRanges })
          }
        })
        this.workList = data
      })
    },
    addItem () {
      this.form.push({
        id: '',
        resource: this.resource,
        date: this.date,
        organ: '',
        timeTrunk: '',
        arrangeUse: ''
      })
    },
    delItem (row, item) {
      if (item.id) {
        this.$set(this.form[row], 'deleted', true)
      } else {
        this.form = this.form.splice(row, 1)
      }
    },
    submitForm () {
      this.form = this.form.map(item => {
        item.resource = this.resource
        item.date = this.date
        return item
      })
      this.api.saveAssistantArrange({arrangeList: this.form}).then(rs => {
        if (!rs.head.errCode) {
          this.$messageTips(this, 'success', '排班已保存成功', '保存成功')
          this.dialogVisible = false
          this.$emit('success', true)
        }
      })
    }
  }
}
</script>
