<template>
  <div :style="{
    width: `${_width}px`,
    fontFamily: 'Microsoft YaHei',
    background: '#fff',
    padding: '5px 15px',
    fontSize: '9px;'
  }">
    <billBarcode :barCode="barCode"
      :options="{
        height: 30,
        width: 1
      }"
      :style="{
        marginTop: '15px',
        marginLeft: '10px',
        marginBottom: '-80px'
    }"/>
    <p :style="{
      textAlign: 'center',
      fontSize: '20px',
      margin: '50px 0 20px'
    }"><strong>备药单</strong> <span v-if="isSummary">（药品）</span>
      <strong class="eval-here" style="float:right; font-size: 12px"> <span style="font-size: 10px;">#p</span>/#P</strong>
    </p>
    <div :style="{
      overflow: 'hidden'
    }">
      <div
        v-if="inpatientArea.spaceRecordObject"
        :style="{
        float: 'left',
        paddingLeft: '10px'
      }">{{findBasesourceCode({arr: inpatientArea.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</div>
      <div :style="{
        float: 'right',
        paddingRight: '10px'
      }">打印时间：{{new Date() | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</div>
    </div>
    <div style="border: 1px solid #000;border-bottom: none;line-height: 30px;margin-top: 10px;">
      <div style="background: #ccc;overflow: hidden;border-bottom: 1px solid #000;">
        <div style="width: 40%;float: left;text-align: center;">药品名称</div>
        <div style="width: 40%;float: left;">规格</div>
        <div style="width: 20%;float: left;">数量</div>
      </div>
      <div id="win">
        <div v-for="(item, index) in liveTableData" :key="index" style=" border-top: 1px solid #000;">
          <div v-if="!isSummary" style="overflow: hidden; background: #eee;text-align: left;border-bottom: 1px solid #999; padding: 5px; line-height: 16px; font-size: 12px">
            <div style="width: 15%;float: left;"><strong style="font-size: 13px">{{index +1}}、</strong>床号：{{item.bedNum}}</div>
            <div style="width: 23%;float: left;" v-if="item.patientObject">
              <strong>{{item.patientObject.name}}</strong>
              ({{item.patientObject.sex | formatSex}}) {{item.patientObject.birthday | formatDateByExp('YYYY-MM-DD')}}
            </div>
            <div style="width: 10%;float: left;">{{item.employTxt}}</div>
            <div style="width: 25%;float: left;">预执行时间：
              <div style="display: inline-block" v-if="item.implementTime">{{item.implementTime | formatDateByExp('YYYY-MM-DD')}}</div>
              <strong style="display: inline-block; padding-left: 2px; font-size: 12px">
                <span v-if="item.termType"> {{item.implementTime | formatDateByExp('HH:mm')}}</span>
                <span v-else> 立即</span>
              </strong>
            </div>
            <div style="width: 27%;float: left;">UDD药包：{{item.code}}</div>
          </div>
          <div v-for="(drug, index) in item.uddDispenseItemList" :key="index">
            <div style="overflow: hidden;border-bottom: 1px solid #999;padding: 5px">
              <div style="width: 40%;float:left;" :style="fontStyle">
                <wh-code-to-name
                  :showIcon="false"
                  :isExt="true"
                  :patchObj="{
                    code: SEARCH_CODE,
                    list: drug.localSettingObject.materialSkuObject.ext,
                    isInfo: false
                  }"
                  :showSourceValue="drug.source">
                </wh-code-to-name>
              </div>
              <div style="width: 40%;float:left;" :style="fontStyle">
                {{parserJSON({data: drug.localSettingObject.materialSkuObject.ext, property: SPEC})}} -
                <span>{{parserJSON({data: drug.localSettingObject.materialSkuObject.ext, property: [SPU_SPEC_CODE], isInfo: false})}}</span>
              </div>
              <div style="width: 20%;float:left;" :style="fontStyle">
                {{drug.num}}
                {{parserJSON({arr: drug.localSettingObject.materialSkuObject.ext})}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mmConversionPx, SEARCH_CODE, SPU_SPEC_CODE, SPEC, SPACE_CODE, patch, parserJSON } from '@/util/common'
import billBarcode from './billBarcode.vue'
export default {
  props: {
    barCode: {
      default: 123456789
    },
    inpatientArea: {
      type: Object,
      default: () => ({})
    },
    liveTableData: {
      type: Array,
      default () {
        return []
      }
    },
    isSummary: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      SEARCH_CODE,
      SPU_SPEC_CODE,
      SPACE_CODE,
      parserJSON,
      SPEC,
      fontStyle: {
        fontSize: '9px',
        lineHeight: '16px'
      },
      width: 210,
      height: 297
    }
  },
  computed: {
    _width () {
      return mmConversionPx(this.width) - 35
    }
  },
  methods: {
    ...patch
  },
  components: {
    billBarcode
  }
}
</script>
