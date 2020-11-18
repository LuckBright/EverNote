export const prefix = {
  platform: '/thc-platform-core/'
}
const urlMap = {
  bed: {
    getSickAreaListByCondition: { url: 'out/sickArea/getSickAreaListByCondition', prefix: prefix.platform },
    getBedListByCondition: { url: 'out/bed/getBedListByCondition', prefix: prefix.platform }
  }
}

export default urlMap
