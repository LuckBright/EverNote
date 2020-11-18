<template>
  <div class="form-list">
    <div class="form-item">
      <span class="form-item-left">跳转分类</span>
      <div class="form-item-right">
        <el-select v-model="itemData.goType" size="small" @change="goTypeChange">
          <el-option :key="item.type" v-for="item in carouselTypes" :label="item.label" :value="item.type"></el-option>
        </el-select>
      </div>
    </div>
    <template v-if="itemData.goType === carouselType.ServicePage">
      <div class="form-item">
        <span class="form-item-left">功能页面</span>
        <div class="form-item-right">
          <el-select @change="goPathChange" v-model="itemData.goPath" size="small">
            <el-option :key="item.id" v-for="item in servicePages" :label="item.name" :value="item.attr1">
              {{`${item.name}${item.attr2 ? ' (默认图)' : ''}`}}
            </el-option>
          </el-select>
        </div>
      </div>
    </template>
    <template v-else-if="itemData.goType === carouselType.GoodsDetail">
      <div class="form-item">
        <span class="form-item-left">上架商品</span>
        <div class="form-item-right">
          <template v-if="itemData.goPathName">
            <el-input
              size="small"
              disabled
              v-model="itemData.goPathName">
              <div slot="suffix" class="input-suffix" @click="delGoods">
                <i class="el-icon-circle-close"></i>
              </div>
            </el-input>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="addGoods">添加商品</el-button>
          </template>
        </div>
      </div>
    </template>
    <template v-else-if="itemData.goType === carouselType.GoodsGroup">
      <div class="form-item">
        <span class="form-item-left">商品分组</span>
        <div class="form-item-right">
          <template v-if="itemData.goPathName">
            <el-input
              size="small"
              disabled
              v-model="itemData.goPathName">
              <div slot="suffix" class="input-suffix" @click="delGoods">
                <i class="el-icon-circle-close"></i>
              </div>
            </el-input>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="addGoodsGruop">添加分组</el-button>
          </template>
        </div>
      </div>
    </template>
    <template v-else-if="itemData.goType === carouselType.Link">
      <div class="form-item">
        <span class="form-item-left">跳转网址</span>
        <div class="form-item-right">
          <input type="text" placeholder="请输入网址" v-model="itemData.goPath">
        </div>
      </div>
    </template>
    <template v-else-if="itemData.goType === carouselType.ProtectionPlan">
      <div class="form-item">
        <span class="form-item-left">上架商品</span>
        <div class="form-item-right">
          <template v-if="itemData.goPathName">
            <el-input
              size="small"
              disabled
              v-model="itemData.goPathName">
              <div slot="suffix" class="input-suffix" @click="delGoods">
                <i class="el-icon-circle-close"></i>
              </div>
            </el-input>
          </template>
          <template v-else>
            <el-button type="primary" size="small" @click="addProtectionPlan">选择保障计划</el-button>
          </template>
        </div>
      </div>
    </template>
    <div class="select-box-classify" v-show="showSelectBox">
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
      <AddProtectionPlan
        v-if="showAddProtectionPlan"
        @addSure="addProtectionPlanSure"
        @addCancel="addProtectionPlanCancel"
      />
    </div>
  </div>
</template>

<script>
  import { carouselTypes, carouselType } from '../../assets/json/carousel-target-types'
  import selectOptions from '../../mixins/selectOptions'
  import AddCarouselGoods from './add.carousel.goods'
  import AddCarouselGoodsGroup from './add.carousel.goodsGroup'
  import AddProtectionPlan from './add.protectionPlan'

  const ItemData = () => {
    return {
      img: '',
      title: '', // 标题
      goPath: '',
      goPathName: '', // 选择商品时的名称
    }
  }
  export default {
    name: 'classification',
    mixins: [ selectOptions ],
    props: {
      editData: Object
    },
    components: {
      AddCarouselGoods,
      AddCarouselGoodsGroup,
      AddProtectionPlan
    },
    data () {
      return {
        carouselTypes,
        carouselType,
        servicePages: [],
        itemData: new ItemData(),
        showAddGoods: false,
        showAddGoodsGroup: false,
        showAddProtectionPlan: false
      }
    },
    computed: {
      showSelectBox () {
        return this.showAddGoods || this.showAddGoodsGroup || this.showAddProtectionPlan
      }
    },
    watch: {
      itemData: {
        handler (newVal) {
          this.$emit('change', { ...newVal })
        },
        deep: true
      }
    },
    created () {
      if (this.editData) {
        this.echoData(this.editData)
      }
      this._getSelectOptions(['servicePages'])
    },
    methods: {
      goPathChange () {
        let servicePage = this.servicePages.find(item => item.attr1 === this.itemData.goPath)
        if (servicePage.attr2) {
          this.itemData.img = servicePage.attr2
        }
        this.itemData.title = servicePage.name
      },
      goTypeChange () {
        this.itemData.goPath = ''
        this.itemData.goPathName = ''
      },
      delGoods () {
        this.itemData.img = ''
        this.itemData.goPath = ''
        this.itemData.goPathName = ''
      },
      addGoods () {
        this.showAddGoods = true
      },
      addGoodsCancel () {
        this.showAddGoods = false
      },
      addGoodsSure (goods) {
        this.itemData.goPath = goods.id
        this.itemData.goPathName = goods.name
        this.itemData.title = goods.name

        this.showAddGoods = false
      },
      addGoodsGruop () {
        this.showAddGoodsGroup = true
      },
      addGoodsGruopCancel () {
        this.showAddGoodsGroup = false
      },
      addGoodsGruopSure (goodsGroup) {
        this.itemData.goPath = goodsGroup.id
        this.itemData.goPathName = goodsGroup.name
        this.itemData.title = goodsGroup.name

        this.showAddGoodsGroup = false
      },
      addProtectionPlan () {
        this.showAddProtectionPlan = true
      },
      addProtectionPlanCancel () {
        this.showAddProtectionPlan = false
      },
      addProtectionPlanSure (protectionPlan) {
        this.itemData.goPath = protectionPlan.id
        this.itemData.goPathName = protectionPlan.name
        this.itemData.title = protectionPlan.name

        this.showAddProtectionPlan = false
      },
      echoData (data) {
        this.itemData = { ...data }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../assets/css/form-list';
  .select-box-classify{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 567px;
    overflow: auto;
    z-index: 100;
  }
</style>
