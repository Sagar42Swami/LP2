// Depth-First Search (DFS) for Graphs
function depthFirstSearchGraph(graph, startNode, goalNode) {
    const visited = new Set();
    const path = [];

    function dfs(node) {
        if (visited.has(node)) {
            return false; // Prevent cycles
        }

        visited.add(node);
        path.push(node);

        if (node === goalNode) {
            return true; // Path found
        }

        if (graph[node]) { // Check if the node has neighbors
            for (const neighbor of graph[node]) {
                if (dfs(neighbor)) {
                    return true; // Path found from neighbor
                }
            }
        }

        path.pop(); // Backtrack
        return false; // No path found from this node
    }

    if (!dfs(startNode)) {
        return null; // No path found
    }

    return path;
}

// Breadth-First Search (BFS) for Graphs
function breadthFirstSearchGraph(graph, startNode, goalNode) {
    const queue = [startNode];
    const visited = new Set();
    const cameFrom = {}; // For path reconstruction
    visited.add(startNode);

    while (queue.length > 0) {
        const currentNode = queue.shift();

        if (currentNode === goalNode) {
            // Reconstruct path
            const path = [];
            let node = goalNode;
            while (node) {
                path.unshift(node);
                node = cameFrom[node];
            }
            return path;
        }

        if (graph[currentNode]) { // Check if the node has neighbors
            for (const neighbor of graph[currentNode]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    cameFrom[neighbor] = currentNode;
                    queue.push(neighbor);
                }
            }
        }
    }
    return null; // No path found
}

// Example Usage (Adjacency List Representation)
const graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
};

const startNode = 'A';
const goalNode = 'F';

const dfsPath = depthFirstSearchGraph(graph, startNode, goalNode);
const bfsPath = breadthFirstSearchGraph(graph, startNode, goalNode);

console.log("DFS Path:", dfsPath);
console.log("BFS Path:", bfsPath);
