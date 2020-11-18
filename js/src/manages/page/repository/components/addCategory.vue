<template>

  <section class="add-category">
    <el-form :model="baseInfo" label-width="100px" label-position="right">
     <addBase :baseInfo.sync="baseInfo"></addBase>
    </el-form>
  </section>

</template>

<script lang="js">
  import addBase from '@/manages/page/repository/components/addBase.vue'
  export default {
    name: 'add-category',
    props: ['baseInfo'],
    components: {
      addBase
    },
    mounted () {

    },
    data () {
      return {
      }
    },
    methods: {

    },
    computed: {

    }
}

</script>

<style scoped lang="scss">
  .add-category {
  }
</style>
