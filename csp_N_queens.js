/**
 * Generic Constraint Satisfaction Problem (CSP) Solver using Backtracking with Branch and Bound.
 *
 * This solver can be adapted to solve problems like:
 * - N-Queens
 * - Graph Coloring
 * - Sudoku
 * - and other similar constraint-based problems
 */

/**
 * Solves a CSP using backtracking with branch and bound.
 *
 * @param {object} problem - An object defining the CSP problem.  See the example problems below for the structure.
 * @returns {object|null} - Returns a solution object if found, otherwise null.
 */
function solveCSP(problem) {
    const { variables, domains, constraints, orderValues, selectVariable } = problem;
    const assignment = {}; // Current partial assignment

    /**
     * Recursive backtracking function.
     *
     * @returns {boolean} - True if a solution is found, false otherwise.
     */
    function backtrack() {
        // 1. Check if the assignment is complete.
        if (Object.keys(assignment).length === variables.length) {
            return true; // Solution found!
        }

        // 2. Select a variable to assign (using the provided variable ordering heuristic).
        const variable = selectVariable(variables, assignment, domains);
        if (variable === null) {
            return true;
        }

        // 3. Get the possible values for the selected variable (using the provided value ordering heuristic).
        const values = orderValues(variable, assignment, domains, constraints);

        // 4. Iterate through the values and try to assign them to the variable.
        for (const value of values) {
            // 5. Create a new assignment with the current variable and value.
            assignment[variable] = value;

            // 6. Check if the assignment is consistent with the constraints.
            if (isConsistent(assignment, constraints)) {
                // 7. Recursively call backtrack with the new assignment.
                if (backtrack()) {
                    return true; // Solution found down this branch!
                }
            }
            // 8. Remove the assignment (backtrack).
            delete assignment[variable];
        }

        // 9. No value worked for this variable, so backtrack.
        return false;
    }

    /**
     * Checks if the current assignment is consistent with the constraints.
     *
     * @param {object} assignment - The current partial assignment of values to variables.
     * @param {function[]} constraints - An array of constraint functions.
     * @returns {boolean} - True if the assignment is consistent, false otherwise.
     */
    function isConsistent(assignment, constraints) {
        for (const constraint of constraints) {
            if (!constraint(assignment)) {
                return false; // Constraint violated
            }
        }
        return true; // All constraints are satisfied
    }

    // Start the backtracking search.
    if (backtrack()) {
        return assignment; // Return the solution
    } else {
        return null; // No solution found
    }
}

// Example Problem 1: N-Queens
function createNQueensProblem(n) {
    const variables = [];
    for (let i = 0; i < n; i++) {
        variables.push(`Q${i}`); // Variables: Q0, Q1, Q2, ..., Qn-1 (representing the row of the queen in each column)
    }

    const domains = {};
    for (const variable of variables) {
        domains[variable] = [...Array(n).keys()]; // Domains: [0, 1, 2, ..., n-1] (possible rows)
    }

    /**
     * Variable ordering heuristic:  Minimum Remaining Values (MRV)
     * Select the variable with the fewest remaining legal values in its domain.
     */
    function selectVariableMRV(vars, assignment, doms) {
        let minRemaining = Infinity;
        let selectedVar = null;

        for (const variable of vars) {
            if (!assignment[variable]) { // Only consider unassigned variables
                const remainingValues = doms[variable].length;
                if (remainingValues < minRemaining) {
                    minRemaining = remainingValues;
                    selectedVar = variable;
                }
            }
        }
        return selectedVar;
    }
      /**
     * Value ordering heuristic: Least Constraining Value (LCV)
     *
     * Orders the values in a variable's domain by the number of constraints they
     * eliminate for neighboring variables.  The value that eliminates the fewest
     * options for neighboring variables is preferred.
     */
    function orderValuesLCV(variable, assignment, domains, constraints) {
        const values = domains[variable];
        const valueCounts = [];

        for (const value of values) {
            let count = 0;
            // Simulate assigning the value to the variable
            const tempAssignment = { ...assignment, [variable]: value };

            // Iterate through the constraints and count how many values would be
            // eliminated for the unassigned variables.
            for (const otherVariable of variables) {
                if (otherVariable !== variable && !tempAssignment[otherVariable]) {
                    const otherValues = domains[otherVariable];
                    for (const otherValue of otherValues) {
                        const futureAssignment = { ...tempAssignment, [otherVariable]: otherValue};
                        if (!constraints.every(c => c(futureAssignment)))
                        {
                            count++;
                        }
                    }
                }
            }
            valueCounts.push({ value, count });
        }

        // Sort the values by their constraint count (ascending order)
        valueCounts.sort((a, b) => a.count - b.count);
        return valueCounts.map(vc => vc.value);
    }

    const constraints = [
        /**
         * Constraint: No two queens can be in the same row, column, or diagonal.
         */
        function nQueensConstraint(assignment) {
            const queenRows = Object.entries(assignment);
            for (let i = 0; i < queenRows.length; i++) {
                const [q1, r1] = queenRows[i];
                const c1 = parseInt(q1.slice(1)); // Column number
                for (let j = i + 1; j < queenRows.length; j++) {
                    const [q2, r2] = queenRows[j];
                    const c2 = parseInt(q2.slice(1));
                    if (r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
                        return false; // Constraint violation
                    }
                }
            }
            return true; // All constraints satisfied
        },
    ];

    return {
        variables,
        domains,
        constraints,
        orderValues: orderValuesLCV, // Use the LCV value ordering heuristic
        selectVariable: selectVariableMRV, // Use the MRV variable ordering heuristic
    };
}

