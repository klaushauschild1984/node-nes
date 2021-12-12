const { status_register } = require('./cpu');

const branch = (cpu, pc, condition) => {
  if (condition) {
    cpu.program_counter = pc
    cpu.cycles += 1
    // TODO one more cycle if page boundary
  }
}

const update_flags = (cpu, value) => {
  cpu.accumulator &= 0xff
  cpu.index_x &= 0xff
  cpu.index_y &= 0xff

  cpu.set_zero((value & 0xff) === 0x00)
  cpu.set_negative((value & 0b10000000) !== 0x00)
}

const compare = (cpu, register, value) => {
  const result = register - value
  cpu.set_carry((result >> 8) === 0x00)
  update_flags(cpu, result)
}

module.exports = {

  // load
  lda: (cpu, operand) => {
    cpu.accumulator = operand
    update_flags(cpu, cpu.accumulator)
  },
  ldx: (cpu, operand) => {
    cpu.index_x = operand
    update_flags(cpu, cpu.index_x)
  },
  ldy: (cpu, operand) => {
    cpu.index_y = operand
    update_flags(cpu, cpu.index_y)
  },

  // store
  sta: (cpu, operand) => {
    cpu.bus.write(operand, cpu.accumulator)
  },
  stx: (cpu, operand) => {
    cpu.bus.write(operand, cpu.index_x)
  },
  sty: (cpu, operand) => {
    cpu.bus.write(operand, cpu.index_y)
  },

  // transfer
  tax: (cpu, _) => {
    cpu.index_x = cpu.accumulator
    update_flags(cpu, cpu.index_x)
  },
  tay: (cpu, _) => {
    cpu.index_y = cpu.accumulator
    update_flags(cpu, cpu.index_y)
  },
  txa: (cpu, _) => {
    cpu.accumulator = cpu.index_x
    update_flags(cpu, cpu.accumulator)
  },
  tya: (cpu, _) => {
    cpu.accumulator = cpu.index_y
    update_flags(cpu, cpu.accumulator)
  },
  tsx: (cpu, _) => {
    cpu.index_x = cpu.stack_pointer
    update_flags(cpu, cpu.index_x)
  },
  txs: (cpu, _) => {
    cpu.stack_pointer = cpu.index_x
  },

  // logic
  and: (cpu, operand) => {
    cpu.accumulator &= operand
    update_flags(cpu, cpu.accumulator)
  },
  ora: (cpu, operand) => {
    cpu.accumulator |= operand
    update_flags(cpu, cpu.accumulator)
  },
  eor: (cpu, operand) => {
    cpu.accumulator ^= operand
    update_flags(cpu, cpu.accumulator)
  },

  // arithmetic
  adc: (cpu, operand) => {
    let result = cpu.accumulator + operand
    if (cpu.get_carry()) {
      result += 1
    }

    cpu.set_carry((result >> 8) !== 0x00)
    cpu.set_overflow((((cpu.accumulator ^ operand) & 0x80) === 0) &&
            (((cpu.accumulator ^ result) & 0x80) !== 0))
    update_flags(cpu, result)

    cpu.accumulator = result & 0xff
  },
  sbc: (cpu, operand) => {
    let result = cpu.accumulator - operand
    if (!cpu.get_carry()) {
      result -= 1
    }

    cpu.set_carry((result >> 8) === 0x00)
    cpu.set_overflow((((cpu.accumulator ^ operand) & 0x80) !== 0) &&
            (((cpu.accumulator ^ result) & 0x80) !== 0))
    update_flags(cpu, result)

    cpu.accumulator = result & 0xff
  },
  inc: (cpu, operand) => {

  },
  dec: (cpu, operand) => {

  },
  inx: (cpu, _) => {
    cpu.index_x++
    update_flags(cpu, cpu.index_x)
  },
  iny: (cpu, _) => {
    cpu.index_y++
    update_flags(cpu, cpu.index_y)
  },
  dex: (cpu, _) => {
    cpu.index_x--
    update_flags(cpu, cpu.index_x)
  },
  dey: (cpu, _) => {
    cpu.index_y--
    update_flags(cpu, cpu.index_y)
  },

  // bitwise
  asl: (cpu, operand) => {

  },
  lsr: (cpu, operand) => {

  },
  rol: (cpu, operand) => {

  },
  ror: (cpu, operand) => {

  },

  // compare
  cmp: (cpu, operand) => {
    compare(cpu, cpu.accumulator, operand)
  },
  cpx: (cpu, operand) => {
    compare(cpu, cpu.index_x, operand)
  },
  cpy: (cpu, operand) => {
    compare(cpu, cpu.index_y, operand)
  },
  bit: (cpu, operand) => {
    const memory = cpu.bus.read(operand)
    cpu.set_negative(memory & 0b10000000)
    cpu.set_overflow(memory & 0b01000000)
    cpu.set_zero((cpu.accumulator & memory) === 0)
  },

  // jump (unconditional)
  jmp: (cpu, operand) => {
    cpu.program_counter = operand
  },
  jsr: (cpu, operand) => {
    const pc = cpu.program_counter
    cpu.push_stack(pc >> 8)
    cpu.push_stack(pc & 0xff)
    cpu.program_counter = operand
  },
  rts: (cpu, _) => {
    const low = cpu.pop_stack()
    const high = cpu.pop_stack()
    cpu.program_counter = (high << 8) + low
  },
  rti: (cpu, _) => {

  },

  // jump (conditional)
  bcc: (cpu, operand) => {
    branch(cpu, operand, !cpu.get_carry())
  },
  bcs: (cpu, operand) => {
    branch(cpu, operand, cpu.get_carry())
  },
  beq: (cpu, operand) => {
    branch(cpu, operand, cpu.get_zero())
  },
  bne: (cpu, operand) => {
    branch(cpu, operand, !cpu.get_zero())
  },
  bpl: (cpu, operand) => {
    branch(cpu, operand, !cpu.get_negative())
  },
  bmi: (cpu, operand) => {
    branch(cpu, operand, cpu.get_negative())
  },
  bvc: (cpu, operand) => {
    branch(cpu, operand, !cpu.get_overflow())
  },
  bvs: (cpu, operand) => {
    branch(cpu, operand, cpu.get_overflow())
  },

  // flag
  sec: (cpu, _) => {
    cpu.set_carry(true)
  },
  clc: (cpu, _) => {
    cpu.set_carry(false)
  },
  sei: (cpu, _) => {
    cpu.set_interrupt(true)
  },
  cli: (cpu, _) => {
    cpu.set_interrupt(false)
  },
  clv: (cpu, _) => {
    cpu.set_overflow(false)
  },
  sed: (cpu, _) => {
    cpu.set_decimal(true)
  },
  cld: (cpu, _) => {
    cpu.set_decimal(false)
  },

  // stack
  pha: (cpu, _) => {
    cpu.push_stack(cpu.accumulator)
  },
  pla: (cpu, _) => {
    cpu.accumulator = cpu.pop_stack()
    update_flags(cpu, cpu.accumulator)
  },
  php: (cpu, _) => {
    cpu.push_stack(cpu.status | 0b00010000)
  },
  plp: (cpu, _) => {
    const stack = cpu.pop_stack()
    cpu.status = stack | 0b00100000
    cpu.set_break(false)
  },

  // system
  nop: (_, __) => {
    // no operation
  },
  brk: (cpu, _) => {
    cpu.halted = true
  }

}
