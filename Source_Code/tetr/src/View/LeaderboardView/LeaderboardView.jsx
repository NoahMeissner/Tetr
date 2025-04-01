// LeaderboardView.js
import React from 'react';
import SquareFrame from "../../Interface/components/square_frame/square_frame";
import LeaderboardModel from "../../Model/LeaderboardModel";
import LeaderboardTable from "../../Interface/components/leaderboard/leaderboard_table";

/*
    LeaderboardView Component: This component displays a leaderboard of personal best scores within a square frame.
    It uses the LeaderboardModel to fetch the leaderboard data and passes it to the LeaderboardTable component.
*/


function LeaderboardView() {
    const leaderboard = LeaderboardModel();
    const scores = leaderboard.getLeaderboard();

    return(
        <SquareFrame showTetrisAnimation={false}>
            <h1>Personal Best</h1>
            <LeaderboardTable scores={scores} />
        </SquareFrame>
    )
}

export default LeaderboardView;