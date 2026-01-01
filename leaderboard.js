// 1. Connection to your specific Cloud Database
const firebaseConfig = {
    databaseURL: "https://sudokugame6x6-default-rtdb.firebaseio.com/" 
};

// Initialize the connection
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. Identify the current player
// If no name exists, it creates one (e.g., Player_432)
let myName = localStorage.getItem("gamerName") || "Player_" + Math.floor(Math.random() * 1000);
let myCoins = parseInt(localStorage.getItem("coins")) || 0;

/**
 * SEND DATA: Put your real score into the cloud
 */
function syncMyScore() {
    db.ref('players/' + myName).set({
        username: myName,
        coins: myCoins,
        lastActive: Date.now()
    });
}

/**
 * RECEIVE DATA: Listen for other real users
 * This runs automatically whenever ANYONE'S score changes
 */
function startLiveUpdates() {
    const tableBody = document.getElementById("realtimeBody"); // Make sure this ID is in your HTML

    db.ref('players').orderByChild('coins').on('value', (snapshot) => {
        let players = [];
        snapshot.forEach((child) => {
            players.push(child.val());
        });

        // Sort Highest to Lowest
        players.sort((a, b) => b.coins - a.coins);

        // Clear and Rebuild the table
        tableBody.innerHTML = "";
        players.forEach((player, index) => {
            const isMe = player.username === myName;
            const row = `
                <tr style="background: ${isMe ? 'rgba(10, 102, 194, 0.3)' : 'transparent'}; color: white;">
                    <td style="padding: 12px; font-weight: bold;">#${index + 1}</td>
                    <td>${player.username} ${isMe ? '(You)' : ''}</td>
                    <td style="color: #ffd700;">${player.coins} 🪙</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    });
}

// Start the sync
syncMyScore();
startLiveUpdates();