<template>
  <div>
    <h4>多选选择</h4>
    {{value2}}
    <ever-staff-select v-model="value2" multiple :params="params"></ever-staff-select>
    <br>
    {{value}}
    <ever-staff-select v-model="value" :params="{
      everQueryType: 'out',
      typeCodeList: ['DOCTOR'],
      typeCode: true
    }"></ever-staff-select>
    <hr>
    <code>
      everform2 内 大家可以这样用 {{schema1}}
    </code>
    <br>
    <h4>多选回显</h4>
<!--    {{value2}}-->
<!--    <ever-staff-select v-model="value2" multiple :params="params"></ever-staff-select>-->
    <br>
    <hr>
    <br>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        value: [],
        value2: [ '005c461b2a344f2ebc1dcfe20dd81cc2', '00dd044674574ec6ab3dd16cbf307c66' ],
        params: {
          everQueryType: 'out',
          typeCode: 'NURSE',
        },
        schema1: {
          name: 'doctorId',
          label: '签约医生姓名',
          comp: 'ever-staff-select',
          placeholder: '请选择医生',
          span: 12,
          props: {
            // fields: 'id', // 可以省略
            clearable: true,
            // type: 'select', // 可以省略
            params: {
              everQueryType: 'out',
              // typeCodeList: ['DOCTOR'],
            }
          },
        },
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
