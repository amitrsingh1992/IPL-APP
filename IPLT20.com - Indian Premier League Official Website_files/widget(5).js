if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.Pillar = function( container, config, tournament )
{
    this.$container = $( container );
    this.$pillar = this.$container.find( '.match-pillar' );
    this.$pillarButton = this.$container.find( '.matchCentrePillarIcon' );
    this.$overlay = this.$container.find( '.bg-overlay' );
    this.$scroller = this.$container.find( '.matches-scroller' );
    this.$config = config;
    this.tournament = tournament;

    this.components = {
        schedule: new PULSE.CLIENT.CRICKET.PillarSchedule( this.$container.find( '.slider-fixtures' ), config, tournament ),
        results: new PULSE.CLIENT.CRICKET.PillarResults( this.$container.find( '.slider-results' ), config, tournament )
    };

    this.tabs = [ this.components.schedule, this.components.results ];

    this.scheduleTabIdx = 0;
    this.resultsTabIdx = 1;

    this.setSubscriptions();
    this.setEventListeners();
    this.tournament.getMatchSchedule();
};

PULSE.CLIENT.CRICKET.Pillar.prototype.setSubscriptions = function()
{
    var that = this;
    $( 'body' ).on( 'schedule/update', function( e, params )
    {
        if( params.success && params.tournamentName === that.tournament.tournamentName )
        {
            that.update();
        }
    } );
};

PULSE.CLIENT.CRICKET.Pillar.prototype.setEventListeners = function()
{
    var that = this;

    this.$pillarButton.on( 'click', function( e )
    {
        if( !that.open )
        {
            that.showPillar();
        }
        else
        {
            that.hidePillar();
        }
        e.preventDefault();
    } );

    this.$overlay.on( 'click', function( e )
    {
        that.hidePillar();
    } );
};

PULSE.CLIENT.CRICKET.Pillar.prototype.showPillar = function()
{
    this.$overlay.removeClass( 'hide-pillar' );
    this.$pillar.removeClass( 'hide-pillar' );
    this.$scroller.removeClass( 'hide-pillar' );
    this.$pillarButton.removeClass( 'slide-right' );
    this.open = true;
};

PULSE.CLIENT.CRICKET.Pillar.prototype.hidePillar = function()
{
    this.$overlay.addClass( 'hide-pillar' );
    this.$pillar.addClass( 'hide-pillar' );
    this.$scroller.addClass( 'hide-pillar' );
    this.$pillarButton.addClass( 'slide-right' );
    this.open = false;
};

PULSE.CLIENT.CRICKET.Pillar.prototype.update = function()
{
    if( this.tournament.getTournamentState() !== 'C' )
    {
        var defaultTab = this.scheduleTabIdx;
    }
    else
    {
        var defaultTab = this.resultsTabIdx;
        this.$pillar.addClass( 'showResults' );
    }

    if( this.defaultTab !== defaultTab )
    {
        this.defaultTab = defaultTab;
        this.setNavigation();
        this.tabs[ this.defaultTab ].activate();
    }
};

PULSE.CLIENT.CRICKET.Pillar.prototype.setNavigation = function()
{
    var that = this;
    this.toggle = new PULSE.CLIENT.UI.ToggleNav(
    {
        activeTab: this.defaultTab,
        navigationContainer: this.$container.find( '.matches-scroller-toggle-tabs' ),
        contentContainer: this.$container.find('.columns'),
        navLinksSelector: 'p',
        callback: function( selectedTab )
        {
            that.tabs[ 1 - selectedTab ].deactivate();
            that.tabs[ selectedTab ].activate();
        }
    } );
};
if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.ScrollablePillar = function( $container )
{
    this.$container = $container;
    this.$matchesScroller = this.$container.closest( '.matches-scroller' );

    this.setEventListeners();
};

PULSE.CLIENT.CRICKET.ScrollablePillar.prototype.setEventListeners = function()
{
    var that = this;
    this.$matchesScroller.on( 'click', '.btn', function( e )
    {
        if( $( this ).hasClass( 'prev' ) )
        {
            that.scroll( true );
        }
        else if( $( this ).hasClass( 'next' ) )
        {
            that.scroll( false );
        }
        e.preventDefault();
    } );
};

