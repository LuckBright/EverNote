<template>
  <div>
    <div class="layout_inner">
      <div class="irritability-wrap">
        <ever-form2
          class="add_input"
          :rules="rules"
          :schema="addSchema"
          v-model="addObj"
          :inline="true"
          ref="form"
        >
          <template slot="level1Category">
            <el-select
              v-model="addObj.level1Category"
              @clear="clearLevel2Categor(true)"
              filterable
              :placeholder="'请选择一级分类'"
              :clearable="true"
            >
              <el-option
                v-for="item in level1CategoryArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              v-model="addObj.level2Category"
              filterable
              :placeholder="'请选择二级分类'"
              :clearable="true"
            >
              <el-option
                v-for="item in level2CategoryArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template slot="default">
            <el-button type="primary" @click="add()">添加规则</el-button>
          </template>
        </ever-form2>
        <section class="inspection_section">
          <ever-table
            :data="tableData"
            :columns="columns"
            v-loading="loading"
            @eventChange="handleEvent"
            :fit="true"
          >
            <template slot="level1Category">
              <el-table-column label="一级分类">
                <template slot-scope="scope">
                  <sys-value type="THC_SYS_DRUG_ALLERGEN_PRIMARY" :code="scope.row.level1Category"></sys-value>
                </template>
              </el-table-column>
            </template>
            <template slot="level2Category">
              <el-table-column label="二级分类">
                <template slot-scope="scope">
                  <sys-value
                    type="THC_SYS_DRUG_ALLERGEN_SECONDARY"
                    :code="scope.row.level2Category"
                  ></sys-value>
                </template>
              </el-table-column>
            </template>
            <template slot="tipInfo">
              <el-table-column label="提示文案">
                <template slot-scope="scope">
                  {{scope.row.tipInfo}}
                </template>
              </el-table-column>
            </template>
          </ever-table>
          <!-- 分页数据 -->
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </section>
        <el-dialog
          class="dialog_form"
          title="修改项目"
          @close="editDialog"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
          width="350px"
        >
          <el-form>
            <el-form-item label="一级分类">
              <el-select
                v-model="editObj.level1Category"
                @clear="clearLevel2Categor"
                filterable
                :placeholder="'请选择'"
                :clearable="true"
              >
                <el-option
                  v-for="item in level1CategoryArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
              <el-select
                v-model="editObj.level2Category"
                filterable
                :placeholder="'请选择'"
                :clearable="true"
              >
                <el-option
                  v-for="item in level2CategoryArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提示类型">
              <el-input
                v-model="editObj.allergyType"
                placeholder="输入提示类型，限20个字符"
                autocomplete="off"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item class="last_height" label="提示文案">
              <el-input
                type="textarea"
                placeholder="输入提示文案，限制50字符"
                v-model="editObj.tipInfo"
                autocomplete="off"
                inline="true"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="editClick()">确认修改</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import cascadeApi from '@/warehouse/store/discountproportionapi'
