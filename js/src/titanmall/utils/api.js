import axios from './http'
import { diction } from '@/store/common'

let baseURL = diction.host
let base = axios.create({
  baseURL,
  withCredentials: true,
})

let url = '/api-ih/titan-mall/'
export default { base, url, baseURL }
