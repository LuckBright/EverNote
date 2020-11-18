// 搜索框
// 1
// 轮播图
// 2
// 图片标题
// 3
// 短视频
// 4
// 专家墙
// 5
// 医生推荐
// 6
// 资讯
// 7
// 直播
// 8
// 导航
// 99
import { homeSection } from './homeSection'

export default {
  lastSaveTime: '2020-7-12 12:55',
  homeData: [
    {
      id: new Date().getTime() + 1, // 时间戳
      type: homeSection.search, // 搜索框
      showH5: true,
      showMp: true,
      data: {
        styleType: '1', // 1 是放角 2是圆角
      }
    },
    {
      id: new Date().getTime() + 2, // 时间戳
      type: homeSection.carousel, // 轮播图
      showH5: true,
      showMp: true,
      data: {
        styleType: '1', // 1 是大图 2是小图，
        showTitle: '1', // 是否显示标题 1是 2否
        title: '',
        moduleArr: [
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          }
        ]
      }
    },
    {
      id: new Date().getTime() + 3, // 时间戳
      type: homeSection.nav, // 导航
      showH5: true,
      showMp: true,
      data: {
        styleType: '1', // 1 横向 2纵向，
        moduleArr: [
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号1', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号2', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号3', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号4', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号5', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号6', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          }
        ]
      }
    },
    {
      id: new Date().getTime() + 4, // 时间戳
      type: homeSection.image, // 图片标题
      showH5: true,
      showMp: true,
      data: {
        styleType: '3', // 1 1列 2 2列 3 3列，
        showTitle: '1', // 是否显示标题 1是 2否
        title: '',
        moduleArr: [
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '预约挂号', // 标题
            desc: '预约挂号介绍', // 介绍
            goType: '',
            goPath: '',
            goPathName: '', // 选择商品时的名称
          }
        ]
      }
    },
    {
      id: new Date().getTime() + 5, // 时间戳
      type: homeSection.doctorWall, // 专家墙
      showH5: true,
      showMp: true,
      data: {
        showTitle: '1', // 是否显示标题 1是 2否
        title: '',
        moduleArr: [
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '王医生', // 标题
            desc: '儿科  副主任医师', // 介绍
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '王医生', // 标题
            desc: '儿科  副主任医师', // 介绍
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '王医生', // 标题
            desc: '儿科  副主任医师', // 介绍
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '王医生', // 标题
            desc: '儿科  副主任医师', // 介绍
          },
          {
            img: '5nHOj2V6k4TC5xfe7XE',
            title: '王医生', // 标题
            desc: '儿科  副主任医师', // 介绍
          }
        ]
      }
    },
    {
      id: new Date().getTime() + 6, // 时间戳
      type: homeSection.doctorRecom, // 推荐医生
      showH5: true,
      showMp: true,
      data: {
        showTitle: '1', // 是否显示标题 1是 2否
        title: '',
        moduleArr: ['d606c06bae854148819e7fe343863d4c', 'd22e38f56b4342b0b3aad277b59d920b', 'f72e9f4df0e44c79babb2240d58d3c33'] // 存储医生id
      }
    },
    {
      id: new Date().getTime() + 7, // 时间戳
      type: homeSection.video, // 短视频
      showH5: true,
      showMp: true,
      data: {
        showTitle: '1', // 是否显示标题 1是 2否
        title: ''
      }
    },
    {
      id: new Date().getTime() + 8, // 时间戳
      type: homeSection.information, // 健康资讯
      showH5: true,
      showMp: true,
      data: {
        showTitle: '1', // 是否显示标题 1是 2否
        title: ''
      }
    },
    {
      id: new Date().getTime() + 9, // 时间戳
      type: homeSection.live, // 直播
      showH5: true,
      showMp: true,
      data: {
        showTitle: '1', // 是否显示标题 1是 2否
        title: '',
        showTheme: '1', // 是否显示主题 1是 2否
        showDesc: '1', // 显示直播简介1是 2否
        endIsHide: '1', // 直播结束后隐藏本模块 1是 2否
      }
    }
  ]
}
