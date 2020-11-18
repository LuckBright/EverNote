<template>
<div>
  <AddContent
      v-show="!showSelectDoctor"
      @sureEdit="addSure"
      @sureClose="addCancel"
  >
    <template slot="icon">
      <i class="el-icon-arrow-left"></i><span>返回</span>
    </template>
    <p class="box-section-title color1">点击可上传图片（可进行修改200*266）</p>
    <section>
      <template v-if="doctorData.img">
        <ImageCover
            :preview-src-list="[normalizeFilePath(doctorData.img)]"
            :src="normalizeFilePath(doctorData.img)"
            @close="delImage"
        >
          <div class="doctor-img">
            <ever-image style="width: 96px;height: 128px;" :src="doctorData.img"></ever-image>
          </div>
        </ImageCover>
      </template>
      <template v-else>
        <Uploader :maxSize="1000" v-model="doctorData.img">
          <div class="doctor-img dashed">
            <div class="icon-wrap">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </Uploader>
      </template>
    </section>
    <p class="box-section-title color1">跳转路径：</p>
    <div class="form-list">
      <div class="form-item" style="cursor: pointer" @click="selectDoctor">
        <span class="form-item-left">选择医生</span>
        <div class="form-item-right"><i class="el-icon-arrow-right"></i></div>
      </div>
    </div>
    <p class="box-section-title color1">姓名：</p>
    <div class="form-list">
      <div class="form-item">
        <div class="form-item-left">
          <el-input v-model="doctorData.title" :readonly="true"></el-input>
        </div>
      </div>
    </div>
    <p class="box-section-title color1">职称：</p>
    <div class="form-list">
      <div class="form-item">
        <div class="form-item-left">
          <el-input v-model="doctorData.desc"></el-input>
        </div>
      </div>
    </div>
  </AddContent>
  <AddDoctorWallList
      v-if="showSelectDoctor"
      @selectSure="selectSure"
      @selectCancel="selectCancel"
  >
  </AddDoctorWallList>
</div>
</template>

<script>
import Schema from 'async-validator'

import AddContent from './base/add.content'
import Uploader from './base/uploader'
import AddDoctorWallList from './add.doctor.wall.list'
import ImageCover from './base/image-cover'

import filePath from '../mixins/filePath'

let descriptor = {
  img: { type: 'string', required: true, message: '请上传图片' },
  title: { type: 'string', required: true, message: '请输入标题' },
  desc: { type: 'string', required: true, message: '请输入职称' }
}

export default {
  name: 'add.doctor.wall.next',
  components: {
    AddContent,
    Uploader,
    AddDoctorWallList,
    ImageCover
  },
  props: {
    editData: Object
  },
  mixins: [filePath],
  data () {
    return {
      doctorData: {
        id: '',
        img: '',
        title: '',
        desc: ''
      },
      showSelectDoctor: false
    }
  },
  created () {
    if (this.editData) {
      this.echoData(this.editData)
    }
  },
  methods: {
    addSure () {
      let doctorData = { ...this.doctorData }
      let validator = new Schema(descriptor)
      validator.validate(doctorData, (errors) => {
        if (errors) {
          this.$message.warning(errors[0].message)
          return false
        } else {
          if (this.editData) {
            this.$emit('editSure', doctorData)
          } else {
            this.$emit('addSure', doctorData)
          }
        }
      })
    },
    addCancel () {
      this.$emit('addCancel')
    },
    selectDoctor () {
      this.showSelectDoctor = true
    },
    selectSure (data) {
      this.doctorData.id = data.id
      this.doctorData.img = this.doctorData.img || data.photo
      this.doctorData.title = data.name
      this.doctorData.desc = data.skillsTitle2Name

      this.showSelectDoctor = false
    },
    selectCancel () {
      this.showSelectDoctor = false
    },
    echoData (data) {
      this.doctorData = { ...data }
    },
    delImage () {
      this.doctorData.img = ''
    }
  }
}
</script>
<style>
  .form-list .el-input__inner{
    border: none !important;
  }
</style>
<style scoped lang="less">
  @import "../assets/css/form-list";
  section{
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .doctor-img{
    width: 96px;
    height: 128px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }
  .icon-wrap{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    font-size: 24px;
    i{
      color: #999;
    }
  }
  .dashed{
    border: 1px dashed #979797;
  }
</style>
