import Frame from '@/login/page/pageframe.vue'
import ConfigIndex from '@/titancare/views/homeconfig/page/configindex.vue'
import DoctorTeam from '@/titancare/views/graphic/page/doctor-team.vue'
import DeptIconTab from '@/titancare/views/graphic/page/dept-icon-tab.vue'
import DeptIconRecom from '@/titancare/views/graphic/page/dept-icon-recom.vue'
import WenrecommendedDoctorTab from '@/titancare/views/graphic/page/wenrecommenddoctor-tab'
import CommonDisease from '@/titancare/views/graphic/page/common-disease'

export default [
  {
    name: 'patientclient',
    path: 'patientclient',
    component: Frame,
    redirect: '/titancare/patientclient/configindex',
    children: [
      // 患者端设置-患者端首页
      {
        path: 'configindex',
        name: 'configindex',
        component: ConfigIndex,
      },
      // 患者端设置-医生团队设置
      {
        path: 'team',
        name: 'team',
        component: DoctorTeam,
      },
      // 患者端设置-推荐科室设置
      {
        path: 'depticon',
        name: 'depticon',
        component: DeptIconTab,
      },
      // 患者端设置-推荐科室设置-推荐医生
      {
        path: 'depticon-recom',
        name: 'depticonrecom',
        component: DeptIconRecom,
        meta: {
          thirdActiveIndex: '/titancare/patientclient/depticon',
        }
      },
      // 患者端设置-推荐医生设置
      {
        path: 'wenrecommendeddoctors',
        name: 'wenrecommendeddoctors',
        component: WenrecommendedDoctorTab,
        meta: {
          secActiveIndex: '/titancare/patientclient',
        }
      },
      // 患者端设置-常用疾病设置
      {
        path: 'commonDisease',
        name: 'commonDisease',
        component: CommonDisease,
        meta: {
          secActiveIndex: '/titancare/patientclient',
        }
      },
    ]
  }
]
