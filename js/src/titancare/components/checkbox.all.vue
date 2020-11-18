<template>
  <div>
    <el-checkbox class="fl mr20" v-model="checkAll" @change="handleCheckAllChange" v-if="isAll">全选</el-checkbox>
    <el-checkbox-group class="fl" v-model="check" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="city in list" :label="city.id" :key="city.id">{{city.name || city.value}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  props: ['isAll', 'value', 'list'],
  data () {
    return {
      check: JSON.parse(this.value),
      checkAll: []
    }
  },
  methods: {
    handleCheckAllChange (val) {
      let arr = []
      if (val) {
        this.list.forEach(item => {
          arr.push(item.id)
        })
      }
      this.check = val ? arr : []
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.list.length
    }
  }
}
</script>

