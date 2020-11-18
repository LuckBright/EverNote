import axios from 'axios'

// 运算方法

// +
// const add = (a, b) => {
//   let c, d, e
//   try {
//     c = a.toString().split('.')[1].length
//   } catch (f) {
//     c = 0
//   }
//   try {
//     d = b.toString().split('.')[1].length
//   } catch (f) {
//     d = 0
//   }
//   return (
//     (e = Math.pow(10, Math.max(c, d))),
//     (enlargePrice(a, e) + enlargePrice(b, e)) / e
//   )
// }
//
// // -
// const sub = (a, b) => {
//   let c, d, e
//   try {
//     c = a.toString().split('.')[1].length
//   } catch (f) {
//     c = 0
//   }
//   try {
//     d = b.toString().split('.')[1].length
//   } catch (f) {
//     d = 0
//   }
//   return (
//     (e = Math.pow(10, Math.max(c, d))),
//     (enlargePrice(a, e) - enlargePrice(b, e)) / e
//   )
// }

// *
const enlargePrice = (a, b) => {
  let c = 0
  let d = a.toString()
  let e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) {
    // empty
  }
  try {
    c += e.split('.')[1].length
  } catch (f) {
    // empty
  }
  return (
    (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c)
  )
}

// /
const narrowPrice = (a, b) => {
  if (!a) return a.toFixed(2)
  if (!a || !b) return
  let c = 0
  let d = 0
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    //
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    //
  }
  const fenzi = Number(a.toString().replace('.', '')) * 10 ** (c + d)
  const fenmu = Number(b.toString().replace('.', '')) * 10 ** (c + d)
  return (fenzi / fenmu / 10 ** (c - d)).toFixed(2)
}

/***
 * 图片裁剪
 * imageInfo  图片原始尺寸
 * cut 图片现有尺寸
 */

function imageCut (imageInfo, cut) {
  let { width, height } = imageInfo
  if ((width, height)) {
    let arr = cut.split('x')
    if (!arr.includes('')) {
      if (
        (arr[0] - width <= 0 && arr[1] - height <= 0) ||
        (arr[0] - width >= 0 && arr[1] - height >= 0)
      ) {
        if (width - height > 0) {
          width = height * (arr[0] / arr[1])
        } else {
          height = width / (arr[0] / arr[1])
        }
      } else if (arr[0] - width <= 0 && arr[1] - height >= 0) {
        width = height * (arr[0] / arr[1])
      } else if (arr[0] - width >= 0 && arr[1] - height <= 0) {
        height = width / (arr[0] / arr[1])
      }
      cut = `${ width }x${ height }`
    }
  }
  return cut
}

const imgCut = async (url, cut) => {
  let imageInfo = await axios.get(`${ url }?imageInfo`)
  let newCut = imageCut(imageInfo, cut)
  let newUrl = `${ url }?imageMogr2/cut/${ newCut }/gravity/center`
  return newUrl
}

export default { narrowPrice, enlargePrice, imgCut }
