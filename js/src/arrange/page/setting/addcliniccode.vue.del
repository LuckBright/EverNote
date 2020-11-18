<template>
    <el-popover
    class="clinicCode"
    v-model="visible"
    placement="left"
    width="270"
    @show="visible=true"
    trigger="click">
    <div class="title">
      <label>设置诊室规则</label>
      <i class="el-icon-close" @click="visible=false"></i>
    </div>
    <el-form :model="params" label-position="right">
      <el-form-item label="">
        <span class="cGray">房间名称:</span> {{roomObj.resourceName || '--'}}
      </el-form-item>
      <el-form-item label="">
        <span class="cGray">房间用途:</span> {{roomObj.useName || '--'}}
       </el-form-item>
       <el-form-item label="">
         <el-row>
           <el-col :span="6">房间编码</el-col>
           <el-col :span="18">
            <el-input v-model.trim="params.roomCode"></el-input>
           </el-col>
         </el-row>
       </el-form-item>
       <el-form-item label="">
         <el-row>
           <el-col :span="6">分诊方式</el-col>
           <el-col :span="18">
            <el-select v-model="params.triageType" placeholder="请选择分诊方式">
              <el-option v-for="(item, i) in triageOption" :key="i" :value="item.id" :label="item.name"></el-option>
            </el-select>
           </el-col>
         </el-row>
       </el-form-item>
       <!-- <el-form-item label="分诊规则">
          <el-select v-model="selectOrgan" placeholder="请选择分诊规则" value-key="organId">
            <el-option v-for="item in template.templetOrgList" :key="item.organId" :value="item" :label="item.organName"></el-option>
          </el-select>
       </el-form-item> -->
       <el-form-item>
       </el-form-item>
    </el-form>
    <div class="footer tright">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="visible=false">取消</el-button>
    </div>
    <el-button type="text" slot="reference" size="small"><span class="fz14">编辑</span></el-button>
  </el-popover>
</template>
<script>
import api from '@/arrange/store/roomrulesapi'
import tempapi from '@/arrange/store/templateapi'
import workapi from '@/arrange/store/workapi'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
export default {
  props: {
    'resourceId': {
      type: String,
      default: ''
    },
    'roomObj': {
      type: Object,
      default: () => { }
    }
  },
  // props: ['resourceId'],
  data () {
    return {
      api,
      tempapi,
      workapi,
      triageOption: [
        {id: 0, name: '无分诊'},
        {id: 1, name: '人工分诊'}
      ],
      visible: false,
      arrangeResource: [],
      selectDept: '',
      tableData: [],
      params: {
        triageType: '',
        roomCode: '',
        resourceId: ''
      }
    }
  },
  watch: {
    'visible' (val) {
      if (!val) {
        this.params.triageType = ''
        this.params.roomCode = ''
      } else {
        this.params.roomCode = this.roomObj.roomCode
        this.params.triageType = this.roomObj.triageType
      }
    },
    'roomObj': {
      handler (val) {
        if (val) {
          if (val.roomCode) {
            this.params.roomCode = val.roomCode
          }
          if (val.triageType) {
            this.params.triageType = val.triageType
          }
        }
      },
      deep: true
    }
  },
  created () {
  },
  methods: {
    save () {
      if (this.resourceId) {
        this.params.resourceId = this.resourceId
        if (this.params.triageType || this.params.roomCode || this.params.triageType === 0) {
          this.updateTriageConfig(this.params)
        }
      }
    },
    updateTriageConfig (params) {
      this.api.updateTriageConfig(params).then(rs => {
        if (rs && rs.head.errCode === 0) {
          this.visible = false
          this.$messageTips(this, 'success', '更新成功')
          this.$emit('reload')
        }
      })
    }
  },
  components: {
    deptCascader
  }
}
</script>
<style scoped>
.tright{text-align:center;}
.footer{border-top: 1px solid #ccc;padding-top: 10px;}
.el-table{max-height: 300px;overflow-y: auto;}
.title {font-size: 18px; font-weight: bold; margin-bottom: 20px;position: relative;}
.title .el-icon-close{position: absolute; right: 0; top: 0; font-size: 20px; cursor: pointer;}
.el-input .el-input__inner{height:32px;line-height: 32px;}
.el-form .el-form-item .el-form-item__content{height: 30px!important;line-height: 30px!important;}
.cGray{color: #666666;}
.el-select{width:100%;}
.fz14{font-size:14px;}
</style>
