// https://app.assembla.com/spaces/klaus-hauschild/subversion/source/HEAD/trunk/nesmu

const iNes = require('./ines/ines');
const Bus = require('./memory/bus');
const CPU = require('./cpu/cpu');

const cartridge = new iNes.iNes('./nestest/rom.nes');
const cpu = new CPU.CPU(cartridge);

cpu.console_log();
while (!cpu.halted) {
    cpu.clock();
    cpu.console_log();
}
