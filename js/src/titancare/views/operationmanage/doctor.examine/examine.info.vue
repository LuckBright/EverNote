<template>
  <div>
    <div class="more_container">
      <div class="more_l">
        <ever-form2
          :schema="moreLSchema"
          v-model="moreLQueryObj"
          :hideRequiredAsterisk="showrequire"
          :api="api"
          :rules="rulesL"
          labelWidth="150px"
          ref="formL"
          label-position="right"
        >
          <template slot="sex">
            <el-radio v-model="moreLQueryObj.sex" label="1">男</el-radio>
            <el-radio v-model="moreLQueryObj.sex" label="2">女</el-radio>
          </template>
          <template slot="orgId">
            <el-select
              v-model="moreLQueryObj.orgId"
              @change="getKsList"
              filterable
              value-key="name"
            >
              <el-option
                v-for="item in options.orgOptions"
                :key="item.orgId"
                :value="item"
                :label="item.name"
              ></el-option>
            </el-select>
          </template>
          <template slot="deptId">
            <el-select v-model="moreLQueryObj.deptId" filterable value-key="tenantSubjectName">
              <el-option
                v-for="item in options.deptOptions"
                :key="item.id"
                :value="item"
                :label="item.tenantSubjectName"
              ></el-option>
            </el-select>
          </template>
          <template slot="label">
            <el-select
              v-if="data.status === 1"
              v-model="moreLQueryObj.label"
              multiple
              filterable
              allow-create
              default-first-option
              @change="changeInfoText"
              value-key="code"
              placeholder="请选择标签">
              <el-option
                v-for="item in options.labelOptions"
                :key="item.code"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
            <template v-else>
              <el-tag
                v-for="(item, index) in moreLQueryObj.label"
                :key="index"
                class="mr5"
              >{{item.name}}</el-tag>
            </template>
          </template>
          <template slot="default"><div></div></template>
        </ever-form2>
      </div>
      <div class="more_r">
        <ever-form2
          :schema="moreRSchema"
          v-model="moreRQueryObj"
          :hideRequiredAsterisk="showrequire"
          :api="api"
          :rules="rulesR"
          labelWidth="120px"
          ref="formR"
          label-position="right"
        >
          <template slot="idCardFile">
            <ever-upload1 v-model="moreRQueryObj.idCardFile" :limit="3" @success="handleSuccess"></ever-upload1>
          </template>
          <template slot="certFile">
            <ever-upload1 v-model="moreRQueryObj.certFile" :limit="3" @success="handleSuccess"></ever-upload1>
          </template>
          <template slot="pracFile">
            <ever-upload1 v-model="moreRQueryObj.pracFile" :limit="3" @success="handleSuccess"></ever-upload1>
          </template>
          <template slot="gradFile">
            <ever-upload1 v-model="moreRQueryObj.gradFile" :limit="3" @success="handleSuccess"></ever-upload1>
          </template>
          <template slot="avatarPic">
            <ever-upload1 :max-size="1" v-model="moreRQueryObj.avatarPic" :limit="1" @success="handleSuccess"></ever-upload1>
          </template>
          <template slot="breastpieceFile">
            <ever-upload1 v-model="moreRQueryObj.breastpieceFile" :limit="3" @success="handleSuccess"></ever-upload1>
          </template>
          <template slot="default"><div></div></template>
        </ever-form2>
      </div>
    </div>
    <div style="margin:20px 0 0 140px;">
      <el-button :disabled="data.status!==1" type="primary" @click="adopt(1, 2)">通过</el-button>
      <el-button :disabled="data.status!==1" @click="adopt(2, 2)">通过并打开下一个</el-button>
      <el-button :disabled="data.status!==1" @click="dialogFormVisible = true">驳回</el-button>
    </div>
    <el-dialog title="驳回原因" :visible.sync="dialogFormVisible" width="30%">
      <el-input v-model.trim="refusedReason" :rows="4" type="textarea"></el-input>
      <div style="margin-top: 10px;text-align: right;">
        <span style="color:red;">* 必填项</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from '@/titancare/api/operation/index'
  // import TagsTab from './tags'
  let moreLSchema = [
    {
      name: 'name',
      label: '姓名'
    },
    {
      name: 'birthday',
      label: '出生日期',
      comp: 'el-date-picker',
      props: {
        type: 'date',
        format: 'yyyy-MM-dd'
      }
    },
    {
      name: 'idCard',
      label: '身份证'
    },
    {
      name: 'sex',
      label: '性别',
      comp: 'custom'
    },
    {
      name: 'titleCode',
      label: '职称',
      comp: 'el-select',
      props: {
        options: [],
        placeholder: '职称',
        filterable: true
      }
    },
    {
      name: 'pracHospital',
      label: '医师执业证医院'
    },
    {
      name: 'pracRecDate',
      label: '医师执业证发证时间',
      comp: 'el-date-picker',
      props: {
        type: 'date',
        format: 'yyyy-MM-dd'
      }
    },
    {
      name: 'pracDpt',
      label: '医师执业证执业科室',
      comp: 'el-select',
      props: {
        options: [],
        placeholder: '医师执业证执业科室',
        filterable: true
      }
    },
    {
      name: 'certOrg',
      label: '医师资格证发证机构'
    },
    {
      name: 'certRecDate',
      label: '医师资格证发证时间',
      comp: 'el-date-picker',
      props: {
        type: 'date',
        format: 'yyyy-MM-dd'
      }
    },
    {
      name: 'certDpt',
      label: '医师资格证发证科室',
      comp: 'el-select',
      props: {
        options: [],
        placeholder: '医师资格证发证科室',
        filterable: true
      }
    },
    {
      name: 'gradSchool',
      label: '毕业院校'
    },
    {
      name: 'gradRecDate',
      label: '毕业发证时间',
      comp: 'el-date-picker',
      props: {
        type: 'date',
        format: 'yyyy-MM-dd'
      }
    },
    {
      name: 'gradProf',
      label: '毕业专业'
    },
    {
      name: 'label',
      label: '标签',
      comp: 'custom'
    },
    {
      name: 'orgId',
      label: '申请执业医院科室',
      comp: 'custom',
      span: 14,
      labelWidth: '150px'
    },
    {
      name: 'deptId',
      comp: 'custom',
      span: 10,
      labelWidth: '5px'
    },
    {
      name: 'introduce',
      label: '介绍',
      props: {
        type: 'textarea'
      }
    }
  ]
  let moreRSchema = [
    {
      name: 'idCardFile',
      label: '身份证',
      comp: 'custom'
    },
    {
      name: 'certFile',
      label: '医师资格证',
      comp: 'custom'
    },
    {
      name: 'pracFile',
      label: '医师执业证',
      comp: 'custom'
    },
    {
      name: 'gradFile',
      label: '毕业证',
      comp: 'custom'
    },
    {
      name: 'avatarPic',
      label: '头像',
      comp: 'custom'
    },
    {
      name: 'breastpieceFile',
      label: '工作证',
      comp: 'custom'
    }
  ]
  export default {
    components: {
      // TagsTab
    },
    data () {
      let moreLQueryObj = this.$ever.createObjFromSchema(moreLSchema)
      let moreRQueryObj = this.$ever.createObjFromSchema(moreRSchema)
      moreLQueryObj.certDpt = ''
      moreLQueryObj.pracDpt = ''
      moreLQueryObj.label = []

      let orgIdAndDeptId = (rule, values, callback) => {
        if (!values.id) {
          callback(new Error('必填项'))
        } else {
          callback()
        }
      }
      let rulesL = {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        birthday: [
          { required: true, message: '必填项', trigger: ['blur'] }
        ],
        idCard: [
          { required: true, message: '必填项', trigger: 'blur' },
          { pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确身份证号', trigger: ['blur'] }
        ],
        sex: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        titleCode: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        pracHospital: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        pracRecDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        pracDpt: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        certOrg: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        certRecDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        certDpt: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        // gradSchool: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // gradRecDate: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        // gradProf: [
        //   { required: true, message: '必填项', trigger: 'blur' }
        // ],
        tenantId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        orgId: [
          { validator: orgIdAndDeptId, message: '必填项', trigger: 'change' }
        ],
        deptId: [
          { validator: orgIdAndDeptId, message: '必填项', trigger: 'change' }
        ],
        label: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
      let rulesR = {
        idCardFile: [
          { required: true, message: '上传身份证', trigger: 'change' }
        ],
        certFile: [
          { required: true, message: '请上传医师资格证照片', trigger: 'change' }
        ],
        // pracFile: [
        //   { required: true, message: '请上传医师执业证照片', trigger: ['blur'] }
        // ],
        // gradFile: [
        //   { required: true, message: '请上传毕业证照片', trigger: ['blur'] }
        // ],
        avatarPic: [
          { required: true, message: '请上传头像', trigger: 'change' }
        ]
      }
      return {
        moreRQueryObj,
        moreRSchema,
        moreLQueryObj,
        moreLSchema,
        rulesL,
        rulesR,
        api,
        fileArr: {
          pracFile: [], // 医师执业证
          idCardFile: [], // 身份证
          gradFile: [], // 毕业证
          certFile: [], // 医师资格证
          avatarPic: [], // 头像
          breastpieceFile: [] // 胸卡
        },
        showrequire: false,
        moreBtn: false,
        activeName: 'first',
        tagData: [],
        options: {
          orgOptions: [],
          deptOptions: [],
          labelOptions: []
        },
        dialogFormVisible: false,
        refusedReason: '',
        labelList: []
      }
    },
    props: ['data'],
    methods: {
      handleSuccess (dat) {
      },
      adopt (type, status) {
        /**
         *  status 1,2 --> 通过，通过并下一个 需要校验
         *  3，驳回， 不需要校验
         * */
        if (status !== 3) {
          let flag = this.initObj()
          if (!flag) return
        }

        let objInfo = Object.assign({}, this.moreLQueryObj)
        objInfo.idCardFile = this.fixImgUrl(this.moreRQueryObj.idCardFile.split(','))
        objInfo.pracFile = this.fixImgUrl(this.moreRQueryObj.pracFile.split(','))
        objInfo.gradFile = this.fixImgUrl(this.moreRQueryObj.gradFile.split(','))
        objInfo.certFile = this.fixImgUrl(this.moreRQueryObj.certFile.split(','))
        objInfo.breastpieceFile = this.fixImgUrl(this.moreRQueryObj.breastpieceFile.split(','))

        objInfo.label = objInfo.label.map(item => {
          if (item.code) {
            return item.code
          } else {
            let list = this.labelList.filter(i => i.name === item)
            return list[0].code
          }
        }).join(',')
        let theNextPara = {
          mobileOrUserName: this.$route.query.mobileOrUserName,
          index: this.$route.query.index,
          offset: this.$route.query.offset,
          pagesize: this.$route.query.pagesize,

          applyTimeEnd: this.$route.query.applyTimeEnd,
          applyTimeStart: this.$route.query.applyTimeStart,

          tenantId: this.$route.query.tenantId,
          status: this.$route.query.status,
          applyTimeArr: this.$route.query.applyTimeArr
        }
        objInfo.id = this.$route.query.id
        objInfo.theNextPara = theNextPara
        objInfo.status = status
        objInfo.refusedReason = this.refusedReason

        objInfo.orgId = this.moreLQueryObj.orgId ? this.moreLQueryObj.orgId.id : ''
        objInfo.orgName = this.moreLQueryObj.orgId ? this.moreLQueryObj.orgId.name : ''
        objInfo.deptId = this.moreLQueryObj.deptId ? this.moreLQueryObj.deptId.id : ''
        objInfo.deptName = this.moreLQueryObj.deptId ? this.moreLQueryObj.deptId.tenantSubjectName : ''
        objInfo.deptCode = this.moreLQueryObj.deptId ? this.moreLQueryObj.deptId.id : ''

        objInfo.avatarPic = this.moreRQueryObj.avatarPic
        api.checkCertDoctor(objInfo).then(rs => {
          if (!rs.errCode) {
            this.$notify({
              message: '成功',
              type: 'success'
            })
            if (type === 1) {
              // this.$router.go(-1)
              this.$router.push({ path: '/titancare/operation/doctor', query: this.$route.query })
            } else { // 通过并打开下一个
              const tempQuery = JSON.parse(JSON.stringify(this.$route.query))
              tempQuery.id = rs.nextId
              this.$router.replace({ path: '/titancare/operation/doctor/doctordetails', query: tempQuery })
              this.scrolltop() // 返回顶部
            }
          } else {
            this.$notify({
              message: '审核失败',
              type: 'error'
            })
          }
        })
      },
      fixImgUrl (arr) {
        arr = arr.map(item => {
          return (item.indexOf('fileId=') > 0) ? item.substr(item.indexOf('fileId=') + 7) : item
        })
        return arr
      },
      initObj () {
        this.titleFormValid = false
        this.$refs.formL.$refs.form.validate((valid) => {
          if (valid) {
            this.titleFormValid = true
          }
        })
        this.customFormValid = false
        this.$refs.formR.$refs.form.validate((valid) => {
          if (valid) {
            this.customFormValid = true
          }
        })
        if (this.titleFormValid && this.customFormValid) {
          return true
        } else {
          return false
        }
      },
      reject () {
        if (this.refusedReason) {
          this.adopt(1, 3)
        } else {
          this.$notify({
            title: '警告',
            message: '驳回原因不能为空',
            type: 'warning'
          })
        }
      },
      initOptions () {
        api.getTitleCodeTwo().then(rs => {
          if (!rs.errCode) {
            this.$ever.getFieldFromSchema(this.moreLSchema, 'titleCode').props.options = rs.data
          }
        })
        api.getValueListBySetCode().then(rs => {
          if (!rs.errCode) {
            rs.data.resultList.forEach(item => {
              item.label = item.name
            })
            this.$ever.getFieldFromSchema(this.moreLSchema, 'certDpt').props.options = rs.data.resultList
            this.$ever.getFieldFromSchema(this.moreLSchema, 'pracDpt').props.options = rs.data.resultList
          }
        })
        let params = {
          offset: 0,
          pagesize: 9999
        }
        api.getOrgListByCondition(params).then(res => {
          if (!res.errCode) {
            this.options.orgOptions = res.data.resultList
          }
        })
      },
      assignInfo (json, obj) {
        api.getValueSetItemsForWeb({ setCode: 'THC_STAFF_INFOTEXT' }).then(res => {
          if (!res.errCode) {
            let list = []
            res.data.forEach(item => {
              let obj = {}
              obj.name = item.name
              obj.code = item.code
              list.push(obj)
            })
            this.options.labelOptions = [...list]
          }
          for (let key in obj) {
            // 判断是否是标签
            if (key === 'label') {
              if (json[key] && json[key].length) {
                let list = json[key]
                let newList = []
                // 通过code在集合中找出对应名字， 否则直接返回
                list.forEach(items => {
                  let arr = this.options.labelOptions.filter(item => {
                    if (item.code === items) return item
                  })
                  if (arr.length) {
                    newList.push(...arr)
                  } else {
                    newList.push({ name: items })
                  }
                })
                obj[key] = newList
              }
            } else {
              obj['deptId'] = {
                id: json['deptId'],
                tenantSubjectName: json['deptName']
              }
              obj['orgId'] = {
                id: json['orgId'],
                name: json['orgName']
              }
              obj[key] = json[key]
            }
          }
        })
      },
      getKsList (obj, isFirst) {
        if (!isFirst) this.moreLQueryObj.deptId = ''
        let params = {
          orgIdList: [obj.id],
          offset: 0,
          pagesize: 9999
        }
        api.getSections(params).then(res => {
          if (!res.errCode) {
            this.options.deptOptions = res.data.resultList
          }
        })
      },
      scrolltop () {
        let doc = document.getElementById('examine-box')
        doc.parentElement.scrollTop = 0
      },

      // getTagInfo () {
      //   api.getValueSetItemsForWeb({ setCode: 'THC_STAFF_INFOTEXT' }).then(res => {
      //     if (!res.errCode) {
      //       let list = []
      //       res.data.forEach(item => {
      //         let obj = {}
      //         obj.name = item.name
      //         obj.code = item.code
      //         list.push(obj)
      //       })
      //       this.options.labelOptions = [...list]
      //     }
      //   })
      // },

      // 标签选中
      changeInfoText (val) {
        // 生成code
        function S4 () {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        function GENERATE_UUID () {
          return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
        }

        const newItemList = val.filter(v => !v.code && !this.labelList.some(item => item.name === v))
        if (newItemList.length) {
          let code = GENERATE_UUID()
          this.labelList.push({ code, name: newItemList[0] })
          api.createValueSetItem({ name: newItemList[0], code, setCode: 'THC_STAFF_INFOTEXT' })
        }
      }
    },
    created () {
      this.initOptions()
    },
    watch: {
      data: {
        handler: function (val) {
          if (val) {
            this.assignInfo(val, this.moreRQueryObj)
            this.assignInfo(val, this.moreLQueryObj)
            let obj = { id: val.tenantId }
            this.getKsList(obj, true)
          }
        },
        immediate: true
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-button--mini {
    padding: 5px;
  }
  .more_container {
    display: flex;
    .more_l {
      flex: 1;
      border-right: 2px solid #e4e7ed;
      border-bottom: 2px solid #e4e7ed;
      padding: 20px 20px 0 0;
      & /deep/ .el-input {
        width: 100%;
      }
      & /deep/ .el-select {
        width: 100%;
      }
      & /deep/ textarea {
        padding: 5px;
      }
    }
    .more_r {
      flex: 1;
      padding: 20px 20px 0 0;
      border-bottom: 2px solid #e4e7ed;
      // & /deep/ .el-row .el-col label::before {
      //   content: "*";
      //   color: #f56c6c;
      //   margin-right: 4px;
      // }
      /deep/ .el-form .el-row .el-col .el-form-item.is-error .el-form-item__error {
        display: block!important;
      }
    }
  }
</style>
