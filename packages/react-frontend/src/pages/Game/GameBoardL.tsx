import React, { useState, useEffect } from 'react';
import styles from './gameboards.module.css';

interface Task {
  name: string;
  timeEstimate: number; // in minutes
}

interface GameBoardProps {
  onLogout: () => void;
  currentPlayerId?: number; // 1 or 2, passed from parent to identify logged-in player
}

export default function GameBoard({ onLogout, currentPlayerId = 1 }: GameBoardProps) {
  const [player1Tasks, setPlayer1Tasks] = useState<Task[]>(Array(9).fill({ name: '', timeEstimate: 0 }));
  const [player2Tasks, setPlayer2Tasks] = useState<Task[]>(Array(9).fill({ name: '', timeEstimate: 0 }));
  const [showPopup, setShowPopup] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<number>(currentPlayerId);
  const [tempTasks, setTempTasks] = useState<Task[]>(Array(9).fill({ name: '', timeEstimate: 0 }));
  const [tasksSubmitted, setTasksSubmitted] = useState(false);
  const [cellMarks, setCellMarks] = useState<(0 | 1 | 2)[]>(Array(9).fill(0)); // 0 = empty, 1 = X (Player 1), 2 = O (Player 2)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMenuPopup, setShowMenuPopup] = useState(false);

  useEffect(() => {
    // set current player based on prop
    setCurrentPlayer(currentPlayerId);
    
    // auto-show popup on first load if tasks haven't been submitted yet
    if (!tasksSubmitted) {
      setTempTasks(Array(9).fill({ name: '', timeEstimate: 0 }));
      setShowPopup(true);
    }
  }, []);

  const openPlayerPopup = (player: number) => {
    setCurrentPlayer(player);
    setTempTasks(Array(9).fill({ name: '', timeEstimate: 0 }));
    setShowPopup(true);
  };

  const openCurrentPlayerPopup = () => {
    // open popup for the currently logged-in player
    setTempTasks(Array(9).fill({ name: '', timeEstimate: 0 }));
    setShowPopup(true);
  };

  const submitTasks = () => {
    // TODO: Send tempTasks to backend for player currentPlayer
    console.log(`Submitting tasks for Player ${currentPlayer}:`, tempTasks);
    
    // update the appropriate player's tasks
    if (currentPlayer === 1) {
      setPlayer1Tasks([...tempTasks]);
    } else {
      setPlayer2Tasks([...tempTasks]);
    }
    
    // Backend will handle where these tasks go
    // For now, just close the popup
    setShowPopup(false);
    setTasksSubmitted(true);
    alert(`Tasks submitted for Player ${currentPlayer}!`);
  };

  const updateTempTask = (index: number, name: string, timeEstimate?: number) => {
    const newTasks = [...tempTasks];
    newTasks[index] = {
      name: name !== undefined ? name : newTasks[index].name,
      timeEstimate: timeEstimate !== undefined ? timeEstimate : newTasks[index].timeEstimate,
    };
    setTempTasks(newTasks);
  };

  const clearAllTasks = () => {
    setPlayer1Tasks(Array(9).fill({ name: '', timeEstimate: 0 }));
    setPlayer2Tasks(Array(9).fill({ name: '', timeEstimate: 0 }));
    console.log('All tasks cleared from board');
  };

  const clearBoardMarks = () => {
    setCellMarks(Array(9).fill(0));
    console.log('Board marks cleared');
  };
   

  const handleCellClick = (index: number) => {
    const newMarks = [...cellMarks];
    const currentMark = newMarks[index];
    
    // if cell is empty, mark it with current player
    if (currentMark === 0) {
      newMarks[index] = currentPlayerId as (1 | 2);
    }
    // if cell is marked by current player, clear it
    else if (currentMark === currentPlayerId) {
      newMarks[index] = 0;
    }
    // if cell is marked by other player, don't allow change
    else {
      return;
    }
    
    setCellMarks(newMarks);
  };

  const getMark = (index: number) => {
    const mark = cellMarks[index];
    if (mark === 1) return 'x';
    if (mark === 2) return 'o';
    return '';
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    // TODO: Send logout event to backend
    console.log(`Player ${currentPlayerId} logged out`);
    onLogout();
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkMode : ''}`}>
      <div className={styles.svgBackground}>
        <svg width="620" height="540" viewBox="0 0 620 540" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_f_92_6)">
            <mask id="path-1-inside-1_92_6" fill="white">
              <path d="M4 47.161C4 24.9869 21.5862 7.01124 43.2799 7.01124H563.739C585.433 7.01124 603.019 24.9869 603.019 47.161V489.813C603.019 511.987 585.433 529.963 563.739 529.963H43.2799C21.5862 529.963 4 511.987 4 489.813V47.161Z"/>
            </mask>
            <path d="M4 47.161C4 24.9869 21.5862 7.01124 43.2799 7.01124H563.739C585.433 7.01124 603.019 24.9869 603.019 47.161V489.813C603.019 511.987 585.433 529.963 563.739 529.963H43.2799C21.5862 529.963 4 511.987 4 489.813V47.161Z" fill="white"/>
            <path d="M183.215 525.948V4M403.182 525.948V4M4 177.146H598.109M4 363.843H598.109" stroke="black" strokeWidth="2"/>
          </g>
          <defs>
            <filter id="filter0_f_92_6" x="0" y="0" width="607.019" height="533.963" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_92_6"/>
            </filter>
          </defs>
        </svg>
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>Tic Tac Task</h1>
        <button onClick={() => setShowMenuPopup(true)} className={styles.menuBtn}>☰ Menu</button>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>

      <div className={styles.setupButtons}>
        <button onClick={openCurrentPlayerPopup} className={styles.playerBtn}>
          Add My Tasks
        </button>
        <button onClick={clearAllTasks} className={styles.clearAllBtn}>Clear All Tasks</button>
        <button onClick={clearBoardMarks} className={styles.clearBoardMarksBtn}>Clear Board Marks</button>
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.board}>
          {Array(9).fill(null).map((_, index) => {
            const p1Task = player1Tasks[index];
            const p2Task = player2Tasks[index];
            
            return (
              <div key={index} className={styles.cell}>
                <div className={styles.markOverlay} onClick={() => handleCellClick(index)}>
                  <div className={styles.mark}>{getMark(index)}</div>
                </div>
                <div className={styles.taskGroup}>
                  <label className={styles.taskLabel}>Player 1:</label>
                  <div className={styles.taskDisplay}>
                    {p1Task.name ? (
                      <div className={styles.taskContent}>
                        <span className={styles.taskName}>{p1Task.name}</span>
                        {p1Task.timeEstimate > 0 && (
                          <span className={styles.timeEstimate}>{p1Task.timeEstimate}min</span>
                        )}
                      </div>
                    ) : (
                      <i> No task yet </i>
                    )}
                  </div>
                </div>
                <div className={styles.taskGroup}>
                  <label className={styles.taskLabel}>Player 2:</label>
                  <div className={styles.taskDisplay}>
                    {p2Task.name ? (
                      <div className={styles.taskContent}>
                        <span className={styles.taskName}>{p2Task.name}</span>
                        {p2Task.timeEstimate > 0 && (
                          <span className={styles.timeEstimate}>{p2Task.timeEstimate}min</span>
                        )}
                      </div>
                    ) : (
                      <i> No task yet </i>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popup for entering tasks */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Enter Your 9 Tasks (Player {currentPlayer})</h2>
            <div className={styles.taskList}>
              {tempTasks.map((task, index) => (
                <div key={index} className={styles.taskEntry}>
                  <label>Task {index + 1}:</label>
                  <div className={styles.taskInputGroup}>
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => updateTempTask(index, e.target.value)}
                      placeholder={`Enter task ${index + 1}`}
                    />
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={task.timeEstimate || ''}
                      onChange={(e) => updateTempTask(index, task.name, e.target.value ? parseInt(e.target.value) : 0)}
                      placeholder="Time (min)"
                      className={styles.timeInput}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.popupButtons}>
              <button onClick={submitTasks} className={styles.saveBtn}>Submit Tasks</button>
              <button onClick={() => setShowPopup(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Popup */}
      {showMenuPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Settings</h2>
            <div className={styles.menuOptions}>
              <div className={styles.menuOption}>
                <label>Dark Mode</label>
                <button 
                  onClick={() => {
                    toggleDarkMode();
                  }} 
                  className={`${styles.toggleBtn} ${isDarkMode ? styles.active : ''}`}
                >
                  {isDarkMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
            <div className={styles.popupButtons}>
              <button onClick={() => setShowMenuPopup(false)} className={styles.closeBtn}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}