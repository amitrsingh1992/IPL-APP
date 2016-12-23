
if ( !PULSE )                   	{ var PULSE = {}; }
if ( !PULSE.CLIENT )            	{ PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET )    	{ PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.SeasonNumbers = function ( container, config, tournament )
{
	this.$container = $( container );
	this.tournament = tournament;
    this.config     = config;
    this.urlGenerator = PULSE.CLIENT.CRICKET.getUrlGenerator( tournament );

    this.statTypes = [ 'HighestScores', 'BestBowling' ];
    this.intervals = [];
    this.inTransition = [];
    this.loopTime = 5000; //it needs to be more than 2000 cause is the transition timing in the css

    //data is ready?
    this.gotSeasonNumbers = false;
    this.didYouKnowToDo = false;
    this.LeadersToDo = false;
    this.scheduleToDo = false;
    this.videoToDo = false;

	// Add feeds to data manager
    // this.twitter.getTally( this.TALLY_NAME, { fileName: 'ipl2013count' } );

    //call diduknow
    this.tournament.getDidYouKnowData();
    //call numbers
	this.tournament.getTournamentInNumbers();
    //call leaders
    this.getLeaders();
    //call schedule
    this.tournament.getMatchSchedule();
    //get video
    this.tournament.getVideosByTag( true,"channel:ipl-magic" );

	// React to data updates
	this.setSubscriptions();

    this.templates = {
        HighestScores: 'templates/statsnumbers/highest-individual.html',
        BestBowling: 'templates/statsnumbers/best-bowling.html',
        magicmoments: "templates/statsnumbers/magic-moments.html",
        sixes: "templates/statsnumbers/most-sixes.html",
        fastestBallKmh: "templates/statsnumbers/fastest-ball.html",
        wickets: "templates/statsnumbers/most-wickets.html",
        runs: "templates/statsnumbers/most-runs.html",
        fifties: "templates/statsnumbers/most-fifties.html",
        runsFromBoundaries: "templates/statsnumbers/most-fours.html",
        sixDistance: "templates/statsnumbers/longest-six.html",
        superOvers: "templates/statsnumbers/super-overs.html",
        hatTricks: "templates/statsnumbers/hat-tricks.html",
        lastBallFinishes: "templates/statsnumbers/last-ball-finishes.html"
    };

    this.$container.find( '.sectionTitle .year' ).html( this.tournament.year || 'IPL' );

    var that = this;
    var delta = 0;
    $('.toAnimate').each(function( key, value ){
        var element = this;
        setTimeout(function(){
            //set animations
            that.setScrollAnimation( element, key )
        }, 100 + delta);
        //increment delta
        delta += 1000;
    });
};

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.setSubscriptions = function()
{
	var that = this;

    //on Leaders
    $('body').on( 'stats/update', function( e, params )
    {
        if( params.success
            && params.tournamentName === that.tournament.tournamentName
            && $.inArray( params.statName, that.statTypes ) > -1 )
        {
            that.refreshLeaders( params.statName, params.url );
        }
    } );

    //on numbers
    $('body').on( 'inNumbers/update', function( e, params )
    {
        that.refreshSeasonNumbers();
    } );

    //on Did u know
    $('body').on( 'didYouKnow/update', function( e, params )
    {
        that.refreshDidYouKnow();
    } );

    //on Schedule
    $('body').on( 'schedule/update', function( e, params )
    {
        if( params.success )
        {
            that.matches = that.getMatches().matches;
            that.getScheduleStats();
        }
    } );

    $('body').on( 'tag/videos', function( e, params )
    {
        if( params.success )
        {
            that.refreshVideo();
        }
    } );

};

//Get functions
PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.getLeaders = function( statsName, statsDataName )
{
    for( var i = 0, iLimit = this.statTypes.length; i < iLimit; i++ )
    {
        this.tournament[ "get" + this.statTypes[i] + "Data" ]( false );
    }
}

//Refresh Functions
PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.refreshLeaders = function( statsName, statsDataName )
{
    var that  = this,
        model = this.tournament.getModelArrayFor( statsName, statsDataName, false, { limit: 1 } );
        model.year = this.tournament.year;

    PULSE.CLIENT.Template.publish(
        that.templates[ statsName ],
        that.$container.find("#" + statsName),
        model,
        function() {
            var $container = that.$container.find("#" + statsName);
            that.loadImages( $container, that.urlGenerator );
        }
    );
};

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.refreshVideo = function()
{
    var that = this;

    var model = {
        url: this.tournament.videosData.items[0].videoUrl,
        cover: this.tournament.videosData.items[0].thumbnails[1].url,
        duration: this.getVideoDurationString( this.tournament.videosData.items[0].length )
    };

    PULSE.CLIENT.Template.publish(
        that.templates[ "magicmoments" ],
        that.$container.find("#magic_moments"),
        model,
        function() {}
    );
}


PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.padValue = function( value )
{
    return value < 10 ? "0" + value : value + "";
}

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.getVideoDurationString = function( duration )
{
    var d = parseInt( duration ), mins, secs;
    d = Math.floor( d / 1000 );
    mins = Math.floor( d / 60 );
    secs = d - ( 60 * mins );

    return this.padValue( mins ) + ":" + this.padValue( secs );

}

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.refreshSeasonNumbers = function()
{
	var that = this,
		model = this.tournament.getInNumbersModelWithoutTW();

    for( key in model)
    {
        var singlemodel = {
            variable: model[key],
            year: this.tournament.year
        }

        PULSE.CLIENT.Template.publish(
            that.templates[key],
            that.$container.find( '#' + key ),
            singlemodel,
            function() {}
        );
    }
};

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.refreshDidYouKnow = function()
{
    var didYouKnow = this.tournament.getLatestDidYouKnowText();
    this.$container.find( '.didYouKnow p' ).text( didYouKnow );
};

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.loadImages = function( $container, urlGenerator )
{
    $imgContainers = $container.find( '.imageContainer' );

    $imgContainers.each( function() {
        var playerId = $(this).attr( 'data-player-id' );
        urlGenerator.setPlayerImageLoader( playerId, 210, this, 'png' );
    } );
};

//UI FUNCTIONS

/**
    This function is setting the animation for each of the .toAnimate classes
    @scope: the actual ul element to be animated
    @animationIndex: this is a number that is going to be used to get back the setInterval in this.intervals
**/
PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.setScrollAnimation = function( scope, animationIndex )
{
    var that = this;
    var $scope = $( scope );

    //set the setInterval reference
    $scope.attr( 'data-scope', animationIndex );

    //set-up the slides
    $scope.find(".numbersSlides > li").each(function( key, value )
    {
        var element = $( this );
        element.css( "left","+" + $scope.width() + "px" );
        element.attr( "data-slide",key );
        if( key === 0 )
        {
            element.css("left","0px").addClass("active");
        }
        element.css("opacity","1");
    });

    //set-up the pagination
    $scope.find(".numbersPagination > li").each(function( key, value )
    {
        var element = $( this );
        if( key === 0 )
        {
            element.addClass("active");
        }
    });

    //if we have the card with image rotating
    if( $scope.find(".toAnimate_image").length > 0 )
    {
        $scope.find(".toAnimate_image li").each(function( key, value ){
            var element = $( this );
            element.css("opacity","0");
            element.attr( "data-image",key );
            if( key === 0 )
            {
                element.css("opacity","1");
            }
        });
    }

    //push the interval into the setinterval array and start the animation
    this.intervals[animationIndex] = setInterval(function(){
        that.scrollingAnimation( scope );
    }, that.loopTime);

    //click function on navigation
    $scope.find(".numbersPagination > li").click(function(){
        //get the general .toAnimate parent
        var scopeContainer = $( this ).parent().parent();
        //get the index fot the setinterval
        var scopeContainerIndex = scopeContainer.attr('data-scope');

        if( !that.inTransition[scopeContainerIndex] )
        {
            var options = {
                specificSlide: scopeContainer.find('li').index( this ),
                scopeContainerIndex: scopeContainerIndex
            }
            clearInterval( that.intervals[scopeContainerIndex] );
            that.scrollingAnimation( scopeContainer, options );
        }
    });
}

/**
    This function is actually making the slide animation
    @container: the actual ul element to be animated
    @options: for the click event, see options above
**/
PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.scrollingAnimation = function( container, options )
{
    var that = this;
    this.inTransition[ $( container ).attr( 'data-scope' ) ] = true;

    //slides
    var slides = $( container ).find(".numbersSlides");
    // var allSlides = $( container ).find(".numbersSlides li");
    var currentSlide = slides.find("li.active");
    var nextSlide = currentSlide.next();
    var nextSlideWidth = $( container ).width(); //note is the width of the container not the slide
    var prevSlide = currentSlide.prev();

    //if someone clicked
    if( options )
    {
        var specificSlide = options.specificSlide;
    }

    //pagination
    var pagination = $( container ).find(".numbersPagination");
    var paginationLi = pagination.find("li");
    var paginationLiLength = paginationLi.length;
    var paginationLiActive = pagination.find(".active");
    var pactiveindex = paginationLi.index( paginationLiActive );

    if( $( container ).find(".toAnimate_image").length > 0 )
    {
        var images = $( container ).find(".toAnimate_image li");
    }

    //click
    if( specificSlide != null && ( specificSlide < currentSlide.attr("data-slide") || specificSlide > currentSlide.attr("data-slide") ) )
    {
        console.log(specificSlide);
        //change pagination
        paginationLi.removeClass("active");
        paginationLi.eq(specificSlide).addClass("active");

        //images
        if( images )
        {
            images.removeClass("active");
            images.css("opacity","0");
            // var prova = nextSlide.attr("data-slide");
            $( container ).find("li[data-image='" + specificSlide + "']").css("opacity","1");
        }

        //rimuovi la slide in piu
        prevSlide.remove();

        var allSlidesLength = slides.find("li").length;

        currentSlide.removeClass("active");
        var cloneOthers = document.createElement("ul");
        var max = allSlidesLength - 1;

        var slideindex = specificSlide + 1;
        for (var i = 0; i < max; i++) {
                if( slideindex === allSlidesLength)
                {
                    slideindex = 0;
                }
                var thisClone = slides.find("li[data-slide='" + slideindex + "']").clone().css("left","+" + nextSlideWidth + "px").addClass('notransition')
                $( cloneOthers ).append( thisClone );
                slideindex++;
            };

        //animation
        if( specificSlide < currentSlide.attr("data-slide") )
        {
            //clona la slide che mi serve come prima
            var clone = slides.find("li[data-slide='" + specificSlide + "']").addClass('notransition').css("left","-" + nextSlideWidth + "px").clone();

            //prependi la interessata
            slides.prepend( clone.removeClass('notransition') );
            currentSlide.css("left"); //hack
            currentSlide.css("left","+" + nextSlideWidth + "px");
            currentSlide.prev().css("left"); //hack
            currentSlide.prev().css("left","0px").addClass("active");

            currentSlide.prev().one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
                function() {
                 var newSlidesTrack = slides.find('li');
                //rimuovi tutte le altre e appendi le altre
                for (var j = 1; j < newSlidesTrack.length; j++) {
                    newSlidesTrack.eq(j).remove();
                }
                slides.append( $( cloneOthers ).find('li').removeClass('notransition') );
                that.intervals[options.scopeContainerIndex] = setInterval(function(){
                    that.scrollingAnimation( container );
                }, that.loopTime);
                $(this).off('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd otransitionend MSTransitionEnd');
            });

            // setTimeout(function(){
            //     var newSlidesTrack = slides.find('li');
            //     //rimuovi tutte le altre e appendi le altre
            //     for (var j = 1; j < newSlidesTrack.length; j++) {
            //         newSlidesTrack.eq(j).remove();
            //     }
            //     slides.append( $( cloneOthers ).find('li').removeClass('notransition') );
            //     that.intervals[options.scopeContainerIndex] = setInterval(function(){
            //         that.scrollingAnimation( container );
            //     }, that.loopTime);
            // },2000);

        }
        else if( specificSlide > currentSlide.attr("data-slide") )
        {
            var clone = slides.find("li[data-slide='" + specificSlide + "']").addClass('notransition').css("left","+" + nextSlideWidth + "px").clone();

            var newSlidesTrack = slides.find('li');
            for (var j = 1; j < newSlidesTrack.length; j++) {
                newSlidesTrack.eq(j).remove();
            }

            slides.append( clone.removeClass('notransition') );
            slides.append( $( cloneOthers ).find('li').removeClass('notransition') );
            currentSlide.css("left"); //hack
            currentSlide.css("left","-" + nextSlideWidth + "px");
            currentSlide.next().css("left"); //hack
            currentSlide.next().css("left","0px").addClass("active");

            currentSlide.next().one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
                function() {
                // setTimeout(function(){
                    currentSlide.remove();
                    that.intervals[options.scopeContainerIndex] = setInterval(function(){
                        that.scrollingAnimation( container );
                    }, that.loopTime);
                    $(this).off('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd otransitionend MSTransitionEnd');
            });
        }

    }
    else
    {
        //change pagination
        paginationLi.removeClass("active");
        if( pactiveindex + 1 == paginationLiLength )
        {
            paginationLi.eq(0).addClass("active");
        }
        else
        {
            paginationLi.eq( pactiveindex + 1 ).addClass("active");
        }

        //images
        if( images )
        {
            images.removeClass("active");
            images.css("opacity","0");
            var prova = nextSlide.attr("data-slide");
            $( container ).find("li[data-image='" + prova + "']").css("opacity","1");
        }

        //slides
        currentSlide.css("left","-" + nextSlideWidth + "px").removeClass("active");
        nextSlide.css("left","0px");

        var clone = currentSlide.clone().css("left","+" + nextSlideWidth + "px");;
        slides.append( clone );
        nextSlide.addClass("active");
        prevSlide.remove();
    }

    this.inTransition[ $( container ).attr( 'data-scope' ) ] = false;
}


