<template>
  <div class="layout_box card_wrap">
    <router-view class="station_layout_wrap"></router-view>
  </div>
</template>

<script>
  import session from '../../util/session'
  import '../../mall/assets/mall.css'
  export default {
    mixins: [session]
  }
</script>
<style scoped>
	.layout_box {
		height: 100%;
	}
</style>

