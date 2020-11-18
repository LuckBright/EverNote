<template>
  <div>
    <span @dblclick="toEdit" v-show="!edit">
      {{value}}
    </span>
    <span v-show="edit" ref="editdiv">
      <input @blur="update" v-model="data">
    </span>
  </div>
</template>
<script>
  export default {
    props: ['value', 'id', 'prop'],
    data () {
      return {
        edit: false,
        data: this.value
      }
    },
    methods: {
      toEdit () {
        this.edit = true
        this.$nextTick(_ => {
          this.$refs.editdiv.children[0].focus()
        })
      },
      update () {
        console.log('update')
        this.edit = false
        this.$emit('update', {
          id: this.id,
          prop: this.prop,
          value: this.data
        })
      }
    },
    created () {

    }
  }
</script>
