
export function getNowDate() {
  var now = new Date()
  return now.getFullYear() + '-' + (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' + now.getDate() : now.getDate())
}

export function getTomorrowDate() {
  var nowdate = new Date()
  nowdate.setDate(nowdate.getDate() + 1)
  var y = nowdate.getFullYear()
  var m = nowdate.getMonth() + 1 < 10 ? '0' + (nowdate.getMonth() + 1) : nowdate.getMonth() + 1
  var d = nowdate.getDate() < 10 ? '0' + nowdate.getDate() : nowdate.getDate()
  var formatwdate = y + '-' + m + '-' + d
  return formatwdate
}
