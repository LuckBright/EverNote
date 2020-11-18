 <template>
  <div class="class-select">
    <div v-for="(value, index) in classesList" :key="index" class="wid170 mb5 mt5 mr20">
      <div class="left-name" :title="value.timetrunkName">
        <span class="mr5">{{value.timetrunkName}}</span>
      </div>
      <el-select v-model="value.outCallStatus" placeholder="请选择" class="right-select" clearable :key="index">
        <el-option
          v-for="el in tempStatus"
          :key="el.value"
          :label="el.label"
          :value="el.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    'list': {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      classesList: this.list,
      tempStatus: [
        {
          value: 1,
          label: '出诊'
        },
        {
          value: 2,
          label: '陪诊'
        },
        {
          value: 3,
          label: '其他'
        }
      ]
    }
  },
  watch: {
    'classesList': {
      handler (val) {
        let temp = []
        val.map(item => {
          if (item.outCallStatus) {
            temp.push(item)
          }
        })
        this.$emit('update', temp)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .class-select{
    width: 610px;
  }
  .wid170{
    width: 30%;
    float: left;
  }
  .left-name{
    min-width:80px;
    max-width:80px;
    display:inline-block;
    text-align:right;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .right-select{
    width:80px;
    display:inline-block;
  }
</style>

