// TODO parse args with yargs
if (process.argv.length < 3) {
    console.error('node-nes debugger');
    console.error('  usage:');
    console.error('    node debugger.js path/to/rom.nes');
    process.exit(1);
}

const rom = process.argv[2];
const iNes = require('./ines/ines');
const cartridge = new iNes.iNes(rom);
const CPU = require('./cpu/cpu');
const cpu = new CPU.CPU(cartridge);
cpu.program_counter = 0xc000;

const blessed = require('blessed');
const chalk = require('chalk');
const screen = blessed.screen({
    smartCSR: true,
    title: 'node-nes Debugger'
});
const {width, height} = {
    width: process.stdout.columns,
    height: process.stdout.rows
};
if (width < 79 || height < 21) {
    console.warn('Insufficient terminal size. At least 79x21 is recommended')
}

const help = blessed.box({
    top: 3,
    left: 3,
    width: 64,
    height: 9,
    content:
        ' Esc, q, Ctrl-c  => quit\n' +
        ' Space           => step\n' +
        ' Enter           => run\n' +
        ' PageUp,PageDown => scroll zero page\n' +
        ' Cursor keys     => navigate RAM (+Ctrl increases step width)\n' +
        ' f               => toggle follow PC\n' +
        ' b               => toggle break point',
    tags: true,
    border: {
        type: 'line'
    }
});
let display_help = false;

const register = blessed.box({
    top: 0,
    left: 0,
    width: 18,
    height: 8,
    tags: true,
    border: {
        type: 'line'
    }
});
screen.append(register);

const zero_page = blessed.box({
    top: 8,
    left: 0,
    width: 18,
    height: 10,
    tags: true,
    border: {
        type: 'line'
    },
    alwaysScroll: true,
    scrollable: true,
    scrollbar: {
        style: {
            bg: 'yellow'
        }
    }
});
screen.append(zero_page);
const memory = blessed.box({
    top: 0,
    left: 18,
    width: 61,
    height: 18,
    tags: true,
    border: {
        type: 'line'
    },
    alwaysScroll: true,
    scrollable: true,
    scrollbar: {
        style: {
            bg: 'yellow'
        }
    }
});
screen.append(memory);
let memory_cursor = cpu.program_counter;

const last_instruction = blessed.box({
    top: 18,
    left: 0,
    width: 79,
    height: 3,
    border: {
        type: 'line'
    }
});
screen.append(last_instruction);

let break_points = new Set([
    // 0xc5f5,
]);
const update_ui = () => {

    // registers
    const checked = (status) => {
        return status ? 'x' : ' ';
    }
    register.content =
        `A  =   ${CPU.hex(cpu.accumulator)} C[${checked(cpu.get_carry())}]\n` +
        `X  =   ${CPU.hex(cpu.index_x)} Z[${checked(cpu.get_zero())}]\n` +
        `Y  =   ${CPU.hex(cpu.index_y)} I[${checked(cpu.get_interrupt())}]\n` +
        `PC = ${CPU.hex(cpu.program_counter, 4)} D[${checked(cpu.get_decimal())}]\n` +
        `SP =   ${CPU.hex(cpu.stack_pointer)} V[${checked(cpu.get_overflow())}]\n` +
        `P  =   ${CPU.hex(cpu.status)} N[${checked(cpu.get_negative())}]`;

    // zero page
    zero_page.content = '';
    for (let i = 0xff; i >= 0; i--) {
        zero_page.content += `  ${CPU.hex(i)}: ${CPU.hex(cpu.bus.read(i))}\n`;
    }
    zero_page.content = zero_page.content.slice(0, zero_page.content.length - 1);

    // memory
    memory.content = '';
    for (let i = 0; i < 0xffff; i += 0x10) {
        memory.content += ' ';
        memory.content += `${CPU.hex(i, 4)}: `;
        for (let j = 0; j < 16; j++) {
            const value = cpu.bus.read(i + j);
            let value_string = CPU.hex(value).replace('0x', '');
            if (i + j === memory_cursor) {
                value_string = chalk.underline(value_string);
            }
            if (i + j === cpu.program_counter) {
                value_string = chalk.bgYellow(value_string);
            }
            if (break_points.has(i + j)) {
                value_string = chalk.red(value_string);
            }
            memory.content += `${value_string} `;
            if (j === 7) {
                memory.content += ' ';
            }
        }
        memory.content += '\n';
    }
    memory.content = memory.content.slice(0, memory.content.length - 1);

    // last instruction
    let instruction_color = (text) => text;
    if (cpu.halted) {
        instruction_color = chalk.red;
    }
    last_instruction.content = instruction_color(cpu.last_instruction);

    // scroll to memory cursor
    memory.scrollTo(Math.round((memory_cursor - 0x80) / 0x10));

    // render screen
    screen.render();
}
update_ui();
let follow_pc = true;
const clock = () => {
    cpu.clock();

    if (follow_pc) {
        memory_cursor = cpu.program_counter;
    }

    update_ui();
}

// zero page scrolling
screen.key(['pageup', 'pagedown'], (ch, key) => {
    switch (key.name) {
        case 'pageup':
            zero_page.scroll(-1);
            break;
        case 'pagedown':
            zero_page.scroll(1);
            break;
    }
});

// memory cursor
const update_memory_cursor = (direction) => {
    memory_cursor += direction;
    if (memory_cursor < 0) {
        memory_cursor = 0;
    }
    if (memory_cursor > 0xffff) {
        memory_cursor = 0xffff;
    }
    update_ui();
}
screen.key(['up'], () => update_memory_cursor(-0x10));
screen.key(['C-up'], () => update_memory_cursor(-0x100));
screen.key(['down'], () => update_memory_cursor(0x10));
screen.key(['C-down'], () => update_memory_cursor(0x100));
screen.key(['left'], () => update_memory_cursor(-1));
screen.key(['right'], () => update_memory_cursor(1));

// exit
screen.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
});

// help
screen.key(['f12'], () => {
    display_help = !display_help;

    if (display_help) {
        screen.append(help);
    } else {
        screen.remove(help);
    }
    screen.render();
});

// toggle follow PC
screen.key(['f'], () => {
    follow_pc = !follow_pc;
    if (follow_pc) {
        memory_cursor = cpu.program_counter;
    }
    update_ui();
});

// toggle break point
screen.key(['b'], () => {
    if (break_points.has(memory_cursor)) {
        break_points.delete(memory_cursor);
    } else {
        break_points.add(memory_cursor)
    }
    update_ui();
});

// single step
screen.key(['space'], () => {
    clock();
});

// run
screen.key(['enter'], () => {
    while (!cpu.halted && !break_points.has(cpu.program_counter)) {
        cpu.clock();
    }
    memory_cursor = cpu.program_counter;
    update_ui();
});
