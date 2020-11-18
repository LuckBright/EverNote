<template>
    <div id="sourceDepart">
        <el-form :model="temp" :rules="rules" class="temp" ref="temp">
            <el-row :class="num === lgth-1?'nomargin':''" :gutter="10">
                <el-col :span="2">
                    <el-form-item prop="scene" :rules="{required: true, message: '必填项', trigger: 'blur'}">
                        <el-select v-model="temp.scene" clearable placeholder="请选择" @change="change(temp.scene)">
                          <el-option
                            v-for="item in typeArr"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                          </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item prop="sourceName" :rules="{required: true, message: '必填项', trigger: 'blur', type:'object'}">
                       <el-select v-model="temp.sourceName" clearable placeholder="请选择" value-key="deptId">
                          <el-option
                            v-for="item in sourceArr"
                            :key="item.deptId"
                            :label="item.deptName"
                            :value="item">
                          </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- 葛东说这两个字段去掉，要是再说加回来，就杀他祭天 -->
                <!-- <el-col :span="4">
                    <span>服务时长</span>
                    <el-input-number class="numIpt" v-model="temp.serviceTimeSlice" placeholder="服务时长" :controls="false"  onkeypress="return (event.keyCode=46 ||(event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))" :min="null"></el-input-number>
                </el-col>
                <el-col :span="4">
                  <span>服务数量</span>
                  <el-input-number class="numIpt" v-model="temp.sliceVolume" placeholder="服务数量" :controls="false"  onkeypress="return ((event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))" :min="null"></el-input-number>
                </el-col> -->
                <el-col :span="4">
                   <el-button type="text" @click="delrow(num)"><i class="iconfont icon-delete"></i></el-button>
                   <el-button type="text" @click="addrow" v-if="num === lgth-1"><i class="iconfont icon-tianjia"></i></el-button>
                </el-col>
              </el-row>
        </el-form>
    </div>
</template>
<script>
import sourcedetail from '@/arrange/store/sourcedetailapi'
export default {
  props: ['temp', 'num', 'lgth'],
  data () {
    return {
      sourcedetail,
      typeArr: [ {id: '1', label: '门诊'}, {id: '2', label: '住院'} ],
      sourceArr: [],
      rules: {
        scene: [
                { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    delrow () {
      this.$emit('delrow', this.num)
    },
    addrow () {
      this.$emit('addrow')
    },
    change (val) {
      // this.temp.sourceName = ''
    }
  },
  watch: {
    'temp.scene': {
      handler (val) {
        if (val) {
          if (val === 1) {
            this.sourcedetail.getDeptList({deptTypes: ['1']}).then(rs => {
              if (rs && rs.data) {
                this.sourceArr = rs.data
              }
            })
          } else {
            this.sourcedetail.getDeptList({deptTypes: ['1', '2']}).then(rs => {
              if (rs && rs.data) {
                this.sourceArr = rs.data
              }
            })
          }
        } else {
          this.temp.sourceArr = []
          this.temp.sourceName = ''
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style scoped>
#sourceDepart .el-row{margin-bottom:16px;}
#sourceDepart .el-row.nomargin{margin-bottom:0px;}
/* #sourceDepart .el-row:last-child{margin-bottom:0px;} */
</style>
