const delay = async (second) => {
  var delaytime = second * 1000
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('done'), delaytime)
  })

  return await promise
}

// method to trim down to decimal.
function trimToDecimalPlaces (number, precision) {
  const array = number.toString().split('.');
  array.push(array.pop().substring(0, precision));
  const trimmedstr = array.join('.');
  return parseFloat(trimmedstr);
}

export {
  delay,
  trimToDecimalPlaces
}
