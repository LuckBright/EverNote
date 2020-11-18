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
              <template slot="contentUrl">
                <el-col>
                  <el-form-item>
                    <ever-upload1 v-model="queryObj.contentUrl" type="doc" accept=".txt" upload-txt="上传TXT文件"></ever-upload1>
                    <!-- <ever-upload ref="upload" :upload-attrs="uploadContentAttrs" btn-txt="上传TXT文件"></ever-upload> -->
                  </el-form-item>
                </el-col>
              </template>
              <template slot="scriptContentUrl">
                <el-col>
                  <el-form-item>
                    <ever-upload1 v-model="queryObj.scriptContentUrl" type="doc" accept=".txt" upload-txt="上传TXT文件"></ever-upload1>
                    <!-- <ever-upload ref="upload" :upload-attrs="uploadScriptContentAttrs" btn-txt="上传TXT文件"></ever-upload> -->
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
  import {rulesTemplateTypeList, rulesTemplateEngineTypeList, rulesTemplateScriptTypeList} from './model'
  const querySchema = [
    {
      name: 'name',
      label: '模板名称',
      span: 24
    },
    {
      name: 'engineType',
      label: '引擎类型',
      comp: 'select',
      props: {
        options: rulesTemplateEngineTypeList
      },
      parentClass: 'w',
      span: 24
    },
    {
      name: 'type',
      label: '模板类型',
      comp: 'select',
      parentClass: 'w',
      props: {
        options: rulesTemplateTypeList
      },
      span: 24
    },
    {
      name: 'contentUrl',
      label: '模板内容',
      comp: 'custom',
      span: 24,
    },
    {
      name: 'scriptType',
      label: '脚本类型',
      comp: 'select',
      props: {
        options: rulesTemplateScriptTypeList,
        clearable: true,
      },
      parentClass: 'w',
      span: 24,
    },
    {
      name: 'scriptContentUrl',
      label: '脚本内容',
      comp: 'custom',
      span: 24,
    },
  ]
  const rules = {
    name: {required: true},
    engineType: {required: true},
    type: {required: true},
    contentUrl: {required: true},
  }
  export default {
    data: function () {
      // const me = this
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        querySchema,
        queryObj,
        rules,
        routeId: '',
        // uploadContentAttrs: {
        //   accept: '.txt',
        //   multiple: false,
        //   limit: 1,
        //   'file-list': [],
        //   'on-success' (res) {
        //     if (res.head.errCode === 0) {
        //       me.queryObj.contentUrl = `${me.$ever.fileUrl2}${res.data.fileId}`
        //     }
        //   },
        //   'on-remove' () {
        //     me.queryObj.contenturl = ''
        //   },
        // },
        // uploadScriptContentAttrs: {
        //   accept: '.txt',
        //   multiple: false,
        //   limit: 1,
        //   'file-list': [],
        //   'on-success' (res) {
        //     if (res.head.errCode === 0) {
        //       me.queryObj.scriptContentUrl = `${me.$ever.fileUrl2}${res.data.fileId}`
        //     }
        //   },
        //   'on-remove' () {
        //     me.queryObj.scriptContentUrl = ''
        //   },
        // },
      }
    },
    created () {
      this.pattern = this.$route.params.pattern
      this.routeId = this.$route.params.id
      this.querySchema.find(item => item.name === 'engineType').props.disabled = this.pattern === 'edit'
      this.querySchema.find(item => item.name === 'type').props.disabled = this.pattern === 'edit'
      if (this.routeId) {
        this.search()
      }
    },
    methods: {
      search () {
        request(urlMap.rulesTemplate.getById, {id: this.routeId}, 'get').then(res => {
          if (res.head.errCode === 0) {
            this.queryObj = res.data
            // this.uploadContentAttrs['file-list'] = [
            //   {
            //     name: '模板文件',
            //     url: res.data.contentUrl
            //   }
            // ]
            // this.uploadScriptContentAttrs['file-list'] = [
            //   {
            //     name: '脚本文件',
            //     url: res.data.scriptContentUrl
            //   }
            // ]
          }
        })
      },
      save: debounce(function () {
        this.$refs.form.$refs.form.validate(valid => {
          if (!valid) {
            if (!this.queryObj.contentUrl) {
              this.$messageTips(this, 'error', '请上传模板内容')
            }
            return
          }
          request(urlMap.rulesTemplate[this.pattern === 'create' ? 'create' : 'modify'], {
            ...this.queryObj,
          }).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.$router.push('/systemset/rulesTemplate')
            }
          })
        })
      }, 200),
      back () {
        this.$router.push('/systemset/rulesTemplate')
      },
    },
  }
</script>
<style scoped lang="less">
</style>
