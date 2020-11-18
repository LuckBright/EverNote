<template>
  <div class="details-box">
    <ever-form2
      class="schema"
      :schema="schema"
      size="small"
      v-model="schemaObj"
      labelWidth="70px"
    >
      <div slot="default"></div>
      <template slot="button">
        <el-button type="primary" @click="searchBtn">查询</el-button>
        <el-button @click="goEdit">发布商品</el-button>
      </template>
    </ever-form2>
    <template>
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        border
      >
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="searchType === 2"
              @click="deleted(scope.row)"
            >删除
            </el-button
            >
            <el-button type="text" @click="goEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="searchType === 1"
              type="text"
              @click="lowerShelf(scope.row)"
            >下架
            </el-button
            >
            <el-button
              v-else type="text" @click="upperShelf(scope.row)"
            >上架
            </el-button
            >
            <el-button
              type="text" @click="dialogLink(scope.row)"
            >商品链接
            </el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品"
          show-overflow-tooltip
          min-width="200"
        >
          <template slot-scope="scope">
            <div class="title-img-box">
              <div class="img-box">
                <img
                  class="img-wd"
                  :src="scope.row.picture.includes('http') ? scope.row.picture : imgCdn + scope.row.picture"/>
              </div>
              <div class="label-box">
                <el-button
                  class="goods-btn"
                  type="text"
                  @click="goEdit(scope.row)"
                >{{ scope.row.name }}
                </el-button
                >
                <div class="span-color">
                  <span>￥</span>{{ scope.row.price }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sid" label="序号" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.sid }}</span>
            <el-button
              type="text"
              style="margin-left: 20px"
              @click="
                () => {
                  rowId = scope.row.id;
                  newSid = scope.row.sid;
                  upDateSid = true;
                }
              "
            >修改
            </el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="trafficVolume"
          label="访问量"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="stockNum"
          label="库存"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="totalSalesVolume"
          label="总销量"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="170"
        ></el-table-column>
      </el-table>
    </template>
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
    <el-dialog title="商品链接" :visible.sync="dialogVisible" width="30%">
      <p style="margin-bottom: 20px">{{ linkObj.title }}</p>
      <el-input
        type="textarea"
        :disabled="true"
        :rows="2"
        v-model="linkObj.url"
      ></el-input>
      <p style="margin-top: 20px">
        <el-button
          type="primary"
          v-clipboard:copy="linkObj.url"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >复制链接
        </el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </p>
    </el-dialog>
    <el-dialog title="修改商品序号" :visible.sync="upDateSid" width="30%">
      <el-input
        v-model.number="newSid"
        maxlength="18"
        oninput="value=value.replace(/[^\d]/, '')"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upDateSidBtn">确 定</el-button>
        <el-button @click="upDateSid = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import schema from './schema'
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'

  export default {
    mixins: [ pagination ],
    props: [ 'searchType' ],
    data () {
      let schemaObj = this.$ever.createObjFromSchema(schema)
      return {
        api,
        schema,
        schemaObj,
        tableData: [],
        dialogVisible: false,
        linkObj: {
          title: '',
          url: '',
        },
        loading: false,
        upDateSid: false,
        rowId: '',
        newSid: '',
        imgCdn: localStorage.getItem('IMGCDN'),
      }
    },
    created () {
      let isLoad = +localStorage.getItem('isLoad')
      if (isLoad) {
        this.schemaObj.type = ''
        this.schemaObj.stockType = ''
      } else {
        if (this.$route.query && this.$route.query.current) {
          let result = this.$route.query
          this.current = Number(result.current)
          this.offset = Number(result.offset)
          this.pagesize = Number(result.pagesize)
          this.schemaObj = JSON.parse(result.params)
        }
      }
      this.getGroupList()
      this.getDataValues()
    },
    methods: {
      // 获取列表数据
      getDataValues () {
        this.loading = true

        let params = {
          ...this.schemaObj,
          searchType: this.searchType,
          currentPage: this.current,
          pageSize: this.pagesize,
        }
        params.minPrice = this.schemaObj.minPrice
          ? this.schemaObj.minPrice * 100
          : this.schemaObj.minPrice
        params.maxPrice = this.schemaObj.maxPrice
          ? this.schemaObj.maxPrice * 100
          : this.schemaObj.maxPrice
        this.api.spuList(params).then(res => {
          this.totalCount = res.totalCount
          res.resultList.forEach(items => {
            items.price = this.$_narrowPrice(items.price, 100)
          })
          this.tableData = res.resultList
          this.loading = false
        })
      },
      open (data) {
        this.$confirm(data.name, '下架', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
        })
          .then(() => {
            setTimeout(() => {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
            }, 3000)
          })
          .catch(() => {
          })
      },
      /**
       * 编辑
       */
      goEdit (row) {
        let params = JSON.stringify(this.schemaObj)
        let obj = {
          params,
          offset: this.offset,
          current: this.current,
          pagesize: this.pagesize,
          id: row.id,
        }
        localStorage.setItem('isLoad', 0)
        this.$router.push({
          path: '/titanmall/goodsmain/goodsmanager/goodsedit',
          query: obj,
        })
      },

      // 查询
      searchBtn () {
        this.current = 1
        this.getDataValues()
      },

      /**
       * 商品链接
       */
      dialogLink (row) {
        let url = this.$ever.mallHost + this.$ever.h5MallIndex + '/goods?id=' + row.id + '&shop=' + localStorage.getItem('MALLSHOPID')
        this.dialogVisible = true
        this.linkObj.url = url
      },
      /**
        下架
       */
      lowerShelf (row) {
        this.$confirm('是否下架 ' + row.name, '下架商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.api.spuLowerShelf(row.id).then(res => {
              if (res) {
                this.$message({
                  message: '下架成功',
                  type: 'success',
                })
                this.getDataValues()
              }
            })
          })
          .catch(() => {
          })
      },
      /**
       上架
       */
      upperShelf (row) {
        this.$confirm('是否上架 ' + row.name, '上架商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.api.spuUpperShelf(row.id).then(res => {
              if (res) {
                this.$message({
                  message: '上架成功',
                  type: 'success',
                })
                this.getDataValues()
              }
            })
          })
          .catch(() => {
          })
      },
      /**
       删除商品
       */
      deleted (row) {
        this.$confirm('是否删除 ' + row.name, '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.api.spuDelete(row.id).then(res => {
              if (res) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                })
                this.getDataValues()
              }
            })
          })
          .catch(() => {
          })
      },

      // 修改序号
      upDateSidBtn () {
        let params = {
          id: this.rowId,
          sid: +this.newSid,
        }
        this.api.spuUpdateSidBySpuId(params).then(res => {
          if (res) {
            this.$message({
              message: '修改成功',
              type: 'success',
            })
            this.upDateSid = false
            this.getDataValues()
          }
        })
      },

      // 复制链接
      onCopy (e) {
        this.$message({
          message: '复制成功',
          type: 'success',
        })
        this.dialogVisible = false
      },
      onError (e) {
        this.$message.error('复制失败')
      },

      // 获取分组下拉列表
      async getGroupList () {
        let arr = await this.api.groupListBySpuGroupBox()
        if (arr && arr.length) {
          let newArr = arr.map(item => {
            item.value = item.id
            return item
          })
          newArr.unshift({
            value: '',
            name: '全部',
          })
          this.$ever.getFieldFromSchema(
            this.schema,
            'groupId',
          ).props.options = newArr
        } else {
          this.$ever.getFieldFromSchema(this.schema, 'groupId').props.options = [
            {
              value: '',
              name: '全部',
            },
          ]
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .details-box {
    /deep/ .schema {
      .el-row:first-child {
        .el-col.el-col-10 {
          .el-form-item .el-input {
            width: 95%;
          }
        }
      }

      .el-row:first-child {
        .el-col.el-col-6 {
          .el-form-item .el-select {
            width: 100%;
          }
        }
      }
    }
  }

  .title-img-box {
    display: flex;

    .img-box {
      flex-shrink: 0;
      width: 60px;
      height: 60px;

      .img-wd {
        width: 100%;
        height: 100%;
      }
    }

    .label-box {
      flex-shrink: 1;
      flex-grow: 1;
      width: 60%;
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
</style>
