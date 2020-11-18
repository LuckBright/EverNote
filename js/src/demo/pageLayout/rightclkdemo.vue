<template>
  <div class="layout_inner">
    <p>鼠标右击组件 by xujianwei@everjiankang.com</p>
    <p><b class="cRed">contextmenu (@/workspace/components/contextmenu)</b></p>
    <p>属性与方法</p>
    <ever-table
      :columns="columns"
      :data="tableData"
      border
    ></ever-table>
    <p data="{id:111,name:'222222'}" class="username"><span>管理员</span>:xx</p>
    <p data="{id:33,name:'222222'}" class="username"><span>张三</span>:xx</p>
    <p data="{id:44,name:'222222'}" class="username"><span>李四</span>:xx</p>
    <p data="{id:55,name:'222222'}" class="username"><span>李小溪</span>:xx</p>
    <contextmenu :class-name="username" :menu="rightMeun" @menu="getMenuList" @select="contextSelect"></contextmenu>
  </div>
</template>
<script>
import contextmenu from '@/workspace/components/contextmenu'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
import { demoTableColumnArr as columns } from '@/demo/store/config'

export default {
  data () {
    return {
      columns,
      tableData: [
        {
          id: U(),
          param: 'class-name',
          description: '相应右击的元素的className',
          type: 'string',
          required: false,
          default: '',
        },
        {
          id: U(),
          param: 'menu',
          description: '右击菜单列表（child可以添加子菜单，只支持二级菜单 border 表示下面加一条线）',
          type: 'Arrya',
          required: true,
          default: '[]',
        },
        {
          id: U(),
          param: 'menu',
          description: '右击事件，回调方法里面有两个参数，index，data',
          type: 'function',
          required: true,
          default: 'function',
        },
        {
          id: U(),
          param: 'select',
          description: '右击某一项执行的方法',
          type: 'function',
          required: true,
          default: 'function',
        },
      ],
      username: 'username',
      rightMeun: [
        {id: '1', name: '撤回', disabled: false, methodName: 'fun', border: true},
        {
          id: '2',
          name: '整方撤回',
          disabled: false,
          isRecipe: true,
          methodName: 'fun1',
          child: [
            {
              name: '检查预约',
              id: 'jcyy',
            },
            {
              name: '治疗预约',
              id: 'zlyy',
            },
          ]
        },
        {id: '3', name: '取消', disabled: false, methodName: 'fun2'},
      ]
    }
  },
  methods: {
    getMenuList (index, data) {
      console.log(index, data)
    },
    // 右键操作按钮列表点击回调
    contextSelect (item, index, data) {
      console.log(item, index, data)
      // this[item.methodName]()
    },
    fun (item) {
      this.$confirm('确定要执行该操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(11111111111111)
      }).catch(() => {

      })
    }
  },
  components: {
    contextmenu
  }
}
</script>
