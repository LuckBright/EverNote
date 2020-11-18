<template>
  <div>
    <ever-bread-crumb name="打印集成 demo" path="/demo/layout/print"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <p>
          模板打印集成， 先
          <a href="/printer/tpl.html" target="_blank">制作要打印的模板</a>。
          制作完成后，将模板的 code 和 参数粘贴到对应下面的输入框即可进行集成打印测试。
        </p>
        <h4>单次打印</h4>
        <ever-form2 :schema="schema" v-model="obj">
          <el-button @click="print(obj.code, obj.params)">单个打印</el-button>
          <printbtn :code="obj.code" :params="params" :key="obj.code">打印按钮</printbtn>
        </ever-form2>
      </div>
    </div>

    <div class="layout_inner">
      <div class="panel-body">
        <h4>多次顺序打印</h4>
        <div>
          <div v-for="(oneObj,index) in objArr">
            <div style="text-align: right">
              <el-button @click="add()" size="mini">添加</el-button>
              <el-button @click="remove(index)" size="mini">删除</el-button>
            </div>
            <ever-form2  v-model="objArr[index]" :schema="schema" :nosubmit="true"> </ever-form2>
          </div>
          <el-button @click="printMulti()">打印</el-button>
          <el-button @click="printMulti(true)">预览打印</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { everprint } from '@/util/print'
import printbtn from '@/print/components/printbtn'
let schema = [
  {
    name: 'code',
    label: 'code'
  },
  {
    name: 'params',
    label: '参数'
  }
]
export default {
  data () {
    let obj = {
      code: '',
      params: '{}'
    }
    return {
      obj,
      schema,
      objArr: [{
        code: '',
        params: '{}'
      }],
      preview: false
    }
  },
  created () {
    // let code = 'thc_rcm.guahaotiao_mem_20181022'
    // let params = { id: '11111111' }
    // frPrint(code, params)
  },
  methods: {
    print (code, params, {cb, preview} = {cb: _ => { }, preview: true}) {
      everprint(code, JSON.parse(params), {
        preview,
        cb
      })
    },
    add () {
      this.objArr.push({
        code: '',
        params: '{}'
      })
    },
    remove (index) {
      this.objArr.splice(index, 1)
    },
    printArr (arr) {
      if (arr && arr.length) {
        let obj = arr.shift()
        this.print(obj.code, obj.params, {
          cb: _ => {
            if (arr.length) {
              this.printArr(arr)
            }
          },
          preview: obj.preview
        })
      }
    },
    printMulti (preview = false) {
      let arr = this.objArr.slice()
      arr = arr.map(v => {
        v.preview = preview
        return v
      })
      this.printArr(arr)
    }
  },
  components: {
    printbtn
  },
  computed: {
    'params' () {
      return JSON.parse(this.obj.params)
    }
  }
}
</script>
