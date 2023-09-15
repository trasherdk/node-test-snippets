import { sha256 } from '@noble/hashes/sha256'
import { keccak_256 } from '@noble/hashes/sha3'
import { hexToBytes } from '@noble/hashes/utils'
import { base58 } from '@scure/base'

export function generatePaymentIdFromString (str: string): string {
  const hash = sha256(str)
  const bytes = new Uint8Array(hash.slice(0, 8)) // take the first 8 bytes of the hash
  return Array.from(bytes, (byte) => ('0' + byte.toString(16)).slice(-2)).join('') // convert the byte array to a hex string
}

export function generateIntegratedAddress (
  moneroAddress: string,
  paymentId: string
): string {
  // Get public spend key and public view key from Monero address
  const decodedMainAddress = base58.decode(moneroAddress)

  // Remove first byte
  const byteRemovedAddress = decodedMainAddress.slice(1, decodedMainAddress.length)

  // Get public keys
  const publicSpendKey = byteRemovedAddress.slice(0, 32)
  const publicViewKey = byteRemovedAddress.slice(32, 64)

  // Convert payment ID to bytes
  const bytePaymentId = hexToBytes(paymentId)

  // Calculate checksum
  const data = new Uint8Array([0x13, ...publicSpendKey, ...publicViewKey, ...bytePaymentId])
  const checksum = keccak_256(data).slice(0, 4)

  // Concatenate everything and convert to base58
  const bytes = new Uint8Array([...data, ...checksum])
  return moneroBase58EncodeForIntegratedAddress(bytes)
}

function moneroBase58EncodeForIntegratedAddress (byteArray: Uint8Array) {
  // split the byte array into 8-byte blocks
  const blocks = []
  for (let i = 0; i < byteArray.length; i += 8) {
    if (blocks.length < 9) {
      blocks.push(byteArray.slice(i, i + 8))
    } else {
      blocks.push(byteArray.slice(-5))
    }
  }

  const encodedBlocks = blocks.map((block, index) => {
    const encodedBlock = base58.encode(block)
    if (index === blocks.length - 1) {
      return encodedBlock.padStart(7, '1')
    } else if (encodedBlock.length < 11) {
      return encodedBlock.padStart(11, '1')
    } else {
      return encodedBlock
    }
  })

  return encodedBlocks.join('')
}

