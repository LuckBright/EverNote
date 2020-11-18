<template>
  <div class="layout_inner">
    <h3>返回导航使用demo</h3>
    <p>创建于2019-09-27</p>
    <h4>例1：默认返回</h4>
    <p>显示返回，返回策略 window.history.go(-1)</p>
    <ever-bread-crumb></ever-bread-crumb>
    <hr>
    <h4>例2：返回到指定path</h4>
    <p>显示返回，返回策略 $router.push(path) 所以，这里到path 只能返回当前工作站的路由</p>
    <ever-bread-crumb path="/xxx/yyy"></ever-bread-crumb>
    <hr>
    <h4>例3：显示名称，返回动态path</h4>
    <p>显示返回，返回策略 $router.push(path) 所以，这里到path 只能返回当前工作站的路由</p>
    <ever-bread-crumb :name="param === '-1' ? '创建xxx' : '编辑yyyy'" :path="'/xxx/yyy/' + param"></ever-bread-crumb>
    <hr>
    <h4>例4：通过快捷方式显示名称（简单用法）</h4>
    <p>使用simple 开启该功能</p>
    <ever-bread-crumb :path="'/xxx/yyy/' + param" simple></ever-bread-crumb>
    <hr>
    <h4>例5：通过快捷方式显示较为详细的名称（常用）</h4>
    <p>使用参数 paramKey（默认为 id ） paramValue（默认为-1或者'-1'） editName（默认为 编辑） createName （默认为 创建） 控制显示的具体标题</p>
    <ever-bread-crumb :path="'/xxx/yyy/' + param" create-name="创建机构" edit-name="编辑人员"></ever-bread-crumb>
    <hr>
    <h4>例6：通过快捷方式显示较为详细的名称（进阶用法）</h4>
    <p>使用参数 paramKey（默认为 id ） paramValue（默认为-1或者'-1'） editName（默认为 编辑） createName （默认为 创建） 控制显示的具体标题</p>
    <ever-bread-crumb :path="'/xxx/yyy/' + param" param-key="type" param-value="create" create-name="创建机构" edit-name="编辑人员"></ever-bread-crumb>
    <hr>
    <h4>例7：通过自定方法返回（高阶用法）</h4>
    <p>通过 is-custom-back 启用</p>
    <ever-bread-crumb is-custom-back @back="backTo"></ever-bread-crumb>
    <hr>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        param: ''
      }
    },
    created () {
      this.param = this.$route.params.id
    },
    methods: {
      backTo () {
        console.log('我要返回到外国去')
      }
    }
  }
</script>
