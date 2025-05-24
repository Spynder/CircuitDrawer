
export const GRID_SNAP = 10;
export const WIRE_WIDTH = 2;
export type GateType = "and" | "or" | "not" | "nand" | "nor" | "D-trigger" | "JK-trigger";

interface LabelDescription {
    label: string;
    position: {x: number, y: number};
    anchor: {x: number, y: number};
    fontSize?: number;
}

interface GateDescription {
    outputs: {
        inverted: boolean;
        y: number;
    }[];
    label?: string;
    width: number;
    height: number;
    inputs?: {
        inverted: boolean;
        y: number;
    }[];
    labels?: LabelDescription[];
    lines?: {
        start: {x: number, y: number},
        end: {x: number, y: number}
    }[];
}

export const GateConfig: Record<GateType, GateDescription> = {
    "and": {
        outputs: [
            {
                inverted: false,
                y: 50
            }
        ],
        labels: [
            {
                label: "&",
                position: {x: 45, y: 5},
                anchor: {x: 1, y: 0}
            }
        ],
        width: 50,
        height: 100
    },
    "or": {
        outputs: [
            {
                inverted: false,
                y: 50
            }
        ],
        labels: [
            {
                label: "1",
                position: {x: 45, y: 5},
                anchor: {x: 1, y: 0}
            }
        ],
        width: 50,
        height: 100
    },
    "not": {
        outputs: [
            {
                inverted: true,
                y: 50
            }
        ],
        labels: [
            {
                label: "1",
                position: {x: 45, y: 5},
                anchor: {x: 1, y: 0}
            }
        ],
        width: 50,
        height: 100
    },
    "nand": {
        outputs: [
            {
                inverted: true,
                y: 50
            }
        ],
        labels: [
            {
                label: "&",
                position: {x: 45, y: 5},
                anchor: {x: 1, y: 0}
            }
        ],
        width: 50,
        height: 100
    },
    "nor": {
        outputs: [
            {
                inverted: true,
                y: 50
            }
        ],
        labels: [
            {
                label: "1",
                position: {x: 45, y: 5},
                anchor: {x: 1, y: 0}
            }
        ],
        width: 50,
        height: 100
    },
    "D-trigger": {
        inputs: [
            {
                inverted: true,
                y: 20
            },
            {
                inverted: false,
                y: 60
            },
            {
                inverted: false,
                y: 90
            },
            {
                inverted: true,
                y: 130
            },
        ],
        outputs: [
            {
                inverted: false,
                y: 40
            },
            {
                inverted: true,
                y: 110
            }
        ],
        width: 100,
        height: 150,
        labels: [
            {
                label: "TT",
                position: {x: 95, y: 5},
                anchor: {x: 1, y: 0}
            },
            {
                label: "S",
                position: {x: 15, y: 20},
                anchor: {x: 0.5, y: .5}
            },
            {
                label: "D",
                position: {x: 15, y: 60},
                anchor: {x: 0.5, y: .5}
            },
            {
                label: "C",
                position: {x: 15, y: 90},
                anchor: {x: 0.5, y: .5}
            },
            {
                label: "R",
                position: {x: 15, y: 130},
                anchor: {x: 0.5, y: .5}
            },
        ],
        lines: [
            {
                start: {x: 30, y: 0},
                end: {x: 30, y: 150}
            },
            {
                start: {x: 0, y: 40},
                end: {x: 30, y: 40}
            },
            {
                start: {x: 0, y: 110},
                end: {x: 30, y: 110}
            }
        ]
    },
    "JK-trigger": {
        outputs: [
            {
                inverted: false,
                y: 50
            }
        ],
        width: 100,
        height: 200,
        labels: [
            {
                label: "TT",
                position: {x: 95, y: 5},
                anchor: {x: 1, y: 0}
            },
            {
                label: "S",
                position: {x: 15, y: 20},
                anchor: {x: .5, y: .5}
            },
            {
                label: "J",
                position: {x: 15, y: 60},
                anchor: {x: .5, y: .5}
            },
            {
                label: "C",
                position: {x: 15, y: 100},
                anchor: {x: .5, y: .5}
            },
            {
                label: "K",
                position: {x: 15, y: 140},
                anchor: {x: .5, y: .5}
            },
            {
                label: "R",
                position: {x: 15, y: 180},
                anchor: {x: .5, y: .5}
            },
        ],
        lines: [
            {
                start: {x: 30, y: 0},
                end: {x: 30, y: 200}
            },
            {
                start: {x: 0, y: 40},
                end: {x: 30, y: 40}
            },
            {
                start: {x: 0, y: 80},
                end: {x: 30, y: 80}
            },
            {
                start: {x: 0, y: 120},
                end: {x: 30, y: 120}
            },
            {
                start: {x: 0, y: 160},
                end: {x: 30, y: 160}
            }
        ]
    }
}