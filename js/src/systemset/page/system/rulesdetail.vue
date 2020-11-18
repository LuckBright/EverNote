<template>
  <div>
    <ever-bread-crumb></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head oa">
        <el-row>
          <el-col :span="12">
            <ever-form2
              v-model="queryObj"
              ref="form"
              :schema="querySchema"
              :rules="rules"
              label-width="150px"
            >
              <template slot="dataUrl">
                <el-col>
                  <el-form-item>
                    <ever-upload1 v-model="queryObj.dataUrl" type="doc" accept=".xlsx,.xls" :limit="1" @success="handleSuccess" upload-txt="上传EXCEL文件"></ever-upload1>
                    <!-- <ever-upload ref="upload" :upload-attrs="uploadContentAttrs" btn-txt="上传EXCEL文件"></ever-upload> -->
                  </el-form-item>
                </el-col>
              </template>
              <template slot="default">
                <el-col>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="save()">保存</el-button>
                    <el-button size="small" @click="back">返回</el-button>
                  </el-form-item>
                </el-col>
              </template>
            </ever-form2>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import {debounce1 as debounce} from '@/util/common'
  import {request} from '@/util/req'
  import urlMap from '@/systemset/urls'
  import './index.less'
  const querySchema = [
    {
      name: 'sn',
      label: '规则编码',
      props: {},
      span: 24
    },
    {
      name: 'name',
      label: '规则名称',
      span: 24
    },
    {
      name: 'ruleTemplateId',
      label: '选择模板',
      comp: 'select',
      props: {
        options: []
      },
      parentClass: 'w',
      span: 24
    },
    {
      name: 'dataUrl',
      label: '上传文件',
      comp: 'custom',
      span: 24,
    },
  ]
  const rules = {
    sn: {required: true},
    name: {required: true},
    ruleTemplateId: {required: true},
    dataUrl: {required: true},
  }
  export default {
    data: function () {
      // const me = this
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      // queryObj.dataUrl = 'NGBAJ5cGA6bTxlWX37S'
      return {
        querySchema,
        queryObj,
        rules,
        routeId: '',
        rulesTemplateList: [],
        // uploadContentAttrs: {
        //   accept: '.xlsx',
        //   multiple: false,
        //   limit: 1,
        //   'file-list': [],
        //   'on-success' (res) {
        //     if (res.head.errCode === 0) {
        //       me.queryObj.dataUrl = `${me.$ever.fileUrl2}${res.data.fileId}`
        //     }
        //   },
        //   'on-remove' () {
        //     me.queryObj.dataUrl = ''
        //   },
        // },
      }
    },
    created () {
      this.pattern = this.$route.params.pattern
      this.routeId = this.$route.params.id
      this.querySchema.find(item => item.name === 'sn').props.disabled = this.pattern === 'edit'
      this.searchRulesTemplateList()
      if (this.routeId) {
        this.search()
      }
    },
    methods: {
      handleSuccess () {},
      searchRulesTemplateList () {
        request(urlMap.rulesTemplate.search, {}, 'get').then(res => {
          this.rulesTemplateList = res.data.resultList
          this.querySchema.find(item => item.name === 'ruleTemplateId').props.options = this.rulesTemplateList
        })
      },
      search () {
        request(urlMap.rules.getById, {id: this.routeId}, 'get').then(res => {
          if (res.head.errCode === 0) {
            this.queryObj = res.data
            // this.uploadContentAttrs['file-list'] = [
            //   {
            //     name: '文件',
            //     url: res.data.dataUrl
            //   }
            // ]
          }
        })
      },
      save: debounce(function () {
        this.$refs.form.$refs.form.validate(valid => {
          if (!valid) {
            if (!this.queryObj.dataUrl) {
              this.$messageTips(this, 'error', '请上传文件')
            }
            return
          }
          request(urlMap.rules[this.pattern === 'create' ? 'create' : 'modify'], {
            ...this.queryObj,
          }).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.$router.push('/systemset/rules')
            }
          })
        })
      }, 200),
      back () {
        this.$router.push('/systemset/rules')
      },
    },
  }
</script>
<style scoped lang="less">
</style>
