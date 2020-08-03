import axios from 'axios'

const Api = () => {
  return axios.create({
    baseURL: '/api',
  })
}

export default Api
