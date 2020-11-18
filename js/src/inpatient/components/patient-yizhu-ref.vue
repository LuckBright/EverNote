<template>
  <div class="patient-yizhu flex_column_full flex_layout_scroll">
    <el-row>
      <!-- serviceTypes -->
      <el-radio v-model="serviceTypes" label="">全部医嘱</el-radio>
      <el-radio v-model="serviceTypes" label="301,302,303,304">药品医嘱</el-radio>
      <el-radio v-model="serviceTypes" label="800">检查医嘱</el-radio>
      <el-radio v-model="serviceTypes" label="801">检验医嘱</el-radio>
    </el-row>
    <el-button v-show="data.length && $route.meta.handleType !== 1" class="adduce-all" type="text" @click="adduceAll">全部引用</el-button>
    <el-tree :data="data" class="flex_layout_scroll">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="$route.meta.handleType !== 1" type="text" size="mini" @click="() => quote(data)">引用</el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import api from '@/inpatient/store/phr'
// import Vue from 'vue'
export default {
  props: ['visitId', 'scene'],
  data () {
    return {
      serviceTypes: '',
      data: []
    }
  },
  watch: {
    'serviceTypes' (val) {
      this.getDoctorAdviceByMessage()
    }
  },
  created () {
    this.getDoctorAdviceByMessage()
  },
  methods: {
    getDoctorAdviceByMessage () {
      let params = {
        visitNumber: this.visitId
      }
      let serviceTypes = this.serviceTypes ? this.serviceTypes.split(',') : []
      params.serviceTypes = serviceTypes
      api.getDoctorAdviceByMessage(params).then(async result => {
        let datas = []
        if (!result || !result.length) {
          this.data = []
          return false
        }
        // 补一个逻辑 如果没有 advicename 不显示数据
        // result = result.filter(v => {
        //   if (v.serviceName) {
        //     return v
        //   }
        // })
        result.map(item => {
          let adviceName = item.adviceJson && item.adviceJson.doctorAdviceName || item.serviceName || ''
          let adviceContent = item.adviceJson && item.adviceJson.doctorAdviceContent || ''
          datas.push({
            val: `${adviceName} ${adviceContent}`,
            label: `${adviceName} ${adviceContent}`
          })
        })
        this.data = datas
        // const getInfo = (value, sp, unit) => {
        //   if (!value && value !== 0) {
        //     return ''
        //   }
        //   unit = unit || ''
        //   sp = sp === undefined ? '' : sp
        //   return sp + value + unit
        // }
        // for (let i = 0; i < result.length; i++) {
        //   let v = result[i]
        //   let val = ''
        //   let time = ''
        //   // 中西药
        //   let type = -1
        //   if (['302', '303', '304'].includes(v.serviceType)) {
        //     type = 1
        //   }
        //   if (['301'].includes(v.serviceType)) {
        //     type = 2
        //   }
        //   // 途径
        //   let employ = v.employ && v.adviceJson && v.adviceJson.employName
        //   // 频次
        //   let useFreq = v.useFreq && v.adviceJson && v.adviceJson.useFreqName
        //   // 总数量
        //   let count = (() => {
        //     if (type === 1) {
        //       return '共' + v.count + '剂'
        //     } else if (type === 2) {
        //       return '共' + v.count + v.countUnit
        //     } else {
        //       return v.count + v.countUnit
        //     }
        //   })()
        //   if (v.termType === 1) {
        //     val = '长期'
        //   } else if (v.termType === 0) {
        //     val = '临时'
        //   }

        //   if (v.startTime) {
        //     time = this.$moment(v.startTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm')
        //   }

        //   if (this.scene === 'clinic') {
        //     // 医嘱名称，途径，用量，天数，频次，总数量
        //     let info = getInfo(v.adviceName, ' ') +
        //       getInfo(employ, ' ') +
        //       getInfo(v.measure && ('每次' + v.measure), ', ', v.measureUnitName) +
        //       getInfo(v.totalUseDay + 1, ' ', '天') +
        //       getInfo(useFreq, ' ') +
        //       getInfo(count, ' ')
        //       // getInfo(time, ' ')
        //     datas.push({
        //       val: info,
        //       label: info
        //     })
        //   } else {
        //     // 长/临，医嘱名称，途径，用量，频次，开始时间
        //     let info = getInfo(val) +
        //       getInfo(v.adviceName, ' ') +
        //       getInfo(employ, ' ') +
        //       getInfo(v.measure && ('每次' + v.measure), ' ', v.measureUnitName) +
        //       getInfo(useFreq, ' ')
        //     datas.push({
        //       val: info,
        //       label: info + getInfo(time, ' ')
        //     })
        //   }
        // }
        // this.data = datas
      })
    },
    quote (data) {
      if (data.children) {
        this.$bus.$emit('ref:append', '<p>' + data.children.map(v => v.val).join('</p><p>') + '</p>')
      } else {
        this.$bus.$emit('ref:append', '<p>' + data.val + '</p>')
      }
    },
    adduceAll () {
      let vals = []
      this.data.forEach(item => {
        if (item.children) {
          vals.push(...item.children.map(v => v.val))
        } else {
          vals.push(item.val)
        }
      })
      this.$bus.$emit('ref:append', '<p>' + vals.join('</p><p>') + '</p>')
    }
  }
}
</script>
<style lang="scss" scoped>
  .custom-tree-node {
    white-space: initial;
  }
  .el-tree /deep/ .el-tree-node__content {
    height: initial;
  }
  .adduce-all {
    margin-left: 24px;
    text-align: left;
  }
</style>
