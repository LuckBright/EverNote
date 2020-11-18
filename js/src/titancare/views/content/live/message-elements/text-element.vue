<template>
  <div>
    <template v-for="(item, index) in contentList">
      <span :key="index" v-if="item.name === 'text'">{{ item.text }}</span>
      <img v-else-if="item.name === 'img'" class="emoji" :src="item.src" :key="index"/>
    </template>
  </div>
</template>

<script>
import { decodeText } from '@/titancare/utils/decodeText'
export default {
  name: 'TextElement',
  props: {
    payload: {
      type: Object,
      required: true
    }
  },
  computed: {
    contentList () {
      return decodeText(this.payload)
    }
  }
}
</script>

<style lang="scss" scoped>
.emoji {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}
</style>
