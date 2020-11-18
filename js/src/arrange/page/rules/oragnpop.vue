<template>
  <el-dialog
  title="选择机构"
  :visible.sync="dialogVisible"
  v-if="show"
  class="ui_dialog_02 spe">
    <ul class="city mb20 clearfix">
      <li class="fl" :class="{on: !currentCity}" @click="setCurrentCity('')">全部</li>
      <li class="fl" :class="{on: item.cityCode === currentCity.cityCode}" v-for="(item, i) in cityList" :key="i" @click="setCurrentCity(item)">{{item.cityName}}</li>
    </ul>
    <el-tree
      class="mb20"
      ref="tree"
      :check-strictly="true"
      @check="setCount"
      :data="organTreeList"
      show-checkbox
      node-key="id"
      :default-expanded-keys="expandedValue"
      :default-checked-keys="defaultValue"
      :props="defaultProps">
    </el-tree>
    <el-row style="padding: 20px;" slot="footer">
      <el-col :span="24" align="left">
        <el-button size="small" @click="confirm" type="primary">确定</el-button>
        <span class="blue ml20">已选择{{count}}个机构</span>
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
      cityList: [],
      organTreeList: [],
      currentCity: '',
      selectValue: [],
      dialogVisible: false,
      defaultValue: [],
      expandedValue: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      count: 0
    }
  },
  watch: {
    'show' (val) {
      this.dialogVisible = val
    },
    'dialogVisible' (val) {
      this.$emit('update:show', val)
    },
    'value' (val) {
      this.defaultValue = val.map(item => {
        return item.organId
      })
    }
  },
  created () {
    this.api.getOrganCity().then(rs => {
      this.cityList = rs.data
    })
    this.getOrganTreeList()
  },
  methods: {
    setCurrentCity (val) {
      this.currentCity = val
      this.getOrganTreeList(val ? {cityCodeList: [val.cityCode]} : '')
    },
    getOrganTreeList (params) {
      this.api.getOrganTree(params).then(rs => {
        this.organTreeList = rs.data.resultList
        this.expandedValue = [rs.data.resultList[0].id]
      })
    },
    changeCheckbox () {
      let items = this.$refs.tree.getCheckedNodes()
      this.selectValue = items.map(item => {
        return {organId: item.id, organName: item.name}
      })
      this.count = this.selectValue.filter(item => {
        return item.organId !== '-1'
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
  .city {padding: 0; margin: 0; list-style: none}
  .city li {height: 22px; line-height: 22px; padding: 0 5px; cursor: pointer; margin-right: 10px; margin-bottom: 10px;}
  .city li.on{background: #1c7bef; color: #fff; border-radius: 2px;}
  .blue {color:#1c7bef;font-size:14px;}
  .el-tree /deep/ .el-checkbox:last-of-type{margin-right: 8px;}
</style>
