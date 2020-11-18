<template>
  <el-dialog title="编辑" :visible.sync="visibleFlag" :close-on-click-modal="false" class="ui_dialog_02 spe">
    <ever-form2
      :schema="schema"
      v-model="obj"
      ref="form"
      :span="11"
      :rules="{}"
      :nosubmit="true"
    >
      <template slot="seviceFeeSelect">
        <service-query
          v-if="visibleFlag"
          v-model="obj.seviceFeeSelect"
          :types="[800,801,10000,10001,10003,10004,10006,10009,2124,2125,2126,2466,2467,3001,3002,341,799,802,832,867]"
        ></service-query>
      </template>
    </ever-form2>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/sob/store/surcharge'
import serviceQuery from './service.query.vue'

export default {
  components: { serviceQuery },
  data () {
    let schema = [
      {
        name: 'decoct',
        label: '煎法',
        comp: 'sys-type',
        props: {
          disabled: true,
          code: 'THC_SYS_DECOCTION_OF_TCM'
        },
        span: 24

      },
      {
        name: 'seviceFeeSelect',
        label: '收费项目',
        comp: 'custom',
        span: 24
      }
    ]
    this.schema = schema
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      visibleFlag: false,
      detail: '',
      loading: false
    }
  },
  methods: {
    open (data) {
      if (!data) return
      this.detail = data
      this.obj.decoct = data.code
      if (data.serviceId) {
        this.obj.seviceFeeSelect = {
          id: data.serviceId,
          name: data.serviceName,
          serviceClassification: data.serviceClassification
        }
      } else {
        this.obj.seviceFeeSelect = ''
      }
      this.visibleFlag = true
    },
    close () {
      this.detail = ''
      this.visibleFlag = false
    },
    save () {
      this.loading = true
      let service = this.obj.seviceFeeSelect
      let params = {
        id: this.detail.id,
        code: this.detail.code,
        serviceClassification: service.serviceClassification,
        serviceId: service.id,
        serviceName: service.byname || service.name,
        createTime: this.detail.createTime,
        creator: this.detail.creator
      }
      api.updateDecocts(params).then(res => {
        this.loading = false
        if (res) {
          this.close()
          this.$messageTips(this, 'success', '保存成功')
          this.$emit('update')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  
</style>
