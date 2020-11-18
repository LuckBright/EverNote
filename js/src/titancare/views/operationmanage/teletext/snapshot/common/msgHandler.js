// 消息解析
import { jsonParse } from './utils'
import { MSGTYPE } from './config'
import MsgClass from './msgClass'

export const msgHandler = (data, info) => {
  const resultData = []
  data.forEach(item => {
    const itemObj = jsonParse(item.msg)
    if (itemObj.MsgBody[0].MsgType === MSGTYPE.TEXT) { // 文本/表情
      resultData.push(new MsgClass(itemObj.MsgBody[0].MsgType, itemObj.MsgRandom, itemObj.MsgTimeStamp, itemObj.MsgSeq, item.groupId, itemObj.From_Account, info[itemObj.From_Account].msgNick, info[itemObj.From_Account].msgHeadurl, 0, itemObj.MsgBody[0].MsgContent.Text, item.msgTimeStamp))
    } else if (itemObj.MsgBody[0].MsgType === MSGTYPE.IMAGE) { // 图片
      const tempArr = []
      itemObj.MsgBody[0].MsgContent.ImageInfoArray.forEach(image => {
        tempArr.push(`${image.URL}`)
        // tempArr.push(`${localStorage.getItem('baseImageUrl')}${image.URL}`)
      })
      resultData.push(new MsgClass(itemObj.MsgBody[0].MsgType, itemObj.MsgRandom, itemObj.MsgTimeStamp, itemObj.MsgSeq, item.groupId, itemObj.From_Account, info[itemObj.From_Account].msgNick, info[itemObj.From_Account].msgHeadurl, 0, tempArr, item.msgTimeStamp))
    } else if (itemObj.MsgBody[0].MsgType === MSGTYPE.AUDIO) { // 语音
      resultData.push(new MsgClass(itemObj.MsgBody[0].MsgType, itemObj.MsgRandom, itemObj.MsgTimeStamp, itemObj.MsgSeq, item.groupId, itemObj.From_Account, info[itemObj.From_Account].msgNick, info[itemObj.From_Account].msgHeadurl, 0, {
        second: itemObj.MsgBody[0].MsgContent.Second,
        url: `${itemObj.MsgBody[0].MsgContent.Url}`
        // url: `${localStorage.getItem('baseImageUrl')}${itemObj.MsgBody[0].MsgContent.Url}`
      }, item.msgTimeStamp))
    } else if (itemObj.MsgBody[0].MsgType === MSGTYPE.CUSTOM) { // 自定义
      resultData.push(new MsgClass(itemObj.MsgBody[0].MsgType, itemObj.MsgRandom, itemObj.MsgTimeStamp, itemObj.MsgSeq, item.groupId, itemObj.From_Account, info[itemObj.From_Account].msgNick, info[itemObj.From_Account].msgHeadurl, 0, itemObj.MsgBody[0].MsgContent.Data, item.msgTimeStamp))
    }
  })
  return resultData
}