PULSE.CLIENT.CRICKET.ScrollablePillar.prototype.scroll = function( left )
{
    var $blocks = this.$container.children( '[data-match-id]' );
    var blockWidth = $blocks.first().outerWidth( false );

    var parentWidth = this.$container.parent().width();

    var currentPos = parseInt( this.$container.css( 'left' ), 10 );
    if( isNaN( currentPos ) )
    {
        currentPos = 0;
    }
    var scrollAmount = blockWidth * Math.floor( parentWidth / blockWidth );
    var newPos = currentPos + ( left ? 1 : -1 ) * scrollAmount;

    if( newPos > 0 )
    {
        newPos = 0;
    }
    var totalWidth = 0;
    $blocks.each( function()
    {
        totalWidth += $( this ).outerWidth( false );
    } );
    if( newPos + totalWidth < parentWidth )
    {
        var buttonsOffset = this.$matchesScroller.find( '.scrollNav' ).width();
        var windowWidth = $( window ).width();
        if( windowWidth > buttonsOffset * 2 + parentWidth )
        {
            buttonsOffset = 0;
        }
        else
        {
            var diff = ( windowWidth - parentWidth ) / 2;
            buttonsOffset -= diff;
        }
        newPos = parentWidth - totalWidth - buttonsOffset;
    }

    this.$container.addClass( 'animated' );
    this.$container.css( 'left', newPos + 'px' );
};
if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.PillarSchedule = function( $container, config, tournament )
{
    PULSE.CLIENT.CRICKET.ScrollablePillar.call( this, $container );
    this.config = config;
    this.tournament = tournament;

    this.templates = {
        matches: 'templates/pillar/schedule.html',
        match: 'templates/pillar/live-match.html'
    };

    this.setSubscriptions();
};

PULSE.CLIENT.CRICKET.PillarSchedule.prototype = Object.create( PULSE.CLIENT.CRICKET.ScrollablePillar.prototype );
PULSE.CLIENT.CRICKET.PillarSchedule.prototype.constructor = PULSE.CLIENT.CRICKET.ScrollablePillar;

PULSE.CLIENT.CRICKET.PillarSchedule.prototype.setSubscriptions = function()
{
    var that = this;
    $( 'body' ).on( 'schedule/update', function( e, params )
    {
        if( params.success && params.tournamentName === that.tournament.tournamentName )
        {
            that.hasData = true;
            if( that.active )
            {
                that.update();
            }
        }
    } );

    $( 'body' ).on( 'scoring/update', function( e, params )
    {
        if( params.success && that.tournament.getMatchById( params.matchId ) )
        {
            that.updateMatch( params.matchId );
        }
    } );
};

PULSE.CLIENT.CRICKET.PillarSchedule.prototype.update = function()
{
    var liveModel, upcomingModel;

    var ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    var ONE_DAY = 24 * 60 * 60 * 1000;

    var startDate = new Date();
    var endDate = new Date( new Date().getTime() + ONE_WEEK );

    var tournamentState = this.tournament.getTournamentState();

    if( tournamentState === 'U' )
    {
        liveModel = { matches: [] };

        var match = this.tournament.getMatchById( this.tournament.upcomingMatches[ 0 ] );
        startDate = match.getMatchDateObj();
        endDate = new Date( startDate.getTime() + ONE_WEEK );

        upcomingModel = this.tournament.getMatchArrayModelForType( 'upcoming', false, {
            dateFormat: 'dddd mmmm dS',
            timeFormat: 'htt',
            startDate: startDate,
            endDate: endDate
        } );
    }
    else if( tournamentState === 'C' )
    {
        liveModel = { matches: [] };
        upcomingModel = { matches: [] };
    }
    else
    {
        liveModel = this.tournament.getMatchArrayModelForType( 'live', false, {
            dateFormat: 'dddd mmmm dS',
            timeFormat: 'htt',
        } );
        upcomingModel = this.tournament.getMatchArrayModelForType( 'upcoming', false, {
            dateFormat: 'dddd mmmm dS',
            timeFormat: 'htt',
            endDate: endDate
        } );
    }

    var startDay = PULSE.CLIENT.getFormattedTimeZoneDate( startDate, 'd', 5.5 );
    var startMonth = PULSE.CLIENT.getFormattedTimeZoneDate( startDate, 'mmmm', 5.5 );
    var endDay = PULSE.CLIENT.getFormattedTimeZoneDate( new Date( endDate.getTime() - ONE_DAY ), 'd', 5.5 );
    var endMonth = PULSE.CLIENT.getFormattedTimeZoneDate( new Date( endDate.getTime() - ONE_DAY ), 'mmmm', 5.5 );

    var headerString = startMonth + ' ' + startDay + ' - ';
    if( startMonth !== endMonth )
    {
        headerString += endMonth + ' ';
    }
    headerString += endDay;

    var prematchMatches = $.grep( liveModel.matches, function( matchModel )
    {
        return matchModel.matchState === 'U';
    } );
    var liveMatches = $.grep( liveModel.matches, function( matchModel )
    {
        return matchModel.matchState === 'L';
    } );

    var model = {
        headerString: headerString,
        liveMatches: liveMatches,
        upcomingMatches: [].concat( prematchMatches, upcomingModel.matches )
    };

    PULSE.CLIENT.Template.publish( this.templates.matches, this.$container, model );
};

