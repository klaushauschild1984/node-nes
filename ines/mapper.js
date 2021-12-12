const mappers = [
  // 0 - NROM
  {
    name: 'NROM',
    read (cartridge, rom_size, address) {
      return cartridge[address & (rom_size - 1)]
    },
    write (cartridge, rom_size, address, value) {
      cartridge[address & (rom_size - 1)] = value
    }
  }
]

module.exports = {
  mappers
}
