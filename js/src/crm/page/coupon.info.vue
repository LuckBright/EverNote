<template>
  <div id="insuranceinfo">
    <el-row class="title">
      <el-col :span="22"><span class="name">优惠券</span></el-col>
      <el-col v-if="!isEdit" :span="2" align="right"><el-button type="text" @click="toEdit"><i class="el-icon-edit"></i> 编辑</el-button></el-col>
    </el-row>
    <el-form v-if="isEdit">
      <el-row v-for='(temp, index) in obj.coupon' :key='index' :index='index'>
        <el-col :span="1" style="text-align:center;"><div style="margin-top:10px;">优惠券</div></el-col>
        <el-col :span="3">
          <el-form-item :prop="'coupon.' + index + '.type'"
            :rules="[{required: false, message: '优惠券', trigger: 'blur'}]">
              <el-select v-model="temp.type" placeholder="请选择">
                <el-option
                  v-for="item in tempType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input :prop="'coupon.' + index + '.numbers'" v-model.trim="temp.no" placeholder="数量" class="wid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item style="margin-left:10px;">
            <el-button type="text" v-if='index == 0' @click="addrow"><i class="iconfont icon-tianjia"></i></el-button>
            <el-button type="text" v-if='index > 0' @click="delrow(index)"><i class="iconfont icon-delete"></i></el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col class="mgt10">
        <el-button type="primary">确定</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-col>
    </el-form>
    <el-row v-else class="table">
      <div v-if="giftCardArr.length === 0" class="noCnt">暂无优惠券</div>
      <ul v-else class="giftbatches">
        <li v-for="(item, index) in giftCardArr" :key="index" class="giftbatch normal">
          <div class="c" @click="linkDetail(item.id)">
            <div class="num">
              <span class="icon">￥</span>
              <span class="money">{{item.giftBatch.money}}</span>
            </div>
            <div class="fnt">
              <p class="name">{{item.giftBatch.name}}</p>
              <p class="desc">满{{item.giftBatch.threshold}}元可用</p>
            </div>
            <div class="time">
              <span class="time">{{item.giftBatch.useStartTime | formatDateByExp('YYYY/MM/DD')}}</span>-<span>{{item.giftBatch.useEndTime | formatDateByExp('YYYY/MM/DD')}}</span>
            </div>
          </div>
        </li>
      </ul>
    </el-row>
  </div>
</template>
<script>
  import api from '@/workspace/store/useraccountapi'
  export default {
    data () {
      let obj = {
        coupon: [
          {
            type: '',
            no: ''
          }
        ]
      }
      return {
        api,
        obj,
        isEdit: false,
        patientId: this.$route.params.patientId,
        giftCardArr: [],
        tempType: []
      }
    },
    methods: {
      linkDetail (id) {
        window.location.href = window.origin + this.$ever.crmIndex + '/crm/couponsdetail?id=' + id
      },
      toEdit () {
        this.isEdit = true
      },
      cancle () {
        this.isEdit = false
      },
      addrow () {},
      delrow () {}
    },
    created () {
      api.getGiftCard(this.patientId).then(result => {
        if (result && result.data && result.data.resultList) {
          let tmp = result.data.resultList.filter(function (obj) {
            if (Number(obj.status) === 1) {
              return obj
            }
          })
          this.giftCardArr = tmp
        }
      })
    }
  }
</script>
<style scoped>
  .noCnt{height: 200px;font-size: 20px}
  #insuranceinfo .title{margin-bottom: 5px;}
  #insuranceinfo .title .el-col{padding: 0 10px;}
  #insuranceinfo .title span.name{display: inline-block;height: 16px;line-height: 16px;border-left:2px solid #1C7BEF;padding-left: 10px;}
  #insuranceinfo .title .el-button{padding: 0;}
  #insuranceinfo .table{font-size: 14px;color: #151515;margin-bottom: 20px;}
  #insuranceinfo .table .th{padding-left: 20px;}
  #insuranceinfo .table .th span{color: #999999;}
  .table{padding:10px 10px 10px 20px;}
  /* 优惠券 */
  .giftbatches{margin: 0;padding:0;}
  .giftbatches li{margin:0 35px 35px 0;padding:0; list-style: none; }
  .giftbatch{background: url('../../assets/img/giftbatch2.png') right 0 no-repeat; width:219px;height:140px;float: left; }
  .giftbatch .num{padding: 10px 10px 0; height:60px; overflow: hidden; text-align: center}
  .giftbatch .icon{border-radius: 50%;background: #009E8E;width: 20px;height: 20px; line-height: 20px;display: inline-block;color: #fff;vertical-align: top;margin-top: 23px;font-size: 16px}
  .giftbatch .money{font-size: 60px;height: 60px;line-height: 60px;color:#151515;}
  .giftbatch .fnt{padding: 0 10px;height: 26px;margin-bottom: 15px}
  .giftbatch .fnt p{margin: 0;padding: 0;width:6em; height: 26px;line-height: 26px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;display:inline-block; text-align: center; }
  .giftbatch .time{color:#fff;text-align: center}
  .giftbatch.type1{ background:url('../../assets/img/giftbatch1.png') right 0 no-repeat;}
  .giftbatch.used{ background:url('../../assets/img/giftbatch3.png') right 0 no-repeat;}
  .giftbatch.type1 .icon{background: #BF9653}
  .giftbatch.used .icon{background: #ccc}
  .giftbatch.used .money{color: #ccc}
</style>
