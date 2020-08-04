import axios from 'axios'

const Api = () => {
  return axios.create({
    baseURL: '/api',
  })
}

export const fetcher = (url) =>
  Api()
    .get(url)
    .then((res) => res.data)

export default Api
