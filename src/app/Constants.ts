
export const GRID_SNAP = 10;
export const WIRE_WIDTH = 2;
export type GateType = "and" | "or" | "not" | "nand" | "nor" |
    "D-trigger" | "JK-trigger" |
    "SP" | "Inverter" | "Overflow" | "DC" |
    "CORR";

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
    name?: string;
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
        name: "И",
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
        name: "ИЛИ",
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
        name: "НЕ",
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
        name: "И-НЕ",
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
        name: "ИЛИ-НЕ",
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
        name: "D-триггер",
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
        name: "JK-триггер",
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
    },
    "SP": {
        inputs: [
            {
                inverted: false,
                y: 20
            },
            {
                inverted: false,
                y: 70
            },
            {
                inverted: false,
                y: 130
            },
        ],
        outputs: [
            {
                inverted: false,
                y: 20
            },
            {
                inverted: false,
                y: 130
            }
        ],
        name: "SP",
        width: 100,
        height: 150,
        labels: [
            {
                label: "P",
                position: {x: 95, y: 5},
                anchor: {x: 1, y: 0}
            },
            {
                label: "S",
                position: {x: 95, y: 145},
                anchor: {x: 1, y: 1}
            },
            {
                label: "SM",
                position: {x: 40, y: 5},
                anchor: {x: .5, y: 0}
            }
        ],
        lines: [
            {
                start: {x: 75, y: 0},
                end: {x: 75, y: 150}
            },
        ]
    },
    "Inverter": {
        inputs: [
            {
                inverted: false,
                y: 30
            },
            {
                inverted: false,
                y: 60
            },
            {
                inverted: false,
                y: 80
            },
            {
                inverted: false,
                y: 100
            },
            {
                inverted: false,
                y: 120
            }
        ],
        name: "Пр",
        outputs: [
            {
                inverted: false,
                y: 60
            },
            {
                inverted: false,
                y: 80
            },
            {
                inverted: false,
                y: 100
            },
            {
                inverted: false,
                y: 120
            }
        ],
        width: 100,
        height: 150,
        labels: [
            {
                label: "Пр",
                position: {x: 50, y: 5},
                anchor: {x: .5, y: 0}
            }
        ],
    },
    "Overflow": {
        inputs: [
            {
                inverted: false,
                y: 20
            },
            {
                inverted: false,
                y: 50
            },
            {
                inverted: false,
                y: 80
            },
        ],
        name: "Пер",
        outputs: [
            {
                inverted: false,
                y: 50
            }
        ],
        width: 50,
        height: 100,
        labels: [
            {
                label: "Пер",
                position: {x: 25, y: 5},
                anchor: {x: .5, y: 0}
            }
        ],
    },
    "DC": {
        inputs: [
            {
                inverted: false,
                y: 20
            },
            {
                inverted: false,
                y: 40
            },
            {
                inverted: false,
                y: 60
            },
            {
                inverted: false,
                y: 80
            },

            
            {
                inverted: false,
                y: 120
            },
            {
                inverted: false,
                y: 140
            },
            {
                inverted: false,
                y: 160
            },
            {
                inverted: false,
                y: 180
            },

            
            {
                inverted: false,
                y: 230
            },
        ],
        outputs: [
            {
                inverted: false,
                y: 20
            },

            {
                inverted: false,
                y: 170
            },
            {
                inverted: false,
                y: 190
            },
            {
                inverted: false,
                y: 210
            },
            {
                inverted: false,
                y: 230
            },

        ],
        width: 150,
        height: 250,
        labels: [
            {
                label: "DC",
                position: {x: 75, y: 5},
                anchor: {x: .5, y: 0}
            }
        ],
    },
    "CORR": {
        inputs: [
            {
                inverted: false,
                y: 10
            },
            {
                inverted: false,
                y: 40
            },
            {
                inverted: false,
                y: 70
            },
            {
                inverted: false,
                y: 100
            },
            {
                inverted: false,
                y: 130
            },
        ],
        outputs: [
            {
                inverted: false,
                y: 10
            },
            {
                inverted: false,
                y: 70
            },
            {
                inverted: false,
                y: 130
            },

        ],
        width: 100,
        height: 140,
        labels: [
            {
                label: "Кор",
                position: {x: 50, y: 5},
                anchor: {x: .5, y: 0}
            }
        ],
    }
}