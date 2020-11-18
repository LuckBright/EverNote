<template>
  <div>
    <el-dialog title="耗材管理" :visible.sync="dialog" class="ui_dialog_02">
      <el-form :inline="true">
        <el-form-item label="选择耗材">
          <el-select
            v-model="queryName"
            filterable
            remote
            clearable
            placeholder="选择需要关联的耗材"
            :remote-method="remoteMethod"
            @change="handleSelectionChange"
            >
            <el-option
              v-for="item in items"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="toRelatedData"
        style="width: 100%"
        @selection-change="handleCancelSelection"
        border>
        <el-table-column
          prop="wareName"
          label="名称">
        </el-table-column>
        <el-table-column
          label="数量">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.quantity" size="small"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index, toRelatedData)">{{scope.row.btnName}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog = false; relation()"><i class="icon iconfont icon-tijiao"></i>提交</el-button>
      </div>
    </el-dialog>
    <h4>已关联耗材项目
      <el-button type="primary" @click="dialog=true"  size="small" style="float:right">新增</el-button>
    </h4>
    <el-table
      :data="relatedData"
      style="width: 100%"
      @selection-change="handleCancelSelection"
      border>
      <el-table-column
        prop="id"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="wareName"
        label="名称">
      </el-table-column>
      <el-table-column
        label="数量">
        <template slot-scope="scope">
          {{scope.row.quantity}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="removeRelation(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
  import relapi from '../store/haocaiapi'
  import {warehouse as axios} from '@/warehouse/store/api'
  export default {
    data () {
      return {
        queryName: null,
        remoteMethod: this.queryUnRelated,
        toRelatedData: [],
        relatedData: [],
        serviceId: this.$route.params.id,
        dialog: false,
        items: []
      }
    },
    created () {
      this.relationList()
      this.queryUnRelated()
    },
    methods: {
      deleteRow (index, arr) {
        arr.splice(index, 1)
      },
      queryUnRelated (query) {
        query = query && query.trim()
        axios.post('consumptiveMaterial/getLocalConsumptiveMaterialList/', {
          name: query,
          unitType: 293
        }).then(result => {
          this.items = result.list
        })
      },
      relationList () {
        relapi.list(this.serviceId).then(results => {
          this.relatedData = results.data
        })
      },
      handleSelectionChange (select) {
        select = this.items.filter(v => {
          return v.id === select
        })[0]
        if (!select) {
          return
        }
        let arr = select.localSettingItem
        if (arr.length) {
          this.toRelatedData.push({
            'wareName': select.name,
            'wareId': arr[0].localSettingId,
            'wareType': select.consumptiveType,
            'unit': arr[0].unitId,
            'quantity': '',
            'btnName': '删除'
          })
        }
      },
      relation () {
        relapi.relation(this.serviceId, this.toRelatedData).then(_ => {
          this.toRelatedData = []
          this.relationList()
        })
      },
      handleCancelSelection (selects) {
        this.cancelSelected = selects.map(v => {
          return v.id
        })
      },
      removeRelation (id) {
        relapi.removeRelation([id]).then(_ => {
          this.relationList()
        })
      }
    }
  }
</script>
