<template>
  <el-select v-model="select" placeholder="请选择" clearable :disabled="disabled">
    <el-option
      v-for="item in insurances"
      :key="item.insurProductId"
      :label="item.productName"
      :value="item.insurProductId">
      <span style="float: left">{{ item.productName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.insurCompany }}</span>
    </el-option>
  </el-select>
</template>
<script>
  import insurance from '../../card/store/insuranceapi'

  export default {
    props: ['patientid', 'value', 'init', 'disabled'],
    data () {
      return {
        insurances: [],
        preselect: [],
        select: ''
      }
    },
    methods: {
      list: function () {
        insurance.listByUser(this.patientid).then(result => {
          this.insurances = result.data.map(v => {
            v.insurOrgId = v.insurerId
            v.insurProductId = v.productId
            delete v.id
            return v
          })
          this.$nextTick(_ => {
            this.initSel()
          })
        })
      },
      handleCurrentChange (sel) {
        this.$emit('input', [sel])
      },
      initSel: function () {
        this.init.forEach(v => {
          let sel = this.insurances.filter(v1 => {
            return v.insurProductId === v1.insurProductId
          })[0]
          console.log(sel)
          if (sel) {
            this.select = sel.insurProductId
          }
        })
      }
    },
    watch: {
      'patientid': function () {
        console.log(this.patientid)
        if (this.patientid) {
          this.list()
        } else {
          this.insurances = []
        }
      },
      'init': function () {
        this.initSel()
      },
      'select': function (selVal) {
        let sel = this.insurances.filter(v1 => {
          return selVal === v1.insurProductId
        })[0]
        sel = sel ? [sel] : []
        this.$emit('input', sel)
      }
    },
    created () {
      if (this.patientid) {
        this.list()
      }
    }
  }
</script>
