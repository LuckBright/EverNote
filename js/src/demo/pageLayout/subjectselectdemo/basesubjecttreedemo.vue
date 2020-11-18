<template>
  <div>
    <div class="oxhya" style="height:1000px; overflow: auto;">
      <ever-subject-select ref="ess" v-model="subjectList2" type="tree" multiple :props="props"></ever-subject-select>
      <!-- 表单内的使用如下：打开注释看例子 -->
      <!-- <ever-form2
        v-model="queryObj"
        :schema="querySchema"
        :rules="formrules"
        ref="form"
        :span="12"
        class="diy-star"
      >
        <template slot="tree1">
          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            @check-change="chg">
          </el-tree>
        </template>
      </ever-form2> -->
    </div>
  </div>
</template>
<script>
let querySchema = [
  {
    name: 'curDptranges',
    label: '适用科室',
    comp: 'ever-subject-select',
    props: {
      props: {
        'check-strictly': true,
      },
      type: 'tree',
      // multiple: true,
      fields: 'orgSubjectCode'
    },
    span: 24
  },
  {
    name: 'tree1',
    label: '树1',
    comp: 'custom'
  }
]

let codeDpt = (rule, value, callback) => {
  console.log(JSON.stringify(value), 'valuevaluevalue')
  if (value.length === 0) {
    callback(new Error('选择科室'))
  } else {
    callback()
  }
}

let codeDpt1 = (rule, value, callback) => {
  console.log(JSON.stringify(value), 'valuevaluevalue1111')
  if (value.length === 0) {
    callback(new Error('选择科室1111'))
  } else {
    callback()
  }
}

export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.tree1 = []
    queryObj.curDptranges = []
    return {
      querySchema,
      queryObj,
      subjectList2: [],
      props: {
        'check-strictly': true,
      },
      formrules: {
        curDptranges: [{
          required: 'true',
          message: '请选择适用科室',
          validator: codeDpt,
          trigger: ['change']
        }],
        tree1: [
          {required: true, validator: codeDpt1, message: '请选择1111', trigger: 'change'}
        ]
      },
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    chg () {
      this.queryObj.tree1 = this.$refs.tree.getCheckedKeys()
    }
  },
}
</script>
