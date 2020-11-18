<template>
   <div style="100%">
    <input
    :type="type"
    name="birthday"
    placeholder="请输入出生日期"
    :class="value?'full':''"
    :value.sync="value"
    @change="setSelect"
    @blur="getblur"
    @focus="getfocus"
    :disabled="disabled"/>
   </div>
</template>
<script>
  export default {
    props: ['disabled', 'type', 'value', 'isError'],
    data () {
      return {
        iptClass: 'normal-ipt'
      }
    },
    methods: {
      setSelect (option) {
        this.selected = option
      },
      getblur () {
        if (!this.value) {
          this.iptClass = 'error-ipt'
        }
      },
      getfocus () {
        if (this.value) {
          this.iptClass = 'normal-ipt'
        }
      }
    },
    computed: {
      selected: {
        set (val) {
          this.$emit('update:value', val.target.value)
        },
        get () {
          return this.value
        }
      }
    },
  }
</script>
<style scoped>
body{margin:0; padding:0;}
input{
  width:100%;
  background: #ffffff;
  border:0 none;
  border-radius: 0px;
  box-shadow: none;
  height:30px;
  outline: none;
  appearance:none;
	-moz-appearance:none;
  -webkit-appearance:none;
  border-radius: 0px;
}
input::-webkit-calendar-picker-indicator{
  display: none;
}
input::after {
  font-size: 14px;
  content: '\e77a';
  color: #BBBBBB;
  position: absolute;
  right: 0px;
  font-family: "iconfont" !important;
 }
 input[type="date"]:before{
    color:#A9A9A9;
    content:attr(placeholder);
}
input[type="date"].full:before {
    color:black;
    content:""!important;
}
.is-error input[type="date"]:before{
    color:#ee4433;
    content:attr(placeholder);
}
::-webkit-datetime-edit-year-field {display: none; }
::-webkit-datetime-edit-month-field {display: none;}
::-webkit-datetime-edit-day-field {display: none; }
::-webkit-datetime-edit-text {display: none; }
/* input.normal-ipt::after{
  display: none;
  font-family: "iconfont" !important;
  font-size: 14px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: '\E7B2 必填';
  color: #ee4433;
  position: absolute;
  right: 30px;
}
input.error-ipt::after{
  display: block;
  font-family: "iconfont" !important;
  font-size: 14px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: '\E7B2 必填';
  color: #ee4433;
  position: absolute;
  right: 30px;
} */
</style>
