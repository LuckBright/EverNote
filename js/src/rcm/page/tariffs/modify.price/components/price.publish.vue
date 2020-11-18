/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-27 10:24:56
 * @Last Modified by: chenjie
 * @Last Modified time: 2020-09-17 11:40:28
 * 调价管理公共组件
 */
<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="55%" class="ui_dialog_02">
    <el-tabs v-model="activeName">
      <template v-for="tab in Tabs">
        <el-tab-pane v-if="(tab.isTenant && isTenant) || !tab.isTenant" :key="tab.id" :label="tab.name" :name="tab.id">
          <component ref="components" :key="tab.id + nowKey" v-if="activeName == tab.id" :is="currentComponent" v-on="$listeners"></component>
          <!-- <price-compose v-if="activeName == tab.id" ref="components"></price-compose> -->
        </el-tab-pane>
      </template>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="publish" :loading="loading">{{showNameBtn}}价格</el-button>
    </span>
  </el-dialog>
</template>

<script>
import PriceCompose from './price.compose'
import PriceItemCompose from './price.item.compose'
import Store from './store'
import { Tabs, ModuleName } from './enum'
import api from '@/rcm/store/tariffs/modify.price.api'

export default {
  name: 'PricePublish',
  mixins: [Store],
  props: {
    sourceModule: { // 业务类型：warehouse || cope
      type: String,
      default: 'warehouse'
    },
    isTenant: { // 是否是集团操作
      type: Boolean,
      default: true
    },
    orgTree: { // 机构树
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      Tabs,
      dialogVisible: false,
      loading: false,
      currentComponent: PriceCompose,
      activeName: '',
      nowKey: '',
      source: this.isTenant ? 'tenant' : 'org' // org机构 tenant集团
    }
  },
  created () {
    this.orgId = localStorage.getItem('CLINICID')
    this.activeName = this.getInitActiveName()
  },
  watch: {
    dialogVisible () {
      this.nowKey = Date.now()
      this.activeName = this.getInitActiveName()
    },
    activeName (name) {
      this.currentComponent = Tabs[0].id === name ? PriceItemCompose : PriceCompose
    }
  },
  computed: {
    showNameBtn () {
      return this.activeName === 'byitem' ? '发布' : '预览'
    }
  },
  components: { PriceCompose },
  methods: {
    parameters (by, table, form) {
      const { desc, org = [this.orgId], ace: algorithm } = form
      // 设置选中的机构id
      this.$store.commit(`${ModuleName}/setSelectOrgs`, org)
      return {
        by,
        source: this.source, // org机构 tenant集团
        sourceModule: this.sourceModule,
        desc,
        data: table.map(item => Object.assign({}, item, { rate: (item.rate / 100).toFixed(2) })),
        orgIds: org,
        algorithm
      }
    },
    publishFn (type, tableData, formData) {
      const strategy = {
        // 按项目调价
        'byitem': (table, form) => {
          const { desc, org = [] } = form

          this.loading = true
          api.adjust({
            by: 'adjustByItem',
            source: this.source,
            sourceModule: this.sourceModule,
            desc,
            data: org.map(item => ({
              orgId: item,
              items: table
            }))
          }).then(res => {
            const { code } = res || {}
            if (!code) {
              this.$emit('publishSuccess')
              this.everSuccess('发布成功')
              this.dialogVisible = false
            }
          }).finally(_ => {
            this.loading = false
          })
          return false
        },
        // 按分类调价
        'byclass': (table, form) => {
          // serviceClass：一维数组
          table = table.map(item => Object.assign({}, item, { serviceClass: item.serviceClass[item.serviceClass.length - 1] }))
          return this.parameters('adjustByClass', table, form)
        },
        // 按维度调价
        'byscene': (table, form) => {
          // serviceClass：二维数组
          table = table.map(item => Object.assign({}, item, { serviceClass: item.serviceClass.map(service => service[service.length - 1]) }))
          return this.parameters('adjustByScene', table, form)
        }
      }
      return strategy[type](tableData, formData)
    },
    getInitActiveName () {
      return Tabs[this.isTenant ? 0 : 1].id
    },
    publish () {
      const queue = [] // 校验表单结果集合
      const objQueue = [] // 多表单数据集合
      const refs = this.$refs.components[0] ? this.$refs.components[0].$refs : this.$refs.components.$refs
      let tableData
      if ((tableData = this.$refs.components[0].handlerCheckTableData())) { // 子组件内校验当前输入数据是否合规，并返回数据或者false
        Object.keys(refs).forEach(key => {
          refs[key].$refs.form && refs[key].$refs.form.$refs.form.validate(valid => {
            // 所有form表单校验结果
            queue.push(valid)
            // 拿到子组件form表单校验后的数据obj
            objQueue.push(refs[key].obj)
          })
        })
        // 所以条件效验通过，执行真正的提交
        if (queue.every(item => item)) {
          const params = this.publishFn(
            this.activeName,
            tableData,
            // 合并多表单obj对象
            objQueue.reduce((pre, cur) => {
              return Object.assign(pre, cur)
            }, {})
          )
          // 按维度 和 分类 先走预览后走调价接口（按项目调价直接调用调价接口）
          if (params) {
            // 进行调价预览
            refs['pricePreview'].open(params)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui_dialog_02 {
  /deep/ .el-dialog__body {
    padding: 30px;
    padding-top: 0;
  }
}
</style>
