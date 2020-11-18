<template>
  <div>
  <ever-bread-crumb name="药品分类" path="/warehouse/drugcategories"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules"
        labelWidth="140px"
        @objsaved="afterSave" label-position="right">
      </ever-form>
    </div>
  </div>
</template>
<script>
  import drugcategory from '../store/drugcategoryapi'
  import sysvalue from '@/warehouse/store/sysvalueapi'

  var schema = [
    {
      name: 'name',
      label: '分类名称',
      min: 1,
      max: 40
    },
    {
      name: 'engName',
      label: '分类英文名称',
      max: 40
    },
    {
      name: 'category',
      label: '分类',
      type: 'cascader',
      options: []
    },
    {
      name: 'atcCategory',
      label: 'ATC 分类',
      type: 'cascader',
      options: []
    },
    {
      name: 'supersiveCategory',
      label: '监管分类',
      code: 'THC_WH_DRUG_OTC',
      type: 'systype'
    },
    {
      name: 'controlCategory',
      label: '控制性分类',
      code: 'THC_WH_DRUG_CONTRAL',
      type: 'systype'
    },
    {
      name: 'belongCategory',
      label: '归经分类',
      type: 'systype',
      code: 'THC_WH_DRUG_GUIJING'
    },
    {
      name: 'tasteCategory',
      label: '药味分类',
      type: 'systype',
      code: 'THC_WH_DRUG_YAOWEI'
    },
    {
      name: 'resistanceCategory',
      label: '药性分类',
      code: 'THC_WH_DRUG_YAOXING',
      type: 'systype'
    },
    {
      name: 'enableDate',
      label: '生效时间',
      type: 'date',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      name: 'disableDate',
      label: '失效时间',
      type: 'date',
      outformat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      name: 'description',
      label: '备注',
      span: 24,
      type: 'textarea'
    }
  ]

  export default {
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      var init = {
        category: [],
        atcCategory: []
      }
      obj = Object.assign(obj, init)
      return {
        schema,
        obj: obj,
        api: drugcategory,
        rules: {
          name: [
            { required: true, message: '必填项', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '必填项', trigger: 'blur', type: 'array' }
          ],
          enableDate: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ]
        },
        options: []
      }
    },
    methods: {
      afterSave () {
        this.$router.push('/warehouse/drugcategories')
      }
    },
    created () {
      sysvalue.cascade(
        'THC_WH_DRUG_CATALOG1',
        'THC_WH_DRUG_CATALOG2',
        'THC_WH_DRUG_CATALOG3').then(options => {
          this.$ever.getFieldFromSchema(this.schema, 'category').options = options
        })
      sysvalue.cascade(
        'THC_WH_DRUG_ATC1',
        'THC_WH_DRUG_ATC2'
        ).then(options => {
          this.$ever.getFieldFromSchema(this.schema, 'atcCategory').options = options
        })
    }
  }
</script>
