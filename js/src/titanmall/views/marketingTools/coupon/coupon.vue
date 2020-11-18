<template>
  <div :class="{ coupon: true, main: !showClass }">
    <div v-if="isOpening">
      <p class="search-p">
        <span style="float:right">
          <el-button
            size="small"
            type="primary"
            @click="
              () => {
                // $router.push('/titanmall/marketing/couponedit');
                $router.push(routeUrl);
              }
            "
          >新建优惠券
          </el-button>
        </span>
        <span class="span-color z-label-size">优惠券名称：</span>
        <el-input
          v-model="formObj.value"
          size="small"
          style="width: 200px"
          placeholder="请输入优惠券名称"
        ></el-input>
        <span class="span-color z-label-size ml-20">优惠券状态：</span>
        <el-select
          v-model="formObj.selectValue"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          class="ml-20" size="small" type="primary" @click="searchBtn"
        >查询
        </el-button
        >
        <el-button size="small" @click="clearBtn">重置</el-button>
      </p>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="操作" width="170">
          <template slot-scope="scoped">
            <el-button type="text" @click="getInfo(scoped.row)">数据</el-button>
            <el-button
              type="text"
              @click="editInfo(scoped.row)"
              v-if="scoped.row.status === 0 || scoped.row.status === 1"
            >编辑
            </el-button
            >
            <el-button
              type="text"
              @click="
                () => {
                  stopDialog = true;
                  sendId = scoped.row.id;
                }
              "
              v-if="scoped.row.status === 1"
            >失效
            </el-button
            >
            <el-button
              type="text"
              @click="
                () => {
                  sendDialog = true;
                  sendId = scoped.row.id;
                }
              "
              v-if="scoped.row.status === 0"
            >发放
            </el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="name" label="优惠券名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="statusTxt" label="优惠券状态" width="100">
        </el-table-column>
        <el-table-column
          prop="preferentialAmount"
          label="优惠券金额(元)"
          width="120"
        >
          <!--<template slot-scope="scope">
            {{ scope.row.preferentialAmount | priceInfo }}
          </template>-->
        </el-table-column>
        <el-table-column prop="thresholdValue" label="使用门槛" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.thresholdValue === '0.00'">
              无限制
            </span>
            <span v-else> 满{{ scope.row.thresholdValue }}可用 </span>
          </template>
        </el-table-column>
        <el-table-column prop="validEndTime" label="有效期" width="190">
        </el-table-column>
        <el-table-column prop="takeCount" label="已领取/剩余" width="120">
          <template slot-scope="scope">
            {{
            scope.row.takeCount +
            '/' +
            (scope.row.quota - scope.row.takeCount)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="usedCount" label="已使用" width="90">
        </el-table-column>
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
      <el-dialog
        title="效果数据"
        :visible.sync="dialogVisible"
        width="50%"
        class="dialog"
      >
        <p>
          <span class="span-color">优惠券名称：{{ couponName }}</span>
        </p>
        <div class="text-info">
          <div>
            <p>
              用券总成交额
              <el-tooltip
                effect="dark"
                content="使用该优惠券的订单付款总金额"
                placement="top"
              >
                <i class="el-icon-question question"></i>
              </el-tooltip>
            </p>
            <span class="text-span">¥ {{ dataObj.dealTotalAmount }}</span>
          </div>
          <div>
            <p>
              优惠总金额
              <el-tooltip
                effect="dark"
                content="使用该优惠券优惠的总金额"
                placement="top"
              >
                <i class="el-icon-question question"></i>
              </el-tooltip>
            </p>
            <span
              class="text-span"
            >¥ {{ dataObj.preferentialTotalAmount }}</span
            >
          </div>
          <div>
            <p>
              费效比
              <el-tooltip
                effect="dark"
                content="优惠总金额 / 用券总成交额"
                placement="top"
              >
                <i class="el-icon-question question"></i>
              </el-tooltip>
            </p>
            <span class="text-span">{{ dataObj.preferentialRate + '%' }}</span>
          </div>
          <div>
            <p>
              用券笔单价
              <el-tooltip
                effect="dark"
                content="用券总成交额 / 使用该优惠券的付款订单数"
                placement="top"
              >
                <i class="el-icon-question question"></i>
              </el-tooltip>
            </p>
            <span class="text-span">¥ {{ dataObj.orderCount }}</span>
          </div>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="stopDialog" width="30%" class="dialog">
        <template slot="title">
          <span>停止发券</span>
          <hr class="hr-color"/>
        </template>
        <p>
          停止发券后，买家之前领取的优惠券，在可用时间内还能继续使用，确认停止发券？
        </p>
        <p class="mt-20">
          <el-button
            size="small" type="primary" @click="stopBtn"
          >确 定
          </el-button
          >
          <el-button size="small" @click="stopDialog = false">取 消</el-button>
        </p>
      </el-dialog>
      <el-dialog :visible.sync="sendDialog" width="30%" class="dialog">
        <template slot="title">
          <span>开始发券</span>
          <hr class="hr-color"/>
        </template>
        <p>
          立即开始发券，发券后买家可以从商品详情中进行领用，请仔细检查优惠券的设置内容，一旦领用无法取消。确定开始发券？
        </p>
        <p class="mt-20">
          <el-button
            size="small" type="primary" @click="sendBtn"
          >确 定
          </el-button
          >
          <el-button size="small" @click="sendDialog = false">取 消</el-button>
        </p>
      </el-dialog>
    </div>
    <div v-else style="text-align:center">
      <h2>请开通商城</h2>
    </div>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'
  import publicApi from '@/titanmall/components/public'
  import shopApi from '@/titanmall/components/api'

  export default {
    mixins: [ pagination ],
    props: { // 营销管理工作站有引入，如果传入有就是营销工作站，否则商城工作站
      routeUrl: {
        type: String,
        default: '/titanmall/marketing/couponedit'
      }
    },
    data () {
      return {
        api,
        formObj: {
          value: '',
          selectValue: '',
        },
        options: [
          {
            value: '',
            label: '全部',
          },
          {
            value: '0',
            label: '未开始',
          },
          {
            value: '1',
            label: '进行中',
          },
          {
            value: '2',
            label: '已结束',
          },
        ],
        tableData: [],
        dialogVisible: false,
        stopDialog: false,
        sendDialog: false,
        loading: false,
        sendId: '',
        dataObj: {
          orderCount: '',
          dealTotalAmount: '',
          preferentialTotalAmount: '',
          preferentialRate: '',
        },
        couponName: '',
        isOpening: true,
      }
    },
    computed: {
      showClass () {
        return this.$store.state.isExternal
      },
    },
    created () {
      // 判断是商城工作站还是营销工作站
      if (this.routeUrl.includes('card')) {
        let params = {
          config: {
            headers: {
              'x-channel': 'THC-PLATFORM-MANAGEMENT',
            },
          },
        }
        Promise.all([shopApi.list(), shopApi.authToken(params)]).then(([arr, cdnObj]) => {
          this.isOpening = !!arr.length
          this.isOpening && localStorage.setItem('MALLSHOPID', arr[0].token)
          cdnObj && cdnObj.cdn && localStorage.setItem('IMGCDN', cdnObj.cdn)
        })
      }
    },
    mounted () {
      this.getDataValues()
    },
    methods: {
      // 获取数据
      getDataValues () {
        this.loading = true
        let params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          name: this.formObj.value,
          status: this.formObj.selectValue,
        }
        this.api.couponPage(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            res.resultList.forEach(item => {
              item.preferentialAmount = publicApi.narrowPrice(
                item.preferentialAmount,
                100,
              )
              item.thresholdValue = publicApi.narrowPrice(item.thresholdValue, 100)
            })
            this.tableData = res.resultList
            this.loading = false
          }
        })
      },

      // 查询
      searchBtn () {
        this.current = 1
        this.getDataValues()
      },

      // 重置
      clearBtn () {
        this.current = 1
        this.formObj.value = ''
        this.formObj.selectValue = ''
        this.getDataValues()
      },

      // 数据
      getInfo (row) {
        this.couponName = row.name
        this.dialogVisible = true
        this.api.couponStatistical(row.id).then(res => {
          if (res) {
            this.dataObj = { ...res }
            if (res.dealTotalAmount) {
              this.dataObj.orderCount = (
                res.dealTotalAmount /
                res.orderCount /
                100
              ).toFixed(2)
            } else {
              this.dataObj.orderCount = 0
            }
            this.dataObj.dealTotalAmount = publicApi.narrowPrice(
              this.dataObj.dealTotalAmount,
              100,
            )
            this.dataObj.preferentialTotalAmount = publicApi.narrowPrice(
              this.dataObj.preferentialTotalAmount,
              100,
            )
          }
        })
      },

      // 编辑
      editInfo (row) {
        let params = {
          ...this.formObj,
          current: this.current,
          pagesize: this.pagesize,
          id: row.id,
        }
        this.$router.push({ path: this.routeUrl, query: params })
      },

      // 停止发券
      stopBtn () {
        this.api.couponEnd(this.sendId).then(res => {
          if (res) {
            this.$message({
              message: '失效成功',
              type: 'success',
            })
            this.stopDialog = false
            this.getDataValues()
          }
        })
      },

      // 发券
      sendBtn () {
        this.api.couponBegin(this.sendId).then(res => {
          if (res) {
            this.$message({
              message: '发券成功',
              type: 'success',
            })
            this.sendDialog = false
            this.getDataValues()
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .coupon {
    background: #fff;
    padding: 20px;
    .search-p {
      margin-bottom: 20px;
      .z-label-size {
        font-size: 14px;
      }
    }

    .dialog {
      /deep/ .el-dialog .el-dialog__body {
        padding: 0 20px 10px !important;
      }

      .hr-color {
        border: 0;
        border-top: 1px solid #eee;
      }

      .text-info {
        margin: 10px 0;
        display: flex;
        padding: 20px;
        background: #f8f8f8;

        div {
          flex-grow: 1;
          box-sizing: border-box;
          padding-left: 25px;

          p {
            margin-bottom: 10px;

            .question {
              color: #ccc;
            }
          }
        }

        .text-span {
          font-size: 22px;
          color: #000;
        }
      }
    }

    .ml-20 {
      margin-left: 20px;
    }

    .mt-20 {
      margin-top: 20px;
    }
  }
</style>
