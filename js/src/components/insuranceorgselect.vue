<script>
  import api from '@/insurance/store/insuranceorgapi'
  import everSelect from '@/components/select'
  export default {
    mixins: [everSelect],
    created () {
      api.list().then(result => {
        // console.log(result)
        for (var insur of result.data) {
          insur.name = insur.insuranceOrgCnName
        }
        this.innerOptions = result.data
      })
    }
  }
</script>
