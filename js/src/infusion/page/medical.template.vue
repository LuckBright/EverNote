<template>
<div class='medicaltemplate'>
    <manage ref='manage' :collapse='collapse'></manage>
</div>
</template>

<script>
import manage from '@/emr/page/template.manage.vue'
export default {
  components: {manage},
  data () {
    return {
      collapse: [
         {name: '检验模版', id: '1'},
        {name: '检查模版', id: '2'},
        {name: '词条模版', id: '5'}
      ]
    }
  },
  beforeRouteLeave (to, from, next) {
    // console.log(to, from)

    // console.log(this.$refs.manage.isUpdate())
    let _this = this.$refs.manage
    if (_this.isUpdate()) {
      _this.$confirm('文档有修改, 是否先保存?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '不保存',
        showClose: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(res => {
        _this.noLeave()
        // this.$bus.$emit('nav:preventActiveChange')
        _this.saveTpl()
      }).catch(() => {
        _this.initUpDate()

        next()
      })
    } else {
      _this.initUpDate()
      next()
    }
  },
  mounted () {
  }
}
</script>
<style lang="scss" scoped>
 .medicaltemplate{
   height: 100%;
 }
</style>

