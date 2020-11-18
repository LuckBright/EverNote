<template>
  <el-dialog
  title="选择科室"
  :visible.sync="dialogVisible"
  v-if="show"
  class="ui_dialog_02 spe">
    <el-tree
      class="mb20"
      ref="tree"
      @check="setCount"
      :data="allDeptTreeList"
      show-checkbox
      node-key="tenantSubjectCode"
      :default-expanded-keys="defaultExp"
      :default-checked-keys="defaultValue"
      :props="defaultProps">
    </el-tree>
    <el-row style="padding: 20px;" slot="footer">
      <el-col :span="24" align="left">
        <el-button size="small" @click="confirm" type="primary">确定</el-button>
        <span class="blue ml20">已选择{{count}}个科室</span>
      </el-col>
    </el-row>  
  </el-dialog>
</template>
  
<script>
import api from '@/arrange/store/rulesuseapi'
export default {
  props: ['value', 'show'],
  data () {
    return {
      api,
      dialogVisible: false,
      allDeptList: [],
      allDeptTreeList: [{
        tenantSubjectCode: '-1',
        tenantSubjectName: '全部',
        sonLocalSections: []
      }],
      defaultExp: ['-1'],
      defaultValue: [],
      selectValue: [],
      count: 0,
      defaultProps: {
        children: 'sonLocalSections',
        label: 'tenantSubjectName'
      }
    }
  },
  watch: {
    'show' (val) {
      this.dialogVisible = val
      if (val) {
        this.$nextTick(_ => {
          this.changeCheckbox()
        })
      }
    },
    'dialogVisible' (val) {
      this.$emit('update:show', val)
    },
    'value' (val) {
      if (!val[0]) {
        this.defaultValue = ['-1']
        return false
      }
      this.defaultValue = val.map(item => {
        return item.deptId
      })
    }
  },
  created () {
    this.getDeptList()
  },
  methods: {
    getDeptList () {
      this.api.getAllDeptList({
        type1CodeList: ['01', '02'],
        type2CodeList: ['01.02', '02.01']
      }).then(rs => {
        this.allDeptList = rs.data.resultList
        this.allDeptTreeList[0].sonLocalSections = this.getDeptTreeList('0')
      })
    },
    getDeptTreeList (id) {
      let pid = id || '0' || '' || null
      let list = this.allDeptList.filter(item => {
        return item.parentOrgSubjectCode === pid
      })
      list.map(item => {
        item.sonLocalSections = this.getDeptTreeList(item.orgSubjectCode)
        return item
      })
      return list
      /*
      return list.sort((a, b) => {
        return a.orderNum - b.orderNum < 0
      })
      */
    },
    changeCheckbox () {
      let items = this.$refs.tree.getCheckedNodes()
      this.selectValue = items.map(item => {
        return {deptId: item.tenantSubjectCode, deptName: item.tenantSubjectName}
      })
      this.count = this.selectValue.filter(item => {
        return item.deptId !== '-1'
      }).length
    },
    confirm () {
      this.changeCheckbox()
      this.$emit('input', this.selectValue)
      this.dialogVisible = false
    },
    setCount (val, obj) {
      this.count = obj.checkedKeys.filter(item => {
        return item !== '-1'
      }).length
    }
  }
}
</script>

<style scoped>
  .blue {color:#1c7bef;font-size:14px;}
  .el-tree /deep/ .el-checkbox:last-of-type{margin-right: 8px;}
</style>
