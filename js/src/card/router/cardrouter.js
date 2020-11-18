import Card from '../page/card'
import Welcome from '@/login/page/welcome'
import CardBatchList from '../page/cardbatchlist'
import CreateCardBatch from '../page/createcardbatch'
import CardItem from '../page/carditem'
import SellCard from '../page/sellcard'
import ShareUser from '../page/shareusers'
// 优惠券
import Coupon from '@/card/page/coupon/coupon'
import GiftBatchList from '@/card/page/coupon/giftbatchlist'
import GiftBatchContent from '@/card/page/coupon/giftbatchcontent'
// import GiftBatchInfo from '@/card/page/coupon/giftbatchinfo'
import GiftBatchDetail from '@/card/page/coupon/giftbatchdetail'
import MallCoupon from '@/card/page/coupon/mallcoupon'
import MallCouponEdit from '@/titanmall/views/marketingTools/coupon/coupon.edit'
// 身份卡
import IdCardList from '@/card/page/idcardmanage/idcardlist'
import IdCardContent from '@/card/page/idcardmanage/idcardcontent'
// 自费折扣
import SelfTariffs from '../page/selftariffs'
import SelfTariffsAdd from '../page/selftariffsadd'
// 活动列表
import Activitys from '@/card/page/activitymanagement/activitylist'
import ActivityContent from '@/card/page/activitymanagement/activitycontent'
// 积分管理
import Creditlist from '../page/creditlist'
// 套餐管理
import packagemanage from '@/card/page/marketingpackage/packagemanagement'
import MarketingPackage from '@/card/page/marketingpackage/marketingpackagedetail'
import packOrderDetails from '@/crm/page/packagesale/orderdetails'// 订单详情
import UseDetailList from '@/crm/page/packagesale/usedetailsinfo'
import PackageInfo from '@/crm/page/packagesale/packageinfo'

// 商场路由 start
import OrderList from '@/mall/page/orderlist'
// import Frame from '@/mall/page/frame.vue'
import MallIndex from '@/mall/page/index.vue'
import MallDetails from '@/mall/page/details.vue'
import MyCarts from '@/mall/page/carts.vue'
import MyBuy from '@/mall/page/buy.vue'
import OrderDetail from '@/mall/page/orderdetail.vue'
import Recharge from '@/mall/page/recharge.vue'
import RechargeBuy from '@/mall/page/rechargebuy'
import GoodsCategories from '@/mall/page/goodscategories'
import GoodsSalling from '@/mall/page/goodssalling'
import GoodsForSall from '@/mall/page/goodsforsall'
import GoodsPublish from '@/mall/page/goodspublish'
import GoodsForsallEdit from '@/mall/page/goodsforsalledit'
import SaleService from '@/mall/page/saleservicelist'
import SaleServiceDetail from '@/mall/page/saleservicedetail'
import PackageSaleList from '@/crm/page/packagesale/packagesalelist'
// import planList from '@/card/page/marketingpackage/guaranteeplan/planlist.vue'
import planDetails from '@/card/page/marketingpackage/guaranteeplan/plandetails.vue'
// end

