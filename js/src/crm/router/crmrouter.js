import Crm from '../page/crmframe'
import Visit from '../page/visit'
import Seat from '../page/seat'
import Addseat from '../page/addseat'
import Call from '../page/call'
import SnsList from '../page/snslist'
import PhysicalList from '../page/physicallist'
import CallDetail from '../page/calldetail'

import Question from '../page/question'
import CreateQuestion from '../page/createquestion'
import QuestionDetail from '../page/questiondetail'
import QuestionTemp from '../page/questiontemp.vue'
import Consult from '../page/consult.vue'
import CreateConsult from '../page/createconsult.vue'
import CreateConsultsmall from '../page/createconsultsmall.vue'
import ViewConsult from '../page/viewconsult.vue'
import Feedback from '../page/feedback.vue'
import Createfeedback from '../page/createfeedback.vue'
import Feedbackdetail from '../page/feedbackdetail.vue'
import Feedcompete from '../page/feedcompete.vue'
import Feedbackhandle from '../page/feedbackhandle.vue'
import Member from '../page/member.vue'
import Memberadd from '../page/memberadd.vue'
import Phrquery from '../components/phrquery.vue'
import Moreadd from '../page/moreadd.vue'
import Memberinfo from '../page/memberinfo.vue'
import Userinfo from '../page/userinfo.vue'
// 客户分析
import CustomerAnalysisFigure from '@/crm/page/member/customeranalysis/customeranalysisfigure'
import HealthyRecord from '../components/healthyrecord.vue'
import CustomerLabel from '../components/customerlabel.vue'
import ReservationsRecord from '../components/reservationsrecord.vue'
import AppointsRecord from '../components/appointsrecord.vue'
import DrugRecord from '@/crm/page/member/drugrecord/drugrecordlist'
import InspectRecord from '../components/inspectrecord.vue'
import Diagnosis from '../../workspace/page/diagnosis.vue'
import Consultlist from '../page/consultlist.vue'
// 反馈记录
import FeedbackInfo from '@/crm/page/member/feedbackrecord/feedbackinfo'
import relationShip from '../page/relationship.vue'
import Orderlist from '../page/orderlist.vue'

// 商品耗材记录
import CommoditySuppliesInfo from '@/crm/page/member/commoditysupplies/commoditysuppliesinfo'
import ComboList from '../page/combolist.vue'
// 证明记录
import ProofRecordList from '@/crm/page/member/proofrecord/proofrecordlist'
// 收货地址
import ShippingAddressList from '@/crm/page/member/shippingaddress/shippingaddresslist'
import Cliniclist from '../components/cliniclist.vue'
import ProveRecord from '../components/proverecord.vue'
import MemberBaseInfo from '../page/memberbaseinfo.vue'
import Memberinfoedit from '../page/memberinfoedit.vue'
import Membercarddetail from '../page/membercarddetail.vue'
import Taglist from '@/crm/page/tag/taglist.vue'
import UserInsuranceInfo from '../../workspace/page/userinsuranceinfo.vue'
import UserInsuranceEdit from '../../workspace/page/userinsuranceedit.vue'
import signInfo from '@/crm/page/info/signinfo.vue'
import myFollow from '@/crm/page/member/myfollow/myfollow.vue'
// 客户信息=>往来机构
import CorrespondingInstitution from '@/crm/page/member/customerinfo/correspondinginstitution'
import PatientIdentity from '../page/patient.identity.vue'
import CardInfo from '../page/card.info.vue'
import AccountInfo from '../page/account.info.vue'
import CouponInfo from '../page/coupon.info.vue'
import Couponsdetail from '../page/couponsdetail.vue'
import Comment from '../page/comment.vue'
import Commentinfo from '../page/commentinfo.vue'

