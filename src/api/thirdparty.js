import moment from 'moment'
import axios from 'axios'

const service = axios.create()

// 獲取weather
export function getWeather () {
  //   let now = moment(new Date())
  //   let later = moment(new Date()).add(8, 'hours')
  //   console.log(
  //     now.format('YYYY-MM-DDTHH:mm:ss'),
  //     later.format('YYYY-MM-DDTHH:mm:ss')
  //   )
  return service({
    url: `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-6ECF8970-4CD7-4AE7-841F-8A2F71293631`,
    method: 'get'
  })
}

export function Commits () {
  return service({
    url:
      'https://api.github.com/repos/FatSong207/sh-admin-backend/commits?page=0',
    method: 'get'
  })
}
