<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="西药" name="west">
        <west-record></west-record>
      </el-tab-pane>
      <el-tab-pane label="中药" name="chinese">
        <chinese-Record></chinese-Record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import WestRecord from '@/crm/page/member/drugrecord/westrecord'
import ChineseRecord from '@/crm/page/member/drugrecord/chineserecord'
export default {
  data () {
    return {
      activeName: 'west'
    }
  },
  created () {},
  methods: {
    handleClick (tab, event) {
    }
  },
  components: {
    WestRecord,
    ChineseRecord
  }
}
</script>
