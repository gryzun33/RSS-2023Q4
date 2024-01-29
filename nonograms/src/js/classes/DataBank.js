export default class DataBank {
  constructor() {
    this.currentGame = null;
    this.userGame = null;
    this.savedGames = null;
    this.savedGamesKey = 'gamesGryzun33';
    this.savedGameKey = 'gameGryzun33';
    // console.log('key1=', this.savedGameKey);
  }

  saveCurrentGame(gameData, usergameData, timeData) {
    const data = { gameData, usergameData, timeData };
    // console.log('usergamedata = ', usergameData);
    localStorage.setItem('gameGryzun33', JSON.stringify(data));
  }

  getSavedGame() {
    const data = JSON.parse(localStorage.getItem('gameGryzun33'));
    console.log('gamefromls =', data);
    return data;
  }

  saveFinishedGame(gameData, timeData) {
    this.savedGames = this.getFinishedGames();

    const key = this.savedGamesKey;
    // console.log('key=', key);
    // console.log('savedgames=', this.savedGames);
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

    // console.log('localstorage=', this.savedGames);
    // console.log('localstoragekey=', this.savedGamesKey);
    localStorage.setItem('gamesGryzun33', JSON.stringify(this.savedGames));
  }

  getFinishedGames() {
    let savedGames = JSON.parse(localStorage.getItem('gamesGryzun33'));
    // console.log('gamesfromls=', savedGames);
    if (!savedGames) {
      savedGames = [];
    }
    return savedGames;
  }

  // sortGames() {}
}
