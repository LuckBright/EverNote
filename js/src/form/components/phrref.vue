<template>
  <div>
    <el-table
      v-if="items && items.length"
      ref="table"
      class="margin no-border"
      :data="items"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column align="left">
        <template slot="header">
          {{ $t(title) }}
        </template>
        <template slot-scope="scope">
          <div style="width: 100%">
            <span style="color:#666;font-size:14px;">{{ $t(scope.row.label) }}</span>
            ：{{ (scope.row.hasOwnProperty('displayVal') ? scope.row.displayVal : scope.row.val) || '--' }}
            <el-button type="text" @click="quoteVal(scope.row)">引用</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import phrapi from '../store/phrapi'
import formapi from '../store/api'
import { getMixed } from '@/util/formconverter'
import Vue from 'vue'
import Quote from '@/emr/config/quote.js'
import {ZD_MEN_ZHEN_ZHEN_DUAN, DL_XUE_YA} from '@/emr/config/uniform.field.js'
import {blood1, blood2} from '@/emr/config/temperaturedata.js'
// import disease from '@/emr/data/disease.json'
export default {
  inject: ['recordInfo'],
  props: ['schemaId', 'id', 'name', 'disabled', 'title'],
  data () {
    return {
      quote: new Quote(this),
      items: [],
      designerId: this.recordInfo.designerId,
      selectedArr: [],
      zhenduan: {},
      xueya: {},
      allergenFields: ['QT_YAO_WU_GUO_MIN', 'QT_FEI_YAO_WU_GUO_MIN']
    }
  },
  methods: {
    storeSelected (arr) {
      this.selectedArr = arr
    },
    quoteVal (row) {
      this.quote.quoteFromForm({designerId: this.designerId, quoteInfo: {row, metadata: this.metadata}})
    },
    quoteAll () {
      const obj = {}
      this.selectedArr.map(item => {
        obj[item.name] = JSON.parse(JSON.stringify(this.metadata[item.name]))
      })
      this.$emit('quote', obj)
      this.$bus.$emit('quote', obj)
    },
    formatObj (val, key) {
      // 过敏数据
      if (this.allergenFields.includes(key)) {
        let value = []
        if (val.isAllergicHis && val.guomin.length > 0) {
          val.guomin.forEach(item => {
            value.push(item.allergen.name)
          })
        }
        return value.join(',')
      }
      // 诊断数据
      if (key === ZD_MEN_ZHEN_ZHEN_DUAN) {
        if (val && val.length) {
          var zhenduan = ''
          for (let i = 0; i < val.length; i++) {
            val[i].isChecked = ''
            val[i].notify = ''
            if (!val[i].diseaseNameEn) {
              val[i].diseaseNameEn = ''
            }
            if (val[i].comment) {
              val[i].notify = `(${val[i].comment})`
            }
            if (val[i].diagnoseType === 2) {
              val[i].isChecked = '?'
            }
            zhenduan = zhenduan + val[i].diseaseNameEn + val[i].diseaseName + val[i].notify + val[i].isChecked + ','
          }
          return zhenduan
        }
      }
      if ((val instanceof Array) && val.length > 0) { // 针对复选框的处理
        return val.join('/')
      }
    }
  },
  watch: {
    id: {
      handler () {
        let p1 = phrapi.queryTemplateDetail(this.schemaId).then(result => {
          let obj = getMixed(result.element)
          return obj.schema
        })

        let p2 = formapi.getById(this.id).then(result => {
          this.zhenduan[ZD_MEN_ZHEN_ZHEN_DUAN] = result.data[ZD_MEN_ZHEN_ZHEN_DUAN]
          this.xueya[DL_XUE_YA] = result.data[DL_XUE_YA]
          this.metadata = result.data
          return result.data
        })

        return Promise.all([p1, p2]).then(([schema, obj]) => {
          this.items = schema.map(ele => {
            let node = {}
            let k = ele.name
            let val = obj[k]
            if (k === DL_XUE_YA && val) { // 这块逻辑需要处理，先弄完过敏和诊断
              val[blood1] = obj[k][blood1] != null ? obj[k][blood1] : ''
              val[blood2] = obj[k][blood2] != null ? obj[k][blood2] : ''
            }
            node.val = val
            if (typeof val === 'object' && val !== null) {
              node.val = this.formatObj(val, k)
            }
            node.label = ele.label
            node.name = ele.name
            if (['object', 'array'].indexOf(ele.rule.dataType) > -1) {
              let comp = ele.comp.replace(/-([a-z])/g, function (g) {
                return g[1].toUpperCase()
              })
              var ComponentClass =
                Vue.component(ele.comp) || Vue.component(comp)
              if (ComponentClass) {
                var instance = new ComponentClass({
                  propsData: { value: val },
                  parent: this
                })
                if (instance.getStringVal) {
                  if (
                    Array.isArray(instance.value) &&
                    instance.value.length === 0
                  ) {
                    node.displayVal = null
                  } else {
                    if (k === DL_XUE_YA) {
                      if (!val[blood1] || !val[blood2]) {
                        node.displayVal = null
                      } else {
                        node.displayVal = val[blood1] + '/' + val[blood2]
                      }
                    } else {
                      node.displayVal = instance.getStringVal()
                    }
                  }
                }
              }
            }
            return node
          })
          this.items = this.items.filter(item => {
            if ('displayVal' in item) {
              return item.displayVal != null
            } else {
              return item.val
            }
          })
        })
      },
      immediate: true
    }
  }
}
</script>
<style>
.el-table .none {
  display: none;
}
</style>

<style lang="scss" scoped>
/deep/ .el-table .el-table-column--selection .cell {
  overflow: visible;
}
.label {
  font-size: 14px;
  font-weight: bold;
}
.form-item-ref {
  margin-bottom: 15px;
}
.bg {
  background-image: linear-gradient(
    -269deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.02) 100%
  );
  font-size: 16px;
}
.m {
  margin-left: 12px;
}
.margin {
  margin: 0px;
}
/deep/ .el-table {
  tr:hover {
    td {
      background-color: transparent !important;
    }
  }
  .el-table__header-wrapper {
    th {
      background: transparent;
    }
  }
}
</style>

