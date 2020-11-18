<template>
  <div class="layout_inner" style="width:600px">
    value{{value}}
    <br>
    <el-select v-model="sel" value-key="id" placeholder="请选择" multiple>
      <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    'value': {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      options: [{
        id: 11,
        pid: 122,
        label: '黄金糕'
      }, {
        id: 12,
        pid: 122,
        label: '双皮奶'
      }, {
        id: 13,
        pid: 122,
        label: '蚵仔煎'
      }, {
        id: 14,
        pid: 122,
        label: '龙须面'
      }, {
        id: 15,
        pid: 122,
        label: '北京烤鸭'
      }],
      sel: ''
    }
  },
  created () {
    // this.sel = this.value
  },
  methods: {
  },
  watch: {
    'value': {
      handler: function (val) {
        this.sel = val
      },
      immediate: true
    },
    'sel': function (newVal) {
      // 必须是input
      this.$emit('input', newVal)
    }
  }
}
</script>
