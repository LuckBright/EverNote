<template>
  <div class="grouping-table">
    <el-input
      v-model="groupingName"
      placeholder="搜索商品分组名称"
      size="mini"
      class="grouping-dialog-input"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-table
      v-if="type === 1"
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="groupName" label="分组名称"></el-table-column>
      <el-table-column prop="goodsNum" label="分组商品数"></el-table-column>
    </el-table>
    <el-table v-if="type === 2" :data="tableData" border style="width: 100%">
      <el-table-column width="50">
        <template slot-scope="scope">
          <i
            class="iconfont close-icon"
            @click="deleteInfo(scope.row)"
          >&#xe6e7;</i
          >
        </template>
      </el-table-column>
      <el-table-column prop="groupName" label="分组名称"></el-table-column>
      <el-table-column prop="goodsNum" label="分组商品数"></el-table-column>
    </el-table>
    <p style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="pageSize"
        :page-size="pagesize"
        :layout="pageLayout"
        :total="totalCount"
        background
      >
      </el-pagination>
    </p>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'

  export default {
    mixins: [ pagination ],
    props: {
      type: Number, // 判断多选还是单选
      chooseFlag: Boolean, // 判断是 选择分组/查看分组 false/true
      chooseGroupArr: Array,
      noChooseGroupArr: Array,
      applyScopeType: Number, // 判断是可用/不可用 1/2
    },
    data () {
      return {
        groupingName: '',
        tableData: [],
        allInfo: [],
        timer: '',
        rowInfo: {},
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      handleSelectionChange (val) {
        this.allInfo = val
      },

      // 获取列表数据
      getDataValues () {
        let params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          groupName: this.groupingName,
          chooseFlag: this.chooseFlag,
          groupIds: [],
        }
        // applyScopeType 判断是否为可用商品 1 可用 / 2 不可用
        if (this.applyScopeType === 1) {
          params.groupIds = [ ...this.chooseGroupArr ]
        } else if (this.applyScopeType === 2) {
          params.groupIds = [ ...this.noChooseGroupArr ]
        }

        api.groupPage(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            this.tableData = res.resultList
          }
        })
      },

      // 删除
      deleteInfo (row) {
        this.$emit('delete', row)
        // let params =
        //   "couponId=" + this.$route.query.id + "&appointId=" + row.groupId;
        // api.couponSpuDelete(params).then(res => {
        //   if (res) {
        //     this.$emit("delete", row);
        //     this.$message({
        //       message: "删除成功",
        //       type: "success"
        //     });
        //   }
        // });
      },

      // 删除后刷新数据
      getInfo (data) {
        let params = {
          chooseFlag: this.chooseFlag,
          currentPage: this.current,
          pageSize: this.pagesize,
          groupName: this.groupingName,
          groupIds: [],
        }
        params.groupIds = [ ...data ]
        api.groupPage(params).then(res => {
          if (res) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.totalCount = res.totalCount
            this.tableData = res.resultList
          }
        })
      },
    },
    watch: {
      groupingName (n, l) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getDataValues()
        }, 800)
      },
    },
  }
</script>
<style lang="less" scoped>
  .grouping-table {
    margin-top: 10px;

    .grouping-dialog-input {
      width: 300px;
      margin-bottom: 15px;
    }

    .close-icon {
      font-size: 16px;
      color: #1c7bef;
      cursor: pointer;
    }
  }
</style>
