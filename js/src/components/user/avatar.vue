<template>
  <span>
    <div class="img-con" v-if="type === '1'">
      avatar：{{avatar}}<br>
      value: {{value}}
      <ever-upload1 v-model="avatar" :limit="1" @success="handleSuccess"></ever-upload1>
      <!-- <div class="userAvatarWar mr60">
      <p class="img-title">人脸识别图片</p>
      <div class="avatarWar">
        <div class="avatar">
          <img :src="avatar | fixImgSrc(1, true)">
        </div>
      </div>
      <el-button size="small" @click="popUploadDialog('face')">上传</el-button>
      </div>-->
      <!-- <div class="userAvatarWar">
        <p class="img-title">头像</p>
        <div class="avatar">
          <img :src="avatar | fixImgSrc(1, true)" class="bradius">
        </div>
        <ever-upload ref="upload" :upload-attrs="uploadAttrs" btnTxt="上传"></ever-upload>
      </div> -->
    </div>
    <div class="onlyAvt" v-if="type === '2'">
      <ever-upload ref="upload" :upload-attrs="uploadAttrs">
        <template slot="default">
          <div class="avatar">
            <img :src="avatar | fixImgSrc(1, true)" class="bradius">
          </div>
        </template>
      </ever-upload>
    </div>
  </span>
</template>
<script>

export default {
  props: {
    'value': {
      type: String,
      default: ''
    },
    'type': {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      avatar: this.value,
      uploadAttrs: {
        'on-success': (res) => {
          this.$emit('input', res.data.fileUrl)
        },
        multiple: false,
        limit: 3,
        'show-file-list': false,
      },
    }
  },
  watch: {
    'avatar' (val) {
      this.$emit('getimg', val)
    },
  },
  created () {
  },
  computed: {
  },
  methods: {
    handleSuccess () {
    }
  },
}
</script>
<style scoped>
.img-con {
  text-align: center;
}
.userAvatarWar {
  display: inline-block;
  text-align: center;
}
.img-title {
  color: #666;
  font-size: 14px;
  text-align: center;
}
.avatar {
  height: 100px;
  width: 100px;
  border: 1px solid #dddddd;
  border-radius: 50%;
}
.avatar img {
  height: 100%;
  width: 100%;
}
.avatar img.bradius {
  border-radius: 50%;
}
.img-con .avatar {
  margin-bottom: 10px;
}
.onlyAvt {
  height: 100%;
}
.onlyAvt .ever-upload,
.onlyAvt .ever-upload /deep/ .el-upload,
.onlyAvt .ever-upload /deep/ .el-upload .avatar {
  height: 100%;
  width: 100%;
}
</style>
