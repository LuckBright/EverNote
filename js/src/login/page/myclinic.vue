<template>
  <div class="ever_bg_01">
    <div class="workbench">
      <div class="welMsg">
        <p class="tit">
          {{ $t('欢迎您，') }}{{$store.state.currentUser.name}}
        </p>
        <p v-if="clinics.length > 0" class="bdy">{{ $store.state.currentUser.organizationName === 'ˇ' ? '' : $store.state.currentUser.organizationName }}
          <el-popover
            v-if="showChangeOrg"
            placement="bottom"
            trigger="click"
            :width="viewClinics.length * 400"
            popper-class="clinic-box"
            v-model="visible">
            <div class="org-list">
              <ul v-for="(clinics, ci) of viewClinics" :key="ci">
                <li v-for="(clinic, i) of clinics" :key="i" @click="changeOrg(clinic, true)" :class="getStyle(clinic)">
                  {{clinic.name}}
                </li>
              </ul>
            </div>
            <span ref="changeOrgRef" slot="reference" class="cp"><i class="icon iconfont icon-Shape myclinic-icon-shape ml10"></i></span>
          </el-popover>
        </p>
      </div>
      <div class="bench-view" v-loading.body="loading" v-if="orgChanged">
        <template v-if="!loading && viewList.length">
          <ul v-for="(viewItem, vi) of viewList" :key="vi" class="bench-view-item">
            <li v-for="(item, i) of viewItem" :key="i" :class="['bench-station-item', {'bench-station-item-group': !!item._key}]">
              <span class="view-item-group-box" v-if="item._key">
                <span class="line"><span class="line-content"></span></span>
                <span class="content">{{item._key}}</span>
                <span class="line"><span class="line-content"></span></span>
              </span>
              <template v-else>
                <a href="javascript:void(0)" @click="goBenchLink(item)">
                  <i :class="'icon iconfont ' + (item.icon || 'icon-zonghe')" :style="'color: ' + item.color"></i><span>{{ $t(item.name) }}</span>
                </a>
              </template>
            </li>
          </ul>
        </template>
        <div v-else-if="orgNotInToken" class="none-text"><i class="icon iconfont icon-cry myclinic-icon-cry mr5"></i>请先选择一个机构</div>
        <div v-else-if="!loading && clinics.length === 0" class="none-text"><i class="icon iconfont icon-cry myclinic-icon-cry mr5"></i>没有执业机构，请联系管理员开通</div>
        <div v-else-if="!loading && clinics.length !== 0 && crtOrg.orgId" class="none-text"><i class="icon iconfont icon-cry myclinic-icon-cry mr5"></i>您没有权限访问任何工作站</div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/auth/store/sessionapi'
  import storage from '@/util/storage'
  import '@/login/assets/login.less'
  import urlMap from '@/login/store/urls'
  import globalUrlMap from '@/login/store/globalurls'
  import { request, requestIh } from '@/util/req'
  import transferAxios from '@/manages/page/organization/utils/axios'
  import orgUrlMap from '@/manages/page/organization/utils/urls'
  import i18n from '@/assets/locals/index'
  import staticvars from '@/store/staticvars'
  import { configArr } from '@/store/config.base'
  import mallApi from '@/titanmall/components/api'
  import { urlEncode } from '@/util/common'
  import { isLocalHost } from '@/store/basehost.js'

  export default {
    data () {
      return {
        viewList: [],
        visible: false,
        viewClinics: [],
        showChangeOrg: false,
        clinics: [],
        crtOrg: {},
        loading: false,
        _changeOrg: false,
        _loginDone: false,
        orgChanged: false,
        stationPrefix: staticvars.prefix,
        menus: [],
        orgNotInToken: false,
      }
    },
    created () {
      sessionStorage.removeItem('x-rid')
      this._changeOrg = storage.getLocalStorage('_changeOrg')
      this._loginDone = storage.getLocalStorage('_loginDone')
      this.loading = true
      this.orgChanged = false
      // 查询当前登录人的执业机构
      request(orgUrlMap.org.loadByStaffId, {
        staffId: localStorage.getItem('USERID'),
        staffLoginOrgPermission: '1',
      }, 'post', transferAxios).then(res => {
        this.orgChanged = true
        if (res.head.errCode === 0) {
          this.clinics = res.data
          this.showOrgList()
          const length = this.clinics.length
          storage.setLocalStorage('clientlength', length)
          // this.$store.commit('setClilength', length)
          // 1. 登录进来
          // 1.1 如果只有一个机构，则判断该机构是否有看板权限，如果有则进入，否则留在选择工作站的界面
          // 1.2 如果有多个机构，展示选择机构的弹窗
          // 2. 点击切换工作站进来
          // 2.1 如果只有一个机构，则显示该机构下的工作站
          // 2.2 如果有多个机构，则找到当前机构，显示当前机构下的工作站
          // 3. 点击切换机构进来
          // 3.1 【隐含条件1：有多个机构】【隐含条件2：有当前机构】展示选择机构的弹窗
          // 4. 切换机构之后
          // 4.1 【隐含条件1：有多个机构】【隐含条件2：有当前机构】判断是否有看板权限，有则进入，无则留在当前
          if (length === 1) {
            // 如果只有一个机构，则只在登录时
            this.changeOrg(this.clinics[0], this._loginDone)
          } else if (length > 1) {
            if (this._changeOrg || this._loginDone) {
              storage.removeLocalStorage('_changeOrg')
              storage.removeLocalStorage('_loginDone')
              // this.changeOrg()
              // 这种情况只展示要切换的机构
              this.showOrgPanel()
            } else {
              const currentClinic = this.clinics.find(item => item.orgId === storage.getStorageByClinic('CLINICID'))
              if (currentClinic) {
                this.changeOrg(currentClinic)
              } else {
                this.changeOrg()
              }
            }
          } else {
            // clinics列表=[]，没有可以登录的机构
            this.loading = false
            // this.changeOrg()
            this.$messageTips(this, 'error', i18n.t('当前用户没有选择执业机构。'))
          }
        } else {
          this.loading = false
          this.$messageTips(this, 'error', i18n.t('当前用户没有选择执业机构。'))
        }
      })
      this.getShopId()
      this.getImgCdnHost()
    },
    computed: {
      DISPLAYNAME () {
        return storage.getLocalStorage('DISPLAYNAME') || ''
      }
    },
    methods: {
      // 互联网医生工作站需要单独跳转
      goBenchLink (item) {
        if (item.url.includes('/ihsystem/index.html')) {
          let obj = {
            'TOKEN': encodeURIComponent(localStorage.getItem('TOKEN')),
            'TENANTID': encodeURIComponent(localStorage.getItem('TENANTID')),
            'TENANTDATA': encodeURIComponent(localStorage.getItem('TENANTDATA')),
            'CLINICID': encodeURIComponent(localStorage.getItem('CLINICID')),
            'CLINICCONFIG': encodeURIComponent(localStorage.getItem('CLINICCONFIG')),
            'USERID': encodeURIComponent(localStorage.getItem('USERID')),
            'userId': encodeURIComponent(localStorage.getItem('userId')),
          }
          let _debugHost = location.host
          // _debugHost = 'dev4a.everjiankang.com.cn'
          if (localStorage.getItem('debug') === '1') {
            // _debugHost = '192.168.250.39:8080'
            item.url = '/ihsystem/index.html#/ihsystem/welcome'
          }
          let _url = 'https://' + _debugHost + '/web' + item.url + '?' + urlEncode(obj)
          if (isLocalHost()) {
            _url = _url.replace('https://', 'http://')
          }
          window.location.href = _url
        } else {
          window.location.protocol = 'http:'
          window.location.href = this.stationPrefix + item.url
        }
      },
      // 获取商城店铺id
      getShopId () {
        // 清除本地缓存
        localStorage.removeItem('showNav')
        localStorage.removeItem('mallName')
        localStorage.removeItem('MALLSHOPID')
        localStorage.removeItem('userId')
        requestIh(orgUrlMap.shop.getShopId, {}, 'get').then(res => {
          if (!res.errCode) {
            const data = res.data
            if (data.length) {
              /*
              判断店铺状态是否过期
              * showNav 1 跳转概况页
              *         2 跳转开通页
              * */
              if (data[0].shopStatus !== 'WAIT_OPEN') {
                localStorage.setItem('showNav', '1')
              } else {
                localStorage.setItem('mallName', data[0].name)
                localStorage.setItem('showNav', '2')
              }
              localStorage.setItem('MALLSHOPID', data[0].token)
              localStorage.setItem('userId', data[0].id)
            } else {
              localStorage.setItem('showNav', '2')
            }
          }
        })
      },
      getImgCdnHost () {
        let params = {
          config: {
            headers: {
              'x-channel': 'THC-PLATFORM-MANAGEMENT',
            },
          },
        }
        mallApi.authToken(params).then(res => {
          if (res) {
            let url = `https://${ res.cdn }/`
            localStorage.setItem('IMGCDN', url)
            localStorage.setItem('SDKOBJ', JSON.stringify(res))
          }
        })
      },
      showOrgPanel () {
        this.initData()
        setTimeout(() => {
          this.$refs.changeOrgRef.click()
          this.loading = false
        }, 100)
      },
      showOrgList () {
        this.showChangeOrg = false
        if (this.clinics.length > 1) {
          this.showChangeOrg = true
          let maxLen = 15 // 每列最多显示条数
          if (this.clinics.length > maxLen * 4) {
            maxLen = Math.ceil(this.clinics.length / 4)
          }
          this.viewClinics = Array(Math.ceil(this.clinics.length / maxLen)).fill(0).map((item, i) => this.clinics.slice(i * maxLen, (i + 1) * maxLen))
        }
      },
      initData () {
        api.resources().then(results => {
          if (results) {
            if (results.head && results.head.errCode && results.head.errCode !== 0) {
              // this.$router.replace('/login')
            } else {
              if (results && results.rID) {
                this.$store.commit('setResources', results.rID)
              }
            }
          }
        })
        // 获取新的菜单数据
        request(urlMap.myBench.getLevelOneMenus).then((res) => {
          if (res.head.errCode === 0) {
            this.viewList = this.calcMenuData(this.sortMenuData(res.data))
            this.setUrl()
          }
        })
      },
      // 当工作站的默认url不在当前用户的菜单权限范围内时，需要顺次获取用户在此工作站的其他菜单进行跳转
      setUrl () {
        if (this.viewList.length && this.menus.length) {
          const me = this
          this.viewList.forEach(viewItemList => {
            viewItemList.forEach(item => {
              if (item.menuId) {
                const flagStr = 'index.html#'
                // 若url为符合规范的，且将要进入某个具体菜单的，则需要寻找其有权限的第一个菜单
                if (item.url.includes(flagStr) && !item.url.endsWith('/welcome')) {
                  const url = me.findUrl(item)
                  // 若找到的是某个其他菜单，则拼接菜单
                  if (url !== item.url) {
                    item.url = item.url.slice(0, item.url.indexOf(flagStr)) + flagStr + url
                  }
                }
              }
            })
          })
        }
      },
      findUrl (menuItem) {
        // 对菜单进行排序
        const list = this.menus.slice(0).sort((a, b) => a.indexNum - b.indexNum)
        // 若当前menuItem的url直接存在于其权限内且不为父级菜单，则直接返回
        if (list.some(l => menuItem.url.endsWith(l.url) && l.parentId !== '0')) {
          return menuItem.url
        }
        // 所有的二级菜单 【以集团管理工作站为例：诊断字典，物资字典，医嘱字典，供应商管理等为二级菜单】
        const otherLevel2Menu = list.filter(l => l.parentId === menuItem.menuId)
        if (otherLevel2Menu.length) {
          // 第 0 个是否为父菜单
          const tempMenu = list.find(l => l.parentId === otherLevel2Menu[0].menuId)
          if (tempMenu) {
            // 若没有二级菜单满足要求，则应该判断是否存在4级菜单，但是此处4级菜单的情况不是特别了解，暂时不做此判断，直接将三级菜单作为最终菜单处理
            // todo 此处没有再次判断 tempMenu 是否为父菜单
            return tempMenu.url
          }
          return otherLevel2Menu[0].url
        }
        // todo 寻找子菜单
        return menuItem.url
      },
      sortMenuData (menuData) {
        const viewList = []
        if (!menuData || menuData.length === 0) {
          return viewList
        }
        return menuData.map(menuItem => {
          return {
            ...menuItem,
            list: menuItem.list.sort((a, b) => a.indexNum - b.indexNum),
          }
        })
      },
      // menuData = [{name: '', list: [{}, {}, {}]}, {name: '', list: [{}, {}, {}]} ...]
      calcMenuData (menuDataParam) {
        // 分类"其他业务"目前放置一些没有归属于任何工作站的按钮，这块非常怕会显示到选择工作站页面上，所以过滤了一下 by lvjiangtao@everjiankang.com 20191016
        let menuData = menuDataParam.filter(item => {
          return item.name !== '其他业务'
        })
        const viewList = []
        if (!menuData || menuData.length === 0) {
          return viewList
        }
        let viewItem = []
        const viewItemMaxLen = 12 // 分类加上它下边的工作站数量一共不超过的数量
        // 计算 menuData 将 menuData 分成 N 列
        // const flatData = Object.keys(menuData).map(key => [{_key: key}, ...menuData[key]]).reduce((p, c) => p.concat(c), [])
        const flatData = menuData.map(item => [{ _key: item.name }, ...item.list]).reduce((p, c) => p.concat(c), [])
        // 此处不考虑一个分类下会超过11个工作站的情况
        flatData.forEach(item => {
          if (item._key) {
            // 首先判断该key下的长度是否超出范围，是，则将其加入到下一个viewItem中，否则push
            if (viewItem.length + menuData.find(menu => menu.name === item._key).list.length + 1 <= viewItemMaxLen) {
              viewItem.push(item)
            } else {
              // 当前列已经满员，加到viewList中
              viewList.push(viewItem)
              // 在新的一列中将分类信息加进去
              viewItem = [item]
            }
          } else {
            // 直接将工作站加进去
            viewItem.push(item)
          }
        })
        // 剩下的放到最后一列中
        if (viewItem.length > 0) {
          viewList.push(viewItem)
        }
        return viewList
      },
      changeOrg (org, isClick = false) {
        storage.removeLocalStorage('_loginDone')
        this.loading = true
        this.orgChanged = true
        // let orgId = null
        if (org) {
          this.visible = false
          if (!this.orgNotInToken && this.crtOrg.orgId === org.orgId) {
            this.loading = false
            return
          }
          if (isClick) {
            // 在切换机构时 删除库房管理：库房所有状态数据
            storage.removeLocalStorage('INIT_STORAGE_ID')
            storage.removeLocalStorage('STORAGE_ID')
            storage.removeLocalStorage('STORAGE_ID_VUEX')
            storage.removeLocalStorage('MATERIAL_TYPE')
            storage.removeLocalStorage('STORAGE_ITEM')
            storage.removeStorageByClinic('CLINICID')
            storage.removeLocalStorage('workspaceKey')
            storage.removeLocalStorage('tech_value')
            storage.removeLocalStorage('outpatientUrlParams') // 清除患者
            storage.removeLocalStorage('residentKey') // 清除住院医生关联科室
            storage.removeLocalStorage('inpatientKey')
          }
          this.crtOrg = org
          // orgId = org.orgId
        }
        // 只在点击
        if (isClick) {
          this.doLogin(org, isClick)
        } else {
          this.doneLogin(org, isClick)
        }
      },
      // 点击机构名称，切换机构
      doLogin (org, isClick) {
        request(urlMap.myBench.switchOrgToReplaceToken, {
          orgId: org.orgId,
          // version: staticvars.version,
          tenantId: localStorage.getItem('TENANTID')
        }).then((res) => {
          if (res.head.errCode === 0) {
            if (!res || !res.head || res.head.errCode !== 0) {
              return
            }
            storage.setStorageByClinic('TOKEN', res.data)
            this.doneLogin(org, isClick)
          }
        })
      },
      doneLogin (org, isClick) {
        if (!org) {
          this.loading = false
          return false
        }
        if (org.orgId) {
          storage.setStorageByClinic('CLINICID', org.orgId)
          storage.setStorageByClinic('CLINICNAME', org.name)
        }
        api.user().then(results => {
          if (results) {
            results.name = results.displayName
            if (results.organizationId === -1) {
              results.organizationName = ''
            }
            this.$store.commit('setUser', results)
            storage.setLocalStorage('USERID', results.userId)
            storage.setLocalStorage('TENANTID', results.tenantId)
            storage.setLocalStorage('DISPLAYNAME', results.displayName)
          }
        })
        this.orgNotInToken = false
        if (org.orgId) {
          // 获取当前登录人的菜单信息
          request(urlMap.myBench.getMenusFromToken).then((res) => {
            if (res.head.errCode === 0) {
              if (!res.data) {
                this.loading = false
                return
              }
              storage.removeLocalStorage('USERMENUS')
              this.menus = res.data.menus
              this.setUrl()
              storage.setLocalStorage('USERMENUS', this.getMenuData(res.data.menus))
              // 此时判断是否是点击登录之后进入的此页面，若是，则判断是否进入当日患者，然后清除该值
              // 切换完机构之后，如果该用户有看板的权限，则直接进入看板界面
              if ((isClick || this._loginDone) && (this.$ever.getClinicConfig().toKanbanAfterLogin === '1')) {
                storage.removeLocalStorage('_loginDone')
                // 只在生成环境跳转
                if (res.data.menus.some(item => item.rid === 'Auth_menu_kanban_patientlist')) {
                  window.location = this.$ever.kanbanIndex + '/kanban/service'
                } else {
                  this.loading = false
                }
              } else {
                this.loading = false
              }
            } else {
              this.loading = false
              if (res.head.errCode === 500) {
                this.orgNotInToken = true
              }
            }
          })
          this.getTenantConfig(org.orgId)
        } else {
          this.loading = false
          if (this.$refs.changeOrgRef) {
            setTimeout(() => this.$refs.changeOrgRef.click(), 100)
          }
        }
        this.initData()
      },
      getMenuData (menus) {
        return JSON.stringify(menus.map(item => {
          // 判断菜单是否需要打开新的页面
          if (item.parentId !== '0' && item.url && (
            item.url.includes('.html') || // 包含html
            item.url.startsWith('http') // 或者以http开头
          )) {
            item.openType = '_blank'
            // todo 进入需要token的界面时会走此逻辑
            if (item.url.includes('survey/design/')) {
              const token = window.escape(storage.getStorageByClinic('TOKEN'))
              // 进入问卷系统需要携带token
              if (item.url.includes('?')) {
                item.url += `&_thc_t=` + token
              } else {
                item.url += `?_thc_t=` + token
              }
            }
          }
          return item
        }))
      },
      // 获取机构的配置键值 写入缓存备用
      getTenantConfig (orgId) {
        let _config = {}
        request(globalUrlMap.clinicset.getKeyValueInfosDetails, {
          tenantId: localStorage.getItem('TENANTID'),
          orgId: orgId,
          keys: configArr,
          isValid: 1
        }).then(res => {
          if (res.head.errCode === 0) {
            res.data.forEach(item => {
              _config[item.key] = item.value
            })
            let conf = {}
            try {
              conf = JSON.parse(localStorage.getItem('CLINICCONFIG'))
            } catch (err) {
              console.log(err)
            }
            let tmp = Object.assign({}, conf, _config)
            localStorage.setItem('CLINICCONFIG', JSON.stringify(tmp))
          }
        })
      },
      getStyle (clinic) {
        let cs = ''
        if (storage.getStorageByClinic('CLINICID') === clinic.orgId) {
          cs = 'current'
        }
        return cs
      },
    },
  }
