<template>
  <div>
    <ever-bread-crumb name="药师账号详情" is-custom-back @back="topTitleClick"></ever-bread-crumb>
    <div class="layout_inner min-high pos_re edit-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="账号详情" name="first">
          <div class="edit-info">
            <el-form
              ref="form"
              :model="form"
              label-width="120px"
              :rules="rules"
              :inline="true"
            >
              <el-form-item label="登录账号" prop="account">
                <el-input v-model="form.account" :disabled="!!id"></el-input>
              </el-form-item>
              <el-form-item label="登录密码" prop="password">
                <el-input type="password" v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model.trim="form.name"></el-input>
              </el-form-item>
              <el-form-item label="身份证" prop="idCardNum">
                <el-input v-model="form.idCardNum"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="公司邮箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
              <el-form-item label="备注信息">
                <el-input type="textarea" v-model="form.notes"></el-input>
              </el-form-item>
              <el-form-item v-if="id" label="电子签名" prop="smsTypeGeneral">
                <!-- {{ form.id }} -->
              </el-form-item>
            </el-form>
            <div class="choose-tenant-box">
              <el-form>
                <el-form-item label="数据权限">
                  <el-select
                    v-model="tenantValue"
                    :filterable="true"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in tenantOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-button type="primary" @click="addSelectTenant()"
                    >添加</el-button
                  >
                </el-form-item>
              </el-form>
              <ul>
                <li v-for="(item, index) in chooseTenantArr" :key="index">
                  {{ item.label }}
                  <i
                    class="iconfont icon-zhuyuan-yizhu-bohui"
                    @click="delChooseTenant(item)"
                  ></i>
                </li>
                <span v-if="chooseTenantArr.length == 0">暂无选择的租户</span>
              </ul>
            </div>
            <div class="choose-tenant-box choose-role-box">
              <el-form>
                <el-form-item label="选择角色">
                  <el-select
                    v-model="roleValue"
                    :filterable="true"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-button type="primary" @click="addSelectRole()"
                    >添加</el-button
                  >
                </el-form-item>
              </el-form>
              <ul>
                <li v-for="(item, index) in chooseRoleArr" :key="index">
                  {{ item.label }}
                  <i
                    class="iconfont icon-zhuyuan-yizhu-bohui"
                    @click="delChooseRole(item)"
                  ></i>
                </li>
                <span v-if="chooseRoleArr.length == 0">暂无选择的角色</span>
              </ul>
            </div>
            <div class="edit-btn-box">
              <el-button type="primary" @click="save()">保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="绑定账号" name="second">
          <bind-account :id="id" :result="userResult"></bind-account>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import tenant from "@/cm/api/index";
