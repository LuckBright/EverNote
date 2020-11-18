// 批次定价相关路由
const ApplyDismantleAddBatch = () => import('@/warehouse/page/storages/business/batchprice/applydismantleadd.batch.vue')
const AllocationAddBatch = () => import('@/warehouse/page/storages/business/batchprice/allocationadd.batch.vue')
const RetiringBusinAddBatch = () => import('@/warehouse/page/storages/business/batchprice/retiringbusinadd.batch.vue')
const DestroyBusinessBatch = () => import('@/warehouse/page/storages/business/batchprice/destroybusiness.batch.vue')
const SplitAddBatch = () => import('@/warehouse/page/storages/business/batchprice/split.batch.vue')

export default [
  {
    path: 'applybusinessaddbatch/:id?',
    name: 'applybusinessaddbatch',
    component: ApplyDismantleAddBatch,
    meta: {
      thirdActiveIndex: '/storages/business'
    }
  },
  {
    path: 'allocationaddbatch',
    name: 'allocationaddbatch',
    component: AllocationAddBatch,
    meta: {
      thirdActiveIndex: '/storages/business'
    }
  },
  {
    path: 'retiringbusinaddbatch',
    name: 'retiringbusinaddbatch',
    component: RetiringBusinAddBatch,
    meta: {
      thirdActiveIndex: '/storages/business'
    }
  },
  {
    path: 'destroybusinessaddbatch/:id?',
    name: 'destroybusinessaddbatch',
    component: DestroyBusinessBatch,
    meta: {
      thirdActiveIndex: '/storages/business'
    }
  },
  {
    path: 'splitaddbatch',
    name: 'splitaddbatch',
    component: SplitAddBatch,
    meta: {
      thirdActiveIndex: '/storages/business'
    }
  },
  {
    path: 'splitabatchinfo/:id',
    name: 'splitabatchinfo',
    component: SplitAddBatch,
    meta: {
      thirdActiveIndex: '/storages/business'
    }
  },
]
