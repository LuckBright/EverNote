<template>
<div>
  {{data1}}<br/>
  -------------------------------------------------
  <el-tree
  :data="data"
  show-checkbox
  node-key="id"
  ref="tree"
  :props="defaultProps"
  @check-change="checkChange"
  @check="check"
  @node-click="nodeClick"
  @current-change="currentChange"
  >
</el-tree>
</div>

</template>
<script>
import { uniqBy } from 'lodash'
export default {
  data () {
    return {
      arr: [],
      data1: null,
      data: [{
        id: 2,
        label: '机构1',
        children: [{
          id: 5,
          type: 1,
          label: '科室1'
        }, {
          id: 6,
          type: 1,
          label: '科室2'
        }]
      }, {
        id: 3,
        label: '机构2',
        children: [{
          id: 7,
          label: '科室3',
          type: 1
        }, {
          id: 8,
          label: '科室4',
          type: 1
        }, {
          id: 1,
          label: '机构3',
          children: [{
            id: 4,
            label: '机构4',
            children: [{
              id: 9,
              type: 1,
              label: '科室5'
            }, {
              id: 10,
              type: 1,
              label: '科室6'
            }]
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
      // this.$refs.tree.setCheckedKeys([8, 5, 1])
      // console.log(this.$refs.tree.getCheckedNodes())
    var arr = [{a: 1}, {a: 2}]
    console.log('ceshi', arr.includes({a: 1}))
  },
  methods: {
    nodeClick (data, node, self) {
        // console.log('data', data)
        // console.log('node', node)
        // console.log('self', self)
    },
    check (data, obj) {
      let node = this.$refs.tree.getNode(data)
      console.log(node, 'node')
        // console.log(data, 'data')
        // console.log(obj, 'obj')
        // console.log('cur', this.$refs.tree.getNode(data))
      if (node.checked) {
        if (data.type && data.type === 1) { // 科室
          this.arr.push(data)
        } else { // 机构
            // debugger
          let child = data.children.filter(item => {
            return item.type === 1
          })
          this.arr = this.arr.concat(child)
        }
      } else {
        if (data.type && data.type === 1) {
          this.arr.forEach((item, index) => {
            if (item.id === data.id) { this.arr.splice(index, 1) }
          })
        } else {
          let child = data.children.filter((item, index) => {
            return item.type === 1
          })
          child.forEach((item, index) => {
            this.arr.forEach((item1, index1) => {
              if (item1.id === item.id) {
                this.arr.splice(index1, 1)
              }
            })
          })
        }
      }
      console.log('arr', this.arr)
      this.arr = uniqBy(this.arr, 'id')
      this.$refs.tree.setCheckedNodes(this.arr)
    },
    checkChange (data, cur, child) {
      // console.log('data', data)
      // console.log('cur', cur)
      // console.log('child', child)
        // if (cur) {
        //   console.log('data', data)
        //   console.log('cur', cur)
        //   console.log('child', child)
        // }
    },
    currentChange (data, node) {
      console.log('data', data)
      console.log('node', node)
    }
  }
}
</script>

