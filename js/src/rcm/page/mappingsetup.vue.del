
<template>
  <div>
    <ever-bread-crumb name="映射管理" path="/warehouse/mappingsetups"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基本信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          ref="form"
          :rules="rules"
          labelWidth="140px"
          @objsaved="afterSave"
          label-position="right">
        </ever-form-model>
        <h4 class="panel-hr">
          <el-button style="float:right" size="small" type="primary" @click.native.prevent="addRow()">新增</el-button>
          单位信息
        </h4>
        <el-table
          :data="obj.details"
          style="width: 100%"
          >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="input1value"
            label="输入项1"
            align="center">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.input1value" placeholder="请选择输入项" style="width: 100%">
                <el-option
                  v-for="visit in inputArr[0]"
                  :key="visit.value"
                  :label="visit.label"
                  :value="Number(visit.value)">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="input2value"
            label="输入项2"
            align="center">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.input2value" placeholder="请选择输入项" style="width: 100%">
                <el-option
                  v-for="visit in inputArr[1]"
                  :key="visit.value"
                  :label="visit.label"
                  :value="Number(visit.value)">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="input3value"
            label="输入项3"
            align="center">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.input3value" placeholder="请选择输入项" style="width: 100%">
                <el-option
                  v-for="visit in inputArr[2]"
                  :key="visit.value"
                  :label="visit.label"
                  :value="Number(visit.value)">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="input4value"
            label="输入项4"
            align="center">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.input4value" placeholder="请选择输入项" style="width: 100%">
                <el-option
                  v-for="visit in inputArr[3]"
                  :key="visit.value"
                  :label="visit.label"
                  :value="Number(visit.value)">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="outitemValue"
            label="输出项编码"
            align="center">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.outitemValue" placeholder="请选择输入项" style="width: 100%" @change="changeHandler(scope.row)" filterable>
                <el-option
                  v-for="visit in coaArr"
                  :key="visit.id"
                  :label="visit.accountCode"
                  :value="visit.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="outitemName"
            label="输出项目说明"
            align="center">
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            align="center">
            <template slot-scope="scope">
              <date-picker
                v-model="scope.row.startTime"
                size="small"
                :autoWidth="true"
                :outformat = "'yyyy-MM-dd'">
              </date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间"
            align="center">
            <template slot-scope="scope">
              <date-picker
                v-model="scope.row.endTime"
                size="small"
                :autoWidth="true"
                :outformat = "'yyyy-MM-dd'">
              </date-picker>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            width="200"
            align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click.native.prevent="deleteRow(scope.$index, obj.details)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="submitForm('form')" v-if="!objId">创建</el-button>
        <el-button type="primary" @click="submitForm('form')" v-if="objId">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../store/mappingsetupapi'
  import form from '../../util/form'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import coaaccountapi from '../store/coaaccountapi'
  import storageroomapi from '@/warehouse/store/storageroomapi'
  import departmentapi from '@/warehouse/store/departmentapi'
  import clinicApi from '@/warehouse/store/clinicapi'
  import inoutstocktypeapi from '@/warehouse/store/inoutstocktypeapi'

  var schema = [
    {
      name: 'mapCode',
      label: '映射代码',
      type: 'text',
      min: 1,
      max: 40
    },
    {
      name: 'mapName',
      label: '映射名称',
      type: 'text',
      min: 1,
      max: 40
    },
    {
      name: 'mapExplain',
      label: '映射说明'
    },
    {
      name: 'input1',
      label: '输入项1值集',
      type: 'select',
      options: []
    },
    {
      name: 'input2',
      label: '输入项2值集',
      type: 'select',
      options: []
    },
    {
      name: 'input3',
      label: '输入项3值集',
      type: 'select',
      options: []
    },
    {
      name: 'input4',
      label: '输入项4值集',
      type: 'select',
      options: []
    },
    {
      name: 'output',
      label: '输出项值集',
      type: 'select',
      options: []
    }
  ]
  var details = {
    input1value: '',
    input2value: '',
    input3value: '',
    input4value: '',
    outitemValue: '',
    outitemName: '',
    startTime: '',
    endTime: ''
  }
  export default {
    mixins: [form],
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      obj.id = this.$route.params.id
      obj.details = []
      let arr = ['mapCode', 'mapName']
      if (this.$route.params.id) {
        arr.forEach(function (item) {
          schema.filter(function (v, i) {
            return v.name === item
          })[0].disabled = true
        })
      } else {
        arr.forEach(function (item) {
          schema.filter(function (v, i) {
            return v.name === item
          })[0].disabled = false
        })
      }
      return {
        schema,
        obj: obj,
        api: api,
        objId: this.$route.params.id,
        inputArr: Array(4).fill([]),
        coaArr: [],
        rules: {
          mapCode: [
            { required: true, message: '必填项', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          mapName: [
            { required: true, message: '必填项', trigger: 'blur' },
            { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
          ],
          input1: [
            { required: true, message: '必填项', trigger: 'blur' }
          ],
          output: [
            { required: true, message: '必填项', trigger: 'blur', type: 'number' }
          ]
        }
      }
    },
    created () {
      sysvalue.cascade('THC_RCM_MAPPING_SETUP').then(options => {
        let inputSelectArr = []
        options.forEach(function (item) {
          item.id = item.value
          item.name = item.label
          if (item.id !== '8' && item.id !== '1') {
            inputSelectArr.push(item)
          }
        })
        this.$ever.getFieldFromSchema(this.schema, 'input4').options = inputSelectArr
        this.$ever.getFieldFromSchema(this.schema, 'input3').options = inputSelectArr
        this.$ever.getFieldFromSchema(this.schema, 'input2').options = inputSelectArr
        this.$ever.getFieldFromSchema(this.schema, 'input1').options = inputSelectArr
      })
      coaaccountapi.list({}).then(result => {
        this.$ever.getFieldFromSchema(this.schema, 'output').options = result.data
      })
    },
    methods: {
      changeHandler (val) {
        this.coaArr.forEach(function (item) {
          if (item.id === val.outitemValue) {
            val.outitemName = item.accountName
          }
        })
      },
      afterSave () {
        history.go(-1)
      },
      deleteRow (index, rows) {
        rows.splice(index, 1)
      },
      addRow () {
        this.obj.details.push(Object.assign({}, details))
      },
      returnArr (num, v) {
        if (num === '2') {
          sysvalue.cascade('THC_RCM_PAYMENT_TYPE').then(options => {
            this.$set(this.inputArr, v, options)
          })
        } else if (num === '3') {
          sysvalue.cascade('THC_WH_VENDOR_TYPE').then(options => {
            this.$set(this.inputArr, v, options)
          })
        } else if (num === '4') {
          sysvalue.cascade('THC_RCM_PAYMENT_TYPE').then(options => {
            this.$set(this.inputArr, v, options)
          })
        } else if (num === '5') {
          inoutstocktypeapi.list({}).then(result => {
            let stockArr = []
            result.list.forEach(function (item) {
              item.label = item.activityName
              item.value = item.id
              stockArr.push(item)
            })
            this.$set(this.inputArr, v, stockArr)
          })
        } else if (num === '6') {
          sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(options => {
            let typeArr = []
            options.forEach(function (item) {
              if (item.id > 300 && item.id < 305) {
                item.value = item.code
                item.label = item.name
                typeArr.push(item)
              }
            })
            this.$set(this.inputArr, v, typeArr)
          })
        } else if (num === '7') {
          let roomArr = []
          storageroomapi.list({isInvented: 0}).then(result => {
            result.list.forEach(function (item) {
              item.value = item.id
              item.label = item.name
              roomArr.push(item)
            })
          })
          this.$set(this.inputArr, v, roomArr)
        } else if (num === '9') {
          let departmentArr = []
          departmentapi.list({}).then(result => {
            result.list.forEach(function (item) {
              item.value = item.id
              item.label = item.name
              departmentArr.push(item)
            })
          })
          this.$set(this.inputArr, v, departmentArr)
        } else if (num === '10') {
          let clinicArr = []
          clinicApi.list({}).then(result => {
            result.forEach(function (item) {
              item.value = item.id
              item.label = item.name
              clinicArr.push(item)
            })
          })
          this.$set(this.inputArr, v, clinicArr)
        } else if (num === '11') {
          sysvalue.cascade('THC_WH_OBJECT_TYPE').then(options => {
            this.$set(this.inputArr, v, options)
          })
        }
      }
    },
    watch: {
      'obj.output': {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            if (oldValue !== '') {
              this.obj.details.forEach(function (item) {
                item.outitemValue = ''
                item.outitemName = ''
              })
            }
            coaaccountapi.getAccSheetByIsHost({
              accId: newValue
            }).then(result => {
              this.coaArr = result.data
            })
          }
        }
      },
      'obj.input1': {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            if (oldValue !== '') {
              this.obj.details.forEach(function (item) {
                item.input1value = ''
              })
            }
            this.returnArr(newValue, 0)
          }
        }
      },
      'obj.input2': {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            if (oldValue !== '') {
              this.obj.details.forEach(function (item) {
                item.input2value = ''
              })
            }
            this.returnArr(newValue, 1)
          }
        }
      },
      'obj.input3': {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            if (oldValue !== '') {
              this.obj.details.forEach(function (item) {
                item.input3value = ''
              })
            }
            this.returnArr(newValue, 2)
          }
        }
      },
      'obj.input4': {
        handler (newValue, oldValue) {
          if (newValue !== oldValue) {
            if (oldValue !== '') {
              this.obj.details.forEach(function (item) {
                item.input4value = ''
              })
            }
            this.returnArr(newValue, 3)
          }
        }
      }
    }
  }
</script>
