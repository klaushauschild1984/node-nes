const Bus = require('./../memory/bus')
const opcode = require('./opcode')

const status_register = {

  CARRY: 0b00000001,
  ZERO: 0b00000010,
  INTERRUPT_DISABLE: 0b00000100,
  DECIMAL: 0b00001000,
  BREAK: 0b00010000,
  ALWAYS_ONE: 0b00100000,
  OVERFLOW: 0b01000000,
  NEGATIVE: 0b10000000

}

class CPU {
  constructor (cartridge) {
    this.bus = new Bus.Bus(cartridge)

    this.program_counter = this.bus.read(0xfffd) << 16 + this.bus.read(0xfffc)
    this.stack_pointer = 0xfd

    this.accumulator = 0x00
    this.index_x = 0x00
    this.index_y = 0x00

    // NV1B DIZC
    // |||| |||+- Carry
    // |||| ||+-- Zero
    // |||| |+--- Interrupt disable
    // |||| +---- Decimal
    // |||+------ Break
    // ||++------ always 1
    // |+-------- oVerflow
    // +--------- Negative
    this.status =
            status_register.ALWAYS_ONE |
            status_register.INTERRUPT_DISABLE

    this.cycles = 0

    this.halted = false

    this.last_instruction = ''
  }

  clock () {
    if (this.halted) {
      return
    }

    const pc = this.read_pc()
    const op_code = opcode.op_codes[pc]
    if (op_code === undefined) {
      throw new Error(`unknown opcode: ${hex(pc)}`)
    }

    const mnemonic = op_code[0]
    const instruction = op_code[1]
    const addressing = op_code[2]
    const bytes = op_code[3]
    const cycles = op_code[4]

    if (instruction === undefined) {
      throw new Error(`undefined instruction for opcode ${mnemonic}`)
    }

    const operands = new Array(bytes - 1)
    for (let i = 0; i < operands.length; i++) {
      operands[i] = this.read_pc()
    }
    operands.reverse()
    this.last_instruction = `${mnemonic} [${operands.map(o => hex(o))}] (${cycles} cycles)`
    operands.reverse()

    this.cycles += cycles
    const operand = addressing(this, operands)
    instruction(this, operand)
  }

  read_pc () {
    const byte = this.bus.read(this.program_counter)
    this.program_counter += 1
    this.program_counter &= 0xffff
    return byte
  }

  push_stack (value) {
    this.bus.write(this.stack_pointer, value)
    this.stack_pointer -= 1
  }

  pop_stack () {
    this.stack_pointer += 1
    return this.bus.read(this.stack_pointer)
  }

  get_carry () {
    return (this.status & status_register.CARRY) !== 0x00
  }

  set_carry (carry) {
    this.status = bit_mask(this.status, status_register.CARRY, carry)
  }

  get_zero () {
    return (this.status & status_register.ZERO) !== 0x00
  }

  set_zero (zero) {
    this.status = bit_mask(this.status, status_register.ZERO, zero)
  }

  get_interrupt () {
    return (this.status & status_register.INTERRUPT_DISABLE) !== 0x00
  }

  set_interrupt (interrupt) {
    this.status = bit_mask(this.status, status_register.INTERRUPT_DISABLE, interrupt)
  }

  get_decimal () {
    return (this.status & status_register.DECIMAL) !== 0x00
  }

  set_decimal (decimal) {
    this.status = bit_mask(this.status, status_register.DECIMAL, decimal)
  }

  set_break (flag) {
    this.status = bit_mask(this.status, status_register.BREAK, flag)
  }

  get_overflow () {
    return (this.status & status_register.OVERFLOW) !== 0x00
  }

  set_overflow (overflow) {
    this.status = bit_mask(this.status, status_register.OVERFLOW, overflow)
  }

  get_negative () {
    return (this.status & status_register.NEGATIVE) !== 0x00
  }

  set_negative (negative) {
    this.status = bit_mask(this.status, status_register.NEGATIVE, negative)
  }

  console_log () {
    console.log('CPU { ' +
            `PC: ${hex(this.program_counter, 4)}, ` +
            `A: ${hex(this.accumulator)}, ` +
            `X: ${hex(this.index_x)}, ` +
            `Y: ${hex(this.index_y)}, ` +
            `P: ${hex(this.status)}, ` +
            `SP: ${hex(this.stack_pointer)}, ` +
            `CYC: ${this.cycles * 3}` +
            ' }')
  }
}

const bit_mask = (value, mask, set) => {
  return set
    ? value | mask
    : value & ~mask
}

const bin = (value) => {
  return `0b${value.toString(2).padStart(8, '0')}`
}

const hex = (value, pad = 2) => {
  if (value === undefined) {
    return '0xXX'
  }
  return `0x${value.toString(16).padStart(pad, '0')}`
}

module.exports = {
  CPU,
  bin,
  hex
}
