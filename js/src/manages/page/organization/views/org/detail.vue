<template>
  <div>
    <ever-bread-crumb :name="orgId === '-1' ? '创建机构' : '编辑机构'"></ever-bread-crumb>
    <div class="layout_inner oa">
      <div class="detail-title">{{orgId === '-1' ? '创建机构' : form.name}}</div>
      <ever-form2
        v-model="form"
        ref="form"
        :schema="schema"
        :rules="rules"
        label-width="160px"
      >
        <template>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
          </el-col>
        </template>
<!--        <template slot="titleBaseInfo">-->
<!--          <div class="form-item-title">基本信息</div>-->
<!--        </template>-->
        <template slot="code">
          <el-input :disabled="codeDisabled" v-model="form.code" class="org-code-input" :placeholder="codeP"></el-input>
          <div class="tenant-code-mask">{{tenantId}}</div>
        </template>
        <template slot="lnglat">
          <ever-map v-if="mapFlag" v-model="form.lnglat"></ever-map>
        </template>
        <template slot="addressJson">
          <ever-address v-model="form.addressJson" @detail="getDetailAddress"></ever-address>
        </template>
        <template slot="photo">
<!--          <ever-upload1 v-model="form.photo" :limit="9"></ever-upload1>-->
          <ever-upload class="org-avatar-uploader tali" :upload-attrs="uploadAttrs">
            <img v-if="form.photo" :src="form.photo" class="avatar" alt="机构" @mouseenter="enterImg = true" @mouseleave="enterImg = false">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="form.photo && (enterImg || enterClose)" title="删除图片" @click="delPhoto" class="el-icon-circle-close" @mouseenter="enterClose = true" @mouseleave="enterClose = false"></i>
          </ever-upload>
        </template>
        <template slot="noteJson1">
          <ever-upload1 v-model="form.noteJson1" :limit="9"></ever-upload1>
          <!-- <ever-upload class="org-avatar-uploader tali" :upload-attrs="uploadAttrs">
            <img v-if="form.photo" :src="form.photo" class="avatar" alt="机构" @mouseenter="enterImg = true" @mouseleave="enterImg = false">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="form.photo && (enterImg || enterClose)" title="删除图片" @click="delPhoto" class="el-icon-circle-close" @mouseenter="enterClose = true" @mouseleave="enterClose = false"></i>
          </ever-upload> -->
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/manages/page/organization/utils/urls'
  import {orgSchema, orgRules} from '@/manages/page/organization/views/org/model'
  import { getCrtPath } from '@/manages/page/organization/utils/fns'
  import storage from '@/util/storage'
  import '@/manages/page/organization/assets/less/index.less'
  import everMap from '../../components/a-map'

  const schema = orgSchema
  export default {
    components: {
      everMap
    },
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.provinceCode = ''
      form.provinceName = ''
      form.provinceEnglishName = ''
      form.cityCode = ''
      form.cityName = ''
      form.cityEnglishName = ''
      form.countyCode = ''
      form.countyName = ''
      form.countyEnglishName = ''
      form.addressInfo = '' // 详细地址
      form.servicesLanguage = []
      form.servicesLanguageCode = ''
      form.servicesLanguageName = ''
      form.servicesLanguageEnglishCode = ''
      form.servicesLanguageEnglishName = ''
      form.lnglat = {
        lng: '',
        lat: ''
      }
      form.enableStatus = 'Y'
      form.photo = ''
      form.noteJson1 = ''
      // form.servicesLanguageEnglish = []
      const me = this
      return {
        schema,
        form,
        rules: orgRules,
        orgId: null,
        tenantId: '',
        type: '',
        pageFrom: '1', // 1 表示从列表过来 2 表示从授权过来 默认为 1
        uploadAttrs: {
          accept: '.png,.jpg,.jpeg',
          multiple: false,
          fileList: [],
          showFileList: false,
          onSuccess (res) {
            if (res.head.errCode === 0) {
              me.form.photo = `${me.$ever.fileUrl2}${res.data.fileId}`
            }
          },
        },
        enterImg: false,
        enterClose: false,
        codeDisabled: false,
        codeP: '请再输入三位数作为机构编码',
        mapFlag: false,
      }
    },
    watch: {
      'form.lnglat': {
        handler (val) {
          this.form.longitude = val.lng || ''
          this.form.latitude = val.lat || ''
        },
        deep: true
      }
    },
    created () {
      this.tenantId = storage.getLocalStorage('TENANTID')
      this.orgId = this.$route.params.orgId
      this.type = this.$route.params.type
      this.pageFrom = this.$route.params.from || '1'
      if (this.type === 'createSub') {
        // 创建子机构，显示父机构名称，根据id查询机构
        this.searchParent([urlMap.org.load, {id: this.orgId}])
      } else if (this.type === 'create') {
        // 创建一级机构 隐藏父级
        this.schema.find(item => item.name === 'parentCode').parentClass = 'dn'
        this.schema.find(item => item.name === 'parentName').parentClass = 'dn'
      } else {
        // this.schema.find(item => item.name === 'code').props.disabled = true
        this.codeDisabled = true
        // 去除必填校验
        this.rules.code = []
        if (this.tenantId === this.orgId) {
          this.codeP = ''
        }
        this.search()
      }
    },
    methods: {
      // 修复图片地址里面有全域名信息的问题
      hackPhotoUrl (urls) {
        let url = urls.split(',')
        let fileUrl = []
        if (url.length) {
          url.map(url => {
            let urllist = url.split('=')
            if (urllist.length) fileUrl.push(urllist[urllist.length - 1])
          })
        }
        return fileUrl.join(',')
      },
      search () {
        request(urlMap.org.load, {id: this.orgId}).then(res => {
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            this.form.addressJson = JSON.stringify({
              province: this.form.provinceCode,
              city: this.form.cityCode,
              county: this.form.countyCode,
              addressDetail: this.form.addressInfo,
            })
            this.form.businessStatus = {
              code: this.form.businessStatusCode,
              name: this.form.businessStatusName,
            }
            if (this.form.servicesLanguageCode) {
              this.form.servicesLanguage = this.form.servicesLanguageCode.split(',').map((item, index) => {
                return {
                  code: item,
                  name: this.form.servicesLanguageName ? this.form.servicesLanguageName.split(',')[index] : '',
                  nameEn: this.form.servicesLanguageEnglishCode ? this.form.servicesLanguageEnglishCode.split(',')[index] : '',
                  attr1: this.form.servicesLanguageEnglishName ? this.form.servicesLanguageEnglishName.split(',')[index] : '',
                }
              })
            }
            this.form.code = this.form.code.replace(this.tenantId, '')
            this.form.lnglat = {
              lng: this.form.longitude,
              lat: this.form.latitude
            }
            this.mapFlag = true
            this.form.enableStatus = this.form.status
            // let servicesLanguage = []
            // try {
            //   servicesLanguage = JSON.parse(this.form.servicesLanguageCode)
            //   if (!Array.isArray(servicesLanguage)) {
            //     servicesLanguage = []
            //   }
            // } catch (e) {
            //   servicesLanguage = []
            // }
            // this.form.servicesLanguage = servicesLanguage
            // let servicesLanguageEnglish = []
            // try {
            //   servicesLanguageEnglish = JSON.parse(this.form.servicesLanguageEnglishCode)
            //   if (!Array.isArray(servicesLanguageEnglish)) {
            //     servicesLanguageEnglish = []
            //   }
            // } catch (e) {
            //   servicesLanguageEnglish = []
            // }
            // this.form.servicesLanguageEnglish = servicesLanguageEnglish
            // if (this.form.photo) {
            //   this.uploadAttrs.fileList = [
            //     {
            //       name: '',
            //       url: this.form.photo
            //     }
            //   ]
            // }
            // 根据code查询机构
            this.searchParent([urlMap.org.loadByCode, {code: this.form.parentCode}])
          }
        })
      },
      searchParent (reqArgs) {
        request(...reqArgs).then(res => {
          if (res.head.errCode === 0) {
            if (res.data) {
              this.form.parentCode = res.data.code
              this.form.parentName = res.data.name
            } else {
              this.form.parentCode = '0'
            }
          }
        })
      },
      save () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            const params = Object.assign({}, this.form)
            if (params.addressJson) {
              params.addressInfo = JSON.parse(params.addressJson).addressDetail
            }
            if (params.businessStatus) {
              params.businessStatusCode = params.businessStatus.code
              params.businessStatusName = params.businessStatus.Name
            }
            if (params.servicesLanguage && params.servicesLanguage.length) {
              params.servicesLanguageCode = params.servicesLanguage.map(item => item.code).join()
              params.servicesLanguageName = params.servicesLanguage.map(item => item.name).join()
              params.servicesLanguageEnglishName = params.servicesLanguage.map(item => item.attr1).join()
              params.servicesLanguageEnglishCode = params.servicesLanguage.map(item => item.nameEn).join()
            } else {
              params.servicesLanguageCode = ''
              params.servicesLanguageName = ''
              params.servicesLanguageEnglishName = ''
              params.servicesLanguageEnglishCode = ''
            }
            params.code = this.tenantId + params.code
            // if (params.servicesLanguageEnglish && params.servicesLanguageEnglish.length) {
            //   params.servicesLanguageEnglishCode = JSON.stringify(params.servicesLanguageEnglish.map(item => ({
            //     code: item.code,
            //     name: item.name
            //   })))
            // } else {
            //   params.servicesLanguageEnglishCode = JSON.stringify([])
            // }
            // 创建顶级机构
            if (this.type === 'create') {
              params.parentCode = '0'
            }
            params.status = params.enableStatus
            delete params.enableStatus
            delete params.parentName
            delete params.addressJson
            delete params.businessStatus
            delete params.servicesLanguage
            delete params.servicesLanguageEnglish
            // params.photo = this.hackPhotoUrl(params.photo)
            request(urlMap.org[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                // this.$router.push({name: 'org-org'})
                window.history.back()
              }
            })
          }
        })
      },
      getDetailAddress (value) {
        this.form = {...this.form, ...value}
      },
      getCrtPath () {
        return getCrtPath()
      },
      delPhoto (e) {
        this.enterClose = false
        this.enterImg = false
        this.form.photo = ''
        this.uploadAttrs.fileList = []
        e.stopPropagation()
      },
    },
  }
</script>
<style scoped lang="less">
  .org-code-input {
    & /deep/ .el-input__inner {
      padding-left: 41px;
    }
  }
  .tenant-code-mask {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 10px;
    color: #333;
  }
</style>
