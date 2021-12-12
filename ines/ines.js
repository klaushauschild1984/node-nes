// http://wiki.nesdev.com/w/index.php/INES

const fs = require('fs')
const assert = require('assert')
const mapper = require('./mapper')

class iNes {
  constructor (rom_file) {
    console.log(`loading ${rom_file}`)

    const rom_data = fs.readFileSync(rom_file)

    // magic header
    assert.strictEqual(rom_data[0], 'N'.charCodeAt(0))
    assert.strictEqual(rom_data[1], 'E'.charCodeAt(0))
    assert.strictEqual(rom_data[2], 'S'.charCodeAt(0))
    assert.strictEqual(rom_data[3], 0x1a)
    console.log('  magic header \'NES\' found')

    // sizes
    this.rom_size = rom_data[4] * 16 * 1024
    console.log(`  rom size: ${this.rom_size} bytes`)
    this.chr_size = rom_data[4] * 8 * 1024
    console.log(`  rom size: ${this.chr_size} bytes`)

    // mapper
    let mapper_id = (rom_data[6] >> 4)
    mapper_id += ((rom_data[7] >> 4) << 4)
    this.mapper = mapper.mappers[mapper_id]
    console.log(`  mapper: ${this.mapper.name}`)

    this.carttridge = rom_data.slice(16)
  }

  read (address) {
    return this.mapper.read(this.carttridge, this.rom_size, address)
  }

  write (address, value) {
    return this.mapper.write(this.carttridge, this.rom_size, address, value)
  }
}

module.exports = {
  iNes
}
