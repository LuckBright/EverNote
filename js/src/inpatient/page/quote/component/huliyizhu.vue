<template>
  <div class="yizhu">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="adviceTermType">
        <el-select
          v-model="queryObj.adviceTermType"
          :placeholder="'医嘱类型'"
          :clearable="true"
        >
          <el-option
            v-for="item in typeArr"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </template>
      <template slot="default">
        <el-button size="small" @click="list">查询</el-button>
      </template>
    </ever-form2>
    <div>
      <ever-table
        height="200"
        class="margin"
        ref="table"
        :columns="columns"
        :data="tableData"
        border
        not-select-checkbox
        show-checkbox
        @select="select"
        @select-all="select"
      >
        <template slot="ruliang">
          <el-table-column label="入量" prop="ruliang" width="200">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.ruliang"></el-input>
            </template>
          </el-table-column>
        </template>
      </ever-table>
    </div>
  </div>
</template>
<script>
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'

const schema = [
  {
    name: 'adviceTermType',
    label: '医嘱类型',
    comp: 'custom'
  }
]

export default {
  props: {
    patientId: String,
    visitNum: String,
    quoteType: String
  },
  created () {
    this.list()
  },
  components: {},
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.hospitalizedNumber = this.visitNum
    queryObj.patientId = this.patientId
    this.copyQuery = JSON.parse(JSON.stringify(queryObj))
    return {
      url: urlMap.quote.yizhu,
      typeArr: [{ code: 0, name: '临时' }, { code: '1', name: '长期' }],
      schema,
      queryObj,
      tableData: [],
      columns: [
        {
          prop: 'adviceOrderTime',
          label: '时间',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceTermName',
          label: '长/临',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceTypeName',
          label: '类型',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceName',
          label: '名称',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceContent',
          label: '内容',
          showOverflowTooltip: true
        },
        {
          prop: 'ruliang',
          slotName: 'ruliang'
        }
      ],
      selected: []
    }
  },
  methods: {
    quote (id) {
      this.$bus.$emit('ref:append' + id, this.textFormat(this.selected))
    },
    textFormat (arr) {
      const data = []
      if (arr && arr.length) {
        arr.map(item => {
          const obj = { inputName: '', input: '' }
          obj.inputName = item.doctorAdviceName
          obj.input = item.ruliang
          data.push(obj)
        })
      }
      return data
    },
    async list () {
      this.selected = []
      if (!this.visitNum || !this.patientId) return
      const res = await request(this.url, this.queryObj)
      this.tableData = res.data ? res.data : []
      this.tableData.map((item, index) => {
        item.doctorAdviceName = item.doctorAdviceName + this.isNull(item.specification)
        this.$set(item, 'ruliang', '')
        item.index = index
      })
    },
    isNull (val) {
      return val === null ? '' : val
    },
    select (val) {
      this.selected = val
      this.selected = this.selected.sort((a, b) => a.index - b.index)
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
.margin {
  margin-top: -15px;
}
</style>

