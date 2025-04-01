// LeaderboardTable.js
import React from 'react';
import './leaderboard_table.css';

/*
    LeaderboardTable Component: Displays a table with leaderboard scores.
    The table includes columns for rank, score, and the date when the score was achieved.
    Dates are formatted to be more user-friendly.
*/



function LeaderboardTable({ scores }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <table className="leaderboard-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Score</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {scores.map((entry, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{entry.score}</td>
                        <td>{formatDate(entry.date)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default LeaderboardTable;