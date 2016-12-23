if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

/**
 * Constructor for the standings abridged widget
 * @Constructor
 */
PULSE.CLIENT.CRICKET.StandingsAbridged = function( container, config, tournament, match )
{
    this.$container = $( container );
    this.tournament = tournament;
    this.config     = config;
    this.active     = this.config.active;

    // Create standings table
    this.standings = new PULSE.CLIENT.CRICKET.Standings(
        this.$container.find('.standingsTableSmall'),
        this.tournament,
        {},
        {
            groupIndex: 0,
            widgetType: 'abridged',
            active: true
        }
    );
    this.playoffs = new PULSE.CLIENT.CRICKET.Playoffs(
        this.$container.find('.playoffs'),
        this.tournament
    );
    this.tabs = [ this.standings, this.playoffs ];

    var that = this;
    this.setSubscriptions();
};

PULSE.CLIENT.CRICKET.StandingsAbridged.prototype.setSubscriptions = function()
{
    var that = this;
    $( 'body' ).on( 'standings/update', function( e, params )
    {
        if( params.success && !that.stopUpdating )
        {
            that.standings.createTweetButton( that.$container.find( '.tweetStandings' ) );
        }
    } );

    $( 'body' ).on( 'schedule/update', function( e, params )
    {
        if( params.success && !that.navUpdated )
        {
            that.activeTab = that.tournament.isInPlayoffStage() ? 1 : 0;
            that.tabs[ that.activeTab ].activate();
            that.toggle = new PULSE.CLIENT.UI.ToggleNav(
            {
                activeTab: that.activeTab,
                navigationContainer: that.$container.find( '.toggle' ),
                contentContainer: that.$container.find('.tabs'),
                navLinksSelector: 'li a',
                callback: function( selectedTab )
                {
                    that.tabs[ 1 - selectedTab ].deactivate();
                    that.tabs[ selectedTab ].activate();
                }
            } );
            that.navUpdated = true;
        }
    } );
};
if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.Playoffs = function( container, tournament, active )
{
	this.tournament = tournament;
	this.tournamentName = tournament.tournamentName;
	this.$container = $( container );
	this.active = active;

	this.setSubscriptions();

	this.tournament.getMatchSchedule();

	this.templates = {
		matches: 'templates/standings/playoffs.html'
	};
};


PULSE.CLIENT.CRICKET.Playoffs.prototype.setSubscriptions = function()
{
	var that = this;

	$('body').on( 'schedule/update', function(e, params)
	{
		if( params.success && that.tournamentName === params.tournamentName )
		{
			that.hasSchedule = true;
			var count = that.tournament.matchCount();

			if( count > 0 )
			{
				that.renderMatches();
			}
		}
	} );

	$('body').on( 'scoring/update', function(e, params)
	{
		if( params.success && that.tournamentName === params.tournamentName && that.hasSchedule )
		{
			that.renderMatches();
		}
	} );
};

PULSE.CLIENT.CRICKET.Playoffs.prototype.renderMatches = function()
{
	if( !this.active || !this.hasSchedule )
	{
		return;
	}

	var model = this.tournament.getAllMatchesModel('dd/mm/yy');
	var that = this;

	if( that.tournament.playoffs )
	{
		var playoffs = $.grep( model.matches, function( match, i )
		{
			return that.tournament.playoffs[ match.matchId ];
		} );
	}
	else
	{
		var playoffs = [];
	}

	PULSE.CLIENT.Template.publish(
		this.templates.matches,
		this.$container,
		{ matches: playoffs }
	);
};

PULSE.CLIENT.CRICKET.Playoffs.prototype.activate = function()
{
	this.active = true;
	this.renderMatches();

};
PULSE.CLIENT.CRICKET.Playoffs.prototype.deactivate = function()
{
	this.active = false;
};
