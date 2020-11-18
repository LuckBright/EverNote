import { warehouse as axios } from './api'
const url = 'drugCategory/'
function getById (id) {
  return axios.post(url + 'getDrugCategoryInfo/', {
    id
  }).then(result => {
    result.category = [result.categoryOne, result.categoryTwo, result.categoryThree].filter(v => {
      return v
    })
    result.atcCategory = [result.atcCategoryOne, result.atcCategoryTwo].filter(v => {
      return v
    })
    return result
  })
}

function createOrUpdate (drug) {
  drug.categoryOne = drug.category[0] || 0
  drug.categoryTwo = drug.category[1] || 0
  drug.categoryThree = drug.category[2] || 0
  drug.atcCategoryOne = drug.atcCategory[0] || 0
  drug.atcCategoryTwo = drug.atcCategory[1] || 0
  var path = drug.id ? 'updateDrugCategory' : 'createDrugCategory'
  return axios.post(url + path + '/', drug)
}

function del (id) {
  return axios.post(url + 'updateDrugCategory/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  var postParam = {}
  for (var key in params) {
    if (params[key]) {
      postParam[key] = params[key]
    }
  }
  return await axios.post(url + 'getDrugCategoryList/', postParam)
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
