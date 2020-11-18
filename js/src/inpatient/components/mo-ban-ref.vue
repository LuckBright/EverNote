<template>
  <div>
    <el-tree
      :data="data"
      node-key="id"
      :load="loadNode"
      lazy
      :props="defaultProps"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
        style="display:inline-block;"
      >
        <!--有子节点-->
        <!--模版节点-->
        <!--遍历叶子节点-->
        <!--遍历模版属性-->
        <span v-if="node.data.formDataId">
          {{ node.data.name }}
          <el-button
            type="text"
            size="mini"
            @click="
              () =>
                quoteAll(
                  node.data.formTemplateId,
                  node.data.formDataId,
                  node.data.designerId
                )
            "
          >
            引用
          </el-button>
        </span>
        <span v-else-if="'val' in node.data">
          {{ node.data.label }}:
          {{
            (data.hasOwnProperty('displayVal')
              ? data.displayVal
              : formatVal(data.val)) || '--'
          }}
          <el-button
            type="text"
            size="mini"
            v-if="data.displayVal || data.val"
            @click="() => quote(data)"
          >
            引用
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="data.displayVal || data.val"
            @click="() => quote(data, true)"
            style="color: #ee4433"
          >
            追加
          </el-button>
        </span>
        <span v-else>
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
import api from '@/form/store/tplmanageapi.js'
// import modelDataApi from '@/form/store/api.js'
import phrapi from '@/form/store/phrapi'
import formapi from '@/form/store/api'
import Vue from 'vue'
import { getMixed } from '@/util/formconverter'
export default {
  props: ['schemaId', 'dptId', 'code'],
  data () {
    // 模版类型 1大模版 2小模版
    let queryObj = {
      type: 1
    }
    // type为1，必有
    if (this.schemaId) {
      queryObj.formTemplateId = this.schemaId
    }
    queryObj.dptId = this.$route.query.dptId
    // type为1，必有
    if (this.code) {
      queryObj.code = this.code
    }
    return {
      queryObj,
      data: [],
      defaultProps: {
        children: 'nodes',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  created () {
    this.getTreeData()
  },
  computed: {
    formatVal (val) {
      return val => {
        if (!val) return
        if (typeof val === 'object') {
          return val.input
        } else {
          return val
        }
      }
    }
  },
  watch: {
    code (val) {
      this.queryObj.code = val
      this.getTreeData()
    },
    schemaId (val) {
      this.queryObj.formTemplateId = val
      this.getTreeData()
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.data.nodes) {
        resolve(node.data.nodes)
      } else {
        resolve([])
      }
      if (node.data.formDataId && node.data.formTemplateId) {
        this.getData(node.data.formTemplateId, node.data.formDataId).then(
          items => {
            resolve(items)
          }
        )
      }
    },
    getTreeData () {
      if (!this.queryObj.formTemplateId) return false
      api.getDataTpl(this.queryObj).then(result => {
        if (!result) return false
        this.data = result
      })
    },
    getData (schemaId, formDataId) {
      function isZHENDUAN (ele) {
        return ele.name.indexOf('ZHEN_DUAN') !== -1
      }
      let p1 = phrapi.queryTemplateDetail(schemaId).then(result => {
        let obj = getMixed(result.element)
        return obj.schema
      })

      let p2 = formapi.getById(formDataId).then(result => {
        return result.data
      })
      return Promise.all([p1, p2]).then(([schema, obj]) => {
        schema = schema.filter(item => {
          return item.isCanTemplate
        })
        return schema.map(ele => {
          let node = {}

          let k = ele.name
          let val = obj[k]
          node.val = val
          // if (typeof (val) === 'object') {
          //   node.val = val
          // }
          node.label = ele.label
          node.name = ele.name
          if (['object', 'array'].indexOf(ele.rule.dataType) > -1) {
            let comp = ele.comp.replace(/-([a-z])/g, function (g) {
              return g[1].toUpperCase()
            })
            var ComponentClass = Vue.component(ele.comp) || Vue.component(comp)
            if (ComponentClass) {
              var instance = new ComponentClass({
                propsData: { value: val },
                parent: this
              })
              if (instance.getStringVal) {
                node.displayVal = instance.getStringVal()
              }
              if (isZHENDUAN(ele)) {
                node.displayVal = []
                val.map(item => {
                  item.notify = ''
                  item.checked = ''
                  if (item.comment) {
                    item.notify = `(${item.comment})`
                  }
                  if (item.diagnoseType === 2) {
                    item.checked = '?'
                  }
                  // if (item.diseaseName === null) return
                  node.displayVal.push(
                    `${item.diseaseNameEn || ''} ${item.diseaseName}${
                      item.notify
                    }${item.checked}`
                  )
                })
                node.displayVal = node.displayVal.join(',')
              }
            }
          }
          return node
        })
      })
    },
    quote (data, isAdd) {
      let obj = {}
      if (data.nodes) {
        obj = data.nodes.reduce((total, curr) => {
          total[curr.name] = curr.val
          return total
        }, {})
      } else {
        // 这个代码看着有问题，val是[{},{}],displayVal是String，如果val不存在就会引用dispalyVal.....,在门急诊那里是引不过去的
        obj[data.name] = data.val || data.displayVal
      }
      obj = JSON.parse(JSON.stringify(obj))
      this.$bus.$emit('quote', obj, isAdd)
    },
    quoteAll (schemaId, formDataId, designerId) {
      if (designerId && designerId === '2') {
        formapi.getById(formDataId).then(result => {
          this.$bus.$emit('quote', result.data)
        })
      } else {
        this.getData(schemaId, formDataId).then(items => {
          let obj = items.reduce((acc, curr) => {
            if (curr.displayVal || curr.val) {
              acc[curr.name] = curr.val || curr.displayVal
            }
            return acc
          }, {})
          this.$bus.$emit('quote', JSON.parse(JSON.stringify(obj)))
        })
      }
    }
  }
}
</script>
<style scoped>
.el-tree-node .custom-tree-node {
  white-space: normal;
}
.el-tree /deep/.el-tree-node__content {
  height: auto !important;
}
</style>

