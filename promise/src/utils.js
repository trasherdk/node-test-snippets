const delay = async (second) => {
  var delaytime = second * 1000
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('done'), delaytime)
  })

  return await promise
}

export { delay }
