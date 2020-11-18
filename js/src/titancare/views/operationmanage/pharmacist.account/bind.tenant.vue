<template>
  <div class="tip_info">
    <div class="more_container">
      <ever-form2
        :schema="moreSchema"
        v-model="moreQueryObj"
        :api="api"
        :rules="rules"
        labelWidth="140px"
        ref="form"
        label-position="right"
      >
        <template slot="addThcTenants">
          <div style="display:flex;">
            <div style="margin-right: 20px;">
              <el-select
                v-model="value.tenant"
                placeholder="执业医院（租户）"
                filterable
                @change="getTenantOrg"
                value-key="value"
              >
                <el-option
                  v-for="item in options.tenant"
                  :key="item.id"
                  :label="item.value"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
            <div style="margin-right: 20px;">
              <el-select
                v-model="value.org"
                placeholder="机构"
                filterable
                @change="orgChange"
              >
                <el-option
                  v-for="item in options.org"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div style="margin-right: 20px;">
              <el-select v-model="value.dept" filterable placeholder="科室">
                <el-option
                  v-for="item in options.dept"
                  :key="item.id"
                  :label="item.tenantSubjectName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <el-button class="add-btn" type="primary" @click="addInfo"
              >添加</el-button
            >
          </div>
        </template>
        <template slot="thcTenants">
          <div>
            <div v-for="(item, index) in data" :key="index">
              {{ `${item.tenantName}--${item.orgName}--${item.deptName}` }}
              <el-switch
                style="margin-left:20px;"
                v-model="item.status"
                active-text="开通"
                :active-value="1"
                :inactive-value="2"
                @change="switchChange(item)"
                inactive-text="关闭"
              >
              </el-switch>
            </div>
          </div>
        </template>
        <template slot="default"></template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import api from "@/api/operation";
let moreSchema = [
  {
    name: "addThcTenants",
    label: "新增绑定租户药师",
    comp: "custom"
  },
  {
    name: "thcTenants",
    label: "已经绑定租户药师",
    comp: "custom"
  }
];
export default {
  data() {
    let moreQueryObj = this.$ever.createObjFromSchema(moreSchema);
    let check = (rule, value, callback) => {
      if (this.data.length === 0 && this.data1.length === 0) {
        callback(new Error("请至少添加一家执业医院"));
      } else {
        callback();
      }
    };
    let rules = {
      addThcTenants: [{ validator: check, trigger: ["blur"] }]
    };
    return {
      moreQueryObj,
      data: [],
      options: {
        tenant: [],
        org: [],
        dept: []
      },
      value: { tenant: "", org: "", dept: "" },
      moreSchema,
      rules,
      api,
      localhost: ""
    };
  },
  props: ["json"],
  methods: {
    switchChange(data) {
      let localhost = this.options.tenant.filter(item => {
        return item.id === data.tenantId;
      });
      localStorage.IHTENANTID = data.tenantId;
      let params = { id: data.id, status: data.status };
      api
        .savePlatformThcTenantInfo(localhost[0].fullGroupDomainName, params)
        .then(
          rs => {
            if (rs && JSON.stringify(rs) !== "{}") {
              this.$notify.success({
                message: "修改成功"
              });
            } else {
              data.status = data.status === 1 ? 2 : 1;
            }
          },
          rj => {
            data.status = data.status === 1 ? 2 : 1;
          }
        );
    },
    addInfo() {
      // 添加时直接调接口
      if (this.value.tenant && this.value.org && this.value.dept) {
        let dataInfo =
          this.data.length > 0 &&
          this.data.find(item => item.tenantId === this.value.tenant.id);
        if (dataInfo) {
          this.$notify.error({
            message: "该租户已添加"
          });
          return;
        }
        let info = {
          tenantName:
            this.options.tenant.find(item => item.id === this.value.tenant.id)
              .value || "",
          tenantId: this.value.tenant.id,
          orgName:
            this.options.org.find(item => item.id === this.value.org).name ||
            "", // 机构名称
          orgId: Number(this.value.org),
          deptName:
            this.options.dept.find(item => item.id === this.value.dept)
              .tenantSubjectName || "", // 科室名称
          deptCode:
            this.options.dept.find(item => item.id === this.value.dept)
              .tenantSubjectCode || "", // 科室code
          deptId: this.value.dept
        };
        this.$emit("change", info, this.localhost);
      } else {
        this.$notify.error({
          message: "请完善信息"
        });
      }
    },
    getTenantOrg(obj) {
      // 获取租户下的对应机构
      localStorage.setItem("IHTENANTID", obj.id);
      this.value.org = "";
      this.value.dept = "";
      this.localhost = obj.fullGroupDomainName;
      let paramms = {
        pagesize: 9999,
        offset: 0
      };
      api.getOrgListByCondition(this.localhost, paramms).then(rs => {
        if (rs && rs.list) {
          this.options.org = rs.list;
        }
      });
    },
    orgChange(orgId) {
      // 机构变更查询科室
      let params = {
        orgIdList: [orgId],
        offset: 0,
        pagesize: 9999
      };
      api.getSections(this.localhost, params).then(rs => {
        if (rs && rs.list) {
          this.options.dept = rs.list;
        }
      });
    },
    initOptions() {
      api.getTenants().then(rs => {
        if (rs && rs.length > 0) {
          let options = rs.map(item => {
            return {
              value: item.groupName,
              id: item.tenantId,
              fullGroupDomainName: item.fullGroupDomainName
            };
          });
          this.options.tenant = options;
        }
      });
    }
  },
  created() {
    this.initOptions();
  },
  watch: {
    json: {
      handler: function(val, oldval) {
        if (val) {
          this.data = val.tenants || [];
        }
      },
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
.tip_info /deep/ .el-form-item {
  width: 100%;
}
.el-button--mini {
  padding: 5px;
}
.more_container {
  padding-top: 20px;
  display: flex;
  border-bottom: 2px solid #e4e7ed;
  & /deep/ .el-select {
    width: 100%;
  }
}
.add-btn {
  height: 36px;
  position: relative;
  top: 2px;
}
</style>
