import heapq

def a_star_search(grid, start, goal):
    """
    Implements the A* search algorithm to find the shortest path on a grid.

    Args:
        grid (list of lists): A 2D grid where 0 represents a free cell and 1 represents an obstacle.
        start (tuple): The coordinates of the starting cell (row, col).
        goal (tuple): The coordinates of the goal cell (row, col).

    Returns:
        list or None: A list of coordinates representing the shortest path from start to goal,
                     or None if no path is found.
    """

    rows = len(grid)
    cols = len(grid[0])

    def is_valid(row, col):
        """Checks if a cell is within the grid boundaries and is not an obstacle."""
        return 0 <= row < rows and 0 <= col < cols and grid[row][col] == 0

    def heuristic(node):
        """Calculates the Manhattan distance heuristic between a node and the goal."""
        return abs(node[0] - goal[0]) + abs(node[1] - goal[1])

    # Priority queue to store nodes to visit, prioritized by f(n)
    open_set = [(0 + heuristic(start), 0, start)]  # (f_score, g_score, node)

    # Dictionary to store the path from each node to its predecessor
    came_from = {}

    # Dictionary to store the cost from the start node to each node (g(n))
    g_score = {start: 0}

    while open_set:
        f_score, current_g_score, current_node = heapq.heappop(open_set)

        if current_node == goal:
            # Reconstruct the path
            path = []
            while current_node in came_from:
                path.append(current_node)
                current_node = came_from[current_node]
            path.append(start)
            return path[::-1]  # Reverse the path to get it from start to goal

        row, col = current_node
        # Define possible moves (up, down, left, right)
        neighbors = [(row - 1, col), (row + 1, col), (row, col - 1), (row, col + 1)]

        for neighbor_row, neighbor_col in neighbors:
            neighbor = (neighbor_row, neighbor_col)
            if is_valid(neighbor_row, neighbor_col):
                tentative_g_score = current_g_score + 1  # Cost of moving to a neighbor is 1

                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    # Found a better path to the neighbor
                    g_score[neighbor] = tentative_g_score
                    f_score_neighbor = tentative_g_score + heuristic(neighbor)
                    heapq.heappush(open_set, (f_score_neighbor, tentative_g_score, neighbor))
                    came_from[neighbor] = current_node

    return None  # No path found

# Example Grid:
# 0 = free, 1 = obstacle
grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0]
]

start_node = (0, 0)
goal_node = (4, 4)

path = a_star_search(grid, start_node, goal_node)

if path:
    print("Shortest path found:", path)
else:
    print("No path found.")

# Visualizing the grid with the path
if path:
    path_set = set(path)
    for r in range(len(grid)):
        row_str = ""
        for c in range(len(grid[0])):
            if (r, c) == start_node:
                row_str += "S "
            elif (r, c) == goal_node:
                row_str += "G "
            elif (r, c) in path_set:
                row_str += "* "
            elif grid[r][c] == 1:
                row_str += "# "
            else:
                row_str += ". "
        print(row_str)