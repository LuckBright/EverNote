<template>
  <div class="layout_inner">
    <p>左侧飘窗组件 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">slide-window</b></p>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      border
    ></ever-table>
    <textarea cols="100" rows="10">
      <slide-window>
        <template slot="handler">
          <span style="width:1em; line-height:1.2em">患者列表</span>
        </template>
        <template slot="default">
          <p>by lvjiangtao@everjiankang.com</p>
          <p>注释：readme</p>
          <p>右侧滑块点击事件（triggleLeftFun）来切换 父元素的 left css</p>
          <p>初始的时候left：0</p>
          <p>点击收起来 left：-YYYYpx yyyy是实际元素的宽度</p>
          <p>页面主体元素 添加 click.stop 阻止事件传播(这里可以优化)</p>
          <p>mounted 之后绑定 domClickHandle 方法</p>
          <p>传入元素id</p>
          <p>slideWindow为公共样式写在app.less内</p>
          <p>当前页面内需要自定义 slideWindow 的padding-top</p>
          <p>所有涉及到滑块点击控制左侧收起隐藏的统一用这种dom结构</p>
          <p>方法名和元素id根据实际使用场景灵活定义</p>
        </template>
      </slide-window>
    </textarea>

    <slide-window
      :width="530"
      :paddingTop="50"
      :show="isShow"
      @getData="handleFun">
      <template slot="handler">
        <span style="width:1em; line-height:1.2em">患者列表</span>
      </template>
      <template slot="default">
        <div class="flex-column h100">
          <div style="overflow:auto">
            <p>by lvjiangtao@everjiankang.com</p>
            <p>注释：readme</p>
            <p>右侧滑块点击事件（triggleLeftFun）来切换 父元素的 left css</p>
            <p>初始的时候left：0</p>
            <p>点击收起来 left：-YYYYpx yyyy是实际元素的宽度</p>
            <p>页面主体元素 添加 click.stop 阻止事件传播(这里可以优化)</p>
            <p>mounted 之后绑定 domClickHandle 方法</p>
            <p>传入元素id</p>
            <p>slideWindow为公共样式写在app.less内</p>
            <p>当前页面内需要自定义 slideWindow 的padding-top</p>
            <p>所有涉及到滑块点击控制左侧收起隐藏的统一用这种dom结构</p>
            <p>方法名和元素id根据实际使用场景灵活定义</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
            <p>测试</p>
          </div>
        </div>
      </template>
    </slide-window>
  </div>
</template>
<script>
import { demoTableColumnArr as columns } from '@/demo/store/config'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import SlideWindow from '@/components/slidewindow'

export default {
  components: {
    SlideWindow
  },
  data () {
    return {
      columns,
      tableData: [
        {
          id: U(),
          param: 'width',
          description: '飘窗宽度',
          type: 'Number',
          required: true,
          default: 330,
        },
        {
          id: U(),
          param: 'paddingTop',
          description: '上边距（默认占位防止遮挡头部header）',
          type: 'Number',
          required: false,
          default: 40,
        },
        {
          id: U(),
          param: 'show',
          description: '是否默认展开/显示飘窗',
          type: 'Boolean',
          required: true,
          default: 'false',
        },
        {
          id: U(),
          param: '预留slot插槽',
          description: '',
          type: '',
          required: false,
          default: '',
        },
        {
          id: U(),
          param: 'handler',
          description: '操作区',
          type: 'slot',
          required: true,
          default: '<template slot=handler><span>列表</span></template>',
        },
        {
          id: U(),
          param: 'defalut',
          description: '内容区',
          type: 'slot',
          required: true,
          default: '<template slot=defalut><el-table></el-table></template>',
        },
      ],
    }
  },
  mounted () {
  },
  methods: {
    handleFun () {
      console.log('handler')
    }
  }
}
</script>
