import React, { useState } from 'react';
import styles from './gameboards.module.css';

interface GameBoardProps {
  onLogout: () => void;
}

export default function GameBoard({ onLogout }: GameBoardProps) {
  const [player1Tasks, setPlayer1Tasks] = useState<string[]>(Array(9).fill(''));
  const [player2Tasks, setPlayer2Tasks] = useState<string[]>(Array(9).fill(''));
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [tempTasks, setTempTasks] = useState<string[]>(Array(9).fill(''));
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [tempTime, setTempTime] = useState<string>('');

  const openPlayerPopup = (player: number) => {
    setCurrentPlayer(player);
    setTempTasks(Array(9).fill(''));
    setShowPopup(true);
  };

  const submitTasks = () => {
    // TODO: Send tempTasks to backend for player currentPlayer
    console.log(`Submitting tasks for Player ${currentPlayer}:`, tempTasks);
    
    // Backend will handle where these tasks go
    // For now, just close the popup
    setShowPopup(false);
    alert(`Tasks submitted for Player ${currentPlayer}!`);
  };

  const updateTempTask = (index: number, value: string) => {
    const newTasks = [...tempTasks];
    newTasks[index] = value;
    setTempTasks(newTasks);
  };

  const submitTimeLimit = () => {
    const time = parseInt(tempTime);
    if (!isNaN(time) && time > 0) {
      // TODO: Send time limit to backend
      console.log('Submitting time limit:', time);
      setTimeLimit(time);
      setShowTimePopup(false);
      setTempTime('');
      alert(`Time limit set to ${time} minutes!`);
    }
  };

  const clearTime = () => {
    setTimeLimit(0);
    console.log('Time limit cleared');
  };

  const clearAllTasks = () => {
    setPlayer1Tasks(Array(9).fill(''));
    setPlayer2Tasks(Array(9).fill(''));
    console.log('All tasks cleared from board');
  };

  return (
    <div className={styles.container}>
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
        <button onClick={onLogout} className={styles.logoutBtn}>Logout</button>
      </div>

      <div className={styles.setupButtons}>
        <button onClick={() => openPlayerPopup(1)} className={styles.playerBtn}>
          Player 1 - Enter Tasks
        </button>
        <button onClick={() => openPlayerPopup(2)} className={styles.playerBtn}>
          Player 2 - Enter Tasks
        </button>
        <button onClick={() => setShowTimePopup(true)} className={styles.timeBtn}>
          Set Time Limit
        </button>
        {timeLimit > 0 && (
          <>
            <span className={styles.timeDisplay}>Time Limit: {timeLimit} minutes</span>
            <button onClick={clearTime} className={styles.clearTimeBtn}>Clear Time</button>
          </>
        )}
        <button onClick={clearAllTasks} className={styles.clearAllBtn}>Clear All Tasks</button>
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.board}>
          {Array(9).fill(null).map((_, index) => (
            <div key={index} className={styles.cell}>
              <div className={styles.taskGroup}>
                <label className={styles.taskLabel}>Player 1:</label>
                <div className={styles.taskDisplay}>
                  {player1Tasks[index] || 'No task yet'}
                </div>
              </div>
              <div className={styles.taskGroup}>
                <label className={styles.taskLabel}>Player 2:</label>
                <div className={styles.taskDisplay}>
                  {player2Tasks[index] || 'No task yet'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup for entering tasks */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Player {currentPlayer} - Enter 9 Tasks</h2>
            <div className={styles.taskList}>
              {tempTasks.map((task, index) => (
                <div key={index} className={styles.taskEntry}>
                  <label>Task {index + 1}:</label>
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => updateTempTask(index, e.target.value)}
                    placeholder={`Enter task ${index + 1}`}
                  />
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

      {/* Popup for time limit */}
      {showTimePopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Set Time Limit</h2>
            <div className={styles.timeEntry}>
              <label>Time (in minutes):</label>
              <input
                type="number"
                value={tempTime}
                onChange={(e) => setTempTime(e.target.value)}
                placeholder="Enter time in minutes"
              />
            </div>
            <div className={styles.popupButtons}>
              <button onClick={submitTimeLimit} className={styles.saveBtn}>Submit Time</button>
              <button onClick={() => setShowTimePopup(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}