PULSE.CLIENT.CRICKET.PillarSchedule.prototype.updateMatch = function( matchId )
{
    var $container = this.$container.find( '[data-match-id="' + matchId + '"]' );
    if( $container.length )
    {
        var model = this.tournament.getMatchById( matchId ).getFullModel( {
            dateFormat: 'dddd mmmm dS',
            timeFormat: 'htt',
        } );
        if( model.matchState === 'L' )
        {
            PULSE.CLIENT.Template.publish( this.templates.match, $container, model );
        }
        else if( model.matchState === 'C' || model.matchState !== $container.attr( 'data-match-state' ) )
        {
            this.update();
        }
    }
};

PULSE.CLIENT.CRICKET.PillarSchedule.prototype.activate = function()
{
    if( !this.active )
    {
        this.active = true;
        if( this.hasData )
        {
            this.update();
        }
        this.$container.show();
    }
};

PULSE.CLIENT.CRICKET.PillarSchedule.prototype.deactivate = function()
{
    if( this.active )
    {
        this.active = false;
        this.$container.hide();
    }
};
if ( !PULSE )                       { var PULSE = {}; }
if ( !PULSE.CLIENT )                { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )        { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.PillarResults = function( $container, config, tournament )
{
    PULSE.CLIENT.CRICKET.ScrollablePillar.call( this, $container );
    this.config = config;
    this.tournament = tournament;

    this.templates = {
        matches: 'templates/pillar/results.html'
    };

    this.setSubscriptions();
};

PULSE.CLIENT.CRICKET.PillarResults.prototype = Object.create( PULSE.CLIENT.CRICKET.ScrollablePillar.prototype );
PULSE.CLIENT.CRICKET.PillarResults.prototype.constructor = PULSE.CLIENT.CRICKET.ScrollablePillar;

PULSE.CLIENT.CRICKET.PillarResults.prototype.setSubscriptions = function()
{
    var that = this;
    $( 'body' ).on( 'schedule/update', function( e, params )
    {
        if( params.success && params.tournamentName === that.tournament.tournamentName )
        {
            that.hasData = true;
            if( that.active )
            {
                that.update();
            }
        }
    } );
};

PULSE.CLIENT.CRICKET.PillarResults.prototype.update = function()
{
    var model = this.tournament.getMatchArrayModelForType( 'complete', true );
    PULSE.CLIENT.Template.publish( this.templates.matches, this.$container, model );
};

PULSE.CLIENT.CRICKET.PillarResults.prototype.activate = function()
{
    if( !this.active )
    {
        this.active = true;
        if( this.hasData )
        {
            this.update();
        }
        this.$container.show();
    }
};

PULSE.CLIENT.CRICKET.PillarResults.prototype.deactivate = function()
{
    if( this.active )
    {
        this.active = false;
        this.$container.hide();
    }
};
