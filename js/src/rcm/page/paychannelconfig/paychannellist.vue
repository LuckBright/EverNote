<template>
    <div class="layout_inner">
        <div class="btnsRight">
            <!-- 支付渠道配置暂时仅限一个 -->
          <el-button :disabled="tableData.length>0" size="small" type="primary" @click="addNewPaychannel">新建</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column prop="mchid" label="apikey"></el-table-column>
            <el-table-column prop="name" label="应用名称"></el-table-column>
            <el-table-column prop="appid" label="appid"></el-table-column>
            <el-table-column prop="publicKey" label="应用公钥" show-overflow-tooltip></el-table-column>
            <el-table-column prop="privateKey" label="应用私钥" :formatter="encodePrivateKey">
            </el-table-column>
            <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                    <el-button @click="toEdit(scope.row.id)" type="primary">编辑</el-button>
                    <ever-confirm :msg="'确定要删除吗？'" @confirm="del(scope.row.id)"></ever-confirm>
                </template>
            </el-table-column>
        </el-table>
        <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
</template>
<script>
import list from '@/util/list'
import storage from '@/util/storage'
import api from '@/rcm/store/paychannelconfig/paychannelapi'

export default {
  mixins: [list],
  data () {
    return {
      tableData: [],
      listParams: {
        orgId: storage.getLocalStorage('CLINICID')
      },
      api
    }
  },
  methods: {
    addNewPaychannel () {
      this.$router.push({
        name: 'paychanneladd',
        path: '/financeistall/paychannelconfig/paychanneladd'
      })
    },
    encodePrivateKey (row) {
      return row.privateKey.replace(/./g, '*').slice(0, 12) // 取前12位
    }
  }
}
</script>
<style scoped>
.btnsRight{
  float:right;
  margin-bottom: 10px;
}
</style>
