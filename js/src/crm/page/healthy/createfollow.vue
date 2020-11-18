<template>
  <div class="bg">
    <ever-bread-crumb :name="'新建随访计划'" show-edit-fnt="false" :haveReturn="true"></ever-bread-crumb>
    <div class="layout_inner">
      <el-row class="title">
        <el-col>
          <span class="name">基本信息</span>
        </el-col>
      </el-row>
      <ever-form2
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules"
        ref="addclassify"
        :info="true"
        label-position="left"
      >
        <!-- <div slot="default"></div> -->
        <!-- <template slot="scenes">
          <el-select v-model="obj.scenes" placeholder="请选择" filterable :multiple="true">
            <el-option
              v-for="item in sceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template> -->
      </ever-form2>
      <el-row class="title">
        <el-col>
          <span class="name">触发规则</span>
          <el-checkbox v-model="obj.ruleStatus" class="ml20"></el-checkbox>
          <span>开启</span>
          <span class="col3">(注: 开启则按规则自动为患者创建随访计划)</span>
        </el-col>
      </el-row>
      <el-form label-width="80px">
        <el-row v-for="(temp, index) in rulesArr" :key="index" :index="index">
          <el-col>
            <span style="display: flex">
              <el-form-item
                label="科室"
                :prop="'rulesArr' + index + '.dptId'"
                :rules="[
                          { required: true, message: '请选择科室', trigger: 'click'}
                        ]"
              >
                <el-select v-model="temp.dptId" placeholder="请选择" filterable clearable>
                  <el-option
                    v-for="item in dptOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="场景"
                :prop="'rulesArr.' + index + '.scene'"
                :rules="[
                          { required: true, message: '请选择场景', trigger: 'click'}
                        ]"
              >
                <sys-type code="THC_APPLICABLE_SCENE" v-model="temp.scene" :useValue="true"></sys-type>
              </el-form-item>
              <el-form-item
                label="关联疾病"
                :prop="'rulesArr.' + index + '.diseases'"
                filterable
                :rules="[
                            { required: false, message: '请选择关联疾病', trigger: 'blur'}
                        ]"
              >
                <el-select
                  style="width: 300px"
                  v-model="temp.diseases"
                  placeholder="请选择"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :multiple-limit="20"
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in disOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="margin-left:-60px;">
                <el-button type="text" v-if="index === 0" @click="addrow">
                  <i class="iconfont icon-tianjia"></i>
                </el-button>
                <el-button type="text" v-if="index > 0" @click="delrow(index)">
                  <i class="iconfont icon-delete"></i>
                </el-button>
              </el-form-item>
            </span>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import wapi from '@/warehouse/store/departmentapi'
