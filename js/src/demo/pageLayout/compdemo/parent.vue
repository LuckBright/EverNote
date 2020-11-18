<template>
  <div>
    <child :selValue="selArr" @change="testChange"></child>
    <p>
      <i>selArr:{{selArr}}</i>
    </p>
    <child1 :newselected="selected" @updateSelected="updateSelected1"></child1>
    <p>
      <i>selected:{{selected}}</i>
    </p>
    <child2 v-model="selected2"></child2>
    <p>
      <i>selected2:{{selected2}}</i>
    </p>
    <child3 v-model="address"></child3>
    <p>
      <i>address:{{address}}</i>
    </p>
    <child4 v-model="sel"></child4>
    <p>
      <i>sel:{{sel}}</i>
    </p>
    <dialog-range ref="dialogrange" :visible.sync="visibleRange"></dialog-range>
  </div>
</template>
<script>
import child from './child'
import child1 from './child1'
import child2 from './child2'
import child3 from './child3'
import child4 from './child4'
import dialogRange from '@/msgcenter/page/dialog.use.range'

export default {
  data () {
    return {
      selArr: ['zujian', 'form', 'input'],
      selected: ['zujian', 'form', 'input'],
      selected2: ['zujian', 'form', 'input'],
      address: 'ssssssssssssss',
      sel: [{ 'id': 14, 'pid': 122, 'label': '龙须面' }],
      visibleRange: true
    }
  },
  created () {

  },
  methods: {
    testChange (val) {
      this.selArr = val
    },
    updateSelected1 (val) {
      console.log(val, 'iiiiiiiiiiiiiiiiiii')
      this.selected = val
    },
    updateSelected2 (val) {
      console.log(val, '222222')
      this.selected2 = val
    }
  },
  components: {
    child,
    child1,
    child2,
    child3,
    child4,
    dialogRange
  }
}
</script>
