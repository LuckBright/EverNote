import { jlssbCode, hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import dataUpload from '@/rcm/otmdiscomponent/reconciliation/data.upload.vue'
import costDeclaration from '@/rcm/otmdiscomponent/reconciliation/cost.declaration.vue'
import protocolSign from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/protocolsign.vue'
import protocolSignDetail from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/protocolsigndetail.vue'

const thirdActiveIndex = '/hi/medicalcheck/medicalReimbursement'
const Menus = [{
  id: 'dataUpload',
  name: '数据上传',
  component: dataUpload,
  include: [jlssbCode]
},
{
  id: 'costDeclaration',
  name: '费用月申报',
  component: costDeclaration,
  include: [jlssbCode]
},
{
  id: 'protocolSign',
  name: '医院协议签署',
  component: protocolSign,
  include: [hljybCode]
},
{
  id: 'protocolSignDetail',
  name: '定点协议签署情况',
  component: protocolSignDetail,
  include: [hljybCode]
}]

export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
