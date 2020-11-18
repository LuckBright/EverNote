<template>
  <div class="agency">
    <ever-form2
      :schema="schema"
      v-model="obj"
      ref="form"
      :rules="rules"
      :span="13"
      nosubmit="true"
    >
      <template slot="activityTime">
        <ever-range-picker
          :start.sync="obj.startDate"
          :end.sync="obj.endDate"
          dateType="datetimerange"
          outformat="YYYY-MM-DD HH:mm:ss"
          startPlaceholder="_年_月_日 _时_分_秒"
          endPlaceholder="_年_月_日 _时_分_秒"
          :defaultTime="['00:00:00', '23:59:59']"
          autoWidth="true"
          disabled
        ></ever-range-picker>
      </template>
    </ever-form2>
    <el-row class="mt10">
      <!-- <h4 class="directory_title f16">区域结构</h4> -->
      <el-col :span="13">
        <el-radio-group v-model="regionId">
          <el-radio v-for="(region, id) in regionAllOrsection" :label="region.id" :key="id" @change="handleRegion(regionId)">{{region.name}}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="13">
        <ever-table
          :height="tableData.length ? 'calc(75vh - 300px)' : 'auto'"
          :columns="columns"
          :data="tableData"
          @eventChange="eventChange"
          :is-record-url-params="false"
        >
          <template slot="opCol">
            <el-table-column label="可用地区"  width="80px">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.cityCheckBox" @change="handleCheck(scope.row)" :disabled="regionId == 0 ? true : false"></el-checkbox>
              </template>
            </el-table-column>
          </template>
        </ever-table>
      </el-col>
      <el-col>
        <el-button type="primary" @click="submitUpdate" :disabled="regionArr.length ? false : true">确认更新</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import selfApi from '@/rcm/store/tariffs/selftariffsapi'
import {getFirstRoutePath} from '@/util/common'
import {ACTIVITY_AGENCY_SCHEMA} from '@/card/schema/activityschema'
import {ID_CARD_AGENCY_SCHEMA} from '@/card/schema/idcardschema'
import activityApi from '@/card/store/activityapi'
import idCardApi from '@/card/store/idcardapi'
export default {
  props: ['dataDetails'],
  data () {
    return {
      schema: [],
      obj: {},
      rules: {},
      discountRulesArr: [],
      tableData: [],
      cacheGetData: [],
      columns: [
        {
          prop: 'cityName',
          label: '地区列表'
        },
        {
          slotName: 'opCol'
        }
      ],
      regionAllOrsection: [
        { id: 0, name: '全国' },
        { id: 1, name: '地区' }
      ],
      regionId: 0,
      regionArr: [],
      cacheRegionArr: [{rangeId: 0, rangeType: 2}],
      objId: this.$route.params.id,
      agencyType: 2 // 1为机构，2为区域
    }
  },
  created () {
    this.regionArr = this.cacheRegionArr
  },
  methods: {
    submitUpdate () {
      let params = {}
      if (getFirstRoutePath(this.$route.path, 2) === 'activitydetail') {
        Object.assign(params, {id: this.objId, orgranges: this.regionArr})
        activityApi.modifyOrgService(params).then(res => {
          this.$router.push({name: 'activitys'})
        })
      } else {
        Object.assign(params, {toolId: this.objId, orgranges: this.regionArr})
        idCardApi.modifyUseRange(params).then(res => {
          this.$router.push({name: `idcards`})
        })
      }
    },
    handleRegion (radio) {
      if (radio) {
        this.regionArr = []
      } else {
        this.regionArr = this.cacheRegionArr
        this.tableData.forEach((item, i) => { item.cityCheckBox = false })
      }
    },
    handleCheck (row) {
      if (row.cityCheckBox) {
        this.regionArr.push({rangeId: row.rangeId, rangeType: this.agencyType})
      } else {
        this.regionArr.forEach((item, i) => {
          if (item.rangeId === row.rangeId) this.regionArr.splice(i, 1)
        })
      }
    },
    initInfo (data) {
      this._getSelfTariff(data.origId)
      if (getFirstRoutePath(this.$route.path, 2) === 'activitydetail') {
        if (data.discount || data.discount === 0) {
          this.obj.discountSelect = `${data.discount}%`
        } else if (data.discountRule) {
          this.discountRulesArr.forEach(item => {
            if (item.id === data.discountRule) this.obj.discountSelect = item.masterName
          })
        } else {
          this.obj.discountSelect = `减免金额${data.saleMoney}元`
        }
        if (data.orgranges && data.orgranges.length) this._cacheAgecyData(data.orgranges)
      } else {
        if (data.discount || data.discount === 0) {
          this.obj.discountSelect = `${data.discount}%`
        } else {
          this.discountRulesArr.forEach(item => {
            if (item.id === data.discountRule) this.obj.discountSelect = item.masterName
          })
        }
        if (data.orgRangeList && data.orgRangeList.length) this._cacheAgecyData(data.orgRangeList)
      }
      this.objId = data.id
      Object.assign(this.obj, data)
    },
    _cacheAgecyData (dataList) {
      dataList.forEach(item => {
        if (Number(item.rangeId) !== Number(this.cacheRegionArr[0].rangeId)) {
          this.regionId = 1
          this.cacheGetData = JSON.parse(JSON.stringify(dataList))
        }
      })
    },
    eventChange ({btnType, col, row}) {
      console.log(btnType, col, row)
    },
    createSchemaObj () {
      let createSchema = []
      getFirstRoutePath(this.$route.path, 2) === 'activitydetail' ? createSchema = ACTIVITY_AGENCY_SCHEMA : createSchema = ID_CARD_AGENCY_SCHEMA
      return {
        createSchema,
        createObj: this.$ever.createObjFromSchema(createSchema)
      }
    },
    _initial (val) {
      activityApi.getClinicCityList({}).then(res => {
        if (res && res.data) {
          let cityArr = res.data
          cityArr.forEach(item => {
            item.cityCheckBox = false
            item.rangeId = item.cityCode
          })
          this.tableData = cityArr
        }
      })
      this.schema = this.createSchemaObj().createSchema
      this.obj = this.createSchemaObj().createObj
      this.obj.startDate = ''
      this.obj.endDate = ''
    },
    _getSelfTariff (clinicId) {
      let selfTariffParams = Object.assign({}, {origId: clinicId})
      selfApi.list(selfTariffParams).then(res => {
        if (res && res.data) this.discountRulesArr = res.data
      })
    }
  },
  components: {

  },
  watch: {
    'dataDetails': {
      handler: function (val) {
        if (val) {
          this._initial(val)
          this.initInfo(val)
        }
      },
      deep: true,
      immediate: true
    },
    'tableData': {
      handler: function (arr) {
        if (arr.length && this.cacheGetData.length && this.regionId) {
          this.cacheGetData.forEach(item => {
            arr.forEach((item1, i) => {
              if (Number(item1.rangeId) === Number(item.rangeId)) this.$set(this.tableData[i], 'cityCheckBox', true)
            })
          })
          this.regionArr = this.cacheGetData
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.directory_title {
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  margin: 3px 0 15px 3px;
}
.agency /deep/ .el-range-editor.is-disabled input { color: #000; }
</style>

