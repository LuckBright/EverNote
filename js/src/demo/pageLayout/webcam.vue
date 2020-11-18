<template>
  <div style="position:relative">
    <div class="avatar" v-if="!webcamFlag">
      <img :src="imgViewUrlTmp">
    </div>
    <div class="avatar" v-if="webcamFlag">
      <div id="my_camera"></div>
    </div>
    <el-button type="primary" class="snapBtn" size="mini" v-on:click="takeSnapshot()"><i class="icon iconfont icon-PHR-Camera"></i> 拍照</el-button>
  </div>
</template>

<script>
  import Webcam from 'webcamjs'

  export default {
    props: ['webcamFlag'],
    data () {
      return {
        dataUri: '',
        imgViewUrlTmp: ''
      }
    },
    methods: {
      takeSnapshot () {
        let self = this
        Webcam.snap(function (dataUri) {
          self.$emit('input', dataUri)
          self.imgViewUrlTmp = dataUri
          self.$emit('update:webcamFlag', false)
        })
      }
    },
    created () {

    },
    mounted () {
      Webcam.set({
        width: 344,
        height: 258,
        image_format: 'jpeg',
        jpeg_quality: 98,
        swfURL: '../../../static/assets/webcam.swf'
      })
      Webcam.attach('#my_camera')
    },
    components: {
      Webcam
    }
  }
</script>
