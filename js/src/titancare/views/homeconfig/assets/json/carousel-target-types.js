import carouselBig from '../image/carousel-big.jpg'
import carouselSmall from '../image/carousel-small.png'

export const carouselStyle = {
  big: '1',
  small: '2'
}

export const selectNavData = [
  { imgPath: carouselBig, text: '大尺寸轮播图（建议在页面顶部使用）', value: carouselStyle.big },
  { imgPath: carouselSmall, text: '小尺寸轮播图（建议在页面中间使用）', value: carouselStyle.small }
]

export const carouselType = {
  ServicePage: '1',
  GoodsDetail: '2',
  GoodsGroup: '3',
  Link: '4',
  ProtectionPlan: '5'
}

export const carouselTypes = [
  { type: carouselType.ServicePage, label: '功能页面' },
  { type: carouselType.GoodsDetail, label: '商品详情' },
  { type: carouselType.GoodsGroup, label: '商品分组' },
  { type: carouselType.Link, label: '网址' },
  { type: carouselType.ProtectionPlan, label: '保障计划' }
]
