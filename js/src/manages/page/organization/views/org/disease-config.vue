<template>
  <div class="disease-config-box">
    <el-form
      :model="obj"
      ref="diseaseConfig"
      label-position="center"
      :rule="rules"
    >
      <template v-for="(titem, tindex) in obj.diseaseTypes">
        <el-row>
          <el-col class="label-style" :span="3">{{titem.name}}：</el-col>
          <el-col :span="21">
            <el-form-item label
                          :key="titem.code"
                          :prop="'diseaseTypes.' + tindex + '.diseaseVersionCode'"
                          :rules="{ required: true, message: '版本不能为空', trigger: 'blur'}"
            >
              <el-select v-model="titem.diseaseVersionCode"  placeholder="请选择版本" class="version-select">
                <template   v-for="item in diseaseVersionOption">
                  <el-option
                    v-if="item.parentId === ('THC_DISEASE_TYPE.' + titem.code) && item.code.indexOf('-00') === -1 "
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

    </el-form>
    <div slot="footer" class="dialog-footer">
<!--        <el-button @click="close">取消</el-button>-->
        <el-button @click="submitConfig" type="primary">确认</el-button>
      </div>
  </div>
</template>

<script>
import {request} from '@/util/req'

export default {
  name: 'disease-config',
  props: ['orgInfo'],
  data () {
    return {
      obj: {
        diseaseTypes: []
      },
      diseaseVersionOption: [],
      rules: {
        // diseaseTypeCode: [
        //   {required: true, message: '必填项', trigger: 'blur'}
        // ],
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      await this.getTypes()
      this.diseaseVersionConfig()
    },
    async getTypes () {
      let res = await request({
        url: '/thc-platform-core/valueSetItem/getValueSetItems/',
        isStatic: false
      }, {'setCode': 'THC_DISEASE_TYPE'}, 'post')
      if (res.head.errCode === 0) {
        this.obj.diseaseTypes = res.data
      }
      let res2 = await request({
        url: '/thc-platform-core/valueSetItem/getValueSetItems/',
        isStatic: false
      }, {'setCode': 'THC_DISEASE'}, 'post')
      if (res2.head.errCode === 0) {
        this.diseaseVersionOption = res2.data
      }
    },
    async diseaseVersionConfig () {
      let res = await request({
        url: '/platform-extend/disease/diseaseVersionConfig/getList',
        isStatic: false
      }, {tenantId: this.orgInfo.tenantId, orgId: this.orgInfo.id}, 'post')
      if (res.head.errCode === 0) {
        this.obj.diseaseTypes.forEach((item, index) => {
          let tempVal = res.data.resultList.find((ritem) => {
            return ritem.diseaseType + '' === item.code
          })
          if (tempVal) {
            this.$set(item, 'diseaseVersionCode', tempVal.diseaseVersionCode)
            this.$set(item, 'updId', tempVal.id)
          }
        })
        console.log('this.diseaseTypes.', this.diseaseTypes)
      }
    },
    submitConfig () {
      this.$refs.diseaseConfig.validate(valid => {
        if (valid) {
          console.log(this.diseaseTypes, this.orgInfo)
          let params = []
            // {
            //   diseaseVersionConfigList: [],
            //   deleteIdList: []
            // }
          this.obj.diseaseTypes.forEach((item, index) => {
            if (!item.diseaseVersionCode) return
            let diseaseVersion = this.diseaseVersionOption.find((vitem) => {
              return vitem.code === item.diseaseVersionCode
            })
            params.push({
              id: item.updId,
              tenantId: this.orgInfo.tenantId,
              orgId: this.orgInfo.id,
              diseaseType: item.code,
              diseaseVersionCode: item.diseaseVersionCode,
              diseaseVersionName: diseaseVersion.name
            })
          })
          request({ url: '/platform-extend/disease/diseaseVersionConfig/save', isStatic: false }, params, 'post').then(res => {
            if (res.head.errCode === 0) {
              this.close()
              this.$messageTips(this, 'success', '配置成功')
            }
          })
        }
      })
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
  .disease-config-box{
    margin: 25px 30px;
    max-width: 1000px;
  }
  .dialog-footer{
    display: block;
    text-align: right;
    width: 100%;
  }
  .version-select{
    width: 100%;
    vertical-align: top;
  }
  .label-style{
    line-height: 42px;
  }
</style>