//calculate schedule stats and publish them
PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.getScheduleStats = function( highest )
{
    var highest_total = this.getTotal( true );
    if( highest_total.length > 0)
    {
        PULSE.CLIENT.Template.publish(
                'templates/statsnumbers/highest-total.html',
                this.$container.find('#highest-total'),
                {
                    stats : highest_total
                }
            );
    }

    var biggest_first = this.getMargin( true, true );
    if( biggest_first.length > 0)
    {
        PULSE.CLIENT.Template.publish(
                'templates/statsnumbers/biggest-win-margin-first.html',
                this.$container.find('#biggestFirst'),
                {
                    stats : biggest_first
                }
            );
    }

    var biggest_second = this.getMargin( true, false );
    if( biggest_second.length > 0)
    {
        PULSE.CLIENT.Template.publish(
                'templates/statsnumbers/biggest-win-margin-second.html',
                this.$container.find('#biggestSecond'),
                {
                    stats : biggest_second
                }
            );
    }


}

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.getTotal = function( highest )
{
    var highestTotal = [];

    for ( var i = 0; i < this.matches.length; i++ )
    {
        if ( this.matches[ i ].team1innings && this.matches[ i ].team2innings && this.matches[ i ].team1innings.length > 0 && this.matches[ i ].team2innings.length > 0 && ( this.matches[ i ].team1won || this.matches[ i ].team2won ) )
        {
            for ( var j = 0; j < this.matches[ i ].team1innings.length; j++ )
            {
                var extra = {
                    name: this.matches[ i ].team2fullName,
                    abbreviation: this.matches[ i ].team2abbr,
                    score: this.matches[ i ].team2innings[ j ]
                };
                // 'AGAINST ' + this.matches[ i ].team2fullName;
                // if ( this.matches[ i ].formattedMatchDate )
                // {
                //     var splitDate = this.matches[ i ].formattedMatchDate.split( ' ' );
                //     if ( splitDate && splitDate.length > 0 )
                //     {
                //         extra = extra + ' ( ' + splitDate[ splitDate.length - 1 ] + ' ) ';
                //     }
                // }
                highestTotal.push( { extra : extra,
                                    stat: this.matches[ i ].team1innings[ j ],
                                    team : {
                                            id : this.matches[ i ].team1id,
                                            matchLink: this.matches[ i ].matchLink,
                                            fullName : this.matches[ i ].team1fullName,
                                            abbreviation : this.matches[ i ].team1abbr
                                            }
                                    } );
            }
            for ( var j = 0; j < this.matches[ i ].team2innings.length; j++ )
            {
                var extra = {
                    name: this.matches[ i ].team1fullName,
                    abbreviation: this.matches[ i ].team1abbr,
                    score: this.matches[ i ].team1innings[ j ]
                };
                // var extra = 'AGAINST ' + this.matches[ i ].team1fullName;
                // if ( this.matches[ i ].formattedMatchDate )
                // {
                //     var splitDate = this.matches[ i ].formattedMatchDate.split( ' ' );
                //     if ( splitDate && splitDate.length > 0 )
                //     {
                //         extra = extra + ' ( ' + splitDate[ splitDate.length - 1 ] + ' ) ';
                //     }
                // }
                highestTotal.push( { extra : extra,
                                    stat: this.matches[ i ].team2innings[ j ],
                                    team : {
                                            id : this.matches[ i ].team2id,
                                            matchLink: this.matches[ i ].matchLink,
                                            fullName : this.matches[ i ].team2fullName,
                                            abbreviation : this.matches[ i ].team2abbr
                                            }
                                    } );
            }
        }
    }

    highestTotal.sort( function( a, b )
    {
        var abbrA = parseInt( a.stat.split( "/" )[ 0 ] ), abbrB = parseInt( b.stat.split( "/" )[ 0 ] );
        var wicketA = parseInt( a.stat.split( "/" )[ 1 ] ), wicketB = parseInt( b.stat.split( "/" )[ 1 ] );
        if( abbrA < abbrB ) //sort abbreviation ascending
        {
            if ( highest )
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
        else if ( abbrB < abbrA )
        {
            if ( highest )
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
        else
        {
            if ( wicketA < wicketB )
            {
                if ( highest )
                {
                    return -1;
                }
                else
                {
                    return 1;
                }
            }
            else
            {
                if ( highest )
                {
                    return 1;
                }
                else
                {
                    return -1;
                }
            }
        }
       return 0; //default return value (no sorting)
    } );

    return highestTotal;
}

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.getMatches = function()
{
    return this.tournament.getMatchArrayModelForType(
        'complete',
        false,
        {
            dateFormat: this.dateFormat,
            timeFormat: 'h:MMtt'
        }
    );


};

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.getMargin = function( highest, first )
{
    var margins = [];

    for ( var i = 0; i < this.matches.length; i++ )
    {
        if ( this.matches[ i ].team1innings && this.matches[ i ].team2innings && this.matches[ i ].team1innings.length > 0 && this.matches[ i ].team2innings.length > 0 )
        {
                var score1 = this.getScore( first, i, 0 ),
                    score2 = this.getScore( first, i, 1 ),
                    diff = -1,
                    opponent,
                    team;

                if ( first )
                {
                    if ( this.matches[ i ].team1battingFirst && this.matches[ i ].team1won )
                    {
                        diff = score1 - score2;
                    }

                    if ( this.matches[ i ].team2battingFirst && this.matches[ i ].team2won )
                    {
                        diff = score2 - score1;
                    }
                }
                else
                {
                    if ( this.matches[ i ].team2battingFirst && this.matches[ i ].team1won )
                    {
                        diff = score1;
                    }

                    if ( this.matches[ i ].team1battingFirst && this.matches[ i ].team2won )
                    {
                        diff = score2;
                    }
                }

                if ( diff > 0 )
                {

                    if ( this.matches[ i ].team1won )
                    {
                        opponent = {
                                id : this.matches[ i ].team2id,
                                fullName : this.matches[ i ].team2fullName,
                                abbreviation : this.matches[ i ].team2abbr,
                                score : this.matches[ i ].team2innings[ 0 ]
                                },
                        team = {
                                id : this.matches[ i ].team1id,
                                fullName : this.matches[ i ].team1fullName,
                                abbreviation : this.matches[ i ].team1abbr,
                                score : this.matches[ i ].team1innings[ 0 ]
                                }
                    }
                    else
                    {
                        team = {
                                id : this.matches[ i ].team2id,
                                fullName : this.matches[ i ].team2fullName,
                                abbreviation : this.matches[ i ].team2abbr,
                                score : this.matches[ i ].team2innings[ 0 ]
                                },
                        opponent = {
                                id : this.matches[ i ].team1id,
                                fullName : this.matches[ i ].team1fullName,
                                abbreviation : this.matches[ i ].team1abbr,
                                score : this.matches[ i ].team1innings[ 0 ]
                                }
                    }

                    margins.push( { extra : opponent,
                                    stat: diff,
                                    team : team,
                                    matchLink: this.matches[ i ].matchLink
                                } );
                }
        }
    }

    margins.sort( function( a, b )
    {
        var abbrA = parseInt( a.stat ), abbrB = parseInt( b.stat );
        if( abbrA < abbrB ) //sort abbreviation ascending
        {
            if ( highest )
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
        else
        {
            if ( highest )
            {
                return -1;
            }
            else
            {
                return 1;
            }
        }
       return 0; //default return value (no sorting)
    } );

    for ( var i = 0; i < margins.length; i++ )
    {
        var suffix = ' Wicket';
        if ( first )
        {
            suffix = ' Run';
        }


        if ( margins[ i ].stat != 1 )
        {
            suffix = suffix + 's';
        }

        margins[ i ].stat = margins[ i ].stat + suffix;
    }

    return margins;
}

PULSE.CLIENT.CRICKET.SeasonNumbers.prototype.getScore = function( runs, matchIndex, teamIndex )
{
     var totalScore = 0,
        inningsName = 'team' + ( teamIndex + 1 ) + 'innings';
    for ( var j = 0; j < this.matches[ matchIndex ][ inningsName ].length; j++ )
    {
        var splitInnings = this.matches[ matchIndex ][ inningsName ][ j ].split( "/" );
        if ( runs )
        {
            totalScore = totalScore + parseInt( splitInnings[ 0 ] );
        }
        else
        {
            if ( splitInnings.length > 1 )
            {
                totalScore = totalScore + 10 - parseInt( splitInnings[ 1 ] );
            }
            else
            {
                totalScore = totalScore + 10;
            }
        }
    }

    return totalScore;
}
