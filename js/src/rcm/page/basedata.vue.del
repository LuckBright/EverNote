<template>
  <div class="baseData">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          ref="form"
          :schema="schema"
          v-model="obj"
          label-position="left"
          :is-query="true"
          @query="list(true)"
          class="form"
        >
          <template slot="originType">
            <el-form-item prop="originType" label="源资料类型">
              <el-select v-model="obj.originType" placeholder="请选择">
                <el-option
                  v-for="item in originTypeeArr"
                  :key="item.dimesionCode"
                  :label="item.dimesionName"
                  :value="item.dimesionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <!-- <template slot="targetType">
            <el-form-item prop="targetType" label="目标资料类型">
              <el-select v-model="obj.targetType" placeholder="请选择">
                <el-option v-for="item in targetTypeArr" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>-->
          <template slot="isMatch">
            <el-form-item prop="isMatch" label="是否对应">
              <ever-select
                v-model="obj.isMatch"
                :options="macthArr"
                :clearable="true"
                style="width: 100px"
              ></ever-select>
            </el-form-item>
          </template>
          <template slot="originCodeOrName">
            <el-form-item prop="originCodeOrName" label="尚医资料名称">
              <el-input v-model="obj.originCodeOrName"></el-input>
            </el-form-item>
          </template>
        </ever-form2>
        <div class="main-option clearfix">
          <span style="font-size: 14px;color: #48576a;line-height: 1;">目标资料类型</span>
          <el-select v-model="obj.targetType" placeholder="请选择">
            <el-option
              v-for="item in targetTypeArr"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button size="small" type="primary" style="margin-left:7px;" @click="updateBtn">保存</el-button>
          <el-button size="small" type="primary" style="margin-right: 10px;margin-left:6px;" @click="importBtn">导入本地</el-button>
          <upload-file
            @success="uploadSuccess"
            btnSize="small"
            previewInline="true"
            uploadApiType="ucloud"
            :maxNum="1"
            style="float:right;"
            :btnTxt="'导入对应'"
          ></upload-file>
          <doc-download
            @downFile="exportTable"
            size="small"
            ref="downloadfile"
            style="float:right; margin-right: 10px;"
            :btnTxt="'导出对应'"
          ></doc-download>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%" :border="false">
        <el-table-column prop="originCode" label="尚医资料编码" align="center"></el-table-column>
        <el-table-column prop="originName" label="尚医资料名称" align="center"></el-table-column>
        <el-table-column prop="targetObj.code" label="总账资料编码" align="center"></el-table-column>
        <el-table-column prop="targetObj" label="总账资料名称" align="center">
          <template slot-scope="scope">
            <search-base
              :placeholder="'请选择科目'"
              v-model="scope.row.targetObj"
              :targetType="obj.targetType"
            ></search-base>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
  </div>
