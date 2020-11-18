<template>
  <div id="saleservicedetail">
    <ever-bread-crumb name="售后单信息" path="/card/saleservice" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <el-row class="pd20">
        <el-col :span="6">售后单号 <span>{{saleObj.sn}}</span></el-col>
        <el-col :span="3">服务类型 <span>退款</span></el-col>
        <el-col :span="4">状态 <sys-value type="THC_MALL_RETURN_ORDER_STATUS" :code="saleObj.status"></sys-value></el-col>

      </el-row>
      <div class="br1">
        <el-row class="goods">
          <el-col :span="6">
            <h4>商品图片</h4>
          </el-col>
          <el-col :span="14">
            <h4>名称</h4>
          </el-col>
          <el-col :span="4">
            <h4>数量</h4>
          </el-col>
        </el-row>
        <el-row class="googsitem">
          <el-col :span="6" v-if="saleObj.product">
            <el-image style="width: 80px; height: 60px;" v-if="saleObj.product.images" :src="`${$ever.fileUrl2}${saleObj.product.images.split('#')[0]}`" :preview-src-list="saleObj.product.images.split('#')"></el-image>
            <el-image style="width: 80px; height: 60px;" v-else src=""></el-image>
          </el-col>
          <el-col :span="14">{{saleObj.productSkuName ? saleObj.productSkuName : '--'}}</el-col>
          <el-col :span="4">{{saleObj.returnAmount}}</el-col>
        </el-row>
      </div>
      <el-row>
        <el-col :span="3" class="line34">申请卡券号码</el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="4" class="c0" v-for="(item, index) in saleObj.goodsInfos" :key="index">
              {{item.sn}}
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="line34">
          申请人
        </el-col>
        <el-col :span="20" class="c0">
          {{seller}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="line34">
          申请时间
        </el-col>
        <el-col :span="20" class="c0">
          {{saleObj.createTime}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" class="line34">
          申请原因
        </el-col>
        <el-col :span="20" class="c0">
          {{saleObj.returnReason}}
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import api from '../store/saleserviceapi'
  import { getStaffSettingInfoByStaffId } from '@/inpatient/components/doctor.state/api'

  export default {
    data () {
      return {
        api: api,
        id: this.$route.params.id,
        saleObj: {},
        seller: ''
      }
    },
    created () {
      this.init()
    },
    methods: {
      async init () {
        const res = await this.getById()
        this.getByCreator(res.creator)
      },
      async getById () {
        const res = await api.getById(this.id)
        if (res.head.errCode === 0) {
          this.saleObj = res.data
        }
        if (!res.data) return null
        return res.data
      },
      getByCreator (id) {
        getStaffSettingInfoByStaffId({idList: [id]}).then(response => {
          if (response && response.length) {
            this.seller = response[0].name
          }
        })
      }
    },
    components: {
    }
  }
</script>
<style scoped>
#saleservicedetail{font-size: 14px;color: #999;}
#saleservicedetail .c0{color: #000;line-height: 34px;}
#saleservicedetail .line34{line-height: 34px;}
#saleservicedetail .br1{border: 1px solid #EEEEEE;width: 60%;margin-bottom: 20px;}
#saleservicedetail .pd20{padding-bottom: 20px}
#saleservicedetail .pd20 span{color: #000;}
#saleservicedetail .goods h4{margin:0;background: #ebedef;line-height: 50px;font-size: 16px;color: #000;font-weight: bold;padding: 0 20px;}
#saleservicedetail .googsitem{padding: 10px 20px;}
#saleservicedetail .googsitem .el-col{line-height: 60px;color: #000;}
#saleservicedetail .googsitem .el-col img{vertical-align: middle;}
</style>
