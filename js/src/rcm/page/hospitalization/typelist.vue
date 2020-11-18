<template>
  <table class="inner_table" v-loading='tableLoading'>
    <tbody>
      <tr v-for='item in tableData' :key='item.index'>
        <template v-for='v in item'>
          <td class='setBg' :key='v.id'>{{v.itemClassName}}</td>
          <td :key='v.id'>{{v.fee | formatToFinacial}}</td>
        </template>
      </tr>
      <tr>
        <template v-for='item in allData'>
          <td class='setBg' :key='item.id'>{{item.itemClassName}}</td>
          <td v-if='item.isAll' :colspan="8-allData.length" :key='item.id'>{{item.fee | formatToFinacial}}</td>
          <td v-else :key='item.id'>{{item.fee | formatToFinacial}}</td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { getFeeClassByIpNo } from '@/rcm/store/hospital/hospital'
export default {
  prop: ['obj'],
  data () {
    return {
      tableLoading: false,
      tableData: [],
      allData: [],
      addFee: 0
    }
  },
  created () {
    // this.getDetail()
  },
  methods: {
    async getDetail (ipNo, settlementId) {
      this.tableData = []
      this.allData = []
      this.tableLoading = true
      this.addFee = 0
      try {
        let params = {ipNo: ipNo, settlementId: settlementId}
        let data = await getFeeClassByIpNo(params)
        if (data && data.data) {
          if (data.data.length > 0) {
            data.data.forEach(item => {
              this.addFee += item.fee
            })
            data.data.push({
              itemClassName: '合计',
              fee: this.addFee,
              isAll: 1
            })
            if (data.data.length % 4 === 0) {
              for (let i = 0, len = data.data.length; i < len; i += 4) {
                this.tableData.push(data.data.slice(i, i + 4))
              }
            } else {
              let addArr = data.data.slice(
                0,
                parseInt(data.data.length / 4) * 4
              )
              for (let i = 0, len = addArr.length; i < len; i += 4) {
                this.tableData.push(addArr.slice(i, i + 4))
              }
              this.allData = data.data.slice(parseInt(data.data.length / 4) * 4)
            }
          }
        }

        this.tableLoading = false
      } catch (err) {
        console.log(err)
        this.tableLoading = false
      }
    }
  }
}
</script>
<style scoped>
table {
  width: 100%;
  font-size: 14px;
  border: 1px solid #ddd;
  line-height: 35px;
  border-spacing: 0;
  border-collapse: collapse;
}
td {
  text-align: center;
  padding: 10px;
  line-height: 20px;
  vertical-align: baseline;
  border-right: 1px solid #ddd;
  overflow: hidden;
}
.setBg {
  background-color: #f8f8f8;
  width: 10%;
}
tr {
  border-bottom: 1px solid #ddd;
}
</style>
