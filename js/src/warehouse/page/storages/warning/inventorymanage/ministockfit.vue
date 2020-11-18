<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <div class="from_title">
            <span class="from_title_text">
              最小库存为库存预警线，当库房中实际的可用库存到达最小库存时，商品会进入库存预警列表中，提醒采购补货。
              <br>最小库存设置以安全库存为基础，按比例向下浮动。（例如安全库存为100，最小库存为比例为20%，最小库存则为20）
            </span>
          </div>
          <el-form-item label="最小库存比例：" prop="minScale">
            <el-col :span="3">
              <el-input
                @blur="handleChangeMS(form.minScale)"
                v-model.number="form.minScale"
                type="number"
              ></el-input>
            </el-col>
            <el-col :span="1">
              <span class="from_text">%</span>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFrom('form')">预览最小库存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-option clearfloat">
        <span class="fl" v-if="queryFlag">以下为根据您设置条件计算的结果</span>
        <span class="fr" v-if="!queryFlag">
          总共有
          <i>{{safeStorage}}</i> 个商品已设置安全库存，
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
        <el-table-column show-overflow-tooltip prop width="120" align="center" label="当前安全库存">
          <template slot-scope="scope">
            <el-input
              v-if="editId == scope.row.localMaterialId && !queryFlag"
              v-model.number="scope.row.safe"
              type="number"
              @blur="handleChangeSafe(scope.row.safe, scope.$index)"
            ></el-input>
            <span v-else>{{scope.row.safe ? scope.row.safe : scope.row.safe == 0 ? '0' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip v-if="queryFlag" prop width="160" label="预览最小库存">
          <template slot-scope="scope">
            <div class="clearfloat" v-if="scope.row.minUse || scope.row.minUse == 0">
              <span class="fl icon_previewspan">{{scope.row.minUse}}</span>
              <div
                v-if="(scope.row.minUse || scope.row.minUse == 0) && (scope.row.min || scope.row.min == 0) && scope.row.minUse != scope.row.min"
                class="icon_preview fr"
              >
                <i
                  :class="scope.row.minUse > scope.row.min ? 'icon iconfont icon-up' : 'icon iconfont icon-domn'"
                ></i>
                <span>{{Math.abs(scope.row.minUse - scope.row.min)}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip v-if="queryFlag" prop width="40" label>
          <template slot-scope="scope">
            <div v-if="scope.row.minUse || scope.row.minUse == 0">
              <i
                :class="scope.row.minUse != scope.row.min ? 'icon iconfont icon-gongyinglian-tongbu icon_voluation' : 'icon iconfont icon-gongyinglian-tongbu icon_novoluation'"
                @click="handleVoluation(scope.row, scope.$index)"
              ></i>
            </div>
            <i v-else class="icon iconfont icon-gongyinglian-tongbu icon_novoluation"></i>
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
            <span v-else>{{scope.row.min ? scope.row.min : scope.row.min == 0 ? '0' : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop align="center" width="160">
          <template slot-scope="scope">
            <div v-if="editId != scope.row.localMaterialId">
              <el-button
                size="small"
                type="primary"
                @click="handleLeast(scope.row, scope.$index)"
              >编辑</el-button>
              <el-button size="small" type="danger" @click="cancelForm(scope.row, scope.$index)">删除</el-button>
            </div>
            <div v-else>
              <el-button
                size="small"
                type="success"
                @click="handleChangeLeast(scope.row, scope.$index)"
              >确认</el-button>
              <el-button size="small" type="danger" @click="cancelEdit()">取消</el-button>
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
        minScale: ''
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
      rules: {
        minScale: { required: true, message: '请输入最小库存比例', type: 'number' }
      },
      safeStorage: 0,
      minNumStorage: null,
      safeNumStorage: null,
      storageIndex: null,
      obtainData: []
    }
  },
  async created () {
    this._info()
    this.list()
    sysvalue.listOnce('THC_WH_DRUG_FORM').then(res => {
      if (res) {
        this.dosageFormArr = res
      }
    })
  },
  methods: {
    list (params) {
      this.queryObj.offset = this.offset
      this.queryObj.pagesize = this.pagesize
      let paramsObj = {}
      if (this.form.minScale) {
        paramsObj.minScale = this.form.minScale
        paramsObj = Object.assign({}, this.queryObj, paramsObj)
      } else {
        paramsObj = Object.assign({}, this.queryObj)
      }
      this.editId = ''
      api.list(paramsObj).then(res => {
        res && res.list ? this.tableData = res.list : this.tableData = []
        this.totalCount = res.totalCount
      })
      // 获取设置与未设置安全库存
      this.api.getNowNum(this.storageId).then(res => {
        if (res) this.safeStorage = res.num
      })
    },
    submitCreate: debounce(function (data, index, del) {
      let params = Object.assign({}, params, data)
      this.api.create(params).then(res => {
        if (res) {
          this.editId = ''
          if (del === 'change') {
            this.$set(this.tableData[index], 'id', res.id)
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
          }
          if (del === 'voluation') {
            this.$set(this.tableData[index], 'id', res.id)
            this.$set(this.tableData[index], 'min', data.minUse)
            this.tableData = JSON.parse(JSON.stringify(this.tableData))
          }
          if (this.queryFlag && del === 'cancel') {
            if (this.tableData[index].id) {
              delete this.tableData[index].id
            }
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
      this.submitUpdate(this.form)
    }),
    submitFrom: debounce(function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.queryFlag = true
          this.list()
        }
      })
    }),
    handleChangeMS (num) {
      if (num && num <= 0) {
        this.form.minScale = ''
        this.$messageTips(this, 'warning', '补货周期只允许为正数')
      }
    },
    handleLeast (data, index) {
      if (this.storageIndex !== null && this.storageIndex >= 0) {
        if (!this.queryFlag) {
          this.tableData[this.storageIndex].safe = this.obtainData[this.storageIndex].safe
        }
        this.tableData[this.storageIndex].min = this.obtainData[this.storageIndex].min
      }
      this.editId = data.localMaterialId
      this.storageIndex = index
      if (!this.queryFlag) {
        this.safeNumStorage = data.safe ? data.safe : Number(data.safe) === 0 ? 0 : null
      }
      this.minNumStorage = data.min ? data.min : Number(data.min) === 0 ? 0 : null
    },
    cancelForm: debounce(function (data, index) {
      let minData = {}
      if (data.safe || Number(data.safe) === 0 || data.min || Number(data.min) === 0) {
        if (this.queryFlag) {
          minData = {
            min: 0
          }
        } else {
          minData = Object.assign({}, data, {
            isDelete: 1
          })
        }
        this.submitCreate(minData, index, 'cancel')
      }
    }),
    cancelEdit: debounce(function () {
      this.editId = ''
      if (!this.queryFlag) {
        if (this.safeNumStorage === null) {
          delete this.tableData[this.storageIndex].safe
        } else {
          this.$set(this.tableData[this.storageIndex], 'safe', this.safeNumStorage)
        }
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
      //   this.dialogTitle = '确认是否删除当前最小库存'
      //   this.dialogContent = '当前最小库存删除后不能恢复，请确认是否删除？'
      //   this.dialogDelOrKey = this.cancelForm
      //   this.dialogData = data
      // }
      this.$refs.dialog.open()
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
      if (data.minUse !== data.min) {
        data.min = data.minUse
        this.submitCreate(data, index, 'voluation')
      }
    },
    _info () {
      this.queryObj.storageRoomId = this.storageId
      this.queryObj.materialType = this.materialType
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
  margin: 0 0 20px 10px;
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
</style>
