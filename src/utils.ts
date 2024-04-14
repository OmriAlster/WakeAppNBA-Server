import axios, { AxiosResponse } from "axios";
import Game from "./models/game";
import { BDLGame } from "./dtos/balldontlieDtos";
import { BDLGametoGameDto } from "./dtos/dtoUtils";

let currDate : string | undefined = undefined;
export const fetchTodayScoreboard = async () => {
    const today = await axios.get("https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json");
    const todayDate = today.data.scoreboard.gameDate;
    if (todayDate !== currDate){
        currDate = todayDate;
        // todo : sse to front
        await updateAllRemainingGames();
        // set liveId
    }
    // update today games

}

const updateAllRemainingGames = async () => {
    const games : BDLGame[] = await fetchAllRemainingGames();
    games.forEach(async game => {
        const existedGame = await Game.findOne({gameId : game.id});
        if (!existedGame) {
            const createdGame = await Game.create(BDLGametoGameDto(game));
        }
    })
}

const fetchAllRemainingGames = async () =>
{
    let hasNextPage = true;
    let nextCursor = null;
    let games : any[] = [];
    while (hasNextPage)
    {
      const response : AxiosResponse<{data : any, meta : {next_cursor : number}}> = await axios.get("http://api.balldontlie.io/v1/games",{
          headers : {Authorization : (process.env.BALLDONTLIE_KEY)},
          params : { seasons : [2023], per_page : 100, cursor : nextCursor, start_date : currDate}
        })
    console.log(response.data)
      nextCursor = response.data.meta.next_cursor
      games = games.concat(response.data.data);
      if (!response.data.meta.next_cursor) hasNextPage = false
    }

    return games;
}
