/**
 * @author		Jan Pecha, <janpecha@email.cz>
 * @version		2012-06-03-1
 * @todo		2012-06-03 - create CSS stylesheet
 */

var YtPlayer = YtPlayer || {};


YtPlayer.player = null;
YtPlayer.options = {};
YtPlayer.list = {};
//YtPlayer.playerId = '';
YtPlayer.played = 0;


YtPlayer.create = function(elementId, videoList, options) {
	// Default options
	options = options || {};
	options.width = options.width || 640;
	options.height = options.height || 390;
	options.playerId = options.playerId || 'ytplayer-ytplayer';
	//options.loadInfos = options.playerId || false;
	options.strNext = options.strNext || 'Next';
	options.strPrev = options.strPrev || 'Prev';
	options.strCycle = options.strCycle || 'Cycle';
	//options.strRandom = options.strRandom || 'Random';
	
	if(typeof options.cycle === "undefined")
	{
		options.cycle = true;
	}
	
	YtPlayer.options = options;
	YtPlayer.list = videoList;
	
	// Create elements
	YtPlayer.createElements(elementId, options);
	
	// Fill video list
	YtPlayer.setVideoList(elementId, videoList);
	
	// Init Youtube API
	YtPlayer.initYoutubeApi();
	
	// Control buttons event binding
	YtPlayer.buttonsEventBind(elementId);
	
	// Update Cycle button
	YtPlayer.updateCycleButton($('#' + elementId + ' .ytplayer-control-cycle').first());
}


YtPlayer.createElements = function(elementId, options) {
	$('#' + elementId).first().html('<div id="' + options.playerId + '"></div>'
		+ '<div class="ytplayer-control-bar">'
			+ '<span class="ytplayer-control-prev">' + options.strPrev + '</span> '
			+ '<span class="ytplayer-control-next">' + options.strNext + '</span> '
			+ '<span class="ytplayer-control-cycle">' + options.strCycle + '</span> '
			//+ '<span class="ytplayer-control-random">' + options.strRandom + '</span>'
		+ '</div>'
		+ '<div class="ytplayer-videolist"></div>'
	);
}


YtPlayer.setVideoList = function(elementId, videoList) {
	var videoListElement = $('#' + elementId + ' .ytplayer-videolist').first();
	
	for(var i = 0; i < videoList.length; i++)
	{
		var item = $(
			'<div class="ytplayer-videoitem" id="ytplayer-item-' + videoList[i].id + '">'
				+ '<span class="ytplayer-name">' + videoList[i].name + '</span>'
			+ '</div>'
		)
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


YtPlayer.onPlayerStateChange = function(event) {
	// aktualizace udaju
	// kdyz end tak dalsi video
	// v tomto miste by mohlo byt implementovano nahodne prehravani - presun do next/prev
	if(event.data == YT.PlayerState.ENDED)
	{
		YtPlayer.nextVideo(YtPlayer.options.cycle);
	}
}


YtPlayer.onPlayerReady = function(event) {
	$('#ytplayer-item-' + event.target.getVideoData().video_id).addClass('ytplayer-playing');
	event.target.playVideo();
}


function onYouTubePlayerAPIReady() {
	YtPlayer.onApiReady();
}