import api from '@/warehouse/store/cdssapi'
import list from '@/util/list'
export default {
  mixins: [list],
  props: [],
  data () {
    // let searchSchema = [
    //   {
    //     name: 'patientId',
    //     label: '药品名称',
    //     comp: 'el-input'
    //   }
    // ]
    let addSchema = [
      {
        name: 'level1Category',
        comp: 'custom',
        props: {
          placeholder: '选择分类'
        }
      },
      {
        name: 'level2Category',
        comp: 'custom',
        props: {
          placeholder: '选择二级分类'
        }
      },
      {
        name: 'allergyType',
        comp: 'el-input',
        props: {
          maxlength: '20',
          placeholder: '请输入提示类型，限20个字符'
        },
        style: {
          width: '200px'
        }
      },
      {
        name: 'tipInfo',
        comp: 'el-input',
        props: {
          placeholder: '请输入提示文案，限制50字符',
          maxlength: '50'
        },
        style: {
          width: '500px'
        }
      }
    ]
    // let queryObj = this.$ever.createObjFromSchema(searchSchema)
    let addObj = this.$ever.createObjFromSchema(addSchema)
    addObj.level1Category = ''
    return {
      cascadeApi,
      api,
      addSchema,
      level2CategoryArr: [],
      addObj,
      secondary: {},
      queryObj: null,
      level1CategoryArr: [],
      tableData: [],
      dialogFormVisible: false,
      editObj: {
        level1Category: '',
        level2Category: '',
        allergyType: '',
        tipInfo: ''
      },
      rules: {
        level1Category: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        level2Category: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        allergyType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        tipInfo: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      columns: [
        {
          slotName: 'level1Category',
        },
        {
          slotName: 'level2Category',
        },
        {
          prop: 'allergyType',
          label: '提示类型',
          width: 130,
        },
        {
          slotName: 'tipInfo',
          label: '提示文案',
        },
        {
          prop: 'ever-op', // 该列的唯一标示，没有prop时应该加上该属性
          type: 'btns',
          width: 140,
          label: '操作',
          btns: [
            'edit',
            'del'
          ]
        }
      ],
      listApiName: 'searchList',
      currentPage: 1,
      totalNum: 0,
      params: {
        pagesize: 20,
        offset: 0
      },
      flag: 0
    }
  },
  created () {
    cascadeApi.getInfoList({ setCode: ['THC_SYS_DRUG_ALLERGEN_PRIMARY'] }).then((res) => {
      const objs = {}
      this.level1CategoryArr = res.map(item => {
        objs[item.code] = item.valueSetItems
        return {
          value: item.code,
          label: item.name
        }
      })
      this.secondary = objs
    })
    this.erji()
  },
  methods: {
    handleEvent ({ prop, row }) {
      this[prop](row)
    },
    edit (row) {
      this.dialogFormVisible = true
      this.editObj = this.copy(row)
    },
    editClick (row) {
      if (this.editObj.level1Category === '' || this.editObj.level2Category === '' || this.editObj.allergyType === '' || this.editObj.tipInfo === '') {
        this.$messageTips(this, 'error', '请填写全部内容！')
        return false
      }
      api.add(this.editObj).then((res) => {
        this.dialogFormVisible = false
        this.list()
        this.$messageTips(this, 'success', '修改成功！')
      })
    },
    copy (obj1) {
      let obj2 = {}
      for (let i in obj1) {
        obj2[i] = obj1[i]
      }
      return obj2
    },
    add () {
      if (this.addObj.level1Category === '' || this.addObj.level2Category === '' || this.addObj.allergyType === '' || this.addObj.tipInfo === '') {
        this.$messageTips(this, 'error', '请填写全部内容！')
        return false
      }
      api.add(this.addObj).then((res) => {
        if (res && res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '增加成功！')
          this.list()
          this.addObj.level1Category = ''
          this.addObj.level2Category = ''
          this.addObj.allergyType = ''
          this.addObj.tipInfo = ''
        }
      })
    },
    del (row) {
      api.deleteRequest({ id: row.id }).then(rs => {
        this.$messageTips(this, 'warning', '删除成功！')
        this.list()
      })
    },
    erji (val, flag) {
      let arr = []
      for (let i in this.secondary[val]) {
        arr.push({
          value: this.secondary[val][i].code,
          label: this.secondary[val][i].name
        })
      }
      this.level2CategoryArr = arr
    },
    editDialog () {
      this.flag = 0
    },
    clearLevel2Categor (val) {
      if (val) {
        this.addObj.level2Category = ''
      } else {
        this.editObj.level2Category = ''
      }
    }
  },
  watch: {
    'addObj.level1Category': {
      handler (val) {
        if (val) {
          this.erji(val)
          this.addObj.level2Category = ''
        }
      }
    },
    'editObj.level1Category': {
      handler (val) {
        if (val) {
          this.flag = this.flag + 1
          this.erji(val)
          if (this.flag > 1) {
            this.editObj.level2Category = ''
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.irritability-wrap {
  background: #ffffff;
  padding: 15px;
  .add_input /deep/ .el-input__inner {
    background: #fef5be !important;
  }
  .dialog_form /deep/ .el-input__inner {
    background: #fef5be !important;
  }
  .dialog_form /deep/ .el-form-item {
    margin-bottom: 10px;
  }
  .dialog_form /deep/ .el-textarea__inner {
    background: #fef5be !important;
    height: 200px !important;
  }
  .dialog_form /deep/ .el-input .el-input__count .el-input__count-inner {
    background-color: #fef5be!important;
  }
  .dialog_form /deep/ .el-textarea .el-input__count {
    background-color: #fef5be!important;
  }
}
</style>
