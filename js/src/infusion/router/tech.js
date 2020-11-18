import techIndex from './../page/tech.index'
import PrescriptionTplList from '@/sob/page/recipe.template/layout'
import PrescriptionFeeTplAdd from '@/sob/page/recipe.template/addfeetemplate'
import techMain from '@/infusion/page/tech.vue'
import medicalDictionary from '@/infusion/page/medical.dictionary.vue'
// import medicalTemplate from '@/infusion/page/medical.template.vue'
import medicalTemplate from '@/emr/page/template.manage.vue'
import medicalManagement from '@/infusion/page/medical.management.vue'
export default [
  {
    name: 'tech_index',
    path: '/tech',
    component: techIndex,
    redirect: '/tech/main/-1',
    meta: {
      space: 'tech',
    },
    children: [
      {
        name: 'tech_main',
        path: 'main/:serviceType',
        component: techMain,
        meta: {
          secActiveIndex: '/tech/main/-1',
          rid: 'Auth_menu_tech_index'
        }
      },
      // 费用模版
      {
        name: 'feeTemplateList',
        path: 'prescription/:visitType',
        component: PrescriptionTplList,
        meta: {
          noreg: true,
          rid: 'Auth_menu_tech_prescription'
        }
      },
      {
        name: 'feeTemplateAdd',
        path: 'prescription/:id/:visitType',
        component: PrescriptionFeeTplAdd,
        meta: {
          secActiveIndex: '/tech/prescription/5'
        }
      },
      {
        name: 'medicalmanagement',
        path: 'medical_management',
        component: medicalManagement,
        children: [
          {
            name: 'medical_dictionary',
            path: 'dictionary',
            component: medicalDictionary,

          },
          {
            name: 'medical_template',
            path: 'template/:templateId?',
            component: medicalTemplate,
            meta: {
              workshopTag: 'tech',
              thirdActiveIndex: '/tech/medical_management/template'
            },
          }
        ]
      },
    ]
  }
]
