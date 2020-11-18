<template>
  <el-dialog
  title="选择人员"
  :visible.sync="dialogVisible"
  v-if="show"
  class="ui_dialog_02 spe">
    <el-form :model="params" :inline="true" class="header">
      <el-form-item>
        <el-select v-model="selectOrgan" clearable placeholder="按执业机构过滤" style="width:140px" size="small" value-key="id">
          <el-option v-for="(item, i) in organList" :value="item" :label="item.name" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="selectDept" placeholder="选择科室" style="width:140px" clearable size="small" value-key="id">
          <el-option v-for="(item, i) in deptList" :value="item" :label="item.name" :key="i"></el-option>
        </el-select>        
      </el-form-item>
      <el-form-item>
        <el-input v-model="selectName" size="small" placeholder="医生姓名" style="width:140px"></el-input>
      </el-form-item>       
      <el-form-item>
        <el-button type="primary" size="small" @click="getResourceList">查询</el-button>
        <el-checkbox v-model="isAllSelect" style="margin-left:10px">全部医生</el-checkbox>
      </el-form-item>
    </el-form>
    <el-tree
      class="mb20"
      ref="tree"
      @check="changeCheckbox"
      :data="resourceList"
      show-checkbox
      node-key="id"
      :default-expanded-keys="defaultExp"
      :default-checked-keys="defaultValue"
      :props="defaultProps">
    </el-tree>
    <el-row style="padding: 20px;" slot="footer">
      <el-col :span="24" align="left">
        <el-button size="small" @click="confirm" type="primary">确定</el-button>
        <span class="blue ml20">已选择{{count}}个人员</span>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import api from '@/arrange/store/rulesuseapi'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
export default {
  props: ['value', 'show'],
  data () {
    return {
      api,
      organList: [],
      deptList: [],
      isAllSelect: false,
      resourceList: [{
        id: '-1',
        name: '全选',
        children: []
      }],
      selectOrgan: '',
      selectDept: '',
      selectValue: [],
      selectName: '',
      defaultExp: ['-1'],
      defaultValue: [],
      dialogVisible: false,
      params: {
        typeCodeList: ['DOCTOR'],
        tenantSubjectIdList: [],
        orgIdList: []
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      count: 0
    }
  },
  watch: {
    'show' (val) {
      if (!this.value[0] || this.value[0].resourceId === '-1') {
        this.defaultValue = ['-1']
        this.isAllSelect = true
      } else {
        this.isAllSelect = false
        this.defaultValue = this.value.map(item => {
          return item.resourceId
        })
      }
      if (val) {
        this.$nextTick(_ => {
          this.changeCheckbox()
        })
      }
      this.dialogVisible = val
    },
    'dialogVisible' (val) {
      this.$emit('update:show', val)
    },
    'value' (val) {
      this.setInitValue()
    },
    'selectDept' (val) {
      this.params.tenantSubjectIdList = val ? [val.id] : []
    },
    'selectName' (val) {
      this.params.nameList = val ? [val] : []
    },
    'params': {
      handler (val) {
        this.count = 0
        this.getResourceList()
      },
      deep: true
    },
    'selectOrgan' (val) {
      if (val) {
        this.deptList = val.tenantSubjectList.map(item => {
          return {
            id: item.tenantSubjectCode,
            name: item.tenantSubjectName
          }
        })
        this.params.orgIdList = [val.id]
      } else {
        this.params.orgIdList = []
        this.deptList = []
      }
      this.selectDept = ''
    }
  },
  created () {
    this.getOrganList()
    this.getResourceList()
  },
  methods: {
    changeCheckbox () {
      let items = this.$refs.tree.getCheckedNodes()
      this.selectValue = items.map(item => {
        return {resourceId: item.id, resourceName: item.name}
      })
      this.count = this.selectValue.filter(item => {
        return item.resourceId !== '-1'
      }).length
    },
    confirm () {
      this.changeCheckbox()
      let value = this.isAllSelect ? [{resourceId: '-1', resourceName: '全部'}] : this.selectValue.filter(item => {
        return item.resourceId !== '-1'
      })
      this.$emit('input', value)
      this.dialogVisible = false
    },
    getOrganList () {
      this.api.getOrganList({
        outOrgGetOrgListByConditionReqDTO: {
          cityCodeList: [],
        },
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          type1CodeList: ['01', '02'],
          type2CodeList: ['01.02', '02.01']
        }
      }).then(rs => {
        this.organList = rs.data.resultList
      })
    },
    getResourceList () {
      this.api.getResourceList(this.params).then(rs => {
        this.resourceList[0].children = rs.data.resultList
        this.$nextTick(_ => {
          this.setInitValue()
        })
      })
    },
    setInitValue () {
      if (!this.value[0]) {
        this.defaultValue = ['-1']
        return false
      }
      this.defaultValue = this.value.map(item => {
        return item.resourceId
      })
    },
    setCount (val, obj) {
      this.count = obj.checkedKeys.filter(item => {
        return item !== '-1'
      }).length
    }
  },
  components: {
    deptCascader
  }
}
</script>

<style scoped>
  .header {padding: 0 20px; border-bottom: 1px solid #ddd; margin-bottom: 20px;}
  .blue {color:#1c7bef;font-size:14px;}
  .el-tree /deep/ .el-checkbox:last-of-type{margin-right: 8px;}
</style>
