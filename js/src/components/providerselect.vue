<script>
  import departmentapi from '../sob/store/departmentapi'
  import everSelect from './select'
  export default {
    mixins: [everSelect],
    created () {
      departmentapi.getDepartments().then(result => {
        if (result && result.data && result.data.length) {
          result.data.map(item => {
            item.id = item.sectionRecordId
            return item
          })
          this.innerOptions = result.data
        } else {
          this.innerOptions = []
        }
      })
    }
  }
</script>
