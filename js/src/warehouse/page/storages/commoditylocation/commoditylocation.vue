<template>
  <div>
    <ever-bread-crumb name="货位管理" :showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2 :schema="schema" v-model="obj" ref="form" :span="12" :rules="rules" @submit="submitForm()" :nosubmit="true">
        <template slot="itemList">
          <el-row v-for="(item, i) of itemListArr" :key="i">
            <el-col :span="22">
              <div style="line-height: 24px; padding: 8px 0" class="bor_bom_1 clearfix">
                <span class="cGray fl">{{i + 1}}、 </span><span style=" width: 95%" class="fl">{{item.materialName}}</span>
              </div>
            </el-col>
            <el-col :span="1" class="ml20"><el-button type="danger" size="small" @click="handelDelCommodity(item, i)">删除</el-button></el-col>
          </el-row>
        </template>
        <template slot="commodityObj">
          <el-row>
            <el-col :span="22">
              <material-select
                ref="remoteselect"
                v-model="obj.commodityObj"
                :params="{ filterOverdueRecord: true }"
                :needObjFlag="true">
              </material-select>
            </el-col>
            <el-col :span="1" class="ml20"><el-button type="primary" size="small" @click="handelAddCommodity">添加</el-button></el-col>
          </el-row>
        </template>
      </ever-form2>
      <div class="ml120">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button v-if="!objId" type="primary" @click="submitForm('form', true)">保存并创建</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/storages/store/commoditylocationapi'
import getMaterialInfoApi from '@/warehouse/store/getmaterialinfoapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { debounce } from '@/util/common'
import { REMOTE_METHODS_PLACEHOLDER } from '@/warehouse/views/util/constant'
let schema = [
  {
    name: 'code',
    label: '货位编号',
    props: {
      placeholder: '货位编号'
    },
    span: 13
  },
  {
    name: 'commodityObj',
    label: '商品名称',
    comp: 'custom',
    span: 14
  }
]
export default {
  mixins: [getstorage],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      getMaterialInfoApi,
      schema,
      obj,
      REMOTE_METHODS_PLACEHOLDER,
      rules: {
        code: { required: true, message: '必填项', trigger: 'blur' }
      },
      objId: this.$route.params.id,
      itemListArr: []
    }
  },
  created () {
    this._initial(true)
    if (this.objId) {
      this.getDetail().then((res) => {
        Object.assign(this.obj, res)
      })
    }
  },
  methods: {
    getDetail (id) {
      return new Promise((resolve, reject) => {
        api.getById({ id: this.objId }).then(res => {
          if (res) {
            if (res.itemList && res.itemList.length) {
              this.itemListArr = res.itemList
              this._addItemList()
            }
            resolve(res)
          }
        })
      })
    },
    submitForm: debounce(function (form, isRefresh) {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.obj))
          Object.assign(params, { storageRoomId: this.storageId })
          params.itemList = this.itemListArr
          api.createOrUpdate(params).then(res => {
            if (res && res.flag) {
              this._initial(true)
              if (!isRefresh) this.$router.push('/storages/commoditymanage/commoditylocations')
            }
          })
        }
      })
    }),
    handelAddCommodity () {
      if (!this.obj.commodityObj) return this.$messageTips(this, 'warning', '请选择商品后再点击添加')
      if (this.itemListArr && !this.itemListArr.length) {
        this._addItemList()
      }
      let isRepeat = false
      if (this.itemListArr.length) {
        this.itemListArr.forEach(item => {
          if (item.localMaterialId === this.obj.commodityObj.localMaterialId) {
            isRepeat = true
            return this.$messageTips(this, 'warning', '该商品已添加至当前货位，请重新选择')
          }
        })
      }
      if (!isRepeat) {
        this.itemListArr.push({ localMaterialId: this.obj.commodityObj.localMaterialId, materialName: this.obj.commodityObj.materialName })
        this.obj.commodityObj = ''
      }
    },
    handelDelCommodity (data, index) {
      this.itemListArr.splice(index, 1)
      if (!this.itemListArr.length) this._initial()
      this.obj = JSON.parse(JSON.stringify(this.obj))
    },
    _addItemList () {
      this.schema.splice(1, 0, { name: 'itemList', label: '商品名称', comp: 'custom', span: 14 })
      this.$ever.getFieldFromSchema(this.schema, 'commodityObj').label = ''
    },
    _initial (init) {
      this.$ever.getFieldFromSchema(this.schema, 'commodityObj').label = '商品名称'
      if (this.schema.length > 2) this.schema.splice(1, 1)
      if (init) {
        this.obj.code = ''
        this.itemListArr = []
        this.obj.commodityObj = ''
      }
    }
  }
}
</script>

