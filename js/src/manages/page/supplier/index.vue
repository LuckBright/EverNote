<template>
  <div class="layout_inner flex_column_full">
    <div class="flex_column_full">
      <el-row>
        <el-col :span="24">
          <ever-form2
            v-model="queryObj"
            ref="form"
            :schema="querySchema"
            :inline="true"
            :is-query="true"
          >
            <template slot="default">
              <el-button type="primary" size="small" @click="query">查询</el-button>
              <el-button size="small" @click="handlerReset">重置</el-button>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-button class="fr" type="primary" size="small" @click="handleAdd">新增供应商</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="flex_hidden_row">
        <!-- 左侧供应商列表 -->
        <el-col :span="10" class="flex_column_full">
          <ever-table
            ref="table"
            is-auto-height
            is-single-table
            border
            table-class="no-margin-table flex_column_full_hidden x-hidden"
            class="flex_col_1_hidden main-wrap custom-sort-icon bor_bom_1"
            table-height-strategy="2"
            :data="tableData"
            @row-click="rowClick"
            :table-loading="tableLoading"
            :columns="columns">
            <template slot="opCol">
              <el-table-column label="操作" width="55" align="left">
                <template slot-scope="scope">
                  <el-button icon="el-icon-edit" type="text" @click="$router.push(`/manages/supplieradded/${scope.row.id}`)"></el-button>
                </template>
              </el-table-column>
            </template>
          </ever-table>
        </el-col>
        <!-- 右侧机构列表 -->
        <el-col :span="14" class="flex_column_full">
          <tree-table
            table-class="flex_column_full_hidden x-hidden"
            class="flex_scroll flex_column_full"
            :columns="treeColumns"
            @eventChange="eventChange"
            :needPermission="false"
            :select-data.sync="selectData"
            :newTreeData.sync="newTreeData"
            @manage-handle="eventChangeStatus"
            exception
            propertyName="statue"
            ctrl-switch
            :data="treeData">
            <template slot="slotStatusParent" slot-scope="scope">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">是否启用</el-checkbox>
            </template>
          </tree-table>
        </el-col>
      </el-row>
      <!-- 底部 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <ever-pagination
            :page-sizes="pageSizes"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next, jumper"
            :small="true"
            justify="center"
            :no-bg="true"
            :pager-count="5"
            :total-count="totalCount"
            :current="current"
          ></ever-pagination>
        </el-col>
        <el-col :span="14" class="alg_c fr">
          <el-button type="primary" size="small" @click="saveRelation" class="w_60">保存</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/warehouse/store/supplierapi.js'
