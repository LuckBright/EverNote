<template>
  <div >
    <el-row>
      <el-col :span="22"><span class="name">患者身份</span></el-col>
      <el-col v-if="!isEdit" :span="2" align="right"><el-button type="text" @click="toEdit" v-if="$hasPermission('Auth_menu_crm_benefit_btn')"><i class="el-icon-edit"></i> 编辑</el-button></el-col>
    </el-row>
    <el-row v-if="!isEdit">
      <el-col v-if="!benfitData">暂无身份信息</el-col>
      <el-col v-else>
        <el-row v-if="$hasPermission('Auth_menu_crm_benefit_btn')">
          <el-tag v-for="(item, index) in benfitData" :key="index" class="mgl10" closable @close="removeTag(item)">{{item.benefit && item.benefit.name}}</el-tag>
        </el-row>
        <el-row v-else>
          <el-tag v-for="(item, index) in benfitData" :key="index" class="mgl10" @close="removeTag(item)">{{item.benefit && item.benefit.name}}</el-tag>
        </el-row>
      </el-col>
      <!-- <el-row>
        <div class="line"></div>
      </el-row> -->
      <el-col>
        <div class="line"></div>
        <el-row class="mgt10">
          <el-col :span="22"><span class="name">操作记录</span></el-col>
          <el-col>
            <ever-table
              :columns="columns"
              :data="tableData"
              table-class=" no-border"
              @eventChange="eventChange"
              :is-record-url-params="false"
              :show-header="false"
              :noBorder="true"
            >
              <template slot="opCol">
                <el-table-column label="">
                  <template slot-scope="scope">
                    <span style="width: 160px;" class="mr5 inline-block">{{scope.row.createTime || ''}}</span>
                    <span style="width: 100px;" class="mr5 inline-block">{{scope.row.creatorName || ''}}</span>
                    <span>{{scope.row.type == 1 ? '添加身份' : '删除身份'}}{{` “${scope.row.benefitName}”` || ''}}</span>
                  </template>
                </el-table-column>
              </template>
            </ever-table>
            <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current"></ever-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-else class="mgt10">
      <el-col>
        <span>患者身份</span>
        <el-select v-model="benefit" placeholder="请选择" multiple>
          <el-option
            v-for="item in benefitOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="mgt10">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from '../store/memberapi'
  import list from '@/util/list'
  export default {
    mixins: [list],
    data () {
      return {
        api,
        queryObj: {
          patientId: this.$route.params.patientId
        },
        listApiName: 'getSearchLogs',
        patientId: this.$route.params.patientId,
        benfitData: [],
        benefit: [], // 会员身份
        benefitOptions: [],
        isEdit: false,
        columns: [
          {
            slotName: 'opCol'
          }
        ]
      }
    },
    created () {
      this.getBenefit()
    },
    watch: {
    },
    methods: {
      eventChange ({btnType, col, row}) {
        console.log(btnType, col, row)
      },
      getBenefit () {
        this.benefit = []
        api.getBenefit({'patientId': this.patientId}).then(rs => {
          if (rs.head.errCode === 0) {
            this.benfitData = rs.data
          }
        })
      },
      getAvailable () {
        api.getAvailable().then(rs => {
          if (rs.head.errCode === 0) {
            this.benefitOptions = rs.data
            this.benfitData.forEach(item => {
              this.benefitOptions.forEach((itemO, i) => {
                if (item.benefit && item.benefit.id === itemO.id) this.benefitOptions.splice(i, 1)
              })
            })
          }
        })
      },
      toEdit () {
        this.isEdit = true
        // let temp = this.benfitData && this.benfitData.map(item => {
        //   return item.benefitId
        // })
        // this.benefit = [...temp]
        this.getAvailable()
      },
      cancle () {
        this.isEdit = false
      },
      save () {
        let tempArr = []
        this.benefit.map(item => {
          tempArr.push({'benefitId': item})
        })
        let params = {
          patientBenefits: [...tempArr],
          patientId: this.patientId
        }
        api.batchBenefitBind(params).then(rs => {
          if (rs.head.errCode === 0) {
            this.isEdit = false
            this.getBenefit()
            this.list()
          }
        })
      },
      removeTag (val) {
        this.$confirm('是否需要删除患者身份?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          api.unbindPatient(val.id).then(rs => {
            if (rs.head.errCode === 0) {
              this.isEdit = false
              this.$messageTips(this, 'success', '删除患者身份成功')
              this.getBenefit()
              this.list()
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .name{display: inline-block;height: 16px;line-height: 16px;border-left:2px solid #1C7BEF;padding-left: 10px;}
  .mgl10{margin-left:10px;}
  .line{margin-top:20px;border:0.5px solid #ddd;}
  .mgt10{margin-top:10px;}
</style>
