import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class NQueensSolver {
    /**
     * Main entry point to solve the N-Queens problem for a given board size N.
     *
     * @param n The size of the chessboard (N x N) and the number of queens.
     * @return A list of all distinct solutions. Each solution is represented as a
     * List of Strings, where each String depicts a row of the board.
     * 'Q' denotes a queen, and '.' denotes an empty square.
     * Returns an empty list if n <= 0.
     */
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> solutions = new ArrayList<>();

        if (n <= 0) {
            System.err.println("N must be a positive integer");
            return solutions;
        }

        int[] columns = new int[n];

        Arrays.fill(columns, -1);

        solveNQueensRecursive(0, columns, n, solutions);

        return solutions;
    }

    private void solveNQueensRecursive(int row, int[] columns, int n, List<List<String>> solution) {
        if (row == n) {
            solution.add(formatBoard(columns, n));
            return;
        }

        for (int col = 0; col < n; col++) {
            if (isSafe(row, col, columns)) {
                columns[row] = col;
                solveNQueensRecursive(row + 1, columns, n, solution);
            }
        }
    }

    private boolean isSafe(int row, int col, int[] columns) {
        for (int prevRow = 0; prevRow < row; prevRow++) {
            int prevCol = columns[prevRow];

            if (prevCol == col) {
                return false;
            }

            if (Math.abs(prevRow - row) == Math.abs(prevCol - col)) {
                return false;
            }
        }

        return true;
    }

    private List<String> formatBoard(int[] columns, int n) {
        List<String> board = new ArrayList<>();
        for (int r = 0; r < n; r++) {
            char[] rowChars = new char[n];
            Arrays.fill(rowChars, '.');

            if (columns[r] != -1) {
                rowChars[columns[r]] = 'Q';
            }

            board.add(new String(rowChars));
        }
        return board;
    }

    public static void main(String[] args) {
        int n = 4; // Default value for N if no argument is provided.
        // Check for command-line argument to override N.
        if (args.length > 0) {
            try {
                n = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("Invalid argument. Please provide an integer N (board size). Using default N=4.");
                // Keep n = 4 or handle error differently if preferred.
            }
        }

        // Ensure N is valid before proceeding.
        if (n <= 0) {
            System.err.println("N must be a positive integer. Cannot solve for N=" + n);
            return; // Exit if N is not valid.
        }


        System.out.println("Solving N-Queens for N = " + n);
        NQueensSolver solver = new NQueensSolver();
        // Call the main solver method to get all solutions.
        List<List<String>> solutions = solver.solveNQueens(n);

        // Print the results.
        System.out.println("Found " + solutions.size() + " distinct solution(s).");
        System.out.println("--------------------");

        int solutionNumber = 1;
        // Iterate through each found solution and print it.
        for (List<String> solution : solutions) {
            System.out.println("Solution " + solutionNumber++ + ":");
            // Print each row of the solution board.
            for (String rowString : solution) {
                for (char rowChar: rowString.toCharArray()) {
                    System.out.printf("%4c", rowChar);
                }
                System.out.println();
//                System.out.println(rowString);
            }
            System.out.println("--------------------"); // Separator between solutions.
        }
    }
}
