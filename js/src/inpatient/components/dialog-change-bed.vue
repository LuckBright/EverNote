<template>
  <el-dialog
  :visible.sync="flag"
  id='change_bed'
  width="1000px">
    <span slot="title">
      <strong>换床</strong>
    </span>
    <div class="chang_mean">
      <div class="chang_self">
        <span class="bad_num">{{oneObj.bedMsg && oneObj.bedMsg.bedNum}}</span>
        {{oneObj.patientName}}<span class="span" v-if='oneObj.patient'>{{oneObj.patient && oneObj.patient.sex | formatSex}} {{oneObj.patient.age}}岁</span>
        </div>
      <div class="icon_change"><i class="iconfont icon-change" style='color: #409EFF;'></i></div>
      <div class="chang_target">
        <div class="empty" v-if='!twoObj.hospitalizedBedId'>请选择床位</div>
        <div class="check" v-else>
          <span class="bad_num">{{twoObj.bedMsg && twoObj.bedMsg.bedNum}}</span>
          <span style='maxWidth: 170px;display: inlineBlock;verticalAlign: middle;' class="ellipsis">{{twoObj.patientName}}</span>
          <span class="span" v-if='twoObj.patient'>
            {{twoObj.patient && twoObj.patient.sex | formatSex}} {{twoObj.patient && twoObj.patient.age }}岁</span>
          <span class="span" v-else>--</span>
        </div>
      </div>
    </div>
    <div class="search">
      <el-row>
        <el-select v-model="areaId" placeholder="请选择病区">
          <el-option
            v-for="item in areaOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input class='input' v-model='bed_num' placeholder="请输入床号"></el-input>
        <el-button  icon="el-icon-search" type="primety" @click='getList'>查询</el-button>
      </el-row>
    </div>
    <div class="box">
      <ul class="clearfix">
        <li v-for='item in result' :key='item.hospitalizedBedId' @click='select(item)' :class="item.hospitalizedBedId === twoObj.hospitalizedBedId ? 'active' : ''">
          <span class="no">{{item.bedMsg && item.bedMsg.bedNum}}</span>
          <span class="img" v-if='item.patientName'><b>{{item.patientName}}</b> {{item.patient && item.patient.sex | formatSex}}</span>
          <span class="img" v-else><img src="../../assets/img/emptyBed.png" alt=""/></span>
        </li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="close">取消</el-button>
      <el-button type="primary" plain  v-ever-click-once="disabled" :disabled="disabled" @click='changeBed'>保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import api from '../store/bedapi'
  import resident from '@/inpatient/store/resident.js'
  import storage from '@/util/storage.js'
  export default {
    props: ['visible', 'userinfo', 'indepartObj'],
    data () {
      return {
        flag: false,
        disabled: false,
        bed_num: '',
        oneObj: {},
        twoObj: {},
        result: [],
        areaId: storage.getSessionStorage('spaceId'),
        areaOptions: []
      }
    },
    mounted () {
      this.$bus.$off('dialog:changeBed')
      this.$bus.$on('dialog:changeBed', val => {
        this.opens(val)
        this.getarea()
        this.twoObj = {}
      })
    },
    methods: {
      async opens (val) {
        this.flag = true
        this.result = []
        this.oneObj = val
        this.getList()
      },
      close () {
        this.flag = false
      },
      select (item) {
        this.twoObj = item
        this.bed_num = ''
      },
      async getarea () {
        let res = await resident.getSpaceRecordVoListForService({
          relationType: 300,
          relationId: this.oneObj.providerId
        })
        this.areaOptions = res.data
      },
      async getList () {
        this.result = []
        let obj = {
          offset: 0, //
          pagesize: 9999, // 后期优化
          // bedScope: 'occupyBeds',
          bedNumber: this.bed_num,
          bedScope: 'allBeds',  // String 否 allBeds 全部 emptyBeds 空床（默认） occupyBeds  占床
          areaId: this.areaId // String 必填 病区id(待定)
        }
        if (obj.areaId) {
          let result = await resident.getBedListByCondition(obj)
          let arr = []
          if (result && result.data) {
            result.data.forEach(element => {
              if (!element.patientId || element.patientId !== this.oneObj.patientId && this.oneObj.providerId === element.providerId) {
                element.hospitalizedAreaId = this.areaId
                this.areaOptions.forEach(val => {
                  if (val.id === this.areaId) element.hospitalizedAreaName = val.name
                })
                arr.push(element)
              }
            })
            this.result = arr
          }
        }
      },
      async changeBed () {
        this.obj = JSON.parse(JSON.stringify(this.oneObj))
        this.oneObj.hospitalizedAreaId = this.twoObj.hospitalizedAreaId
        this.oneObj.hospitalizedAreaName = this.twoObj.hospitalizedAreaName
        this.oneObj.hospitalizedWardId = this.twoObj.hospitalizedWardId
        this.oneObj.hospitalizedWardName = this.twoObj.hospitalizedWardName
        this.oneObj.hospitalizedBedId = this.twoObj.hospitalizedBedId
        this.oneObj.hospitalizedBedName = this.twoObj.bedMsg.bedNum
        this.oneObj.bedMsg.bedNum = this.twoObj.bedMsg.bedNum

        this.twoObj.hospitalizedAreaId = this.obj.hospitalizedAreaId
        this.twoObj.hospitalizedAreaName = this.obj.hospitalizedAreaName
        this.twoObj.hospitalizedWardId = this.obj.hospitalizedWardId
        this.twoObj.hospitalizedWardName = this.obj.hospitalizedWardName
        this.twoObj.hospitalizedBedId = this.obj.hospitalizedBedId
        this.twoObj.hospitalizedBedName = this.obj.bedMsg.bedNum
        this.twoObj.bedMsg.bedNum = this.obj.bedMsg.bedNum
        let arr = []
        arr.push(this.oneObj)
        if (this.twoObj.patientId) {
          arr.push(this.twoObj)
        }
        let result = await resident.changeBed({
          entranceList: arr
        })
        if (result.head.errCode === 0) {
          this.$notify({
            title: '成功',
            type: 'success',
            message: '换床成功'
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
    watch: {
      'areaId': {
        handler (val) {
          this.getList()
        },
        immediate: true
      }
    }
  }
</script>
<style lang='scss'>
  #change_bed {
    .el-dialog__body{
      padding-top:0;
      padding-bottom:0;
      overflow-y: scroll;
      max-height: 500px;
      .chang_mean{
        width: 940px;
        height: 130px;
        margin:0 auto;
        background: #F8F8F8;
        border-radius: 2px;
        position: relative;
        .chang_self,.chang_target{
          position: absolute;
          top:50px;
          width: 240px;
          line-height:50px;
          background: #fff;
          font-size: 16px;
          color: #000;
          text-align: center;
          border:1px solid #409EFF;
          border-radius: 4px;
          .span{
            font-size: 14px;
            color: #000;
            margin-left:10px;
          }
          .bad_num{
            position: absolute;
            left:-50%;
            width: 200%;
            font-size: 16px;
            font-weight: 700;
            top:-40px;
            color: #409EFF;
          }
        }
        .chang_self{
          left:100px;
        }
        .chang_target{
          right:100px;
          border:none;
          .empty{
            width: 100%;
            height: 100%;
            background: #F4F4F4;
            border: 1px dashed #DDDDDD;
            border-radius: 4px;
          }
          .check{
            border:1px solid #409EFF;
            border-radius: 4px;
          }
        }
        .icon_change{
          position: absolute;
          top:65px;
          left:calc(50% - 28px);
          width: 56px;
          line-height:30px;
          background: #fff;

          text-align: center;
        }
      }
      .search{
        margin: 10px;
        .input{
          width: 180px;
        }
      }
      .box{
        width: 960px;
        margin:0 auto;
        // &::-webkit-scrollbar{
        //   width: 3px;
        //   height: 100%;
        //    background-color: #ccc;
        // }
        .active{
          border:2px solid #1c7bef; 
        }
        ul{
          padding:0;
          li{
            float: left;
            border: 2px solid #DDDDDD;
            border-radius: 4px;
            width: 83px;
            height: 65px;
            margin:0 10px 10px 0px;
            text-align: center;
            &:nth-child(10n){
              margin-right:0;
            }
            .no{
              display: block;
              line-height: 30px;
              color: #409EFF;
              font-weight: 700;
              font-size: 12px;
              white-space: nowrap;
              	text-overflow:ellipsis;
              overflow: hidden;
              
            }
            .img{
              display: block;
              line-height: 30px;
              height: 30px;
              color: #666;
              overflow: hidden;
              img{
                width: 60px;
              }
            }
          }
        }
      }
    }
  }
</style>

