class RAM {
  constructor (size) {
    this.data = new Array(size)
    this.data.fill(0)
  }

  read (address) {
    if (address >= 0x00 && address <= this.data.length) {
      return this.data[address]
    }
  }

  write (address, value) {
    if (address >= 0x00 && address <= this.data.length) {
      this.data[address] = value & 0xff
    }
  }
}

module.exports = {
  RAM
}
