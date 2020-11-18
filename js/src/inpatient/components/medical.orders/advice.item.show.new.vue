<template>
  <div class="advice_items_wrap">
    <ul class="items_list" :class="classObject">
      <!-- 检查/检验 -->
      <li class="items" v-if="adviceItem.positionName">
        {{$t('检查部位')}}：{{adviceItem.positionName}}
      </li>
      <li class="items" v-if="adviceItem.illHis">
        {{$t('简要病史')}}：{{adviceItem.illHis}}
      </li>
      <li class="items" v-if="adviceItem.examineTarget">
        {{$t('检查目的')}}：{{adviceItem.examineTarget}}
      </li>
      <li class="items" v-if="adviceItem.assistExamine">
        {{$t(visitType===3 ? '辅助检查' : '检查结果')}}：{{adviceItem.assistExamine}}
      </li>
      <li class="items" v-if="adviceItem.otherExamine">
        {{$t('相关诊断')}}：{{adviceItem.otherExamine}}
      </li>
      <li class="items" v-if="adviceItem.specimenTypeName && item.serviceType !== '10000'">
        {{$t('标本类型')}}：{{adviceItem.specimenTypeName}}
      </li>
      <li class="items" v-if="adviceItem.checkGuidance">
        <template v-if="item.serviceType === '801'">{{$t('检验指导')}}：</template><template v-else>{{$t('检查指导')}}：</template>{{adviceItem.checkGuidance}}
      </li>
      <li class="items" v-if="Number(adviceItem.emergencyFlag) === 1">
        {{$t('加急')}}：是
      </li>
      <!-- 手术 -->
      <li class="items" v-if="adviceItem.chiefKnifeName">
        {{$t('主刀医生')}}：{{adviceItem.chiefKnifeName}}
      </li>
      <li class="items" v-if="adviceItem.anesthesiologistName">
        {{$t('麻醉医生')}}：{{adviceItem.anesthesiologistName}}
      </li>
      <li class="items" v-if="adviceItem.assistantItem && adviceItem.assistantItem.length">
        {{$t('助理医生')}}：<label :key="d" v-for="(doctor, d) in adviceItem.assistantItem">{{doctor.doctorName || doctor.name}} </label>
      </li>
      <li class="items" v-if="adviceItem.position && adviceItem.position.name">
        {{$t('手术部位')}}：{{adviceItem.position.name}}
      </li>
      <li class="items" v-if="adviceItem.anaesthesia">
        {{$t('麻醉方式')}}：<sys-value type="CV06.00.103" v-if="adviceItem.anaesthesia" :code="adviceItem.anaesthesia"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.surgeryLevel">
        {{$t('手术等级')}}：<sys-value type="CV05.10.024" v-if="adviceItem.surgeryLevel" :code="adviceItem.surgeryLevel"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.cutLevel">
        {{$t('切口等级')}}：<sys-value type="CV05.10.022" v-if="adviceItem.cutLevel" :code="adviceItem.cutLevel"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.urgentLevel">
        {{$t('紧急级别')}}：<sys-value type="THC_CPOE_SSJJJB" v-if="adviceItem.urgentLevel" :code="adviceItem.urgentLevel"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.surgeryTime && item.serviceType === '2125'">
        {{$t('拟手术时间')}}：{{$moment(adviceItem.surgeryTime).format('YYYY-MM-DD HH:mm')}}
        {{adviceItem.isInfected}}
      </li>
      <li class="items" v-if="adviceItem.isInfected">
        {{$t('是否感染')}}：<span>{{Number(adviceItem.isInfected) ? '是' : '否'}}</span>
      </li>
      <li class="items" v-if="String(adviceItem.appointDoctorFlag) === '1'">
        {{$t('指定主刀医生')}}：是
      </li>
      <li class="items" v-if="String(adviceItem.appointAnesthesiologistFlag) === '1'">
        {{$t('指定麻醉医生')}}：是
      </li>
      <li class="items" v-if="String(adviceItem.appointDateFlag) === '1'">
        {{$t('指定手术时间')}}：是
      </li>
      <!-- 输血/备血 -->
      <li class="items" v-if="adviceItem.applyBooldNeedId && item.serviceType !== '10009' && item.serviceType !== '10000'">
        {{$t('输血品种')}}：<sys-value type="CV04.50.021" v-if="adviceItem.applyBooldNeedId" :code="adviceItem.applyBooldNeedId"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.applyBloodNum || adviceItem.matchingBloodNum">
        <template v-if="item.serviceType === '10001'">{{$t('申请血量')}}：{{adviceItem.applyBloodNum}}</template>
        <template v-if="item.serviceType === '10000'">{{$t('取血量')}}：{{adviceItem.applyBloodNum}}</template>
        <template v-if="item.serviceType === '10009'">{{$t('配血量')}}：{{adviceItem.matchingBloodNum}}</template>
        <sys-value type="THC_CPOE_BLOOD_UNIT" v-if="adviceItem.bloodUnitId" :code="adviceItem.bloodUnitId"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.applyTargetId && item.serviceType !== '10009' && item.serviceType !== '10000'">
        {{$t('输血目的')}}：<sys-value type="THC_CPOE_SXMD" v-if="adviceItem.applyTargetId" :code="adviceItem.applyTargetId"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.aboSerumId && item.serviceType !== '10009' && item.serviceType !== '10000'">
        ABO：<sys-value type="CV04.50.005" v-if="adviceItem.aboSerumId" :code="adviceItem.aboSerumId"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.rhSerumId && item.serviceType !== '10009' && item.serviceType !== '10000'">
        RH(D)：<sys-value type="CT05.10.001" v-if="adviceItem.rhSerumId" :code="adviceItem.rhSerumId"></sys-value>
      </li>
      <li class="items" v-if="adviceItem.applyBloodTime && item.serviceType !== '10009'">
        {{$t('用血时间')}}：{{$moment(adviceItem.applyBloodTime).format('MM-DD HH:mm')}}
      </li>
      <li class="items" v-if="adviceItem.collectSpecimensFlag === 1 && item.serviceType !== '10009' && item.serviceType !== '10000'">
        {{$t('采集标本')}}：是
      </li>
      <li class="items" v-if="adviceItem.operatingRoomName && item.serviceType !== '10009'">
        {{$t('手术室')}}：{{adviceItem.operatingRoomName}}
      </li>
      <!-- 药品及其他 -->
      <li class="items" v-if="adviceItem.dropSpeed">
        {{$t('滴速')}}：<sys-value type="THC_CPOE_DropRate" v-if="adviceItem.dropSpeed" :code="adviceItem.dropSpeed"></sys-value>
      </li>
      <li class="items" v-if="!['800', '801', '2124', '2125', '10000', '10001'].includes(item.serviceType)" :class="{'lineThrough': ['11', '210', '500'].includes(String(item.status)), 'cRed': String(item.status) === '70'}">
        {{item.doctorAdviceContent || '--'}}
      </li>
      <li class="items" v-if="adviceItem.executeNumber">
        {{$t('院内执行')}}：{{adviceItem.executeNumber}}次
      </li>
      <!-- 医事服务 -->
      <li class="items" v-if="adviceItem.freeSheetFlag === 1 && visitType === 1">
        {{$t('免单')}}：是<span v-if="adviceItem.freeReason">（{{adviceItem.freeReason}}）</span>
      </li>
    </ul>
    <span class="arrow_handle" @click.prevent="toggle" v-if="showArrow"><i class="iconfont" :class="hidden ? 'icon-xia' : 'icon-shang'"></i></span>
  </div>
