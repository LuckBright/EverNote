import Insurance from '@/insurance/insurance'

// 保险管理
import InsuranceOrg from '@/insurance/page/insuranceorg'
import InsuranceOrgList from '@/insurance/page/insuranceorglist'
import InsurProductList from '@/insurance/page/insurproductlist'
import Insurproduct from '@/insurance/page/insurproduct'
import InsurProductEdit from '@/insurance/page/insurproductedit'
import InsurproductArea from '@/insurance/page/insurproduct-area'
import InsurStdItemMedical from '@/insurance/page/insurstditemmedical'
import InsurStdItemMedicalList from '@/insurance/page/insurstditemmedicallist'
import InsurStdItemTreat from '@/insurance/page/insurstditemtreat'
import InsurStdItemTreatlist from '@/insurance/page/insurstditemtreatlist'
import InsuranceContractList from '@/insurance/page/insurancecontractlist'
import InsuranceContract from '@/insurance/page/insurancecontract'
import InsurProductClinic from '@/insurance/page/insurproduct-clinic'
import InsurProductItem from '@/insurance/page/insurproduct-item'
import InsurproductClass from '@/insurance/page/insurproduct-class'
import InsurProductPay from '@/insurance/page/insurproduct-pay'
import MedicalInsExprot from '@/insurance/page/medicalinsexport'
// 保险专员看板
import insuancemember from '@/rcm/page/insuancemember/insuancemember.vue'
let insurOrgIndex = '/manages/insuranceorgs'
let insurProIndex = '/manages/insurproducts'
let medinsIndex = '/manages/medins'

export default [
  {
    path: '/manages',
    redirect: '/manages/insuranceorgs',
    component: Insurance,
    children: [
      {
        path: 'insuranceorgs',
        component: InsuranceOrgList,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insuranceorgadd',
        name: 'insuranceorgadd',
        component: InsuranceOrg,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insuranceorg/:id',
        name: 'insuranceorg',
        component: InsuranceOrg,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurproducts',
        component: InsurProductList,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproducts/:id',
        component: Insurproduct,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproductadd',
        component: Insurproduct,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproductedit/:id/:insid',
        component: InsurProductEdit,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-areaadd/:productid',
        component: InsurproductArea,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-area/:productid/:id',
        component: InsurproductArea,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurstditemmedical/:id/:medicalId',
        name: 'insurStdItemMedicalEdit',
        component: InsurStdItemMedical,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurstditemmedicaladd/:medicalId',
        name: 'insurStdItemMedicaladd',
        component: InsurStdItemMedical,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurstditemmedicals/:id',
        name: 'insurstditemmedicals',
        component: InsurStdItemMedicalList,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurstditemtreats/:id',
        name: 'insurstditemtreats',
        component: InsurStdItemTreatlist,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurstditemtreatadd/:treatId',
        component: InsurStdItemTreat,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurstditemtreat/:id/:treatId',
        component: InsurStdItemTreat,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurancecontracts/:id',
        name: 'insurancecontracts',
        component: InsuranceContractList,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurancecontractadd/:inid/',
        component: InsuranceContract,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurancecontract/:inid/:id',
        component: InsuranceContract,
        meta: {
          thirdActiveIndex: insurOrgIndex
        }
      },
      {
        path: 'insurproduct-clinicadd/:id',
        component: InsurProductClinic,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-clinic/:id/:clinicId',
        component: InsurProductClinic,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-itemadd/:id/:insid',
        component: InsurProductItem,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-item/:id/:itemId/:insid',
        component: InsurProductItem,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-classadd/:productid',
        component: InsurproductClass,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-class/:productid/:id',
        component: InsurproductClass,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-payadd/:productid/:insid',
        component: InsurProductPay,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'insurproduct-pay/:productid/:id/:insid',
        component: InsurProductPay,
        meta: {
          thirdActiveIndex: insurProIndex
        }
      },
      {
        path: 'medins',
        component: MedicalInsExprot,
        meta: {
          thirdActiveIndex: medinsIndex
        }
      },
      {
        path: 'insuancemember',
        component: insuancemember
      }
    ]
  }
]
