<template>
  <div class="reform-record">重整医嘱
    <template v-if="record">
      {{`，${record.operatorName}，${$moment(record.createTime).format('YYYY-MM-DD HH:mm')}`}}
    </template>
  </div>
</template>
<script>
import recipeapi from '@/workspace/store/recipeapi'

export default {
  props: {
    reformId: String
  },
  data () {
    return {
      record: null
    }
  },
  created () {
    this.getRreformRecord()
  },
  methods: {
    getRreformRecord () {
      if (!this.reformId) return
      recipeapi.getReformRecord([this.reformId]).then(res => {
        if (res && res.length) {
          this.record = res[0]
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .reform-record {
    transform: translateZ(0);
    text-align: center;
    color: red;
    font-size: 13px;
  }
</style>
