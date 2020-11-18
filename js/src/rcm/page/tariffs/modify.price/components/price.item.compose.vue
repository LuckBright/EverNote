/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-27 14:40:03
 * @Last Modified by: chenjie
 * @Last Modified time: 2020-09-17 14:36:45
 * 价格调整按项目调价组件
 */
<template>
  <div class="pb20">
    <template>
      <el-select
        v-model="itemValue"
        filterable
        clearable
        remote
        reserve-keyword
        placeholder="商品名/项目"
        size="small"
        style="width: 30%"
        :remote-method="querySearchAsync"
        :loading="loading"
        @keydown.enter.native="handlerAddItem">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
           <div>
            <span>{{item.name}}</span>
            <span class="ml20">{{item.spec}}</span>
            <span class="ml20">{{item.unitName}}</span>
          </div>
        </el-option>
      </el-select>
      <el-button type="text" @click="handlerAddItem"> +添加</el-button>
    </template>
    <el-table v-loading.body="loading" :data="tableData" max-height="250px">
      <el-table-column prop="name" label="项目名称" min-width="120" fixed>
      </el-table-column>
      <el-table-column :label="item.sceneName" v-for="(item, index) in sceneList" :key="index" :width="(item.sceneName.length * 10) +100">
        <template slot-scope="scope">
          <el-input
            size="small"
            @blur="BlurText(scope.row, item.scene, $event)"
            v-model="scope.row[item.scene]"
            :placeholder="item.sceneName">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" width="36" fixed="right">
        <template slot-scope="{$index}">
          <i class="iconfont icon-delete blue" @click="handlerDeleteRow($index)"></i>
        </template>
      </el-table-column>
    </el-table>
    <price-form ref="priceControl" :org-options="orgOptions"></price-form>
    <!-- 占位标签p -->
    <p></p>
  </div>
</template>

<script>
import PriceForm from './price.form'
import api from '@/rcm/store/tariffs/modify.price.api'
import { debounce } from '@/util/common'
import { mapState } from 'vuex'
import { ModuleName } from './enum'
import { getPriceDecimal, config } from '@/manages/components/price.manage/price.config.js'

export default {
  components: {
    PriceForm
  },
  data () {
    return {
      loading: false,
      itemValue: '',
      options: [],
      tableData: [],
      orgOptions: [],
    }
  },
  created () {
    this.orgId = localStorage.getItem('CLINICID')
    // 获取价格精度
    getPriceDecimal()
    // this.querySearchAsync('', true)
  },
  computed: {
    ...mapState(ModuleName, {
      sourceModule: state => state.sourceModule,
      sceneList: state => state.sceneList,
      sceneObj: state => state.sceneObj,
    })
  },
  methods: {
    BlurText (row, key, e) {
      let val = e.target.value
      if (!val || val === '0') return
      if (!(Number(val) && Number(val) > 0)) { // 可以为空和0
        this.$messageTips(this, 'error', '价格应为正数')
        row[key] = ''
      } else {
        let priceDecimal = config.priceDecimal || 0
        // 产品定义输入最多六位
        if (val.indexOf('.') !== -1 && val.split('.')[1].length > priceDecimal) {
          row[key] = +(val.split('.')[0] + '.' + val.split('.')[1].slice(0, priceDecimal))
        }
      }
    },
    handlerCheckTableData () {
      if (!this.tableData.length) return (this.everError('请添加项目'), false)
      let orgArr = []
      this.tableData.forEach(item => {
        this.sceneList.forEach(lab => {
          if (item[lab.scene]) {
            let info = {
              itemId: item.itemId,
              scene: lab.scene,
              sceneName: lab.sceneName,
              currentPrice: item[lab.scene]
            }
            orgArr.push(info)
          }
        })
      })
      if (!orgArr.length) {
        return (this.everError('选择项目价格不能为空，请检查后提交'), false)
      }
      return orgArr
    },
    handlerDeleteRow (index) {
      this.tableData.splice(index, 1)
      this.initOrgOptions()
    },
    handlerAddItem () {
      if (!this.itemValue) return
      if (this.tableData.find(item => { return item.itemId === this.itemValue })) { // 已经有这条数据
        this.everError('该项目已存在，请选择其他项')
        return
      }
      let itemInfo = this.options.find(item => { return (item.id === this.itemValue) })
      let info = Object.assign({}, this.sceneObj, { name: itemInfo.name, itemId: itemInfo.id, orgList: itemInfo.orgList })
      this.tableData.push(info)
      this.initOrgOptions()
      this.itemValue = ''
    },
    initOrgOptions () { // 根据添加的不同项目，展示对应有使用权机构的交集
      let obj = {}
      let arr = []
      this.tableData.find(item => {
        item.orgList.find(lab => {
          if (obj[lab.orgId]) {
            obj[lab.orgId]['len'] += 1
          } else {
            obj[lab.orgId] = { len: 1, val: lab }
          }
        })
      })
      for (let key in obj) {
        if (obj[key]['len'] === this.tableData.length) {
          const data = obj[key]['val']
          arr.push(Object.assign({}, data, { id: data.orgId, name: data.orgName }))
        }
      }
      this.orgOptions = arr
    },
    querySearchAsync: debounce(function (queryString, init) {
      if (!queryString && !init) return
      this.loading = true
      let params = {
        orgId: this.orgId,
        queryType: this.sourceModule === 'warehouse' ? 1 : 0,
        offset: 0,
        pagesize: 20,
        name: queryString
      }
      api.getForTenantPriceManage(params).then(res => {
        const { data = [] } = res || {}
        this.options = data
      }).finally(_ => {
        this.loading = false
      })
    }),
  }
}
</script>

<style lang="scss" scoped>
</style>
