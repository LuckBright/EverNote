<template>
  <div class="edit_con_wrap flex_col_1_auto pos_re" ref="editContent">
    <evereditor
      v-model="schema.element"
      :page-settings.sync="schema.pageSettings"
      :options="editorOpts"
      :editable.sync="editable"
      :toolbars="toolbars"
      mode="editor"
      ref="evereditor"
      v-if='empty && editorCreate'
    >
    </evereditor>
    <p v-else style="textAlign:center;height:300px">暂无报告</p>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/infusion/urlsfortech.js'
import evereditor from 'evereditor'
import { editorBaseOpts } from '@/util/common'

export default {
  components: {evereditor},
  data () {
    return {
      editorCreate: false,
      schema: {
        pageSettings: {},
        element: ''
      },
      editable: false,
      toolbars: [],
      editorOpts: {
        suggestItems: [],
        templateItems: [],
        customEchoData: {},
        ...editorBaseOpts
      },
      empty: true,
    }
  },
  methods: {
    async open (id, tempId) {
      this.empty = !!id
      this.dialogVisible = true
      if (!id) return
      this.schema.element = ''
      this.editorCreate = false
      let [data, config] = await Promise.all([request(urlMap.templateManage.getFormDataById, {id}), request(urlMap.medicalRecord.getDocTpl, {id: tempId})])
      if (data && data.data && data.data.data) this.schema.element = data.data.data.text || ''
      if (config && config.data && config.data.schema) this.schema.pageSettings = config.data.schema.pageSettings
      this.editorCreate = true
    }
  }
}
</script>
