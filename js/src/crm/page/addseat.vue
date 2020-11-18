<template>
  <div id="messagedetail">
    <ever-bread-crumb :name="!id ? '添加座席' : '座席详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card>
      <el-row>
        <el-col :span="24">
          <ever-form-model
            :schema="schema"
            v-model="obj"
            :api="api"
            :rules="rules"
            ref="form"
            label-position="left">
            <template slot="doctorId" slot-scope="scope">
              <div @click="showUserPop">
                <el-input placeholder="请选择客户" v-model="scope.obj.doctorId" :readonly="true">
                </el-input>
              </div>
            </template>
            <template slot="url" slot-scope="scope">
              <a v-if="scope.obj.url" :href="scope.obj.url" class="col-blue" target="_blank">{{scope.obj.url}}</a>
            </template>
            <template slot="empty">
              <div class="seizeseat"></div>
            </template>
            <template slot="empty1">
              <div class="seizeseat"></div>
            </template>
            <el-form-item >
              <el-button type="primary" class="submit-btn" @click="createSeat">保存</el-button>
              <el-button type="" class="cancel-btn" @click="prevBack">取消</el-button>
            </el-form-item>
          </ever-form-model>
          <person-select :initdata="doctorName" title="涉及人员" :visible.sync="userPop" @close="closeUserPop" @select="setQuestionItem" :isradio="true"></person-select>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import api from '../store/seatapi'
  import form from '../../util/form'
  import personSelect from '../page/personselect'
  let schema = [
    {
      name: 'sn',
      span: 8,
      label: '座席ID:',
      max: 4
    },
    {
      span: 16,
      name: 'empty',
      type: 'custom'
    },
    {
      name: 'doctorId',
      type: 'custom',
      span: 8,
      label: '选择员工：'
    },
    {
      name: 'empty1',
      type: 'custom',
      span: 16
    },
    {
      name: 'mobile',
      span: 8,
      label: '转接手机：'
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      obj.typeText = ''
      return {
        schema,
        api,
        obj: obj,
        userPop: false,
        doctorName: '',
        doctorId: '',
        id: this.$route.query.id,
        rules: {
          sn: [
            {required: true, max: 4, message: '座席ID最长可输入4位', trigger: 'change'}
          ],
          doctorId: [
            {required: true, message: '请选择员工', trigger: 'change'}
          ],
          mobile: [
              {required: true, message: '请选择转接手机', trigger: 'blur'},
              { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
              { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码' }
          ]
        }
      }
    },
    created () {
      if (this.id) {
        this.getById()
      }
    },
    methods: {
      prevBack () {
        window.history.go(-1)
      },
      afterSave () {
        this.$router.push({name: 'seat', path: 'seat'})
      },
      showUserPop () {
        this.userPop = true
      },
      closeUserPop () {
        this.userPop = false
      },
      setQuestionItem (users) {
        users.forEach(user => {
          this.doctorName = user.name
          this.doctorId = user.id
        })
        this.obj.doctorId = this.doctorName
        this.userPop = false
      },
      updateUserDia (val) {
        this.userPop = val
      },
      getById () {
        this.api.getById({id: this.id}).then(rs => {
          this.obj.sn = rs.data.sn
          this.obj.doctorId = rs.data.doctorName
          this.doctorId = rs.data.doctorId
          this.obj.mobile = rs.data.mobile
        })
      },
      createSeat () {
        this.api.createOrModify({'sn': this.obj.sn, 'doctorId': this.doctorId, 'id': this.id, 'mobile': this.obj.mobile}).then(rs => {
          if (rs.head.errCode === 0) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            })
            this.afterSave()
          }
        })
      }
    },
    components: {
      personSelect
    }
  }
</script>
<style scoped>
#messagedetail .user-name > * {display: inline-block;margin-right: 10px;cursor: pointer;}
#messagedetail .user-name .iconfont{color: #1C7BEF;}
.seizeseat{height:40px;line-height:40px;}
</style>
