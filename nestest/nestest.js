// https://wiki.nesdev.com/w/index.php/Emulator_tests

const iNes = require('./../ines/ines');
const CPU = require('./../cpu/cpu');

const cartridge = new iNes.iNes('./nestest/rom.nes');
const cpu = new CPU.CPU(cartridge);
cpu.program_counter = 0xc000;

const assert_register = (line, start, length, register, display, name) => {
    const value = parseInt(Number(`0x${line.slice(start, start + length).toLowerCase()}`), 10);
    if (register !== value) {
        console.error(`expected ${name} to be ${display(register, length)}, but was ${display(value, length)}`);
        process.exit(1);
    }
};

const fs = require('fs');
const lines = fs.readFileSync('./nestest/log.txt').toString().split('\n');
let passed = 0;
for (const line of lines) {
    console.log(`${passed + 1}: ${line}`);
    cpu.console_log();
    console.log(`${(passed / lines.length).toFixed(2)}% passed`);
    console.log('');

    assert_register(line, 0, 4, cpu.program_counter, CPU.hex, 'PC');
    assert_register(line, 50, 2, cpu.accumulator, CPU.hex, 'A');
    assert_register(line, 55, 2, cpu.index_x, CPU.hex, 'X');
    assert_register(line, 60, 2, cpu.index_y, CPU.hex, 'Y');
    assert_register(line, 65, 2, cpu.status, CPU.bin, 'P');
    assert_register(line, 71, 2, cpu.stack_pointer, CPU.hex, 'SP');
    // const cycles = parseInt(line.slice(78, 81)) / 3;
    // if (cpu.cycles != cycles) {
    //     console.error(`Cycles: ${cpu.cycles} <-> ${cycles}`);
    //     process.exit(1);
    // }

    cpu.clock();
    passed += 1;
}
