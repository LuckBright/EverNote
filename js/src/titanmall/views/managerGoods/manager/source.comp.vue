<template>
  <div class="z-source">
    <div class="region source-comp">
      <p class="top-btn">
        <span>预约模板设置</span>
        <el-button
          class="add-btn"
          size="small"
          type="primary"
          @click="addCompBtn"
        >添加模板
        </el-button
        >
      </p>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        border
      >
        <el-table-column prop="name" label="模板名称"></el-table-column>
        <el-table-column prop="tempType" label="模板类型">
          <template slot-scope="scoped">
            {{ tempTypeObj[scoped.row.tempType] }}
          </template>
        </el-table-column>
        <el-table-column prop="timeType" label="预约时间类型">
          <template slot-scope="scoped">
            {{ timeTypeObj[scoped.row.timeType] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              type="text"
              @click="
                () => {
                  rowObj = { ...scoped.row };
                  dialogVisible = true;
                }
              "
            >删除
            </el-button
            >
            <el-button
              type="text" @click="editClickBtn(scoped.row)"
            >编辑
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
    </div>
    <el-dialog title="删除预约模板" :visible.sync="dialogVisible" width="30%">
      是否删除<span class="delete-name">{{ rowObj.name }}?</span
    >删除后不会对已经预约的客户产生影响，使用当前预约模板的服务商品，会自动变为不使用服务预约。
      <p class="mt15">
        <el-button
          type="primary" size="small" @click="deleteClickBtn"
        >确 定
        </el-button
        >
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'

  export default {
    mixins: [ pagination ],
    data () {
      return {
        tableData: [],
        tempTypeObj: {
          0: '周模板',
          1: '日历模板',
        },
        timeTypeObj: {
          0: '日期',
          1: '日历',
        },
        dialogVisible: false,
        rowObj: {},
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      getDataValues () {
        let params = {
          currentPage: this.current,
          pageSize: this.pagesize,
        }
        api.appointList(params).then(res => {
          this.totalCount = res.totalCount
          this.tableData = res.resultList
        })
      },

      // 添加模板
      addCompBtn () {
        this.$router.push({ path: '/titanmall/goodsmain/goodsmanager/sourcedetail' })
      },

      // 编辑
      editClickBtn (row) {
        api.appointGetById({ id: row.id }).then(res => {
          if (res) {
            this.$router.push({
              path: '/titanmall/goodsmain/goodsmanager/sourcedetail',
              query: { form: JSON.stringify(res) },
            })
          }
        })
      },

      // 删除
      deleteClickBtn () {
        api.appointDelete({ id: this.rowObj.id }).then(res => {
          if (res) {
            this.$message.success('删除成功')
            this.getDataValues()
            this.dialogVisible = false
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .z-source{
    margin: 10px;
    overflow: scroll;
  }
  .source-comp {

    .top-btn {
      margin-bottom: 20px;

      .add-btn {
        float: right;
      }
    }

    .mt15 {
      margin-top: 15px;
    }
  }

  .delete-name {
    display: inline-block;
    margin: 0 10px;
  }
</style>
