<template>
  <div id="mall">
    <el-row class="top">
      <el-col :span="24">
        <span class="title" @click="prevPage"><i class="el-icon-arrow-left"></i>编辑</span>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <div class="clearfix">
        <el-button style="float: right; padding: 3px 0" type="text" @click="showHis">历史日志</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <ever-form2
            ref="form"
            :schema="schema"
            v-model="obj"
            v-if="!editBasic"
            :api="api"
            :span="12"
            label-position="right">
            <template slot="images">
              <div class="avatar" v-if="uploadImgUrl.length > 0">
                <el-image v-for="(item, i) in uploadImgUrl" :key="i" :src="`${$ever.fileUrl2}${item.url}`"></el-image>
              </div>
            </template>
            <template slot="comment">
              <div v-html="obj.comment"></div>
            </template>
            <template slot="default">
              <el-col>
                <el-button type="primary" @click="editBasicFn" v-if="obj.status != 0">编辑</el-button>
                <el-button type="primary" @click="generateGoods" v-if="obj.status == 0">生成新的商品</el-button>
              </el-col>
            </template>
          </ever-form2>
          <ever-form2
            v-else
            :schema="schemaBasic"
            v-model="objBasic"
            ref="basicForm"
            :rules="rules"
            :api="api"
            :span="12"
            label-position="right">
            <template slot="images">
              <ever-upload1 v-model="objBasic.images" :limit="6" split="#"></ever-upload1>
            </template>
            <template slot="default">
              <el-col>
                <el-button type="primary" @click="saveBasic">保存</el-button>
              </el-col>
            </template>
          </ever-form2>
        </el-tab-pane>
        <el-tab-pane label="价格" name="second">
          <ever-form2
            ref="form"
            :schema="schema1"
            v-if="!editPrice"
            v-model="obj1"
            :api="api"
            :span="12"
            label-position="right">
            <template slot="default">
              <el-col>
                <el-button type="primary" @click="editPriceFn">编辑</el-button>
              </el-col>
            </template>
          </ever-form2>
          <ever-form2
            ref="priceForm"
            :schema="schemaPrice"
            v-if="editPrice"
            v-model="objPrice"
            :rules="rules1"
            :api="api"
            :span="12"
            label-position="right">
            <template slot="fixSalePrice">
              <el-checkbox v-model="objPrice.fixSalePrice">储值卡请填写最小储值门槛</el-checkbox>
            </template>
            <template slot="default">
              <el-col>
                <el-button type="primary" @click="savePriceFn">保存</el-button>
              </el-col>
            </template>
          </ever-form2>
        </el-tab-pane>
        <el-tab-pane label="库存" name="third">
          <ever-form2
            ref="form"
            :schema="schema2"
            v-model="obj2"
            :api="api"
            :span="12"
            label-position="right">
            <template slot="default">
              <!-- <el-button type="primary" @click="savePriceFn">保存</el-button> -->
            </template>
          </ever-form2>
        </el-tab-pane>
        <el-tab-pane label="财务分类" name="fourth">
          <ever-form2
            ref="form"
            :schema="schema3"
            v-if="!editCategories"
            v-model="obj3"
            :api="api"
            :span="12"
            label-position="right">
            <template slot="incomeType">
              <sys-value type="THC_RCM_MALL_FIN_TYPE" :code="obj3.incomeType"></sys-value>
            </template>
            <template slot="default">
              <el-col>
                <el-button type="primary" @click="editCategoriesFn">编辑</el-button>
              </el-col>
            </template>
          </ever-form2>
          <ever-form2
            ref="categoriesForm"
            v-if="editCategories"
            :schema="schemaCategories"
            v-model="objCategories"
            :api="api"
            :span="12"
            :rules="rules2"
            label-position="right">
            <template slot="default">
              <el-col>
                <el-button type="primary" @click="saveCategoriesFn">保存</el-button>
              </el-col>
            </template>
          </ever-form2>
        </el-tab-pane>
        <el-tab-pane label="退货设置" name="fifth">
          <ever-form2
            ref="form"
            :schema="schema4"
            v-if="!editReturn"
            labelWidth="180px"
            v-model="obj4"
            :api="api"
            :span="12"
            label-position="right">
            <!-- <template slot="canReturn">
              {{this.obj4.canReturn ? '可以' : '不可以'}}
            </template> -->
            <template slot="default">
              <el-col>
                <el-button type="primary" @click="editReturnFn">编辑</el-button>
              </el-col>
            </template>
          </ever-form2>
          <ever-form2
            ref="form"
            :schema="schemaReturn"
            v-if="editReturn"
            labelWidth="180px"
            v-model="objReturn"
            :api="api"
            :span="12"
            label-position="right">
            <template slot="canReturn">
              <el-radio-group v-model="objReturn.canReturn">
                <el-radio :label="true">可以</el-radio>
                <el-radio :label="false">不可以</el-radio>
              </el-radio-group>
            </template>
            <template slot="default">
              <el-col>
                <el-button type="primary" @click="saveReturnFn">保存</el-button>
              </el-col>
            </template>
          </ever-form2>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <history-log ref="historyLogDialog"></history-log>
  </div>
