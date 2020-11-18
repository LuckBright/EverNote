<template>
  <div class="layout_inner">
    <p>数据格式化filter方法实例</p>
    <el-row>
      <el-col :span="24">
        <h3>格式化日期</h3>
        <pre><code v-html="val4"></code><code v-html="val41"></code></pre>
        <p>参数为时间格式，不传参格式化为YYYY-MM-DD HH:mm:ss</p>
      </el-col>
      <el-col :span="24">
        <h3>格式化年龄</h3>
        <pre><code v-html="val5"></code></pre>
        <P><del>根据生日，大于5岁显示年龄，大于1岁，小于等于5岁显示年龄+月龄+日龄，小于1岁，显示月龄+日龄</del></P>
        <P>根据生日，大于1岁显示年龄，小于等于1岁显示月龄+日龄，小于1月，显示日龄</P>
        <p>
          出生日期：<el-date-picker
            v-model="birthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          年龄：{{agestr}}
        </p>
        <p>
          出生日期时间：<el-date-picker
            v-model="birthday1"
            type="datetime"
            placeholder="选择日期">
          </el-date-picker>
          年龄：{{agestr1}}
        </p>
      </el-col>
      <el-col :span="24">
        <h3>转换中英文</h3>
        <pre><code v-html="val6"></code><code v-html="val61"></code><code v-html="val62"></code></pre>
        <p>第一个参数表示需要转换的字段的key，第二个字段表示是否需要中英混排</p>
      </el-col>
      <el-col :span="24">
        <h3>金额转财务计数法 （三位一逗号，后面两个零或者?个零）</h3>
        <pre><code v-html="val7"></code><code v-html="val71"></code></pre>
      </el-col>
      <el-col :span="24">
        <h3>格式性别，sex=1 表示 男，else 女</h3>
        <pre><code v-html="val8"></code></pre>
      </el-col>
      <el-col :span="24">
        <h3>金额保留两位小数</h3>
        <pre><code v-html="val9"></code></pre>
      </el-col>
      <el-col :span="24">
        <h3>图片设置默认图 1 - 5 是五种场景对应不同的默认图</h3>
        <pre><code v-html="val10"></code></pre>
      </el-col>
      <el-col :span="24">
        <h3>通用的数字（type，status...）转化为枚举类里面对应的汉字的方法</h3>
        <pre><code v-html="val11"></code></pre>
        <p>
          参数解释：
          <br>// list： 枚举数据集合
          <br>// valueKey: 后端匹配的字段名（默认为id）
          <br>// showKey：需要展示的字段名（默认为name）
          <br>// defaultFnt： 如果没有匹配到显示的字符串（默认为'')
          <br>
        </p>
      </el-col>
      <el-col :span="24">
        <h3>金额数字转大写</h3>
        <pre><code v-html="val12"></code></pre>
      </el-col>
      <el-col :span="24">
        <h3>格式化小数（去掉小数点后面的0），无人使用，纯刷存在感的filter</h3>
        <pre><del><code v-html="val13"></code></del></pre>
      </el-col>
    </el-row>
    <p>demo:</p>
    <p>formateValueToFnt: {{ serviceType | formateValueToFnt({ list:SERVICE_TYPE, defaultFnt: '未知类型', separator: '/'}) }}</p>
    <p>formateValueToFnt: {{ serviceType1 | formateValueToFnt({ list:SERVICE_TYPE, defaultFnt: '未知类型', separator: '/'}) }}</p>
  </div>
</template>
<script>
import { SERVICE_TYPE, REPORT_STATUS } from '@/util/common'
export default {
  data () {
    return {
      val4: '{{ val | formatDateByExp }}',
      val41: '{{ val | formatDateByExp(\'YYYY-MM-DD\') }}',
      val5: '{{ val | birthdayComputed }}',
      val6: '{{ val | formatLang }}',
      val61: '{{ val | formatLang(\'diseaseName\') }}',
      val62: '{{ val | formatLang(\'diseaseName\', true) }}',
      val7: '{{ val | formatToFinacial }}',
      val71: '{{ val | formatToFinacial(4) }}',
      val8: '{{ val | formatSex }}',
      val9: '{{ val | formatMoney }}',
      val10: '{{ val | fixImgSrc(2) }}',
      val11: '{{ val | formateValueToFnt({list: statusList, defaultFnt:\'无\'}) }}',
      val12: '{{ val | intToChinese }}',
      val13: '{{ val | subZeroAndDot }}',
      SERVICE_TYPE: SERVICE_TYPE,
      REPORT_STATUS: REPORT_STATUS,
      serviceType: '801,800',
      serviceType1: '801',
      status: 5,
      birthday: '2001-01-02',
      agestr: '',
      birthday1: '2001-01-02 10:10:10',
      agestr1: ''
    }
  },
  watch: {
    'birthday' (val) {
      console.log(val, 'vvvvvv')
      this.agestr = this.$filters.birthdayComputed(val)
    },
    'birthday1' (val) {
      console.log(val, 'vvvvvv')
      this.agestr1 = this.$filters.birthdayComputed(val)
    }
  },
  created () {
    var a = this.$moment(new Date()).diff(this.birthday, 'months', true)
    console.log(a, 'ddddd')
  }
}
</script>
<style scoped>
h3 {
  margin: 40px 0 -5px;
}
</style>
