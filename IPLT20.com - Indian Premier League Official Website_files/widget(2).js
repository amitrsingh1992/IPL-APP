if ( !PULSE )                              { var PULSE = {}; }
if ( !PULSE.CLIENT )                       { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )               { PULSE.CLIENT.CRICKET = {}; }
if ( !PULSE.CLIENT.CRICKET.SocialSummary ) { PULSE.CLIENT.CRICKET.SocialSummary = {}; }

PULSE.CLIENT.CRICKET.SocialSummary.Instagram = function( $containers, account, template )
{
    this.$containers = $containers;
    this.account = account;
    this.template = template || 'templates/social/summary-instagram-card.html';
    this.instagram = PULSE.CLIENT.getInstagramInstance();

    this.setSubscriptions();
    this.instagram.getMediaListDataForUser( this.account );
};

PULSE.CLIENT.CRICKET.SocialSummary.Instagram.prototype.setSubscriptions = function()
{
    var that = this;
    $( 'body' ).on( 'instagram/user/latest', function( e, params )
    {
        if( params.success && params.account === that.account )
        {
            that.refresh();
        }
    } );
};

PULSE.CLIENT.CRICKET.SocialSummary.Instagram.prototype.refresh = function()
{
    var items = this.instagram.getMediaListModelForUser( this.account, this.$containers.length ).items;

    for( var i = 0, iLimit = items.length; i < iLimit; i++ )
    {
        var item = items[ i ];
        var id = this.$containers.eq( i ).attr( 'data-instagram-id' );
        if( !id )
        {
            this.publish( this.$containers.eq( i ), { item: item }, false );
        }
        else if( id !== item.id )
        {
            this.publish( this.$containers.eq( i ), { item: item }, true );
        }
    }

    var that = this;
    this.stopRefresh();
    this.timeRefresh = setInterval( function() {
        var model = that.instagram.getMediaListModelForUser( that.account, that.$containers.length );
        var $timestamps = that.$containers.find( '.time-stamp' );
        for( var i = 0, iLimit = model.items.length; i < iLimit; i++ )
        {
            var timestamp = model.items[i].timestamp;
            $timestamps.eq( i ).html( timestamp );
        }
    }, 60000 );
};

PULSE.CLIENT.CRICKET.SocialSummary.Instagram.prototype.publish = function( $container, model, animate )
{
    var that = this;
    if( animate )
    {
        $container.find( '.instagram-wrap' ).fadeOut( 100, function()
        {
            PULSE.CLIENT.Template.publish( that.template, $container, model, function()
            {
                $container.find( '.instagram-wrap' ).fadeIn( 300 );
            } );
        } );
    }
    else
    {
        PULSE.CLIENT.Template.publish( this.template, $container, model, function()
        {
            $container.find( '.instagram-wrap' ).show();
        } );
    }

    $container.attr( 'data-instagram-id', model.item.id );
};

PULSE.CLIENT.CRICKET.SocialSummary.Instagram.prototype.stopRefresh = function()
{
    clearInterval( this.timeRefresh );
};
if ( !PULSE )                              { var PULSE = {}; }
if ( !PULSE.CLIENT )                       { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )               { PULSE.CLIENT.CRICKET = {}; }
if ( !PULSE.CLIENT.CRICKET.SocialSummary ) { PULSE.CLIENT.CRICKET.SocialSummary = {}; }

/**
 * Social block widget specific to the CWC site
 *
 * @constructor
 * 
 * @param {Object} container Container object, DOM element found in widget HTML
 * @param {Object} config Configuration options
 * @param {Object} tournament
 */
PULSE.CLIENT.CRICKET.SocialSummary.Main = function( container, config, tournament )
{
    this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator();
    this.$container = $(container);
    this.tournament = tournament;
    this.config = config;

    var $tweets = this.$container.find( '.tweet' );
    var $instagrams = this.$container.find( '.instagram' );
    var $tally = this.$container.find( '.iplTweets' );
    var $trends = this.$container.find( '.topTeam' );

    this.components = {
        'twitter': new PULSE.CLIENT.CRICKET.SocialSummary.Tweet( $tweets, PULSE.CLIENT.CRICKET.IPL.CANARY.LIST ),
        'top-trending': new PULSE.CLIENT.CRICKET.SocialSummary.TopTrending( $trends, PULSE.CLIENT.CRICKET.IPL.CANARY.TRENDING ),
        'tally': new PULSE.CLIENT.CRICKET.SocialSummary.Tally( $tally, PULSE.CLIENT.CRICKET.IPL.CANARY.TALLY ),
        'instagram': new PULSE.CLIENT.CRICKET.SocialSummary.Instagram( $instagrams, PULSE.CLIENT.CRICKET.IPL.INSTAGRAM )
    };

    PULSE.CLIENT.Template.publish(
        'templates/social/follow-us-on.html',
        this.$container.find( '.follow' ),
        { accounts: PULSE.CLIENT.CRICKET.IPL.ACCOUNTS }
    );
};
if ( !PULSE )                              { var PULSE = {}; }
if ( !PULSE.CLIENT )                       { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )               { PULSE.CLIENT.CRICKET = {}; }
if ( !PULSE.CLIENT.CRICKET.SocialSummary ) { PULSE.CLIENT.CRICKET.SocialSummary = {}; }