export default [
  {
    path: '/card',
    name: 'card',
    redirect: '/card/welcome',
    component: Card,
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      // 折扣规则管理
      {
        path: 'selftariffs',
        component: SelfTariffs,
        meta: {
          thirdActiveIndex: '/card/selftariffs'
        }
      },
      // 折扣规则管理-新增
      {
        path: 'selftariffsadd',
        component: SelfTariffsAdd,
        meta: {
          thirdActiveIndex: '/card/selftariffs'
        }
      },
      // 折扣规则管理-编辑
      {
        path: 'selftariffsedit/:id',
        component: SelfTariffsAdd,
        meta: {
          thirdActiveIndex: '/card/selftariffs'
        }
      },
      // 储值卡
      {
        path: 'cardbatchlist',
        component: CardBatchList,
        meta: {
          thirdActiveIndex: '/card/cardbatchlist'
        }
      },
      // 储值卡-新增会员卡
      {
        path: 'createcardbatch',
        component: CreateCardBatch,
        meta: {
          thirdActiveIndex: '/card/cardbatchlist'
        }
      },
      // 储值卡-发卡管理
      {
        path: 'carditem',
        component: CardItem,
        meta: {
          thirdActiveIndex: '/card/carditem'
        }
      },
      // 储值卡-发卡管理-开卡
      {
        path: 'sellcard',
        component: SellCard,
        meta: {
          thirdActiveIndex: '/card/carditem'
        }
      },
      // 储值卡-发卡管理-开卡-管理共享人
      {
        path: 'shareuser',
        component: ShareUser,
        meta: {
          thirdActiveIndex: '/card/carditem'
        }
      },
      // 优惠券
      {
        path: 'giftbatchs',
        component: Coupon,
        redirect: '/card/giftbatchs/inhospital',
        meta: {
          thirdActiveIndex: '/card/giftbatchs'
        }
      },
      // 优惠券-院内优惠券
      {
        path: 'giftbatchs/inhospital',
        component: GiftBatchList,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      // 优惠券-院内优惠券-新增
      {
        path: 'giftbatchadd',
        component: GiftBatchContent,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      // 优惠券-院内优惠券（tocheck）
      {
        path: 'giftbatchedit/:code',
        component: GiftBatchContent,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      // 优惠券-院内优惠券-编辑
      {
        path: 'giftbatch',
        component: GiftBatchContent,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      // {
      //   path: 'giftbatchinfo/:id/',
      //   component: GiftBatchInfo,
      //   meta: {
      //     thirdActiveIndex: '/card/giftbatchs'
      //   }
      // },
      // 优惠券-院内优惠券-优惠券使用详情
      {
        path: 'giftbatchdetail/:id/:money',
        component: GiftBatchDetail,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/inhospital'
        }
      },
      // 优惠券-商城优惠券
      {
        path: 'giftbatchs/titanmall',
        component: MallCoupon,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/titanmall'
        }
      },
      // 优惠券-商城优惠券-新增
      {
        path: 'couponedit',
        component: MallCouponEdit,
        meta: {
          thirdActiveIndex: '/card/giftbatchs/titanmall',
        }
      },
      // 身份卡
      {
        path: 'idcards',
        name: 'idcards',
        component: IdCardList,
        meta: {
          thirdActiveIndex: '/card/idcards'
        }
      },
      // 新建身份卡
      {
        name: 'idcard',
        path: '/card/idcard',
        component: IdCardContent,
        meta: {
          thirdActiveIndex: '/card/idcards'
        }
      },
      // 查看身份卡
      {
        path: '/card/idcardedit/:code',
        name: 'idcardedit',
        component: IdCardContent,
        meta: {
          thirdActiveIndex: '/card/idcards'
        }
      },
      // 活动列表管理
      {
        path: 'activitys',
        name: 'activitys',
        component: Activitys,
        meta: {
          thirdActiveIndex: '/card/activitys'
        }
      },
      // 活动列表管理-新增
      {
        path: 'activityadd',
        name: 'activityadd',
        component: ActivityContent,
        meta: {
          thirdActiveIndex: '/card/activitys'
        }
      },
      // 活动列表管理-详情
      {
        path: 'activitydetail/:code',
        name: 'activitydetail/:code',
        component: ActivityContent,
        meta: {
          thirdActiveIndex: '/card/activitys'
        }
      },
      // 积分管理
      {
        path: 'credits',
        component: Creditlist,
        meta: {
          thirdActiveIndex: '/card/credits'
        }
      },
      // 套餐管理-套餐列表
      {
        path: 'packagemanage/list',
        component: packagemanage,
        meta: {
          type: 'package',
          thirdActiveIndex: '/card/packagemanage/list'
        }
      },
      // 套餐管理-订单
      {
        path: 'order',
        component: PackageSaleList,
        meta: {
          type: 'package',
          thirdActiveIndex: '/card/order'
        }
      },
      // 套餐管理-订单-订单详情
      {
        path: 'packorderdetail/:id',
        component: packOrderDetails,
        meta: {
          thirdActiveIndex: '/card/order'
        }
      },
      // 套餐管理-使用详情(tocheck 没找到入口)
      {
        path: 'usedetails/:id/:setMealId',
        name: 'usedetails',
        component: UseDetailList
      },
      // 套餐管理-套餐详情(tocheck 没找到入口)
      {
        path: 'packageinfo/:id/:setMealId',
        name: 'packageinfo',
        component: PackageInfo
      },
      // 套餐管理-保障计划任务管理（套餐内的）
      // {
      //   path: 'plan',
      //   name: 'plan',
      //   component: planList,
      //   meta: {
      //     thirdActiveIndex: '/card/plan'
      //   }
      // },
      // 计划任务管理-详情
      {
        path: 'plandetails/:id',
        name: 'plandetails',
        component: planDetails,
        meta: {
          thirdActiveIndex: '/card/package/plan'
        }
      },
      // 套餐管理-新建套餐
      {
        path: 'marketingpackageadd',
        component: MarketingPackage,
        meta: {
          thirdActiveIndex: '/card/packagemanage',
          source: 'card',
          isAdd: 1
        }
      },
      // 套餐管理-编辑套餐
      {
        path: 'marketingpackageedit',
        component: MarketingPackage,
        meta: {
          thirdActiveIndex: '/card/packagemanage/list',
          source: 'card'
        }
      },
      // 商场路由 start
      // 订单管理-全部订单
      {
        path: 'orderlist',
        name: 'orderlist',
        component: OrderList,
        meta: {
          thirdActiveIndex: '/card/orderlist'
        }
      },
      // 订单管理-售后记录
      {
        path: 'saleservice',
        name: 'saleservice',
        component: SaleService,
        meta: {
          thirdActiveIndex: '/card/saleservice'
        }
      },
      // 订单管理-售后记录-售后单信息
      {
        path: 'saleservicedetail/:id',
        name: 'saleservicedetail',
        component: SaleServiceDetail,
        meta: {
          thirdActiveIndex: '/card/saleservice'
        }
      },
      // 商品管理-商品分类管理
      {
        path: 'goodscategories',
        name: 'goodscategories',
        component: GoodsCategories,
        meta: {
          thirdActiveIndex: '/card/goodscategories'
        }
      },
      // 商品管理-出售中的商品
      {
        path: 'goodssalling',
        name: 'goodssalling',
        component: GoodsSalling,
        meta: {
          thirdActiveIndex: '/card/goodssalling'
        }
      },
      // 商品管理-待出售商品
      {
        path: 'goodsforsall',
        name: 'goodsforsall',
        component: GoodsForSall,
        meta: {
          thirdActiveIndex: '/card/goodsforsall'
        }
      },
      // 商品管理-待出售商品-编辑
      {
        path: 'goodsforsalledit/:id',
        name: 'goodsforsalledit',
        component: GoodsForsallEdit,
        meta: {
          thirdActiveIndex: '/card/goodsforsall'
        }
      },
      // 商品管理-发布商品
      {
        path: 'goodspublish',
        name: 'goodspublish',
        component: GoodsPublish,
        meta: {
          thirdActiveIndex: '/card/goodspublish'
        }
      },
      // 储值卡销售
      {
        path: 'mallindex',
        name: 'mallindex',
        component: MallIndex,
        meta: {
          thirdActiveIndex: '/card/mallindex'
        }
      },
      // 储值卡销售-我的购物车
      {
        path: 'mallcarts',
        name: 'mallcarts',
        component: MyCarts,
        meta: {
          thirdActiveIndex: '/card/mallindex'
        }
      },
      // 储值卡销售-商品详情
      {
        path: 'malldetails/:id',
        name: 'malldetails',
        component: MallDetails,
        meta: {
          thirdActiveIndex: '/card/mallindex'
        }
      },
      // 充值(tocheck没找到入口)
      {
        path: 'recharge',
        name: 'recharge',
        component: Recharge
      },
      // 充值(tocheck没找到入口)
      {
        path: 'rechargebuy/:id',
        name: 'rechargebuyedit',
        component: RechargeBuy
      },
      // 充值(tocheck没找到入口)
      {
        path: 'rechargebuy',
        name: 'rechargebuy',
        component: RechargeBuy
      },
      // 填写并核对订单信息
      {
        path: 'mallbuy/:ids',
        name: 'mallbuy',
        component: MyBuy,
        meta: {
          thirdActiveIndex: '/card/mallindex'
        }
      },
      // 订单管理-全部订单
      {
        path: 'orderdetails/:id',
        name: 'orderdetails',
        component: OrderDetail,
        meta: {
          thirdActiveIndex: '/card/orderlist'
        }
      },
      // 保障计划
      {
        path: 'protectionplan/list',
        name: 'protectionplanlist',
        component: packagemanage,
        meta: {
          type: 'plan'
          // thirdActiveIndex: '/card/orderlist'
        }
      },
      {
        path: 'protectionplan/orderlist',
        name: 'protectionplanorderlist',
        component: PackageSaleList,
        meta: {
          type: 'plan'
          // thirdActiveIndex: '/card/orderlist'
        }
      },
      {
        path: 'protecorderdetail/:id',
        component: packOrderDetails,
        meta: {
          type: 'plan',
          thirdActiveIndex: '/card/protectionplan/orderlist'
        }
      },
      {
        path: 'marketinprotecorderadd',
        component: MarketingPackage,
        meta: {
          thirdActiveIndex: '/card/protectionplan/list',
          type: 'plan',
          isAdd: 1,
          source: 'card',
        }
      },
      {
        path: 'marketingplanedit',
        component: MarketingPackage,
        meta: {
          type: 'plan',
          thirdActiveIndex: '/card/protectionplan/list',
          source: 'card'
        }
      },
      {
        path: 'ordermarketingplanedit',
        component: MarketingPackage,
        meta: {
          type: 'plan',
          thirdActiveIndex: '/card/protectionplan/orderlist',
          source: 'card'
        }
      },
      // 保障计划使用详情
      {
        path: 'planusedetails/:id/:setMealId',
        name: 'planusedetails',
        component: UseDetailList,
        meta: {
          type: 'plan',
        }
      },
      // 保障计划计划详情
      {
        path: 'protectplandetails/:id',
        name: 'protectplandetails',
        component: planDetails,
        meta: {
          thirdActiveIndex: '/card/protectionplan/orderlist',
          type: 'plan'
        }
      },
      // end
    ]
  }
]
