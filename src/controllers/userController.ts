// controllers/userController.ts
import { Request, Response } from 'express';
import Game, { IGame } from '../models/game';
import axios, { AxiosResponse } from 'axios';
import { fetchTodayScoreboard } from '../utils';


class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      //const data = await axios.get("https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json");
      //console.log(data.data)

    // let hasNextPage = true;
    // let nextCursor = null;
    // let games : any[] = [];
    // while (hasNextPage)
    // {
    //   const response : AxiosResponse<{data : any, meta : {next_cursor : number}}> = await axios.get("http://api.balldontlie.io/v1/games",{
    //       headers : {Authorization : (process.env.BALLDONTLIE_KEY)},
    //       params : { seasons : [2023], per_page : 100, cursor : nextCursor}
    //     })
    //   console.log(response.status)
    //   nextCursor = response.data.meta.next_cursor
    //   games = games.concat(response.data);
    //   if (!response.data.meta.next_cursor) hasNextPage = false
    // }

    //   res.json(games);
      await fetchTodayScoreboard();
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  public async getAllGames () {
    
  }
}

export default new UserController();
