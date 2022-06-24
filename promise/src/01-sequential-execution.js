
const nameList = ['Alpha', 'Bravo', 'Charlie', 'Delta']

const hello = async (name) => {
  const time = Math.random() * 10
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

runSeq()
runEach()
