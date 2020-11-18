<!--  -->
<template>
  <div class="layout_inner playback">
    <div class="wrap">
      <div v-loading="loading" v-if="tableData.length" class="c">
        <ever-form2
          :schema="schema"
          class="input-style f"
          v-model="queryObj"
          ref="form"
          :inline="true"
        >
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="handleCurrentChange(1)"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item class="fr">
              <el-radio v-model="radio" label="IMG">图片</el-radio>
              <el-radio v-model="radio" label="LIST">列表</el-radio>
            </el-form-item>
          </template>
        </ever-form2>
        <playback-list
          :data="tableData"
          v-show="radio === 'LIST'"
        ></playback-list>
        <playback-images-list
          :data="tableData"
          v-show="radio === 'IMG'"
        ></playback-images-list>
        <el-pagination
          align="right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
          class="p"
        ></el-pagination>
      </div>
      <div v-else><ever-no-data></ever-no-data></div>
    </div>
  </div>
</template>

<script>
import playbackList from '@/titancare/views/content/playback/playback.list'
import playbackImagesList from '@/titancare/views/content/playback/playback.images.list'
import api from '@/titancare/api/content/playback'
const schema = [
  {
    name: 'doctorName',
    label: '搜索标题/医生',
    props: {
      placeholder: '搜索标题/医生',
      clearable: true
    }
  },
  {
    name: 'startTime',
    label: '开播时间',
    comp: 'el-date-picker',
    props: {
      type: 'datetime',
      'placeholder': '开播时间',
      'value-format': 'yyyy-MM-dd HH:mm:ss'
    }
  }
]
export default {
  props: {},
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.offset = 0
    queryObj.pagesize = 20
    return {
      name: '',
      schema,
      queryObj,
      radio: 'IMG',
      pagesize: 20,
      count: 0,
      tableData: [],
      currentPage: 1,
      loading: false
    }
  },

  components: {
    playbackList,
    playbackImagesList
  },

  computed: {},
  created () {
    this.list()
  },
  mounted () { },

  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    async list () {
      this.loading = true
      const query = Object.assign(JSON.parse(JSON.stringify(this.queryObj)), {
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize,
        patientId: this.patientId,
        tenantId: localStorage.getItem('TENANTID')
      })
      const res = await api.list(query)
      this.tableData = res.data && res.data.resultList ? res.data.resultList : []
      this.tableData.map(data => {
        data.root = this
      })
      this.count = res.data && res.data.totalCount ? res.data.totalCount : 0
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.c {
  width: 86%;
  min-width: 1610px;
  margin: 0 auto;
}
.f {
  margin-left: 7px;
  margin-right: 28px;
}
.p {
  margin-right: 20px;
}
</style>
