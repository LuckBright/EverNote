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
    props: ['visitId', 'dptId', 'clinic'],
    data () {
      return {
        data: []
      }
    },
    created () {
      if (!this.clinic) {
        // 住院
        this.getHosTijian()
      } else {
        // 门诊
        this.getClinicTijian()
      }
    },
    methods: {
      getHosTijian () {
        phrapi.getTijian(this.visitId, this.dptId).then(result => {
          if (!result) return false
          this.data = result.map(v => {
            if (!v.result) {
              return {
                label: v.name,
                children: null
              }
            } else {
              return {
                label: v.name + ' ' + this.$moment(v.checkDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm'),
                children: v.result.map(v1 => {
                  // console.log(typeof v1.value)
                  if ((typeof v1.value) === 'object') {
                    return {label: v1.label + ': ' + (v1.value.max + '/' + v1.value.min || '--'), val: v1.value.max + '/' + v1.value.min}
                  } else {
                    return {label: v1.label + ': ' + (v1.value || '--'), val: v1.value}
                  }
                })
              }
            }
          })
        })
      },
      getClinicTijian () {
        phrapi.getClinic(this.visitId, this.dptId).then(result => {
          if (!result) return false
          this.data = result.map(v => {
            if (!v.result) {
              return {
                label: v.name,
                children: null
              }
            } else {
              return {
                label: v.name,
                children: v.result.map(v1 => {
                  return {label: v1.label + ': ' + (v1.value || '--'), val: v1.value}
                })
              }
            }
          })
        })
      },
      quote (data) {
        // if (data.children) {
        //   this.$bus.$emit('ref:append', '<p>' + data.children.map(v => v.label).join('</p><p>') + '</p>')
        // } else {
        //   this.$bus.$emit('ref:append', '<p>' + data.label + '</p>')
        // }
        if (data.children) {
          this.$bus.$emit('ref:append', data.children.filter(v => v.val).map(v => (v.label)).join(' '))
        } else {
          this.$bus.$emit('ref:append', data.label)
        }
      }
    }
  }
</script>
