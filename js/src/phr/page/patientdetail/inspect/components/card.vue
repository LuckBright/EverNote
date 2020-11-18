<!--  -->
<template>
  <div class="card">
    <div class="icon-container">
      <svg class="icon svg-icon" aria-hidden="true">
          <use :xlink:href="`#icon-${iconName}-` + (done ? doneText : unText)"></use>
      </svg>
    </div>
    <div :class="{title: true,done: done}">{{titleText}}</div>
    <div class="content">
      <div class="text">操作：{{showData.user}}</div>
      <div class="text">时间：{{showData.time && $moment(showData.time).format('YYYY-MM-DD')}}</div>
      <div class="text">科室：{{showData.room}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    titleText: {
      default: '--'
    },
    iconName: {
      type: String,
      default: ''
    },
    done: {
      default: false
    },
    doneText: { // 未完成 已完成 svg后缀名
      default: 'yi1'
    },
    unText: {
      default: 'wei1'
    },
    showData: {
      type: [Object, String],
      default: () => {
        return {
          user: '',
          time: '',
          room: '',
        }
      }
    }
  },
  data () {
    return {
    }
  },

  components: {},

  computed: {},

  mounted () {},

  methods: {}
}

</script>
<style lang='scss' scoped>
.card {
  display: inline-block;
  width: 118px;
  height: 164px;
  .icon-container {
    height: 66px;
    width: 118px;
    text-align: center;
    box-sizing: border-box;
    padding-top: 20px;
    .icon {
      width: 40px;
      height: 40px;
    }
  }
  .title {
    font-size: 16px;
    text-align: center;
    margin-bottom: 5px;
  }
  .done {
    color: #4484C9;
    font-weight: bold
  }
  .content {
    font-size: 12px;
    background-color: #F9FAFA;
    border: 1px solid #F9FAFA;
    border-radius: 2px;
    padding: 5px;
    color: #878D94;
    .text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 20px;
    }
  }
}
</style>
