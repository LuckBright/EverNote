<template>
  <div>
    <el-table
      class="demo"
      :data="tableData"
      border>
        <el-table-column
          label="楼层"
          prop="floor"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          label="房间">
          <template slot-scope="scope">
            <span>{{renderRoomsName(scope.row.rooms, scope.row.floor)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!disabled">
        <el-button type="primary">请选择关联房间</el-button>
        <div style="width: 121px; height: 36px; margin-top: -38px">
          <wh-cascader-multi class="cascaderclassbtn" ref="cascaderMulti" :options="options" v-model="cascader"></wh-cascader-multi>
        </div>

      </div>
  </div>
</template>

<script>
import { objFromPairs } from '@/util/common'
export default {
  props: ['options', 'value', 'disabled'],
  data () {
    return {
      tableData: []
    }
  },
  computed: {
    cascader: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('change', newVal)
        this.$emit('input', newVal)
      }
    }
  },
  methods: {
    renderRoomsName (list, floor) {
      let rooms = []
      let index = this.options.findIndex(f => {
        return f.value === floor
      })
      this.options[index].children.map(child => {
        list.map(item => {
          if (item === child.value) rooms.push(child.name)
        })
      })
      return rooms.join(' , ')
    }
  },
  watch: {
    'cascader': {
      handler: function (v) {
        if (!v) return
        let newData = []
        v.forEach(item => {
          if (item.length) {
            let fIndex = this.options.findIndex(op => {
              return op.name === item[0]
            })
            let index
            this.options.forEach(tt => {
              if (tt.name === item[0]) {
                index = tt.children.findIndex(ss => {
                  return item[1] === ss.id
                })
              }
            })
            if (index > -1) {
              let arr = [this.options[fIndex].name, this.options[fIndex].children[index].id]
              newData.push(arr)
            }
          }
        })
        const tempCascader = objFromPairs(newData)
        let temArr = []
        Object.keys(tempCascader).map(item => {
          temArr.push({ floor: item, rooms: [], id: [] })
        })
        v.map(floor => {
          const index = temArr.findIndex(item => {
            return item.floor === floor[0]
          })
          if (index > -1) temArr[index].rooms.push(floor[1])
        })
        this.tableData = temArr.sort((a, b) => {
          return b.floor - a.floor
        })
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="less">
.cascader-multi /deep/ .values {
  cursor: pointer;
  opacity: 0;
  max-height: 38px;
  input {
    cursor: pointer;
  }
}
.cascader-multi {
  /deep/ .icon-del {
    display: none
  }
  border: none!important;
  /deep/ .icon-arrow {
    display: none;
  }
}
.el-form .el-form-item.is-required .cascaderclassbtn{
  background: none!important;
}
.demo {
  line-height: 25px;
  &.el-table /deep/ th {
    background: #FEF5BE!important;
    div {background: none}
  }
}

// .has-gutter tr {
//   /deep/ .el-table_4_column_15 {
//     line-height: 20px;
//   }
//   /deep/ .el-table_4_column_14 {
//     line-height: 20px;
//   }
// }
</style>
