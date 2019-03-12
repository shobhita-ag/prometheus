
	(function (angular) {
	var shared = angular.module('shared', [])
	.factory('commonUtility',commonUtility)
	function commonUtility($http,$rootScope, $mdToast, $filter) {
		// js for toast(alert) start
		var last = {
			bottom: true,
			top: false,
			left: false,
			right: true
		};
		var toastPosition = angular.extend({},last);

		var getToastPosition = function() {
			sanitizePosition();
			return Object.keys(toastPosition)
			.filter(function(pos) { return toastPosition[pos]; }).join(' ');
		};

		function sanitizePosition() {
			var current = toastPosition;
			if ( current.bottom && last.top ) current.top = false;
			if ( current.top && last.bottom ) current.bottom = false;
			if ( current.right && last.left ) current.left = false;
			if ( current.left && last.right ) current.right = false;
			last = angular.extend({},current);
		}
		// js for toast(alert) end 

		var utiltity = {
			stringToMinutes: function(step) {
			    var t = step.match(/(\d+)(h?)/);
			    return t[1] * (t[2] ? 60 : 1);
			},
			stringToDate: function(time) {
			    if (!time) return null;
			    var d = new Date();
			    var t = time.match(/(\d+)(?::(\d\d))?\s*(p|a?)/i);
			    if (!t) return null;
			    var hours = parseInt(t[1]);
			    d.setHours(hours + (hours == 12 ? (t[3] ? (t[3].toLowerCase() == 'p' ? 0 : -12) : 0) : (t[3].toLowerCase() == 'p' ? 12 : 0)));
			    d.setMinutes(parseInt(t[2]) || 0);
			    d.setSeconds(0);
			    return d;
			},
			createtimeRange: function(minTime, maxTime, step, array){
				minTime = utiltity.stringToDate(minTime || '08:00'),
			    maxTime = utiltity.stringToDate(maxTime || '23:59'),
			    step = utiltity.stringToMinutes(step || '15m');
				
				var i = minTime;
			    while (i <= maxTime) {
			        var dt = new Date(i);
			        var time = $filter('date')(dt, 'hh:mm a');// dt.toLocaleTimeString().replace(/:\d+ /, ' ').toUpperCase();
			        // time = time.substr(0,time.indexOf('M')+1);
			        array.push(time);
			        i.setMinutes(i.getMinutes() + step);
			    }
			    return array;
			},
			validateEmail: function (email)
	        {
	            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	            return regex.test(email);
	      	},
		  	validatePhone: function (phone)
		  	{
	            var regex =  /^\+?\d{2}[- ]?\d{3}[- ]?\d{5}$/;
	            return regex.test(phone);
	      	},
	      	validateLandline: function(phone){
	      		var regex = /^([0-9]{6,8})$/;
	      		return regex.test(phone);
	      	},
	      	daterange: function(fromDate,toDate,arr)
	        {
	            for (var d = new Date(toDate); d >= new Date(fromDate); d.setDate(d.getDate() - 1)) 
	            {   
	                arr.push(new Date(d));
	            }
	        },

	        daydaterange: function(fromDate,toDate,arr)
	        {
	            for (var d = new Date(fromDate); d <= new Date(toDate); d.setDate(d.getDate() + 1)) 
	            {   
	                arr.push({
	                	'day': d.toString().substr(0,3),
	                	'date': new Date(d)
	                	});
	            }
	        },
	        displayErrorMsg: function(message){
	        	$mdToast.show(
			        $mdToast.simple()
			        .content(message)
			        .position(getToastPosition())
			        .hideDelay(5000)
			     );
	        },
	        comingdate: function(day){
	        	var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	    		var today = new Date();
			    var today_day = today.getDay();

			    day = day.toLowerCase();

			    for (var i = 7; i--;) {
			        if (day === days[i]) {
			            day = (i <= today_day) ? (i + 7) : i;
			            break;
			        }
			    }
			    var daysUntilNext = day - today_day;
				return new Date().setDate(today.getDate() + daysUntilNext);
			},
			currentWeek: function(){
	        	var today = new Date();
	        	var today_day = today.getDay()-1;
	        	var startDate = new Date(new Date().setDate(today.getDate() - today_day));
	        	var endDate = new Date(new Date().setDate(today.getDate() - today_day));
	        	endDate = new Date(endDate.setDate(endDate.getDate() + 6));
	         	return{
	            	startDate: startDate,
	                endDate:endDate
	         	}
	       },
			cityCluster : function(city_id, myscope) {
					$http.get('/operations/city_to_clusters/',{
	            params: {
	                city: city_id
	            }
	        })
	        .success(function(response){
        			myscope.clusterDetails = response.data;
	        })
	        .error(function(response){
	        
	        })
			},
			clusterRider : function(cluster_id, myscope, inactive) {
	        $http.get('/operations/cluster_to_riders/',{
	            params: {
	                cluster_id: cluster_id,
	                inactive: inactive!=undefined ? inactive: false
	            }
	        })
	        .success(function(response){
	            myscope.ridersList = response.data;
	        })
	        .error(function(response){

	        })
			},
			clusterSeller : function(cluster_id, myscope) {
	        $http.get('/operations/cluster_to_sellers/',{
	            params: {
	                cluster_id: cluster_id
	            }
	        })
	        .success(function(response){
	            myscope.sellersList = response.data;
	        })
	        .error(function(response){

	        })
			}
		}
		return utiltity;
	}

	})(angular);


