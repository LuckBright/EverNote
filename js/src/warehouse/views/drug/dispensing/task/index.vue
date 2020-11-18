<!--
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-10-19 10:14:08
 * @LastEditTime: 2020-11-03 20:22:00
 * @LastEditors: by zhangsheng@everjiankang.com.cn
-->
<template>
  <div>
    <common-list
      :pageType="1"
      :urlObj="urlObj"
    ></common-list>
  </div>
</template>

<script>
import commonList from '@/warehouse/views/drug/component/dispensing.common'
import focusUrl from '@/warehouse/views/drug/api/focusdispenseapi'
export default {
  name: 'dispensing-task-index',
  components: {
    commonList
  },
  data () {
    return {
      urlObj: {
        getList: focusUrl.getTaskList,
        dispensing: focusUrl.goDispensing,
        send: focusUrl.goSend
      },
    }
  }
}
</script>

