<!--/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-29 16:31:40
 * @Last Modified by: qiaodengtao
 * @Last Modified time: 2020-06-04 16:14:31
 * 调价管理公共组件 价格预览并确认发布价格
 */ -->
<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body width="80%" class="ui_dialog_02">
    <el-container class=" m pos_re">
      <el-aside width="200px" class="boxshadow pos_re" v-if="isTenant">
        <ul class="org_ul bor_1 ">
          <li v-for="org in getOrgList" :key="org.id" @click="handlerSelectOrg(org)" :class="{'active': orgId == org.id}">{{org.name}}</li>
        </ul>
      </el-aside>
      <el-container class="bor_1 pos_re" style="left: -1px">
        <el-main>
          <ever-form2
            ref="form"
            :schema="querySchema"
            :inline="true"
            :is-query="true"
            v-ever-bind-enter
            v-model="queryObj"
            @query="query">
            <template slot="default">
                <!-- <el-form-item>
                  <el-button type="primary" @click="list(true)">查询</el-button>
                </el-form-item> -->
                <el-form-item class="fr">
                </el-form-item>
              </template>
          </ever-form2>

          <ever-table
            border
            class="custom_table"
            v-loading="loading"
            :columns="tableColumns"
            :is-auto-height="false"
            :data="tableData">
            <template v-for="item in tableColumns">
              <el-table-column
                :key="item.prop"
                :slot="item.prop"
                :label="item.label"
                v-if="item.display"
                :width="item.width"
                v-bind="item"
                :prop="item.prop">
                <template slot-scope="scope">
                  <coltd :row="scope.row" :render="(item.render)" :td-key="item.prop" :td-key-name="item.label"></coltd>
                </template>
              </el-table-column>
            </template>
          </ever-table>

        </el-main>
        <el-footer height="38px">
          <ever-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :totalCount="total"
            :pagesize="pagesize"
            :current="current"
          ></ever-pagination>
        </el-footer>
      </el-container>
    </el-container>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" :disabled="disabled" @click="publish" :loading="btnLoading">确定发布</el-button>
    </span>
  </el-dialog>
</template>

<script>
import coltd from '@/manages/components/relevance.table/coltd'
import price from '@/rcm/store/tariffs/modify.price.api'
import { ModuleName } from './enum'
import { mapState, mapGetters } from 'vuex'
import { debounce } from '@/util/common'
import { componentUpward } from '@/warehouse/views/util/index'

const Columns = [
  {
    prop: 'name',
    label: '项目名称',
    minWidth: 200,
    fixed: true
  },
  {
    prop: 'serviceClassification',
    label: '系统分类',
    width: 80,
    type: 'component',
    component: {
      prop: 'serviceClassification',
      name: 'sysValue',
      code: 'serviceClassification',
      type: 'THC_WH_OBJECT_SUB_TYPE',
    }
  },
  {
    prop: 'finType',
    label: '财务分类',
    width: 80,
    type: 'component',
    component: {
      prop: 'finType',
      name: 'sysValue',
      code: 'finType',
      type: 'THC_RCM_FIN_TYPE',
    }
  },
  {
    prop: 'spec',
    width: 80,
    label: '规格',
  },
  {
    prop: 'unitName',
    label: '销售单位',
    width: 80,
  },
  // {
  //   prop: 'unit',
  //   label: '销售单位',
  //   type: 'component',
  //   component: {
  //     prop: 'unit',
  //     name: 'sysValue',
  //     code: 'unit',
  //     type: 'THC_WH_DOSE_UNIT',
  //   }
  // },
]

const querySchema = [
  {
    name: 'sysClasss',
    comp: 'select',
    props: {
      options: [],
      multiple: true,
      collapseTags: true,
      placeholder: '系统分类'
    }
  },
  {
    name: 'itemName',
    props: {
      placeholder: '项目名称'
    }
  }
]

