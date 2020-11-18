<template>
  <div>
    <el-popover
      placement="right"
      width="260"
      v-model="isVisible"
      trigger="click"
      class="custRecordPop">
      <el-row>
        <div v-for="(pitem, pindex) in relationData" :key="pindex" style="height:50px;line-height:50px;">
          <el-col :span="19">
            <el-input v-model="pitem.name" placeholder="请输入随访分类"></el-input>
          </el-col>
          <el-col :span="3" align="center">
            <span class="deleteType"><i class="iconfont icon-delete" @click="deleteNumber(pitem, pindex)"></i></span>
          </el-col>
          <el-col :span="2" align="center">
            <span class="addType"><i v-if='pindex === 0' class="iconfont icon-tianjia" @click="add(pitem, pindex)"></i></span>
          </el-col>
        </div>
        <el-col :span="24" align="right" style="height:50px;line-height:50px;text-align:left;">
          <el-button type="primary" @click="save">确定</el-button>
        </el-col>
      </el-row>
      <el-button slot="reference" @click="show">管理</el-button>
    </el-popover>
  </div>
</template>
<script>
import api from '@/crm/store/memberapi'
export default {
  props: ['kinship'],
  data () {
    return {
      api,
      relationData: [],
      tempData: [],
      isVisible: false
    }
  },
  methods: {
    show () {
      this.relationData = []
      if (this.kinship.length) {
        this.relationData = JSON.parse(JSON.stringify(this.kinship))
      } else {
        this.relationData.push({name: ''})
      }
      this.$emit('show')
    },
    add () {
      this.relationData.push({name: ''})
    },
    deleteNumber (item, index) {
      if (this.relationData.length > 1) {
        if (!item.id) {
          this.relationData.splice(index, 1)
          return false
        }
      } else {
        if (!item.id) {
          this.relationData = [{name: ''}]
          return false
        }
      }
      this.$confirm('是否删除此条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteCategory({id: item.id}).then(rs => {
          if (rs.head.errCode === 0) {
            if (this.relationData.length > 1) {
              this.relationData.splice(index, 1)
            } else {
              this.relationData = [{name: ''}]
            }
            this.tempData = this.relationData.filter(item => {
              return item.id
            })
            this.typeVisible = true
            this.$emit('update', this.tempData)
          }
        })
      }).catch((e) => {
        this.isVisible = true
      })
    },
    save () {
      this.isVisible = false
      let params = this.relationData.filter(item => {
        return item.name
      })
      this.api.createKinship(params).then(rs => {
        if (rs && rs.data.length > 0) {
          this.$emit('update', rs.data)
        }
      })
    }
  }
}
</script>
