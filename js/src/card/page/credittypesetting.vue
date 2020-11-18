<template>
  <div>
    <el-dialog
      title="变动类型设置"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="50%"
      class="order ui_dialog_02 spe"
      :before-close="handleClose"
    >
      <div class="main-option">
        <el-button type="primary" @click="addType()">新增</el-button>
      </div>
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column type="index" width="50" :label="$t('编号')"></el-table-column>
        <el-table-column prop :label="$t('变动类型名称')">
          <template
            slot-scope="scope"
          >{{scope.row.typeCode == 'benefit' ? scope.row.benefitName : scope.row.name}}</template>
        </el-table-column>
        <el-table-column prop="points" align="right" :label="$t('等值积分')">
          <template slot-scope="scope">{{scope.row.exchangePoints}}</template>
        </el-table-column>
        <el-table-column prop="typeName" :label="$t('类别')"></el-table-column>
        <el-table-column label="操作" align="center" prop="status">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="updateType(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteType(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        v-if="visi"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </el-dialog>
    <el-dialog
      :title="form.id?'编辑变动类型':'新增变动类型'"
      class="type-log"
      :close-on-click-modal="false"
      :visible.sync="typeVisible"
      width="40%"
      :before-close="handleClosetype"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="类别">
          <sys-type v-model="form.typeCode" code="THC_MARKET_JFDHFS"></sys-type>
        </el-form-item>
        <el-form-item label="变动类型名称">
          <el-input
            type="textarea"
            v-model="form.name"
            :maxlength="64"
            v-if="form.typeCode != 'benefit'"
          ></el-input>
          <el-select
            v-model="form.name"
            placeholder="请选择"
            v-if="form.typeCode=='benefit'"
          >
            <el-option v-for="item in optionss" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等值积分">
          <ever-number v-model="form.exchangePoints" number-type="number"></ever-number>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="primary" @click="addTypeBtn()">确认</el-button>
        <el-button @click="handleClosetype(1)">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '../store/creditapi'
export default {
  data () {
    return {
      dialogVisible: false,
      typeVisible: false,
      tableData: [],
      loading: false,
      visi: false,
      sign: true,
      form: {
        exchangePoints: '',
        name: '',
        typeCode: '',
        id: ''
      },
      options: [],
      optionss: [],
      offset: 0,
      pagesize: Number(this.$route.query.pagesize) || 20,
      totalCount: 0,
      current: Number(this.$route.query.page) || 5
    }
  },
  methods: {
    query () {
      this.visi = false
      this.pagesize = 20
      this.offset = 0
      this.totalCount = 0
      this.current = 1
      setTimeout(_ => {
        this.visi = true
      }, 300)
      this.getList()
    },
    getList () {
      this.loading = true
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        status: 0
      }
      api.getTypeList(params).then(result => {
        this.tableData = result.data.resultList
        this.totalCount = result.data.totalCount
        this.loading = false
      })
    },
    addType () {
      this.typeVisible = true
      this.form.typeCode = ''
    },
    addTypeBtn () {
      if (!this.form.name || !this.form.exchangePoints || !this.form.typeCode) {
        let val = !this.form.typeCode ? '类别不能为空' : !this.form.name ? '变动类型名称不能为空' : '等值积分不能为空'
        this.$messageTips(this, 'error', val)
        return
      }
      let reg = /^([1-9]\d*|0)(\.\d{1,2})?$/
      if (!reg.test(this.form.exchangePoints)) {
        this.$messageTips(this, 'error', '等值积分请输入整数或小数点后不超过两位的小数')
        return
      }
      api.createOrUpdate(this.form).then(result => {
        this.$messageTips(this, 'success', '保存成功')
        this.typeVisible = false
        this.query()
      })
    },
    updateType (row) {
      this.form.typeCode = row.typeCode
      this.form.exchangePoints = row.exchangePoints
      this.form.name = row.name
      this.form.id = row.id
      this.typeVisible = true
    },
    deleteType (row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.del({ id: row.id })
      }).then(() => {
        this.$messageTips(this, 'success', '删除成功!')
        this.query()
      })
    },
    onDialogOpen (rs) {
      this.dialogVisible = true
      this.getList()
    },
    handleClose () {
      this.dialogVisible = false
    },
    handleClosetype (key) {
      this.typeVisible = false
      if (key === 1) {
        this.query()
      }
    },
    afterSave () {
      this.$emit('query')
      this.dialogVisible = false
    },
    initOptions () {
      api.idcardsSearch().then(result => { // 身份卡options
        if (result.data && result.data.resultList) {
          let arr = []
          result.data.resultList.forEach(item => {
            if (Number(item.status) === 0) {
              arr.push(item)
            }
          })
          this.optionss = arr
        }
      })
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.getList()
    },
    handleCurrentChange (val) {
      this.current = val
      this.offset = (val - 1) * this.pagesize || 0
      this.getList()
      return this.pageAfter && this.pageAfter(this.pagesize)
    }
  },
  created () {
    this.initOptions()
  },
  watch: {
    'form.typeCode': {
      handler (newValue, oldValue) {
        if (newValue) {
          if (!this.sign && (newValue === 'benefit' || oldValue === 'benefit')) {
            this.form.name = ''
          }
          this.sign = false
        }
      },
      immediate: true
    },
    'typeVisible': {
      handler (val) {
        if (!val) {
          this.form.typeCode = ''
          this.form.name = ''
          this.form.exchangePoints = ''
          this.form.id = ''
          this.sign = true
        }
      },
      immediate: true
    },
    'dialogVisible': {
      handler (val) {
        if (!val) {
          this.visi = false
          this.pagesize = 20
          this.offset = 0
          this.totalCount = 0
          this.current = 1
          setTimeout(_ => {
            this.visi = true
          }, 300)
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.el-select {
  width: 100%;
}
.type-log /deep/ .el-form-item__content {
  input {
    background-color: #fef5be;
  }
  .el-input__inner {
    background-color: #fef5be;
  }
}
</style>

