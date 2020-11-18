<template>
<div class='medicaldictionary'>
  <bingli v-bind='props'></bingli>
</div>
</template>

<script>
  import bingli from '@/form/page/anamnesistype/bingli.vue'
  export default {
    components: {
      bingli
    },
    data () {
      return {
        props: {
          type: 'tech',
          selectOptions: [
            {
              id: '1',
              name: '检验'
            },
            {
              id: '2',
              name: '检查'
            },
            {
              id: '5',
              name: '词条'
            }
          ],
        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">
  .medicaldictionary {
  }
</style>
