<template>
  <div>
    <h4>单选选择</h4>
    {{value}}
    <ever-staff-select ref="ess" v-model="value" :props="{clearable: false}" :params="params"></ever-staff-select>
    <el-button @click="value = ''">清空</el-button>
    <br>
    <hr>
    <br>
    <h4>单选回显</h4>
    {{value2}}
    <ever-staff-select ref="ess" v-model="value2"></ever-staff-select>
    <br>
    <hr>
    <br>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        value: '036c7e12a9224ee5ac131b26ab1d3086',
        value2: '',
        params: {
          everQueryType: 'out',
        }
      }
    },
    created () {
      setTimeout(() => {
        this.value2 = '013e3cb21d7843919aafd51bdddd519d'
      }, 500)
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
