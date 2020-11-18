<template>
  <div class="main pay-box">
    <el-page-header
      @back="() => {
        $router.push({ path: '/titanmall/setting/pay/wx' })
      }"
      content="微信收款账户"></el-page-header>
    <div class="region pay-container">
      <div class="box">
        <p>
          <!--          <el-radio v-model="radio" label="1">新增公众号授权</el-radio>-->
          <!--<el-radio v-model="radio" label="2">使用已有公众号授权</el-radio>-->
        </p>
        <div class="input-box" v-if="radio === '1'">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="微信公众号APPID" prop="appId">
              <el-input
                v-model="ruleForm.appId"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="微信公众号昵称" prop="appName">
              <el-input
                v-model="ruleForm.appName"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item label="微信公众号秘钥" prop="appSecrete">
              <el-input
                v-model="ruleForm.appSecrete"
                type="textarea"
                :rows="2"
                style="width: 200px"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button
            size="small"
            type="primary"
            style="margin-left: 150px"
            @click="addBtn"
          >新增
          </el-button
          >
          <el-button
            size="small"
            style="margin-left: 20px"
            @click="$router.go(-1)"
          >取消
          </el-button
          >
        </div>
        <div class="table-box" v-else-if="radio === '2'">
          <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            style="width: 100%"
          >
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-radio v-model="radioId" :label="scope.row.appId">{{
                  ''
                  }}
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column property="nickName" label="微信公众号昵称">
            </el-table-column>
            <el-table-column property="appId" label="微信公众号APPID">
            </el-table-column>
          </el-table>
          <el-button
            size="small"
            type="primary"
            style="margin-left: 270px"
            @click="useBtn"
          >确定
          </el-button
          >
          <el-button
            size="small"
            style="margin-left: 20px"
            @click="$router.go(-1)"
          >取消
          </el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    data () {
      return {
        api,
        radio: '1',
        ruleForm: {
          appId: '',
          appName: '',
          appSecrete: '',
        },
        rules: {
          appId: [
            { required: true, message: '请输入微信公众号APPID', trigger: 'blur' },
          ],
          appName: [
            { required: true, message: '请输入微信公众号昵称', trigger: 'blur' },
          ],
          appSecrete: [
            { required: true, message: '请输入微信公众号秘钥', trigger: 'blur' },
          ],
        },
        tableData: [],
        rowInfo: '',
        radioId: '',
      }
    },
    created () {
      // this.getList();
    },
    methods: {
      // 获取已有公众号数据
      getList () {
        this.api.listAuthPubApp().then(res => {
          if (res) {
            this.tableData = res
          }
        })
      },
      // 新增
      addBtn () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.api.bindWxPublic({ ...this.ruleForm }).then(res => {
              if (res) {
                this.$router.push({ path: '/titanmall/setting/pay/qr' })
              }
            })
          } else {
            return false
          }
        })
      },

      // 使用已授权的
      useBtn () {
        this.api.bindAuthAppId({ appId: this.rowInfo.appId }).then(res => {
          if (res) {
            this.$message({
              message: '授权成功',
              type: 'success',
            })
            this.$router.push({ path: '/titanmall/setting/pay/wx' })
          }
        })
      },
    },
    watch: {
      radioId (n, v) {
        this.rowInfo = this.tableData.filter(item => item.appId === n)[0]
      },
    },
  }
</script>
<style lang="less" scoped>
  .pay-box {
    margin-top: 10px;
  }
  .pay-container {
    .box {
      width: 50%;
      margin: 0 auto;

      p {
        line-height: 40px;
        text-align: center;
      }

      /deep/ .el-form .el-form-item__label {
        width: 150px !important;
      }

      .input-box {
        margin-top: 20px;
        margin-left: 160px;
      }

      .table-box {
        margin-top: 20px;
      }
    }
  }
</style>
