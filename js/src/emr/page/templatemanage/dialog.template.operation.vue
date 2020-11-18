<template>
  <div class="dialog_template_operation">
    <add-tpl 
      v-if="operation==='addTpl'"
      :dialog-visible.sync="show"
      :api="api"
      :workshop="workshop"
      :checkParams="checkParams"
      @submit="add"
      @close="close"
    >
    </add-tpl>
    <edit-tpl 
      v-else-if="operation==='editTpl'"
      :dialog-visible.sync="show" 
      :api="api"
      :workshop="workshop"
      :checkParams="checkParams"
      @update="edit"
      @close="close"
    >
    </edit-tpl>
    <add-entry 
      v-else-if="operation==='addEntry'"
      :dialog-visible.sync="show" 
      :api="api"
      :workshop="workshop"
      :checkParams="checkParams"
      @submit="add"
      @close="close"
    >
    </add-entry>
    <edit-entry 
      v-else-if="operation==='editEntry'"
      :dialog-visible.sync="show"
      :api="api"
      :workshop="workshop"
      :checkParams="checkParams"
      @update="edit"
      @close="close"
    >
    </edit-entry>
    <!-- <div v-else>请重新操作</div> -->
  </div>
  
</template>
<script>
import addTpl from './add.tpl'
import editTpl from './edit.tpl'
import addEntry from './add.entry'
import editEntry from './edit.entry'
export default {
  name: 'template_operation',
  components: {
    addTpl,
    editTpl,
    addEntry,
    editEntry
  },
  props: {
    operation: {// addTpl,editTpl,addEntry,editEntry
      type: String,
      default: ''
    },
    workshop: {
      type: String
    },
    checkParams: {
      type: Object,
      default () {
        return {
          categoryId: '',
          businessType: '',
          businessId: '',
          categoryName: ''
        }
      }
    },
    api: {
      type: Object
    }
  },
  data () {
    return {
      show: false,
      attrs: ['modelCopy', 'delivery', 'searchTemplate', 'modelAttr', 'defaultTpl'],
      copyObj: null
    }
  },
  watch: {
    'operation' (val) {
      if (val) {
        this.show = true
      } else {
        this.show = false
      }
    }
  },
  methods: {
    filterObj (obj) { // 过滤掉后端数据交互不需要的属性
      this.copyObj = obj
      this.attrs.forEach(attr => {
        delete this.copyObj[attr]
      })
    },
    add (obj) {
      this.filterObj(obj)
      this.$emit('update:operation', '')
      // this.copyObj.formTemplateId = null
      // this.$emit('add', this.copyObj)
      this.$parent.addTpl(this.copyObj)
    },
    close (obj) {
      this.$emit('update:operation', '')
      this.$emit('close')
    },
    edit (obj) {
      this.filterObj(obj)
      this.$emit('update:operation', '')
      // this.$emit('edit', this.copyObj)
      this.$parent.updateTpl(this.copyObj)
    }
  }
}
</script>
