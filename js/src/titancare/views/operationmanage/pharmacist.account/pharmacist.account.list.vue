<template>
  <div>
    <ever-bread-crumb
      name="药师账号管理"
      show-edit-fnt="false"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="list">
        </ever-query-form>
        <div class="btn-box-right">
          <el-button type="primary" @click="batchHandel(1)">批量启用</el-button>
          <el-button type="primary" @click="batchHandel(0)">批量停用</el-button>
          <el-button type="primary" @click="showAddDialog"
            >新建药师账号</el-button
          >
        </div>
      </div>
      <div class="table-box">
        <el-table
          :key="queryObj.tenantType"
          v-loading.body="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="用户名">
            <template slot-scope="scope">
              <span>{{ scope.row.account }}({{ scope.row.name }})</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号">
            <template slot-scope="scope">
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人"> </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
          </el-table-column>
          <el-table-column prop="tenantName" label="状态" width="130">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.status === 1"
                @change="
                  confirmHandel(scope.row.status === 1 ? 0 : 1, [scope.row])
                "
              ></el-switch>
              <span style="color: #1c7bef">
                <span v-if="scope.row.status === 1">已启用</span>
                <span v-if="scope.row.status === 0">已停用</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="tenantName" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="lookDetail(scope.row.id)"
                >查看资料</el-button
              >
              <!-- <el-button
                v-if="scope.row.status === 1"
                type="danger"
                size="small"
                @click="confirmHandel(0,[scope.row])">停用</el-button>
              <el-button
                v-if="scope.row.status === 0"
                type="success"
                size="small"
                @click="confirmHandel(1,[scope.row])">启用</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
        :pagesize="pagesize"
      >
      </ever-pagination>
    </div>
  </div>
</template>

<script>
import list from "@/util/list";
import api from "@/drugs/page/account/api";
import everFullDialog from "@/drugs/components/full-dialog";
var querySchema = [
  {
    name: "keyword",
    label: "用户名或手机号"
  }
];

export default {
  mixins: [list],
  components: {
    everFullDialog
  },
  data() {
    var queryObj = this.$ever.createObjFromSchema(querySchema);
    queryObj.u = false;
    queryObj.types = [1];
    return {
      multipleSelection: [],
      addDialogStatus: false,
      querySchema: querySchema,
      queryObj: queryObj,
      tableData: [],
      notUseQuery: true
    };
  },
  beforeCreate() {
    this.api = api;
  },
  created() {
    if (typeof this.$route.query.obj === "object") {
      let query = this.$route.query.obj;
      this.pagesize = query.pagesize;
      this.queryObj = query.queryObj;
      this.current = query.current;
      this.offset = (query.current - 1) * query.pagesize;
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    batchHandel(type) {
      if (this.multipleSelection.length === 0) {
        this.$message({
          showClose: true,
          message: "请选择要批量操作的账号",
          type: "warning"
        });
        return;
      }
      this.confirmHandel(type, this.multipleSelection);
    },
    confirmHandel(type, user) {
      let paramsUses = [];
      let typetext = type === 1 ? "启用" : "停用";
      let warntext = "请确认是否" + typetext + "账号：";
      let warntitle = typetext + "账号";
      if (user.length > 1) {
        warntext = "请确认是否" + typetext + "以下账号，批量操作请谨慎！<br>";
        warntitle = "批量" + typetext + "账号";
      }
      user.forEach((item, index) => {
        paramsUses.push(item.id);
        warntext =
          warntext +
          item.account +
          "(" +
          item.name +
          ")" +
          (index !== user.length - 1 ? ", " : "");
      });
      this.$confirm(
        '<div style="word-break: break-all">' + warntext + "</div>",
        warntitle,
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.stopOrOpen({ status: type, ids: paramsUses });
        })
        .catch(() => {});
    },
    stopOrOpen(data) {
      api.stopOrOpen(data).then(() => {
        this.$notify({
          message: "操作成功",
          type: "success",
          duration: 2000
        });
        this.list();
      });
    },
    lookDetail(id) {
      let obj = {
        queryObj: this.queryObj,
        current: this.current,
        pagesize: this.pagesize
      };
      this.$router.push({
        path: "/operation/pharmacistInfo",
        query: { id, obj: JSON.stringify(obj) }
      });
    },
    showAddDialog() {
      this.$router.push({
        path: "/operation/pharmacistInfo",
        query: { id: "" }
      });
    },
    del(id, name) {
      let confirm = window.confirm("确认删除 " + name);
      if (confirm) {
        api.del(id).then(_ => {
          this.list();
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/tablecommon.less";
</style>
