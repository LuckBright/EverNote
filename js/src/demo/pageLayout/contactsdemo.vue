<template>
  <div class="layout_inner">
    <p>联系人组件 by zhenghongtao@everjiankang.com</p>
    <p><b class="cRed">contacts</b></p>
    <div class='about'>联系人组件展示修改(海南14岁以下联系人必填姓名，关系，手机号)
      <br>回显方法：this.$refs.contacts.setObj(value)
    </div>
    <p>默认联系人</p>
    {{contactList}}
    <br>
    <contacts ref="contacts" v-model='contactList'></contacts>
  </div>
</template>

<script>
import contacts from '@/crm/components/contacts'
export default {
  data () {
    return {
      contactList: [{
        'id': '2c9180a969d6efaa0169fff220e0007e',
        'type': '11',
        'name': '姓名',
        'mobile': '13344422331',
        'address': '{\'province\':\'150000\',\'city\':\'150400\',\'county\':\'150422\',\'addressDetail\':\'详细地址。。\'}',
        'idNo': '232301199206251232',
        'otherNo': '232301199206251232',
        'otherType': '10'
      }]
    }
  },
  created () {
  },
  methods: {
  },
  mounted () {

  },
  components: {
    contacts
  }
}
</script>
<style scoped>
.about {
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 3px;
  margin: 10px 0;
  padding: 10px;
  color: #777;
}
</style>
