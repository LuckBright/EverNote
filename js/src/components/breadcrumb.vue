<template>
  <el-page-header class="ever-page-header" :class="{'no-content': !computedName()}" @back="goBack" :content="computedName()"></el-page-header>
<!--  <div class="layout_breadcrumb">-->
<!--    <el-breadcrumb separator="/">-->
<!--      <el-breadcrumb-item v-if="path === $route.path || showEditFnt === 'false' || showBack" :to="{ path: path }" :class="{'c_pointer': haveReturn}">-->
<!--        <i class="el-icon-arrow-left box_sha_1" v-if="haveReturn" @click="prevBack()"></i>-->
<!--          <span v-if="$slots.title">-->
<!--            <slot name="title"></slot>-->
<!--          </span>-->
<!--        <template v-else>{{name}}</template>-->
<!--      </el-breadcrumb-item>-->
<!--      <template v-else>-->
<!--        <el-breadcrumb-item v-if="showTitle" class="c_pointer">-->
<!--          <i class="el-icon-arrow-left box_sha_1" @click="prevBack()"></i>-->
<!--          <span v-if="$slots.title">-->
<!--            <slot name="title"></slot>-->
<!--          </span>-->
<!--          <template v-else>{{name}}</template>-->
<!--        </el-breadcrumb-item>-->
<!--        <el-breadcrumb-item v-else class="c_pointer">-->
<!--          <i class="el-icon-arrow-left box_sha_1" @click="prevBack()"></i>-->
<!--          {{(!$route.params.id || $route.params.id==-1) ? '新建' : '编辑'}}-->
<!--        </el-breadcrumb-item>-->
<!--      </template>-->
<!--    </el-breadcrumb>-->
<!--  </div>-->
</template>
<script>
  export default {
    // props: ['name', 'path', 'showEditFnt', 'showTitle', 'haveReturn', 'showBack', 'pathTo'],
    // methods: {
    //   prevBack () {
    //     let hisLen = window.history.length
    //     if (hisLen && !this.pathTo) {
    //       window.history.go(-1)
    //     } else {
    //       this.$router.push(this.path)
    //     }
    //   }
    // }
    props: {
      // 显示在右侧的名称，如果传值为"返回"则忽略（为了兼容老的写法）
      name: {
        type: String,
      },
      // 返回的路径
      path: {
        type: String,
      },
      // 默认情况不支持时使用
      isCustomBack: {
        type: Boolean,
      },
      // 辅助属性
      simple: {
        type: Boolean,
      },
      paramKey: {
        type: String,
      },
      paramValue: {
        type: String,
      },
      editName: {
        type: String,
      },
      createName: {
        type: String,
      },
    },
    methods: {
      computedName () {
        if (this.name === '返回' || !this.name) {
          return ''
        } else if (this.name) {
          return this.name
        } else {
          if (this.simple) {
            if (this.$route.params.id === -1 || this.$route.params.id === '-1') {
              return '创建'
            } else {
              return '编辑'
            }
          } else {
            if (this.createName && this.editName) {
              if (this.paramKey && this.paramValue) {
                if (this.$route.params[this.paramKey] === this.paramValue) {
                  return this.createName
                } else {
                  return this.editName
                }
              } else {
                if (this.$route.params.id === -1 || this.$route.params.id === '-1') {
                  return this.createName
                } else {
                  return this.editName
                }
              }
            }
          }
        }
      },
      goBack () {
        if (this.isCustomBack) {
          this.$emit('back', this.path)
          return
        }
        if (this.path) {
          this.$router.push(this.path)
        } else {
          if (window.history.length) {
            window.history.go(-1)
          }
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
  /*.el-breadcrumb {*/
  /*  font-size: 14px;*/
  /*  .el-icon-arrow-left {*/
  /*    padding: 1px;*/
  /*    cursor: pointer;*/
  /*    background: #fff;*/
  /*    border-radius: 2px;*/
  /*  }*/
  /*}*/
</style>
