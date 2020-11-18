<template>
  <div class="z-edit">
    <el-page-header @back="goBack" content="发布商品"></el-page-header>
    <div class="top-nav">
      <span class="nav-left">1.编辑基本信息</span>
      <span :class="{ 'nav-right': true, 'nav-right-bg': nextBg }">2.编辑商品详情</span>
    </div>
    <div v-show="showTime">
      <el-form
        :model="formObj"
        ref="rulesForm"
        :rules="rules"
        label-width="80px"
        class="form-label">
        <!-- 商品类型 -->
        <div class="region">
          <div class="topTitle">
            <span>商品类型</span>
          </div>
          <el-form-item label="商品类型" prop="type" class="form-bottom">
            <el-radio-group v-model="formObj.type" @change="changeRadio">
              <el-radio
                label="0" :disabled="!isEdit"
              >实物商品（物流发货）
              </el-radio>
              <el-radio
                label="1" :disabled="!isEdit"
              >服务（无需物流）
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- 基本信息 -->
        <div class="region">
          <div class="topTitle">
            <span>基本信息</span>
          </div>
          <el-form-item label="商品名称" prop="name">
            <el-input
              v-model="formObj.name"
              type="text"
              style="width: 470px;"
              maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品头图" prop="sptt" class="topImgBox">
            <draggable v-model="imgArr" style="float: left">
              <div class="titleImg" v-for="(url, i) in imgArr" :key="i">
                <el-image
                  :src="url.includes('http') ? url : imgCdn + url" fit="cover" :preview-src-list="previewSrcList">
                </el-image>
                <i class="imgClose" @click="closeImg(i)">x</i>
              </div>
            </draggable>
            <up-image
              class="up-image"
              v-if="imgArr.length < 8"
              @addImg="addImg"
              :isMany="true"
            ></up-image>
          </el-form-item>
          <p class="span-color" style="margin-left: 80px">
            建议尺寸 750*750 像素，至少一张，最多可以上传8张图片,
            可以拖动图片修改顺序。
          </p>
          <p class="p-info">
            <span class="span-color" style="width: 70px">商品分组</span>
            <el-select
              v-model="formObj.groupIds"
              @visible-change="changeGroupSelect"
              placeholder="请选择分组"
              multiple
              filterable
              size="small"
              style="width: 470px">
              <el-option
                v-for="item in groupingOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button
              class="grouping-btn" type="text" @click="groupingBtn"
            >管理分组
            </el-button>
          </p>
        </div>
        <!-- 价格库存 -->
        <div class="region">
          <div class="topTitle">
            <span>价格库存</span>
          </div>
          <el-form-item label="库存类型" prop="stockType">
            <el-radio-group v-model="formObj.stockType">
              <el-radio
                label="0" :disabled="formObj.type === '1' || !isEdit"
              >THC库存商品
              </el-radio>
              <el-radio label="1" :disabled="!isEdit">非THC库存商品</el-radio>
            </el-radio-group>

            <el-tooltip
              effect="dark"
              content="THC库存商品是指可以从THC系统库存中关联一个商品，商品的库存与THC系统中的商品共享库存。订单的发货在THC系统中的库房工作站中操作。
