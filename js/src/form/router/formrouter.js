import formschema from '../page/formschema'
import form from '../page/form'
import schemalist from '../page/schemalist'
import formlist from '../page/formlist'
import phrdemo from '../page/phrdemo'
// import phrtpllist from '../page/phrtpllist'
import doclist from '../page/doclist'
import doc from '../page/doc'
import layout from '../page/layout'
export default [
  {
    path: 'docs',
    name: 'medicalDocsManage',
    component: doclist
  },
  {
    path: 'docs/:id',
    name: 'medicalDocsManageEdit',
    component: doc
  },
  {
    path: 'formschemas',
    name: 'medicalFormsManage',
    component: schemalist
  },
  {
    path: 'formschemas/:id',
    name: 'medicalFormsManageEdit',
    component: formschema
  },
  {
    path: 'forms',
    component: layout,
    children: [
      {
        path: ':schemaId',
        component: formlist
      },
      {
        path: ':schemaId/:id',
        component: form
      }
    ]
  },
  {
    path: 'phrdemo',
    component: phrdemo
  },
  // {
  //   path: 'phrtpllist',
  //   component: phrtpllist
  // }
]
