<template>
  <div>
    <div>多个人员查询框只查询1次</div>
    <hr>
<!--    <div>第一个查询框需要监听 finish 方法，等待第一个查询完成之后，再显示第二个查询框时，就会使用上一个数据进行展示</div>-->
    <ever-staff-select2 multiple v-model="value"></ever-staff-select2>
    <div>
      value: {{value}}
    </div>
<!--    <hr>-->
    <ever-staff-select2 useCache multiple v-model="value1"></ever-staff-select2>
    <ever-staff-select2 useCache multiple v-model="value2"></ever-staff-select2>
<!--    <hr>-->
    <ever-staff-select2 useCache multiple v-model="value"></ever-staff-select2>
    <div>end~</div>
    <hr>
<!--    测试回显-->
  </div>
</template>
<script>
  import EverStaffSelect2 from '@/manages/page/organization/components/everstaffselect.vue'
  export default {
    components: {
      EverStaffSelect2,
    },
    data () {
      return {
        value: [ 'ccde0edb3ea6426e9a96e70e9fff4f59', 'd703b214ce8141aa9d15cf39269cf489' ],
        // value: '',
        value1: '',
        value2: '',
        finished: false,
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      changeFinish () {
        this.finished = true
      },
    },
  }
</script>
