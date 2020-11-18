<template>
  <div>
    <ever-bread-crumb name="列表" path="/card/selftariffs"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>自费折扣表信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          :rules="rules"
          ref="form"
          :span="12"
          labelWidth="140px"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
        >
          <template slot="validDateTime">
            <el-col :span="12">
              <el-form-item prop="finDate" label="日期范围">
                <date-picker v-model="obj.validDateTime" type="daterange" outformat="yyyy-MM-dd"></date-picker>
              </el-form-item>
            </el-col>
          </template>
          <template slot="default">
            <el-form-item class="fr">
              <el-button
                type="primary"
                size="small"
                @click="loadDetail"
                style="margin-left: 20px;"
              >导入所有分类</el-button>
              <el-select
                v-model="itemClassificationCode"
                :filterable="true"
                placeholder="请选择项目分类"
                :disabled="true"
              >
                <el-option
                  v-for="item in itemClassificationArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </ever-form2>
        <h4 class="panel-hr">
          项目明细
        </h4>
        <ever-form2
          v-if="objId"
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :labelWidth="140"
          label-position="right"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="itemClassId">
            <el-select v-model="queryObj.itemClassId" filterable clearable placeholder="请选择">
              <el-option
                v-for="item in options.allTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
          <template slot="itemName">
            <el-autocomplete
              v-model="queryObj.itemName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="(item) => {handleSelectt(item)}"
            ></el-autocomplete>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="handleCurrentChange(1, true)">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
        <el-table :data="tableData" v-loading.body="loading" style="width: 100%" border>
          <el-table-column show-overflow-tooltip type="index" label="序号" width="60"></el-table-column>
          <el-table-column show-overflow-tooltip prop="calculateType" label="折扣方式">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.discountsMode"
                filterable
                @change="(item)=>{modeChange(scope.row,item)}"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options.modes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="calculateType" label="类别名称">
            <template slot-scope="scope" v-if="scope.row.discountsMode == 1">
              <el-select
                v-model="scope.row.itemClassId"
                filterable
                clearable
                @change="(item)=>{typeChange(scope.row, item)}"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options.allTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="calculateType" label="项目名称">
            <template slot-scope="scope" v-if="scope.row.discountsMode == 2">
              <el-autocomplete
                v-model="scope.row.itemName"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="(item) => {handleSelect(scope.row, item)}"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="createTime" label="记录日期"></el-table-column>
          <el-table-column show-overflow-tooltip prop label="折扣比例">
            <template slot-scope="scope">
              <el-select v-model="scope.row.discount" filterable placeholder="请选择">
                <el-option
                  v-for="item in comInsCount"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="updatorName" label="操作人"></el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                v-if="!(tableData.length == 1 && !scope.row.id)"
                @click="rowDelete(scope.$index, scope.row)"
              >删除</el-button>
              <el-button
                size="small"
                type="primary"
                v-if="scope.$index == tableData.length - 1"
                @click="rowAdd(scope.$index, scope.row)"
              >新增</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <ever-pagination
            v-if="pageshow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="current"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-row>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="updateBase()">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/card/store/selftariffsdetailapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import medicalinsuexportapi from '@/insurance/store/medicalinsuexportapi'
