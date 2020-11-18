<template>
  <div class="mt20">
    <el-row :gutter="20">
      <el-col :span="20">
        <ever-form2
          :inline="true"
          style="text-align:left"
          :schema="schema"
          v-model="obj"
          :is-query="true"
          :nosubmit="true">
          <!-- 物资搜索 -->
          <template slot="localMaterialId">
            <material-select
              :params="queryParams"
              ref="materialSelete"
              style="width: 400px"
              size="small"
              :multiple="true"
              :collapse-tags="true"
              @change="handleSelect($event, 'localMaterialId')">
            </material-select>
          </template>
          <template slot="noSet">
            <el-checkbox v-model="obj.noSet" @change="handleSelect">优先展示未设置物资</el-checkbox>
          </template>
        </ever-form2>
      </el-col>
      <el-col :span="4">
        <span class="text">已设置<b class="cRed">{{tableDataLenObj.safeMaterNum}}</b>个物资，未设置<b class="cRed">{{tableDataLenObj.minMaterNum}}</b>个物资</span>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <pl-table
      v-if="tableData.length"
      :data="tableData"
      :border="true"
      class="w ever-table nomargin"
      :height="tableData.length > 5 ? 350 : ''"
      ref="plTable"
      use-virtual
      :row-height="40"
      :row-key="'localMaterialId'"
      @table-body-scroll="tableBodyScroll"
      v-ever-bind-enter>
      <pl-table-column
        label="物资分类"
        align="center"
        width="120">
        <template slot-scope="scope">
          {{setName(MATERIA_TYPE_OPTIONS, scope.row.classifyId, true)}}
        </template>
      </pl-table-column>
      <pl-table-column
        align="center"
        label="物资名称">
        <template slot-scope="scope">
          <span class="fl">{{scope.row.materialName}}</span>
        </template>
      </pl-table-column>
      <pl-table-column
        label="规格"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{scope.row.spec || '-'}}
        </template>
      </pl-table-column>
      <pl-table-column
        label="30天日均消耗量"
        align="center"
        width="180">
        <template slot-scope="scope">
          {{scope.row.dayUse ? scope.row.dayUse : scope.row.dayUse == 0 ? scope.row.dayUse : '-'}}
        </template>
      </pl-table-column>
      <pl-table-column
        label="预览安全库存"
        align="center"
        width="120">
        <template slot-scope="scope">
          <div class="clearfloat" v-if="scope.row.safeUse || scope.row.safeUse == 0">
            <span
            >{{scope.row.safeUse ? scope.row.safeUse : scope.row.safeUse == 0 ? scope.row.safeUse : '-'}}</span>
          </div>
          <span v-else>-</span>
        </template>
      </pl-table-column>
      <pl-table-column
        label="预览最小库存"
        align="center"
        width="120">
        <template slot-scope="scope">
          <div class="clearfloat" v-if="scope.row.minUse || scope.row.minUse == 0">
            <span class="icon_previewspan">{{scope.row.minUse}}</span>
          </div>
          <span v-else>-</span>
        </template>
      </pl-table-column>
      <pl-table-column
        align="center"
        width="120">
        <template slot-scope="scope">
          <i class="iconfont icon-zhuyuan-yizhu-tonggu blue" @click="handleRowSave(scope.row, scope.$index)"></i>
        </template>
      </pl-table-column>
      <pl-table-column
        align="center"
        width="140">
        <template slot="header" slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="safeIconColor ? '点击填充预览值' : '点击清空预览值'" placement="top-start">
            <span>设置安全库存 <i @click="handleDefaultSafeNum" class="iconfont icon-gaiyue1 cGray" :class="{iconcolor: !safeIconColor}"></i></span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-input
            v-model.number="scope.row.safe"
            @input="enterInput"
            type="number"
            :class="{ borderError: scope.row.safeError }"
            @blur="handleChangeStock($event, scope.row, 'safe', scope.$index)"
          ></el-input>
        </template>
      </pl-table-column>
      <pl-table-column
        align="center"
        width="140">
        <template slot="header" slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="minIconColor ? '点击填充预览值' : '点击清空预览值'" placement="top-start">
            <span>设置最小库存 <i @click="handleDefaultMinNum" class="iconfont icon-gaiyue1 cGray" :class="{iconcolor: !minIconColor}"></i></span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-input
            v-model.number="scope.row.min"
            @input="enterInput"
            type="number"
            :class="{ borderError: scope.row.minError }"
            @blur="handleChangeStock($event, scope.row, 'min', scope.$index)"
          ></el-input>
        </template>
      </pl-table-column>
    </pl-table>
    <el-table v-else
      :border="true"
      class="w ever-table nomargin"
      :data="[]">
      <pl-table-column
        label="物资分类"
        align="center"
        width="120">
      </pl-table-column>
      <pl-table-column
        align="center"
        label="物资名称">
      </pl-table-column>
      <pl-table-column
        label="规格"
        align="center"
        width="100">
      </pl-table-column>
      <pl-table-column
        label="30天日均消耗量"
        align="center"
        width="180">
      </pl-table-column>
      <pl-table-column
        label="预览安全库存"
        align="center"
        width="120">
      </pl-table-column>
      <pl-table-column
        label="预览最小库存"
        align="center"
        width="120">
      </pl-table-column>
      <pl-table-column
        align="center"
        width="120">
      </pl-table-column>
      <pl-table-column
        align="center"
        width="140">
        <template slot="header" slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="safeIconColor ? '点击填充预览值' : '点击清空预览值'" placement="top-start">
            <span>设置安全库存 <i @click="handleDefaultSafeNum" class="iconfont icon-gaiyue1 cGray" :class="{iconcolor: !safeIconColor}"></i></span>
          </el-tooltip>
        </template>
      </pl-table-column>
      <pl-table-column
        align="center"
        width="140">
        <template slot="header" slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="minIconColor ? '点击填充预览值' : '点击清空预览值'" placement="top-start">
            <span>设置最小库存 <i @click="handleDefaultMinNum" class="iconfont icon-gaiyue1 cGray" :class="{iconcolor: !minIconColor}"></i></span>
          </el-tooltip>
        </template>
      </pl-table-column>
      </el-table>
  </div>
