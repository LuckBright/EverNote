<template>
  <el-dialog
    title="药品说明书"
    :visible.sync="dialogVisible"
    class="drgutips"
    width="70%"
    append-to-body
    :modal-append-to-body="true"
    >
    <h4 v-if="drugData">
      {{parserComplex({
      data: drugData.list,
      propertys: GOLBAL_VAL_MATERIL_NAME.NAME_ONE})}}
      <ever-specialIcons v-if="drugData" :iconsData="drugData.list"></ever-specialIcons>
    </h4>
    <div class="parentover">
      <ever-form2
      v-if="drugData"
      :class="'drgubox'"
      :schema="schema"
      v-model="obj"
      :nosubmit="true"
      label-width="180px"
      ref="form">
      </ever-form2>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { setUpClassifyName } from '@/util/formcustom'
import { GOLBAL_VAL_MATERIL_NAME, patch, parserJSON, parserComplex } from '@/util/common'
import everSpecialIcons from '@/warehouse/page/components/whspecialicons'
import api from '@/warehouse/page/agency/store/agencyassociationdrugapi'
const objList12 = ['SXX000003', 'SXX000005', 'SXX000001', 'SXX000009', 'SXX000007', 'SXX000008']
const objList12Object = [
  { label: '通用名', name: 'SXX000003' },
  { label: '商品名', name: 'SXX000005' },
  { label: '批准文号', name: 'SXX000001' },
  { label: '生产厂商', name: 'SXX000009' },
  { label: '剂型', name: 'SXX000007' },
  { label: '规格', name: 'SXX000008' },
]
const objList24 = [
  'SXX000019',
  'SXX000020',
  'SXX000021',
  'SXX000022',
  'SXX000023',
  'SXX000024',
  'SXX000025',
  'SXX000026',
  'SXX000027',
  'SXX000028',
  'SXX000029',
  'SXX000030',
  'SXX000031',
  'SXX000032',
  'SXX000033',
  'SXX000034'
]
const objList24Object = [
  { label: '成分', name: 'SXX000019' },
  { label: '性状', name: 'SXX000020' },
  { label: '功能主治', name: 'SXX000021' },
  { label: '用法用量', name: 'SXX000022' },
  { label: '不良反应', name: 'SXX000023' },
  { label: '禁忌', name: 'SXX000024' },
  { label: '注意事项', name: 'SXX000025' },
  { label: '药物相互作用', name: 'SXX000026' },
  { label: '孕妇及哺乳期妇女用药', name: 'SXX000027' },
  { label: '儿童用药', name: 'SXX000028' },
  { label: '老年用药', name: 'SXX000029' },
  { label: '药物过量', name: 'SXX000030' },
  { label: '临床试验', name: 'SXX000031' },
  { label: '药理毒理', name: 'SXX000032' },
  { label: '药代动力学', name: 'SXX000033' },
  { label: '执行标准', name: 'SXX000034' },
]
export default {
  props: ['objData', 'localMaterialId', 'recipeId'],
  data () {
    return {
      obj: {},
      schema: {},
      drugData: null,
      GOLBAL_VAL_MATERIL_NAME,
      objList12,
      objList24,
      parserJSON,
      parserComplex,
      dialogVisible: false
    }
  },
  methods: {
    filterArrData (arr, oldarr) {
      let newarr = arr.filter(item => {
        let index = Object.keys(oldarr).findIndex(child => {
          return item === child
        })
        if (index > -1) return item
      })
      return newarr
    },
    async filterSchema (data) {
      const objList12Obj = {}
      const objList24Obj = {}
      const objList12Schema = objList12Object.map(item => {
        item.comp = 'readonlyitem'
        objList12Obj[item.name] = ''
        item.span = 12
        return item
      })
      const objList24Schema = objList24Object.map(item => {
        item.comp = 'readonlyitem'
        item.span = 24
        objList24Obj[item.name] = ''
        return item
      })
      let spu = {
        obj: Object.assign(objList12Obj, objList24Obj),
        schema: [{
          label: '类型',
          name: 'className',
          comp: 'readonlyitem',
          span: 12
        },
        {
          label: '药理分类',
          name: 'drugTypeName',
          comp: 'readonlyitem',
          span: 12
        }, ...objList12Schema, ...objList24Schema]
      }
      let res = await api.getById(!this.recipeId ? { id: data ? data.localsettingId : this.localMaterialId } : {skuId: this.localMaterialId}).then(res => {
        return res
      })
      this.drugData = res
      this.drugData.list = res.materialSkuObject.ext
      this.obj = Object.assign({}, spu.obj, this.drugData.list)
      Object.keys(this.obj).forEach(key => {
        this.obj[key] = parserJSON({ data: this.obj, property: key })
      })
      this.obj.className = setUpClassifyName(this.drugData.list.classifyObject, true)
      this.obj['SXX000008'] = parserComplex({ data: this.drugData.list, propertys: [[]], standard: true })
      let drugTypeName = []
      res.categoryMaterialRelations && res.categoryMaterialRelations.length && res.categoryMaterialRelations.map(item => {
        drugTypeName.push(setUpClassifyName(item.pharmacologyCategoryObject, true))
      })
      this.obj.drugTypeName = drugTypeName.join('；')
      // this.obj[DOSAGE] = this.parserJSON({ data: data.list.ext, property: [DOSAGE], isInfo: false })
      this.schema = spu.schema
    },
    async open () {
      this.drugData = this.objData
      if (this.drugData || this.localMaterialId) {
        await this.filterSchema(this.drugData)
        this.dialogVisible = true
      }
    },
    ...patch
  },
  components: {
    everSpecialIcons
  },
  watch: {
    'dialogVisible' (v) {
      if (!v) {
        this.drugData = {}
      }
    }
  }
}
</script>

<style scoped lang="scss">
.drgutips{
  /deep/ .el-dialog__body{
    padding: 0 20px;
    h4{
      font-size: 16px;
      color: #333333;
    }
  }
  /deep/ .el-form-item--small{
    margin-bottom: 0px!important;
  }
  .parentover {
    max-height: 320px;
    margin-bottom: 20px;
    overflow-y: scroll;
  }
  /deep/ .drgubox{
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
    .el-col-12{
      border-bottom: 1px solid #ccc;
      border-left: 1px solid #ccc;
      .el-form-item {
        margin-bottom: 0;
        position: relative;
        .el-form-item__content{
          border-left: 1px solid #ccc;
          padding-left: 10px;
          height: 50px;
          position: relative;
          span{
            line-height: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            /* autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: no */
            position: absolute;
            top:50%;
            transform: translateY(-50%)
          }
        }
      }
    }
    .el-col-24{
      border-bottom: 1px solid #ccc;
      border-left: 1px solid #ccc;
      .el-form-item {
        margin-bottom: 0;
        position: relative;
        .el-form-item__content{
          border-left: 1px solid #ccc;
          padding-left: 10px;
          line-height: 50px;
          position: relative;
          span{
            padding: 5px 0;
            line-height: 25px;
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
    }
    label{
      background: #eee;
      font-size: 14px;
      font-weight: bold;
      padding-left: 10px;
      height: 100%;
      position: absolute;
    }
  }
  /deep/ .el-dialog__footer{
    border-top: 1px solid #ccc;
  }
}
</style>
