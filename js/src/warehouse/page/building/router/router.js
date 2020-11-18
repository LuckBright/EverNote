import BuildingList from '@/warehouse/page/building/views/building/list'
import BuildingDetail from '@/warehouse/page/building/views/building/detail'
import RoomList from '@/warehouse/page/building/views/room/list'
import RoomDetail from '@/warehouse/page/building/views/room/detail'
// import BedList from '@/warehouse/page/building/views/bed/list'
// import BedDetail from '@/warehouse/page/building/views/bed/detail'
import BedTypeList from '@/warehouse/page/building/views/bed/typelist'
import BedTypeDetail from '@/warehouse/page/building/views/bed/typedetail'
import SeatTypeList from '@/warehouse/page/building/views/seat/typelist'
import SeatTypeDetail from '@/warehouse/page/building/views/seat/typedetail'
import SickAreaList from '@/warehouse/page/building/views/sickarea/list'
import SickAreaDetail from '@/warehouse/page/building/views/sickarea/detail'
import DiagnosisAreaList from '@/warehouse/page/building/views/diagnosisarea/list'
import DiagnosisAreaDetail from '@/warehouse/page/building/views/diagnosisarea/detail'
const router = [
  {
    path: 'building/list',
    name: 'building-list',
    component: BuildingList,
    meta: {
      h: true,
    },
  },
  {
    path: 'building/detail/:type/:id',
    name: 'building-detail',
    component: BuildingDetail,
    meta: {
      h: true,
      thirdActiveIndex: '/warehouse/building/list'
    },
  },
  {
    path: 'building/room/list',
    name: 'building-room-list',
    component: RoomList,
    meta: {
      h: true,
    },
  },
  {
    path: 'building/room/detail/:type/:id',
    name: 'building-room-detail',
    component: RoomDetail,
    meta: {
      h: true,
      thirdActiveIndex: '/warehouse/building/room/list'
    },
  },
  // {
  //   path: 'building/bed/list',
  //   name: 'building-bed-list',
  //   component: BedList,
  //   meta: {
  //     h: true,
  //   },
  // },
  // {
  //   path: 'building/bed/detail/:type/:id',
  //   name: 'building-bed-detail',
  //   component: BedDetail,
  //   meta: {
  //     h: true,
  //   },
  // },
  {
    path: 'building/bedType/list',
    name: 'building-bedType-list',
    component: BedTypeList,
    meta: {
      h: true,
    },
  },
  {
    path: 'building/bedType/detail/:type/:id',
    name: 'building-bedType-detail',
    component: BedTypeDetail,
    meta: {
      h: true,
      thirdActiveIndex: '/warehouse/building/bedType/list'
    },
  },
  // 座位类型管理
  {
    path: 'building/seatType/list',
    name: 'building-seatType-list',
    component: SeatTypeList,
    meta: {
      h: true,
    },
  },
  {
    path: 'building/seatType/detail/:type/:id',
    name: 'building-seatType-detail',
    component: SeatTypeDetail,
    meta: {
      h: true,
      thirdActiveIndex: '/warehouse/building/seatType/list'
    },
  },
  {
    path: 'building/sickArea/list',
    name: 'building-sickArea-list',
    component: SickAreaList,
    meta: {
      h: true,
    },
  },
  {
    path: 'building/sickArea/detail/:type/:id',
    name: 'building-sickArea-detail',
    component: SickAreaDetail,
    meta: {
      h: true,
      thirdActiveIndex: '/warehouse/building/sickArea/list'
    },
  },
  {
    path: 'building/diagnosisArea/list',
    name: 'building-diagnosisArea-list',
    component: DiagnosisAreaList,
    meta: {
      h: true,
    },
  },
  {
    path: 'building/diagnosisArea/detail/:type/:id',
    name: 'building-diagnosisArea-detail',
    component: DiagnosisAreaDetail,
    meta: {
      h: true,
      thirdActiveIndex: '/warehouse/building/diagnosisArea/list'
    },
  },
]
export default router
