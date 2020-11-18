<template>
  <div>
    <div>
      <el-radio-group v-model="radio">
        <el-radio v-for="item in radios" :key="item.id" :label="item.id">{{item.name}}</el-radio>
      </el-radio-group>
      <el-table
        v-show="!layerShow"
        :data="tableData"
        class="tree-table"
        style="width: 100%">
        <el-table-column
          prop="label"
          label="机构列表">
        </el-table-column>
        <el-table-column
          prop="name"
          label="可用机构"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isUse" :true-label="1" :false-label="0"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="可售机构"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isSale" :true-label="1" :false-label="0"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type == 2"
          width="120"
          prop="address"
          label="折后总金额">
          <template slot-scope="scope">
            <ever-number v-model="scope.row.totalPriceDisSet" number-type="number"></ever-number>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type == 1"
          prop="address"
          width="120"
          align="center"
          label="折扣比例">
          <template slot-scope="scope">
            <ever-number v-model="scope.row.discount" number-type="number"></ever-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          width="250"
          label="失效日期">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="layerShow">
        <group-clinic-tree :type="type" :treeData="layerTreeData" :isGroupControl="isGroupControl" :isClinic = 'isClinic'></group-clinic-tree>
      </div>
    </div>
    <div v-if="!layerShow" style="margin-top:20px;">
      <el-button type="primary" @click="confirm" :disabled="isClinic == 1 || isGroupControl">确认更新</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/card/store/packagemanagement/api'
import groupClinicTree from './groupclinictree'
export default {
  components: {
    groupClinicTree
  },
  props: ['treeData', 'region', 'isClinic', 'type', 'isGroupControl', 'layerTreeData'],
  data () {
    return {
      api,
      id: this.$route.query.packageId,
      checkValArr: [],
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0, // 是否集团
      radio: 0,
      radios: [],
      tableData: [],
      layerShow: true
    }
  },
  methods: {
    init () {
      this.initRadios()
      this.initTableData(this.radio)
    },
    initTableData (val) {
      if (val === 0) {
        this.layerShow = true
      } else {
        this.layerShow = false
        if (this.treeData[val - 1] && this.treeData[val - 1]['children']) {
          this.tableData = this.treeData[val - 1]['children']
        } else {
          this.tableData = []
        }
      }
    },
    initRadios () {
      this.radios = [{name: '全国', id: 0}]
      if (this.$route.query.categoryId !== '06') {
        this.treeData.forEach((item, index) => {
          if (item.children && item.children.length > 0) {
            this.radios.push({name: item.label, id: index + 1})
          }
        })
      }
    },
    loopVal (data) {
      data.forEach(item => {
        if (!item.border && (item.isSale === 1 || item.isUse === 1)) {
          this.checkValArr.push(JSON.parse(JSON.stringify(item)))
        }
        if (item.children && item.children.length > 0) {
          this.loopVal(item.children)
        }
      })
    },
    confirm () {
      let obj = {}
      let arr = []
      this.checkValArr = []
      this.loopVal(this.treeData)
      this.checkValArr.forEach(item => {
        if (!obj[item.id]) {
          arr.push(item)
          obj[item.id] = true
        }
        item.orgId = item.id
        delete item.id
        delete item.label
        if (item.type === 1) {
          delete item.totalPriceDisSet
        } else {
          delete item.discount
        }
      })
      if (arr.length === 0) {
        this.$messageTips(this, 'error', '请设置关联机构')
        return
      }
      let params = {
        id: this.$route.query.packageId,
        setMealSale: arr
      }
      api.updateBatchRange({
        isGroup: this.isGroup,
        data: [
          params
        ]
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '关联成功')
          if (this.$route.meta.isAdd === 1) {
            this.$bus.$emit('package-tab', { name: '4' })
          }
        }
      })
    }
  },
  watch: {
    'treeData': {
      handler: function (val) {
        if (this.treeData.length > 0) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    },
    'radio': {
      handler: function (val) {
        this.initTableData(val)
      },
      deep: true,
      immediate: true
    },
  }
}
</script>
<style lang="less" scoped>
  .tree-table /deep/ .el-input__icon {
    line-height: 24px;
  }
  .tree-table /deep/ input {
    height: 24px;
    line-height: 24px;
  }
  .tree-table /deep/ tr {
    line-height: 30px;
    th {
      padding: 0 !important;
      div {
        height: 100%;
        line-height: 100%;
        font-size: 14px;
      }
    }
  }

</style>
