<template>
  <div id="scheduling" class="flex_column_full_hidden">
    <el-row :gutter="20" type="flex">
      <el-col class="right">
        <arrangecalendar
          @addArrange="setAddArrange"
          :success.sync="success"
        >
        </arrangecalendar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import arrangecalendar from '@/arrange/page/scheduling/calendar.vue'
  export default {
    data () {
      return {
        addArrange: '',
        success: false,
      }
    },
    methods: {
      setAddArrange (val) {
        this.addArrange = val
      }
    },
    components: {
      arrangecalendar
    }
  }
</script>
