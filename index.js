const axios = require('axios');
const express = require('express'); // Nou ajoute sa pou Render ka aksepte l gratis
const app = express();
const PORT = process.env.PORT || 3000;

const BASE44_APP_ID = "69ffa8c3e6e68da151011547";
const BASE44_API_KEY = "fd5f2d451d9641aa88ea7e8e121b79b7";
const BASE44_API_URL = "https://jen-paryaj-win.base44.app/api/entities/FootballMatch/bulk";

const API_SPORTS_KEY = "b7e8e6682155d39110c9a64cfee0d4b3"; // Kle ou te mete a
const API_SPORTS_URL = "https://v3.football.api-sports.io/fixtures";

async function sinkwonizeMatchYo() {
    try {
        const jodi_a = new Date().toISOString().split('T')[0];
        console.log(`Rale match pou dat: ${jodi_a}...`);

        const reponsSports = await axios.get(API_SPORTS_URL, {
            headers: {
                'x-rapidapi-key': API_SPORTS_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io'
            },
            params: { date: jodi_a }
        });

        const matchYo = reponsSports.data.response;
        if (!matchYo || matchYo.length === 0) {
            console.log("Pa gen match jodi a.");
            return;
        }

        const matchPouBase44 = matchYo.map(item => ({
            api_fixture_id: item.fixture.id,
            league_name: item.league.name,
            league_id: item.league.id,
            home_team: item.teams.home.name,
            home_team_logo: item.teams.home.logo,
            away_team: item.teams.away.name,
            away_team_logo: item.teams.away.logo,
            kickoff_time: item.fixture.date,
            match_date: jodi_a,
            status: "scheduled"
        }));

        console.log(`N ap voye ${matchPouBase44.length} match sou Base44...`);

        await axios.post(BASE44_API_URL, matchPouBase44, {
            headers: {
                'Content-Type': 'application/json',
                'api_key': BASE44_API_KEY
            }
        });

        console.log("Siksè! Tout match yo monte nan Jèn Paryaj.");
    } catch (error) {
        console.error("Erè:", error.response ? error.response.data : error.message);
    }
}

// Yon rout senp pou w ka deklanche robo a nenpòt lè nan navigatè w
app.get('/rale-match', async (req, res) => {
    await sinkwonizeMatchYo();
    res.send("Robo a fin kouri! Gade liy konsòl Render a pou siksè a.");
});

// Sa ap kenbe sèvis la ap koute sou Render gratis
app.listen(PORT, () => {
    console.log(`Sèvis la ap kouri sou pò ${PORT}`);
    // Nou ka lanse l yon premye fwa otomatikman lè l limen
    sinkwonizeMatchYo();
});
