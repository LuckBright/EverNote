/*
 * @Author: renpengfei
 * @Date: 2019-03-06 14:04:06
 * @Last Modified by: renpengfei
 * @Last Modified time: 2019-03-06 14:32:04
 */
import fetch from '@/rcm/store/api'
const benefitPriorityUrl = '/ar/benefitPriority/'
export const findAll = (data) => {
  return fetch({
    url: `${benefitPriorityUrl}findAll`,
    method: 'post',
    data: data
  })
}
export const update = (data) => {
  return fetch({
    url: `${benefitPriorityUrl}update`,
    method: 'post',
    data: data
  })
}
