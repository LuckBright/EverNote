/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-27 13:55:01
 * @Last Modified by: qiaodengtao
 * @Last Modified time: 2020-06-04 17:06:48
 * 价格调整复合组件（维度 + 分类）
 */
<template>
  <div>
    <ever-table
      max-height="240"
      :columns="columns"
      :data="tableData">

      <template slot="scene">
        <el-table-column prop="scene" label="价格维度">
          <template slot-scope="scope">
            <el-select v-model="scope.row.scene" clearable :multiple="activeName == byclass" collapse-tags placeholder="请选择价格维度" @change="handerChange({index: scope.$index, value: scope.row.scene, type: 'scene', msg: '价格维度'})">
              <el-option v-for="item in sceneList" :key="item.scene" :label="item.sceneName" :value="item.scene"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>
      <template slot="serviceClass">
        <el-table-column prop="serviceClass" label="系统分类">
          <template slot-scope="scope">
            <el-cascader
              style="width: 100%"
              size="mini"
              placeholder="请选择系统分类"
              v-model="scope.row.serviceClass"
              collapse-tags
              :options="serviceList"
              :props="{multiple: activeName != byclass, id: 'code'}"
              @change="handerChange({index: scope.$index, value: scope.row.serviceClass, type: 'serviceClass', msg: '系统分类'})"
              clearable></el-cascader>
          </template>
        </el-table-column>
      </template>
      <template slot="rate">
        <el-table-column prop="rate" label="调整比例">
          <template slot-scope="scope">
            <el-input v-model="scope.row.rate" placeholder="请输入调整比例" @blur="BlurText($event)"><template slot="append">%</template></el-input>
          </template>
        </el-table-column>

        <template slot="delete">
          <el-table-column width="36" fixed="right">
            <template slot-scope="{$index}">
              <i class="iconfont icon-delete blue" @click="handlerDeleteRow($index)"></i>
            </template>
          </el-table-column>
        </template>
      </template>
    </ever-table>

    <el-button type="text" @click="handlerAddItem">+添加</el-button>


    <price-form ref="priceForm"></price-form>
    <price-control ref="priceControl"></price-control>
    <price-preview ref="pricePreview" v-on="$listeners"></price-preview>

  </div>
</template>

<script>
import PriceControl from './price.control'
import PriceForm from './price.form'
import PricePreview from './price.preview'
import { ModuleName, Tabs as PRICE_BASE } from './enum'
import { mapState, mapGetters } from 'vuex'
const byclass = PRICE_BASE[2].id // 按分类调价
const columns = [
  {
    prop: 'scene',
    label: '价格维度',
    slotName: 'scene'
  },
  {
    prop: 'serviceClass',
    label: '系统分类',
    slotName: 'serviceClass',
    sort: byclass
  },
  {
    prop: 'rate',
    label: '调整比例',
    slotName: 'rate',
  },
  {
    prop: 'delete',
    label: '价格维度',
    slotName: 'delete'
  },
]
const initRow = { scene: '', serviceClass: '', rate: '' }
export default {
  components: {
    PriceControl,
    PriceForm,
    PricePreview
  },
  data () {
    return {
      tableData: [Object.assign({}, initRow)],
      byclass
    }
  },
  computed: {
    ...mapGetters(ModuleName, ['serviceList']),
    ...mapState(ModuleName, {
      activeName: state => state.activeName,
      sceneList: state => state.sceneList,
    }),
    columns () {
      if (this.activeName === byclass) {
        const index = columns.findIndex(item => item.sort && item.sort === byclass)
        const newColumns = columns.slice(0)
        newColumns.unshift(...newColumns.splice(index, 1))
        return newColumns
      }
      return columns
    }
  },
  methods: {
    BlurText (e) {
      if (!e.target.value) return
      let reg = /^[1-9][0-9]*$/
      let boolean = reg.test(e.target.value)
      if (!boolean) {
        this.$messageTips(this, 'error', '调整比例应为正整数')
        e.target.value = ''
      }
    },
    handlerDeleteRow (index) {
      this.tableData.splice(index, 1)
    },
    handlerAddItem () {
      this.tableData.push(Object.assign({}, initRow))
    },
    handerChange ({ index, value, type, msg }) {
      if (this.activeName === byclass && type === 'scene') return
      if (this.activeName !== byclass && type === 'serviceClass') return

      let repeatCol = this.tableData.filter(item => {
        return JSON.stringify(item[type]) === JSON.stringify(value)
      })
      if (repeatCol.length > 1) {
        this.tableData[index][type] = ''
        this.everWarning(msg + '不能重复')
      }
    },
    handlerCheckTableData () {
      let emptyLen = 0
      const total = this.tableData.length
      if (!total) {
        return (this.everError('调价明细不能为空'), false)
      }
      for (let i = 0; i < total; i++) {
        const { scene, serviceClass = [], rate } = this.tableData[i]
        const sceneLen = scene.length
        const serviceClassLen = serviceClass.length
        if (!((!sceneLen && !serviceClassLen && !rate) || (sceneLen && serviceClassLen && rate))) { // 都填或者都没填
          let val = !sceneLen ? '价格维度不能为空' : !serviceClassLen ? '系统分类不能为空' : '调整比例不能为空'
          return (this.everError(val), false)
        } else if (!sceneLen && !serviceClassLen && !rate) {
          emptyLen++
        }
      }
      if (emptyLen === total) { // 排除添加table行后，全部信息都是空的情况
        return (this.everError('调价明细不能为空'), false)
      }
      return this.tableData.filter(item => item.scene && item.serviceClass && item.rate)
    }
  }
}
</script>

