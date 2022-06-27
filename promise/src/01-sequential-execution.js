import { delay } from '../../lib/utils.js'

const nameList = ['Alpha', 'Bravo', 'Charlie', 'Delta']

const hello = async (name) => {
  const time = Math.random() * 2
  await delay(time)
  const promise = new Promise((resolve, reject) => {
    resolve(`Hello ${name}`)
  })

  return promise
}

const runSeq = async () => {
  for (const name of nameList) {
    console.log('runSeq:', await hello(name))
  }
}

const runEach = () => {
  nameList.forEach(async (name) => {
    console.log('runEach:', await hello(name))
  })
}

const runMap = () => {
  nameList.map(async (name) => {
    console.log('runMap:', await hello(name))
  })
}


runSeq()
runEach()
runMap()
