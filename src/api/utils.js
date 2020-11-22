const moment = require('moment')
// check if timestamp is older than mins entered
exports.verifyTimeStamp = (timeStamp, mins) => {
  // console.log('verify')
  const d1 = new moment(timeStamp)
  const d2 = new moment()
  // subract time1 from time 2
  const diff = moment.duration(d2.diff(d1)).asMinutes()
  // console.log('diff', diff)
  // console.log('mins', mins)
  // less than 30 mins true, else false
  return diff < mins ? true : false
}
// returns a promise
exports.httpReq = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data
    })
}
