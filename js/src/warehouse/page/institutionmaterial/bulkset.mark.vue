<template>
  <span>
    <el-button type="primary" size="small" @click="open">批量设置加成率</el-button>
    <el-dialog 
      width="380px"
      title="按物资分类设置"
      :visible.sync="visible">
      <el-table 
        border
        :data="rowData">
        <el-table-column label="物资分类">
          <template slot-scope="scope">
            <el-cascader
              :options="typeOptions"
              size="small"
              clearable
              placeholder="物资类别"
              v-model="obj.type"
              :collapseTags="true"
              :props="{ multiple: true }">
            </el-cascader>
          </template>
        </el-table-column>
        <el-table-column label="加成率">
          <template slot-scope="scope">
            <el-input-number
              ref="editInput"
              v-model="obj.bonusRate"
              size="small"
              @blur="changeMarkon"
              :autofocus="true"
              :controls="false">
            </el-input-number> %
          </template>
        </el-table-column>
      </el-table>
      <span class="note">
        注：按物资分类设置加成率，设置后的加成率，将应用到下次采购入库时计算销售价。不会改变已有系统批次的销售价。
      </span>
      <footer class="alg_c">
        <el-button type="primary" size="small" class="w_80 ml20" @click="submit" :disabled="btnGray" :loading="loading">保存</el-button>
        <el-button @click="visible = false" class="w_80 ml20" size="small">关闭</el-button>
      </footer>
    </el-dialog>
  </span>
</template>

<script>
import { priceChang } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

export default {
  props: {
    typeOptions: {
      type: Array,
      default: () => ([ ])
    },
    api: {
      type: Object,
      default: () => ({ })
    }
  },
  computed: {
    btnGray () {
      return Boolean(!this.obj.type.length && this.obj.bonusRate)
    }
  },
  components: {
    markonInput: () => import('@/warehouse/page/storages/components/markon.input.vue')
  },
  data () {
    return {
      visible: false,
      loading: false,
      rowData: [{ add: true }],
      obj: {
        type: [],
        bonusRate: undefined
      }
    }
  },
  methods: {
    open () {
      this.visible = true
      this.loading = false
      this.obj = {
        type: [],
        bonusRate: undefined
      }
    },
    changeMarkon () {
      this.obj.bonusRate = priceChang(this.obj.bonusRate, 'bonusRate')
    },
    submit () {
      let params = {
        markupPercentage: this.obj.bonusRate,
        classifyIds: []
      }
      this.obj.type.forEach(item => {
        params.classifyIds.push(item[item.length - 1])
      })
      this.loading = true
      this.api['bulkSetMark'] && this.api['bulkSetMark'](params).then(res => {
        this.everSuccess('批量设置加成率成功')
      })
      setTimeout(() => {
        this.visible = false
        this.loading = true
      }, 1000)
    }
  }
}

</script>
<style lang='less' scoped>
</style>
