// import {objGet} from '@/util/common'
export default {
  data () {
    return {
      dispenseSettingObject: {}
    }
  },
  created () {
    // this.dispenseSettingObject = objGet(this.$store.state.dispensing.dispenseSetting, 'storageRoomId', '')
    //   ? this.$store.state.dispensing.dispenseSetting
    //   : JSON.parse(localStorage.getItem('DISPENSE_SETTING'))
  }
}