PULSE.CLIENT.CRICKET.SocialSummary.Tally = function( $container, name )
{
    this.$container = $container;
    this.$count = this.$container.find( '.count span' );
    this.name = name;
    this.twitter = PULSE.CLIENT.getTwitterInstance();

    this.setSubscriptions();
    this.twitter.getTally( this.name, { fileName: this.name } );
};

PULSE.CLIENT.CRICKET.SocialSummary.Tally.prototype.setSubscriptions = function()
{
    var that = this;
    $( 'body' ).on( 'twitter/tally', function( e, params )
    {
        if( params.success && params.name === that.name )
        {
            that.refresh();
        }
    } );
};

PULSE.CLIENT.CRICKET.SocialSummary.Tally.prototype.refresh = function()
{
    var tally = this.twitter.getTweetCount( this.name );
    this.$count.html( tally );
};
if ( !PULSE )                              { var PULSE = {}; }
if ( !PULSE.CLIENT )                       { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )               { PULSE.CLIENT.CRICKET = {}; }
if ( !PULSE.CLIENT.CRICKET.SocialSummary ) { PULSE.CLIENT.CRICKET.SocialSummary = {}; }

PULSE.CLIENT.CRICKET.SocialSummary.TopTrending = function( $container, name, template )
{
    this.$container = $container;
    this.template = template || 'templates/social/top-team.html';
    this.name = name;
    this.twitter = PULSE.CLIENT.getTwitterInstance();

    this.setSubscriptions();
    this.twitter.getRankedTopics( this.name, { fileName: this.name } );
};

PULSE.CLIENT.CRICKET.SocialSummary.TopTrending.prototype.setSubscriptions = function()
{
    var that = this;
    $( 'body' ).on( 'twitter/trending', function( e, params )
    {
        if( params.success && params.name === that.name )
        {
            that.refresh();
        }
    } );
};

PULSE.CLIENT.CRICKET.SocialSummary.TopTrending.prototype.refresh = function()
{
    var model = _.first( this.twitter.getTrendingModel( this.name, 1 ).rankings );
    if( model )
    {
        PULSE.CLIENT.Template.publish( this.template, this.$container, model );
    }
};
if ( !PULSE )                              { var PULSE = {}; }
if ( !PULSE.CLIENT )                       { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )               { PULSE.CLIENT.CRICKET = {}; }
if ( !PULSE.CLIENT.CRICKET.CWC )           { PULSE.CLIENT.CRICKET.CWC = {}; }
if ( !PULSE.CLIENT.CRICKET.SocialSummary ) { PULSE.CLIENT.CRICKET.SocialSummary = {}; }

PULSE.CLIENT.CRICKET.SocialSummary.Tweet = function( $containers, list, template )
{
    this.$containers = $containers;
    this.list = list;
    this.template = template || 'templates/social/summary-tweet-card.html';
    this.twitter = PULSE.CLIENT.getTwitterInstance();

    this.setSubscriptions();
    this.twitter.getList( this.list, { fileName: this.list, interval: 60 } );
};

PULSE.CLIENT.CRICKET.SocialSummary.Tweet.prototype.setSubscriptions = function()
{
    var that = this;
    $( 'body' ).on( 'twitter/list', function( e, params )
    {
        if( params.success && params.name === that.list )
        {
            that.refresh();
        }
    } );
};

PULSE.CLIENT.CRICKET.SocialSummary.Tweet.prototype.refresh = function()
{
    var tweets = this.twitter.getTweetsListModel( this.list, this.$containers.length ).tweets;

    for( var i = 0, iLimit = tweets.length; i < iLimit; i++ )
    {
        var tweet = tweets[ i ];
        var id = this.$containers.eq( i ).attr( 'data-tweet-id' );
        if( !id )
        {
            this.publish( this.$containers.eq( i ), { tweet: tweet }, false );
        }
        else if( id !== tweet.id )
        {
            this.publish( this.$containers.eq( i ), { tweet: tweet }, true );
        }
    }

    var that = this;
    this.stopRefresh();
    this.timeRefresh = setInterval( function() {
        var model = that.twitter.getTweetsListModel( that.list, that.$containers.length );
        var $timestamps = that.$containers.find( '.time-stamp' );
        for( var i = 0, iLimit = model.tweets.length; i < iLimit; i++ )
        {
            var timestamp = model.tweets[i].timestamp;
            $timestamps.eq( i ).html( timestamp );
        }
    }, 60000 );
};

PULSE.CLIENT.CRICKET.SocialSummary.Tweet.prototype.publish = function( $container, tweetModel, animate )
{
    var that = this;
    if( animate )
    {
        $container.find( '.tweet-wrap' ).fadeOut( 100, function()
        {
            PULSE.CLIENT.Template.publish( that.template, $container, tweetModel, function()
            {
                $container.find( '.tweet-wrap' ).fadeIn( 300 );
            } );
        } );
    }
    else
    {
        PULSE.CLIENT.Template.publish( this.template, $container, tweetModel, function()
        {
            $container.find( '.tweet-wrap' ).show();
        } );
    }

    $container.attr( 'data-tweet-id', tweetModel.tweet.id );
};

PULSE.CLIENT.CRICKET.SocialSummary.Tweet.prototype.stopRefresh = function()
{
    clearInterval( this.timeRefresh );
};
