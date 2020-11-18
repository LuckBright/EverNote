<template>
  <div class="main z-source-template">
    <div class="region go-back-tip">
      <el-button @click="goBack" size="small">上一步</el-button>
      <el-button
        size="small" type="primary" @click="sendClickBtn"
      >完成
      </el-button
      >
    </div>
    <div class="region">
      <!--周模板-->
      <week-comp v-if="tempObj.tempType === '0'" ref="weepCompRef"></week-comp>
      <!--日历模板-->
      <date-picker v-else ref="datePicker"></date-picker>
    </div>
  </div>
</template>
<script>
  import api from '../api'
  import weekComp from './week.comp'
  import datePicker from './datepicker'

  export default {
    components: {
      weekComp,
      datePicker,
    },
    filters: {
      isSource (val) {
        return val.isAppt
          ? val.cntLimit
            ? `全天限${ val.cntLimit }人`
            : '可预约'
          : '停止预约'
      },
    },
    data () {
      return {
        tempObj: {},
      }
    },
    created () {
      let form = JSON.parse(this.$route.query.form)
      this.tempObj = { ...this.tempObj, ...form }
    },
    methods: {
      // 上一步
      goBack () {
        this.$router.push({
          path: '/titanmall/goodsmain/goodsmanager/sourcedetail',
          query: { form: this.$route.query.form },
        })
      },

      // 保存
      sendClickBtn () {
        if (this.tempObj.tempType === '0') {
          this.tempObj.cntLimitVOS = this.$refs.weepCompRef.tableData
        } else {
          let list = this.$refs.datePicker.tableData.filter(
            item => !item.isEmpty,
          )
          this.tempObj.cntLimitVOS = list
        }
        api.appointSave({ ...this.tempObj }).then(res => {
          if (res) {
            this.$message.success('保存成功')
            this.$router.push({ path: '/titanmall/goodsmain/goodsmanager/sourcecomp' })
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .z-source-template {
    margin: 10px;
  }
  .go-back-tip {
    padding: 10px 10px 10px 20px;
  }

</style>
