<template>
	<div class="mall">
    <coupon :routeUrl="'/card/couponedit'"></coupon>
	</div>
</template>
<script>
import Coupon from '@/titanmall/views/marketingTools/coupon/coupon.vue'
export default {
  components: {
    Coupon
  },
}
</script>

