// http://www.6502.org/tutorials/6502opcodes.html
// https://www.c64-wiki.de/wiki/%C3%9Cbersicht_6502-Assemblerbefehle

const instruction = require('./instruction')
const addressing = require('./addressing')

const op_codes = new Array(0xff)
// op_codes[address] = [mnemonic, instruction, bytes, cycles]

// load
op_codes[0xa9] = ['LDA', instruction.lda, addressing.immediate, 2, 2]
op_codes[0xad] = ['LDA', instruction.lda, addressing.absolute, 3, 4]
op_codes[0xbd] = ['LDA', instruction.lda, addressing.absolute_x, 3, 4]
op_codes[0xb9] = ['LDA', instruction.lda, addressing.absolute_y, 3, 4]
op_codes[0xa5] = ['LDA', instruction.lda, addressing.zero_page, 2, 3]
op_codes[0xb5] = ['LDA', instruction.lda, addressing.zero_page_x, 2, 4]
op_codes[0xa1] = ['LDA', instruction.lda, addressing.indirect_indexed, 2, 6]
op_codes[0xb1] = ['LDA', instruction.lda, addressing.indexed_indirect, 2, 5]
op_codes[0xa2] = ['LDX', instruction.ldx, addressing.immediate, 2, 2]
op_codes[0xae] = ['LDX', instruction.ldx, addressing.absolute, 3, 4]
op_codes[0xbe] = ['LDX', instruction.ldx, addressing.absolute_y, 3, 4]
op_codes[0xa6] = ['LDX', instruction.ldx, addressing.zero_page, 2, 3]
op_codes[0xb6] = ['LDX', instruction.ldx, addressing.zero_page_y, 2, 4]
op_codes[0xa0] = ['LDY', instruction.ldy, addressing.immediate, 2, 2]
op_codes[0xac] = ['LDY', instruction.ldy, addressing.absolute, 3, 4]
op_codes[0xbc] = ['LDY', instruction.ldy, addressing.absolute_x, 3, 4]
op_codes[0xa4] = ['LDY', instruction.ldy, addressing.zero_page, 2, 3]
op_codes[0xb4] = ['LDY', instruction.ldy, addressing.zero_page_x, 2, 4]

// store
op_codes[0x8d] = ['STA', instruction.sta, addressing.absolute, 3, 4]
op_codes[0x9d] = ['STA', instruction.sta, addressing.absolute_x, 3, 5]
op_codes[0x99] = ['STA', instruction.sta, addressing.absolute_y, 3, 5]
op_codes[0x85] = ['STA', instruction.sta, addressing.zero_page, 2, 3]
op_codes[0x81] = ['STA', instruction.sta, addressing.indirect_indexed, 2, 3]
op_codes[0x91] = ['STA', instruction.sta, addressing.indexed_indirect, 2, 6]
op_codes[0x8e] = ['STX', instruction.stx, addressing.absolute, 3, 4]
op_codes[0x86] = ['STX', instruction.stx, addressing.zero_page, 2, 3]
op_codes[0x96] = ['STX', instruction.stx, addressing.zero_page_y, 2, 4]
op_codes[0x8c] = ['STY', instruction.sty, addressing.absolute, 3, 4]
op_codes[0x84] = ['STY', instruction.sty, addressing.zero_page, 2, 3]
op_codes[0x94] = ['STY', instruction.sty, addressing.zero_page_x, 2, 4]

// transfer
op_codes[0xaa] = ['TAX', instruction.tax, addressing.implied, 1, 2]
op_codes[0xa8] = ['TAY', instruction.tay, addressing.implied, 1, 2]
op_codes[0x8a] = ['TXA', instruction.txa, addressing.implied, 1, 2]
op_codes[0x98] = ['TYA', instruction.tya, addressing.implied, 1, 2]
op_codes[0xba] = ['TSX', instruction.tsx, addressing.implied, 1, 2]
op_codes[0x9a] = ['TXS', instruction.txs, addressing.implied, 1, 2]

// logic
op_codes[0x29] = ['AND', instruction.and, addressing.immediate, 2, 2]
op_codes[0x09] = ['ORA', instruction.ora, addressing.immediate, 2, 2]
op_codes[0x49] = ['EOR', instruction.eor, addressing.immediate, 2, 2]

