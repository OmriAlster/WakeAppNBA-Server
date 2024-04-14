import { IGame } from '../models/game'
import {BDLGame} from './balldontlieDtos'

export const BDLGametoGameDto = (bdlGame : BDLGame) : IGame => {
    return ({
        gameId : bdlGame.id,
         gameTime : {
            gameDate : bdlGame.date,
            gameStatusText : createStatusText(bdlGame.status),
            gameTimeUTC : new Date(bdlGame.status),
            gameClock : bdlGame.time,
            period : bdlGame.period
        },
        homeTeam :  {
            teamId : bdlGame.home_team.id,
            teamName : bdlGame.home_team.abbreviation
        },
        awayTeam : {
            teamId : bdlGame.visitor_team.id,
            teamName : bdlGame.visitor_team.abbreviation,
        }
    }) as IGame
}

const createStatusText = (dateString : string) => {
    return new Date(dateString).toLocaleTimeString('en-US',{
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23' // Use 24-hour format
      })
}