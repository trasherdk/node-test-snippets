function createChain () {
  let numbers = []

  function add (num) {
    numbers.push(num)

    return this
  }

  function then (settled) {
    return new Promise(resolve => setTimeout(() => resolve(numbers), 1000)).then(settled)
  }

  return { add, then }
}

async function main () {

  const result = await createChain().add(0).add(1).add(2)

  console.log(result)
}

main()
