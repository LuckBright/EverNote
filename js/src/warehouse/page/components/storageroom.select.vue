<template>
  <el-select
    class="w"
    v-model="selectedRoomList"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    filterable
    :disabled="disabled"
    :placeholder="placeholder"
    v-bind="localProps"
    @change="changeValue">
    <el-option
      v-for="item in viewRoomList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>
<script>
  import api from '@/warehouse/page/storages/reportform/purchasing/purchasingapi.js'
  import '@/warehouse/page/building/assets/index.less'
  export default {
    props: {
      props: {
        type: Object,
        default () {
          return {}
        }
      },
      /**
       * 需要回显的数据，格式为
       * [
       *   {id: 'xx'},
       *   {id: 'xx'},
       * ]
       * 或者
       * ['xx']
       * 或者
       * {id: 'xx'}
       * 或者
       * 'xx'
       */
      value: {
        type: [Array, String, Object],
        default: () => []
      },
      multiple: Boolean,
      collapseTags: {
        type: Boolean,
        default: false
      },
      useObj: Boolean,
      params: {
        type: Object,
        default () {
          return {}
        }
      },
      initOptions: {
        type: Array,
        default: () => []
      },
      disabled: Boolean,
      placeholder: {
        type: String,
        default: ''
      },
    },
    data () {
      return {
        selectedRoomList: [],
        viewRoomList: [],
      }
    },
    computed: {
      localProps () {
        return {
          clearable: true,
          ...this.props,
        }
      }
    },
    created () {
      // 查询数组数据
      this.search()
    },
    watch: {
      value: {
        handler (val) {
          if (this.multiple) {
            if (val && val.length) {
              this.selectedRoomList = val.map(item => item.id === undefined ? item : item.id)
            } else {
              this.selectedRoomList = []
            }
          } else {
            if (val) {
              this.selectedRoomList = val.id === undefined ? val : val.id
            } else {
              this.selectedRoomList = ''
            }
          }
        },
        immediate: true,
      },
      'params': {
        handler (val) {
          this.search()
        },
        deep: true,
      }
    },
    methods: {
      search () {
        if (this.initOptions.length) {
          this.viewRoomList = this.initOptions
        } else {
          api.getAllStorageRooms(this.params).then(res => {
            if (res) {
              this.viewRoomList = res.filter(item => !item.isInvented && !item.isDelete)
            }
          })
        }
      },
      changeValue (value) {
        if (this.multiple) {
          if (value && value.length) {
            const list = value.map(item => this.viewRoomList.find(room => room.id === item))
            this.$emit('change', this.useObj ? list : list.map(item => item.id))
            this.$emit('input', this.useObj ? list : list.map(item => item.id))
          } else {
            this.$emit('change', [])
            this.$emit('input', [])
          }
        } else {
          if (value) {
            const list = this.viewRoomList.find(room => room.id === value)
            this.$emit('change', this.useObj ? list : list.id)
            this.$emit('input', this.useObj ? list : list.id)
          } else {
            this.$emit('change', '')
            this.$emit('input', '')
          }
        }
      },
    },
  }
</script>