// Example Problem 2: Graph Coloring
function createGraphColoringProblem(graph, colors) {
    const variables = Object.keys(graph); // Nodes in the graph are the variables.
    const domains = {};
    for (const variable of variables) {
        domains[variable] = colors; // Each node can be assigned any color.
    }

    /**
     * Variable ordering heuristic:  Minimum Remaining Values (MRV)
     */
     function selectVariableMRV(vars, assignment, doms) {
        let minRemaining = Infinity;
        let selectedVar = null;

        for (const variable of vars) {
            if (!assignment[variable]) { // Only consider unassigned variables
                const remainingValues = doms[variable].length;
                if (remainingValues < minRemaining) {
                    minRemaining = remainingValues;
                    selectedVar = variable;
                }
            }
        }
        return selectedVar;
    }

    /**
     * Value ordering heuristic: Least Constraining Value (LCV)
     */
    function orderValuesLCV(variable, assignment, domains, constraints) {
        const values = domains[variable];
        const valueCounts = [];

        for (const value of values) {
            let count = 0;
            const tempAssignment = { ...assignment, [variable]: value };

             for (const neighbor of graph[variable]) {
                if (!tempAssignment[neighbor]) { // If neighbor is unassigned
                    const neighborValues = domains[neighbor];
                    for(const neighborValue of neighborValues){
                        const futureAssignment = {...tempAssignment, [neighbor]: neighborValue};
                         if (!constraints.every(c => c(futureAssignment)))
                         {
                            count++;
                        }
                    }
                }
            }
            valueCounts.push({ value, count });
        }
        valueCounts.sort((a, b) => a.count - b.count);
        return valueCounts.map(vc => vc.value);
    }

    const constraints = [
        /**
         * Constraint: No two adjacent nodes can have the same color.
         */
        function graphColoringConstraint(assignment) {
            for (const node in assignment) {
                const nodeColor = assignment[node];
                for (const neighbor of graph[node]) {
                    if (assignment[neighbor] && assignment[neighbor] === nodeColor) {
                        return false; // Constraint violation
                    }
                }
            }
            return true; // All constraints satisfied
        },
    ];

    return {
        variables,
        domains,
        constraints,
        orderValues: orderValuesLCV,
        selectVariable: selectVariableMRV,
    };
}

// Example Usage: N-Queens
const n = 8; // Change this to solve for different board sizes (e.g., 4, 8, 16)
const nQueensProblem = createNQueensProblem(n);
const nQueensSolution = solveCSP(nQueensProblem);

if (nQueensSolution) {
    console.log(`N-Queens (${n}) Solution:`);
    console.log(nQueensSolution);
     // Display the board
    let board = Array(n).fill(null).map(() => Array(n).fill('.'));
    for (const [queen, row] of Object.entries(nQueensSolution)) {
        const col = parseInt(queen.slice(1));  // Get the column number from Q0, Q1, etc.
        board[row][col] = 'Q';
    }
    for (let row of board) {
        console.log(row.join(' '));
    }

} else {
    console.log(`No solution found for N-Queens (${n})`);
}

// Example Usage: Graph Coloring
const graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D', 'E'],
    'D': ['B', 'C', 'E'],
    'E': ['C', 'D'],
};
const colors = ['Red', 'Green', 'Blue'];
const graphColoringProblem = createGraphColoringProblem(graph, colors);
const graphColoringSolution = solveCSP(graphColoringProblem);

if (graphColoringSolution) {
    console.log("Graph Coloring Solution:");
    console.log(graphColoringSolution);
} else {
    console.log("No solution found for graph coloring.");
}
