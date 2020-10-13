module.exports = {
    immediate: (cpu) => {
        return cpu.read_pc();
    },

    zero_page: (cpu) => {
        const address = cpu.read_pc();
        return cpu.bus.read(address) & 0xff;
    },

    zero_page_x: (cpu) => {
        // TODO implement me
    },

    zero_page_y: (cpu) => {
        // TODO implement me
    },

    absolute: (cpu) => {
        const low = cpu.read_pc();
        const high = cpu.read_pc();
        return (high << 8) + low;
    },

    absolute_x: (cpu) => {
        // TODO implement me
    },

    absolute_y: (cpu) => {
        // TODO implement me
    },

    implied: (cpu) => {
    },

    accumulator: (cpu) => {
        // TODO implement me
    },

    indexed: (cpu) => {
        // TODO implement me
    },

    indirect: (cpu) => {
        // TODO implement me
    },

    indexed_indirect: (cpu) => {
        // TODO implement me
    },

    indirect_indexed: (cpu) => {
        // TODO implement me
    },

    relative: (cpu) => {
        const pc = cpu.read_pc();
        return cpu.program_counter + pc;
    }
};