</template>
<script>
  import api from '../store/goosforsallapi'
  import historyLog from './historylog'
  // import storage from '@/util/storage'

  var schema = [
    {
      name: 'fenlei',
      label: '商品分类',
      comp: 'readonlyitem',
      span: 24
    },
    {
      name: 'name',
      label: '商品名称',
      comp: 'readonlyitem',
      span: 24
    },
    {
      name: 'enName',
      label: '商品英文名称',
      comp: 'readonlyitem',
      span: 24
    },
    {
      name: 'origPrice',
      label: '市场价格',
      comp: 'readonlyitem',
      span: 24
    },
    {
      name: 'specValue',
      label: '规格',
      comp: 'readonlyitem',
      span: 24
    },
    {
      name: 'images',
      label: '商品图片',
      comp: 'custom',
      span: 24
    },
    {
      name: 'comment',
      label: '商品描述',
      comp: 'custom',
      span: 24
    }
  ]

  var schema1 = [
    {
      name: 'salePrice',
      label: '价格',
      comp: 'readonlyitem',
      span: 24
    }
  ]
  var schemaPrice = [
    {
      name: 'salePrice',
      label: '商城价',
      span: 12,
      type: 'number'
    },
    {
      name: 'fixSalePrice',
      label: '',
      comp: 'custom',
      span: 12
    },
    {
      name: 'reason',
      label: '提交原因',
      span: 24
    }
  ]
  var schema2 = [
    {
      name: 'num',
      label: '库存',
      comp: 'readonlyitem',
      span: 24
    }
  ]
  var schema3 = [
    {
      name: 'incomeType',
      label: '财务分类',
      comp: 'custom',
      span: 24
    }
  ]
  var schemaCategories = [
    {
      name: 'incomeType',
      label: '财务分类',
      comp: 'sys-type',
      props: {
        code: 'THC_RCM_MALL_FIN_TYPE',
        useValue: true
      },
      span: 24
    },
    {
      name: 'reason',
      label: '提交原因',
      span: 24
    }
  ]

  var schema4 = [
    {
      name: 'canReturnStatus',
      label: '售出后是否可以退货',
      comp: 'readonlyitem',
      span: 24
    }
  ]
  var schemaReturn = [
    {
      name: 'canReturn',
      label: '售出后是否可以退货',
      comp: 'custom',
      span: 24
    }
  ]

  export default {
    data () {
      var rules = {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        productCategoryId: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
      var rules1 = {
        salePrice: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        reason: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
      var rules2 = {
        incomeType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
      var schemaBasic = [
        {
          name: 'parentCategoryId',
          label: '商品分类',
          comp: 'ever-select',
          props: {
            options: []
          }
        },
        {
          name: 'productCategoryId',
          label: '',
          comp: 'ever-select',
          props: {
            options: []
          }
        },
        {
          name: 'name',
          label: '商品名称',
          span: 24
        },
        {
          name: 'enName',
          label: '商品英文名称',
          span: 24
        },
        {
          name: 'origPrice',
          label: '市场价格',
          span: 24
        },
        {
          name: 'specValue',
          label: '规格',
          span: 24
        },
        {
          name: 'images',
          label: '商品图片',
          comp: 'custom',
          span: 24
        },
        {
          name: 'comment',
          span: 24,
          label: '商品描述'
        }
      ]
      var obj = this.$ever.createObjFromSchema(schema)
      var objBasic = this.$ever.createObjFromSchema(schemaBasic)
      var obj1 = this.$ever.createObjFromSchema(schema1)
      var objPrice = this.$ever.createObjFromSchema(schemaPrice)
      var obj2 = this.$ever.createObjFromSchema(schema1)
      var obj3 = this.$ever.createObjFromSchema(schema1)
      var objCategories = this.$ever.createObjFromSchema(schemaCategories)
      var obj4 = this.$ever.createObjFromSchema(schema1)
      var objReturn = this.$ever.createObjFromSchema(schemaReturn)
      objPrice.fixSalePrice = 1
      return {
        schema,
        schema1,
        schema2,
        schema3,
        schema4,
        schemaBasic,
        schemaPrice,
        schemaCategories,
        schemaReturn,
        objBasic: objBasic,
        objPrice: objPrice,
        objReturn: objReturn,
        objCategories: objCategories,
        obj: obj,
        obj1: obj1,
        obj2: obj2,
        obj3: obj3,
        obj4: obj4,
        editBasic: false,
        editPrice: false,
        editCategories: false,
        editReturn: false,
        HisdialogVisible: false,
        api: api,
        objId: this.$route.params.id,
        uploadImgUrl: [],
        activeName: 'first',
        rules,
        rules1,
        rules2
      }
    },
    created () {
      this.init(this.objId)
    },
    methods: {
      init (id) {
        this.uploadImgUrl = []
        api.getById(id).then(result => {
          let parentCategory = result.data.parentCategory ? result.data.parentCategory.name : '--'
          let productCategory = result.data.productCategory ? result.data.productCategory.name : '--'
          let parentCategoryId = result.data.parentCategory ? result.data.parentCategory.id : ''
          let productCategoryId = result.data.productCategory ? result.data.productCategory.id : ''
          result.data.parentCategoryId = parentCategoryId
          result.data.productCategoryId = productCategoryId
          result.data.fenlei = parentCategory + '>' + productCategory
          result.data.specValue = result.data.productSkus[0].specValue
          if (result.data.images) {
            let photoArrMore = result.data.images.split('#')
            photoArrMore.forEach(item => {
              this.uploadImgUrl.push({ name: item, url: item })
            })
          }
          this.obj = result.data
          this.objPrice.id = result.data.id
          this.objCategories.id = result.data.id
          this.objBasic = result.data
          this.objReturn.id = result.data.id
          this.objReturn.canReturn = result.data.canReturn
          this.obj1.salePrice = result.data.salePrice
          this.objPrice.salePrice = result.data.salePrice
          this.objPrice.fixSalePrice = result.data.fixSalePrice
          this.obj2.num = result.data.productSkus[0].restStockNum
          this.obj3.incomeType = result.data.incomeType
          this.obj4.canReturn = result.data.canReturn
          this.obj4.canReturnStatus = result.data.canReturn ? '可以' : '不可以'
          this.objCategories.incomeType = result.data.incomeType + ''
          api.getByLevel({parentId: 1}).then(res => {
            this.$ever.getFieldFromSchema(this.schemaBasic, 'parentCategoryId').props.options = res.data
          })
          if (result.data.parentCategoryId) {
            api.getByLevel({parentId: result.data.parentCategoryId}).then(resss => {
              this.$ever.getFieldFromSchema(this.schemaBasic, 'productCategoryId').propsoptions = resss.data
            })
          }
        })
      },
      showHis () {
        this.$refs.historyLogDialog.open(this.$route.params.id)
      },
      saveReturnFn () {
        api.modifyCanReturn(this.objReturn).then(result => {
          this.init(this.objId)
          this.editReturn = false
        })
      },
      editReturnFn () {
        this.editReturn = true
      },
      editCategoriesFn () {
        this.editCategories = true
      },
      saveCategoriesFn () {
        this.$refs.categoriesForm.$refs.form.validate((valid) => {
          if (valid) {
            api.modifyIncomeType(this.objCategories).then(result => {
              this.init(this.objId)
              this.editCategories = false
            })
          }
        })
      },
      savePriceFn () {
        this.$refs.priceForm.$refs.form.validate((valid) => {
          if (valid) {
            if (this.objPrice.salePrice > this.objBasic.origPrice) {
              this.$message({
                message: '商城价不能高于市场价格' + this.objBasic.origPrice,
                type: 'warning'
              })
              return false
            }
            if (this.objBasic.type === 1) {
              if (this.objPrice.salePrice < this.objBasic.moneyThreshold) {
                this.$message({
                  message: '商城价不能低于' + this.objBasic.moneyThreshold,
                  type: 'warning'
                })
                return false
              }
            }
            api.modifySalePrice(this.objPrice).then(result => {
              this.init(this.objId)
              this.editPrice = false
            })
          }
        })
      },
      editPriceFn () {
        this.editPrice = true
      },
      saveBasic () {
        this.$refs.basicForm.$refs.form.validate((valid) => {
          if (valid) {
            if (this.objBasic.type === 1) {
              if (this.objBasic.origPrice < this.objBasic.moneyThreshold) {
                this.$message({
                  message: '市场价格不能低于' + this.objBasic.moneyThreshold,
                  type: 'warning'
                })
                return false
              }
            }
            api.modifyBasis(this.objBasic).then(result => {
              this.init(this.objId)
              this.editBasic = false
            })
          }
        })
      },
      generateGoods () {
        api.generate(this.obj.id).then(result => {
          this.$router.push('/card/goodsforsall/')
        })
      },
      editBasicFn () {
        this.editBasic = true
      },
      prevPage () {
        window.history.go(-1)
      },
      handleClick (tab, event) {
      }
    },
    watch: {
      'objBasic.parentCategoryId': {
        handler (cur, old) {
          if (cur) {
            api.getByLevel({parentId: cur}).then(result => {
              if (result.data) {
                this.$ever.getFieldFromSchema(this.schemaBasic, 'productCategoryId').props.options = result.data
                this.objBasic.productCategoryId = result.data[0].id
              }
            })
          }
        }
      },
      'objCategories.parentCategoryId': {
        handler (cur, old) {
          if (cur) {
            api.getByLevel({parentId: cur}).then(result => {
              if (result.data) {
                this.$ever.getFieldFromSchema(this.schemaCategories, 'productCategoryId').props.options = result.data
              }
            })
          }
        }
      }
    },
    components: {
      historyLog
    }
  }
</script>
<style scoped="scoped">
  .avatar{height: 140px;width: 140px;border-radius: 0;border: none;display: inline-block;margin-right: 20px;}
  .avatar img{height: 140px;width: 140px;border: 1px solid #DDDDDD;}
</style>
