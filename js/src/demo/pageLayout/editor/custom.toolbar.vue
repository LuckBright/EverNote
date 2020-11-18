<template>
  <div class="custom_toolbar">
    <div class="col font_size_wrap">
      <span @click="fontSizeHandle(1)" title="缩小字号" style="font-size:12px;">A</span><span @click="fontSizeHandle(2)" title="增大字号" style="font-size:16px;">A</span>
    </div>
    <div class="col color_warp">
      <span v-for="item in color" @click="textColorHandle(item)" :key="item" :style="'background:' + item"></span>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['editor'],
    data () {
      return {
        color: ['#f65858', '#ff9800', '#cddc39', '#4caf50', '#03a9f4', '#999999'],
        fontSize: 10.5,
      }
    },
    methods: {
      fontSizeHandle (type) {
        let size = this.fontSize
        if (type === 1) {
          size -= 0.5
          this.editor.data.commands['font_size']({pt: size})
        } else if (type === 2) {
          size += 0.5
          this.editor.data.commands['font_size']({pt: size})
        }
      },
      textColorHandle (color) {
        this.editor.data.commands['text_color']({color: color})
      }
    },
    watch: {
      'editor.data.getMarkAttrs' (val) {
        this.fontSize = val('font_size') && val('font_size').pt && (typeof (val('font_size').pt) !== 'string') ? val('font_size').pt : 10.5
      }
    }
  }
</script>
<style lang="scss" scoped>
.custom_toolbar{
  padding: 5px;
  .col{
    display: inline-block;
    margin-right: 5px;
    span{
      margin: 0 3px;
      user-select: none;
      cursor: pointer;
    }
  }
  .font_size_wrap{
    span{
      padding: 2px;
    }
  }
  .color_warp{
    span{
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 100%;
    }
  }
}
</style>
