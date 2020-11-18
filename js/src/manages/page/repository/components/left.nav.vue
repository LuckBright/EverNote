<template>
  <div class="left_menu">
        <div v-for="(item, index) in menuList"
             :key="index"
             class="left_menu_item el-tree-node__content"
             :class="{'active': item.name === selectedItem.name}"
             @click.stop="handleTab(item)"
             @contextmenu="showContenMenu(item)"
             >
          <div>
						<span>{{item.name}}</span>
						<span class="line"></span>
					</div>
        </div>
      </div>
</template>
<script>
export default {
  name: 'left_nav',
  props: {
    menuList: {
      type: Array,
      required: true
    },
    selectedItem: {
      type: Object,
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    showContenMenu(e) {
      this.$emit('leftNavContentMenu', e)
    },
    handleTab(item) {
      this.$emit('selectLeftTab', item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../css/templatemanage.scss';
.line {
	display: inline-block;
	width: 14px;
	height: 3px;
	background: #f5f5f5;
	border-radius: 4px;
  border-radius: 3.5px;
  position: relative;
  top: -8px;
}
</style>
