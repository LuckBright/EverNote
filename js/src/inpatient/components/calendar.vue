<template>
  <section class="calendar_container" id="calendar_scroll">
    <ul ref="calendarLi" :style="{width:calendarLiWidth * calendarArr.length + 'px'}">
      <li v-for="(item,index) in calendarArr" :key="index" :class="{cur: index == currentIndex}" @click="chooseCalendar(item.date,item.txt,index)">
        <var>{{item.date_txt}}</var>
      </li>
    </ul>
    <div class="bottom_line" :style="{width:calendarLiWidth + 'px',transform: 'translateX('+lineTranslateX +'px)'}"><i></i></div>
    <div class="linear-gradient" v-if="linearGradient"></div>
    <div class="left-linear-gradient" v-if="leftLinearGradient"></div>
  </section>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    data () {
      return {
        currentIndex: 0,
        day: 10,
        calendarArr: [],
        calendarLiWidth: 50,
        calendarScroll: '',
        translateX: 0,
        lineTranslateX: 0,
        linearGradient: true,
        leftLinearGradient: false,
        quickClick: true,
        calendarDate: ''
      }
    },
    beforeMount () {
      this.getDateArr()
    },
    props: ['date', 'defaultDate'],
    mounted () {
      this.init()
    },
    methods: {
      async init () {
        const _that = this
        _that.getDateArr()
        _that.createCalendar()
      },
      createCalendar () {
        const _that = this
        if (!_that.$refs.calendarLi) {
          return
        }
        _that.calendarLiWidth = _that.$refs.calendarLi.children[0].clientWidth
        let calendarScroll = document.querySelector('#calendar_scroll')
        _that.calendarScroll = new BScroll(calendarScroll, {
          probeType: 3,
          deceleration: 0.001,
          bounce: false,
          swipeTime: 2000,
          click: true,
          scrollX: true
        })
        setTimeout(_ => {
          _that.calendarScroll.refresh()
        }, 1000)
        if (_that.calendarDate) {
          _that.chooseCalendar(_that.calendarDate.date, _that.calendarDate.txt, _that.calendarDate.index)
        } else {
          const calendarDate = {
            date: _that.calendarArr[0].date,
            txt: _that.calendarArr[0].txt,
            index: 0
          }
          this.calendarDate = calendarDate
          this.$emit('select', this.calendarDate)
        }
      },
      chooseCalendar (date, txt, index) {
        const _that = this
        let calendarScroll = document.querySelector('#calendar_scroll')
        if (_that.calendarArr && !!_that.calendarArr.length) {
          let isDate = false
          _that.calendarArr.forEach((item) => {
            if (item.date === date) {
              isDate = true
            }
          })
          if (!isDate) {
            // 如果没有日期 重置为第一个
            date = _that.calendarArr[0].date
            txt = _that.calendarArr[0].txt
            index = 0
          }
        }
        if (_that.quickClick) {
          _that.quickClick = false
          const half = _that.calendarArr.length / 2
          const leaveWidth = _that.calendarArr.length * _that.calendarLiWidth - calendarScroll.clientWidth
          if (leaveWidth > 0) {
            if (_that.currentIndex - index < 0) {
              // 向右
              if (index <= 1) {
                _that.translateX = 0
              } else if (index > half) {
                _that.translateX = (index * _that.calendarLiWidth) - _that.calendarLiWidth
              } else {
                _that.translateX = (index * _that.calendarLiWidth) - _that.calendarLiWidth
              }
            } else if (_that.currentIndex - index > 0) {
              // 向左
              if (index <= 3) {
                _that.translateX = 0
              } else if (index < half) {
                _that.translateX -= _that.calendarLiWidth
              }
            }
            if (_that.translateX < 0) _that.translateX = 0
            if (_that.translateX > leaveWidth) _that.translateX = leaveWidth
            _that.linearGradient = (_that.translateX >= leaveWidth) ? !1 : !0
            _that.leftLinearGradient = (_that.translateX > 0) ? !0 : !1
            _that.calendarScroll.scrollTo(-_that.translateX, 0, 400)
          }
          _that.currentIndex = index
          setTimeout(_ => { _that.quickClick = true }, 500)
          _that.calendarDate = {
            date: date,
            txt: txt,
            index: index
          }
          this.$emit('select', this.calendarDate)
        }
      },
      getDateArr (time, isdata) {
        let dateArr = []
        if (this.date && this.date.length) {
          this.date.forEach(item => {
            let date = this.$moment(item)
            dateArr.push({txt: '', short_date: date.format('MM-DD'), date_txt: date.format('YYYY-MM-DD'), date: item})
          })
          console.log(this.date, dateArr)
        } else {
          const days = ['日', '一', '二', '三', '四', '五', '六']
          for (let d = 0; d < this.day; d++) {
            const date = time ? this.$moment(time).add(d, 'd') : this.$moment().add(d, 'd')
            if (d === 0) {
              dateArr.push({txt: '今日', short_date: date.format('MM-DD'), date_txt: date.format('YYYY-MM-DD'), date: date.format('YYYY-MM-DD')})
            } else {
              dateArr.push({txt: `周${days[date.day()]}`, short_date: date.format('MM-DD'), date_txt: date.format('YYYY-MM-DD'), date: date.format('YYYY-MM-DD')})
            }
          }
        }
        this.calendarArr = dateArr
      }
    }
  }
</script>

<style lang="scss" scoped>
  .calendar_container{
    position:relative;
    width:100%;
    background: #fff;
    border-bottom:1px solid #e6e6e6;
    overflow:hidden;
    ul{
      display:flex;
      overflow:hidden;
      list-style: none;
      margin: 0;
      padding: 0;
      li{position:relative;
        float: left;
        padding: 5px 33px 5px 0;
        white-space:nowrap;
        cursor: pointer;
        span,var{
          display:block;
          font-size: 14px;
          color: #666;
          text-align: center;
          font-style: normal;
          font-weight: 500;
        }
        &:before{content:'';position:absolute;left: 0;transform: translate(0,5px);bottom:0;display:inline-block;width:70%;height:3px;border-radius:5px;transition: all .5s;background: #1c7bef;}
      }
      li.cur{
        span,var{
          color: #1c7bef;
        }
        &:before{
           transform: translate(0,0);
         }
      }
    }
    .linear-gradient{
      position: absolute;
      top:0;
      right:0;
      width: 30px;
      height: 26px;
      background-image:linear-gradient(to right,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);
    }
    .left-linear-gradient{
      position: absolute;
      top:0;
      left:0;
      width: 30px;
      height: 26px;
      background-image:linear-gradient(to left,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);
    }
  }
</style>
