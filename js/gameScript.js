// (function() {

	/**
	* gridsize will set game board in 1:1 ratio (5 is default and minimum)
	* using a for loop in the HTML changes to gridsize will disrupt current Style
	* - New Layouts need to be added for larger gridsizes larger layouts could be generated based on gridsize variable
	* changes to the gridsize will disrupt current pre-built levels
	* @type {Number}
	*/
	var gridSize = 5;

	/**
	* boolean for power state
	* @type {Boolean}
	*/
	var powerIsOn = false;

	/**
	* boolean for start button state
	* @type {Boolean}
	*/
	var gameIsStarted = false;

	/**
	* did user confirm reset
	* @type {Boolean}
	*/
	var resetIsConfirm = false;

	/**
	* if reset was called from reset button
	* reset happens from power OFF and STOP as well
	* Reset via reset will reset current level
	* otherwise reset will clear the board with OFF and STOP
	* @type {Boolean}
	*/
	var resetButtonClicked = false;

	/**
	* time counter
	* @type {Number}
	*/
	var timer = 0;

	/**
	* tracks number of user clicks for score keeping and the display
	* @type {Number}
	*/
	var numClicks = 0;

	/**
	* how many levels are there?
	* @todo this could be generated from the length of the levels object
	* @type {Number}
	*/
	var numLevels = 26;

	/**
	* level indicator
	* @type {Number}
	*/
	var curLevel=0;

	/**
	* display toggle
	* @type {Number}
	*/
	var selectORdisplay=0;

	/**
	* [levelsBoxstatus description]
	* @type {Number}
	*/
	var levelsBoxstatus=0;

	/**
	* [gameData description]
	* @type {Array}
	*/
	var gameData = new Array();

	/**
	* register soundjs
	* @todo add sounds back to interaction
	*/
	// createjs.Sound.registerSound("audio/beep-high.mp3", "beepHigh", true);
	// createjs.Sound.registerSound("audio/beep-low.mp3", "beepLow", true);
	// createjs.Sound.registerSound("audio/beep-doubleHigh.mp3", "beepdoubleHigh", true);
	// createjs.Sound.registerSound("audio/beep-doubleHigh2.mp3", "beepdoubleHigh2", true);
	// createjs.Sound.registerSound("audio/beep-doubleLow.mp3", "beepdoubleLow", true);
	// createjs.Sound.registerSound("audio/beep-error.mp3", "beepError", true);
	// createjs.Sound.registerSound("audio/slide.mp3", "slide", true);
	// createjs.Sound.registerSound("audio/swoop.mp3", "swoop", true);
	//

	/**
	 * build the gameboard element using 'gridSize'
	 * @method
	 * @return {[type]} [description]
	 * @todo build real elements - not just a string
	 */
	var buildGameBoard = function(){
		var game = '';
		for (i = 0; i < gridSize; i++) {
			game += '<div class="row">\n';
			for (j = 0; j < gridSize; j++) {
				game += '\t<div class="oLight" id="cell' + i + j + '" onclick="tapLight(this)"></div>\n';
			}
			game += '</div>\n';
		}
		return game;
	};

	/**
	 * build the list of levels
	 * @method
	 * @return {[type]} [description]
	 */
	var buildLevelsList = function(){
		var list = '';
		for (i = 0; i < numLevels; i++) {
			list += ('<li id="nlevel'+(i+1)+'" class="levelbox" onclick="levelGenerator('+i+')" >Level<br><span>'+(i+1)+'</span></li>');
		}
		list += ('<li id="nlevel'+(numLevels+1)+'" class="levelbox" onclick="RDMlevelGenerator('+(numLevels+1)+')" >RDM<br><span>2-4</span></li>');
		list += ('<li id="nlevel'+(numLevels+2)+'" class="levelbox" onclick="RDMlevelGenerator('+(numLevels+2)+')" >RDM<br><span>4-6</span></li>');
		list += ('<li id="nlevel'+(numLevels+3)+'" class="levelbox" onclick="RDMlevelGenerator('+(numLevels+3)+')" >RDM<br><span>6-8</span></li>');
		list += ('<li id="nlevel'+(numLevels+4)+'" class="levelbox" onclick="RDMlevelGenerator('+(numLevels+4)+')" >RDM<br><span>5-9</span></li>');
		return list;
	};

	/**
	 * build help docs levels_list
	 * @method
	 * @return {[type]} [description]
	 */
	var buildHelpList = function(){
		var list = '';
		for (i = 0; i < numLevels; i++) {
			list += ('<li id="levelHelp'+(i+1)+'" class="helpBoxes" onclick="helptopic('+i+')" ><h3>Level '+(i+1)+'</h3><p>'+helpLevelInfo[i]+'</p></li>');
		}
		list += ('<li id="levelHelpRDM" class="helpBoxes" onclick="helptopic('+(numLevels+1)+')" ><h3>Level '+(numLevels+1)+'</h3>'+helpLevelInfo[numLevels+1]+'</li>');
		list += ('<li id="levelHelpRDM" class="helpBoxes" onclick="helptopic('+(numLevels+2)+')" ><h3>Level '+(numLevels+2)+'</h3>'+helpLevelInfo[numLevels+2]+'</li>');
		list += ('<li id="levelHelpRDM" class="helpBoxes" onclick="helptopic('+(numLevels+3)+')" ><h3>Level '+(numLevels+3)+'</h3>'+helpLevelInfo[numLevels+3]+'</li>');
		list += ('<li id="levelHelpRDM" class="helpBoxes" onclick="helptopic('+(numLevels+4)+')" ><h3>Level '+(numLevels+4)+'</h3>'+helpLevelInfo[numLevels+4]+'</li>');
		return list;
	};



	$(document).ready(function(){

		$('#gameBoard').prepend(buildGameBoard());
		$('#levels_list').prepend(buildLevelsList());
		$('#helpdocs_list').prepend(buildHelpList());

		fitui();

	});

	$(window).resize(function(){//run this on window resize
		fitui();//fit UI to screen size everytime the window is resized
	});//end window resize

	/**
	* fit elements to available screen relestate
	* @method fitui
	* @return {[type]} [description]
	* @todo cache common elements, explore native flow where applicable
	*/
	function fitui(){//fit UI to screen size
		winwidth = $(window).width();//get window width
		winheight = $(window).height();//get window height
		$('#wrapper').css('width', winwidth);//set outter wrapper to window size width
		$('#wrapper').css('height', winheight);//set outter wrapper to window size height
		var lightWidth = $('.row').width()-70;
		lightWidth = lightWidth/5;
		$('.oLight').css('width', lightWidth );
		$('.oLight').css('height', lightWidth*.8);
		$('.iLight').css('width', lightWidth );
		$('.iLight').css('height', lightWidth*.8);
		$('#gameInput').css('height', (winheight - $('#gameBoard').height()));
		$('#rightcol').css('height', (winheight - $('#gameBoard').height()));
		$('#leftcol').css('height', (winheight - $('#gameBoard').height()));//x2 to hold the scrolling preGame and Display
		$('#controls').css('height', (winheight - 15 - $('#gameBoard').height()));
		$('#preGame').css('height', (winheight - $('#gameBoard').height()));
		$('#display').css('height', (winheight - $('#gameBoard').height()));
		$('#display').css('top', (winheight - $('#gameBoard').height()));
		$('#lvlgenBox').css('height', $('#gameBoard').height());
		$('#lvlgenBox').css('width', ($('#gameBoard').width()));
		$('#lvlgenBox').css('left',($(window).width()/2) - ($('#lvlgenBox').outerWidth()/2));
		$('#lvlgenBox p').css('font-size', ($('#gameBoard').height())*.35);
		$('#lvlgenBox p#lvlnumber').css('font-size', ($('#gameBoard').height())*.60);
		centerhelpbox();
		centerlevelsbox();
	}

	/**
	* toggle game power
	* @method powerToggle
	* @return {[type]}    [description]
	*/
	function powerToggle(){
		console.log("power toggle");
		if(!powerIsOn){//if POWER is OFF, switch to ON by running these...
			// createjs.Sound.play('beepdoubleHigh');//sound ON
			$('#power .Ybutton').css('background-color',"#554996");//set POWER button to PURPLR(ON)
			powerIsOn = true; // set the var to ON, allows other things to run...
			console.log("power set ON");
		}else if(powerIsOn){ //if POWER is already ON, switch OFF by running these...
			// createjs.Sound.play('beepdoubleLow');//sound OFF
			$('#power .Ybutton').css('background-color',"#FFEA00");//set POWER button to YELLO(OFF)
			if($('.iLight').length >= 1){ //if there are any lights ON, do this...
				getResetConfirm(); // run getResetConfirm
				if(resetIsConfirm){ // if reset confirm is true
					//TODO play restart sound
					if(gameIsStarted){ //if START then STOP
						$('#start p').html('Start');//set STOP to START
						$('#start .Ybutton').css('background-color',"#FFEA00");//change Start button to YELLOW
						$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
						gameIsStarted = false;
					}
					if(1==selectORdisplay){//if display is up
						movetoSelect();//move the select button into place
					}
					resetIsConfirm = false; //set resetIsConfirm back to 0, for next time this runs
					powerIsOn = false; // set POWER OFF
					curLevel=0; //reset curLevel
				}
			} else { //if there are NO lights ON
				powerIsOn = false; // set POWER OFF
				gameIsStarted = false;
				curLevel=0;//reset curLevel
				if(1==selectORdisplay){//if display is up
					movetoSelect();//move the select button into place
				}
			}
			console.log("power set OFF");
		}
	}

	tapped=0;

	/**
	* toggle start button
	* @method startStop
	* @return {[type]}  [description]
	*/
	function startStop(){
		if(!powerIsOn){ powerToggle(); } // autoOn if the power is OFF then toggle power ON
		if(powerIsOn){ // when the Power is ON...
			resetIsConfirm = false;
			// createjs.Sound.play('beepdoubleHigh');//play sound
			if (!gameIsStarted){ //if stop, set START
				gameIsStarted = true;
				$('#start p').html('Stop');//change START to STOP
				$('#start .Ybutton').css('background-color',"#554996");//change button to PURPLE
				setTimeout(timerCounter, 1000);//start timer counter after 1 sec

				if(tapped==0){//keeps Start from re-re-generating level
					levelGenerator(curLevel);//generate current level
				}
				if(0==selectORdisplay){//if the select button is up (==0)
					movetoDisplay();//slide the display into place(==1)
				}
			}else{//if start, set STOP...
				getResetConfirm();//ask user if they are sure
				if(resetIsConfirm){ // if reset confirm is true
					gameIsStarted = false;
					$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
					resetTimer();//reset timer counter and display
					$('#start p').html('Start');//set STOP to START
					$('#start .Ybutton').css('background-color',"#FFEA00");//change Start button to YELLOW
					movetoSelect();//slide the select button into place
				}
			}
		}
	}

	//TOGGLE LIGHT
	//click a light and the adjacent lights are also toggled{powerToggle/startStop}
	function tapLight(obj){
		// createjs.Sound.play('beepHigh');
		if(!powerIsOn){powerToggle();}//if the Power is OFF then turn it ON
		if(!gameIsStarted){//if the game is STOP
			if(curLevel>0){//AND if lights are OFF
				tapped=1;
				startStop();//run Start of startStop
			}
		}
		tapped=0;
		numClicks++;//increase user click count
		$('#clicks .displayOutput').html(numClicks);//display the increased number of clicks
		//get the row and col of the clicked cell *OBJ is the clicked cell*
		var row=Number(obj.id.substr(4,1));//get row = make it a number(get OBJ ID, skip the first 4 characters, use the next 1 characters)*id=cell(X)x*
		var col=Number(obj.id.substr(5,1));//get col = make it a number(get OBJ ID, skip the first 5 characters, use the next 1 characters)*id=cellx(X)*
		//toggle the light of the clicked cell (OBJ)
		$('#cell' + row + col).attr('class',($('#cell' + row + col).attr('class') == 'oLight') ? 'iLight' : 'oLight');
		//toggle adjacent cells
		$('#cell' + (row-1) + col).attr('class',($('#cell' + (row-1) + col).attr('class') == 'oLight') ? 'iLight' : 'oLight');//toggle the light of the cell above the clicked cell (OBJ.id row-1 col)
		$('#cell' + (row+1) + col).attr('class',($('#cell' + (row+1) + col).attr('class') == 'oLight') ? 'iLight' : 'oLight');//toggle the light of the cell below the clicked cell (OBJ.id row+1 col)
		$('#cell' + row + (col+1)).attr('class',($('#cell' + row + (col+1)).attr('class') == 'oLight') ? 'iLight' : 'oLight');//toggle the light of the cell to the right of the clicked cell (OBJ.id row col+1)
		$('#cell' + row + (col-1)).attr('class',($('#cell' + row + (col-1)).attr('class') == 'oLight') ? 'iLight' : 'oLight');//toggle the light of the cell to the left of the clicked cell (OBJ.id row col-1)
		//checkWin - if the game is START and all lights are OFF - Player Wins Level
		if(gameIsStarted){//if the game is START
			if($('.iLight').length >= 1){//AND if 1 or more lights are on - no win yet
				//no win, lights still on
			}else{ //AND if 0 lights are ON then Player Wins level
				winLevel();//run WIN LEVEL function
			}
		}
	}//end tapLight

	//WIN SEQUENCE - Runs inside tapLight
	function winLevel(){//if win then play next (pre-made,ease,med,hard,xxx)
		// createjs.Sound.play('beepdoubleHigh');//winning sound
		//run loop animation of lights
		$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off
		setTimeout(function(){
			$('.oLight').removeClass('oLight').addClass('iLight');//turn all lights ON
		},90);
		setTimeout(function(){
			//Decide which level was won then run appropriate function
			if((curLevel + 1)<numLevels){//if level is premade level
				levelGenerator(curLevel + 1);//generate next premade level
			}else if((curLevel + 1) == numLevels){//if level is last premade level
				RDMlevelGenerator(numLevels+1);
			}else if((curLevel) == numLevels+1){//if level is EASY RDM
				RDMlevelGenerator(numLevels+2);
			}else if((curLevel) == numLevels+2){//if level is MED RDM
				RDMlevelGenerator(numLevels+3);
			}else if((curLevel) == numLevels+3){//if level is HARD RDM
				RDMlevelGenerator(numLevels+4);
			}else{
				RDMlevelGenerator(numLevels+4);
			}
		},180);
		setTimeout(function(){
		},1000);
	}

	/**
	* reset function
	* if the game is already reset, make the reset button call new function
	* the new function will bring the select button back on screen
	* @method resetButton
	*/
	function resetButton(){
		if(powerIsOn){
			if(gameIsStarted){
				// createjs.Sound.play('beepdoubleHigh');
				resetButtonClicked = true; //tell clearBoard to Reset Level NOT clearAll
				getResetConfirm();
				if(resetIsConfirm){
					clearBoard();
					$('#start p').html('Start');//change STOP to START
					$('#start .Ybutton').css('background-color',"#FFEA00");	//change the color of the purple button to YELLOW
					gameIsStarted = false;
				}
			} else {//if the game is STOP do this...
				$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
				// createjs.Sound.play('beepdoubleLow');
				if(0==selectORdisplay){
					// createjs.Sound.play('beepdoubleLow');//play error sound
				}else if(1==selectORdisplay){
					movetoSelect();//slide the select button onscreen

					//clearboard???double reset leaves level behind
					//resetIsConfirm = false; //set didreset to false
					//resetButtonClicked = false;
				}

			}

		}
		else {
			alert("Nothing to reset\n\nPower is not ON");
		}

	}

	//RESET GAME - make sure the user wants to clear thier current progress
	function getResetConfirm(){
		//if(gameIsStarted){
		var sure=confirm('Are you sure? This will clear your Progress!');
		if(true==sure){
			resetIsConfirm = true;
		}else{
			resetIsConfirm = false;
		}
		//} else if(!gameIsStarted){

		//}
	}

	//RESET CLICKS
	function resetClicks(){
		numClicks=0;//reset clicks counter back to 0
		$('#clicks .displayOutput').html(numClicks);//display the reset counter
	}

	//RESET TIMER
	function resetTimer(){
		timer=0;//reset clicks counter back to 0
		$('#timer .displayOutput').html(timer+':00');//display the new timer position
	}

	//CLEAR or REGEN GAMEOARD
	function clearBoard(){
		gameIsStarted = false;
		resetClicks();//set clicks to 0 and disply
		resetTimer();//set timer to 0 and display
		if(resetButtonClicked){
			levelGenerator(curLevel);//reset the current level
		} else {
			$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
		}
		resetButtonClicked = false;
	}

	//SELECT Screen
	function movetoSelect(){
		// createjs.Sound.play('slide');
		$('#display').css('display','none');
		$('#display').animate({
			top: (winheight - $('#gameBoard').height())
		},500,function(){
			//when animation complete
		});
		$('#preGame').animate({
			top: 0
		},500,function(){
			//when animation complete
		});
		resetButtonClicked = false;
		selectORdisplay=0;
	}

	/**
	* show display screen
	* @method movetoDisplay
	* @return {[type]}      [description]
	*/
	function movetoDisplay(){
		// createjs.Sound.play('slide');
		$('#display').css('display','block');
		$('#display').animate({
			top: 0
		},500,function(){
			//when animation complete
		});

		$('#preGame').animate({
			top: -(winheight - $('#gameBoard').height())
		},500,function(){
			//when animation complete
		});
		selectORdisplay=1;
	}

	/**
	* timer
	* @method timerCounter
	* @return {[type]}     [description]
	*/
	function timerCounter(){
		if(gameIsStarted){
			timer++;
			var seconds = timer %60;
			if(seconds<10){seconds = '0'+seconds;}
			var totalMinutes = Math.floor(timer/60);
			var minutes = totalMinutes%60;
			var hours = Math.floor(totalMinutes/60);
			if(hours<1){//if hours is 0
				var cvtimer =minutes+':'+seconds;
			}else if(hours>=1){//if hours is 1 or more
				var cvtimer =hours+':'+minutes+':'+seconds;
			}
			$('#timer .displayOutput').html(cvtimer);
			setTimeout(timerCounter, 1000);
		}
	}

	/**
	* [openlevelsBox description]
	* @method openlevelsBox
	* @return {[type]}      [description]
	*/
	function openlevelsBox(){//push the big Purple Button
		if(!powerIsOn){powerToggle();}
		levelsBoxstatus=1;
		// createjs.Sound.play('slide');

		$('#levelsBox').fadeIn(500);
		$('#levelsBoxbg').fadeIn(500);
		centerlevelsbox();
	}

	/**
	* [hidelevelsBox description]
	* @method hidelevelsBox
	* @return {[type]}      [description]
	*/
	function hidelevelsBox(){
		// createjs.Sound.play('slide');
		levelsBoxstatus=0;
		$('#levelsBox').fadeOut(500);
		$('#levelsBoxbg').fadeOut(500);
	}

	/**
	* [centerlevelsbox description]
	* @method centerlevelsbox
	* @return {[type]}        [description]
	*/
	function centerlevelsbox(){
		$('#levelsBox').css('left',($(window).width()/2) - ($('#levelsBox').outerWidth()/2));
		$('#levelsBox').css('width', winwidth / 1.5);
		$('#levelsBox').css('height', $('#gameBoard').height() - 40);
	}

	//HELP BOX

	//Help Level Info
	var helpLevelInfo=[];
	helpLevelInfo[0]=
	"<p class="+'taps'+">This level can be solved  in 1 tap.</p>"+
	"<p>Tap the center of the plus sign, that's it!</p>"+
	"<p>Can you see how the adjacent lights are switched OFF too?</p>";
	helpLevelInfo[1]=
	"<p class="+'taps'+">This level can be solved in 2 taps.</p>"+
	"<p>Tap the center of the half plus signs, that's it!</p>"+
	"<p>Notice this level is almost like level 1 but that same plus sign is now on the top and bottom.</p>"+
	"<p>Can you see how the adjacent lights aren't always on the game board?</p>";
	helpLevelInfo[2]="<p>Solve this level in 4 taps. This level is just like the previous level with 2 more plus signs</p><p>Can you see pattern starting to take shape?</p>";
	helpLevelInfo[3]="<p>Solve this level in 4 taps. Now all the plus signs are in the corners. Just continue tapping the center of the plus signs.</p><p>Can you see the basic patterns yet?</p>";
	helpLevelInfo[4]="<p>Solve this level in 4 taps. This level is introduces a new concept, now the lights are affecting eachother in different ways.</p>";
	helpLevelInfo[5]='<p>help level info 6</p>';
	helpLevelInfo[6]='<p>help level info 7</p>';
	helpLevelInfo[7]='<p>help level info 8</p>';
	helpLevelInfo[8]='<p>help level info 9</p>';
	helpLevelInfo[9]='<p>help level info 10</p>';
	helpLevelInfo[10]='<p>help level info 11</p>';
	helpLevelInfo[11]='<p>help level info 12</p>';
	helpLevelInfo[12]='<p>help level info 13</p>';
	helpLevelInfo[13]='<p>help level info 14</p>';
	helpLevelInfo[14]='<p>help level info 15</p>';
	helpLevelInfo[15]='<p>help level info 16</p>';
	helpLevelInfo[16]='<p>help level info 17</p>';
	helpLevelInfo[17]='<p>help level info 18</p>';
	helpLevelInfo[18]='<p>help level info 19</p>';
	helpLevelInfo[19]='<p>help level info 20</p>';
	helpLevelInfo[20]='<p>help level info 21</p>';
	helpLevelInfo[21]='<p>help level info 22</p>';
	helpLevelInfo[22]='<p>help level info 23</p>';

	helpLevelInfo[numLevels+1]="<p>24 Random Taps=2-4</p>";//=24 - easy RDM
	helpLevelInfo[numLevels+2]="<p>help level info 25</p>";//=25 - medium RDM
	helpLevelInfo[numLevels+3]="<p>help level info 26</p>";//=26 - hard RDM
	helpLevelInfo[numLevels+4]="<p>help level info 27</p>";//=27 - X RDM

	function openhelpBox(){
		if (!powerIsOn){powerToggle();}
		// createjs.Sound.play('slide');
		$('#helpBox').fadeIn(500);
		$('#helpBoxbg').fadeIn(500);
		if(!gameIsStarted){
			//no scroll
		}else{
			$('#helpBox').scrollTo( '#levelHelp'+(curLevel+1), 1000 );
		}
		//$('#content').html('test');
		centerhelpbox();
	}

	function hidehelpBox(){
		// createjs.Sound.play('slide');
		$('#helpBox').fadeOut(500);
		$('#helpBoxbg').fadeOut(500);
	}

	function centerhelpbox(){
		$('#helpBox').css('left',($(window).width()/2) - ($('#helpBox').outerWidth()/2));
		//$('#helpBox').css('top',($(window).height()/2) - ($('#helpBox').height()/2));
		$('#helpBox').css('width', winwidth / 1.5);
		$('#helpBox').css('height', $('#gameBoard').height() - 40);
	}

	//GAME LEVELS
	//Level storage information
	//pre made levels
	var levels=[];
	levels[0]='0000000100011100010000000';//1
	levels[1]='0100011100010100011100010';//2
	levels[2]='0111000100000000010001110';//3
	levels[3]='0111010101110111010101110';//4
	levels[4]='1101110001000001000111011';//5
	levels[5]='0000001010110110101000000';//6
	levels[6]='0101011011000001101101010';//7
	levels[7]='0110100101000000010101101';//8
	levels[8]='1010110101000001010110101';//9
	levels[9]='0100011000001000001100010';//10
	levels[10]='0000100010001000100010000';//11
	levels[11]='1000101010000000101010001';//12
	levels[12]='0000000110010010011000000';//13
	levels[13]='0000001110101010111000000';//14
	levels[14]='0000010101101011010100000';//15
	levels[15]='0000011111011101111100000';//16
	levels[16]='0111010001101011000101110';//17
	levels[17]='0010000000101010000000100';//18
	levels[18]='0101011011110111101101010';//19
	levels[19]='1010100100110110010010101';//20
	levels[20]='1010000000100010000000101';//21
	levels[21]='1110010011000001100100111';//22
	levels[22]='1010000100111000001000001';//23
	levels[23]='0000101110100100101010100';//24
	levels[24]='1011110101010101010111101';//25
	levels[25]='0110101000100011001111100';//26 total pre-made level = var numLevels
	//RDM random level RAM storage
	levels[numLevels+1]=[];//=27 - easy RDM
	levels[numLevels+2]=[];//=28 - medium RDM
	levels[numLevels+3]=[];//=29 - hard RDM
	levels[numLevels+4]=[];//=30 - X RDM

	/**
	* level generator
	* @method levelGenerator
	* @param  {[type]}       lvl [description]
	* @return {[type]}           [description]
	*/
	function levelGenerator(lvl){
		$('#lvlgenBox p#lvlnumber').html(lvl+1);//populate display with number of next level
		if(!resetButtonClicked){
			animatelvlgenBox();
		}
		if(lvl>=(numLevels+1)){//RDM Levels Re-Generator
			gameIsStarted = true;
			$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
			for(var i=0; i<levels[lvl].length; i++){
				var newObject= document.getElementById(levels[lvl][i]);
				tapLight(newObject);
			}
		}else{//PRE MADE LEVELS
			curLevel=lvl;
			$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights off(set all lights to oLight)
			level = levels[lvl].split('');//split the level data into a string
			$('.oLight').each(function(index){//grab each oLight
				if(level[index]==1){//if the level indicates a 1 for this light turn light ON(iLight)
					$(this).removeClass('oLight');
					$(this).addClass('iLight');
				}
			});
			$('#level .displayOutput').html(lvl+1);//fill the level indicator with the appropriate level
			if(0==levelsBoxstatus){

			}
		}
		hidelevelsBox();
		resetClicks();
		resetTimer();
	}

	/**
	* [RDMlevelGenerator description]
	* @method RDMlevelGenerator
	* @param  {[type]}          lvl [description]
	*/
	function RDMlevelGenerator(lvl){
		if(resetButtonClicked){
			animatelvlgenBox(); // flash current level
		}
		curLevel=lvl;
		levels[lvl]=[];//place to store random level array
		$('.iLight').removeClass('iLight').addClass('oLight');//turn all lights OFF
		//HOW MANY RANDOM CLICKS if easy/med/hard/xxx
		if((numLevels+1)==lvl){//if EASY level
			var rdmClicks = (Math.floor(Math.random()*2)+2);//###random number of clicks between 2-4
			$('#lvlgenBox p').html('RDM');//populate display with number of next level
			$('#lvlgenBox p#lvlnumber').html('2-4');//populate display with number of next level
		}else if((numLevels+2)==lvl){//if MED level
			var rdmClicks = (Math.floor(Math.random()*2)+4);//###random number of clicks between 4-6
		}else if((numLevels+3)==lvl){//if HARD level
			var rdmClicks = (Math.floor(Math.random()*2)+6);//###random number of clicks between 6-8
		}else if((numLevels+4)==lvl){//if XXX level
			var rdmClicks = (Math.floor(Math.random()*4)+5);//###random number of clicks between 5-9
		}else{//this should never run
			alert('failed to get rdm level, something is wrong, better reset!');
		}
		//GENERATE RANDOM CLICKS in Sequence of 100 milli seconds
		var timeDelay = 100;//speed of random generation for looping tapLight
		for (i = 0; i < rdmClicks; i++) {//toggle a random cell for ever number of random clicks
			setTimeout(function(){//this function slows down the random generation so the user can almost see its creation
				var rdmCell = 'cell' + (Math.floor(Math.random()*5)) + (Math.floor(Math.random()*5)) ;//choose a random light to toggle cell00-cell44
				levels[lvl].push(rdmCell);//push the randon light info(cellXX) to level storage variable for regeneration
				var newObject= document.getElementById(rdmCell);//create new object =to rdmCell to send to tapLight function

				gameIsStarted = true; // set gameIsStarted to 1 to enable tapLight to run [or first tapLight will be skipped]

				tapLight(newObject);//run tapLight
				// gameIsStarted = false;
				resetClicks();
			},timeDelay);//slow down the rdm generation so each clicks happens XXX milliseconds apart
			timeDelay+=100;//speed increments - same as timeDelay original var
		}
		if(1==levelsBoxstatus){
			hidelevelsBox();
		}
		resetTimer();
		$('#level .displayOutput').html(lvl);//fill the level indicator with the appropriate level
		if(!gameIsStarted){ startStop(); }
	}

	/**
	* Animate Next Level Number
	* @method animatelvlgenBox
	* @return {[type]}         [description]
	*/
	function animatelvlgenBox(){
		$('#lvlgenBox').css('display','block');//turn the display on(still opacity=0)
		$('#lvlgenBox').animate({//animate
			opacity:0.5//animate opacity to half in 1/4 second
			//TODO//text size 0 to 85% of gameBoard size
		},200, function(){
			$('#lvlgenBox').fadeOut();//fade out the number
		});
	}

// })();
