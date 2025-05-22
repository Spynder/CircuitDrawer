
export const GRID_SNAP = 10;
export const WIRE_WIDTH = 2;
export type GateType = "and" | "or" | "not" | "nand" | "nor" | "D-trigger" | "JK-trigger";

interface GateDescription {
    inverted: boolean;
    label: string;
    inputs?: string;
    outputs?: string;
}

export const GateConfig: Record<GateType, GateDescription> = {
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
    },
    "D-trigger": {
        inverted: false,
        label: "TT",
        inputs: "S-DC-R",
    },
    "JK-trigger": {
        inverted: false,
        label: "TT",
        inputs: "S-&J-C-&K-R",
    }
}