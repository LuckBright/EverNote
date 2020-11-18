<template>
  <div>
    <el-row>
      <el-col align="right">
        <el-button @click="handleAddAaddres">新增收货地址</el-button>
      </el-col>
      <el-col>
        <ever-table
          :columns="columns"
          :data="tableData"
          @eventChange="eventChange"
          table-default-cell-value="-"
          :is-record-url-params="false"
        >
          <template slot="address">
            <el-table-column label="收货地址">
              <template slot-scope="scope">
                <i v-show="scope.row.isDefault" class="default_class">默认</i>
                <ever-address v-model="scope.row.address" :convertToFnt="true"></ever-address>
              </template>
            </el-table-column>
          </template>
          <template slot="opCol">
            <el-table-column label="操作" width="120px">
              <template slot-scope="scope">
                <el-button @click="handleEditAaddres(scope.row)" size="mini" type="primary">编辑</el-button>
                <el-button @click="handleDelAaddres(scope.row)" size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </ever-table>
      </el-col>
    </el-row>
    <addres-dialog ref="addresDialog" :title="title" :patientId="queryObj.patientId" :api="api" @searchList="list(true)"></addres-dialog>
  </div>
</template>

<script>
import api from '@/crm/store/shippingaddressapi'
import list from '@/util/list'
import { tableColWidth } from '@/util/table-config'
import AddresDialog from '@/crm/page/member/shippingaddress/addresdialog'
export default {
  mixins: [list],
  data () {
    return {
      api,
      queryObj: {
        patientId: this.$route.params.patientId
      },
      title: '',
      isAddFlag: false,
      columns: [
        {
          prop: 'name',
          width: tableColWidth.name6W105,
          label: '收货人姓名'
        },
        {
          prop: 'mobile',
          width: tableColWidth.phoneW115,
          label: '手机号'
        },
        {
          prop: 'address',
          slotName: 'address'
        },
        {
          slotName: 'opCol'
        }
      ]
    }
  },
  created () {},
  methods: {
    handleAddAaddres () { // 新增
      if (this.tableData.length > 20) return this.$messageTips(this, 'warning', '超过收货地址创建上限，请删除地址后再添加')
      this._openDialog({})
    },
    handleEditAaddres (row) { // 编辑
      this._openDialog({title: row.name, data: row})
    },
    handleDelAaddres (row) { // 删除
      this._openDialog({flag: true, data: row})
    },
    _openDialog ({flag, title, data}) {
      this.title = title
      this.$refs.addresDialog.open({data, flag})
    },
    eventChange ({btnType, col, data}) {
      console.log(btnType, col, data)
    }
  },
  components: {
    AddresDialog
  }
}
</script>

<style scoped>
.default_class {
  font-style: normal;
  background-color: #00b636;
  padding: 2px 4px;
  font-size: 12px;
  color: #ffffff;
  font-weight: 700;
  border-radius: 4px;
}
</style>
