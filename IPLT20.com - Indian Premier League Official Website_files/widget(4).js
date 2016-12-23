
if ( !PULSE ) { var PULSE = {}; }
if ( !PULSE.CLIENT ) { PULSE.CLIENT = {}; }
if ( !PULSE.CLIENT.CRICKET ) { PULSE.CLIENT.CRICKET = {}; }

PULSE.CLIENT.CRICKET.Poll = function( container, config, tournament )
{
    this.$container = $( container );

    this.$pollContainer = this.$container.find( '.pulsePoll' );
    this.$pollButton = this.$container.find('.polls');
    this.tournament = tournament;

    this.$pollTournamentName = this.$pollContainer.find( '.pulsePollTournamentName' );
    this.$pollTournamentName.html( this.tournament.fullName );

    this.poll = new PULSE.CLIENT.Poll.ListView(
        this.$pollContainer,
        {
            name: this.tournament.tournamentName + '_poll',
            templates: {
                questions: 'templates/poll/question-list.html',
                question: 'templates/poll/question.html',
                answers: 'templates/poll/question-breakdown.html'
            },
            feedOptions: {
                start: true,
                interval: 30,
                url: this.tournament.tournamentUrlGenerator.makePollDataUrl( this.customer )
                // url: 'http://cdn.pulselive.com/dynamic/data/icc/2015/cwc-2015/poll.js'
            },
            backwardsCompatible: true,
            cookieOptions: {
                path: '/'
            }
        },
        this.tournament
    );

    var that = this;
    this.$pollContainer.on( 'poll/data', function( e, params )
    {
        that.updateQuestionCount();

    } );
    this.$pollContainer.on( 'poll/answer', function( e, params )
    {
        that.updateQuestionCount();
    } );

    this.$pollButton.on( 'click', function( e )
    {
        if( !that.$pollContainer.hasClass( 'open' ) )
        {
            that.poll.refresh();
        }

        that.$pollContainer.prev().toggleClass( 'open');
        that.$pollContainer.toggleClass( 'open' );

        e.preventDefault();
        e.stopPropagation();
    } );
};

PULSE.CLIENT.CRICKET.Poll.prototype.updateQuestionCount = function()
{
    var questions = this.poll.controller.model.getQuestions( 'unanswered' );
    if( questions.length )
    {
        // this.$pollButton.addClass('newQuestion');
        this.$pollButton.find('.count').text( questions.length );
        this.$pollButton.find('.count').show();
    }
    else
    {
        this.$pollButton.find('.count').hide();
    }
};