</template>
<script>
import {
  getVoucherMappingList,
  importVoucherMapping,
  exportVoucherMapping,
  getDimensionList,
  update,
  getKingdeeBaseArchives,
  getHisBaseArchives
} from '../store/baseData'
import list from '../../util/list'
import searchBase from './searchbase'
let schema = [
  {
    name: 'originType',
    comp: 'custom',
    noWrap: true,
    props: {
      clearable: true
    }
  },
  {
    name: 'targetType',
    comp: 'custom',
    noWrap: true,
    props: {
      clearable: true
    }
  },
  {
    name: 'isMatch',
    comp: 'custom',
    noWrap: true,
    props: {
      clearable: true
    }
  },
  {
    name: 'originCodeOrName',
    comp: 'custom',
    noWrap: true
  }
]
export default {
  mixins: [list],
  components: {
    searchBase
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.targetType = 1
    let queryObj = {
      requestSwitch: true
    }
    return {
      obj: obj,
      queryObj: queryObj,
      schema: schema,
      tableData: [],
      baseOptions: [],
      originTypeeArr: [],
      targetTypeArr: [
        {
          name: '客户',
          value: 1
        },
        {
          name: '部门',
          value: 10000
        },
        {
          name: '供应商',
          value: 3
        },
        {
          name: '维度',
          value: 20000
        }
      ],
      macthArr: [
        {
          name: '完全对应',
          id: '0'
        },
        {
          name: '未对应',
          id: 1
        }
      ]
    }
  },
  watch: {
    'obj.originType': {
      handler: function (val, oldVal) {
        this.list()
      }
    },
    'obj.targetType': {
      handler: function (val, oldVal) {
        this.tableData.forEach(v => {
          v.targetCode = ''
          v.targetName = ''
          v.targetObj = {
            name: '',
            code: ''
          }
        })
      }
    }

  },
  methods: {
    baseCodeChange (row) {
    },
    // 基础资料类型
    async getVoucher () {
      try {
        let data = await getDimensionList()
        this.originTypeeArr = data.data
        this.obj.originType = data.data[0].dimesionCode
      } catch (err) { }
    },
    // 总资料编码
    async getBaseOption () {
      try {
        let params = {
          formId: this.obj.originType // 0:科目 1：客户 2：部门 3供应商 4 维度
        }
        let data = await getKingdeeBaseArchives(params)
        this.baseOptions = data.data
      } catch (err) { }
    },

    // table
    async list () {
      try {
        let params = {
          offset: this.offset,
          pagesize: this.pagesize,
          originCodeOrName: this.obj.originCodeOrName,
          originType: this.obj.originType,
          // targetType: this.obj.targetType,
          isMatch: this.obj.isMatch
        }
        let data = await getVoucherMappingList(params)
        data.data.forEach(v => {
          // v.push({
          //   targetObj: ''
          // })
          if (v.targetCode) {
            v.targetObj = {
              code: v.targetCode,
              name: v.targetName
            }
          } else {
            v.targetObj = {
              name: '',
              code: ''
            }
          }
        })
        this.tableData = data.data
        this.totalCount = data.totalCount
      } catch (err) { }
    },
    // 导入
    async uploadSuccess (result) {
      let params = {
        originType: this.obj.originType,
        key: result.name,
        bucketName: result.bucket
      }
      try {
        let data = await importVoucherMapping(params)
        if (data && data.head && data.head.errCode === 0) {
          this.$notify({
            message: data.head.errMsg || '导入成功',
            type: 'success'
          })
          this.list()
        }
      } catch (err) { }
    },
    // 导入本地
    async importBtn () {
      let params = {
        archivesType: this.obj.originType
      }
      try {
        let data = await getHisBaseArchives(params)
        if (data && data.head && data.head.errCode === 0) {
          this.$notify({
            message: data.head.errMsg || '导入成功',
            type: 'success'
          })
          this.list()
        }
      } catch (err) { }
    },
    // 导出
    async exportTable (result) {
      try {
        let data = await exportVoucherMapping()
        this.$refs.downloadfile.downfile(data.data.key, data.data.bucketName)
      } catch (err) { }
    },
    // 批量修改
    async updateBtn () {
      let sendData = []
      this.tableData.forEach((v, index) => {
        sendData.push({
          targetCode: v.targetObj.code,
          targetName: v.targetObj.name,
          id: v.id
        })
      })

      let params = {
        data: sendData
      }
      try {
        let data = await update(params)
        if (data && data && data.head.errCode === 0) {
          this.$notify({
            message: data.head.errMsg || '修改成功',
            type: 'success'
          })
        }
      } catch (err) { }
    }
  },
  created () {
    this.getVoucher()
  }
}
</script>
<style scoped>
.baseData /deep/ .el-form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
}
.baseData /deep/ .el-form-item__label {
  text-align: left;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #48576a;
  line-height: 1;
  padding: 11px 12px 11px 0;
  box-sizing: border-box;
  width: auto !important;
}
.baseData /deep/ .el-form-item__content {
  margin-left: 0 !important;
  display: inline-block;
  vertical-align: top;
}
.baseData /deep/ .form {
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.baseData .main-option{
  line-height: 32px;
}
.baseData .main-option /deep/ .el-input__inner{
  height:32px;
  line-height: 32px;
}
.setMg {
  margin-left: 10px;
}
</style>

