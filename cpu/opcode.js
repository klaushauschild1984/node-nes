// http://www.6502.org/tutorials/6502opcodes.html

const instruction = require('./instruction');
const addressing = require('./addressing');

const op_codes = new Array(0xff);

// mnemonic, instruction, bytes, cycles

// storage
op_codes[0xa2] = ['LDX', instruction.ldx, addressing.immediate, 2, 2];
op_codes[0xa9] = ['LDA', instruction.lda, addressing.immediate, 2, 2];
op_codes[0x85] = ['STA', instruction.sta, addressing.zero_page, 2, 3];
op_codes[0x86] = ['STX', instruction.stx, addressing.zero_page, 2, 3];
op_codes[0x84] = ['STY', instruction.sty, addressing.zero_page, 2, 3];

// math

// bitwise
op_codes[0x29] = ['AND', instruction.and, addressing.immediate, 2, 2];
op_codes[0x24] = ['BIT', instruction.bit, addressing.zero_page, 2, 3];
op_codes[0x49] = ['EOR', instruction.eor, addressing.zero_page, 2, 2];
op_codes[0x09] = ['ORA', instruction.ora, addressing.immediate, 2, 2];

// branch
op_codes[0x90] = ['BCC', instruction.bcc, addressing.relative, 2, 2];
op_codes[0xb0] = ['BCS', instruction.bcs, addressing.relative, 2, 2];
op_codes[0xf0] = ['BEQ', instruction.beq, addressing.relative, 2, 2];
op_codes[0x30] = ['BMI', instruction.bmi, addressing.relative, 2, 2];
op_codes[0xd0] = ['BNE', instruction.bne, addressing.relative, 2, 2];
op_codes[0x10] = ['BPL', instruction.bpl, addressing.relative, 2, 2];
op_codes[0x50] = ['BVC', instruction.bvc, addressing.relative, 2, 2];
op_codes[0x70] = ['BVS', instruction.bvs, addressing.relative, 2, 2];

// jump
op_codes[0x4c] = ['JMP', instruction.jmp, addressing.absolute, 3, 3];
op_codes[0x20] = ['JSR', instruction.jsr, addressing.absolute, 3, 6];
op_codes[0x60] = ['RTS', instruction.rts, addressing.implied, 1, 6];

// registers
op_codes[0x18] = ['CLC', instruction.clc, addressing.implied, 1, 2];
op_codes[0xd8] = ['CLD', instruction.cld, addressing.implied, 1, 2];
op_codes[0xb8] = ['CLV', instruction.clv, addressing.implied, 1, 2];
op_codes[0xc9] = ['CMP', instruction.cmp, addressing.immediate, 2, 2];
op_codes[0x38] = ['SEC', instruction.sec, addressing.implied, 1, 2];
op_codes[0xf8] = ['SED', instruction.sed, addressing.implied, 1, 2];
op_codes[0x78] = ['SEI', instruction.sei, addressing.implied, 1, 2];

// stack
op_codes[0x48] = ['PHA', instruction.pha, addressing.implied, 1, 3];
op_codes[0x08] = ['PHP', instruction.php, addressing.implied, 1, 3];
op_codes[0x68] = ['PLA', instruction.pla, addressing.implied, 1, 4];
op_codes[0x28] = ['PLP', instruction.plp, addressing.implied, 1, 4];

// system
op_codes[0x00] = ['BRK', instruction.brk, addressing.immediate, 2, 7];
op_codes[0xea] = ['NOP', instruction.nop, addressing.implied, 1, 2];

module.exports = {
    op_codes
};
