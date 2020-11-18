<template>
  <div>
    <div class="layout_inner">
      <el-divider content-position="left">医生业务</el-divider>
      <h3>图文问诊排班设置</h3>
      <div class="inner_row">
        <!-- <span class="span-label">是否排班</span>
        <el-switch key="paiban" v-model="checkObj.arrange"></el-switch>
        <span class="ml20">{{checkObj.arrange ? '为医生排班' : '不为医生排班'}}</span> -->
        <span class="span-label">是否为医生排班：</span>
        <el-switch
          v-model="checkObj.arrange"
          active-text="排班"
          inactive-text="不排班"></el-switch>
      </div>
      <div v-if="checkObj.arrange" class="inner_row">
        <span class="red">开启后，需为医生排班，否则无法接诊！</span>
        <el-button size="small" type="primary" @click="toArrangeDiagnosis">去排班</el-button>
      </div>
      <div v-else class="inner_row">
        <span class="red">关闭后，需手动为医生设置服务价格，否则无法接诊！</span>
        <el-button size="small" type="primary" @click="toSetting">去设置</el-button>
      </div>
      <div>
        <span>允许医生在问诊时推荐商品</span>
        <el-switch key="shangpin" v-model="checkObj.itemShopOpen"></el-switch>
      </div>
      <el-divider></el-divider>
      <h3>在线咨询排班设置</h3>
      <div class="inner_row">
        <span class="span-label">是否为医生排班：</span>
        <el-switch
          v-model="checkObj.consultIsArrange"
          active-text="排班"
          inactive-text="不排班"></el-switch>
        <!-- <span class="span-label">是否排班</span>
        <el-switch key="paiban" v-model="checkObj.consultIsArrange"></el-switch>
        <span class="ml20">{{checkObj.consultIsArrange ? '为医生排班' : '不为医生排班'}}</span> -->
      </div>
      <div v-if="checkObj.consultIsArrange" class="inner_row">
        <span class="red">开启后，需为医生排班，否则无法接诊！</span>
        <el-button size="small" type="primary" @click="toArrangeOnline">去排班</el-button>
      </div>
      <div v-else class="inner_row">
        <span class="red">关闭后，需手动为医生设置服务价格，否则无法接诊！</span>
        <el-button size="small" type="primary" @click="toSetting">去设置</el-button>
      </div>
      <div>
        <span>允许医生在咨询时推荐商品</span>
        <el-switch key="shangpin" v-model="checkObj.consultShopOpen"></el-switch>
      </div>
    </div>

    <div class="layout_inner">
      <el-divider content-position="left">患者业务</el-divider>
      <h3>在线问诊必填项设置</h3>
      <p>说明：本设置为患者在在线问诊时，哪些内容是必填项</p>
      <div class="inner_row">
        <span class="span-label">病情描述文字</span>
        <el-checkbox v-model="checkObj.descriptionText">必填</el-checkbox>
      </div>
      <div class="inner_row">
        <span class="span-label">病情描述图片</span>
        <el-checkbox v-model="checkObj.descriptionPhoto">必填</el-checkbox>
      </div>
      <el-divider></el-divider>
      <h3>在线咨询必填项设置</h3>
      <p>说明：本设置为患者在在线咨询时，哪些内容是必填项</p>
      <div class="inner_row">
        <span class="span-label">描述文字</span>
        <el-checkbox v-model="checkObj.consultDescriptionText">必填</el-checkbox>
      </div>
      <div class="inner_row">
        <span class="span-label">描述图片</span>
        <el-checkbox v-model="checkObj.consultDescriptionPhoto">必填</el-checkbox>
      </div>
    </div>

    <!-- <div class="layout_inner" v-if="false">
      <el-divider content-position="left">发药设置</el-divider>
      <h3>在线问诊院外发药模式</h3>
      <el-radio-group v-model="checkObj.sendDrugType">
        <el-radio :label="0">先付费</el-radio>
        <el-radio :label="1">货到付款</el-radio>
      </el-radio-group>
      <h3>快递发药是否需要验证码验证身份</h3>
      <el-radio-group v-model="checkObj.confirmType">
        <el-radio :label="0">不需要</el-radio>
        <el-radio :label="1">需要</el-radio>
      </el-radio-group>
      <el-row>
        <el-col :span="24">
          快递核销工具网址
          <el-input class="exress-adress" v-model="checkObj.exressAdress" disabled></el-input>
          <el-button v-clipboard:copy="checkObj.exressAdress" v-clipboard:success="onCopy" v-clipboard:error="onError">复制网址</el-button>
        </el-col>
      </el-row>
      <h3>退药地址管理</h3>
      <div class="layout_inner p20_30_20_40">
        <div class="tips">退药地址在同意患者退药申请时自动发送给患者</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="medium">
          <el-form-item label="输入退药地址" prop="address">
            <el-input type="textarea" v-model="form.address" minlength="2" maxlength="70" show-word-limit placeholder="退药地址在同意患者退药申请时自动发送给患者"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div> -->
    <div class="layout_inner">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/business/index'
