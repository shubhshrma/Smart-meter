var smartMeter = angular.module('smartMeter', ['ngMaterial']);
	smartMeter
	.controller('MainCtrl', function MainCtrl($scope, $http){
	$scope.status=false;
		
	var consumption_units = [];
	var generation_units = [];
	var conChart, genChart;
	localStorage.consumption=0;
	localStorage.energy=0;
	$scope.genUnits=0;
	$scope.conUnits=0;
	function f_consumption(){
		var roc= Math.floor((Math.random()*10)+1);
		localStorage.consumption= (parseFloat(localStorage.consumption)+ roc*0.01);
		$scope.conUnits=parseFloat(localStorage.consumption);
		return 0.01*roc;
	}

	function f_generation(){
		var rog= Math.floor((Math.random()*10)+1);
		localStorage.energy= (parseFloat(localStorage.energy)+ rog*0.005);
		$scope.genUnits=parseFloat(localStorage.energy);
		return 0.005*rog;
	}
	
	let consumptionChart, generationChart;
	var label_array=[];
	for(var i=0;i<=100;i++){
		label_array[i]=i;
	} 
	function ret_obj(arr){
    return {
      type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data: {
        labels: label_array,
        datasets: [{
            fill: false,
            label: 'Units in KWh/sec',
            data: arr,
            borderWidth: 1,
            borderColor: 'red'  
        }]
      },

      options: {
        animation: {
          duration: 0
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 0.02,
              min: -0.2,
              max: 0.2
            }
          }]
        }
      }
      
    }
  }

	var ctx = document.getElementById("consumptionChart");
	conChart = new Chart(ctx, ret_obj(consumption_units));


  var ctx1 = document.getElementById("generationChart");
  genChart = new Chart(ctx1, ret_obj(generation_units));
  localStorage.ownerId="12";

  var i=0;
  localStorage.new=localStorage.energy;	

  var j = function(){

	//console.log(parseFloat(localStorage.consumption).toFixed(2)+"-"+parseFloat(localStorage.energy).toFixed(2));
      var consumption_rate = f_consumption();

	var generation_rate = f_generation();
    
  /*var new_consumption_units=[];
	new_consumption_units.push(consumption_rate);
	for(var i=0;i<consumption_units.length;i++){
		new_consumption_units.push(consumption_units[i]);
	}*/
	consumption_units.push(consumption_rate);
	generation_units.push(generation_rate);

	if(consumption_units.length>100){
		consumption_units =[];
		var ctx = document.getElementById("consumptionChart");
	  conChart = new Chart(ctx, ret_obj(consumption_units));
  	generation_units=[];
  	ctx1 = document.getElementById("generationChart");
  	genChart = new Chart(ctx1, ret_obj(generation_units));

	}
	else{

  	genChart.update();
		conChart.update();
	}
    console.log(diff)
    if(i%10==0)
    {

      localStorage.prev = localStorage.new;
      localStorage.new = localStorage.energy;
      console.log("Call1, new, prev, localenergy", localStorage.new, "-", localStorage.prev, "-", localStorage.energy)
      var diff = parseFloat(localStorage.new)- parseFloat(localStorage.prev);
      console.log("Call2, diff-", diff,localStorage.new, "-", localStorage.prev, "-", localStorage.energy)
      $http.get('http://159.89.171.173:3000/api/Energy/EN_12').then(function(res){
        console.log("Call3 value= ", res.data["value"], localStorage.new, "-", localStorage.prev, "-", localStorage.energy);
        localStorage.energy=diff+res.data["value"];
        console.log("Call4 localenergy", localStorage.energy);
        var obj=res.data;
        obj["value"]=parseFloat(localStorage.energy).toFixed(2);
        localStorage.new=localStorage.energy; 
        $http.put('http://159.89.171.173:3000/api/Energy/EN_12', obj).then(function(res){
          console.log("success");
        });
      });
    }
    i++;
	
	/*consumption_units=new_consumption_units;*/
	$scope.$apply();	

	}
	
	setInterval(j, 3000);
	})
	.config(function($mdThemingProvider){
		$mdThemingProvider.theme('amber').backgroundPalette('purple');
		$mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
		$mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
		$mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
	});


	