</template>
<script>
import { isNull } from '@/util/common'
export default {
  props: ['item', 'visitType'],
  data () {
    return {
      isNull,
      hidden: true,
      insuranceMap: {
        '1': '医保',
        '0': '自费'
      },
      showArrow: false,
      className: ''
    }
  },
  computed: {
    adviceItem () {
      if (this.item) {
        return this.item
      } else {
        return {}
      }
    },
    classObject () {
      let obj = {}
      this.className = 'items_list_' + new Date().getTime() + Math.floor(Math.random() * 10)
      obj[this.className] = true
      obj.lineThrough = String(this.item.status) === '11'
      obj.cRed = String(this.item.status) === '70' || String(this.item.status) === '2'
      return obj
    }
  },
  mounted () {
    this.$bus.$off('isGetAdvice')
    this.$bus.$on('isGetAdvice', () => {
      this.$nextTick(() => {
        let totalWidth = document.querySelector('.' + this.className).clientWidth
        let itemWidth = 0
        document.querySelectorAll('.' + this.className + ' .items').forEach(item => {
          itemWidth += item.clientWidth + 15
          item.style.display = 'inline-block'
        })
        if (totalWidth >= itemWidth) {
          this.showArrow = false
        } else {
          this.showArrow = true
        }
      })
    })
  },
  methods: {
    toggle () {
      // el表格冻结列，展开会出现冻结列与表格对不齐的情况，通过操作dom去实现对齐
      const adviceEls = document.querySelectorAll('.el-table__body-wrapper .advice-toggle')
      const adviceElsFixed = document.querySelectorAll('.el-table__fixed-right .advice-toggle')
      const index = [].indexOf.call(adviceEls, this.$el.querySelector('.advice-toggle'))
      this.hidden = !this.hidden
      if (this.hidden) {
        adviceElsFixed.length && (adviceElsFixed[index].style.display = 'none')
      } else {
        adviceElsFixed.length && (adviceElsFixed[index].style.display = 'block')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .advice_items_wrap{
    display: flex;
    align-items: center;
    .lineThrough {
      text-decoration: line-through;
    }
    .cGrays {
      color: #666666;
      font-size: 12px;
    }
    .items_list{
      padding: 0;
      margin: 0;
      width: 100%;
      .items {
        margin-right: 15px;
      }
    }
    .arrow_handle{
      padding: 5px;
      line-height: 14px;
      cursor: pointer;
      .iconfont{
        font-size: 14px;
        color: #999;
      }
    }
  }
</style>
