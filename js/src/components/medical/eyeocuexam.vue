<template>
  <div class="eye_inp_wrap">
    <div class="war">
      <div class="line l1"></div>
      <div class="line l2"></div>
      <div class="line l3"></div>
      <div class="cri"></div>
      <div class="eyeInput i1">
        <input v-model="eyeocuexam.l1" :disabled="disabled"/>
      </div>
      <div class="eyeInput i2">
        <input v-model="eyeocuexam.l2" :disabled="disabled"/>
      </div>
      <div class="eyeInput i3">
        <input v-model="eyeocuexam.l3" :disabled="disabled"/>
      </div>
      <div class="eyeInput i4">
        <input v-model="eyeocuexam.l4" :disabled="disabled"/>
      </div>
      <div class="eyeInput i5">
        <input v-model="eyeocuexam.l5" :disabled="disabled"/>
      </div>
      <div class="eyeInput i6">
        <input v-model="eyeocuexam.l6" :disabled="disabled"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['value', 'disabled'],
    data () {
      return {
        eyeocuexam: {
          l1: '',
          l2: '',
          l3: '',
          l4: '',
          l5: '',
          l6: ''
        }
      }
    },
    watch: {
      'value' (val) {
        if (val) {
          Object.assign(this.eyeocuexam, val)
        }
      },
      'eyeocuexam': {
        handler (val) {
          this.$emit('input', val)
        },
        deep: true
      }
    },
    created () {
      // this.input = this.value
    },
    methods: {

    }
  }
</script>
<style scoped>
  .eye_inp_wrap{
    padding: 10px 0;
  }
  .war{width: 140px; margin-left:50px; height: 160px;position: relative;}
  .cri {width: 140px;height: 140px; border: 1px solid #000;border-radius: 70px;position: absolute;top:0;display: none}
  .line{border-bottom: 2px solid #000; width: 140px; height: 0}
  .l1{transform:rotate(0) translate(0, 70px);}
  .l2{transform:rotate(60deg) translate(60px, 30px)}
  .l3{transform:rotate(120deg) translate(54px, 0px);}
  .eyeInput{position: absolute; width: 40px}
  .eyeInput input{width: 36px;font-size: 14px;padding: 3px 3px;border-radius: 3px;border:1px solid #666;}
  .eyeInput input:disabled{background:#eee}
  .i1{left: 89px; top:-11px;}
  .i2{left: 128px; top:57px;}
  .i3{left: 87px; top:120px;}
  .i4{left: 16px; top:120px;}
  .i5{left: -25px; top:57px;}
  .i6{left: 16px; top:-11px;}
</style>
