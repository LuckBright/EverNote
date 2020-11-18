import ReviewList from '@/warehouse/page/prescription.review/views/reviewlist'
import OutpatientReview from '@/warehouse/page/prescription.review/views/outpatient.review'
import CommentListReview from '@/warehouse/page/prescription.review/views/commentlist.review'
export default [
  {
    path: 'reviews',
    name: 'Reviews',
    component: ReviewList,
    redirect: '/goods/reviews/outpatientreview/1',
    children: [
      {
        path: 'outpatientreview',
        name: 'outpatientreview',
        component: OutpatientReview,
        redirect: '/goods/reviews/outpatientreview/1',
        children: [
          {
            path: ':status',
            name: 'outpatientreviewStatus',
            component: OutpatientReview,
            meta: {
              thirdActiveIndex: '/goods/reviews/outpatientreview/1'
            }
          }
        ]
      },
      {
        path: 'hospitalizationreview',
        name: 'hospitalizationreview',
        component: OutpatientReview,
        redirect: '/goods/reviews/hospitalizationreview/1',
        children: [
          {
            path: ':status',
            name: 'hospitalizationreviewStatus',
            component: OutpatientReview,
            meta: {
              thirdActiveIndex: '/goods/reviews/hospitalizationreview/1'
            }
          }
        ]
      }
    ]
  },
  {
    path: 'setreview',
    name: 'CommentListReview',
    component: CommentListReview,
    meta: {
      thirdActiveIndex: '/goods/setreview'
    }
  }
]
