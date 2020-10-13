const branch = (cpu, pc, condition) => {
    if (condition) {
        cpu.program_counter = pc;
        cpu.cycles += 1;
        // TODO one more cycle if page boundary
    }
};

const compare = (cpu, register, value) => {
    const result = register - value;
    cpu.set_carry((result >> 8) === 0x00);
    cpu.set_zero(result);
    cpu.set_negative(result);
};

module.exports = {

    // storage
    lda: (cpu, operand) => {
        cpu.accumulator = operand;
        cpu.set_zero(operand);
        cpu.set_negative(operand);
    },
    ldx: (cpu, operand) => {
        cpu.index_x = operand;
        cpu.set_zero(operand);
        cpu.set_negative(operand);
    },
    ldy: (cpu, operand) => {
        cpu.index_y = operand;
        cpu.set_zero(operand);
        cpu.set_negative(operand);
    },
    sta: (cpu, operand) => {
        cpu.bus.write(operand, cpu.accumulator);
    },
    stx: (cpu, operand) => {
        cpu.bus.write(operand, cpu.index_x);
    },
    sty: (cpu, operand) => {
        cpu.bus.write(operand, cpu.index_y);
    },

    // math

    // bitwise
    and: (cpu, operand) => {
        cpu.accumulator &= operand;
        cpu.set_zero(cpu.accumulator);
        cpu.set_negative(cpu.accumulator);
    },
    bit: (cpu, operand) => {
        const memory = cpu.bus.read(operand);

        cpu.set_zero(cpu.accumulator & memory);
        cpu.set_overflow(memory & 0b01000000);
        cpu.set_negative(memory);
    },
    eor: (cpu, operand) => {
        const memory = cpu.bus.read(operand);
        cpu.accumulator ^= memory;
    },
    ora: (cpu, operand) => {
        cpu.accumulator |= operand;

        cpu.set_zero(cpu.accumulator);
        cpu.set_negative(cpu.accumulator);
    },

    // branch
    bcc: (cpu, operand) => {
        branch(cpu, operand, !cpu.get_carry());
    },
    bcs: (cpu, operand) => {
        branch(cpu, operand, cpu.get_carry());
    },
    beq: (cpu, operand) => {
        branch(cpu, operand, cpu.get_zero());
    },
    bmi: (cpu, operand) => {
        branch(cpu, operand, cpu.get_negative());
    },
    bne: (cpu, operand) => {
        branch(cpu, operand, !cpu.get_zero());
    },
    bpl: (cpu, operand) => {
        branch(cpu, operand, !cpu.get_negative());
    },
    bvc: (cpu, operand) => {
        branch(cpu, operand, !cpu.get_overflow());
    },
    bvs: (cpu, operand) => {
        branch(cpu, operand, cpu.get_overflow());
    },

    // jump
    jmp: (cpu, operand) => {
        cpu.program_counter = operand;
    },
    jsr: (cpu, operand) => {
        const pc = cpu.program_counter;
        cpu.push_stack(pc >> 8);
        cpu.push_stack(pc & 0xff);
        cpu.program_counter = operand;
    },
    rts: (cpu, _) => {
        const low = cpu.pop_stack();
        const high = cpu.pop_stack();
        cpu.program_counter = (high << 8) + low;
    },

    // registers
    clc: (cpu, _) => {
        cpu.set_carry(false);
    },
    cld: (cpu, _) => {
        cpu.set_decimal(false);
    },
    clv: (cpu, _) => {
        cpu.set_overflow(false);
    },
    cmp: (cpu, operand) => {
        compare(cpu, cpu.accumulator, operand);
    },
    sec: (cpu, _) => {
        cpu.set_carry(true);
    },
    sed: (cpu, _) => {
        cpu.set_decimal(true);
    },
    sei: (cpu, _) => {
        cpu.set_interrupt(true);
    },

    // stack
    pha: (cpu, _) => {
        cpu.push_stack(cpu.accumulator);
    },
    php: (cpu, _) => {
        cpu.push_stack(cpu.status | 0b00010000);
    },
    pla: (cpu, _) => {
        const stack = cpu.pop_stack();
        cpu.accumulator = stack;
        cpu.set_negative(stack);
        cpu.set_zero(stack);
    },
    plp: (cpu, _) => {
        const stack = cpu.pop_stack();
        cpu.status = stack | 0b00100000;
        cpu.set_break(false);
    },

    // system
    brk: (cpu, _) => {
        cpu.halted = true;
    },
    nop: (_, __) => {
        // no operation
    },

};
