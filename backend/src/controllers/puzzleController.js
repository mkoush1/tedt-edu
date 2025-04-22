import Puzzle from '../models/Puzzle.js';

// Helper function to generate a solvable puzzle
const generatePuzzle = (size = 3) => {
  const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  const shuffled = numbers.sort(() => Math.random() - 0.5);
  const grid = [];
  
  for (let i = 0; i < size; i++) {
    grid[i] = [];
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      grid[i][j] = index < shuffled.length ? shuffled[index] : 0;
    }
  }
  
  return grid;
};

// Helper function to check if puzzle is solved
const isSolved = (grid) => {
  const size = grid.length;
  let expected = 1;
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === size - 1 && j === size - 1) {
        if (grid[i][j] !== 0) return false;
      } else {
        if (grid[i][j] !== expected++) return false;
      }
    }
  }
  return true;
};

// Start a new puzzle game
export const startPuzzle = async (req, res) => {
  try {
    const { size = 3 } = req.body;
    const initialState = generatePuzzle(size);
    
    const puzzle = new Puzzle({
      userId: req.user._id,
      size,
      initialState,
      currentState: JSON.parse(JSON.stringify(initialState)),
      moves: 0,
      timeSpent: 0
    });
    
    await puzzle.save();
    res.json(puzzle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Make a move in the puzzle
export const makeMove = async (req, res) => {
  try {
    const { puzzleId } = req.params;
    const { row, col } = req.body;
    
    console.log('Making move:', { puzzleId, row, col });
    
    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      console.log('Puzzle not found:', puzzleId);
      return res.status(404).json({ message: 'Puzzle not found' });
    }
    
    if (puzzle.isCompleted) {
      console.log('Puzzle already completed');
      return res.status(400).json({ message: 'Puzzle already completed' });
    }
    
    const currentState = puzzle.currentState;
    const size = puzzle.size;
    
    console.log('Current state:', currentState);
    
    // Find empty cell (0)
    let emptyRow, emptyCol;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (currentState[i][j] === 0) {
          emptyRow = i;
          emptyCol = j;
          break;
        }
      }
    }
    
    console.log('Empty cell position:', { emptyRow, emptyCol });
    
    // Check if move is valid (must be adjacent to empty cell)
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
    console.log('Is adjacent:', isAdjacent, 'Distance:', Math.abs(row - emptyRow) + Math.abs(col - emptyCol));
    
    if (!isAdjacent) {
      console.log('Invalid move - not adjacent to empty cell');
      return res.status(400).json({ 
        message: 'Invalid move',
        details: 'The selected cell must be adjacent to the empty cell',
        emptyCell: { row: emptyRow, col: emptyCol },
        clickedCell: { row, col }
      });
    }
    
    // Make the move
    const temp = currentState[row][col];
    currentState[row][col] = 0;
    currentState[emptyRow][emptyCol] = temp;
    
    puzzle.currentState = currentState;
    puzzle.moves++;
    
    // Check if puzzle is solved
    if (isSolved(currentState)) {
      puzzle.isCompleted = true;
      puzzle.completedAt = new Date();
    }
    
    await puzzle.save();
    console.log('Move successful, new state:', currentState);
    res.json(puzzle);
  } catch (error) {
    console.error('Error making move:', error);
    res.status(500).json({ 
      message: 'Error making move',
      error: error.message 
    });
  }
};

// Get current puzzle state
export const getPuzzleState = async (req, res) => {
  try {
    const { puzzleId } = req.params;
    const puzzle = await Puzzle.findById(puzzleId);
    
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }
    
    res.json(puzzle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 