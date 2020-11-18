<template>
  <div class="layout_inner billing-rule">
    <div class="manages-set">
      <p class="set-title">集团计费点设置</p>
      <ever-table
        table-class="manages-set-table"
        :data="managesSetData"
        :columns="managesColumns"
      >
        <template slot="isValid" slot-scope="scope">
          <span>{{+scope.row.isValid ? '启用' : '未启用'}}</span>
        </template>
        <template slot="timeRuleCode" slot-scope="scope">
          <span>{{+scope.row.timeRuleCode ? '是' : '否'}}</span>
        </template>
        <div slot="operation" slot-scope="scope">
          <el-button type="text" class="edit-rule" @click="editor('manages', scope.row.id)">编辑</el-button>
        </div>
      </ever-table>
      <p class="remark">说明：如果集团计费点是启用状态且机构没有配置计费点，则会按照集团计费点自动计费</p>
    </div>
    <div class="group-set">
      <p class="set-title">
        <span>机构计费点设置</span>
        <el-button type="primary" class="add-btn" @click="addRule">新增</el-button>
      </p>
      <div class="group-wrap">
        <ever-table
          table-class="manages-set-table"
          :data="groupSetData"
          :columns="groupColumns"
        >
          <template slot="timeRuleCode" slot-scope="scope">
            <span>{{+scope.row.timeRuleCode ? '是' : '否'}}</span>
          </template>
          <div slot="operation" slot-scope="scope">
            <el-button type="text" class="edit-rule" @click="editor('group', scope.row.id)">编辑</el-button>
            <el-button type="text" class="del-rule" @click="del(scope.row.id)">删除</el-button>
          </div>
        </ever-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="curpage"
        ></ever-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/group/store/billingapi.js'
export default {
  data () {
    return {
      managesSetData: [],
      groupSetData: [],
      curpage: 1,
      pagesize: 20,
      totalCount: 0
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.managesColumns = this.getColumns(true)
      this.groupColumns = this.getColumns()
    },
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.saveSizeChange()
      this.getGroupList()
    },
    handleCurrentChange (page) {
      this.curpage = page
      this.saveSizeChange()
      this.getGroupList()
    },
    // 保存分页信息到route
    saveSizeChange () {
      let obj = {
        page: this.curpage,
        pagesize: this.pagesize
      }
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...obj
        }
      })
    },
    getList () {
      this.getManagesList()
      this.getGroupList()
    },
    async getManagesList () {
      let res = await api.getManagesFeeRule()
      if (res) {
        this.managesSetData = [res]
      }
    },
    async getGroupList () {
      let params = {
        page: this.curpage,
        pagesize: this.pagesize,
        offset: (this.curpage - 1) * this.pagesize
      }
      let res = await api.getFeeRule(params)
      this.groupSetData = res.resultList || []
      this.totalCount = res.totalCount
      // res.resultList.forEach(item => {
      //   if (item.orgId === this.tenantId) {
      //     this.managesSetData.push(item)
      //   } else {
      //     if (item.tenantId === this.tenantId) {
      //       this.groupSetData.push(item)
      //     }
      //   }
      // })
    },
    addRule () {
      this.$router.push({
        name: 'billingruleEdit',
        params: {
          orgType: 'group',
          id: '-1'
        }
      })
    },
    editor (org, id) {
      this.$router.push({
        name: 'billingruleEdit',
        params: {
          orgType: org,
          id: id
        }
      })
    },
    del (id) {
      api.delFeeRule({id}).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '删除成功')
          this.getGroupList()
        }
      })
    },
    getColumns (type) {
      let columns = [{
        prop: 'taskTime',
        label: '自动计费点'
      }, {
        slot: 'timeRuleCode',
        prop: 'timeRuleCode',
        label: '入院当天是否计费'
      }]
      if (type) {
        columns.push({
          slot: 'isValid',
          prop: 'isValid',
          label: '状态'
        }, {
          slot: 'operation',
          prop: 'operation',
          label: '操作'
        })
        return columns
      }
      columns.unshift({
        prop: 'orgName',
        label: '机构名称'
      })
      columns.push({
        slot: 'operation',
        prop: 'operation',
        label: '操作'
      })
      return columns
    }
  },
  watch: {
    '$store.state.currentUser': {
      handler (val) {
        if (val) {
          this.tenantId = val.tenantId
          this.orgId = val.organizationId
          this.curpage = Number(this.$route.query.page) || 1
          this.pagesize = Number(this.$route.query.pagesize) || 20
          this.getList()
          this.saveSizeChange()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.billing-rule {
  background-color: transparent;
  .group-set {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .set-title {
    font-size: 14px;
    position: relative;
    .add-btn {
      position: absolute;
      right: 10px;
      top: -15px;
    }
  }
  .group-wrap {
    flex: 1;
    overflow: auto;
  }
  .remark {
    font-size: 12px;
    color: #444;
  }
  .del-rule {
    color: red;
  }
}
</style>