// arithmetic
op_codes[0x69] = ['ADC', instruction.adc, addressing.immediate, 2, 2]
op_codes[0x6d] = ['ADC', instruction.adc, addressing.absolute, 3, 4]
op_codes[0x7d] = ['ADC', instruction.adc, addressing.absolute_x, 3, 4]
op_codes[0x79] = ['ADC', instruction.adc, addressing.absolute_y, 3, 4]
op_codes[0x65] = ['ADC', instruction.adc, addressing.zero_page, 2, 3]
op_codes[0x75] = ['ADC', instruction.adc, addressing.zero_page_x, 2, 4]
op_codes[0x61] = ['ADC', instruction.adc, addressing.indirect_indexed, 2, 6]
op_codes[0x71] = ['ADC', instruction.adc, addressing.indexed_indirect, 2, 5]
op_codes[0xe9] = ['SBC', instruction.sbc, addressing.immediate, 2, 2]
op_codes[0xed] = ['SBC', instruction.sbc, addressing.absolute, 3, 4]
op_codes[0xfd] = ['SBC', instruction.sbc, addressing.absolute_x, 3, 4]
op_codes[0xf9] = ['SBC', instruction.sbc, addressing.absolute_y, 3, 4]
op_codes[0xe5] = ['SBC', instruction.sbc, addressing.zero_page, 2, 3]
op_codes[0xf5] = ['SBC', instruction.sbc, addressing.zero_page_x, 2, 4]
op_codes[0xe1] = ['SBC', instruction.sbc, addressing.indirect_indexed, 2, 6]
op_codes[0xf1] = ['SBC', instruction.sbc, addressing.indexed_indirect, 2, 5]
// INC
// DEC
op_codes[0xe8] = ['INX', instruction.inx, addressing.implied, 1, 2]
op_codes[0xc8] = ['INY', instruction.iny, addressing.implied, 1, 2]
op_codes[0xca] = ['DEX', instruction.dex, addressing.implied, 1, 2]
op_codes[0x88] = ['DEY', instruction.dey, addressing.implied, 1, 2]

// bitwise
// ASL
// RSL
// ROL
// ROR

// compare
op_codes[0xc9] = ['CMP', instruction.cmp, addressing.immediate, 2, 2]
op_codes[0xe0] = ['CPX', instruction.cpx, addressing.immediate, 2, 2]
op_codes[0xc0] = ['CPY', instruction.cpy, addressing.immediate, 2, 2]
op_codes[0x24] = ['BIT', instruction.bit, addressing.zero_page, 2, 3]

// jump (unconditional)
op_codes[0x4c] = ['JMP', instruction.jmp, addressing.absolute, 3, 3]
op_codes[0x20] = ['JSR', instruction.jsr, addressing.absolute, 3, 6]
op_codes[0x60] = ['RTS', instruction.rts, addressing.implied, 1, 6]
op_codes[0x40] = ['RTI', instruction.rti, addressing.implied, 1, 6]

// jump (conditional)
op_codes[0x90] = ['BCC', instruction.bcc, addressing.relative, 2, 2]
op_codes[0xb0] = ['BCS', instruction.bcs, addressing.relative, 2, 2]
op_codes[0xf0] = ['BEQ', instruction.beq, addressing.relative, 2, 2]
op_codes[0xd0] = ['BNE', instruction.bne, addressing.relative, 2, 2]
op_codes[0x10] = ['BPL', instruction.bpl, addressing.relative, 2, 2]
op_codes[0x30] = ['BMI', instruction.bmi, addressing.relative, 2, 2]
op_codes[0x50] = ['BVC', instruction.bvc, addressing.relative, 2, 2]
op_codes[0x70] = ['BVS', instruction.bvs, addressing.relative, 2, 2]

// flags
op_codes[0x38] = ['SEC', instruction.sec, addressing.implied, 1, 2]
op_codes[0x18] = ['CLC', instruction.clc, addressing.implied, 1, 2]
op_codes[0x78] = ['SEI', instruction.sei, addressing.implied, 1, 2]
op_codes[0x58] = ['CLI', instruction.cli, addressing.implied, 1, 2]
op_codes[0xb8] = ['CLV', instruction.clv, addressing.implied, 1, 2]
op_codes[0xf8] = ['SED', instruction.sed, addressing.implied, 1, 2]
op_codes[0xd8] = ['CLD', instruction.cld, addressing.implied, 1, 2]

// stack
op_codes[0x48] = ['PHA', instruction.pha, addressing.implied, 1, 3]
op_codes[0x68] = ['PLA', instruction.pla, addressing.implied, 1, 4]
op_codes[0x08] = ['PHP', instruction.php, addressing.implied, 1, 3]
op_codes[0x28] = ['PLP', instruction.plp, addressing.implied, 1, 4]

// system
op_codes[0xea] = ['NOP', instruction.nop, addressing.implied, 1, 2]
op_codes[0x00] = ['BRK', instruction.brk, addressing.immediate, 2, 7]

module.exports = {
  op_codes
}