非THC库存商品是指私域商城独有的商品，库存在商城商品中进行管理，订单的发货在私域商城的订单管理中操作。"
              placement="top">
              <i class="el-icon-question icon-tip"></i>
            </el-tooltip>
          </el-form-item>
          <div>
            <sku-table
              ref="skuRef"
              :id="rowId"
              @getEdit="getEdit"
              :type="formObj.stockType"
              @changeGgz="changeGgz"
            ></sku-table>
          </div>
          <el-form-item label="价格" prop="price">
            <el-input
              :disabled="disabledPriceAndNum"
              v-model="formObj.price"
              style="width: 470px;"
              size="small"
              maxlength="8"
              placeholder="请输入价格"
              :onkeyup="changeInput(this, 'price')">
              <template slot="append">￥</template>
            </el-input>
          </el-form-item>
          <p class="p-info" style="margin-bottom:20px">
            <span class="span-color">划线价</span>
            <el-input
              maxlength="8"
              v-model="formObj.markingPrice"
              size="small"
              style="width: 470px;"
            ></el-input>
            <span class="yf-tip">划线价会在商品详情中展示。</span>
            <el-popover
              placement="top-start"
              title=""
              width="280"
              trigger="hover">
              <img src="../../../assets/img/hxj.png"/>
              <el-button
                slot="reference" type="text" class="hxj-shili"
              >示例
              </el-button>
            </el-popover>
          </p>
          <el-form-item
            class="kc-row"
            label="库存"
            prop="stockNum"
            v-if="formObj.stockType === '1'">
            <el-input
              :disabled="disabledPriceAndNum"
              v-model="formObj.stockNum"
              style="width: 470px;"
              size="small"
              maxlength="8"
              placeholder="请输入库存数量"
              :onkeyup="setInputNum(this, 'stockNum')"
            ></el-input>
          </el-form-item>
          <el-form-item class="kc-row" label="库存" prop="orgId" v-else>
            <span>
              <el-select
                :disabled="disabledPriceAndNum"
                v-model="formObj.orgId"
                placeholder="请选择"
                size="small"
                filterable
                value-key="storageId"
                @change="changeOrgId">
                <el-option
                  v-for="item in kcOptions"
                  :key="item.storageId"
                  :label="item.stockName"
                  :value="item">
                </el-option>
              </el-select>
              <el-autocomplete
                v-if="!formObj.thcKc"
                :disabled="disabledPriceAndNum"
                size="small"
                style="width: 60%;margin-left:10px"
                v-model="formObj.materialName"
                :fetch-suggestions="
                  (value, callback) => querySearchAsync(value, callback)
                "
                @select="value => handleSelect(value)"
                placeholder="请输入内容"
              ></el-autocomplete>
              <el-tag
                style="margin-left: 10px"
                :closable="!disabledPriceAndNum"
                disable-transitions
                v-else
                type="info"
                @close="handleClose"
              >{{ formObj.thcKc }}</el-tag
              >
            </span>
          </el-form-item>
          <p>
            <span class="yf-tip" style="margin-left: 80px">库存扣减方式：拍下减库存，可能存在恶意占用库存风险，可设置每人限购数量解决。</span>
          </p>
        </div>
        <!-- 服务信息 -->
        <div class="region" v-if="formObj.type === '1'">
          <div class="topTitle">
            <span>服务信息</span>
          </div>
          <p class="p-info">
            <span class="span-color" style="width: 70px">服务商名称</span>
            <el-input
              v-model="formObj.serviceProviderName"
              size="small"
              style="width: 475px;"
              placeholder="请输入服务商名称"
            ></el-input>
            <el-button
              type="text"
              class="info-link"
              size="small"
              @click="defaultFwsClick"
            >使用默认服务商
            </el-button>
            <el-button
              type="text"
              class="info-link"
              size="small"
              @click="getServiceProviderList"
            >常用服务商
            </el-button>
          </p>
          <p class="p-info">
            <span class="span-color">营业时间</span>
            <el-input
              v-model="formObj.businessHours"
              size="small"
              style="width: 475px;"
              placeholder="请输入营业时间"
            ></el-input>
            <span class="span-tip">请按24小时制进行填写</span>
          </p>
          <div class="p-info">
            <span class="span-color lf" style="margin-top: 5px;margin-right: 15px">联系电话</span>
            <p
              v-for="(val, i) in formObj.phone"
              :key="i"
              :class="{ 'left-wd': i !== 0 }"
              style="margin-top: 10px">
              <el-input
                :class="{ 'err-input': val.err }"
                v-model="val.value"
                size="small"
                placeholder="请输入联系电话"
                style="width: 475px;"
                maxlength="13"
                :onkeyup="phoneInput('formObj', 'phone', i)"
                @blur="changePhone(val, i)"
              ></el-input>
              <el-button
                class="info-link"
                type="text"
                size="small"
                v-if="i !== 0"
                @click="deletePhone('formObj', i)"
              >删除
              </el-button>
              <el-button
                type="text"
                v-if="i === 0"
                class="info-link"
                size="small"
                @click="addPhone(true)"
              >添加电话
              </el-button>
            </p>
          </div>
          <p class="p-info">
            <span class="span-color" style="margin-bottom:30px">服务地址</span>
            <el-input
              v-model="formObj.serviceAddress"
              size="small"
              placeholder="请输入地址信息"
              style="width: 475px;"
            ></el-input>
            <el-button
              type="text"
              class="info-link"
              size="small"
              @click="
                () => {
                  mapDialog = true;
                  isAddress = 2;
                }
              "
            >地图坐标
            </el-button>
          </p>
        </div>
        <!-- 物流 -->
        <div class="region" v-if="formObj.type === '0'">
          <div class="topTitle">
            <span>物流信息</span>
          </div>
          <p class="p-info">
            <span class="span-color">配送方式</span>
            <span>快递发货</span>
          </p>
          <p class="p-info">
            <el-form-item
              label="快递方式"
              prop="distributionPrice"
              class="form-bottom">
              <span style="margin-right: 20px">统一邮费</span>
              <el-input
                v-model="formObj.distributionPrice"
                size="small"
                maxlength="4"
                style="width: 391px;margin-top: 4px"
                :onkeyup="setInputNum(this, 'distributionPrice')">
                <template slot="append">￥</template>
              </el-input>
              <span class="yf-tip">免运费请填0元</span>
            </el-form-item>
          </p>
        </div>
        <!-- 其它 -->
        <div class="region">
          <div class="topTitle">
            <span>其他信息</span>
          </div>
          <el-row>
            <el-col :span="1.5">
              <span class="span-color" style="margin-left:10px">上架时间</span>
            </el-col>
            <el-col :span="20">
              <el-radio-group
                v-model="formObj.isUpper"
                style="width:100%"
                @change="changeIsUpper">
                <el-radio label="1">立即上架售卖</el-radio>
                <el-row style="margin: 15px 0;">
                  <el-col :span="2" style="margin-top: 9px; margin-right:54px">
                    <el-radio label="2">自定义上架时间</el-radio>
                  </el-col>
                  <el-col :span="5">
                    <el-date-picker
                      :disabled="formObj.isUpper !== '2'"
                      v-model="formObj.upperTime"
                      type="datetime"
                      value-format="timestamp"
                      placeholder="请选择上架售卖时间"
                      size="small"
                      :clearable="false"
                      style="width: 303px;"
                    ></el-date-picker>
                  </el-col>
                </el-row>
                <el-radio label="0">暂不上架，放入下架商品中</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <p class="p-info">
            <span class="span-color">限购</span>
            <el-checkbox
              v-model="formObj.xg"
              style="margin-right: 21px;"
              @change="changeXg"
            >限制每人可购买数量
            </el-checkbox>
            <el-input
              :disabled="!formObj.xg"
              v-model="formObj.purchaseLimits"
              size="small"
              maxlength="8"
              style="width: 303px;"
              placeholder="请输入商品终身限购件数"
              :onkeyup="setInputNum(this, 'purchaseLimits')">
              <template slot="append">件</template>
            </el-input>
          </p>
          <p class="p-info">
            <span class="span-color">退货</span>
            <el-checkbox
              v-model="formObj.returnedPurchase"
            >不支持买家申请退货退款
            </el-checkbox>
          </p>
          <p class="p-info" v-if="formObj.type === '1'">
            <span class="span-color">有效期</span>
            <el-checkbox
              v-model="formObj.yxq"
              style="margin-right: 35px;"
              @change="changeYxq"
            >服务码设置有效期
            </el-checkbox>

            <el-date-picker
              :disabled="!formObj.yxq"
              v-model="formObj.validity"
              type="datetime"
              value-format="timestamp"
              placeholder="请选择有效截止时间"
              size="small"
              :clearable="false"
              style="width: 303px;"
            ></el-date-picker>
          </p>
          <p class="p-info" v-if="formObj.type === '1'">
            <span class="span-color" style="width: 70px">下单填写项</span>
            <el-checkbox-group
              v-model="formObj.orderEntry"
              style="display: inline-block">
              <el-checkbox label="phone">手机号</el-checkbox>
              <el-checkbox label="name">姓名</el-checkbox>
            </el-checkbox-group>
          </p>
          <p class="p-info" v-if="formObj.type === '1'">
            <span class="span-color" style="width: 70px">服务预约</span>
            <el-checkbox-group
              v-model="formObj.sourceCheck"
              style="display: inline-block"
              @change="sourceCheckClick">
              <el-checkbox label="source">使用服务预约功能</el-checkbox>
            </el-checkbox-group>
            <el-select
              v-model="formObj.appointTemplateId"
              size="small"
              placeholder="请选择"
              class="source-select"
              filterable
              clearable
              :disabled="!formObj.sourceCheck"
              @visible-change="getSourceAll">
              <el-option
                v-for="item in sourceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button
              type="text" class="info-link" @click="sourceClickBtn"
            >管理模板
            </el-button>
          </p>
          <p class="p-info">
            <span class="span-color">推荐奖励</span>
            <el-input
              v-model="formObj.recommendedAward"
              maxlength="8"
              size="small"
              class="reward"
              :onkeyup="changeInput(this, 'recommendedAward')"
              @blur="inputBlur">
              <template slot="append">￥</template>
            </el-input>
          </p>
          <p class="p-info">
            <span class="span-color">分销奖励</span>
            <span style="font-size: 14px">一级</span>
            <el-input
              v-model="formObj.distributionAward1"
              maxlength="8"
              size="small"
              style="width: 150px"
              :onkeyup="changeInput(this, 'distributionAward1')">
              <template slot="append">￥</template>
            </el-input>
            <span style="font-size: 14px;margin-left: 105px">二级</span>
            <el-input
              v-model="formObj.distributionAward2"
              maxlength="8"
              size="small"
              style="width: 150px"
              :onkeyup="changeInput(this, 'distributionAward2')">
              <template slot="append">￥</template>
            </el-input>
          </p>
        </div>
      </el-form>
    </div>
    <div v-show="!showTime" class="quill-box">
      <editor ref="editorRef"></editor>
    </div>
    <div class="region btn-box">
      <el-button
        v-if="showTime" type="primary" @click="nextBtn"
      >下一步
      </el-button>
      <el-button v-else type="primary" @click="goUp">上一步</el-button>
      <el-button @click="sendBtn">保存并查看</el-button>
    </div>
    <el-dialog
      title="常用服务商"
      :visible.sync="dialogTableVisible"
      width="70%"
      :close-on-click-modal="false">
      <div class="dialogSearch">
        <span class="span-color">服务商名称</span>
        <el-input
          v-model="name"
          size="small"
          style="width: 382px"
          placeholder="请输入常用服务商名称"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 20px"
          @click="getDataValues"
        >查询
        </el-button>
        <el-button
          size="small" style="float: right" @click="addFws"
        >添加服务商
        </el-button>
      </div>
      <el-table :data="fwsData" border size="small">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="a-link"
              size="small"
              @click="deleteServer(scope.row)"
            >删除
            </el-button>
            <el-button
              type="text"
              class="a-link"
              size="small"
              @click="defaultServer(scope.row)"
            >默认
            </el-button>
            <el-button
              type="text"
              class="a-link"
              size="small"
              @click="editServer(scope.row)"
            >编辑
            </el-button>
            <el-button
              type="text"
              class="a-link"
              size="small"
              @click="useClick(scope.row)"
            >使用
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          property="name"
          label="服务商名称"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.isDefault">默认</el-tag>
            <span class="default-span" v-else></span>
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="businessHours"
          label="营业时间"
          width="150"
        ></el-table-column>
        <el-table-column
          property="phone"
          label="联系电话"
          width="150px"
        ></el-table-column>
        <el-table-column
          property="address"
          label="服务地址"
          width="180px"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="pageSize"
        :page-size="pagesize"
        :layout="pageLayout"
        :total="totalCount"
        background
      ></el-pagination>
    </el-dialog>
    <el-dialog
      title="添加服务商"
      :visible.sync="addFwsDialog"
      width="750px"
      :close-on-click-modal="false">
      <p>
        <span class="span-color">服务商名称</span>
        <el-input
          v-model="fwsObj.name"
          size="small"
          class="span-position"
          style="width: 475px;vertical-align: text-top"
          placeholder="请输入服务商名称"
        ></el-input>
      </p>
      <p class="p-info">
        <span class="span-color">营业时间</span>
        <el-input
          v-model="fwsObj.businessHours"
          size="small"
          style="width: 475px;"
          placeholder="请输入营业时间"
        ></el-input>
        <span class="span-tip">请按24小时制进行填写</span>
      </p>
      <div class="p-info">
        <span class="span-color lf" style="margin-top: 5px; margin-right: 15px">联系电话</span>
        <p
          v-for="(val, i) in fwsObj.phone"
          :key="i"
          :class="{ 'left-wd': i !== 0 }"
          style="margin-top: 10px">
          <el-input
            :class="{ 'err-input': val.err }"
            v-model="val.value"
            size="small"
            placeholder="请输入联系电话"
            style="width: 475px;"
            maxlength="13"
            :onkeyup="phoneInput('fwsObj', 'phone', i)"
            @blur="changePhone(val, i)"
          ></el-input>
          <el-button
            class="info-link"
            type="text"
            size="small"
            v-if="i !== 0"
            @click="deletePhone('fwsObj', i)"
          >删除
          </el-button>
          <el-button
            type="text"
            v-if="i === 0"
            class="info-link"
            size="small"
            @click="addPhone(false)"
          >添加电话
          </el-button>
        </p>
      </div>
      <p class="p-info">
        <span class="span-color" style="margin-bottom:30px">服务地址</span>
        <el-input
          v-model="fwsObj.address"
          size="small"
          placeholder="请输入地址信息"
          style="width: 475px;"
        ></el-input>
        <el-button
          type="text"
          class="info-link"
          size="small"
          @click="
            () => {
              mapDialog = true;
              isAddress = 1;
            }
          "
        >地图坐标
        </el-button>
      </p>
      <p class="fws-btn">
        <el-button type="primary" @click="addFwsBtn">确认</el-button>
        <el-button @click="addFwsDialog = false">取消</el-button>
      </p>
    </el-dialog>
    <el-dialog title="地图" :visible.sync="mapDialog" width="742px">
      <!-- <Map ref="mapRef"></Map> -->
      <ever-map @input="getPos" @getPosAddress="getAddres"></ever-map>
      <div slot="footer" align="center">
        <el-button @click="mapDialog = false">取消</el-button>
        <el-button type="primary" @click="addAddressBtn">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import priceInfo from '@/titanmall/components/priceInfo'
  // import Map from '@/titanmall/components/map'
  import skuTable from './skutable'
  import api from '../api'
  import draggable from 'vuedraggable'
  import editor from './editor'
  import upImage from '@/titanmall/components/upimage'
  import everMap from '@/manages/page/organization/components/a-map'

  export default {
    mixins: [ pagination ],
    components: {
      // Map,
      skuTable,
      draggable,
      editor,
      upImage,
      everMap
    },
    data () {
      let imageCheck = (rule, value, callback) => {
        if (this.imgArr.length === 0) {
          callback(new Error('请上传商品图'))
        } else {
          callback()
        }
      }
      return {
        api,
        nextBg: false,
        priceInfo,
        tableHeader: [],
        formObj: {
          type: '0',
          name: '',
          sptt: '',
          isUpper: '1',
          upperTime: '',
          purchaseLimits: '',
          xg: '',
          returnedPurchase: '',
          yxq: '',
          recommendedAward: '',
          serviceProviderName: '',
          businessHours: '',
          phone: [ { value: '', err: false } ],
          serviceAddress: '',
          distributionPrice: '',
          stockType: '',
          price: '',
          markingPrice: '',
          stockNum: '',
          tableData: [],
          spgg: [],
          fileArr: [],
          detail: '',
          validityType: 1,
          validity: '',
          pictures: [],
          lat: '',
          lng: '',
          indexes: '',
          skuArr: [],
          sku: [],
          thcKc: '',
          orgId: '',
          materialName: '',
          materialNum: '',
          groupIds: [],
          orderEntry: [ 'phone' ],
          appointTemplateId: '',
          sourceCheck: '',
          distributionAward1: '',
          distributionAward2: ''
        },
        rules: {
          type: [
            { required: true, message: '请选择商品类型', trigger: 'change' },
          ],
          name: [ { required: true, message: '请输入商品名称', trigger: 'blur' } ],
          stockType: [ { required: true, message: '必选项', trigger: 'change' } ],
          distributionPrice: [
            { required: true, message: '请输入运费价格', trigger: 'blur' },
          ],
          price: [ { required: true, message: '必填项', trigger: 'blur' } ],
          stockNum: [ { required: true, message: '必填项', trigger: 'blur' } ],
          sptt: [ { required: true, validator: imageCheck, trigger: 'blur' } ],
          orgId: [ { required: true, message: '必填项', trigger: 'blur' } ],
        },
        dialogVisible: false,
        dialogImageUrl: '',
        showTime: true,
        options: [],
        dialogTableVisible: false, // 服务商弹框
        fwsData: [],
        name: '',
        addFwsDialog: false, // 添加服务商弹框
        fwsObj: {
          // 添加服务商
          name: '',
          businessHours: '',
          phone: [ { value: '', err: false } ],
          address: '',
          lat: '',
          ing: '',
        },
        editorOption: {
          modules: {
            toolbar: [
              [ 'bold', 'italic', 'underline', 'strike' ], // 加粗，斜体，下划线，删除线
              [ 'blockquote', 'code-block' ], // 引用，代码块
              [ { header: 1 }, { header: 2 } ], // 标题，键值对的形式；1、2表示字体大小
              [ { list: 'ordered' }, { list: 'bullet' } ], // 列表
              [ { script: 'sub' }, { script: 'super' } ], // 上下标
              [ { indent: '-1' }, { indent: '+1' } ], // 缩进
              [ { direction: 'rtl' } ], // 文本方向
              [ { size: [ 'small', false, 'large', 'huge' ] } ], // 字体大小
              [ { header: [ 1, 2, 3, 4, 5, 6, false ] } ], // 几级标题
              [ { color: [] }, { background: [] } ], // 字体颜色，字体背景颜色
              [ { font: [] } ], // 字体
              [ { align: [] } ], // 对齐方式
              [ 'clean' ], // 清除字体样式
              [ 'image' ], // 上传图片、上传视频, "video"
            ],
          },
          theme: 'snow',
        },
        detailInfo: '',
        mapDialog: false, // 地图弹框
        isAddress: '', // 判断那个地图坐标
        rulesPhone: {},
        disabledThc: false,
        disabledPriceAndNum: false,
        kcOptions: [],
        kfList: [],
        rowId: '',
        isEdit: true,
        imgArr: [],
        groupingOptions: [],
        orderEntry: [],
        sourceOptions: [],
        previewSrcList: [],
        imgCdn: localStorage.getItem('IMGCDN'),
      }
    },
    created () {
      if (this.$route.query.id) {
        this.rowId = this.$route.query.id
        this.isEdit = false
      } else if (this.$route.query.spuId) {
        this.rowId = this.$route.query.spuId
        this.isEdit = false
      }
      this.getspuStorageRoomList()
      this.getGroupingList()
      this.getSourceAll()
    },
    methods: {
      getPos (pos) {
        if (this.isAddress === 1) {
          this.fwsObj.lat = pos.lat
          this.fwsObj.lng = pos.lng
        } else {
          this.formObj.lat = pos.lat
          this.formObj.lng = pos.lng
        }
      },
      getAddres (str) {
        if (this.isAddress === 1) {
          this.fwsObj.address = str
        } else {
          this.formObj.serviceAddress = str
        }
      },
      goBack () {
        this.$router.push({
          path: '/titanmall/goodsmain/goodsmanager',
          query: this.$route.query,
        })
      },
      // 编辑获取数据
      getEdit (res) {
        this.imgArr = res.pictures
        if (res.sku && res.sku.length) {
          this.formObj.orgId = res.sku[0].stockName
        } else {
          let obj = {
            storageId: res.stockId,
            stockName: res.stockName,
            clinicId: res.orgId,
          }
          res.orgId = obj
        }
        this.formObj = { ...this.formObj, ...res }
        if (res.sku && res.sku.length) {
          this.formObj.price = ''
          this.formObj.stockNum = ''
        } else {
          this.formObj.price = this.$_narrowPrice(this.formObj.price, 100)
        }
        if (this.formObj.markingPrice) {
          this.formObj.markingPrice = this.$_narrowPrice(
            this.formObj.markingPrice,
            100,
          )
        }
        // 快递费用不带小数
        if (this.formObj.distributionPrice) {
          this.formObj.distributionPrice = this.formObj.distributionPrice / 100
        }
        if (this.formObj.recommendedAward) {
          this.formObj.recommendedAward = this.$_narrowPrice(
            this.formObj.recommendedAward,
            100,
          )
        }
        if (this.formObj.distributionAward1) {
          this.formObj.distributionAward1 = this.$_narrowPrice(this.formObj.distributionAward1, 100)
        }
        if (this.formObj.distributionAward2) {
          this.formObj.distributionAward2 = this.$_narrowPrice(this.formObj.distributionAward2, 100)
        }
        this.formObj.thcKc =
          this.formObj.materialName + ' 库存：' + this.formObj.stockNum
        this.formObj.phone =
          res.phone && res.phone.length ? res.phone : [ { value: '', err: false } ]
        this.formObj.isUpper = this.formObj.upperTime ? '2' : res.isUpper + ''
        this.formObj.xg = res.purchaseLimits !== -1 && res.purchaseLimits !== ''
        this.formObj.purchaseLimits =
          res.purchaseLimits === -1 ? '' : res.purchaseLimits
        this.formObj.yxq = res.validity && res.validity !== '-1'
        this.formObj.validity = res.validity === '-1' ? '' : res.validity
        this.formObj.returnedPurchase = res.returnedPurchase !== 0
        this.formObj.type = res.type + ''
        this.formObj.stockType = res.stockType + ''
        this.$refs.editorRef.detailContent = res.detail
        this.formObj.sourceCheck = res.isAppt
      },

      // 删除头图
      closeImg (index) {
        this.imgArr.splice(index, 1)
      },

      // 监听规格添加表格变化
      changeGgz (val) {
        this.formObj.orgId = ''
        this.formObj.price = ''
        this.formObj.stockNum = ''
        this.formObj.materialName = ''
        this.formObj.thcKc = ''
        this.disabledPriceAndNum = val !== 0
      },

      // 监听分组
      changeGroupSelect (e) {
        if (e) this.getGroupingList()
      },

      // 管理分组跳转
      groupingBtn () {
        window.open(location.pathname + '#/titanmall/goodsmain/grouping')
      },

      // 获取分组下拉列表
      getGroupingList () {
        this.api.groupListBySpuGroupBox().then(res => {
          if (res) {
            this.groupingOptions = res
          }
        })
      },

      // 获取库房列表
      getspuStorageRoomList () {
        this.api.spuStorageRoomList({ scene: 4 }).then(res => {
          if (res) {
            res.forEach(item => {
              let obj = {}
              obj.clinicId = item.clinicId
              obj.stockName = item.name + ' - ' + item.clinicName
              obj.storageId = item.id
              this.kcOptions.push(obj)
              this.$refs.skuRef.kcOptions.push(obj)
            })
          }
        })
      },
      // 获取物资
      querySearchAsync (queryString, cb) {
        let params = {
          clinicIds: [ this.formObj.orgId.clinicId ],
          name: this.formObj.materialName,
          classifyIds: [ 10008 ],
        }
        this.kfList = []
        this.api.spuMaterialList(params).then(res => {
          if (res) {
            res.forEach(items => {
              let obj = {}
              obj.value = items.name
              obj.countUnitId = items.packagUnitId
              obj.materialSkuId = items.materialSkuId
              obj.materialSpuId = items.materialSpuId
              obj.id = items.id
              this.kfList.push(obj)
            })
            cb(this.kfList)
          }
        })
      },
      // 获取库存
      handleSelect (val) {
        this.formObj.countUnitId = val.countUnitId
        let params = {
          storageRoomIds: [ this.formObj.orgId.storageId ],
          localMaterialIds: [ val.id ],
          checkScene: '1',
        }
        this.api.spuStockList(params).then(res => {
          if (res) {
            this.formObj.thcKc =
              this.formObj.materialName + ' 库存：' + res[0].num
            this.formObj.stockNum = res[0].num
            this.formObj.orgMaterialId = res[0].localMaterialId
            this.formObj.tenantMaterialId = res[0].materialSkuId
            this.formObj.materialNum = res[0].num
          }
        })
      },
      // 获取库房下数据
      handleClose () {
        this.formObj.thcKc = ''
        this.formObj.stock = ''
      },

      // 库房select改变
      changeOrgId (val) {
        this.formObj.thcKc = ''
        this.formObj.materialName = ''
      },

      /**
       * 添加服务商
       */
      addFws () {
        this.fwsObj = Object.assign(this.fwsObj, {
          name: '',
          businessHours: '',
          phone: [ { value: '', err: false } ],
          address: '',
          lat: '',
          ing: '',
        })
        this.close()
      },
      close () {
        this.dialogTableVisible = false
        setTimeout(() => {
          this.addFwsDialog = true
        }, 300)
      },
      /**
       * 编辑服务商
       */
      editServer (obj) {
        let arr = obj.phone.split(',')
        let newArr = []
        arr.forEach(item => {
          newArr.push({ value: item, err: false })
        })
        this.fwsObj = Object.assign(this.fwsObj, obj)
        this.fwsObj.phone = newArr
        this.close()
      },
      /**
       使用服务商
       */
      useClick (row) {
        this.providerInfo(row)
        this.dialogTableVisible = false
      },
      /**
       保存服务商
       */
      addFwsBtn () {
        let phoneArr = this.fwsObj.phone.filter(item => {
          if (item.err) return item
        })
        if (phoneArr.length) {
          this.$message({
            message: '请输入正确手机号',
            type: 'error',
          })
          return
        }
        if (this.fwsObj.id) {
          this.api.updateFacilitator(this.fwsObj).then(res => {
            if (res) {
              this.$message({
                message: '修改成功',
                type: 'success',
              })
            }
          })
        } else {
          this.api.createServiceProvider(this.fwsObj).then(res => {
            if (res) {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
            }
          })
        }
        this.addFwsDialog = false
      },
      /**
       * 删除服务商
       */
      deleteServer (row) {
        this.$confirm('是否删除' + row.name, '删除服务商', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.api.deleteServiceProvider(row.id).then(res => {
              if (!res.errCode) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                })
                this.getDataValues()
              }
            })
          })
          .catch(() => {
          })
      },
      /**
       默认服务商
       */
      defaultServer (row) {
        row.isDefault = 1
        let arr = []
        let newRow = { ...row }
        newRow.phone.split(',').forEach(item => {
          let obj = {}
          obj.value = item
          obj.err = false
          arr.push(obj)
        })
        newRow.phone = arr
        this.api.updateFacilitator(newRow).then(res => {
          if (res) {
            this.$message({
              message: '设置默认成功',
              type: 'success',
            })
            this.getDataValues()
          }
        })
      },
      /**
       * 价格格式化
       */
      changeInput (that, val) {
        let value = that.formObj[val]
        that.formObj[val] = this.priceInfo(value, true)
      },

      // input只能输入数字
      setInputNum (that, val) {
        let value = String(this.formObj[val])
        if (value) that.formObj[val] = value.replace(/[^\d]/g, '')
      },

      // 推荐奖励
      inputBlur (val) {
        if (this.formObj.recommendedAward === '0') {
          this.formObj.recommendedAward = ''
        }
      },

      /**
       使用默认服务商
       */
      defaultFwsClick () {
        this.api.getDefaultServiceProvider().then(res => {
          if (res) {
            this.providerInfo(res)
          }
        })
      },
      providerInfo (res) {
        this.formObj.serviceProviderName = res.name
        this.formObj.businessHours = res.businessHours
        this.formObj.lat = res.lat
        this.formObj.lng = res.lng
        this.formObj.serviceAddress = res.address
        let arr = []
        res.phone.split(',').forEach(item => {
          let obj = {}
          obj.value = item
          obj.err = false
          arr.push(obj)
        })
        this.formObj.phone = arr
      },
      /**
       * 获取服务商列表
       */
      getServiceProviderList () {
        this.dialogTableVisible = true
        this.getDataValues()
      },
      getDataValues () {
        let params = {
          name: this.name,
          currentPage: this.current,
          pageSize: this.pagesize,
        }
        this.api.getServiceProviderList(params).then(res => {
          this.totalCount = res.totalCount
          this.fwsData = res.resultList
        })
      },

      // 添加图片返回结果
      addImg (urls) {
        this.imgArr = [ ...this.imgArr, ...urls ]
      },

      /**
       * 商品图
       */
      uploadSuccess (file) {
        this.imgArr.push(file.fileUrl)
      },
      fileList (file) {
        // 删除赋值
        if (file.length === 0) {
          this.formObj.fileArr = []
        } else {
          this.formObj.fileArr = file
        }
      },

      // 添加地图坐标
      addAddressBtn () {
        // let obj = this.$refs.mapRef.addressObj
        // if (this.isAddress === 1) {
        //   this.fwsObj = { ...this.fwsObj, ...obj }
        // } else {
        //   this.formObj = { ...this.formObj, ...obj }
        //   this.formObj.serviceAddress = obj.address
        // }
        this.mapDialog = false
      },

      // 添加电话
      addPhone (isTrue) {
        if (isTrue) {
          if (this.formObj.phone.length < 5) {
            this.formObj.phone.push({ value: '', err: false })
          }
        } else {
          if (this.fwsObj.phone.length < 5) {
            this.fwsObj.phone.push({ value: '', err: false })
          }
        }
      },

      changePhone (val, index) {
        val.err = false
      },

      //  商品类型选择
      changeRadio (val) {
        if (val === '1') {
          this.disabledThc = true
          this.formObj.stockType = '1'
          // 获取预约列表
        } else {
          this.disabledThc = false
          this.$refs.skuRef.getspuStorageRoomList()
        }
      },

      // 自定义上架清空
      changeIsUpper (val) {
        if (val !== '2') this.formObj.upperTime = ''
      },

      // 清空限购
      changeXg (val) {
        if (!val) this.formObj.purchaseLimits = ''
      },

      // 清空有效期
      changeYxq (val) {
        if (!val) this.formObj.validity = ''
      },

      // 获取预约列表
      getSourceAll () {
        this.api.appointGetAll().then(res => {
          if (res) {
            this.sourceOptions = res
          }
        })
      },

      // 预约框勾选
      sourceCheckClick (val) {
        this.formObj.appointTemplateId = ''
      },

      // 数据格式化
      formObjInfo () {
        let self = this
        let tableList = this.$refs.skuRef.childProductArray
        if (this.formObj.stockType) {
          let arr = tableList.filter(item => {
            return item.price === '' || item.stock === ''
          })
          if (arr.length) {
            this.$message({
              message: '请输入价格或库存.',
              type: 'error',
            })
            return
          }
        } else {
          let arr = tableList.filter(item => {
            return item.price === '' || item.thcKc === ''
          })
          if (arr.length) {
            this.$message({
              message: '请输入价格或库存',
              type: 'error',
            })
            return
          }
        }
        if (this.$refs.skuRef.specification.length && tableList.length) {
          if (tableList[0].orgId && tableList[0].orgId.clinicId) {
            this.formObj.thcKc = tableList[0].thcKc
            this.formObj.orgId =
              tableList[0].orgId && tableList[0].orgId.clinicId
                ? tableList[0].orgId.clinicId
                : ''
            this.formObj.materialName = tableList[0].materialName
          }
          this.formObj.price = tableList[0].price
          this.formObj.stockNum = tableList[0].stock
        } else {
          if (!this.formObj.stockType && !this.formObj.thcKc) {
            this.$message({
              message: '请输入库存',
              type: 'error',
            })
          }
        }
        let next = ''
        this.$refs.rulesForm.validate(valid => {
          if (valid) {
            if (this.formObj.isUpper === '2' && this.formObj.upperTime === '') {
              setInfo('自定义时间')
              return
            }
            if (this.formObj.xg === true && this.formObj.purchaseLimits === '') {
              setInfo('限购数量')
              return
            }
            if (this.formObj.yxq === true && this.formObj.validity === '') {
              setInfo('有效期时间')
              return
            }
            if (
              this.formObj.sourceCheck === true &&
              this.formObj.appointTemplateId === ''
            ) {
              this.$message.warning('请选择预约模板')
              return
            }
            let phoneArr = this.formObj.phone
              ? this.formObj.phone.filter(item => item.err)
              : []
            if (phoneArr.length) {
              this.$message({
                message: '请输入正确手机号',
                type: 'error',
              })
              return
            }
            next = true
          }
        })

        function setInfo (name) {
          self.$message({
            message: '请输入' + name,
            type: 'warning',
          })
        }

        return next
      },
      /**
       * 下一步
       * formName
       */
      nextBtn () {
        let next = this.formObjInfo()
        if (next) {
          this.nextBg = true
          this.showTime = !this.showTime
        }
      },
      /**
       * 上一步
       */
      goUp () {
        this.showTime = !this.showTime
        this.nextBg = false
      },
      /**
       保存并查看
       */
      sendBtn () {
        let tableList = this.$refs.skuRef.childProductArray
        let next = this.formObjInfo()
        if (next) {
          this.formObj.pictures = this.imgArr
          this.formObj.returnedPurchase = this.formObj.returnedPurchase
            ? '1'
            : '0'
          this.formObj.type = Number(this.formObj.type)
          this.formObj.stockType = Number(this.formObj.stockType)
          this.formObj.skuArr = this.$refs.skuRef.specification
          this.formObj.stockId = this.formObj.orgId
            ? this.formObj.orgId.storageId
            : ''
          this.formObj.stockName = this.formObj.orgId
            ? this.formObj.orgId.stockName
            : ''
          this.formObj.orgId = this.formObj.orgId
            ? this.formObj.orgId.clinicId
            : ''
          let newArr = [ ...tableList ]
          newArr.forEach((items, index) => {
            items.ownSpec = JSON.stringify(items.ownSpec)
            let obj = { ...tableList[index].orgId }
            items.price = this.$_enlargePrice(items.price, 100)
            items.stockId = obj.storageId
            items.stockName = obj.stockName
            items.orgId = obj.clinicId
          })
          if (this.formObj.distributionPrice !== null) {
            this.formObj.distributionPrice = this.$_enlargePrice(
              this.formObj.distributionPrice,
              100,
            )
          }
          this.formObj.price = this.$_enlargePrice(this.formObj.price, 100)
          if (this.formObj.markingPrice) {
            this.formObj.markingPrice = this.$_enlargePrice(
              this.formObj.markingPrice,
              100,
            )
          }
          if (this.formObj.recommendedAward) {
            this.formObj.recommendedAward = this.$_enlargePrice(
              this.formObj.recommendedAward,
              100,
            )
          }
          if (this.formObj.distributionAward1) {
            this.formObj.distributionAward1 = this.$_enlargePrice(
              this.formObj.distributionAward1,
              100,
            )
          }
          if (this.formObj.distributionAward2) {
            this.formObj.distributionAward2 = this.$_enlargePrice(
              this.formObj.distributionAward2,
              100,
            )
          }
          this.formObj.sku = newArr
          this.formObj.detail = this.$refs.editorRef.textInfo
          if (this.$route.query.id || this.$route.query.spuId) {
            this.api.spuSave(this.formObj).then(res => {
              if (res) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                })
                this.goBack()
              } else {
                this.getEdit(this.formObj)
                if (this.formObj.sku.length) {
                  this.$refs.skuRef.skuInfo(this.formObj)
                }
              }
            })
          } else {
            this.api.spuCreate(this.formObj).then(res => {
              if (res) {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                })
                this.$router.push('/titanmall/goodsmain/goodsmanager')
              } else {
                this.getEdit(this.formObj)
                if (this.formObj.sku.length) {
                  this.$refs.skuRef.skuInfo(this.formObj)
                }
              }
            })
          }
        }
      },

      // 管理预约
      sourceClickBtn () {
        window.open(location.pathname + '#/titanmall/goodsmain/goodsmanager/sourcecomp')
      },

      /**
       * 联系电话格式化
       * obj [对象名称]
       * val [值]
       * index [下标]
       * */
      phoneInput (obj, val, index) {
        this[obj][val][index].value = this[obj][val][index].value.replace(/[^\d-]/g, '')
      },

      // 删除联系电话
      deletePhone (obj, index) {
        this[obj].phone.splice(index, 1)
      },
    },
    watch: {
      imgArr: {
        handler: function (n, o) {
          this.previewSrcList = []
          n.forEach(item => {
            let url = item.includes('http') ? item : this.imgCdn + item
            this.previewSrcList.push(url)
          })
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .z-edit {
    margin: 10px;
    overflow: scroll;
  }
  .top-nav {
    height: 40px;
    line-height: 40px;
    background: #d8d8d8;
    display: flex;
    justify-content: center;
    margin: 10px 0;

    .nav-left,
    .nav-right {
      flex-grow: 1;
      text-align: center;
    }

    .nav-left {
      color: #fff;
      background-color: #1c7bef;
      position: relative;

      &::after {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        right: -10px;
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        border-left: 10px solid #1c7bef;
        z-index: 1;
      }
    }

    .nav-right-bg {
      color: #fff;
      background-color: #1c7bef;
      position: relative;

      &::before {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        left: 3px;
        border-top: 20px solid #1c7bef;
        border-bottom: 20px solid #1c7bef;
        border-left: 10px solid #fff;
      }
    }
  }

  .form-label {
    .region {
      /deep/ .el-form-item .el-form-item__label {
        color: #999;
        padding: 0 12px 0 0!important;
      }

      .topImgBox {
        .titleImg {
          display: inline-block;
          width: 130px;
          height: 130px;
          border: 1px dashed #c0ccda;
          border-radius: 5px;
          margin-right: 10px;
          vertical-align: top;
          position: relative;

          /deep/ .el-image {
            width: 100%;
            height: 100%;
            overflow: initial;
          }

          &:hover .imgClose {
            display: inline;
          }

          .imgClose {
            color: #fff;
            position: absolute;
            background: #999;
            top: -6px;
            right: -6px;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            display: none;
          }
        }

        /deep/ .el-upload-list {
          display: none;
        }

        /deep/ .up-image {
          float: left;

          .add-img {
            width: 130px;
            height: 130px;
            line-height: 130px;
          }
        }
      }

      .kc-row {
        margin-bottom: 12px;
      }
    }

    margin-bottom: 100px;
  }

  .btn-box {
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 10px;
    right: 10px;
    padding: 20px 23px;
    z-index: 1;
  }

  .p-info {
    margin-top: 10px;
    // height: 35px;
    // line-height: 35px;
    & > .span-color {
      display: inline-block;
      width: 69px;
      text-align: right;
    }

    .span-tip {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }

    .info-link {
      margin-left: 10px;
    }

    .reward {
      width: 475px;
      vertical-align: middle;
    }

    .grouping-btn {
      margin-left: 15px;
      font-size: 12px;
    }

    .source-select {
      margin-left: 35px;
      width: 300px;
    }
  }

  .span-position {
    position: relative;
    bottom: 8px;
  }

  .yf-tip {
    margin-left: 10px;
    font-size: 12px;
    color: #999;
    line-height: 14px;
  }

  .form-bottom {
    margin-bottom: 0;
  }

  .icon-tip {
    margin-left: 10px;
    width: 14px;
    height: 14px;
    color: #ccc;
  }

  .hxj-shili {
    font-size: 12px;
    margin-left: 5px;
  }

  .a-link {
    margin-right: 20px;
  }

  .default-span {
    display: inline-block;
    width: 43px;
  }

  .dialogSearch {
    margin-bottom: 12px;
  }

  .fws-btn {
    margin: 20px 0 20px 80px;
  }

  .ggz {
    display: inline-block;
    margin-right: 10px;
    width: 140px;
    position: relative;

    &:hover .ggz-icon {
      display: inline-block;
    }

    .ggz-icon {
      display: none;
      position: absolute;
      top: -5px;
      right: -7px;
      cursor: pointer;
      color: #ccc;

      &:hover {
        color: #000;
      }
    }

    .gg-img {
      margin-top: 10px;
    }
  }

  .quill-box {
    display: flex;
    justify-content: space-around;
    margin: 20px 0 60px;
    padding: 20px 0;
    min-height: 100px;

    .quill-text {
      width: 40%;

      p {
        background: #e5e5e5;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
      }

      div {
        background: #f9f9f9;
        min-height: 100px;
        padding: 20px;
      }

      .img-wd {
        width: 100px;
      }
    }

    .quill {
      width: 40%;
      background: #fff;
    }
  }

  .lf {
    float: left;
  }

  .left-wd {
    margin-left: 84px;
  }

  .err-input {
    border: 1px solid red;
  }
</style>
