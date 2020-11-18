<template>
  <el-popover
    v-model="visible"
    placement="right"
    title=""
    width="270"
    @show="visible=true"
    trigger="click">
    <el-form :model="form" :rules="rules" ref="resourceForm">   
      <el-form-item prop="resourceId">
        <el-select v-model="resource" placeholder="请选择资源" filterable remote value-key="id" :remote-method="remoteMethod" style="width:100%">
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>      
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveResource">确定</el-button>
        <el-button type="" @click="visible=false">取消</el-button>
      </el-form-item>
    </el-form>
    <el-button slot="reference" type="text">添加资源</el-button>
  </el-popover>  
</template>
<script>
  import api from '@/arrange/store/settingapi'
  import deptCascader from '@/arrange/page/scheduling/deptcascader'
  export default {
    props: ['organId', 'templateId', 'deptId', 'code', 'resourceList'],
    data () {
      let checkResource = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择添加资源'))
        }
        let obj = this.resourceList.filter(item => {
          return item.resourceId === this.form.resourceId
        })

        if (obj[0]) {
          return callback(new Error('资源存在不能重复添加'))
        }
        callback()
      }
      return {
        api,
        visible: false,
        list: [],
        resource: '',
        selectDept: '',
        form: {
          templetId: this.templateId,
          organId: this.organId,
          deptId: this.deptId,
          resourceId: ''
        },
        querySearchSymptom: {organId: '', deptId: '', resourceType: '', resourceName: ''},
        rules: {
          resourceId: [
            {validator: checkResource, trigger: 'change'}
          ],
          deptId: [
            {required: true, message: '请选择科室', trigger: 'change'}
          ]
        }
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.resource = ''
        }
      },
      resource (val) {
        this.form.resourceId = val ? val.id : ''
      },
      organId (val) {
        this.form.organId = val
      },
      templateId (val) {
        this.form.templetId = val
        this.getResourceList()
      },
      deptId (val) {
        this.form.deptId = val
        this.getResourceList()
      }
    },
    methods: {
      getResourceList () {
        if (this.templateId && this.organId && this.deptId) {
          this.querySearchSymptom = Object.assign(this.querySearchSymptom, this.form)
          this.querySearchSymptom.resourceType = this.code
          this.api.getResourceList(this.querySearchSymptom).then(rs => {
            this.list = rs.data.resultList.map(item => {
              return {
                id: item.id,
                name: item.resourceName
              }
            })
          })
        }
      },
      saveResource () {
        this.$refs.resourceForm.validate(valid => {
          if (valid) {
            this.api.addWeekResource(this.form).then(rs => {
              if (rs.head.errCode) {
                return false
              }
              this.visible = false
              this.$emit('success', true)
            })
          }
        })
      },
      remoteMethod (query) {
        if (query) {
          this.querySearchSymptom.resourceName = query
          this.getResourceList()
        } else {
          this.list = []
        }
      }
    },
    components: {
      deptCascader
    }
  }
</script>
<style scoped>
  .el-icon-circle-plus{font-size: 20px; color: #1c7bef; position: absolute; top: 50%; margin-top: -10px; left: 50%; margin-left: -10px;}
  .arrange{padding: 0; margin: 0; list-style: none;}
  .arrange li {height: 40px; line-height: 40px; border-bottom: 1px solid #ddd; cursor: pointer;}
  .arrange li:last-child {border-bottom: none;}
</style>
