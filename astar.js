function aStarSearch(grid, start, goal) {
    const openList = [start];
    const closedList = [];
    const cameFrom = {}; // To reconstruct the path
    const gCost = { [start.x + ',' + start.y]: 0 }; // Cost from start to node
    const fCost = { [start.x + ',' + start.y]: heuristic(start, goal) }; // Estimated total cost

    // Function to calculate Manhattan distance heuristic
    function heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    // Function to get valid neighbors
    function getNeighbors(node, grid) {
        const neighbors = [];
        const { x, y } = node;
        const directions = [
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 },  // Right
        ];

        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;

            if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length && grid[newX][newY] !== 1) {
                neighbors.push({ x: newX, y: newY });
            }
        }
        return neighbors;
    }

    // Function to get the node with the lowest fCost from openList
    function getNodeWithLowestFCost(openList, fCost) {
        let lowestFCost = Infinity;
        let lowestNode = null;

        for (const node of openList) {
            const nodeKey = node.x + ',' + node.y;
            if (fCost[nodeKey] < lowestFCost) {
                lowestFCost = fCost[nodeKey];
                lowestNode = node;
            }
        }
        return lowestNode;
    }

    while (openList.length > 0) {
        const current = getNodeWithLowestFCost(openList, fCost);

        if (!current) {
            console.error("No current node, openList is empty but should not be!");
            return null; // Or some other error handling
        }


        const currentKey = current.x + ',' + current.y;

        if (current.x === goal.x && current.y === goal.y) {
            // Reconstruct the path
            const path = [];
            let node = current;
            while (node) {
                path.unshift(node); // Add to the beginning of the path
                node = cameFrom[node.x + ',' + node.y];
            }
            return path;
        }

        // Remove current from openList and add to closedList
        openList.splice(openList.indexOf(current), 1);
        closedList.push(current);

        const neighbors = getNeighbors(current, grid);

        for (const neighbor of neighbors) {
            const neighborKey = neighbor.x + ',' + neighbor.y;

            if (closedList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                continue; // Neighbor is in closed list, ignore it
            }

            const tentativeGCost = gCost[currentKey] + 1; // Cost to move from current to neighbor (assuming 1)

            if (!openList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                // Neighbor not in openList, add it
                cameFrom[neighborKey] = current;
                gCost[neighborKey] = tentativeGCost;
                fCost[neighborKey] = tentativeGCost + heuristic(neighbor, goal);
                openList.push(neighbor);
            } else if (tentativeGCost < gCost[neighborKey]) {
                // Found a better path to the neighbor
                cameFrom[neighborKey] = current;
                gCost[neighborKey] = tentativeGCost;
                fCost[neighborKey] = tentativeGCost + heuristic(neighbor, goal);
            }
        }
    }

    return null; // No path found
}

// Example usage:
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

const path = aStarSearch(grid, start, goal);

if (path) {
    console.log("Path found:");
    for (const node of path) {
        console.log(`(${node.x}, ${node.y})`);
    }
} else {
    console.log("No path found.");
}

// Function to display the grid with the path
function displayGridWithPath(grid, path) {
    const displayGrid = grid.map(row => [...row]); // Create a copy to avoid modifying original

    if (path) {
        for (const node of path) {
            displayGrid[node.x][node.y] = 2; // Mark path with 2
        }
    }

    for (let y = 0; y < displayGrid.length; y++) {
        let rowString = '';
        for (let x = 0; x < displayGrid[y].length; x++) {
            switch (displayGrid[y][x]) {
                case 0: rowString += ' . '; break; // Open
                case 1: rowString += ' # '; break; // Wall
                case 2: rowString += ' * '; break; // Path
            }
        }
        console.log(rowString);
    }
}
console.log("\nGrid with path:")
displayGridWithPath(grid, path);
