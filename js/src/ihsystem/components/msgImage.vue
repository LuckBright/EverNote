<template>
  <div :class="item.from === $route.query.creatorId ? 'chat-sender' : 'chat-receiver'">
    <div><img :src="photoUrl(item.avatar)"></div>
    <div class="msgimage" v-if="imgUrl">
      <img @load.once="loadSuccess" :src="imgUrl" :data-src="bigImgUrl" style="width:100%;height:100%;border-radius:4px;cursor: pointer;" @click="clickImage"/>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item', 'imagesList'],
  name: 'msgImage',
  data () {
    return {
      avatar: require('@/assets/avtarbg.png'),
      imgUrl: this.item.payload.imageInfoArray[0].imageUrl,
      bigImgUrl: ''
    }
  },
  created () {
    this.bigImgUrl = this.imgUrl.split('?')[0]
  },
  methods: {
    photoUrl (val) {
      let url = ''
      if (val && val.indexOf('http') > -1) {
        url = val
      } else if (val) {
        url = this.$ever.fileUrl2 + val
      } else {
        url = this.avatar
      }
      return url
    },
    loadSuccess (e) {
      this.$nextTick(_ => {
        this.$emit('load')
      })
    },
    clickImage (e) {
      this.$emit('imgClick', e)
    }
  }
}
</script>

<style scoped src="../assets/im.css"></style>
