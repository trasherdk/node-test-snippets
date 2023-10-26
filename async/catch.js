/**
 * Testing Async/Await & Try/Catch
 * Here the test2() is the happy path.
 */
const willReject = async () => {
  throw new Error('Up yours! - Love JavaScript')
}

const test1 = async () => {
  try {
    return willReject()
      .then(res => res)
      .catch(reason => {
        console.log('test1: then -> catch:', reason.message)
        return reason.message
      })
  } catch (reason) {
    console('test1: try -> catch (got hit!):', reason)
  }
}

const test2 = async () => {
  try {
    return await willReject()
  } catch (reason) {
    console.log('test2: try -> catch (got hit!):', reason.message)
    return reason.message
  }
}

try {
  console.log('call test1 ==>')
  console.log('call test1:', await test1())
} catch (what) {
  console.log('call test1: try -> catch:', what.message)
}

try {
  console.log('call test2 ==>')
  console.log('call test2:', await test2())
} catch (what) {
  console.log('call test2: try -> catch:', what.message)
}