import {requestIh} from '@/util/req'
import urlMap from '@/titancare/utils/urls'
// import {debounce} from '@/titancare/utils/common'

export default {
  data () {
    return {
      checkObj: {
        descriptionText: false,
        descriptionPhoto: false,
        arrange: false,
        // confirmType: 0, // 院外发药设置
        // sendDrugType: 0 // 发药验证配置
      },
      allowGoods: false, // 允许医生推荐商品
      // form: {
      //   address: '',
      // },
      // rules: {
      //   address: [
      //     { required: true, message: '请输入退货地址', trigger: 'change' }
      //   ],
      // }
    }
  },
  created () {
    this.getInfo()
    this.getGoodsAllow()
    // this.getReturnAMedicineAddress()
  },
  methods: {
    // saveAddress: debounce(function () {
    //   this.$refs['form'].validate((valid) => {
    //     if (valid) {
    //       api.saveReturnAMedicineAddress({ address: this.form.address })
    //     }
    //   })
    // }),
    // getReturnAMedicineAddress () {
    //   api.getReturnAMedicineAddress().then(rs => {
    //     if (rs && rs.data) {
    //       this.form.address = rs.data.address
    //     }
    //   })
    // },
    getGoodsAllow () {
      requestIh(urlMap.config.getGoodsAllow, {}, 'get').then(rs => {
        this.allowGoods = rs.data
      })
    },
    // allowGoodsChange () {
    //   requestIh(urlMap.config.createOrUpdateGoodsAllow, { open: this.allowGoods }).then(rs => {
    //     if (rs.errCode === 0) {
    //       this.$message({
    //         message: '保存成功',
    //         type: 'success'
    //       })
    //     }
    //   })
    // },
    // onCopy () {
    //   this.$message({
    //     message: '复制成功',
    //     type: 'success'
    //   })
    // },
    // onError () {
    //   this.$message.error('复制失败')
    // },
    getInfo () {
      api.getServiceItemConfig().then(res => {
        if (!res.errCode) {
          this.checkObj = {
            // confirmType: res.data.confirmType || 0,
            // sendDrugType: res.data.sendDrugType || 0,
            descriptionPhoto: res.data.descriptionPhoto,
            descriptionText: res.data.descriptionText,
            consultDescriptionPhoto: res.data.consultDescriptionPhoto,
            consultDescriptionText: res.data.consultDescriptionText,
            // exressAdress: this.$ever.host + '/web/static/vcode.html',
            arrange: res.data.arrange,
            consultIsArrange: res.data.consultIsArrange,
            itemShopOpen: res.data.itemShopOpen,
            consultShopOpen: res.data.consultShopOpen,
          }
        }
      })
    },
    // 保存
    save () {
      let params = { ...this.checkObj }
      if ((params.descriptionText || params.descriptionPhoto) && (params.consultDescriptionText || params.consultDescriptionPhoto)) {
        api.createOrUpdateServiceItemConfig(params).then(rs => {
          if (!rs.errCode) {
            this.$messageTips(this, 'success', '保存成功')
          }
        })
        // this.saveAddress()
        return true
      } else {
        this.$messageTips(this, 'warning', '描述文字或者图片至少选择一个')
        return false
      }
    },
    toArrangeOnline () {
      // 跳转到在线咨询排班界面
      window.open(this.$ever.managesIndex + '/manages/operatingmain/online', '_blank')
    },
    toArrangeDiagnosis () {
      // 跳转到图文问诊排班界面
      window.open(this.$ever.managesIndex + '/manages/operatingmain/imgtext', '_blank')
    },
    toSetting () {
      // 去设置之前，强制保存
      this.$confirm('在离开之前想保存已设置的数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const valid = this.save()
        if (valid) {
          this.$router.push({ name: 'teletext1' })
        }
      }).catch(() => {
        // 设置
        this.$router.push({ name: 'teletext1' })
      })
    },
  }
}
</script>
<style scoped>
  .exress-adress {
    width: 500px;
    margin: 0 20px;
  }
  .tips{
    padding: 20px 0 10px 120px;
    color: #999;
    font-size: 14px
  }
  .inner_row{
    margin-bottom: 20px;
  }
</style>
