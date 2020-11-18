<template>
    <div class="container">
        <div class="upcontainer">
            <div class="btnsLeft">
                <el-button size="small" type="primary" @click="addNewDialog">新增</el-button>
            </div>
            <div class="queryRight">
                <ever-select v-model="status" :options="statusList" @input="query"></ever-select>
            </div>
            <div class="clearfix"></div>
        </div>
        <div>
            <el-table v-loading="loading" :data="tableData"   style="width:100%;">
                <el-table-column label="序号" type="index" width="100px"></el-table-column>
                <el-table-column label="打折人" prop="name"></el-table-column>
                <el-table-column label="打折原因" prop="reason"></el-table-column>
                <el-table-column label="状态" prop="status" :formatter="revertStatus"></el-table-column>
                <el-table-column label="排序" prop="sort"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="small" @click="editItem(scope.row)">编辑</el-button>
                        <el-button type="primary" plain size="small" v-if="scope.row.status === 1" @click="disableItem(scope.row)">停用</el-button>
                        <el-button type="primary" plain size="small" v-else @click="enableItem(scope.row)">启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="'打折备注'" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false">
            <ever-form2 :schema="querySchema" v-model="queryObj" :rules="rules" ref="titleform">
                <template slot="buttons">
                    <el-button @click="cancelDialog">取消</el-button>
                    <el-button type="primary" @click="addNew" :disabled="diablebtn">确定</el-button>
                </template>
                <div></div>
            </ever-form2>
        </el-dialog>
    </div>
</template>
<script>
import {getDiscountList,
discountRemarkList,
createDiscountRemark,
updateDiscountRemark} from '../../store/bizdict/bizdict'
let statusList = [{
  id: 1,
  name: '启用'
}, {
  id: -1,
  name: '停用'
}]
let querySchema = [{
  label: '打折人姓名',
  name: 'name',
  comp: 'ever-select',
  props: {
    placeholder: '请选择打折人姓名',
    options: [],
    needObjFlag: true
  }
},
{
  label: '打折备注',
  name: 'reason',
  props: {
    placeholder: '请填写打折原因'
  }
},
{
  label: '状态',
  name: 'status',
  comp: 'ever-select',
  props: {
    options: statusList,
    placeholder: '请选择备注状态'
  }
},
{
  label: '排序',
  name: 'sort',
  comp: 'ever-price',
  props: {
    placeholder: '请输入顺序'
  }
},
{
  label: '',
  name: 'buttons',
  comp: 'custom',
  col: {
    style: 'text-align:right;'
  }
}]
let rules = {
  name: [{
    required: true,
    message: '打折人姓名不能为空',
    trigger: 'blur'
  }],
  reason: [{
    required: true,
    message: '打折备注不能为空',
    trigger: 'blur'
  }],
  status: [{
    required: true,
    message: '打折人状态不能为空',
    trigger: 'blur'
  }],
  sort: [{
    required: true,
    message: '请填写打折人顺序',
    trigger: 'blur'
  }]
}
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      rules: rules,
      // 默认查询启用
      status: 3,
      statusList: [{
        id: 3,
        name: '全部'
      }].concat(statusList),
      dialogVisible: false,
      tableData: [],
      loading: false,
      diablebtn: false,
      isEdit: false
    }
  },
  created () {
    this.query()
    this.getDiscountList()
  },
  watch: {
    'dialogVisible': {
      handler: function (val) {
        if (!val) {
          this.$refs.titleform.resetForm()
        }
      }
    }
  },
  methods: {
    addNewDialog () {
      this.empotyObj(this.queryObj)
      this.dialogVisible = true
    },
    cancelDialog () {
      this.empotyObj(this.queryObj)
      this.dialogVisible = false
    },
    query () {
      this.loading = true
      discountRemarkList({status: this.status === 3 ? 0 : this.status}).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.tableData = res.data
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    async addNew () {
      console.log(this.queryObj.name, '姓名组件')
      this.diablebtn = true
      this.$refs.titleform.$refs.form.validate(async (valid) => {
        if (valid) {
          let params = Object.assign({}, this.queryObj)
          params.discountStaffId = this.queryObj.name.id
          params.name = this.queryObj.name.name
          if (!this.isEdit) {
            await createDiscountRemark(params).then(res => {
              if (res.head && res.head.errCode === 0) {
                this.$messageTips(this, 'success', '新增打折备注成功')
              }
            }).catch(() => {
              this.diablebtn = false
            })
          } else {
            await updateDiscountRemark(params).then(res => {
              if (res.head && res.head.errCode === 0) {
                this.$messageTips(this, 'success', '更新打折备注成功')
                this.isEdit = false
              }
            }).catch(() => {
              this.diablebtn = false
            })
          }
          this.dialogVisible = false
          this.empotyObj(this.queryObj)
          this.diablebtn = false
          this.query()
        } else {
          this.diablebtn = false
          return false
        }
      })
    },
    editItem (row) {
      Object.assign(this.queryObj, row)
      this.queryObj.name = {id: row.discountStaffId, name: row.name}
      this.isEdit = true
      this.dialogVisible = true
    },
    disableItem (row) {
      let params = Object.assign({}, row)
      params.status = -1
      updateDiscountRemark(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.query()
      })
    },
    enableItem (row) {
      let params = Object.assign({}, row)
      params.status = 1
      updateDiscountRemark(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.query()
      })
    },
    async getDiscountList () {
      getDiscountList({status: 1}).then(res => {
        let personList = []
        for (let item of res.data) {
          personList.push({id: item.id, name: item.name})
        }
        this.$ever.getFieldFromSchema(this.querySchema, 'name').props.options = personList
      })
    },
    revertStatus (row) {
      return row.status === 1 ? '正常' : '停用'
    },
    empotyObj (obj) {
      for (let item in obj) {
        if (item === 'id') {
          delete obj[item]
        } else {
          obj[item] = ''
        }
      }
    }
  }
}
</script>
<style scoped>
    .container{
      height:100%;
      padding:0 10px 10px 10px;
    }
    .container .upcontainer{
       margin-bottom: 15px;
    }
    .btnsLeft{
        float:left;
    }
    .queryRight{
        float:right;
    }
    .queryRight /deep/ .el-input__inner{
      height:32px;
      line-height:32px;
    }
</style>
