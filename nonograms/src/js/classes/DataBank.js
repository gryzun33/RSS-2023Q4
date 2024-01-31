export default class DataBank {
  constructor() {
    this.currentGame = null;
    this.userGame = null;
    this.savedGames = null;
    this.savedGamesKey = 'gamesGryzun33';
    this.savedGameKey = 'gameGryzun33';
  }

  saveCurrentGame(gameData, usergameData, timeData) {
    const data = { gameData, usergameData, timeData };
    localStorage.setItem(this.savedGameKey, JSON.stringify(data));
  }

  getSavedGame() {
    const data = JSON.parse(localStorage.getItem(this.savedGameKey));
    return data;
  }

  saveFinishedGame(gameData, timeData) {
    this.savedGames = this.getFinishedGames();
    const fullTime = timeData.min * 60 + timeData.sec;
    const game = {
      fullTime,
      gameData,
      timeData,
    };
    this.savedGames.push(game);
    if (this.savedGames.length > 5) {
      this.savedGames.shift();
    }
    localStorage.setItem(this.savedGamesKey, JSON.stringify(this.savedGames));
  }

  getFinishedGames() {
    let savedGames = JSON.parse(localStorage.getItem('gamesGryzun33'));
    if (!savedGames) {
      savedGames = [];
    }
    return savedGames;
  }
}