import list from '@/util/list'
import { setTimeout } from 'timers'
import activityApi from '@/card/store/activityapi'
var pickerOptions = {
  disabledDate (time) {
    return time.getTime() < Date.now() - 8.64e7
  }
}
var schema = [
  {
    name: 'name',
    label: '机构信息',
    props: {
      disabled: true
    }
  },
  {
    name: 'masterName',
    label: '自费折扣表名称',
    props: {
      maxlength: 30
    }
  },
  {
    name: 'validDateStart',
    label: '生效日期自',
    comp: 'date-picker',
    props: {
      outformat: 'yyyy-MM-dd',
      pickerOptions: pickerOptions
    }
  },
  {
    name: 'validDateEnd',
    label: '生效日期至',
    comp: 'date-picker',
    props: {
      outformat: 'yyyy-MM-dd',
      pickerOptions: pickerOptions
    }
  }
]
var querySchema = [
  {
    name: 'discountsMode',
    label: '折扣方式',
    comp: 'ever-select',
    props: {
      options: []
    }
  },
  {
    name: 'itemClassId',
    label: '类别名称',
    comp: 'custom'
  },
  {
    name: 'itemName',
    label: '项目名称',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let rules = {
      masterName: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      validDateStart: [
        { required: true, message: '必填项', trigger: 'blur' }
      ],
      validDateEnd: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    let obj = this.$ever.createObjFromSchema(schema)
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.itemId = ''
    obj.validDateStart = this.$moment().format('YYYY-MM-DD')
    obj.validDateEnd = this.$moment('9999-12-31').format('YYYY-MM-DD')
    return {
      obj,
      api,
      rules,
      schema,
      queryObj,
      querySchema,
      objId: this.$route.params.id,
      tableData: [
        { discountsMode: 1, itemClassId: '', itemClassValue: '', itemName: '', itemId: '', updateTime: '', discount: 1, updatorName: '' }
      ],
      addArr: [],
      totalCount: 0,
      offset: 0,
      pageshow: true,
      pagesize: Number(this.$route.query.pagesize) || 20,
      loading: false,
      current: Number(this.$route.query.page) || 1,
      oldCurrent: Number(this.$route.query.page) || 1,
      comInsCount: [],
      itemClassificationCode: 'THC_RCM_FIN_TYPE',
      options: {
        allTypes: [],
        modes: [
          { id: 1, name: '收费类别' },
          { id: 2, name: '收费项目' }
        ]
      },
      itemClassificationArr: [
        {
          name: '医嘱项目分类',
          id: 'THC_RCM_FIN_TYPE'
        }
      ]
    }
  },
  watch: {
    'queryObj.itemName': {
      handler: function (val, oldVal) {
        if (!val) {
          this.queryObj.itemId = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    comInsCountFn () {
      for (let i = 0; i < 101; i++) {
        let json = {}
        json.name = i + '%'
        json.id = i / 100
        this.comInsCount.unshift(json)
      }
    },
    async getOptions () { // 获取
      let options = await sysvalue.listOnce('THC_RCM_FIN_TYPE')
      this.options.allTypes = options
    },
    querySearchAsync (queryString, cb) {
      clearTimeout(this.time)
      this.time = null
      this.time = window.setTimeout(_ => {
        activityApi.queryService({
          offset: 0,
          pagesize: 100,
          name: queryString
        }).then(res => {
          let data = this.initData(res.data)
          cb(data)
        })
      }, 300)
    },
    initData (data) {
      let arr = []
      data.length && data.forEach(item => {
        arr.push({ value: item.name, address: item.id })
      })
      return arr
    },
    handleSelect (row, item) {
      let checkData = 0
      this.tableData.forEach(res => {
        if (res.itemName === item.value) {
          checkData++
        }
      })
      if (checkData > 1) { // 说明有重复
        this.$messageTips(this, 'error', '项目名称不能重复!')
        row.itemId = ''
        row.itemName = ''
      } else {
        row.itemId = item.address
        row.itemName = item.value
      }
    },
    handleSelectt (item) {
      this.queryObj.itemName = item.value
      this.queryObj.itemId = item.address
    },
    typeChange (row, item) {
      let checkData = 0
      this.tableData.forEach(res => {
        if (item && res.itemClassId === item) {
          checkData++
        }
      })
      if (checkData > 1) { // 说明有重复
        this.$messageTips(this, 'error', '类别名称不能重复!')
        row.itemClassId = ''
        row.itemClassValue = ''
      } else {
        let obj = this.options.allTypes.find(val => val.id === item)
        row.itemClassValue = obj.id
      }
    },
    modeChange (row, item) {
      row.itemClassId = ''
      row.itemClassValue = ''
      row.itemId = ''
      row.itemName = ''
    },
    list (refresh) {
      return new Promise((resolve, reject) => {
        if (this.objId) {
          if (refresh) {
            this.offset = 0
          }
          let params = {
            id: this.objId,
            pagesize: this.pagesize,
            offset: this.offset
          }
          params = Object.assign(params, this.queryObj)
          delete params.itemName
          this.loading = true
          api.list(params).then(result => {
            if (result && result.data) {
              this.loading = false
              this.initList(result.data, resolve)
            }
          }, errFn => {
            this.loading = false
          })
        }
      })
    },
    async initList (data, resolve) { // 获取收费项目名称
      let params = []
      data.details.forEach(item => {
        if (item.discountsMode === 2) {
          params.push(item.itemId)
        }
      })
      let itemData = await api.queryServiceVariable({ serviceIds: params })
      data.details.forEach(item => {
        if (item.discountsMode === 2) {
          let serviceInfo = itemData.data.find(val => val.id === item.itemId) || {}
          item.itemName = serviceInfo.name
        } else {
          item.itemName = ''
        }
      })
      resolve(data)
    },
    loadDetail () { // 导入分类
      let arr = []
      this.loading = true
      setTimeout(_ => {
        this.options.allTypes.forEach(item => {
          let obj = this.tableData.find(val => val.itemClassId === item.id) || {}
          if (!obj.itemClassId) {
            let rowInfo = {
              discountsMode: 1,
              itemClassId: item.id,
              itemClassValue: item.code,
              itemName: '',
              itemId: '',
              updateTime: '',
              discount: 1,
              updatorName: ''
            }
            arr.push(rowInfo)
          }
        })
        this.tableData = [...this.tableData, ...arr]
        this.loading = false
      })
    },
    updateBase () {
      let that = this
      that.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let details = that.initUpdateData()
          if (!details) return false
          let params = {
            selfFeeDiscountsId: that.objId,
            itemClassificationCode: that.itemClassificationCode,
            masterName: that.obj.masterName,
            validDateStart: that.obj.validDateStart,
            validDateEnd: that.obj.validDateEnd,
            details: details
          }
          if (this.objId) {
            params['id'] = this.objId
          }
          api.update(params).then(res => {
            this.$messageTips(this, 'success', '保存成功!')
            if (!this.objId) {
              history.go(-1)
            } else {
              this.handleCurrentChange(1, true)
            }
          }).catch(rej => {
            this.$messageTips(this, 'error', '保存失败!')
          })
        }
      })
    },
    initUpdateData () {
      let data = []
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i]
        if (item.discountsMode === 1 && !item.itemClassId) {
          this.$messageTips(this, 'error', '类别名称不能为空!')
          return false
        } else if (item.discountsMode === 2 && !item.itemName) {
          this.$messageTips(this, 'error', '项目名称不能为空!')
          return false
        } else {
          let obj = {}
          if (item.discountsMode === 1) {
            obj.discountsMode = 1
            obj.itemClassId = item.itemClassId
            obj.itemClassValue = item.itemClassValue
          } else {
            obj.discountsMode = 2
            obj.itemId = item.itemId
          }
          obj.discount = item.discount
          if (item.id) obj.id = item.id
          data.push(obj)
        }
      }
      return data
    },
    rowAdd () {
      let infObj = { discountsMode: 1, itemClassId: '', itemClassValue: '', itemName: '', itemId: '', updateTime: '', discount: 1, updatorName: '' }
      this.tableData.push(infObj)
    },
    rowDelete (index, row) {
      let id = row.id || ''
      if (id) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return api.del(id)
        }).then(() => {
          this.$messageTips(this, 'success', '删除成功')
          this.deleteCall()
          this.current = 1
          this.offset = (1 - 1) * this.pagesize || 0
          this.list().then(res => {
            this.tableData = [...res.details, ...this.addArr]
            this.totalCount = res.totalCount
          })
        })
      } else {
        this.tableData.splice(index, 1)
      }
    },
    deleteCall () { // 删除某一项明细后，会刷新列表数据，此时假如还有新增但未保存的明细，则放到最新的列表中，新增的数据都没有id
      let arr = this.tableData.filter(item => { return !item.id })
      if (arr.length > 0) {
        this.addArr = arr
      } else {
        this.addArr = []
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.offset = (this.current - 1) * this.pagesize
      this.list().then(res => {
        this.tableData = res.details
      })
    },
    async handleCurrentChange (val, key) {
      if (key) {
        this.current = val
        this.oldCurrent = val
        this.offset = (val - 1) * this.pagesize || 0
        this.list().then(res => {
          this.tableData = res.details
          this.totalCount = res.totalCount
        })
        return
      }
      this.updatePage(true).then(res => {
        if (!res) {
          this.current = this.oldCurrent
          this.pageshow = false
          window.setTimeout(_ => {
            this.pageshow = true
          }, 100)
          return
        }
        setTimeout(_ => {
          this.current = val
          this.oldCurrent = val
          this.offset = (val - 1) * this.pagesize || 0
          this.list().then(res => {
            this.tableData = res.details
            this.totalCount = res.totalCount
          })
        })
        return this.pageAfter && this.pageAfter(this.pagesize)
      })
    },
    updatePage (val) {
      return new Promise((resolve, reject) => {
        let that = this
        that.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            let details = that.initUpdateData()
            if (!details) {
              resolve(false)
              return
            }
            let params = {
              selfFeeDiscountsId: that.objId,
              itemClassificationCode: that.itemClassificationCode,
              masterName: that.obj.masterName,
              validDateStart: that.obj.validDateStart,
              validDateEnd: that.obj.validDateEnd,
              details: details
            }
            if (this.objId) {
              params['id'] = this.objId
            }
            api.update(params).then(res => {
              if (!val) {
                this.$messageTips(this, 'success', '保存成功!')
              }
              resolve(true)
            }).catch(rej => {
              if (!val) {
                this.$messageTips(this, 'error', '保存失败!')
              }
              resolve(false)
            })
          } else {
            resolve(false)
          }
        })
      })
    }
  },
  created () {
    this.comInsCountFn()
    this.getOptions()
    medicalinsuexportapi.getClinicInfo().then(result => {
      this.obj.name = result.data.name
    })
    if (this.$route.params.id) {
      this.$ever.getFieldFromSchema(this.querySchema, 'discountsMode').props.options = this.options.modes
      this.list().then(res => {
        this.tableData = res.details
        this.totalCount = res.totalCount
        this.obj.masterName = res.masterName
        this.obj.validDateEnd = res.validDateEnd
        this.obj.validDateStart = res.validDateStart
      })
    }
  }
}
</script>
