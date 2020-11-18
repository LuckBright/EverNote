<template>
  <div id="mall">
    <el-row class="top">
      <el-col :span="24">
        <span class="title">发布商品</span>
      </el-col>
    </el-row>
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      ref="form"
      :inline="true"
      :is-query="true"
      v-ever-bind-enter
      @query="list(true)"
    >
    </ever-form2>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="specValue"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="restStockNum"
        label="库存">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleOffLine(scope.row)">关联至商城</el-button>
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
      title="关联至商城"
      :visible.sync="dialogVisible"
      width="800px">
      <ever-form2
        ref="form"
        :schema="schema"
        v-model="obj1"
        :rules="rules"
        :api="api"
        :span="12"
        label-position="right">
        <template slot="specValue">
          <span>{{obj1.specValue}}</span>
        </template>
        <template slot="fixSalePrice">
          <el-checkbox v-model="obj1.fixSalePrice">储值卡请填写最小储值门槛</el-checkbox>
        </template>
        <template slot="default">
          <el-col>
            <el-button type="primary" @click="saveToMall">保存</el-button>
          </el-col>
        </template>
      </ever-form2>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../store/goodspublicapi'
  import utillist from '../../util/list'
  let querySchema = [
    {
      name: 'productType',
      label: '商品渠道',
      comp: 'sys-type',
      props: {
        code: 'THC_MALL_PLATFORM_TYPE',
        clearable: false,
        useValue: 'value'
      }
    },
    {
      name: 'productName',
      label: '商品名称',
      props: {
        placeholder: '请输入商品名称'
      }
    }
  ]
  var schema = [
    {
      name: 'name',
      label: '商品名称',
      comp: 'readonlyitem',
      span: 24
    },
    {
      name: 'specValue',
      label: '规格',
      comp: 'custom',
      span: 24
    },
    {
      name: 'restStockNum',
      label: '库存',
      comp: 'readonlyitem',
      span: 24
    },
    {
      name: 'comment',
      label: '商品描述',
      comp: 'readonlyitem',
      span: 24
    },
    {
      name: 'salePrice',
      label: '商品价',
      comp: 'ever-price',
      props: {
        placeholder: '商品价',
        numberType: 'number',
        max: 999999
      },
      span: 12
    },
    {
      name: 'fixSalePrice',
      label: '',
      comp: 'custom',
      span: 12
    },
    {
      name: 'incomeType',
      label: '财务分类',
      comp: 'sys-type',
      props: {
        code: 'THC_RCM_MALL_FIN_TYPE',
        useValue: true
      },
      span: 24
    }
  ]
  export default {
    mixins: [utillist],
    data () {
      var rules = {
        salePrice: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        incomeType: [
          { required: true, message: '必填项', trigger: 'change', type: 'string' }
        ]
      }
      let obj = this.$ever.createObjFromSchema(querySchema)
      var obj1 = this.$ever.createObjFromSchema(schema)
      obj.productType = '2'
      obj1.fixSalePrice = false
      return {
        api: api,
        totalCount: 0,
        dialogVisible: false,
        tableData: [],
        multipleSelection: [],
        schema,
        obj1: obj1,
        querySchema: querySchema,
        queryObj: obj,
        product: '',
        id: '',
        rules
      }
    },
    created () {},
    methods: {
      saveToMall () {
        if (this.obj1.type === 1) {
          if (this.obj1.salePrice < this.obj1.minPrice) {
            this.$message({
              message: '商品价不能小于' + this.obj1.minPrice,
              type: 'warning'
            })
            return false
          }
        }
        let params = {
          type: this.queryObj.productType,
          name: this.obj1.name,
          salePrice: this.obj1.salePrice,
          thirdId: this.product.thirdId,
          fixSalePrice: this.obj1.fixSalePrice,
          incomeType: this.obj1.incomeType
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            api.associate(params).then(result => {
              if (result.head.errCode === 0) {
                this.$router.push('/card/goodsforsall')
              }
            })
          }
        })
      },
      handleOffLine (obj) {
        this.product = obj
        this.obj1.name = obj.name
        this.obj1.specValue = obj.specValue
        this.obj1.restStockNum = obj.restStockNum
        this.obj1.comment = obj.comment
        this.obj1.incomeType = obj.incomeType
        this.obj1.type = obj.type
        this.obj1.minPrice = obj.salePrice
        this.dialogVisible = true
      }
      // list (queryObj) {
      //   let params = Object.assign({}, this.queryObj)
      //   params.page = this.current // 兼容需要page作为分页参数的接口
      //   params.offset = this.offset
      //   params.pagesize = this.pagesize
      //   api.list(params).then(result => {
      //     if (result.data) {
      //       this.tableData = result.data.resultList
      //       this.totalCount = result.data.totalCount
      //     } else {
      //       this.tableData = []
      //       this.totalCount = 0
      //     }
      //   })
      // }
    },
    watch: {
    },
    components: {
      // menuNav
    }
  }
</script>