import Sourcechart from '../page/sourcechart.vue'
import Sourcelist from '../page/sourcelist.vue'
import Sourcekpi from '../page/sourcekpi.vue'
import Changeprofit from '../page/changeprofit.vue'
import Changedetail from '../page/changedetail.vue'
import Sourcemember from '../page/sourcemember.vue'
import Sourcedetail from '../page/sourcedetail.vue'
import SourceSub from '../page/sourcesub.vue'
import Recordlist from '../page/recordlist.vue'
import Createsource from '../page/createsource.vue'
import Imandexlist from '../page/imandexlist.vue'
import Repeatmember from '../page/repeatmember.vue'
import Repeatdetail from '../page/repeatdetail.vue'
import Welcome from '@/login/page/welcome'

// 客服工作站 检查检验报告解读
import Report from '@/arrange/page/reservation/report.vue'

// 排班设置
// import SourceDetail from '@/arrange/page/source/sourceDetail'
// import Source from '@/arrange/page/source/source'
// import Schedulingmain from '@/arrange/page/scheduling/main.vue'
// import Templatemain from '@/arrange/page/template/main.vue'

// import Setting from '@/arrange/page/setting/index.vue'
// import WeeksSetting from '@/arrange/page/setting/weeks.vue'
// import Schedulingaudit from '@/arrange/page/setting/schedulingaudit.vue'
// import MonthSetting from '@/arrange/page/setting/months.vue'
import followplan from '@/crm/page/healthy/followplan'
import createfollow from '@/crm/page/healthy/createfollow'
import materiallist from '@/crm/page/healthy/materiallist'
import formmanagement from '@/crm/page/healthy/formmanagement'
import classifylist from '@/crm/page/healthy/classifylist'
import followtask from '@/crm/page/healthy/followtask'
import newfollowlist from '@/crm/page/healthy/newfollowlist'
import mytask from '@/crm/page/mytask'
import alltask from '@/crm/page/alltask'
import executetask from '@/crm/page/executetask'
import subtaskdetails from '@/crm/page/subtaskdetails'
import UseDetailList from '@/crm/page/packagesale/usedetailsinfo'
import restrict from '@/crm/page/member/restrict'
import bedList from '@/crm/page/business/bed.list'

// 腕带管理
import wristbandList from '@/sob/page/wristband/list'

