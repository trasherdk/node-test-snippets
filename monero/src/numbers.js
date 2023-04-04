import BigNumber from 'bignumber.js';

const oneXMR = new BigNumber('1000000000000')

const xmrPiconero1 = new BigNumber('12345678000'); console.log(xmrPiconero1, xmrPiconero1.dividedBy(oneXMR))
const xmrPiconero2 = new BigNumber('12345678000'); console.log(xmrPiconero2, xmrPiconero2.dividedBy(oneXMR))
const xmrPiconeroResult = xmrPiconero1.plus(xmrPiconero2); console.log(xmrPiconeroResult, xmrPiconeroResult.dividedBy(oneXMR))

const [xmr, picos] = xmrPiconeroResult.dividedBy(oneXMR).toString().split('.')
console.log('XMR %s : Picos %s', xmr, picos)

const displayValue = xmr + '.' + picos.slice(0, 6)
console.log('Display:', displayValue)

const feeVal = xmrPiconeroResult.multipliedBy(0.02)
console.log('Fee:', feeVal, feeVal.dividedBy(oneXMR))

const valMinudFee = xmrPiconeroResult.minus(feeVal)
console.log('Val after fee:', valMinudFee, valMinudFee.dividedBy(oneXMR))

const check = (valMinudFee.plus(feeVal).toString() === xmrPiconeroResult.toString())
console.log('check:', check)
