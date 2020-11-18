<template>
  <el-popover
    popper-class="layout_box task_box spe service_set_box"
    placement="right"
    width="360"
    :open-delay="500"
    :disabled="item.serviceType === '3002'"
    trigger="hover"
  >
    <el-table
      v-if="data.length"
      :data="data"
      border
    >
      <el-table-column property="serviceName" :label="$t('子项名称')"></el-table-column>
      <el-table-column width="60" property="count" :label="$t('数量')"></el-table-column>
      <el-table-column width="100" property="price" :label="$t('金额')">
        <template
          slot-scope="scope"
        >￥{{scope.row.price ? Number(scope.row.price).toFixed(2) : '0.00'}}</template>
      </el-table-column>
    </el-table>
    <span
      @click.prevent
      slot="reference"
      class="bold"
      :class="{'lineThrough': String(item.status) === '11'}"
    >
      {{item.doctorAdviceName}}
      <svg class="icon" aria-hidden="true" style="font-size: 18px;" v-if="item.employ === '7'">
        <use xlink:href="#iconpishi"></use>
      </svg> 
    </span>
  </el-popover>
</template>

<script>
export default {
  props: ['item', 'type'],
  data () {
    return {

    }
  },
  computed: {
    data () {
      let list = []
      if (this.item && this.item.adviceFeesDtoList && this.item.adviceFeesDtoList.length) {
        list = this.item.adviceFeesDtoList.filter(val => {
          return +val.feesType === 1
        })
      }
      return list
    }
  }
}
</script>
<style>
.service_set_box {
  max-height: 500px;
  overflow: auto;
}
</style>

<style scoped>
.lineThrough {
  text-decoration: line-through;
}
.pathColor {
  color: #1c7bef;
}
</style>
