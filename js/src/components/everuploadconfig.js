import diction from '@/store/common'
import globalUrlMap from '@/login/store/globalurls'

var component = {
  data () {
    return {
      headers: {
        'x-access-token': localStorage.getItem('TOKEN'),
      },
      action: diction.api + '/' + globalUrlMap.phoneMapping.uploadAndCreatePhoneInfo.prefix + globalUrlMap.phoneMapping.uploadAndCreatePhoneInfo.url,
    }
  }
}
export default component
