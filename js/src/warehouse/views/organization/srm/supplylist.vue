,/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-20 11:20:03
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-20 11:56:00
 * SRM是SupplierRelationshipManagement的缩写，即供应商关系管理(院内供应关系)。
 */
<template>
  <div class="layout_inner srm_supply">
    <div class="main-head">
      <ever-form2
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
        v-ever-bind-enter
        v-model="queryObj"
        @query="getNewList">
        <template slot="supplyId">
          <remote-select
            v-if="apiUrl"
            v-model="queryObj.supplyId"
            clearable
            :key="apiUrl"
            :format="format"
            :params="remoteParams"
            :api-url="apiUrl"
            :not-cache="true"
            :placeholder="`请选择${placeholder}`"
            @input="getNewList">
          </remote-select>
        </template>
        <template slot="default">
            <!-- <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item> -->
            <el-form-item class="fr">
              <el-button type="primary" @click="handlerAddNodes">新增父节点</el-button>
            </el-form-item>
          </template>
      </ever-form2>
    </div>
    <template v-loading="loading">
      <div v-if="totalCount">
        总共 {{totalCount}} 条记录
      </div>
      <el-table
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'supplyRelations'}"
        v-loading="loading"
        border
        row-key="id"
        empty-text="院内供应关系还未设置"
        default-expand-all>
        <el-table-column
          label="院内供应关系"
          :width="width"
          prop="id">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column
          label="供应生效详情"
          prop="name">
          <template slot-scope="{row}">
            <span v-if="row.scene" class="span_width"><span class="title">使用场景：</span><sys-value type="THC_SYS_SCENE" :code="row.scene"></sys-value></span>
            <span v-if="row.materialTypeNames" class="span_width min_width"><span class="title">物资类型：</span>{{row.materialTypeNames}}</span>
            <span class="span_width" v-if="row.isPeriod"><span class="title">生效时间：</span>{{row.isPeriod == 1 ? '全天' : row.start + ' - ' + row.end}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          v-if="commandId == '01'"
          align="center"
          width="80">
          <template slot-scope="{row}">
            <el-button v-if="isShowEdit(row)" type="text" @click="$router.push({
              path: '/warehouse/supply',
              query: {
                supplyId: row.id
              }
            })">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="新增父节点" :visible.sync="dialogVisible" class="ui_dialog_02 spe">
        <div>
          <remote-select
            class="select_position"
            v-model="storageRooms"
            api-url="warehouse/supplyRelation/getStorageRoomsByCondition/"
            :key="selectKey"
            :clearable="true"
            :not-cache="true"
            :multiple="true"
            :placeholder="`请选择要新增的父节点`">
          </remote-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlerSaveNodes" :disabled="!storageRooms.length">保存</el-button>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import api from '@/warehouse/store/supplyapi'
import orgUrlMap from '@/manages/page/organization/utils/urls'
import list from '@/util/list'
import RemoteSelect from '../component/remoteselect'
import SrmOption from './srm.option'
import { apiOptions } from './enum'
import './index.scss'

const querySchema = [
  {
    name: 'type',
    label: '查看方式',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: false
    }
  },
  {
    name: 'supplyId',
    comp: 'custom'
  }
]
export default {
  name: 'SupplierRelationshipManagement',
  mixins: [list, SrmOption],
  components: { RemoteSelect },
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.requestSwitch = true
    return {
      querySchema,
      queryObj,
      options: [],
      storageRooms: [],
      api,
      format: {},
      pagesize: 10000,
      dialogVisible: false,
      selectKey: 1,
      remoteParams: {} // 远程查询接口参数
    }
  },
  computed: {
    commandId () {
      return this.queryObj.type
    },
    placeholder () {
      const commandId = this.queryObj.type
      if (!commandId && this.options.length) return ''
      const cur = this.options.find(item => item.id === commandId)
      return cur && cur.name
    },
    apiUrl () {
      const commandId = this.queryObj.type
      const { prefix, name, format = {}, params = {} } = apiOptions.find(option => option.id === commandId) || {}
      this.remoteParams = params
      this.format = format
      const url = prefix ? orgUrlMap[prefix][name].url : name
      return url
    }
  },
  activated () {
    this.getNewList()
  },
  watch: {
    'queryObj.type' (v) {
      this.queryObj.supplyId = ''
      this.loading = true
      this.tableData = []
    }
  },
  created () {
    this.getOptions().then(options => {
      if (options.length) {
        this.$ever.getFieldFromSchema(
          this.querySchema,
          'type'
        ).props.options = options
        this.queryObj.type = options[0].id
        this.listParams = this.queryObj
        this.getNewList()
      }
    })
  },
  methods: {
    isShowEdit (row) {
      return this.commandId === '01' && row.hasOwnProperty('children')
    },
    handlerAddNodes () {
      this.storageRooms = []
      this.selectKey = Date.now()
      this.dialogVisible = true
    },
    handlerSaveNodes () {
      api.createOrUpdate(this.storageRooms.map(item => ({ supplyId: item }))).then(res => {
        if (Array.isArray(res) && res.length) {
          this.dialogVisible = false
          this.queryObj.type = this.options[0].id
          this.getNewList()
        }
      })
    }
  }
}
</script>
