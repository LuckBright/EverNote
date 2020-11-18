<template>
  <div>
    <div>
      <el-autocomplete
        class="input-new-tag"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        clearable
        :fetch-suggestions="querySearch"
        :select-when-unmatched="true"
        @select="handleSelect"
        @keyup.enter.native="handleInputConfirm"
      ></el-autocomplete>
      <el-button v-if="showBtn" class="button-new-tag" size="small" @click="handleInputConfirm">添加</el-button>
      <el-tag
        :key="tag.id"
        :label="tag.name"
        :value="tag.id"
        v-for="tag in tags"
        closable
        :disable-transitions="false"
        @close="removeTag(tag)"
      >{{tag}}</el-tag>
    </div>
  </div>
</template>
<script>
import api from '@/crm/store/tagapi'
export default {
  props: {
    'tags': {
      type: Array,
      default: function () {
        return []
      }
    },
    'showBtn': {
      type: Boolean,
      default: true
    },
    'objLabelList': {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      api,
      inputValue: '',
      alluseArr: [],
      restaurants: []
    }
  },
  methods: {
    querySearch (queryString, cb) {
      let restaurants = this.restaurants
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    getlabels () {
      this.api.list({ highFrequency: 0, status: 0 }).then(rs => {
        if (rs.head.errCode === 0) {
          this.alluseArr = rs.data.resultList
        }
      })
    },
    handleSelect () {
      this.handleInputConfirm()
    },
    removeTag (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
      this.objLabelList.splice(this.objLabelList.indexOf(tag), 1)
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue.length > 20) {
        this.$messageTips(this, 'warning', '标签内容最多不超过20个字符')
      } else {
        if (inputValue) {
          if (this.tags.includes(inputValue)) {
            this.$messageTips(this, 'warning', '此标签已添加过，请勿重复添加')
            return false
          }
          this.api.createOrGet({ name: inputValue }).then(rs => {
            this.tags.push(rs.data.name)
            this.objLabelList.push(rs.data.id)
          })
        }
        this.inputVisible = false
        this.inputValue = ''
      }
    }
  },
  mounted () {
    this.api.list({ highFrequency: 0, status: 0 }).then(rs => {
      if (rs.head.errCode === 0) {
        this.restaurants = rs.data.resultList
      }
    })
  }
}
</script>
