function depthFirstSearchRecursive(grid, start, goal, path = [], visited = new Set()) {
    const { x, y } = start;

    // Base cases:
    // 1. Out of bounds
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
        return null;
    }
    // 2. Wall
    if (grid[x][y] === 1) {
        return null;
    }
    // 3. Already visited
    const currentKey = x + ',' + y;
    if (visited.has(currentKey)) {
        return null;
    }

    // Mark the current node as visited.
    visited.add(currentKey);
    path.push(start);

    // 4. Goal Check
    if (x === goal.x && y === goal.y) {
        return path; // Path found!
    }

    // Recursive calls to explore neighbors.  Prioritize a direction
    const directions = [
        { dx: 0, dy: -1 }, // Up
        { dx: 0, dy: 1 },  // Down
        { dx: -1, dy: 0 }, // Left
        { dx: 1, dy: 0 },  // Right
    ];

    for (const dir of directions) {
        const newX = x + dir.dx;
        const newY = y + dir.dy;
        const result = depthFirstSearchRecursive(grid, { x: newX, y: newY }, goal, path, visited);
        if (result) {
            return result; // Path found in this direction!
        }
    }

    // If no path found from any direction, remove the current node
    path.pop();
    return null; // No path found from this node
}

// Example Usage
const grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]; // 0: open, 1: wall

const start = { x: 0, y: 0 };
const goal = { x: 9, y: 9 };

const path = depthFirstSearchRecursive(grid, start, goal);

if (path) {
    console.log("Path found:");
    for (const node of path) {
        console.log(`(${node.x}, ${node.y})`);
    }
} else {
    console.log("No path found.");
}

function displayGridWithPath(grid, path) {
    const displayGrid = grid.map(row => [...row]); // Create a copy

    if (path) {
        for (const node of path) {
            displayGrid[node.x][node.y] = 2; // Mark path
        }
    }

    for (let y = 0; y < displayGrid.length; y++) {
        let rowString = '';
        for (let x = 0; x < displayGrid[y].length; x++) {
            switch (displayGrid[y][x]) {
                case 0: rowString += ' . '; break;
                case 1: rowString += ' # '; break;
                case 2: rowString += ' * '; break;
            }
        }
        console.log(rowString);
    }
}

console.log("\nGrid with Path:");
displayGridWithPath(grid, path);
