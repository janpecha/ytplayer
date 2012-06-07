/**
 * @author		Jan Pecha, <janpecha@email.cz>
 * @version		2012-06-04-2
 * @license		see license.txt
 */

var YtPlayer = YtPlayer || {};


YtPlayer.player = null;
YtPlayer.options = {};
YtPlayer.list = {};
YtPlayer.played = 0;


YtPlayer.create = function(elementId, videoList, options) {
	// Default options
	options = options || {};
	options.width = options.width || 640;
	options.height = options.height || 390;
	options.playerId = options.playerId || 'ytplayer-ytplayer';
	options.tryNum = options.tryNum || 10;

	options.strNext = options.strNext || 'Next';
	options.strPrev = options.strPrev || 'Prev';
	options.strCycle = options.strCycle || 'Cycle';
	options.strRandom = options.strRandom || 'Random';
	
	if(typeof options.cycle === "undefined")
	{
		options.cycle = true;
	}
	else
	{
		// convert to (bool)
		options.cycle = !!options.cycle;
	}
	
	if(typeof options.randomly === "undefined")
	{
		options.randomly = false;
	}
	else
	{
		// convert to (bool)
		options.randomly = !!options.randomly;
	}
	
	if(typeof options.thumbs === "undefined")
	{
		options.thumbs = false;
	}
	else
	{
		// convert to (bool)
		options.thumbs = !!options.thumbs;
	}
	
	YtPlayer.options = options;
	YtPlayer.list = videoList;
	
	// Create elements
	YtPlayer.createElements(elementId, options);
	
	// Fill video list
	YtPlayer.setVideoList(elementId, videoList, options.thumbs);
	
	// Init Youtube API
	YtPlayer.initYoutubeApi();
	
	// Control buttons event binding
	YtPlayer.buttonsEventBind(elementId);
	
	// Update Cycle button
	YtPlayer.updateCycleButton($('#' + elementId + ' .ytplayer-control-cycle').first());
	
	// Update Random button
	YtPlayer.updateRandomButton($('#' + elementId + ' .ytplayer-control-random').first());
}


YtPlayer.createElements = function(elementId, options) {
	$('#' + elementId).first().html('<div class="ytplayer-box" style="width:' + options.width + 'px">'
			+ '<div id="' + options.playerId + '"></div>'
			+ '<div class="ytplayer-control-bar">'
				+ '<span class="ytplayer-control-prev ytplayer-btn">' + options.strPrev + '</span> '
				+ '<span class="ytplayer-control-next ytplayer-btn">' + options.strNext + '</span> '
				+ '<span class="ytplayer-control-cycle ytplayer-btn">' + options.strCycle + '</span> '
				+ '<span class="ytplayer-control-random ytplayer-btn">' + options.strRandom + '</span>'
				+ '<span class="ytplayer-clearer">&nbsp;</span>'
			+ '</div>'
			+ '<div class="ytplayer-videolist"></div>'
		+ '</div>'
	);
}


YtPlayer.setVideoList = function(elementId, videoList, thumbs) {
	var videoListElement = $('#' + elementId + ' .ytplayer-videolist').first();
	
	for(var i = 0; i < videoList.length; i++)
	{
		var htmlCode = '<div class="ytplayer-videoitem" id="ytplayer-item-' + videoList[i].id + '">';
		
		if(thumbs)
		{
			htmlCode += '<span class="ytplayer-img"><img src="http://img.youtube.com/vi/' + videoList[i].id + '/default.jpg" alt=""></span>';
		}
		
		htmlCode += '<span class="ytplayer-name">' + videoList[i].name + '</span>'
		htmlCode += '</div>';
		
		var item = $(htmlCode)
			.data('ytplayer-video-id', videoList[i].id)
			.data('ytplayer-video-num', i)
			.on('click', function() {
				var item = $(this);
		
				YtPlayer.playVideo(item.data('ytplayer-video-id'), item.data('ytplayer-video-num'));
		
				return false;
			});
		
		videoListElement.append(item);
	}
}


