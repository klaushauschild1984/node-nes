// https://wiki.nesdev.com/w/index.php/Emulator_tests

const iNes = require('./../ines/ines')
const CPU = require('./../cpu/cpu')

const cartridge = new iNes.iNes('./nestest/rom.nes')
const cpu = new CPU.CPU(cartridge)
cpu.program_counter = 0xc000

const assertRegister = (line, start, length, register, display, name) => {
  const value = parseInt(Number(`0x${line.slice(start, start + length).toLowerCase()}`), 10)
  if (register !== value) {
    console.error(`expected ${name} to be ${display(value, length)}, but was ${display(register, length)}`)
    process.exit(1)
  }
}

const fs = require('fs')
const lines = fs.readFileSync('./nestest/log.txt').toString().split('\n')
let passed = 0
for (const line of lines) {
  cpu.console_log()
  console.log(`${passed + 1}: ${line}`)

  assertRegister(line, 0, 4, cpu.program_counter, CPU.hex, 'PC')
  assertRegister(line, 50, 2, cpu.accumulator, CPU.hex, 'A')
  assertRegister(line, 55, 2, cpu.index_x, CPU.hex, 'X')
  assertRegister(line, 60, 2, cpu.index_y, CPU.hex, 'Y')
  assertRegister(line, 65, 2, cpu.status, CPU.bin, 'P')
  assertRegister(line, 71, 2, cpu.stack_pointer, CPU.hex, 'SP')
  // const cycles = parseInt(line.slice(78, 81)) / 3
  // if (cpu.cycles % 341 != cycles) {
  //     console.error(`Cycles: ${cpu.cycles} <-> ${cycles}`)
  //     process.exit(1)
  // }

  cpu.clock()

  console.log(`${(passed / lines.length * 100).toFixed(2)}% passed`)
  console.log('')
  passed += 1
}
