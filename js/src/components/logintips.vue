<template>
  <div>
    <el-popover
      placement="bottom"
      trigger="hover"
      width="140"
      popper-class="setting_popover"
      :open-delay="500">
      <el-row class="user_setting_item">
        <el-col>
          <a :href="$ever.mainIndex + '/reset'">{{ $t('修改密码') }}</a>
        </el-col>
        <el-col v-if="clientlength > 1 && !isMyClinic">
          <a @click="toPage('myclinic')">{{ $t('更换医疗机构') }}</a>
        </el-col>
        <el-col>
          <span @click="handleCommand('logout')">{{ $t('退出登录') }}</span>
        </el-col>
        <el-col v-if="version" class="dis-div">
          <span>{{version}}</span>
        </el-col>
      </el-row>
      <el-badge class="spe_el-badge item" slot="reference">
        <el-image
          class="wid26"
          fit="cover"
          :src="$store.state.currentUser.photo ? $ever.fileUrl2 + $store.state.currentUser.photo : previews">
          <template slot="error">
            <img class="h26" :src="previews"/>
          </template>
        </el-image>
        <span>
          <span>
            {{$store.state.currentUser.name || DISPLAYNAME}}
          </span>
          <span>
            <a class="current-a" href="javascript:void(0)" :title="$store.state.currentUser.organizationName">{{$store.state.currentUser.organizationName && $store.state.currentUser.organizationName !== 'ˇ' ? ($store.state.currentUser.organizationName.length > 7 ? $store.state.currentUser.organizationName.substring(0, 7) + '...' : $store.state.currentUser.organizationName) : ''}}</a>
          </span>
        </span>
      </el-badge>
    </el-popover>
  </div>
</template>

<script>
import api from '@/auth/store/sessionapi'
import storage from '@/util/storage'
import avatar from '@img/assets/avatar.png'

export default {
  data () {
    return {
      clientlength: storage.getLocalStorage('clientlength'),
      isMyClinic: window.location.href.includes('myclinic'),
      // langVal: storage.getLocalStorage('LANG') || 'cn',
      previews: avatar,
      visible: false,
      version: window.pool_version,
    }
  },
  computed: {
    DISPLAYNAME () {
      return storage.getLocalStorage('DISPLAYNAME') || ''
    }
  },
  methods: {
    toPage (page) {
      if (page === 'myclinic') {
        storage.setLocalStorage('_changeOrg', 1)
        window.location = this.$ever.mainIndex + '/myclinic'
      }
    },
    removeStorage () {
      storage.removeLocalStorage('STORAGE_ID')
      storage.removeLocalStorage('STORAGE_ITEM')
      storage.removeLocalStorage('INIT_STORAGE_ID')
      storage.removeLocalStorage('MATERIAL_TYPE')
      storage.removeLocalStorage('STORAGE_ID_VUEX')
      storage.removeLocalStorage('workspaceKey')// 清除门诊医生关联科室
      storage.removeLocalStorage('tech_value')
      storage.removeLocalStorage('outpatientUrlParams') // 清除门诊医生正在看的患者
      storage.removeLocalStorage('residentKey') // 清除住院医生关联科室
      storage.removeLocalStorage('inpatientKey') // 清除住院护士关联病区
    },
    handleCommand (command) {
      if (command === 'logout') {
        this.$bus.$emit('common:patchUserNotice', 'logout')
        let popover = document.querySelector('.el-popover.setting_popover')
        popover.style.display = 'none'
        api.logout().finally(() => {
          storage.removeStorageByClinic('CLINICID')
          storage.removeStorageByClinic('TOKEN')
          this.$store.commit('setStorageId', '')
          // 退出登录删除所有库房本地数据
          this.removeStorage()
          let _debugHost = location.host
          // _debugHost = 'dev4a.everjiankang.com.cn'
          let _url = 'http://' + _debugHost + this.$ever.mainIndex + '/login'
          window.location.href = _url
        })
      }
    },
    hasPermission (auth) {
      return this.$hasPermission(auth)
    },
    changeLange (command) {
      storage.setLocalStorage('LANG', command)
      window.location.reload()
    }
  }
}
</script>
<style lang="scss" scoped>
.user_setting_item {
  .el-col {
    text-align: left;
    padding-left:15px;
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
    a {
      color: #000;
      text-decoration: none;
    }
  }
}
.wid26{
  height:25px;
  width:25px;
  position: relative;
  top: 6px;
  right: 4px;
  border-radius: 50%;
}
.dis-div{
  background: #DCDCDC;
  color: #FFFFFF;
}
.current-a{
  color:#bfc8d9 !important;
}
.h26{ height: 26px;}
</style>
