import Vue from 'vue'

function createEle (createElement, obj, item) {
  let display = obj[item.name + 'Obj'] ? obj[item.name + 'Obj'].name : obj[item.name]
  return createElement('span', {
    style: {
      fontWeight: 'bold'
    }
  }, display)
}

export default Vue.component('ever-form-read', {
  props: ['schema', 'obj', 'span', 'labelWidth', 'labelPosition'],
  render (createElement) {
    console.log(this.span)
    let items = this.schema.map(item => {
      let formItem = createElement('el-form-item', {
        props: {
          label: item.label
        }
      }, [
        createEle(createElement, this.obj, item)
      ])
      let col = createElement('el-col', {
        props: {
          span: item.span || this.span || 24
        }
      }, [
        formItem
      ])
      return col
    })

    return createElement('el-form', {
      props: {
        labelWidth: this.labelWidth || '120px',
        labelPosition: this.labelPosition || 'right'
      }
    }, [createElement('el-row', items)])
  }
})
