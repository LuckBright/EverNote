<template>
    <div  :ref="uuid" :id="uuid" :style="{'height':h,'width':w}"></div>
</template>
<script>
 import echarts from 'echarts'
 import {option} from '@/crm/assets/chartoptions'
 import api from '@/crm/store/lineapi'
 import uuidv4 from 'uuid/v4'
/*
title string 图表标题
height string 高度
type string '类型' 接口说明http://doc.everjiankang.com/pages/viewpage.action?pageId=24578115
yAxisName 纵坐标单位
xAxisName 横坐标单位
*/
export default {
   props: ['title', 'height', 'type', 'sex', 'yAxisName', 'xAxisName', 'patientId', 'width'],
   data () {
     return {
       testData: [],
       chart: null,
       h: this.height || '450px',
       w: this.width || '500px',
       uuid: uuidv4()
     }
   },
   mounted () {
     this.initOption()
   },
   methods: {
     setVal () {
       let obj = {
       }
       switch (this.type) {
         case 'height':
           obj.xMax = 1900
           break
         case 'weight':
           obj.xMax = 1900
           break
         case 'head':
           obj.xMax = 1900
           obj.yMin = 30
           obj.yMax = 60
           break
         case 'bmi':
           obj.xMin = 730
           obj.xMax = 1900
           obj.yMin = 10
           obj.yMax = 20
           break
         case 'height-weight':
           obj.xMin = 45
           obj.xMax = 120
           break
       }

       return obj
     },
     initOption () {
       this.chart = echarts.init(this.$refs[this.uuid])
       this.chart.setOption(option)
       this.setData()
     },
     setData () {
       let title = this.title
       // this.patientId = 'sGrUZNaNVs1LATC6KBg'

       let params = {
         type: this.type,
         patientId: this.patientId
       }
       api.getChartData(params).then(result => {
         let res = result.data
         if (res === null) return false
         let series = [
           {
             name: 'p3',
             type: 'line',
             data: res.p3
           },
           {
             name: 'p15',
             type: 'line',
             data: res.p15
           },
           {
             name: 'p50',
             type: 'line',
             data: res.p50
           },
           {
             name: 'p85',
             type: 'line',
             data: res.p85
           },
           {
             name: 'p97',
             type: 'line',
             data: res.p97
           },
           {
             name: '测量记录',
             type: 'scatter',
             data: res.sign
           }
         ]
         this.chart.setOption({
           title: {
             text: title
           },
           yAxis: {
             name: this.yAxisName,
             min: this.setVal().yMin || function (val) {
               return val.min
             },
             max: this.setVal().yMax || function (val) {
               return val.max
             }
           },
           xAxis: {
             name: this.xAxisName,
             min: this.setVal().xMin,
             max: this.setVal().xMax
           },
           series: series
         })
       })
     }
   }
}
</script>

