<template>
  <div>
    <ever-form2
      :schema="schema"
      v-model="obj"
      :nosubmit="true"
      ref="form"
      :info="true"
      labelWidth="100px"
      label-position="right">
      <template slot="type">
        <ever-tabs :packageDetails="treeData" :isGroupControl="isGroupControl"></ever-tabs>
      </template>
      <template slot="default">
        <div></div>
      </template>
    </ever-form2>
  </div>
</template>
<script>
import groupClinicTree from './groupclinictree'
import everTabs from './evertabs'
import api from '@/card/store/packagemanagement/api'
import { CATEGORYIDS_TYPE } from '@/card/util/cardcommon'
export default {
  props: ['packageDetails', 'isGroupControl'],
  components: {
    groupClinicTree,
    everTabs
  },
  data () {
    var schema = [
      {
        name: 'code',
        label: '套餐编码',
        props: {
          disabled: true
        },
        span: 12
      },
      {
        name: 'name',
        label: '套餐名称',
        props: {
          disabled: true
        },
        span: 12
      },
      {
        name: 'curDptranges',
        label: '适用科室',
        comp: 'ever-subject-select',
        props: {
          params: {
            type1CodeList: [CATEGORYIDS_TYPE[0].id]
          },
          props: {
            'check-strictly': true,
          },
          ref: 'ess',
          type: 'tree',
          multiple: true,
          fields: 'orgSubjectCode'
        },
        span: 24
      },
      {
        name: 'type',
        label: '',
        comp: 'custom'
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      obj,
      schema,
      info: [],
      treeData: [],
      activeName: 'first'
    }
  },
  methods: {
    init () {
      this.obj.name = this.packageDetails.name
      this.obj.code = this.packageDetails.code
      let initDptranges = this.packageDetails.fitDptIds || [] // 回显科室
      let dptranges = []
      initDptranges.map(item => { dptranges.push(item.rangeCode) })
      this.obj.curDptranges = dptranges
    }
  },
  created () {},
  watch: {
    'packageDetails': {
      handler (val) {
        if (val) {
          this.treeData = this.packageDetails
        }
        this.init()
      },
      immediate: true
    }
  }
}
</script>

