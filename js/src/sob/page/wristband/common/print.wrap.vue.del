<template>
  <div>
      <template v-if="viewType === 2">
        <div class="print_wrap box_02" :class="{preview: isPreview}">
          <div class="inner">
            <div class="img">
              <barcode v-if="qrcodeData" :value="String(qrcodeData)" :options="{displayValue: true, width: 6, height: 60, fontSize: 32, fontOptions: 'bold', margin: 0, textMargin: 0, font: 'Arial Black'}" tag="img"></barcode>
            </div>
            <div class="info_box">
              <template v-for="item,index in pdata">
                <template v-if="settings.indexOf(item.name) !== -1">
                  <template v-if="item.name === 'allergicHis'">
                    <template v-if="allergicHis">
                      <sys-value class="item" type="CV05.01.038" :code="allergicHis"></sys-value>
                    </template>
                  </template>
                  <template v-else-if="item.name === 'patientSex'">
                    <span class="item"><template v-if="printData && printData[item.name]"><sys-value type="GBT.2261.1" :code="printData[item.name]"></sys-value></template></span>
                  </template>
                  <template v-else>
                    <span class="item">{{(printData && printData[item.name]) ? (printData[item.name] + (item.next ? item.next : '')) : ''}}</span>
                  </template>
                </template>
              </template>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="print_wrap box_01" :class="isPreview ? 'preview' : ''">
          <div class="info_box">
            <template v-for="item,index in pdata">
              <template v-if="settings.indexOf(item.name) !== -1">
                <template v-if="item.name === 'allergicHis'">
                  <template v-if="allergicHis">
                    <sys-value class="item" type="CV05.01.038" :code="allergicHis"></sys-value>
                  </template>
                </template>
                <template v-else-if="item.name === 'patientSex'">
                  <span class="item"><template v-if="printData && printData[item.name]"><sys-value type="GBT.2261.1" :code="printData[item.name]"></sys-value></template></span>
                </template>
                <template v-else>
                  <span class="item">{{(printData && printData[item.name]) ? (printData[item.name] + (item.next ? item.next : '')) : ''}}</span>
                </template>
              </template>
            </template>
          </div>
          <div class="img"><qrcode v-if="qrcodeData" :value="String(qrcodeData)" :options="{ size: 200}" tag="img"></qrcode></div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import {NORMAL_INFO, NEONATE_INFO} from './config'
  export default {
    data () {
      return {
        NORMAL_INFO,
        NEONATE_INFO,
        pdata: (this.type === 2 ? NEONATE_INFO : NORMAL_INFO),
        qrcodeData: '',
        printData: ''
      }
    },
    props: ['value', 'settings', 'type', 'isPreview', 'viewType'],
    mounted () {
      this.setQrcodeData()
    },
    computed: {
      allergicHis () {
        try {
          if (this.printData && this.printData.allergicHis) {
            if (typeof this.printData.allergicHis === 'string') {
              let allergicHis = JSON.parse(this.printData.allergicHis)
              if (allergicHis && allergicHis.length) {
                return allergicHis[0].allergen
              } else {
                return null
              }
            } else if (typeof this.printData.allergicHis === 'object') {
              return this.printData.allergicHis.length ? this.printData.allergicHis[0].allergen : null
            } else {
              return this.printData.allergicHis
            }
          } else {
            return null
          }
        } catch (e) {
          console.log('----phr---->', e)
          return null
        }
      }
    },
    methods: {
      setQrcodeData () {
        if (this.value) {
//          let data = {
//            id: this.value.id,
//            patientId: this.value.patientId,
//            hospitalizedNumber: this.value.hospitalizedNumber,
//            providerId: this.value.providerId,
//            infectedPatchId: this.value.infectedPatchId,
//            hospitalNum: this.value.hospitalNum
//          }
//          console.log('------->', data)
          this.qrcodeData = this.value.wristbandCode
        } else {
          this.qrcodeData = ''
        }
        this.setPrintData()
      },
      setPrintData () {
        if (this.isPreview) {
          this.printData = {
            patientName: '王晓丹',
            patientSex: '2',
            patientAge: '25',
            providerName: '产科',
            hospitalizedNumber: 'BJ133332111233441',
            hospitalNum: '3-203',
            allergicHis: '[{"allergen": "737", "remark": "sdsdsd"}]'
          }
          this.qrcodeData = 'WB0100000000'
        } else {
          this.printData = this.value
        }
      }
    },
    watch: {
      'type' (val) {
        this.pdata = (this.type === 2 ? NEONATE_INFO : NORMAL_INFO)
      },
      'value': {
        handler () {
          this.setQrcodeData()
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .print_wrap{
    display: flex;
    align-items: center;
    width: 280px;
    height: 140px;
    padding:8px 0 0 50px;
    &.box_01{
      .img{
        width: 60px;
        height: 60px;
        img{
          height: 100%;
        }
      }
     }
    &.box_02{
       padding:8px 0 0 65px;
       .img{
         max-width:230px;
       }
     }
    &.preview{
      margin: 0 auto;
    }
    .info_box{
      flex: 1;
      font-size: 12px;
      font-weight: 600;
      .item{
        display: inline-block;
        line-height: 18px;
        white-space: nowrap;
        margin-left: 22px;
      }
    }
    .img{
      margin: 0 auto;
      line-height: 0;
      img{
        width: 100%;
      }
    }
  }
</style>
