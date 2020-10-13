const ram = require('./ram');

const RAM_SIZE = 0xffff;

class Bus {

    constructor(cartridge) {
        this.attached = [
            [0x0000, 0x1fff, new ram.RAM(0x0800)], // RAM
            [0x2000, 0x3fff, new ram.RAM(0x0008)], // PPU registers
            [0x4000, 0x7fff, new ram.RAM(0x0020)], // APU registers and IO
            [0x8000, 0xffff, cartridge],                // cartridge
        ];
    }

    write(address, value) {
        if (address >= 0x00 && address <= RAM_SIZE) {
            for (let i = 0; i < this.attached.length; i++) {
                const memory = this.attached[i];
                if (address >= memory[0] && address <= memory[1]) {
                    memory[2].write(address - memory[0], value);
                    break;
                }
            }
        }
    }

    read(address) {
        if (address >= 0x00 && address <= RAM_SIZE) {
            for (let i = 0; i < this.attached.length; i++) {
                const memory = this.attached[i];
                if (address >= memory[0] && address <= memory[1]) {
                    return memory[2].read(address - memory[0]);
                }
            }
        }
    }

}

module.exports = {
    RAM_SIZE,
    Bus
};