// import sysvalue from '@/warehouse/store/sysvalueapi'
let schema = [
  {
    name: 'name',
    label: '随访计划名称',
    props: {
      maxlength: 50
    },
    span: 6
  },
  {
    name: 'dptIds',
    label: '适用科室',
    comp: 'ever-select',
    props: {
      options: [],
      multiple: true
    },
    span: 6
  },
  // {
  //   name: 'scenes',
  //   label: '适用场景',
  //   comp: 'custom',
  //   span: 6
  // },
  {
    name: 'comment',
    label: '随访计划说明',
    comp: 'el-input',
    props: {
      type: 'textarea',
      maxlength: 300
    },
    span: 16
  }
]
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.ruleStatus = false
    // obj.scenes = []
    return {
      obj,
      api,
      wapi,
      schema,
      rulesArr: [
        {
          dptId: '',
          scene: '',
          diseases: ''
        }
      ],
      sceOptions: [],
      dptOptions: [],
      disOptions: [],
      list: [],
      loading: false,
      templateId: this.$route.params.id,
      maxLength: 9999, // 产品说无限制
      rules: {
        name: [
          { required: true, message: '请输入随访计划名称', trigger: 'blur' }
        ],
        dptIds: [{ required: true, message: '请选择科室', trigger: 'change' }]
        // scenes: [
        //   { required: true, message: '请选择适用场景', trigger: 'change' }
        // ]
      }
    }
  },
  watch: {
    templateId: {
      handler: function (val) {
        val && this.getByIdModel(val)
      },
      immediate: true
    }
  },
  created () {
    this.getDptlist()
    // this.getSys()
    this.diseaseSearch()
  },
  methods: {
    cancle () {
      this.obj.name = ''
      this.$router.push({ path: '/healthy/followplan' })
    },
    save () {
      this.$refs.addclassify.$refs.form.validate(valid => {
        if (valid) {
          this.obj.dptIds = this.obj.dptIds.join()
          // this.obj.scenes = this.obj.scenes.join()
          if (this.rulesArr) {
            this.rulesArr.filter(item => {
              item.diseases = item.diseases.join()
            })
          }
          this.obj.rules = this.rulesArr.filter(item => {
            return item.dptId && item.scene
          })
          console.log(this.obj.rules)
          api
            .createModel(this.obj)
            .then(rs => {
              if (rs.head.errCode === 0) {
                this.$messageTips(this, 'success', '操作成功')
                this.$router.push({ path: '/healthy/followplan' })
              } else {
                this.obj.dptIds = []
                // this.obj.scenes = []
                this.rulesArr.filter(item => {
                  if (item.diseases.length > 0) {
                    item.diseases = []
                  }
                })
              }
            })
            .catch(rs => {
              this.obj.dptIds = []
              // this.obj.scenes = []
              this.rulesArr.filter(item => {
                if (item.diseases.length > 0) {
                  item.diseases = []
                }
              })
            })
        }
      })
    },
    getDptlist () {
      wapi.dptlist().then(rs => {
        if (rs.length > 0) {
          this.$ever.getFieldFromSchema(
            this.schema,
            'dptIds'
          ).props.options = rs
        }
        this.dptOptions = rs
      })
    },
    addrow () {
      if (this.rulesArr.length < this.maxLength) {
        this.rulesArr.push({
          dptId: '',
          scene: '',
          diseases: ''
        })
      } else {
        this.$messageTips(this, 'warning', '已达到上限')
      }
    },
    delrow (index) {
      this.rulesArr.splice(index, 1)
    },
    diseaseSearch (name) {
      api
        .diseaseSearch({
          type: 2,
          name: name
        })
        .then(rs => {
          if (rs.head.errCode === 0) {
            this.list = rs.data.resultList.map(item => {
              return {
                value: item.diseaseCode + '_' + item.diseaseName,
                label: item.diseaseName
              }
            })
            this.disOptions = this.list
          }
        })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        this.diseaseSearch(query)
        setTimeout(() => {
          this.loading = false
          this.disOptions = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.disOptions = []
      }
    },
    getByIdModel (id) {
      // this.diseaseSearch()
      api.getByIdModel({ id: id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj = rs.data
          this.obj.dptIds = rs.data.dptIds.split(',')
          // this.obj.scenes = rs.data.scenes.split(',')
          this.rulesArr = rs.data.rules
          if (rs.data.rules) {
            rs.data.rules.filter(item => {
              // item.diseases = item.diseases.split(',')
              if (item.diseaseNames) {
                JSON.parse(item.diseaseNames).map(element => {
                  let tempObj = {}
                  tempObj['value'] = element.code
                  tempObj['label'] = element.name
                  this.disOptions.push(tempObj)
                })
                let tempArr = []
                JSON.parse(item.diseaseNames).map(element => {
                  tempArr.push(element.code + '_' + element.name)
                })
                item.diseases = tempArr
              }
            })
          }
        }
      })
    }
    // getSys () {
    //   sysvalue
    //     .list({
    //       code: 'THC_APPLICABLE_SCENE'
    //     })
    //     .then(rs => {
    //       this.sceOptions = rs.map(item => {
    //         return { value: item.value, label: item.name }
    //       })
    //     })
    // }
  }
}
</script>
