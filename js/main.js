$( document ).ready(function() {


/*********************************************
			STORE ACCORDIAN MENU
*********************************************/

$(".storeCategory").hide();
$(".storeCash").show();

$(".stats>.nav>li").click(function(){

$(".selected").removeClass("selected");
$(this).addClass("selected");

switch($("li").index(this)){

	case 0:
	$(".storeCategory").hide();
	$(".storeCash").show();
		break;
	case 1:
	$(".storeCategory").hide();
	$(".storeScientists").show();
		break;
	case 2:
	$(".storeCategory").hide();
	$(".storeResources").show();
		break;
	case 3:
	$(".storeCategory").hide();
	$(".rocketstore").show();
		break;

}

});//click end

/*********************************************
		   STORE ACCORDIAN MENU END
*********************************************/









});//docreadyend