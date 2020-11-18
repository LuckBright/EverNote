<template>
  <div class="timerange">
    <el-row 
      class="select_value" 
      :gutter="5" 
      type="flex"
      justify="center"
      >
      <el-col v-for="(item,key) of value" :key="key" :span="6" @click.native="toggle">
        <div class="time_value" :class="{disabled:disabled}">{{item}}</div>
      </el-col>
    </el-row>
    <div class="select_options" v-if="show">
      <el-row v-for="(option,index) of options" :key="index">
        <el-col v-for="(label,index) of option.label" :key="index" :span="6" @click.native="select(option)">
          <div class="option_value">{{label}}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
// import {axisYRange} from '@/emr/config/temperaturedata.js'
export default {
  name: 'axis_y_range',
  props: {
    disabled: {
      type: Boolean
    },
    value: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    // this.select(this.options[0])
  },
  methods: {
    toggle () {
      if (this.disabled) return
      this.show = !this.show
    },
    select (option) {
      this.show = false
      this.$emit('input', option.value)
    }
  },
  watch: {
    options: {
      handler (val) {
        this.select(val[0])
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.timerange{
  $height:30px;
  position: relative;
  .disabled{
    background:#eee;
    cursor: not-allowed;
  }
  .select_value{
    width: 100%;
    height:$height;
    cursor: pointer;
    .time_value{
      border:1px solid #ccc;
      height:$height;
      text-align: center;
    }
  }
  .select_options{
      position:absolute;
      left:0;
      top:35px;
      z-index:2;
      background:#fff;
      width: 100%;
      border:1px solid #ccc;
      max-height: 200px;
      overflow:auto;
      .el-row{
        &:hover{
          background:#1c7bef;
          cursor:pointer;
          color:#fff;
        }
      }
      .option_value{
        text-align: center;
      }
  }  
}
</style>
