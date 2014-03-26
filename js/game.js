$( document ).ready(function() {

/*******************************
	VARIOUS GLOBAL VARIABLES
*******************************/
var FPS = 40; //dictates the frames per second and refresh rate of the variables

var cash = 0; //global variable for total cash
var scientists = 0; //total amount of scientists
var resources = 0; //total amount of resources

var satellites = 200;//satellites left in low earth orbit

/******************************************
	FARM OBJECTS/Constructor - GLOBAL
******************************************/

//MAIN STORE ITEM CONSTRUCTOR
function storeItemConstructor(varname,name,description,owned,farms,persec,cost,mincost,pricemultiplier) {
  this.varname = varname;
  this.name = name;
  this.description = description;
  this.owned = owned;
  this.farms = farms;
  this.persec = persec;
  this.cost = cost;
  this.mincost = mincost;
  this.pricemultiplier = pricemultiplier;
}

//cash farms
var prisoner = new storeItemConstructor("prisoner","Political prisoner","A prisoner from the country's top deathcamp, will work like his life depends on it.",0,"cash",0.5,100,100,1.15);
var laborer = new storeItemConstructor("laborer","Basic laborer","A previously convicted Korean citizen, doesn't cost much but will work hard for his family back in Pyongyang.",0,"cash",1,250,250,1.15);
var worker = new storeItemConstructor("worker","Paid worker","Costs a bit more but he seems to work harder and at least you don't have to worry about holding his family.",0,"cash",4,650,650,1.15);
var farmer = new storeItemConstructor("farmer","Farmer","Lured in by the promise of slave labor he finds that the North Korean agriculture is not what he expected.",0,"cash",16,1700,1700,1.15);
var bitcoin = new storeItemConstructor("bitcoin","Bitcoin mining rig","According to your programmers, this is the currency of the future... or so they say.",0,"cash",0.001,1,1,1.0015);
var airport = new storeItemConstructor("airport","Airport","The North Korean tourism business is BOOMING, although its mostly those guys from VICE magazine.",0,"cash",32,5600,5600,1.15);
var methlab = new storeItemConstructor("methlab","Methlab","Kim Jong White's blue meth is number #1 blue meth according to 4 out of 5 VICE magazine editors.",0,"cash",56,9800,9800,1.15);
var concentrationcamp = new storeItemConstructor("concentrationcamp","Concentration camp","A place political prisoners and traitors to the cause are sent to have their opinions 'reformed'.",0,"cash",512,270000,270000,1.15);

//science farms
var kindergarden = new storeItemConstructor("kindergarden","Kindergarden","Feeds children propaganda from birth and raises them to honor the supreme leader and his rocket program.",0,"scientists",0.2,800,800,1.15);
var college = new storeItemConstructor("college","College","North Korea college was voted #1 college in all of countries!",0,"scientists",2,12000,12000,1.15);
var university = new storeItemConstructor("university","University","A place where people can further their education in either rocket science or physics.",0,"scientists",4,24000,24000,1.15);

//resource farmers
var windfarm = new storeItemConstructor("windfarm","Windfarm","Now you're stealing the wind from false Korea, good job, glorious Leader will not be dissapointed in your actions.",0,"resources",10,10000,10000,1.15);
var mine = new storeItemConstructor("mine","Mine","Provides resources using err... 'volunteer workers'.",0,"resources",40,50000,50000,1.15);
var oilrig = new storeItemConstructor("oilrig","Offshore oil rig","Hard to build since it's off shore but at least you need not threaten any families.",0,"resources",120,100000,100000,1.15);

//array of all the cash farmers/science farms/resource farmers (left to right in ascending order of expense)
var farmers = [[prisoner,laborer,worker,farmer,bitcoin,airport,methlab,concentrationcamp],[kindergarden,college,university],[windfarm,mine,oilrig]];

/******************************************
	ROCKET OBJECTS/CONSTRUCTOR - GLOBAL
******************************************/

//ROCKET CONSTRUCTOR
function rocketConstruct(varname,name,description,type,range,cash,scientists,resources){
  this.varname = varname;
  this.name = name;
  this.description = description;
  this.type = type;
  //rocket capabilities
  this.range = range;
  //cost breakdown
  this.cash = cash;
  this.scientists = scientists;
  this.resources = resources;
}

var basicrocket = new rocketConstruct("basicrocket","Basic Missle","A basic missle quickly assembled by a lazy and tired indie game developer,highly unstable and volatile at launch","orbital","Suborbital",7500000,2000,32000);
var standardrocket = new rocketConstruct("standardrocket","Two Stage Rocket","A rocket capable of reaching low earth orbit and knocking down an american satellite","orbital","Low orbit",50000000,10000,4800000);
var SaturnV = new rocketConstruct("SaturnV","Saturn V","An exact replica of the American Saturn V three stage rocket outfitted with a nuclear warhead","orbital","High orbit",500000000,400000,160000000);

var rockets = [basicrocket,standardrocket,SaturnV];



/***************************
	CLICK OBJECT - GLOBAL
***************************/

//saves mouse clicker stats
var clicker  = {
	perclick: 1,
	autorate:0
};

var clickerUpgrade = {
	cost:10,
	increase:2
};




/********************************************************
				   >INITIAL FUNCTIONS<
>This includes things like cookies and shit like that<
>Along with updating everything after cookies initialize<
********************************************************/
initializeValues();//get user scores
updateStore(farmers);//move this behind GET COOKIES
updateRocketStore(rockets)


//commented out cookies



setInterval(function(){
updateValues();//update all values
},1000)

//ERASE ALL DATA
$("#flushdatabtn").click(function(){
$.jStorage.flush()
location.reload();
});

//get initial user scores if any
function initializeValues(){

	if (getValue("cash")!=null) {
	cash = getValue("cash");
	};
	if (getValue("scientists")!=null) {
	scientists = getValue("scientists");
	};
	if (getValue("resources")!=null) {
	resources = getValue("resources");
	};
	if (getValue("satellites")!=null) {
	satellites = getValue("satellites");
	};

	for (var i = farmers.length - 1; i >= 0; i--) {
		for (var z = farmers[i].length - 1; z >= 0; z--) {

			if (getValue(farmers[i][z].varname + "owned")!=null) {
			farmers[i][z].owned = getValue(farmers[i][z].varname + "owned");
			};//if end
			if (getValue(farmers[i][z].varname + "cost")!=null) {
			farmers[i][z].cost = getValue(farmers[i][z].varname + "cost");
			};//if end

		};//for z emd
	};//for i end

	for (var i = rockets.length - 1; i >= 0; i--) {

		if (getValue("rocket_" + rockets[i].varname + "cash")!=null) {
			rockets[i].cash = getValue("rocket_" + rockets[i].varname + "cash");
		};//if end
		if (getValue("rocket_" + rockets[i].varname + "scientists")!=null) {
			rockets[i].scientists = getValue("rocket_" + rockets[i].varname + "scientists");
		};//if end
		if (getValue("rocket_" + rockets[i].varname + "resources")!=null) {
			rockets[i].resources = getValue("rocket_" + rockets[i].varname + "resources");
		};//if end

	};//for z emd



	updateStore(farmers);
	updateCountersPerSecond();

}//initializeValues END

function updateValues(){

setValue(cash,"cash");
setValue(scientists,"scientists");
setValue(resources,"resources");
setValue(satellites,"satellites");

for (var i = farmers.length - 1; i >= 0; i--) {
	for (var z = farmers[i].length - 1; z >= 0; z--) {

		setValue(farmers[i][z].owned, farmers[i][z].varname + "owned");

		setValue(farmers[i][z].cost, farmers[i][z].varname + "cost");

	};//for z emd
};//for i end

for (var i = rockets.length - 1; i >= 0; i--) {

	setValue(rockets[i].cash, "rocket_" + rockets[i].varname + "cash");
	setValue(rockets[i].scientists, "rocket_" + rockets[i].varname + "scientists");
	setValue(rockets[i].resources, "rocket_" + rockets[i].varname + "resources");

};//for i emd


}//updateValues END

//set a store items value by simply using the function with the item object as an argument
//to store other simple variables just use them as the argument and add a name as an argument for a key
function setValue(object,name)//name is null if its an object
{

  	$.jStorage.set(name,object);
 
}//end setValue


//get value by key
function getValue(name)//name is null if its an object
{

  if ($.jStorage.get(name) != null) {
  	return $.jStorage.get(name);
  };

}//end getValue



























// Check if cash exists in the storage



/*********************
	GAME FUNCTIONS
*********************/

//all stuff that's supposed to refresh every single frame
//only lightweight stuff allowed in here!!!
setInterval(function(){

updateCounters();

},(1000/FPS))

//update the values for the counters as well as the on screen values for all the counters
function updateCounters(){//update the JS variables
	//farms the farmers object array
	farm(farmers);
	//update the display for the counters NOT THE ACTUAL VARIABLES
	$("#cash").text(Math.floor(cash));
	$("#scientists").text(Math.floor(scientists));
	$("#resources").text(Math.floor(resources));
	$("#satellites").text(Math.floor(satellites));



}//END updateCounters

//updates the Counters Per second values
function updateCountersPerSecond(){

    for (var i = farmers.length - 1; i >= 0; i--) {
	
		var selector = null; //ID selector for the Per second counter

		switch (i)
		{
		case 0:
		  selector = "#cashsecond";
		  break;
		case 1:
		  selector = "#scientistssecond";
		  break;
		case 2:
		  selector = "#resourcessecond";
		  break;
		} 

		var itemPersec = 0; //variable for the for loop to add up the items per sec

		for (var z = farmers[i].length - 1; z >= 0; z--) {
			itemPersec += (farmers[i][z].owned * farmers[i][z].persec);
		};

	    $(selector).text(Math.round(itemPersec * 10)/10);

    };

}


//farmers farm,that's about it.
//the function 'farm' updates the interger values for cash/science/resources farm
function farm (farmerarray){
	//for loop to go through the farmers array which holds the object arrays for the farmers
	for (var i = farmerarray.length - 1; i >= 0; i--) {
		var temp = farmerarray[i]; //temp variable for the 2nd for loop
		for (var z = temp.length - 1; z >= 0; z--) {
			//farmer temp variable for the array objects
			var farmer = temp[z];

			if (farmer.farms == "cash") {// PUT THE UPGRADE FUNCTION HERE THAT ADDS BONUSES!!!
				cash = cash + (farmer.persec/FPS) * farmer.owned;
			};//if farmer farms cash
			if (farmer.farms == "scientists") {
				scientists = scientists + (farmer.persec/FPS) * farmer.owned;
			};//if farmer farms scientists
			if (farmer.farms == "resources") {
				resources = resources + (farmer.persec/FPS) * farmer.owned;
			};//if farmer farms resources
		};//end of Z forloop
	};//end of I forloop

}//END farm





/********************************************************
				CLICKER FUNCTIONS !
   		 rocketstore functions stored elsewhere
********************************************************/

$(".manuallabor").click(function(){
	userClick(clicker.perclick);
	updateStore(farmers);//Make it so that items the user can't afford remain hidden INC descriptions and such
});//manuallaborclick

function userClick(click){
	cash += click;


	for (var i = farmers[0].length - 1; i >= 0; i--) {
		cash += (farmers[0][i].owned * farmers[0][i].persec * 0.15);
	};


}


/********************************************************
				MAIN STORE FUNCTIONS !
   		 rocketstore functions stored elsewhere
********************************************************/
//purpose:Generate the stores item menu
function updateStore(storeItem){//takes in the farmer multidimension array


	var subItem = null;
	for (var i = storeItem.length - 1; i >= 0; i--) {
		var subItem = storeItem[i]
		for (var z = subItem.length - 1; z >= 0; z--) {
			updateItemMarkup(subItem[z],z);
		};

	};
	
}

//purpose:make the items for the store menu using the farmers objects
function updateItemMarkup(item, row){

	var category = "null";
	switch (item.farms)
	{
	case "cash":
	  category = ".storeCash";
	  break;
	case "scientists":
	  category = ".storeScientists";
	  break;
	case "resources":
	  category = ".storeResources";
	  break;
	} 

    $( category + " .item:nth-child("+(row + 1)+") .itemName" ).text(item.name);
    $( category + " .item:nth-child("+(row + 1)+") .itemDescription" ).text(item.description);
    $( category + " .item:nth-child("+(row + 1)+") .itemCost" ).text(Math.round(item.cost *10)/10);
    $( category + " .item:nth-child("+(row + 1)+") .itemFarms" ).text(item.farms);
    $( category + " .item:nth-child("+(row + 1)+") .itemPersec" ).text(item.persec);
    $( category + " .item:nth-child("+(row + 1)+") .itemOwned" ).text(item.owned);
    $( category + " .item:nth-child("+(row + 1)+") .itemProduction" ).text( Math.round((item.owned * item.persec * 10))/10);

    //hidden input values YAY!
    $( category + " .item:nth-child("+(row + 1)+") #storecategory" ).val(item.farms);
    $( category + " .item:nth-child("+(row + 1)+") #storeitem" ).val(row);

}//END updateItemMarkup


function buyItem(category, item){
	
	switch (category)
	{
	case "cash":
	  category = 0;
	  break;
	case "scientists":
	  category = 1;
	  break;
	case "resources":
	  category = 2;
	  break;
	} 

	//sets the variable storeItem as the farm object in question
	storeItem = farmers[category][item];

	//if cash is more then the cost of the item the user can buy
	if (cash>=storeItem.cost) {
		storeItem.owned++;
		cash -=storeItem.cost;

	//set something like the more workers there are the less productive they get and a litte more expensive capping at 0.8 and 1.2
	//that'll get the player to buy other stuff
	storeItem.cost *= storeItem.pricemultiplier;//perhaps get someone to help me with a better formula		


	};

}//END buyItem

function sellItem(category, item){
	
	switch (category)
	{
	case "cash":
	  category = 0;
	  break;
	case "scientists":
	  category = 1;
	  break;
	case "resources":
	  category = 2;
	  break;
	} 

	//var storeItem is the item in question
	storeItem = farmers[category][item];
	if (storeItem.owned>0) {
		cash += (storeItem.cost*(1/storeItem.pricemultiplier)*(2/3));
		storeItem.cost *=(1/storeItem.pricemultiplier);//perhaps get someone to help me with a better formula
		storeItem.owned--;
	};//end if
}//END sellItem

function killItem(category, item){
	
	switch (category)
	{
	case "cash":
	  category = 0;
	  break;
	case "scientists":
	  category = 1;
	  break;
	case "resources":
	  category = 2;
	  break;
	} 

	//var storeItem is the item in question
	storeItem = farmers[category][item];

	if (storeItem.owned>0) {
		storeItem.cost = Math.max((storeItem.cost*(1/1.3)),storeItem.mincost)//perhaps get someone to help me with a better formula
		storeItem.owned--;
	};//end if

}//END killItem


//Item buttons
$(".buybtn").click(function(){
	var category = $(this).siblings("#storecategory").val();
	var item = $(this).siblings("#storeitem").val();
	buyItem(category,item);
	updateStore(farmers);
	updateCountersPerSecond();
});//buybtnclick
$(".sellbtn").click(function(){
	var category = $(this).siblings("#storecategory").val();
	var item = $(this).siblings("#storeitem").val();
	sellItem(category,item);
	updateStore(farmers);
	updateCountersPerSecond();
});//sellbtnclick
$(".killbtn").click(function(){
	var category = $(this).siblings("#storecategory").val();
	var item = $(this).siblings("#storeitem").val();
	killItem(category,item);
	updateStore(farmers);
	updateCountersPerSecond();
});//killbtnclick



/********************************************************
			    ROCKETSTORE FUNCTIONS !
   		 rocketstore functions stored elsewhere
********************************************************/

//purpose:Generate the Rocketstore items
function updateRocketStore(rocketItem){//takes in the Rcokets array

	for (var i = rocketItem.length - 1; i >= 0; i--) {
		updateRocketMarkup(rocketItem[i],i);
	};

}

//Updates the Rocketstore markup
function updateRocketMarkup(item, row){

    $( ".rocketstore" + " .item:nth-child("+(row + 1)+") .itemName" ).text(item.name);
    $( ".rocketstore" + " .item:nth-child("+(row + 1)+") .itemDescription" ).text(item.description);
    $( ".rocketstore" + " .item:nth-child("+(row + 1)+") .itemRange" ).text(item.range);


    itemCashString = item.cash;
    itemScientistsString = item.scientists;
    itemResourcesString = item.resources;

	if (itemCashString.toString().length > 3) {
	  itemCashString = Math.round(item.cash/1000)+"K";
	};	
	if (itemCashString.toString().length > 6) {
	  itemCashString = Math.round(item.cash/1000000)+"M";
	};


	if (itemScientistsString.toString().length > 3) {
	  itemScientistsString = Math.round(item.scientists/1000)+"K";
	};	
	if (itemScientistsString.toString().length > 6) {
	  itemScientistsString = Math.round(item.scientists/1000000)+"M";
	};


	if (itemResourcesString.toString().length > 3) {
	  itemResourcesString = Math.round(item.resources/1000)+"K";
	};	
	if (itemResourcesString.toString().length > 6) {
	  itemResourcesString = Math.round(item.resources/1000000)+"M";
	};


    $( ".rocketstore" + " .item:nth-child("+(row + 1)+") .costCash" ).text(itemCashString);
    $( ".rocketstore" + " .item:nth-child("+(row + 1)+") .costScientists" ).text(itemScientistsString);
    $( ".rocketstore" + " .item:nth-child("+(row + 1)+") .costResources" ).text(itemResourcesString);

    //hidden input values YAY!
    $( ".rocketstore" + " .item:nth-child("+(row + 1)+") #rocketid" ).val(row);

}//END updateItemMarkup

//Launch buttons (maybe add launchcode later)
//Set launch code at 00000000 to begin with then generate random string with funny message about the first launch code
$(".launchbtn").click(function(){
	var rocketid = $(this).siblings("#rocketid").val();
	launchRocket(rocketid);

});//buybtnclick


//launch a rocket by rocketid
function launchRocket(id){
//rockets[id]
	
	if (cash >= rockets[id].cash && scientists >= rockets[id].scientists && resources >= rockets[id].resources && satellites > 0) {

	cash -= rockets[id].cash;
	scientists -= rockets[id].scientists;
	resources -= rockets[id].resources;
	satellites -= 1;

	//raise rocket price
	rockets[id].cash = Math.round(rockets[id].cash * 1.15);
	rockets[id].scientists = Math.round(rockets[id].scientists * 1.15);
	rockets[id].resources = Math.round(rockets[id].resources * 1.15);
	
	alert("Murica MAD!!!!");
	};

	updateRocketStore(rockets);
	
}





});//docreadyend