<template>
  <div class="flex_column_full_hidden">
    <ever-bread-crumb v-if="isNew" name="新增供应商" path="/goods/suppliers"></ever-bread-crumb>
    <div class="layout_inner oxhya">
      <ever-form2
        label-width="200px"
        label-position="right"
        v-model="obj"
        class="supplierForm"
        :rules="rules"
        :schema="schema"
        nosubmit="true"
        ref="form">
        <!-- 质量信誉 -->
        <template slot="qualityPrestiges">
          <el-checkbox-group v-model="obj.qualityPrestiges">
            <el-row :gutter="20">
              <el-col :span="5" v-for="(item, i) in checkOptions" :key="i" :class="{ 'pl20': i >= checkOptions.length - 7 }" class="lin32">
                <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </template>
        <template slot="licenceDisableRemindDate">
          到期前
          <el-input-number
            :controls="false"
            class="w_60"
            :disabled="!obj.licenceDisableDate"
            v-model="obj.licenceDisableRemindDate">
          </el-input-number>
          天
        </template>
        <template slot="operatingRemindDate">
          到期前
          <el-input-number
            class="w_60"
            :controls="false"
            :disabled="!obj.operatingDate"
            v-model="obj.operatingRemindDate">
          </el-input-number>
          天
        </template>
        <template slot="registeredCapital">
          <el-input
            type="number"
            v-model="obj.registeredCapital"
            placeholder="单位：万"
            @blur="handlBlurNum">
            <template slot="append">万</template>
          </el-input>
        </template>
        <template slot="phone">
          <el-input v-model="obj.phone" placeholder="电话" onkeyup="this.value=this.value.replace(/\s+/g,'')"></el-input>
        </template>
        <template slot="fax">
          <el-input v-model="obj.fax" placeholder="传真" onkeyup="this.value=this.value.replace(/\s+/g,'')"></el-input>
        </template>
        <!-- 附件上传 -->
        <template slot="fileUrl">
          <div class="f12">最多上传15个，大小不超过10M。</div>
          <ever-upload1
            v-model="obj.fileUrl"
            :limit="15"
            type="img"
            class="upload"
            @process="handlerProcess"
            :tipsFlag="true">
          </ever-upload1>
        </template>
      </ever-form2>
      <div style="margin-left: 200px">
        <el-button type="primary" @click="submitForm('form')" v-if="!isContrct" class="w_100">保存</el-button>
        <el-button @click="handlerCancel" v-if="!objId && !isContrct" class="W_60">取消</el-button>
        <span v-if="objId && obj.tenantStatus && isClinic">
          <el-button v-if="!obj.status" type="primary" class="w_100" @click="handlerOnOff(1)">启用</el-button>
          <el-button v-else type="danger" class="w_100" @click="handlerOnOff(0)">停用</el-button>
        </span>
      </div>
    </div>
    <!-- 取消 -->
  </div>
</template>
<script>
import { debounce } from '@/util/common'
import supplierSchemaMixin from '@/warehouse/page/supplier/supplier.schema.mixin.js'
import storage from '@/util/storage'

