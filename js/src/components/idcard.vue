<template>
  <span style="display: flex">
    <sys-type code="CV02.01.101" v-model="iden.type" :use-value="true" :disabled='disabled' style="width: 35%;margin-right: 10px"></sys-type>
    <el-input  style="flex: 1" v-model="iden.idNo" placeholder="请输入证件号" :disabled='disabled'></el-input>
  </span>
</template>
<script>
  export default {
    props: ['value', 'disabled'],
    data () {
      return {
        iden: {
          type: '',
          idNo: ''
        }
      }
    },
    watch: {
      iden: {
        handler (newVal) {
          this.$emit('input', newVal)
        },
        deep: true
      },
      value: {
        handler () {
          if (this.value && this.value.type) {
            Object.assign(this.iden, this.value)
          } else {
            Object.assign(this.iden, {
              type: '',
              idNo: ''
            })
            this.$emit('input', this.iden)
          }
        },
        immediate: true
      }
    }
  }
</script>
