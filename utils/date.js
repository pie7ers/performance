/*
    Day Input refers a day you want to advance or go back in the time its say
    if inputDay = 1 then the date would be tomorrow (today + 1 day)
    if inputDay = 2 then the date would be two days after today (today + 2 day)
    if inputDay = -1 then the date would be yesterday (today - 1 day)
*/
export function getPartsDate(inputDay) {
  let myDate = new Date()

  if (inputDay !== undefined) {
    myDate = new Date(myDate.getTime() + inputDay * 24 * 60 * 60 * 1000)
  }

  let day = String(myDate.getDate()).padStart(2, '0')
  let month = String(myDate.getMonth() + 1).padStart(2, '0')
  let year = myDate.getFullYear()
  let hour = String(myDate.getHours()).padStart(2, '0')
  let minutes = String(myDate.getMinutes()).padStart(2, '0')
  let seconds = String(myDate.getSeconds()).padStart(2, '0')
  let getTimeLong = myDate.getTime()

  return {
    day,
    month,
    year,
    hour,
    minutes,
    seconds,
    getTimeLong
  }
}

export function getFullDateText(colon = false) {
  let date = getPartsDate()
  return colon ? `${date.day}-${date.month}-${date.year}_${date.hour}:${date.minutes}:${date.seconds}`
    : `${date.day}-${date.month}-${date.year}_H${date.hour}-M${date.minutes}-S${date.seconds}`
}

export function getDateMMDDYYYY() {
  let date = getPartsDate()
  return `${date.month}-${date.day}-${date.year}`
}