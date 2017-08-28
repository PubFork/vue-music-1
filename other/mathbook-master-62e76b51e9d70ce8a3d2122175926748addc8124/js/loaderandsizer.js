//vars to hold device type and width multiplier, and loadingText html element (to be addresed by rtlstorybook.js)
	dType = {};
	wMultiplier = {};
	prevWidth = {};
	prevHeight ={};
	loadingText = document.getElementById('loadingTxt');
	soundOutcome = {};
	iOS = {};

	//called via body onLoad-- so once css and html body is loaded
	function load()
	{
		//all elements on html page initially are hidden (display:none in css)
		//display all initial page elements in this function
		//keep hidden all on loading-related page elements on load first.
		
		document.getElementById('startBtn').style.display = 'none';
		document.getElementById('loadingFrame').style.display = 'inline';
		//document.getElementById('loadingFrameTopLeft').style.display = 'inline';
		document.getElementById('loadingFramePBSLogo').style.display = 'inline';
		//document.getElementById('loadingFrameTopRight').style.display = 'inline';
		document.getElementById('loadingFrameHome').style.display = 'inline';
		document.getElementById('coverImg').style.display = 'inline';		

		//STORING CANVAS DIMENSIONS AS ORIGINALLY DEFINED
		canWidth = $('#gameCanvas').width();
		canHeight = $('#gameCanvas').height();

		prevWidth = $(window).width();
		prevHeight = $(window).height();


		//DEVICE DETECTION:

		//if //**console.log doesn't exist (IE), use log instead, so //**console.log calls won't halt JS
		if(typeof console === "undefined") console = { log: function() { } };

		//if allowed browser- proper dType and sizing:
		if(navigator.userAgent.match(/iPad/i)){
			//redirect of iOS <= 5.0
			if (/OS [1-4](.*) like Mac OS X/i.test(navigator.userAgent)) window.location.href = "oops.html";
			dType = 'iPad';
			wMultiplier = 1.0;
		}
		else if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
			//redirect of iOS <= 5.0
			if (/OS [1-4](.*) like Mac OS X/i.test(navigator.userAgent)) window.location.href = "oops.html";
			dType = 'iPhone';
			wMultiplier = 1.0;
		}
		//android?
		else if( (navigator.userAgent.search("Android") != -1) ){ //&& (navigator.userAgent.search("Chrome") != -1)) {
			var androidversion = parseFloat(navigator.userAgent.slice(navigator.userAgent.indexOf("Android")+8)); 
			if (androidversion < 4.0) window.location.href = "oops.html";
			dType = 'android';
			wMultiplier = 1.0;
		}
		//else, a desktop browser, with version-based redirect to oops.html:
		else{

			if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
				var chversion=new Number(RegExp.$1) // capture x.x portion and store as a number
				if(chversion < 24) window.location.href = "oops.html";
				dType = 'desktop';
				wMultiplier = 1.0;
			}				
			else if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
				var safversion=new Number(RegExp.$1) // capture x.x portion and store as a number
				//minimum safari support: 5.0 in Snow Leopard
				if(safversion < 533.21) window.location.href = "oops.html";
				dType = 'desktop';
				wMultiplier = 1.0;				
			}				
			else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
				var ffversion=new Number(RegExp.$1) // capture x.x portion and store as a number				
				if(ffversion < 20) window.location.href = "oops.html";
				dType = 'desktop';
				wMultiplier = 1;				
			}				

			else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
				var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
				if(ieversion < 9.0) window.location.href = "oops.html";
				dType='ie';
				wMultiplier = 1;
			}
			else{
				//alert('unknown desktop browser');
				dType = 'desktop';
				wMultiplier = 1;
				//DESKTOP browser detect
			}
		}

		//**console.log('dType:'  + dType);
		//alert('dType:'  + dType);
 		do_resize();

		/*
		//mobile: Listen for orientation changes		
		window.addEventListener("orientationchange", function() {
			// Announce the new orientation number
			//alert(window.orientation);
			orientation = window.orientation;
		}, false);
		*/

 		//show the Start btn:
		document.getElementById('startBtn').style.display = 'inline';

		$('#startBtn').click(function() {
			beginLoader();
		});

	}

	function do_resize(){	
		//iPhone: 
		if( dType=='iPhone'){
			//PORTRAIT:
			if (window.orientation == 0){
				$('#gameCanvas').width($(window).width() );
				$('#coverImg').width($(window).width() );
				$('#loadingFrame').width($(window).width() );
				$('#gameCanvas').height($('#gameCanvas').width()*0.65625);
				$('#coverImg').height($('#coverImg').width()*0.65625);
				$('#loadingFrame').height($('#coverImg').width()*0.65625);
			}
			//LANDSCAPE
	 		if (Math.abs(window.orientation) == 90){
				$('#gameCanvas').height($(window).height() );
				$('#coverImg').height($(window).height() );
				$('#loadingFrame').height($(window).height() );
				$('#gameCanvas').width($('#gameCanvas').height()*1.52380952380952);
				$('#coverImg').width($('#coverImg').height()*1.52380952380952);
				$('#loadingFrame').width($('#coverImg').height()*1.52380952380952);
	 		}
		} 
		//INTERNET EXPLORER:
		if(dType=='ie'){
			$('#gameCanvas').width($(window).width() * wMultiplier);
			$('#coverImg').width($(window).width() * wMultiplier);
			$('#gameCanvas').height($('#gameCanvas').width()*0.65625); 
			$('#coverImg').height($('#coverImg').width()*0.65625); 
		}
		else if(dType=='android'){
			//PORTRAIT:
			if ( (window.orientation == 0) || (window.orientation == 180)) {
				$('#gameCanvas').width($(window).width() * wMultiplier);
				$('#coverImg').width($(window).width() * wMultiplier);
				$('#gameCanvas').height($('#gameCanvas').width()*0.65625); 
				$('#coverImg').height($('#coverImg').width()*0.65625); 
			}
			//LANDSCAPE
	 		if (Math.abs(window.orientation) == 90){
				$('#gameCanvas').height($(window).height() );
				$('#coverImg').height($(window).height() );
				$('#gameCanvas').width($('#gameCanvas').height()*1.52380952380952); 
				$('#coverImg').width($('#coverImg').height()*1.52380952380952); 
	 		}

		}
		//"everything" else
		else{
			$('#gameCanvas').height($(window).height() * wMultiplier);
			$('#coverImg').height($(window).height() * wMultiplier);	
			$('#canvasParent').height($(window).height() * wMultiplier);	
			$('#gameCanvas').width($('#gameCanvas').height()/0.65625); 
			$('#coverImg').width($('#coverImg').height()/0.65625); 
			$('#canvasParent').width($('#canvasParent').height()/0.65625); 
		}


		//to horizontally center everything in div canvas_parent
		$('#canvas_parent').css('margin-left', ($(window).width() - $('#gameCanvas').width())/2 );
		$('#canvas_parent').css('margin-right', ($(window).width() - $('#gameCanvas').width())/2 );
		//to vertically center everything in div canvas_parent
		$('#canvas_parent').css('margin-top', ( $(window).height() - $('#gameCanvas').height() )/2);		
		$('#canvas_parent').css('margin-bottom', ( $(window).height() - $('#gameCanvas').height() )/2);		

		//specific element size and positioning updates on window resize:
		$('#startBtn').width($('#gameCanvas').width() * 0.258);
		$('#startBtn').css('top', ( $('#gameCanvas').height() ) / 1.25);

		$('#loadingFrame').width($('#gameCanvas').width() );
		$('#loadingFrameTopLeft').width($('#gameCanvas').width()  * 0.07);
		$('#loadingFramePBSLogo').width($('#gameCanvas').width()  * 0.05);
		$('#loadingFrameTopRight').width($('#gameCanvas').width()  * 0.07);
		$('#loadingFrameHome').width($('#gameCanvas').width()  * 0.05);
		
		//for iPad and other devices with no widthMultiplier, readjust topright UI elements
		if(wMultiplier== 1.0){
			$('#loadingFrameTopRight').css('right', '1.2%');
			$('#loadingFrameHome').css('right', '2.5%');
		}

		//lastly:
		prevWidth = $(window).width();
		prevHeight = $(window).height();		
	}

	//getting window size values on resize
	$(window).resize(function() {
		do_resize();
	});	


	//called automatically, or startBtn tap:
	function beginLoader(){		
		document.getElementById('startBtn').style.display = 'none';	 	
		
		//loads actual canvas game
		doTheLoad();
		//setTimeout(doTheLoad, 1000);


	}
