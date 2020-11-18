<!--  -->
<template>
  <div class="search-container" v-loading="loading">
    <listswitch @go="go"></listswitch>
    <div class="bg" v-show="!hadAttention && !loading">
      <img class="person" src="../../assets/img/person-min.png" />
    </div>
    <div class="content" v-show="!loading">
      <search-box :had-attention="hadAttention" :scope="scope"></search-box>
      <div class="attention-box" v-show="hadAttention">
        <div class="text fl bold">我的关注病例</div>
        <div class="switch fr pos_re">
          <span
            class="card pos_ab inline-block iconfont icon-kapian"
            :class="{ positive: positive === 1 }"
            @click="positive = 1"
          ></span>
          <span
            class="para pos_ab inline-block iconfont icon-duanluoxinxi"
            :class="{ positive: positive === 2 }"
            @click="positive = 2"
          ></span>
        </div>
        <hr class="hr" />
        <div
          class="cards inline-block"
          v-for="item in follows"
          :key="item.patientId"
          v-show="positive === 1"
        >
          <transition name="fade">
            <card :data="item" @delete="deleteFollows"></card>
          </transition>
        </div>
        <div class="list" v-show="positive === 2">
          <list :list="follows" @delete="deleteFollows"></list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchBox from '@/phr/page/patientlist/search'
import card from '@/phr/page/patientlist/card'
import list from '@/phr/page/patientlist/list'
import urlMap from '@/phr/api/urls'
import { request } from '@/util/req'
import listswitch from '@/phr/page/patientlist/listswitch'
const { follow, scope } = urlMap.search
export default {
  props: {},
  data () {
    return {
      positive: 1,
      follows: [],
      loading: false,
      scope: '',
      tableListStatus: false
    }
  },

  components: {
    searchBox,
    card,
    list,
    listswitch
  },

  computed: {
    hadAttention () {
      return this.follows.length !== 0
    }
  },
  created () {
    this.getScope()
  },
  mounted () {
    const el = document.querySelector('#navThirdList')
    el.style.top = '-99999px'
    el.style.position = 'absolute'
  },
  beforeDestroy () {
    const el = document.querySelector('#navThirdList')
    el.style.top = ''
    el.style.position = ''
  },
  methods: {
    go () {
      this.$router.push({ name: 'patienttable' })
    },
    async getScope () {
      this.loading = true
      const res = await request(scope)
      this.scope = res && res.data && res.data.scope
      this.getFollow(this.scope)
    },
    async getFollow (scope) {
      const res = await request(follow, { scope, rid: 'Auth_menu_phr_patientlist', offset: 0, pagesize: 1000 })
      this.follows = res && res.data
      this.follows.map(item => {
        this.$set(item, 'status', true)
      })
      this.loading = false
    },
    async deleteFollows (patientId) {
      for (let i = 0; i < this.follows.length; i++) {
        if (this.follows[i].patientId === patientId) {
          this.follows.splice(i, 1)
        }
      }
      await request(urlMap.search.switch, { patientId })
    }
  }
}

</script>
<style lang='scss' scoped>
.search-container {
  position: relative;
  overflow: auto;

  .bg {
    background-image: url('../../assets/img/search-min.png');
    position: absolute;
    top: -2px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    zoom: 1;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center 0;
    .person {
      position: absolute;
      right: 30px;
      bottom: 20px;
      height: 70%;
    }
  }
  .content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
  .attention-box {
    width: 80%;
    margin: 0 auto;
    margin-top: 180px;
    .switch {
      height: 20px;
      width: 50px;
      .card {
        left: -2px;
        top: 15px;
        font-size: 14px;
        color: #878d94;
      }
      .para {
        top: 13px;
        left: 20px;
        font-size: 18px;
        color: #878d94;
      }
      .positive {
        color: #4484c9;
      }
    }
    .text {
      color: #777f8b;
      margin: 10px;
      font-size: 14px;
    }
    .hr {
      border-color: #d7d9db;
      clear: both;
      opacity: 0.3;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
