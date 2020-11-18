<template>
  <div class="layout_inner">
    <el-tabs v-model="activeName" class="tab">
      <el-tab-pane label="医生端" name="doctor">
        <el-row class="mgt15">
          <b>我的患教：</b>
          <span>开启后医生端医生能自行录制短视频</span>
          <el-switch v-model="doctor.patient" class="mgl15"></el-switch>
        </el-row>
        <el-row class="mgt15">
          <b>医生带货：</b>
          <span>开启后医生能在上传短视频时添加商品推荐</span>
          <el-switch v-model="doctor.shop" class="mgl15"></el-switch>
        </el-row>
        <el-row class="mgt15">
          <b>是否审核：</b>
          <span>开启医生在上传短视频自动审核通过到患者页展示</span>
          <el-switch v-model="doctor.check" class="mgl15"></el-switch>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-row class="mgt15">
      <el-button type="primary" @click="save">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import api from '@/titancare/api/business/index'
import { debounce } from '@/titancare/utils/common'

export default {
  data () {
    return {
      api,
      activeName: 'doctor',
      doctor: {
        patient: true, // 默认开启
        shop: false, // 默认关闭
        check: false // 默认关闭
      },
      patient: {
        open: false // 默认关闭
      },
      olddoctor: {
        patient: true,
        shop: false,
        check: false
      },
      oldpatient: {
        open: false
      }
    }
  },
  watch: {
    'activeName' (v) {
      this.clear()
    }
  },
  created () {
    this.getShortVideoAllow()
    this.getHealthClassAllow()
  },
  methods: {
    // 保存成功后记得把 Object.assign(this.olddoctor, this.doctor)
    save: debounce(function () {
      if (this.activeName === 'doctor') {
        this.api.createOrUpdateShortVideoAllow(this.doctor).then(rs => {
          if (rs.errCode === 0) {
            this.$notify({
              message: '保存成功',
              type: 'success'
            })
            Object.assign(this.olddoctor, this.doctor)
          }
        })
      } else {
        this.api.createOrUpdateHealthClassAllow(this.patient).then(rs => {
          if (rs.errCode === 0) {
            this.$notify({
              message: '保存成功',
              type: 'success'
            })
            Object.assign(this.oldpatient, this.patient)
          }
        })
      }
    }, 1000),
    // 医生
    getShortVideoAllow () {
      this.api.getShortVideoAllow().then(rs => {
        if (rs.errCode === 0 && rs.data) {
          Object.assign(this.doctor, rs.data)
          Object.assign(this.olddoctor, rs.data)
        }
      })
    },
    // 患者
    getHealthClassAllow () {
      this.api.getHealthClassAllow().then(rs => {
        if (rs.errCode === 0 && rs.data) {
          Object.assign(this.patient, { open: rs.data })
          Object.assign(this.oldpatient, { open: rs.data })
        }
      })
    },
    // 切换tab claar一次
    clear () {
      Object.assign(this.doctor, this.olddoctor)
      Object.assign(this.patient, this.oldpatient)
    }
  }
}
</script>

<style scoped lang="less">
.box {
  background-color: #f8f9fa;
  height: 100%;
  padding: 10px 21px 21px 21px;
  .tab {
    /deep/ .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #bbbbbb;
    }
  }
}
.mgl15 {
  margin-left: 15px;
}
.mgt15 {
  margin-top: 15px;
}
</style>
