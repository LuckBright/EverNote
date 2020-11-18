<template>
  <el-dialog
  title="选择服务"
  :visible.sync="dialogVisible"
  v-if="show"
  class="ui_dialog_02 spe">
    <el-tabs v-model="activeName">
      <el-tab-pane label="按分类" name="class">
        <el-tree
          v-if="activeName === 'class'"
          @check="changeCheckbox"
          class="mb20"
          ref="tree"
          :default-expand-all="true"
          :data="allList"
          show-checkbox
          node-key="code"
          :default-expanded-keys="defaultExp"
          :default-checked-keys="defaultValue"
          :props="defaultProps">
        </el-tree>      
      </el-tab-pane>
      <el-tab-pane label="按项目" name="items">
        <el-form :model="params" :inline="true" class="header">
          <el-form-item v-if="allList[0].valueSetItems">
            <el-select v-model="params.threeServiceClassify" :disabled="isAllSelect" size="small">
              <el-option v-for="(item, i) in allList[0].valueSetItems" :key="i" :value="item.code" :label="item.name"></el-option>
            </el-select>
            <!--<sys-type code="THC_WH_OBJECT_SUB_TYPE" v-model="serviceClassificationList" :use-value="true"></sys-type>-->
          </el-form-item>
          <el-form-item>
            <el-input size="small" v-model="params.name" :disabled="isAllSelect" placeholder="请输入关键词"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="isAllSelect" style="margin-top: 7px">全部项目</el-checkbox>
          </el-form-item>
        </el-form>
        <div v-show="!isAllSelect">
          <el-tree
            v-if="activeName === 'items'"
            @check="changeCheckbox"
            class="mb20"
            ref="tree2"
            :default-expand-all="true"
            :data="serviceItemList"
            show-checkbox
            node-key="id"
            :default-expanded-keys="defaultExp"
            :default-checked-keys="defaultValue2"
            :props="defaultProps">
          </el-tree> 
        </div>
        <el-row v-if="!isAllSelect">
          <el-col :span="24">
            <el-pagination
              style="padding: 10px 0; justify-content: flex-start"
              :small="true"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next, jumper"
              :page-sizes="[10, 20, 50, 100]"
              :page-size.sync="params.pagesize"
              :total="totalCount"
              :current.sync="currentPage">
            </el-pagination>          
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-row style="padding: 20px;" slot="footer">
      <el-col :span="24" align="left">
        <el-button size="small" @click="confirm" type="primary">确定</el-button>
        <span class="blue ml20" v-if="!isAllSelect || activeName === 'class'">已选择{{count}}个项目</span>
      </el-col>
    </el-row>  
  </el-dialog>
</template>
  
