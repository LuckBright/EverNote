<template>
  <div>
    <ever-bread-crumb :name="$route.meta.type === 'plan'  || $route.query.type === 'plan' ? '项目详情' : '套餐详情'" :showTitle="$route.query.type === 'plan' ? '项目' : '套餐详情'"></ever-bread-crumb>
    <div class="layout_inner">
      <h3>{{$route.meta.type === 'plan' || $route.query.type === 'plan' ? '项目信息' : '套餐信息'}}</h3>
      <div style="margin:20px 0;">
        <label>{{ $route.meta.type === 'plan' || $route.query.type === 'plan' ? '保障计划名称' : '套餐名称：'}}</label>
        {{setMealName}}
      </div>
      <ever-form2
        :schema="querySchema"
        v-model="queryObj"
        ref="form"
        :info="true"
        labelWidth="140px"
        label-position="right"
        :inline="true"
        :span="24"
        @query="list(true)"
      >
        <template slot="setMealCatalogId">
          <el-select v-model="obj.setMealCatalogId" placeholder="请选择" clearable>
            <el-option
              v-for="item in options.xmlx"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <template slot="serviceId">
          <el-select v-model="obj.serviceId" placeholder="请选择" clearable>
            <el-option
              v-for="item in options.xmmc"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button @click="getInfo">查询</el-button>
          </el-form-item>
          <el-form-item class="fr" v-if="$route.query.type === 'plan'">
            <el-button  type="primary" @click="gotoEditProj">修改项目</el-button>
          </el-form-item>
        </template>
      </ever-form2>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        :height="tableHeight"
        class="tableContainer"
        style="width: 100%"
        border
      >
        <el-table-column prop="setMealCatalogName" label="目录"></el-table-column>
        <el-table-column prop="serviceName" label="项目名称"></el-table-column>
        <el-table-column prop="itemNum" label="数量"></el-table-column>
        <el-table-column prop="totalPrice" label="原价"></el-table-column>
        <el-table-column prop="totalPriceDis" label="售价"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '../../store/packageapi.js'
let schema = [
  {
    label: '目录',
    name: 'setMealCatalogId',
    comp: 'custom'
  },
  {
    label: '项目名称',
    name: 'serviceId',
    comp: 'custom'
  },
]
export default {

  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      obj,
      loading: false,
      setMealName: '', // 套餐名称
      id: this.$route.params.id,
      tableData: [],
      setMealId: this.$route.params.setMealId,
      queryObj: obj,
      querySchema: schema,
      tableHeight: '400',
      options: {
        xmlx: [],
        xmmc: []
      }
    }
  },
  methods: {
    gotoEditProj () {
      this.$router.push({path: '/card/ordermarketingplanedit', query: {packageId: this.$route.params.setMealId, orderId: this.$route.params.id, categoryId: '06', activeName: 2}})
      this.$bus.$emit('package-tab', {name: '2'})
    },
    getInfo () {
      let params = {
        setMealId: this.setMealId,
        orderId: this.id,
        setMealCatalogId: this.queryObj.setMealCatalogId,
        serviceId: this.queryObj.serviceId
      }
      this.loading = true
      api.searchOrderDetails(params).then(result => {
        this.tableData = result.data
        this.loading = false
        this.initOptions()
        this.correctTableHeight()
      })
    },
    async initOptions () {
      let json = await api.searchOrderDetails({ setMealId: this.setMealId, orderId: this.id })
      let xmlxobj = {}
      let xmmcobj = {}
      let xmlx = []
      let xmmc = []
      this.setMealName = json.data[0].setMealName
      json.data.forEach(item => {
        if (!xmlxobj[item.setMealCatalogId]) {
          xmlxobj[item.setMealCatalogId] = true
          xmlx.push({ id: item.setMealCatalogId, name: item.setMealCatalogName })
        }
        if (!xmmcobj[item.serviceId]) {
          xmmcobj[item.serviceId] = true
          xmmc.push({ id: item.serviceId, name: item.serviceName })
        }
      })
      this.options.xmlx = xmlx
      this.options.xmmc = xmmc
    },
    correctTableHeight () {
      let bodyHeight = document.body.clientHeight
      let tableTop = document.querySelector('.tableContainer').offsetTop
      let listheight = (this.tableData.length + 1) * 40
      if (listheight > bodyHeight - tableTop) {
        this.tableHeight = bodyHeight - tableTop - 50
      } else {
        this.tableHeight = listheight - 5
      }
    }
  },
  watch: {
    'queryObj.setMealCatalogId': {
      handler: function (val, oldval) {
        this.getInfo()
      }
    },
    'queryObj.serviceId': {
      handler: function (val, oldval) {
        this.getInfo()
      }
    }
  },
  async created () {
    this.getInfo()
  }
}
</script>

<style lang="less" scoped>
h3 {
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
}
</style>
