import api from '@/titancare/api/homeconfig/homeconfigapi'

export default {
  methods: {
    _getSelectOptions (filedsNames = []) {
      filedsNames.forEach(field => {
        let methodName = `_get${field.replace(/^\S/, s => s.toUpperCase())}`
        this[methodName](field)
      })
    },
    _getServicePages (field) {
      api.getValueSetItemByCode({ setCode: 'IH_MEMBER_HOME_FUNCTIONPAGE' }).then(res => {
        this[field] = res.data
      })
    }
  }
}
