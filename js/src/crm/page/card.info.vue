<template>
  <div id="insuranceinfo">
    <el-row class="title">
      <el-col :span="22"><span class="name">就诊卡</span></el-col>
      <el-col v-if="!isEdit" :span="2" align="right"><el-button type="text" @click="toEdit"><i class="el-icon-edit"></i> 编辑</el-button></el-col>
    </el-row>
    <el-row v-if="!isEdit" class="table">
      <el-col v-if="userCardArr && userCardArr.length == 0" class="noCnt">暂无就诊卡</el-col>
      <el-col v-else :span="3"  v-for="(item, index) in userCardArr" :key="index" style="margin-right: 20px">
        <div :class="{'colgray': item.status == 2}" class="goldCard">
          <div class="fontType overtext" style="padding-top:40px;" :title="item.typeName">
            {{item.typeName || '--'}}
          </div>
          <div class="fontType overtext" style="padding-top:20px;" :title="item.no">No.{{item.no}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row v-else class="mgt15">
      <el-col :span="1" style="text-align:center;"><div style="margin-top:10px;">选择卡片</div></el-col>
      <el-col :span="22">
        <medical-number v-model="visitNos" :showfirst="showfirst"></medical-number>
        <el-button type="primary" @click="append">确定</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from '@/crm/store/memberapi'
  import medicalNumber from '../components/medicalnumber'
  export default {
    data () {
      return {
        api,
        objId: this.$route.params.patientId ? this.$route.params.patientId : 1,
        userCardArr: [],
        visitNos: [],
        isEdit: false,
        showfirst: false
      }
    },
    created () {
      this.getUserCard()
    },
    methods: {
      getUserCard () {
        api.getUserCard({'patientId': this.objId}).then(rs => {
          if (rs.head.errCode === 0) {
            if (!rs.data) {
              this.showfirst = true
            } else {
              this.showfirst = false
              this.userCardArr = rs.data
              this.visitNos = rs.data
            }
          }
        })
      },
      toEdit () {
        this.isEdit = true
        this.getUserCard()
      },
      cancle () {
        this.isEdit = false
        this.getUserCard()
      },
      append () {
        this.visitNos && this.visitNos.map(rs => {
          if (this.showfirst) {
            rs.type = rs.id
          } else {
            rs.type = rs.type
          }
        })
        api.appendCard({'id': this.objId, 'visitCards': this.visitNos}).then(rs => {
          if (rs.head.errCode === 0) {
            this.getUserCard()
            this.isEdit = false
          }
        })
      }
    },
    components: {
      medicalNumber
    }
  }
</script>
<style scoped>
  .noCnt{height: 200px;font-size: 20px}
  .goldCard{height:100px;width:178px;background-image: linear-gradient(-135deg, #231815 0%, #433727 100%);border-radius: 8px;}
  .colgray{background-image: linear-gradient(-135deg, #999 0%, #999 100%)}
  .mgt15{margin-top:15px;}
  .fontType{font-size: 16px;color: #E3DAC7;letter-spacing: 3px;text-align:center;}
</style>
