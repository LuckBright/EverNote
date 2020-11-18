<!-- 操作日志 -->
<template>
  <div class="log-box">
    <el-popover class="log-popover" trigger="click" :width="800" @hide="selectedOptions=[]">
      <el-button slot="reference" type="text" @click="getOperationRecordHistroy">
        <i class="iconfont icon-caozuorizhi"></i>
        <span class="log-btn-text">{{$t('操作日志')}}</span>
      </el-button>
      <el-card shadow="never" class="log-card noall">
        <template slot="header">
          <div>
            <span class="font16">操作记录</span>
            <span class="font12">可选择2次记录进行对比</span>
          </div>
        </template>
        <el-table
          :data="tableData"
          :border="true"
          max-height="300"
          row-class-name="log-table-row"
          header-row-class-name="log-table-head"
          @select="selectedOption"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="updateTime" label="操作时间" width="180"></el-table-column>
          <el-table-column prop="creatorName" label="操作人" width="150"></el-table-column>
          <el-table-column prop="typeName" label="操作类型"></el-table-column>
          <el-table-column prop="changeMessage" label="操作内容" v-if="!isDoc">
            <template slot-scope="scope">
              <span :title="scope.row.changeMessage">{{scope.row.changeMessage | filterText}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="viewRecords(scope.row)">查看病历</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="fr">
          <el-pagination
            v-show="count > pagesize"
            small
            layout="total ,prev, pager, next"
            :page-size="pagesize"
            :total="count"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
          ></el-pagination>
        </div>
        <div class="footer">
          <el-button type="primary" @click="contrastCase" v-if="selectedOptions.length === 2">对比病历</el-button>
        </div>
      </el-card>
    </el-popover>
    <el-dialog
      class="history-compare"
      :close-on-click-modal="false"
      :visible.sync="contrastBox"
      :append-to-body="true"
      width="50%"
      v-if="contrastBox"
    >
      <template slot="title">
        <div>
          <span class="font16">{{title}}</span>
        </div>
      </template>
      <el-row>
        <el-col :span="12" class="borderbox noleftborder" style="padding: 0px">
          <h-select :is-doc="isDoc" :id="firstId" :options="options" :schema-id="schemaId"></h-select>
        </el-col>
        <el-col :span="12" class="borderbox" style="padding: 0px">
          <h-select :is-doc="isDoc" :id="secondId" :options="options" :schema-id="schemaId"></h-select>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/workspace/store/medicalapi'
import hSelect from './historyoption'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    schemaId: {
      type: String,
      required: true
    },
    needStore: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      pagesize: 5,
      count: 0,
      currentPage: 1,
      options: [],
      tableData: [],
      selectedOptions: [],
      contrastBox: false,
      historyBox: false,
      firstId: '-1',
      secondId: '-1',
      isDoc: false
    }
  },

  components: {
    hSelect
  },
  methods: {
    openLog () {
      if (this.needStore) {
        this.$confirm('有未保存数据，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.getOperationRecordHistroy()
          })
          .catch(() => {
            return false
          })
      } else {
        this.getOperationRecordHistroy()
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getOperationRecordHistroy()
    },
    getOperationRecordHistroy () {
      if (this.id === '-1') return
      api
        .getOperationRecordHistroy({
          medicalRecordId: this.id,
          pagesize: this.pagesize,
          offset: (this.currentPage - 1) * this.pagesize
        })
        .then(res => {
          if (res.data.designerId === '2') {
            this.isDoc = true
          } else {
            this.isDoc = false
          }
          this.historyBox = true
          this.tableData = res.data.formData
          this.options = []
          this.tableData.map((item, index) => {
            item.index = index // 传递给historyOption组件用
            const obj = {}
            obj.res = item
            obj.label =
              item.updateTime + ' ' + item.creatorName + ' ' + item.typeName
            obj.id = item.id
            this.options.push(obj)
          })
        })
    },
    selectedOption (row) {
      if (row.length > 2) {
        this.$messageTips(this, 'warning', '最多可勾选2项')
        row.pop()
      }
      this.selectedOptions = row.sort(function (a, b) {
        return (
          Date.parse(a.updateTime.replace(/-/g, '/')) -
          Date.parse(b.updateTime.replace(/-/g, '/'))
        )
      })
    },
    viewRecords (item) {
      this.contrastBox = true
      this.firstId = item.id
      this.secondId = ''
    },
    contrastCase () {
      this.contrastBox = true
      this.firstId = this.selectedOptions[0].id
      this.secondId = this.selectedOptions[1].id
    }
  },
  filters: {
    filterText (val) {
      if (typeof val === 'string' && val.length > 200) {
        return val.substring(0, 200) + '...'
      }
      return val
    }
  }
}
</script>
<style lang="scss" scoped>
.log-box {
  display: inline-block;
}
/deep/ .noall {
  /deep/ .el-table__header {
    /deep/ .el-checkbox__inner {
      display: none;
    }
  }
  /deep/ .el-table thead {
    background-color: #eee;
    color: #000;
    font-weight: bold;
  }
}
/deep/ .log-card {
  border: none;
  box-shadow: none;
  /deep/ .el-card__header {
    border-bottom: none;
    padding: 5px 10px;
  }
  /deep/ .el-card__body {
    padding: 0;
  }
  /deep/ .log-table-head th {
    background-color: #eee;
  }
  /deep/ .log-table-row td {
    border-bottom: 1px solid #eee !important;
  }
}
/deep/ .history-compare {
  /deep/ .el-dialog {
    min-width: 1200px;
  }
  /deep/ .el-dialog__header {
    padding: 20px;
    padding-bottom: 0px;
  }
}
.footer {
  text-align: right;
  margin-top: 14px;
}
.log-btn-text {
  color: #000;
  font-size: 14px;
}
.iconfont {
  color: #666;
  vertical-align: -1px;
}
.font16 {
  font-size: 16px;
  font-weight: bolder;
  display: inline-block;
  margin-right: 5px;
  margin-left: -10px;
}
.font12 {
  font-size: 12px;
  color: #666666;
}
.noleftborder {
  border-right: 0px solid #cccccc;
}
.borderbox {
  border: 1px solid #cccccc;
}
.noleftborder {
  border-right: 0px solid #cccccc;
}
</style>

