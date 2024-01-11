function generateRandomInteger(max: number): number {
    if (max < 0 || !Number.isInteger(max)) {
        throw new Error("Argument 'max' must be an integer greater than or equal to 0")
    }
    const bitLength = (max - 1).toString(2).length
    const shift = bitLength % 8
    const bytes = new Uint8Array(Math.ceil(bitLength / 8))
    while (true) {
        crypto.getRandomValues(bytes)
        // This zeroes bits that can be ignored to increase the chance `result` < `max`.
        // For example, if `max` can be represented with 10 bits, the leading 6 bits of the random 16 bits (2 bytes) can be ignored.
        if (shift !== 0) {
            bytes[0] &= (1 << shift) - 1
        }
        const result = bytesToInt(bytes)
        if (result < max) {
            return result
        }
    }
}
                         
function bytesToInt(bytes: Uint8Array): number {
    return parseInt(Array.from(bytes).map(byte => byte.toString(2).padStart(8, "0")).join(), 2)
}
