<template>
  <div v-if="barCode">
    <barcode v-if="!showQrCode" :value=String(barCode) :options="barcodeOptions" tag="img"></barcode>
    <qrcode v-else :value=String(barCode) :options="qrcodeOptions" tag="img"></qrcode>
  </div>
</template>
<script>
export default {
  props: {
    showQrCode: {
      default: false
    },
    barCode: {
      default: undefined
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      barcodeOpts: { displayValue: true, width: 1, height: 20, fontSize: 10, margin: 0 },
      qrcodeOpts: { size: 20, width: 50, height: 50, margin: 0.5 }
    }
  },
  computed: {
    'barcodeOptions' () {
      return Object.assign({}, this.barcodeOpts, this.options)
    },
    'qrcodeOptions' () {
      return Object.assign({}, this.qrcodeOpts, this.options)
    }
  }
}
</script>
