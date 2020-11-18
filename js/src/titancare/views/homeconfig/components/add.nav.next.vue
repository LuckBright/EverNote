<template>
  <div>
    <AddContent
        @sureEdit="addSure"
        @sureClose="addCancel">
      <template v-slot:icon>
        <i class="el-icon-arrow-left"></i><span>返回</span>
      </template>
      <div class="add-item-content">
        <p class="box-section-title color1">点击可上传图片（建议上传尺寸为100*100)</p>
        <section>
          <Uploader :maxSize="1000" v-model="itemData.img">
            <template v-if="itemData.img">
              <div class="img-wrap">
                <ever-image
                  style="width: 67px;height: 67px;"
                  :src="itemData.img"
                >
                </ever-image>
              </div>
            </template>
            <template v-else>
              <div class="add-btn-wrap">
                <i class="el-icon-plus"></i>
              </div>
            </template>
          </Uploader>
        </section>
        <p class="box-section-title">显示标题（2-5个字）</p>
        <div class="form-list">
          <div class="form-item">
            <input style="width: 100%;" maxlength="5" v-model="itemData.title" type="text">
          </div>
        </div>
        <p class="box-section-title">简介（推荐25-40个字）</p>
        <div class="form-list">
          <div class="form-item">
            <el-input
                type="textarea"
                autosize
                v-model="itemData.desc">
            </el-input>
          </div>
        </div>
        <p class="box-section-title">跳转分类</p>
        <Classification
          @change="selectChange"
          :editData="editData">
        </Classification>
      </div>
    </AddContent>
  </div>
</template>

<script>
import Schema from 'async-validator'
import AddContent from './base/add.content'
import Uploader from './base/uploader'
import Classification from './service/classification'

import { carouselType } from '../assets/json/carousel-target-types'

import filePath from '../mixins/filePath'
import selectOptions from '../mixins/selectOptions'

const ItemData = () => {
  return {
    img: '',
    title: '', // 标题
    desc: '', // 介绍
    goType: '',
    goPath: '',
    goPathName: '', // 选择商品时的名称
  }
}

let descriptor = {
  img: { type: 'string', required: true, message: '请上传图片' },
  title: { type: 'string', required: true, message: '请输入标题' },
  goType: { type: 'string', required: true, message: '请选择跳转分类' },
  goPath: { type: 'string',
    asyncValidator: (rule, value, callback, source) => {
      return new Promise((resolve, reject) => {
        if (!value) {
          let message = ''
          switch (source.goType) {
            case carouselType.GoodsDetail:
              message = '请选择商品'
              break
            case carouselType.GoodsGroup:
              message = '请选择商品组'
              break
            case carouselType.ServicePage:
              message = '请选择功能页面'
              break
            case carouselType.Link:
              message = '请输入跳转网址'
              break
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(message)
        } else {
          resolve()
        }
      })
    }
  }
}
export default {
  name: 'add.nav.next',
  props: {
    styleType: String,
    editData: Object
  },
  mixins: [filePath, selectOptions],
  components: {
    Uploader,
    AddContent,
    Classification
  },
  data () {
    return {
      itemData: new ItemData()
    }
  },
  created () {
    if (this.editData) {
      this.echoData(this.editData)
    }
  },
  methods: {
    selectChange (data) {
      this.itemData = { ...this.itemData, ...data }
    },
    addCancel () {
      this.$emit('addCancel')
    },
    addSure () {
      const itemData = { ...this.itemData }
      let validator = new Schema(descriptor)
      validator.validate(itemData, (errors) => {
        if (errors) {
          this.$message.warning(errors[0].message)
          return false
        } else {
          if (this.editData) {
            this.$emit('editSure', itemData)
          } else {
            this.$emit('addSure', itemData)
          }
        }
      })
    },
    echoData (data) {
      this.itemData = { ...data }
    }
  }
}
</script>
<style>
  .add-item-content .el-select .el-input__inner{
    text-align: right;
    border: none;
  }
  .add-item-content textarea{
    border: none;
    resize: none;
  }
</style>
<style scoped lang="less">
  @import "../assets/css/form-list";
  section{
    padding: 0 20px;
  }
  .img-wrap{
    width: 67px;
    height: 67px;
    border-radius: 17px;
    overflow: hidden;
  }
  .add-btn-wrap{
    width: 64px;
    height: 64px;
    line-height: 67px;
    background: #FFFFFF;
    border: 1px dashed #979797;
    border-radius: 17px;
    font-size: 18px;
    text-align: center;
    color: #999;
    cursor: pointer;
  }
</style>
