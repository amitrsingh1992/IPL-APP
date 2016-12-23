
if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.StatsHero = function ( container, config, tournament )
{
	this.$container = $( container );
	this.tournament = tournament;
	this.config 	= config;

	this.$container.find('span.year').text( this.tournament.year || 'All Time' );

	this.leadersOptions = {
		// statTypes: [ 'MostRuns', 'MostWickets', 'PlayerPoints', 'FairPlay' ]
		// statTypes: [ 'MostRuns', 'MostWickets', 'PlayerPoints', 'HighestScores' ]
		statTypes: [ 'MostRuns', 'MostWickets', 'PlayerPoints', 'MostSixes', 'FairPlay', 'BestEconomy' ]
		// statTypes: [ 'MostRuns', 'MostWickets', 'MostSixes' ]
		// statTypes: [ 'MostRuns', 'MostSixes', 'HighestScores', 'BestBattingStrikeRate' ]
		// statTypes: [ 'MostWickets', 'BestBowling', 'BowlingAverage', 'BestEconomy' ]
	};

	this.components = {
		leaders: new PULSE.CLIENT.CRICKET.Leaders( this.$container, config, tournament, this.leadersOptions )
	};
};
