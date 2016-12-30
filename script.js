$(function () {
  // window.location.href = '/#';

// An event handler with calls the render function on every hashchange.
	// The render function will show the appropriate content of out page.
	$(window).on('hashchange', function(){
		render(decodeURI(window.location.hash));
	});
	function render(url) {
console.log("calling");
		// Get the keyword from the url.
		var temp = url.split('/')[0];
console.log(temp);

		var	map = {

			// The "Homepage".
			'': function() {
        $(".mycontent").html('');
        $(".myheader").html('');
        putFirstHeader();
        putFirstContent();
			},

			// Single Products page.
			'#team': function() {
        var teamName = url.split('#team/')[1].trim();
        $(".mycontent").html('');
        putTeamContent(teamName);
      // $(".")
				// Get the index of which product we want to show and call the appropriate function.
			},
			"#teamInfo":function(){
			console.log("teaminfo")
		}

		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
window.location.href = '/#';
		}

	}
});