import treeTable from '@/manages/components/treetable'
import storage from '@/util/storage'
import treeapi from '@/manages/page/material/materialapi.js'
import list from '@/util/list'
let querySchema = [
  {
    name: 'name',
    label: '供应商名称',
    props: {
      placeholder: '输入供应商'
    }
  },
  {
    name: 'unifiedCode',
    label: '社会统一信用代码'
  }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      queryObj,
      querySchema,
      tableData: [],
      treeData: [],
      treeColumns: [{
        name: 'statue',
        label: '是否启用',
        type: 'component',
        notSelectCheckbox: true,
        prop: 'statue',
        component: {
          isSpecial: true,
          method: 'eventChangeStatus',
          name: 'elSwitch',
        },
        slotHeader: 'slotStatusHeader', // 自定义表头slot名称
        slotParent: 'slotStatusParent' // 父组件slot名称 => 组件透传
      }],
      checkAll: false,
      selectData: [],
      supplierId: '', // 缓存的供应商id
      tableLoading: false,
      isIndeterminate: false,
      newTreeData: [], // 处理过的树形机构数据
      cacheRelations: [], // 缓存relation 关联数据
      cacheTreeData: [], // 缓存的树数据
      checkData: [], // 本次修改的数据
      columns: [
        {
          prop: 'name',
          label: '供应商',
          align: 'center'
        },
        {
          prop: 'unifiedCode',
          label: '社会统一信用代码',
          align: 'center'
        },
        {
          slotName: 'opCol'
        }
      ]
    }
  },
  components: {
    treeTable
  },
  created () {
    this.list()
    this.getTree()
  },
  watch: {
    newTreeData: {
      handler (v) {
        this.isIndeterminate = v.some(item => item.statue === 1)
        if (this.checkAll) this.isIndeterminate = false
      },
      deep: true
    },
  },
  methods: {
    query () {
      this.list()
    },
    handlerReset () {
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
    },
    eventChange ({ col, row, prop }) {
      this[prop] && this[prop](row)
    },
    eventChangeStatus (row) {
      let flag = true
      // 更新已修改的数据
      this.checkData.forEach(item => {
        if (item.clinicId === row.id) {
          item.clinicId = row.id
          item.statue = row.statue
          flag = false
        }
      })
      // 添加修改的数据
      if (flag) {
        this.checkData.push({
          clinicId: row.id,
          statue: row.statue
        })
      }
    },
    // 点击物资列表
    rowClick ({ row }, flag) {
      if (row.id === this.supplierId && !flag) return
      this.supplierId = row.id
      this.checkData = []
      this.treeData = JSON.parse(JSON.stringify(this.cacheTreeData))
      api.getRelations({ supplierId: row.id }).then(res => {
        if (res && res.length) {
          this.cacheRelations = res
          // 点击列表重置机构树关联数据
          this.newTreeData.forEach(item => { item.statue = 0 })
          res.forEach(item => {
            let index = this.newTreeData.findIndex(key => key.id === `${item}`)
            if (~index) {
              this.newTreeData[index].statue = 1
            }
          })
          this.checkAll = this.newTreeData.every(ever => ever.statue === 1)
        } else {
          this.cacheRelations = []
        }
      })
    },
    // 保存修改
    saveRelation () {
      let newArr = JSON.parse(JSON.stringify(this.checkData))
      let params = []
      this.cacheRelations.forEach(data => {
        if (this.cacheRelations.length && !this.selectData.length) { // 说明全部关闭
          newArr.push({
            clinicId: data,
            statue: 0
          })
        }
      })
      if (this.checkAll) {
        newArr = JSON.parse(JSON.stringify(this.newTreeData))
      }
      newArr.forEach(item => {
        const singParme = {
          clinicId: item.clinicId,
          tenantStatus: item.statue,
          supplierId: this.supplierId
        }
        params.push(singParme)
      })
      if (this.checkedRelationsChanged()) return this.$messageTips(this, 'warning', '请修改后再点击保存')
      api.awardSupplierLocal(params).then(res => {
        if (res) {
          this.cacheRelations = []
          this.newTreeData.forEach(clicl => {
            if (clicl.statue) {
              this.cacheRelations.push(Number(clicl.id))
            }
          })
          return this.$messageTips(this, 'success', '保存修改成功。')
        }
      })
    },
    // 检测确认更新数据是否变化
    checkedRelationsChanged () {
      let tempArr = JSON.parse(JSON.stringify(this.newTreeData))
      let checkArr = []
      let update = false
      tempArr.forEach(item => {
        if (item.statue === 1) { checkArr.push(Number(item.id)) }
      })
      if (JSON.stringify(checkArr) === JSON.stringify(this.cacheRelations)) {
        update = true
      }
      console.log(this.cacheRelations, update, 8888)
      return update
    },
    // 机构树列表
    getTree () {
      this.tableLoading = true
      const params = {
        outOrgGetOrgListByConditionReqDTO: {
          idList: [storage.getStorageByClinic('CLINICID') || ''],
        }
      }
      treeapi.tree(params).then(res => {
        if (res && Array.isArray(res.data)) {
          this.levelTreeData(res.data, 'outOrgGetOrgAndChildrenResDTOList')
          this.treeData = res.data
          this.cacheTreeData = JSON.parse(JSON.stringify(res.data))
        }
        this.tableLoading = false
      })
    },
    // 处理机构数据
    levelTreeData (data, parent) {
      data.map(item => {
        item.clinicId = item.id
        item.statue = 0
        if (item[parent] && item[parent].length) {
          this.levelTreeData(item[parent], parent)
        }
      })
    },
    // 供应商列表
    list () {
      let params = Object.assign({}, this.queryObj, { offset: this.offset, pagesize: this.pagesize })
      api.getSupplierSimpleList(params).then(res => {
        if (res && res.length) {
          let data = res.map(item => {
            return {
              id: item.id,
              name: item.name,
              unifiedCode: item.unifiedCode
            }
          })
          this.tableData = data
          this.totalCount = res.totalCount
          this.$nextTick(() => {
            this.$refs.table.$refs.everTable.setCurrentRow(this.tableData[0])
            this.rowClick({ row: this.tableData[0] }, true)
          })
        } else {
          this.tableData = []
          this.totalCount = []
          this.treeData = []
        }
      })
    },
    // 是否全启用
    handleCheckAllChange (checked) {
      this.isIndeterminate = false
      this.newTreeData.forEach((tree, index) => {
        this.newTreeData[index].statue = +checked
      })
      this.newTreeData = JSON.parse(JSON.stringify(this.newTreeData))
    },
    // 新增供应商
    handleAdd () {
      this.$router.push('/manages/supplieradded')
    }
  }
}

</script>
<style scoped>
.flex_hidden_row {
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
}
</style>
