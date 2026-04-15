/**
 * Memory maze room layouts (10x10) with explicit walkable tiles and trap coordinates.
 */

const LAYOUT_SIZE = 10;

const floorRow = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const emptyRow = [1, 0, 0, 0, 0, 0, 0, 0, 0, 1];

export const MEMORY_MAZE_LAYOUTS = [
    {
        id: 'maze-corridor-a',
        tiles: [
            floorRow,
            emptyRow,
            [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            floorRow
        ],
        traps: [
            { x: 3, y: 7 },
            { x: 6, y: 5 },
            { x: 8, y: 8 }
        ],
        falsePaths: [
            { x: 5, y: 1 },
            { x: 5, y: 2 },
            { x: 5, y: 3 }
        ],
        misdirectionTiles: [
            { x: 7, y: 7 },
            { x: 8, y: 7 }
        ]
    },
    {
        id: 'maze-corridor-b',
        tiles: [
            floorRow,
            [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
            floorRow
        ],
        traps: [
            { x: 2, y: 3 },
            { x: 5, y: 5 },
            { x: 7, y: 7 }
        ],
        falsePaths: [
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 3, y: 2 }
        ],
        misdirectionTiles: [
            { x: 6, y: 7 },
            { x: 6, y: 8 }
        ]
    },
    {
        id: 'maze-loop-a',
        tiles: [
            floorRow,
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            floorRow
        ],
        traps: [
            { x: 4, y: 3 },
            { x: 6, y: 7 },
            { x: 8, y: 5 }
        ],
        falsePaths: [
            { x: 1, y: 2 },
            { x: 1, y: 3 },
            { x: 1, y: 4 }
        ],
        misdirectionTiles: [
            { x: 5, y: 7 },
            { x: 5, y: 8 }
        ]
    },
    {
        id: 'maze-loop-b',
        tiles: [
            floorRow,
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
            floorRow
        ],
        traps: [
            { x: 3, y: 1 },
            { x: 5, y: 6 },
            { x: 7, y: 4 }
        ],
        falsePaths: [
            { x: 8, y: 1 },
            { x: 8, y: 2 },
            { x: 8, y: 3 }
        ],
        misdirectionTiles: [
            { x: 3, y: 7 },
            { x: 4, y: 7 }
        ]
    },
    {
        id: 'maze-split-a',
        tiles: [
            floorRow,
            [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            floorRow
        ],
        traps: [
            { x: 1, y: 5 },
            { x: 4, y: 2 },
            { x: 8, y: 7 }
        ],
        falsePaths: [
            { x: 6, y: 1 },
            { x: 6, y: 2 },
            { x: 6, y: 3 }
        ],
        misdirectionTiles: [
            { x: 2, y: 7 },
            { x: 3, y: 7 }
        ]
    },
    {
        id: 'maze-split-b',
        tiles: [
            floorRow,
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
            floorRow
        ],
        traps: [
            { x: 2, y: 5 },
            { x: 6, y: 3 },
            { x: 8, y: 8 }
        ],
        falsePaths: [
            { x: 4, y: 1 },
            { x: 4, y: 2 },
            { x: 4, y: 3 }
        ],
        misdirectionTiles: [
            { x: 7, y: 8 },
            { x: 8, y: 7 }
        ]
    }
];

export function getMemoryMazeLayout(milestoneMeters) {
    if (!MEMORY_MAZE_LAYOUTS.length) return null;

    const milestoneIndex = Math.max(0, Math.floor((milestoneMeters || 0) / 1000) - 1);
    const layout = MEMORY_MAZE_LAYOUTS[milestoneIndex % MEMORY_MAZE_LAYOUTS.length];

    return {
        ...layout,
        tiles: layout.tiles.map((row) => row.slice()),
        traps: layout.traps.map((trap) => ({ ...trap })),
        falsePaths: (layout.falsePaths || []).map((tile) => ({ ...tile })),
        misdirectionTiles: (layout.misdirectionTiles || []).map((tile) => ({ ...tile }))
    };
}

export function isValidMemoryMazeLayout(layout) {
    if (!layout || !Array.isArray(layout.tiles) || layout.tiles.length !== LAYOUT_SIZE) {
        return false;
    }

    const hasValidTiles = layout.tiles.every((row) => Array.isArray(row) && row.length === LAYOUT_SIZE);
    const hasValidTraps = Array.isArray(layout.traps);
    const hasValidFalsePaths = !layout.falsePaths || Array.isArray(layout.falsePaths);
    const hasValidMisdirection = !layout.misdirectionTiles || Array.isArray(layout.misdirectionTiles);

    return hasValidTiles && hasValidTraps && hasValidFalsePaths && hasValidMisdirection;
}
