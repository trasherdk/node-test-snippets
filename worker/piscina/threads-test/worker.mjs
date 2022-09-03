import { writeFileSync } from 'fs'

// some CPU intensive function
// the higher is baseNumber, the higher is the time elapsed
function mySlowFunction (baseNumber) {
  let result = 0
  for (let i = Math.pow(baseNumber, 7); i >= 0; i--) {
    result += Math.atan(i) * Math.tan(i)
  }
}

export default (file) => {
  try {
    mySlowFunction(parseInt(Math.random() * 10 + 1))
    writeFileSync(file, Math.random().toString())
    return null
  } catch (e) {
    return Error(e)
  }
}