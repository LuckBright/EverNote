<template>
  <div style="margin-top: 50px">
    <link rel=stylesheet href="https://prosemirror.net/css/editor.css">
    <!-- <pre style="font-size: 13px">{{pm && pm.state.doc}}</pre> -->
    <pre>{{descents('meta')}}</pre>
    <div id="editor" style="margin-bottom: 23px"></div>
    <input type="text" v-model="name"> {{name}}
    <button @click="addItem()">add item</button>
     <button @click="addMeta()">add meta</button>
    <button @click="save()">save</button>
  </div>
</template>
<script>
  import {EditorState, TextSelection} from 'prosemirror-state'
  import {EditorView} from 'prosemirror-view'
  import {DOMParser, Schema, Node} from 'prosemirror-model'
  import {schema} from 'prosemirror-schema-basic'
  const {exampleSetup} = require('prosemirror-example-setup')
  import {findParentNodeOfTypeClosestToPos, findParentNode, findChildren} from 'prosemirror-utils'
  var specs = {
    text: {},
    paragraph: {
      content: '(text|title|meta)*',
      parseDOM: [{ tag: 'p' }],
      toDOM: function toDOM (node) {
        return ['p', 0]
      }
    },
    title: {
      attrs: {
        column: {
          default: 'col'
        }
      },
      inline: true,
      content: 'text*',
      group: 'inline',
      parseDOM: [{ tag: 'span.title' ,
        getAttrs: dom => {
          console.log('getAttrs', dom)
          let column = dom.getAttribute('column')
          return {column}
        }}],
      toDOM: function toDOM (node) {
        console.log('toDOM', node)
        return ['span', { 'class': 'title', 'column': node.attrs.column }, ['span', { 'class': 'text' }, 0]]
      }
    },
    content: {
      content: '(paragraph)+',
      parseDOM: [{ tag: 'div.content' }],
      toDOM: function toDOM (node) {
        return ['div', { 'class': 'content' }, 0]
      }
    },
    item: {
      content: 'content',
      parseDOM: [{ tag: 'div.parent' }],
      toDOM: function toDOM(node) {
        return ["div", { 'class': 'item' }, 0];
      }
    },
    meta: {
      attrs: {
        column: {
          default: 'c'
        }
      },
      inline: true,
      group: 'inline',
      content: 'text*',
      // atom: true,
      parseDOM: [{tag: 'span.meta', getAttrs (dom) {
        return {
          column: dom.getAttribute('column')
        }
      }}],
      toDOM: function (node) {
        console.log('meta toDOM')
        return ['span', { 'class': 'meta', 'column': node.attrs.column }, ['span', { 'class': 'text' }, 0]]
      }
    },
    doc: {
      content: '(paragraph|item)+'
    }
  }

  var views = {
    meta: function meta (node) {
      console.log('meta')
      var dom = document.createElement('span')
      dom.className = 'meta'
      dom.setAttribute('column', node.attrs.column)
      dom.setAttribute('contenteditable', 'false')
      var contentDOM = document.createElement('span')
      contentDOM.className = 'text'
      contentDOM.setAttribute('contenteditable', 'true')
      // contentDOM.appendChild(document.createTextNode('555'))
      dom.appendChild(document.createTextNode('['))
      dom.appendChild(contentDOM)
      dom.appendChild(document.createTextNode(']'))
      return {
        dom,
        contentDOM: contentDOM,
        update: function update (node, decorations) {
          return true
        },
        ignoreMutation: function ignoreMutation (record) {
          return false
        }
      }
    },
    item: function item (node) {
      console.log('create item')
      var dom = document.createElement('div')
      dom.className = 'item'
      return {
        dom: dom,
        contentDOM: dom,
        update: function update (node, decorations) {
          return true
        },
        ignoreMutation: function ignoreMutation (record) {
          return false
        }
      }
    },
    title: function title (node, view, getPos, decorations) {
      console.log('create title', node)
      var dom = document.createElement('span')
      dom.className = 'title'
      dom.setAttribute('column', node.attrs.column)
      dom.setAttribute('contenteditable', 'false')
      var contentDOM = document.createElement('span')
      contentDOM.className = 'text'
      dom.innerHTML = '<i>' + node.attrs.column +'</i>'
      dom.appendChild(contentDOM)
      contentDOM.setAttribute('contenteditable', 'true')
      return {
        dom: dom,
        contentDOM: contentDOM,
        update: function update (node, decorations) {
          return true
        },
        ignoreMutation: function ignoreMutation (record) {
          return false
        }
      }
    }
  }

  export default {
    data () {
      return {
        editor: {},
        pm: null,
        count: 0,
        name: ''
      }
    },
    methods: {
      descents (type) {
        if (this.pm) {
          return findChildren(this.pm.state.doc, n => {
            console.log(n, n.type.name)
            return n.type.name === type
          }, true)
        }
      },
      addMeta () {
        // var item = document.createElement('div')
        // item.innerHTML = `<span class="meta" column="${this.name}">sss</span>`
        // this.pm.dom.appendChild(item)
        let view = this.pm
        view.dispatch(view.state.tr
                  .replaceSelectionWith(view.state.schema.nodes.meta.create({column: this.name, class: 'meta'})))
      },
      addItem: function () {
        let name = this.name
        // console.log("additem", this.pm)
        // var tr = this.pm.state.tr;
        // tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size));
        // this.pm.dispatch(tr);
        // var item = document.createElement('div');
        // item.innerHTML = "<div class=\"title\" column=\"abc\" contenteditable=\"false\">abc <span class=\"text\" contenteditable=\"true\">TITLE " + this.count + "</span></div><div class=\"content\"><p>CONTENT " + this.count + "</p> </div> <div class=\"meta\"  contenteditable=\"false\">事实上</div>";
        // item.innerHTML = `<span><span class="title" column="${name}">${this.count}</span></span>`
        this.count++;
        console.log(this.pm.dom, 'this.pm.dom')
        // this.pm.dom.appendChild(item);
        let txtDom = document.createElement('span')
        txtDom.className = 'text'
        txtDom.innerHTML = 'placeholder'
        txtDom.setAttribute('contenteditable', 'true')
        let view = this.pm
        view.dispatch(view.state.tr
                  .replaceSelectionWith(view.state.schema.nodes.title.create({column: this.name, class: 'meta'}, view.state.schema.text('sss'))))
      },
      save () {
        localStorage.setItem('content', JSON.stringify(this.pm.state.doc.toJSON()))
      }
    },
    mounted () {
      var editor = document.getElementById('editor')
      let schema1 = new Schema({
        nodes: specs,
        marks: schema.spec.marks
      })
      console.log('DOMParser', DOMParser.fromSchema(schema1).parse(JSON.parse(localStorage.getItem('content'))))
      let pm = this.pm = new EditorView(editor, {
        state: EditorState.create({
          schema: schema1,
          // doc: Node.fromJSON(schema1, JSON.parse(localStorage.getItem('content'))),
          plugins: exampleSetup({schema: schema1})
        }),
        dispatchTransaction: function dispatchTransaction(tr) {
          pm.updateState(pm.state.apply(tr));
        },
        nodeViews: views
      });
    }
  }
</script>
<style scoped>
.text {
  border-bottom: 1px solid;
  margin-left: 10px;
}
.ProseMirror-menubar {
  min-height: 30px !important;
}
div.view {
  border:1px solid red;
}

div.view > * {
  display:inline-block;
}
div.view > .text {
  background:#DFD;
}

</style>
