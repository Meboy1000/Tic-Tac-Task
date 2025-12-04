import React, { useState, useEffect } from 'react';
import styles from './gameboards.module.css';
import { getTasksForUserMatch, getTasksForMatch, addTask, deleteTask } from '../../api/task';
import { getMatchById } from '../../api/match';

export default function GameBoard({ onLogout, currentPlayerId = 1, userId, matchId, username }) {
  const [player1Tasks, setPlayer1Tasks] = useState(Array(9).fill({ name: '', timeEstimate: 0 }));
  const [player2Tasks, setPlayer2Tasks] = useState(Array(9).fill({ name: '', timeEstimate: 0 }));
  const [showPopup, setShowPopup] = useState(false); //slots for showing task entry popup
  const [currentPlayer, setCurrentPlayer] = useState(currentPlayerId); //1 or 2
  const [tempTasks, setTempTasks] = useState(Array(9).fill({ name: '', timeEstimate: 0 }));//temporary tasks before submission
  const [tasksSubmitted, setTasksSubmitted] = useState(false);
  const [cellMarks, setCellMarks] = useState(Array(9).fill(0)); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMenuPopup, setShowMenuPopup] = useState(false);
  const [stakes, setStakes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user1Id, setUser1Id] = useState(null);
  const [user2Id, setUser2Id] = useState(null);

  // load match details to get both user IDs
  useEffect(() => {
    if (matchId) {
      loadMatchDetails();
    }
  }, [matchId]);

  const loadMatchDetails = async () => {
    try {
      const match = await getMatchById(matchId);
      console.log('Match details:', match);
      setUser1Id(match.user1_id);
      setUser2Id(match.user2_id);
    } catch (error) {
      console.error('Error loading match details:', error);
    }
  };

  // load existing tasks from backend when component mounts and poll for updates
  useEffect(() => {
    if (matchId && user1Id) {
      loadAllTasks();
      // Poll for updates every 3 seconds
      const interval = setInterval(() => {
        loadAllTasks();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [matchId, user1Id, user2Id]);

  const loadAllTasks = async () => {
    try {
      const tasksData = await getTasksForMatch(matchId);
      
      // check if we got valid data
      if (!tasksData || !tasksData.tasks) {
        console.log('No tasks data received yet');
        return;
      }
      
      console.log('Loaded all tasks for match:', tasksData);
      
      // Separate tasks by user_id
      const p1Tasks = Array(9).fill({ name: '', timeEstimate: 0 });
      const p2Tasks = Array(9).fill({ name: '', timeEstimate: 0 });
      
      tasksData.tasks.forEach(task => {
        if (task.location >= 0 && task.location < 9) {
          const taskObj = {
            name: task.description || '',
            timeEstimate: task.time_to_do || 0
          };
          
          if (task.user_id === user1Id) {
            p1Tasks[task.location] = taskObj;
          } else if (task.user_id === user2Id) {
            p2Tasks[task.location] = taskObj;
          }
        }
      });
      
      setPlayer1Tasks(p1Tasks);
      setPlayer2Tasks(p2Tasks);
      
      // check if current user already has tasks
      const myTasks = currentPlayerId === 1 ? p1Tasks : p2Tasks;
      const hasTasks = myTasks.some(t => t.name);
      setTasksSubmitted(hasTasks);
    } catch (error) {
      // silently log error to avoid infinite console spam
      // only log once per minute
      if (!window.lastTaskErrorLog || Date.now() - window.lastTaskErrorLog > 60000) {
        console.error('Error loading tasks (will retry):', error.message);
        window.lastTaskErrorLog = Date.now();
      }
    }
  };

  // Marks are local-only for now

  useEffect(() => {
    // set current player based on prop
    setCurrentPlayer(currentPlayerId);
    
    // auto-show popup on first load if tasks haven't been submitted yet
    if (!tasksSubmitted) {
      setTempTasks(Array(9).fill({ name: '', timeEstimate: 0 }));
      setShowPopup(true);
    }
  }, [currentPlayerId, tasksSubmitted]);

  const openPlayerPopup = (player) => {
    setCurrentPlayer(player);
    setTempTasks(Array(9).fill({ name: '', timeEstimate: 0 }));
    setShowPopup(true);
  };

  const openCurrentPlayerPopup = () => {
    // open popup for the currently logged-in player
    setTempTasks(Array(9).fill({ name: '', timeEstimate: 0 }));
    setShowPopup(true);
  };

  const submitTasks = async () => {
    setIsLoading(true);
    try {
      // Save each task to the backend
      const savePromises = tempTasks.map((task, index) => {
        if (task.name) { // Only save tasks that have a name
          return addTask({
            user_id: userId,
            match_id: matchId,
            location: index,
            description: task.name,
            time_to_do: task.timeEstimate || 0,
            complete: false
          });
        }
        return null;
      });
      
      await Promise.all(savePromises.filter(p => p !== null));
      console.log(`Tasks saved to backend for Player ${currentPlayer}`);
      
      setShowPopup(false);
      setTasksSubmitted(true);
      
      // Reload all tasks to get latest from both players
      await loadAllTasks();
      
      alert(`Tasks submitted for Player ${currentPlayer}!`);
    } catch (error) {
      console.error('Error saving tasks:', error);
      alert('Error saving tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTempTask = (index, name, timeEstimate) => { //create temp task entry
    const newTasks = [...tempTasks]; //new array to hold temp tasks
    newTasks[index] = {
      name: name !== undefined ? name : newTasks[index].name, //if name provided use it else keep existing
      timeEstimate: timeEstimate !== undefined ? timeEstimate : newTasks[index].timeEstimate, 
    };
    setTempTasks(newTasks);
  };

  const clearAllTasks = async () => {
    if (!window.confirm('Are you sure you want to clear all your tasks?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Delete all tasks for current user from backend
      const deletePromises = [];
      for (let i = 0; i < 9; i++) {
        deletePromises.push(
          deleteTask(userId, matchId, i).catch(err => {
            // Ignore errors for tasks that don't exist
            console.log(`No task at location ${i} to delete`);
          })
        );
      }
      
      await Promise.all(deletePromises);
      console.log('All my tasks cleared from backend');
      
      // Reload tasks to update UI
      await loadAllTasks();
      setTasksSubmitted(false);
      
      alert('Your tasks have been cleared!');
    } catch (error) {
      console.error('Error clearing tasks:', error);
      alert('Error clearing tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSingleTask = async (location) => {
    if (!window.confirm(`Clear task at position ${location + 1}?`)) {
      return;
    }
    
    try {
      await deleteTask(userId, matchId, location);
      console.log(`Task at location ${location} deleted`);
      
      // Reload tasks to update UI
      await loadAllTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task. It may not exist.');
    }
  };

  const clearBoardMarks = async () => {
    if (!window.confirm('Are you sure you want to clear all board marks (X/O)?')) {
      return;
    }
    
    try {
      const emptyMarks = Array(9).fill(0);
      setCellMarks(emptyMarks);
      console.log('Board marks cleared');
    } catch (error) {
      console.error('Error clearing marks:', error);
      alert('Error clearing board marks. Please try again.');
    }
  };
   

  const handleCellClick = async (index) => {
    const newMarks = [...cellMarks];
    const currentMark = newMarks[index];
    
    // if cell is empty, mark it with current player
    if (currentMark === 0) {
      newMarks[index] = currentPlayerId;
    }
    // if cell is marked by current player, clear it
    else if (currentMark === currentPlayerId) {
      newMarks[index] = 0;
    }
    // if cell is marked by other player don't allow change
    else {
      return;
    }
    
    // Update local state immediately for responsiveness
    setCellMarks(newMarks);

    // No backend sync for marks right now
  };

  const getMark = (index) => {
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
        <button onClick={clearAllTasks} className={styles.clearAllBtn} disabled={isLoading}>
          {isLoading ? 'Clearing...' : 'Clear All My Tasks'}
        </button>
        <button onClick={clearBoardMarks} className={styles.clearBoardMarksBtn}>Clear Board Marks</button>

        {/* NEW: Stakes input */}
        <div className={styles.stakesInputGroup}>
          <label className={styles.stakesLabel}>Stakes: $</label>
          <input
            type="number"
            min="0"
            value={stakes}
            onChange={(e) => setStakes(e.target.value)}
            className={styles.stakesInput}
            placeholder="$"
          />
        </div>
      </div>

      

      <div className={styles.boardContainer}>
        <div className={styles.board}>
          {Array(9).fill(null).map((_, index) => {
            const p1Task = player1Tasks[index];
            const p2Task = player2Tasks[index];
            
            return (
              <div key={index} className={`${styles.cell} ${cellMarks[index] !== 0 ? styles.marked : ''}`}>
                <div className={styles.markOverlay} onClick={() => handleCellClick(index)}>
                  <div className={styles.mark}>{getMark(index)}</div>
                </div>
                <div className={styles.taskGroup}>
                  <label className={styles.taskLabel1}>Player 1:</label>
                  <div className={styles.taskDisplay}>
                    {p1Task.name ? (
                      <div className={styles.taskContent}>
                        <span className={styles.taskName}>{p1Task.name}</span>
                        {p1Task.timeEstimate > 0 && (
                          <span className={styles.timeEstimate}>{p1Task.timeEstimate}min</span>
                        )}
                        {currentPlayerId === 1 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              clearSingleTask(index);
                            }}
                            className={styles.deleteTaskBtn}
                            title="Delete this task"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ) : (
                      <i> No task yet </i>
                    )}
                  </div>
                </div>
                <div className={styles.taskGroup}>
                  <label className={styles.taskLabel2}>Player 2:</label>
                  <div className={styles.taskDisplay}>
                    {p2Task.name ? (
                      <div className={styles.taskContent}>
                        <span className={styles.taskName}>{p2Task.name}</span>
                        {p2Task.timeEstimate > 0 && (
                          <span className={styles.timeEstimate}>{p2Task.timeEstimate}min</span>
                        )}
                        {currentPlayerId === 2 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              clearSingleTask(index);
                            }}
                            className={styles.deleteTaskBtn}
                            title="Delete this task"
                          >
                            ✕
                          </button>
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
              <button onClick={submitTasks} className={styles.saveBtn} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Submit Tasks'}
              </button>
              <button onClick={() => setShowPopup(false)} className={styles.cancelBtn} disabled={isLoading}>
                Cancel
              </button>
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
