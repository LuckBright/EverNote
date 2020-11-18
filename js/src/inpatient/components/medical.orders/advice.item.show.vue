<template>
  <div class="advice_items_wrap">
    <div class="items_list">
      <el-row>
        <el-col :span="24" v-if="adviceItem.positionName" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('检查部位')}}：{{adviceItem.positionName}}
        </el-col>
        <!--手术-->
        <!-- <template v-if="adviceItem.surgeryFreq">
          <template v-if="Array.isArray(adviceItem.surgeryFreq) && adviceItem.surgeryFreq.length">
            <el-col :span="24" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
              {{$t('手术名称')}}：<span v-for="(sitem, index) in adviceItem.surgeryFreq">{{sitem.name}}<template v-if="adviceItem.surgeryFreq.length > 1 && index !== (adviceItem.surgeryFreq.length - 1)">，</template></span>
            </el-col>
          </template>
          <template v-if="adviceItem.surgeryFreq.name" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
            {{$t('手术名称')}}：{{adviceItem.surgeryFreq.name}}
          </template>
        </template> -->
        <el-col :span="12" v-if="adviceItem.chiefKnifeName" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('主刀医生')}}：{{adviceItem.chiefKnifeName}}
        </el-col>
        <el-col :span="12" v-if="adviceItem.anesthesiologistName" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('麻醉医生')}}：{{adviceItem.anesthesiologistName}}
        </el-col>
        <!--备血 输血-->
        <el-col :span="24" v-if="adviceItem.applyBooldNeedId && item.serviceType !== '10009' && item.serviceType !== '10000'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('输血品种')}}：
          <sys-value type="CV04.50.021" v-if="adviceItem.applyBooldNeedId" :code="adviceItem.applyBooldNeedId"></sys-value>
        </el-col>
        <el-col :span="12" v-if="adviceItem.applyBloodNum || adviceItem.matchingBloodNum" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          <template v-if="item.serviceType === '10001'">{{$t('申请血量')}}：{{adviceItem.applyBloodNum}}</template>
          <template v-if="item.serviceType === '10000'">{{$t('取血量')}}：{{adviceItem.applyBloodNum}}</template>
          <template v-if="item.serviceType === '10009'">{{$t('配血量')}}：{{adviceItem.matchingBloodNum}}</template>
          <sys-value type="THC_CPOE_BLOOD_UNIT" v-if="adviceItem.bloodUnitId" :code="adviceItem.bloodUnitId"></sys-value>
        </el-col>
        <!--检验-->
        <el-col :span="24" v-if="adviceItem.specimenTypeName && item.serviceType !== '10000'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('标本类型')}}：{{adviceItem.specimenTypeName}}
        </el-col>
        <el-col :span="12" v-if="adviceItem.dropSpeed" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('滴速')}}：
          <sys-value type="THC_CPOE_DropRate" v-if="adviceItem.dropSpeed" :code="adviceItem.dropSpeed"></sys-value>
        </el-col>
        <!-- <el-col :span="12" v-if="!isNull(adviceItem.insuranceIdentification) && visitType === 1" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('医保类型')}}：{{insuranceMap[String(adviceItem.insuranceIdentification)]}}
        </el-col> -->
        <el-col :span="24" v-if="adviceItem.freeSheetFlag === 1 && visitType === 1" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('免单')}}：是<span v-if="adviceItem.freeReason">（{{adviceItem.freeReason}}）</span>
        </el-col>
        <el-col :span="24" v-if="Number(adviceItem.emergencyFlag) === 1" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('加急')}}：是
        </el-col>
        <el-col :span="24" v-if="!['800', '801', '2125', '10000', '10001'].includes(item.serviceType)" :class="{'lineThrough': String(item.status) === '11' || String(item.status) === '210' || String(item.status) === '500'}">
          <!-- {{item.doctorAdviceContent || '--'}} -->
          <template v-if="getAdviceContent(item)">
            <el-tooltip
              v-for="(content, index) in getAdviceContent(item)"
              :disabled="!content.tip"
              class="content"
              effect="dark"
              :content="content.tip"
              placement="top"
              :key="index"
            >
              <span>{{content.text}}</span>
            </el-tooltip>
          </template>
          <span v-else>--</span>
        </el-col>
        <!-- <el-col :span="12" v-if="adviceItem.quantity" class="cGrays">
          数量：{{adviceItem.quantity}}{{adviceItem.unitName}}
        </el-col> -->
      </el-row>
      <el-row class="advice-toggle" v-show="!hidden">
        <el-col :span="24" v-if="adviceItem.illHis" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('简要病史')}}：{{adviceItem.illHis}}</el-col>
        <el-col :span="24" v-if="adviceItem.examineTarget" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('检查目的')}}：{{adviceItem.examineTarget}}
        </el-col>
        <el-col :span="24" v-if="adviceItem.assistExamine" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t(visitType===3 ? '辅助检查' : '检查结果')}}：{{adviceItem.assistExamine}}</el-col>
        <el-col :span="24" v-if="adviceItem.otherExamine" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('相关诊断')}}：{{adviceItem.otherExamine}}
        </el-col>
        <!--手术-->
        <el-col :span="24" v-if="adviceItem.assistantItem && adviceItem.assistantItem.length" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('助理医生')}}：
          <label :key="d" v-for="(doctor, d) in adviceItem.assistantItem">{{doctor.doctorName || doctor.name}} </label>
        </el-col>
        <el-col :span="12" v-if="adviceItem.position && adviceItem.position.name" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('手术部位')}}：{{adviceItem.position.name}}
        </el-col>
        <el-col :span="12" v-if="adviceItem.anaesthesia" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('麻醉方式')}}：
          <sys-value type="CV06.00.103" v-if="adviceItem.anaesthesia" :code="adviceItem.anaesthesia"></sys-value>
        </el-col>
        <el-col :span="12" v-if="adviceItem.surgeryLevel" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('手术等级')}}：
          <sys-value type="CV05.10.024" v-if="adviceItem.surgeryLevel" :code="adviceItem.surgeryLevel"></sys-value>
        </el-col>
        <el-col :span="12" v-if="adviceItem.cutLevel" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('切口等级')}}：
          <sys-value type="CV05.10.022" v-if="adviceItem.cutLevel" :code="adviceItem.cutLevel"></sys-value>
        </el-col>
        <el-col :span="12" v-if="adviceItem.urgentLevel" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('紧急级别')}}：
          <sys-value type="THC_CPOE_SSJJJB" v-if="adviceItem.urgentLevel" :code="adviceItem.urgentLevel"></sys-value>
        </el-col>
        <el-col :span="24" v-if="adviceItem.surgeryTime && item.serviceType === '2125'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('拟手术时间')}}：{{$moment(adviceItem.surgeryTime).format('YYYY-MM-DD HH:mm')}}
        </el-col>
        <el-col :span="24" v-if="adviceItem.isInfected" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('是否感染')}}：
          <span>{{Number(adviceItem.isInfected) ? '是' : '否'}}</span>
        </el-col>
        <!--备血 输血-->
        <el-col :span="24" v-if="adviceItem.applyTargetId && item.serviceType !== '10009' && item.serviceType !== '10000'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('输血目的')}}：
          <sys-value type="THC_CPOE_SXMD" v-if="adviceItem.applyTargetId" :code="adviceItem.applyTargetId"></sys-value>
        </el-col>
        <el-col :span="12" v-if="adviceItem.aboSerumId && item.serviceType !== '10009' && item.serviceType !== '10000'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          ABO：
          <sys-value type="CV04.50.005" v-if="adviceItem.aboSerumId" :code="adviceItem.aboSerumId"></sys-value>
        </el-col>
        <el-col :span="12" v-if="adviceItem.rhSerumId && item.serviceType !== '10009' && item.serviceType !== '10000'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          RH(D)：
          <sys-value type="CT05.10.001" v-if="adviceItem.rhSerumId" :code="adviceItem.rhSerumId"></sys-value>
        </el-col>
        <el-col :span="24" v-if="adviceItem.applyBloodTime && item.serviceType !== '10009'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('用血时间')}}：{{$moment(adviceItem.applyBloodTime).format('MM-DD HH:mm')}}
        </el-col>
        <el-col :span="12" v-if="adviceItem.collectSpecimensFlag === 1 && item.serviceType !== '10009' && item.serviceType !== '10000'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('采集标本')}}：是
        </el-col>
        <el-col :span="24" v-if="adviceItem.operatingRoomName && item.serviceType !== '10009'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('手术室')}}：{{adviceItem.operatingRoomName}}
        </el-col>
        <!--检验-->
        <el-col :span="24" v-if="adviceItem.checkGuidance" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          <template v-if="item.serviceType === '801'">{{$t('检验指导')}}：</template><template v-else>{{$t('检查指导')}}：</template>{{adviceItem.checkGuidance}}
        </el-col>
        <el-col :span="12" v-if="adviceItem.executeNumber" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('院内执行')}}：{{adviceItem.executeNumber}}次
        </el-col>
        <!-- <el-col :span="12" v-if="adviceItem.executeProviderName && item.serviceType !== '10000' && visitType !== 1" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('执行科室')}}：{{adviceItem.executeProviderName}}
        </el-col> -->
        <!-- <template v-if="['303', '304'].includes(item.serviceType) && visitType !== 1">
          <el-col :span="12" v-if="adviceItem[0] && adviceItem[0].executeProviderName" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
            {{$t('执行科室')}}：{{adviceItem[0].executeProviderName}}
          </el-col>
        </template> -->
        <el-col :span="12" v-if="String(adviceItem.appointDoctorFlag) === '1'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('指定主刀医生')}}：是
        </el-col>
        <el-col :span="12" v-if="String(adviceItem.appointAnesthesiologistFlag) === '1'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('指定麻醉医生')}}：是
        </el-col>
        <el-col :span="12" v-if="String(adviceItem.appointDateFlag) === '1'" :class="{'lineThrough': String(item.status) === '11', 'c-red': ['2', '70'].includes(String(item.status))}">
          {{$t('指定手术时间')}}：是
        </el-col>
      </el-row>
    </div>
    <span class="arrow_handle" @click.prevent="toggle" v-if="adviceItem || item.doctorAdviceContent"><i class="iconfont" :class="hidden ? 'icon-xia' : 'icon-shang'"></i></span>
  </div>
