import refresh from '@/phr/page/patientdetail/refresh'
import abstract from '@/phr/page/patientdetail/abstract'
import diagnosis from '@/phr/page/patientdetail/diagnosis'
import consultations from '@/phr/page/patientdetail/consultations'
import appointment from '@/phr/page/patientdetail/appointment'
import register from '@/phr/page/patientdetail/register'
import preview from '@/phr/page/patientdetail/preview'
import archives from '@/phr/page/patientdetail/archives'
import change from '@/phr/page/patientdetail/change'
import doctoradvice from '@/phr/page/patientdetail/doctoradvice'
import operation from '@/phr/page/patientdetail/operation'
import treatment from '@/phr/page/patientdetail/treatment'
import inspect from '@/phr/page/patientdetail/inspect/inspect'
import test from '@/phr/page/patientdetail/test/test'
import records from '@/phr/page/patientdetail/records'
import interrogation from '@/phr/page/patientdetail/interrogation'
import preInterrogation from '@/phr/page/patientdetail/pre.interrogation'
import sign from '@/phr/page/patientdetail/sign'
import allergy from '@/phr/page/patientdetail/allergy'
import Follow from '@/phr/page/patientdetail/follow'

export default
[
  {
    path: 'refresh',
    component: refresh,
  },
  {
    path: 'abstract',
    component: abstract,
  },
  {
    path: 'diagnosis',
    component: diagnosis,
  },
  {
    path: 'consultations',
    component: consultations,
  },
  {
    path: 'appointment',
    component: appointment,
  },
  {
    path: 'register',
    component: register,
  },
  {
    path: 'preview',
    component: preview,
  },
  {
    path: 'archives',
    component: archives,
  },
  {
    path: 'change',
    component: change,
  },
  {
    path: 'doctoradvice',
    component: doctoradvice,
  },
  {
    path: 'operation',
    component: operation,
  },
  {
    path: 'treatment',
    component: treatment,
  },
  {
    path: 'inspect',
    component: inspect,
  },
  {
    path: 'test',
    component: test,
  },
  {
    path: 'records',
    component: records,
  },
  {
    path: 'interrogation',
    component: interrogation,
  },
  {
    path: 'preinterrogation',
    component: preInterrogation,
  },
  {
    path: 'sign',
    component: sign,
  },
  {
    path: 'allergy',
    component: allergy,
  },
  {
    path: 'follow',
    component: Follow,
    // children: [
    //   {
    //     path: 'detail/:id/:patientId?',
    //     name: 'followdetail',
    //     component: FollowDetail,
    //   }
    // ]
  },
]