</script>

<style lang="less" scoped>
  .none-text {
    margin-top: 180px;
    color: #666;
    font-size: 25px;
  }
  .myclinic-icon-cry {
    vertical-align: initial;
    font-size: 25px;
    color: #666;
  }
  .myclinic-icon-shape {
    color: #1c7bef;
    vertical-align: baseline;
  }
  .cp {
    cursor: pointer;
  }
  .bench-view {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    .bench-view-item {
      margin: 0 0 0 20px;
      padding: 0;
      &:first-child {
        margin-left: 0;
      }
      .bench-station-item {
        width: 200px;
        height: 40px;
        line-height: 40px;
        margin-top: 2px;
        background: #fff;
        box-shadow: 0 0 5px 0 #e3e9f7;
        text-align: left;
        &:not(.bench-station-item-group) {
          cursor: pointer;
          border: 1px solid transparent;
          &:hover {
            border-color: #1c78ef;
          }
        }
        a {
          display: inline-block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          i {
            padding-left: 16px;
            vertical-align: baseline;
            font-size: 16px;
          }
          span {
            padding-left: 10px;
            color: #333;
            white-space: nowrap;
          }
          &:hover {
            span {
              color: #222;
            }
          }
        }
        &.bench-station-item-group {
          margin-top: 4px;
          background: transparent;
          box-shadow: none;
          text-align: center;
          .view-item-group-box {
            color: #999;
            display: flex;
            justify-content: space-around;
            width: 80%;
            margin: 0 auto;
            .line {
              flex-grow: 1;
              .line-content {
                display: block;
                width: 100%;
                margin-top: 20px;
                border-bottom: 1px solid #ddd;
              }
            }
            .content {
              flex-grow: 2;
            }
          }
        }
      }
    }
  }
  .org-list {
    display: flex;
    ul {
      margin: 0;
      padding: 0 10px;
      width: 390px;
      border-left: 1px solid #ddd;
      max-height: 650px;
      overflow: auto;
      &:first-child {
        border-left: none;
      }
      li {
        color: #333;
        height: 36px;
        line-height: 36px;
        padding: 0 12px;
        cursor: pointer;
        &.current,
        &:hover {
          background: #1c7bef;
          color: #fff;
        }
      }
    }
  }
</style>
