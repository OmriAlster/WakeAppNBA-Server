export interface NBALiveData {
	meta: NBAMeta;
	scoreboard: NBAScoreboard;
}

export interface NBAMeta {
	version: number;
	request: string;
	time: string;
	code: number;
}

export interface NBAScoreboard {
	gameDate: string;
	leagueId: string;
	leagueName: string;
	games: NBAGame[];
}

export interface NBAGame {
	gameId: string;
	gameCode: string;
	gameStatus: number;
	gameStatusText: string;
	period: number;
	gameClock: string;
	gameTimeUTC: string;
	gameEt: string;
	regulationPeriods: number;
	ifNecessary: boolean;
	seriesGameNumber: string;
	gameLabel?: string;
	gameSubLabel?: string;
	seriesText: string;
	seriesConference: string;
	poRoundDesc: string;
	gameSubtype: string;
	homeTeam: NBAHomeTeam;
	awayTeam: NBAAwayTeam;
	gameLeaders: NBAGameLeaders;
	pbOdds: NBAPbOdds;
}

export interface NBAHomeTeam {
	teamId: number;
	teamName: string;
	teamCity: string;
	teamTricode: string;
	wins: number;
	losses: number;
	score: number;
	seed: any;
	inBonus?: string;
	timeoutsRemaining: number;
	periods: NBAPeriod[];
}

export interface NBAPeriod {
	period: number;
	periodType: string;
	score: number;
}

export interface NBAAwayTeam {
	teamId: number;
	teamName: string;
	teamCity: string;
	teamTricode: string;
	wins: number;
	losses: number;
	score: number;
	seed: any;
	inBonus?: string;
	timeoutsRemaining: number;
	periods: NBAPeriod[];
}

export interface NBAGameLeaders {
	homeLeaders: NBAHomeLeaders;
	awayLeaders: NBAAwayLeaders;
}

export interface NBAHomeLeaders {
	personId: number;
	name: string;
	jerseyNum: string;
	position: string;
	teamTricode: string;
	playerSlug?: string;
	points: number;
	rebounds: number;
	assists: number;
}

export interface NBAAwayLeaders {
	personId: number;
	name: string;
	jerseyNum: string;
	position: string;
	teamTricode: string;
	playerSlug?: string;
	points: number;
	rebounds: number;
	assists: number;
}

export interface NBAPbOdds {
	team: any;
	odds: number;
	suspended: number;
}
