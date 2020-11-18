<template>
  <div>
    <common-list
      :pageType="2"
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
        getList: focusUrl.getSendList,
        dispensing: focusUrl.reDispensing,
        send: focusUrl.goSend
      },
    }
  }
}
</script>

