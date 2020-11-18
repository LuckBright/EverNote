<template>
  <div id="feedbacklist">
    <el-row>
      <el-col align="right">
        <el-button  @click="addrealtion" type="primary">添加</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      class="el-td-border"
      highlight-current-row>
      <el-table-column
        prop="sn"
        label="患者档案号"
        width="120"
        align="center">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="name"
        label="姓名"
        align="center"
        max-width="180">
      </el-table-column>
      <el-table-column
        label="性别"
        align="center"
        width="200">
        <template slot-scope="scope">
          <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        label="年龄"
        align="center"
        width="200">
        <template slot-scope="scope">
          {{scope.row.ageShowText || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        max-width="200">
        <template slot-scope="scope">
          {{scope.row.mobile || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="身份证号"
        max-width="200">
        <template slot-scope="scope">
          {{scope.row.idNo || '--'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="关系"
        align="center"
        width="180">
        <template slot-scope="scope">
          <sys-value type="GBT.4761" :code="scope.row.type"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        label="公用预存款"
        align="center"
        width="180">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.shareMoney" @change="v => {editShare(scope.row, v)}"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button size="small" type="danger" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current">
    </ever-pagination>
    <add-relation ref="addrelation" :patientId="patientId" @update="update"></add-relation>
  </div>
</template>
<script>
  import api from '../store/relationshipapi'
  import utillist from '../../util/list'
  import addRelation from '@/crm/components/add.relationship.dialog'
  let querySchema = []
  export default {
    mixins: [utillist],
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.patientId = this.$route.params.patientId
      return {
        api,
        queryObj,
        visible: false,
        patientId: this.$route.params.patientId
      }
    },
    methods: {
      update (val) {
        this.list()
      },
      editShare (val, shareMoney) {
        let request = val.shareMoney ? api.createShare : api.cancleShare
        request({'patientId': val.patientId, 'sharePatientId': val.relateId}).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '操作成功')
          } else {
            if (val.shareMoney) {
              val.shareMoney = false
            } else {
              val.shareMoney = true
            }
          }
        })
      },
      addrealtion () {
        this.$refs.addrelation.dialogVisible = true
      },
      deleteRow (val) {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteContact({'patientId': val.patientId, 'relateId': val.relateId}).then(rs => {
            if (rs.head.errCode === 0) {
              this.list()
            }
          })
        })
      }
    },
    components: {
      addRelation
    }
  }
</script>
