<template>
  <el-dialog
  :visible.sync="flag"
  class='packed_bed'
  title='包床'
  width="750px">
    <p class="info">
      <span>床位：{{data.hospitalizedAreaName}}-{{data.hospitalizedBedName}}</span>
      <span>患者姓名：{{data.patientName}}</span>
      <span v-if='data.patient'>年龄：{{data.patient.age}}</span>
    </p>
    <div class="pack_bed clearfix">
        <p>包床床位：</p>
        <div class="pack_bed_box" v-if='bed.length'>
          <span  v-for='item in bed'  :key='item.id' v-if='checkList.indexOf(item.hospitalizedBedId) > -1'>{{item.hospitalizedBedName}} <i @click='delbedlist(item.hospitalizedBedId)' class="el-icon-close"></i></span>
        </div>
        <div class="pack_bed_box" v-else style='font-size: 14px;color: #999999;'>暂无床位可包</div>
    </div>
    <div class="pack_bed_list">
      <el-checkbox-group
        v-model="checkList"
        class="clearfix"
        >
        <div v-for='item in bed' :key='item.id' class="li" @click='checkbox(item.hospitalizedBedId)' :class="checkList.indexOf(item.hospitalizedBedId) > -1 ? 'checked' : ''">
          <p class="bed_no">{{item.hospitalizedBedName}}</p>
          <el-checkbox :label='item.hospitalizedBedId'></el-checkbox>
          <img class="bed_img" src="../../assets/img/emptyBed.png" alt=""/>
        </div>
      </el-checkbox-group>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="close">取消</el-button>
      <el-button type="primary" @click='change'  v-ever-click-once="disabled" :disabled="disabled || bed.length === 0">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import api from '../store/bedapi'
  // import storage from '@/util/storage.js'
  export default {
    props: ['visible', 'userinfo', 'indepartObj'],
    data () {
      return {
        flag: false,
        disabled: false,
        bedlist: [],
        bed: [],
        data: {},
        checkList: []
      }
    },
    mounted () {
      this.$bus.$on('dialog:packedBed', this.opens)
    },
    methods: {
      checkbox (id) {
        if (this.checkList.indexOf(id) > -1) {
          this.delbedlist(id)
        } else {
          this.checkList.push(id)
        }
      },
      delbedlist (id) {
        this.checkList.splice(this.checkList.indexOf(id), 1)
      },
      async getList () {
        let res = await api.getBedsByWard({
          hospitalizedNumber: this.data.hospitalizedNumber, // string 是 住
          wardId: this.data.hospitalizedWardId  // 病房id
        })
        this.bed = res.data.empty_beds || []
        res.data.bag_beds = res.data.bag_beds || []
        res.data.bag_beds.forEach(val => {
          this.checkList.push(val.hospitalizedBedId)
        })
      },
      async opens (val) {
        if (!this.data) return
        this.flag = true
        this.data = val
        this.getList()
      },
      close () {
        this.flag = false
      },
      async change () {
        let arr = []
        this.checkList.forEach((val) => {
          this.bed.forEach(item => {
            if (val === item.hospitalizedBedId) {
              arr.push({
                hospitalizedAreaId: this.data.hospitalizedAreaId, // string 是 病区id
                hospitalizedAreaName: this.data.hospitalizedAreaName, //  string 是 病区名称
                hospitalizedWardId: this.data.hospitalizedWardId, //  string 是 病房id
                hospitalizedWardName: this.data.hospitalizedWardName, //  string 是 病房名称
                hospitalizedBedId: item.hospitalizedBedId, //  string 是 病床id
                hospitalizedBedName: item.hospitalizedBedName //  string 是 病床名称
              })
            }
          })
        })
        let result = await api.createOccupyBeds({
          patientId: this.data.patientId, // string 是 患者id
          hospitalizedNumber: this.data.hospitalizedNumber, // string 是 住院号
          bedList: arr
        })
        if (result.head.errCode === 0) {
          this.$notify({
            title: '成功',
            type: 'success',
            message: '包床成功'
          })
          this.flag = false
          this.$emit('success')
        } else {
          this.$notify({
            type: 'warning',
            message: result.head.errMsg
          })
        }
      }
    },
    computed: { },
    watch: { }
  }
</script>
<style lang='scss' scoped>
  .info span{display:inline-block;margin-right: 10px;}
  .packed_bed {
    /deep/ .el-dialog__body{
      padding-top:0;
      padding-bottom:0;
      max-height: 620px;
    overflow-y: scroll;
    }
    .pack_bed{
      // height: 60px;;
      margin-bottom: 15px;
      p{
        float: left;
        line-height: 36px;
        width: 70px;
        margin:0;
      }
      .pack_bed_box{
        min-height: 36px;
        border:1px solid #ddd;
        width: 600px;
        line-height: 36px;
        float: left;
        padding:0 3px;
        span{
          display: inline-block;
          vertical-align: middle;
          background: #ECF5FF;
          font-size: 12px;
          color: #409EFF;
          width: 67px;
          height: 24px;;
          line-height: 24px;
          margin-right: 5px;
          padding: 0 3px;
          i{
            font-size: 10px;
            float: right;
            padding:6px 0px;
            cursor: pointer;
          }
        }
      }
    }
    .pack_bed_list{
      /deep/ .el-checkbox-group{
        width: 600px;
        padding:0;
        margin-left:70px;
        .li{
          float: left;
          border: 1px solid #DDDDDD;
          width: 140px;
          text-align: center;
          height: 80px;
          margin-right: 10px;
          margin-bottom: 10px;
          text-align: center;
          position: relative;
          .bed_img{
             position: absolute;
            top:0;
            left:0;
            bottom:0;
            right:0;
            margin:auto;
            opacity: .6;
          }
          &:nth-child(4n){
            margin-right: 0;
          }
          .bed_no{
            line-height: 28px;
            // background: #ECF5FF;
            color: #1C7BEF;
            padding:0 10px;
            font-size: 14px;
            margin:0;
            text-align: center;
            font-weight: 800;
          }
          label.el-checkbox{
            position: absolute;
            top:0;
            right:0;
            padding:4px;
            margin-right: 0;
            span.el-checkbox__label{
              display: none;
              width: 0px;
            }
          }
        }
        .checked{
          border: 1px solid #1C7BEF;
           .bed_img{
            opacity: 1;
          }
        }
      }
    }
  }
</style>

