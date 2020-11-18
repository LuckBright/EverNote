<template>
  <div>
    <AddContent
        @sureEdit="addSure"
        @sureClose="addCancel">
      <template slot="icon">
        <i class="el-icon-arrow-left"></i><span>返回</span>
      </template>
      <div class="add-item-content">
        <p class="box-section-title color1">点击可上传图片（建议上传尺寸为{{cellSize}})</p>
        <section>
          <template v-if="itemData.img">
            <ImageCover
                :preview-src-list="[normalizeFilePath(itemData.img)]"
                :src="normalizeFilePath(itemData.img)"
                @close="delImage"
            >
              <AddImgTitleItem type="2" :itemData="itemData" :cell="styleType"></AddImgTitleItem>
            </ImageCover>
          </template>
          <template v-else>
            <Uploader :maxSize="1000" v-model="itemData.img">
              <AddImgTitleItem type="2" :itemData="itemData" :cell="styleType"></AddImgTitleItem>
            </Uploader>
          </template>
        </section>
        <p class="box-section-title">显示标题（2-6个字）</p>
        <div class="form-list">
          <div class="form-item">
            <input style="width: 100%;" v-model="itemData.title" :maxlength="6" type="text">
          </div>
        </div>
        <p class="box-section-title">简介（推荐25-40个字）</p>
        <div class="form-list">
          <div class="form-item">
            <el-input
                :maxlength="40"
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
    <AddCarouselGoods
        v-if="showAddGoods"
        @addSure="addGoodsSure"
        @addCancel="addGoodsCancel"
    />
    <AddCarouselGoodsGroup
        v-if="showAddGoodsGroup"
        @addSure="addGoodsGruopSure"
        @addCancel="addGoodsGruopCancel"
    />
  </div>
</template>

<script>
import Schema from 'async-validator'

import AddContent from './base/add.content'
import Uploader from './base/uploader'
import AddImgTitleItem from './add.imgtitle.item'
import ImageCover from './base/image-cover'
import Classification from './service/classification'

import { cellTypes } from '../assets/json/img-title-types'
import { carouselType } from '../assets/json/carousel-target-types'

import selectOptions from '../mixins/selectOptions'
import filePath from '../mixins/filePath'

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
  name: 'add.imgtitle.next',
  props: {
    styleType: String,
    editData: Object
  },
  mixins: [selectOptions, filePath],
  components: {
    Uploader,
    AddImgTitleItem,
    AddContent,
    ImageCover,
    Classification
  },
  data () {
    return {
      itemData: new ItemData()
    }
  },
  computed: {
    cellSize () {
      switch (this.styleType) {
        case cellTypes.one:
          return '702*200'
        case cellTypes.two:
          return '342*228'
        case cellTypes.three:
          return '222*148'
        default:
          return ''
      }
    },
    showMainContent () {
      return !this.showAddGoods && !this.showAddGoodsGroup
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
    },
    delImage () {
      this.itemData.img = ''
    }
  }
}
</script>
<style>
  .add-item-content .el-select .el-input__inner{
    text-align: right;
    border: none;
  }
</style>
<style scoped lang="less">
  @import "../assets/css/form-list";
  section{
    padding: 0 20px;
  }
</style>
