<!-- 患者信息详细组件 -->
<template>
  <!-- <div id="mainheader" class="patient-info">
    <header>
      <template>
        <img :src="picValue | fixImgSrc">
      </template>
      <el-row class="first mr10">
        <strong class="mr10">{{patientName}}</strong>
        <span class="color99">{{patientSex}}</span>
        <span class="color99">{{patientAge}}</span>
        <div v-for="(item, i) in patientSchema" :key="i" class="dispib pl20 pb10">
          <span class="color99">{{item.label}}</span>&nbsp;&nbsp;
          <span v-if="item.name">{{item.name}}</span>
          <template v-if="subsequent && item.key === 'visitSn'">&nbsp;&nbsp;<span class="subsequent">急诊</span></template>
        </div>
      </el-row>
    </header>
  </div> -->
  <div>
    <img class="avatar" :src="picValue | fixImgSrc">
    <div class="info">
      <p>
        <span class="name">{{patientName}}</span>
        <span class="msg">{{patientAge}}</span>
        <span class="msg">{{patientSex}}</span>
        <span class="msg">{{patientSchema[0].name}}</span>
        <span v-if="subsequent" class="subsequent">急诊</span>
        <span v-for="(item, index) in patientSchema" :key="index" v-if="index > 1 && index < 5">{{`${item.label}：${item.name}`}}</span>
        <span class="tips red"><i class="iconfont icon-beibohui"></i>{{`${patientSchema[1].label}：${patientSchema[1].name}`}}</span>
      </p>
      <p>
        <span v-for="(item, index) in patientSchema" :key="index" v-if="index > 4">{{`${item.label}：${item.name}`}}</span>
      </p>
    </div>
    <el-button class="contro-btn" type="text" @click="logFn">操作记录</el-button>
  </div>
</template>
<script>
import {objHas, dateFormat} from '@/util/common'
export default {
  props: ['customObj', 'logFn', 'subsequent'],
  data () {
    return {
      // 头像
      picValue: '',
      // 姓名
      patientName: '',
      // 性别
      patientSex: '',
      // 年龄
      patientAge: '',
      // 其它详情
      patientSchema: [
        { key: 'visitSn', name: '', label: '门诊号' },
        { key: 'allergen', name: '', label: '过敏史' },
        { key: 'birthday', name: '', label: '出生日期' },
        { key: 'height', name: '', label: '身高' },
        { key: 'weight', name: '', label: '体重' },
        { key: 'providerName', name: '', label: '科室' },
        { key: 'doctorName', name: '', label: '医生' },
        { key: 'doctorPhone', name: '', label: '医生电话' },
        { key: 'diagnostic', name: '', label: '诊断名称' }
      ]
    }
  },
  created () {
    this.readonlyObjItem(this.customObj)
  },
  methods: {
    readonlyObjItem (data = {}) {
      this.patientName = data.name || ''
      this.patientSex = data.sex && data.sex === '1' ? '男' : '女'
      this.patientAge = data.age ? data.age + '岁' : ''
      this.patientSchema.forEach(v => {
        if (objHas(data, v.key)) {
          v.name = v.key === 'birthday' ? dateFormat(data[v.key], 'YYYY-MM-DD') : data[v.key]
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// #mainheader{height:60px;padding: 10px 0 10px 20px;position: relative;margin-bottom: 10px; font-size: 14px}
// #mainheader img{width: 70px;height: 70px;border-radius: 50%;position: absolute;left: 10px;top:8px;}
// #mainheader strong{color: #000;font-size: 24px;display: inline-block; }
// #mainheader .first{height:20px;line-height: 20px;margin-left:70px;}
// #mainheader .color99 { color: #999999; }
// #mainheader .dispib {display: inline-block;}
// #mainheader .subsequent {padding: 2px 6px; border: 1px solid #EE4433; color:#EE4433;}
</style>
