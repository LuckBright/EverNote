<template>
  <!-- 库存查询 -->
  <div id="query">
    <div class="layout_inner">
      <div class="panel-body">
        <div class="main-head">
          <el-row style="border-bottom: 1px solid #eeeeee; margin-bottom: 15px;">
            <el-col :span="16">
              <ever-form2
              :schema="querySchema"
              :inline="true"
              @query="query"
              v-model="queryObj">
              <template slot="classifyId">
                <el-select v-model="queryObj.classifyId" :clearable="true" @visible-change="visibleChange" placeholder="物资分类">
                  <el-option
                    v-for="item in classifyIdOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
              <template slot="default">
                <el-button type="primary" size="small" @click="handlerQuery">查询</el-button>
              </template>
              </ever-form2>
            </el-col>
            <el-col :span="8">
              <el-checkbox v-model="checked" style="line-height:40px" class="fr">显示全部(包含库存为“0”的物资)</el-checkbox>
            </el-col>
          </el-row>
        </div>
        <el-table
          v-loading.body="loading"
          :data="newTableData"
          ref="tr"
          class="no-vertical-border"
          row-key="id"
          :expand-row-keys="entexpands"
          @cell-mouse-enter="rowHover"
          @row-click="rowExpand"
          style="width: 100%;"
        >
          <el-table-column type="expand" width="10">
            <template slot-scope="props">
              <el-table
                :data="props.row.batchNumList"
                :show-header="false"
                style="width: 100%; margin: -1px 0;"
              >
                <el-table-column width="10"></el-table-column>
                <el-table-column label="商品名称"></el-table-column>
                <el-table-column width="101" label="规格"></el-table-column>
                <el-table-column show-overflow-tooltip width="120" label="可用数量"></el-table-column>
                <el-table-column show-overflow-tooltip width="120" label="库存总数"></el-table-column>
                <el-table-column
                  v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
                  width="120"
                  label="货位号"
                ></el-table-column>
                <el-table-column show-overflow-tooltip v-else width="80" label="单位"></el-table-column>
                <el-table-column width="60" label></el-table-column>
                <el-table-column show-overflow-tooltip width="150" label="生产批号">
                  <template slot-scope="scope">
                    <span>{{scope.row.batchNum || '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="生产日期" width="100">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.produceDate"
                    >{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
                    <span v-else>{{'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="100" label="到期日期">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.validityDate"
                    >{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
                    <span v-else>{{'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="num"
                  width="120"
                  align="right"
                  label="库存数量"
                >
                  <template slot-scope="scope">
                    {{scope.row.num}}
                    <span
                      class="light-gray"
                    >
                     <span>{{scope.row.unitName}}</span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="130"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <material-show-name v-if="scope.row.materialName" :materialName="scope.row.materialName" :icons="scope.row.icons"></material-show-name>
            </template>
          </el-table-column>
          <el-table-column width="100" label="规格">
            <template slot-scope="scope">
              {{scope.row.spec || '-'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="120" align="right" label="可用数量">
            <template slot-scope="scope">
              <span v-if="scope.row.totalUsableNum != null">{{scope.row.totalUsableNum}}{{scope.row.unitName}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="right" width="120" label="库存总数">
            <template slot-scope="scope">
              <span v-if="scope.row.totalNum != null">{{scope.row.totalNum}}{{scope.row.unitName}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation')"
            align="center"
            width="120"
            label="货位号"
          >
            <template slot-scope="scope">
              <span>{{scope.row.freight && scope.row.freight.code ? scope.row.freight.code : '无货位号'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip v-else prop width="80" align="center" label="单位">
            <template slot-scope="scope">
              <span>{{scope.row.unitName || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column width="60">
            <template slot-scope="scope">
              <i class="iconfont icon-zhuyuan-yizhu-tonggu"></i>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="150" label="生产批号">
            <template slot-scope="scope">
              <span>{{scope.row.batchNum || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="100" label="生产日期">
            <template slot-scope="scope">
              <span
                v-if="scope.row.produceDate"
              >{{scope.row.produceDate | formatDateByExp('YYYY-MM-DD')}}</span>
              <span v-else>{{'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="100" label="到期日期">
            <template slot-scope="scope">
              <span
                v-if="scope.row.validityDate"
              >{{scope.row.validityDate | formatDateByExp('YYYY-MM-DD')}}</span>
              <span v-else>{{'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="num" width="120" align="right" label="库存数量">
            <template slot-scope="scope">
              <span v-if="scope.row.num != null">{{scope.row.num}}{{scope.row.unitName}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column width="130">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isExpiryDate && scope.row.batchNumList && scope.row.batchNumList.length"
                type="info"
                size="small"
              >详情</el-button>
              <el-button
                type="primary"
                size="small"
                v-if="scope.row.splitNumFlag && scope.row.totalNum"
                @click="handlerSplitRoute(scope.row)"
              >拆零</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pagesize="pagesize"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/inventoryapi'
import classifyapi from '@/warehouse/page/groupmaterial/store/classifyapi'
import list from '@/util/list'
import { debounce, SPU_SPEC_CODE, SEARCH_CODE, PACKAGE_CODE, SPEC, PRODUCER, APPROVAL_CODE, patch, delObjIsNull } from '@/util/common'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import storage from '@/util/storage'

let querySchema = [
  {
    name: 'classifyId',
    label: '商品分类',
    comp: 'custom',
    style: 'width: 120px',
    props: {
      options: []
    },
  },
  {
    name: 'localMaterialId',
    label: '商品名称',
    comp: 'material-select',
    props: {
      params: { materialType: '', ifMoreThanZero: 1 },
    },
    style: REMOTE_METHODS_WIDTH
  },
]

export default {
  mixins: [list, setName, getstorage],
  data () {
    var obj = this.$ever.createObjFromSchema(querySchema)
    obj.ifMoreThanZero = 1
    return {
      checked: false,
      api,
      SPEC,
      SEARCH_CODE,
      SPU_SPEC_CODE,
      PRODUCER,
      APPROVAL_CODE,
      PACKAGE_CODE,
      querySchema,
      queryObj: obj,
      entexpands: [],
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
      classifyIdOptions: []
    }
  },
  methods: {
    handlerSplitRoute (row) {
      if (this.isBatch) {
        this.$router.push(`/storages/business/splitaddbatch?localMaterialId=${row.localMaterialId}`)
      } else {
        this.$router.push(`/storages/business/split/${row.localMaterialId}`)
      }
    },
    handlerQuery () {
      this.query(this.queryObj)
    },
    handleCheck: debounce(function () {

    }),
    rowHover (row, column, cell, event) {
      event.target.parentNode.classList.add('hover_rows')
    },
    rowExpand (row, column, event) {
      let trs = this.$refs.tr.$el.children[2].getElementsByClassName('el-table__row')
      let tr = this._getTrEle(event.target)
      if (this.entexpands.indexOf(row.id) < 0 && row.isExpiryDate && row.batchNumList && row.batchNumList.length) {
        this.entexpands = []
        this.entexpands.push(row.id)
        this.$nextTick(() => {
          for (let i = 0; i < trs.length; i++) {
            trs[i].classList.remove('bg_rows')
            trs[i].classList.add('reset-gray')
          }
          tr.classList.add('bg_rows')
          tr.classList.remove('reset-gray')
          // 获取下一个兄弟节点（展开的内容）
          let nextTrs = tr.nextElementSibling.getElementsByClassName('el-table__row')
          for (let i = 0; i < nextTrs.length; i++) {
            // 删除class
            nextTrs[i].classList.remove('reset-gray')
          }
        })
      } else if (tr && tr.classList) {
        this.entexpands = []
        this.$nextTick(() => {
          tr.classList.remove('bg_rows')
          for (let i = 0; i < trs.length; i++) {
            trs[i].classList.remove('reset-gray')
          }
        })
      }
    },
    _removed (data, val) {
      let index = data.indexOf(val)
      if (index > -1) {
        data.splice(index, 1)
      }
    },
    _getTrEle (el) {
      var parent = el.parentNode
      if (parent && parent.nodeName === 'TR') {
        return parent
      } else if (parent) {
        return this._getTrEle(parent)
      }
    },
    async visibleChange (val) {
      if (val && !this.classifyIdOptions.length) {
        await classifyapi.listclassify({ storageRoomId: this.storageId }).then(res => {
          this.classifyIdOptions = res
        })
      }
    },
    _info () {
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.materialType = this.materialType
      this.$ever.getFieldFromSchema(this.querySchema, 'localMaterialId').props.params.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
      this.queryObj.ifMoreThanZero = 1
    },
    ...patch
  },
  created () {
    this._info()
  },
  computed: {
    newTableData () {
      let aData = []
      if (Array.isArray(this.tableData) && this.tableData.length) {
        this.tableData.forEach(item => {
          // 数据合并前，会被覆盖，先用其他字段存储需要的值
          item.totalNum = item.num
          item.totalUsableNum = item.usableNum
          if (item.batchNumList && item.batchNumList[0]) {
            item.batchNumList[0].splitNumFlag = item.splitNumFlag
            item.batchNumList[0] = delObjIsNull(item.batchNumList[0])
            item = Object.assign({}, item, item.batchNumList[0])
            Array.isArray(item.batchNumList) && item.batchNumList.splice(0, 1)
          }
          aData.push(item)
        })
      }
      return aData
    }
  },
  watch: {
    'queryObj': {
      handler (v) {
        this.query(this.queryObj)
        this.entexpands = []
      },
      deep: true
    },
    checked () {
      this.checked ? this.queryObj.ifMoreThanZero = 0 : this.queryObj.ifMoreThanZero = 1
      this.query(this.queryObj)
      this.entexpands = []
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-default {
  border: none;
  border-radius: 0;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .hover_rows {
  cursor: pointer;
}
.blue:hover {
  text-decoration: underline;
}
.el-table /deep/ .el-table__expanded-cell {
  padding: 0;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .bg_rows {
  background-color: #edf7ff;
}
.el-table /deep/ .el-table__expanded-cell .el-table {
  margin: 0;
  border: none;
  border-top: 1px solid #ccc;
  margin: 0;
}
.el-table /deep/ .el-icon {
  display: none;
}

.el-table /deep/ .reset-gray /deep/ td span,
.el-table /deep/ .reset-gray /deep/ td div {
  color: #ccc;
}
.el-table /deep/ .bg_rows /deep/ td div .icon-zhuyuan-yizhu-tonggu {
  color: #999;
}
.pos_re {
  top: 50%;
}
#query /deep/ .form.ever_query_from {
  border-bottom: none !important;
  margin: 0 !important;
}
.square {
  width: 40px;
  height: 20px;
  top: 0px;
  background: #ccc;
}
.arrow-right {
  left: 40px;
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid #ccc;
}
.icon-zhuyuan-yizhu-tonggu {
  color: #ccc;
}
</style>
