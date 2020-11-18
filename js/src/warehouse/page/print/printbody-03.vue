<template>
  <div>
    <div class="dispensing_print_body">
      <table>
        <thead>
          <th>药品</th>
          <th>生产厂商</th>
          <th>规格</th>
          <th>数量</th>
          <th>货位</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in bodyData" :key="index">
            <td>{{item.a}}</td>
            <td>{{item.a}}</td>
            <td>{{item.b}}</td>
            <td align="right">{{item.d}}</td>
            <td>{{item.j}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['bodyData'],
  data () {
    return {
      qrcodeUrl: ''
    }
  },
  watch: {
    bodyData: {
      handler (val) {
        // this.$nextTick(() => {
        //   this.qrcodeUrl = document.querySelector('#canvasId').toDataURL()
        // })
        // setTimeout(() => {
        //   this.qrcodeUrl = document.querySelector('#canvasId').toDataURL()
        // }, 0)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .dispensing_print_body {
    background-color: #fff;
    padding-top: 20px;
    table {
      width: 100%;
      thead {
        background-color: #fff;
      }
    }
  }
</style>
