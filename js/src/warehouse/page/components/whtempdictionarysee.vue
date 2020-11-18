<template>
  <div class="flex_column_full_hidden" style="overflow-y: auto">
    <div class="panel layout_inner">
      <div class="panel-body">
        <h2 class="alg_c">{{customStencilName + '模版'}}</h2>
        <div class="hr pos_re">
          <span class="title">类型：</span>
          <span v-if="obj.classifyVoObject">{{setUpClassifyName(obj.classifyVoObject)}}</span>
          <span class="line pos_re"><i class="pos_ab"></i></span>
          <span class="title">模版名称：</span>
          <span>{{obj.name}}</span>
        </div>
        <!-- SPU -->
        <div class="content-body">
          <h4>基本信息</h4>
          <ever-form2 :schema="spuSchema" v-model="spuObj" ref="spuForm" :span="12" :rules="spuRules" @submit="submitForm()" :nosubmit="true">
            <div slot="default"></div>
          </ever-form2>
        </div>
        <!-- SKU -->
        <div class="content-body" v-if="STENCIL_TYPE[0].id == systemType">
          <h4>规格</h4>
          <ever-form2 :schema="skuSchema" v-model="skuObj" ref="skuForm" :span="12" :rules="skuRules" @submit="submitForm()" :nosubmit="true">
            <template slot="default">
            </template>
          </ever-form2>
        </div>
      </div>
      <div class="ml120 mt20">
        <el-button v-if="source != 'tempdictionary' && source" type="primary" size="large" @click="handleEditor()">编辑</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { GLOBAL_ATTR, getFirstRoutePath, STENCIL_TYPE } from '@/util/common'
import { createdSchemaAndObjectValue, setUpClassifyName } from '@/util/formcustom'
import templetApi from '@/warehouse/page/groupmaterial/store/templetapi'

export default {
  props: ['customPathEdit', 'systemType', 'propertyPath', 'customPathList', 'customStencilName'],
  data () {
    return {
      setUpClassifyName,
      GLOBAL_ATTR,
      objId: this.$route.params.id,
      source: this.$route.query.source,
      status: this.$route.query.status,
      classifyId: this.$route.query.classifyId,
      propertyData: [],
      obj: {},
      spuObj: {},
      skuObj: {},
      spuSchema: [],
      skuSchema: [],
      spuRules: {},
      skuRules: {},
      STENCIL_TYPE
    }
  },
  created () {
    this.objId && this.handlePropertySeeDetail(this.objId)
  },
  methods: {
    handleEditor () {
      this.$router.push(`/${getFirstRoutePath(this.$route.path, 1)}/${this.customPathEdit}/${this.objId}?source=group&inUse=${this.$route.query.inUse}&systemType=${this.systemType}&propertyPath=${this.propertyPath}&customPathList=${this.customPathList}&routePath=${this.$route.query.routePath}`)
    },
    handlePropertySeeDetail (id) {
      // 业务（全局模版库）info
      !this.source && templetApi.info({ id: id || this.objId, systemType: this.systemType }).then(result => {
        if (result && result.id) {
          this._resetInfoData(result)
        }
        return
      })

      let params = {
        id: id || this.objId,
        classifyId: this.classifyId,
        systemType: this.systemType
      }
      if (this.status && this.status !== 'undefined') params.status = this.status
      // 业务（全局模版库）infoSee
      if (this.source === 'group') {
        templetApi.infoSee(params).then(result => {
          if (result && result.id) {
            this._resetInfoData(result)
          }
        })
      }
      // 全局模版
      if (this.source === 'tempdictionary') {
        templetApi.globalInfoSee(params).then(result => {
          if (result && result.id) {
            this._resetInfoData(result)
          }
        })
      }
    },
    _resetInfoData (result) {
      this.obj = result
      let renderSpu = result.templetDictPropertiesForSpu || result.templetPropertiesForSpu
      let renderSku = result.templetDictPropertiesForSku || result.templetPropertiesForSku
      let SPU = createdSchemaAndObjectValue(result.keysForSpu, renderSpu, { disabled: true })
      let SKU = createdSchemaAndObjectValue(result.keysForSku, renderSku, { disabled: true })
      this.spuSchema = SPU.schema
      this.skuSchema = SKU.schema
      this.spuObj = SPU.obj
      this.skuObj = SKU.obj
      this.spuRules = SPU.rules
      this.skuRules = SKU.rules
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
.small-icon {right: 0;}
.hr {
  margin-bottom: 0;
  span {
    line-height: 20px;
    display: inline-block;
  }
  .title {
    color: #666;
  }
  .line {
    margin: 0 15px;
    i {
      top: -12px;
      height: 15px;
      width: 1px;
      display: inline-block;
      background: #999
    }
  }
}
.content-body {
  border: 1px solid #ddd;
  background: #f4f4f4;
  margin-top: 20px;;
  border-radius: 4px;
  padding: 20px;
}
</style>