</template>

<script>
import storage from '@/util/storage'
import setName from '@/util/setstatusname'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant'
import { PlTable, PlTableColumn } from 'pl-table'
import { MATERIA_TYPE_OPTIONS } from '@/util/common'
import { PARSE_REG } from '@/warehouse/util/reg.js'

let schema = [
  {
    name: 'materialType',
    label: '物资分类',
    comp: 'sys-select',
    props: {
      options: []
    },
    span: 3
  },
  {
    name: 'localMaterialId',
    label: '物资名称',
    comp: 'custom',
    style: REMOTE_METHODS_WIDTH,
  },
  {
    name: 'noSet',
    comp: 'custom',
    span: 12
  }
]
export default {
  mixins: [setName, getstorage],
  model: {
    prop: 'data'
  },
  props: {
    data: {
      type: Array,
      defalue: () => []
    },
    getListParmas: {
      type: Object,
      default: () => ({})
    },
    listData: {
      type: Array,
      default: () => ([ ])
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      safeIconColor: false,
      minIconColor: false,
      scrollSwitch: false,
      noSet: 0,
      setNum: 0,
      MATERIA_TYPE_OPTIONS,
      scrollTop: 0,
      tableData: [],
      queryParams: {classifyIds: [], filterOverdueRecord: true, storageRoomId: ''},
      copyTableData: [], // 复制的一份原始排序的列表
      lastCopyTableData: [], // 记录上一次操作的排序的列表
    }
  },
  created () {
    this.queryParams.storageRoomId = this.storageId
    this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = this.materialTypeList
  },
  computed: {
    // 是否点击过预览计算结果
    isStock () {
      return Object.keys(this.getListParmas).length
    },
    tableDataLenObj () {
      let arr = []
      arr = this.tableData.filter(item => {
        return (item.safe === 0 || item.safe > 0) && (item.min === 0 || item.min > 0)
      })
      return {
        safeMaterNum: arr.length,
        minMaterNum: this.tableData.length ? this.tableData.length - arr.length : 0
      }
    },
    // 当前库房的物资分类
    materialTypeList () {
      let storageType = storage.getStorageByClinic('MATERIAL_TYPE') || []
      let arr = []
      if (storageType.length) {
        arr = MATERIA_TYPE_OPTIONS.filter(key => storageType.includes(key.id))
      }
      return arr
    },
  },
  watch: {
    'obj.materialType' (val) {
      if (val) {
        this.queryParams.classifyIds = [val]
      } else {
        this.queryParams.classifyIds = []
      }
      this.handleSearchSort()
    },
    data: {
      handler (v) {
        if (v.length) {
          this.once = true
          this.tableData = JSON.parse(JSON.stringify(v))
          this.copyTableData = JSON.parse(JSON.stringify(v))
        }
      },
      deep: true
    },
    tableData: {
      handler (v) {
        if (v.length) {
          // 安全库存批量设置按钮color
          this.safeIconColor = v.some(item => item.safe === '' || item.safe === null || item.safe === undefined)
          this.minIconColor = v.some(item => item.min === '' || item.min === null || item.min === undefined)
        }
      },
      deep: true
    }
  },
  methods: {
    handleSelect (val, type) {
      if (type) {
        this.obj[type] = val
      }
      this.handleSearchSort()
    },
    // 按搜索条件排序
    handleSearchSort () {
      // 把修改过的数据重新给原数据赋值
      this.copyTableData.forEach(item => {
        const find = this.tableData.find(child => child.localMaterialId === item.localMaterialId)
        if (find) {
          item.min = find.min
          item.safe = find.safe
        }
      })
      let materialList = []
      // 按物资分类排序
      if (this.obj.materialType) {
        materialList = this.copyTableData.filter(item => item.materialType === this.obj.materialType)
      }
      if (this.obj.localMaterialId && this.obj.localMaterialId.length) {
        if (materialList.length) {
          materialList = materialList.filter(item => this.obj.localMaterialId.includes(item.localMaterialId)).concat(materialList.filter(item => !this.obj.localMaterialId.includes(item.localMaterialId)))
        } else {
          materialList = this.copyTableData.filter(item => this.obj.localMaterialId.includes(item.localMaterialId))
        }
      }
      if (this.obj.noSet) {
        if (materialList.length) {
          // 都没有设置的
          let noSet = materialList.filter(item => (item['min'] === '' || item['min'] === null) && (item['safe'] === '' || item['safe'] === null)) || []
          // 只设置了一个的
          let setOne = materialList.filter(item => {
            return ((item['min'] === '' || item['min'] === null) && (item['safe'] === 0 || item['safe'])) || ((item['safe'] === '' || item['safe'] === null) && (item['min'] === 0 || item['min']))
          }) || []
          materialList = noSet.concat(setOne).concat(materialList.filter(item => !noSet.concat(setOne).includes(item.localMaterialId)))
        } else {
          // 都没有设置的
          let noSet = this.copyTableData.filter(item => (item['min'] === '' || item['min'] === null) && (item['safe'] === '' || item['safe'] === null)) || []
          // 只设置了一个的
          let setOne = this.copyTableData.filter(item => {
            return ((item['min'] === '' || item['min'] === null) && (item['safe'] === 0 || item['safe'])) || ((item['safe'] === '' || item['safe'] === null) && (item['min'] === 0 || item['min']))
          }) || []
          materialList = noSet.concat(setOne)
        }
      }
      this.tableData = [...materialList.concat(this.copyTableData.filter(item => !materialList.some(child => child.localMaterialId === item.localMaterialId)))]
    },
    handleDefaultMinNum () {
      // if (!this.isStock) return this.everWarning(`请先预览计算结果后再点击${this.minIconColor ? '填充' : '清空'}预览值`)
      this.tableData.forEach(item => {
        if (this.minIconColor) {
          item.min = item.minUse === null ? '' : item.minUse
        } else {
          item.min = ''
          item.minError = false
        }
      })
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 批量设置安全库存
    handleDefaultSafeNum () {
      // if (!this.isStock) return this.everWarning(`请先预览计算结果后再点击${this.safeIconColor ? '填充' : '清空'}预览值`)
      this.tableData.forEach(item => {
        if (this.safeIconColor) {
          item.safe = item.safeUse === null ? '' : item.safeUse
        } else {
          item.safe = ''
          item.safeError = false
        }
      })
      this.tableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 单行设置安全库存和最小库存
    handleRowSave (row, index) {
      if (!this.isStock) return this.everWarning('请先预览计算结果后再点击填充预览值')
      this.scrollSwitch = true
      this.tableData[index].safe = this.tableData[index].safeUse
      this.tableData[index].min = this.tableData[index].minUse
      this.$nextTick(() => {
        this.$refs.plTable.pagingScrollTopLeft(this.scrollTop, 0)
        this.scrollSwitch = false
      })
    },
    checkSubmitData () {
      let flag = false
      this.tableData.forEach(item => {
        const min = item.min === '' || item.min === null
        const safe = item.safe === '' || item.safe === null
        if ((!safe && min) || (safe && !min)) {
          this.$set(item, min ? 'minError' : 'safeError', true)
          this.enterInput()
          flag = true
        }
      })
      return flag
    },
    // 设置安全库存和最小库存
    handleChangeStock ($event, row, key, index) {
      this.tableData[index][key] = row[key]
      let error = {
        'min': 'minError',
        'safe': 'safeError'
      }
      const min = row.min === '' || row.min === null
      const safe = row.safe === '' || row.safe === null
      // 安全库存和最小库存 都未输入 不做处理
      if (min && safe) {
        row.minError = false
        row.safeError = false
        return this.enterInput()
      }
      if (!PARSE_REG.test(row[key])) {
        return this.changeStockMsg(row, key, error, `${key === 'min' ? '最小库存' : '安全库存'}只能是正整数或者0`)
      }
      if (key === 'min') {
        if (!safe && min) return this.changeStockMsg(row, key, error, '最小库存不能为空')
      }
      if (key === 'safe') {
        if (safe && !min) return this.changeStockMsg(row, key, error, '安全库存不能为空')
      }
      if (!safe && !min) {
        if (row.min > row.safe) {
          return this.changeStockMsg(row, key, error, '最小库存不能大于安全库存')
        } else {
          row.minError = false
          row.safeError = false
          return this.enterInput()
        }
      }
    },
    enterInput ($event, row) {
      this.scrollSwitch = true
      this.$nextTick(() => {
        this.$refs.plTable.pagingScrollTopLeft(this.scrollTop, 0)
        this.scrollSwitch = false
      })
    },
    changeStockMsg (row, key, error, msg) {
      this.scrollSwitch = true
      row[key] = ''
      this.$set(row, `${error[key]}`, true)
      this.$nextTick(() => {
        this.$refs.plTable.pagingScrollTopLeft(this.scrollTop, 0)
        this.scrollSwitch = false
      })
      return this.everWarning(msg)
    },
    tableBodyScroll ({scrollTop, scrollLeft, table}, event) {
      if (!this.scrollSwitch) {
        this.scrollTop = scrollTop
      }
    },
  },
  components: {
    PlTable,
    PlTableColumn
  }
}

</script>
<style scoped lang="less">
.text {
  color: #666;
  font-size: 14px;
  display: inline-block;
  width: 100%;
  margin-top: 27px;
  text-align: right;
}
.iconcolor{
  color: #1C7BEF;
}
.borderError /deep/ .el-input__inner {
  border-color: red;
}
</style>