</template>
<script>
import { isNull, Trim } from '@/util/common'
export default {
  props: ['item', 'visitType'],
  data () {
    return {
      isNull,
      hidden: true,
      insuranceMap: {
        '1': '医保',
        '0': '自费'
      }
    }
  },
  computed: {
    adviceItem () {
      if (this.item) {
        let item = JSON.parse(JSON.stringify(this.item))
        if (item.adviceJson) {
          item = Object.assign({}, item, item.adviceJson)
          delete item.adviceJson
        }
        return item
      } else {
        return {}
      }
      // if (this.item && this.item.adviceContent) {
      //   if (this.isJsonStr(this.item.adviceContent)) {
      //     let adviceContent = JSON.parse(this.item.adviceContent)
      //     // 兼容添加配血，自动添加的交叉配血和取血医嘱，adviceContent中没有血量字段
      //     if (!adviceContent.matchingBloodNum) {
      //       adviceContent.matchingBloodNum = this.item.matchingBloodNum
      //     }
      //     if (!adviceContent.useBloodNum) {
      //       adviceContent.useBloodNum = this.item.useBloodNum
      //     }
      //     if (!adviceContent.applyBloodNum) {
      //       adviceContent.applyBloodNum = this.item.applyBloodNum
      //     }
      //     return adviceContent
      //   } else {
      //     return {}
      //   }
      // } else if (this.item) {
      //   return this.item
      // } else {
      //   return {}
      // }
    }
  },
  methods: {
    getAdviceContent (advice) {
      let adviceContent = advice.doctorAdviceContent
      if (adviceContent) {
        let contentList = adviceContent.split(',')
        let l = contentList.length
        let list = contentList.map((item, index) => {
          let content = {}
          if (Trim(item) === advice.useFreqName && advice.useFreqTime) {
            content.tip = advice.useFreqTime
          }
          if (index === l - 1) {
            content.text = item
          } else {
            content.text = item + ','
          }
          return content
        })
        return list
      }
      return false
    },
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
  .advice_items_wrap {
    display: flex;
    align-items: center;
    .c-red {
      color: #000;
    }
    .lineThrough {
      text-decoration: line-through;
    }
    .cGrays {
      color: #666666;
      font-size: 12px;
    }
    .items_list{
      flex: 1;
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
