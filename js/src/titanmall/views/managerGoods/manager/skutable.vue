<template>
  <div id="sku">
    <!-- 规格设置 -->
    <!--<el-button @click="seeBtn">查看</el-button>-->
    <div class="box">
      <div class="text-tip">
        <span>商品规格</span>
      </div>
      <div class="specification">
        <ul class="spec-list">
          <li class="item" v-for="(items, index) in specification" :key="index">
            <div class="name">
              <span class="span-label">规格名</span>
              <el-select
                v-model="items.name"
                placeholder="请选择"
                size="small"
                filterable
                allow-create
                default-first-option
                @change="value => changeGgx(value, index)"
              >
                <el-option
                  v-for="item in itemOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                  :disabled="disabledGgx(item)"
                >
                </el-option>
              </el-select>
              <el-checkbox
                v-model="items.checked" v-if="index === 0"
                @change="changePrice(items.value)">添加规格图片
              </el-checkbox
              >
              <i class="icon el-icon-circle-close" @click="delSpec(index)"></i>
            </div>
            <div class="values" v-if="items.name">
              <span class="ggz-label">规格值</span>
              <span class="ggz-select" v-for="(k, i) in items.value" :key="i">
                <el-select
                  v-model="k.name"
                  placeholder="请选择"
                  size="small"
                  filterable
                  allow-create
                  default-first-option
                  @change="value => setGgz(value, i, index)"
                >
                  <el-option
                    v-for="item in options[index].option"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    :disabled="disabledGgz(items.value, item)"
                  >
                  </el-option>
                </el-select>
                <i
                  class="icon-ggz el-icon-circle-close"
                  @click="delSpecTag(index, i)"
                ></i>
                <up-image
                  class="ggz-img"
                  v-if="items.checked && index === 0"
                  :value="k"
                  :imgUrl="k.fileArr.length ? k.fileArr[0].url : ''"
                  @addImg="addImg"
                  :isMany="false"
                ></up-image>
              </span>
              <el-button
                size="small" @click="addSpecValue(items, index)"
              >添加规格值
              </el-button
              >
            </div>
          </li>
        </ul>
        <div class="add-spec">
          <el-button
            size="small"
            :disabled="specification.length >= 3"
            @click="addSpec"
          >添加规格项目
          </el-button
          >
        </div>
      </div>
    </div>

    <!-- 实战DEMO -->
    <div class="box top-mr" v-if="specification.length">
      <div class="text-tip">
        <span>商品明细</span>
      </div>
      <div class="example">
        <table class="stock-table" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th v-for="(item, index) in specification" :key="index">
              {{ item.name }}
            </th>
            <th><span class="require-span">*</span>价格</th>
            <th><span class="require-span">*</span>库存</th>
            <th style="width: 150px">销量</th>
          </tr>
          </thead>
          <tbody v-if="specification[0] && specification[0].value.length">
          <tr :key="index" v-for="(item, index) in countSum(0)">
            <template v-for="(n, specIndex) in specification.length">
              <td
                v-if="showTd(specIndex, index)"
                :key="n"
                :rowspan="countSum(n)"
              >
                {{ getSpecAttr(specIndex, index) }}
              </td>
            </template>
            <td>
              <el-input
                :class="{ 'err-color': !childProductArray[index].price }"
                v-if="childProductArray[index]"
                size="small"
                type="text"
                maxlength="8"
                v-model="childProductArray[index].price"
                placeholder="请输入价格"
                :onkeyup="changeInput(index, 'price')"
              ></el-input>
            </td>
            <td>
              <el-input
                :class="{ 'err-color': !childProductArray[index].stock }"
                v-if="type == 1 && childProductArray[index]"
                size="small"
                type="text"
                maxlength="8"
                v-model="childProductArray[index].stock"
                :onkeyup="stockInput(index)"
                placeholder="请输入库存"
              ></el-input>
              <span v-if="type == 0 && childProductArray[index]">
                  <el-select
                    v-model="childProductArray[index].orgId"
                    placeholder="请选择"
                    size="small"
                    filterable
                    value-key="storageId"
                    @change="changeOrgId(childProductArray[index])"
                  >
                    <el-option
                      v-for="item in kcOptions"
                      :key="item.storageId"
                      :label="item.stockName"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                  <el-autocomplete
                    v-if="!childProductArray[index].thcKc"
                    size="small"
                    style="width: 60%;margin-left:10px"
                    v-model="childProductArray[index].materialName"
                    :fetch-suggestions="
                      (value, callback) =>
                        querySearchAsync(
                          value,
                          callback,
                          childProductArray[index]
                        )
                    "
                    @select="
                      value =>
                        handleSelect(value, childProductArray[index], index)
                    "
                    placeholder="请输入内容"
                  ></el-autocomplete>
                  <el-tag
                    style="margin-left: 10px"
                    v-else
                    closable
                    type="info"
                    disable-transitions
                    @close="handleClose(childProductArray[index])"
                  >{{ childProductArray[index].thcKc }}</el-tag
                  >
                </span>
            </td>
            <td>
              {{
              childProductArray[index] &&
              childProductArray[index].salesVolume
              }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  // 为Object添加一个原型方法，判断两个对象是否相等
  function objEquals (object1, object2) {
    // For the first loop, we only check for types
    for (let propName in object1) {
      // Check for inherited methods and properties - like .equals itself
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
      // Return false if the return value is different
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
        // Check instance type
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        // Different types => not equal
        return false
      }
    }
    // Now a deeper check using other objects property names
    for (let propName in object2) {
      // We must check instances anyway, there may be a property that only exists in object2
      // I wonder, if remembering the checked values from the first loop would be faster or not
      if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
        return false
      } else if (typeof object1[propName] !== typeof object2[propName]) {
        return false
      }
      // If the property is inherited, do not check any more (it must be equa if both objects inherit it)
      if (!object1.hasOwnProperty(propName)) {
        continue
      }
      // Now the detail check and recursion
      // This returns the script back to the array comparing
      /** REQUIRES Array.equals**/
      if (
        object1[propName] instanceof Array &&
        object2[propName] instanceof Array
      ) {
        // recurse into the nested arrays
        if (objEquals(!object1[propName], object2[propName])) {
          return false
        }
      } else if (
        object1[propName] instanceof Object &&
        object2[propName] instanceof Object
      ) {
        // recurse into another objects
        // console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
        if (objEquals(!object1[propName], object2[propName])) {
          return false
        }
        // Normal value comparison for strings and numbers
      } else if (object1[propName] !== object2[propName]) {
        return false
      }
    }
    // If everything passed, let's say YES
    return true
  }

  import api from '../api'
  import priceInfo from '@/titanmall/components/priceInfo'
  import upImage from '@/titanmall/components/upimage'

  export default {
    name: 'app',
    props: [ 'type', 'id' ],
    components: { upImage },
    data () {
      return {
        api,
        priceInfo,
        // 规格
        specificationStatus: false, // 显示规格列表
        /*
          *       {
              name: '颜色',
              value: ['黑色', '白色', '蓝色']
            }
          * */
        specification: [
          // {
          //   name: "",
          //   value: [],
          //   checked: true/false
          // }
        ],
        // 子规格
        childProductArray: [],
        // 用来存储要添加的规格属性
        addValues: [],
        itemOptions: [],
        options: [],
        keyIdObj: { 0: { id: '' }, 1: { id: '' }, 2: { id: '' } },
        kcOptions: [],
        kfList: [],
      }
    },
    computed: {
      // 所有sku的id
      stockSpecArr () {
        return this.childProductArray.map(item => item.ownSpec)
      },
    },
    created () {
      this.getGgx({ name: '' })
      if (this.id) {
        this.getEdit(this.id)
      }
    },
    methods: {
      // 获取数据
      getEdit (id) {
        this.api.spuGetById({ id }).then(res => {
          if (res) {
            this.$emit('getEdit', res)
            if (res.sku && res.sku.length) {
              this.skuInfo(res)
              let idArr = []
              res.skuArr.forEach((items, index) => {
                const arr = this.itemOptions.filter(
                  item => item.name === items.name,
                )
                if (arr.length) {
                  idArr.push(arr[0])
                }
              })
              idArr.forEach((item, index) => {
                this.keyIdObj[index].id = idArr[index].id
              })
              if (!idArr[0]) return
              this.getGgz(
                { keyId: idArr[0].id },
                -1,
                {
                  skuArr: res.skuArr,
                  sku: res.sku,
                  len: res.skuArr.length,
                },
                () => {
                  this.specification.push(res.skuArr[0])
                  this.childProductArray = [ ...res.sku ]
                  if (!idArr[1]) return
                  this.getGgz(
                    { keyId: idArr[1].id },
                    -1,
                    {
                      skuArr: res.skuArr,
                      sku: res.sku,
                      len: res.skuArr.length,
                    },
                    () => {
                      this.specification.push(res.skuArr[1])
                      this.childProductArray = res.sku
                      if (!idArr[2]) return
                      this.getGgz(
                        { keyId: idArr[2].id },
                        -1,
                        {
                          skuArr: res.skuArr,
                          sku: res.sku,
                          len: res.skuArr.length,
                        },
                        () => {
                          this.specification.push(res.skuArr[2])
                          this.childProductArray = res.sku
                        },
                      )
                    },
                  )
                },
              )
            }
          }
        })
      },
      skuInfo (res) {
        res.sku.forEach(item => {
          item.price = this.$_narrowPrice(item.price, 100)
          item.ownSpec = JSON.parse(item.ownSpec)
          item.thcKc = item.materialName + ' 库存：' + item.stock
          let obj = {
            storageId: item.stockId,
            stockName: item.stockName,
            clinicId: item.orgId,
          }
          item.orgId = obj
        })
      },
      // 获取规格项
      getGgx (params) {
        this.api.findKeyByShop(params).then(res => {
          if (res) {
            this.itemOptions = [ ...res ]
          }
        })
      },

      // 选中规格项
      changeGgx (val, index) {
        let arr = this.itemOptions.filter(item => item.name === val)
        if (!index) this.childProductArray.length = 0
        if (this.options.length) this.options[index].option.length = 0
        this.specification[index].value = [ { name: '', id: '', fileArr: [] } ]
        if (arr.length) {
          this.getGgz({ keyId: arr[0].id }, index)
          this.keyIdObj[index].id = arr[0].id
        } else {
          this.setGgx({ name: val }, index)
        }
      },

      // 禁用规格项option
      disabledGgx (item) {
        let arr = this.specification.filter(items => {
          return items.name === item.name
        })
        return !!arr.length
      },

      // 禁用规格值option
      disabledGgz (option, val) {
        let arr = option.filter(item => {
          return item.name === val.name
        })
        return !!arr.length
      },

      // 创建规格项
      setGgx (params, index) {
        this.api.attributeKeyCreate(params).then(res => {
          if (res) {
            this.itemOptions.push(res)
            this.keyIdObj[index].id = res.id
          }
        })
      },

      // 获取规格值
      getGgz (params, index, arr, callback) {
        this.api.findValueByKeyId(params).then(res => {
          if (index === -1) {
            this.options.push({ option: res })
          } else {
            this.options[index].option = res
          }
          if (callback) {
            callback()
          }
        })
      },

      // 保存规格值 规格值变动时调用
      setGgz (value, index, ggxIndex) {
        // 查看规格 是否 有 ID， 无则 发送请求 新增到 后端， 有 则不做处理
        let arr = this.options[ggxIndex].option.filter(
          item => item.name === value,
        )
        this.handleSpecChange('add')
        if (arr.length) {
          this.specification[ggxIndex].value[index].id = arr[0].id
        } else {
          let params = { name: value, keyId: this.keyIdObj[ggxIndex].id }
          this.api.attributeValueCreate(params).then(res => {
            if (res) {
              this.options[ggxIndex].option.push(res)
              this.specification[ggxIndex].value[index].id = res.id
            }
          })
        }
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
            })
          }
        })
      },
      // 获取物资
      querySearchAsync (queryString, cb, row) {
        let params = {
          clinicIds: [ row.orgId.clinicId ],
          name: row.materialName,
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
      handleSelect (val, row, index) {
        row.countUnitId = val.countUnitId
        let params = {
          storageRoomIds: [ row.orgId.storageId ],
          localMaterialIds: [ val.id ],
          checkScene: '1',
        }
        this.api.spuStockList(params).then(res => {
          if (res) {
            this.$set(
              this.childProductArray[index],
              'thcKc',
              row.materialName + ' 库存：' + res[0].num,
            )
            this.$set(this.childProductArray[index], 'stock', res[0].num)
            this.$set(
              this.childProductArray[index],
              'orgMaterialId',
              res[0].localMaterialId,
            )
            this.$set(
              this.childProductArray[index],
              'tenantMaterialId',
              res[0].materialSkuId,
            )
          }
        })
      },
      // 获取库房下数据
      handleClose (row) {
        row.thcKc = ''
        row.stock = ''
      },

      // 切换库房
      changeOrgId (row) {
        row.thcKc = ''
        row.materialName = ''
      },

      // 添加规格项目
      addSpec () {
        if (this.specification.length < 3) {
          this.specification.push({
            name: '',
            value: [ { name: '', id: '', fileArr: [] } ],
            checked: false,
          })
          this.options.push({ option: [] })
        }
      },

      // 添加规格值
      addSpecValue (items, index) {
        items.value.push({ name: '', id: '', fileArr: [] })

        this.handleSpecChange('add')
      },

      // 删除规格项目
      delSpec (index) {
        this.specification.splice(index, 1)
        if (!this.specification.length) this.childProductArray = []
        this.options.splice(index, 1)
        this.handleSpecChange('del')
      },

      /**
       * 商品图
       */
      uploadSuccess (file, value) {
        // 上传成功赋值
        value.fileArr.push({
          url: file.fileUrl,
          fileId: file.fileUrl,
        })
      },
      fileList (file, value) {
        // 删除赋值
        if (file.length === 0) {
          value.fileArr = []
        } else {
          value.fileArr = file
        }
      },

      // 删除规格属性
      delSpecTag (index, itemIndex) {
        this.specification[index].value.splice(itemIndex, 1)
        if (!this.specification[index].value.length) {
          this.specification.splice(index, 1)
        }
        this.handleSpecChange('del')
      },
      /*
          计算属性的乘积, 算 出 一共多少 行 table
          @params
            specIndex
        */
      countSum (specIndex) {
        let num = 1
        this.specification.forEach((item, index) => {
          if (index >= specIndex && item.value.length) {
            num *= item.value.length
          }
        })
        return num
      },
      // 根据传入的条件，来判断是否显示该td
      showTd (specIndex, index) {
        // 如果当前项目下没有属性，则不显示
        if (!this.specification[specIndex]) {
          return false
          // 自己悟一下吧
        } else if (index % this.countSum(specIndex + 1) === 0) {
          return true
        } else {
          return false
        }
      },
      /**
       * [handleSpecChange 监听标签的变化,当添加标签时；求出每一行的hash id，再动态变更库存信息；当删除标签时，先清空已有库存信息，然后将原有库存信息暂存到stockCopy中，方便后面调用]
       * @param  {[string]} option ['add'|'del' 操作类型，添加或删除]
       * @return {[type]}        [description]
       */
      handleSpecChange (option) {
        const stockCopy = JSON.parse(JSON.stringify(this.childProductArray))
        if (option === 'del') {
          this.childProductArray = []
        }
        for (let i = 0; i < this.countSum(0); i++) {
          this.changeStock(option, i, stockCopy)
        }
      },
      /**
       * [根据规格，动态改变库存相关信息]
       * @param  {[string]} option    ['add'|'del' 操作类型，添加或删除]
       * @param  {[array]} stockCopy [库存信息的拷贝]
       * @return {[type]}           [description]
       */
      changeStock (option, index, stockCopy) {
        let childProduct = {
          price: '',
          ownSpec: this.getChildProductSpec(index),
          stock: '',
          salesVolume: 0,
          orgId: '',
          materialName: '',
          thcKc: '',
          orgMaterialId: '',
          tenantMaterialId: '',
          countUnitId: '',
          stockId: '',
          stockName: '',
        }
        const spec = childProduct.ownSpec
        if (option === 'add') {
          // 如果此id不存在，说明为新增属性，则向 childProductArray 中添加一条数据
          if (this.stockSpecArr.findIndex(item => objEquals(spec, item)) === -1) {
            this.$set(this.childProductArray, index, childProduct)
            this.childProductArray.forEach((items, index) => {
              let arr = stockCopy.filter(item =>
                objEquals(item.ownSpec, items.ownSpec),
              )
              if (arr.length) {
                this.$set(this.childProductArray, index, arr[0])
              }
            })
          }
        } else if (option === 'del') {
          // 因为是删除操作，理论上所有数据都能从stockCopy中获取到
          let origin = ''
          stockCopy.forEach(item => {
            if (objEquals(spec, item.ownSpec)) {
              origin = item
              return false
            }
          })
          this.childProductArray.push(origin || childProduct)
        }
      },
      /*
          根据传入的属性值，拿到相应规格的属性
          @params
            specIndex 规格项目在 advancedSpecification 中的序号
            index 所有属性在遍历时的序号
        */
      getSpecAttr (specIndex, index) {
        // 获取当前规格项目下的属性值
        let newArr = []
        this.specification[specIndex].value.forEach(item => {
          newArr.push(item.name)
        })
        const currentValues = newArr
        let indexCopy
        // 判断是否是最后一个规格项目
        if (
          this.specification[specIndex + 1] &&
          this.specification[specIndex + 1].value.length
        ) {
          indexCopy = index / this.countSum(specIndex + 1)
        } else {
          indexCopy = index
        }
        const i = Math.floor(indexCopy % currentValues.length)
        if (i.toString() !== 'NaN') {
          return currentValues[i]
        } else {
          return ''
        }
      },
      // 获取childProductArray的childProductSpec属性
      getChildProductSpec (index) {
        let obj = {}
        this.specification.forEach((item, specIndex) => {
          if (item.name) {
            obj[item.name] = this.getSpecAttr(specIndex, index)
          }
        })
        return obj
      },

      /**
       * 价格格式化
       */
      changeInput (index, val) {
        let value = this.childProductArray[index][val]
        this.childProductArray[index][val] = this.priceInfo(value, true)
      },

      // 库存格式化
      stockInput (index) {
        let val = String(this.childProductArray[index].stock)
        if (val) {
          this.childProductArray[index].stock = val.replace(/[^\d]/g, '')
        }
      },

      // 添加图片返回结果
      addImg (value, url) {
        if (url) {
          value.fileArr.push({
            url,
            fileId: url,
          })
        } else {
          value.fileArr = []
        }
      },

      /**
       *  添加规格图片复选框变动清空规格值图片
       * */
      changePrice (val) {
        val.forEach(item => {
          item.fileArr = []
        })
      },
    },
    watch: {
      specification: {
        handler (n, o) {
          this.$emit('changeGgz', this.specification.length)
          if (!this.specification.length) this.childProductArray = []
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  #sku {
    margin-bottom: 20px;

    .top-mr {
      margin-top: 20px;
    }

    .box {
      display: flex;

      .text-tip {
        width: 75px;
        font-size: 14px;
        color: #999;
        padding-left: 5px;
      }

      .example {
        flex-grow: 1;
        border: 1px solid #eee;
        padding: 10px;

        .code-area {
          width: 100%;
          min-height: 300px;
          box-sizing: border-box;
          padding: 20px;
          border: 2px dashed #c00;
          font-size: 14px;
          line-height: 1.6;
        }
      }
    }

    .title {
      padding: 0 12px;
      line-height: 1;
      font-size: 18px;
      // border-left: 4px solid #50bfff;
      color: #666;
      margin: 0 0 16px 0;
      font-weight: 400;
    }

    .specification {
      // display: inline-block;
      flex-grow: 1;
      border: 1px solid #eee;
      vertical-align: top;
      padding: 10px;

      .spec-list {
        background-color: #fff;
        padding: 0;

        .item {
          margin-top: 5px;

          &:first-child {
            margin-top: 0;
          }

          .name {
            background: #f3f6fb;
            padding: 2px 8px;
            text-align: right;
            overflow: hidden;
            line-height: 40px;

            .span-label {
              float: left;
              font-size: 14px;
              color: #999;
              margin-right: 15px;
            }

            .el-select {
              float: left;
              width: 150px;
            }

            .el-checkbox {
              float: left;
              margin-left: 20px;
            }

            .icon {
              display: none;
              color: #929292;
              cursor: pointer;

              &:hover {
                color: #880000;
              }
            }

            &:hover {
              .icon {
                display: inline-block;
              }
            }
          }

          .values {
            padding: 2px 8px;
            margin: 10px 0 20px;

            .ggz-label {
              font-size: 14px;
              margin-right: 15px;
              color: #999;
            }

            .el-select {
              width: 150px;
              margin: 0 10px 0 0;
            }

            .ggz-select {
              position: relative;
              display: inline-block;
              width: 150px;
              margin-right: 10px;
              vertical-align: text-top;

              &:hover .icon-ggz {
                display: inline-block;
              }

              .ever-upload-box {
                margin-top: 10px;
              }

              /deep/ .ggz-img {
                width: 150px;
                height: 140px;
                margin-top: 10px;

                .el-upload-list__item-thumbnail {
                  width: 150px !important;
                  height: 140px !important;
                }

                img {
                  width: 145px !important;
                  height: 140px !important;
                }

                .add-img {
                  width: 150px;
                  height: 140px;
                  line-height: 140px;
                }
              }
            }

            .icon-ggz {
              position: absolute;
              right: -5px;
              top: -9px;
              cursor: pointer;
              color: #929292;
              display: none;
            }
          }
        }

        .add-spec {
          font-size: 13px;
        }
      }
    }

    .stock-table {
      width: 100%;
      padding: 0;
      border-collapse: separate;
      border-color: #dfe6ec;
      border-style: solid;
      border-width: 1px 0 0 1px;
      background-color: #fff;

      td,
      th {
        padding: 4px 10px;
        border-bottom: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
      }

      th {
        line-height: 30px;
        background-color: #eef1f6;

        .require-span {
          color: red;
          margin-right: 10px;
        }
      }

      .link {
        cursor: pointer;
        color: #0088ee;
        font-size: 13px;
        margin-left: 6px;
      }

      .wh-foot {
        line-height: 30px;

        .label {
          display: inline-block;
          vertical-align: top;
        }

        .set-list {
          display: inline-block;
          vertical-align: top;
          font-size: 0;

          .set-item {
            display: inline-block;
            vertical-align: top;
            margin-left: 15px;
            font-size: 13px;
            cursor: pointer;
            color: #0088ee;
          }
        }

        .set-form {
          display: inline-block;
          margin-left: 10px;

          .el-input {
            display: inline-block;
            width: 120px;
          }

          .set-btn {
            display: inline-block;
            padding: 0 2px;
            font-size: 15px;
            cursor: pointer;

            &.blue {
              color: #0088ee;
            }

            &.red {
              color: #cc0000;
            }
          }
        }

        .right {
          float: right;
        }

        .text {
          font-size: 13px;
        }
      }
    }

    .err-color {
      & /deep/ .el-input__inner {
        border: 1px solid red;
      }
    }
  }
</style>
