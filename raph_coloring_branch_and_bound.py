def graph_coloring_branch_and_bound(graph, num_colors):
    """
    Solves the graph coloring problem using Branch and Bound with Backtracking.

    Args:
        graph (dict): An adjacency list representation of the graph where keys are
                      vertices and values are lists of their neighbors.
        num_colors (int): The maximum number of colors allowed.

    Returns:
        dict or None: A dictionary where keys are vertices and values are their assigned
                      colors (integers from 1 to num_colors), or None if no valid
                      coloring is found.
    """

    vertices = list(graph.keys())
    num_vertices = len(vertices)
    coloring = {}  # Stores the color assigned to each vertex

    def is_safe(vertex, color):
        """
        Checks if assigning a given color to a vertex is safe (doesn't conflict
        with its already colored neighbors).
        """
        for neighbor in graph.get(vertex, []):
            if neighbor in coloring and coloring[neighbor] == color:
                return False
        return True

    def backtrack(vertex_index):
        """
        Recursive backtracking function to try assigning colors to vertices.
        """
        if vertex_index == num_vertices:
            # All vertices have been colored successfully
            return coloring.copy()

        vertex = vertices[vertex_index]

        # Try assigning each color to the current vertex
        for color in range(1, num_colors + 1):
            if is_safe(vertex, color):
                # Assign the color
                coloring[vertex] = color

                # Branch: Explore the next vertex
                result = backtrack(vertex_index + 1)
                if result:
                    return result  # A valid coloring found down this branch

                # Backtrack: Unassign the color to explore other possibilities
                del coloring[vertex]

        # No valid color could be assigned to the current vertex
        return None

    # Start the backtracking process from the first vertex
    return backtrack(0)

# Example Graph (Adjacency List)
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D', 'E'],
    'D': ['B', 'C', 'E'],
    'E': ['C', 'D']
}
num_colors_available = 3

coloring_result = graph_coloring_branch_and_bound(graph, num_colors_available)

if coloring_result:
    print(f"Valid coloring found using {num_colors_available} colors:")
    for vertex, color in coloring_result.items():
        print(f"Vertex {vertex}: Color {color}")
else:
    print(f"No valid coloring found using {num_colors_available} colors.")