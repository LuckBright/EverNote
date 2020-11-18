<template>
  <div class="flex_layout_full">
    <div class="layout_inner">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="借阅申请" name="first">
          <record-borrow-apply :role="role" v-if="activeName === 'first'"></record-borrow-apply>
        </el-tab-pane>
        <el-tab-pane label="借阅记录" name="second">
          <record-borrow-notes :role="role" v-if="activeName === 'second'"></record-borrow-notes>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import recordBorrowApply from '@/inpatient/page/medicalrecord/record.borrow.apply'
  import recordBorrowNotes from '@/inpatient/page/medicalrecord/record.borrow.notes'

  export default {
    data () {
      return {
      }
    },
    computed: {
      activeName: {
        get (val) {
          return this.$store.state.borrowType || 'first'
        },
        set (val) {
          this.$store.commit('setBorrow', val)
        }
      },
      role () {
        return this.$route.matched[0].meta.role   // 护士 - '2' | 医生 - '1'
      }
    },
    methods: {
      handleClick (value) {
        this.$store.commit('setBorrow', value.name)
      }
    },
    components: {
      recordBorrowApply,
      recordBorrowNotes
    }
  }
</script>

<style lang="scss" scoped>
.layout_inner {
  width: calc(100% - 20px);
}
</style>
