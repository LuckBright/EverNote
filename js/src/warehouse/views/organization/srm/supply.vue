,/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-20 11:20:03
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-20 11:56:00
 * SRM是SupplierRelationshipManagement的缩写，即供应商关系管理(院内供应关系)。
 */
<template>
  <div>
    <ever-bread-crumb name="编辑" path="/warehouse/supplys"></ever-bread-crumb>
    <div class="layout_inner srm_supply">
      <div class="f16 f_bold" v-if="tableData[0]">父节点：{{tableData[0].name}}</div>
      <el-table
        :data="tableData"
        :tree-props="{children: 'children', hasChildren: 'supplyRelations'}"
        v-loading="loading"
        class="last_child"
        border
        row-key="id"
        default-expand-all>
        <el-table-column
          label="院内供应关系"
          :width="width"
          prop="id">
          <template slot-scope="{row, $index}">
            <!-- 编辑 -->
            <template v-if="row.untrack">
              <div class="fl">
                <ever-select
                  v-model="row.type"
                  class="fl"
                  width="180px"
                  placeholder="请选择类型"
                  :clearable="true"
                  :options="options"
                  @input="handlerChangeType(row.type)">
                </ever-select>
                <remote-select
                  v-if="apiUrl"
                  v-model="row.supplyId"
                  class="fl ml20"
                  clearable
                  multiple
                  :key="apiUrl"
                  :format="format"
                  :api-url="apiUrl"
                  :collapsetags="true"
                  :not-cache="true"
                  :params="remoteParams"
                  :after-query="afterQuery"
                  :placeholder="`请选择${placeholder}`">
                </remote-select>
              </div>
            </template>
            <!-- 展示 -->
            <template v-else>{{row.name}}</template>
          </template>
        </el-table-column>
        <el-table-column
          label="供应生效详情"
          prop="name">
          <template slot-scope="{row}">
            <template v-if="row.untrack">
              <!-- 编辑 -->
              <span class="span_left" v-if="typeValue == '02' && row.supplyId.length">
                <sys-type
                  code="THC_SYS_SCENE"
                  placeholder="使用场景"
                  :filterable="true"
                  :useValue="true"
                  :multiple="true"
                  :collapseTags="true"
                  v-model="row.scene"></sys-type>
              </span>
              <span
                class="span_left"
                v-if="(['02', '03'].includes(typeValue)) && row.supplyId.length">
                <!-- 级联选择 -->
                <!-- <el-cascader
                  size="mini"
                  v-model="row.materialTypeRel"
                  placeholder="请选择物资类型"
                  :options="materialOptions"
                  :props="{
                            label: 'name',
                            value: 'id',
                            multiple: true,
                            children: 'children'
                          }"
                  collapse-tags
                  clearable></el-cascader> -->
                  <sys-select
                    size="small"
                    v-model="row.materialType"
                    placeholder="请选择物资类型"
                    collapse-tags
                    :options="materialOptions"
                    :filterable="true"
                    :useValue="true"
                    :field="{
                      multiple: true,
                      collapsetags: true
                    }"
                  ></sys-select>
              </span>
              <span v-if="row.supplyId.length" class="span_left">
                <ever-select
                  size="small"
                  v-model="row.isPeriod"
                  :options="stepTime"
                  placeholder="请选择生效时间"
                ></ever-select>
              </span>
              <span v-if="row.isPeriod == 2 && row.supplyId.length">
                <el-time-select
                  class="span_left"
                  placeholder="起始时间"
                  v-model="row.start"
                  size="small"
                  :picker-options="{
                    start: '00:00',
                    end: '23:00',
                    maxTime: row.end
                  }"
                ></el-time-select>
                <el-time-select
                  size="small"
                  class="span_left"
                  placeholder="结束时间"
                  v-model="row.end"
                  :picker-options="{
                    start: '01:00',
                    end: '24:00',
                    minTime: row.start
                  }"
                ></el-time-select>
              </span>
            </template>
            <template v-else>
              <!-- 展示 -->
              <span v-if="row.scene" class="span_width"><span class="title">使用场景：</span><sys-value type="THC_SYS_SCENE" :code="row.scene"></sys-value></span>
              <span v-if="row.materialTypeNames" class="span_width min_width"><span class="title">物资类型：</span>{{row.materialTypeNames}}</span>
              <span class="span_width" v-if="row.isPeriod"><span class="title">生效时间：</span>{{row.isPeriod == 1 ? '全天' : row.start + ' - ' + row.end}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          width="80">
          <template slot-scope="{row, $index}">
            <el-button v-if="!row.untrack" type="text" @click="handlerDeleteNode(row, $index)">删除</el-button>
            <el-button v-else type="text" :disabled="!row.type || !row.supplyId.length" @click="handlerSaveNodes(row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <tips-dialog ref="dialog" title="删除确认" content="删除该节点后，其对应的所有节点会同步被删除" :function="confirm"></tips-dialog>
  </div>
</template>

<script>
import api from '@/warehouse/store/supplyapi'
import SrmOption from './srm.option'
import orgUrlMap from '@/manages/page/organization/utils/urls'
import RemoteSelect from '../component/remoteselect'
import templateApi from '@/manages/api/template.js'
import TipsDialog from '@/warehouse/page/components/tipsdialog'
import { apiOptions } from './enum'
import { MaterialClassify } from '@/warehouse/views/util/constant.js'
import storage from '@/util/storage'
import './index.scss'

const childField = {
  scene: [], // 场景
  materialType: '', // 分类
  // materialTypeRel: '', // 分类级联选择数据
  type: '', // 类型
  isPeriod: 1, // 生效时间类型
  supplyId: '', // 库房、科室、病区
  start: '', // 开始时间
  end: '', // 结束时间
  untrack: true, // 用来区分可编辑列
}
export default {
  name: 'SupplierRelationshipManagement',
  mixins: [SrmOption],
  components: { RemoteSelect, TipsDialog },

  data () {
    return {
      tableData: [],
      materialOptionsAll: [],
      materialOptions: [],
      api,
      loading: false,
      pagesize: 10000,
      supplyId: this.$route.query.supplyId,
      placeholder: '',
      format: {},
      apiUrl: '',
      typeValue: '',
      currentId: '',
      stepTime: [
        { id: 1, name: '全天生效' },
        { id: 2, name: '分时段' }
      ],
      materialType: '',
      afterQuery: '',
      remoteParams: {} // 远程查询接口参数
    }
  },
  async created () {
    // 获取分类信息（库房、科室、病区）
    this.getOptions()
    // 获取物资分类
    let classifyList = []
    if ((classifyList = JSON.parse(storage.getSessionStorage(MaterialClassify)) || []).length) {
      this.materialOptionsAll = classifyList
    } else {
      await this.getSourceByClassify()
    }
    // 获取当前父节点数据
    this.getById()
  },
  methods: {
    confirm (id, i) {
      api.createOrUpdate({ id: id || this.currentId }).then(res => {
        if (res) {
          if (id) {
            this.everSuccess('删除成功')
            this.tableData[0].children.splice(i, 1)
          } else {
            this.$router.push('/warehouse/supplys')
          }
        }
      })
    },
    /**
     * getSourceByClassify
     * 获取树 物资分类
     * @param {Boolean} tiling 是否平铺数据（展开树结构）
     * @returns
     */
    async getSourceByClassify (tiling = true) {
      await templateApi.getSourceByClassify(101).then(res => {
        if (Array.isArray(res)) {
          /**
           * nests
           * 优化树结构字段
           * @param {*} data
           * @returns tree
           */
          const nests = function nests (data) {
            return data.map(option => {
              let { id, name, classifyList = [] } = option || {}
              if (classifyList && classifyList.length) {
                classifyList = nests(classifyList)
              }
              return {
                id,
                name,
                children: classifyList
              }
            })
          }
          /**
           * tiling
           * 打平树结构数据
           * @param {*} res
           * @returns
           */
          const tiling = function tiling (res) {
            const _tiling = []
            const deep = function (data) {
              data.forEach(item => {
                const { id, name, classifyList = [] } = item
                if (classifyList && classifyList.length) {
                  deep(classifyList)
                } else {
                  _tiling.push({ id, name })
                }
              })
            }
            deep(res)
            return _tiling
          }
          this.materialOptionsAll = tiling ? tiling(res) : nests(res)
          storage.setSessionStorage(MaterialClassify, JSON.stringify(this.materialOptionsAll))
        }
      })
    },
    handlerChangeType (type) {
      const data = this.tableData[0].children
      const index = data.length - 1
      this.$set(data, index, Object.assign({}, data[index], childField, { type: data[index].type }))
      this.typeValue = type
      const cur = this.options.find(item => item.id === type) || {}
      this.placeholder = cur.name || ''
      const { prefix, name, subtitle, format = {}, params = {}, paramsKeys, afterQuery } = apiOptions.find(option => option.id === type) || {}
      this.format = format
      this.remoteParams = params
      const curData = this.tableData[0]
      const storageRoomId = curData.storageRoomId
      // 过滤掉库房列表中当前父库房
      this.afterQuery = afterQuery ? (options) => {
        return afterQuery(options, storageRoomId)
      } : afterQuery
      if (Array.isArray(paramsKeys)) {
        const merge = Object.create(null)
        paramsKeys.forEach(key => {
          merge[key] = curData[key] || storageRoomId
        })
        Object.assign(this.remoteParams, merge)
      }
      this.apiUrl = prefix ? orgUrlMap[prefix][name].url : subtitle || name
    },
    getById () {
      this.loading = true
      api.list({
        type: '01',
        id: this.supplyId
      }).then(res => {
        if (res && res.list) {
          this.tableData = res.list || []
          ~(this.tableData[0].children = this.tableData[0].children || []).push(Object.assign({}, childField, { id: Date.now() }))
          try {
            this.materialType = JSON.parse(this.tableData[0].materialType)
            this.materialOptions = this.materialOptionsAll.filter(item => this.materialType.includes(item.id))
          } catch (error) { }
        }
      }).finally(_ => {
        this.loading = false
      })
    },
    handlerDeleteNode (row, index) {
      this.currentId = row.id
      if (row.children) {
        this.$refs.dialog.open()
      } else {
        this.confirm(this.currentId, index - 1)
      }
    },
    checkMaterialTypeRel (row) {
      if (!row.materialType.length) {
        return (this.everWarning('请选择物资类型'), true)
      }
    },
    strategy (type, row) {
      const strategy = {
        '02': () => {
          if (!row.scene.length) {
            return (this.everWarning('请选择使用场景'), true)
          }
          return (this.checkMaterialTypeRel(row))
        },
        '03': () => {
          return this.checkMaterialTypeRel(row)
        }
      }
      return strategy[type] && strategy[type]() || false
    },
    handlerSaveNodes (row) {
      // materialTypeRel, scene, supplyId,
      const { isPeriod, start, end } = row
      if (isPeriod === 2 && (!start || !end)) {
        return this.everWarning('请设置完生效时间段后再提交')
      }
      if (this.strategy(row.type, row)) return
      // 记录当前row中为数组的key value
      const target = {}
      // 记录row中为数组的key
      const keys = []

      // 分类（拆分当前row中是数组的字段）
      Object.keys(row).forEach(key => {
        const list = row[key]
        if (Array.isArray(list) && list.length) {
          target[key] = list
          keys.push(key)
        }
      })
      const globalSupplyId = this.supplyId

      /**
       * treeNest
       * 把row中为数组的字段基于keys中第一个字段生成一颗树
       * 类：p1 p2 a1 a2 b1 b2 => p1 -> a1 -> b1、b2 => p1 -> a2 -> b1、b2
       * @param {Array}
      */
      const treeNest = function treeNest (list, data) {
        let count = 0
        const curKey = list[0]
        const base = target[curKey]
        ++count
        return base.map(val => {
          data[curKey] = val
          data.globalSupplyId = globalSupplyId
          data.parentId = globalSupplyId
          if (count < list.length) {
            delete data.children
            data.children = treeNest(list.slice(count), Object.assign({}, data))
          }
          return Object.assign({}, Object.assign({}, row, { scene: '' }), data)
        })
      }
      /**
       * deepTreeNest
       * 深度解析树结构， 先子后父（打平）
       * @param {} tree 树结构
      */
      const deepTreeNest = function deepTreeNest (tree) {
        const _tiling = []
        const deep = function (data) {
          data.forEach(item => {
            const { children = null } = item
            if (children) {
              deep(children)
            } else {
              delete item.id
              _tiling.push(item)
            }
          })
        }
        deep(tree)
        return _tiling
      }
      let collection = []
      if (keys.length) {
        const tree = treeNest(keys, {})
        collection = deepTreeNest(tree)
      } else {
        collection.push(Object.assign({}, row, { globalSupplyId, scene: '', parentId: globalSupplyId }))
      }

      api.createOrUpdate(collection).then(res => {
        if (Array.isArray(res)) {
          this.everSuccess('创建成功')
          this.getById()
        }
      })
    },
  }
}
</script>
