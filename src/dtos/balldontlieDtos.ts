export interface BDLGame {
	id: number;
	date: string;
	season: number;
	status: string;
	period: number;
	time: any;
	postseason: boolean;
	home_team_score: number;
	visitor_team_score: number;
	home_team: BDLHomeTeam;
	visitor_team: BDLVisitorTeam;
}

export interface BDLHomeTeam {
	id: number;
	conference: string;
	division: string;
	city: string;
	name: string;
	full_name: string;
	abbreviation: string;
}

export interface BDLVisitorTeam {
	id: number;
	conference: string;
	division: string;
	city: string;
	name: string;
	full_name: string;
	abbreviation: string;
}
