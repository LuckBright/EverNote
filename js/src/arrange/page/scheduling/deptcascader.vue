<template>
  <el-cascader
    :clearable="!showFirstDept"
    :disabled="disabled"
    placeholder="请选择科室"
    size="small"
    filterable
    v-model="selectDept"
    :options="allDeptTreeList"
    :props="props"
    @change="changeCascader"
  ></el-cascader>
</template>
<script>
import schedulingapi from '@/arrange/store/schedulingapi'
export default {
  props: ['value', 'organId', 'showFirstDept', 'disabled', 'templateType', 'initValue', 'reset', 'getIdFlag'], // getIdFlag 表示只需要获取到id即可 不用整个object
  data () {
    return {
      schedulingapi,
      rootDeptList: [],
      allDeptList: [],
      allDeptTreeList: [],
      selectDept: (this.getIdFlag ? this.value || [] : []),
      // selectDept: ['ca88520c-ca58-4df6-b38e-6d9df3860c59', '2fc3c311-e0db-4320-b3bf-d16764bf531e'],
      categoryIds: [],
      clinicalTypeIds: [],
      allValue: [],
      props: {
        label: 'deptName',
        value: 'id',
        children: 'children'
      },
      params: {
        organId: this.organId,
        templateType: this.templateType
      }
    }
  },
  watch: {
    'organId' (val) {
      if (val) {
        this.params.organId = val
      }
    },
    'templateType' (val) {
      if (val) {
        this.params.templateType = val
      }
    },
    'params': {
      handler (val) {
        if (val.organId && val.templateType) {
          this.getAllDeptList()
        }
      },
      deep: true
    },
    'selectDept': {
      handler (val, old) {
        // 只需要获取id数组的逻辑
        if (this.getIdFlag) {
          if (val) {
            this.$emit('input', val)
          }
        } else {
          if (val.join(',') !== old.join(',')) {
            let obj = this.getDeptItem(val)
            this.$emit('input', obj)
          }
        }
      },
      deep: true
    },
    'value' (val) {
      if (val) {
        this.getAllDeptList()
      } else {
        this.selectDept = []
      }
    }
  },
  created () {
    if (this.organId === undefined || this.reset) {
      this.getAllDeptList()
    }
  },
  methods: {
    getAllDeptList (callback) {
      if (this.params.templateType && parseInt(this.params.templateType) === 1) {
        this.categoryIds = ['1972']
        this.clinicalTypeIds = ['819', '840']
      } else if (this.params.templateType && parseInt(this.params.templateType) === 2) {
        this.categoryIds = ['1972', 'af3bc6b3-02af-4f21-8736-decce395e883']
        this.clinicalTypeIds = []
      } else {
        this.categoryIds = []
        this.clinicalTypeIds = []
      }
      this.schedulingapi.getAllDeptList({
        clinicId: this.params.organId,
        categoryIds: this.categoryIds,
        clinicalTypeIds: this.clinicalTypeIds
      }).then(rs => {
        this.allDeptList = rs.data
        this.allDeptTreeList = this.getDeptTreeList()
        if (this.value) {
          // 只需要获取到id 的逻辑
          if (Array.isArray(this.value) && this.getIdFlag) {
            this.allValue = this.value
            // this.getDeptFullValue(this.value)
            this.selectDept = this.value
          } else {
            this.allValue = [this.value.deptId]
            this.getDeptFullValue(this.value.id || this.value.deptId)
            this.selectDept = this.allValue.reverse()
          }
        } else if (this.initValue) {
          this.allValue = [this.initValue.deptId]
          this.getDeptFullValue(this.initValue.id || this.initValue.deptId)
          this.selectDept = this.allValue.reverse()
        } else if (this.showFirstDept) {
          let first = this.getFirstDept(this.allDeptTreeList[0])
          this.allValue = [first.id]
          this.getDeptFullValue(first.id)
          this.selectDept = this.allValue.reverse()
        }
        return callback && callback(this.allDeptList)
      })
    },
    getDeptItem (val) {
      if (!val[0]) {
        return ''
      }
      let dept = []
      dept = this.allDeptList.filter(item => {
        return item.id === val[val.length - 1]
      })
      if (this.value && dept[0]) {
        dept[0].isSource = !!this.value.isSource
        dept[0].isAppoint = !!this.value.isAppoint
      }
      return dept[0]
    },
    getDeptTreeList (id) {
      let pid = id || null
      let list = this.allDeptList.filter(item => {
        return item.supplyLocalSectionId === pid
      })
      list.map(item => {
        item.children = this.getDeptTreeList(item.id)[0] ? this.getDeptTreeList(item.id) : ''
        return item
      })
      return list.sort((a, b) => {
        return a.orderNum - b.orderNum < 0
      })
    },
    getDeptFullValue (id) {
      let arr = this.allDeptList.filter(item => {
        return item.id === id
      })
      if (arr[0] && arr[0].supplyLocalSectionId) {
        this.allValue.push(arr[0].supplyLocalSectionId)
        this.allValue.concat(this.getDeptFullValue(arr[0].supplyLocalSectionId))
      }
    },
    changeCascader (val) {
      this.$emit('change', val)
    },
    getFirstDept (val) {
      if (!val.children) {
        return val
      }
      return this.getFirstDept(val.children[0])
    }
  }
}
</script>
