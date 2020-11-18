<template>
  <div>
    <el-row class="pwd_strength_box">
      <el-col :span="8" class="col_label">安全性强度：</el-col>
      <el-col :span="5" :class="pwdLevel >= 1 ? 'able col_item' : 'col_item'">低</el-col>
      <el-col :span="5" :offset="1" :class="pwdLevel >= 2 ? 'able col_item' : 'col_item'">中</el-col>
      <el-col :span="5" :offset="1" :class="pwdLevel >= 3 ? 'able col_item' : 'col_item'">高</el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      let letterLow = 'a-z'
      let letterUpper = 'A-Z'
      let digit = '0-9'
      return {
        pwdLevel: 0,
        letterLow_patrn: new RegExp(`[${letterLow}]`),
        letterUpper_patrn: new RegExp(`[${letterUpper}]`),
        digit_patrn: new RegExp(`[${digit}]`),
        spestr_patrn: new RegExp('[(\\ )(\\~)(\\!)(\\@)(\\#)(\\$)(\\%)(\\^)(\\&)(\\*)(\\()(\\))(\\-)(\\_)(\\+)(\\=)(\\[)(\\])(\\{)(\\})(\\|)(\\\\)(\\;)(\\:)(\\\')(\\")(\\,)(\\.)(\\/)(\\<)(\\>)(\\?)(\\)]+')
      }
    },
    props: ['value', 'min', 'max'],
    watch: {
      'value': function (cur) {
        this.pwdLevel = 0
        if (cur && cur.length >= this.min && cur.length <= this.max) {
          if (this.letterLow_patrn.test(cur)) {
            this.pwdLevel ++
          }
          if (this.digit_patrn.test(cur)) {
            this.pwdLevel ++
          }
          if (this.letterUpper_patrn.test(cur) && cur.length >= (this.min + 2)) {
            this.pwdLevel ++
          }
          if (this.spestr_patrn.test(cur)) {
            this.pwdLevel ++
          }
        } else {
          this.pwdLevel = 0
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pwd_strength_box{
    line-height:20px;
    margin-top:10px;
    .col_label{
      width:85px;
    }
    .col_item{
      text-align:center;
      color:#666;
      font-size:12px;
      background-color:#eee;
      border-radius:4px;
    }
    .col_item.able{
      &:nth-child(2){color:#fff;background:#c0daf9;}
      &:nth-child(3){color:#fff;background:#82b4f5;}
      &:nth-child(4){color:#fff;background:#3082ee;}
    }
  }
</style>