import role from "@/drugs/page/auth/store/roleapi";
import api from "@/drugs/page/account/api/index";
import bindAccount from "./bind.account";
import { mapState } from "vuex";
let form = {
  account: null,
  password: null,
  name: null,
  idCardNum: null,
  mobile: null,
  email: null,
  notes: null,
  digitalMark: null
};
export default {
  computed: {
    ...mapState(["treeList", "treeMenuList"])
  },
  components: {
    bindAccount
  },
  data() {
    return {
      logArr: [1, 2, 3],
      checkArr: [],
      parentIdMap: [],
      tenantValue: "",
      activeName: "first",
      form: Object.assign({}, form),
      dslist: [],
      rules: {
        account: [{ required: true, message: "必填项", trigger: "blur" }],
        password: [{ required: true, message: "必填项", trigger: "blur" }],
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        idCardNum: [
          { required: true, message: "必填项", trigger: "blur" },
          {
            pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: "请输入正确身份证号",
            trigger: ["change", "blur"]
          }
        ],
        mobile: [
          { required: true, message: "必填项", trigger: "blur" },
          {
            pattern: /^1[345678]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: ["change", "blur"]
          }
        ],
        email: [
          { required: false, message: "必填项", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱",
            trigger: ["change", "blur"]
          }
        ]
      },
      chooseTenantArr: [],
      tenantOptions: [],
      roleValue: "",
      chooseRoleArr: [],
      roleOptions: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      userResult: {},
      id: ""
    };
  },
  methods: {
    /**
     * 删除已选择租户
     *
     */
    delChooseTenant(obj) {
      let tempIndex = this.chooseTenantArr.findIndex((item, index) => {
        return item.value === obj.value;
      });
      this.tenantOptions.push(this.chooseTenantArr[tempIndex]);
      this.chooseTenantArr.splice(tempIndex, 1);
    },
    delChooseRole(obj) {
      let tempIndex = this.chooseRoleArr.findIndex((item, index) => {
        return item.value === obj.value;
      });
      this.roleOptions.push(this.chooseRoleArr[tempIndex]);
      this.chooseRoleArr.splice(tempIndex, 1);
    },
    /**
     * 通过key获取选择租户的对象
     *
     */
    getSelectTenantObj(val) {
      return this.tenantOptions.find((item, index) => {
        return item.value === val;
      });
    },
    getSelectRoleObj(val) {
      return this.roleOptions.find((item, index) => {
        return item.value === val;
      });
    },
    /**
     * 添加已经选择的租户到选择租户列表
     */
    addSelectTenant() {
      if (this.tenantValue === "") {
        this.$message({
          showClose: true,
          message: "请选择租户",
          type: "warning"
        });
        return;
      }
      let tempIndex = this.chooseTenantArr.findIndex((item, index) => {
        return this.tenantValue === item.value;
      });
      if (tempIndex === -1) {
        this.chooseTenantArr.push(this.getSelectTenantObj(this.tenantValue));
        let optionIndex = this.tenantOptions.findIndex((item, index) => {
          return this.tenantValue === item.value;
        });
        this.tenantOptions.splice(optionIndex, 1);
        this.tenantValue = "";
      } else {
        this.$message({
          showClose: true,
          message: "该租户已选择",
          type: "warning"
        });
      }
    },
    addSelectRole() {
      if (this.roleValue === "") {
        this.$message({
          showClose: true,
          message: "请选择角色",
          type: "warning"
        });
        return;
      }
      let tempIndex = this.chooseRoleArr.findIndex((item, index) => {
        return this.roleValue === item.value;
      });
      if (tempIndex === -1) {
        this.chooseRoleArr.push(this.getSelectRoleObj(this.roleValue));
        let optionIndex = this.roleOptions.findIndex((item, index) => {
          return this.roleValue === item.value;
        });
        this.roleOptions.splice(optionIndex, 1);
        this.roleValue = "";
      }
    },
    getRoleArrById(roleIds = []) {
      let tempArr = [];
      this.chooseRoleArr = this.roleOptions.filter((item, index) => {
        if (!(roleIds.indexOf(item.value) > -1)) {
          tempArr.push(item);
        }
        return roleIds.indexOf(item.value) > -1;
      });
      this.roleOptions = tempArr;
    },
    getTenantArrById(tenantIds = []) {
      let tempArr = [];
      this.chooseTenantArr = this.tenantOptions.filter((item, index) => {
        if (!(tenantIds.indexOf(item.value) > -1)) {
          tempArr.push(item);
        }
        return tenantIds.indexOf(item.value) > -1;
      });
      this.tenantOptions = tempArr;
    },
    /**
     * 切换菜单
     */
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    /**
     * 保存或者添加平台账户
     */
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        let tenantIds = this.chooseTenantArr.map((item, index) => {
          return item.value;
        });
        let roleIds = this.chooseRoleArr.map((item, index) => {
          return item.value;
        });
        let params = { tenantIds, roleIds };
        params = Object.assign({}, this.form, params, { type: 1 });
        this.form.tenantId = this.id;
        this.$refs.form.validate(result => {
          if (result) {
            api.save(params).then(() => {
              this.$notify({
                message: "操作成功",
                type: "success",
                duration: 2000
              });
              this.topTitleClick();
            });
          }
        });
      });
    },
    /**
     * 编辑时获取账号相关信息
     */
    get() {
      api.getById(this.id).then(result => {
        if (result) {
          this.form = result;
          this.userResult = Object.assign({}, result);
          this.getRoleArrById(result.roleIds == null ? [] : result.roleIds);
          this.getTenantArrById(
            result.tenantIds == null ? [] : result.tenantIds
          );
        }
      });
    },
    getParentId(treeData) {
      for (let i = 0; i < treeData.length; i++) {
        let item = treeData[i];
        if (Array.isArray(item.children) && item.children.length !== 0) {
          this.parentIdMap[item.id] = true;
          this.getParentId(item.children);
        }
      }
    },
    // fixHalfCheckedBug(ids) {
    //   this.getParentId(this.treeList);
    //   let arr = [];
    //   for (let i = 0; i < ids.length; i++) {
    //     const id = ids[i];
    //     if (!this.parentIdMap[id]) {
    //       arr.push(id);
    //     }
    //   }
    //   this.checkArr = arr;
    // },
    async getTenantList() {
      await tenant
        .alllist({ pageSize: 1000, tenantTypes: [1, 2], offset: 0 })
        .then(result => {
          this.tenantOptions = result.data.map((item, index) => {
            return { value: item.tenantId, label: item.tenantName };
          });
        });
    },
    async getRoleList() {
      await role.list({ pageSize: 1000, offset: 0 }).then(result => {
        this.roleOptions = result.data.map((item, index) => {
          return { value: item.id, label: item.name };
        });
      });
    },
    async initData() {
      await this.getTenantList();
      await this.getRoleList();
      // 如果id存在说明是编辑 获取编辑的账号信息
      if (this.id) {
        this.get();
        // this.fixHalfCheckedBug([1, 101, 2, 201, 20101, 3, 301])
      }
    },
    topTitleClick() {
      this.$route.query.obj
        ? this.$router.push({
            path: "/titancare/operation/pharmacistaccountlist",
            query: { obj: JSON.parse(this.$route.query.obj) }
          })
        : this.$router.push({ path: "/titancare/operation/pharmacistaccountlist" });
    },
    goBack() {
      this.topTitleClick();
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.initData();
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  }
};
</script>
<style lang="less" scoped>
.edit-box {
  padding: 20px 30px;
  /deep/ .el-form-item {
    width: 33%;
    box-sizing: border-box;
    margin-right: 0;
  }
  .choose-tenant-box {
    border-top: solid 2px #e4e7ed;
    border-bottom: solid 2px #e4e7ed;
    padding: 20px 0 0;
    ul {
      margin: 13px 0 18px;
      padding-left: 68px;
      li {
        display: inline-block;
        font-size: 13px;
        margin-right: 25px;
        i {
          color: #ccc;
          position: relative;
          top: 1px;
          left: 5px;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      span {
        font-size: 13px;
        color: #999;
      }
    }
    &.choose-role-box {
      border-top: none;
    }
  }

  .power-tree-box {
    /*border-bottom: solid 2px #e4e7ed;*/
    padding: 20px 0 30px;
    .power-tree-title {
      font-size: 14px;
      color: #606266;
    }
    .el-tree-box {
      border: solid 1px #ededed;
      box-shadow: 1px 1px 10px #ededed;
      margin: 20px 0 0 60px;
      padding: 10px;
    }
  }
  .edit-btn-box {
    margin: 20px 0 0;
  }
  .log-box {
    li {
      margin: 0 0 15px;
      font-size: 14px;
    }
  }
}
</style>