<script>
import api from '@/arrange/store/rulesuseapi'
export default {
  props: ['value', 'show', 'serviceCode', 'serviceWay'],
  data () {
    return {
      api,
      activeName: 'class',
      dialogVisible: false,
      totalCount: 0,
      initVal: [],
      isAllSelect: false,
      allList: [{
        code: '-1',
        name: '全部',
        valueSetItems: []
      }],
      serviceItemList: [{
        id: '-1',
        name: '全选',
        disabled: false,
        valueSetItems: []
      }],
      defaultExp: [],
      defaultValue: [],
      defaultValue2: [],
      selectValue: {},
      selectItem: [],
      defaultProps: {
        children: 'valueSetItems',
        label: 'name'
      },
      serviceClassificationList: '',
      currentPage: 1,
      prevPage: 1,
      params: {
        name: '',
        serviceClassificationList: [],
        threeServiceClassify: '',
        pagesize: 12,
        offset: 0
      },
      count: 0
    }
  },
  watch: {
    'show' (val) {
      this.dialogVisible = val
      if (val) {
        this.currentPage = 1
        this.params.offset = 0
        this.getServiceClassList()
        this.list()
      }
    },
    'dialogVisible' (val) {
      this.$emit('update:show', val)
    },
    'value' (val) {
      this.initVal = val
    },
    'params.name' (val) {
      return this.show && this.list()
    },
    'params.threeServiceClassify' (val) {
      return this.show && this.list()
    },
    'serviceCode' (val) {
      this.serviceClassificationList = val
      this.getServiceClassList()
    },
    'serviceWay' (val) {
      this.activeName = val === 1 ? 'class' : 'items'
    },
    'serviceClassificationList' (val) {
      this.params.serviceClassificationList = val ? [val] : []
      return this.show && this.list()
    },
    'activeName' (val) {
      this.$emit('update:serviceWay', val === 'class' ? 1 : 2)
      return this.show && this.list()
    },
    'isAllSelect' (val) {
      if (!val) {
        this.defaultValue2 = []
      }
    }
  },
  methods: {
    list () {
      this.api.getServiceList(this.params).then(rs => {
        this.serviceItemList[0].valueSetItems = rs.data
        this.totalCount = rs.totalCount
        this.$nextTick(_ => {
          this.setInitValue()
          this.$nextTick(_ => {
            this.changeCheckbox('list')
          })
        })
      })
    },
    getServiceClassList () {
      if (!this.serviceCode) {
        return false
      }
      this.api.getServiceClass({
        setCode: 'THC_WH_OBJECT_SUB_TYPE',
        codes: this.serviceCode ? [this.serviceCode] : null
      }).then(rs => {
        this.allList[0].valueSetItems = rs.data[0].valueSetItems
        if (!this.allList[0].valueSetItems) {
          this.params.threeServiceClassify = ''
        }
      })
    },
    changeCheckbox (val) {
      if (this.activeName === 'class') {
        let data = this.$refs.tree.getCheckedNodes()
        let value = data.map(item => {
          return {serviceSecondType: item.code, serviceSecondTypeName: item.name}
        })
        this.selectValue[this.currentPage] = value
      } else {
        let data = this.$refs.tree2.getCheckedNodes()
        let value = data.map(item => {
          return {serviceId: item.id, serviceName: item.name}
        })
        this.selectValue[this.currentPage] = value
      }
      this.initVal = this.getSelectValue(this.selectValue)
      this.count = this.initVal.filter(item => {
        return item.serviceId !== '-1'
      }).length
    },
    confirm () {
      let select = this.isAllSelect && this.activeName === 'items' ? [{serviceId: '-1', serviceName: '全部'}] : this.initVal
      this.$emit('getway', this.activeName === 'class' ? 1 : 2)
      this.$emit('input', select)
      this.dialogVisible = false
    },
    handleSizeChange (val) {
      this.params.pagesize = val
      this.currentPage = 1 // 切换size时，自动重置current
      this.params.offset = (this.currentPage - 1) * this.params.pagesize
      this.list()
    },
    handleCurrentChange (val) {
      this.changeCheckbox('handleCurrentChange')
      this.prevPage = this.currentPage
      this.currentPage = val
      this.params.offset = (val - 1) * this.params.pagesize || 0
      this.list()
    },
    setInitValue () {
      if (this.activeName === 'class') {
        if (this.initVal[0]) {
          this.defaultValue = this.initVal.map(item => {
            return item.serviceSecondType
          })
          this.count = this.initVal.filter(item => {
            return item.serviceSecondType !== '-1'
          }).length
        } else {
          this.defaultValue = ['-1']
          this.count = 0
        }
      } else {
        if (this.isAllSelect || (this.initVal[0] && this.initVal[0].serviceId === '-1')) {
          this.isAllSelect = true
          this.defaultValue2 = []
          this.count = 0
          return false
        }
        this.defaultValue2 = this.initVal.map(item => {
          return item.serviceId
        })
        this.count = this.initVal.filter(item => {
          return item.serviceId !== '-1'
        }).length
      }
    },
    getSelectValue (val) {
      let arr = []
      for (let key in val) {
        arr = arr.concat(val[key])
      }
      if (this.activeName === 'class') {
        return arr[0] && arr[0].serviceSecondType === '-1' ? [arr[0]] : arr.filter(item => {
          return item.serviceSecondType !== '-1'
        })
      } else {
        return this.isAllSelect ? [{serviceId: '-1', serviceName: '全部'}] : arr.filter(item => {
          return item.serviceId !== '-1'
        })
      }
    }
  }
}
</script>

<style scoped>
  .blue {color:#1c7bef;font-size:14px;}
  .header {padding: 0 20px;}
  .el-checkbox-group{padding: 0 20px;}
  .el-checkbox{ display: block; line-height: 25px}
</style>
