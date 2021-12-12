module.exports = {
    immediate: (cpu, operands) => {
        return operands[0];
    },

    zero_page: (cpu, operands) => {
        const address = operands[0];
        return cpu.bus.read(address) & 0xff;
    },

    zero_page_x: (cpu, operands) => {
        // TODO implement me
    },

    zero_page_y: (cpu, operands) => {
        // TODO implement me
    },

    absolute: (cpu, operands) => {
        const low = operands[0];
        const high = operands[1];
        return (high << 8) + low;
    },

    absolute_x: (cpu, operands) => {
        // TODO implement me
    },

    absolute_y: (cpu, operands) => {
        // TODO implement me
    },

    implied: (cpu, operands) => {
        // nothing to do
    },

    accumulator: (cpu, operands) => {
        // TODO implement me
    },

    indexed: (cpu, operands) => {
        // TODO implement me
    },

    indirect: (cpu, operands) => {
        // TODO implement me
    },

    indexed_indirect: (cpu, operands) => {
        // TODO implement me
    },

    indirect_indexed: (cpu, operands) => {
        // TODO implement me
    },

    relative: (cpu, operands) => {
        const address = operands[0];
        return cpu.program_counter + address;
    }
};
