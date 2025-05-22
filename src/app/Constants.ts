
export const GRID_SNAP = 10;
export const WIRE_WIDTH = 2;
export type GateType = "and" | "or" | "not" | "nand" | "nor";

export const GateConfig = {
    "and": {
        inverted: false,
        label: "&"
    },
    "or": {
        inverted: false,
        label: "1"
    },
    "not": {
        inverted: true,
        label: "1"
    },
    "nand": {
        inverted: true,
        label: "&"
    },
    "nor": {
        inverted: true,
        label: "1"
    }
}