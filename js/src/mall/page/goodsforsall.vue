<template>
  <div id="mall">
    <el-row class="top">
      <el-col :span="24">
        <span class="title">待出售的商品</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="23" align="right"><el-button type="text" @click="batchOnLine()">批量上架</el-button></el-col>
    </el-row>
    <el-table
      :data="tableData"
      ref="multipleTable"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop=""
        label="商品编号"
        width="180">
        <template slot-scope="scope">
          {{scope.row.productSkus.length ? scope.row.productSkus[0].sn : '--'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="image"
        label="商品图片"
        width="180">
        <template slot-scope="scope">
          <div class="avatar">
            <el-image v-if="scope.row.images" :src="`${$ever.fileUrl2}${scope.row.images.split('#')[0]}`" :preview-src-list="scope.row.images.split('#')"></el-image>
            <el-image v-else src=""></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称">
        <template slot-scope="scope">
          <div>
            <router-link :to="'/card/malldetails/'+scope.row.id">{{scope.row.name}}</router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="商品分类">
        <template slot-scope="scope">
          {{scope.row.parentCategory ? scope.row.parentCategory.name : '-'}} > {{scope.row.productCategory ? scope.row.productCategory.name : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="salePrice"
        label="商城价">
      </el-table-column>
      <el-table-column
        prop=""
        label="库存">
        <template slot-scope="scope">
          {{scope.row.productSkus.length > 0 ? scope.row.productSkus[0].restStockNum : '充足'}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="status"
        label="状态">
      </el-table-column> -->
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleOnLine(scope.row)">上架</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="">
      <el-col :span="24" align="center">
        <ever-pagination
          justify="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount" :current="current">
        </ever-pagination>
      </el-col>
    </el-row>
    <el-dialog
      title="上架"
      :visible.sync="dialogVisible"
      width="30%">
      <p style="line-height:1.5">确认将该商品上架？</p>
      <p style="line-height:1.5">上架商品将在商城中展示</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onLine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../store/goosforsallapi'
  import utillist from '../../util/list'
  let querySchema = [
    {
      name: 'firstCategory',
      label: '商品分类',
      type: 'select',
      options: []
    },
    {
      name: 'childCategoryId',
      label: '',
      type: 'select',
      options: []
    },
    {
      name: 'name',
      label: '商品名称',
      placeholder: '请输入商品名称'
    }
  ]
  export default {
    mixins: [utillist],
    data () {
      let obj = this.$ever.createObjFromSchema(querySchema)
      obj.productCategoryId = ''
      return {
        api: api,
        totalCount: 0,
        dialogVisible: false,
        tableData: [],
        multipleSelection: [],
        querySchema: querySchema,
        queryObj: obj,
        id: ''
      }
    },
    created () {
      api.getByLevel({parentId: 1}).then(result => {
        this.menuUl = result.data
        this.$ever.getFieldFromSchema(this.querySchema, 'firstCategory').options = result.data
        this.queryObj.productCategory = ''
      })
      api.list().then(result => {
        this.tableData = result.data.resultList
        this.totalCount = result.data.totalCount
        this.$forceUpdate()
      })
    },
    methods: {
      handleOnLine (obj) {
        this.dialogVisible = true
        this.id = obj.id
      },
      handleEdit (obj) {
        this.$router.push('/card/goodsforsalledit/' + obj.id)
      },
      batchOnLine () {
        let ids = []
        this.multipleSelection.map(item => {
          ids.push(item.id)
        })
        if (ids.length === 0) {
          this.$message({
            message: '没有选择上架商品',
            type: 'warning'
          })
          return false
        }
        api.batchOnLine(ids).then(result => {
          this.list()
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      onLine () {
        api.onLine(this.id).then(result => {
          this.dialogVisible = false
          api.list({status: '1'}).then(result => {
            this.tableData = result.data.resultList
            this.totalCount = result.data.totalCount
          })
        })
      }
    },
    watch: {
      'queryObj.firstCategory': {
        handler (cur, old) {
          this.queryObj.productCategoryId = ''
          if (cur) {
            api.getByLevel({parentId: cur}).then(result => {
              if (result.data.length > 0) {
                this.menuUl = result.data
                this.$ever.getFieldFromSchema(this.querySchema, 'childCategoryId').options = result.data
                this.queryObj.childCategoryId = result.data[0].id
                this.queryObj.productCategoryId = result.data[0].id
              } else {
                this.menuUl = result.data
                this.$ever.getFieldFromSchema(this.querySchema, 'childCategoryId').options = []
                this.queryObj.childCategoryId = ''
                this.queryObj.productCategoryId = cur
              }
            })
          } else {
            this.queryObj.productCategory = ''
          }
        }
      },
      'queryObj.childCategoryId': {
        handler (cur, old) {
          this.queryObj.productCategoryId = ''
          if (cur) {
            this.queryObj.productCategoryId = cur
          }
        }
      }
    },
    components: {
      // menuNav
    }
  }
</script>
<style scoped="scoped">
  .avatar{height: 90px;width: 120px;border-radius: 0;border: none;display: inline-block;}
  .avatar img{height: 90px;width: 120px;}
</style>