export default {
  props: {
    isNew: {
      type: Boolean,
      default: true
    },
    isContrct: { // 新增合同
      type: Boolean,
      default: false
    },
    isClinic: { // 是否机构
      type: Number,
      default: 1
    }
  },
  mixins: [supplierSchemaMixin],
  data () {
    return {
      obj: {},
      objDetail: {}, // 缓存的详情
      objId: this.isContrct ? '' : this.$route.params.id,
      showContrct: false,
      fileList: [], // 资质附件回显
    }
  },
  watch: {
    obj: {
      handler (v) {
        if (v) {
          if (!v.licenceDisableDate) this.obj.licenceDisableRemindDate = undefined
          if (!v.operatingDate) this.obj.operatingRemindDate = undefined
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.init()
    if (this.$route.params.supplierId || this.$route.params.id) this.getDetail()
  },
  methods: {
    // 注册资金输入多小数的时候清空输入框
    handlBlurNum (e) {
      if (!e.target.value) e.target.value = ''
    },
    // 停用启用机构供应商
    handlerOnOff (type) {
      let params = JSON.parse(JSON.stringify(this.obj))
      params.status = type
      this.api.updateClinicSupplier(params).then(res => {
        if (res) {
          this.everSuccess('操作成功')
          this.getDetail()
        }
      })
    },
    handlerProcess (e, file, fileList) {
      if (e.percent !== 100) {
        const data = JSON.parse(JSON.stringify(this.obj.fileUrl.split(',')))
        let list = data.filter(item => { return item !== file.name })
        if (list.length) {
          this.obj.fileUrl = list.join(',')
        }
      }
    },
    // 提醒时间
    handlerDate (date, field) {
      if (date <= 0) {
        this.obj[field] = undefined
        return this.everWarning('提醒时间不能小于等于0,请重新录入')
      }
    },
    init () { // 重置参数
      let pickerOptions = {
        disabledDate (time) {
          return time.getTime() < new Date() - 8.64e7
        }
      }
      this.$ever.getFieldFromSchema(this.schema, 'licenceDisableDate').props.pickerOptions = pickerOptions
      this.$ever.getFieldFromSchema(this.schema, 'gspDisableDate').props.pickerOptions = pickerOptions
      this.$ever.getFieldFromSchema(this.schema, 'gmpDisableDate').props.pickerOptions = pickerOptions
      this.$ever.getFieldFromSchema(this.schema, 'name').props.disabled = false
      this.$ever.getFieldFromSchema(this.schema, 'unifiedCode').props.disabled = false
      this.obj = this.$ever.createObjFromSchema(this.schema)
      this.obj.licenceDisableRemindDate = undefined
      this.obj.operatingRemindDate = undefined
      this.obj.qualityPrestiges = []
      this.$nextTick(() => {
        if (this.$refs.form && !this.objId) {
          this.$refs.form.$refs.form.validate(valied => console.log(valied))
          this.$refs.form.$refs.form.clearValidate()
        }
      })
      this.showContrct = true
    },
    handlerCancel () { // 取消
      let cancel
      Object.keys(this.obj).forEach(key => {
        if ((!Array.isArray(this.obj[key]) && this.obj[key]) || (Array.isArray(this.obj[key]) && this.obj[key].length)) {
          cancel = true
        }
      })
      if (cancel) {
        this.$confirm('您填写的内容尚未提交，是否要离开页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {
        })
      } else {
        this.$router.go(-1)
      }
    },
    getDetail (id) {
      this.api[this.isClinic ? 'getClinicById' : 'getById'](id || this.objId).then(result => {
        if (result) {
          let data = {}
          if (result.id) {
            data = result
          }
          if (result[0] && result[0].id) {
            data = result[0]
          }
          data.licenceDisableRemindDate = data.licenceDisableRemindDate ? data.licenceDisableRemindDate : undefined
          data.operatingRemindDate = data.operatingRemindDate ? data.operatingRemindDate : undefined
          this.objDetail = JSON.parse(JSON.stringify(data))
          this.obj = JSON.parse(JSON.stringify(data))
          if (!this.obj.qualityPrestiges) this.obj.qualityPrestiges = []
          this.$emit('getSupplierName', this.obj)
          // 机构不允许修改名称和社会信用代码
          if (this.isClinic) {
            this.$ever.getFieldFromSchema(this.schema, 'name').props.disabled = true
            this.$ever.getFieldFromSchema(this.schema, 'unifiedCode').props.disabled = true
          }
        }
        this.$nextTick(() => {
          if (this.$refs.form) {
            this.$refs.form.$refs.form.validate(valied => console.log(valied))
          }
        })
      })
    },
    submitForm: debounce(async function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign(this.obj, { isClinic: this.isClinic })
          if (params.fileUrl) {
            let url = params.fileUrl.split(',')
            let fileUrl = []
            if (url.length) {
              url.map(url => {
                let urllist = url.split('=')
                if (urllist.length) fileUrl.push(urllist[urllist.length - 1])
              })
            }
            params.fileUrl = fileUrl.join(',')
          }
          delete params.base
          delete params.card
          if (!this.obj.createClinicId) params.createClinicId = storage.getStorageByClinic('CLINICID')
          params.tenantId = storage.getLocalStorage('TENANTID')
          if (!params.licenceDisableRemindDate) delete params.licenceDisableRemindDate
          if (!params.operatingRemindDate) delete params.operatingRemindDate
          this.api[this.objId && this.isClinic ? 'updateClinicSupplier' : 'createOrUpdate'](params).then(result => {
            if (result) {
              this.$messageTips(this, 'success', '操作成功')
              if (!this.isContrct) {
                this.afterSave('objsaved', result)
              } else {
                this.$emit('submitSave', result)
                // this.init()
              }
            }
          })
        }
      })
    }),
    afterSave () {
      this.$router.push(`${!this.isClinic ? '/manages/supplier' : '/goods/suppliers'}`)
    }
  }
}
</script>
<style scoped lang="less">
.upload {
  /deep/ .avatar-uploader .el-upload__tip {
    display: none;
  }
  /deep/ .el-upload-list .el-upload-list__item .el-upload-list__item-thumbnail {
    object-fit: fill;
  }
  /deep/ .el-dialog__wrapper .el-dialog img {
    height: 700px;
  }
}
.pl20 {
  padding-left: 20px !important;
}
.supplierForm {
  /deep/ .el-input__suffix {
    display: none;
  }
  /deep/ .title .el-form-item__label {
    justify-content: left;
    font-weight: bold;
    font-size: 18px;
  }
  .el-checkbox {
    font-weight: 400;
  }
}
.lin32 {
  line-height: 32px;
}
.w100 {
  width: 100px;
}
</style>

