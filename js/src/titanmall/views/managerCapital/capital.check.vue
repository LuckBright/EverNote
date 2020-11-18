<template>
  <div class="main layout_inner">
    <div class="region">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="验证核销" name="first">
          <p class="search-p">
            <span>服务码</span>
            <el-input
              v-model="searchInput"
              placeholder="请输入服务信息"
              size="small"
              class="search-input"
            ></el-input>
            <el-button
              type="primary" class="lf" size="small" @click="getSevrce"
            >查询
            </el-button
            >
          </p>
          <el-table :data="tableData" border>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status === 0"
                  type="text"
                  @click="
                    () => {
                      rowInfo = scope.row;
                      validationRemark = '';
                      dialogVisible = true;
                    }
                  "
                >使用核销
                </el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="validationCode"
              label="服务码"
            ></el-table-column>
            <el-table-column
              prop="expiryTime"
              label="有效期截止时间"
            ></el-table-column>
            <el-table-column
              prop="statusTxt"
              label="服务码状态"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="核销记录" name="second">
          <p class="search-p">
            <span>服务码</span>
            <el-input
              v-model="validationCode"
              placeholder="请输入已核销的服务码信息"
              size="small"
              class="search-input"
            ></el-input>
            <el-button
              type="primary" class="lf" size="small" @click="searchBtn"
            >查询
            </el-button
            >
          </p>
          <el-table :data="logTableData" v-loading="loading" border>
            <el-table-column
              prop="validationCode"
              label="服务码"
            ></el-table-column>
            <el-table-column prop="expiryTime" label="有效期截止时间">
              <template slot-scope="scope">
                {{ scope.row.expiryTime || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="validationTime"
              label="核销时间"
            ></el-table-column>
            <el-table-column
              prop="validationPersonnelName"
              label="核销员"
            ></el-table-column>
            <el-table-column label="核销备注" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                {{ scope.row.validationRemark || '--' }}
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
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        title="使用核销"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>核销后服务码将会变为‘已使用’状态，是否确认核销？</span>
        <el-input
          v-model.trim="validationRemark"
          size="small"
          placeholder="填写核销备注后会显示在订单信息中"
          class="dialog-input"
          type="textarea"
          :rows="2"
          maxlength="50"
        ></el-input>
        <p>
          <el-button
            size="small" type="primary" @click="validation"
          >确 定
          </el-button
          >
          <el-button
            size="small" @click="dialogVisible = false"
          >取 消
          </el-button
          >
        </p>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import api from './api'
  import pagination from '@/titanmall/mixins/pagination'

  export default {
    mixins: [ pagination ],
    data () {
      return {
        api,
        activeName: 'first',
        searchInput: '',
        tableData: [],
        validationCode: '',
        logTableData: [],
        loading: false,
        dialogVisible: false,
        rowInfo: '',
        validationRemark: '',
      }
    },
    created () {
      if (this.activeName === 'second') {
        this.getList()
      }
    },
    methods: {
      handleClick (e) {
        if (e.name === 'second') this.getList()
      },
      /**
       获取核销记录
       */
      getList () {
        this.loading = true
        let params = {
          validationCode: this.validationCode,
          currentPage: this.current,
          pageSize: this.pagesize,
        }
        this.api.validationRecord(params).then(res => {
          if (res) {
            this.logTableData = res.resultList
            this.totalCount = res.totalCount
          }
          this.loading = false
        })
      },
      /**
       搜索服务码
       */
      getSevrce () {
        this.api.serviceSearch(this.searchInput).then(res => {
          this.tableData = []
          if (res) {
            this.tableData.push(res)
          }
        })
      },
      /**
       使用核销
       */
      validation () {
        let params = `serviceId=${ this.rowInfo.id }&validationRemark=${ this.validationRemark }`
        this.api.serviceValidation(params).then(res => {
          if (res) {
            this.$message({
              message: '核销成功',
              type: 'success',
            })
            this.getSevrce()
            this.dialogVisible = false
          }
        })
      },

      // 核销记录搜索
      searchBtn () {
        this.current = 1
        this.getList()
      },
    },
  }
</script>
<style lang="less" scoped>
  .search-p {
    margin-bottom: 10px;
  }

  .lf {
    margin-left: 20px;
  }

  .search-input {
    margin-left: 10px;
    width: 217px;
  }

  .dialog-input {
    margin: 10px 0;
  }
</style>
