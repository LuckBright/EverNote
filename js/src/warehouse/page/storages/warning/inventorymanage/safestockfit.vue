<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="安全库存设置：">
            <el-select v-model="form.safeType" style="width: 220px;">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <span class="from_text">{{form.safeType == 1 ? '系统计算依赖过往的出入库记录，数据越多计算越精确。' : ''}}</span>
            <div class="from_title">
              <div v-if="form.safeType == 1">
                <span class="from_title_text">安全库存 = 日均消耗量 X （补货周期 + 安全周期）</span>
                <span
                  class="from_title_text"
                >系统根据过去一个时间段内每天平均消耗量（日均消耗），依据日常补货间隔时间（补货周期）和额外预留的库存时间（安全周期），综合计算出合适的安全库存</span>
              </div>
              <span class="from_title_text" v-else>将所有商品的安全库存设置成统一的数值，设置完成后允许单个修改</span>
            </div>
          </el-form-item>
          <div v-if="form.safeType == 1">
            <el-form-item label="补货周期：" prop="replenishmentCycle">
              <el-col :span="2">
                <el-input
                  @blur="handleChangeRC(form.replenishmentCycle)"
                  v-model.number="form.replenishmentCycle"
                  type="number"
                ></el-input>
              </el-col>
              <el-col :span="1">
                <span class="from_text">天</span>
              </el-col>
              <el-col :span="20">
                <span class="from_text">日常的补货间隔时间</span>
              </el-col>
            </el-form-item>
            <el-form-item label="安全周期：">
              <el-col :span="2">
                <el-input
                  @blur="handleChangeSC(form.safeCycle)"
                  v-model.number="form.safeCycle"
                  type="number"
                ></el-input>
              </el-col>
              <el-col :span="1">
                <span class="from_text">天</span>
              </el-col>
              <el-col :span="20">
                <span class="from_text">若未能按照补货周期补货，需要额外预留的库存天数（如不需要可以设置为0）</span>
              </el-col>
            </el-form-item>
          </div>
          <el-form-item v-else-if="form.safeType == 2" label="安全库存数量：" prop="safeNum">
            <el-col :span="3">
              <el-input
                @blur="handleChangeSN(form.safeNum)"
                v-model.number="form.safeNum"
                type="number"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFrom('form')">预览安全库存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-option clearfloat">
        <span class="fl" v-if="queryFlag">以下为根据您设置条件计算的结果</span>
        <span class="fr">
          总共有
          <i class>{{safeStorage}}</i> 个商品已设置安全库存，
          <i>{{totalCount ? totalCount - safeStorage : 0 - safeStorage}}</i> 个商品未设置
        </span>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        @cell-mouse-enter="rowEnter"
        style="width: 100%"
      >
        <el-table-column prop label="商品名称">
          <template slot-scope="scope">
            <material-show-name
              v-if="scope.row.materialName"
              :materialName="scope.row.materialName"
              :icons="scope.row.icons">
            </material-show-name>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          v-if="form.safeType == 1 && queryFlag"
          prop
          width="130"
          align="center"
          label="30天日均消耗量"
        >
          <template slot-scope="scope">
            <span>{{scope.row.dayUse ? scope.row.dayUse : scope.row.dayUse == 0 ? scope.row.dayUse : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip v-if="queryFlag" prop width="200" label="预览安全库存">
          <template slot-scope="scope">
            <div class="clearfloat" v-if="scope.row.safeUse || scope.row.safeUse == 0">
              <span
                class="fl"
              >{{scope.row.safeUse ? scope.row.safeUse : scope.row.safeUse == 0 ? scope.row.safeUse : '-'}}</span>
              <div
                v-if="(scope.row.safeUse || scope.row.safeUse == 0) && (scope.row.safe || scope.row.safe == 0) && scope.row.safeUse != scope.row.safe"
                class="icon_preview fr"
              >
                <i
                  :class="scope.row.safeUse > scope.row.safe ? 'icon iconfont icon-up' : 'icon iconfont icon-domn'"
                ></i>
                <span>{{Math.abs(scope.row.safeUse - scope.row.safe)}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip v-if="queryFlag" prop width="40" label>
          <template slot-scope="scope">
            <div v-if="scope.row.safeUse || scope.row.safeUse == 0">
              <i
                :class="scope.row.safeUse != scope.row.safe ? 'icon iconfont icon-gongyinglian-tongbu icon_voluation' : 'icon iconfont icon-gongyinglian-tongbu icon_novoluation'"
                @click="handleVoluation(scope.row, scope.$index)"
              ></i>
            </div>
            <i v-else class="icon iconfont icon-gongyinglian-tongbu icon_novoluation"></i>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop width="120" align="center" label="当前安全库存">
          <template slot-scope="scope">
            <el-input
              v-if="editId == scope.row.localMaterialId"
              v-model.number="scope.row.safe"
              type="number"
              @blur="handleChangeSafe(scope.row.safe, scope.$index)"
            ></el-input>
            <span v-else>{{scope.row.safe ? scope.row.safe : (scope.row.safe) == 0 ? '0' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop width="120" align="center" label="当前最小库存">
          <template slot-scope="scope">
            <el-input
              v-if="editId == scope.row.localMaterialId"
              v-model.number="scope.row.min"
              type="number"
              @blur="handleChangeMin(scope.row.min, scope.$index)"
            ></el-input>
            <span v-else>{{scope.row.min ? scope.row.min : (scope.row.min) == 0 ? '0' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop align="center" width="160">
          <template slot-scope="scope">
            <div class="btn" v-if="editId != scope.row.localMaterialId">
              <el-button size="small" type="primary" @click="handleLeast(scope.row, scope.$index)">
                <i class="icon iconfont icon-bianji"></i>
              </el-button>
              <el-button size="small" type="danger" @click="cancelForm(scope.row, scope.$index)">
                <i class="icon iconfont icon-delete"></i>
              </el-button>
            </div>
            <div v-else>
              <el-button
                size="small"
                type="primary"
                @click="handleChangeLeast(scope.row, scope.$index)"
              >
                <i class="icon iconfont icon-complete"></i>
              </el-button>
              <el-button size="small" type="danger" @click="cancelEdit()">
                <i class="icon iconfont icon-shanchu"></i>
              </el-button>
            </div>
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
      <div class="panel-footer">
        <el-button
          v-if="queryFlag"
          type="primary"
          @click="handleDelOrKey('form')"
          :disabled="queryFlag && tableData[0] ? false : true"
        >将预览数量应用到全部商品</el-button>
      </div>
    </div>
    <tipDialog
      :title="dialogTitle"
      :content="dialogContent"
      ref="dialog"
      :function="dialogDelOrKey"
    ></tipDialog>
  </div>
</template>
<script>
import api from '../../store/storagemanageapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import list from '@/util/list'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { debounce, SPEC_CODE, patch } from '@/util/common'
import tipDialog from '@/warehouse/page/components/tipsdialog'
let regu = /^[0-9]+$/
export default {
  mixins: [list, getstorage, setName],
  data () {
    let queryObj = {}
    queryObj.requestSwitch = true
    return {
      form: {
        safeType: '',
        replenishmentCycle: '',
        safeCycle: '',
        safeNum: ''
      },
      options: [
        {
          id: '1',
          name: '系统推荐安全库存'
        },
        {
          id: '2',
          name: '批量设置安全库存'
        }
      ],
      optionsDefault: '1',
      rules: {
        replenishmentCycle: { required: true, message: '请输入补货周期', type: 'number' },
        safeNum: { required: true, message: '请输入安全库存数量', type: 'number' }
      },
      api,
      SPEC_CODE,
      queryObj,
      dosageFormArr: [],
      editId: '',
      queryFlag: false,
      delIndex: '',
      dialogTitle: '',
      dialogContent: '',
      dialogDelOrKey: '',
      dialogData: '',
      safeStorage: 0,
      minNumStorage: null,
      safeNumStorage: null,
      storageIndex: null,
      obtainData: []
    }
  },
  async created () {
    this._info()
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    list () {
      this.queryObj.offset = this.offset
      this.queryObj.pagesize = this.pagesize
      let paramsObj = {}
      if (this.form.replenishmentCycle || this.form.safeNum) {
        if (Number(this.form.safeType) === 1 && this.form.replenishmentCycle) {
          paramsObj.replenishmentCycle = this.form.replenishmentCycle
          paramsObj.safeCycle = this.form.safeCycle ? this.form.safeCycle : 0
          paramsObj.safeType = this.form.safeType
        } else if (Number(this.form.safeType) === 2 && this.form.safeNum) {
          paramsObj.safeNum = this.form.safeNum
          paramsObj.safeType = this.form.safeType
        }
        paramsObj = Object.assign({}, this.queryObj, paramsObj)
      } else {
        paramsObj = Object.assign({}, this.queryObj)
      }
      this.editId = ''
      this.api.list(paramsObj).then(res => {
        res && res.list ? this.tableData = res.list : this.tableData = []
        this.totalCount = res.totalCount
      })
      this.getNowNum()
    },
    getNowNum () {
      // 获取设置与未设置安全库存
      this.api.getNowNum(this.storageId).then(res => {
        if (res) this.safeStorage = res.num
      })
    },
    submitCreate: debounce(function (data, index, del) {
      let params = Object.assign({}, params, data)
      this.api.create(params).then(res => {
        if (res) {
          this.getNowNum()
          this.editId = ''
          if (del === 'change') {
            this.$set(this.tableData[index], 'id', res.id)
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
          }
          if (del === 'voluation') {
            this.$set(this.tableData[index], 'id', res.id)
            this.$set(this.tableData[index], 'safe', data.safeUse)
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
          }
          if (this.queryFlag && del === 'cancel') {
            if (this.tableData[index].id) {
              delete this.tableData[index].id
            }
            this.$set(this.tableData[index], 'safe', undefined)
            this.$set(this.tableData[index], 'min', undefined)
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
          } else if (del && !this.queryFlag) {
            this.list()
          }
        }
      })
    }),
    submitUpdate: debounce(function (data) {
      delete this.queryObj.offset
      delete this.queryObj.pagesize
      let params = Object.assign({}, this.queryObj, data)
      this.api.update(params).then(res => {
        res && this.list()
      })
    }),
    keyForm: debounce(function () {
      const newForm = {}
      if (Number(this.form.safeType) === 1) {
        this.form.safeCycle = this.form.safeCycle || 0
        delete this.form.safeNum
      } else if (Number(this.form.safeType) === 2) {
        delete this.form.replenishmentCycle
        delete this.form.safeCycle
      }
      Object.assign(newForm, this.form)
      this.submitUpdate(newForm)
    }),
    submitFrom: debounce(function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.queryFlag = true
          this.list()
        }
      })
    }),
    handleChangeSN (num) {
      if (num && num <= 0 && !regu.test(num)) {
        this.form.safeNum = ''
        this.$messageTips(this, 'warning', '安全库存数量只允许为正整数')
      }
    },
    handleChangeRC (num) {
      if (num && num <= 0 && !regu.test(num)) {
        this.form.replenishmentCycle = ''
        this.$messageTips(this, 'warning', '补货周期只允许为正整数')
      }
    },
    handleChangeSC (num) {
      if (num && !regu.test(num)) {
        this.form.safeCycle = ''
        this.$messageTips(this, 'warning', '安全周期只允许为正整数或者0')
      }
    },
    handleLeast (data, index) {
      if (this.storageIndex !== null && this.storageIndex >= 0) {
        this.tableData[this.storageIndex].safe = this.obtainData[this.storageIndex].safe
        this.tableData[this.storageIndex].min = this.obtainData[this.storageIndex].min
      }
      this.editId = data.localMaterialId
      this.storageIndex = index
      this.safeNumStorage = data.safe ? data.safe : Number(data.safe) === 0 ? 0 : null
      this.minNumStorage = data.min ? data.min : Number(data.min) === 0 ? 0 : null
    },
    handleChangeLeast (data, index) {
      if (!regu.test(data.safe)) {
        this.$messageTips(this, 'warning', '当前安全库存只允许为正整数或者0')
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        return
      }
      if (!regu.test(data.min)) {
        this.$messageTips(this, 'warning', '当前最小库存只允许为正整数或者0')
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        return
      }
      this.submitCreate(data, index, 'change')
    },
    cancelForm: debounce(function (data, index) {
      if (data.safe || Number(data.safe) === 0 || data.min || Number(data.min) === 0) {
        data = Object.assign({}, data, {
          isDelete: 1
        })
        this.submitCreate(data, index, 'cancel')
      }
    }),
    cancelEdit: debounce(function () {
      this.editId = ''
      if (this.safeNumStorage === null) {
        delete this.tableData[this.storageIndex].safe
      } else {
        this.$set(this.tableData[this.storageIndex], 'safe', this.safeNumStorage)
      }
      if (this.minNumStorage === null) {
        delete this.tableData[this.storageIndex].min
      } else {
        this.$set(this.tableData[this.storageIndex], 'min', this.minNumStorage)
      }
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    }),
    rowEnter (row, column, cell, event) {
      event.target.parentNode.classList.add('hover_rows')
    },
    handleDelOrKey (data) {
      if (data === 'form') {
        this.dialogTitle = '确认是否将预览数量应用到全部商品'
        this.dialogContent = '预览数量应用到全部商品后，将覆盖现有已经设置的全部数据'
        this.dialogDelOrKey = this.keyForm
      }
      // else {
      //   this.dialogTitle = '是否删除当前安全库存和最小库存'
      //   this.dialogContent = '商品当前安全库存和最小库存删除后不能恢复，请确认是否删除？'
      //   this.dialogDelOrKey = this.cancelForm
      //   this.dialogData = data
      // }
      this.$refs.dialog.open()
    },
    handleChangeSafe (num, index) {
      if (!regu.test(num)) {
        this.tableData[index].safe = ''
        this.$messageTips(this, 'warning', '当前安全库存只允许为正整数或者0')
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        return
      }
    },
    handleChangeMin (num, index) {
      if (!regu.test(num)) {
        this.tableData[index].min = ''
        this.$messageTips(this, 'warning', '当前最小库存只允许为正整数或者0')
        this.tableData = JSON.parse(JSON.stringify(this.tableData))
        return
      }
    },
    handleVoluation (data, index) {
      if (data.safeUse !== data.safe) {
        data.safe = data.safeUse
        this.submitCreate(data, index, 'voluation')
      }
    },
    _info () {
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
      this.form.safeType = '1'
    },
    _obtainData () {
      if (this.tableData && this.tableData[0]) {
        let obtainData = JSON.parse(JSON.stringify(this.tableData))
        this.obtainData = obtainData
      }
    },
    ...patch
  },
  beforeUpdate () {
    this.$nextTick(function () {
      this._obtainData()
    })
  },
  watch: {
    'form.safeType' (val) {
      this.list()
    }
  },
  components: {
    tipDialog
  }
}
</script>
<style lang="scss" scoped>
.panel-default {
  border: none;
  border-radius: 0;
}

.clearfloat:after {
  content: "";
  text-overflow: ellipsis;
  clear: both;
}
.clearfloat {
  zoom: 1;
}
.main-option span {
  margin: 0;
  line-height: 32px;
  font-size: 14px;
  color: #666666;
}
.main-option i {
  font-style: normal;
  color: #ff9c00;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.from_text {
  color: #666;
  font-size: 14px;
  padding: 0 0 0 20px;
}
.from_title {
  color: #666;
  font-size: 14px;
  background-color: #f4f4f4;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 10px 0 0 0;
}
.from_title_text {
  display: block;
  line-height: 22px;
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
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .el-table__row td .cell /deep/ i.icon_voluation {
  color: #1c7bef;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .el-table__row td .cell /deep/ i.icon_novoluation {
  color: #cccccc;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .el-table__row td .cell /deep/ i.icon-complete {
  color: #1c7bef;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .el-table__row td .cell /deep/ i.icon-shanchu,
.icon-up {
  color: #ee4433;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .el-table__row td .cell /deep/ i.icon-domn {
  color: #16c277;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .el-table__row td .cell /deep/ .icon_preview {
  font-size: 14px;
  color: #666666;
  width: 50%;
}
.el-table
  /deep/
  .el-table__expanded-cell
  /deep/
  .el-table__body-wrapper
  table.el-table__body
  .el-table__row,
.el-table /deep/ .el-table__row td .cell /deep/ .icon_previewspan i {
  width: 50%;
}
.el-table__body .el-table__row td .cell .btn {
  display: none;
}
.el-table__body .el-table__row:hover td .cell .btn {
  display: block;
}
</style>