YtPlayer.initYoutubeApi = function() {
	var tag = document.createElement('script');
	tag.src = "http://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


YtPlayer.buttonsEventBind = function(elementId) {
	// Prev button
	$('#' + elementId + ' .ytplayer-control-prev').first().on('click', YtPlayer.prevVideo);
	
	// Next button
	$('#' + elementId + ' .ytplayer-control-next').first().on('click', function() {
		YtPlayer.nextVideo(true);
	});
	
	// Cycle button
	$('#' + elementId + ' .ytplayer-control-cycle').first().on('click', function() {
		if(YtPlayer.options.cycle === true)
		{
			YtPlayer.options.cycle = false;
		}
		else
		{
			YtPlayer.options.cycle = true;
		}
		
		YtPlayer.updateCycleButton(this);
	});
	
	// Random button
	$('#' + elementId + ' .ytplayer-control-random').first().on('click', function() {
		if(YtPlayer.options.randomly === true)
		{
			YtPlayer.options.randomly = false;
		}
		else
		{
			YtPlayer.options.randomly = true;
		}
		
		YtPlayer.updateRandomButton(this);
	});
}


YtPlayer.onApiReady = function() {
	// Create player
	YtPlayer.player = new YT.Player(YtPlayer.options.playerId, {
		width: YtPlayer.options.width,
		height: YtPlayer.options.height,
		videoId: YtPlayer.list[0].id,
		events: {
			'onReady': YtPlayer.onPlayerReady,
			'onStateChange': YtPlayer.onPlayerStateChange
		}
	});
}


YtPlayer.playVideo = function(videoId, videoNum) {
	YtPlayer.player.loadVideoById(videoId);
	YtPlayer.played = videoNum;
	
	$('.ytplayer-videoitem').removeClass('ytplayer-playing');
	$('#ytplayer-item-' + videoId).addClass('ytplayer-playing');
}


YtPlayer.nextVideo = function(cycle) {
	if(YtPlayer.options.randomly)
	{
		var n_played = YtPlayer.played;
		var trynum = YtPlayer.options.tryNum;
		
		while(YtPlayer.played === n_played)
		{
			n_played = Math.floor(Math.random() * YtPlayer.list.length);
			trynum --;
			
			if(trynum <= 0)
			{
				break;
			}
		}
		
		YtPlayer.played = n_played;
	}
	else
	{
		YtPlayer.played ++;
		
		if(YtPlayer.played >= YtPlayer.list.length)
		{
			if(cycle)
			{
				YtPlayer.played = 0;
			}
			else
			{
				YtPlayer.played --;
				return false;
			}
		}
	}
	
	YtPlayer.playVideo(YtPlayer.list[YtPlayer.played].id, YtPlayer.played);
}


YtPlayer.prevVideo = function() {
	YtPlayer.played --;
	
	if(YtPlayer.played < 0)
	{
		YtPlayer.played = YtPlayer.list.length - 1;
	}
	
	YtPlayer.playVideo(YtPlayer.list[YtPlayer.played].id, YtPlayer.played);
}


YtPlayer.updateCycleButton = function(cycleButton) {
	if(YtPlayer.options.cycle === true)
	{
		$(cycleButton).addClass('ytplayer-button-active');
	}
	else
	{
		$(cycleButton).removeClass('ytplayer-button-active');
	}
}


YtPlayer.updateRandomButton = function(randomButton) {
	if(YtPlayer.options.randomly === true)
	{
		$(randomButton).addClass('ytplayer-button-active');
	}
	else
	{
		$(randomButton).removeClass('ytplayer-button-active');
	}
}


YtPlayer.onPlayerStateChange = function(event) {
	if(event.data == YT.PlayerState.ENDED)
	{
		YtPlayer.nextVideo(YtPlayer.options.cycle);
	}
}


YtPlayer.onPlayerReady = function(event) {
	$('#ytplayer-item-' + event.target.getVideoData().video_id).addClass('ytplayer-playing');
	//event.target.playVideo();
}


function onYouTubePlayerAPIReady() {
	YtPlayer.onApiReady();
}


