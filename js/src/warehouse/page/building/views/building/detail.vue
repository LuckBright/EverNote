<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" path="/warehouse/building/list"></ever-bread-crumb>
    <div class="layout_inner oa">
      <ever-form2
        v-model="form"
        ref="form"
        :schema="schema"
        :rules="rules"
        label-width="150px"
      >
        <template>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
          </el-col>
        </template>
        <template slot="photo">
<!--          <ever-upload class="building-uploader" :upload-attrs="uploadAttrs">-->
<!--            <img v-if="form.photo" :src="form.photo" class="avatar" alt="图片">-->
<!--            <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--          </ever-upload>-->
          <ever-upload :upload-attrs="uploadAttrs">
            <i class="el-icon-plus"></i>
          </ever-upload>
        </template>
        <template slot="usableArea">
          <el-input placeholder="使用面积" v-model="form.usableArea">
            <template slot="append">平方米</template>
          </el-input>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import {buildingSchema, buildingRules} from '@/warehouse/page/building/views/building/model'
  import '@/warehouse/page/building/assets/index.less'
  import {dateFormat} from '@/util/common'
  const schema = buildingSchema
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.completionDate = ''
      const me = this
      return {
        schema,
        form,
        rules: buildingRules,
        id: null,
        type: '',
        uploadAttrs: {
          accept: '.png,.jpg,.jpeg',
          multiple: true,
          fileList: [],
          showFileList: true,
          'list-type': 'picture-card',
          onSuccess (res, file, files) {
            if (res.head.errCode === 0) {
              me.form.photo = me.getFiles(files).join('_')
            }
          },
          onRemove (file, files) {
            // 重新获取photo的值
            me.form.photo = me.getFiles(files).join('_')
          },
        },
      }
    },
    created () {
      this.id = this.$route.params.id
      this.type = this.$route.params.type
      if (this.type === 'create') {
      } else {
        this.search()
        this.schema.find(item => item.name === 'buildingCode').props.disabled = true
      }
    },
    methods: {
      getFiles (files) {
        return files.map(item => {
          if (item.response) {
            if (item.response.data && item.response.data.fileId) {
              return item.response.data.fileId
            }
            return item.response.data[Object.keys(item.response.data)[0]].fileId
          } else if (item.url) {
            return item.url.slice(item.url.lastIndexOf('=') + 1)
          }
        })
      },
      search () {
        request(urlMap.building.getById, {id: this.id}).then(res => {
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            if (this.form.completionDate) {
              this.form.completionDateProp = new Date(this.form.completionDate)
            }
            if (this.form.photo) {
              this.uploadAttrs.fileList = this.form.photo.split('_').map(item => {
                return {
                  url: `${this.$ever.fileUrl2}${item}`,
                  name: '',
                }
              })
            }
          }
        })
      },
      save () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            const params = Object.assign({}, this.form)
            params.completionDate = params.completionDateProp ? dateFormat(params.completionDateProp, 'YYYY-MM-DD') : ''
            if (!params.completionDate) {
              delete params.completionDate
            }
            request(urlMap.building[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                this.$router.push({name: 'building-list'})
              }
            })
          }
        })
      },
    },
  }
</script>
