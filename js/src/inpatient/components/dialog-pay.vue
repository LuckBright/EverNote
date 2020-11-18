<template>
  <el-dialog title="补费" :visible.sync="flag" class="dialog-medical ui_dialog_02" id="pay">
    <span slot="title">
      <strong>补费</strong>
    </span>
    <h4 class='pay_after'>新增补费</h4>
    <div>
        <!-- <el-row style='margin-bottom:10px;'>
            <el-col :span="10"><div><i style='color:red;'>*</i>项目</div></el-col>
            <el-col :span="10"><div><i style='color:red;'>*</i>数量</div></el-col>
        </el-row> -->
      <el-row class='ipt_fee'>
        <ever-form2
          :schema="schema"
          v-model="obj"
          :api="api"
          ref="form"
          :rules="rules"
          label-position="center">
          <!-- <template slot="program">
             <el-col :span='4'>
              <div style='display:inline-block;'><i style='color:red;'>*</i>项目</div>
               </el-col>
               <el-col :span='20'>
              <el-select
                class='bedFee'
                v-model="obj.program"
                filterable
                remote
                clearable
                placeholder="选择费用"
                :remote-method="remoteMethod"
                @change="handleSelectionChange"
                >
                <el-option
                  v-for="item in items"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
               </el-col>
          </template> -->
          <template slot="count">
            <el-col :span='20'>
              <el-input v-model="obj.count" placeholder="请输入数量"  type="number"
            onkeypress="return ((event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))"></el-input>
            </el-col>
          </template>
          <template slot="default">
            <el-col :span='4'>
              <el-form-item class='submit_fee'>
                <el-button type="primary" size='small' @click="submitForm()">提交</el-button>
              </el-form-item>
            </el-col>
          </template>
        </ever-form2>
      </el-row>
    </div>
    <h4 class='pay_after'>补费项目</h4>
    <div class='feeList'>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="id" label="序号" align='center' width='100'></el-table-column>
        <el-table-column prop="adviceName" label="项目" align='center'></el-table-column>
        <el-table-column prop="name" label="时间" align='center'>
          <template slot-scope="scope">
            <span v-if= 'scope.row.createTime' >{{$moment(scope.row.createTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="费用" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.price * scope.row.count}}</span>元
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" align='center'>
        </el-table-column>
        <el-table-column prop="name" label="操作" align='center'>
          <template slot-scope="scope">
            <el-button type="info" plain size="small" @click="cancel(scope.row)">撤回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import api from '../store/paycostapi'
  let schema = [
    {
      name: 'program',
      label: '项目',
      span: 8,
      comp: 'el-select',
      props: {
        filterable: true,
        valueKey: 'id',
        options: []
      }
    },
    {
      name: 'count',
      label: '数量',
      span: 10,
      comp: 'custom'
    }
  ]
  export default {
    props: ['visible', 'objMessage'],
    data () {
      var validatenum = (rule, value, callback) => {
        if (value > 0 && value < 100) {
          callback()
        } else {
          callback(new Error('请输入1到99的数字'))
        }
      }
      let obj = this.$ever.createObjFromSchema(schema)
      obj.count = '1'
      // obj.program = '床位费 '
      return {
        queryName: null,
        items: [],
        // serviceItem: {},
        api,
        schema,
        tableData: [],
        num: '',
        obj,
        remoteMethod: this.queryBedfee,
        flag: false,
        areaSelectFlag: true,
        rules: {
          program: [
            {required: true, message: '必填项', trigger: 'blur', type: 'object'}
          ],
          count: [
            {required: true, message: '必填项', trigger: 'blur'},
            { validator: validatenum }
          ]
        }
      }
    },
    created () {
    },
    methods: {
      queryBedfee (query) {
        if (!query) {
          return
        }
        query = query && query.trim()
        api.getBedfee({name: query, hospitalizedNumber: this.objMessage.hospitalizedNumber}).then(rs => {
          if (rs && rs.list) {
            this.items = rs.list
          }
        })
      },
      handleSelectionChange (select) {
        select = this.items.filter(v => {
          return v.name === select
        })[0]
        if (!select) {
          return
        }
        this.serviceItem = select
      },
      getBedfee () {
        api.getBedfee({name: '', hospitalizedNumber: this.objMessage.hospitalizedNumber}).then(rs => {
          if (rs && rs.list) {
            this.$ever.getFieldFromSchema(schema, 'program').props.options = rs.list.map(v => {
              return {
                name: v.name,
                value: v
              }
            })
            this.items = rs.list
          }
        })
      },
      close () {
        this.flag = false
      },
      submitForm () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            let sendData = [{
              termType: 1,
              serviceItem: JSON.stringify(this.obj.program),
              serviceId: this.obj.program.id,
              count: this.obj.count,
              price: this.obj.program.price,
              providerId: this.objMessage.providerId,
              patientId: this.objMessage.patientId,
              hospitalizedNumber: this.objMessage.hospitalizedNumber
            }]
            api.createFee(sendData).then(rs => {
              if (rs.head.errCode === 0) {
                this.$notify({
                  type: 'success',
                  message: '提交成功'
                })
                this.obj.count = '1'
                this.obj.program = ''
                this.items = []
                this.getFeeList()
              }
            })
          }
        })
      },
      cancel (val) {
        this.$confirm('您确定要撤回此费用吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api.cancelFee({id: val.id}).then(rs => {
            if (rs.head.errCode === 0) {
              this.$notify({
                type: 'success',
                message: '撤回成功'
              })
              this.getFeeList()
              this.obj.program = JSON.parse(val.serviceItem)
              this.obj.count = String(val.count)
            }
          })
        }).catch(() => {
          return false
        })
      },
      getFeeList () {
        api.getFeelist({hospitalizedNumber: this.objMessage.hospitalizedNumber}).then(rs => {
          if (rs && rs.data) {
            this.tableData = rs.data
          }
        })
      }
    },
    watch: {
      'visible' (val) {
        this.flag = val
        this.getBedfee()
        this.getFeeList()
      },
      'flag' (val) {
        this.$emit('update:visible', val)
      },
      'obj.program' (val) {
        if (val) {
          val = String(val)
        }
      },
      'obj.count' (val) {
        if (val) {
          val = String(val)
        }
      }
    }
  }
</script>
<style scoped>
  .cBlue{color: #1c78ef}
  .el-select-dropdown__item.selected .cBlue{color: #fff}
  .cBlue{color: #1c78ef}
  .cRed{color:#d00;}
  #pay .fee_ipt{margin-bottom:14px;}
  .bedFee .el-input {width:260px;}
  .bedFee input {width:260px;}
  #pay .el-select-dropdown{min-width:260px!important;}
  #pay .feeList{height: 300px;overflow-y: scroll;}
  #pay .feeList{height: 200px;overflow-y: scroll;margin-bottom:10px;}
  #pay .el-table{margin:0px 0px;}
  #pay .pay_after:before{content: ''; width: 0;height: 90%;border-left: 3px solid #1C7BEF;margin-right: 10px;}
</style>
