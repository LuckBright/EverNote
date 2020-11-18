<template>
  <div>
    <el-tree :data="data">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="$route.meta.handleType !== 1"
            type="text"
            size="mini"
            @click="() => quote(data)">
            引用
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
  import phrapi from '@/form/store/phrapi'

  // import Vue from 'vue'
  export default {
    props: ['visitId'],
    data () {
      return {
        data: []
      }
    },
    created () {
      phrapi.getZhenduan(this.visitId).then(result => {
        if (!result) return false
        this.data = result.map(v => {
          if (!v.diagList) {
            return {
              label: v.name + ' ' + this.$moment(v.createTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
              children: null
            }
          } else {
            return {
              label: v.name + ' ' + this.$moment(v.createTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
              children: v.diagList.map(v1 => {
                v1.checked = ''
                v1.notify = ''
                if (!v1.diseaseNameEn) {
                  v1.diseaseNameEn = ''
                }
                if (v1.comment) {
                  v1.notify = `(${v1.comment})`
                }
                if (v1.diagnoseType === 2) {
                  v1.checked = '?'
                }
                let res = `${v1.diseaseNameEn} ${v1.diseaseName}${v1.notify}${v1.checked}`
                return {
                  label: res,
                  quoteLabel: `${v1.diseaseName}`
                }
              })
            }
          }
        })
      })
    },
    methods: {
      quote (data) {
        if (data.children) {
          this.$bus.$emit('ref:append', '<p>' + data.children.map(v => v.quoteLabel).join('</p><p>') + '</p>')
        } else {
          this.$bus.$emit('ref:append', '<p>' + data.quoteLabel + '</p>')
        }
        // if (data.children) {
        //   this.$bus.$emit('ref:append', data.children.map(v => v.label).join(' '))
        // } else {
        //   this.$bus.$emit('ref:append', data.label)
        // }
      }
    }
  }
</script>
