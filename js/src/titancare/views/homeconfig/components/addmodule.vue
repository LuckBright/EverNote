<template>
  <div class="add-box">
    <div class="add-title">
      <i class="el-icon-close" @click="closeAdd"></i>
      <span>添加模块</span>
      <el-button type="primary" size="small" @click="goAdd">下一步</el-button>
    </div>
    <div class="module-preview" v-if="activeItme.code">
      <img  :src="require('@/titancare/assets/img/homepre'+ activeItme.code +'.jpg')" alt="">
    </div>
    <div class="add-module-list">
      <template v-for="(item, index) in moduleList">
        <div class="module-item"  :key="index" v-if="item.code !== '99'" @click="chooseModule(item)">
          <div class="icon-box">
            <i class="el-icon-check" v-show="item.code === activeItme.code"></i>
          </div>
          {{item.name}}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import api from '@/titancare/api/homeconfig/homeconfigapi'
export default {
  props: ['nowModuleList'],
  data () {
    return {
      activeItme: false,
      moduleList: [
        {
          name: '搜索框',
          type: 1
        }
      ]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    goAdd () {
      this.$emit('goAdd', this.activeItme.code)
    },
    getList () {
      api.getValueSetItemByCode({ setCode: 'IH_MEMBER_HOME_SECTION' }).then((res) => {
        this.moduleList = res.data.filter((item) => {
          return !(this.nowModuleList.find((mitem) => {
            return mitem.type === item.code && ['4', '7', '8'].includes(item.code)
          }))
        })
        if (this.moduleList.length) {
          this.activeItme = this.moduleList[0]
        }
      })
    },
    closeAdd () {
      this.$emit('closeAdd')
    },
    chooseModule (item) {
      this.activeItme = item
    }
  }
}
</script>

<style lang="less" scoped>
  .add-title{
    display: flex;
    text-align: center;
    height: 48px;
    border-bottom: solid 1px #ccc;
    align-items: center;
    span{
      flex: 1;
    }
    i{
      font-size: 22px;
      color: #999;
      padding: 5px 10px;
      cursor: pointer;
    }
    button{
      margin-right: 10px;
      border-radius: 3px;
    }
  }
  .module-preview{
    height: 230px;
    line-height: 230px;
    text-align: center;
    img{
      width: 233px;
      vertical-align: middle;
    }
  }
  .add-module-list{
    border-top: solid 1px #ccc;
    .module-item {
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: solid 1px #ccc;
      cursor: pointer;
      &:hover {
        background: #f1f1f1;
      }
      .icon-box{
        display: inline-block;
        width: 18px;
      }
      i{
        color: #1B7AEE;
        font-size: 18px;
        margin-right: 10px;
        position: relative;
        top: 1px;
      }
    }
  }
</style>
