import { useState, useEffect } from 'react';

/*
    LeaderboardModel: This module manages the leaderboard functionality,
    including loading, saving, and retrieving scores.
*/

const LeaderboardModel = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Load leaderboard from localStorage on component mount
    const storedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    setLeaderboard(storedLeaderboard);
  }, []);

  const saveScore = (score) => {
    const newEntry = {
      score: score,
      date: new Date().toISOString(),
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10 scores

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
  };

  const getLeaderboard = () => {
    return leaderboard;
  };

  return {
    saveScore,
    getLeaderboard,
  };
};

export default LeaderboardModel;