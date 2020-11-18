<template>
  <div class="popovers pos_ab" v-if="popover">
    <div class="title pos_re" v-loading="loading">
      将以下属性项根据模版需要选择在相应的区域
      <el-input class="searchIpt" v-model="searchVal" @keyup.native="querySort"></el-input>
      <el-button type="default" class="searchBtn" @click="querySort"><i class="el-icon-search"></i>查询</el-button>
      <el-button type="prmary" @click="checkAll">全选</el-button>
      <div class="pos_ab" @click="close"><i class="iconfont icon-shanchu"></i></div>
    </div>
    <div class="content span">
      <el-tag type="primary" v-for="(item, index) in tags" :key="index" :class="{'el-tag-disabled': item.active}"><span @click="selected(item)">{{item.name}}</span></el-tag>
    </div>
  </div>
</template>

<script>
import { PROPERTY_TYPE_FOR_TEMPLET } from '@/util/common.js'
export default {
  name: 'popovers',
  props: ['attr', 'selectData', 'data', 'property', 'popoverIndex'],
  data () {
    return {
      loading: false,
      searchVal: '',
      popover: false,
      tags: [],
      tempTags: []
    }
  },
  methods: {
    querySort () {
      if (this.searchVal === '') {
        this.tags = this.tempTags.slice(0)
      } else {
        this.tags = []
        for (let i = 0; i < this.tempTags.length; i++) {
          let item = this.tempTags[i]
          if (this._filterVal(this.searchVal, item.name) > -1) this.tags.push(item)
        }
      }
    },
    checkAll () {
      let propertyId
      if (this.property === 'spu') {
        propertyId = PROPERTY_TYPE_FOR_TEMPLET[0].id
      } else {
        propertyId = PROPERTY_TYPE_FOR_TEMPLET[1].id
      }
      this.tags.forEach(item => {
        item.color = 'info'
      })
      this.$emit('selected', { data: this.tags, attr: this.attr, index: this.popoverIndex, type: propertyId })
      this.popover = false
    },
    selected (data) {
      let propertyId
      if (this.property === 'spu') {
        propertyId = PROPERTY_TYPE_FOR_TEMPLET[0].id
      } else {
        propertyId = PROPERTY_TYPE_FOR_TEMPLET[1].id
      }
      data.color = 'info'
      if (!data.active) this.$emit('selected', { data, attr: this.attr, index: this.popoverIndex, type: propertyId })
    },
    open () {
      this.popover = true
      this.$nextTick(() => {
        this._resetActiveData(this.selectData, true)
      })
    },
    close () {
      this.popover = false
      this.searchVal = ''
      this.$emit('close', this.popover)
    },
    _filterVal (val, str) {
      return str.indexOf(val)
    },
    _resetActiveData (data, flag) {
      if (!data) data = []
      data.forEach(item => {
        item.name = item.name || item.propertyName || (item.propertyObject && item.propertyObject.name)
      })
      if (this.searchVal !== '') {
        this._initTags(data, flag)
        this.tags = this.tags.slice(0)
        return
      }
      this.tags = this.data.slice(0)
      this._initTags(data, flag)
      this.tempTags = this.tags.slice(0)
    },
    _initTags (data, flag) {
      this.tags.forEach(tag => {
        if (flag) tag.active = 0
        // tag.type = tag.type || tag.propertyType
        if (!tag.name) tag.name = tag.valueSetItemName || (tag.propertyObject && tag.propertyObject.name)
        data.forEach(item => {
          if (!item.name) item.name = item.valueSetItemName || (item.propertyObject && item.propertyObject.name)
          // this.property  是否是属性值选择
          if ((!this.property && tag.propertyCode === item.propertyCode && tag.type === item.type) || (this.property && tag.name && tag.name === item.name && tag.propertyCode === item.propertyCode)) tag.active = 1
        })
      })
    }
  },
  watch: {
    'popover' (val) {
      !val && this.$emit('popoverHide')
    },
    'data' (val) {
      this.tags = val
      // if (this.tags.length) {
      //   this.tags.forEach(item => {
      //     if (item.propertyValueObject) item.name = item.propertyValueObject.name
      //   })
      // }
    },
    'selectData' (val) {
      this._resetActiveData(val, true)
    },
    'searchVal' (val) {
      this._resetActiveData(this.selectData, true)
    }
  }
}
</script>

<style lang="scss" scoped>
.popovers {
  margin-left: -21px;
  // bottom: -278px;
  margin-top: 30px;
  border-radius: 5px;
  background: rgba(250,250,250,0.95);
  border: 1px solid #ddd;
  box-shadow: 0 1px 10px 0 #eee;
  max-height: 300px;
  z-index: 99;
  padding-bottom: 20px;
  width: 100%;
  &::before {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: -20px;;
    left: 50%;
    padding:0;
    border-bottom: 11px solid rgba(250,250,250,0.95);
    border-top: 11px solid transparent;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    display: block;
    content:'';
    z-index: 12;
  }
  &::after {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: -22px;;
    left: 50%;
    // margin-left: -1px;
    padding:0;
    border-bottom: 11px solid #eee;
    border-top: 11px solid transparent;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    display: block;
    content:'';
    z-index:10
  }
  .title {
    padding: 15px 20px;
    line-height: 40px;
    height: 40px;
    color: #000;
    .searchIpt {
      width: 300px;
      padding-left: 50px;
      padding-right: 10px;
    }
    .searchBtn {
      color: #1C7BEF;
      font-size: 14px;
      i {
        margin-right: 5px;
      }
    }
    .pos_ab {
      top: 15px;
      right: 20px;
      &:hover {
        transform: rotate(90deg);
        animation: animated .35s
      }
    }
    i.icon-shanchu {
      color: #aaa;
    }
  }
.span .el-tag {padding: 0!important}
.span .el-tag span { width: 100%; height: 100%; display: block; padding: 0 10px}
  @keyframes animated
  {
  from {transform: rotate(0deg);}
  to {transform: rotate(90deg);}
  }
  .content {
    overflow-x: hidden;
    max-height: 250px;
    padding: 0 20px;
    .el-tag {
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 0 10px;
      height: 30px;
      line-height: 28px;
      background: rgba(243, 244, 245, 1);
    }
    .el-tag-disabled {
      background: rgba(243, 244, 245, .5);
      border: 1px dashed #DCDDE1;
      color: #B6B9BF;
    }
  }
}
</style>
