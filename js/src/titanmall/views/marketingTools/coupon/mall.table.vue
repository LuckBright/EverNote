<template>
  <div class="mall-table">
    <el-input
      v-model="mallValue"
      placeholder="搜索商品名称"
      size="mini"
      class="mall-dialog-input"
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
      <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="title-img-box">
            <div class="img-box">
              <img class="img-wd"
                   :src="scope.row.picture.includes('http') ? scope.row.picture : imgCdn + scope.row.picture"/>
            </div>
            <div class="label-box">
              <el-button
                :disabled="isDisabled"
                class="goods-btn"
                type="text"
                @click="goEdit(scope.row)"
              >{{ scope.row.goodsName }}
              </el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160px"
      ></el-table-column>
    </el-table>
    <el-table v-if="type === 2" :data="tableData" border style="width: 100%">
      <el-table-column width="40px">
        <template slot-scope="scope">
          <i
            class="iconfont close-icon"
            @click="deleteInfo(scope.$index, scope.row)"
          >&#xe6e7;</i
          >
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="title-img-box">
            <div class="img-box">
              <img class="img-wd" :src="scope.row.picture.includes('http') ? scope.row.picture : imgCdn + scope.row.picture"/>
            </div>
            <div class="label-box">
              <el-button
                :disabled="isDisabled"
                class="goods-btn"
                type="text"
                @click="goEdit(scope.row)"
              >{{ scope.row.goodsName }}
              </el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160px"
      ></el-table-column>
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
  import api from '../api'
  import pagination from '@/titanmall/mixins/pagination'

  export default {
    props: [ 'type', 'isTrue', 'cloneArr', 'noUse', 'applyScopeType' ],
    mixins: [ pagination ],
    data () {
      return {
        api,
        allArr: [],
        mallValue: '',
        timer: '',
        imgCdn: localStorage.getItem('IMGCDN'),
      }
    },
    computed: {
      isDisabled () {
        return this.$store.state.isExternal
      },
    },
    created () {
      this.getDataValues(this.isTrue)
    },
    methods: {
      // 获取数据
      getDataValues (isTrue) {
        // isTrue 判断是选择商品或查看详情 true 查看详情/ false 选择商品
        this.tableData = []

        //  type 切换分页时判断是选择商品或查看详情 1 选择商品/ 2 查看详情

        if (this.type === 1) {
          isTrue = false
        } else if (this.type === 2) {
          isTrue = true
        }
        let params = {
          currentPage: this.current,
          goodsName: this.mallValue,
          pageSize: this.pagesize,
          chooseFlag: isTrue,
          spuIds: [],
        }
        if (this.applyScopeType === 1) {
          params.spuIds = [ ...this.cloneArr ]
        } else if (this.applyScopeType === 2) {
          params.spuIds = [ ...this.noUse ]
        }

        this.api.couponSpuPage(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            this.tableData = res.resultList
          }
        })
      },

      // 多选
      handleSelectionChange (val) {
        this.allArr = val
      },

      // 跳转详情页
      goEdit (row) {
        let obj = {
          id: row.spuId,
        }
        this.$router.push({ path: '/titanmall/goodsmain/goodsmanager/goodsedit', query: obj })
      },

      // 删除
      deleteInfo (index, row) {
        this.$emit('delete', row)
      },

      // 删除后刷新数据
      getInfo (data) {
        let params = {
          chooseFlag: this.isTrue,
          currentPage: this.current,
          goodsName: this.mallValue,
          pageSize: this.pagesize,
          spuIds: [],
        }
        params.spuIds = [ ...data ]
        this.api.couponSpuPage(params).then(res => {
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
      mallValue (n, v) {
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.current = 1
          this.pagesize = 20
          this.getDataValues(this.isTrue)
        }, 800)
      },
    },
  }
</script>
<style lang="less" scoped>
  .mall-table {
    margin-top: 10px;
  }

  .close-icon {
    font-size: 16px;
    color: #1c7bef;
    cursor: pointer;
  }

  .title-img-box {
    display: flex;

    .img-box {
      width: 60px;
      height: 60px;

      .img-wd {
        width: 100%;
        height: 100%;
      }
    }

    .label-box {
      flex-grow: 1;
      width: 80%;
      margin-left: 20px;

      .goods-btn {
        width: 100%;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .mall-dialog-input {
    width: 300px;
    margin-bottom: 15px;
  }
</style>
