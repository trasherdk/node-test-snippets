const map1 = new Map([['str', new Array(6).fill(0.0)]])
const jsonFromMap = JSON.stringify(Object.fromEntries(map1))
console.log('jsonFromMap', jsonFromMap)

const map2 = new Map(Object.entries(JSON.parse(jsonFromMap)))

console.log('map1:', map1)
console.log('map2:', map2)
