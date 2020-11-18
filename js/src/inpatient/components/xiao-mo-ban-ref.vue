<template>
  <div class="xiao-moban flex_column_full flex_layout_scroll">
    <el-input v-model="name" @change="searchByName" placeholder="请输入模版名称关键字"></el-input>
    <el-tree
      :data="data"
      node-key="id"
      :default-expand-all="expandAll"
      :props="defaultProps"
      class="flex_layout_scroll">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-popover
            placement="bottom"
            title="预览"
            width="400"
            v-model="data.visible"
            trigger="click">
            <evereditor  menu="base" :html="modelContent" ref="editor" :editable="false" mode="editor" :options="editorOpts"></evereditor>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="data.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="queryQoute(data)">确定</el-button>
            </div>
            <el-button  type="text" size="mini" slot="reference" @click="() => quote(data)" v-if="data.formDataId && $route.meta.handleType !== 1">引用</el-button>
          </el-popover>
        </span>
      </span>
    </el-tree>

  </div>
</template>
<script>
  import api from '@/form/store/tplmanageapi.js'
  import modelDataApi from '@/form/store/api.js'
  import evereditor from 'evereditor'
  import {editorBaseOpts} from '@/util/common'
  export default {
    props: [],
    data () {
      return {
        editorOpts: {
          ...editorBaseOpts
        },
        modelContent: ' ',
        expandAll: false,
        name: '',
        data: [],
        defaultProps: {
          children: 'nodes',
          label: 'name'
        }
      }
    },
    created () {
      this.getTreeData()
    },
    methods: {
      searchByName () {
        this.expandAll = true
        this.getTreeData()
      },
      getTreeData () {
        api.getDataTpl({
          name: this.name,
          type: 2,
          dptId: this.$route.query.dptId
        }).then(result => {
          if (!result) return false
          this.data = result
        })
      },
      queryQoute (data) {
        data.visible = false
        this.$bus.$emit('ref:miniAppend', this.modelContent)
      },
      quote (data) {
        data.visible = true
        modelDataApi.getById(data.formDataId).then(res => {
          this.modelContent = res.data.text
        })
        // if (data.children) {
        //   this.$bus.$emit('ref:append', data.children.map(v => v.label).join(' '))
        // } else {
        //   this.$bus.$emit('ref:append', data.label)
        // }
      }
    },
    components: {
      evereditor
    }
  }
</script>