// 身份卡
import IdCardList from '@/card/page/idcardmanage/idcardlist'
import IdCardContent from '@/card/page/idcardmanage/idcardcontent'
// 行为标签管理
import behaviorList from '@/crm/page/tag/behavior.list.vue'
import behaviorDetail from '@/crm/page/tag/behavior.detail.vue'
// 标签管理
export default [
  {
    path: '/crm',
    name: 'crm',
    redirect: '/crm/welcome',
    component: Crm,
    meta: {
      crm: true
    },
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'report',
        name: 'report',
        component: Report
      },
      {
        name: 'visit',
        path: 'visit',
        component: Visit,
        meta: {
          thirdActiveIndex: '/crm/visit'
        }
      },
      {
        name: 'mytask',
        path: 'mytask',
        component: mytask
      },
      {
        name: 'alltask',
        path: 'alltask',
        component: alltask
      },
      {
        name: 'executetask',
        path: 'executetask/:patientId/:taskId',
        component: executetask
      },
      {
        name: 'subtaskdetails',
        path: 'subtaskdetails/:taskId/:patientId',
        component: subtaskdetails
      },
      {
        name: 'seat',
        path: 'seat',
        component: Seat,
        meta: {
          thirdActiveIndex: '/crm/seat'
        }
      },
      {
        name: 'addseat',
        path: 'addseat',
        component: Addseat,
        meta: {
          thirdActiveIndex: '/crm/seat'
        }
      },
      {
        name: 'call',
        path: 'call',
        component: Call,
        meta: {
          thirdActiveIndex: '/crm/seat'
        }
      },
      {
        name: 'calldetail',
        path: 'calldetail',
        component: CallDetail,
        meta: {
          thirdActiveIndex: '/crm/seat'
        }
      },
      {
        name: 'question',
        path: 'question',
        component: Question
      },
      {
        name: 'createquestion',
        path: 'createquestion',
        component: CreateQuestion,
        meta: {
          thirdActiveIndex: '/crm/question'
        }
      },
      {
        name: 'questiondetail',
        path: 'questiondetail',
        component: QuestionDetail,
        meta: {
          thirdActiveIndex: '/crm/question'
        }
      },
      {
        name: 'questiontemp',
        path: 'questiontemp',
        component: QuestionTemp,
        meta: {
          thirdActiveIndex: '/crm/question'
        }
      },
      {
        name: 'consult',
        path: 'consult',
        component: Consult,
      },
      {
        name: 'createconsult',
        path: 'createconsult',
        component: CreateConsult,
        meta: {
          thirdActiveIndex: '/crm/consult'
        }
      },
      {
        name: 'createConsultsmall',
        path: 'createConsultsmall',
        component: CreateConsultsmall
      },
      {
        name: 'viewconsult',
        path: 'viewconsult',
        component: ViewConsult,
        meta: {
          thirdActiveIndex: '/crm/consult'
        }
      },
      {
        name: 'feedback',
        path: 'feedback',
        component: Feedback
      },
      {
        name: 'createfeedback',
        path: 'createfeedback',
        component: Createfeedback,
        meta: {
          thirdActiveIndex: '/crm/feedback'
        }
      },
      {
        name: 'feedbackdetail',
        path: 'feedbackdetail',
        component: Feedbackdetail,
        meta: {
          thirdActiveIndex: '/crm/feedback'
        }
      },
      {
        name: 'feedcompete',
        path: 'feedcompete',
        component: Feedcompete,
        meta: {
          thirdActiveIndex: '/crm/feedback'
        }
      },
      {
        name: 'feedbackhandle',
        path: 'feedbackhandle',
        component: Feedbackhandle,
        meta: {
          thirdActiveIndex: '/crm/feedback'
        }
      },
      {
        name: 'comment',
        path: 'comment',
        component: Comment
      },
      {
        name: 'repeatmember',
        path: 'repeatmember',
        component: Repeatmember
      },
      {
        name: 'repeatdetail',
        path: 'repeatdetail',
        component: Repeatdetail,
        meta: {
          thirdActiveIndex: '/crm/repeatmember'
        }
      },
      {
        name: 'restrict',
        path: 'restrict',
        component: restrict,
        meta: {
          thirdActiveIndex: '/crm/restrict'
        }
      },
      {
        // 腕带管理
        name: 'wristband',
        path: 'wristband/:type',
        component: wristbandList,
        meta: {
          thirdActiveIndex: '/crm/wristband/2'
        }
      },
      // 身份卡
      {
        path: 'idcards',
        name: 'idcards',
        component: IdCardList,
        meta: {
          thirdActiveIndex: '/crm/idcards'
        }
      },
      {
        name: 'idcard',
        path: '/crm/idcard',
        component: IdCardContent,
        meta: {
          thirdActiveIndex: '/crm/idcards'
        }
      },
      {
        path: '/crm/idcardedit/:code',
        component: IdCardContent,
        meta: {
          thirdActiveIndex: '/crm/idcards'
        }
      },
      // 行为标签管理
      {
        path: 'behaviorlist',
        name: 'behaviorlist',
        component: behaviorList,
        meta: {
          rid: 'Auth_menu_group_operatings_behaviorList'
        }
      },
      {
        path: 'behaviordetail',
        name: 'behaviordetail',
        component: behaviorDetail,
        meta: {
          thirdActiveIndex: '/crm/behaviorList'
        }
      },
      {
        name: 'taglist',
        path: 'taglist',
        component: Taglist,
        meta: {
          rid: 'Auth_menu_group_operatings_taglist_manage',
          thirdActiveIndex: '/crm/taglist'
        }
      },
      {
        name: 'member',
        path: 'member',
        component: Member,
        meta: {
          rid: 'Auth_menu_crm_membermanage'
        }
      },
      {
        name: 'memberadd',
        path: 'memberadd',
        component: Memberadd,
        meta: {
          thirdActiveIndex: '/crm/member'
        }
      },
      {
        name: 'Phrquery',
        path: 'Phrquery',
        component: Phrquery,
        meta: {
          thirdActiveIndex: '/crm/member'
        }
      },
      {
        name: 'moreadd',
        path: 'moreadd',
        component: Moreadd,
        meta: {
          thirdActiveIndex: '/crm/member'
        }
      },
      {
        path: 'memberinfo',
        component: Memberinfo,
        children: [
          {
            path: 'userinfo',
            component: Userinfo,
            children: [
              {
                path: 'memberbaseinfo/:patientId?',
                name: 'memberbaseinfo',
                component: MemberBaseInfo,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              },
              {
                path: 'userinsuranceinfo/:patientId?',
                name: 'userinsurancehasid',
                component: UserInsuranceInfo,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              },
              {
                path: 'signinfo/:patientId',
                name: 'signinfo',
                component: signInfo,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              },
              {
                path: 'correspondinginstitutions/:patientId',
                name: 'correspondinginstitutions',
                component: CorrespondingInstitution,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              },
              {
                path: 'memberinfoedit/:patientId',
                name: 'memberinfoedit',
                component: Memberinfoedit
              },
              {
                path: 'userinsuranceedit/:patientId',
                name: 'userinsuranceedit',
                component: UserInsuranceEdit,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              },
              {
                path: 'patientidentity/:patientId',
                name: 'patientidentity',
                component: PatientIdentity,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              },
              {
                path: 'cardinfo/:patientId',
                name: 'cardinfo',
                component: CardInfo,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              },
              {
                path: 'accountinfo/:patientId',
                name: 'accountinfo',
                component: AccountInfo,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              },
              {
                path: 'couponinfo/:patientId',
                name: 'couponinfo',
                component: CouponInfo,
                meta: {
                  thirdActiveIndex: '/crm/member'
                }
              }
            ]
          },
          {
            name: 'healthyrecord',
            path: 'healthyrecord/:patientId?',
            component: HealthyRecord,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'relationship',
            path: 'relationship/:patientId?',
            component: relationShip,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'customerlabel',
            path: 'customerlabel/:patientId?',
            component: CustomerLabel,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'reservationsrecord',
            path: 'reservationsrecord/:patientId?',
            component: ReservationsRecord,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'appointsrecord',
            path: 'appointsrecord/:patientId?/:type?',
            component: AppointsRecord,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'drugrecord',
            path: 'drugrecord/:patientId?',
            component: DrugRecord,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'inspectrecord',
            path: 'inspectrecord/:patientId?',
            component: InspectRecord,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'customeranalysisfigure',
            path: 'customeranalysisfigure/:patientId?',
            component: CustomerAnalysisFigure,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'diagnosis',
            path: 'diagnosis/:patientId?',
            component: Diagnosis,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'consultlist',
            path: 'consultlist/:patientId?',
            component: Consultlist,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'feedbackinfo',
            path: 'feedbackinfo/:patientId?',
            component: FeedbackInfo,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'snslist',
            path: 'snslist/:patientId?',
            component: SnsList,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'physicallist',
            path: 'physicallist/:patientId?',
            component: PhysicalList
          },
          {
            name: 'memberorderlist',
            path: 'orderlist/:patientId?',
            component: Orderlist,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'commoditysuppliesinfo',
            path: 'commoditysuppliesinfo/:patientId?',
            component: CommoditySuppliesInfo,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'proverecord',
            path: 'proverecord/:patientId?',
            component: ProveRecord
          },
          {
            name: 'cliniclist',
            path: 'cliniclist/:patientId?',
            component: Cliniclist,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'combolist',
            path: 'combolist/:patientId?',
            component: ComboList,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'proofrecords',
            path: 'proofrecords/:patientId?',
            component: ProofRecordList,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'shippingaddresses',
            path: 'shippingaddresses/:patientId?',
            component: ShippingAddressList,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          },
          {
            name: 'myfollow',
            path: 'myfollow/:patientId?',
            component: myFollow,
            meta: {
              thirdActiveIndex: '/crm/member'
            }
          }
        ]
      },
      {
        name: 'couponsdetail',
        path: 'couponsdetail',
        component: Couponsdetail
      },
      {
        name: 'membercarddetail',
        path: 'membercarddetail',
        component: Membercarddetail
      },
      {
        name: 'commentinfo',
        path: 'commentinfo',
        component: Commentinfo
      },
      {
        name: 'sourcechart',
        path: 'sourcechart',
        component: Sourcechart
      },
      {
        name: 'sourcelist',
        path: 'sourcelist',
        component: Sourcelist,
        meta: {
          secActiveIndex: '/crm/sourcechart'
        }
      },
      {
        name: 'sourcekpi',
        path: 'sourcekpi',
        component: Sourcekpi,
        meta: {
          secActiveIndex: '/crm/sourcechart'
        }
      },
      {
        name: 'changeprofit',
        path: 'changeprofit',
        component: Changeprofit
      },
      {
        name: 'changedetail',
        path: 'changedetail',
        component: Changedetail
      },
      {
        name: 'sourcemember',
        path: 'sourcemember',
        component: Sourcemember,
        meta: {
          secActiveIndex: '/crm/sourcechart'
        }
      },
      {
        name: 'createsource',
        path: 'createsource',
        component: Createsource,
        meta: {
          secActiveIndex: '/crm/sourcechart'
        }
      },
      {
        name: 'imandexlist',
        path: 'imandexlist',
        component: Imandexlist,
        meta: {
          thirdActiveIndex: '/crm/member'
        }
      },
      {
        name: 'sourcedetail',
        path: 'sourcedetail',
        component: Sourcedetail,
        meta: {
          secActiveIndex: '/crm/sourcechart'
        }
      },
      {
        name: 'sourcesub',
        path: 'sourcesub',
        component: SourceSub,
        meta: {
          secActiveIndex: '/crm/sourcechart'
        }
      },
      {
        name: 'recordlist',
        path: 'recordlist',
        component: Recordlist
      },
      // {
      //   name: 'source',
      //   path: 'source',
      //   component: Source
      // },
      // {
      //   name: 'sourceDetail',
      //   path: 'source/:id',
      //   component: SourceDetail,
      //   meta: {
      //     thirdActiveIndex: '/crm/source'
      //   }
      // },
      // {
      //   name: 'templatemain',
      //   path: 'templatemain',
      //   component: Templatemain
      // },
      // {
      //   name: 'schedulingmain',
      //   path: 'schedulingmain',
      //   component: Schedulingmain
      // },
      // {
      //   name: 'setting',
      //   path: 'setting',
      //   component: Setting
      // },
      // {
      //   name: 'weeks',
      //   path: 'weeks',
      //   component: WeeksSetting
      // },
      // {
      //   name: 'schedulingaudit',
      //   path: 'schedulingaudit',
      //   component: Schedulingaudit
      // },
      // {
      //   name: 'person',
      //   path: 'person',
      //   component: person
      // },
      // {
      //   name: 'months',
      //   path: 'months',
      //   component: MonthSetting
      // },
      {
        path: 'newfollowlist',
        name: 'newfollowlist',
        component: newfollowlist
      },
      {
        path: 'usedetails/:id/:setMealId',
        name: 'usedetails',
        component: UseDetailList
      },
      {
        path: 'bedlist',
        name: 'bedlist',
        component: bedList,
        meta: {
          thirdActiveIndex: '/crm/bedlist'
        }
      },
    ]
  },
  {
    path: '/healthy',
    component: Crm,
    children: [
      {
        path: 'followplan',
        name: 'followplan',
        component: followplan
      },
      {
        path: 'createfollow/:id',
        name: 'createfollow/:id',
        component: createfollow
      },
      {
        path: 'createfollow',
        name: 'createfollow',
        component: createfollow
      },
      {
        path: 'materiallist',
        name: 'materiallist',
        component: materiallist
      },
      {
        path: 'formmanagement',
        name: 'formmanagement',
        component: formmanagement
      },
      {
        path: 'classifylist',
        name: 'classifylist',
        component: classifylist
      },
      {
        path: 'followtask/:id',
        name: 'followtask',
        component: followtask
      }
    ]
  }
]
