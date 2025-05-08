# Depth-First Search (DFS) for Graphs
def depth_first_search_graph(graph, start_node, goal_node):
    visited = set()
    path = []

    def dfs(node):
        if node in visited:
            return False  # Prevent cycles

        visited.add(node)
        path.append(node)

        if node == goal_node:
            return True  # Path found

        if node in graph:  # Check if the node has neighbors
            for neighbor in graph[node]:
                if dfs(neighbor):
                    return True  # Path found from neighbor

        path.pop()  # Backtrack
        return False  # No path found from this node

    if not dfs(start_node):
        return None  # No path found

    return path

# Breadth-First Search (BFS) for Graphs
def breadth_first_search_graph(graph, start_node, goal_node):
    queue = [start_node]
    visited = set()
    came_from = {}  # For path reconstruction
    visited.add(start_node)

    while queue:
        current_node = queue.pop(0)

        if current_node == goal_node:
            # Reconstruct path
            path = []
            node = goal_node
            while node:
                path.insert(0, node)
                node = came_from.get(node)
            return path

        if current_node in graph:  # Check if the node has neighbors
            for neighbor in graph[current_node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    came_from[neighbor] = current_node
                    queue.append(neighbor)

    return None  # No path found

# Example Usage (Adjacency List Representation)
graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}

start_node = 'A'
goal_node = 'F'

dfs_path = depth_first_search_graph(graph, start_node, goal_node)
bfs_path = breadth_first_search_graph(graph, start_node, goal_node)

print("DFS Path:", dfs_path)
print("BFS Path:", bfs_path)