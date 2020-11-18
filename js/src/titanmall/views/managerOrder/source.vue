<template>
  <div class="main layout_inner">
    <div class="region">
      <p class="mb15">
        <span class="span-color">姓名</span>
        <el-input
          v-model.trim="formObj.appointName"
          style="width:200px"
          size="small"
          placeholder="请输入姓名"
        ></el-input>
        <span class="span-color ml20">手机号</span
        >
        <el-input
          v-model.trim="formObj.appointPhone"
          style="width:200px"
          size="small"
          placeholder="请输入手机号"
        ></el-input>
        <span class="span-color ml20">预约日期</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          size="small"
        >
        </el-date-picker>
        <span class="span-color ml20">预约状态</span>
        <el-select
          v-model="formObj.appointStatus"
          size="small"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          @click="getDataValues"
          class="ml10"
          size="small"
          type="primary"
        >查询
        </el-button
        >
        <el-button size="small" @click="resetClickBtn">重置</el-button>
      </p>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="appointName" label="姓名">
          <template slot-scope="scoped">
            {{ scoped.row.appointName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="appointPhone" label="手机号">
          <template slot-scope="scoped">
            {{ scoped.row.appointPhone || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="预约时间">
          <template slot-scope="scoped">
            {{ scoped.row.appointDay + ' ' + (scoped.row.appointTime || '') }}
          </template>
        </el-table-column>
        <el-table-column label="服务名称">
          <template slot-scope="scoped">
            <el-button type="text" @click="goodsClickBtn(scoped.row)">{{
              scoped.row.goodsName
              }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="服务商名称">
          <template slot-scope="scoped">
            {{ scoped.row.serviceProviderName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="appointStatusTxt" label="预约状态">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped" v-if="scoped.row.appointStatus === 0">
            <el-button
              type="text"
              @click="
                () => {
                  rowObj = { ...scoped.row };
                  finishDialog = true;
                }
              "
            >到店
            </el-button
            >
            <el-button
              type="text"
              @click="
                () => {
                  rowObj = { ...scoped.row };
                  cancelDialog = true;
                }
              "
            >取消预约
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
    <el-dialog title="到店确认" :visible.sync="finishDialog" width="30%">
      确认<span class="delete-name">{{ rowObj.appointName }}</span
    ><span class="delete-name">{{ rowObj.appointPhone }}</span
    >已经到店？
      <p class="mb15">
        <el-button type="primary" size="small" @click="finish">确 定</el-button>
        <el-button size="small" @click="finishDialog = false">取 消</el-button>
      </p>
    </el-dialog>
    <el-dialog title="取消预约" :visible.sync="cancelDialog" width="30%">
      确认<span class="delete-name">{{ rowObj.appointName }}</span
    ><span class="delete-name">{{ rowObj.appointPhone }}</span
    >取消预约？
      <p class="mb15">
        <el-button type="primary" size="small" @click="cancel">确 定</el-button>
        <el-button size="small" @click="cancelDialog = false">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from './api'

  export default {
    mixins: [ pagination ],
    data () {
      return {
        formObj: {
          appointStatus: '',
          appointPhone: '',
          appointName: '',
          appointEndDay: '',
          appointStartDay: '',
        },
        date: [],
        tableData: [],
        options: [
          {
            label: '已预约',
            value: 0,
          },
          {
            label: '已完成',
            value: 1,
          },
          {
            label: '已取消',
            value: 2,
          },
        ],
        rowObj: {},
        finishDialog: false,
        cancelDialog: false,
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      // 获取列表数据
      getDataValues () {
        let params = {
          ...this.formObj,
          currentPage: this.current,
          pageSize: this.pagesize,
        }
        params.appointStartDay =
          this.date && this.date.length ? this.date[0] + ' 00:00:00' : ''
        params.appointEndDay =
          this.date && this.date.length ? this.date[1] + ' 23:59:59' : ''
        api.appointRecordPage(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            this.tableData = res.resultList
          }
        })
      },

      // 重置
      resetClickBtn () {
        this.formObj = {
          appointStatus: '',
          appointPhone: '',
          appointName: '',
          appointEndDay: '',
          appointStartDay: '',
        }
        this.current = 1
        this.getDataValues()
      },

      // 服务名称跳转
      goodsClickBtn (row) {
        let obj = {
          id: row.orderId,
          orderType: 1,
        }
        this.$router.push({
          path: '/titanmall/ordermain/manager/orderdetails',
          query: obj,
        })
      },

      // 到店
      finish () {
        api.appointRecordFinish({ id: this.rowObj.id }).then(res => {
          if (res === 1) {
            this.$message.success('操作成功')
          } else {
            this.$message.warning('状态已变更')
          }
          this.getDataValues()
          this.finishDialog = false
        })
      },

      // 取消预约
      cancel () {
        api.appointRecordCancel({ id: this.rowObj.id }).then(res => {
          if (res === 2) {
            this.$message.success('操作成功')
          } else {
            this.$message.warning('状态已变更')
          }
          this.getDataValues()
          this.cancelDialog = false
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .delete-name {
    display: inline-block;
    margin: 0 10px;
  }
</style>
