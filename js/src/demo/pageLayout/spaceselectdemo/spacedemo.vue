<template>
  <div>
    <h3>空间管理相关选择器</h3>
    <div class="box">
      <h4>房间选择器</h4>
      <p>若要尝试单选，换参数，请自行修改代码进行调试</p>
      {{roomList}}
      <ever-room-select v-model="roomList" :params="params" use-obj></ever-room-select>
<!--      不要这么写，否则会触发多次查询-->
<!--      <ever-room-select v-model="roomList" multiple :params="{tenantSubjectIds: ['5000.SURGERY']}"></ever-room-select>-->
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        // roomList: [ {id: 'UfwcVn608un0ho7oUsh'}, {id: '7MnCzrcikW4cYg0FC5t'} ],
        roomList: {id: 'UfwcVn608un0ho7oUsh'},
        params: {tenantSubjectIds: ['5000.SURGERY']}, // params 不要在模板中写成字面量，否则会多次触发查询
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