export default {
  components: { coltd },
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      queryObj,
      obj: null, // 预览价格传递过来的选中数据
      dialogVisible: false,
      loading: false,
      btnLoading: false,
      disabled: true,
      total: 100,
      pageCount: 1,
      tableData: [],
      previewServices: [], // 系统分类
      orgId: '',
      batchNo: '', // 调价 - 检查（调价确认创建前）
      current: 1,
      pagesize: 10
    }
  },

  computed: {
    ...mapGetters(ModuleName, ['getOrgList', 'serviceList']),
    ...mapState(ModuleName, {
      isTenant: state => state.isTenant, // 是否集团操作
      priceColumns: state => state.priceColumns, // 表格  价格列数据
    }),
    tableColumns () {
      return Columns.concat(...this.priceColumns)
    }
  },
  watch: {
    'queryObj.itemName': debounce(function () {
      this.query()
    }, 400),
    'dialogVisible': {
      handler (val) {
        if (!val) {
          this.$refs.form.$refs.form.resetFields()
        }
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.query()
    },
    handleCurrentChange (val) {
      this.current = val
      this.getPreViewList()
    },
    initQueryObj () {
      this.queryObj = this.$ever.createObjFromSchema(this.querySchema)
    },
    handlerSelectOrg (row) {
      this.orgId = row.id
      this.query()
    },
    query () {
      this.current = 1
      this.getPreViewList()
    },
    getPreViewList: debounce(function () {
      this.loading = true
      const common = {
        current: this.current,
        size: this.pagesize
      }
      price.preview(Object.assign({}, this.obj, {
        previewFilterParam: {
          orgId: this.orgId,
          sysClasss: [],
          ...this.queryObj,
          ...common
        }
      })).then(res => {
        const { data } = res
        if (data) {
          const { itemInfoList, itemInfoTotalCount, itemsPriceList } = data
          this.total = itemInfoTotalCount
          this.tableData = itemInfoList.map(item => {
            const fileds = itemsPriceList.filter(price => price.itemId === item.id) || []
            const priceData = {}
            fileds.forEach(item => {
              const key = item.scene
              priceData[key] = item
            })
            return Object.assign({}, item, {
              priceData
            })
          })
        }
        this.disabled = false
      }, () => {
        this.total = 0
        this.tableData = []
        this.disabled = true
      }).finally(_ => {
        this.loading = false
      })
    }),
    // 深度打平数据
    deepArgs (arr, filters = []) {
      const _arr = []
      ~(function deep (arr, filters) {
        arr.forEach(item => {
          if (filters.includes(item.id)) {
            _arr.push(item)
          }
          if (Array.isArray(item.children)) {
            deep(item.children, filters)
          }
        })
      })(arr, filters)
      return _arr
    },
    open (params) {
      const { data } = params
      const serviceClass = data.reduce((pre, cur) => {
        return pre.concat(cur.serviceClass)
      }, [])
      this.$ever.getFieldFromSchema(
        this.querySchema,
        'sysClasss'
      ).props.options = this.previewServices = this.deepArgs(this.serviceList, serviceClass)
      this.dialogVisible = true
      this.obj = params
      // 默认获取选择机构的第一个
      this.orgId = params.orgIds[0]
      this.query()
      this.check()
    },
    // 获取调价批次号
    check () {
      price.checkInprocess(this.obj).then(res => {
        const { data } = res
        if (data) {
          this.batchNo = data
        }
      })
    },
    publish () {
      this.btnLoading = true
      price.adjust(Object.assign({}, this.obj, { batchNo: this.batchNo })).then(res => {
        const { code } = res || {}
        if (!code) {
          this.$emit('publishSuccess')
          const parentComp = componentUpward(this, '', 'PricePublish')
          parentComp && (parentComp.dialogVisible = false)
          this.everSuccess('发布成功')
          this.dialogVisible = false
        }
      }).finally(_ => {
        this.btnLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.boxshadow {
  box-shadow:none;
  z-index: 999;
}
.m {
  margin: 20px;
  margin-bottom: 0;
}
.org_ul {
  margin: 0;
  padding:0;
  border-right: none;
  li {
    &:hover {
      background: #f7f7f7;
    }
    &.active  {
      border-right: 1px solid #fff;
      color: #1c7bef;
      font-weight: bold;
    }
    &:last-child {
      border-bottom: 1px solid #fff;
    }
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    line-height: 36px;
    border-right: 1px solid #ddd;
  }
}
.custom_table {
  /deep/ .el-table {
    margin: 0;
  }
}
</style>
