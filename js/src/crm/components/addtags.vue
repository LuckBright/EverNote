<template>
  <el-dialog title="添加标签" class="ui_dialog_02 spe" :visible.sync="visible">
    <div>
      <el-autocomplete
        class="input-new-tag pd20"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        :fetch-suggestions="querySearch"
        :select-when-unmatched="true"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
        @select="handleSelect"
      ></el-autocomplete>
      <el-button class="button-new-tag" size="small" @click="handleInputConfirm">确定</el-button>
    </div>
    <div class="pdb20">
      已选择：
      <el-tag
        v-for="tag in tags"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="removeTag(tag)"
      >{{tag}}</el-tag>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="el-button el-button--primary btnwid" @click="showInput">添加</el-button>
      <el-button class="button-new-tag btnwid" @click="closeTags">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '../store/tagapi'

export default {
  props: ['users', 'save'],
  data () {
    return {
      api,
      inputValue: '',
      tags: [],
      restaurants: [],
      objLabelList: [],
      visible: false
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
    handleSelect (item) {
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
    },
    showInput () {
      let memberIds = []
      this.users.forEach(item => {
        memberIds.push(item.id)
      })
      this.api.addTagbatch({ 'patientIds': memberIds, 'labelIds': this.objLabelList }).then(rs => {
        if (rs.head.errCode === 0) {
          this.$messageTips(this, 'success', '批量添加标签成功')
          this.visible = false
          this.tags = []
          this.$emit('save')
        }
      })
    },
    closeTags () {
      this.visible = false
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
<style scoped>
.pd20 {
  padding: 20px 0px;
}
.pdb20 {
  padding-bottom: 20px;
}
.el-tag {
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(64, 158, 255, 0.2);
  white-space: nowrap;
  padding: 0 10px;
  border-radius: 4px;
  margin-left: 10px;
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}
.btnwid {
  width: 80px;
}
</style>
