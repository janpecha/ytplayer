YtPlayer
########

Usage
=====

1) Link stylesheet 'ytplayer.css'
	<link rel="stylesheet" media="screen,projection,tv" href="ytplayer.css" type="text/css">


2) Import Zepto.js or JQuery

	Zepto.js:
	<script type="text/javascript" src="zepto.js"></script>
	
	JQuery:
	<script type="text/javascript" src="jquery.min.js"></script>

3) Import YtPlayer
	<script type="text/javascript" src="ytplayer.js"></script>


4) Add to page <div> with any ID
	<div id="ytplayer"></div>


5) Create player (set options & list of videos)
	<script type="text/javascript">
		YtPlayer.create(yourDivId, listOfVideos[, options]);
	</script>

	- yourDivId - string
	- listOfVideos - array of objects
	- options - object - [optional]


List of videos
==============
	[
		video1,
		video2,
		...
	]
	
	- video1, video2, ...
		{
			name: 'YT example video',
			id: 'u1zgFlCw8Aw'
		}


Options
=======
	{
		opt1: value,
		opt2: value,
		...
	}
	
	- width (int) - default: 640
	- height (int) - default: 390
	- playerId (string) - default: 'ytplayer-ytplayer'
	- tryNum (int) - default: 10
	
	- strNext (string) - default: 'Next'
	- strPrev (string) - default: 'Prev'
	- strCycle (string) - default: 'Cycle'
	- strRandom (string) - default: 'Random'
	
	- cycle (bool) - default: true
	- randomly (bool) - default: false
	- thumbs (bool) - default: false


Example
=======

- see file ytplayer.html


License
=======

- for more information see license.txt


Author
======

- Jan Pecha (http://janpecha.iunas.cz)

