<template>
  <div id="addopen">
    <el-row class="header" :class="{line: showAdd, pb20: showAdd}">
      <el-col :span="12">
        <strong>{{title}}</strong>
      </el-col>
      <el-col :span="12" align="right">
        <a href="javascript:void(0)" class="blue" v-if="false">调用{{visitText}}模版</a>
        <a href="javascript:void(0)" class="gray ml20" @click="showAddEvent">{{showAdd ? '收起' : '展开'}}</a>
      </el-col>
    </el-row>
    <el-row v-if="!service" class="service-box">
      <el-col :span="24">
        <service-select v-model="service" placement="top-start" placeholder="请输入药品、检查、检验，治疗，手术" :scene="scene" :providerId="baseInfo.providerId"></service-select>
      </el-col>
    </el-row>
    <div class="add-body" :class="{hide: !showAdd, h180: !!service}">
      <el-form name="western" v-ever-bind-enter ref="openform" :model="westernData" label-width="0"
       v-if="service && (service.serviceClassification === '301' || service.serviceClassification === '302')">
        <table width="100%" cellpadding="0" cellspacing="0" class="western">
          <thead>
            <tr>
              <th width="15%" align="left">{{visitText}}名称</th>
              <th :width="colWidth" align="left">剂量</th>
              <th :width="colWidth" align="left">用法</th>
              <th :width="colWidth" align="left">用药频次</th>
              <th :width="colWidth" align="left" v-if="visitType===1 && !isAddTpl">天数</th>
              <th :width="colWidth" align="left">{{visitType===2 ? '单次数量' : '数量'}}</th>
              <th width="10%" align="left" v-if="visitType===2 && !isAddTpl && !baseInfo.areaId">开始时间</th>
              <th width="10%" align="left" v-if="visitType===2 && !isAddTpl && !baseInfo.areaId">结束时间</th>
              <th align="left">{{visitType === 2 ? '嘱托' : '备注'}}</th>
              <th :width="colWidth" align="left" v-if="!isAddTpl && !baseInfo.areaId">渠道</th>
              <th :width="colWidth" align="center" v-if="!isAddTpl">金额</th>
              <th width="6%" align="left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item, i in westernData.list" :key="i">
              <td class="pr10">
                <el-form-item :prop="'list.' + i + '.serviceItem'" :rules="rules.requiredItem">
                  <service-select
                    v-model="item.serviceItem"
                    placeholder=""
                    :type="service.serviceClassification"
                    :scene="scene"
                    :providerId="baseInfo.providerId"
                    @change="val => {changeServiceItem(val, i, checkShareInfo)}"
                    @clear="() => {clearServiceItem(service.serviceClassification, i)}">
                    </service-select>
                  <template v-if="!isAddTpl && item.serviceItem && !item.isEntrust">
                      <label class="el-form-item__error" v-if="item.allotNum ===0 || item.allotNum - item.count < 0">警告：库存不足</label>
                      <label class="el-form-item__info" v-else>库存 {{item.allotNum}} {{item.countUnit || '片'}}</label>
                  </template>
                </el-form-item>
              </td>
              <td class="pr10">
                <el-form-item :prop="'list.' + i + '.measure'" :rules="rules.requiredFloat">
                  <el-input type="text" :max="999" :maxlength="8" placeholder="" v-model.number="item.measure" @change="(val) => {computeCount(val, i)}">
                    <div style="width: 20px;" slot="append">{{item.measureUnitName || 'mg'}}</div>
                  </el-input>
                </el-form-item>
              </td>
              <td class="pr10">
                <el-form-item :prop="'list.' + i + '.employ'" :rules="rules.required">
                  <sys-type
                    code="CV06.00.102"
                    placeholder=""
                    :filterable="true"
                    :clearable="true"
                    :cache="true"
                    v-model="item.employ">
                  </sys-type>
                </el-form-item>
              </td>
              <td class="pr10">
                <el-form-item :prop="'list.' + i + '.useFreq'" :rules="rules.required">
                  <sys-type
                    code="CV06.00.228"
                    placeholder=""
                    :filterable="true"
                    :clearable="true"
                    :cache="true"
                    @change="(val) => {computeCount(val, i); setEntrust(val, i)}"
                    v-model="item.useFreq">
                  </sys-type>
                </el-form-item>
              </td>
              <td class="pr10" v-if="visitType===1 && !isAddTpl">
                <el-form-item :prop="'list.' + i + '.totalUseDay'" :rules="rules.requiredNumber">
                  <el-input type="text" :max="999" :maxlength="3" placeholder="" v-model.number="item.totalUseDay" @change="(val) => {computeCount(val, i)}">
                    <label style="width: 20px;" slot="append">天</label>
                  </el-input>
                </el-form-item>
              </td>
              <td class="pr10">
                <el-form-item :prop="'list.' + i + '.count'" :rules="item.isEntrust ? rules.requiredCount : rules.requiredIntCount">
                  <el-input type="text" :maxlength="8" placeholder="" v-model.number="item.count">
                    <el-select slot="append" placeholder="单位" v-model="item.unitGroupItem" value-key="id" v-if="item.serviceItem && item.serviceItem.localObject && isAddTpl" style="width:65px" @change="(val) => {setCountUnit(val, i)}">
                      <el-option v-for="(opt, i) in item.serviceItem.localObject.unitGroupItemList" :key="i" :label="opt.name" :value="opt"></el-option>
                    </el-select>
                    <label style="width: 20px;" slot="append" v-else>{{item.countUnit || '片'}}</label>
                  </el-input>
                </el-form-item>
              </td>
              <td class="pr10" v-if="visitType===2 && !isAddTpl && !baseInfo.areaId">
                <el-form-item>
                  <el-date-picker
                    :disabled="!getTermType(item.useFreq)"
                    v-model="item.startTime"
                    type="datetime"
                    :picker-options="pickerOptions"
                    placeholder="开始时间">
                  </el-date-picker>
                </el-form-item>
              </td>
              <td class="pr10" v-if="visitType===2 && !isAddTpl && !baseInfo.areaId">
                <el-form-item>
                  <el-date-picker
                    :disabled="!getTermType(item.useFreq)"
                    v-model="item.endTime"
                    type="datetime"
                    placeholder="结束时间">
                  </el-date-picker>
                </el-form-item>
              </td>
              <td class="pr10">
                <el-form-item>
                  <el-input placeholder="" v-model="item.entrust" :maxlength="200"></el-input>
                </el-form-item>
              </td>
              <td align="center" v-if="!isAddTpl && !baseInfo.areaId">
                <el-form-item :prop="'list.' + i + '.source'" :rules="rules.required">
                  <sys-type
                    code="THC_SYS_PRESCRIPTION_SOURCE"
                    placeholder="渠道"
                    :clearable="true"
                    :cache="true"
                    @change="val => {changeSource(val, i)}"
                    v-model="item.source">
                  </sys-type>
                </el-form-item>
              </td>
              <td align="center" v-if="!isAddTpl">
                <el-form-item>
                  ¥ {{item.serviceItem && item.serviceItem.price && item.count ? (item.serviceItem.price * item.count).toFixed(2) : '0.00'}}
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <el-button type="text" class="iconfont icon-tianjia blue" v-if="i === westernData.list.length-1" @click="() => {addSubService(i)}"></el-button>
                  <i class="iconfont icon-delete" @click="() => {delSubService(i)}" style="color: #999"></i>
                </el-form-item>
              </td>
            </tr>
          </tbody>
        </table>
      </el-form>
      <el-form name="chi" ref="openform" :model="chiData" label-width="0"
       v-if="service && (service.serviceClassification === '303' || service.serviceClassification === '304')">
        <table cellpadding="0" cellspacing="0" class="western" v-ever-bind-enter>
          <thead>
          <tr>
            <th align="left">{{visitText}}名称</th>
            <th width="15%" align="left">剂量</th>
            <th width="15%" align="left">煎法</th>
            <th width="15%" align="center" v-if="!isAddTpl">金额</th>
            <th width="6%" align="right"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in chiData.drugList" :key="i">
            <td class="pr10">
              <el-form-item :prop="'drugList.' + i + '.serviceItem'" :rules="rules.requiredChiItem">
                  <service-select
                    v-model="item.serviceItem"
                    placeholder=""
                    :type="service.serviceClassification"
                    :scene="scene"
                    :providerId="baseInfo.providerId"
                    @change="val => {changeServiceItem(val, i)}"
                    @clear="() => {clearServiceItem(service.serviceClassification, i)}">
                    </service-select>
                  <template v-if="!isAddTpl && item.serviceItem">
                    <label class="el-form-item__error" v-if="item.allotNum === 0 || item.allotNum - item.amount < 0">警告：库存不足</label>
                    <label class="el-form-item__info" v-else>库存：{{item.allotNum}} {{item.amountUnitTxt}}</label>
                  </template>
              </el-form-item>
            </td>
            <td class="pr10">
              <el-form-item :prop="'drugList.' + i + '.amount'" :rules="rules.requiredCountChi">
                <el-input type="number" :max="999" :maxlength="8" placeholder="" v-model.number="item.amount">
                  <label slot="append">{{item.amountUnitTxt}}</label>
                </el-input>
              </el-form-item>
            </td>
            <td class="pr10">
              <el-form-item>
                <sys-type
                  code="THC_SYS_DECOCTINGMETHOD"
                  placeholder="煎法"
                  :filterable="true"
                  :clearable="true"
                  :cache="true"
                  v-model="item.decoction">
                </sys-type>
              </el-form-item>
            </td>
            <td class="pr10" align="center" v-if="!isAddTpl">
              <el-form-item>
                ¥ {{item.serviceItem && item.serviceItem.price && item.amount ? (item.serviceItem.price / item.drugRatio * item.amount).toFixed(2) : '0.00'}}
              </el-form-item>
            </td>
            <td>
              <el-form-item>
                <el-button type="text" class="blue iconfont icon-tianjia ever-enter-focus" @click="() => {addChiSubService(i)}" v-if="i === chiData.drugList.length-1">
                </el-button>
                <i class="iconfont icon-delete" @click="delChiSubService(i)"></i>
              </el-form-item>
            </td>
          </tr>
          </tbody>
        </table>
        <el-form v-ever-bind-enter ref="chiform" class="chi-form" :model="chiData">
          <el-row :gutter="10">
            <el-col :span="visitType === 1 ? 6 : 4">
              <el-form-item label="用法" label-width="80px" class="wb100" prop="employ" :rules="rules.required">
                <sys-type
                  code="CV06.00.102"
                  placeholder="用法"
                  :filterable="true"
                  :clearable="true"
                  :cache="true"
                  v-model="chiData.employ">
                </sys-type>
              </el-form-item>
            </el-col>
            <el-col :span="visitType === 1 ? 6 : 4">
              <el-form-item label="频次" label-width="80px" class="wb100" prop="useFreq" :rules="rules.required">
                <sys-type
                  code="CV06.00.228"
                  placeholder="频次"
                  :filterable="true"
                  :clearable="true"
                  :cache="true"
                  @change="setEntrust"
                  v-model="chiData.useFreq">
                </sys-type>
            </el-form-item>
            </el-col>
            <el-col :span="visitType === 1 ? 6 : 4">
              <el-form-item label="剂数" label-width="80px" class="wb100" prop="count" :rules="rules.requiredNumber">
                <el-input-number class="wb96" v-model.number="chiData.count" :min="1" :max="999"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="visitType === 1 ? 6 : 4">
              <el-form-item label="渠道" label-width="80px" class="wb100">
                <sys-type
                  code="THC_SYS_PRESCRIPTION_SOURCE"
                  placeholder="渠道"
                  :clearable="true"
                  :cache="true"
                  @change="val => {changeChiSorce(val)}"
                  v-model="chiData.source">
                </sys-type>
              </el-form-item>
            </el-col>
            <el-col :span="visitType === 1 ? 6 : 4">
              <el-form-item label="备注" label-width="80px" class="wb100">
                <el-input placeholder="填写备注" v-model="chiData.entrust" :maxlength="200"></el-input>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row :gutter="10">
            <el-col :span="visitType === 1 ? 6 : 4" v-if="!isAddTpl && visitType===2 && !baseInfo.areaId">
              <el-form-item label="开始时间" label-width="80px" class="wb100">
                <el-date-picker
                  :disabled="!getTermType(chiData.useFreq)"
                  v-model="chiData.startTime"
                  type="datetime"
                  :picker-options="pickerOptions"
                  placeholder="开始时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="visitType === 1 ? 6 : 4" v-if="!isAddTpl && visitType===2 && !baseInfo.areaId">
              <el-form-item label="结束时间" label-width="80px" class="wb100">
                <el-date-picker
                  :disabled="!getTermType(chiData.useFreq)"
                  v-model="chiData.endTime"
                  type="datetime"
                  placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="visitType === 1 ? 6 : 4">
              <el-form-item label-width="0" class="ml20" v-if="service.serviceClassification === '303'">
                <el-checkbox v-model="chiData.decoct" v-if="!chiData.isEntrust">代煎</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="visitType === 1 ? 12 : 8" v-if="!isAddTpl">
              <el-form-item label="总金额" label-width="80px">
                <span class="total-price">￥ {{chiTotalPrice ? chiTotalPrice.toFixed(2) : '0.00'}}</span>
                <label style="font-size:14px;color:#666666;margin-left:10px;" v-if="chiData.decoct">(含代煎费{{(chiData.decoctPrice * chiData.count).toFixed(2)}}元)</label>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-form>
      <el-form name="inspect" v-ever-bind-enter ref="openform" :model="inspectData" label-width="0" v-if="service && service.serviceClassification === '800'">
        <table width="100%" cellpadding="0" cellspacing="0" class="inspect">
          <tr>
            <th width="27%">{{visitText}}名称</th>
            <th width="14%" v-if="visitType===2">频次</th>
            <th width="10%" v-if="!isAddTpl && visitType===2 && !baseInfo.areaId">开始时间</th>
            <th width="10%" v-if="!isAddTpl && visitType===2 && !baseInfo.areaId">结束时间</th>
            <th width="14%">部位</th>
            <th>{{visitType===2 ? '嘱托' : '备注'}}</th>
            <th width="7%" align="center" v-if="!isAddTpl">金额</th>
            <th width="5%" class="left"></th>
          </tr>
          <tr>
            <td class="pr10">
              <el-form-item prop='serviceItem' :rules="rules.requiredObject">
                <service-select
                  v-model="inspectData.serviceItem"
                  placeholder=""
                  :type="service.serviceClassification"
                  :scene="scene"
                  :providerId="baseInfo.providerId"
                  @change="val => {changeServiceItem(val)}"
                  @clear="() => {clearServiceItem(service.serviceClassification)}">
                  </service-select>
              </el-form-item>
            </td>
            <td class="pr10" v-if="visitType===2">
              <el-form-item prop='useFreq' :rules="rules.required">
                <sys-type
                  code="CV06.00.228"
                  placeholder="频次"
                  :filterable="true"
                  :clearable="true"
                  :cache="true"
                  :filterid="baseInfo.areaId ? ['1590'] : false"
                  v-model="inspectData.useFreq">
                </sys-type>
              </el-form-item>
            </td>
            <td class="pr10" v-if="!isAddTpl && visitType===2 && !baseInfo.areaId">
              <el-form-item>
                <el-date-picker
                  :disabled="!getTermType(inspectData.useFreq)"
                  v-model="inspectData.startTime"
                  type="datetime"
                  :picker-options="pickerOptions"
                  placeholder="开始时间">
                </el-date-picker>
              </el-form-item>
            </td>
            <td class="pr10" v-if="!isAddTpl && visitType===2 && !baseInfo.areaId">
              <el-form-item>
                <el-date-picker
                  :disabled="!getTermType(inspectData.useFreq)"
                  v-model="inspectData.endTime"
                  type="datetime"
                  placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </td>
            <td class="pr10">
              <el-form-item>
                <el-input placeholder="部位" v-model="inspectData.position"></el-input>
              </el-form-item>
            </td>
            <td class="pr10">
              <el-form-item>
                <el-input placeholder="请填写内容" v-model="inspectData.entrust" :maxlength="200"></el-input>
              </el-form-item>
            </td>
            <td class="pr10" align="center" v-if="!isAddTpl">
              <el-form-item>
                ¥ {{inspectData.serviceItem && inspectData.serviceItem.price && inspectData.count ? (inspectData.serviceItem.price * inspectData.count).toFixed(2) : '0.00'}}
              </el-form-item>
            </td>
            <td>
              <el-form-item>
                <i class="iconfont icon-delete" @click="clearService"></i>
              </el-form-item>
            </td>
          </tr>
        </table>
        <el-row>
          <el-col :lg="6" :xs="12" class="pr10">
            <h4>病史摘要</h4>
            <el-form-item :xs="12">
              <el-input placeholder="病史摘要" v-model="inspectData.illHis":maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <h4>临床检查</h4>
            <el-form-item>
              <el-input placeholder="临床检查" v-model="inspectData.clinicalExamine" :maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <h4>{{visitType===2 ? '辅助检查' : '检查结果'}}</h4>
            <el-form-item>
              <el-input :placeholder="visitType===2 ? '辅助检查' : '检查结果'" v-model="inspectData.assistExamine" :maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10" v-if="visitType===2">
            <h4>临床诊断</h4>
            <el-form-item>
              <el-input placeholder="临床诊断" v-model="inspectData.otherExamine" :maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form name="surgery" v-ever-bind-enter ref="openform" :model="surgeryData" label-widht="80px" label-position="top" v-if="service && service.serviceClassification === '2125'">
        <el-row :gutter="0">
          <el-col :span="24" align="right"><i class="iconfont icon-delete" @click="clearService"></i></el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <el-form-item :label="visitText + '名称'" prop='serviceItem' :rules="rules.requiredObject">
              <service-select
                v-model="surgeryData.serviceItem"
                placeholder=""
                :type="service.serviceClassification"
                :scene="scene"
                :providerId="baseInfo.providerId"
                @change="val => {changeServiceItem(val)}"
                @clear="() => {clearServiceItem(service.serviceClassification)}">
                </service-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <el-form-item label="手术名称">
              <!-- <el-input :maxlength="50" v-model="surgeryData.surgeryFreq"></el-input> -->
              <el-select
                v-model="surgeryData.surgeryFreq"
                clearable
                filterable
                remote
                placeholder="请输入关键词"
                value-key="id"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="selectSurgery">
                <el-option
                  v-for="item in surgeryOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <el-form-item label="手术部位">
              <el-select
                v-model="surgeryData.position"
                clearable
                value-key="id"
                placeholder="请选择">
                <el-option
                  v-for="item in positionOption"
                  :key="item.id"
                  :label="item.position"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <el-form-item label="麻醉方式">
              <sys-type
                code="CV06.00.103"
                placeholder="麻醉方式"
                :clearable="true"
                :useObject="true"
                :cache="true"
                v-model="surgeryData.anaesthesia">
              </sys-type>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <el-form-item label="手术医生">
              <el-select value-key="doctorId" multiple v-model="surgeryData.doctorItem">
                <el-option :key="i"  v-for="(item, i) in doctorOption" :value="item" :label="item.doctorName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <el-form-item label="助手">
              <el-select value-key="doctorId" multiple v-model="surgeryData.assistantItem">
                <el-option :key="i" v-for="(item, i) in doctorOption" :value="item" :label="item.doctorName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <el-form-item label="拟手术时间">
              <el-date-picker
                v-model="surgeryData.startTime"
                type="datetime"
                :picker-options="pickerOptions"
                placeholder="拟手术时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :xs="12" class="pr10">
            <el-form-item label="嘱托">
              <el-input :maxlength="100" v-model="surgeryData.entrust"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form name="item" v-ever-bind-enter ref="openform" :model="itemData" label-width="0" v-if="service && isItemType(service.serviceClassification)">
        <table width="100%" cellpadding="0" cellspacing="0" class="western" v-if="service.serviceClassification === '2124'">
          <thead>
            <tr>
              <th width="25%" align="left">{{visitText}}名称</th>
              <th width="25%" align="left">频次</th>
              <th align="left">{{visitType === 1 ? '备注' : '嘱托'}}</th>
              <th width="7%" align="right"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="pr10">
                <el-form-item prop='serviceItem' :rules="rules.requiredObject">
                  <service-select
                    v-model="itemData.serviceItem"
                    placeholder=""
                    :type="service.serviceClassification"
                    :scene="scene"
                    :providerId="baseInfo.providerId"
                    @change="val => {changeServiceItem(val)}"
                    @clear="() => {clearServiceItem(service.serviceClassification)}">
                    </service-select>
                </el-form-item>
              </td>
              <td class="pr10">
                <el-form-item prop="useFreq" :rules="rules.required">
                  <sys-type
                    code="CV06.00.228"
                    placeholder="频次"
                    :filterable="true"
                    :clearable="true"
                    :cache="true"
                    :filterid="baseInfo.areaId ? ['1590'] : false"
                    v-model="itemData.useFreq">
                  </sys-type>
                </el-form-item>
              </td>
              <td class="pr10">
                <el-form-item>
                  <el-input placeholder="请填写内容" v-model="itemData.entrust" :maxlength="200"></el-input>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <i class="iconfont icon-delete" @click="clearService"></i>
                </el-form-item>
              </td>
            </tr>
          </tbody>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" class="western" v-else>
          <thead>
          <tr>
            <th width="21%" align="left">{{visitText}}名称</th>
            <th :width="colWidth" align="left" v-if="(visitType === 1 && service.serviceClassification !== '801' ) || ['299', '300', '867'].includes(service.serviceClassification)">数量</th>
            <th :width="colWidth" align="left" v-if="visitType === 2 && !baseInfo.areaId">频次</th>
            <th width="10%" align="left" v-if="!isAddTpl && visitType === 2 && !baseInfo.areaId">开始时间</th>
            <th width="10%" align="left" v-if="!isAddTpl && visitType === 2 && !baseInfo.areaId">结束时间</th>
            <th align="left">{{visitType===1 ? '备注' : '嘱托'}}</th>
            <th width="10%" align="center" v-if="!isAddTpl">金额</th>
            <th width="7%" align="left"></th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="pr10">
              <el-form-item prop='serviceItem' :rules="['299', '300'].includes(service.serviceClassification) && !isAddTpl ? rules.requiredObject : rules.requiredItem">
                <service-select
                  v-model="itemData.serviceItem"
                  placeholder=""
                  :type="service.serviceClassification"
                  :scene="scene"
                  :providerId="baseInfo.providerId"
                  @change="val => {changeServiceItem(val)}"
                  @clear="() => {clearServiceItem(service.serviceClassification)}">
                </service-select>
                <template v-if="!isAddTpl && itemData.serviceItem && ['299', '300'].includes(itemData.serviceItem.serviceClassification)">
                  <label class="el-form-item__error" v-if="itemData.allotNum === 0 || itemData.allotNum - itemData.count < 0">警告：库存不足</label>
                  <label class="el-form-item__info" v-else>库存：{{itemData.allotNum}}{{getCountUnitText(itemData.serviceItem)}}</label>
                </template>
              </el-form-item>
            </td>
            <td class="pr10" v-if="(visitType === 1 && service.serviceClassification !== '801' ) || ['299', '300', '867'].includes(service.serviceClassification)">
              <el-form-item prop="count" :rules="['299', '300'].includes(service.serviceClassification) ? rules.requiredCount : rules.requiredFloat">
                <el-input placeholder="数量" v-model.number="itemData.count" :disabled="service.serviceClassification === '2124'">
                  <label slot="append">{{getCountUnitText(itemData.serviceItem)}}</label>
                </el-input>
              </el-form-item>
            </td>
            <td class="pr10" v-if="visitType === 2 && !baseInfo.areaId">
              <el-form-item prop="useFreq" :rules="rules.required">
                <sys-type
                  code="CV06.00.228"
                  placeholder="频次"
                  :filterable="true"
                  :clearable="true"
                  :cache="true"
                  :filterid="baseInfo.areaId ? ['1590'] : false"
                  v-model="itemData.useFreq"
                  @change="val => {setEntrust(val, 0)}">
                </sys-type>
              </el-form-item>
            </td>
            <td class="pr10" v-if="!isAddTpl && visitType === 2 && !baseInfo.areaId">
              <el-form-item>
                <el-date-picker
                  :disabled="!getTermType(itemData.useFreq)"
                  v-model="itemData.startTime"
                  type="datetime"
                  :picker-options="pickerOptions"
                  placeholder="开始时间">
                </el-date-picker>
              </el-form-item>
            </td>
            <td class="pr10" v-if="!isAddTpl && visitType === 2 && !baseInfo.areaId">
              <el-form-item>
                <el-date-picker
                  :disabled="!getTermType(itemData.useFreq)"
                  v-model="itemData.endTime"
                  type="datetime"
                  placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
            </td>
            <td class="pr10">
              <el-form-item>
                <el-input placeholder="请填写内容" v-model="itemData.entrust" :maxlength="200"></el-input>
              </el-form-item>
            </td>
            <td class="pr10" align="center" v-if="!isAddTpl">
              <el-form-item>
                <span v-if="visitType === 1 || ['299', '300'].includes(itemData.adviceType)">¥ {{itemData.serviceItem.price && itemData.count ? (itemData.serviceItem.price * itemData.count).toFixed(2) : '0.00'}}</span>
                <span v-else>¥ {{itemData.serviceItem.price ? itemData.serviceItem.price.toFixed(2) : '0.00'}}</span>
              </el-form-item>
            </td>
            <td align="left">
              <el-form-item>
                <i class="iconfont icon-delete" @click="clearService"></i>
              </el-form-item>
            </td>
          </tr>
          </tbody>
        </table>
      </el-form>
    </div>
    <el-row class="add-footer" :class="{hide: !showAdd}" v-ctrl-enter>
      <el-col :span="20">
        <el-alert
          v-if="showAlert"
          :title='"警告：" + showAlertMsg + "，此药品将影响医保报销。"'
          show-icon
          type="warning">
        </el-alert>
        <span v-else>&nbsp;</span>
      </el-col>
      <el-col :span="4" align="right">
        <el-button type="primary" @click="submitEvent" class="ctrlenter">确认</el-button>
      </el-col>
    </el-row>
    <sys-type style="display: none;" code="THC_WH_DOSE_UNIT" :cache="true"></sys-type>
    <sys-type style="display: none;" code="THC_SYS_DECOCTINGMETHOD" :cache="true"></sys-type>
    <el-dialog v-if="wringData[0]" :visible.sync="showCdss" :title="visitType === 1 ? '医嘱建议' : '处方建议'" size="tiny" class="ui_dialog_02" ref="cdssConfirm">
      <cdss1 :wringData="wringData"></cdss1>
      <div slot="footer" class="dialog-footer" style="position:relative;z-index: 10">
        <el-button @click="closeCdssEvent"><i class="icon iconfont icon-quxiao"></i>修改{{visitText}}</el-button>
        <el-button type="primary" @click="confirmCdssSubmit"><i class="icon iconfont icon-tijiao"></i>确认提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import medicalapi from '@/workspace/store/medicalapi'
  import indepartapi from '@/inpatient/store/indepartapi'
  import phrapi from '@/inpatient/store/phr'
  import storage from '@/util/storage'
  import cdss1 from '@/workspace/components/cdss1'
  export default {
    props: ['title', 'showAdd', 'visitType', 'initData', 'callbackData', 'userInfo', 'isAddTpl', 'shareInfo', 'shareTime', 'results', 'appoint'],
    data () {
      // 是否开具相同西药验证
      let checkWestEcho = (rule, value, callback) => {
        if (!value) {
          callback()
          return false
        }
        let obj = this.westernData.list.filter(v => {
          return v.serviceItem.id === value.id
        })
        if (obj.length > 1) {
          callback(new Error('此药品已存在'))
          return false
        }
        callback()
      }
      // 是否开具相同中药验证
      let checkChiEcho = (rule, value, callback) => {
        if (!value) {
          callback()
          return false
        }
        let obj = this.chiData.drugList.filter(v => {
          return v.serviceItem.id === value.id
        })
        if (obj.length > 1) {
          callback(new Error('此药品已存在'))
          return false
        }
        callback()
      }
      // 数量改变重新验证库存是否满足
      let checkCountToStock = (rule, value, callback) => {
        // let index = parseInt(rule.field.split('.')[1])
        if (!/^\d+(\.\d+)?$/.test(value)) {
          callback(new Error('请输入正确的数值'))
          return false
        }
        if (!this.service) {
          callback()
          return false
        }
        callback()
      }
      return {
        medicalapi,
        indepartapi,
        phrapi,
        storage,
        service: '',
        decoctPrice: 0,
        baseInfo: this.userInfo || this.$route.query,
        showCdss: false,
        cdssConfirm: false,
        showAlert: false,
        showAlertMsg: '',
        loading: false,
        isMedicalInsurance: 1,
        wringData: [],
        waitSendData: this.initData || [],
        westernData: {list: []},
        itemData: {
          serviceItem: '',
          count: 1,
          countUnitId: 1,
          countUnit: 1,
          termType: 0,
          isEntrust: '',
          source: '533',
          useFreq: '',
          startTime: this.$moment(),
          endTime: '',
          entrust: '',
          allotNum: 0,
          pirce: 0
        },
        inspectData: {
          serviceItem: '',
          count: 1,
          countUnitId: '',
          countUnit: '',
          useFreq: '',
          termType: 0,
          entrust: '',
          position: '',
          illHis: '',
          clinicalExamine: '',
          otherExamine: '',
          assistExamine: '',
          startTime: this.$moment(),
          endTime: '',
          pirce: 0
        },
        surgeryData: {
          serviceItem: '',
          count: 1,
          countUnitId: '',
          countUnit: '',
          termType: 0,
          doctorItem: [],
          assistantItem: [],
          surgeryFreq: '',
          anaesthesia: '',
          startTime: this.$moment(),
          position: '',
          entrust: '',
          pirce: 0
        },
        chiData: {
          decoct: 0,
          employ: '',
          useFreq: '',
          count: 1,
          source: '533',
          entrust: '',
          price: 0,
          termType: 0,
          isEntrust: '',
          startTime: this.$moment(),
          endTime: '',
          drugList: [],
          decoctPrice: 0
        },
        doctorOption: [],
        surgeryOption: [],
        positionOption: [],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        },
        rules: {
          required: [
            {required: true, message: '必填项', trigger: ['blur', 'change']}
          ],
          requiredCountChi: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'number'},
            {message: '数量为0.1-999', trigger: ['blur', 'change'], min: 0.1, max: 999, type: 'number'},
            {validator: checkCountToStock, trigger: 'change'}
          ],
          requiredCount: [
            {required: true, message: '数量为0-999', trigger: ['blur', 'change'], type: 'number'},
            {message: '数量为0-999', trigger: ['blur', 'change'], min: 0, max: 999, type: 'number'},
            {validator: checkCountToStock, trigger: 'change'}
          ],
          requiredIntCount: [
            {required: true, message: '数量为1-999', trigger: ['blur', 'change'], type: 'number'},
            {message: '数量为1-999', trigger: ['blur', 'change'], min: 1, max: 999, type: 'number'},
            {validator: checkCountToStock, trigger: 'change'}
          ],
          requiredItem: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object'},
            {validator: checkWestEcho, trigger: 'change'}
          ],
          requiredChiItem: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object'},
            {validator: checkChiEcho, trigger: 'change'}
          ],
          requiredNumber: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'number'}
          ],
          requiredFloat: [
            {validator: checkCountToStock, trigger: ['blur', 'change']}
          ],
          requiredObject: [{required: true, message: '必填项', trigger: ['blur', 'change'], type: 'object'}]
        },
        scene: this.visitType === 2 ? 3 : 1,
        visitText: this.visitType === 2 ? '医嘱' : '项目',
        colWidth: this.visitType === 2 && !this.isAddTpl ? '6%' : '10%'
      }
    },
    created () {
      this.baseInfo.visitType = this.visitType // 初始化设置医嘱类型为住院，1 门诊 2住院
      if (this.baseInfo.areaId) {
        this.visitText = '费用'
      }
      // 获取部门下的医生
      this.indepartapi.providerdoctor({providerId: this.baseInfo.providerId}).then(rs => {
        this.doctorOption = rs.data
      })
      this.initChiData()
      this.setChiDecoctPrice()
    },
    watch: {
      'initData': {
        handler (val) {
          this.waitSendData = val
        },
        deep: true
      },
      // 发送医嘱区域总service监听，通过service的不通类型显示不同的表单
      'service' (val) {
        if (!val) {
          this.itemData.serviceItem = ''
          this.inspectData.serviceItem = ''
          this.surgeryData.serviceItem = ''
          this.showAlert = false
          return false
        }
        delete val.echo
        if (['301', '302'].includes(val.serviceClassification) && !this.westernData.list[0]) {
          this.westernData.list.push({
            isMain: 1,
            serviceItem: val,
            employ: '',
            useFreq: '',
            measure: '',
            measureUnit: '',
            measureUnitName: '',
            count: '',
            countUnitId: '',
            countUnit: '',
            unitGroupItem: '',
            totalUseDay: '',
            entrust: '',
            source: '533',
            termType: 0,
            isEntrust: 0,
            startTime: this.$moment(),
            endTime: '',
            groupId: new Date().getTime(),
            itemId: new Date().getTime(),
            allotNum: 0
          })
          this.changeServiceItem(val, 0, this.checkShareInfo)
        }
        if (['303', '304'].includes(val.serviceClassification) && !this.chiData.drugList[0]) {
          this.chiData.drugList.push({
            serviceItem: val,
            amount: '',
            amountUnit: '',
            amountUnitTxt: '',
            decoction: '',
            decoctionText: '',
            entrust: '',
            unitName: '',
            drugRatio: '',
            itemId: new Date().getTime(),
            allotNum: 0
          })
          this.chiData.drugList.map((item, i) => {
            this.changeServiceItem(item.serviceItem, i)
          })
        }
        if (val.serviceClassification === '800' && !this.inspectData.serviceItem) {
          this.inspectData = {
            serviceItem: val,
            count: 1,
            countUnitId: val.unit,
            countUnit: val.unitName,
            useFreq: '',
            termType: 0,
            entrust: '',
            position: '',
            illHis: '',
            clinicalExamine: '',
            otherExamine: '',
            assistExamine: '',
            startTime: this.$moment(),
            endTime: '',
            pirce: val.price
          }
        }
        if (val.serviceClassification === '2125' && !this.surgeryData.serviceItem) {
          this.surgeryData = {
            serviceItem: val,
            count: 1,
            countUnitId: val.unit,
            countUnit: val.unitName,
            termType: 0,
            doctorItem: [],
            assistantItem: [],
            surgeryFreq: '',
            anaesthesia: '',
            startTime: this.$moment(),
            position: '',
            entrust: '',
            pirce: val.price
          }
        }
        if (this.isItemType(val.serviceClassification) && !this.itemData.serviceItem) {
          this.itemData = {
            serviceItem: val,
            count: 1,
            countUnitId: val.unit,
            countUnit: val.unitName,
            termType: 0,
            isEntrust: '',
            useFreq: '',
            startTime: this.$moment(),
            endTime: '',
            entrust: '',
            source: '533',
            allotNum: 0,
            price: val.price
          }
          this.changeServiceItem(val, 0)
        }
        this.$nextTick(_ => {
          window.setTimeout(() => {
            this.$refs.openform.$el.querySelectorAll('input')[1].focus()
          }, 200)
        })
        this.$emit('open')
      },
      // 监听西药数据，如果数据集为空，则清空总service
      'westernData.list' (val) {
        if (!val[0]) {
          this.service = ''
        }
      },
      // 监听中药数据，如果数据集为空，则清空总service
      'chiData.drugList' (val) {
        if (!val[0]) {
          this.service = ''
        } else {
          val.map(v => {
            delete v.serviceItem.echo
            return v
          })
        }
      },
      'callbackData': {
        handler (items) {
          let _this = this
          if (!items || !items[0]) {
            return false
          }
          items.map((item, i) => {
            let _serviceItem = item.serviceItem && typeof item.serviceItem === 'string' ? JSON.parse(item.serviceItem, true) : item.serviceItem
            delete _serviceItem.echo
            if (['301', '302'].includes(_serviceItem.serviceClassification)) {
              this.westernData.list.push({
                isMain: i === 0 ? 1 : 2,
                itemId: new Date().getTime() + i,
                serviceItem: _serviceItem,
                count: item.count,
                entrust: item.entrust,
                employ: item.employ,
                useFreq: item.useFreq,
                measure: item.measure ? parseFloat(item.measure) : '',
                totalUseDay: item.totalUseDay,
                measureUnit: item.measureUnit,
                measureUnitName: item.measureUnitnName,
                countUnitId: item.countUnitId,
                countUnit: item.countUnit,
                unitGroupItem: {id: item.countUnitId, name: item.countUnit},
                termType: item.termType,
                source: item.source,
                isEntrust: item.isEntrust,
                startTime: item.startTime ? this.$moment(item.startTime) : '',
                endTime: item.endTime ? this.$moment(item.startTime) : '',
                groupId: item.adviceId
              })
              this.changeServiceItem(_serviceItem, i, function () {
                _this.westernData.list[i].employ = item.employ
                _this.westernData.list[i].useFreq = item.useFreq
                _this.westernData.list[i].measure = item.measure
              })
            }
            if (['303', '304'].includes(_serviceItem.serviceClassification)) {
              let _isEntrust = storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', item.source, 'value')
              this.chiData.employ = item.employ
              this.chiData.useFreq = item.useFreq
              this.chiData.count = item.count
              this.chiData.source = item.source
              this.chiData.entrust = item.entrust
              this.chiData.price = item.price
              // todo decoct 改为int型
              this.chiData.decoct = !!item.decoct
              this.chiData.decoctPrice = item.decoctPrice
              this.chiData.drugList = JSON.parse(item.adviceContent, true).map(v => {
                delete v.serviceItem.echo
                return v
              })
              this.chiData.termType = item.termType
              this.chiData.isEntrust = _isEntrust === '4' ? 1 : 0
              this.chiData.startTime = item.startTime ? this.$moment(item.startTime) : ''
              this.chiData.endTime = item.endTime ? this.$moment(item.startTime) : ''
              this.chiData.drugList.map((data, j) => {
                data.amount = data.amount ? parseFloat(data.amount) : ''
                this.changeServiceItem(data.serviceItem, j)
                return data
              })
            }
            if (_serviceItem.serviceClassification === '800') {
              let _content = JSON.parse(item.adviceContent, true)
              this.inspectData.serviceItem = _serviceItem
              this.inspectData.count = item.count
              this.inspectData.countUnitId = item.countUnitId || _serviceItem.unit
              this.inspectData.countUnit = item.countUnit || _serviceItem.unitName
              this.inspectData.useFreq = item.useFreq
              this.inspectData.termType = item.termType
              this.inspectData.entrust = item.entrust
              this.inspectData.position = _content.position
              this.inspectData.illHis = _content.illHis
              this.inspectData.clinicalExamine = _content.clinicalExamine
              this.inspectData.otherExamine = _content.otherExamine
              this.inspectData.assistExamine = _content.assistExamine
              this.inspectData.startTime = item.startTime ? this.$moment(item.startTime) : ''
              this.inspectData.endTime = item.endTime ? this.$moment(item.startTime) : ''
            }
            if (_serviceItem.serviceClassification === '2125') {
              let _content = JSON.parse(item.adviceContent, true)
              this.remoteMethod(_content.surgeryFreq.name)
              this.selectSurgery(_content.surgeryFreq)
              this.surgeryData.serviceItem = _serviceItem
              this.surgeryData.count = item.count
              this.surgeryData.countUnitId = item.countUnitId || _serviceItem.unit
              this.surgeryData.countUnit = item.countUnit || _serviceItem.unitName
              this.surgeryData.useFreq = item.useFreq
              this.surgeryData.termType = item.termType
              this.surgeryData.entrust = item.entrust
              this.surgeryData.startTime = item.startTime
              this.surgeryData.doctorItem = _content.doctorItem
              this.surgeryData.assistantItem = _content.assistantItem
              this.surgeryData.surgeryFreq = _content.surgeryFreq
              this.surgeryData.anaesthesia = _content.anaesthesia
              this.surgeryData.position = _content.position
            }
            if (this.isItemType(_serviceItem.serviceClassification)) {
              this.itemData.serviceItem = _serviceItem
              this.itemData.count = item.count
              this.itemData.countUnitId = item.countUnitId || _serviceItem.unit
              this.itemData.countUnit = item.countUnit || _serviceItem.unitName
              this.itemData.useFreq = item.useFreq || ''
              this.itemData.termType = item.termType
              this.itemData.isEntrust = item.isEntrust
              this.itemData.source = item.source
              this.itemData.entrust = item.entrust
              this.itemData.startTime = item.startTime ? this.$moment(item.startTime) : ''
              this.itemData.endTime = item.endTime ? this.$moment(item.startTime) : ''
              this.changeServiceItem(_serviceItem)
            }
            if (i === 0) {
              this.service = _serviceItem
            }
          })
        }
      }
    },
    methods: {
      // 初始化中药医嘱数据
      initChiData () {
        this.chiData = {
          decoct: 0,
          employ: '',
          useFreq: '',
          count: '',
          countUnit: '',
          source: '533',
          entrust: '',
          price: 0,
          termType: 0,
          isEntrust: '',
          startTime: this.$moment(),
          endTime: '',
          drugList: [],
          decoctPrice: 0
        }
      },
      // 添加西药子医嘱
      addSubService (index) {
        let western = this.westernData.list[index]
        if (this.visitType === 2 && !this.isAddTpl && western.allotNum - western.count < 0) {
          return false
        }
        this.$refs.openform.validate(valid => {
          if (valid) {
            this.westernData.list.push({
              isMain: 2,
              serviceItem: '',
              employ: this.westernData.list[0].employ,
              useFreq: this.westernData.list[0].useFreq,
              measure: '',
              measureUnit: '',
              measureUnitName: '',
              count: '',
              countUnitId: '',
              countUnit: '',
              unitGroupItem: '',
              totalUseDay: this.westernData.list[0].totalUseDay,
              entrust: '',
              source: '',
              termType: this.westernData.list[0].termType,
              isEntrust: this.westernData.list[0].isEntrust,
              startTime: this.westernData.list[0].startTime,
              endTime: this.westernData.list[0].endTime,
              groupId: this.westernData.list[0].groupId,
              itemId: new Date().getTime()
            })
            this.$nextTick(_ => {
              this.$refs.openform.$el.querySelectorAll('tr:last-child input')[0].focus()
            })
          }
        })
      },
      // 添加中药
      addChiSubService (index) {
        let chi = this.chiData.drugList[index]
        if (this.visitType === 2 && !this.isAddTpl && chi.allotNum - chi.amount < 0) {
          return false
        }
        this.$refs.openform.validate(valid => {
          if (valid) {
            this.chiData.drugList.push({
              serviceItem: '',
              amount: '',
              amountUnit: '',
              amountUnitTxt: 'g',
              decoction: '',
              decoctionText: '',
              entrust: '',
              unitName: '',
              drugRatio: '',
              allotNum: 0,
              itemId: new Date().getTime()
            })
            this.$nextTick(_ => {
              this.$refs.openform.$el.querySelectorAll('tr:last-child input')[0].focus()
            })
          }
        })
      },
      // 删除西药子医嘱
      delSubService (index) {
        if (index === 0) {
          this.westernData.list = []
        } else {
          this.westernData.list.splice(index, 1)
        }
      },
      // 删除中药
      delChiSubService (index) {
        this.chiData.drugList.splice(index, 1)
      },
      // 清空重置医嘱项目
      clearService () {
        this.service = ''
      },
      clearServiceItem (type, index) {
        if (['301', '302'].includes(type)) {
          this.westernData.list[index].useFreq = ''
          this.westernData.list[index].employ = ''
          this.westernData.list[index].measure = ''
          this.westernData.list[index].totalUseDay = ''
          this.westernData.list[index].entrust = ''
          this.westernData.list[index].count = ''
        }
        if (['303', '304'].includes(type)) {
          this.chiData.drugList[index].amount = ''
          this.chiData.drugList[index].decoction = ''
          this.chiData.drugList[index].measure = ''
          this.chiData.drugList[index].entrust = ''
        }
      },
      changeServiceItem (value, index, callback) {
        if (!value || !['299', '300', '301', '302', '303', '304'].includes(value.serviceClassification)) {
          return false
        }
        let western = this.westernData.list[index]
        let chi = this.chiData.drugList[index]
        if (!this.isAddTpl) {
          this.medicalapi.queryServiceStock({
            localMaterialId: value.localMaterialId,
            providerId: this.baseInfo.providerId,
            scene: this.scene
          }).then(rs => {
            if (western && ['301', '302'].includes(value.serviceClassification)) {
              western.measure = rs.drugObject.amount || ''
              western.weight = rs.drugObject.unit && rs.drugObject.content ? rs.drugObject.content : ''
              western.employ = rs.drugObject.useWay ? rs.drugObject.useWay.split(',')[0] : ''
              western.useFreq = rs.drugObject.frequency ? rs.drugObject.frequency : ''
              western.measureUnit = rs.drugObject.unit ? parseInt(rs.drugObject.unit) : rs.drugObject.preparationUnit
              western.measureUnitName = rs.drugObject.unit ? this.storage.getSysTypeText('THC_WH_DOSE_UNIT', parseInt(rs.drugObject.unit)) : rs.drugObject.preparationUnitTxt
              western.countUnitId = rs.unitGroupItemObject ? rs.unitGroupItemObject.id : ''
              western.countUnit = rs.unitGroupItemObject ? rs.unitGroupItemObject.name : '片'
              western.discountUnit = rs.unitGroupItemObject ? rs.unitGroupItemObject.discountUnit : 1
              western.drugRatio = rs.drugObject.drugRatio
              western.globalMaterialId = rs.globalMaterialId
              western.drugType = rs.drugObject.drugType
              western.localMaterialId = rs.localMaterialId
              western.allotNum = rs.usableNum
            }
            if (chi && ['303', '304'].includes(value.serviceClassification)) {
              chi.unitName = rs.unitGroupItemObject ? rs.unitGroupItemObject.name : 'g'
              chi.amountUnitTxt = rs.unitGroupItemObject ? rs.unitGroupItemObject.name : 'g'
              chi.amountUnit = rs.unitGroupItemObject.id
              chi.drugRatio = rs.drugObject.drugRatio
              chi.globalMaterialId = rs.globalMaterialId
              chi.drugType = rs.drugObject.drugType
              chi.localMaterialId = rs.localMaterialId
              chi.allotNum = rs.usableNum
            }
            if (['299', '300'].includes(value.serviceClassification)) {
              this.itemData.countUnitId = rs.unitGroupItemObject ? rs.unitGroupItemObject.id : ''
              this.itemData.countUnit = rs.unitGroupItemObject ? rs.unitGroupItemObject.name : '个'
              this.itemData.allotNum = rs.usableNum
            }
            return callback && callback(value)
          })
        } else {
          let rs = value.localObject
          if (western && ['301', '302'].includes(value.serviceClassification)) {
            western.measure = rs.drugObject.content ? rs.drugObject.content : ''
            western.weight = rs.drugObject.content || ''
            western.employ = rs.drugObject.useWay ? rs.drugObject.useWay.split(',')[0] : ''
            western.useFreq = rs.drugObject.frequency ? rs.drugObject.frequency : ''
            western.unitGroupItem = western.unitGroupItem || (rs.unitGroupItemList ? rs.unitGroupItemList[0] : '')
            western.measureUnit = rs.drugObject.unit ? parseInt(rs.drugObject.unit) : rs.drugObject.preparationUnit
            western.measureUnitName = rs.drugObject.unit ? this.storage.getSysTypeText('THC_WH_DOSE_UNIT', parseInt(rs.drugObject.unit)) : rs.drugObject.preparationUnitTxt
            western.countUnitId = western.unitGroupItem ? western.unitGroupItem.id : ''
            western.countUnit = western.unitGroupItem ? western.unitGroupItem.name : '片'
          }
          if (chi && ['303', '304'].includes(value.serviceClassification)) {
            chi.unitName = rs.unitGroupItemList ? rs.unitGroupItemList[0].name : 'g'
            chi.amountUnitTxt = rs.unitGroupItemLis ? rs.unitGroupItemList[0].name : 'g'
            chi.amountUnit = rs.unitGroupItemList ? rs.unitGroupItemList[0].id : ''
            chi.drugRatio = rs.drugObject.drugRatio ? rs.drugObject.drugRatio : ''
            chi.drugType = rs.drugObject.drugType ? rs.drugObject.drugType : ''
            chi.globalMaterialId = rs ? rs.globalMaterialId : ''
            chi.localMaterialId = rs ? rs.localMaterialId : ''
          }
          if (['299', '300'].includes(value.serviceClassification)) {
            this.itemData.countUnitId = rs.unitGroupItemList ? rs.unitGroupItemList[0].id : ''
            this.itemData.countUnit = rs.unitGroupItemList ? rs.unitGroupItemList[0].name : '个'
          }
          return callback && callback(value)
        }
      },
      // 将西药医嘱添加至等待区
      setWestToWait () {
        let _this = this
        this.westernData.list.map((v, i) => {
          let _content = []
          if (v.measure) {
            _content.push('每次 ' + v.measure + v.measureUnitName)
          }
          if (v.employ) {
            _content.push(this.storage.getSysTypeText('CV06.00.102', v.employ))
          }
          if (v.useFreq) {
            _content.push(this.storage.getSysTypeText('CV06.00.228', v.useFreq))
          }
          if (v.count) {
            _content.push(v.count + v.countUnit)
          }
          if (v.totalUseDay) {
            _content.push('用 ' + v.totalUseDay + ' 天')
          }
          if (v.source) {
            _content.push(this.storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', v.source))
          }
          let obj = {
            adviceType: v.serviceItem.serviceClassification,
            visitType: this.visitType || 2,
            status: '',
            isMain: v.isMain,
            termType: this.getTermType(v.useFreq),
            isEntrust: v.isEntrust,
            adviceId: v.groupId,
            itemId: v.itemId,
            serviceItem: v.serviceItem,
            serviceId: v.serviceItem.id,
            adviceName: v.serviceItem.byname + ' ' + v.serviceItem.spec,
            serviceName: v.serviceItem.byname,
            measure: v.measure,
            measureUnit: v.measureUnit,
            measureUnitName: v.measureUnitName,
            employ: v.employ,
            employTxt: this.storage.getSysTypeText('CV06.00.102', v.employ),
            useFreq: v.useFreq,
            useFreqTxt: this.storage.getSysTypeText('CV06.00.228', v.useFreq),
            entrust: v.entrust,
            count: v.count,
            countUnitId: v.countUnitId,
            countUnit: v.countUnit,
            spec: v.serviceItem.spec || '', // 增加spec字段给打印用
            totalUseDay: v.totalUseDay,
            startTime: v.startTime ? this.$moment(v.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
            endTime: v.endTime ? this.$moment(v.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
            price: v.serviceItem.price * v.count,
            source: v.source,
            disposeContent: _content.join(' , '),
            insuranceIdentification: _this.isMedicalInsurance ? 1 : 0 // 是否走自费 1表示医保，0表示自费
          }
          this.waitSendData.push(obj)
        })
        this.westernData.list = []
        this.isMedicalInsurance = 1
        return true
      },
      // 将中药添加至等待区
      setChiToWait () {
        let v = this.chiData
        let _content = []
        if (v.employ) {
          _content.push(this.storage.getSysTypeText('CV06.00.102', v.employ))
        }
        if (v.useFreq) {
          _content.push(this.storage.getSysTypeText('CV06.00.228', v.useFreq))
        }
        if (v.count) {
          _content.push('共' + v.count + '剂')
        }
        if (v.decoct) {
          _content.push('代煎')
        }
        if (v.source) {
          _content.push(this.storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', v.source))
        }
        let obj = {
          isMain: 0,
          adviceType: v.drugList[0].serviceItem.serviceClassification,
          visitType: this.visitType || 2,
          status: '',
          termType: this.getTermType(v.useFreq),
          isEntrust: v.isEntrust,
          adviceId: new Date().getTime(),
          itemId: v.itemId,
          serviceItem: v.drugList[0].serviceItem,
          serviceId: v.drugList[0].serviceItem.id,
          employ: v.employ,
          source: v.source,
          employTxt: this.storage.getSysTypeText('CV06.00.102', v.employ),
          useFreq: v.useFreq,
          useFreqTxt: this.storage.getSysTypeText('CV06.00.228', v.useFreq),
          entrust: v.entrust,
          count: v.count,
          countUnit: v.countUnit,
          startTime: v.startTime ? this.$moment(v.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: v.endTime ? this.$moment(v.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
          price: this.chiTotalPrice,
          decoct: v.decoct ? 1 : 0, // todo decoct 改为int型
          decoctPrice: v.decoctPrice,
          disposeContent: _content.join(' , '),
          adviceContent: JSON.stringify(v.drugList)
        }
        this.waitSendData.push(obj)
        this.initChiData()
      },
      // 将检查项目添加至等待区
      setInspectToWait () {
        let v = this.inspectData
        let _content = {
          position: v.position, // 部位
          illHis: v.illHis, // 病史摘要
          clinicalExamine: v.clinicalExamine, // 临床检查
          otherExamine: v.otherExamine, // 检查结果
          assistExamine: v.assistExamine // 辅助检查
        }
        let obj = {
          isMain: 0,
          adviceType: v.serviceItem.serviceClassification,
          visitType: this.visitType || 2,
          status: '',
          termType: this.getTermType(v.useFreq),
          adviceId: new Date().getTime(),
          itemId: new Date().getTime(),
          serviceItem: v.serviceItem,
          serviceId: v.serviceItem.id,
          adviceName: v.serviceItem.name + v.serviceItem.spec,
          serviceName: v.serviceItem.name,
          useFreq: v.useFreq,
          useFreqTxt: this.storage.getSysTypeText('CV06.00.228', v.useFreq),
          entrust: v.entrust,
          count: 1,
          countUnitId: v.countUnitId || v.serviceItem.unit,
          countUnit: v.countUnit || v.serviceItem.unitName,
          startTime: v.startTime ? this.$moment(v.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: v.endTime ? this.$moment(v.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
          price: v.serviceItem.price,
          disposeContent: '',
          adviceContent: JSON.stringify(_content),
          position: v.position, // 部位
          illHis: v.illHis, // 病史摘要
          clinicalExamine: v.clinicalExamine, // 临床检查
          otherExamine: v.otherExamine, // 检查结果
          assistExamine: v.assistExamine // 辅助检查
        }
        this.waitSendData.push(obj)
        return true
      },
      // 将手术添加至等待区
      setSurgeryToWait () {
        let v = this.surgeryData
        let _content = {
          doctorItem: v.doctorItem,
          assistantItem: v.assistantItem,
          surgeryFreq: v.surgeryFreq,
          anaesthesia: v.anaesthesia,
          position: v.position
        }
        let obj = {
          isMain: 0,
          adviceType: v.serviceItem.serviceClassification,
          visitType: this.visitType || 2,
          status: '',
          termType: 0,
          checked: false,
          adviceId: new Date().getTime(),
          itemId: new Date().getTime(),
          serviceItem: v.serviceItem,
          serviceId: v.serviceItem.id,
          adviceName: v.serviceItem.name + v.serviceItem.spec,
          serviceName: v.serviceItem.name,
          entrust: v.entrust,
          count: 1,
          countUnitId: v.countUnitId || v.serviceItem.unit,
          countUnit: v.countUnit || v.serviceItem.unitName,
          startTime: this.$moment(v.startTime).format('YYYY-MM-DD hh:mm:ss'),
          endTime: '',
          price: v.serviceItem.price,
          disposeContent: '',
          adviceContent: JSON.stringify(_content),
          doctorItem: v.doctorItem,
          assistantItem: v.assistantItem,
          surgeryId: v.surgeryFreq.id,
          surgeryName: v.surgeryFreq.name,
          surgeryCode: v.surgeryFreq.code,
          anaesthesiaId: v.anaesthesia.id,
          anaesthesiaName: v.anaesthesia.name,
          anaesthesiaCode: v.anaesthesia.code,
          positionId: v.position.id,
          position: v.position.position
        }
        this.waitSendData.push(obj)
        return true
      },
      // 将检验/耗材/治疗/其它添加至等待区
      setItemToWait () {
        let v = this.itemData
        let _content = []
        if (v.useFreq) {
          _content.push(this.storage.getSysTypeText('CV06.00.228', v.useFreq))
        }
        if (v.count) {
          _content.push((['299', '300'].includes(v.serviceItem.serviceClassification) && this.visitType === 2 ? '每次' : '') + v.count + v.countUnit)
        }
        let obj = {
          isMain: 0,
          adviceType: v.serviceItem.serviceClassification,
          visitType: this.visitType || 2,
          status: '',
          termType: this.getTermType(v.useFreq),
          isEntrust: v.isEntrust,
          adviceId: new Date().getTime(),
          itemId: new Date().getTime(),
          serviceItem: v.serviceItem,
          serviceId: v.serviceItem.id,
          adviceName: v.serviceItem.name + v.serviceItem.spec,
          serviceName: v.serviceItem.name,
          useFreq: v.useFreq || '',
          useFreqTxt: v.useFreq ? this.storage.getSysTypeText('CV06.00.228', v.useFreq) : '',
          entrust: v.entrust,
          count: v.count,
          countUnitId: v.countUnitId || v.serviceItem.unit,
          countUnit: v.countUnit || v.serviceItem.unitName,
          startTime: v.startTime ? this.$moment(v.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: v.endTime ? this.$moment(v.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
          price: v.serviceItem.price * v.count,
          disposeContent: _content.join(' , '),
          adviceContent: v.count + v.countUnit
        }
        this.waitSendData.push(obj)
        return true
      },
      // 医嘱提交
      submitEvent () {
        return this.$refs.openform && this.$refs.openform.validate(valid => {
          if (!valid) {
            return false
          }
          this.setWaitData()
        })
      },
      beginValidateChi () {
        this.$refs.chiform.validate(valid2 => {
          if (!valid2) {
            return false
          }
          this.checkDrugItem(rs => {
            if (rs.data && rs.data.infoList && rs.data.infoList.length) {
              this.wringData = rs.data.infoList
              this.showCdss = true
            } else {
              this.wringData = []
              this.cdssConfirm = false
              this.confirmCdssSubmit()
            }
          })
        })
      },
      setWaitData () {
        let type = this.service.serviceClassification
        if (['301', '302'].includes(type)) {
          let haveStock = this.westernData.list.filter(item => {
            return item.allotNum - item.count < 0 && !item.isEntrust
          })
          if (this.isAddTpl) {
            this.confirmCdssSubmit()
            return false
          }
          if (!haveStock[0]) {
            this.checkDrugItem(rs => {
              if (rs.data && rs.data.infoList && rs.data.infoList.length) {
                this.wringData = rs.data.infoList
                this.showCdss = true
              } else {
                this.wringData = []
                this.cdssConfirm = false
                this.confirmCdssSubmit()
              }
            })
            return false
          }
          if (haveStock[0] && this.visitType === 2) {
            return false
          }
          if (haveStock[0] && this.visitType === 1) {
            this.$confirm('处方存在库存不足项目, 请确定是否继续添加?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.checkDrugItem(rs => {
                if (rs.data && rs.data.infoList && rs.data.infoList.length) {
                  this.wringData = rs.data.infoList
                  this.showCdss = true
                } else {
                  this.wringData = []
                  this.cdssConfirm = false
                  this.confirmCdssSubmit()
                }
              })
            }).catch(() => {
              return false
            })
          }
          return false
        }
        if (['303', '304'].includes(type)) {
          let haveStock = this.chiData.drugList.filter(item => {
            return item.allotNum - item.amount < 0
          })
          if (this.isAddTpl) {
            this.$refs.chiform.validate(valid2 => {
              if (!valid2) {
                return false
              }
              this.confirmCdssSubmit()
            })
            return false
          }
          if (!haveStock[0]) {
            this.beginValidateChi()
            return false
          }
          if (haveStock[0] && this.visitType === 2) {
            return false
          }
          if (haveStock[0] && this.visitType === 1) {
            this.$confirm('处方存在库存不足项目, 请确定是否继续添加?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.beginValidateChi()
            }).catch(() => {
              return false
            })
          }
          return false
        }
        if (type === '800') {
          this.setInspectToWait()
          this.service = ''
          this.$emit('submit', this.waitSendData)
          return false
        }
        if (type === '2125') {
          this.setSurgeryToWait()
          this.service = ''
          this.$emit('submit', this.waitSendData)
          return false
        }
        if (this.isItemType(type)) {
          if (this.isAddTpl || !['299', '300'].includes(this.service.serviceClassification) || this.itemData.allotNum - this.itemData.count >= 0) {
            this.setItemToWait()
            this.service = ''
            this.$emit('submit', this.waitSendData)
            return false
          }
          if (this.visitType === 1) {
            this.$confirm('处方存在库存不足项目, 请确定是否继续添加?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.setItemToWait()
              this.service = ''
              this.$emit('submit', this.waitSendData)
            }).catch(() => {
              return false
            })
          }
          if (this.visitType === 2) {
            return false
          }
        }
      },
      getCountUnitText (item) {
        if (!item) {
          return '次'
        }
        if (item.unitName) {
          return item.unitName
        }
        if (item.localObject) {
          return item.localObject.unitGroupItemList[0].name
        }
      },
      // 判断是否是项目类型（检验/耗材/治疗/其它）
      isItemType (id) {
        let ids = ['299', '300', '801', '802', '867', '2124']
        return ids.filter(item => {
          return item === id
        })[0]
      },
      // 设置中药待煎费用
      setChiDecoctPrice () {
        this.medicalapi.getDaijian('daijian').then(res => {
          this.decoctPrice = this.chiData.decoctPrice = res.data.price
        })
      },
      // CDSS不通过，强制提交
      confirmCdssSubmit () {
        let type = this.service.serviceClassification
        if (['303', '304'].includes(type)) {
          this.service = ''
          this.cdssConfirm = true
          this.showCdss = false
          this.showAlert = false
          this.setChiToWait()
        }

        if (['301', '302'].includes(type)) {
          // 校验是否超量
          this.checkDrugInfo(val => {
            console.log(val, 'checkDrugInfo数据结果')
            if (val && val.errCode === '1001') {
              this.$confirm(val.errMsg + '，是否继续添加?', '警告', {
                confirmButtonText: '自费处方',
                cancelButtonText: '取消',
                type: 'warning',
                center: false
              }).then(() => {
                debugger
                this.isMedicalInsurance = 0
                this.service = ''
                this.cdssConfirm = true
                this.showCdss = false
                this.showAlert = false
                this.setWestToWait()
                this.$emit('submit', this.waitSendData)
              }).catch(() => {
                return false
              })
            } else {
              debugger
              this.service = ''
              this.cdssConfirm = true
              this.showCdss = false
              this.showAlert = false
              this.setWestToWait()
              this.$emit('submit', this.waitSendData)
            }
          })
        }
        this.$emit('submit', this.waitSendData)
      },
      // 医嘱共享
      checkShareInfo (val, callback) {
        // 是否启用医嘱共享校验
        if (val.chargeLevel === '3' || !this.shareInfo || !this.appoint || this.appoint.subsequentVisit === 3) {
          this.isMedicalInsurance = 0
          return callback && callback()
        }
        let params = {
          icno: this.shareInfo.icno,
          isEmergencyTradecuretype: false,
          isBasicMedicalInsurance: this.shareInfo.isBasicMedicalInsurance,
          isOnTheJobWorker: this.shareInfo.isOnTheJobWorker,
          fundtype: this.shareInfo.fundtype,
          itemcode: val.id
        }

        if (params.isBasicMedicalInsurance && params.isOnTheJobWorker) {
          this.medicalapi.checkShareInfo(params).then(rs => {
            debugger
            this.isMedicalInsurance = 1
            this.showAlert = false
            return callback && callback(rs)
          }, error => {
            debugger
            this.isMedicalInsurance = 0
            this.showAlert = true
            this.showAlertMsg = error.errMsg
            return callback && callback(error)
          })
        } else {
          return callback && callback()
        }
      },
      // 检查药品是否超量了
      checkDrugInfo (callback) {
        if (this.westernData.list.length > 1 || !this.appoint || this.appoint.subsequentVisit === 3) {
          callback()
          return false
        }
        let params = {
          curetype: this.appoint.subsequentVisit === 3 ? 19 : 11,  // 必填 门诊类型：11 普通门诊 19 急诊
          diagnosecode: this.results ? this.results[0].diseaseCode : '',  // 必填 诊断编码
          hiscode: this.westernData.list[0].serviceItem.id,  // 必填 项目id
          itemtype: ['301', '302', '303', '304'].includes(this.westernData.list[0].drugType) ? 0 : 1,  // 必填 项目类别：0 药品 1 诊疗设施
          howtouse: this.storage.getSysTypeText('CV06.00.228', this.westernData.list[0].useFreq, 'code'),  // 必填 使用频次编码    使用值集：THC_PHR_DRUG_FREQUENCY 用药频次 取编码
          days: this.westernData.list[0].totalUseDay,  // 必填 用药天数
          dosage: this.westernData.list[0].measure,  // 必填 单次用量
          count: this.westernData.list[0].count,  // 必填 数量
          conversion: this.westernData.list[0].drugRatio  // 必填 换算率
        }
        this.checkShareInfo(this.westernData.list[0].serviceItem, rs => {
          console.log(rs, '异常的数据结构')
          // errcode !== 0 ||  ==1001 医保不给报
          if (rs && rs.errCode === '1001') {
            this.$confirm(rs.errMsg + '，是否继续添加?', '警告', {
              confirmButtonText: '自费处方',
              cancelButtonText: '取消',
              type: 'warning',
              center: false
            }).then(() => {
              this.isMedicalInsurance = 0
              callback()
              // this.medicalapi.checkDrugInfo(params).then(rs => {
              //   callback(rs)
              // }, error => {
              //   callback({
              //     errorCode: error
              //   })
              // })
            }).catch(() => {
              return false
            })
          } else {
            // 医保给报销 做超量校验
            this.medicalapi.checkDrugInfo(params).then(rs => {
              callback(rs)
            }, error => {
              callback(error)
            })
          }
        })
      },
      // CDSS弹窗关闭回调事件
      closeCdssEvent () {
        this.cdssConfirm = false
        this.showCdss = false
      },
      // CDSS校验
      checkDrugItem (callback) {
        let type = this.service.serviceClassification
        let items = []
        if (['301', '302'].includes(type)) {
          this.westernData.list.map(item => {
            items.push({
              localMaterialId: item.localMaterialId,
              globalMaterialId: item.globalMaterialId,
              medicineId: item.localMaterialId,
              medicineName: item.serviceItem.name,
              singleAmount: item.measure,
              singleAmountUnitTxt: item.measureUnitName,
              totalAmount: item.count,
              useFreq: item.useFreq,
              useMethod: item.employ
            })
          })
        }
        if (['303', '304'].includes(type)) {
          this.chiData.drugList.map(item => {
            items.push({
              localMaterialId: item.localMaterialId,
              globalMaterialId: item.globalMaterialId,
              medicineId: item.localMaterialId,
              medicineName: item.serviceItem.name,
              amount: item.amount,
              amountUnitTxt: item.amountUnitTxt
            })
          })
        }
        let params = {
          patientId: this.baseInfo.patientId,
          recipeItems: items,
          visitSn: this.baseInfo.visitSn,
          recipeType: ['303', '304'].includes(type) ? 1 : 2,
          useMethod: ['303', '304'].includes(type) ? this.chiData.employ : '',
          useFreq: ['303', '304'].includes(type) ? this.chiData.useFreq : '',
          totalAmount: ['303', '304'].includes(type) ? this.chiData.count : 1
        }
        return params && this.medicalapi.checkDrugItem(params).then(rs => {
          return callback && callback(rs)
        })
      },
      // 通过频次值集返回code判断是临时还是长期医嘱（code=14 || 33为临时医嘱）
      getTermType (useFreq) {
        let code = this.storage.getSysTypeText('CV06.00.228', useFreq, 'code')
        return (code === '14' || code === '33') ? 0 : 1
      },
      showAddEvent () {
        this.$emit('change')
      },
      remoteMethod (name) {
        if (!name) {
          this.surgeryData.position = ''
          this.positionOption = []
          return false
        }
        this.loading = true
        this.phrapi.getSurgical(name).then(data => {
          this.loading = false
          if (data && data.length) {
            data.map(v => {
              delete v.createTime
              delete v.updateTime
              return v
            })
            this.surgeryOption = data
          } else {
            this.surgeryOption = []
          }
        })
      },
      selectSurgery (val) {
        if (!val) {
          this.surgeryData.position = ''
          this.positionOption = []
          return false
        }
        this.phrapi.getPosition(val.id).then(data => {
          if (data && data.length) {
            data.map(v => {
              delete v.createTime
              delete v.updateTime
              return v
            })
            this.positionOption = data
          } else {
            this.positionOption = []
          }
        })
      },
      computeCount (val, index) {
        let item = this.westernData.list[index]
        let day = item.totalUseDay
        let freqval = this.storage.getSysTypeText('CV06.00.228', item.useFreq, 'value')
        let freq = item.useFreq && freqval ? freqval : 1
        let discountUnit = item.discountUnit
        let measure = item.measure
        let weight = item.weight
        if (!measure || !discountUnit || !weight || !day) {
          return false
        }
        let count = (measure * freq * day / weight) / discountUnit
        this.westernData.list[index].count = !isNaN(count) ? Math.ceil(count.toFixed(2)) : ''
      },
      setCountUnit (val, index) {
        this.westernData.list[index].countUnitId = val.id
        this.westernData.list[index].countUnit = val.name
      },
      setEntrust (val, index) {
        let type = this.service.serviceClassification
        let item = ''
        if (['299', '300'].includes(type)) {
          item = this.itemData
        }
        if (['301', '302'].includes(type)) {
          item = this.westernData.list[index]
        }
        if (['303', '304'].includes(type)) {
          item = this.chiData
        }
        if (item) {
          item.isEntrust = 0
        }
      },
      changeSource (val, index) {
        let value = storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', val, 'value')
        if (value === '4') {
          this.westernData.list[index].isEntrust = 1
          if (!this.westernData.list[index].count) {
            this.westernData.list[index].count = 0
          }
        } else {
          this.westernData.list[index].isEntrust = 0
        }
      },
      changeChiSorce (val) {
        let value = storage.getSysTypeText('THC_SYS_PRESCRIPTION_SOURCE', val, 'value')
        this.chiData.isEntrust = value === '4' ? 1 : 0
        this.chiData.decoct = this.chiData.drugList[0].drugType === '303' && !this.chiData.isEntrust
      }
    },
    computed: {
      // 中药医嘱总价格计算
      chiTotalPrice () {
        let money = 0
        let decoctPrice = 0
        if (this.chiData.decoct) {
          this.chiData.decoctPrice = this.decoctPrice
          decoctPrice = this.decoctPrice
        }
        if (!this.chiData.drugList[0]) {
          return 0
        }
        this.chiData.drugList.map(v => {
          if (v.serviceItem.price) {
            money += v.serviceItem.price * v.amount / v.drugRatio
          }
        })
        return (money + decoctPrice) * this.chiData.count
      }
    },
    components: {
      cdss1 // CDSS检验弹窗
    },
    directives: {
      ctrlEnter: {
        inserted (el, binding, vnode) {
          document.onkeydown = function (event) {
            let e = event || window.event
            let dom = el.querySelectorAll('.ctrlenter')
            if (dom[0] && e && e.keyCode === 13 && e.ctrlKey) {
              vnode.context.submitEvent()
            }
          }
        }
      }
    }
  }
</script>
<style scoped>
  .header strong,
  .header strong{cursor: pointer;font-size: 15px; width: 120px;}
  .header strong i{float: right;}
  .blue{color: #1C7BEF;}
  .mb20{margin-bottom: 20px;}
  .ml20{margin-left: 20px;}
  .pr10{padding-right: 10px;}
  .gray{color: #999999;}
  .wb96{width: 96%;}
  .hide{display: none;}
  .line{border-bottom:1px solid #ddd;}
  .add-body{height: 105px; overflow: auto;margin-top: 15px; margin-bottom: 60px;}
  .add-footer{position: absolute;left: 0; right: 0; bottom: 0; border-top: 1px solid #ddd;padding: 15px 20px;}
  .h180{height: 161px;}
  .el-select{width: 100%}
  .el-date-editor.el-input{width: 100%;}
  .inspect tr th{text-align: left; padding:15px 0;}
  .inspect tr th.right{text-align: right; padding-right: 20px;}
  .inspect tr th.center{text-align: center;}
  .inspect tr td{text-align: left;}
  .chi-form{background: #F4F4F4;padding: 22px 20px 0 20px;}
  .chi-form .total-price{font-size: 16px; color: #FF9C01;}
  .service-box{padding-top: 10px;}
  .table-item tr td{line-height:24px; padding: 7px 15px; vertical-align: middle;}
  .western thead tr th{padding: 15px 15px 15px 0;}
  .add-body .el-form-item__info{display:block; color:#666; background: #fff; font-size: 12px; line-height: 1; padding-top: 4px; position: absolute; top: 100%; left: 0;}
  .add-body /deep/ .el-form-item__error{background: #fff;}
  .add-body /deep/ .el-input-group__append,
  .add-body /deep/ .el-input-group__prepend{padding: 0 10px;}
  @media (max-height:770px) {
   .add-body{height: 65px;}
   .h180{height: 120px;}
   .mb20{margin-bottom: 10px;}
  }
</style>
