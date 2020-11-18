<!-- warehouse 图片 -->
<template>
  <div>
    <upload-file2
      v-if="isImgMultiple"
      v-model="photoUrlArr"
      :maxNum="maxNum || 6"
      @success="uploadSuccess"
      @change="fileList"
      :list="uploadList"
      :disabled="disabled"
      uploadApiType="ucloud"
      :tipMsg="tipMsg"
      isMultiple="true"
      listType="picture-card"
    ></upload-file2>
    <upload-file2
      v-else
      v-model="photoUrl"
      @success="uploadSuccess"
      @change="fileList"
      :list="uploadList"
      :disabled="disabled"
      listType="picture-card"
      only="true"
      cardOnly="true"
      :tipMsg="tipMsg"
      uploadApiType="ucloud"
    ></upload-file2>
  </div>
</template>
<script>
export default {
  props: ['value', 'disabled', 'isImgMultiple', 'maxNum', 'tipMsg'],
  data () {
    return {
      uploadList: [],
      photoUrl: '',
      photoUrlArr: ''
    }
  },
  created () {
    if (this.isImgMultiple) {
      if (this.value) {
        let photoArrMore = this.value.split(',')
        let photoArrMore2 = []
        photoArrMore.forEach(item => {
          photoArrMore2.push({ name: item, url: item })
        })
        this.uploadList = photoArrMore2
      }
    } else {
      this.value ? this.uploadList = [{ name: this.value, url: this.value }] : this.uploadList = []
    }
  },
  methods: {
    uploadSuccess (file) {
      if (!this.isImgMultiple) {
        this.photoUrl = file.url ? file.url : ''
      }
    },
    fileList (fileList) {
      if (!this.isImgMultiple) {
        if (!fileList.length) this.photoUrl = ''
      }
    }
  },
  watch: {
    'value' (val) {
      if (!this.isImgMultiple) {
        this.photoUrl = val
        this.uploadList = val ? [{ name: this.value, url: this.value }] : []
      }
    },
    // 单张图片
    'photoUrl' (val) {
      if (val === null) return
      let photoVal = ''
      if (val.constructor === Array) {
        photoVal = val.length ? val[0].url : ''
      } else {
        photoVal = val
      }
      this.$emit('input', photoVal)
      this.$emit('change', photoVal)
    },
    // 多张图片
    'photoUrlArr' (arr) {
      let photoArr = []
      arr.forEach(item => {
        photoArr.push(item.upload.url)
      })
      if (photoArr.length > 6) photoArr.pop()
      let photoStr = photoArr.join(',')
      this.$emit('input', photoStr)
      this.$emit('change', photoStr)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
