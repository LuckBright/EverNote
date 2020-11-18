<template>
  <span>
    <el-dropdown @command="handleClick" v-bind="$attrs">
      <el-button type="default"  size="small">
        调价管理<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command='1'>批量调价</el-dropdown-item>
        <el-dropdown-item :command='2'>调价历史</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!--
      sourceModule: 'cpoe', // warehouse 或 cope
      isTenant: true, // 集团：true 机构：false
      orgTree: 机构树列表
    -->
    <modify-price-log v-if="command == 1" ref="modifyPrice" v-bind="$attrs" v-on="$listeners"></modify-price-log>
  </span>
</template>
<script>
import ModifyPriceLog from '@/rcm/page/tariffs/modify.price/components/price.publish'

export default {
  components: { ModifyPriceLog },
  data () {
    return {
      command: ''
    }
  },
  methods: {
    handleClick (command) {
      if ((this.command = command) === 1) {
        this.$nextTick(_ => {
          this.$refs.modifyPrice.dialogVisible = true
        })
      } else if ((this.command = command) === 2) {
        if (this.$route.path.indexOf('warehouse') !== -1) {
          this.$router.push('/warehouse/pricedetailslist')
        } else {
          this.$router.push('/manages/pricedetailslist')
        }
      }
    }
  }
}
</script>
