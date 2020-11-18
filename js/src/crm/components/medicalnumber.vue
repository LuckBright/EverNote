<template>
  <el-form class="medical">
    <el-row>
      <el-col :span="24">
          <el-col :span="12">
            <div style="display: flex;flex-direction:row;" v-for='(temp, index) in obj.visitNos' :key='index' :index='index'>
              <el-form-item>
                  <el-select v-if="showfirst" v-model="temp.id" placeholder="请选择">
                    <el-option
                      v-for="item in tempType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-else v-model="temp.type" placeholder="请选择">
                    <el-option
                      v-for="item in tempType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-input  v-model.trim="temp.no" placeholder="就诊卡" class="wid"></el-input>
                  <el-select v-model="temp.status" placeholder="请选择就诊卡状态">
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item style="margin-left:10px;">
                <el-button type="text" v-if='index == 0' @click="addrow"><i class="iconfont icon-tianjia"></i></el-button>
                <el-button type="text" v-if='index > 0' @click="delrow(index)"><i class="iconfont icon-delete"></i></el-button>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <el-popover
              placement="right"
              width="260"
              v-model="isVisible"
              trigger="click"
              class="custRecordPop">
              <el-row>
                <div v-for="(pitem, pindex) in manageTypeData" :key="pindex" style="height:50px;line-height:50px;">
                  <el-col :span="19">
                    <el-input v-model="pitem.name" placeholder="请输入卡类型"></el-input>
                  </el-col>
                  <el-col :span="3" align="center">
                    <span class="deleteType"><i class="iconfont icon-delete" @click="deleteType(pitem, pindex)"></i></span>
                  </el-col>
                  <el-col :span="2" align="center">
                    <span class="addType"><i v-if='pindex == 0' class="iconfont icon-tianjia" @click="addType(pitem, pindex)"></i></span>
                  </el-col>
                </div>
                <el-col :span="24" align="right" style="height:50px;line-height:50px;text-align:left;">
                  <el-button type="primary" @click="saveManagType">确定</el-button>
                </el-col>
              </el-row>
              <el-button slot="reference" @click="showMedical">管理</el-button>
            </el-popover>
          </el-col>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import api from '@/crm/store/memberapi'
  export default {
    props: ['value', 'showfirst'],
    data () {
      let obj = {
        visitNos: [
          {
            type: '',
            no: ''
          }
        ]
      }
      return {
        api,
        index: 0,
        tempType: [],
        obj,
        isVisible: false,
        manageTypeData: [],
        statusOptions: [
          {
            value: 1,
            label: '有效'
          },
          {
            value: 2,
            label: '无效'
          }
        ]
      }
    },
    watch: {
      visitNos: {
        handler (newVal) {
          this.$emit('input', newVal)
        },
        deep: true
      },
      value: {
        handler (val) {
          if (val && val.length > 0) {
            this.obj.visitNos = val
          } else {
            this.$emit('input', this.obj.visitNos)
          }
        },
        immediate: true
      }
    },
    created () {
      this.getCardType()
    },
    methods: {
      addrow () {
        if (this.obj.visitNos.length < 5) {
          this.obj.visitNos.push({
            type: '',
            no: ''
          })
        } else {
          this.$notify({
            type: 'warning',
            message: '最多添加5张卡'
          })
        }
      },
      delrow (index) {
        this.obj.visitNos.splice(index, 1)
      },
      showMedical () {
        this.manageTypeData = []
        if (this.tempType.length) {
          this.manageTypeData = JSON.parse(JSON.stringify(this.tempType))
        } else {
          this.manageTypeData.push({name: ''})
        }
      },
      saveManagType () {
        this.isVisible = false
        let params = this.manageTypeData.filter(item => {
          return item.name
        })
        api.createCardType(params).then(rs => {
          if (rs && rs.data.length > 0) {
            this.tempType = rs.data
          }
        })
      },
      deleteType (item, index) {
        if (this.manageTypeData.length) {
          if (!item.id) {
            this.manageTypeData.splice(index, 1)
            return false
          }
        } else {
          if (!item.id) {
            this.manageTypeData = [{name: ''}]
            return false
          }
        }
        this.$confirm('是否删除此条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteCategory({id: item.id}).then(rs => {
            if (rs && rs.head && rs.head.errCode === 0) {
              if (this.manageTypeData.length) {
                this.manageTypeData.splice(index, 1)
              } else {
                this.manageTypeData = [{name: ''}]
              }
              this.tempType = this.manageTypeData.filter(item => {
                return item.id
              })
            }
            this.isVisible = true
          })
        }).catch((e) => {
          this.isVisible = true
        })
      },
      addType (item, index) {
        this.manageTypeData.push({name: ''})
      },
      getCardType () {
        api.getCardType().then(rs => {
          if (rs.head.errCode === 0 && rs.data.length) {
            this.tempType = rs.data
            if (this.showfirst && this.obj.visitNos[0] !== undefined) {
              this.obj.visitNos[0] = rs.data[0]
              this.obj.visitNos[0].status = 1
            }
          }
        })
      }
    }
  }
</script>
<style scoped>
  .wid{width:215px;}
  .medical .el-form-item__content{width:500px;}
</style>
