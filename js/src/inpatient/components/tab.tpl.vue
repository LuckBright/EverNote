<template>
  <div class="tab-tpl">
    <div class="tab-header">
      <ul>
        <template v-for="item in tabsList">
          <li
            :class="{'tpl-type-active': type === item.value}"
            :key="item.value"
            @click="getList(item.value)">{{item.label}}</li>
        </template>
      </ul>
    </div>
    <div class="tpl-body">
      <el-input class="search-name" v-model="templateName" placeholder="请输入模版名称" size="small">
        <i slot="suffix" class="el-input__icon el-icon-search search-btn" @click="queryTplList(type)"></i>
      </el-input>
      <div class="tpl-list">
        <ul>
          <li
            v-for="item in list"
            :key="item.id"
            :class="{'tpl-active': item.id === activeIndex}"
            @click="quote(item.id)">
            <i v-if="item.id === activeIndex && loadingTpl" class="el-icon-loading tpl-loading-icon"></i>
            {{item.templateName}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: '1'
    },
    query: Function,
    tabsList: {
      type: Array,
      default: () => [
        {label: '个人模版', value: '1'},
        {label: '科室模版', value: '2'}
      ]
    }
  },
  data () {
    return {
      name: '模版',
      templateName: '',
      list: [],
      activeIndex: '',
      loadingTpl: false
    }
  },
  computed: {
    type: {
      get () {
        return this.value
      },
      set (val) {
        if (val === this.value) {
          return
        }
        this.$emit('input', val)
        this.queryTplList(val)
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.queryTplList(this.type)
    },
    getList (val) {
      this.type = val
    },
    async queryTplList (templateType) {
      let data = []
      if (this.query) {
        data = await this.query({
          templateType: templateType || this.type,
          templateName: this.templateName
        })
      } else {
        data = []
      }
      this.list = data || []
    },
    async quote (tplId) {
      if (this.loadingTpl) {
        return
      }
      this.loadingTpl = true
      this.activeIndex = tplId
      this.$emit('quote', tplId, () => {
        window.setTimeout(() => {
          this.loadingTpl = false
        }, 1000)
      })
    }
  },
  watch: {
    'templateName' (val) {
      if (!val) {
        this.queryTplList(this.type)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .tab-tpl {
    height: 100%;
    display: flex;
    flex-direction: column;
    .tab-header {
      height: 30px;
      ul {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
      }
      .tpl-type-active {
        background-color: #f9f9f9;
        border-bottom: none;
      }
      li {
        cursor: pointer;
        flex: 1;
        font-size: 12px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        color: #4e5259;
        background-color: #ebedef;
        border-bottom: 1px #cccecf solid;
        border-right: 1px #cccecf solid;
        box-sizing: border-box;
        &:last-child {
          border-right: none;
        }
      }
    }
    .tpl-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #f9f9f9;
      padding: 0 5px;
      overflow: hidden;
      .search-name {
        margin: 10px 0;
      }
      .tpl-list {
        flex: 1;
        overflow-y: auto;
        ul {
          padding: 0;
          margin: 0;
        }
        li {
          position: relative;
          font-size: 12px;
          color: #2b333d;
          padding: 5px 0;
          cursor: pointer;
          &:hover {
            color: #1c7bef;
          }
          .tpl-loading-icon {
            color: #1c7bef;
            // top: 0;
            // right: 0;
          }
        }
        .tpl-active {
          color: #1c7bef;
        }
      }
      .search-btn {
        color: #333;
        cursor: pointer;
        font-size: 14px;
      }
    }
  }
</style>
