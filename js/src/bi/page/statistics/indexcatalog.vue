<!--  -->
<template>
  <div class="catalog">
    <div class="box-container left-container inline-block">
      <div class="top-box">
        <div class="top-content">
          <itemheading :icon-index="3" title="药品耗材报表"></itemheading>
          <cataloglist
            :data="catalog['medical_supplies']"
            code="medical_supplies"
          ></cataloglist>
        </div>
      </div>
      <div class="bottom-box">
        <div class="bottom-content">
          <itemheading :icon-index="4" title="医技报表"></itemheading>
          <cataloglist
            :data="catalog['medical_skills']"
            code="medical_skills"
          ></cataloglist>
        </div>
      </div>
    </div>
    <div class="center-container inline-block">
      <centeritem
        v-for="(i, index) in centerCatalog"
        :key="i.key"
        :data="i"
        :icon-index="index"
      ></centeritem>
    </div>
    <div class="box-container right-container inline-block">
      <div class="top-box">
        <div class="top-content">
          <itemheading :icon-index="5" title="互联网医院报表"></itemheading>
          <cataloglist
            :data="catalog['internet_hospital']"
            code="internet_hospital"
          ></cataloglist>
        </div>
      </div>
      <div class="bottom-box">
        <div class="bottom-content">
          <itemheading :icon-index="6" title="医保报表"></itemheading>
          <cataloglist :data="catalog.insurance" code="insurance"></cataloglist>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import centeritem from '@/bi/page/statistics/centeritem'
import itemheading from '@/bi/page/statistics/itemheading'
import cataloglist from '@/bi/page/statistics/cataloglist'
import urls from '@/auth/store/urls'
import urlMap from '@/systemset/urls'
const { getReportInfo } = urls.report
import { request } from '@/util/req'
export default {
  props: {},
  data () {
    return {
      centerCatalog: [],
      catalog: {
        warehouse: [], // 供应链报表
        purchase: [], // 采购报表
        sales: [], // 发退药报表
        inventory: [], // 库存管理报表
        outpatient: [], // 门诊报表
        hospitalization: [], // 住院报表
        insurance: [], // 医保报表
        'medical_skills': [], // 医技报表
        'medical_supplies': [], // 药品耗材报表
        'internet_hospital': [], // 互联网报表
        marketing: [], // 营销报表
        operation: [], // 运营报表
      },
    }
  },

  components: {
    centeritem,
    itemheading,
    cataloglist
  },

  computed: {},

  created () {
    this.init()
  },

  methods: {
    async init () {
      this.$emit('load', true)
      await this.getAuth()
      await this.getAllChildren()
      this.$emit('load', false)
    },
    async getAuth () { // 权限
      const res = await request(getReportInfo)
      this.authIds = []
      if (res && res.data && Array.isArray(res.data)) {
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i]
          if (item && item.id) {
            this.authIds.push(item.id)
          }
        }
      }
    },
    async getAllChildren () {
      const res = await request(urlMap.report.search, { pagesize: 10000, offset: 0 })
      res.data.resultList.map((child) => {
        const keyArr = child.hisSubModule.split(',')
        const index = keyArr.length - 1
        const key = keyArr[index]
        if (key in this.catalog) {
          child.show = false
          if (!this.authIds.includes(child.id)) {
            child.disable = true
          } else {
            child.disable = false
          }
          this.catalog[key].push(child)
        }
      })
      for (let key in this.catalog) {
        let item = this.catalog[key]
        item = item.sort((a, b) => a.orderNumber - b.orderNumber)
      }
      this.centerCatalog = [
        this.catalog.outpatient,
        this.catalog.hospitalization,
        [
          { name: '采购报表', show: true, children: this.catalog.purchase },
          { name: '发退药报表', show: true, children: this.catalog.sales },
          { name: '库存管理报表', show: true, children: this.catalog.inventory }
        ],
      ]
    },
  }
}

</script>
<style lang='scss' scoped>
.catalog {
  width: 1280px;
  height: 638px;
  position: relative;
  background-image: url('../img/border.png');
  background-size: 100% 100%;
  padding: 10px;
  color: white;
  display: flex;
  margin: 0 auto;
  .box-container {
    width: 277px;
    height: 100%;
    position: relative;
    .top-box {
      width: 238px;
      height: 305px;
      box-shadow: inset 0 1px 4px 0 #333fa8;
      border-radius: 10px;
      position: relative;
      padding: 1px;
      border: 1px solid #4c6dc2;
      background-color: #142451;
    }
    .top-box:hover {
      padding: 0px;
      border: 2px solid transparent;
      background-origin: border-box;
      background-clip: padding-box, border-box;
      background-size: cover;
      box-shadow: 0 -1px 5px 0 #548bed;
      background-image: linear-gradient(#142451, #142451),
        linear-gradient(#37e4c9, #1c7bef);
      .heading {
        color: #13e7d5;
      }
    }
    .bottom-box {
      position: relative;
      display: inline-block;
      z-index: 10;
      width: 254px;
      height: 263px;
      top: 45px;
      &:hover {
        .heading {
          color: #13e7d5;
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        padding: 1px;
        border: 1px solid #4c6dc2;
        box-shadow: 0 1px 4px 0 #333fa8;
        border-radius: 10px;
        background-color: #142451;
      }
      &:hover::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        border-radius: 10px;
        box-shadow: 0 -1px 5px 0 #548bed;
        padding: 0px;
        border: 2px solid transparent;
        background-origin: border-box;
        background-clip: padding-box, border-box;
        background-size: cover;
        background-image: linear-gradient(#142451, #142451),
          linear-gradient(#37e4c9, #1c7bef);
      }
      .bottom-content {
        position: relative;
        width: 234px;
      }
    }
  }
  .left-container {
    .top-box {
      transform: skewY(9deg);
      top: 24px;
      left: 6px;
      .top-content {
        padding: 10px 0px;
        transform: skewY(-9deg);
      }
    }
    .bottom-box {
      right: -13px;
      &:hover::before {
        transform: perspective(400px) rotateY(21deg);
      }
      &::before {
        transform: perspective(400px) rotateY(21deg);
      }
      .bottom-content {
        z-index: 20;
        top: -5px;
        left: -2px;
      }
    }
  }
  .right-container {
    .top-box {
      transform: skewY(-9deg);
      top: 24px;
      left: 13px;
      .top-content {
        transform: skewY(9deg);
      }
    }
    .bottom-box {
      right: 6px;
      &:hover::before {
        transform: perspective(400px) rotateY(-21deg);
      }
      &::before {
        transform: perspective(400px) rotateY(-21deg);
      }
      .bottom-content {
        z-index: 20;
        top: -5px;
        left: 24px;
      }
    }
  }

  .center-container {
    display: flex;
    justify-content: space-between;
    width: 814px;
  }
}
</style>
