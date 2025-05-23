
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [solvedBoard, setSolvedBoard] = useState([]);
  const [userValue, setUserValue] = useState([]);
  const [solution, setSolution] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [loading, setLoading] = useState(false);

  async function fetchSudokuSolution(diff = "easy") {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${diff}`,
        {
          method: "GET",
          headers: {
            "X-Api-Key": "eNNGhjeghOiwSXT27DT4oQ==zQA18cLfYn2Ptick",
          },
        }
      );

      const result = await response.json();
      console.log(result);
      if (result && result.solution) {
        setSolvedBoard(result.puzzle);
        setSolution(result.solution);
        setDifficulty(diff);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSudokuSolution(difficulty);
  }, []);

  useEffect(() => {
    if (solvedBoard.length > 0) {
      setUserValue(
        solvedBoard.map((row) => row.map((cell) => (cell === null ? "" : cell)))
      );
    }
  }, [solvedBoard]);

  function handleInputChange(rowIndex, Index, updatevalue) {
    if (updatevalue === "" || (updatevalue >= "1" && updatevalue <= "9")) {
      setUserValue((previtems) => {
        const userUpdateValue = previtems.map((row) => [...row]);
        userUpdateValue[rowIndex][Index] = updatevalue;
        return userUpdateValue;
      });
    } else {
      alert("Please enter a number between 1 and 9.");
      return;
    }
  }

  function Submitsudoku() {
    let Condition = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solvedBoard[i][j] == null) {
          if (userValue[i][j] !== solution[i][j].toString()) {
            Condition = false;
            break;
          }
        }
      }
    }
    if (Condition) {
      alert("Well Done");
    } else {
      alert("Next Try");
    }
  }

  return (
    <>

      {/* Difficulty Selection */}
      <div className="Difficulty">
      <h1 className="sudoku">sudoku Game</h1>

        <label>Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => fetchSudokuSolution(e.target.value)}
          disabled={loading}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <div className="p-5 ">
          {loading ? (
            // <p><span className="loader-icon">🔄</span> Loading Sudoku</p>
            <span class="loader">L &nbsp; ading</span>
          ) : solvedBoard.length > 0 ? (
            <table>
              <tbody>
                {solvedBoard.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((item, Index) => (
                      <td
                        key={Index}
                        className={`shadow px-5 py-2 text-center ${
                          item === null
                            ? "bg-white"
                            : "bg-fuchsia-100 text-2xl"
                        }`}
                      >
                        {item !== null ? (
                          item
                        ) : (
                          <input
                            type="text"
                            maxLength="1"
                            value={
                              userValue[rowIndex] &&
                              userValue[rowIndex][Index]
                                ? userValue[rowIndex][Index]
                                : ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                Index,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // <p>Loading...</p>
            <span class="loader">L &nbsp; ading</span>

          )}
        </div>

        <button onClick={Submitsudoku}>Submit</button>
        <button onClick={() => fetchSudokuSolution(difficulty)}>
          New Puzzle
        </button>
      </div>
    </>
  );
}

export default App;
