import { delay } from '../../lib/utils.js'

const accounts = new Map()
const ledger = []

const actions = [
  {
    name: "Alice",
    action: "deposit",
    type: 'fiat',
    amount: 150.00,
    detail: "Wanna buy crypto"
  },
  {
    name: "Bob",
    action: "deposit",
    type: 'crypto',
    amount: 1.00,
    detail: "Wanna sell crypto."
  },
  {
    name: "Exchange",
    action: "deposit",
    type: 'crypto',
    amount: 15.00,
    detail: "Got some crypto for the pool."
  },
]

// Populate the accounts
for (const account of actions) {
  accounts.set(`${account.name}:${account.type}`, { balance: 0 })
  ledger.push(`Create account for ${account.name}:${account.type}`)
}

actions.push({
  name: "Nobody",
  action: "withdraw",
  type: 'crypto',
  amount: 15.00,
  detail: "Trying to steal shit."
})

const executor = async (action) => {
  const promise = new Promise((resolve, reject) => {
    if (!accounts.has(`${action.name}:${action.type}`)) {
      reject(`Reject - Unknown account: ${action.name}:${action.type}`)
    }
  })
}
ledger.map(x => console.log(x))