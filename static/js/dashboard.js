angular
.module('dipesh',['angularSpinner','ngMaterial','daterangepicker','ngCookies','ui.bootstrap','ngFileUpload','md.data.table','ngResource','ngSanitize', 'ui.select', 'shared', 'leaflet-directive','googlechart','selectize'])

.filter('range', function() {
     return function(input, start, end) {
         start = parseInt(start);
         end = parseInt(end);
         var direction = (start <= end) ? 1 : -1;
         while (start != end) {
             input.push(start);
             start += direction;
         }
         return input;
     };
 })

.filter('datefilter', function () {
   return function (input, fromDate, toDate) {
      for (var d = new Date(fromDate); d <= new Date(toDate); d.setDate(d.getDate() + 1)) {
         input.push(new Date(d));
     }
     return input;
    };
})
.filter('dateFormat', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; } 
 
  var _date = $filter('date')(new Date(input), 'yyyy-MM-dd');
 
  return _date.toUpperCase();

 };
})

.directive('integer', function(){
   return {
       require: 'ngModel',
       link: function(scope, ele, attr, ctrl){
           ctrl.$parsers.unshift(function(viewValue){
               return parseInt(viewValue, 10);
           });
       }
   };
})

.directive('datetimepicker', function () { 
    return { 
        restrict: 'A', require : 'ngModel', scope:{},
        link : function (scope, element, attrs, ngModelCtrl) { 
        var times = new Date();

        element.timepicker({timeFormat: 'h:mm p',
                timeFormat: 'h:mm p',
                interval: 30,
                minTime: '7',
                maxTime: '11.30pm',
                dynamic: false,
                dropdown: true,
                scrollbar: true,
                change:function (date) {   
                    timeFormat: 'h:mm',
                    scope.$apply(function () { 
                        ngModelCtrl.$setViewValue(date); 
                    })
                    
                } 
            }); 
        } 
    } 
})

.directive('numbersOnly', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
})
.directive('numbersOnlyMax', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if(transformedInput >20){
                   transformedInput='';
                }
                if (transformedInput !=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }


                return transformedInput;
            });
        }
    };
})
.directive('allowDecimalNumbers', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9\.]/g, '');
                var count = 0;
                for(var i in inputValue){
                  if(inputValue[i]=='.'){
                    count++;
                  }
                }
                if(transformedInput=='.'){
                    return transformedInput;
                }
                else{
                    if(count > 1){
                      transformedInput = transformedInput.substr(0,transformedInput.length-1);
                    }
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                }

                return transformedInput;
            });
        }
    };
})
.directive('allowDecimalNumbersMax', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9\.]/g, '');
                if(transformedInput >50){
                    transformedInput='';
                }
                var count = 0;
                for(var i in inputValue){
                  if(inputValue[i]=='.'){
                    count++;
                  }
                }
                if(transformedInput=='.'){
                    return transformedInput;
                }
                else{
                    if(count > 1){
                      transformedInput = transformedInput.substr(0,transformedInput.length-1);
                    }
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                }

                return transformedInput;
            });
        }
    };
})
.run( function run($http, $cookies) {
  $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
  $http.defaults.headers.put['X-CSRFToken'] = $cookies['csrftoken'];
})

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('red', {
    'default': '600',
  })
  .accentPalette('grey', {
    'default': '600'
  });
})

.controller('operationDashboardController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdDialog, Ops_user, role, salesCity, sales_count_v2_enabled) {
    $scope.date = {
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth()+1))
    };
    $scope.Ops_user = Ops_user;
    $scope.role=role;

    if (sales_count_v2_enabled === "True") {
        $scope.sales_count_v2_enabled = true;
    } else {
        $scope.sales_count_v2_enabled = false;
    }

    $scope.salesCity = salesCity;
    $scope.salesUrl = 'sales/' + $scope.salesCity + '/count/?filter_by=city_wise';
    $scope.salesClusterCountUrl = 'sales/'  + $scope.salesCity +'/count/?filter_by=cluster_wise';
    $scope.salesSellerCountUrl = 'sales/' + $scope.salesCity +'/count/?filter_by=seller_wise';
    $scope.showSection = function(section) {
      if(section=="tasks"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=true;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:tasks');
      }
      else if(section=="maps"){
        $scope.isSectionMaps=true;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        //$scope.$broadcast('get:maps');
      }
       else if(section=="RiderLocation"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=true;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        //$scope.$broadcast('get:RiderLocation');
      }
      else if(section=="tickets"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=true;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:tickets');
      }
      else if(section=="targets"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTargets=true;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:targets');
      }
      else if(section=="dashboard"){
        $scope.isSectionTargets=false;
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionDashboard = true;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMap=false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.isSectionMap=false;
      }
      else if(section=="merchants"){
        $scope.isSectionRiderLocation=false;
        $scope.isSectionMaps=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=true;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast("merchant:home");
      }
      else if(section=="manageMerchants"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = true;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('init:merchants');
      }
      else if(section=="manageOutlets"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = true;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('init:outlets');
      }
      else if(section=="merchantDiscounts"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = true;
        $scope.$broadcast('init:discounts');
      }
      else if(section=="merchantApproval"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = true;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:outlets');
      }
      else if(section=="editSellerSlabs"){
        $scope.isSectionMaps=false;
        $scope.isSectionTasks=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=true;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionMap=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:editSellerSlabs');
      }
      else if(section=="exportInvoice"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTargets=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=true;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionSlab = false;
        $scope.isSectionDashboard = false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:exportInvoice');
      }
      else if(section=="invoiceManagement"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTargets=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isOnBoardSeller=false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = true;
        $scope.isSectionDashboard = false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:invoiceManagement');
      }
      else if(section=="slab") {
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionTargets=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionMap=false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionSlab = true;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:slabInitiate');
      }
      else if(section=="sellerMap") {
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionTargets=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionMap=false;
        $scope.isSectionSellersMap=true;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:SellerMap');
      }
      else if(section=="riderMap"){
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionTargets=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMap=true;
        $scope.isSectionSellersMap=false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:Map')
      }
      else if (section=="view") {
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=true;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMap=false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:riderIncentive');
      }
      else if (section=="phonebill") {
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=true;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMap=false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:phonebill');
      }
      else if (section=="attendance") {
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = true;
        $scope.isSectionRiderPayout = false;
        $scope.isSectionMap=false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:attendance');
      }
      else if (section=="riderpayout") {
        $scope.isSectionMaps=false;
        $scope.isSectionRiderLocation=false;
        $scope.isSectionTasks=false;
        $scope.isSectionTickets=false;
        $scope.isSectionTargets=false;
        $scope.isSectionDashboard = false;
        $scope.isSectionView=false;
        $scope.isSectionPhoneBill=false;
        $scope.isSectionAttendance = false;
        $scope.isSectionRiderPayout = true;
        $scope.isSectionMap=false;
        $scope.isSectionMerchants=false;
        $scope.isSectionManageMerchants = false;
        $scope.isSectionManageOutlets = false;
        $scope.isSectionMerchantApproval = false;
        $scope.isEditSellerSlabs=false;
        $scope.isExportInvoice=false;
        $scope.isSectionSlab = false;
        $scope.isSectionInvoiceManagement = false;
        $scope.isSectionSellersMap=false;
        $scope.isSectionDiscounts = false;
        $scope.$broadcast('get:riderpayouts');
      }
    }
    $scope.showSection('tasks');

    // start sidebar nav js 
    $scope.toggleLeft = buildToggler('left');
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
        $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
      },200);
      return debounceFn;
    }
    // end sidebar nav js 
    $scope.initDate = new Date();
    $scope.format = 'yyyy-MM-dd';
    $scope.dateOptions = {
      formatYear: 'yy',
      initDate: $scope.initDate,
      startingDay: 1,
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };


    $scope.mdDialogCancel = function() {
        $mdDialog.cancel();
    };

    $scope.minimizeFlag = false;
    $scope.sidebarMinimize = function() {
        $scope.minimizeFlag = !$scope.minimizeFlag;
    };

    /* js for ul li collapse */
    ( function( $ ) {
        $( document ).ready(function() {
        $('#cssmenu > ul > li > a').click(function() {
          $('#cssmenu li').removeClass('active');
          $(this).closest('li').addClass('active'); 
          var checkElement = $(this).next();
          if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            $(this).closest('li').removeClass('active');
            checkElement.slideUp('normal');
          }
          if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('#cssmenu ul ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
          }
          if($(this).closest('li').find('ul').children().length == 0) {
            return true;
          } else {
            return false;   
          }     
        });
        });
    } )( jQuery );

    /* js for ul li collapse end*/
})

.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $mdSidenav('left').close()
    .then(function () {
      $log.debug("close LEFT is done");
    });
  };
})
.controller('mapsClusteringController', function ($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdDialog, Ops_user, role, salesCity,$mdToast) {

    // js for toast(alert) start
    $scope.role = role;
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }

    function initialize(sellersinfo) {
        var map;
        var bounds = new google.maps.LatLngBounds();
        var mapOptions = {
            mapTypeId: 'roadmap',
            zoom: 15
        };
        var cluster_boundaries = $scope.cluster_boundaries;
        var polyCoords=[];
        var markers = sellersinfo;
        var  marker, i;
                        
        // Display a map on the page
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var infowindow = new google.maps.InfoWindow();
       
        
        // Loop through our array of markers & place each one on the map  
        if(sellersinfo.length>0){
            for( i = 0; i < markers.length; i++ ) {
                var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
                //bounds.extend(position);
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: markers[i][0],
                    icon: '/static/img/store.png'
                });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var contentString = '<div id="sellerDetails" class="padding-top-xs">' +
                                            '<div class="row margin-zero"  style="width: 275px">' +
                                                '<div class="col-md-3 riderName" style="border-right: 1px solid #ddd">' +
                                                '<span style="white-space: nowrap">' +
                                                    markers[i][3] + 
                                                '</span>' + 
                                                '</div>' + 
                                                '<div class="col-md-9 riderName" >' +
                                                '<span style="white-space: nowrap">' +
                                                    markers[i][0] + 
                                                '</span>' + 
                                                '</div>' + 
                                                
                                            '</div>' +
                                        '</div>'
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                }
                })(marker, i));
            }
        }

        


        
        if(cluster_boundaries){
            var boundaries_len = cluster_boundaries.length;
            for(var i=0 ; i<boundaries_len ; i++){
                polyCoords.push(new google.maps.LatLng(cluster_boundaries[i][0], cluster_boundaries[i][1]));
                bounds.extend(polyCoords[i]);
            }

            map.fitBounds(bounds);
            zoomChangeBoundsListener = google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
                    if (this.getZoom()){
                        this.setZoom(12);
                    }
            });
            setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);
        }
        
        // Styling & Controls
        myPolygon = new google.maps.Polygon({
            paths: polyCoords,
            draggable: true, // turn off if it gets annoying
            editable: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });

        myPolygon.setMap(map);
        //google.maps.event.addListener(myPolygon, "dragend", getPolygonCoords);
        google.maps.event.addListener(myPolygon.getPath(), "insert_at", getPolygonCoords);
        //google.maps.event.addListener(myPolygon.getPath(), "remove_at", getPolygonCoords);
        google.maps.event.addListener(myPolygon.getPath(), "set_at", getPolygonCoords);
    }

    function getPolygonCoords() {
      var len = myPolygon.getPath().getLength();
      var PolygonCoordinates = [];
      for (var i = 0; i < len; i++) {

        var lat_long =myPolygon.getPath().getAt(i).toUrlValue(5);
        var res = lat_long.split(",");
        if(res.length>0){
            var lat = parseFloat(res[0]);
            var long = parseFloat(res[1]);
            var coordinates = [lat,long];
            PolygonCoordinates.push(coordinates);
        }
        
      }
      $scope.cluster_boundaries = PolygonCoordinates;
      return PolygonCoordinates;
    }

    $scope.fetchCities = function() {
        $scope.clusterMapsLoading = true;
        $http.get('cities/info/')
        .success(function(response){
          $scope.clusterMapsLoading = false;
          $scope.mapsCitiesList = response.cities_info;
        })
        .error(function(response){
          $scope.clusterMapsLoading = false;
          $mdToast.show(
            $mdToast.simple()
            .content('There was an error getting task list. Error: '+response.message)
            .position($scope.getToastPosition())
            .hideDelay(3000)
          );
        });
    }

    $scope.cityToCluster = function(city_id) {
        $scope.city_id = city_id;
        $scope.clusterMapsLoading = true;
        var url="clusters/" + city_id + "/info/";
        $http.get(url)
        .success(function(response){
          $scope.clusterMapsLoading = false;
          $scope.mapsClustersList = response.clusters_info;
        })
        .error(function(response){
          $scope.clusterMapsLoading = false;
          $mdToast.show(
            $mdToast.simple()
            .content('There was an error getting clusters info. Error: '+response.message)
            .position($scope.getToastPosition())
            .hideDelay(3000)
          );
        });
    };

    $scope.getSellersInfo = function(cluster) {
        var url="clusters/" + cluster.id + "/seller_info/";
        $scope.clusterMapsLoading = true;
        $scope.cluster_id = cluster.id;
        if(cluster.cluster_boundaries){
            $scope.cluster_boundaries = JSON.parse(cluster.cluster_boundaries);
        }
        else{
            $scope.cluster_boundaries = buildClusterBoundaries(cluster.latitude,cluster.longitude);
            $mdToast.show(
                $mdToast.simple()
                .content('Cluster boundary not defined, try stretching the above triangle to define cluster boundary.')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        }
        
        $http.get(url)
        .success(function(response){
            var sellersinfo = buildSellersMarkers(response.sellers_info)
            $scope.clusterMapsLoading = false;
            $scope.sellersInfo = response.sellers_info;
            if(sellersinfo){}
            else{
                $mdToast.show(
                $mdToast.simple()
                .content('There are no sellers in this cluster .')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
            }
            initialize(sellersinfo); 
        })
        .error(function(response){
            $scope.clusterMapsLoading = false;
            $mdToast.show(
                $mdToast.simple()
                .content('There was an error getting sellers info . Error: '+response.message)
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        });
    };

    $scope.updateClusterBoundary = function() {
        $scope.clusterMapsLoading = true;
        var url="clusters/" + $scope.cluster_id + "/info/update/";

        $http.put(url, {
          cluster_boundaries: $scope.cluster_boundaries
        })
        .success(function(response){
          $scope.clusterMapsLoading = false;
          $scope.cityToCluster($scope.city_id );
          $mdToast.show(
            $mdToast.simple()
            .content('Cluster border updated successfully.')
            .position($scope.getToastPosition())
            .hideDelay(3000)
          );
        })
        .error(function(response){
          $scope.clusterMapsLoading = false;
          $mdToast.show(
            $mdToast.simple()
            .content('There was an error in updating cluster boundary. Error: '+response.message)
            .position($scope.getToastPosition())
            .hideDelay(3000)
          );
        });
    };

    function buildSellersMarkers(sellers){
        var sellers_length = sellers.length;
        var sellersInfo = [];
        for(var i = 0; i < sellers_length; i++ ){
            sellersInfo.push([sellers[i].outlet_name,sellers[i].address__latitude,sellers[i].address__longitude,sellers[i].id]);
        }
        return sellersInfo;
    }

    function buildClusterBoundaries(lat,long){

        var degreesPerPoint = 90;

        // Keep track of the angle from centre to radius
        var currentAngle = 0;

        // The points on the radius will be lat+x2, long+y2
        var x2;
        var y2;
        // Track the points we generate to return at the end
        var points = [];

        for(var i=0; i < 3; i++)
        {
            // X2 point will be cosine of angle * radius (range)
            x2 = Math.cos(currentAngle) ;
            // Y2 point will be sin * range
            y2 = Math.sin(currentAngle) ;

            // Assuming here you're using points for each x,y..             
            var p = [lat + (x2/100), long + (y2/100)];

            // save to our results array
            points.push(p);

            // Shift our angle around for the next point
            currentAngle += degreesPerPoint;
        }
        // Return the points we've generated
        return points;
    }

    function init(){
        $scope.fetchCities();
    }

    init();
})

.controller('riderLocationsController', function ($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdDialog, Ops_user, role,$mdToast, commonUtility) {

    var map, marker;
    $scope.selected = [];
    var dataMap = new google.maps.Data();
    $scope.role = role;
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }

    function Radians(degrees) {
        return degrees * Math.PI / 180;
    };

    function Degrees(radians) {
        return radians * 180 / Math.PI;
    };

    function Earthradius(lat) {
        var An = 6378137.0 * 6378137.0 * Math.cos(lat);
        var Bn = 6356752.3 * 6356752.3 * Math.sin(lat);
        var Ad = 6378137.0 * Math.cos(lat);
        var Bd = 6356752.3 * Math.sin(lat);

        return Math.sqrt((An * An + Bn * Bn) / (Ad * Ad + Bd * Bd));
    };


    function initialize(ridersinfo,clusterCenter,clusterBoundary) {
        var distmeter = 5000;
        var bounds = new google.maps.LatLngBounds();
        var apathother = [];
        var poly_coords = [];

        var nbofpoint = 100;
        var features = {
          "type": "FeatureCollection",
          "features": []
        };

        var mapOptions = {
            center: new google.maps.LatLng(clusterCenter[0], clusterCenter[1]),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var mapElement = document.getElementById("mapDiv");

        map = new google.maps.Map(mapElement, mapOptions);  

        if(clusterBoundary.length>0){
            var boundaries_len = clusterBoundary.length;
            for(var i=0 ; i<boundaries_len ; i++){
                apathother.push(new google.maps.LatLng(clusterBoundary[i][0], clusterBoundary[i][1]));
                bounds.extend(apathother[i]);
            }

            clusterBoundary.push([clusterBoundary[0][0],clusterBoundary[0][1]])

            poly_coords = clusterBoundary;
        }
        else{
            for (var k = 0; k <= nbofpoint; k++) {
                var AngleDeg = (360 * (k / nbofpoint));

                var LatLong = DestinationPoint(clusterCenter[0],clusterCenter[1],distmeter,AngleDeg);
                poly_coords.push([LatLong[0],LatLong[1]]);
                
                var coord = new google.maps.LatLng(parseFloat(LatLong[0]), parseFloat(LatLong[1]));
                apathother.push(coord);
                bounds.extend(coord);
            }
        }

        map.fitBounds(bounds);
        zoomChangeBoundsListener = google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
                if (this.getZoom()){
                    this.setZoom(12);
                }
        });
        setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);


        var polylineother = new google.maps.Polygon({
            path: apathother,
            strokeColor: "#FF0000",
            strokeOpacity: 0.5,
            strokeWeight: 2,
            map: map,
            title: "Turf other"
        });

        var polygon = turf.polygon([
            poly_coords
        ], {
            "fill": "#6BC65F",
            "stroke": "#6BC65F",
            "stroke-width": 5
        });

        var markerturf = new google.maps.Marker({
            map: map
        });

        if(ridersinfo.length>0){
            var markers = [];
            for( i = 0; i < ridersinfo.length; i++ ) {
                var position = new google.maps.LatLng(ridersinfo[i][0], ridersinfo[i][1]);
                var point = turf.point([ridersinfo[i][0], ridersinfo[i][1]]);
                features.features.push(point);
                //bounds.extend(position);
                var image = '/static/img/rider_loc.png';
                marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: ridersinfo[i][2],
                    icon: image
                });
                markers.push(marker);
            }

            var options = {
                imagePath: '/static/img/maps/m'
            };

            var markerCluster = new MarkerClusterer(map, markers, options);

            features.features.push(polygon);
            var percentageInsideCluster = locationInsidePercentage(features.features);
            $scope.percentageInsideCluster = percentageInsideCluster.toFixed(2);
        }
        else{
            $scope.percentageInsideCluster = 0
        }

    }
    function locationInsidePercentage(circleData){
        var count = 0;
        var circlelength = (circleData.length)-1
        var polygon = circleData[circlelength];
        for (var i = 0; i < circlelength; i++) {
            if(turf.inside(circleData[i], polygon)){
                count=count+1
            }
        }
        return (count/circlelength)*100;
    }

    function dataMapReload(point){

        var turfPoint = turf.point([point.geometry.coordinates[1],point.geometry.coordinates[0]]);
        var buffered = turf.buffer(turfPoint, 5, "kilometers");
        dataMap.setMap(null);
        dataMap = new google.maps.Data();
        dataMap.addGeoJson(buffered);
        dataMap.setMap(map);
    }

    function getPolygonCoords() {
      var len = myPolygon.getPath().getLength();
      var PolygonCoordinates = [];
      for (var i = 0; i < len; i++) {

        var lat_long =myPolygon.getPath().getAt(i).toUrlValue(5);
        var res = lat_long.split(",");
        if(res.length>0){
            var lat = parseFloat(res[0]);
            var long = parseFloat(res[1]);
            var coordinates = [lat,long];
            PolygonCoordinates.push(coordinates);
        }
        
      }
      $scope.cluster_boundaries = PolygonCoordinates;
      return PolygonCoordinates;
    }

    $scope.fetchCities = function() {
        $scope.clusterMapsLoading = true;
        $http.get('cities/info/')
        .success(function(response){
          $scope.clusterMapsLoading = false;
          $scope.mapsCitiesList = response.cities_info;
        })
        .error(function(response){
          $scope.clusterMapsLoading = false;
          $mdToast.show(
            $mdToast.simple()
            .content('There was an error getting task list. Error: '+response.message)
            .position($scope.getToastPosition())
            .hideDelay(3000)
          );
        });
    }

    $scope.cityToCluster = function(city_id) {
        $scope.city_id = city_id;
        $scope.clusterMapsLoading = true;
        var url="clusters/" + city_id + "/info/";
        $http.get(url)
        .success(function(response){
          $scope.clusterMapsLoading = false;
          $scope.mapsClustersList = response.clusters_info;
        })
        .error(function(response){
          $scope.clusterMapsLoading = false;
          $mdToast.show(
            $mdToast.simple()
            .content('There was an error getting clusters info. Error: '+response.message)
            .position($scope.getToastPosition())
            .hideDelay(3000)
          );
        });
    };

    $scope.getRidersInfo = function(cluster) {
        $scope.cluster_id = cluster.id;
        $scope.clusterToRider($scope.cluster_id);
    };

    $scope.fetchRiderLocations= function(){
        $scope.fromTime = null;
        $scope.toTime =null;
        var url="rider/locationtrack/";
        var date;
        //url= "https://api.myjson.com/bins/166dw3";
        if($scope.todayDate){
            date = new Date($scope.todayDate);
            var month=0;
            var day=0;
            if(date.getMonth()<9){
                month = date.getMonth() + 1 ; 
                month = "0" + month ;
            }
            else{
                month = date.getMonth() + 1 ; 
            }

            if(date.getDate()<10){
                day  = "0" + date.getDate();
            }
            else{
                day  = date.getDate();
            }

            date = date.getFullYear() + '-' + month + '-' + day;
        }
        else{
            date = undefined;
        }
       
        $scope.clusterMapsLoading = true;
        //var date= $scope.todayDate;

        if($scope.rider.selected && date){
            $http.get(url, {
                params: {
                    rider_id: $scope.rider.selected!=undefined ? $scope.rider.selected.id:null,
                    date: date
                }
            })
            .success(function(response){
                $scope.clusterMapsLoading = false;
                $scope.ridersInfo_turf = response
                $scope.ridersInfo = buildRidersMarkers(response)
                $scope.cluster_center = [response.cluster_location.latitude , response.cluster_location.longitude];
                $scope.disableTimeFilter = false;
                $scope.cluster_boundaries = response.cluster_boundaries;
                initialize($scope.ridersInfo, $scope.cluster_center,  $scope.cluster_boundaries); 
            })
            .error(function(response){
                $scope.disableTimeFilter = true;
                $scope.clusterMapsLoading = false;
                $mdToast.show(
                    $mdToast.simple()
                    .content('There was an error getting riders Locations . Error: '+response.message)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
            });
        }
        else{
            $scope.clusterMapsLoading = false;
            $mdToast.show(
                    $mdToast.simple()
                    .content('Rider ID and Date are compulsory fields')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
        }
        
    }

    $scope.resetRidersInfo =function(){
        $scope.cluster = {};
        $scope.city={};
        $scope.rider = {};
        $scope.todayDate = null;
        $scope.fromTime = null;
        $scope.toTime = null;
        $scope.percentageInsideCluster = 0 ;
    }

    $scope.clusterToRider = function(cluster_id) {
        $scope.ridersList = [];
        $scope.clusterMapsLoading = true;
        $http.get('/operations/cluster_to_riders/',{
                params: {
                    cluster_id: cluster_id

                }
            })
            .success(function(response){
                $scope.ridersList = response.data;
                $scope.clusterMapsLoading = false;
            })
            .error(function(response){
                $scope.clusterMapsLoading = false;
            })
        //commonUtility.clusterRider(cluster_id, $scope);
    };

    $scope.onRiderChange = function(selectedRider){
        $scope.selectedRider = selectedRider;
    }

    $scope.validateFromTime = function(){
        var selectedDate = new Date($scope.todayDate);

        var fromTime = $scope.fromTime
        fromTime.setDate(selectedDate.getDate());
        fromTime.setMonth(selectedDate.getMonth());
        fromTime.setFullYear(selectedDate.getFullYear());
        var fromTimeStamp = fromTime.getTime()

         $scope.validateTime(fromTimeStamp,'from');
    } 

    $scope.validateTime = function(timestamp,time_type){
        var presentTime = new Date();
        var presentTimeStamp = presentTime.getTime();

        if(presentTimeStamp<timestamp){
            if(time_type=='from'){
                $scope.fromTime = null;
            }
            else{
                $scope.toTime = null;
            }
            $mdToast.show(
                        $mdToast.simple()
                        .content('To-Time / From-Time cannot be greater than present Time')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                    ); 
            return false;

        }
        else{
            return true;
        }
    }

    $scope.updateRidersData = function() {
        var selectedDate = new Date($scope.todayDate);
        var toTime = $scope.toTime;
        toTime.setDate(selectedDate.getDate());
        toTime.setMonth(selectedDate.getMonth());
        toTime.setFullYear(selectedDate.getFullYear());

        var fromTime = $scope.fromTime
        fromTime.setDate(selectedDate.getDate());
        fromTime.setMonth(selectedDate.getMonth());
        fromTime.setFullYear(selectedDate.getFullYear());
        
        var toTimeStamp = toTime.getTime()
        var fromTimeStamp = fromTime.getTime()

        var ridersInfo = $scope.ridersInfo? $scope.ridersInfo : [];
        var refinedData = [];
        var riders_length = ridersInfo.length;
        if($scope.validateTime(toTimeStamp,"to")){
            if(toTimeStamp > fromTimeStamp){
                if($scope.ridersInfo){
                    
                    for(var i = 0;i<riders_length;i++){
                        var featuretime = ridersInfo[i][2];
                        var time = new Date(featuretime);
                        var featureStamp = time.getTime();

                        if(fromTimeStamp<featureStamp && featureStamp<toTimeStamp){
                            refinedData.push([ridersInfo[i][0],ridersInfo[i][1],ridersInfo[i][2]]);
                        }
                    }       
                    initialize(refinedData, $scope.cluster_center,$scope.cluster_boundaries);
                }
            }
            else{
                $scope.toTime = null;
                $mdToast.show(
                        $mdToast.simple()
                        .content('To-Time should be greater than From-Time')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                    ); 
            }
        }  
    };

    function buildRidersMarkers(riders){
        var riders_length = riders.rider_locations.length;
        var ridersInfo = [];
        for(var i = 0; i < riders_length; i++ ){
            ridersInfo.push([riders.rider_locations[i].latitude,riders.rider_locations[i].longitude,riders.rider_locations[i].update_timestamp]);
        }
        return ridersInfo;
    }

    function init(){
        $scope.cluster = {};
        $scope.city={};
        $scope.rider = {};
        $scope.todayDate = null;
        $scope.fromTime = null;
        $scope.toTime = null;
        $scope.percentageInsideCluster = 0 ;
        $scope.fetchCities();
        $scope.scheduledTime = '';
        var date = new Date();
        $scope.disableTimeFilter = true;
        //$scope.todayDate =date.toLocaleDateString();
        $scope.maxDate = date.toLocaleDateString();
        date.setDate(date.getDate() - 1) 
        $scope.yesterdayDate = date;


        $('input[name="dateFilter"]').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            minDate:$scope.yesterdayDate,
            maxDate : $scope.maxDate
        });

        setTimeout(function(){ 
            $('#fromTime').timepicker({});
        }, 1000);

        setTimeout(function(){ 
            $('#toTime').timepicker({});
        }, 1000);
    }

    init();
})

.controller('tasksController', function ($scope, $rootScope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdToast, $document, role, commonUtility) {
    $scope.pagination = {
        maxWindowSize: 10,
        itemsPerPage: 25,
        currentPage: 1
    };

    $scope.clusterDetails = [];
    $scope.cityToCluster = function(city_id) {
        commonUtility.cityCluster(city_id, $scope);
    };

    $scope.todayDate = new Date();

    $scope.cityList = [
        {
        id:'NCR',
        name: "NCR"
        },
        {
        id:'BOM',
        name: "Mumbai"
        },
        {
        id:'BLR',
        name: "Bengaluru"
        },
        {
        id:'JPR',
        name: "Jaipur"
        },
        {
        id:'PNQ',
        name: "Pune"
        },
        {
        id:'HYD',
        name: "Hyderabad"
        },
        {
        id:'MAA',
        name: "Chennai"
        },
        {
        id:'STV',
        name: "Surat"
        },
        {
        id:'NVM',
        name: "NaviMumbai"
        },
        {
        id:'AMD',
        name: "Ahmedabad"
        },
        {
        id:'IDR',
        name: "Indore"
        },
        {
        id:'CCU',
        name: "Kolkata"
        },
        {
        id:'IXC',
        name: "Chandigarh"
        }
    ];

    $scope.statusList = [
        {
            id:0,
            name:'Incomplete'
        },
        {
            id:1,
            name:'Complete'
        },
        {
            id:2,
            name:'Completed by Manager'
        }
    ];

    /*variable definition for filters start*/
    $scope.intializeFilters = function() {
        $scope.task_city = {};
        $scope.task_cluster = {}; 
        $scope.task_status = {};
    }
    /*end*/
    $scope.intializeFilters();

    $scope.selected = [];
    $scope.data = {};  
    $scope.clusters = clusters;
    $scope.sortType = 'name';
    $scope.sortReverse  = false;
    $scope.role = role;

    function initializeTask() {
    $scope.task = {
      id: '',
      myDate: new Date(),
      priority: {
                  id:'3',
                  name: "Neutral"
                },
      taskDesc: '',
      periodic: 1,
      assignCluster: [],
      city: [],
    };
    }
    initializeTask();

    // js for toast(alert) start
    var last = {
    bottom: true,
    top: false,
    left: false,
    right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
    .filter(function(pos) { return $scope.toastPosition[pos]; })
    .join(' ');
    };

    function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
    }
    // js for toast(alert) end 

    $scope.assignTask = function() {
    $scope.assignTaskBlock = true;
    $scope.taskTableBlock = true;
    $scope.editTaskBlock = false;
    };

    $scope.editTask = function(task) {
    $scope.editTaskBlock = true;
    $scope.assignTaskBlock = false;
    var clusterList = [];
    angular.forEach($scope.allClusters, function(value, key){
      if (key in task.clusters) {
        clusterList.push({
            name: value.cluster_name,
            id: value.id
        });
      }
    })
    $scope.task = {
      id: task.id,
      myDate: task.scheduled_date,
      priority: $scope.priorityList[task.priority],
      taskDesc: task.description,
      periodic: task.periodic,
      assignCluster: clusterList
    }
    $scope.taskDate = new Date($scope.task.myDate);
    // $scope.disableCheck = (new Date($scope.task.myDate) - ($scope.todayDate));
    $scope.disableCheck = ((new Date($scope.task.myDate)).setDate(new Date($scope.task.myDate).getDate() + 1) < ($scope.todayDate));
    }

    $scope.cancel = function() {
    $scope.assignTaskBlock = false;
    $scope.taskTableBlock = false;
    $scope.editTaskBlock = false;
    initializeTask();
    $scope.taskListTillToday = '';
    };


    $scope.fetchTask = function() {
    $scope.taskTableLoading = true;
    $http.get('operations/tasks/')
    .success(function(response){
      $scope.taskTableLoading = false;
      $scope.taskList = response;
    })
    .error(function(response){
      $scope.taskTableLoading = false;
      $mdToast.show(
        $mdToast.simple()
        .content('There was an error getting task list. Error: '+response.message)
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    });
    }

    $scope.fetchTaskHistory = function() {
    $scope.taskTableLoading = true;
    $http.get('/operations/tasks/history/', {
      params: {
        start_date: new Date($scope.date.startDate),
        end_date: new Date($scope.date.endDate),
        city: $scope.task_city.selected!=undefined ? $scope.task_city.selected.id:null,
        cluster: $scope.task_cluster.selected!=undefined ? $scope.task_cluster.selected.id:null,
        status: $scope.task_status.selected!=undefined ? $scope.task_status.selected.id:null,
        page: $scope.pagination.currentPage,
        limit: $scope.pagination.itemsPerPage
      }
    })
    .success(function(response){
      $scope.taskTableLoading = false;
      $scope.taskList = response.data;
      $scope.pagination.totalItems = response.count;
    })
    .error(function(response){
      $scope.taskTableLoading = false;
      $mdToast.show(
        $mdToast.simple()
        .content('There was an error getting task list. Error: '+response.message)
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    });
    }

    function taskPing() {
    $scope.fetchTaskHistory();
    $timeout(taskPing, 300*1000);
    }

    taskPing();

    // $scope.fetchTask();

    $scope.priorityList = [
    {

    id:'0',
    name: "Urgent"
    },
    {
    id:'1',
    name: "Very High"
    },
    {
    id:'2',
    name: "High"
    },
    {
    id:'3',
    name: "Neutral"
    },
    {
    id:'4',
    name: "Low"
    }
    ];

    $scope.closeAlert = function () {
    $timeout(function () {
      $scope.alert = {};
    }, 1000);
    }

    /* md autocomplete for clusters */
    $scope.allcheckbox = false;
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.selectedClusters = [];
    $scope.clusterList = loadClusters();

    function loadClusters(){
    var clusters = $scope.clusters;
    return clusters.map(function (cluster) {
      cluster.id = cluster.id;
      cluster.name = cluster.name.toLowerCase();
      return cluster;
    });
    }

    $scope.querySearch = function (query) {
    clusterSearch = [];
    angular.forEach($scope.clusterList, function(value, key) {
          if(value.name.indexOf(query.toLowerCase()) > -1) {
            clusterSearch.push(value);
          }
      });
    return clusterSearch;
    }

    $scope.selectAllClusters = function(task) {
      var clusterSelected = $scope.selectedClusters;
      if($scope.allcheckbox) {
        task.assignCluster = loadClusters();
      } else {
        task.assignCluster = clusterSelected;
      }
    }
    /* end md autocomplete for clusters */


    /*----md autocomplete for city---*/
    $scope.cityCheckbox = false;
    $scope.citySelectedItem = null;
    $scope.citySearchText = null;
    $scope.selectedCities = [];
    $scope.cities = loadcities();

    function loadcities(){
    var cities = $scope.cityList;
    return cities.map(function (city) {
      city.id = city.id;
      city.name = city.name;
      return city;
    });
    }

    $scope.citySearch = function (query) {
    citySearch = [];
    angular.forEach($scope.cities, function(value, key) {
          if(value.name.indexOf(query) > -1) {
            citySearch.push(value);
          }
      });
    return citySearch;
    }

    $scope.selectAllCities = function(task) {
    var citySelected = $scope.selectedCities;
    if($scope.cityCheckbox) {
      task.city = loadcities();
    } else {
      task.city = citySelected;
    }
    }
    /* --- end md-autocomplete for cities --- */

    $scope.validateAssignTask = function(){
    var task = $scope.task;
    if(!$scope.task.taskDesc) { $scope.showErrorMsg('Please enter task description.'); return false; }
    if((!$scope.task.assignCluster || $scope.task.assignCluster.length <= 0) && (!$scope.task.city || $scope.task.city.length <= 0)) { $scope.showErrorMsg('Please select atleast single cluster.'); return false; }
    return true;
    };


    $scope.showErrorMsg = function(msg){
    $mdToast.show(
        $mdToast.simple()
        .content(msg)
        .position($scope.getToastPosition())
        .hideDelay(3000)
        );
    };

    $scope.viewTasks = function() {
        $scope.assignTaskBlock = false;
        $scope.taskTableBlock = false;
    }

    $scope.submitAssignTask = function() {
    if(!$scope.validateAssignTask()){ return false; }
    var task = $scope.task;
    $scope.assignTaskLoading=true;
    $http.post('/operations/tasks/',{
      scheduled_date: task.myDate,
      priority: task.priority.id,
      description: task.taskDesc,
      periodic: task.periodic,
      clusters: task.assignCluster,
      cities: task.city
    })
    .success(function(response){
      $scope.assignTaskLoading = false;
      $mdToast.show();
      $mdToast.show(
        $mdToast.simple()
        .content('Task assigned successfully')
        .position($scope.getToastPosition())
        .hideDelay(3000)
        );
      initializeTask();
      $scope.assignTaskBlock = false;
      $scope.taskTableBlock = false;
      $scope.fetchTaskHistory();
      $scope.allcheckbox = false
      $scope.cityCheckbox = false;
    })
    .error(function(data, status, headers, config) {
      $scope.assignTaskLoading = false;
      $mdToast.show();
      $mdToast.show(
        $mdToast.simple()
        .content('There was a error in assigning task')
        .position($scope.getToastPosition())
        .hideDelay(3000)
        );
    })
    }

    $scope.updateTask = function() {
    var task = $scope.task;
    $scope.updateTaskLoading = true;
    $http.put('operations/tasks/' + task.id + '/update/',{
      id: task.id,
      scheduled_date: task.myDate,
      priority: task.priority.id,
      description: task.taskDesc,
      periodic: task.periodic,
      clusters: task.assignCluster
    })
    .success(function(response){
      $scope.updateTaskLoading = false;
      $mdToast.show();
      $mdToast.show(
        $mdToast.simple()
        .content('Task updated successfully')
        .position($scope.getToastPosition())
        .hideDelay(3000)
        );
      $scope.assignTaskBlock = false;
      $scope.editTaskBlock = false;
      $scope.taskTableBlock = false;
      $scope.fetchTaskHistory();
    })
    .error(function(response){
      $scope.updateTaskLoading = false;
      $mdToast.show(
        $mdToast.simple()
        .content('Task not updated')
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    });
    }

    $scope.updateStatus = function(taskObject) {
    if(taskObject.status == 1)
      incentive = 1;
    else
      incentive = 0;
    $http.put('operations/tasks/'+ taskObject.id +'/status/',{
      status: "1",
      incentive: incentive
    })
    .success(function(response){
      taskObject.status = "1";
      $mdToast.show(
        $mdToast.simple()
        .content('Task status changed successfully')
        .position($scope.getToastPosition())
        .hideDelay(3000)
        );
      $scope.fetchTaskHistory();
    })
    .error(function(response){
      $mdToast.show();
      $mdToast.show(
        $mdToast.simple()
        .content('There was an error in changing the status. Error: '+response.message)
        .position($scope.getToastPosition())
        .hideDelay(3000)
        );
    })

    }


    $scope.fetchTaskTillToday = function() {
    $scope.oldTaskLoading = true;
    $http.get('operations/tasks/data/',{
      params: {
        scheduled_date: $scope.task.myDate
      }
    })
    .success(function(response){
      $scope.oldTaskLoading = false;
      $scope.taskListTillToday = response.data;
      $timeout(function(){
        $scope.closeAlert();
      },5000);
    })
    .error(function(response) {
      $scope.oldTaskLoading = false;
    })
    }

    $scope.getAllClusters = function() {
        $http.get('/operations/city_to_clusters/',{
            params: {
                city: 'all'
            }
        })
        .success(function(response){
                $scope.allClusters = response.data;
        })
        .error(function(response){
        
        })
    }

    $scope.$on('get:tasks', function() {
        $scope.fetchTask();
        $scope.fetchTaskTillToday();
        $scope.getAllClusters();
    });
    //start date picker js
    $scope.getHistory= function() {
      $scope.startDate = new Date($scope.date.startDate);
      $scope.endDate = new Date($scope.date.endDate);
      $scope.fetchTaskHistory();
    }
    $scope.fetchTaskTillToday();
    $scope.getAllClusters();
    $scope.exportAsCsv = function() {
      $scope.taskTableLoading = true;
      $http.get('operations/tasks/csv/', {
        params: {
          start_date: new Date($scope.date.startDate),
          end_date: new Date($scope.date.endDate),
          city: $scope.task_city.selected!=undefined ? $scope.task_city.selected.id:null,
          cluster: $scope.task_cluster.selected!=undefined ? $scope.task_cluster.selected.id:null,
          status: $scope.task_status.selected!=undefined ? $scope.task_status.selected.id:null
        }
      })
      .success(function(data, status, headers, config) {
        
        filename = headers()['content-disposition'].split(';')[1].trim().replace("filename=","");

        var file = new Blob([data], { type: 'text/csv' });
        saveAs(file, filename);
        $scope.taskTableLoading = false;
      })
      .error(function(errordata, status, headers, config) {
        console.log(errordata);
        $scope.taskTableLoading = false;
        $scope.message = 'There was an error in getting your task history. Please try again!';
      });
    }

    $scope.statusFilter = function(task) {
      if($scope.taskstatus==0) {
        return task.status==0;
      } else if ($scope.taskstatus==1) {
        return task.status==1
      } else if ($scope.taskstatus==3){
        return task.incentive == 1;
      } else {
        return true;
      }
    }
})

.controller('ticketsController', function ($scope, $timeout, $mdSidenav, $log, $http, role, $mdToast, $document, clusters, commonUtility, $mdDialog) {
    $scope.pagination = {
        maxWindowSize: 10,
        itemsPerPage: 25,
        currentPage: 1
    };

    /*variable definition for filters start*/
    $scope.intializeFilters = function() {
        $scope.ticket_city = {};
        $scope.ticket_cluster = {};
        $scope.ticket_raisedRider = {};
        $scope.ticket_raisedSeller = {}; 
        $scope.ticket_ticketStatus = {};
    }
    /*end*/
    $scope.intializeFilters();

    $scope.selected = [];
    // js for fab-toolbar start
    $scope.isOpen = false;
    $scope.demo = {
        isOpen: false,
        count: 0,
        selectedDirection: 'left'
    };
    // js for fab-toolbar end
    $scope.todayDate = new Date();
    $scope.role = role;
    $scope.clusters = clusters;

    $scope.ticketTabId = 1;

    $scope.initializeTicket = function() {
        $scope.ticket = {
            sellerName: '',
            riderName: '',
            category: '',
            subCategory: '',
            ticketType: '',
            ticketDetails: '',
            fine: '',
            paymentCycle : ''
        };
    }
    $scope.initializeTicket();

    $scope.cityList = [];
    

    $scope.clusterDetails = [];
    $scope.cityToCluster = function(city_id) {
        $scope.clusterDetails = [];
        commonUtility.cityCluster(city_id, $scope);
    };

    $scope.ridersList = [];
    $scope.clusterToRider = function(cluster_id) {
        $scope.ridersList = [];
        commonUtility.clusterRider(cluster_id, $scope);
    };
    
    $scope.sellersList = [];
    $scope.clusterToSeller = function(cluster_id) {
        $scope.sellersList = [];
        commonUtility.clusterSeller(cluster_id, $scope);
    };

    console.log($scope.ticket.paymentCycle);

    var last = {
      bottom: true,
      top: false,
      left: false,
      right: true
    };
      $scope.toastPosition = angular.extend({},last);
      $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
          .filter(function(pos) { return $scope.toastPosition[pos]; })
          .join(' ');
      };
      function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
      }

    $scope.fetchTickets = function(ticket_type) {
        $scope.ticketsLoading = true;
        var ticket = $scope.ticket;
        var type = 1;
        ticket.raised_against = $scope.ticket_raisedRider;
        $http.get('/operations/get-tickets/',{  
            params: {
                date_start: new Date($scope.date.startDate),
                date_end: new Date($scope.date.endDate),
                rider_phone: ticket.raised_against.riderPhone,
                rider_id: ticket.raised_against.riderId,
                ticket_type: ticket_type,
                ticket_status: $scope.ticket_ticketStatus.selected!=undefined ? $scope.ticket_ticketStatus.selected.id:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage
          }
      })
        .success(function(response){
            $scope.ticketsLoading = false;
            $scope.ticketList = response.data;
            $scope.pagination.totalItems = response.count;
            $scope.ticketTyp = type;
            if(type == 1 || type.toString().toLowerCase() == 'rider') {
                $scope.onRiderTab = true;
            }
            else if(type == 2 || type.toString().toLowerCase() == 'seller') {
                $scope.onRiderTab = false;
            }
        })
        .error(function(response){
          $scope.ticketsLoading = false;
        })
    }

    $scope.fetchCategoryList = function(type) {
        $http.get('/operations/ticket/category/',{
          params: {
            category_against:type,
        }
        })
            .success(function(response){
                $scope.response = JSON.parse(response.data);
                $scope.initializeTicket();
            })
    };


    $scope.$watch('ticket.category',function(value){
        if($scope.response && value)
        {
            $scope.categoryList = $scope.response[value].tickets;  
        }
    });

    $scope.statusList = [
        {
            id:2,
            name:'Approved'
        },
        {
            id:3,
            name:'Revoked'
        }
    ];

    $scope.paymentCycleList = [
        {
            id:0,
            name: "Weekly"
        },
        {
            id: 1,
            name: "Monthly"
        },
        {
            id: 2,
            name: "Bi_Weekly"
        }
    ];

    $scope.fetchCategory = function(type,ticketType) {
        $http.get('/operations/ticket/category/',{
          params: {
                category_against:type,
                category: ticketType.name
            }
        })
        .success(function(response){
            $scope.categoryList = JSON.parse(response.data);
            $scope.categoryList = $scope.categoryList[ticketType.name].tickets;
        })
    }

    $scope.getRidersList = function(clusterID, typeTicket) {
        $scope.ridersList = '';
        if($scope.ticket.category.toLowerCase()=='salary additions' || $scope.ticket.category.toLowerCase()=='salary deductions'){
            var inactive = true;
        }
        $http.get('/operations/cluster/details/',{
            params: {
                clusters: clusterID,
                type_ticket: typeTicket,
                inactive: inactive!=undefined? inactive: false
            }
        })      
        .success(function(response){
            $scope.ridersList = response.data;       
        })
        .error(function (argument) {
            $scope.ridersList = '';
        })
    }

    $scope.submitRaiseTicket = function(type) {
        var ticket = $scope.ticket;
        if(ticket.riderName || ticket.sellerName ) {
            if(ticket.subCategory && type && ticket.ticketDetails) {
                $scope.raiseTicketLoading = true;
                if(type == 1) {
                  ticket.sellerName = null;
                }
                else if(type == 2) {
                  ticket.riderName = null;
                }
                $http.post('/operations/ticket/raise/',{
                    rider_id: ticket.riderName,
                    seller_id: ticket.sellerName,
                    category_id: ticket.subCategory,
                    type_ticket: type,
                    description: ticket.ticketDetails,
                    amount: ticket.fine,
                    payment_cycle : ticket.paymentCycle
                })
                .success(function(response){
                    $scope.raiseTicketLoading = false;
                    $scope.ticketBlock = false;
                    $scope.raiseTicketBlock = false;
                    $scope.ticketTypeBlock = false;
                    $scope.fetchTickets(1);
                    $mdToast.show();
                    $scope.initializeTicket();
                    $mdToast.show(
                      $mdToast.simple()
                      .content('Ticket raised successfully!')
                      .position($scope.getToastPosition())
                      .hideDelay(3000)
                    );
                })
                .error(function(response){
                    $scope.raiseTicketLoading = false;
                    $mdToast.show();
                    $mdToast.show(
                      $mdToast.simple()
                      .content('There is error in raising new ticket!')
                      .position($scope.getToastPosition())
                      .hideDelay(3000)
                    );
                })
            }
            else {
                $mdToast.show(
                  $mdToast.simple()
                  .content('Please fill the required fields')
                  .position($scope.getToastPosition())
                  .hideDelay(3000)
                );  
            }
        }
        else {
            $mdToast.show(
              $mdToast.simple()
              .content('Please fill the required fields')
              .position($scope.getToastPosition())
              .hideDelay(3000)
            );
        }
    }

    $scope.changeTicketStatus = function(ticket,ticketAction) {
        var status;
        if(ticketAction == 1) {
            approveStatus = 1;
            revokeStatus = null;
        }
        else if(ticketAction == 2) {
            revokeStatus = 1;
            approveStatus = null;
        }
        $scope.raiseTicketLoading = true;
        $http.put('/operations/edit-ticket/',{
            approve: approveStatus,
            revoke: revokeStatus,
            ticket_id:  ticket.id
        })
            .success(function(response){
                $scope.raiseTicketLoading = false;
                $mdToast.show(
                  $mdToast.simple()
                  .content(response["message"])
                  .position($scope.getToastPosition())
                  .hideDelay(6000)
                );  
                $scope.fetchTickets(ticket.type_ticket);
            })
            .error(function(response){
                $scope.raiseTicketLoading = false;
                $mdToast.show(
                  $mdToast.simple()
                  .content(response["message"])
                  .position($scope.getToastPosition())
                  .hideDelay(6000)
                );  
            })
        };

    $scope.revokePenalty = function(ticket) {
        $scope.raiseTicketLoading = true;
        $http.put('/operations/edit-penalty/',{
            penalty_id:  ticket.id,
            rider_id: ticket.rider_id
        })
            .success(function(response){
                $scope.raiseTicketLoading = false;
                $mdToast.show(
                  $mdToast.simple()
                  .content(response["message"])
                  .position($scope.getToastPosition())
                  .hideDelay(6000)
                );  
                $scope.fetchTickets(ticket.type_ticket);
            })
            .error(function(response){
                $scope.raiseTicketLoading = false;
                $mdToast.show(
                  $mdToast.simple()
                  .content(response["message"])
                  .position($scope.getToastPosition())
                  .hideDelay(6000)
                );  
            })
        };

    function initializeTicketType() {
      $scope.ticketType = {
          category: '',
          ticketType: '',
          fine: '',
          id: '',
          catAgst: ''
      }
    }
    initializeTicketType();

    $scope.sellerCategoryList = [
        {
            id:'3',
            name: "Others"
        }
    ];

    if($scope.role==0 || $scope.role==4 || $scope.role==1 || $scope.role == 6){
      $scope.riderCategoryList = [
        {
            id:'1',
            name: "Audit"
        },
        {
            id:'2',
            name: "Inventory"
        },
        {
            id:'3',
            name: "Payout Additions"
        },
        {
            id: '4',
            name: "Payout Deductions"
        }
      ];
    } else {
      $scope.riderCategoryList = [
        {
            id:'1',
            name: "Audit"
        },
        {
            id:'2',
            name: "Inventory"
        }
      ];
    }
    

    $scope.clickCat = function(ticketSubCat) {
      $scope.ticket.fine = ticketSubCat.fine_amount; 
    }

    $scope.createTicketType = function(type) {
        var ticketType = $scope.ticketType;
        ticketType.catAgst = type;
        $scope.ticketTypeLoading = true;
        $http.post('/operations/ticket/category/',{
            category: ticketType.category,
            description: ticketType.ticketType,
            fine_amount: ticketType.fine || 0,
            help_text: ticketType.help_text,
            category_against: ticketType.catAgst
        })
        .success(function(response){
            $scope.ticketTypeLoading = false;
            $scope.ticketTypeBlock = false;
            $scope.ticketBlock = false;
            $scope.raiseTicketBlock = false;
            initializeTicketType();
            $mdToast.show();
            $mdToast.show(
              $mdToast.simple()
              .content('Ticket type successfully created!')
              .position($scope.getToastPosition())
              .hideDelay(3000)
            );

        })
        .error(function(){
            $scope.ticketTypeLoading = false;
            $mdToast.show();
            $mdToast.show(
              $mdToast.simple()
              .content('There is error in creating new ticket type')
              .position($scope.getToastPosition())
              .hideDelay(3000)
            );
        })
    }

    $scope.editTicketType = function(type) {
        var ticketType = $scope.ticketType;
        $scope.editTicketTypeLoading = true;
        $http.put('/operations/ticket/category/',{
            category: ticketType.category,
            description: ticketType.ticketType,
            fine_amount: ticketType.fine,
            help_text: ticketType.help_text,
            category_against: type,
            id: ticketType.id
        })
        .success(function(response){
            $scope.editTicketTypeLoading = false;
            $scope.ticketTypeBlock = false;
            $scope.raiseTicketBlock = false;
            $scope.editTicketBlock = false;
            $scope.ticketBlock = false;
            initializeTicketType();
            $mdToast.show();
            $mdToast.show(
              $mdToast.simple()
              .content('Edited successfully!')
              .position($scope.getToastPosition())
              .hideDelay(3000)
            );

        })
        .error(function(){
            $scope.editTicketTypeLoading = false;
            $mdToast.show();
            $mdToast.show(
              $mdToast.simple()
              .content('There is error in editing this ticket type')
              .position($scope.getToastPosition())
              .hideDelay(3000)
            );
        })
    }

    $scope.fetchTicketInThisCategory = function(type) {
        $scope.ticketTypeLoading = true;
        var ticketType = $scope.ticketType;
        $http.get('/operations/ticket/category/',{
            params: {
                category_against: ticketType.type
            }
        })
        .success(function(response){
            $scope.ticketTypeLoading = false;
            $scope.ticketsInCategory = response.data;
        })
        .error(function(response){
            $scope.ticketTypeLoading = false;
        })
    }

    $scope.raiseTicket = function() {
        $scope.ticketBlock = true;
        $scope.raiseTicketBlock = true;
        $scope.ticketTypeBlock = false;
        $scope.editTicketBlock = false;
        $scope.categoryList = [];
    }

    $scope.ticketTypeDisplay = function() {
        $scope.ticketBlock = true;
        $scope.raiseTicketBlock = false;
        $scope.ticketTypeBlock = true;
        $scope.editTicketBlock = false;
    }

    $scope.editTicket = function(ticketType) {
        $scope.editTicketBlock = true;
        $scope.ticketTypeBlock = false;
        $scope.ticketBlock = true;
        $scope.raiseTicketBlock = false;
          $scope.ticketType = {
              category: ticketType.category,
              ticketType: ticketType.description,
              fine: ticketType.fine_amount,
              id: ticketType.id,
              catAgst: ticketType.category_against
          }
        $scope.ticketsInCategory = '';
    }

    $scope.cancel = function() {
        $scope.ticketBlock = false;
        $scope.raiseTicketBlock = false;
        $scope.ticketTypeBlock = false;
        $scope.editTicketBlock = false;
        $scope.initializeTicket();
        $scope.ticketsInCategory = '';
        $scope.fetchTickets(1);
    };

    $scope.date = {
        startDate: new Date(),
        endDate: new Date()
    };

    $scope.exportAsCsv = function(type) {
        var ticket = $scope.ticket;
        if(type == 1 || type.toString().toLowerCase() == 'rider') {
            type = 1;
            ticket.raised_against = $scope.ticket_raisedRider;
        } else if(type ==  2 || type.toString().toLowerCase() == 'seller') {
            type = 2;
            ticket.raised_against = $scope.ticket_raisedSeller;
        }
        $http.get('/operations/get-tickets-csv/', {
            params: {
                type_ticket : type,
                date_start: new Date($scope.date.startDate),
                date_end: new Date($scope.date.endDate),
                city: $scope.ticket_city.selected!=undefined ? $scope.ticket_city.selected.id:null,
                cluster_id: $scope.ticket_cluster.selected!=undefined ? $scope.ticket_cluster.selected.id:null,
                raised_against: ticket.raised_against.selected!=undefined ? ticket.raised_against.selected.id:null,
                ticket_status: $scope.ticket_ticketStatus.selected!=undefined ? $scope.ticket_ticketStatus.selected.id:null
            }
        })
        .success(function(data, status, headers, config) {
            filename = headers()['content-disposition'].split(';')[1].trim().replace("filename=","");
            var file = new Blob([data], { type: 'text/csv' });
            saveAs(file, filename);
        })
        .error(function(errordata, status, headers, config) {
            $scope.message = 'There was an error in getting your tickets. Please try again!';
        });
    }
    $scope.$on('get:tickets', function() {
        $scope.fetchTickets(1);
        $http.get('cities/info').success(function(response){
            $scope.cityList = response.cities_info;
        }).error(function(error){

        });
    });

    $scope.$on('tickets:uploaded:successfully', function() {
        $scope.fetchTickets(1);
    });

    $scope.uploadTicketsDialog = function(ev) {
        $mdDialog.show({
          controller: riderTicketController,
          templateUrl: 'riderticket',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };


})

.controller('targetsController', function ($scope, $timeout, $mdSidenav, $log, $http, $mdToast, $document, Upload, $mdDialog,clusters, commonUtility) {   

    /*variable definition for filters start*/
    $scope.intializeFilters = function() {
        $scope.target_city = {};
        $scope.target_cluster = {}; 
    }
    /*end*/
    $scope.intializeFilters();

    $scope.selected = [];
    $scope.clusters = clusters;

    $scope.cityList = [
        {
        id:'NCR',
        name: "NCR"
        },
        {
        id:'BOM',
        name: "Mumbai"
        },
        {
        id:'BLR',
        name: "Bengaluru"
        },
        {
        id:'JPR',
        name: "Jaipur"
        },
        {
        id:'PNQ',
        name: "Pune"
        },
        {
        id:'HYD',
        name: "Hyderabad"
        },
        {
        id:'MAA',
        name: "Chennai"
        },
        {
        id:'STV',
        name: "Surat"
        },
        {
        id:'NVM',
        name: "NaviMumbai"
        },
        {
        id:'AMD',
        name: "Ahmedabad"
        },
        {
        id:'IDR',
        name: "Indore"
        },
        {
        id:'CCU',
        name: "Kolkata"
        },
        {
        id:'IXC',
        name: "Chandigarh"
        }
    ];

    $scope.dateToday = new Date();
    $scope.date.startDate = new Date(new Date().setDate(new Date().getDate()-6));
    $scope.date.endDate = new Date();
    $scope.daterange = function(fromDate,toDate)
    {
        $scope.dateranges = [];
        for (var d = new Date(toDate); d >= new Date(fromDate); d.setDate(d.getDate() - 1)) 
        {   
            if(new Date(d).toDateString() != new Date().toDateString()){
              $scope.dateranges.push(new Date(d));  
            }
        }
    };

    $scope.matchDate = function (datevalue) {
        if(new Date(datevalue).toDateString() == new Date().toDateString()){
            return false;
        }
        else {
            return true;
        }
    }

    $scope.clear = function() {
        $scope.date = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        initDate: $scope.initDate,
        startingDay: 1
    };
      
    $scope.initDate = new Date();
    $scope.format = 'yyyy-MM-dd';

    $scope.clusterDetails = [];
    $scope.cityToCluster = function(city_id) {
        $scope.clusterDetails = [];
        commonUtility.cityCluster(city_id, $scope);
    };

    $scope.exportCSV = function() {
      $http.get('/operations/get-targets-csv/',{
            params: {
                date_start: new Date($scope.date.startDate),
                date_end: new Date($scope.date.endDate),
                city: $scope.target_city.selected!=undefined ? $scope.target_city.selected.id:null,
                cluster_id: $scope.target_cluster.selected!=undefined ? $scope.target_cluster.selected.id:null
            }
        })
        .success(function(data, status, headers, config) {
            filename = headers()['content-disposition'].split(';')[1].trim().replace("filename=","");
            var file = new Blob([data], { type: 'text/csv' });
            saveAs(file, filename);
        })
        .error(function(errordata, status, headers, config) {
            $scope.message = 'There was an error in getting your task history. Please try again!';
        });
    }

    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'uploadDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.getTodaysTargets = function () {
      $http.get("/operations/targets/today", {            
      })
      .success(function(response){
          $scope.targetGivenToday = response;
          angular.forEach($scope.targetList, function(value, key) {
              if(key in $scope.targetGivenToday){
                  $scope.targetList[key].targetToday = $scope.targetGivenToday[key];
              }
          });
      })
    };

    $scope.fetchTargetsAchieved = function() {
        $http.get('/operations/get-targets-day/',{
        })
            .success(function(response){
                $scope.todayTargets = response;
                angular.forEach($scope.targetList, function(value, key) {
                    if(key in $scope.todayTargets){
                        $scope.targetList[key].achieved = $scope.todayTargets[key].count;
                    } else {
                        $scope.targetList[key].achieved = 0;
                    }
                });
            })
    };

    $scope.validateDateRange = function(){
      var a = new Date($scope.date.startDate);
      var b = new Date(a.setDate(a.getDate()+7));

      if(new Date($scope.date.endDate) > b){
        alert('Date range should be max 7 days.');
        return false;
      }else{return true;}
    };

    $scope.fetchTargets = function() 
    {
        if(!$scope.validateDateRange()){return false;}

        $scope.targetsTableLoading = true;
        $http.get('/operations/get-targets/',{
            params: {
                date_start: new Date($scope.date.startDate),
                date_end: new Date($scope.date.endDate),
                city: $scope.target_city.selected!=undefined ? $scope.target_city.selected.id:null,
                cluster_id: $scope.target_cluster.selected!=undefined ? $scope.target_cluster.selected.id:null
            }
        })
        .success(function(response){
            $scope.targetsTableLoading = false;
            if(response){
              if(response && response.targets_count == 0){
                return false;
              }
              $scope.targetsTableLoading = false;
              $scope.targetList = response;
              $scope.daterange($scope.targetList.data_min_date,$scope.targetList.data_max_date);
              delete $scope.targetList['data_min_date'];
              delete $scope.targetList['data_max_date'];
              $scope.fetchTargetsAchieved();
              $scope.getTodaysTargets();  
            }
            else
            {
              alert('No targets available');
            }
        })
        .error(function(){
          $scope.targetsTableLoading = false;
          alert('There is some techincal issue occured in fetching targets data.');
        });
    }
    $scope.$on('get:targets',function(){
      $scope.fetchTargets();
    });
})

.controller('viewIncentiveController', function($scope,$http, $mdDialog, clusters, Upload, role, commonUtility){// Pagination defaults.
    
    $scope.pagination = {
        maxWindowSize: 10,
        itemsPerPage: 25,
        currentPage: 1
    };

    $scope.role = role;
    $scope.selected = [];
    $scope.clusters = clusters;

    $scope.maxDate = new Date(new Date().setMonth(new Date().getMonth()+1));
    $scope.minDate = new Date(new Date().setMonth(new Date().getMonth()-1));

    /*variable definition for filters start*/
    $scope.intializeFilters = function() {
        $scope.incentive_city = {};
        $scope.incentive_cluster = {}; 
        $scope.incentive_ridername = {};
        $scope.incentive_incentive_detail = {};
    }
    /*end*/

    $scope.intializeFilters();

    $scope.viewIncentive = function(tab) {
        $scope.viewIncentiveBlock = !($scope.viewIncentiveBlock);
        $scope.approveIncentiveBlock = !($scope.approveIncentiveBlock);
        if(tab == "view") {
            $scope.riderIncen();
        }
        else if(tab == "approve") {
            $scope.fetchIncentives();
        }
    }
    $scope.createIncentiveDialog = function(ev) {
        $mdDialog.show({
          controller: createIncentiveController,
          templateUrl: 'createincentive',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
          $scope.fetchIncentives();
          $scope.getIncentive();
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.duplicateIncentiveDialog = function(ev, incentive) {
        $mdDialog.show({
          locals:{incentive: incentive}, 
          controller: duplicateIncentiveController,
          templateUrl: 'duplicateincentive',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
          $scope.fetchIncentives();
          $scope.getIncentive();
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.approveIncentiveDialog = function(ev, incentive) {
        $mdDialog.show({
          locals:{incentive: incentive}, 
          controller: approveIncentiveController,
          templateUrl: 'approveincentive',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
          $scope.getIncentive();
          $scope.fetchIncentives();
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.editIncentiveDialog = function(ev, incentive) {
        $mdDialog.show({
          locals:{incentive: incentive}, 
          controller: editIncentiveController,
          templateUrl: 'editincentive',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
          $scope.getIncentive();
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.riderIncen = function() {
        $scope.incentiveTableLoading = true;
        $http.get('/operations/riders/incentives/',{
            params: {
                start_date:  new Date($scope.date.startDate),
                end_date: new Date($scope.date.endDate),
                city: $scope.incentive_city.selected!=undefined ? $scope.incentive_city.selected.id:null,
                cluster_id: $scope.incentive_cluster.selected!=undefined ? $scope.incentive_cluster.selected.id:null,
                rider_id: $scope.incentive_ridername.selected!=undefined ? $scope.incentive_ridername.selected.id:null,
                incentive: $scope.incentive_incentive_detail.selected!=undefined ? $scope.incentive_incentive_detail.selected.name:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage  
            }
        })
        .success(function(response){
            $scope.incentiveTableLoading = false;
            $scope.riderIncentives = response.data;
            $scope.pagination.totalItems = response.count;
        })
        .error(function(response){
            $scope.incentiveTableLoading = false;
        })
    };

    $scope.fetchIncentives = function() {
        $scope.incentiveTableLoading = true;
        $http.get('/operations/incentives/', {
            params: {
                start_date:  new Date($scope.date.startDate),
                end_date: new Date($scope.date.endDate),
                incentive: $scope.incentive_incentive_detail.selected!=undefined ? $scope.incentive_incentive_detail.selected.name:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage  
            }
        })
        .success(function(response){
            $scope.incentiveTableLoading = false;
            $scope.incentives = response.data;
            $scope.viewIncentiveBlock = false;
            $scope.pagination.totalItems = response.count;
        })
        .error(function(response){
            $scope.incentiveTableLoading = false;
        })
    }

    $scope.getIncentive = function() {
        $http.get('/operations/incentives/list/',{

        })
        .success(function(response){
            $scope.incentiveList = response.data;
        })
        .error(function(response){  

        })
    }

    $scope.$on('get:riderIncentive', function() {
        $scope.approveIncentiveBlock = true;
        $scope.getIncentive();
        $scope.fetchIncentives();
    });

    $scope.exportCSV = function() {
      $scope.exportFileLoading = true;
      $http.get('/operations/riders-incentives/csv/',{
        params: {
            start_date:  new Date($scope.date.startDate),
            end_date: new Date($scope.date.endDate),
            city: $scope.incentive_city.selected!=undefined ? $scope.incentive_city.selected.id:null,
            cluster_id: $scope.incentive_cluster.selected!=undefined ? $scope.incentive_cluster.selected.id:null,
            rider_id: $scope.incentive_ridername.selected!=undefined ? $scope.incentive_ridername.selected.id:null,
            incentive: $scope.incentive_incentive_detail.selected!=undefined ? $scope.incentive_incentive_detail.selected.name:null
        }
    })
      .success(function(data, status, headers, config) {
          $scope.exportFileLoading = false;
          filename = headers()['content-disposition'].split(';')[1].trim().replace("filename=","");

          var file = new Blob([data], { type: 'text/csv' });
          saveAs(file, filename);
      })
      .error(function(errordata, status, headers, config) {
          $scope.exportFileLoading = false;
          $scope.message = 'There was an error in getting your task history. Please try again!';
      });
    }

    $scope.cityList = [
        {
        id:'NCR',
        name: "NCR"
        },
        {
        id:'BOM',
        name: "Mumbai"
        },
        {
        id:'BLR',
        name: "Bengaluru"
        },
        {
        id:'NVM',
        name: "NaviMumbai"
        },
        {
        id:'AMD',
        name: "Ahmedabad"
        },
        {
        id:'IDR',
        name: "Indore"
        },
        {
        id:'CCU',
        name: "Kolkata"
        },
        {
        id:'IXC',
        name: "Chandigarh"
        }
    ];

    $scope.clusterDetails = [];
    $scope.cityToCluster = function(city_id) {
        $scope.clusterDetails = [];
        commonUtility.cityCluster(city_id, $scope);
    };

    $scope.ridersList = [];
    $scope.clusterToRider = function(cluster_id) {
        $scope.ridersList = [];
        commonUtility.clusterRider(cluster_id, $scope);
    };
})

.controller('phoneBillController', function($scope, $http, $mdDialog, commonUtility){

    // Pagination defaults.
    $scope.pagination = {
        maxWindowSize: 10,
        itemsPerPage: 25,
        currentPage: 1
    };

    /*variable definition for filters start*/
    $scope.intializeFilters = function() {
        $scope.phonebill_city = {};
        $scope.phonebill_cluster = {}; 
        $scope.phonebill_ridername = {};
        $scope.phonebill_riderid = {};
        $scope.phonebill_riderphone = {};
    }
    /*end*/

    $scope.intializeFilters();

    $scope.getPhoneBills = function() {
        $scope.phoneBillLoading = true;
        $http.get('/operations/riders/phonebills/',{
            params: {
                month: $scope.month,
                city: $scope.phonebill_city.selected!=undefined ? $scope.phonebill_city.selected.id:null,
                cluster: $scope.phonebill_cluster.selected!=undefined ? $scope.phonebill_cluster.selected.id:null,
                rider_name: $scope.phonebill_ridername.selected!=undefined ? $scope.phonebill_ridername.selected.id:null,
                rider_id: $scope.phonebill_riderid.selected!=undefined ? $scope.phonebill_riderid.selected.id:null,
                phone: $scope.phonebill_riderphone.selected!=undefined ? $scope.phonebill_riderphone.selected.phone_number:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage             
            }
        })
        .success(function(response){
            $scope.phoneBillLoading = false;
            $scope.phoneBills = response.data;
            $scope.pagination.totalItems = response.count;
        })
        .error(function(response){
            $scope.phoneBillLoading = false;
        })
    }

    $scope.$on('get:phonebill', function() {
        $scope.getPhoneBills();
    });

    $scope.cityList = [
        {
        id:'NCR',
        name: "NCR"
        },
        {
        id:'BOM',
        name: "Mumbai"
        },
        {
        id:'BLR',
        name: "Bengaluru"
        },
        {
        id:'JPR',
        name: "Jaipur"
        },
        {
        id:'PNQ',
        name: "Pune"
        },
        {
        id:'HYD',
        name: "Hyderabad"
        },
        {
        id:'MAA',
        name: "Chennai"
        },
        {
        id:'STV',
        name: "Surat"
        },
        {
        id:'NVM',
        name: "NaviMumbai"
        },
        {
        id:'AMD',
        name: "Ahmedabad"
        },
        {
        id:'IDR',
        name: "Indore"
        },
        {
        id:'CCU',
        name: "Kolkata"
        },
        {
        id:'IXC',
        name: "Chandigarh"
        }
    ];

    $scope.clusterDetails = [];
    $scope.cityToCluster = function(city_id) {
        $scope.clusterDetails = [];
        commonUtility.cityCluster(city_id, $scope);
    };

    $scope.ridersList = [];
    $scope.clusterToRider = function(cluster_id) {
        $scope.ridersList = [];
        commonUtility.clusterRider(cluster_id, $scope);
    };

    $scope.openUploadBox = function(ev) {
        $mdDialog.show({
          controller: uploadPhoneBillController,
          templateUrl: 'uploadphonebills',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    // for single monthpicker
    $scope.maxDate = new Date();

    $scope.clear = function () {
                        $scope.dt = null;
                    };

    $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                  };  

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1,
        'datepicker-mode':"'month'",
        'min-mode':"month"   
    };

      
    $scope.initDate = new Date();
    $scope.format = 'yyyy-MM';

    $scope.exportAsCsv = function() {
      $scope.exportFileLoading = true;
      $http.get('/operations/riders/phonebills/export/', {
        params: {
            month: $scope.month,
            city: $scope.phonebill_city.selected!=undefined ? $scope.phonebill_city.selected.id:null,
            cluster: $scope.phonebill_cluster.selected!=undefined ? $scope.phonebill_cluster.selected.id:null,
            rider_name: $scope.phonebill_ridername.selected!=undefined ? $scope.phonebill_ridername.selected.id:null,
            rider_id: $scope.phonebill_riderid.selected!=undefined ? $scope.phonebill_riderid.selected.id:null,
            phone: $scope.phonebill_riderphone.selected!=undefined ? $scope.phonebill_riderphone.selected.phone_number:null
        }
      })
      .success(function(data, status, headers, config) {
        $scope.exportFileLoading = false;
        filename = headers()['content-disposition'].split(';')[1].trim().replace("filename=","");

        var file = new Blob([data], { type: 'text/csv' });
        saveAs(file, filename);
      })
      .error(function(errordata, status, headers, config) {
        $scope.exportFileLoading = false;
        console.log(errordata);
        $scope.message = 'There was an error in getting your task history. Please try again!';
      });
    }
})

.controller('attendanceController', function($q, $scope, $http, $filter, $mdDialog, commonUtility, setterGetterService){
    // Pagination defaults.
    $scope.pagination = {
        maxWindowSize: 10,
        itemsPerPage: 25,
        currentPage: 1
    };

    $scope.maxDate = new Date();
    $scope.minDate = new Date(new Date().setMonth(new Date().getMonth()-2));

    $scope.date = {
        startDate: new Date(),
        endDate: new Date()
    };

    $scope.cityList = [];

    $http.get('cities/info/').success(function(response){
        $scope.cityList = response.cities_info;
    }).error(function(error){
        console.error(error);
    });

    $scope.clusterDetails = [];
    $scope.cityToCluster = function(city_id) {
        $scope.clusterDetails = [];
        commonUtility.cityCluster(city_id, $scope);
    };

    $scope.ridersList = [];
    $scope.clusterToRider = function(cluster_id) {
        $scope.ridersList = [];
        commonUtility.clusterRider(cluster_id, $scope);
    };

    /* variable definition for filter */ 
    $scope.intializeFilters = function() {
        $scope.attendance_city = {};
        $scope.attendance_cluster = {}; 
        $scope.attendance_ridername = null;
        $scope.attendance_riderid = null;
        $scope.attendance_rider_contact = null;
    }

    $scope.intializeFilters();
        
    $scope.timeranges = [];
    commonUtility.createtimeRange('08:00','23:59','30m',$scope.timeranges);
    commonUtility.createtimeRange('00:00','02:00','30m',$scope.timeranges);

    $scope.attendanceStatus = {
        "-1": "Not Marked",
        0: "Present",
        1: "Leave with Approval",
        2: "Leave without Approval",
        5: "Weekly Off",
        6: "Revoked LWOA",
        7: "Present without Basic Pay",
        8: "Long Leave",
        9: "Order upload awaited",
        10: "Not Reported"
    };
                          
    function assignUpdateEditStatus (riders) {
        angular.forEach(riders, function(value, key) {
            var actual_intime = $filter('date')(value.actual_intime, "HH mm" , "+0530");
            if (actual_intime != '05 30' || value.status != -1) {
                riders[key].editStatus = true;
            } else {
                riders[key].editStatus = false;
            }
            if (value.status == 0 && actual_intime != '05 30') {
                var actual_outtime = $filter('date')(value.actual_outtime, "HH mm", "+0530");
                if (actual_outtime != '05 30') {
                    riders[key].updateOutTimeStatus = false;
                    riders[key].editOutTimeStatus = true;
                    riders[key].overtime = $scope.calculateOvertime(riders[key]);
                } else {
                    riders[key].updateOutTimeStatus = true;
                    riders[key].editOutTimeStatus = false;
                }
            } else {
                riders[key].updateOutTimeStatus = false;
                riders[key].editOutTimeStatus = false;
            }
            var dt = new Date(value.expected_intime);
            value.expected_intime = dt.toLocaleTimeString().replace(/:\d+ /, ' ');

            dt = new Date(value.expected_outtime);
            value.expected_outtime = dt.toLocaleTimeString().replace(/:\d+ /, ' ');

            dt = new Date(value.actual_intime);
            value.actual_intime = dt.toLocaleTimeString().replace(/:\d+ /, ' ');

            dt = new Date(value.actual_outtime);
            value.actual_outtime = dt.toLocaleTimeString().replace(/:\d+ /, ' ');

            
        });
        return riders;
    }

    $scope.getAttendance = function() {
        $scope.attendanceLoading = true;
        $http.get('/operations/riders/attendance/',{
            params: {
                start_date: new Date($scope.date.startDate),
                end_date: new Date($scope.date.endDate),
                city: $scope.attendance_city.selected!=undefined ? $scope.attendance_city.selected.id:null,
                cluster_id: $scope.attendance_cluster.selected!=undefined ? $scope.attendance_cluster.selected.id:null,
                rider_name: $scope.attendance_ridername || null,
                rider_id: $scope.attendance_riderid || null,
                rider_phone : $scope.attendance_riderphone || null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage
            }
        })
        .success(function(response){
            $scope.attendanceLoading = false;
            var Sno = ($scope.pagination.currentPage * 25) - 25;
            response.data = assignUpdateEditStatus(response.data);
            $scope.attendanceDetails = response.data; 
            $scope.pagination.totalItems = response.count;
            angular.forEach($scope.attendanceDetails, function(value, key){
              value.editAttendance = false;
              value.o_status = value.r_status;

              value.assignableStatuses = {
                    "-1": "Not Marked",
                    0: "Present",
                    1: "Leave with Approval",
                    2: "Leave without Approval",
                    5: "Weekly Off",
                    7: "Present without Basic Pay",
                    8: "Long Leave",
                    9: "Order upload awaited",
                    10: "Not Reported"
              };

              if (value.r_status === 2) {
                if (value.payout_published) {
                    value.assignableStatuses = {
                        0: "Present",
                        2: "Leave without Approval",
                        6: "Revoked LWOA",
                        9: "Order upload awaited"
                    };
                } else {
                    value.assignableStatuses = {
                        "-1": "Not Marked",
                        0: "Present",
                        1: "Leave with Approval",
                        2: "Leave without Approval",
                        5: "Weekly Off",
                        9: "Order upload awaited"
                    };
                }
              }              

              if(value.kilometer!=0 && value.order_count!=0) {
                value.kmPerOrder = (value.kilometer / value.order_count);
              }
              else {
                value.kmPerOrder = 0;
              }
              value.sno = Sno + 1;
              Sno = Sno + 1;
            })
        })
        .error(function(response){
            $scope.attendanceLoading = false;
        })
    }

    $scope.$on('get:attendance', function() {
        $scope.getAttendance();
    });

    $scope.editAttendanceDetails = function(attendance) {
        if (attendance.r_status !== 6) {
            attendance.editAttendance = !attendance.editAttendance;
        } else {
            commonUtility.displayErrorMsg('Revoked LWOA cannot be edited');
        }
    }

    /* checking out time is less than in time  ***/

    $scope.outTimeValidation=function(attendance){

        var date=new Date();
        var outTime=new Date(attendance.attendancedate+" "+attendance.actual_outtime );
        if(outTime.getHours() >= '0' && outTime.getHours() <= '2'){
            outTime.setDate(outTime.getDate()+1);
        }
        var inTime=null;
        angular.forEach($scope.attendanceDetails, function(value, key) {
            if(value.rider_id == attendance.rider_id){
                inTime=new Date(attendance.attendancedate +" "+value.actual_intime);
                if(inTime > outTime){
                    commonUtility.displayErrorMsg('Actual Out-time can not be less than actual in-time!')
                    $scope.attendanceDetails[key].disabled=true;
                }else{
                    $scope.attendanceDetails[key].disabled=false;
                }
            }
        });
        
    }

    $scope.showRiderDemandCsvUploadDialog = function(ev) {
        $mdDialog.show({
          controller: RiderDemandCsvController,
          templateUrl: 'RiderDemandCsv',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
           $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
           $scope.status = 'You cancelled the dialog.';
           if(setterGetterService.getShouldLoad()!=undefined){
                if(setterGetterService.getShouldLoad()==true){
                    setterGetterService.setShouldLoad(undefined);
                }
            }
      });
    };

    $scope.inTimeValidation=function(attendance){
        if(attendance.actual_outtime != "5:30 AM"){
            var date=new Date();
            var outTime=new Date(attendance.attendancedate+" "+attendance.actual_outtime );
            if(outTime.getHours() >= '0' && outTime.getHours() <= '2'){
                outTime.setDate(outTime.getDate()+1);
            }
            var inTime=null;
            angular.forEach($scope.attendanceDetails, function(value, key) {
                if(value.rider_id == attendance.rider_id){
                    inTime=new Date(attendance.attendancedate +" "+value.actual_intime);
                    if(inTime > outTime){
                        commonUtility.displayErrorMsg('Actual In-time can not be more than actual out-time!')
                        $scope.attendanceDetails[key].disabled=true;
                    }else{
                        $scope.attendanceDetails[key].disabled=false;
                    }
                }
            });
        }
    }
    $scope.expectedInTimeValidation=function(attendance){
        if(attendance.expected_outtime != "5:30 AM"){
            var date=new Date();
            var outTime=new Date(attendance.attendancedate+" "+attendance.expected_outtime );
            if(outTime.getHours() >= '0' && outTime.getHours() <= '2'){
                outTime.setDate(outTime.getDate()+1);
            }
            var inTime=null;
            angular.forEach($scope.attendanceDetails, function(value, key) {
                if(value.rider_id == attendance.rider_id){
                    inTime=new Date(attendance.attendancedate +" "+value.expected_intime);
                    if(inTime > outTime){
                        commonUtility.displayErrorMsg('Scheduled In-time can not be more than scheduled out-time!')
                        $scope.attendanceDetails[key].disabled=true;
                    }else{
                        $scope.attendanceDetails[key].disabled=false;
                    }
                }
            });
        }
    }
    $scope.expectedOutTimeValidation=function(attendance){
        var date=new Date();
        var outTime=new Date(attendance.attendancedate+" "+attendance.expected_outtime );
        if(outTime.getHours() >= '0' && outTime.getHours() <= '2'){
            outTime.setDate(outTime.getDate()+1);
        }
        var inTime=null;
        angular.forEach($scope.attendanceDetails, function(value, key) {
            if(value.rider_id == attendance.rider_id){
                inTime=new Date(attendance.attendancedate +" "+value.expected_intime);
                if(inTime > outTime){
                    commonUtility.displayErrorMsg('Scheduled Out-time can not be less than Scheduled in-time!')
                    $scope.attendanceDetails[key].disabled=true;
                }else{
                    $scope.attendanceDetails[key].disabled=false;
                }
            }
        });
    }

    function confirmAttendanceUpdate(attendance) {
      var confirm = $mdDialog.confirm()
            .title('Are you sure, you wish to update this attendance?')
            .content('LWOA status of this attendance was used to de-activate this rider.')
            .ok('Confirm')
            .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
          submitEditedAttendance(attendance);
      }, function() {
        $scope.status = 'You cancelled the update';
      });
    }

    $scope.submitAttendanceDetails = function(attendance) {

        if (attendance.remarks && attendance.remarks === "lwoa-inactivation" && attendance.rider_status === "Inactive") {
            confirmAttendanceUpdate(attendance);
        } else {
            submitEditedAttendance(attendance);
        }
    }

    submitEditedAttendance = function(attendance){
        $scope.attendanceLoading = true;

        var allow_edit = true;

        if (attendance.payout_published) {
            if (attendance.o_status === 2 && ["2","6"].indexOf(attendance.r_status) < 0) {
                allow_edit = false;
                commonUtility.displayErrorMsg('Cannot change LWOA to ' + $scope.attendanceStatus[attendance.r_status] + ' after payouts are published');
            }
        }

        if (allow_edit) {
            $http.post('/operations/riders/attendance/edit/',{
                attendance_id: attendance.id,
                kilometer: attendance.kilometer,
                expected_intime: attendance.expected_intime,
                expected_outtime: attendance.expected_outtime,
                actual_intime: attendance.actual_intime,
                actual_outtime: attendance.actual_outtime,
                a_status: attendance.r_status,
                order_count: attendance.order_count
            })
            .success(function(response){
                $scope.editAttendance = false;
                attendance.editAttendance = false;
                $scope.attendanceLoading = false;
                commonUtility.displayErrorMsg('Attendance Updated successfully');
            })
            .error(function(response){
                $scope.attendanceLoading = false;
                commonUtility.displayErrorMsg(response.message);
            })
        } else {
            $scope.attendanceLoading = false;
        }
    }

    $scope.exportAsCsv = function() {
      $scope.exportAttendanceLoading = true;
      $http.get('/operations/riders/attendance/export/', {
        params: {
            start_date: new Date($scope.date.startDate),
            end_date: new Date($scope.date.endDate),
            city: $scope.attendance_city.selected!=undefined ? $scope.attendance_city.selected.id:null,
            cluster_id: $scope.attendance_cluster.selected!=undefined ? $scope.attendance_cluster.selected.id:null,
            rider_name: $scope.attendance_ridername || null,
            rider_id: $scope.attendance_riderid || null
        }
      })
      .success(function(data, status, headers, config) {
          filename = headers()['content-disposition'].split(';')[1].trim().replace("filename=","");
          var file = new Blob([data], { type: 'text/csv' });
          saveAs(file, filename);
          $scope.exportAttendanceLoading = false;
      })
      .error(function(errordata, status, headers, config) {
          console.log(errordata);
          $scope.exportAttendanceLoading = false;
          $scope.message = 'There was an error in getting your attendance history. Please try again!';
      });
    }  
})

.controller('riderPayoutController', function($scope, $http, $mdDialog, commonUtility, $mdToast,setterGetterService) {

    // Pagination defaults.
    $scope.pagination = {
        maxWindowSize: 10,
        itemsPerPage: 25,
        currentPage: 1
    };
    /* variable definition for filter */ 
    $scope.intializeFilters = function() {
        $scope.payout_city = {};
        $scope.payout_cluster = {}; 
        $scope.payout_salary_status = {};
        $scope.payout_ridername = null;
        $scope.payout_riderid = null;
    }
    $scope.intializeFilters();

    $scope.viewDailyPayout=true;
    $scope.viewKMPayout = false;

    $scope.viewSalaryAdjustment = false;
    var date = new Date();
    if (date.getDate() <= 7 || (date.getDate() > 15 && date.getDate() < 23)){
        $scope.viewSalaryAdjustment = true;
    }

    $scope.getKmPayouts = function() {
        $scope.monthlyPayoutLoading = true;
        $http.get('/operations/riders/km-payouts/',{
            params:{
                start_date: $scope.startDate,
                end_date: $scope.endDate,
                city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.id:null,
                cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
                rider_name: $scope.payout_ridername || null,
                rider_id: $scope.payout_riderid || null,
                status: $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage      
            }
        })
        .success(function(response){
            $scope.kmPayouts = response.data;
            $scope.monthlyPayoutLoading = false;
            $scope.pagination.totalItems = response.count;
        })
        .error(function(response){
            $scope.monthlyPayoutLoading = false;
        })
    }

    /*------------------Do not remove this peice of code. To be used in future--------------------------------------*/

    $scope.changeKmPayStatus = function(ev, status) {
      if($scope.selectAllKmPayout) {
        $scope.confirmKMPayment(ev, status);
      } else{
        $scope.selectedPayouts = [];
        $scope.ids = [];
        var update_payout=true;
        for(var count in $scope.kmPayouts)
        {
          if($scope.kmPayouts[count].ischecked == true){
            $scope.selectedPayouts.push({
              id: $scope.kmPayouts[count].id,
              status: $scope.kmPayouts[count].status
            });
          }
        }
        var i = 1;
        var payoutStatus = $scope.selectedPayouts[0].status
        for(i in $scope.selectedPayouts) {
          
          if(payoutStatus == $scope.selectedPayouts[i].status) {
            $scope.ids.push($scope.selectedPayouts[i].id)
          }
          else{
            update_payout=false;
            break;
          }
        }
        if(update_payout==true) {
          if ($scope.ids.length<1){
            commonUtility.displayErrorMsg('Please select atleast one payout to update');
            return;
          } else {
            $http.post('/operations/riders/km-payouts/change/',{
                km_payouts: $scope.ids,
                status: status
            })
            .success(function(response){
                $scope.getKmPayouts();
                commonUtility.displayErrorMsg('Payouts status changed successfully');
            })
            .error(function(response){
              commonUtility.displayErrorMsg('There was an error updating payouts - '+ response.message);
            })
          }
        } else {
          commonUtility.displayErrorMsg('Please select payouts with same status only');
        }
      }
    }

    $scope.changeSalaryPayStatus = function(ev, status) {
        if($scope.selectAllSalaryPayouts == true){
          $scope.confirmSalaryPayment(ev, status)
        } else {
          $scope.selectedPayouts = [];
          $scope.ids = [];
          var update_payout=true;
          for(var count in $scope.salaryPayouts)
          {
            if($scope.salaryPayouts[count].isCheckedSalary == true){
              $scope.selectedPayouts.push({
                id: $scope.salaryPayouts[count].id,
                status: $scope.salaryPayouts[count].status
              });
            }
          }
          var i = 1;
          var payoutStatus = $scope.selectedPayouts[0].status
          for(i in $scope.selectedPayouts) {
            
            if(payoutStatus == $scope.selectedPayouts[i].status) {
              $scope.ids.push($scope.selectedPayouts[i].id)
            }
            else{
              update_payout=false;
              break;
            }
          }
          if(update_payout==true) {
            if ($scope.ids.length<1){
              commonUtility.displayErrorMsg('Please select atleast one payout to update');
              return;
            } else {
              $http.post('/operations/riders/salary-payouts/change/',{
                  payout_ids: $scope.ids,
                  status: status
              })
              .success(function(response){
                  $scope.fetchSalaryPayouts();
                  commonUtility.displayErrorMsg('Payouts status changed successfully');
              })
              .error(function(response){
                commonUtility.displayErrorMsg('There was an error updating payouts - '+ response.message);
              })
          }
          } else {
            commonUtility.displayErrorMsg('Please select payouts with same status only');
          }
        }
    }

    $scope.changeDailyPayStatus = function(ev, status) {
      if($scope.selectAllDailyPayouts){
        $scope.confirmDailyPayment(ev, status);
      } else {
        $scope.selectedPayouts = [];
        $scope.ids = [];
        var update_payout=true;
        for(var count in $scope.dailyPayouts)
        {
          if($scope.dailyPayouts[count].isCheckedDaily == true){
            $scope.selectedPayouts.push({
              id: $scope.dailyPayouts[count].id,
              status: $scope.dailyPayouts[count].status
            });
          }
        }
        var i = 1;
        var payoutStatus = $scope.selectedPayouts[0].status
        for(i in $scope.selectedPayouts) {
          
          if(payoutStatus == $scope.selectedPayouts[i].status) {
            $scope.ids.push($scope.selectedPayouts[i].id)
          }
          else{
            update_payout=false;
            break;
          }
        }
        if(update_payout==true) {
          if ($scope.ids.length<1){
            commonUtility.displayErrorMsg('Please select atleast one payout to update');
            return;
          } else {
            $http.put('/operations/riders/daily-payouts/status/',{
                payout_id: $scope.ids,
                status: status
            })
            .success(function(response){
                $scope.fetchDailyPayouts();
                commonUtility.displayErrorMsg('Payouts status changed successfully');
            })
            .error(function(response){
              commonUtility.displayErrorMsg('There was an error updating payouts - '+ response.message);
            })
          }
          } else {
          commonUtility.displayErrorMsg('Please select payouts with same status only');
        }
      }true
    }

    $scope.publishNotificationToApp = function(ev) {
      if($scope.selectAllDailyPayouts){
          $scope.confirmPublishAll(ev);
      } 
      else {
          $scope.selectedPayouts = [];
          $scope.ids = [];
          var update_payout=true;
          for(var count in $scope.dailyPayouts)
          {
            if($scope.dailyPayouts[count].isCheckedDaily == true){
              $scope.selectedPayouts.push($scope.dailyPayouts[count].id);
            }
          }
          if ($scope.selectedPayouts.length<1){
            commonUtility.displayErrorMsg('Please select atleast one payout to update');
            return;
          } else {
            $http.put('/operations/riders/daily-payouts/notification/',{
                payout_id: $scope.selectedPayouts,
                status: status
            })
            .success(function(response){
                $scope.fetchDailyPayouts();
                commonUtility.displayErrorMsg('Payouts published successfully');
            })
            .error(function(response){
              commonUtility.displayErrorMsg('There was an error publishing payouts - '+ response.message);
            })
          }
        }
    }

    $scope.confirmDailyPayment = function(ev, status) {
    // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
            .title('Are you sure, you wish to approve all payments?')
            .content('Your action would approve all rider payments.')
            .ariaLabel('Confirm Payment Approval')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        $scope.changeDailyPaymentStatus(status);
      }, function() {
        $scope.status = 'You cancelled the action';
      });
    };

    $scope.confirmPublishAll = function(ev, status) {
    // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
            .title('Are you sure, you wish to publish all payments?')
            .content('Your action would publish all rider payments.')
            .ariaLabel('Confirm Publish Approval')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        $scope.publishAllNotifications();
      }, function() {
        $scope.status = 'You cancelled the action';
      });
    };

    $scope.publishAllNotifications = function() {
      $http.put('/operations/riders/daily-payouts/notification/',{
          start_date: new Date($scope.date.startDate),
          end_date: new Date($scope.date.endDate),
          city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.id:null,
          cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
          rider_name: $scope.payout_ridername || null,
          rider_id: $scope.payout_riderid || null,
          payout_status : $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null
      })
      .success(function(response){
          $scope.fetchDailyPayouts();;
          commonUtility.displayErrorMsg('Payouts published successfully');
          $scope.selectAllDailyPayouts = false;
      })
      .error(function(response){
        commonUtility.displayErrorMsg('There was an error publishing payouts - '+ response.message);
      })
    };


    $scope.confirmSalaryPayment = function(ev, status) {
    // Appending dialog to document.body to cover sidenav in docs app
      var paymentStatus;
      if(status==1){
        paymentStatus = 'Approve'
      } else if(status==3){
        paymentStatus = 'Hold'
      } else if(status==2){
        paymentStatus = 'Transfer'
      }
      var confirm = $mdDialog.confirm()
            .title('Are you sure, you wish to '+ paymentStatus +' all salary payments?')
            .content('Your action would '+ paymentStatus +' all salary payments.')
            .ariaLabel('Confirm Payment Approval')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
          $scope.changeSalaryPaymentStatus(status);
      }, function() {
        $scope.status = 'You cancelled the action';
      });
    };

    $scope.confirmKMPayment = function(ev, status) {
    // Appending dialog to document.body to cover sidenav in docs app
      var paymentStatus;
      if(status==1){
        paymentStatus = 'Approve'
      } else if(status==3){
        paymentStatus = 'Hold'
      } else if(status==2){
        paymentStatus = 'Transfer'
      }
      var confirm = $mdDialog.confirm()
            .title('Are you sure, you wish to '+ paymentStatus +' all KM payments?')
            .content('Your action would '+ paymentStatus +' all KM payments.')
            .ariaLabel('Confirm Payment Approval')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');
      $mdDialog.show(confirm).then(function() {
        $scope.changeKmPaymentStatus(status);
      }, function() {
        $scope.status = 'You cancelled the action';
      });
    };

    $scope.changeDailyPaymentStatus = function(status){
      $http.put('/operations/riders/daily-payouts/status/',{
          start_date: new Date($scope.date.startDate),
          end_date: new Date($scope.date.endDate),
          city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.id:null,
          cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
          rider_name: $scope.payout_ridername || null,
          rider_id: $scope.payout_riderid || null,
          payout_status : $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null,
          status: status
      })
      .success(function(response){
          $scope.fetchDailyPayouts();
          $scope.selectAllDailyPayouts = false;
          commonUtility.displayErrorMsg('Payouts status changed successfully');
      })
      .error(function(response){
        commonUtility.displayErrorMsg('There was an error updating payouts - '+ response.message);
      })
    };

    $scope.changeSalaryPaymentStatus = function(status){
      $http.post('/operations/riders/salary-payouts/change/',{
          month: $scope.payout_month,
          city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.id:null,
          cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
          rider_name: $scope.payout_ridername || null,
          rider_id: $scope.payout_riderid || null,
          doj : $scope.payout_doj,
          payout_status : $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null,
          status : status 
      })
      .success(function(response){
          $scope.fetchSalaryPayouts();
          $scope.selectAllSalaryPayouts = false;
          commonUtility.displayErrorMsg('Payouts status changed successfully');
      })
      .error(function(response){
        commonUtility.displayErrorMsg('There was an error updating payouts - '+ response.message);
      })
    };

    $scope.changeKmPaymentStatus = function(status){
      $http.post('/operations/riders/km-payouts/change/',{
          start_date: $scope.startDate,
          end_date: $scope.endDate,
          city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.id:null,
          cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
          rider_name: $scope.payout_ridername || null,
          rider_id: $scope.payout_riderid || null,
          payout_status: $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null,
          status: status    
      })
      .success(function(response){
          $scope.getKmPayouts();
          $scope.selectAllKmPayout = false;
          commonUtility.displayErrorMsg('Payouts status changed successfully');
      })
      .error(function(response){
        commonUtility.displayErrorMsg('There was an error updating payouts - '+ response.message);
      })
    };

    $scope.$on('get:riderpayouts', function() {
        $scope.fetchDailyPayouts();
        $scope.selectAllKmPayout = false; 
        $scope.selectAllSalaryPayouts = false;
        $scope.selectAllDailyPayouts = false;
        $scope.selectAll();
        $scope.selectAllSalaryPayout();
        $scope.selectAllDailyPayout();
    });

    $scope.$on('approvePayout:success', function() {
        $scope.fetchDailyPayouts();
    });

    $scope.kmPayoutDialog = function(ev, rider) {
        $mdDialog.show({
          locals:{rider: rider}, 
          controller: kmPayoutController,
          templateUrl: 'kmpayout',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.salaryPayoutDialog = function(ev, rider) {
        $mdDialog.show({
          locals:{rider: rider}, 
          controller: salaryPayoutController,
          templateUrl: 'salarypayout',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.biWeekSalaryPayoutDialog = function(ev, rider) {
        $mdDialog.show({
          locals:{rider: rider}, 
          controller: biWeekSalaryPayoutController,
          templateUrl: 'biweeksalarypayout',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.dailyPayoutDialog = function(ev, rider) {
        $mdDialog.show({ 
          locals: {
            rider: rider
          },
          controller: dailyPayoutController,
          templateUrl: 'dailypayout',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.showCsvUploadDialog = function(ev, status, flag) {
        $mdDialog.show({
          locals:{
            payout: status,
            flag: flag
          },
          controller: KmPayoutCsvController,
          templateUrl: 'KMPayoutCsv',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
           $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
           $scope.status = 'You cancelled the dialog.';
           if(setterGetterService.getShouldLoad()!=undefined){
                if(setterGetterService.getShouldLoad()==true){
                    $scope.getKmPayouts();
                    setterGetterService.setShouldLoad(undefined);
                }
            }
      });
    };

    $scope.showSalaryAdjustmentDialog = function(ev) {
        $mdDialog.show({
          locals: {
            last_month: $scope.last_month
          },
          controller: SalaryAdjustmentsController,
          templateUrl: 'addsalaryadjustments',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
           $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
           $scope.status = 'You cancelled the dialog.';
           if(setterGetterService.getShouldLoad()!=undefined){
                if(setterGetterService.getShouldLoad()==true){
                    $scope.getKmPayouts();
                    setterGetterService.setShouldLoad(undefined);
                }
            }
      });
    };

    $scope.showDailyPayoutsCronDialog = function(ev) {
        $mdDialog.show({
          controller: DailyPayoutsCronController,
          templateUrl: 'daily-payouts-cron',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
           $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
           $scope.status = 'You cancelled the dialog.';
           if(setterGetterService.getShouldLoad()!=undefined){
                if(setterGetterService.getShouldLoad()==true){
                    $scope.getKmPayouts();
                    setterGetterService.setShouldLoad(undefined);
                }
            }
      });
    };

    $scope.showPayoutIssuesDialog = function(ev) {
        $mdDialog.show({
          controller: PayoutIssuesController,
          templateUrl: 'payout-issues',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
           $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
           $scope.status = 'You cancelled the dialog.';
           if(setterGetterService.getShouldLoad()!=undefined){
                if(setterGetterService.getShouldLoad()==true){
                    $scope.getKmPayouts();
                    setterGetterService.setShouldLoad(undefined);
                }
            }
      });
    };

    $scope.exportPayouts = function (status) {
      if(status == 1) {
          var url = '/operations/riders/km-payouts/export/';
          var st_dt = $scope.startDate;
          var end_dt =  $scope.endDate;
      }
      else if(status == 2) {
          var url = '/operations/riders/salary-payouts/export/';
      }
      else if(status==3) {
          var url = 'operations/riders/daily-payouts/export/';
          var st_dt =  new Date($scope.date.startDate);
          var end_dt =  new Date($scope.date.endDate);
      }
      $scope.exportFileLoading = true;
      $http.get(url, {
        params: {
            month: $scope.payout_month,
            start_date: st_dt,
            end_date: end_dt,
            city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.id:null,
            cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
            rider_name: $scope.payout_ridername || null,
            rider_id: $scope.payout_riderid || null,
            status: $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null
        }
      })
      .success(function(data, status, headers, config) {
          filename = headers()['content-disposition'].split(';')[1].trim().replace("filename=","");
          var file = new Blob([data], { type: 'text/csv' });
          saveAs(file, filename);
          $scope.exportFileLoading = false;
      })
      .error(function(errordata, status, headers, config) {
          console.log(errordata);
          $scope.exportFileLoading = false;
          $scope.message = 'There was an error in getting your attendance history. Please try again!';
      });
    }

    $scope.selectAll = function() {
        if($scope.selectAllKmPayout == false) {
            angular.forEach($scope.kmPayouts, function(value,key){
                value.ischecked = true;
            })
        }
        else if($scope.selectAllKmPayout == true) {
            angular.forEach($scope.kmPayouts, function(value,key){
                value.ischecked = false;
            })
        }
    }

    $scope.selectAllSalaryPayout = function() {
        if($scope.selectAllSalaryPayouts == false) {
            angular.forEach($scope.salaryPayouts, function(value,key){
                value.isCheckedSalary = true;
            })
        }
        else if($scope.selectAllSalaryPayouts == true) {
            angular.forEach($scope.salaryPayouts, function(value,key){
                value.isCheckedSalary = false;
            })
        }
    }

    $scope.selectAllDailyPayout = function() {
        if($scope.selectAllDailyPayouts == false) {
            angular.forEach($scope.dailyPayouts, function(value,key){
                value.isCheckedDaily = true;
            })
        }
        else if($scope.selectAllDailyPayouts == true) {
            angular.forEach($scope.dailyPayouts, function(value,key){
                value.isCheckedDaily = false;
            })
        }
    }

    $scope.fetchSalaryPayouts = function() {
        $scope.monthlyPayoutLoading = true;
        $http.get('/operations/riders/salary-payouts/',{
            params: {
                month: $scope.payout_month,
                city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.id:null,
                cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
                rider_name: $scope.payout_ridername || null,
                rider_id: $scope.payout_riderid || null,
                doj : $scope.payout_doj,
                status : $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage      
            }
        })
        .success(function(response){
            $scope.salaryPayouts = response.data;
            $scope.monthlyPayoutLoading = false;
            $scope.pagination.totalItems = response.count;
        })
        .error(function(response){
            $scope.monthlyPayoutLoading = false;
        })
    }

    $scope.fetchBiWeeklySalaryPayouts = function() {
        $scope.monthlyPayoutLoading = true;
        $http.get('/operations/riders/biweekly-salary-payouts/',{
            params: {
                start_date: $scope.bistartDate,
                end_date: $scope.biendDate,
                city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.id:null,
                cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
                rider_name: $scope.payout_ridername || null,
                rider_id: $scope.payout_riderid || null,
                doj : $scope.payout_doj,
                status : $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage      
            }
        })
        .success(function(response){
            $scope.biweeklySalaryPayouts = response.data;
            $scope.monthlyPayoutLoading = false;
            $scope.pagination.totalItems = response.count;
        })
        .error(function(response){
            $scope.monthlyPayoutLoading = false;
        })
    }

    $scope.fetchDailyPayouts = function() {
        $scope.dailyPayoutLoading = true;
        $http.get('/operations/riders/daily-payouts/',{
            params: {
                start_date: new Date($scope.date.startDate),
                end_date: new Date($scope.date.endDate),
                city: $scope.payout_city.selected!=undefined ? $scope.payout_city.selected.code:null,
                cluster_id: $scope.payout_cluster.selected!=undefined ? $scope.payout_cluster.selected.id:null,
                rider_name: $scope.payout_ridername || null,
                rider_id: $scope.payout_riderid || null,
                payout_status : $scope.payout_salary_status.selected!=undefined ? $scope.payout_salary_status.selected.id:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage      
            }
        })
        .success(function(response){
            $scope.dailyPayouts = response.data;
            $scope.dailyPayoutLoading = false;
            $scope.pagination.totalItems = response.count;
        })
        .error(function(response){
            $scope.dailyPayoutLoading = false;
        })
    }

    // for single monthpicker
    $scope.maxDate = new Date();

    $scope.openDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };  

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1,
        'datepicker-mode':"'month'",
        'min-mode':"month"   
    };

      
    // $scope.initDate = new Date();
    $scope.monthFormat = 'yyyy-MM';

    // // for single datepicker

    // $scope.date_options = {
    //     formatYear: 'yy',
    //     initDate: $scope.initDate,
    //     startingDay: 1,
    // };

    // $scope.openDate = function($event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();
    //     $scope.opened = true;
    // };  

    // $scope.date_format = 'yyyy-MM-dd';

    $scope.cityList = [];

    $http.get('cities/info/').success(function(response){
        $scope.cityList = response.cities_info;
    }).error(function(error){

    });

    $scope.clusterDetails = [];
    $scope.cityToCluster = function(city_id) {
        $scope.clusterDetails = [];
        commonUtility.cityCluster(city_id, $scope);
    };

    $scope.ridersList = [];
    $scope.clusterToRider = function(cluster_id) {
        $scope.ridersList = [];
        commonUtility.clusterRider(cluster_id, $scope);
    };

    $scope.salaryStatusList = [
        {
            id:0,
            name:'Pending'
        },
        {
            id:1,
            name:'Approved'
        },
        {
            id:2,
            name:'Transferred'
        },
        {
            id:3,
            name:'On-Hold'
        }
    ];

    $scope.dailyStatusList = [
        {
            id:0,
            name:'Pending'
        },
        {
            id:1,
            name:'Approved'
        },
        {
            id:2,
            name:'Issue Raised'
        },
        {
            id:3,
            name:'Issue Closed'
        }
    ];
    
    // for week selection 
    $scope.formData = {
        dueDate : new Date(),
        biweeklydueDate : new Date()
    };
    $scope.data = {};
    $scope.initDate = new Date();
    
    $scope.weekOptions = {
        formatYear: 'yy',
        startingDay: 0,
        initDate: $scope.initDate,
        showWeeks:'false'
    };
    
    $scope.$watch('formData.dueDate',function(dateVal){
        var weekYear = getWeekNumber(dateVal);
        var year = weekYear[0];
        var week = weekYear[1];
        
        if(angular.isDefined(week) && angular.isDefined(year)){
          var ee = getStartDateOfWeek(week, year);
        }
        var weekPeriod = getStartDateOfWeek(week, year);
        if(weekPeriod[0] != 'NaN/NaN/NaN' && weekPeriod[1] != 'NaN/NaN/NaN'){
          $scope.formData.dueDate = weekPeriod[0] + " to "+ weekPeriod[1];
          $scope.startDate = weekPeriod[0].toString();
          $scope.endDate = weekPeriod[1].toString();
        }
    });

    $scope.$watch('formData.biweeklydueDate', function(dateVal){

        if (dateVal instanceof Date) {
            var year = dateVal.getYear() + 1900;
            var month = dateVal.getMonth();
            var day = dateVal.getDate();

            var month_start_date = new Date(year, month, 1);
            var month_mid_date = new Date(year, month, 15); 
            var month_mid_next_date = new Date(year, month, 16); 
            var month_last_date = new Date(year, month + 1, 0);

            if (day <= 15) {
                $scope.formData.biweeklydueDate = separatedDate(month_start_date) + " to "+ separatedDate(month_mid_date);
                $scope.bistartDate = separatedDate(month_start_date);
                $scope.biendDate = separatedDate(month_mid_date);
            } else {
                $scope.formData.biweeklydueDate = separatedDate(month_mid_next_date) + " to "+ separatedDate(month_last_date);
                $scope.bistartDate = separatedDate(month_mid_next_date);
                $scope.biendDate = separatedDate(month_last_date);
            }
        }
    });

    function separatedDate(date){
        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
    }

    
    function getStartDateOfWeek(w, y) {
        var simple = new Date(y, 0, 1 + (w - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if (dow <= 4)
          ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
          ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
          
        var ISOweekEnd = new Date(ISOweekStart);
        ISOweekEnd.setDate(ISOweekEnd.getDate() + 6);
        
        ISOweekStart = ISOweekStart.getDate()+'/'+(ISOweekStart.getMonth()+1)+'/'+ISOweekStart.getFullYear();
        ISOweekEnd = ISOweekEnd.getDate()+'/'+(ISOweekEnd.getMonth()+1)+'/'+ISOweekEnd.getFullYear();
        return [ISOweekStart, ISOweekEnd];
    }
    
    function getWeekNumber(d) {
        d = new Date(+d);
        d.setHours(0,0,0);
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        var yearStart = new Date(d.getFullYear(),0,1);
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        return [d.getFullYear(), weekNo];
    }
})

.controller('ridersMapController', function ($scope, $http, $timeout, leafletEvents, leafletData,$element) {
    $scope.riderslist = [];
    $scope.ridermsg = '';
    $scope.city = {};
    $scope.cluster = {};
    $element.find('input').on('keydown', function(ev) {
        ev.stopPropagation();
    });
    angular.extend($scope, {
                center: {
                    lat: 23.2500,
                    lng: 77.4170,
                    zoom: 4
                },
                events: {
                    map: {
                        enable: ['moveend', 'popupopen'],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [],
                        logic: 'emit'
                    }
                },
                legend: {
                    position: 'topright',
                    colors: [ '#FF0000', '#008000', '#5F9EA0'],
                    labels: [ 'Free', 'On a Trip', 'No Update in 10min']
                },
                layers: {
                    baselayers: {
                        bingRoad: {
                            name: 'Bing Road',
                            type: 'bing',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            layerOptions: {
                                type: 'Road'
                            }
                        }
                    },
                    overlays: {
                        realworld: {
                            name: "Real world data",
                            type: "markercluster",
                            visible: true
                        }
                    }
                }
            });

    $scope.riderdetails = '';
    $scope.markers = [];

    $scope.setFocus = function(lat,lng,iscluster){
        if(lat && lng){
            if(iscluster){
                angular.extend($scope, {
                    center: {
                        lat: lat,
                        lng: lng,
                        zoom: 14
                    }
                });        
            }
            else{
                angular.extend($scope, {
                center: {
                    lat: lat,
                    lng: lng,
                    zoom: 17
                }
            });    
            }
        }
        else {
            angular.extend($scope, {
            center: {
                lat: 23.2500,
                lng: 77.4170,
                zoom: 5
            }
        });
        }
    };

    $scope.$watch('cluster',function(value){
        if(value){
            $scope.setFocus(value.latitude,value.longitude,true);    
        }
    });

    $scope.riderinfo = function(rider){
        return '<p>'+'RiderId: ' + rider.id +
                '<br>'+'Name: ' +rider.name +
                '<br>'+'Contact No.: '+rider.contact+
                '<br>'+'Cluster: '+rider.cluster_name+
                '<br>'+'Last Seen: '+rider.since_updated+
                '<br>'+'App Version: '+rider.app_version+
                '</p>';
    };

    $scope.statusEnum = {
        0 : 'Returning free',
        1 : 'Received message',
        2 : 'Out for pickup',
        3 : 'Out for delivery'
    };
    $scope.status0 = $scope.status1 = $scope.status2 = $scope.status3 = $scope.status4 = $scope.status5 = 0;
    $scope.getIcon = function(rider,riderstatus,date){
        var now = new Date();
        var millisec = Math.abs(now-new Date(date));
        var minutes = Math.floor(millisec / 60000);
        if(minutes <= 10){
            if(riderstatus == "Free")
            {
                $scope.status0 += 1;
                return ridericon = {
                    type: 'awesomeMarker',
                    prefix:'fa',
                    icon: 'motorcycle',
                    markerColor: 'red',
                    iconColor: 'white'
                };
            }
            else if(riderstatus == "On A Trip")
            {
                $scope.status3 += 1;
                return ridericon = {
                    type: 'awesomeMarker',
                    prefix:'fa',
                    icon: 'motorcycle',
                    markerColor: 'green',
                    iconColor: 'white'
                };
            }
            else
            {
                $scope.status4 += 1;
                return ridericon = {
                    type: 'awesomeMarker',
                    prefix:'fa',
                    icon: 'motorcycle',
                    markerColor: 'purple',
                    iconColor: 'white'
                };
            }
        }
        else
        {
            $scope.status5 += 1;
            rider['currentstatus'] = 'No Update since 10 min';
            return ridericon = {
                type: 'awesomeMarker',
                prefix:'fa',
                icon: 'motorcycle',
                markerColor: 'cadetblue',
                iconColor: 'white'
            };
        }
    };

    $scope.resetResult = function(){
        $scope.riderslist = null;
        $scope.ridermsg = '';
        $scope.markers = [];
        $scope.currentRider = null;
        $scope.riderstatus = {};
        $scope.status0 = $scope.status1 = $scope.status2 = $scope.status3 = $scope.status4 = $scope.status5 = 0;
    };

    $scope.addClusterMarker = function()
    {
        if($scope.cluster)
        {
            $scope.markers.push({
                layer: 'realworld',
                lat: $scope.cluster.latitude,
                lng: $scope.cluster.longitude,
                name: $scope.cluster.cluster_name,
                focus: true,
                draggable: false,
                message: $scope.cluster.cluster_name,
                icon: {
                        type: 'awesomeMarker',
                        prefix:'fa',
                        markerColor: 'orange',
                        iconColor: 'white'
                    }
            });
        }
    };

    $scope.getRiders = function(){
        $scope.isMapLoading = true;
        $scope.resetResult();
        $scope.addClusterMarker();
        $http.get('/operations/rider/location/', {
            params: {
                cluster_id: $scope.cluster.selected ? $scope.cluster.selected.id : null,
                city: $scope.city.selected ? $scope.city.selected.code : null
            }
        }).success(function(data, status, headers, config){
            $scope.riderslist = data ? data.data : null;
            if(data.data && data.data.length > 0){
                for(var i in $scope.riderslist){
                    $scope.getTimeseconds($scope.riderslist[i]);
                    $scope.markers.push({
                        layer: 'realworld',
                        lat: $scope.riderslist[i].latitude,
                        lng: $scope.riderslist[i].longitude,
                        name: $scope.riderslist[i].name,
                        focus: true,
                        draggable: false,
                        message: $scope.riderinfo($scope.riderslist[i]),
                        icon: $scope.getIcon($scope.riderslist[i],$scope.riderslist[i].status,$scope.riderslist[i].update_timestamp)
                    });    
                }
                angular.extend($scope, {
                    markers: $scope.markers
                });
            } else {
              $scope.status0=0;
              $scope.status1=0;
              $scope.status2=0;
              $scope.status3=0;
              $scope.status5=0;
            }

            angular.extend($scope, {
                legend: {
                    position: 'topright',
                    colors: [ '#FF0000', '#008000', '#5F9EA0'],
                    labels: ['Free - ' + $scope.status0,
                              'On a Trip - ' + $scope.status3,
                              'No Update in 10min - ' + $scope.status5]
                }

            });
            $scope.isMapLoading=false;
            $scope.ridermsg = data ? data.data.length +' records found.' : 'No record found.';
        }).error(function(error){
            $scope.isMapLoading=false;
            alert('Error occured while fetching riders.');
        });
    };

    $scope.clusterCity = [];
    $http.get('cities/info/').success(function(response){
        $scope.clusterCity = response.cities_info;
    }).error(function(error){
        console.error(error);
    });

    $scope.$watch('city',function(value){
        if(value){
            $scope.setFocus();
            $scope.getCluster();            
        }
    });
    $scope.currentRider = null;
    $scope.selectRider = function(rider){
        $scope.currentRider = rider.id;
        $scope.setFocus(rider.latitude,rider.longitude);
    };

    $scope.getCluster = function(city){
        $scope.clusters = null;
        $http.get('/city-to-clusters/?city='+city)
        .success(function(data, status, headers, config){
            $scope.clusters = data ? data.data : null;
            $scope.cluster={}
        }).error(function(error){
            alert('Error occured in fetching clusters.');
        });
    };

    $scope.getTimeseconds = function(rider){
        var date = rider['update_timestamp'];
        var now = new Date();
        var millisec = Math.abs(now-new Date(date));
        
        var seconds = (millisec / 1000).toFixed(1);
        var minutes = (millisec / (1000 * 60)).toFixed(1);
        var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
        var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

        if (seconds < 60) {
            rider['since_updated'] = seconds + " Sec";
        } else if (minutes < 60) {
            rider['since_updated'] = minutes + " Min";
        } else if (hours < 24) {
            rider['since_updated'] = hours + " Hrs";
        } else {
            rider['since_updated'] = days + " Days"
        }
    };
    $scope.$on('get:Map', function() {
        leafletData.getMap().then(function(map) {
          $timeout(function() {
            map.invalidateSize();
          }, 300);
        });
        $scope.getRiders();
        $scope.setFocus();
    });

    $scope.resetFilters = function() {
      $scope.cluster={};
      $scope.city={};
      $scope.getRiders();
    }
})

.controller('exportInvoiceController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdToast, $document,isSuperUser) {

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        minMode: 'month'
    };

    $scope.dateOptions2 = {
        formatYear: 'yy',
        startingDay: 1,
        minMode: 'month'
    };

    $scope.format = 'yyyy-MM';
    var min = new Date();
    min.setMonth(min.getMonth()-3);

    $scope.minDate=min;
    var currentDate=new Date();
    currentDate.setMonth(currentDate.getMonth()-1);
    $scope.exportDate=currentDate;
    $scope.exportDate2=currentDate;

  var last = {
    bottom: true,
    top: false,
    left: false,
    right: true
  };
  $scope.date = new Date();
  
  $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
    .filter(function(pos) { return $scope.toastPosition[pos]; })
    .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }

  $scope.getSellerList = function() 
  {
    $scope.sellersData = null;
    $scope.exortloader = true;
    $http.get('/payments/city_sellers/?city='+$scope.clustercity)
    .success(function(response){
      $scope.exortloader = false;
      $scope.sellersData = response ? response.data : null;
    })
    .error(function(response){
      $scope.exortloader = false;
      $mdToast.show(
        $mdToast.simple()
        .content('There was an error getting on board sellers list. Error: '+response.message)
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    });
  };
  $scope.isSuperUser = isSuperUser;

  $scope.generateInvoice = function(){
    if($scope.exportDate){
        $scope.sellersData = null;
        $scope.exortloader = true;
        $http.get('/payments/create_merchant_invoice?&date='+$scope.exportDate.toISOString().substring(0,10))
        .success(function(response){
            $scope.exortloader = false;
            $scope.failedChains = response.failure_chains;
            showToast('Inovice generated successfully');
               
        })
        .error(function(response){
            $scope.exortloader = false;
            showToast(response.msg);
        });
    }else{
        showToast("Please select month");
    }
  }

    function showToast(msg){
        $mdToast.show(
            $mdToast.simple()
            .content(msg)
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
    }
  $scope.$watch('clustercity', function(value){
    $scope.sellersData = null;
    $scope.sellerId = $scope.exportchoice = null;
    if(value){
      $scope.getSellerList();  
    }
  });

  $scope.init = function(){
    $scope.toastPosition = angular.extend({},last);
    $scope.sellersData = null;
    $scope.exportAs = [{
            'code':'order_dump',
            'name': 'Order Dump'
          },{
            'code':'invoice',
            'name': 'Invoice'
          }];
    // Changed to api cities      
    $scope.clusterCity = [];

    

    $scope.maxdate = new Date();

    $scope.exportdate = {
      startDate: new Date(),
      endDate: new Date()
    };
    
    // for single monthpicker
    $scope.maxDate = new Date();

    $scope.clear = function () {
                        $scope.dt = null;
                    };

    $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                  };  

   $scope.open2 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened2 = true;
  };  
      
    $scope.initDate = new Date();

    $scope.clustercity = $scope.sellerId = $scope.exportchoice = "";
  };
  $scope.exportInvoice = function(){
    if(!$scope.clustercity){
      $scope.errormsg = 'Select City';
      return false;
    }
    // if(!$scope.sellerId){
    //   $scope.errormsg = 'Select Seller';
    //   return false;
    // }
    if(!$scope.exportchoice){
      $scope.errormsg = 'Select format to download';
      return false;
    }
    $scope.exortloader = true;
    var startdate = new Date($scope.exportDate2);

    var params = {
      start_time : startdate.getFullYear() + '-' + (startdate.getMonth()+1) + '-1',
      seller_id : Number($scope.sellerId),
      ext_type : $scope.exportchoice.toLowerCase()
    }
    // if($scope.exportchoice.toLowerCase() == 'html'){

        $http.get('/payments/get_invoice/?start_date='+params.start_time+'&seller_id='+params['seller_id']+'&type='+params['ext_type'])
        .success(function(response){
          $scope.exortloader = false;
          $scope.response=response;

          window.location = response.invoice_url;

          // setTimeout(function(){
          //   window.print();
          // }, 500);
        })
        .error(function(response){
          $scope.exortloader = false;
          $scope.errormsg = 'There was an error getting on board sellers list. Error: '+response;
        });
    // }
    // else{
    //     $http.get('/payments/seller/invoice/?start_time='+params['start_time']+'&end_time='+params['end_time']+'&seller_id='+params['seller_id']+'&ext_type='+params['ext_type'],
    //     {
    //       responseType: 'arraybuffer'
    //     })
    //     .success(function(data, status, headers, config){
    //       $scope.exortloader = false;
    //       if($scope.exportchoice.toLowerCase() == 'csv'){
    //         var filename = 'Seller Invoic.csv';//headers()['content-disposition'].split(';')[1].trim().replace("filename=","");
    //         var file = new Blob([data], { type: 'text/csv' });
    //         saveAs(file, filename);  
    //       }
    //       else if($scope.exportchoice.toLowerCase() == 'xls'){
    //         filename = 'Seller Invoic.xls'; //headers()['content-disposition'].split(';')[1].trim().replace("filename=","");
    //         var file = new Blob([data], {type: "application/xls"});
    //         saveAs(file, filename);  
    //       }
    //       else if($scope.exportchoice.toLowerCase() == 'pdf'){
    //         var file = new Blob([data], { type: 'text/pdf' });
    //         saveAs(file, 'Seller Invoice.pdf');   
    //       }
    //     })
    //     .error(function(response){
    //       $scope.exortloader = false;
    //       $scope.errormsg = 'There was an error getting on board sellers list. Error: '+response ? response.message : '';
    //     });

    // }
    
  };

  $scope.$on('get:exportInvoice', function() {
    $scope.init();
    $http.get('cities/info').success(function(response){
        $scope.clusterCity = response.cities_info;
    }).error(function(error){
        console.error(error);
    });
  });
  
})

.controller('invoiceManagementController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdToast, Upload, $document, Ops_user,$mdDialog,MerchantsService,FinanceService,setterGetterService) { 
    
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);
  
    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }

    //$scope.Ops_user=Ops_user;
    $scope.myConfig = {
        create: false,
        valueField: 'value',
        labelField: 'text',
        sortDirection: 'desc',
        sortField: 'text',
        onChange: function(value){
          // console.log('onChange', value)#commented
        },
        //sortField: [{field: 'text', direction: 'desc'}, {field: '$score'}]
        // maxItems: 1,
        // required: true,
    }; 

    $scope.myConfig2 = {
         create: false,
        valueField: 'value',
        labelField: 'text',
        sortDirection: 'desc',
        sortField: 'text',
        onChange: function(value){
          // console.log('onChange', value)#commented
        },
         maxItems: 1,
        // required: true,
    }; 

    $scope.getPaymentsMerchants = function() {
        var loadurl='/payments/sellers-data/';
        var merchants=[];
        var idWithStatus='';
        $http({method: 'GET',url: loadurl})
        .success(function(response){
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].is_wallet_mode){
                    idWithStatus=(response.data[i].id + "true");
                }
                else{
                    idWithStatus=response.data[i].id;  
                }
                merchants.push({value:idWithStatus,
                text:response.data[i].name});
            } 
            
            MerchantsService.setSellersData(merchants);   
        })
        .error(function(response){
            if(response==null){
                $mdToast.show(
                    $mdToast.simple()
                    .content('Failed to fetch sellers data for payments tab, Please check your network status')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );  
            }
            else{
                $mdToast.show(
                    $mdToast.simple()
                    .content('Failed to fetch sellers data for payments tab')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );  
            }
                
        });           
    };
    $scope.getFinanceUsers = function() {
        var loadurl='/payments/finance-users/';
        var financeusers=[];
        $http({method: 'GET',url: loadurl})
        .success(function(response){
            for(var i=0;i<response.data.length;i++){
                financeusers.push({value:response.data[i].id,
                text:response.data[i].name});
            }
            FinanceService.setUsersData(financeusers);   
        })
        .error(function(response){
            $mdToast.show(
                $mdToast.simple()
                .content('failed to Fetch Finance Users '+response.message)
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        });           
    };

    $scope.paymentsTab=function(){
        $scope.intializeFilters();   
    }

    /*variable definition for filters start*/
    $scope.intializeFilters = function() {
        if(MerchantsService.getSellersData()==undefined) {
            // $scope.getPaymentsMerchants();
        }
        if(FinanceService.getUsersData()==undefined) {
            $scope.getFinanceUsers();
        }
        $scope.financeUsersOptions=FinanceService.getUsersData();
        $scope.listAdjustmentsBlock = true;
        $scope.editAdjustmentsBlock = false;
        $scope.addDiscountsBlock = false;
        $scope.paymentsBlock=true;
        $scope.addPaymentsBlock=false;
        $scope.exportStatementBlock=false;
        $scope.allItemsSelected = false;

        $scope.invoiceloader=false;
        $scope.adjustmentsloader=false;
        $scope.paymentsloader=false;
                
        $scope.exportStatementBlock=false;
        $scope.editTaskBlock = false;
        $scope.paymentsloader=false;
        $scope.date = {startDate: null, endDate: null};
        $scope.next=1;
        $scope.count=1;
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.showSyncingMsg=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.enableBtnsOnSelection=false;  
        $scope.cities = [];
        $scope.merchants = []; 
        $scope.outlets = [];
        $scope.orderType = [];
        $scope.orderStatus = [];
        $scope.bulkActions = [];
        $scope.all = false;
        $scope.statusBtn="";
        $scope.checkedInvoiceList=[];
        $scope.statusfieldAll="";

        // $scope.pagination.currentPage = {};
        // $scope.pagination.itemsPerPage = {};

        $scope.merchantsOptions=[];
        //$scope.paymentsmerchantsOptions=[];
        //$scope.cities = loadcities();
        $scope.outletsOptions=[];
        $scope.orderTypeOptions=[
            {
            value:'COD',
            text: "COD"
            },
            {
            value:'Prepaid',
            text: "Prepaid"
            }
        ];
        $scope.orderStatusOptions=[  
            {
            value:'0',
            text: "Accepted"
            },
            {
            value:'1',
            text: "Allotted"
            },
            {
            value:'2',
            text: "Message received"
            },
            {
            value:'3',
            text: "Accepted by Rider"
            },
            {
            value:'4',
            text: "Collected"
            },
            {
            value:'5',
            text: "Delivered"
            },
            {
            value:'6',
            text: "Rejected By Customer"
            },
            {
            value:'302',
            text: "Cancelled"
            },
            {
            value:'403',
            text: "Rider Deleted Order"
            },
            {
            value:'503',
            text: "Rider Rejected Order"
            },
             {
            value:'404',
            text: "No Rider Found"
            },
            {
            value:'111',
            text: "Customer initiated delay"
            },
            {
            value:'112',
            text: "Customer uncontactable"
            },
            {
            value:'113',
            text: "Order not accepted by customer"
            }

        ];
        $scope.bulkActionsAdjustmentsOptions=[ 
            {
            value:'CRD',
            text: "Created"
            },
            {
            value:'APR',
            text: "Approved"
            },
            // {
            // value:'REJ',
            // text: "Rejected"
            // },
            // {
            // value:'UPD',
            // text: "Updated/ Flagged"
            // },
            {
            value:'RIS',
            text: "Raised"
            },
            {
            value:'CLS',
            text: "Closed"
            }
        ];
        $scope.bulkActionsUpdatableAdjustmentsOptions=[ 
            {
            value:'APR',
            text: "Approved"
            },
            {
            value:'RIS',
            text: "Raised"
            },
            {
            value:'CLS',
            text: "Closed"
            }
        ];
        $scope.chargeTypeOptions=[
            {
            value:'wallet',
            text: "Wallet"
            },
            {
            value:'nonwallet',
            text: "Non-Wallet"
            }];
        $scope.paymentsModesOptions=[
            {
            value:'1',
            text: "Cash"
            },
            {
            value:'2',
            text: "Cheque"
            },
            {
            value:'3',
            text: "NEFT"
            },
            {
            value:'4',
            text: "TDS Certificate"
            }];
        $scope.paymentsTypesOptions=[
            {
            value:'1',
            text: "Credit"
            },
            {
            value:'2',
            text: "Advance Bill Payment"
            },
            {
            value:'3',
            text: "Credit Misc"
            },
            {
            value:'4',
            text: "Debit"
            },
            {
            value:'5',
            text: "Debit Misc"
            }];
        $scope.citiesConfig = {
            create: false,
            valueField: 'code',
            labelField: 'name',
            sortDirection: 'desc',
            sortField: 'id',
            onChange: function(value){
              // console.log('onChange', value)#commented
            },
            //sortField: [{field: 'text', direction: 'desc'}, {field: '$score'}]
            // maxItems: 1,
            // required: true,
        }; 
        $http.get('cities/info').success(function(response){
            $scope.cityOptions = response.cities_info;
        }).error(function(error){

        });

        

        $scope.bulkActionsOptions = [
            {
            value:'free',
            text: "Mark Free"
            },
            {
            value:'COD',
            text: "Mark COD"
            },
            {
            value:'Prepaid',
            text: "Mark Prepaid"
            },
            {
            value:'Cancelled',
            text: "Mark Cancelled"
            },
            {
            value:'Delivered',
            text: "Mark Delivered"
            }
        ];
        $scope.exportTypeOptions = [
            {
            value:'pdf',
            text: "pdf"
            },
            {
            value:'csv',
            text: "csv"
            }
        ];
        $scope.invoiceList=[];
        $scope.allDiscounts=[];
        $scope.discountName='';
        $scope.discountCalculation="PRE";
        $scope.paymentType="AMT";
        $scope.discountValue='';
        $scope.discountComments='';
        $scope.financeUser='';
        $scope.id='';
        $scope.isStatusSame=false;
        $scope.paymentvalue=false;
        $scope.prevInvoiceListStatus="";
        $scope.selected = {}; 
        $scope.statusCount=0;
        $scope.statusField=null;
        var stopLooping=1;
        $scope.editInvoice=false;
        $scope.paymentType="AMT";
        $scope.chargeType=[];
    }
    /*end*/
    setTimeout($scope.intializeFilters(), 50);

     

    $scope.getMerchants = function(){       
        var merchants=[];
        $http.get('/payments/form-data/?city='+$scope.cities)
        .success(function(response){
            if(response){
                for(var i=0;i<response.merchant.length;i++){
                  merchants.push({value:response.merchant[i][0],
                    text:response.merchant[i][1]});
                  $scope.merchantsOptions=merchants;
                }
            }
            else{
                $mdToast.show(
                    $mdToast.simple()
                    .content('There is some error over fetching Merchants.')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
            }
        })
        .error(function(response) {
          $scope.slabLoading = false;
          $mdToast.show(
                $mdToast.simple()
                .content('Failed to fetch Merchants. Please check network status')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        });
    }; 

    $scope.cityChange = function(value){
      $scope.errormsg = '';
      
        $scope.merchants = [];
        $scope.merchantsOptions=[];
        $scope.outletsOptions=[];
        $scope.outlets = [];
        $scope.next = 1;
        $scope.invoiceList=[];
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.enableBtnsOnSelection=false;  
        $scope.all = false;
        if(value){
            $scope.getMerchants(value);
        }
        $scope.allItemsSelected = false;
    };  

    $scope.getFiltersData = function(){
      var outlets=[];
      var orderStatus=[];
      var orderTypes=[];
      var invoiceStatus=[];
      var payment_modes=[];
      var payment_types=[]; 
        
      //$http.get('https://api.myjson.com/bins/1pfs1')
      
      $http.get('/payments/form-data/?city='+$scope.cities+'&merchantId='+$scope.merchants)
        .success(function(response){
          if(response.outlets){              
                for(var i=0;i<response.outlets.length;i++){
                    outlets.push({value:response.outlets[i][0],
                    text:response.outlets[i][1]});
                    $scope.outletsOptions=outlets;  
                } 
            }
            else{
            $mdToast.show(
                $mdToast.simple()
                .content('failed to Fetch Outlets'+response.message)
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
          }

        })
        .error(function(response) {
            $mdToast.show(
                $mdToast.simple()
                .content('Failed to fetch Outlets. Please check network status')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        });
    }; 

    $scope.merchantsChange = function(value){
        $scope.errormsg = '';
        $scope.next = 1;
        $scope.outlets = [];
        $scope.outletsOptions=[];
        $scope.invoiceList=[];
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.enableBtns=true;
        $scope.showData=false;
        $scope.all = false;
        if(value){
            $scope.getFiltersData(value);  
        }  
        $scope.allItemsSelected = false;  
        $scope.enableBtnsOnSelection=false;    
    }; 

    $scope.outletsChange = function(value){
        $scope.errormsg = '';
        $scope.next = 1;
        $scope.invoiceList=[];
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.all = false;
        $scope.allItemsSelected = false;
        $scope.enableBtnsOnSelection=false;
    };

    $scope.orderTypeChange = function(value){
        $scope.errormsg = '';
        $scope.next = 1;
        $scope.invoiceList=[];
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.all = false;
        $scope.allItemsSelected = false;
        $scope.enableBtnsOnSelection=false;
    };
    $scope.orderStatusChange = function(value){
        $scope.errormsg = '';
        $scope.next = 1;
        $scope.invoiceList=[];
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.all = false;
        $scope.allItemsSelected = false;
        $scope.enableBtnsOnSelection=false;
    };

    $scope.bulkActionsChange = function(value){
        $scope.errormsg = '';
        $scope.next = 1;
        if(value!=undefined){
            $scope.enableBtnsOnSelection=true;
        }
        else{
           $scope.enableBtnsOnSelection=false; 
        }
    };
    $scope.chargeTypeChange = function(value){
        $scope.errormsg = '';
        $scope.next = 1;
        $scope.invoiceList=[];
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.allItemsSelected = false;
        $scope.enableBtnsOnSelection=false;
    };
    $scope.bulkActionsAdjustmentsChange = function(value){
        $scope.errormsg = '';
        $scope.next = 1;
        $scope.invoiceList=[];
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.all = false;
        $scope.enableBtnsOnSelection=false;
    };
    $scope.bulkActionsStatusTypeChange = function(value){
        $scope.errormsg = '';
        $scope.next = 1;
        if(value!=undefined){
            $scope.enableBtnsOnSelection=true;
        }
        else{
           $scope.enableBtnsOnSelection=false; 
        }
    };
    
    $scope.$watch("date", function(value) {
        $scope.errormsg = '';
        $scope.next = 1;
        $scope.invoiceList=[];
        $scope.showCount=false;
        $scope.showLoadingMsg=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.all = false;
        $scope.allItemsSelected = false;
        $scope.enableBtnsOnSelection=false;
    });

    $scope.selectEntity = function () {
        $scope.checkedInvoiceList=[];
        $scope.isStatusSame=true;
        $scope.isPaymentNonWallet=true;
        for (var i = 0; i < $scope.invoiceList.length; i++) {
            if ($scope.invoiceList[i].isChecked){ 
                if ($scope.isStatusSame){
                    if($scope.checkedInvoiceList.length==0){
                        $scope.prevInvoiceListStatus=$scope.invoiceList[i].order_status;
                    } 
                    if($scope.invoiceList[i].order_status==$scope.prevInvoiceListStatus){
                        $scope.isStatusSame=true;  
                        $scope.statusfieldAll=$scope.invoiceList[i].order_status;  
                    }
                    else{
                        $scope.isStatusSame=false;  
                    }  
                }
                if ($scope.isPaymentNonWallet){
                    if($scope.invoiceList[i].transaction_type.toLowerCase()=="non wallet"){
                        $scope.isPaymentNonWallet=true;  
                    }
                    else{
                        $scope.isPaymentNonWallet=false;  
                    }  
                }
                $scope.prevInvoiceListStatus=$scope.invoiceList[i].order_status;
                $scope.checkedInvoiceList.push($scope.invoiceList[i].id);
            }
            else{
                $scope.allItemsSelected = false;
            }
        }
        if (($scope.invoiceList.length==$scope.checkedInvoiceList.length) && ($scope.checkedInvoiceList.length>0)) { 
            $scope.allItemsSelected = true;  
        }
        if ($scope.checkedInvoiceList.length==0) {    
            $scope.isStatusSame = false;  
        }      
    };

    $scope.selectAll= function () {
        // Loop through all the entities and set their isChecked property
        $scope.isStatusSame = true;
        $scope.isPaymentNonWallet=true;
        for (var i = 0; i < $scope.invoiceList.length; i++) {
            $scope.invoiceList[i].isChecked = $scope.allItemsSelected;
            if($scope.isStatusSame){
                if($scope.allItemsSelected){
                    if($scope.invoiceList[i].order_status==$scope.invoiceList[0].order_status){
                        $scope.isStatusSame = true;
                    }
                    else{
                        $scope.isStatusSame = false; 
                    }  
                }
                else{
                    $scope.checkedInvoiceList=[];
                    $scope.isStatusSame = false; 
                }
            }
            if ($scope.isPaymentNonWallet){
                if($scope.invoiceList[i].transaction_type.toLowerCase()=="non wallet"){
                    $scope.isPaymentNonWallet=true;  
                }
                else{
                    $scope.isPaymentNonWallet=false;  
                } 
            }
        }
    };

    $scope.selectEntityAdjustments = function () {
        $scope.checkedInvoiceList=[];
        $scope.isStatusSame=true;
        var isStatusCreated = true;
        $scope.statusfield = "";
        for (var i = 0; i < $scope.invoiceList.length; i++) {
            if ($scope.invoiceList[i].isChecked){ 
                if ($scope.isStatusSame){ 
                    if($scope.checkedInvoiceList.length==0){
                        $scope.prevInvoiceListStatus=$scope.invoiceList[i].invoice_status;
                    }
                    if($scope.invoiceList[i].invoice_status==$scope.prevInvoiceListStatus){
                        $scope.isStatusSame=true;  
                        $scope.statusfieldAll=$scope.invoiceList[i].invoice_status;
                        if($scope.statusfieldAll.toLowerCase()=="crd"){
                            // $scope.statusfield="crd";
                            $scope.statusfieldAll="APR";
                            $scope.statusBtn="Approve";
                             setterGetterService.setBulkUpdateAdjustmentsMsg("This action will update selected orders invoice status from Create to Approve. Are you sure?");
                        }
                        else if($scope.statusfieldAll.toLowerCase()=="apr"){
                            $scope.statusfieldAll="RIS"; 
                            $scope.statusBtn="Raise";
                            setterGetterService.setBulkUpdateAdjustmentsMsg("This action will update selected orders invoice status from Approve to Raise. Are you sure?");
                        }
                        else if($scope.statusfieldAll.toLowerCase()=="ris"){
                            $scope.statusfieldAll="CLS"; 
                            $scope.statusBtn="Close";
                            setterGetterService.setBulkUpdateAdjustmentsMsg("This action will update selected orders invoice status from Raise to Close. Are you sure?");
                        } 
                        // else if($scope.statusfieldAll.toLowerCase()=="upd"){
                        //     $scope.statusfieldAll="APR"; 
                        //     $scope.statusBtn="Approve";
                        //     setterGetterService.setBulkUpdateAdjustmentsMsg("This action will update selected orders invoice status from Updated to Approve. Are you sure?");
                        // } 
                        else{
                            $scope.statusfieldAll="RisCls"
                            //$scope.isStatusSame=false; 
                        }  
                    }
                    else{
                        $scope.isStatusSame=false;  
                    }
                    //$scope.statusfieldAll=  $scope.prevInvoiceListStatus;
                }

                if($scope.invoiceList[i].invoice_status.toLowerCase()=="crd" && isStatusCreated){
                    $scope.statusfield='crd';
                    isStatusCreated=false;
                }
                $scope.prevInvoiceListStatus=$scope.invoiceList[i].invoice_status;
                $scope.checkedInvoiceList.push($scope.invoiceList[i].invoice_id);
            }
            else{
                $scope.allItemsSelected = false;
            }
        }
        if (($scope.invoiceList.length==$scope.checkedInvoiceList.length) && ($scope.checkedInvoiceList.length>0)) { 
            $scope.allItemsSelected = true;  
        }
        if ($scope.checkedInvoiceList.length==0) {    
            $scope.isStatusSame = false;  
        }   
    };

    $scope.selectAllAdjustments = function () {
        // Loop through all the entities and set their isChecked property
        $scope.isStatusSame = true;
        for (var i = 0; i < $scope.invoiceList.length; i++) {
            $scope.invoiceList[i].isChecked = $scope.allItemsSelected;
            if($scope.isStatusSame){
                if($scope.allItemsSelected){
                    if($scope.invoiceList[i].invoice_status==$scope.invoiceList[0].invoice_status){
                        $scope.isStatusSame = true;
                    }
                    else{
                        $scope.isStatusSame = false; 
                    }  
                }
                else{
                    $scope.checkedInvoiceList=[];
                    $scope.isStatusSame = false; 
                }
            }   
        }
        if($scope.isStatusSame == true){
            $scope.statusfieldAll=$scope.invoiceList[0].invoice_status;
            if($scope.statusfieldAll.toLowerCase()=="crd"){
                $scope.statusfieldAll="APR" ;
                $scope.statusBtn="Approve";
                setterGetterService.setBulkUpdateAdjustmentsMsg("This action will update selected orders invoice status from Create to Approve. Are you sure?");

            }
            else if($scope.statusfieldAll.toLowerCase()=="apr"){
                $scope.statusfieldAll="RIS";
                $scope.statusBtn="Raise";
                setterGetterService.setBulkUpdateAdjustmentsMsg("This action will update selected orders invoice status from Approve to Raise. Are you sure?");

            }
            else if($scope.statusfieldAll.toLowerCase()=="ris"){
                $scope.statusfieldAll="CLS";
                $scope.statusBtn="Close";
                setterGetterService.setBulkUpdateAdjustmentsMsg("This action will update selected orders invoice status from Raise to Close. Are you sure?");

            }
            // else if($scope.statusfieldAll.toLowerCase()=="upd"){
            //     $scope.statusfieldAll="APR"; 
            //     $scope.statusBtn="Approve";
            //     setterGetterService.setBulkUpdateAdjustmentsMsg("This action will update selected orders invoice status from Updated to Approve. Are you sure?");
            // } 
            else{
                $scope.isStatusSame=false; 
            }    
        }
    };

    $scope.loadMore = function() {  
        $scope.showCount=false;
        $scope.showData=false;

        $scope.invoiceloader=true;
        if($scope.next!=null){
            var loadurl='/payments/order/list/?page='+$scope.next;
            if($scope.cities != undefined){
                if($scope.cities.length){
                    loadurl=loadurl+'&cities='+$scope.cities;
                }
            }
            if($scope.merchants != undefined){
                if($scope.merchants.length){
                    loadurl=loadurl+'&merchants='+$scope.merchants;
                }  
            }
            if($scope.orderType != undefined){    
                if($scope.orderType.length){
                    loadurl=loadurl+'&order_types='+$scope.orderType;
                }
            }
            if($scope.orderStatus != undefined){  
                if($scope.orderStatus.length){
                    loadurl=loadurl+'&order_statuses='+$scope.orderStatus;
                }
            }
            if($scope.outlets != undefined){  
                if($scope.outlets.length){
                    loadurl=loadurl+'&outlets='+$scope.outlets;
                }
            }
            if($scope.chargeType != undefined){    
                if($scope.chargeType.length){
                    loadurl=loadurl+'&payment_mode='+$scope.chargeType;
                }
            }
            if($scope.date.startDate != undefined || $scope.date.endDate != undefined){ 
                if($scope.date.startDate && $scope.date.endDate){
                    var sdate = $scope.date.startDate._i;
                    var edate = $scope.date.endDate._i;
                    loadurl=loadurl+'&date_range='+sdate+','+edate;
                };
            }
            $http({method: 'GET',url: loadurl})
            .success(function(response){
                var updatedOrdersIds =[];
                if(setterGetterService.getUpdatedOrdersIds()!=undefined){
                    updatedOrdersIds = setterGetterService.getUpdatedOrdersIds();
                    setterGetterService.setUpdatedOrdersIds(undefined);
                }
                for(var i=0;i<response.data.result.length;i++){ 
                    var orderData = response.data.result[i];
                    orderData.isOrderUpdated = false;
                    
                    
                    for(var j=0;j<updatedOrdersIds.length;j++){
                        if(orderData.id==updatedOrdersIds[j]){
                            orderData.isOrderUpdated = true;
                        }
                    }
                    $scope.invoiceList = $scope.invoiceList.concat(orderData); 

                }
                 
                $scope.next=response.data.next;
                $scope.count=response.data.count;
                if($scope.count){
                    $scope.showCount=true;
                    $scope.enableBtns=false;
                }
                if($scope.next){
                    $scope.showData=true;
                }
                $scope.selectAll();
                $scope.invoiceloader=false;


            })
            .error(function(response){
                $scope.invoiceloader=false;
                $mdToast.show(
                    $mdToast.simple()
                    .content('Failed to fetch orders data, Please check network status')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
            });
        }
        else
        {
            $scope.invoiceloader=false;
        }      
    };
    $scope.applyBulkChanges = function($event) {

        var bulkAction='';
        var bulkValue='';        
        $scope.invoiceloader=true;
        var bulkOrderSelectedIds=[];
    
        if($scope.bulkActions!=undefined){
            if($scope.bulkActions.length>0){
                if($scope.bulkActions.toLowerCase()=="free"){
                    bulkAction="order_value";
                    bulkValue="free";
                    setterGetterService.setBulkUpdateMsg("This action will update selected ordersâ€™ charge to zero. Are you sure?");
                }
                else if($scope.bulkActions.toLowerCase()=="cod"){
                    bulkAction="order_type";
                    bulkValue="cod";
                    setterGetterService.setBulkUpdateMsg("This action will update selected ordersâ€™ status to COD. Are you sure?");
                }
                else if($scope.bulkActions.toLowerCase()=="prepaid"){
                    bulkAction="order_type";
                    bulkValue="prepaid"; 
                    setterGetterService.setBulkUpdateMsg("This action will update selected ordersâ€™ status to PREPAID. Are you sure?");

                }
                else if($scope.bulkActions.toLowerCase()=="cancelled"){
                    bulkAction="order_status";
                    bulkValue="cancelled"; 
                    setterGetterService.setBulkUpdateMsg("This action will update selected ordersâ€™ status to CANCELLED. Are you sure?"); 
                }
                else if($scope.bulkActions.toLowerCase()=="delivered"){
                    bulkAction="order_status";
                    bulkValue="delivered"; 
                    setterGetterService.setBulkUpdateMsg("This action will update selected ordersâ€™ status to Delivered. Are you sure?");

                }

                if($scope.allItemsSelected){
                    if($scope.count<1000){
                        $scope.checkedInvoiceList="all";
                    }  
                    else{
                        $scope.checkedInvoiceList="fall"
                    }         
                }
                if($scope.checkedInvoiceList!="fall"){
                    //$scope.showConfirmDialog($event);
                    if($scope.checkedInvoiceList.length)
                    {  
                        if($scope.isStatusSame==true && $scope.isPaymentNonWallet==true){
                            if($scope.checkedInvoiceList=="all"){
                                setterGetterService.setBulkUpdateCount($scope.checkedInvoiceList);
                            }
                            else{
                                setterGetterService.setBulkUpdateCount($scope.checkedInvoiceList.length);
                            }
                            
                            $scope.showConfirmDialog($event,bulkAction,bulkValue);
                            $scope.invoiceloader=false;
                        }
                        else if($scope.isStatusSame==false){
                            $scope.invoiceloader=false;
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Bulk action not applicable for orders with different order status')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            ); 
                        }  
                        else if($scope.isPaymentNonWallet==false){
                            $scope.invoiceloader=false;
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Bulk action not applicable for orders with payment mode as Wallet')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            ); 
                        }                  }
                    else
                    {
                       $mdToast.show(
                                $mdToast.simple()
                                .content('Please select some orders for bulk update')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                       $scope.invoiceloader=false;
                    }
                }
                else{
                    $scope.invoiceloader=false;
                    $mdToast.show(
                                $mdToast.simple()
                                .content('Uh Oh ! You cannot perform this action on more than 1000 records.')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                }
            }
            else{ 
                $mdToast.show(
                            $mdToast.simple()
                            .content('Please select some Bulk Action for bulk update')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        ); 
                $scope.invoiceloader=false; 
            }
        }
        else{ 
          $mdToast.show(
                        $mdToast.simple()
                        .content('Please select some Bulk Action for bulk update')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                    ); 
          $scope.invoiceloader=false; 
        }
        //$scope.checkedInvoiceList=[];
    }; 
    $scope.exportBulkChanges = function() {
        $scope.invoiceloader=true; 
        
        if($scope.allItemsSelected){
            if($scope.count<2000){
                $scope.checkedInvoiceList="all";
            }  
            else{
                $scope.checkedInvoiceList="fall"
            }         
        };
        if($scope.checkedInvoiceList!="fall"){
            


            if($scope.checkedInvoiceList.length){
                if($scope.isPaymentNonWallet==true){
                    $scope.showLoadingMsg=true;
                    var responseType = 'arraybuffer';
                    $http({
                        url: '/payments/order/export/',
                        method: 'POST',
                        responseType: 'arraybuffer',
                        data: {"ids":$scope.checkedInvoiceList},
                        headers: {
                            'Content-type': 'application/json',
                        }
                    }).success(function(data){
                        var blob = new Blob([data], {
                            type: 'application/csv'
                        });
                        saveAs(blob, 'orders_data' + '.csv');
                        $scope.invoiceloader=false;
                        $mdToast.show(
                                $mdToast.simple()
                                .content('Exported successfully')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                        $scope.showLoadingMsg=false;
                    })
                    .error(function(data){
                        if(data!=null){
                            var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                            var obj = JSON.parse(decodedString);  
                        }
                        $scope.invoiceloader=false;
                        $scope.showLoadingMsg=false;
                        if(obj.message!=undefined){
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Failed to update orders:'+obj.message)
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                        }
                        else{
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Failed to update orders, Please check network status')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );   
                        }
                    });
                }
                else
                {
                    $scope.invoiceloader=false;
                    $mdToast.show(
                                $mdToast.simple()
                                .content('Uh Oh ! You cannot export the orders with payment mode as Wallet')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                }
            }
            else
            {
                $scope.invoiceloader=false;
                $mdToast.show(
                            $mdToast.simple()
                            .content('Please check some Orders for bulk export')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
            }
        }
        else{
            $scope.invoiceloader=false;
                $mdToast.show(
                            $mdToast.simple()
                            .content('Uh Oh ! You cannot perform this action on more than 2000 records.')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
        }
        //$scope.checkedInvoiceList=[];
    };

    $scope.loadMoreAdjustments = function() {
        $scope.showCount=false;
        $scope.showData=false;
        $scope.adjustmentsloader=true;
        if($scope.next!=null){

            var loadurl='/payments/invoice/?page='+$scope.next;
            if($scope.cities != undefined){
                if($scope.cities.length){
                    loadurl=loadurl+'&city='+$scope.cities;
                }
            }
            if($scope.merchants != undefined){
                if($scope.merchants.length){
                    loadurl=loadurl+'&merchantId='+$scope.merchants;
                }  
            }
            if($scope.outlets != undefined){
                if($scope.outlets.length){
                    loadurl=loadurl+'&outletId='+$scope.outlets;
                }  
            }
            if($scope.bulkActionsAdjustments != undefined){    
                if($scope.bulkActionsAdjustments.length){
                    loadurl=loadurl+'&invoiceStatus='+$scope.bulkActionsAdjustments;
                }
            }
            if($scope.chargeType != undefined){    
                if($scope.chargeType.length){
                    loadurl=loadurl+'&mode='+$scope.chargeType;
                }
            }
            
            if($scope.date.startDate != undefined || $scope.date.endDate != undefined){ 
                if($scope.date.startDate && $scope.date.endDate){
                    var sdate = $scope.date.startDate._i;
                    var edate = $scope.date.endDate._i;
                    loadurl=loadurl+'&date_range='+sdate+','+edate;
                };
            }
            $http({method: 'GET',url: loadurl})
            .success(function(response){
                // var showUpdateFlag=false;

                var syncedOrdersId =[];
                if(setterGetterService.getSyncedOrdersId()!=undefined){
                    syncedOrdersId = setterGetterService.getSyncedOrdersId();
                    setterGetterService.setSyncedOrdersId(undefined);
                }
                for(var i=0;i<response.data.result.length;i++){
                    var orderData = response.data.result[i];
                    orderData.isOrderSynced = false;
                    
                    if(orderData.invoice_id==syncedOrdersId){
                        orderData.isOrderSynced = true;
                    }

                    if(response.data.result[i].invoice_status.toLowerCase()=="crd"){
                        response.data.result[i].invoice_full_status= "Created";
                    }
                    else if(response.data.result[i].invoice_status.toLowerCase()=="apr"){
                        response.data.result[i].invoice_full_status= "Approved";                   
                    }
                    else if(response.data.result[i].invoice_status.toLowerCase()=="ris"){
                        response.data.result[i].invoice_full_status= "Raised";
                    } 
                    else if(response.data.result[i].invoice_status.toLowerCase()=="cls"){
                        response.data.result[i].invoice_full_status= "Closed"; 
                    } 

                    $scope.invoiceList = $scope.invoiceList.concat(response.data.result[i]);

                    if($scope.invoiceList[i].invoice_status=="CLS"){
                        $scope.invoiceList[i].enableEdit=true;
                    }
                    else{
                        $scope.invoiceList[i].enableEdit=false;
                    }
                }                
                $scope.next=response.data.next;
                $scope.count=response.data.count;
                //$scope.selectAll();
               
                $scope.adjustmentsloader=false;
                if($scope.count){
                    $scope.showCount=true;
                    $scope.enableBtns=false;
                }
                if($scope.next){
                    $scope.showData=true;
                }
                
            })
            .error(function(response){
                $scope.adjustmentsloader=false;
                $mdToast.show(
                    $mdToast.simple()
                    .content('Failed to load orders data, Please check your network status')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
            });
        }
        else
        {
            $scope.adjustmentsloader=false;  
        }
    }; 
    $scope.applyBulkAdjustmentsChanges = function($event) {
        var checkedInvoiceList=$scope.checkedInvoiceList;
        $scope.adjustmentsloader=true;
        var bulkOrderSelectedIds=[];
        
        if($scope.bulkActionsAdjustments2 !=undefined){
            if($scope.bulkActionsAdjustments2.length>0 ){
                if($scope.allItemsSelected){
                    if($scope.count<5000){
                        checkedInvoiceList="all";
                        $scope.checkedInvoiceList="all";
                    }  
                    else{
                        checkedInvoiceList="fall";
                        $scope.checkedInvoiceList="fall";
                    }         
                }
                if(checkedInvoiceList.length){
                    if(checkedInvoiceList!="fall"){
                        if($scope.isStatusSame){
                            if($scope.statusfieldAll!="RisCls"){
                                if($scope.bulkActionsAdjustments2.toLowerCase()==$scope.statusfieldAll.toLowerCase()){
                                    $scope.adjustmentsloader=false;
                                    if(checkedInvoiceList=="all"){
                                    setterGetterService.setBulkUpdateAdjustmentsCount(checkedInvoiceList);
                                    }
                                    else{
                                        setterGetterService.setBulkUpdateAdjustmentsCount(checkedInvoiceList.length);
                                    }

                                    $scope.showConfirmAdjustmentsDialog($event);
                                }
                                else{
                                    $scope.adjustmentsloader=false;
                                    $mdToast.show(
                                            $mdToast.simple()
                                            .content('You cannot perform the bulk update with the selected Invoice status')
                                            .position($scope.getToastPosition())
                                            .hideDelay(3000)
                                        ); 
                                }
                            }
                            else{
                                $scope.adjustmentsloader=false;
                                $mdToast.show(
                                    $mdToast.simple()
                                    .content('You cannot perform bulk update Action on Closed and Rejected Invoices')
                                    .position($scope.getToastPosition())
                                    .hideDelay(3000)
                                );
                            }
                        }
                        else{
                            $scope.adjustmentsloader=false;
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Bulk action not applicable for orders with different order status')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            ); 
                        }
                    }
                    else{
                        $scope.adjustmentsloader=false;
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Uh Oh ! You cannot perform this action on  more than 5000 records.')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                    } 
                }
                else
                {
                   $mdToast.show(
                            $mdToast.simple()
                            .content('Please select some orders for bulk update')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                   $scope.adjustmentsloader=false;
                } 
            }
            else{ 
                $mdToast.show(
                                $mdToast.simple()
                                .content('Please select some Bulk Action for bulk update')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            ); 
                $scope.adjustmentsloader=false; 
            }
                   
        }
        else{ 
            $mdToast.show(
                            $mdToast.simple()
                            .content('Please select some Bulk Action for bulk update')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        ); 
            $scope.adjustmentsloader=false; 
        }
    }; 
    $scope.exportBulkAdjustmentsChanges = function() {
        var checkedInvoiceList=$scope.checkedInvoiceList;
        $scope.showLoadingMsg=false;
        $scope.adjustmentsloader=true; 
        if($scope.allItemsSelected){
            if($scope.count<=5){
                checkedInvoiceList="all";
            }  
            else{
                checkedInvoiceList="fall"
            } 
        }
        else{
            if(checkedInvoiceList.length>5){
                checkedInvoiceList="fall";
            }
        }
        if(checkedInvoiceList!="fall"){
            if(checkedInvoiceList.length){
                $scope.showLoadingMsg=true;
                if($scope.statusfield=="crd"){
                    $mdToast.show(
                    $mdToast.simple()
                    .content('You cannot export invoices with Created state')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                    );
                }
                else{
                    var responseType = 'arraybuffer';
                    $http({
                        url: '/payments/invoice/export/',
                        method: 'POST',
                        responseType: 'arraybuffer',
                        data: {"ids":checkedInvoiceList},
                        headers: {
                            'Content-type': 'application/json',
                        }
                    }).success(function(data){
                        $scope.showLoadingMsg=false;
                        $scope.statusfield="";
                        if(data!=null){
                            var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                            var obj = JSON.parse(decodedString);  
                        }
                        var invoice_urls=obj.invoice_urls;
                        for(var i=0;i<invoice_urls.length;i++){
                            window.open(invoice_urls[i],"_blank", "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=10, left=10");
                        }
                        // var blob = new Blob([data], {
                        //     type: 'application/csv'
                        // });
                        // saveAs(blob, 'orders_data' + '.csv');
                        $scope.adjustmentsloader=false;
                        $mdToast.show(
                                $mdToast.simple()
                                .content('Exported successfully')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                    })
                    .error(function(data, status, headers, config){
                        $scope.showLoadingMsg=false;
                        if(data!=null){
                            var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                            var obj = JSON.parse(decodedString);  
                        }
                        $scope.adjustmentsloader=false;
                        //$scope.allItemsSelected = false; 
                        if(obj.message!=undefined){
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Failed to update orders :'+obj.message)
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                        }
                        else{
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Failed to update orders, Please check network status')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );   
                        }
                    });
                }
                 $scope.adjustmentsloader=false; 
                 $scope.showLoadingMsg=false;
            }
            else
            {
                $scope.adjustmentsloader=false;
                $scope.showLoadingMsg=false;
                $mdToast.show(
                    $mdToast.simple()
                    .content('Please check some Orders for bulk export')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
            }
        }
        else{
            $scope.adjustmentsloader=false;
            $scope.showLoadingMsg=false;
            $mdToast.show(
                $mdToast.simple()
                .content('Uh Oh ! You cannot this perform action on more than 5 records.')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        }
        //$scope.checkedInvoiceList=[];
    }; 
    $scope.exportOrderDumpChanges = function() {
        var checkedInvoiceList=$scope.checkedInvoiceList;
        
        $scope.adjustmentsloader=true; 
        if($scope.allItemsSelected){
            if($scope.count<=10){
                checkedInvoiceList="all";
            }  
            else{
                checkedInvoiceList="fall";
            }         
        }
        else{
            if(checkedInvoiceList.length>10){
                checkedInvoiceList="fall";
            }
        }
        if(checkedInvoiceList!="fall"){
            if(checkedInvoiceList.length){
                $scope.showLoadingMsg=true;
                var responseType = 'arraybuffer';
                $http({
                    url: '/payments/invoice/dump/',
                    method: 'POST',
                    responseType: 'arraybuffer',
                    data: {"ids":checkedInvoiceList}, //this is your json data string
                    headers: {
                        'Content-type': 'application/json',
                        //'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                }).success(function(data){
                    var blob = new Blob([data], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    });
                    saveAs(blob, 'SellerInvoiceDump' + '.xls');
                    $scope.adjustmentsloader=false;
                    $scope.showLoadingMsg=false;
                }).error(function(data){
                    $scope.showLoadingMsg=false;
                    $scope.adjustmentsloader=false;
                    if(data!=null){
                        var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                        var obj = JSON.parse(decodedString);  
                    }
                    
                    if(obj.message!=undefined){
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to download Invoice Dump'+obj.message)
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to download Invoice Dump, Please check your network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );   
                    }
                });
            }
            else
            {
               $scope.adjustmentsloader=false; 
               $scope.showLoadingMsg=false;
               $mdToast.show(
                            $mdToast.simple()
                            .content('Please check some Orders for bulk export')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
            }
        }
        else{
            $scope.adjustmentsloader=false;
            $scope.showLoadingMsg=false;
            $mdToast.show(
                            $mdToast.simple()
                            .content('Uh Oh ! You cannot perform this action on more than 10 records.')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
        }
        //$scope.checkedInvoiceList=[];
    };

    $scope.loadMorePayments = function() {
        $scope.showCount=false;
        $scope.showData=false;
        $scope.paymentsloader=true;
        if($scope.next!=null){
            var loadurl='/payments/view/?page='+$scope.next;
            if($scope.cities != undefined){
                if($scope.cities.length){
                    loadurl=loadurl+'&cities='+$scope.cities;
                }
            }
            if($scope.merchants != undefined){
                if($scope.merchants.length){
                    loadurl=loadurl+'&merchants='+$scope.merchants;
                }
            }
            if($scope.chargeType != undefined){
                 if($scope.chargeType.length){
                    loadurl=loadurl+'&payment_type='+$scope.chargeType;
                }
            }
                
            $http({method: 'GET',url: loadurl})
            .success(function(response){

                for(var i=0;i<response.data.result.length;i++){
                  $scope.invoiceList = $scope.invoiceList.concat(response.data.result[i]); 
                }
                 
                $scope.next=response.data.next;
                $scope.count=response.data.count;
                if($scope.count){
                    $scope.showCount=true;
                    $scope.enableBtns=false;
                }
                if($scope.next){
                    $scope.showData=true;
                }
            })
            .error(function(response){
                
                if(response!=null){
                    if(response.message!=undefined){
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to fetch payments data'+response.message)
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to fetch payments data, Please check your network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );   
                    }
                }
                else{
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to fetch payments data, Please check your network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );   
                }
                
            });
            $scope.paymentsloader = false;
        }
        else
        {
            $scope.paymentsloader = false;
            $mdToast.show(
                        $mdToast.simple()
                        .content('No Data to load')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                    ); 
        }
    };
    $scope.applyInvoiceFilters = function() {
        $scope.next=1;
        $scope.invoiceList=[];
        $scope.loadMore();
    };
    $scope.loadMoreInvoices = function() {
        $scope.loadMore();
    };
    $scope.resetInvoiceFilters = function() {
        $scope.cities=[];
        $scope.merchants=[];
        $scope.outlets=[];
        $scope.orderType=[];
        $scope.orderStatus=[];
        $scope.invoiceList=[];
        $scope.chargeType=[];
        $scope.date.startDate=null;
        $scope.date.endDate=null;
        $scope.showCount=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.enableBtnsOnSelection=false;  
        $scope.allItemsSelected = false;
        $scope.bulkActions = [];
        $scope.next=1;
    }; 
    $scope.applyAdjustmentsFilters = function() {
        $scope.next=1;
        $scope.invoiceList=[];
        $scope.loadMoreAdjustments();
    };
    $scope.loadMoreAdjustmentsClick = function() {
        $scope.loadMoreAdjustments();
    };
    $scope.resetAdjustmentsFilters = function() {
        $scope.cities=[];
        $scope.merchants=[];
        $scope.outlets=[];
        $scope.invoiceList=[];
        $scope.date.startDate=null;
        $scope.date.endDate=null;
        $scope.all = false;
        $scope.showCount=false;
        $scope.showData=false;
        $scope.enableBtns=true;
        $scope.enableBtnsOnSelection=false;  
        $scope.allItemsSelected = false;
        $scope.next=1;
        $scope.bulkActionsAdjustments=[];
        $scope.chargeType=[];
        $scope.bulkActionsAdjustments2=[];
    }; 
    $scope.applyPaymentsFilters = function() {
        $scope.next=1;
        $scope.invoiceList=[];
        $scope.loadMorePayments();
    };
    $scope.loadMorePaymentsClick = function() {
        $scope.loadMorePayments();
    };

    $scope.resetPaymentsFilters = function() {
        $scope.cities=[];
        $scope.merchants=[];
        
        $scope.invoiceList=[];
        $scope.showData=false;
        $scope.showCount=false;
        $scope.chargeType=[];
        
        $scope.next=1;
        $scope.allItemsSelected = false;
    };

    $scope.$on('get:invoiceManagement', function() {
        $scope.intializeFilters();
    });

    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
      
    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    $scope.openAdjustments = function(invoice) {
        $scope.enableEdit=false
        $scope.editAdjustmentsBlock=true;
        $scope.listAdjustmentsBlock=false;
        $scope.addDiscountsBlock=false;
        $scope.seller = invoice.seller;
        $scope.invoice_id=invoice.invoice_id;
        $scope.outlet_name=invoice.outlet;
        setterGetterService.setInvoiceId(invoice.invoice_id);
        $scope.invoice_status=invoice.invoice_status;
        $scope.getAllDiscounts(invoice.id);
        $scope.getSellerSlabData(invoice.id,invoice.creation_date);
        if(invoice.invoice_status=="CLS"){
            $scope.enableEdit=true
        }
    };

    $scope.getSellerSlabData = function(id,created_time){
        $scope.paymentsloader=true;
        $scope.slabList=[];
        var loadurl='/payments/slab/?';
        if(id && created_time){
            loadurl=loadurl+'invoice_id='+id+'&invoice_date='+created_time;
            $http({method: 'GET',url: loadurl})
            .success(function(response){
                $scope.paymentsloader = false;
                for(var i=0;i<response.length;i++){
                  $scope.slabList = $scope.slabList.concat(response[i]); 
                }
            })
            .error(function(response){
                $scope.paymentsloader = false;
                $mdToast.show(
                    $mdToast.simple()
                    .content('Failed to fetch Discounts, Please check your network status')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
            });   
        }
        else{
            $mdToast.show(
                $mdToast.simple()
                .content('Failed to fetch Discounts')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );            
        }
    }

    $scope.syncInvoices = function(invoice){
        $scope.showSyncingMsg =true;
        $scope.adjustmentsloader=true;
        var loadurl='/payments/invoice/sync/';
        $http.post(loadurl,{ids:[invoice.id]})
            .success(function(response){
                $scope.showSyncingMsg =false;
                $scope.adjustmentsloader=false;
                $mdToast.show(
                    $mdToast.simple()
                    .content(response.message+" for "+ invoice.invoice_id)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
                $scope.next=1;
                $scope.invoiceList=[];
                setterGetterService.setSyncedOrdersId(invoice.invoice_id);
                $scope.loadMoreAdjustments();
            })
            .error(function(response){
                $scope.showSyncingMsg =false;
                $scope.adjustmentsloader=false; 
                $mdToast.show(
                    $mdToast.simple()
                    .content('failed to sync Invoice')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
                setterGetterService.setSyncedOrdersId(undefined);
            }); 
        
    }

    $scope.getAllDiscounts = function(id) {
        setterGetterService.setId(id);
        $scope.adjustmentsloader=true;
        $scope.allDiscounts=[];
        var loadurl='/payments/invoice/discounts/';
        if(id){
            loadurl=loadurl+'?invoice_id='+id;
        }
            
        $http({method: 'GET',url: loadurl})
        .success(function(response){
            $scope.adjustmentsloader = false;
            $scope.delivery_charges = response.delivery_charges;
            $scope.final_invoice_amount = response.final_invoice_amount;
            $scope.total_discounts = response.total_discounts;
            $scope.total_taxes = response.total_taxes;
            $scope.allDiscounts = $scope.allDiscounts.concat(response.discounts); 
        })
        .error(function(response){
            $scope.adjustmentsloader = false;
            $mdToast.show(
                    $mdToast.simple()
                    .content('Failed to get Discounts'+response.message)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                );
        });
    };
    
    $scope.activateValueTextBox = function() {
        $scope.paymentvalue=false;
        if($scope.paymentType=="AMT"){
            $scope.paymentvalue=false;
        }
        else{
           $scope.paymentvalue=true;
        }
    };
    $scope.submitDiscounts = function(ev) {
        var isValidationTrue=true; 
        $scope.paymentsloader=true;
        $scope.disableSaveDiscountButton=true;
        $scope.id=setterGetterService.getId();
        if($scope.paymentType=="AMT"){
            $scope.discountValue=$scope.amountDiscount;
        }
        else{
           $scope.discountValue= $scope.percentageDiscount;
        }

        if($scope.discountName==undefined || $scope.discountName==""){
            isValidationTrue=false;
            $scope.disableSaveDiscountButton=false;
            $scope.error_msg='Discount name is compulsory, It cannot be Empty';
        }
        else{
            if($scope.discountValue==undefined||$scope.discountValue==""){
                isValidationTrue=false;
                $scope.disableSaveDiscountButton=false;
                $scope.error_msg='Discount value is compulsory, It cannot be Empty';
            }
            else{
                if($scope.financeUser==undefined||$scope.financeUser==""){
                    isValidationTrue=false;
                    $scope.disableSaveDiscountButton=false;
                    $scope.error_msg='Finalized by is compulsory, It cannot be Empty';
                }
                else{
                   isValidationTrue=true; 
                }
            }
        }

        if(isValidationTrue){
            if($scope.paymentType=="AMT"){
                setterGetterService.setDiscountvalue($scope.amountDiscount+" Rs");
            }
            else{
                setterGetterService.setDiscountvalue($scope.percentageDiscount+" %");
            }
            
            $scope.AddDiscountConfirmDialog(ev); 
        }
        else{
        $mdToast.show(
                    $mdToast.simple()
                    .content($scope.error_msg)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                    );  
        }
    };
    $scope.deleteDiscounts = function(id,ev) {
        $scope.id=setterGetterService.getId();
        $scope.DeleteDiscountConfirmDialog(id,ev);
    };
    $scope.addDiscounts = function() {
        $scope.editAdjustmentsBlock=true;
        $scope.listAdjustmentsBlock=false;
        $scope.addDiscountsBlock=true;
    };
    $scope.closeDiscounts = function() {
        $scope.editAdjustmentsBlock=true;
        $scope.listAdjustmentsBlock=false;
        $scope.addDiscountsBlock=false;
    };
    $scope.closeAdjustments = function() {
        $scope.editAdjustmentsBlock=false;
        $scope.listAdjustmentsBlock=true;
        $scope.addDiscountsBlock=false;
        if(setterGetterService.getAdjustmentsShouldLoad()!=undefined){
            if(setterGetterService.getAdjustmentsShouldLoad()==true){
                $scope.next=1;
                $scope.invoiceList=[];
                $scope.loadMoreAdjustments();
                setterGetterService.setAdjustmentsShouldLoad(undefined);
            }
        }
    }; 
    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
          controller: InvoiceDialogController,
          templateUrl: 'invoiceUploadDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(answer) {
           $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
           if(setterGetterService.getShouldLoad()!=undefined){
                if(setterGetterService.getShouldLoad()==true){
                    $scope.next=1;
                    $scope.invoiceList=[];
                    $scope.applyInvoiceFilters();
                    setterGetterService.setShouldLoad(undefined);
                }
            }
        });
    };
    $scope.showConfirmDialog = function(ev,bulkAction,bulkValue) {
        $mdDialog.show({
          controller: confirmDialogController,
          templateUrl: 'confirmDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(answer) {
            
        }, function() {
           if(setterGetterService.getShouldLoad()!=undefined){
                if(setterGetterService.getShouldLoad()==true){
                    $scope.invoiceloader=true; 
                    $http.post('/payments/order/bulk_update/',{
                        ids:$scope.checkedInvoiceList,
                        action:bulkAction,
                        value:bulkValue
                    })
                    .success(function(response){
                        $scope.invoiceloader=false; 
                        $scope.next=1;
                        $scope.invoiceList=[];
                        $scope.loadMore();
                        $scope.all=false;
                        //$scope.allItemsSelected = false;
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Updated orders successfully, total updated orders:'+response.updated_count)
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                        setterGetterService.setShouldLoad(undefined);
                        $scope.checkedInvoiceList=[];
                        //$scope.selectAll();
                    })
                    .error(function(response){
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to update orders, please check network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                        $scope.invoiceloader=false;
                        //$scope.allItemsSelected = false; 
                    });
                }
            }
        });
    };
    $scope.AddDiscountConfirmDialog = function(ev) {
        $scope.disableSaveDiscountButton=true;
        $mdDialog.show({
          controller: addDiscountConfirmDialogController,
          templateUrl: 'confirmDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(answer) {
            
        }, function() {
           if(setterGetterService.getShouldAddDiscount()!=undefined){
                if(setterGetterService.getShouldAddDiscount()==true){
                    $scope.disableSaveDiscountButton=false;
                    $http.post('/payments/invoice/discounts/',{
                        "name":$scope.discountName,
                        "discount_calc":$scope.discountCalculation,
                        "discount_type":$scope.paymentType,
                        "value":$scope.discountValue,
                        "comment":$scope.discountComments,
                        "finalized_by":$scope.financeUser,
                        "invoice":$scope.id
                    })
                    .success(function(response){
                        $scope.paymentsloader = false;
                        $scope.getAllDiscounts($scope.id);
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Added a new discount successfully')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                        $scope.addDiscountsBlock=false;
                        $scope.discountName='';
                        $scope.discountCalculation="PRE";
                        $scope.paymentType="AMT";
                        $scope.amountDiscount='';
                        $scope.percentageDiscount='';
                        $scope.discountComments='';
                        $scope.financeUser='';
                        setterGetterService.setShouldAddDiscount(undefined);
                        setterGetterService.setAdjustmentsShouldLoad(true);
                    })
                    .error(function(response){
                        $scope.disableSaveDiscountButton=false;
                        $scope.paymentsloader = false;
                        if(response.message!=undefined){
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Failed to add Discounts'+response.message)
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                        }
                        else{
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Failed to add Discounts, Please check your network status')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );   
                        }
                    });
                }
            }
            else{
                $scope.disableSaveDiscountButton=false;
            }
        });
    };
    $scope.DeleteDiscountConfirmDialog = function(id,ev) {
        $mdDialog.show({
          controller: deleteDiscountConfirmDialogController,
          templateUrl: 'confirmDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(answer) {
            
        }, function() {
           if(setterGetterService.getShouldDeleteDiscount()!=undefined){
                if(setterGetterService.getShouldDeleteDiscount()==true){
                    $http.get('/payments/invoice/discounts/'+id+'/delete')
                    .success(function (data, status, headers) {
                        $scope.getAllDiscounts($scope.id);
                        setterGetterService.setShouldDeleteDiscount(undefined);
                        setterGetterService.setAdjustmentsShouldLoad(true);
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Deleted the discount successfully')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                    })
                    .error(function (data, status, header, config) {
                        $scope.paymentsloader = false;
                        if(data.message!=undefined){
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Failed to delete Discounts'+data.message)
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );
                        }
                        else{
                            $mdToast.show(
                                $mdToast.simple()
                                .content('Failed to add Discounts, Please check your network status')
                                .position($scope.getToastPosition())
                                .hideDelay(3000)
                            );   
                        }
                    });
                }
            }
        });
    };
    $scope.showConfirmAdjustmentsDialog = function(ev) {
        $mdDialog.show({
          controller: confirmDialogAdjustmentsController,
          templateUrl: 'confirmDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(answer) {
            
        }, function() {
           if(setterGetterService.getAdjustmentsShouldLoad()!=undefined){
                if(setterGetterService.getAdjustmentsShouldLoad()==true){
                    // if(setterGetterService.getBulkUpdateAdjustmentsCount=="all"){
                    //     $scope.checkedInvoiceList=="all";
                    // }
                    $http.post('/payments/invoice/bulk_update/',{
                    invoiceId:$scope.checkedInvoiceList,
                    invoiceStatus :$scope.statusfieldAll,
                    })
                    .success(function(response){
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Updated invoices successfully,total updated invoices:'+response.updated_count)
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                        $scope.adjustmentsloader=false; 
                        $scope.next=1;
                        $scope.invoiceList=[];
                        $scope.loadMoreAdjustments();
                        setterGetterService.setAdjustmentsShouldLoad(undefined);
                        //$scope.selectEntityAdjustments();
                        $scope.checkedInvoiceList=[];
                    })
                    .error(function(response){
                        $scope.adjustmentsloader=false; 
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to update invoices, please check network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                    });
                }
            }
        });
    };
    $scope.showAddPaymentDialog = function(ev) {
        $mdDialog.show({
          controller: AddPaymentsDialogController,
          templateUrl: 'addPaymentsDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function() {
            
        }, function() {
            if(setterGetterService.getShouldLoad()!=undefined){
                if(setterGetterService.getShouldLoad()==true){
                    $scope.next=1;
                    $scope.invoiceList=[];
                    $scope.applyPaymentsFilters();
                    setterGetterService.setShouldLoad(undefined);
                }
            }
        });
    };
    $scope.showStatementExportDialog = function(ev) {
        $mdDialog.show({
          controller: StatementExportDialogController,
          templateUrl: 'statementExportDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(function(answer) {
           $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
           $scope.status = 'You cancelled the dialog.';
        });
    };
})

.controller('editSellerSlabsController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdToast, $document) {
  


  var last = {
    bottom: true,
    top: false,
    left: false,
    right: true
  };
  
  $scope.toastPosition = angular.extend({},last);

  $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
    .filter(function(pos) { return $scope.toastPosition[pos]; })
    .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  };

  $scope.showSelectedSellerDetails=false;


  $scope.$on('get:editSellerSlabs', function() {
    $scope.showSellerList();
    $scope.sellerDetailsLoading=true;
    //$scope.fetchOnBoardSellersJSON();
  });

  
  $scope.selectedIndex=-1;

  $scope.showAccordion1 = function(index){

    $scope.selectedIndex=index;

  };


  $scope.showSellerList = function() {

    //$scope.showSellerListJSON();
    
    $scope.sellerDetailsLoading=true;
    $scope.sellerListDetailsLoading = true;
    $http.get('/payments/seller/seller_list/')
    .success(function(response){
      $scope.sellerListDetailsLoading = false;
      $scope.sellerDetailsLoading=false;
    
      $scope.sellersData = response;
    })
    .error(function(response){
      $scope.sellerListDetailsLoading = false;
      $scope.sellerDetailsLoading=false;
    
      $mdToast.show(
        $mdToast.simple()
        .content('There was an error getting on board sellers list. Error: '+response.message)
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    });
  };

  $scope.showSellerListJSON = function(){
    $scope.sellersList={"sellers":[{"seller_id":"123","seller_name":"test1","seller_code":"seller_code"},
      {"seller_id":"124","seller_name":"test2","seller_code":"seller_code"}]};

    $scope.sellersData=$scope.sellersList.sellers;
  };


  $scope.showSellerData = function() {

    //$scope.showSellerDataJSON();
    
    $scope.sellerDetailsLoading = true;
    $http.get('/payments/seller/slabs/update/?seller_id='+$scope.selectedSeller.seller_id)
    .success(function(response){
      $scope.sellerList = response;
      $scope.sellerDetailsLoading = false;
      $scope.showSelectedSellerDetails= true;
    })
    .error(function(response){
      $scope.sellerDetailsLoading = false;
      $mdToast.show(
        $mdToast.simple()
        .content('There was an error getting on board sellers list. Error: '+response.message)
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    });
  };


  $scope.showSellerDataJSON = function(){


    $scope.sellerList={
      'status': 'success', 'vendor_name':'test', 'vendor_id':'1', 'vendor_slabs':[
        {'slab_id':'123', 'param_name':'distance', 'param_value':'0-2', 'slab_values':[
          {'percentage':'2%', 'fixed_cost': 'None', 'per_distance': 'None'}, 
          {'percentage':'None', 'fixed_cost': 'None', 'per_distance': '10'}
        ]
      }
    ]};

    $scope.showSelectedSellerDetails=true;
  };

   $scope.updateSellerSlab = function(updatedSeller){

    var JSONObj={
      'seller_id': $scope.selectedSeller.seller_id, default_slabs: updatedSeller.default_slabs
    };


    $http.post('/payments/seller/slabs/update/?seller_id='+$scope.selectedSeller.seller_id, JSONObj)
    .success(function(response){
      
      $mdToast.show();
      $mdToast.show(
        $mdToast.simple()
        .content('Updated Successfully.')
        .position($scope.getToastPosition())
        .hideDelay(3000)
        );
      
    })
    .error(function(data, status, headers, config) {
      $scope.assignTaskLoading = false;
      $mdToast.show();
      $mdToast.show(
        $mdToast.simple()
        .content('There was a error in updating task')
        .position($scope.getToastPosition())
        .hideDelay(3000)
        );
    })

  };
})
.controller('merchantController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdToast, $document, commonUtility) {

    /*variable definition for filters start*/
    $scope.intializeFilters = function() {
        $scope.selectMerchant = {};
        $scope.selectStatus = {};
        $scope.selectCity = {};
        $scope.getMerchantDetails();
        
    }
    /*end*/


    

    $scope.merchantList=[];
    $scope.statusList=[];
    $scope.cityList = [];
    $scope.merchantsConfig = {
        create: false,
        valueField: 'id',
        labelField: 'chain_name',
        sortDirection: 'asc',
        sortField: 'chain_name',
        searchField:'chain_name',
        onChange: function(value){
        // console.log('onChange', value)#commented
        },
        maxItems: 1,
        // required: true,
    }; 

    $scope.cityConfig= {
        create: false,
        valueField: 'id',
        labelField: 'name',
        sortDirection: 'asc',
        sortField: 'name',
        searchField:'name',
        onChange: function(value){
        // console.log('onChange', value)#commented
        },
        maxItems: 1,
    }
    $scope.statusConfig = {
        create: false,
        valueField: 'id',
        labelField: 'name',
        sortDirection: 'asc',
        sortField: 'name',
        searchField:'name',
        onChange: function(value){
        // console.log('onChange', value)#commented
        },
        maxItems: 1,
        // required: true,
    }; 
    $scope.downloadCSV = function(){
        $scope.merchantLoading = true;
        $http.get('/operations/chains/outlets/list/', {
            params: {
                chain: $scope.selectMerchant.selected!=undefined ? $scope.selectMerchant.selected.id:null,
                status: $scope.selectStatus.selected!=undefined ? $scope.selectStatus.selected:null,
                city:$scope.selectCity.selected != undefined ? $scope.selectCity.selected : null,
                sort_param: $scope.sort,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage,
                output : "csv"
            }
        }).then(function(response){
            $scope.merchantLoading = false;
            filename = response.headers()['content-disposition'].split(';')[1].trim().replace("filename=","");
            var file = new Blob([response.data], { type: 'text/csv' });
            saveAs(file, filename);
        }).catch(function(error){
            $scope.merchantLoading = false;
            commonUtility.displayErrorMsg('There was an error in downloading outlet list - '+ error.message);
        });
    }
    // Pagination defaults.
    $scope.pagination = {
        maxWindowSize: 10,
        itemsPerPage: 15,
        currentPage: 1
    };

    $scope.sortBy = function(sort) {
        //$scope.pagination.currentPage = 1;
        if ($scope.sort == sort) {
            $scope.sort = '-' + sort;
        } else {
            $scope.sort = sort;
        }
        $scope.getMerchantDetails();
    }

    $scope.getMerchantDetails = function(id) {
        $scope.merchantLoading = true;
        $http.get('/operations/chains/outlets/list/', {
            params: {
                chain: $scope.selectMerchant.selected!=undefined ? $scope.selectMerchant.selected.id:null,
                status: $scope.selectStatus.selected!=undefined ? $scope.selectStatus.selected:null,
                city:$scope.selectCity.selected != undefined ? $scope.selectCity.selected : null,
                sort_param: $scope.sort,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage
            }
        })
        .success(function(response){
            $scope.outletList = response.data;
            $scope.pagination.totalItems = response.count;
            $scope.merchantLoading = false;
        })
        .error(function(response){
            $scope.merchantLoading = false;
            commonUtility.displayErrorMsg('There was an error in fetching outlet list - '+ response.message);
        })
        if($scope.selectMerchant.selected){
            $http.get('/operations/cities/info/',{
                params:{
                    chain_id:$scope.selectMerchant.selected.id
                }
            }).then(function(response){
                $scope.cityList = response.data ? (response.data.cities_info ? response.data.cities_info : []) : [];
            }).catch(function(error){
            });
        }
    };

    $scope.getMerchantList = function() {
        $scope.merchantLoading = true;
        $http.get('/operations/chains/list/')
        .success(function(response,status,headers){
            $scope.merchantList = response;
            $scope.merchantLoading = false;
        })
        .error(function(response,status,headers){
            commonUtility.displayErrorMsg("Error in fetching merchant filtet list");
            $scope.outletLoading = false;
        })
    };

    $scope.serachMerchants = function(name){
        $scope.merchantsLoading = true;
        return $http.post('/operations/chains/list/',{'text': name })
        .then(function(response){
            $scope.merchantList = response.data;
            $scope.merchantsLoading = false;
            return response.data;
        })
        .catch(function(response){
            $scope.merchantsLoading = false;
        });
    }

    $scope.statusList = [
        {
            "id" : 0,
            "name" : 'Inactive'
        },
        {
            "id" : 1,
            "name" : 'Active'
        }
    ];

    $scope.$on("merchant:home", function(){
        $scope.intializeFilters();
        // $scope.getMerchantList();
    });
})
.controller('manageMerchantController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdToast, $document, commonUtility, $mdDialog, isSuperUser,Ops_user, role, $q) {
    /*variable definition for filters start*/
    $scope.intializeFilters = function() {
        $scope.selectMerchant = undefined;
        $scope.searchText = undefined;
    }
    /*end*/
    $scope.merchantList=[];
    $scope.merchantsConfig = {
            create: false,
            valueField: 'id',
            labelField: 'chain_name',
            sortDirection: 'asc',
            sortField: 'chain_name',
            searchField:'chain_name',
            onChange: function(value){
            // console.log('onChange', value)#commented
            },
            maxItems: 1,
            // required: true,
        }; 

    $scope.ratecardNote=false;
    $scope.isSuperUser = isSuperUser;
    $scope.ratecardEditFlag=false;
    $scope.merchantMappingFlag=false;
    $scope.walletUser=false;
    $scope.role=role;


    $scope.checkRatecardEndDate = function(sdate,edate){
        var sdate = new Date(sdate);
        sdate.setHours(0);
        sdate.setMinutes(0);
        sdate.setSeconds(0);
        sdate.setMilliseconds(0);

        var edate = new Date(edate);
        edate.setHours(0);
        edate.setMinutes(0);
        edate.setSeconds(0);
        edate.setMilliseconds(0);

        var cDate = new Date();
        cDate.setHours(0);
        cDate.setMinutes(0);
        cDate.setSeconds(0);
        cDate.setMilliseconds(0);

        return cDate.getTime() <= edate.getTime() && cDate.getTime() >= sdate.getTime();
    }
    $scope.fetchDropdowndata = function() {
          // http request for fetching dropdown data
          $http.get('/operations/chains/filter-lists/')
          .success(function(response){
              $scope.dropdownData = response;
              $scope.merchantTypes = $scope.dropdownData.merchant_type;
              $scope.cashHandlingOptions = $scope.dropdownData.cash_handling_options;
              $scope.contractStatusChoice = $scope.dropdownData.contract_status_choice;
              $scope.invoivingDetails = $scope.dropdownData.invoiving_details;
              $scope.merchantStatus = $scope.dropdownData.merchant_status;
              $scope.orderProcessing = $scope.dropdownData.order_processing;
              $scope.salesPoc = $scope.dropdownData.sales_poc;
              $scope.tierOptions = $scope.dropdownData.tier_options;
              $scope.place_of_supply_options = $scope.dropdownData.place_of_supply_options || [];
          })
          .error(function(response){

          })
      };

      function saveMerchantData() {
          localStorage.setItem('merchantData', JSON.stringify($scope.merchantData));
      };

      function getMerchantData() {
          $scope.merchantData = JSON.parse(localStorage.getItem('merchantData'));
      };

      $scope.confirmMerchant = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
        $scope.ratecardNote=false;
        var localMerchantDetails = JSON.parse(localStorage.getItem('merchantData'));
        if($scope.isSuperUser =='False' || $scope.isSuperUser === undefined){
             $scope.minDate=new Date();
            $scope.maxDate=new Date();
        }
        if(localMerchantDetails != null && localMerchantDetails.merchantName != ""){
          var confirm = $mdDialog.confirm()
              .title('You were adding ' + localMerchantDetails.merchantName +', Do you wish to continue?')
              .content('Your action would load saved merchant.')
              .ariaLabel('Confirm')
              .targetEvent(ev)
              .ok('Confirm')
              .cancel('Add New');
          $mdDialog.show(confirm).then(function() {
            getMerchantData();
            $scope.merchantCreationForm = true;
          }, function() {
            saveMerchantData();
            $scope.merchantCreationForm = true;
          });
        } else {
          $scope.intializeMerchant();
          saveMerchantData();
          $scope.merchantCreationForm = true;
        }
      };

      $scope.intializeMerchant = function(ev) {
          $scope.merchantMappingFlag=false;
            $scope.merchant_edit = false;
          $scope.merchantData = {
              merchantName :'',
              merchantType :'',
              merchantTier :'',
              merchantActivationDate :'',
              merchantSalesPOC :'',
              merchantStatus : 0,
              merchantCashHandling :'',
              merchantContractStatus :'',
              ownerName: '',
              ownerEmail: '',
              ownerPhone: '',
              orderProcessing: 1,
              ownerLogin: '',
              merchantInvoicing: 1,
              invoiceEntity: '',
              invoicePOC: '',
              invoiceEmail: '',
              invoiceFrequency: 2,
              slabType: '',
              moqCheck: '',
              moqType: 0,
              moqCharge: '',
              moqCount: '',
              fixedKM: '0',
              fixedCost: '0',
              percentage: '',
              extraChargePerKM: '',
              ov_percentage:'',
              fixed_max_KM:'0',
              max_extraChargePerKM:'',
              fixed_max_Cost:'0',
              fr_fixedCost:'0',
              walletRequired:false,
              rateCardDate: new Date(),
              gst_info: {}
          };
          $scope.usernameAvailable = true;
          $scope.fetchDropdowndata();
          $scope.updateSeller= false;
          $scope.selectedIndex = 0;
          $scope.walletUser=false;
          $scope.editWallet=false;
          $scope.hulkRateCards = [];
      };

      $scope.nextTab = function(value) {
          $scope.selectedIndex = value;
          if($scope.updateSeller == false) {
            saveMerchantData();
        }
      };

      $scope.backTab = function(value) {
          $scope.selectedIndex = value;
          if($scope.updateSeller == false) {
              saveMerchantData();
              $scope.merchantData = JSON.parse(localStorage.getItem('merchantData'));
          }
      };

      $scope.checkAvailability = function(tab) {
            $scope.merchantLoading = true;
            console.log($scope.merchantData.ownerLogin);
            $http.get('/operations/validate-username/',{
                params: {
                    username: $scope.merchantData.ownerLogin
                }
            })
            .success(function(response){
                $scope.checkUsernameMessage = "Username available";
                $scope.usernameAvailable = false;
                $scope.merchantLoading = false;
                if(tab == 1) {
                    $scope.nextTab(2);
                }
            })
            .error(function(response){
                $scope.checkUsernameMessage = "Username doesn't available";
                $scope.merchantLoading = false;
                $scope.usernameAvailable = true;
            })
      };

      $scope.today = function() {
                      var now = new Date();
                      $scope.dt = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
                      $scope.timediff = now.getTime()-$scope.dt.getTime()
                    };
      $scope.today();

      /*$scope.maxDate = new Date();*/
      if($scope.isSuperUser =='False' || $scope.isSuperUser === undefined){
          var minDate= new Date();
          minDate.setDate(minDate.getDate()+1);
          $scope.minDate=minDate;
      }
      

      $scope.clear = function () {
                          $scope.dt = null;
                      };

      $scope.open = function($event) {
                      $event.preventDefault();
                      $event.stopPropagation();
                      $scope.opened = true;
                    };
    $scope.openDatePopUp = function($event,type){
        $event.preventDefault();
        $event.stopPropagation();
        if(type == 'start'){
            $scope.startDateOpened = true;
        }else{
            $scope.endDateOpened = true;

        }
    }

      $scope.dateOptions = {
                              formatYear: 'yy',
                              initDate: $scope.initDate,
                              startingDay: 1,
                          };
        
        
      $scope.initDate = new Date();
      $scope.format = 'yyyy-MM-dd';

      $scope.getMerchantList = function() {
            $scope.merchantListLoading = true;
            $http.get('/operations/chains/list/')
            .success(function(response){
                $scope.merchantList = response;
                $scope.merchantListLoading = false;
            })
            .error(function(response){
                $scope.merchantListLoading = false;
            })
      };
      // $scope.getMerchantList();

    $scope.addMerchant = function() {
        var moq;
        var moq_type;
        var moq_charge;
        var moq_count;
        // http request for adding a new merchant
        if($scope.merchantData.slabType == 'max'){
          $scope.data = [
                  {'upto_km': parseInt($scope.merchantData.fixed_max_KM), 'fixed_cost': parseFloat($scope.merchantData.fixed_max_Cost), 'percentage':parseFloat($scope.merchantData.percentage) },
                  {'per_km': parseFloat($scope.merchantData.max_extraChargePerKM) }
                ];
            moq=$scope.merchantData.max_moqCheck;
            moq_type=$scope.merchantData.max_moqType;
            moq_count=$scope.merchantData.max_moqCount;
            moq_charge=$scope.merchantData.max_moqCharge;
            if($scope.merchantData.percentage === '' || parseFloat($scope.merchantData.percentage)<=0){
                commonUtility.displayErrorMsg("% of order_value field must be greater than 0 ");
                return false;
            }else if($scope.merchantData.max_extraChargePerKM === '' || parseFloat($scope.merchantData.max_extraChargePerKM) <=0){
                 commonUtility.displayErrorMsg("extra per km field must be greater than 0 ");
                return false;
            }
        }
        else if($scope.merchantData.slabType == 'Distance'){
          $scope.data = [
                    {'upto_km': parseInt($scope.merchantData.fixedKM),'fixed_cost':parseFloat($scope.merchantData.fixedCost)},
                    {'per_km':parseFloat($scope.merchantData.extraChargePerKM)}
                  ];
            moq=$scope.merchantData.dis_moqCheck;
            moq_type=$scope.merchantData.dis_moqType;
            moq_count=$scope.merchantData.dis_moqCount;
            moq_charge=$scope.merchantData.dis_moqCharge;
        }
        else if($scope.merchantData.slabType == 'Order Value'){
          $scope.data = [
                    {'percentage': parseFloat($scope.merchantData.ov_percentage)}
                  ];
            moq=$scope.merchantData.ov_moqCheck;
            moq_type=$scope.merchantData.ov_moqType;
            moq_count=$scope.merchantData.ov_moqCount;
            moq_charge=$scope.merchantData.ov_moqCharge;
        
        }
        else if($scope.merchantData.slabType == 'Fixed Rate'){
          $scope.data = [
                    {'fixed_cost': parseFloat($scope.merchantData.fr_fixedCost)},
                    {'percentage': parseFloat($scope.merchantData.fr_percentage)}
                  ];
            moq=$scope.merchantData.fr_moqCheck;
            moq_type=$scope.merchantData.fr_moqType;
            moq_count=$scope.merchantData.fr_moqCount;
            moq_charge=$scope.merchantData.fr_moqCharge;
        } 

        var rateCardParams = {
          'slab_type': $scope.merchantData.slabType,
          'seller_id': $scope.slab_seller,
          'moq':moq==true ? '1':'0',
          'moq_type':moq_type,
          'moq_charge':moq_charge !== undefined ? parseFloat(moq_charge) : '',
          'moq_count' :moq_count !== undefined ? parseInt(moq_count) : '',
          'active_start': doISOFormat($scope.merchantData.rateCardDate),
          'active_end': dateIncrement($scope.merchantData.rateCardDate,1), 
          'data': $scope.data
        };

        $scope.merchantLoading = true;
        $http.post('/operations/chains/details/',{
            "chain_name" : $scope.merchantData.merchantName,
            "tier" : $scope.merchantData.merchantTier,
            "sales_poc" :$scope.merchantData.merchantSalesPOC,
            "merchant_type" : $scope.merchantData.merchantType,
            "status" : $scope.merchantData.merchantStatus,
            "cash_handling" : $scope.merchantData.merchantCashHandling,
            "contract_status" : $scope.merchantData.merchantContractStatus,
            "activation_date:" : $scope.merchantData.merchantActivationDate,
            "owner_name" : $scope.merchantData.ownerName,
            "owner_email" : $scope.merchantData.ownerEmail,
            "owner_phone" : $scope.merchantData.ownerPhone,
            "order_processing": $scope.merchantData.orderProcessing,
            "username": $scope.merchantData.ownerLogin,
            "invoice_aggregation" : $scope.merchantData.merchantInvoicing,
            "invoice_entity": $scope.merchantData.invoiceEntity,
            "invoice_poc": $scope.merchantData.invoicePOC,
            "invoice_poc_email" : $scope.merchantData.invoiceEmail,
            "invoice_frequency" : $scope.merchantData.invoiceFrequency,
            "rate_card": rateCardParams,
            "gst_info":$scope.merchantData.gst_info,
            "wallet":$scope.merchantData.walletRequired == "1" ? true :false
        })
        .success(function(response){
            commonUtility.displayErrorMsg((response.message ? response.message :
                    ( response.error_msg? response.error_msg : "Merchant created successfully")));
            $scope.merchantLoading = false;
            // $scope.getMerchantList();
            localStorage.removeItem('merchantData');
            $scope.intializeMerchant();
            $scope.selectedIndex = 0;
            if(response.merchant_type == 7){
                $scope.saveHulkRateCard(response.id);
            }
            $scope.hulkRateCards = [];
            $scope.showSection('manageOutlets');

        })
        .error(function(response){
            $scope.merchantLoading = false;
            commonUtility.displayErrorMsg((response.message ? response.message :
                    ( response.error_msg? response.error_msg : "There is a technical error in adding merchant ")));
        })

        
    };
    $scope.rateCardEdit=function(){
    $scope.ratecardEditFlag=false;
    }
    $scope.updateSeller = false;
    $scope.getMerchantDetails = function(chainID) {
        /*if($scope.isSuperUser =='False' || 
                $scope.isSuperUser === undefined){
            $scope.minDate='';
            $scope.maxDate='';
        }*/
        $scope.rateCardHistory = [];
        if(chainID !=undefined){
            $scope.editWallet=false;
      
            $scope.minDate='';
            $scope.maxDate='';
            // $scope.merchantLoading = true;
            $scope.merchantCreationForm = true;
            $scope.selectedFeatures = [];
            $scope.selectedFeaturesID = [];
            $scope.hulkRateCards = [];
            $scope.merchantLoading = true;
            $http.get('/operations/chains/details/',{
                params: {
                    chain_id: chainID
                }
            })
            .success(function(response){
                $scope.merchantLoading = false;
                $scope.merchantMappingFlag=true;
                $scope.ratecardNote=false;
                var tomorrowDate=new Date();
                $scope.merchant_edit = true;
                $scope.merchantDetails  = response.data;
                $scope.merchantRateCard = response.data.rate_card.data;
                if(Object.keys(response.data.rate_card).length > 0) {
                    $scope.ratecardEditFlag=true;
                    if($scope.isSuperUser =='False' || 
                            $scope.isSuperUser === undefined){
                        tomorrowDate.setDate(tomorrowDate.getDate()+1);
                        var date=new Date();
                        date.setDate(date.getDate()+1);
                        $scope.minDate=date;
                        $scope.ratecardNote=true;
                    }
                    
                    /*$scope.ratecardNote=true;
                    if($scope.merchantDetails.rate_card.slab_type == 'max'){
                      $scope.merchantRateCard = [
                              {'upto_km': $scope.merchantRateCard[0].upto_km, 'fixed_cost': $scope.merchantRateCard[0].fixed_cost, 'percentage': $scope.merchantRateCard[0].percentage },
                              {'upto_km': $scope.merchantRateCard[0].upto_km,'fixed_cost': $scope.merchantRateCard[0].fixed_cost, 'per_km': $scope.merchantRateCard[1].per_km }
                            ]
                    }
                    else if($scope.merchantDetails.rate_card.slab_type == 'Distance'){
                      $scope.merchantRateCard = [
                                {'upto_km': $scope.merchantRateCard[0].upto_km, 'fixed_cost': $scope.merchantRateCard[0].fixed_cost, 'percentage': 0},
                                {'upto_km': $scope.merchantRateCard[0].upto_km, 'fixed_cost': $scope.merchantRateCard[1].fixed_cost, 'per_km': $scope.merchantRateCard[1].per_km }
                              ]
                    }
                    else if($scope.merchantDetails.rate_card.slab_type == 'Order Value'){
                      $scope.merchantRateCard = [
                                {'upto_km': 0, 'fixed_cost': 0,'percentage': $scope.merchantRateCard[0].ov_percentage},
                                {'upto_km': 0,'fixed_cost': 0, 'per_km': 0}
                              ]
                    
                    }
                    else if($scope.merchantDetails.rate_card.slab_type == 'Fixed Rate'){
                      $scope.merchantRateCard = [
                                {'upto_km': 0, 'fixed_cost': $scope.merchantRateCard[0].fixed_cost, 'percentage': $scope.merchantRateCard[0].percentage},
                                {'upto_km': 0,'fixed_cost': 0, 'per_km': 0}
                              ]
                    } */
                } 
                else {
                    $scope.merchantRateCard = [
                        {'upto_km': 0, 'fixed_cost': 0,'percentage': 0},
                        {'upto_km': 0,'fixed_cost': 0, 'per_km': 0}
                    ]
                }
                if(response.data.gst_info && Object.keys(response.data.gst_info).length > 0){
                    $scope.merchantDetails.gst_info = angular.copy(response.data.gst_info);
                }else{
                    $scope.merchantDetails.gst_info = {};
                }
                $scope.merchantData = {
                    merchantName : $scope.merchantDetails.chain_name,
                    merchantType : $scope.merchantDetails.merchant_type,
                    merchantTier : $scope.merchantDetails.tier,
                    merchantActivationDate : ($scope.merchantDetails.activation_date == null ? new Date() : $scope.merchantDetails.activation_date) ,
                    merchantSalesPOC : $scope.merchantDetails.sales_poc,
                    merchantStatus : $scope.merchantDetails.status,
                    merchantCashHandling : $scope.merchantDetails.cash_handling,
                    merchantContractStatus : $scope.merchantDetails.contract_status,
                    ownerName: $scope.merchantDetails.owner_name,
                    ownerEmail: $scope.merchantDetails.owner_email,
                    ownerPhone: $scope.merchantDetails.owner_phone,
                    orderProcessing: $scope.merchantDetails.order_processing,
                    ownerLogin: $scope.merchantDetails.username,
                    merchantInvoicing: $scope.merchantDetails.invoice_aggregation,
                    invoiceEntity: $scope.merchantDetails.invoice_entity,
                    invoicePOC: $scope.merchantDetails.invoice_poc,
                    invoiceEmail: $scope.merchantDetails.invoice_poc_email,
                    invoiceFrequency : $scope.merchantDetails.invoice_frequency,
                    slabType: $scope.merchantDetails.rate_card.slab_type,
                    gst_info: $scope.merchantDetails.gst_info,
                    /*moqCheck: $scope.merchantDetails.rate_card.moq == 1? true:false,
                    moqType: $scope.merchantDetails.rate_card.moq_type == 'moq_daily'?'0':'1',
                    moqCharge: $scope.merchantDetails.rate_card.moq_charge,
                    moqCount: $scope.merchantDetails.rate_card.moq_count,
                    rateCardDate: $scope.merchantDetails.rate_card.active_start,
                    fixedKM: $scope.merchantRateCard[0].upto_km,
                    fixedCost: $scope.merchantRateCard[0].fixed_cost,
                    percentage: $scope.merchantRateCard[0].percentage,
                    extraChargePerKM: $scope.merchantRateCard[1].per_km,
                    walletRequired:$scope.merchantDetails.wallet
                    moqCount: $scope.merchantDetails.rate_card.moq_count,*/
                    walletRequired:$scope.merchantDetails.wallet == true ? 1 : 0,
                    max_moqCheck:($scope.merchantDetails.rate_card.slab_type == 'max' ? ($scope.merchantDetails.rate_card.moq == 1? true:false) :false),
                    max_moqType:($scope.merchantDetails.rate_card.slab_type == 'max'  ? ($scope.merchantDetails.rate_card.moq_type == 'moq_daily'?'0':'1') : '' ),
                    max_moqCount:($scope.merchantDetails.rate_card.slab_type == 'max' ? $scope.merchantDetails.rate_card.moq_count :'0'),
                    max_moqCharge:($scope.merchantDetails.rate_card.slab_type == 'max' ?$scope.merchantDetails.rate_card.moq_charge :'0' ),

                    dis_moqCheck:($scope.merchantDetails.rate_card.slab_type == 'Distance' ? ($scope.merchantDetails.rate_card.moq == 1? true:false) :false),
                    dis_moqType:($scope.merchantDetails.rate_card.slab_type == 'Distance'  ? ($scope.merchantDetails.rate_card.moq_type == 'moq_daily'?'0':'1') : '' ),
                    dis_moqCount:($scope.merchantDetails.rate_card.slab_type == 'Distance' ? $scope.merchantDetails.rate_card.moq_count :'0'),
                    dis_moqCharge:($scope.merchantDetails.rate_card.slab_type == 'Distance' ?$scope.merchantDetails.rate_card.moq_charge :'0' ),

                    ov_moqCheck:($scope.merchantDetails.rate_card.slab_type == 'Order Value' ? ($scope.merchantDetails.rate_card.moq == 1? true:false) :false),
                    ov_moqType:($scope.merchantDetails.rate_card.slab_type == 'Order Value'  ? ($scope.merchantDetails.rate_card.moq_type == 'moq_daily'?'0':'1') : '' ),
                    ov_moqCount:($scope.merchantDetails.rate_card.slab_type == 'Order Value' ? $scope.merchantDetails.rate_card.moq_count :'0'),
                    ov_moqCharge:($scope.merchantDetails.rate_card.slab_type == 'Order Value' ?$scope.merchantDetails.rate_card.moq_charge :'0' ),

                    fr_moqCheck:($scope.merchantDetails.rate_card.slab_type == 'Fixed Rate' ? ($scope.merchantDetails.rate_card.moq == 1? true:false) :false),
                    fr_moqType:($scope.merchantDetails.rate_card.slab_type == 'Fixed Rate'  ? ($scope.merchantDetails.rate_card.moq_type == 'moq_daily'?'0':'1') : '' ),
                    fr_moqCount:($scope.merchantDetails.rate_card.slab_type == 'Fixed Rate' ? $scope.merchantDetails.rate_card.moq_count :'0'),
                    fr_moqCharge:($scope.merchantDetails.rate_card.slab_type == 'Fixed Rate' ?$scope.merchantDetails.rate_card.moq_charge :'0' ),

                    rateCardDate: tomorrowDate,
                    fixedKM: ($scope.merchantDetails.rate_card.slab_type == 'Distance' ?$scope.merchantRateCard[0].upto_km :'0'),
                    fixedCost: ($scope.merchantDetails.rate_card.slab_type == 'Distance' ? $scope.merchantRateCard[0].fixed_cost:
                        ($scope.merchantDetails.rate_card.slab_type == 'Fixed Rate' ? $scope.merchantRateCard[0].fixed_cost  : '0')),
                    percentage: ($scope.merchantDetails.rate_card.slab_type == 'max' ? $scope.merchantRateCard[0].percentage : '0'),
                    ov_percentage:($scope.merchantDetails.rate_card.slab_type == 'Order Value' ? $scope.merchantRateCard[0].percentage : '0'),
                    extraChargePerKM: ($scope.merchantDetails.rate_card.slab_type == 'Distance' ?$scope.merchantRateCard[1].per_km:'0'),
                    max_extraChargePerKM:($scope.merchantDetails.rate_card.slab_type == 'max' ?  $scope.merchantRateCard[1].per_km :'0'),
                    fixed_max_KM:($scope.merchantDetails.rate_card.slab_type == 'max' ?  $scope.merchantRateCard[0].upto_km :'0'),
                    fixed_max_Cost:($scope.merchantDetails.rate_card.slab_type == 'max' ?  ($scope.merchantRateCard[0].fixed_cost ? $scope.merchantRateCard[0].fixed_cost:'0') :'0'),
                    fr_fixedCost:($scope.merchantDetails.rate_card.slab_type == 'Fixed Rate' ? $scope.merchantRateCard[0].fixed_cost:'0'),
                    fr_percentage:( $scope.merchantDetails.rate_card.slab_type == 'Fixed Rate' ?$scope.merchantRateCard[0].percentage:''),
                    activation_startDate:($scope.merchantDetails.rate_card.active_start  ? $scope.merchantDetails.rate_card.active_start :'' ),
                    activation_endDate:($scope.merchantDetails.rate_card.active_end ? $scope.merchantDetails.rate_card.active_end :'' ),
                    rateCardStartDate: ($scope.merchantDetails.rate_card.active_start  ? $scope.merchantDetails.rate_card.active_start :'' ),
                    rateCardEndDate:($scope.merchantDetails.rate_card.active_end ? $scope.merchantDetails.rate_card.active_end :'' ),
                    
                };

                $scope.merchantLoading = false;
                $scope.updateSeller = true;
                $scope.merchantData.flatRateCheck = false;
                if($scope.merchantData.fr_percentage != undefined && $scope.merchantDetails.rate_card.slab_type == 'Fixed Rate') {
                    $scope.merchantData.flatRateCheck = true;
                };
                $scope.editWallet=$scope.merchantDetails.wallet;
                $scope.walletUser=true;
                $scope.disableFields = true;
                $scope.getDiscountHistory(chainID);
                if($scope.merchantData.merchantType == 7){
                    $scope.getAssignedHulkRateCards(chainID);
                }
            })
            .error(function(response){
                commonUtility.displayErrorMsg((response.message ? response.message :
                    ( response.error_msg? response.error_msg : "There is a problem in fetching merchant details")));
                $scope.merchantLoading = false;
            });

        }
    };

        $scope.updateMerchantDetails = function(chainID) {
          $scope.merchantLoading = true;

          var params = {
            "chain_id": chainID,
            "chain_name" : $scope.merchantData.merchantName,
            "tier" : $scope.merchantData.merchantTier,
            "sales_poc" :$scope.merchantData.merchantSalesPOC,
            "merchant_type" : $scope.merchantData.merchantType,
            "status" : $scope.merchantData.merchantStatus,
            "cash_handling" : $scope.merchantData.merchantCashHandling,
            "contract_status" : $scope.merchantData.merchantContractStatus,
            "activation_date" : new Date($scope.merchantData.merchantActivationDate),
            "owner_name" : $scope.merchantData.ownerName,
            "owner_email" : $scope.merchantData.ownerEmail,
            "owner_phone" : $scope.merchantData.ownerPhone,
            "order_processing": $scope.merchantData.orderProcessing,
            "username": $scope.merchantData.ownerLogin,
            "invoice_aggregation" : $scope.merchantData.merchantInvoicing,
            "invoice_entity": $scope.merchantData.invoiceEntity,
            "invoice_poc": $scope.merchantData.invoicePOC,
            "invoice_frequency": $scope.merchantData.invoiceFrequency,
            "invoice_poc_email" : $scope.merchantData.invoiceEmail,
            "gst_info":$scope.merchantData.gst_info,
            "wallet": ($scope.merchantData.walletRequired ==1 ? true : false)
          }

          // HTTP request for updating merchant details
          $http.put('/operations/chains/details/', params)
          .success(function(response){
                $scope.merchantLoading = false;

                if(response.gst_errors){

                    if(Object.keys(response.gst_errors).length > 0){
                        commonUtility.displayErrorMsg(Object.keys(response.gst_errors)[0] +":  "+response.gst_errors[Object.keys(response.gst_errors)[0]][0]);
                        return;
                    }

                }
              commonUtility.displayErrorMsg((response.message ? response.message :
                    ( response.error_msg? response.error_msg : "Merchant updated successfully" )));
              // $scope.getMerchantList();
                if($scope.merchantData.walletRequired ==1)
                    $scope.walletUser=true;
          })
          .error(function(response){
              $scope.merchantLoading = false;
              commonUtility.displayErrorMsg((response.message ? response.message :
                    ( response.error_msg? response.error_msg : 'There is a problem in updating merchant data')));
          });

      };

      $scope.updateRateCard = function(chainID,ev) {
            if( $scope.merchantData.merchantType ==  7){
                $scope.saveHulkRateCard(chainID);
                return;
            }


           var moq;
           var moq_type;
           var moq_charge;
           var moq_count;
          if($scope.merchantData.slabType == 'max'){
            $scope.data = [
                    {'upto_km': parseInt($scope.merchantData.fixed_max_KM), 'fixed_cost': parseFloat($scope.merchantData.fixed_max_Cost), 'percentage':parseFloat($scope.merchantData.percentage) },
                    {'per_km': parseFloat($scope.merchantData.max_extraChargePerKM) }
                  ];
                moq=$scope.merchantData.max_moqCheck;
                moq_type=$scope.merchantData.max_moqType;
                moq_count=$scope.merchantData.max_moqCount;
                moq_charge=$scope.merchantData.max_moqCharge;
                if($scope.merchantData.percentage=== '' || parseFloat($scope.merchantData.percentage) <=0){
                    commonUtility.displayErrorMsg("% of order_value must be greater than 0");
                    return false;
                }else if($scope.merchantData.max_extraChargePerKM === '' || parseFloat($scope.merchantData.max_extraChargePerKM)<=0){
                    commonUtility.displayErrorMsg("extra per km must be greater than 0");
                    return false;
                }
          }
          else if($scope.merchantData.slabType == 'Distance'){
            $scope.data = [
                      {'upto_km': parseInt($scope.merchantData.fixedKM),'fixed_cost':parseFloat($scope.merchantData.fixedCost)},
                      //{'fixed_cost':parseFloat($scope.merchantData.fixedCost),'per_km':parseFloat($scope.merchantData.extraChargePerKM)}
                      {'per_km':parseFloat($scope.merchantData.extraChargePerKM)}

                    ];
                moq=$scope.merchantData.dis_moqCheck;
                moq_type=$scope.merchantData.dis_moqType;
                moq_count=$scope.merchantData.dis_moqCount;
                moq_charge=$scope.merchantData.dis_moqCharge;
                if($scope.merchantData.extraChargePerKM === '') {
                    commonUtility.displayErrorMsg("extra per km field can not be empty");
                    return false;
                }
          }
          else if($scope.merchantData.slabType == 'Order Value'){
            $scope.data = [
                      {'percentage': parseFloat($scope.merchantData.ov_percentage)}
                    ];
                moq=$scope.merchantData.ov_moqCheck;
                moq_type=$scope.merchantData.ov_moqType;
                moq_count=$scope.merchantData.ov_moqCount;
                moq_charge=$scope.merchantData.ov_moqCharge;
                if($scope.merchantData.ov_percentage ===''){
                    commonUtility.displayErrorMsg("% of order value can not be empty");
                    return false;
                }
          }
          else if($scope.merchantData.slabType == 'Fixed Rate'){
            $scope.data = [
                      {'fixed_cost': parseFloat($scope.merchantData.fr_fixedCost)},
                      {'percentage': parseFloat($scope.merchantData.fr_percentage)}
                    ];
                moq=$scope.merchantData.fr_moqCheck;
                moq_type=$scope.merchantData.fr_moqType;
                moq_count=$scope.merchantData.fr_moqCount;
                moq_charge=$scope.merchantData.fr_moqCharge;
                if($scope.merchantData.fr_fixedCost ===''){
                    commonUtility.displayErrorMsg("per order can not be empty");
                    return false;
                }
          } 
          var rateCardParams = {
            "chain_id": chainID, // sending chain id for updating merchant rate card,
            "deactivate_previous": true,
            'slab_type': $scope.merchantData.slabType,
            'seller_id': $scope.slab_seller,
            'moq':moq==true?'1':'0',
            'moq_type':moq_type,
            'moq_charge':moq_charge !== undefined ? parseFloat(moq_charge) : '',
            'moq_count' :moq_count !== undefined ? parseInt(moq_count) : '',
            'active_start': doISOFormat($scope.merchantData.rateCardStartDate, 'start'),// $scope.models.MAX.date.startDate,
            'active_end': doISOFormat($scope.merchantData.rateCardEndDate, 'end'), //$scope.models.MAX.date.endDate,
            'data': $scope.data
          };

          $scope.merchantLoading = true;

          // HTTP request for updating rate card
          $http.post('/payments/seller/slabs/update/', rateCardParams)
          .success(function(response){
              commonUtility.displayErrorMsg( (response.message ? response.message :
                    ( response.error_msg? response.error_msg : "Merchant rate card updated successfully")));
              $scope.merchantLoading = false;
              if(response.status && response.status==='success')
                showUpdateSuccessDialog(ev);
          })
          .error(function(response){
              commonUtility.displayErrorMsg((response.message ? response.message :
                    ( response.error_msg? response.error_msg : "There is a problem in updating rate card")));
              $scope.merchantLoading = false;
          });

      };
        function showUpdateSuccessDialog(ev){
            var confirm = $mdDialog.confirm()
                .title('')
                .content('Your rate card update will reflect from '+getOnlyDate($scope.merchantData.rateCardStartDate))
                .ariaLabel('OK')
                .targetEvent(ev)
                .ok('OK');
            $mdDialog.show(confirm).then(function() {
                
            }, function() {
                
            });
        }
        $scope.$on('init:merchants',function(){
          $scope.intializeMerchant();
          $scope.intializeFilters();
          // $scope.getMerchantList();
          $scope.rateCardHistory = [];
          $scope.merchantCreationForm = false;
        });

        $scope.serachMerchants = function(name, deferred){
            $scope.merchantsLoading = true;
            return $http.post('/operations/chains/list/',{'text': name })
            .then(function(response){
                $scope.merchantList = response.data;
                $scope.merchantsLoading = false;
                return response.data;
            })
            .catch(function(response){
                $scope.merchantsLoading = false;
            });
        }
        $scope.simulateQuery = true;
        $scope.querySearch = function(query){
            var results = [], deferred;
            if ($scope.simulateQuery && query != '' && query) {
                deferred = $q.defer();
                $timeout(function(){
                    $scope.serachMerchants(query, deferred);
                }, 500);
                return deferred.promise;
            } else {
                return results;
            }
            return results;
        }

        $scope.createFilterFor = function(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (angular.lowercase(item.chain_name).indexOf(lowercaseQuery) !== -1);
            };
        };
        function doISOFormat(date, type){
            if(date == '' && type == 'start'){
                date = new Date();
            }else if(date == '' && type == 'end'){
                date = new Date();
                date.setFullYear(date.getFullYear() + 1);
            }
            date=new Date(date);
            date.setHours(00);
            date.setMinutes(00);
            date.setSeconds(00);
            date=date.toISOString();
            return date;
        }
        function dateIncrement(date,year){
            var newDate=new Date(date);
            newDate.setHours(00);
            newDate.setMinutes(00);
            newDate.setSeconds(00);
            newDate.setFullYear(newDate.getFullYear()+parseInt(year));
            return newDate.toISOString();
        }
        function getOnlyDate(date){
            date=new Date(date);
            date.setHours(00);
            date.setMinutes(00);
            date.setSeconds(00);
            date.setDate(date.getDate()+1);
            date=date.toISOString().slice(0,10);
            return date;
        }
        $scope.getDiscountHistory = function(id){
            angular.forEach($scope.merchantList,function(value,key){
                if(value.id == id){
                    $scope.selectedMerchantName = value.chain_name.split(":")[0];
                }
            });
            $scope.discountHistory  = [];
            $scope.merchantLoading = true;
            $http.get('operations/merchant/'+id+'/discount/history/')
            .success(function(response){
                $scope.merchantLoading = false;
                $scope.discountHistory = response;
            }).error(function(response){
                $scope.merchantLoading = false;
                commonUtility.displayErrorMsg(response.message ? response.message: response);
            });
            $scope.getRateCardHistory(id)
        }

        $scope.getRateCardHistory = function(id){
            $scope.rateCardHistory  = [];
            $scope.merchantLoading = true;
            $http.get('operations/merchant/'+id+'/rate_card/history/')
            .success(function(response){
                $scope.merchantLoading = false;
                $scope.rateCardHistory = response;
            }).error(function(error){
                $scope.merchantLoading = false;
                commonUtility.displayErrorMsg(response.message ? response.message: response);
            });

        }

        $scope.getAllHulkRateCards = function(){
            $http.get('/payments/hulk_rate_card/').then(function(response){
                $scope.hulk_rate_cards = response.data['data'];
            });
        }
        $scope.getAllHulkRateCards();
        $scope.hulkRateCards = [];
        $scope.getAssignedHulkRateCards = function(chain_id){
            $scope.hulkRateCards = [];
            $scope.merchantLoading = true;
            // http://hobbit.dev.shadowfax.in:8051/payments/hulk_rate_card/?chain_id=2297
            $http.get('/payments/hulk_rate_card/?chain_id='+chain_id).then(function(response){
                $scope.merchantLoading = false;
                $scope.hulkRateCards = [];
                angular.forEach(response.data['data'], function(val){
                     $scope.hulkRateCards.push({'list': $scope.hulk_rate_cards, id: val.id, "remove": true });
                });
                $scope.hulk_rate_card_length = $scope.hulkRateCards.length;
            }).catch(function(error){
                $scope.merchantLoading = false;
                commonUtility.displayErrorMsg(error['error']? error['error']['message'] : 'Unkown error');
            })
        }

        $scope.addHulkRateCard = function(){
            var array = angular.copy($scope.hulk_rate_cards);
            angular.forEach($scope.hulkRateCards, function(val){
                if(val.id != '-1'){
                    var index = array.findIndex(function(obj){return obj.id == val.id});
                    array.splice(index,1);
                }
            });
            $scope.hulkRateCards.push({'list': array, id: '-1'});
        }
        $scope.saveHulkRateCard = function(chain_id){
            var array = [];
            angular.forEach($scope.hulkRateCards, function(val, key){
                if(val.id != '-1')
                    array.push(val.id);
            });
            $scope.merchantLoading = true;
            $http.post('/payments/hulk_rate_card/',{"chain_id":chain_id ? chain_id: chainID, "ratecard_ids":array}).then(function(response){
                $scope.merchantLoading = false;
                $scope.merchantData.hulkRateCards = response.data['data'];
                commonUtility.displayErrorMsg(response['data']['status']);
                if($scope.merchant_edit)
                    $scope.getAssignedHulkRateCards(chain_id);
            }).catch(function(error){
                $scope.merchantLoading = false;
                commonUtility.displayErrorMsg(error['error']? error['error']['message'] : 'Unkown error');
            });
        }

        $scope.removeHulkRateCard = function(index, id, chain_id){
            var array = [];
            angular.forEach($scope.hulkRateCards, function(val, key){
                if(val.id != '-1' && val.id != id)
                    array.push(val.id);
            });
            $scope.merchantLoading = true;
            $http.post('/payments/hulk_rate_card/',{"chain_id":chain_id ? chain_id: chainID, "ratecard_ids":array}).then(function(response){
            $scope.merchantLoading = false;
                $scope.merchantData.hulkRateCards = response.data['data'];
                commonUtility.displayErrorMsg(response['data']['status']);
                $scope.getAssignedHulkRateCards(chain_id);
            }).catch(function(error){
                $scope.merchantLoading = false;
                commonUtility.displayErrorMsg(error['error']? error['error']['message'] : 'Unkown error');
            });
        }
        $scope.selectedHulkRateCard = function(i, id){
            angular.forEach($scope.hulkRateCards, function(val, key){
                
                if(key != i && !val.remove ){
                    var array = angular.copy($scope.hulk_rate_cards);
                    var list = [];
                    angular.forEach($scope.hulkRateCards, function(cval, ckey){
                        if(!cval.remove && cval.id != '-1'){
                            list.push(cval.id);
                        }
                    });
                    angular.forEach(list, function(cval){
                        if(cval != val.id){
                            var index = array.findIndex(function(obj){return obj.id == cval;});
                            array.splice(index,1);
                        }
                    });
                    val.list = angular.copy(array);
                }
            });

        }
})
.controller('manageOutletController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdToast, $document, $mdDialog, commonUtility, $rootScope,isSuperUser, $q) {

        /*variable definition for filters start*/
        $scope.intializeFilters = function() {
          $scope.selectMerchant = {};
          $scope.selectCity = {};
          $scope.selectOutlet = {};
          $scope.selectOutletStatus = {};
          $scope.searchText = undefined;

        }
        $scope.merchantList=[];
        $scope.cityList=[];
        $scope.outletList=[];
        $scope.outletCityList = [];
        $scope.clusterList = [];
        $scope.sublocalityList = [];
        $scope.citiesFrom = [];
        $scope.clustersFrom = [];
        $scope.geofence_cities = [];

        $scope.$on('$destroy',function(){
          $scope.selectMerchant.selected = undefined;
        })
        /*end*/

        $scope.isSuperUser=isSuperUser;
        
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.getOutletStatusList = [
            { id:2, name : 'ALL' },
            { id:1, name : 'Active' },
            { id:0, name : 'Inactive' },
        ];

      $scope.isEmpty = function (obj) {
          for (var i in obj) if (obj.hasOwnProperty(i)) return false;
          return true;
      };
      $scope.selectedFeatures = [];  
      $scope.selectedFeaturesID = [];  

      $scope.addInSelectedFeatures = function(feature) {
            var featureID = $scope.selectedFeaturesID.indexOf(feature.id);
            if (featureID > -1) {
              commonUtility.displayErrorMsg("Feature already in Selected Features");
            }
            else {
              $scope.selectedFeaturesID.push(feature.id);
              $scope.selectedFeatures.push(feature);
            }

      };

      $scope.removeFeature = function(feature) {
            var featureID = $scope.selectedFeaturesID.indexOf(feature.id);
            var feature = $scope.selectedFeatures.indexOf(feature);
            $scope.selectedFeaturesID.splice(featureID, 1);
            $scope.selectedFeatures.splice(feature, 1);
      };

      function saveOutletData() {
          localStorage.setItem('outletData', JSON.stringify($scope.outletData));
      };

      function getOutletData() {
          $scope.outletData = JSON.parse(localStorage.getItem('outletData'));
      };

      $scope.cityToCluster =  function() {
        $http.get('/operations/chains/filter_city_cluster/' + $scope.outletData.outletCity.selected)
        .success(function(response){
            $scope.clusterList = response.clusters;
        })
        .error(function(response){

        })
      };

      $scope.getClusterLatLong = function(cluster) {
            $rootScope.outletLat = cluster.latitude;
            $rootScope.outletLong = cluster.longitude;
      };

      $scope.clusterToSublocality =  function() {
        $scope.outletLoading = true;
        $http.get('/operations/chains/filter_cluster_sublocality/' + $scope.outletData.outletCluster.selected)
        .success(function(response){
            $scope.outletLoading = false;
            $scope.sublocalityList = response.sublocality;
            commonUtility.displayErrorMsg("Fetched sublocalities");
        })
        .error(function(response){
            $scope.outletLoading = false;
        })
      };

    $scope.mapsublocality = function (distance) {
        if(!$scope.outletData.distance){
           commonUtility.displayErrorMsg("Please enter distance");
           return;
        }
        $scope.outletLoading = true;
        $http.get('/operations/seller/update_sublocaity/?seller_id=' + $scope.selectOutlet.selected +'&distance='+$scope.outletData.distance)
        .success(function(response){
            $scope.outletLoading = false;
            commonUtility.displayErrorMsg(response.message);
        })
        .error(function(response){
            $scope.outletLoading = false;
            commonUtility.displayErrorMsg(response.message);
           
        })
    
    };

      $scope.searchZomatoURL = function() {
          $http.post('/operations/chains/outlets/get_lat_long/',{
              "url" : $scope.outletData.outletURL
          })
          .success(function(response){
              $rootScope.zomatoLatitute = response.latitude;
              $rootScope.zomatoLongitute = response.longitude;
              $scope.outletData.latitude=response.latitude;
              $scope.outletData.longitude=response.longitude;
              commonUtility.displayErrorMsg("Latitude & longitude found");
          })
          .error(function(response){
              commonUtility.displayErrorMsg(response.error + ' Select it using drop pin');
          })
      };

        $scope.confirmOutlet = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var localOutletDetails = JSON.parse(localStorage.getItem('outletData'));
            if(localOutletDetails!=null && localOutletDetails.outletName != "") {
              var confirm = $mdDialog.confirm()
                  .title('You were adding ' + localOutletDetails.outletName +', Do you wish to continue?')
                  .content('Your action would load saved outlet.')
                  .ariaLabel('Confirm')
                  .targetEvent(ev)
                  .ok('Confirm')
                  .cancel('Add New Outlet');
              $mdDialog.show(confirm).then(function () {
                getOutletData();
                $scope.outletCreationForm = true;
                addDefaultFeatures();
              }, function () {
                saveOutletData();
                $scope.outletCreationForm = true;
                addDefaultFeatures();
              });
            } else {
              $scope.initializeOutlet(ev);
              saveOutletData();
              $scope.outletCreationForm = true;
              addDefaultFeatures();
            }
        };

        function addDefaultFeatures(){
            $scope.selectedFeatures = [];
            $scope.selectedFeaturesID = [];
            angular.forEach($scope.availableFeatures,function(val,key){
                if(val.description == 'Client Order Id' || val.description == 'type_delivery_zone' || 
                    val.description == 'coid_mandatory' ){
                    $scope.selectedFeatures.push(val);
                    $scope.selectedFeaturesID.push(val.id);
                }
            })
        }

        $scope.merchantsConfig = {
            create: false,
            valueField: 'id',
            labelField: 'chain_name',
            sortDirection: 'asc',
            sortField: 'chain_name',
            searchField:'chain_name',
            onChange: function(value){
            // console.log('onChange', value)#commented
            },
            maxItems: 1,
            // required: true,
        }; 
        $scope.cityConfig={
            create: false,
            valueField: 'id',
            labelField: 'name',
            sortDirection: 'asc',
            sortField: 'name',
            searchField:'name',
            onChange: function(value){
            // console.log('onChange', value)#commented
            },
            maxItems: 1,
        };
        $scope.clusterConfig={
            create: false,
            valueField: 'id',
            labelField: 'cluster_name',
            sortDirection: 'asc',
            sortField: 'cluster_name',
            searchField:'cluster_name',
            onChange: function(value){
            // console.log('onChange', value)#commented
            },
            maxItems: 1,
        };
        $scope.sublocalityConfig = {
            create: false,
            valueField: 'id',
            labelField: 'sublocality',
            sortDirection: 'asc',
            sortField: 'sublocality',
            searchField:'sublocality',
            onChange: function(value){
            // console.log('onChange', value)#commented
            },
            maxItems: 1,
        }
        $scope.outletConfig={
            create: false,
            valueField: 'id',
            labelField: 'outlet_name',
            sortDirection: 'asc',
            sortField: 'outlet_name',
            searchField:'outlet_name',
            onChange: function(value){
            // console.log('onChange', value)#commented
            },
            maxItems: 1,
        };

        $scope.outletStatusConfig={
            create: false,
            valueField: 'id',
            labelField: 'name',
            sortDirection: 'desc',
            sortField: 'id',
            searchField:'name',
            onChange: function(value){
                // console.log('onChange', value)#commented
            },
            maxItems: 1,
        }

        $scope.initializeOutlet = function(ev) {
            $scope.outletData = {
                  outletCity: 0,
                  outletCluster: 0,
                  outletSublocality: '',
                  outletName: '',
                  outletURL: '',
                  outletAddress: '',
                  managerName: '',
                  managerEmail: '',
                  managerPhone: '',
                  shopName: '',
                  shopEmail: '',
                  shopPhone: '',
                  centralInvoicing: '',
                  invoiceEntity: '',
                  pocName: '',
                  pocEmail: '',
                  noOfOrders: '',
                  outletStatus: 1,
                  loginName: '',
                  dailyMails: '',
                  mailTo: [],
                  latitude: 0,
                  longitude: 0,
                  outletActivationDate:  new Date(),
                  storeCode : ''
            };
            $scope.usernameAvailable = true;
            $scope.updateOutlet = false;


            try{
                var merchantInvoicingDetails=undefined;
                if($scope.selectMerchant.selected.id !=undefined){
                    angular.forEach($scope.merchantList, function(value, key) {
                      if($scope.selectMerchant.selected.id == value.id){
                         merchantInvoicingDetails=value;
                      }
                      //console.log(key , ': ' , value);
                    });
                    if(merchantInvoicingDetails != undefined){
                        $scope.outletData.centralInvoicing = merchantInvoicingDetails.invoice_aggregation;
                        $scope.outletData.invoiceEntity = merchantInvoicingDetails.invoice_entity;
                        $scope.outletData.pocName = merchantInvoicingDetails.invoice_poc;
                        $scope.outletData.pocEmail = merchantInvoicingDetails.invoice_poc_email;
                        $scope.showLogin = merchantInvoicingDetails.order_processing
                    }
                }
            }catch(error){

            }
        };

      $scope.nextTab = function(value) {
          $scope.selectedIndex = value;
          if($scope.updateOutlet == false) {
            saveOutletData();
            }
      };

      $scope.backTab = function(value) {
          $scope.selectedIndex = value;
          if($scope.updateOutlet == false) {
              saveOutletData();
              $scope.outletData = JSON.parse(localStorage.getItem('outletData'));
        }
      };

      $scope.mailToSelection = function(id) {
            var optionId = $scope.outletData.mailTo.indexOf(id);
            if (optionId > -1) {
              $scope.outletData.mailTo.splice(optionId, 1);
            }
            else {
              $scope.outletData.mailTo.push(id);
            }
      };
      $scope.exists = function (item, list) {
        return list ? list.indexOf(item) > -1 : false;
      };
        $scope.getMerchantInvoicingDetails = function(merchantInvoicingDetails) {
            if(merchantInvoicingDetails){
                $scope.selectCity={};
                $scope.selectOutletStatus = {};
                angular.forEach($scope.merchantList, function(value, key) {
                  if(merchantInvoicingDetails == value.id){
                     merchantInvoicingDetails=value;
                  }
                });
                if(merchantInvoicingDetails != undefined){
                    $scope.outletData.centralInvoicing = merchantInvoicingDetails.invoice_aggregation;
                    $scope.outletData.invoiceEntity = merchantInvoicingDetails.invoice_entity;
                    $scope.outletData.pocName = merchantInvoicingDetails.invoice_poc;
                    $scope.outletData.pocEmail = merchantInvoicingDetails.invoice_poc_email;
                    $scope.showLogin = merchantInvoicingDetails.order_processing
                }

                $scope.getCityList();
            }
      };

        function decimalPlaces(num) {
            var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
            if (!match) { return 0; }
            return Math.max(
                0,
                // Number of digits right of decimal point.
                (match[1] ? match[1].length : 0)
                // Adjust for scientific notation.
                - (match[2] ? +match[2] : 0)
            );
        }
        var outlet_promise = undefined;
        $scope.$watch('outletData.longitude', function(nv){
            if(nv){
                if(decimalPlaces(nv) >= 3 && $scope.outletData.latitude){
                    $scope.merchantsLoading = false;
                    if(outlet_promise){
                        outlet_promise.resolve();
                    }
                    if($scope.checkGeofenceCity($scope.selectCity.selected)){
                        outlet_promise = $scope.getClusterFromLocation($scope.outletData.latitude, $scope.outletData.longitude);
                    }
                }
            }
        });

        $scope.$watch('outletData.latitude', function(nv){
            if(nv){
                if(decimalPlaces(nv) >= 3 && $scope.outletData.longitude){
                    $scope.outletLoading = false;
                    if(outlet_promise){
                        outlet_promise.resolve();
                    }
                    if($scope.checkGeofenceCity($scope.selectCity.selected)){
                        outlet_promise = $scope.getClusterFromLocation($scope.outletData.latitude, $scope.outletData.longitude);
                    }
                }
            }
        });
        $scope.getClusterFromLocation = function(latitude, longitude, flag){
            $scope.outletLoading = true;
            var defer = $q.defer();
            $scope.citiesFrom = [];
            $scope.clustersFrom = [];
            $scope.selected_city_cache = angular.copy($scope.outletData.outletCity);
            $scope.selected_cluster_cache = angular.copy($scope.outletData.outletCluster);

            $http.get('cluster/get/',{
                params: {
                    'latitude': latitude,
                    'longitude': longitude
                },
                timeout: defer.promise
            }).success(function(response){
                $scope.outletLoading = false;
                if(response.cluster == null){
                    commonUtility.displayErrorMsg("Cluster not found with given coordinates. Please create a cluster first");
                    return;
                }
                $scope.citiesFrom = [{"id": response.cluster.city_id, "name": response.cluster.city_name}];
                $scope.clustersFrom = [{"id": response.cluster.cluster_id, "cluster_name": response.cluster.cluster_name}]
                $scope.outletData.outletCity = {selected: response.cluster.city_id} ;
                $scope.outletData.outletCluster = {selected: response.cluster.cluster_id};
                defer.resolve();
            }).error(function(error){
                $scope.outletLoading = false;
                commonUtility.displayErrorMsg(error);

            });
            return defer;
        }

      $scope.getOutletList = function(city_id,status) {
            $scope.outletCreationForm=false;
          $scope.outletLoading = true;
            $scope.initializeOutlet();
            $scope.selectOutlet = {};
            if ($scope.outletDetailsForm){
                $scope.outletDetailsForm.$setPristine();
            }
            $scope.nextTab(0);
          $http.get('/operations/chains/outlets/',{
              params: {
                  chain_id: $scope.selectMerchant.selected.id!=undefined ? $scope.selectMerchant.selected.id:null,
                  city: city_id,
                  status : status == 2 ? null : status
              }
          })
          .success(function(response,status,headers){
              $scope.outletList = response.outlet_list; 
              $scope.outletLoading = false;
              if($scope.outletList.length == 0)
                commonUtility.displayErrorMsg("No outlets are available");
          })
          .error(function(response,status,headers){
              commonUtility.displayErrorMsg("Error in fetching outlet list");
              $scope.outletLoading = false;
          })

      };

      $scope.serachMerchants = function(name){
            $scope.merchantsLoading = true;
            return $http.get('/operations/chains/active_chains/?name='+name).then(function( response ){
                response = response.data;
                $scope.merchantList = response.chains;
                $scope.outletStatus = response.status_choice;
                $scope.dailyMails = response.daily_mails_options;
                $scope.availableFeatures = response.available_features;
                $scope.mailToOptions = response.mail_to;
                $scope.merchantsLoading = false;
                $scope.place_of_supply_options = response.state_list;
                return response.chains
            }).catch(function(err){
                commonUtility.displayErrorMsg("Error in fetching chain list");
                $scope.merchantsLoading = false;
            })
      }

      $scope.getMerchants = function() {
          $scope.outletLoading = true;
          $http.get('/operations/chains/active_chains/?')
          .success(function(response,status,headers){
              //$scope.cityList = response.city; 
              $scope.merchantList = response.chains;
              $scope.outletStatus = response.status_choice;
              $scope.dailyMails = response.daily_mails_options;
              $scope.availableFeatures = response.available_features;
              $scope.mailToOptions = response.mail_to;
              $scope.outletLoading = false;
              $scope.place_of_supply_options = response.state_list;
          })
          .error(function(response,status,headers){
              commonUtility.displayErrorMsg("Error in fetching city list");
              $scope.outletLoading = false;
          });
      };

      $scope.getCityList = function(){
        $http.get('/operations/cities/info/',{
            params:{
                chain_id:$scope.selectMerchant.selected.id
            }
        }).then(function(response){

            $scope.cityList = response.data ? (response.data.cities_info ? response.data.cities_info : []) : [];

        }).catch(function(error){

        });
      }
    $scope.usernameTimeout = undefined;
    $scope.$watch('outletData.outletName',function(nv){

        if(!$scope.updateOutlet){
            if($scope.outletData){
                $scope.outletData.loginName = nv.replace(/ /g,'').toLowerCase();
                if($scope.usernameTimeout){
                    clearTimeout($scope.usernameTimeout);
                }
                $scope.usernameTimeout = setTimeout(function(){
                    $scope.checkAvailability();
                },2000);
                
            }
        }

    });

      //http call for creating new outlet
      $scope.addOutlet = function() {
        $scope.outletLoading = true;
        $http.post('/operations/chains/outlets/0/',{
            "activation_date": $scope.outletData.outletActivationDate,
            "outlet_name": $scope.outletData.outletName,
            "status": $scope.outletData.outletStatus,
            "outlet_status":1,
            "cluster": $scope.outletData.outletCluster.selected ? $scope.outletData.outletCluster.selected : null,
            "manager_email": $scope.outletData.managerEmail,
            "manager_phone": $scope.outletData.managerPhone,
            "manager_name": $scope.outletData.managerName,
            "invoice_entity": $scope.outletData.invoiceEntity,
            "invoice_poc": $scope.outletData.pocName,
            "city": $scope.outletData.outletCity.selected ? $scope.outletData.outletCity.selected : null,
            "invoice_poc_email": $scope.outletData.pocEmail,
            "approx_order_count": $scope.outletData.noOfOrders,
            "outlet_url": $scope.outletData.outletURL,
            "user_name": $scope.outletData.loginName,
            "daily_mails": $scope.outletData.dailyMails,
            "mail_to": $scope.outletData.mailTo,
            "chain":  $scope.selectMerchant.selected.id!=undefined ? $scope.selectMerchant.selected.id:null,
            "shop_email": $scope.outletData.shopEmail,
            "shop_phone": $scope.outletData.shopPhone,
            "shop_name": $scope.outletData.outletName,
            "features" : $scope.selectedFeaturesID,
            "store_code": $scope.outletData.storeCode,
            "address": {
             "building_number": $scope.outletData.outletAddress,
             "sublocality": $scope.outletData.outletSublocality.selected ? $scope.outletData.outletSublocality.selected: null,
             "latitude": $scope.outletData.latitude != 0? $scope.outletData.latitude : $rootScope.zomatoLatitute,
             "longitude": $scope.outletData.longitude != 0? $scope.outletData.longitude : $rootScope.zomatoLongitute,
             "city": $scope.outletData.outletCity.selected,
             "pincode": $scope.outletData.pincode,
             "state": $scope.outletData.state,
            }
        })
        .success(function(response){
            commonUtility.displayErrorMsg("Outlet created successfully");
            $scope.outletLoading = false;
            localStorage.removeItem('outletData');
            $scope.selectedIndex = 0;
            $scope.initializeOutlet();
            $scope.outletDetailsForm.$setPristine();
            $scope.outletDetailsForm.$setUntouched();
            $scope.outletDetailsForm.$submitted = false;
            $scope.outletData.loginName = undefined;
            $scope.checkUsernameMessage = undefined;
            $scope.checkStoreCodeMessage = undefined;

        })
        .error(function(response) {
            $scope.outletLoading = false;
            if(response && typeof(response.message)  == 'object'){
                var key_val = "";
                angular.forEach(response.message,function(val,key){
                    key_val = key;
                });
                commonUtility.displayErrorMsg(key_val+' '+response.message[key_val]);
                return;
            }
            commonUtility.displayErrorMsg('Technical problem in adding outlet ' + response.message);
        })
      };

      $scope.checkAvailability = function(tab) {
            $scope.outletLoading = true;
            $http.get('/operations/validate-username/',{
                params: {
                    username: $scope.outletData.loginName
                }
            })
            .success(function(response){
                $scope.checkUsernameMessage = "Username available";
                $scope.usernameAvailable = false;
                $scope.outletLoading = false;
            })
            .error(function(response){
                $scope.checkUsernameMessage = "Username doesn't available";
                $scope.outletLoading = false;
                $scope.usernameAvailable = true;
            })
      };
      $scope.is_store_code_available = undefined;
      $scope.checkStoreCode = function(tab) {
            if($scope.outletData.storeCode != undefined && $scope.outletData.storeCode != ''){
                $scope.outletLoading = true;
                $http.get('/operations/validate-storecode/',{
                    params: {
                        store_code: $scope.outletData.storeCode
                    }
                }).then(function(response){
                    response = response.data;
                    if(response.flag == 0){
                        $scope.checkStoreCodeMessage = response.message;
                        $scope.is_store_code_available = true;
                    }
                    else{
                        $scope.checkStoreCodeMessage = response.message;
                        $scope.is_store_code_available = false;
                    }
                    
                    $scope.outletLoading = false;
                })
                .catch(function(response){
                    $scope.is_store_code_available = false;
                    $scope.checkStoreCodeMessage = response['data']['message'] ? response['data']['message'] : "Store code doesn't available";
                    $scope.outletLoading = false;
                    //$scope.usernameAvailable = true;
                });
            }else{
                $scope.is_store_code_available = undefined;
            }
      };

        $scope.getOutletDetails = function() {
            if($scope.selectOutlet.selected !=undefined){
                $scope.outletId = $scope.selectOutlet.selected!=undefined ? $scope.selectOutlet.selected:null;
                $scope.selectedFeatures = [];
                $scope.selectedFeaturesID = [];
                $scope.outletLoading = true;
                if ($scope.outletDetailsForm){
                    $scope.outletDetailsForm.$setPristine();
                }
                $http.get('/operations/chains/outlets/' + $scope.outletId + '/')
                .success(function(response){
                    $scope.outletLoading = false;
                    $scope.outletDetails = response;
                    $scope.outletData = {
                        outletCity:{'selected': $scope.outletDetails.city},
                        outletCluster:{'selected':$scope.outletDetails.cluster},
                        outletSublocality:{'selected': $scope.outletDetails.address ? $scope.outletDetails.address.sublocality : undefined},
                        outletActivationDate: $scope.outletDetails.activation_date,
                        outletName: $scope.outletDetails.outlet_name,
                        outletAddress: $scope.outletDetails.address ? $scope.outletDetails.address.building_number: null,
                        managerName: $scope.outletDetails.manager_name,
                        managerEmail: $scope.outletDetails.manager_email,
                        managerPhone: $scope.outletDetails.manager_phone,
                        shopName: $scope.outletDetails.shop_name,
                        shopEmail: $scope.outletDetails.shop_email,
                        shopPhone: $scope.outletDetails.shop_phone,
                        centralInvoicing: $scope.outletDetails.invoice_aggregation,
                        invoiceEntity: $scope.outletDetails.invoice_entity,
                        pocName: $scope.outletDetails.invoice_poc,
                        pocEmail: $scope.outletDetails.invoice_poc_email,
                        noOfOrders: $scope.outletDetails.approx_order_count,
                        outletStatus: $scope.outletDetails.outlet_status,
                        loginName: $scope.outletDetails.user_name,
                        dailyMails: $scope.outletDetails.daily_mails == true?'1':'0',
                        mailTo: $scope.outletDetails.mail_to,
                        latitude: $scope.outletDetails.address ? $scope.outletDetails.address.latitude : 0,
                        longitude: $scope.outletDetails.address ? $scope.outletDetails.address.longitude : 0,
                        pincode: $scope.outletDetails.address ? $scope.outletDetails.address.pincode: undefined,
                        state: $scope.outletDetails.address ? $scope.outletDetails.address.state: undefined,
                        outletURL: $scope.outletDetails.outlet_url,
                        outletStatus: $scope.outletDetails.status,
                        storeCode: $scope.outletDetails.store_code
                    };
                    $rootScope.zomatoLatitute = $scope.outletDetails.address? $scope.outletDetails.address.latitude: 0;
                    $rootScope.zomatoLongitute = $scope.outletDetails.address ? $scope.outletDetails.address.latitude : 0;
                    $rootScope.outletLat = $scope.outletDetails.address? $scope.outletDetails.address.latitude : 0;
                    $rootScope.outletLong = $scope.outletDetails.address ? $scope.outletDetails.address.longitude : 0;
                    if($scope.outletDetails.store_code)
                        $scope.is_store_code_available = true;
                    angular.forEach($scope.availableFeatures, function(value, key){
                        if($scope.outletDetails.features.indexOf(value.id) > -1){
                            $scope.selectedFeatures.push({
                                "id": value.id,
                                "description": value.description
                            });
                            $scope.selectedFeaturesID.push(value.id);
                        }
                    });

                    

                    if($scope.outletData.latitude &&  $scope.outletData.longitude && $scope.outletData.latitude != 0 && $scope.outletData.longitude != 0){
                        $scope.outletData.distance = 4;
                        if($scope.checkGeofenceCity($scope.outletData.outletCity.selected) == -1){
                         $scope.getClusterFromLocation($scope.outletData.latitude,  $scope.outletData.longitude, true);
                        }else{
                            $scope.cityToCluster();
                        }
                    }
                    $scope.updateOutlet = true;
                    $scope.outletCreationForm = true;
                })
                .error(function(response){
                    $scope.outletLoading = false;
                    commonUtility.displayErrorMsg("There is Technical problem in fetching outlet details " + response.error);
                })
            }
          
        };

      $scope.updateOutletDetails = function() {
          $scope.outletLoading = true;
          $http.put('/operations/chains/outlets/' + $scope.outletId + '/',{
            "activation_date": new Date($scope.outletData.outletActivationDate),
            "outlet_name": $scope.outletData.outletName,
            "status": $scope.outletData.outletStatus,
            "cluster": $scope.outletData.outletCluster.selected,
            "manager_email": $scope.outletData.managerEmail,
            "manager_phone": $scope.outletData.managerPhone,
            "manager_name": $scope.outletData.managerName,
            "invoice_entity": $scope.outletData.invoiceEntity,
            "invoice_poc": $scope.outletData.pocName,
            "city": $scope.outletData.outletCity.selected,
            "invoice_poc_email": $scope.outletData.pocEmail,
            "approx_order_count": $scope.outletData.noOfOrders,
            "outlet_url": $scope.outletData.outletURL,
            "user_name": $scope.outletData.loginName,
            "daily_mails": $scope.outletData.dailyMails,
            "mail_to": $scope.outletData.mailTo,
            "chain":  $scope.selectMerchant.selected.id!=undefined ? $scope.selectMerchant.selected.id:null,
            "shop_email": $scope.outletData.shopEmail,
            "shop_phone": $scope.outletData.shopPhone,
            "shop_name": $scope.outletData.outletName,
            "features" : $scope.selectedFeaturesID,
            "store_code": $scope.outletData.storeCode,
            "address": {
             "building_number": $scope.outletData.outletAddress,
             "sublocality": $scope.outletData.outletSublocality.selected,
             "latitude": $scope.outletData.latitude != 0? $scope.outletData.latitude : $rootScope.zomatoLatitute,
             "longitude": $scope.outletData.longitude != 0? $scope.outletData.longitude : $rootScope.zomatoLongitute,
             "city": $scope.outletData.outletCity.selected,
             "pincode": $scope.outletData.pincode ? $scope.outletData.pincode : null,
             "state": $scope.outletData.state ? $scope.outletData.state : null
         }
        })
        .success(function(response){
            commonUtility.displayErrorMsg("Outlet updated successfully");
            $scope.outletLoading = false;
        })
        .error(function(response){
            $scope.outletLoading = false;
            if(response && typeof(response.message)  == 'object'){
                var key_val = "";
                angular.forEach(response.message,function(val,key){
                    key_val = key;
                });
                commonUtility.displayErrorMsg(key_val+' '+response.message[key_val]);
                return;
            }
            commonUtility.displayErrorMsg(response.message ? response.message: "There is a error in updating outlet " + response.error);
        })          
      };

      $scope.outletMapDialog = function(ev) {
        $mdDialog.show({ 
          controller: outletMapController,
          templateUrl: 'outlet-coordinates',
          targetEvent: ev,
          locals: {
                parent: $scope
          },   
          clickOutsideToClose:true
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.checkGeofenceCity = function(city){
        return $scope.geofence_cities.indexOf(parseInt(city)) != -1 ? true : false;
    };
    $scope.$on('init:outlets',function(){
        $scope.initializeOutlet();
        $scope.intializeFilters();
        $scope.outletCreationForm=false;
        // $scope.getMerchants();
        $scope.nextTab(0);
        $http.get('/operations/cities/info/').then(function(response){
            $scope.outletCityList = response.data ? (response.data.cities_info ? response.data.cities_info : []) : [];
            $scope.geofence_cities =  response.data ? ( response.data.geofence_cities): [];
        }).catch(function(error){
        });
    });
})

.controller ('merchantDiscountsController',function($scope,isSuperUser,Ops_user, role,$http,commonUtility,$filter){
   
    function init(){
        $scope.merchantType = 0;
        $scope.newMerchantDetails={};
        $scope.initDate = new Date();
        $scope.format = 'yyyy-MM-dd';
        $scope.startMinDate = new Date();
        $scope.endMinDate = $scope.startMinDate;
        $scope.merchantDetails ={};
        $scope.merchantList = [];
        $scope.discounts=[];
        $scope.salesPocList=[];
        $scope.generatePromoCode = generatePromoCode;
        $scope.merchants ={};
    }
    init();
    $scope.open = function($event,type) {
        $event.preventDefault();
        $event.stopPropagation();
        if(type == 'start')
            $scope.startDateOpened = true;
        else
            $scope.endDateOpened = true;
    };

    $scope.pocConfig = {
        create: false,
        valueField: 'id',
        labelField: 'user__first_name',
        sortDirection: 'asc',
        sortField: 'user__first_name',
        searchField:'user__first_name',
        onChange: function(value){
        // console.log('onChange', value)#commented
        },
        maxItems: 1,
        // required: true,
    };
    $scope.merchantConfig = {
        create: false,
        valueField: 'id',
        labelField: 'chain_name',
        sortDirection: 'asc',
        sortField: 'chain_name',
        searchField:'chain_name',
        onChange: function(value){
        // console.log('onChange', value)#commented
        },
        maxItems: 1,

    };
    $scope.dateOptions = {
        formatYear: 'yy',
        initDate: $scope.initDate,
        startingDay: 1,
    };
    $scope.$watch('startDate',function(newval,oldval){
            $scope.endDate = undefined;
            $scope.endMinDate = $scope.startDate;
    });
    $scope.$watch('merchants.startDate',function(nv,ov){
            $scope.merchants.endDate = undefined;
            $scope.endMinDate = $scope.merchants.startDate;
    });
    $scope.getMerchantList = function() {
        $scope.discountLoading = true;
        $http.get('/operations/chains/list/')
        .success(function(response){
            $scope.merchantList = response;
            $scope.discountLoading = false;
        })
        .error(function(response){
            $scope.discountLoading = false;
        })
    };
    $scope.fetchDropdowndata = function() {
          // http request for fetching dropdown data
        $http.get('/operations/chains/filter-lists/')
        .success(function(response){
            $scope.dropdownData = response;
            $scope.salesPocList = $scope.dropdownData.sales_poc;
        })
        .error(function(response){

        })
    };
    function generatePromoCode(){
        $scope.discountLoading = true;
        //$scope.newMerchantDetails.merchant_type = "new";
        $scope.newMerchantDetails.end_date = $filter('date')($scope.endDate, "yyyy-MM-dd");
        $scope.newMerchantDetails.start_date = $filter('date')($scope.startDate, "yyyy-MM-dd");
        console.log($scope.newMerchantDetails);
        $http.post('/operations/promo/generate/',{
            promo_data:$scope.newMerchantDetails,
            merchant_type : 'new'
        }).success(function(response){  
            $scope.discountLoading = false;
            $scope.newMerchantDetails ={};
            $scope.startDate = undefined;
            $scope.endDate = undefined;
            commonUtility.displayErrorMsg(response.message ? response.message: response);
        }).error(function(response){
            $scope.discountLoading = false;
            commonUtility.displayErrorMsg(response.message ? response.message: response);
        });
    }

    $scope.getDiscountHistory = function(id){
        angular.forEach($scope.merchantList,function(value,key){
            if(value.id == id){
                $scope.selectedMerchantName = value.chain_name.split(":")[0];
            }
        });
        $scope.discountHistory  = [];
        $scope.discountLoading = true;
        $http.get('operations/merchant/'+id+'/discount/history/')
        .success(function(response){
            $scope.discountLoading = false;
            $scope.discountHistory = response;
        }).error(function(response){
            $scope.discountLoading = false;
            commonUtility.displayErrorMsg(response.message ? response.message: response);
        });
    }

    $scope.applyDiscount = function(){

        $scope.merchantDetails.end_date = $filter('date')($scope.merchants.endDate, "yyyy-MM-dd");
        $scope.merchantDetails.start_date = $filter('date')($scope.merchants.startDate, "yyyy-MM-dd");
        console.log($scope.merchantDetails);
        $scope.discountLoading = true;
        $http.post('/operations/promo/generate/',{
            promo_data:$scope.merchantDetails,
            merchant_type : 'existing'
        }).success(function(response){  
            $scope.discountHistory =[];
            $scope.discountLoading = false;
            $scope.merchantDetails ={};
            $scope.merchants ={};
            commonUtility.displayErrorMsg(response.message ? response.message: response);
        }).error(function(response){
            $scope.discountLoading = false;
            commonUtility.displayErrorMsg(response.message ? response.message: response);
        });
    }
    $scope.$on('init:discounts',function(){
        init();
        $scope.getMerchantList();
        $scope.fetchDropdowndata();
    });    
    

})
.controller('merchantApprovalController', function($scope, $timeout, $mdSidenav, $mdUtil, $log, $http, clusters, $mdToast, $document,$mdDialog) { 

    /*variable definition for filters start*/
      $scope.intializeFilters = function() {
          $scope.selectMerchant = {};
          $scope.selectCity = {};
          $scope.selectStatus = {};
          $scope.fetchOutlets();
      }
    /*end*/
    $scope.merchantList=[];
    $scope.cityList=[];
    $scope.merchantsConfig = {
        create: false,
        valueField: 'id',
        labelField: 'chain_name',
        sortDirection: 'asc',
        sortField: 'chain_name',
        searchField:'chain_name',
        onChange: function(value){
        // console.log('onChange', value)#commented
        },
        maxItems: 1,
        // required: true,
    };
    $scope.cityConfig = {
        create: false,
        valueField: 'id',
        labelField: 'name',
        sortDirection: 'asc',
        sortField: 'name',
        searchField:'name',
        onChange: function(value){
        // console.log('onChange', value)#commented
        },
        maxItems: 1,
        // required: true,
    };
    // Pagination defaults.
    $scope.pagination = {
        maxWindowSize: 10,
        itemsPerPage: 15,
        currentPage: 1
    };
    $scope.cityList = [];
   
    $scope.getCityList = function() {
          $scope.outletLoading = true;
          $http.get('/operations/chains/active_chains/')
          .success(function(response,status,headers){
              //$scope.cityList = response.city; 
              $scope.merchantList = response.chains;
              $scope.outletLoading = false;
          })
          .error(function(response,status,headers){
              commonUtility.displayErrorMsg("Error in fetching city list");
              $scope.outletLoading = false;
          })
    };

    $scope.serachMerchants = function(name){
        $scope.merchantsLoading = true;
        return $http.get('/operations/chains/active_chains/?name='+name)
        .then(function( response ){
            $scope.merchantsLoading = false;
            response = response.data;
            $scope.merchantList = response.chains;
            return response.chains
        }).catch(function(err){
            commonUtility.displayErrorMsg("Error in fetching chain list");
            $scope.merchantsLoading = false;
        })
  }
    // $scope.getCityList();

    $scope.statusList = [
        {
            "id": 0,
            "name": 'Pending'
        },
        {
            "id": 1,
            "name": 'Approved'
        },
        {
            "id": 2,
            "name": 'Rejected'
        }
    ];

    $scope.feasibilityDialog = function(ev, outlet) {
        $mdDialog.show({ 
          locals: {
            outletID : outlet.id,
            outletStatus:outlet.display_status,
            role:$scope.role
          },
          controller: feasibilityController,
          templateUrl: 'merchant-feasibility',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
      })
        .then(function(answer) {
            $scope.fetchOutlets();
          $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
          $scope.status = 'You cancelled the dialog.';
      });
    };

    $scope.fetchOutlets = function() {
        $scope.outletLoading = true;
        $http.get('/operations/chains/approvals/',{
            params : { 
                chain: $scope.selectMerchant.selected !=undefined ? $scope.selectMerchant.selected.id:null,
                status: $scope.selectStatus.selected!=undefined ? $scope.selectStatus.selected:null,
                city: $scope.selectCity.selected!=undefined ? $scope.selectCity.selected:null,
                page: $scope.pagination.currentPage,
                limit: $scope.pagination.itemsPerPage
            }
        })
        .success(function(response){
            $scope.outletLoading = false;
            $scope.pagination.totalItems = response.count;
            $scope.outletList = response.data;
        })
        .error(function(response){
            $scope.outletLoading = false;
            commonUtility.displayErrorMsg("Error in fetching outlet list");
        })
    };

    $scope.$on('get:outlets', function() {
        $scope.intializeFilters();
        // $scope.getCityList();
        $http.get('cities/info').success(function(response){
            $scope.cityList = response.cities_info;
        }).error(function(error){

    });

    });
})
.controller('slabController',function($scope, $http){
    $scope.$on('get:slabInitiate', function() {
      $scope.kmCheck = true;
      $scope.editstart = false;
      $scope.slab_seller = $scope.slab_options = '';
      $scope.slab_seller.seller_id = '';
      $scope.sellers = null;
      $scope.deactivestart = false;
      $scope.clearFields();
      $scope.getsellers();
    });

    // $scope.getsellers = function(){
    //   $scope.slabLoading = true;
    //   $http.get('/payments/seller/seller_city_list/')
    //     .success(function(response){
    //       $scope.slabLoading = false;
    //       $scope.sellers = response ? response.seller_list : null;
    //     })
    //     .error(function(data) {
    //       $scope.slabLoading = false;
    //     });
    // };

    $scope.$watch('slab_seller', function(value){
      $scope.errormsg = '';
      if(value){
        $scope.slab_options = '';
        $scope.editstart = false;
        $scope.clearFields();
        $scope.getsellerslab();
      }
    });

    $scope.$watch('slab_options', function(value){
      if(value){
        $scope.errormsg = '';
        // if(!$scope.slab_seller){
        //   $scope.errormsg = 'Select Seller';
        //   $scope.slab_options = '';
        //   return false;
        // }
        $scope.clearFields();
        if($scope.currentslab && $scope.editstart == false){
          $scope.setSlab();  
        }
      }
    });

    $scope.getsellerslab = function(){
      $scope.currentslab = null;
      $scope.slabLoading = true;
      $http.get('/payments/seller/slabs/create/?seller_id='+$scope.slab_seller.seller_id)
        .success(function(response){
          $scope.slabLoading = false;
          if(response && response.status == "success"){
            $scope.currentslab = response;
            $scope.slab_options = response.slab_type.toString().replace(/ /g,'').toLowerCase();

          }else if(response && response.status == 'NO_SAVED_SLABS'){

            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = false;

          }
          else{
            $scope.errormsg = response ? response.error_msg : 'There is some error over fetching rate card.';
          }
        })
        .error(function(data) {
          $scope.slabLoading = false;
          var error = data;
        });
    };

    $scope.Editratecard = function()
    {
      $scope.editstart = true;
      if($scope.slab_options == 'max')
      {
        $scope.models.MAX.isdisabled = false; 
        $scope.ismoqDaily = false;
        $scope.ismoqMonthly = false;
      }
      else if($scope.slab_options == 'distance')
      {
        $scope.models.Distance.isdisabled = false; 
        $scope.ismoqDaily = false;
        $scope.ismoqMonthly = false;
      }
      else if($scope.slab_options == 'ordervalue')
      {
        $scope.models.Ordervalue.isdisabled = false; 
        $scope.ismoqDaily = false;
        $scope.ismoqMonthly = false;
      }
      else if($scope.slab_options == 'fixedrate')
      {
        $scope.models.FlatRate.isdisabled = false; 
        $scope.ismoqDaily = false;
        $scope.ismoqMonthly = false;
      }
      
    };

  
    $scope.setSlab = function()
    {
      var slab = $scope.currentslab;
      $scope.editstart = $scope.editstart == true ? true : false;
      
      if($scope.slab_options == 'max')
      {
        $scope.models.MAX.moqcheck = slab.moq == 0 ? false : true;
        $scope.models.MAX.moq_type = slab.moq_type == "moq_daily" ? "moq_daily" : "moq_monthly";
        $scope.models.MAX.moq_charge = slab.moq_charge || '';
        $scope.models.MAX.moq_count = slab.moq_count || '';
        $scope.models.MAX.date = slab.date || '';
        $scope.models.MAX.upto_km = slab.data[0].upto_km || '';
        $scope.models.MAX.fixed_cost = slab.data[0].fixed_cost || '';
        $scope.models.MAX.perc_order = slab.data[0].percentage || '';
        $scope.models.MAX.per_km = slab.data[1].per_km || '';
        $scope.models.MAX.isdisabled = $scope.editstart == true ? false : true;

        if($scope.models.MAX.moq_type=="moq_monthly"){
            $scope.ismoqDaily = true;
            $scope.ismoqMonthly = false;
          }
          else if($scope.models.MAX.moq_type=="moq_daily"){
            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = true;
          }
          else
          {
            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = false;
          }
        
      }
      else if($scope.slab_options == 'distance')
      {
        $scope.models.Distance.moqcheck = slab.moq == 0 ? false : true;
        $scope.models.Distance.moq_type = slab.moq_type == "moq_daily" ? "moq_daily" : "moq_monthly";
        $scope.models.Distance.moq_charge = slab.moq_charge || '';
        $scope.models.Distance.moq_count = slab.moq_count || '';
        $scope.models.Distance.date = slab.date || '';
        $scope.models.Distance.upto_km = slab.data[0].upto_km || '';
        $scope.models.Distance.fixed_cost = slab.data[0].fixed_cost || '';
        $scope.models.Distance.per_km = slab.data[1].per_km || '';
        $scope.models.Distance.upto_km_2 = slab.data[1].upto_km || '';
        $scope.models.Distance.fixed_cost_2 = slab.data[1].fixed_cost || '';
        $scope.models.Distance.isdisabled = $scope.editstart == true ? false : true;
        if($scope.models.Distance.moq_type=="moq_monthly"){
            $scope.ismoqDaily = true;
            $scope.ismoqMonthly = false;
          }
          else if($scope.models.Distance.moq_type=="moq_daily"){
            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = true;
          }
          else
          {
            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = false;
          }
      }
      else if($scope.slab_options == 'ordervalue')
      {
        $scope.models.Ordervalue.moqcheck = slab.moq == 0 ? false : true;
        $scope.models.Ordervalue.moq_type = slab.moq_type == "moq_daily" ? "moq_daily" : "moq_monthly";
        $scope.models.Ordervalue.moq_charge = slab.moq_charge || '';
        $scope.models.Ordervalue.moq_count = slab.moq_count || '';
        $scope.models.Ordervalue.date = slab.date || '';
        $scope.models.Ordervalue.percentage = slab.data[0].percentage || '';
        $scope.models.Ordervalue.isdisabled = $scope.editstart == true ? false : true;

        if($scope.models.Ordervalue.moq_type=="moq_monthly"){
            $scope.ismoqDaily = true;
            $scope.ismoqMonthly = false;
          }
          else if($scope.models.Ordervalue.moq_type=="moq_daily"){
            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = true;
          }
          else
          {
            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = false;
          }
      }
      else if($scope.slab_options == 'fixedrate')
      {
        $scope.models.FlatRate.moqcheck = slab.moq == 0 ? false : true;
        $scope.models.FlatRate.moq_type = slab.moq_type == "moq_daily" ? "moq_daily" : "moq_monthly";
        $scope.models.FlatRate.moq_charge = slab.moq_charge || '';
        $scope.models.FlatRate.moq_count = slab.moq_count || '';
        $scope.models.FlatRate.date = slab.date || '';
        $scope.models.FlatRate.fixed_cost = slab.data[0].fixed_cost || '';
        $scope.models.FlatRate.isdisabled = $scope.editstart == true ? false : true;
        $scope.models.FlatRate.percentage = slab.data[0].percentage || '';
        $scope.models.FlatRate.per_check = $scope.models.FlatRate.percentage ? true : false;

        if($scope.models.FlatRate.moq_type=="moq_monthly"){
            $scope.ismoqDaily = true;
            $scope.ismoqMonthly = false;
          }
          else if($scope.models.FlatRate.moq_type=="moq_daily"){
            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = true;
          }
          else
          {
            $scope.ismoqDaily = false;
            $scope.ismoqMonthly = false;
          }
      }
    };

    $scope.clearFields = function(){
      $scope.models = {
        'MAX':{            
          'moqcheck':false,
          'moq_type':null,
          'moq_charge':null,
          'moq_count':null,
          'date' : {
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate()+6))
          },
          'upto_km': null,
          'fixed_cost':null,
          'perc_order':null,
          'per_km': null,
          'isdisabled': false
        },
        'Distance':{
          'moqcheck':false,
          'moq_type':null,
          'moq_charge':null,
          'moq_count':null,
          'date' : {
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate()+6))
          },
          'upto_km': null,
          'fixed_cost':null,
          'upto_km_2': null, 
          'fixed_cost_2':null,
          'per_kmcheck':true,
          'per_km': null,
          'isdisabled': false
        },
        'Ordervalue':{
          'moqcheck':false,
          'moq_type':null,
          'moq_charge':null,
          'moq_count':null,
          'date' : {
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate()+6))
          },
          'percentage': null,
          'isdisabled': false
        },
        'FlatRate':{
          'moqcheck':false,
          'moq_type':null,
          'moq_charge':null,
          'moq_count':null,
          'date' : {
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate()+6))
          },
          'fixed_cost': null,
          'per_check': false,
          'percentage': null,
          'isdisabled': false
        }
      };
    };

    $scope.updateratecard = function(){
        $scope.errormsg = '';
        if(validateparams() == false){
            return false;
        }
        var params = $scope.getparams();  
        $scope.slabLoading = true;
        $http.post('/payments/seller/slabs/create/',params)
        .success(function(response){
            $scope.slabLoading = false;
            if(response.status == 'success'){
                alert(response.msg);
                $scope.slab_options = '';
                $scope.editstart = false;
                $scope.clearFields();
                $scope.getsellerslab();
            }
            else if(response.status == 'ValidationError'){
                alert(response.error_msg);
            }
        })
        .error(function(data) {
            $scope.slabLoading = false;
            $scope.errormsg = 'There is some techincal error occured while updating card.'
        });
    };

    var highlightError = function(modelvalue){
      angular.element(angular.element('[ng-model="'+modelvalue+'"]')[0]).addClass('b-error-color');
    };

    var validateparams = function()
    { 
      var emptymessage = 'Please enter value';
      var coorectvaluemessage = 'Please enter valid value';
      var moqtypevalidationmessage = 'Please check daily or monthly value';
      angular.element('.b-error-color').removeClass('b-error-color');
      if($scope.slab_options == 'max')
      {
        if(!$scope.models.MAX.upto_km) { highlightError('models.MAX.upto_km'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.MAX.upto_km == 0) { highlightError('models.MAX.upto_km'); $scope.errormsg = coorectvaluemessage; return false; }
        if(!$scope.models.MAX.fixed_cost) { highlightError('models.MAX.fixed_cost'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.MAX.fixed_cost == 0) { highlightError('models.MAX.fixed_cost'); $scope.errormsg = coorectvaluemessage; return false; }
        if(!$scope.models.MAX.perc_order) { highlightError('models.MAX.perc_order'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.MAX.perc_order == 0) { highlightError('models.MAX.perc_order'); $scope.errormsg = coorectvaluemessage; return false; }
        if($scope.models.MAX.perc_order > 100) { highlightError('models.MAX.perc_order'); $scope.errormsg = coorectvaluemessage; return false; }
        if(!$scope.models.MAX.per_km) { highlightError('models.MAX.per_km'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.MAX.per_km == 0) { highlightError('models.MAX.per_km'); $scope.errormsg = coorectvaluemessage; return false; }
        if($scope.models.MAX.moqcheck) {
          if($scope.models.MAX.moq_type==null) {$scope.errormsg = moqtypevalidationmessage; return false; }
          if(!$scope.models.MAX.moq_count) { highlightError('models.MAX.moq_count'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.MAX.moq_count == 0) { highlightError('models.MAX.moq_count'); $scope.errormsg = coorectvaluemessage; return false; }
          if(!$scope.models.MAX.moq_charge) { highlightError('models.MAX.moq_charge'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.MAX.moq_charge == 0 || $scope.models.MAX.moq_charge == '.') { highlightError('models.MAX.moq_charge'); $scope.errormsg = coorectvaluemessage; return false; }
        }
      }
      else if($scope.slab_options == 'distance'){
        if(!$scope.models.Distance.upto_km) { highlightError('models.Distance.upto_km'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.Distance.upto_km == 0) { highlightError('models.Distance.upto_km'); $scope.errormsg = coorectvaluemessage; return false; }
        if(!$scope.models.Distance.fixed_cost) { highlightError('models.Distance.fixed_cost'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.Distance.fixed_cost == 0) { highlightError('models.Distance.fixed_cost'); $scope.errormsg = coorectvaluemessage; return false; }
        if(!$scope.models.Distance.per_km) { highlightError('models.Distance.per_km'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.Distance.per_km == 0) { highlightError('models.Distance.per_km'); $scope.errormsg = coorectvaluemessage; return false; }
        if($scope.models.Distance.moqcheck) {
          if($scope.models.Distance.moq_type==null) {$scope.errormsg = moqtypevalidationmessage; return false; }
          if(!$scope.models.Distance.moq_count) { highlightError('models.Distance.moq_count'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.Distance.moq_count == 0) { highlightError('models.Distance.moq_count'); $scope.errormsg = coorectvaluemessage; return false; }
          if(!$scope.models.Distance.moq_charge) { highlightError('models.Distance.moq_charge'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.Distance.moq_charge == 0 || $scope.models.Distance.moq_charge == '.') { highlightError('models.Distance.moq_charge'); $scope.errormsg = coorectvaluemessage; return false; }
        }
      }
      else if($scope.slab_options == 'ordervalue'){
        if(!$scope.models.Ordervalue.percentage) { highlightError('models.Ordervalue.percentage'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.Ordervalue.percentage == 0) { highlightError('models.Ordervalue.percentage'); $scope.errormsg = coorectvaluemessage; return false; }
        if($scope.models.Ordervalue.percentage > 100) { highlightError('models.Ordervalue.percentage'); $scope.errormsg = coorectvaluemessage; return false; }
        if($scope.models.Ordervalue.moqcheck) {
          if($scope.models.Ordervalue.moq_type==null) {$scope.errormsg = moqtypevalidationmessage; return false; }
          if(!$scope.models.Ordervalue.moq_count) { highlightError('models.Ordervalue.moq_count'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.Ordervalue.moq_count == 0) { highlightError('models.Ordervalue.moq_count'); $scope.errormsg = coorectvaluemessage; return false; }
          if(!$scope.models.Ordervalue.moq_charge) { highlightError('models.Ordervalue.moq_charge'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.Ordervalue.moq_charge == 0 || $scope.models.Ordervalue.moq_charge == '.') { highlightError('models.Ordervalue.moq_charge'); $scope.errormsg = coorectvaluemessage; return false; }
        }
      }
      else if($scope.slab_options == 'fixedrate'){
        if(!$scope.models.FlatRate.fixed_cost) { highlightError('models.FlatRate.fixed_cost'); $scope.errormsg = emptymessage; return false; }
        if($scope.models.FlatRate.fixed_cost == 0) { highlightError('models.FlatRate.fixed_cost'); $scope.errormsg = coorectvaluemessage; return false; }
        if($scope.models.FlatRate.per_check) {
          if(!$scope.models.FlatRate.percentage) { highlightError('models.FlatRate.percentage'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.FlatRate.percentage == 0) { highlightError('models.FlatRate.percentage'); $scope.errormsg = coorectvaluemessage; return false; }
          if($scope.models.FlatRate.percentage > 100) { highlightError('models.FlatRate.percentage'); $scope.errormsg = coorectvaluemessage; return false; }
        }
        if($scope.models.FlatRate.moqcheck) {
          if($scope.models.FlatRate.moq_type==null) {$scope.errormsg = moqtypevalidationmessage; return false; }  
          if(!$scope.models.FlatRate.moq_count) { highlightError('models.FlatRate.moq_count'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.FlatRate.moq_count == 0) { highlightError('models.FlatRate.moq_count'); $scope.errormsg = coorectvaluemessage; return false; }
          if(!$scope.models.FlatRate.moq_charge) { highlightError('models.FlatRate.moq_charge'); $scope.errormsg = emptymessage; return false; }
          if($scope.models.FlatRate.moq_charge == 0 || $scope.models.FlatRate.moq_charge == '.') { highlightError('models.FlatRate.moq_charge'); $scope.errormsg = coorectvaluemessage; return false; }
        }
      }
      return true;
    };

    $scope.getparams = function(){
      if($scope.slab_options == 'max'){
        var request = {
          'slab_type': 'max',
          'seller_id': $scope.slab_seller.seller_id,
          'moq':$scope.models.MAX.moqcheck == true ? '1' : '0',
          'moq_type':$scope.models.MAX.moq_type == "moq_daily" ? "moq_daily" : "moq_monthly",
          'moq_charge':$scope.models.MAX.moqcheck ? parseFloat($scope.models.MAX.moq_charge) : '',
          'moq_count' :$scope.models.MAX.moqcheck ? parseInt($scope.models.MAX.moq_count) : '',
          'active_start': '',// $scope.models.MAX.date.startDate,
          'active_end': '', //$scope.models.MAX.date.endDate,
          'data':[
                  {'upto_km': parseInt($scope.models.MAX.upto_km), 'fixed_cost': parseFloat($scope.models.MAX.fixed_cost), 'percentage':parseFloat($scope.models.MAX.perc_order) },
                  {'per_km': parseFloat($scope.models.MAX.per_km) }
                ]
        };
        if($scope.editstart == true){
          request.deactivate_previous = "true";
        }
        return request;
      }else if($scope.slab_options == 'distance'){
        var request = {
          'slab_type': 'Distance',
          'seller_id': $scope.slab_seller.seller_id,
          'moq':$scope.models.Distance.moqcheck == true ? '1' : '0',
          'moq_type':$scope.models.Distance.moq_type == "moq_daily" ? "moq_daily" : "moq_monthly",
          'moq_charge':$scope.models.Distance.moqcheck ? parseFloat($scope.models.Distance.moq_charge) : '',
          'moq_count' :$scope.models.Distance.moqcheck ? parseInt($scope.models.Distance.moq_count) : '',
          'active_start': '',// || $scope.models.Distance.date.startDate,
          'active_end': '',// || $scope.models.Distance.date.endDate,
          'data': [
                    {'upto_km': parseInt($scope.models.Distance.upto_km),'fixed_cost':parseFloat($scope.models.Distance.fixed_cost)},
                    {'upto_km': parseInt($scope.models.Distance.upto_km),'fixed_cost':parseFloat($scope.models.Distance.fixed_cost),'per_km':parseFloat($scope.models.Distance.per_km)}
                  ]
        }; 
        if($scope.editstart == true){
          request.deactivate_previous = "true";
        }
        return request; 
      }else if($scope.slab_options == 'ordervalue'){
        var request = {
          'slab_type': 'Order Value', 
          'seller_id': $scope.slab_seller.seller_id,
          'moq':$scope.models.Ordervalue.moqcheck == true ? '1' : '0',
          'moq_type':$scope.models.Ordervalue.moq_type == "moq_daily" ? "moq_daily" : "moq_monthly",
          'moq_charge':$scope.models.Ordervalue.moqcheck ? parseFloat($scope.models.Ordervalue.moq_charge) : '',
          'moq_count' :$scope.models.Ordervalue.moqcheck ? parseInt($scope.models.Ordervalue.moq_count) : '',
          'active_start': '',// || $scope.models.Ordervalue.date.startDate,
          'active_end': '',// || $scope.models.Ordervalue.date.endDate,
          'data': [
                    {'percentage': parseFloat($scope.models.Ordervalue.percentage)}
                  ]
        };
        if($scope.editstart == true){
          request.deactivate_previous = "true";
        }
        return request;
      }else if($scope.slab_options == 'fixedrate'){
        var request = {
          'slab_type': 'Fixed Rate', 
          'seller_id': $scope.slab_seller.seller_id,
          'moq':$scope.models.FlatRate.moqcheck == true ? '1' : '0',
          'moq_type':$scope.models.FlatRate.moq_type == "moq_daily" ? "moq_daily" : "moq_monthly",
          'moq_charge':$scope.models.FlatRate.moqcheck ? parseFloat($scope.models.FlatRate.moq_charge) : '',
          'moq_count' :$scope.models.FlatRate.moqcheck ? parseInt($scope.models.FlatRate.moq_count) : '',
          'active_start': '',// || $scope.models.FlatRate.date.startDate,
          'active_end': '',// || $scope.models.FlatRate.date.endDate,
          'data': [
                    {'fixed_cost': parseFloat($scope.models.FlatRate.fixed_cost)}
                  ]
        };
        if($scope.editstart == true){
          request.deactivate_previous = "true";
        }
        if($scope.models.FlatRate.per_check == true){
          request['data'].push({
            percentage : parseFloat($scope.models.FlatRate.percentage)
          });
        }
        return request;
      }
    };    
})
.controller('sellersMapController', function ($scope, $http, $timeout, leafletEvents, leafletData) {
    $scope.sellerslist = [];
    $scope.sellermsg = '';

    angular.extend($scope, {
                center: {
                    lat: 23.2500,
                    lng: 77.4170,
                    zoom: 4
                },
                events: {
                    map: {
                        enable: ['moveend', 'popupopen'],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [],
                        logic: 'emit'
                    }
                },
                legend: {
                    position: 'topright',
                    colors: [ '#BLUE'],
                    labels: [ 'Sellers']
                },
                layers: {
                    baselayers: {
                        bingRoad: {
                            name: 'Bing Road',
                            type: 'bing',
                            key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                            layerOptions: {
                                type: 'Road'
                            }
                        }
                    },
                    overlays: {
                        realworld: {
                            name: "Real world data",
                            type: "markercluster",
                            visible: true
                        }
                    }
                }
            });

    $scope.sellerdetails = '';
    $scope.markers = [];

    $scope.setFocus = function(lat,lng,iscluster){
        if(lat && lng){
            if(iscluster){
                angular.extend($scope, {
                    center: {
                        lat: lat,
                        lng: lng,
                        zoom: 14
                    }
                });        
            }
            else{
                angular.extend($scope, {
                center: {
                    lat: lat,
                    lng: lng,
                    zoom: 17
                }
            });    
            }
        }
        else {
            angular.extend($scope, {
            center: {
                lat: 23.2500,
                lng: 77.4170,
                zoom: 5
            }
        });
        }
    };

    $scope.$watch('cluster',function(value){
        if(value){
            $scope.setFocus(value.latitude,value.longitude,true);    
        }
    });

    $scope.sellerinfo = function(seller){
        return '<p>'+'SellerId: ' + seller.id +
                '<br>'+'Name: ' +seller.store_name +
                '<br>'+'Contact No.: '+seller.shop_phone+
                '</p>';
    };

    $scope.resetResult = function(){
        $scope.sellerlist = null;
        $scope.sellermsg = '';
        $scope.markers = [];
        $scope.currentSeller = null;
    };

    $scope.addClusterMarker = function()
    {
        if($scope.cluster)
        {
            $scope.markers.push({
                layer: 'realworld',
                lat: $scope.cluster.latitude,
                lng: $scope.cluster.longitude,
                name: $scope.cluster.cluster_name,
                focus: true,
                draggable: false,
                message: $scope.cluster.cluster_name,
                icon: {
                        type: 'awesomeMarker',
                        prefix:'fa',
                        markerColor: 'orange',
                        iconColor: 'white'
                    }
            });
        }
    };

    $scope.getSellers = function(){
        $scope.isMapLoading = true;
        $scope.resetResult();
        $scope.addClusterMarker();
        $http.get('/operations/sellers/map/', {
            params: {
                cluster: $scope.cluster ? $scope.cluster : null,
                city: $scope.city ? $scope.city : null
            }
        }).success(function(data, status, headers, config){
            $scope.sellerslist = data ? data : null;
            if(data && data.length > 0){
                for(var i in $scope.sellerslist){
                    $scope.markers.push({
                        layer: 'realworld',
                        lat: $scope.sellerslist[i].latitude,
                        lng: $scope.sellerslist[i].longitude,
                        name: $scope.sellerslist[i].name,
                        focus: true,
                        draggable: false,
                        message: $scope.sellerinfo($scope.sellerslist[i]),
                    });    
                }
                angular.extend($scope, {
                    markers: $scope.markers
                });
            }
            angular.extend($scope, {
                legend: {
                    position: 'topright',
                    colors: [ 'BLUE'],
                    labels: ['Sellers ('+$scope.sellerslist.length+')']
                }

            });
            $scope.isMapLoading=false;
            $scope.sellermsg = data ? data.length +' records found.' : 'No record found.';
        }).error(function(error){
            $scope.isMapLoading=false;
            alert('Error occured while fetching sellers.');
        });
    };

    $scope.clusterCity = [{
        code:'NCR',
        name: "NCR"
        },
        {
        code:'BOM',
        name: "Mumbai"
        },
        {
        code:'BLR',
        name: "Bengaluru"
        },
        {
        code:'JPR',
        name: "Jaipur"
        },
        {
        code:'PNQ',
        name: "Pune"
        },
        {
        code:'HYD',
        name: "Hyderabad"
        },
        {
        code:'MAA',
        name: "Chennai"
        }];
    
    $scope.$watch('city',function(value){
        if(value){
            $scope.setFocus();
            $scope.getCluster();            
        }
    });
    $scope.currentSeller = null;
    $scope.selectSeller = function(seller){
        $scope.currentSeller = seller.id;
        $scope.setFocus(seller.latitude,seller.longitude);
    };

    $scope.getCluster = function(){
        $scope.clusters = null;
        $http.get('/city-to-clusters/?city='+$scope.city)
        .success(function(data, status, headers, config){
            $scope.clusters = data ? data.data : null;
            $scope.cluster=undefined
        }).error(function(error){
            alert('Error occured in fetching clusters.');
        });
    };

    $scope.$on('get:SellerMap', function() {
        leafletData.getMap().then(function(map) {
          $timeout(function() {
            map.invalidateSize();
          }, 300);
        });
        $scope.getSellers();
        $scope.setFocus();
    });

    $scope.resetFilters = function() {
      $scope.cluster=undefined;
      $scope.city=undefined;
      $scope.getSellers();
    }
})
.factory('MerchantsService', function($http) {
    var factory = {};
    
    factory.setSellersData = function(data) { 
        factory.merchantsOptions=data;   
    };
    factory.getSellersData = function() {  
        return  factory.merchantsOptions;
    };
   
   return factory;
})
.factory('FinanceService', function($http) {
    var factory = {};
    
    factory.setUsersData = function(data) { 
        factory.financeUsersOptions=data;   
    };
    factory.getUsersData = function() {  
        return  factory.financeUsersOptions;
    };
   
   return factory;
})
.factory('setterGetterService', function($http) {
    var factory = {};
    factory.setUpdatedOrdersIds = function(data) { 
        factory.updatedOrdersIds=data;   
    };
    factory.getUpdatedOrdersIds = function() {  
        return  factory.updatedOrdersIds;
    };
    factory.setSyncedOrdersId = function(data) { 
        factory.syncedOrdersId=data;   
    };
    factory.getSyncedOrdersId = function() {  
        return  factory.syncedOrdersId;
    };
    factory.setId = function(data) { 
        factory.id=data;   
    };
    factory.getId = function() {  
        return  factory.id;
    };
    factory.setInvoiceId = function(data) { 
        factory.invoiceId=data;   
    };
    factory.getInvoiceId = function() {  
        return  factory.invoiceId;
    };
    factory.setDiscountvalue = function(data) { 
        factory.discountvalue=data;   
    };
    factory.getDiscountvalue = function() {  
        return  factory.discountvalue;
    };

    factory.setShouldLoad = function(data) { 
        factory.shouldLoadId=data;   
    };
    factory.getShouldLoad = function() {  
        return  factory.shouldLoadId;
    };
    factory.setAdjustmentsShouldLoad = function(data) { 
        factory.shouldLoadAdjustments=data;   
    };
    factory.getAdjustmentsShouldLoad = function() {  
        return  factory.shouldLoadAdjustments;
    };
    factory.setShouldAddDiscount = function(data) { 
        factory.shouldAddDiscount=data;   
    };
    factory.getShouldAddDiscount = function() {  
        return  factory.shouldAddDiscount;
    };
    factory.setShouldDeleteDiscount = function(data) { 
        factory.shouldDeleteDiscount=data;   
    };
    factory.getShouldDeleteDiscount = function() {  
        return  factory.shouldDeleteDiscount;
    };
    factory.setBulkUpdateAdjustmentsCount = function(data){
        factory.bulkUpdateAdjustmentsCount=data;  
    }
    factory.getBulkUpdateAdjustmentsCount = function(){
        return  factory.bulkUpdateAdjustmentsCount;
    }
    factory.setBulkUpdateCount = function(data){
        factory.bulkUpdateCount=data;  
    }
    factory.getBulkUpdateCount = function(){
        return  factory.bulkUpdateCount;
    }
    factory.setBulkUpdateMsg = function(data){
        factory.bulkUpdateMsg=data;  
    }
    factory.getBulkUpdateMsg = function(){
        return  factory.bulkUpdateMsg;
    }
    factory.setBulkUpdateAdjustmentsMsg = function(data){
        factory.bulkUpdateAdjustmentsMsg=data;  
    }
    factory.getBulkUpdateAdjustmentsMsg = function(){
        return  factory.bulkUpdateAdjustmentsMsg;
    }
   return factory;
})
.directive('sfxSpinner', function (usSpinnerService, $timeout) {
  return {
    scope: true,
    template: '<div us-spinner spinner-key="{{ spinnerKey }}" spinner-start-active="0"></div>',
    link: function (scope, element, attrs) {
      var timeoutValue = attrs.sfxSpinnerTimeout,
      timeinValue = attrs.sfxSpinnerTimein || 0,
      isTimeoutActive,
      timeinPromise,
      timeoutPromise,
      keepSpinning;

      scope.spinnerKey = attrs.sfxSpinnerKey;

      if ('' === attrs.sfxSpinner) {
        startSpinner();
      } else {
        scope.$watch(attrs.sfxSpinner, function (value) {
          keepSpinning = Boolean(value);
          if (keepSpinning) {
            isTimeoutActive = true;
                            // Cancel previously active timeout event.
                            $timeout.cancel(timeinPromise);
                            $timeout.cancel(timeoutPromise);

                            // Added initial lag with default value of 0.
                            timeinPromise = $timeout(startSpinner, timeinValue);
                            // Start a timeout event which will deactivate the spinner after timeout value.
                            timeoutPromise = $timeout(timeoutCallBack, timeoutValue);
                          } else {
                            // If timeout event is already completed disable the spinner.
                            if (!isTimeoutActive) {
                              stopSpinner();
                            }
                          }
                        });
      }

      function startSpinner() {
        usSpinnerService.spin(scope.spinnerKey);
        element.css('display', '');
      }

      function stopSpinner() {
        usSpinnerService.stop(scope.spinnerKey);
        element.css('display', 'none');
      }

      function timeoutCallBack() {
        isTimeoutActive = false;
        // Deactivate the spinner iff its already been deactivated
        // by external controller.
        if (!keepSpinning) {
          stopSpinner();
        }
      }
    }
    };
})
function DialogController($scope, $mdDialog, $http, Upload, $timeout) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    $scope.date = new Date();
    $scope.maxDate = new Date();

    $scope.clear = function () {
                        $scope.date = null;
                    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        initDate: $scope.initDate,
        startingDay: 1,
    };
          
          
    $scope.initDate = new Date();
    $scope.format = 'yyyy-MM-dd';

    $scope.downloadSample = function() {
        $http.get('/operations/targets/sample/', {
        })
        .success(function(data, status, headers, config) {
            filename = headers()['content-disposition'].split(';')[1].trim().replace("filename=","");

            var file = new Blob([data], { type: 'text/csv' });
            saveAs(file, filename);
        })
        .error(function(errordata, status, headers, config) {
            console.log(errordata);
            $scope.taskTableLoading = false;
            $scope.message = 'There was an error in getting your task history. Please try again!';
        });
    }

    $scope.log = '';
    $scope.filenames = '';
    $scope.publish = function(){
        var files = $scope.filenames;
        if (files && files.length) {
            var file1 = files[0];
            Upload.upload({
                url: '/operations/targets/upload/',
                data: {
                    target_date: $scope.date
                },
                file: file1
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
                progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
            }).success(function (data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }
                    $scope.log += '\n' + progress;
                });
            }).error(function(data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }   
                    $scope.log += '\n' + progress;

                })
            })
        }
    };

    $scope.upload = function (files) {
        $scope.filenames = files
    };
}
function confirmDialogController($scope, $mdDialog, $http, Upload, $timeout,setterGetterService) {
    $scope.confirmation_heading_msg="Confirm Orders";
    $scope.confirmation_msg=setterGetterService.getBulkUpdateMsg();
    $scope.cancel = function() {
        $mdDialog.cancel();
        setterGetterService.setShouldLoad(undefined);
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.ok = function($event) {
        setterGetterService.setShouldLoad(true);
        $mdDialog.cancel();
    };
}
function confirmDialogAdjustmentsController($scope, $mdDialog, $http, Upload, $timeout,setterGetterService) {
    $scope.confirmation_heading_msg="Confirm Orders";
    $scope.confirmation_msg=setterGetterService.getBulkUpdateAdjustmentsMsg();
    $scope.cancel = function() {
        $mdDialog.cancel();
        setterGetterService.setAdjustmentsShouldLoad(undefined);
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.ok = function($event) {
        setterGetterService.setAdjustmentsShouldLoad(true);
        $mdDialog.cancel();
    };
}
function addDiscountConfirmDialogController($scope, $mdDialog, $http, Upload, $timeout,setterGetterService) {
    $scope.confirmation_heading_msg="Confirm Discounts";
    $scope.confirmation_msg="Do you want to add a new discount of [ "+ setterGetterService.getDiscountvalue() + " ] for invoice id [ "+ setterGetterService.getInvoiceId()+" ]";
    $scope.cancel = function() {
        $mdDialog.cancel();
        setterGetterService.setShouldAddDiscount(undefined);
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.ok = function($event) {
        setterGetterService.setShouldAddDiscount(true);
        $mdDialog.cancel();
    };
}
function deleteDiscountConfirmDialogController($scope, $mdDialog, $http, Upload, $timeout,setterGetterService) {
    $scope.confirmation_heading_msg="Delete Discounts";
    $scope.confirmation_msg="Are you sure that you want to delete the selected Discount"
    $scope.cancel = function() {
        $mdDialog.cancel();
        setterGetterService.setShouldDeleteDiscount(undefined);
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.ok = function($event) {
        setterGetterService.setShouldDeleteDiscount(true);
        $mdDialog.cancel();
    };
}
function InvoiceDialogController($scope, $mdToast, $mdDialog, $http, Upload, $timeout,setterGetterService) {
   
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    
    $scope.clear = function () {
        $scope.date = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.log = '';
    $scope.filenames = '';
    $scope.publish = function(){
        var files = $scope.filenames;
        if (files && files.length) {
            var filetype=files[0].type;
            if (filetype=="text/csv" || filetype=="application/vnd.ms-excel") {
                var file1 = files[0];
                Upload.upload({
                    url: '/payments/order/import/',
                    file: file1
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
                    progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
                }).success(function (data, status, headers, config) {
                    $timeout(function() {
                        $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                        if(data.update_failed_rows != []) {
                            $scope.log += '\n' + 'Updated Rows : '+data.total_updates+ ' | Failed Rows :' +data.total_updates_failed;
                            
                            if(data.total_updates_failed>0){
                                $scope.log += '\n' + 'Failed Row Numbers : ' +"[" +  data.update_failed_rows + "]";
                            }
                        }
                        else {
                            $scope.log += '\n' + 'Updated Rows : '+data.total_updates+ ' | Failed Rows :' +data.total_updates_failed;
                        }
                        $scope.log += '\n' + progress;
                        for (var i = 0; i < data.error_summary.length; i++) {
                            var key = Object.keys(data.error_summary[i])
                            $scope.log += '\n' + 'Failed Row No: '+key +'\n'+ 'Reason :' +data.error_summary[i][key];
                        };
                        setterGetterService.setShouldLoad(true);
                        setterGetterService.setUpdatedOrdersIds(data.orders_updated);
                    });
                }).error(function(data, status, headers, config) {
                    $mdToast.show(
                    $mdToast.simple()
                    .content('Failed to fetch updated orders log. Please check network status')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                    );
                    setterGetterService.setUpdatedOrdersIds(undefined);
                })
            }
            else{
                $mdToast.show();
                $mdToast.show(
                $mdToast.simple()
                .content('Upload file should be in CSV format')
                .position($scope.getToastPosition())
                .hideDelay(3000)
                );
            }
        }
    };

    $scope.upload = function (files) {
        $scope.filenames = files
    };
}
function AddPaymentsDialogController($mdToast, $scope, $mdDialog, $http, Upload, $timeout, MerchantsService,setterGetterService) {
    $scope.merchantsOptions = [];
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    

    $scope.clear = function () {
        $scope.date = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
        
    };
    // js for toast(alert) start
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }

    $scope.paymentsTypesOptions=[
        {
        value:'1',
        text: "Credit-Advance"
        },
        {
        value:'2',
        text: " Credit-Bill Payment"
        },
        {
        value:'3',
        text: "Credit-Misc"
        },
        {
        value:'4',
        text: "Debit-Misc"
        }
    ];  

    $scope.paymentsMerchantsChange = function(value){
        if(value.indexOf(true)!=-1){
           $scope.paymentsTypesOptions=[
                {
                value:'1',
                text: "Credit-Advance"
                },
                {
                value:'3',
                text: "Credit-Misc"
                },
                {
                value:'4',
                text: "Debit-Misc"
                }
            ];  
        }
        else{
            $scope.paymentsTypesOptions=[
                {
                value:'1',
                text: "Credit-Advance"
                },
                {
                value:'2',
                text: " Credit-Bill Payment"
                },
                {
                value:'3',
                text: "Credit-Misc"
                },
                {
                value:'4',
                text: "Debit-Misc"
                }
            ];   
        }
        $scope.allItemsSelected = false;
    };  
    
    $scope.paymentsModesOptions=[
        {
        value:'1',
        text: "Cash"
        },
        {
        value:'2',
        text: "Cheque"
        },
        {
        value:'3',
        text: "NEFT"
        },
        {
        value:'4',
        text: "TDS Certificate"
        }
    ];
    $scope.myConfig2 = {
         create: false,
        valueField: 'value',
        labelField: 'text',
        sortDirection: 'desc',
        sortField: 'text',
        onChange: function(value){
          // console.log('onChange', value)#commented
        },
         maxItems: 1,
        // required: true,
    }; 
    $scope.chain='';
    $scope.payment_type='';
    $scope.payment_amount='';
    $scope.mode='';
    $scope.payment_ref='';
    $scope.comments=''; 
    var paymentMerchant='';
    $scope.disableAddButton=false;
    

    $scope.submitNewPayment = function() {
        $scope.showLoadingMsg=false;
        $scope.error_msg=""
        var isValidationTrue=true;
        $scope.disableAddButton=true;
        var paymentMerchant= $scope.paymentsMerchants ? $scope.paymentsMerchants.value: undefined;
        if(paymentMerchant!=undefined){
            $scope.disableAddButton=false;
            var isTrueIndex =  typeof(paymentMerchant) == "string" ? paymentMerchant.indexOf("true"): -1;
            if(isTrueIndex !=-1 ){
                paymentMerchant=paymentMerchant.slice(0,isTrueIndex);  
            }
        }
        if($scope.paymentsMerchants==undefined){
            $scope.disableAddButton=false;
            isValidationTrue=false;
            $scope.error_msg="Merchant field is compulsory, It cannot be Empty";
            
        }
        else{
            if($scope.paymentsTypes==undefined){
                $scope.disableAddButton=false;
                isValidationTrue=false;
                $scope.error_msg="Payment type is compulsory, It cannot be Empty";
            }
            else{
                if($scope.paymentsModes==undefined){
                    $scope.disableAddButton=false;
                    isValidationTrue=false;
                    $scope.error_msg="Payment Mode is compulsory, It cannot be Empty";
                }
                else{
                    if($scope.paymentsRef==undefined){
                        isValidationTrue=false;
                        $scope.error_msg="Payment Ref No. is compulsory, It cannot be Empty";
                    }
                    else{
                        if($scope.paymentsAmount == undefined){
                            $scope.disableAddButton=false;
                            $scope.error_msg="Amount is compulsory, It cannot be Empty";
                            isValidationTrue=false;
                        }else{
                            if($scope.paymentsComments == undefined){
                                $scope.disableAddButton=false;
                                $scope.error_msg="Comments are compulsory, It cannot be Empty";
                                isValidationTrue=false;
                            }else{
                                isValidationTrue=true;
                            }

                        }

                    }
                }
            }           
        }
                        
        if(isValidationTrue){
            $scope.showLoadingMsg=true;
            $scope.submitNewPaymentLoading=true;
            $http.post('/payments/add/',{
                chain: paymentMerchant,
                payment_type: $scope.paymentsTypes,
                total_paid: $scope.paymentsAmount,
                mode: $scope.paymentsModes,
                payment_ref: $scope.paymentsRef,
                comments: $scope.paymentsComments
            })
            .success(function(response){
                $scope.submitNewPaymentLoading = false;
                setterGetterService.setShouldLoad(true);
                $mdToast.show();
                $mdToast.show(
                $mdToast.simple()
                .content(response.message)
                .position($scope.getToastPosition())
                .hideDelay(3000)
                );
                $mdDialog.cancel();
                $scope.showLoadingMsg=false;

            })
            .error(function(data, status, headers, config) {
                $scope.disableAddButton=false;
                $scope.submitNewPaymentLoading = false;
                $scope.showLoadingMsg=false;
                setterGetterService.setShouldLoad(false);
                if(data!=null){
                    if(data.message!=undefined){
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to add a new payment'+data.message)
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to add a new payment, Please check your network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );   
                    }
                }
                else{
                        $mdToast.show(
                            $mdToast.simple()
                            .content('Failed to add a new payment, Please check your network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );   
                }
            })
        }
        else{
            $scope.showLoadingMsg=false;
            $mdToast.show(
            $mdToast.simple()
            .content($scope.error_msg)
            .position($scope.getToastPosition())
            .hideDelay(3000)
            );
            $scope.disableAddButton=false;
        }   
    };

    
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    
    $scope.serachMerchants = function(name){
        $scope.merchantsLoading = true;
        return $http.post('/payments/sellers-data/',{'name': name}).then(function(response){
            $scope.merchantsLoading = false;

            response = response['data'];
            var merchants=[];
            var idWithStatus='';
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].is_wallet_mode){
                    idWithStatus=(response.data[i].id + "true");
                }
                else{
                    idWithStatus=response.data[i].id;  
                }
                merchants.push({value:idWithStatus,
                text:response.data[i].name});
            } 
            MerchantsService.setSellersData(merchants); 
            $scope.merchantsOptions = merchants;
            return $scope.merchantsOptions;
        }).catch(function(err){
            $scope.merchantsLoading = false;
            $mdToast.show(
                $mdToast.simple()
                .content('Failed to fetch sellers data for payments tab')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );  
        });
    }
}
function StatementExportDialogController($scope, $mdDialog, $http, Upload, $timeout, MerchantsService,$mdToast) {
    $scope.merchantsOptions = [];
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    $scope.myConfig2 = {
         create: false,
        valueField: 'value',
        labelField: 'text',
        sortDirection: 'desc',
        sortField: 'text',
        onChange: function(value){
          // console.log('onChange', value)#commented
        },
         maxItems: 1,
        // required: true,
    }; 
    

    $scope.clear = function () {
        $scope.date = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.date={};
    $scope.exportTypeOptions = [
        {
        value:'pdf',
        text: "pdf"
        },
        {
        value:'csv',
        text: "csv"
        }
    ];
    $scope.date.startDate=null;
    $scope.date.endDate=null;
    $scope.disableExportButton=false;
    


    $scope.ExportMerchantPayments = function() {
        $scope.disableExportButton=true;
        $scope.showLoadingMsg=false;
        $scope.error_msg='';
        isValidationTrue=true; 
        if($scope.paymentsMerchants==undefined){
            $scope.disableExportButton=false;
            isValidationTrue=false;
            $scope.error_msg='Merchant field is compulsory, It cannot be Empty';
        }
        else{
            if($scope.date.startDate==undefined && $scope.date.endDate==undefined ){
                $scope.disableExportButton=false;
                isValidationTrue=false;
                $scope.error_msg='Date Range is compulsory, It cannot be Empty';
            }
            else{
                if($scope.exportType==undefined){
                    $scope.disableExportButton=false;
                    isValidationTrue=false;
                    $scope.error_msg='Export type is compulsory, It cannot be Empty';
                }
                else{
                   isValidationTrue=true; 
                }
            }
        }
        if(!isValidationTrue){
            $mdToast.show(
                    $mdToast.simple()
                    .content($scope.error_msg)
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                    );
        }
        $scope.exportMerchantloader=true;

        var loadurl='/payments/mini_statement/';

        var paymentMerchant=$scope.paymentsMerchants.value;
        if(paymentMerchant!=undefined){
            $scope.disableExportButton=false;
            var isTrueIndex=paymentMerchant.indexOf("true");
            if(isTrueIndex!=-1){
                paymentMerchant=paymentMerchant.slice(0,isTrueIndex);  
            }
        }

        if(paymentMerchant){
            loadurl=loadurl+'?merchant_id='+paymentMerchant;
        }
        if($scope.date.startDate && $scope.date.endDate){
            var sdate = $scope.date.startDate._i;
            var edate = $scope.date.endDate._i;
            loadurl=loadurl+'&date_from='+sdate+'&date_to='+edate;
        }
        if($scope.exportType){
            loadurl=loadurl+'&output='+$scope.exportType;
        }
        if(isValidationTrue){
            $scope.showLoadingMsg=true;
            $http({method: 'GET',url: loadurl})
            .success(function(data, status, headers, config){

                $scope.exportMerchantloader = false;
                if($scope.exportType.toLowerCase() == 'csv'){
                    var filename = 'Statement.csv';//headers()['content-disposition'].split(';')[1].trim().replace("filename=","");
                    var file = new Blob([data], { type: 'text/csv' });
                    saveAs(file, filename);  
                }
                else if($scope.exportType.toLowerCase() == 'pdf'){
                    var file = new Blob([data], { type: 'text/pdf' });
                    saveAs(file, 'Statement.pdf');   
                }
                $mdDialog.cancel();
                
                $mdToast.show();
                    $mdToast.show(
                    $mdToast.simple()
                    .content('Exported statement successfully')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
                    );

            })
            .error(function(data, status, headers, config){
                $scope.disableExportButton=false;
                $scope.showLoadingMsg=false;
                $scope.exportMerchantloader = false;
                if(data!=null){
                    if(data.message!=undefined){
                        $mdToast.show(
                            $mdToast.simple()
                            .content('There was a error in exporting statement'+data.message)
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );
                    }
                    else{
                        $mdToast.show(
                            $mdToast.simple()
                            .content('There was a error in exporting statement, Please check your network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );   
                    }
                }
                else{
                        $mdToast.show(
                            $mdToast.simple()
                            .content('There was a error in exporting statement, Please check your network status')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                        );   
                }
            });
        }  
    };


    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }

    $scope.serachMerchants = function(name){
        $scope.merchantsLoading = true;
        return $http.post('/payments/sellers-data/',{'name': name}).then(function(response){
            $scope.merchantsLoading = false;
            
            response = response['data'];
            var idWithStatus;
            var merchants = [];
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].is_wallet_mode){
                    idWithStatus=(response.data[i].id + "true");
                }
                else{
                    idWithStatus=response.data[i].id;  
                }
                merchants.push({value:idWithStatus,
                text:response.data[i].name});
            } 
            MerchantsService.setSellersData(merchants); 
            $scope.merchantsOptions = merchants;
            return $scope.merchantsOptions;
        }).catch(function(err){
            $scope.merchantsLoading = false;
            $mdToast.show(
                $mdToast.simple()
                .content('Failed to fetch sellers data for payments tab')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );  
        });
    }

}
function createIncentiveController($scope, $mdDialog, $http, $timeout, $mdToast) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
    $scope.date = new Date();
    $scope.maxDate = new Date();

    $scope.clear = function () {
        $scope.date = null;
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        initDate: $scope.initDate,
        startingDay: 1,
    };

    $scope.initDate = new Date();
    $scope.format = 'yyyy-MM-dd';

    $scope.incentive = {
        name:'',
        amount:'',
        date:'',
        duplicate:''
    }

    // js for toast(alert) start
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    // js for toast(alert) end 

    $scope.createIncentive = function() {
        $scope.incentive.date = $scope.date;
        $scope.createIncentiveLoading = true;  
        var incentive = $scope.incentive;
        $http.post('operations/create/incentive/',{
          name: incentive.name,
          amount: incentive.amount,
          start_date: incentive.date
      })
        .success(function(response){
          $scope.createIncentiveLoading = false;
          $scope.hide();
          $mdToast.show(
              $mdToast.simple()
              .content('Incentive created successfully')
              .position($scope.getToastPosition())
              .hideDelay(3000)
              );
      })
        .error(function(response){
          $scope.createIncentiveLoading = false;
          $mdToast.show(
              $mdToast.simple()
              .content('There is a error in creating incentive')
              .position($scope.getToastPosition())
              .hideDelay(3000)
              );

      })
    }
}
function approveIncentiveController($scope, $mdDialog, $http, $timeout, $mdToast, incentive, commonUtility, Upload) {
    $scope.incentive = incentive;
    $scope.cityData = [];
    $scope.cardCityList = [];
    $scope.cardClusterList = [];
    $scope.cardRiderList = [];
    $scope.ridersLength = $scope.cardRiderList.length;
    $scope.payment_cycle = "MONTHLY";
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    // js for toast(alert) start
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    // js for toast(alert) end 

    $scope.cityList = [
        {
            id:'NCR',
            name:'Delhi/NCR'
        },
        {
            id:'BOM',
            name:'Mumbai'
        },
        {
            id:'BLR',
            name:'Bengaluru'
        }
    ]

    $scope.checkDuplicate = function(array, fieldname, value){
        for(var i=0;i<array.length;i++) {
          if(array[i][fieldname] == value) {
            return true;
          }
        }
        return false;
    };

    $scope.createSkulton = function(name){
      return {
          city : {
              name: name,
              clusters: []
          }
      };
    };

    $scope.addToCityCard = function(city) {
        $scope.checkCity = $scope.checkDuplicate($scope.cityData, 'id', city.id);
        if(!$scope.checkCity) {
          $scope.cityData.push({
            id:city.id,
            name:city.name  
          });
        }
        $scope.cityToCluster(city.id);
    };

    $scope.addToClusterCard = function(cluster) {
        $scope.checkCluster = $scope.checkDuplicate($scope.cardClusterList, 'id', cluster.id);
        if(!$scope.checkCluster){
          $scope.cardClusterList.push({
            id:cluster.id,
            cityname:$scope.city,
            name:cluster.cluster_name
          });
        }
        $scope.clusterToRider(cluster.id);
    };

    $scope.addToRiderCard = function(rider) {
        $scope.checkRider = $scope.checkDuplicate($scope.cardRiderList, 'id', rider.id);
        if(!$scope.checkRider){
          $scope.cardRiderList.push({
            id: rider.id,
            name: rider.name,
            clusterid: $scope.cluster,
            cityid:$scope.city
          });
        }
        $scope.ridersLength = $scope.cardRiderList.length;
    }

    $scope.remove = function(field,data) {
        if(field == "City") {
            removeSelf($scope.cityData,'id',data.id);
            removeSelf($scope.cardClusterList,'cityname',data.name);
            removeSelf($scope.cardRiderList,'cityid',data.name);
        }   
        else if(field == "Cluster") {
            removeSelf($scope.cardClusterList,'id',data.id);
            removeSelf($scope.cardRiderList,'clusterid',data.id);
        }   
        else if(field == "Rider") {
            removeSelf($scope.cardRiderList,'id',data.id);
        }
    };

    var removeSelf = function(array,fieldname,value){
      var i = 0;
      while(i < array.length){
        if(array[i][fieldname] == value){
          array.splice(i, 1);
          i<=0 ? i=0 : i-=1;
        }else{
          i++;   
        }
        
      }
    };

    $scope.clusterDetails = [];
    $scope.cityToCluster = function(city_id) {
        $scope.clusterDetails = [];
        commonUtility.cityCluster(city_id, $scope);
    };

    $scope.ridersList = [];
    $scope.clusterToRider = function(cluster_id) {
        $scope.ridersList = [];
        commonUtility.clusterRider(cluster_id, $scope);
    };

    var join = function(array){
        var result = [];
        for(var i in array){
          result.push(array[i]['id']);
        }
        return result;
    }

    $scope.approveIncentive = function(incentive_id) {
        var cities = join($scope.cityData);
        var clusters = join($scope.cardClusterList);
        var riders = join($scope.cardRiderList);
        var payment_cycle = $scope.payment_cycle;
        if(riders != '') {
            clusters = [];
            cities = [];
        }
        else if(clusters != '') {
            cities = [];
        }
        $scope.approveIncentiveLoading = true;
        $http.post('/operations/incentive/add-riders/',{
            incentive_id: incentive_id,
            cities: cities,
            cluster_ids:clusters,
            riders_ids:riders,
            payment_cycle:payment_cycle
        })
        .success(function(response){
            $scope.approveIncentiveLoading = false;
            $scope.hide();
            $mdToast.show(
                $mdToast.simple()
                .content('Incentive approved successfully!')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        })
        .error(function(response){
            $scope.approveIncentiveLoading = false;
            $scope.hide();
            $mdToast.show(
                $mdToast.simple()
                .content('There is an error in approving incentive!')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
        })
    }

    $scope.log = '';
    $scope.filenames = '';
    $scope.publish = function(incentive_id){
        var files = $scope.filenames;
        var payment_cycle = $scope.payment_cycle;
        if (files && files.length) {
            var file1 = files[0];
            Upload.upload({
                url: '/operations/incentive/add-riders/',
                data: {
                    incentive_id: incentive_id,
                    payment_cycle: payment_cycle
                },
                file: file1
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
                progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
            }).success(function (data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }
                    $scope.log += '\n' + progress;
                });
            }).error(function(data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }   
                    $scope.log += '\n' + progress;

                })
            })
        }
    };

    $scope.upload = function (files) {
        $scope.filenames = files
    }
}

function duplicateIncentiveController($scope, $mdDialog, $http, $timeout, $mdToast, incentive) {
    $scope.incentive = incentive;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    $scope.date = new Date();
    // js for toast(alert) start
    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }
    // js for toast(alert) end 

    $scope.createDuplicateIncentive = function(incentive) {
        $scope.incentive.date = $scope.date;
        $scope.duplicateIncentiveLoading = true;
        $http.post('/operations/create/duplicate-incentive/',{
            "incentive_id": incentive.id,
            "name": incentive.name,
            "amount": incentive.amount,
            "start_date": incentive.date
    })
    .success(function(response){
        $scope.duplicateIncentiveLoading = false;
        $scope.hide();
        $mdToast.show(
            $mdToast.simple()
            .content('Duplicate incentive created successfully!')
            .position($scope.getToastPosition())
            .hideDelay(3000)
            );
    })
    .error(function(response){
        $scope.duplicateIncentiveLoading = false;
        $mdToast.show(
            $mdToast.simple()
            .content('There is a error in creating duplicate incentive!')
            .position($scope.getToastPosition())
            .hideDelay(3000)
            );

    })
    }
}

function outletMapController($scope, $mdDialog, $http, $timeout, $mdToast, leafletEvents, leafletData, $rootScope,parent) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

    angular.extend($scope, {
        center: {
            lat: 20.5937,
            lng: 78.9629,
            zoom: 4
        },
        events: {
            map: {
                enable: ['moveend', 'popupopen', 'dragend','click'],
                logic: 'emit'
            },
            marker: {
                enable: [],
                logic: 'emit'
            }
        },
        legend: {
            position: 'topright',
            colors: [ '#BLUE']
        },
        layers: {
            baselayers: {
                bingRoad: {
                    name: 'Bing Road',
                    type: 'bing',
                    key: 'Aj6XtE1Q1rIvehmjn2Rh1LR2qvMGZ-8vPS9Hn3jCeUiToM77JFnf-kFRzyMELDol',
                    layerOptions: {
                        type: 'Road'
                    }
                }
            },
            overlays: {
                realworld: {
                    name: "Real world data",
                    type: "markercluster",
                    visible: true
                }
            }
        },
    });

    $scope.markers = [{
        lat: 23.281627,
        lng: 77.316035,
        focus: true,
        message: "Hey, drag me",
        draggable: true
    }];
    $rootScope.zomatoLatitute = $rootScope.outletLat;
    $rootScope.zomatoLongitute = $rootScope.outletLong;
    $scope.$on("leafletDirectiveMarker.dragend", function(event, args){
        $rootScope.zomatoLatitute = args.model.lat;
        $rootScope.zomatoLongitute = args.model.lng;
        parent.outletData.latitude= args.model.lat;
        parent.outletData.longitude= args.model.lng;
    });
    $scope.$on('leafletDirectiveMap.click', function(event,args){
        parent.outletData.latitude= args.leafletEvent.latlng.lat;
        parent.outletData.longitude= args.leafletEvent.latlng.lng;
        $rootScope.zomatoLatitute = args.model.lat;
        $rootScope.zomatoLongitute = args.model.lng;
        $scope.markers[0].lat = args.leafletEvent.latlng.lat;
        $scope.markers[0].lng = args.leafletEvent.latlng.lng;

    });
}

function feasibilityController($scope, $mdDialog, $http, $timeout, $mdToast, outletID, commonUtility,outletStatus,role) {
    $scope.outletID = outletID;
    $scope.role = role;
    $scope.outletStatus=outletStatus;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

      $scope.getOutletFeasibilityDetails = function() {
        $http.get('/operations/chains/outlets/' + $scope.outletID + '/feasibility/')
        .success(function(response){
            $scope.outletDetails = response.outlet_details;
            $scope.feasibilityDetails = response.feasibility_details;
            $scope.segmentWiseCount = response.feasibility_details.segment_wise_count;
            $scope.rateCardDetails = response.outlet_details.rate_card;
            $scope.segmentData = $scope.generateFeasibilityData();
        })
        .error(function(response){
            commonUtility.displayErrorMsg("Error in fetching outlet feasibility details.");
        })
      };
      $scope.getOutletFeasibilityDetails();

      $scope.generateFeasibilityData = function() {
        var segmentData = [];
        var segmentArray = [];

        for(var i = 0; i<$scope.segmentWiseCount.length; i++) {
            segmentArray = [];
            segmentArray.push($scope.segmentWiseCount[i].seller__chain__merchant_type__merchant_type + '');
            segmentArray.push($scope.segmentWiseCount[i].orders + '');
            segmentData.push(segmentArray);
        }

        return segmentData;
      };

      $scope.approveOutletFeasibility = function(outletID, outletStatus) {
        $http.put('/operations/chains/outlets/' + outletID + '/feasibility/', {
            "manpower_required": $scope.manpowerRequired,
            "rider_count": $scope.riderCount,
            "remarks": $scope.remarks,
            "outlet_status": outletStatus,
            "outlet_feasibility_response": $scope.feasibilityDetails.outlet_feasibility_response
        })
        .success(function(response){
            commonUtility.displayErrorMsg(response.message);
            $mdDialog.hide();
        })
        .error(function(response){
            commonUtility.displayErrorMsg(response.message);
        })
      };
};

function editIncentiveController($scope, $mdDialog, $http, $timeout, $mdToast, incentive) {
    $scope.incentive = incentive;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

    $scope.date = new Date();

    // js for toast(alert) start
    var last = {
    bottom: true,
    top: false,
    left: false,
    right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
    .filter(function(pos) { return $scope.toastPosition[pos]; })
    .join(' ');
    };

    function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
    }
    // js for toast(alert) end 

    $scope.editIncentive = function(incentive) {
        $scope.incentive.date = $scope.date;
        $scope.editIncentiveLoading = true;
        $http.post('/operations/create/incentive/',{
            "incentive_id": incentive.id,
            "name": incentive.name,
            "amount": incentive.amount,
            "start_date": incentive.date
        })
        .success(function(response){
            $scope.editIncentiveLoading = false;
            $scope.hide();
            $mdToast.show(
                $mdToast.simple()
                .content('Incentive edited successfully')
                .position($scope.getToastPosition())
                .hideDelay(3000)
                );
        })
        .error(function(response){
            $scope.editIncentiveLoading = false;
            $mdToast.show(
                $mdToast.simple()
                .content('There is an error in editing incentive')
                .position($scope.getToastPosition())
                .hideDelay(3000)
                );

        })
    }
}

function uploadPhoneBillController($scope, $mdDialog, $http, $mdToast, Upload, $timeout) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

    $scope.date = new Date();

    // js for toast(alert) start
    var last = {
    bottom: true,
    top: false,
    left: false,
    right: true
    };
    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
    .filter(function(pos) { return $scope.toastPosition[pos]; })
    .join(' ');
    };

    function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
    }
    // js for toast(alert) end 

    $scope.log = '';
    $scope.filenames = '';
    $scope.publish = function(){
        var files = $scope.filenames;
        if (files && files.length) {
            var file1 = files[0];
            Upload.upload({
                url: '/operations/riders/phonebills/upload/',
                data: {
                    month: $scope.phonebill_uploadDate
                },
                file: file1
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
                progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
            }).success(function (data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }
                    $scope.log += '\n' + progress;
                });
            }).error(function(data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }   
                    $scope.log += '\n' + progress;

                })
            })
        }
    };

    $scope.upload = function (files) {
        $scope.filenames = files
    }

    // for single monthpicker
    $scope.maxDate = new Date();

    $scope.clear = function () {
                        $scope.dt = null;
                    };

    $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                  };  

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1,
        'datepicker-mode':"'month'",
        'min-mode':"month"   
    };

      
    $scope.initDate = new Date();
    $scope.format = 'yyyy-MM';
}

function kmPayoutController($scope, $mdDialog, $http, $timeout, rider) {
    $scope.rider = rider;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.minDate = new Date(rider.start_date);
    $scope.maxDate = new Date(rider.end_date);

    $scope.date = {
        startDate : new Date(rider.start_date),
        endDate : new Date(rider.end_date)
    };

    $scope.getKmPayoutDetails = function() {
        $http.get('/operations/riders/km-payouts/details/',{
            params:{
                start_date: new Date($scope.date.startDate),
                end_date: new Date($scope.date.endDate),
                km_payout_id: $scope.rider.id
            }
        })
        .success(function(response){
            $scope.salaryDetailsRider = response.data.rider_details;
            $scope.salaryDetails = response.data;
            $scope.incentives = $scope.salaryDetails.incentives;
            $scope.otAdditions = $scope.salaryDetails.admin_additions;
            $scope.otDeductions = $scope.salaryDetails.admin_deductions;
            $scope.referrals = $scope.salaryDetails.referral_bonus;
            $scope.additional_earnings = $scope.salaryDetails.additional_earnings;
            $scope.penalties = $scope.salaryDetails.penalties;
            $scope.basic_pay = $scope.salaryDetails.basic_pay;
            $scope.overtime = $scope.salaryDetails.overtime;
            $scope.lwoa_fine = $scope.salaryDetails.lwoa_fine;
            $scope.order_earnings = $scope.salaryDetails.order_earnings;
            $scope.kmPayoutDetails = response.data;
            $scope.kmPayouts = response.km_payouts;
            $scope.kmArrears = response.km_payouts;
        })
        .error(function(response){
            
        })
    }
    $scope.getKmPayoutDetails();
}

function RiderDemandCsvController($scope, $mdDialog, $http, Upload, $timeout,setterGetterService) {

  $scope.hide = function() {
      $mdDialog.hide();
  };
  $scope.cancel = function() {
      $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
      $mdDialog.hide(answer);
  };

  $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
  };

  $scope.log = '';
  $scope.filenames = '';

  $scope.upload = function (files) {
      $scope.filenames = files
  };

  $scope.publish = function(){
      var files = $scope.filenames;
      if (files && files.length) {
          var file1 = files[0];
          Upload.upload({
              url: "/operations/rider-demand/",
              file: file1
          }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
              progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
          }).success(function (data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.total_updates !== undefined) {
                        $scope.log += '\n' + 'Updated Rows: '+data.total_updates+ ' | Failed Rows: ' +data.total_updates_failed;
                    }
                    $scope.log += '\n' + progress;
                    if (data.error_summary) {
                        for (var i = 0; i < data.error_summary.length; i++) {
                            var key = data.error_summary[i]["row"][0] + " - " + data.error_summary[i]["row"][1] + " - " + data.error_summary[i]["row"][4];
                            var reason = data.error_summary[i]["errors"]
                            $scope.log += '\n' + 'Failed Row: ' + key + ' :: ' + 'Reason :' + reason;
                        };
                    }
                    $scope.filenames = '';
                    
                    setterGetterService.setShouldLoad(true);
              });
          }).error(function(data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    $scope.log += '\n' + progress;
                    $scope.filenames = '';
                })
          })
      }
  }
}

function KmPayoutCsvController($scope, $mdDialog, $http, Upload, $timeout, payout, flag,setterGetterService) {
  $scope.payout = payout;
  $scope.flag = flag;

  if($scope.payout == 2 && $scope.flag == 2) {
    $scope.title="Upload file to Transfer KM Pay"
  } 
  else if($scope.payout == 3 && $scope.flag == 2) {
    $scope.title="Upload file to Hold KM Pay"
  } 
  else if($scope.payout == 2 && $scope.flag == 1) {
    $scope.title="Upload file to Transfer Salary Pay"
  } 
  else if($scope.payout == 3 && $scope.flag == 1) {
    $scope.title="Upload file to Hold Salary Pay"
  }
  else if($scope.payout == 4 && $scope.flag == 3) {
    $scope.title="Upload file to update daily km payouts"
  }

  $scope.hide = function() {
      $mdDialog.hide();
  };
  $scope.cancel = function() {
      $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
      $mdDialog.hide(answer);
  };

  $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
  };

  // for week selection 
  $scope.formData = {};
  $scope.data = {};
  $scope.initDate = new Date();
  
  $scope.weekOptions = {
      formatYear: 'yy',
      startingDay: 0,
      initDate: $scope.initDate,
      showWeeks:'false'
  };
  
  $scope.$watch('formData.dueDate',function(dateVal){
      var weekYear = getWeekNumber(dateVal);
      var year = weekYear[0];
      var week = weekYear[1];
      
      if(angular.isDefined(week) && angular.isDefined(year)){
        var startDate = getStartDateOfWeek(week, year);
      }
      var weekPeriod = getStartDateOfWeek(week, year);
      if(weekPeriod[0] != 'NaN/NaN/NaN' && weekPeriod[1] != 'NaN/NaN/NaN'){
        $scope.formData.dueDate = weekPeriod[0] + " to "+ weekPeriod[1];
        $scope.startDate = weekPeriod[0].toString();
        $scope.endDate = weekPeriod[1].toString();
      }
  });
  
  function getStartDateOfWeek(w, y) {
      var simple = new Date(y, 0, 1 + (w - 1) * 7);
      var dow = simple.getDay();
      var ISOweekStart = simple;
      if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay());
      else
        ISOweekStart.setDate(simple.getDate() + 7 - simple.getDay());
        
      var ISOweekEnd = new Date(ISOweekStart);
      ISOweekEnd.setDate(ISOweekEnd.getDate() + 6);
      
      ISOweekStart = ISOweekStart.getDate()+'/'+(ISOweekStart.getMonth()+1)+'/'+ISOweekStart.getFullYear();
      ISOweekEnd = ISOweekEnd.getDate()+'/'+(ISOweekEnd.getMonth()+1)+'/'+ISOweekEnd.getFullYear();
      return [ISOweekStart, ISOweekEnd];
  }
  
  function getWeekNumber(d) {
      d = new Date(+d);
      d.setHours(0,0,0);
      d.setDate(d.getDate() + 4 - (d.getDay()||7));
      var yearStart = new Date(d.getFullYear(),0,1);
      var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
      return [d.getFullYear(), weekNo];
  }

  $scope.log = '';
  $scope.filenames = '';
  $scope.publish = function(){
      if($scope.flag == 1) {
          var url = '/operations/riders/salary-payouts/upload/';
          var parameters = {
              payout_month: $scope.month,
              status: $scope.payout
          };
      }
      else if($scope.flag == 2) {
          var url = '/operations/riders/km-payouts/upload/';
          var parameters = {
              start_date: $scope.startDate,
              end_date: $scope.endDate,
              status: $scope.payout
          };
      }
      else if($scope.flag == 3) {
          var url = '/operations/riders/upload-daily-payout/';
          var parameters = {
              date: formatDate($scope.date2)
          };
      }
      var files = $scope.filenames;
      if (files && files.length && $scope.flag == 3) {
          var file1 = files[0];
          Upload.upload({
              url: url,
              data: parameters,
              file: file1
          }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
              progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
          }).success(function (data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.update_failed_rows.length== 0) {
                        $scope.log += '\n' + 'Updated Rows : '+data.total_updates+ ' | Failed Rows :' +data.total_updates_failed;
                    }
                    $scope.log += '\n' + progress;
                    
                    setterGetterService.setShouldLoad(true);
              });
          }).error(function(data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    $scope.log += '\n' + progress;
                    for (var i = 0; i < data.error_summary.length; i++) {
                        var key = Object.keys(data.error_summary[i])
                        $scope.log += '\n' + 'Failed Row No: '+key +'\n'+ 'Reason :' +data.error_summary[i][key];
                    };

                })
          })
      }
      else if (files && files.length && $scope.flag != 3) {
          var file1 = files[0];
          Upload.upload({
              url: url,
              data: parameters,
              file: file1
          }).progress(function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
              progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
          }).success(function (data, status, headers, config) {
              $timeout(function() {
                  $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                  if(data.failed_rows != []) {
                      $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                  }
                  $scope.log += '\n' + progress;
              });
          }).error(function(data, status, headers, config) {
              $timeout(function() {
                  $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                  $scope.log += '\n' + progress;

              })
          })
      }
  };

  $scope.upload = function (files) {
      $scope.filenames = files
  };

    //for single monthpicker
    $scope.maxDate = new Date(); 

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1,
        'datepicker-mode':"'month'",
        'min-mode':"month"   
    };

    $scope.dateOptions2 = { 
    };
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
      
    $scope.initDate = new Date();
    $scope.format = 'yyyy-MM';

    $scope.openDate = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };  

    $scope.date_format = 'yyyy-MM-dd';

}

function SalaryAdjustmentsController($scope, $mdDialog, $http, $mdToast, $timeout, Upload, commonUtility) {

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

    $scope.last_month = function() {
        var date = new Date();
        date.setDate(1);
        date.setHours(-1);
        return monthNames[date.getMonth()];
    }();

    $scope.last_month_last_date = function() {
        var date = new Date();
        date.setDate(1);
        date.setHours(-1);
        return date.getDate();
    }();

    $scope.current_month = function() {
        var date = new Date();
        return monthNames[date.getMonth()];
    }();

    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };

    $scope.toastPosition = angular.extend({},last);

    var date = new Date();

    $scope.payment_cycles = [{"id": "bi_weekly", "name": "Bi-Weekly"}, {"id": "monthly", "name": "Monthly"}];
    if (date.getDate() <= 7) {
        $scope.payment_cycles = [{"id": "bi_weekly", "name": "Bi-Weekly (16 - " + $scope.last_month_last_date + " " + $scope.last_month + ")"}, {"id": "monthly", "name": "Monthly (" + $scope.last_month + ")"}];
    }

    if (date.getDate() > 15 && date.getDate() < 23) { 
        $scope.payment_cycles = [{"id": "bi_weekly", "name": "Bi-Weekly (1 - 15 " + $scope.current_month + ")"}];
    }

    $scope.log = '';
    $scope.filenames = '';
    $scope.updateSalaryAdjustments = function() {
        var files = $scope.filenames;
        if (files && files.length) {
            var file1 = files[0];
            Upload.upload({
                url: '/operations/salary-adjustments/',
                data: {"payment_cycle": $scope.payment_cycle},
                file: file1
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
                progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
            }).success(function (data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }
                    $scope.log += '\n' + progress;
                });
            }).error(function(data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }   
                    $scope.log += '\n' + progress;

                })
            })
        }
    };

    $scope.upload = function (files) {
        $scope.filenames = files
    };
}

function DailyPayoutsCronController($scope, $mdDialog, $http, $mdToast, commonUtility) {

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.yesterdayDate = function(){
        var todayTimeStamp = +new Date; // Unix timestamp in milliseconds
        var oneDayTimeStamp = 1000 * 60 * 60 * 24; // Milliseconds in a day
        var diff = todayTimeStamp - oneDayTimeStamp;
        var yesterdayDate = new Date(diff);
        return yesterdayDate.toDateString();
    }();


    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    var last = {
        bottom: true,
        top: false,
        left: false,
        right: true
    };

    $scope.toastPosition = angular.extend({},last);

    $scope.runPayoutsCron = function () {
        $http.get('operations/run_daily_payouts_cron/')
        .success(function(response){
            $scope.message = response['message'];
            $mdDialog.hide();
            commonUtility.displayErrorMsg(response['message']);
        })
        .error(function(response){
            $scope.message = response['message'];
            $mdDialog.hide();
            commonUtility.displayErrorMsg(response['message']);
        })
    };

}

function PayoutIssuesController($scope, $mdDialog, $http, Upload, $timeout) {

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.maxDate = new Date();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        initDate: $scope.payoutDate,
        startingDay: 1,
    };
      
      
    $scope.payoutDate = new Date();
    $scope.format = 'yyyy-MM-dd';

    $scope.log = '';
    $scope.filenames = '';

    $scope.publish = function(){
        var files = $scope.filenames;
        if (files && files.length) {
            var file1 = files[0];
            Upload.upload({
                url: '/operations/riders/daily-payouts/approve/',
                data: {
                    date: $scope.payoutDate
                },
                file: file1
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
                progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
            }).success(function (data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rider Ids : ' + data.failed_rows;
                    }
                    $scope.log += '\n' + progress;
                });
            }).error(function(data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rider Ids : ' + data.failed_rows;
                    }   
                    $scope.log += '\n' + progress;

                })
            })
        }
    };

    $scope.upload = function (files) {
        $scope.filenames = files
    };

}
function salaryPayoutController($scope, $mdDialog, $http, $timeout, rider) {
    $scope.rider = rider;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    var currentTime = new Date(rider.payout_month); 
    $scope.minDate = new Date(currentTime.getFullYear(), currentTime.getMonth() ,1); 
    $scope.maxDate =  new Date(currentTime.getFullYear(), currentTime.getMonth() +1,0); 

    $scope.date = {
        startDate : $scope.minDate,
        endDate : $scope.maxDate
    };

    $scope.getSalaryPayoutDetails = function() {
        $http.get('/operations/riders/salary-payouts/details/',{
            params:{
                rider_id: rider.rider_id,
                payout_month: rider.payout_month,
                start_date: new Date($scope.date.startDate),
                end_date: new Date($scope.date.endDate)
            }
        })
        .success(function(response){
            $scope.salaryDetailsRider = response.data.rider_details;
            $scope.salaryDetails = response.data;
            $scope.basicPays = $scope.salaryDetails.basic;
            $scope.overtimePays = $scope.salaryDetails.overtime;
            $scope.incentives = $scope.salaryDetails.incentives;
            $scope.lwoafs = $scope.salaryDetails.lwoa_fine;
            $scope.otherFines = $scope.salaryDetails.fines;
            $scope.phBillsDeductions = $scope.salaryDetails.phone_bill;
            $scope.deposits = $scope.salaryDetails.security;
            $scope.arrears = $scope.salaryDetails.salary_arrears;
            $scope.otAdditions = $scope.salaryDetails.admin_additions;
            $scope.otDeductions = $scope.salaryDetails.admin_deductions;
            $scope.referrals = $scope.salaryDetails.referral_bonus;
            $scope.ojts = $scope.salaryDetails.ojt;
            $scope.availability_bonuses = $scope.salaryDetails.availability_bonus;
            $scope.additional_earnings = $scope.salaryDetails.additional_earnings;
            $scope.penalties = $scope.salaryDetails.penalties;
            $scope.order_earnings = $scope.salaryDetails.order_earnings;
        })
        .error(function(response){
            
        })
    }
    $scope.getSalaryPayoutDetails();

    $scope.fullNFinal = function(payoutID) {
        $http.post('/operations/riders/salary-payouts/fnf/',{
            payout_id: payoutID,
            fnf_status: $scope.fnfset
        })
        .success(function(response){
            $scope.hide();
        })
        .error(function(response){
            $scope.hide();
        })
    }
} 

function biWeekSalaryPayoutController($scope, $mdDialog, $http, $timeout, rider) {
    $scope.rider = rider;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    var start_date = new Date(rider.start_date);
    var end_date = new Date(rider.end_date); 
    $scope.minDate = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate()); 
    $scope.maxDate =  new Date(end_date.getFullYear(), end_date.getMonth(), end_date.getDate()); 

    $scope.date = {
        startDate : $scope.minDate,
        endDate : $scope.maxDate
    };

    $scope.getSalaryPayoutDetails = function() {
        $http.get('/operations/riders/biweekly-salary-payouts/details/',{
            params:{
                rider_id: rider.rider_id,
                start_date: new Date($scope.date.startDate),
                end_date: new Date($scope.date.endDate)
            }
        })
        .success(function(response){
            $scope.salaryDetailsRider = response.data.rider_details;
            $scope.salaryDetails = response.data;
            $scope.basicPays = $scope.salaryDetails.basic;
            $scope.overtimePays = $scope.salaryDetails.overtime;
            $scope.incentives = $scope.salaryDetails.incentives;
            $scope.lwoafs = $scope.salaryDetails.lwoa_fine;
            $scope.otherFines = $scope.salaryDetails.fines;
            $scope.arrears = $scope.salaryDetails.salary_arrears;
            $scope.otAdditions = $scope.salaryDetails.admin_additions;
            $scope.otDeductions = $scope.salaryDetails.admin_deductions;
            $scope.referrals = $scope.salaryDetails.referral_bonus;
            $scope.additional_earnings = $scope.salaryDetails.additional_earnings;
            $scope.penalties = $scope.salaryDetails.penalties;
            $scope.order_earnings = $scope.salaryDetails.order_earnings;
        })
        .error(function(response){
            
        })
    }
    $scope.getSalaryPayoutDetails();
} 

function dailyPayoutController($scope, $rootScope, $mdDialog, $http, $timeout, rider) {
    $scope.rider = rider;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    $scope.maxDate = new Date();

    $scope.clear = function () {
                        $scope.dt = null;
                    };

    $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = true;
                  };

    $scope.dateOptions = {
                            formatYear: 'yy',
                            initDate: $scope.initDate,
                            startingDay: 1,
                        };
      
      
    $scope.initDate = new Date();
    $scope.format = 'yyyy-MM-dd';

    $scope.getDailyPayoutDetails = function() {
        $scope.payoutBreakupLoading = true;
        $http.get('/operations/riders/daily-payouts/details/',{
            params:{
                rider_id: rider.rider_id,
                payout_id: rider.id,
                payout_date: rider.payout_date
            }
        })
        .success(function(response){
            $scope.payoutBreakupLoading = false;
            $scope.dailyDetails = response.data;
            $scope.dailyPayouts = response.data.rider_details;
            $scope.dt = $scope.dailyPayouts.payout_date;
            $scope.payoutIssues = response.data.rider_details.issues;
            $scope.basicPay = $scope.dailyDetails.basic;
            $scope.overtimePay = $scope.dailyDetails.overtime;
            $scope.incentives = $scope.dailyDetails.incentives;
            $scope.lwoaf = $scope.dailyDetails.lwoa_fine;
            $scope.otherFines = $scope.dailyDetails.fines;
            $scope.phBillsDeduction = $scope.dailyDetails.phone_bill;
            $scope.deposit = $scope.dailyDetails.security;
            $scope.arrear = $scope.dailyDetails.salary_arrears;
            $scope.otAdditions = $scope.dailyDetails.admin_additions;
            $scope.otDeductions = $scope.dailyDetails.admin_deductions;
            $scope.referral = $scope.dailyDetails.referral_bonus;
            $scope.ojt = $scope.dailyDetails.ojt;
            $scope.availability_bonus = $scope.dailyDetails.availability_bonus;
            $scope.kmPay = $scope.dailyDetails.kmPay;
            $scope.kmArrears = $scope.dailyDetails.kmArrears;
            $scope.additional_earnings = $scope.dailyDetails.additional_earnings;
            $scope.penalties = $scope.dailyDetails.penalties;
        })
        .error(function(response){
            $scope.payoutBreakupLoading = false;
        })
    }
    $scope.getDailyPayoutDetails();

    $scope.changeDailyPayStatus = function(status, payoutID) {
        payout_id = [payoutID];
        $http.put('/operations/riders/daily-payouts/status/',{
            payout_id: payout_id,
            status: status
        })
        .success(function(response){
            $scope.hide();
            $rootScope.$broadcast('approvePayout:success');
        })
        .error(function(response){
            $scope.hide();
        })
    }
} 

function riderTicketController($scope, $mdDialog, $http, $timeout, Upload, $rootScope) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };

    $scope.uploaded = false;

    $scope.categoryList = [
        {
            id:'0',
            name: "Payout Additions"
        },
        {
            id: '1',
            name: "Payout Deductions"
        },
        {
            id:'2',
            name: "Audit"
        },
        {
            id: '3',
            name: "Inventory"
        }
    ];

    $scope.paymentCycleList = [
        {
            id:0,
            name: "Weekly"
        },
        {
            id: 1,
            name: "Monthly"
        },
        {
            id: 2,
            name: "Bi_Weekly"
        }
    ];

    $scope.clickCat = function(ticketCat) {
        $scope.ticketFine = ticketCat.fine_amount; 
    }

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.ticketPayoutDate = new Date();

    $scope.dateOptions = {
        formatYear: 'yy',
        initDate: $scope.ticketPayoutDate,
        startingDay: 1
    };
      
    $scope.format = 'yyyy-MM-dd';

    $scope.minTicketDate = function(){
        var today = new Date();
        today.setDate(today.getDate()-1);
        return today;
    }();

    $scope.fetchCategoryList = function(type) {
        $http.get('/operations/ticket/category/',{
          params: {
            category_against:type,
        }
        })
            .success(function(response){
                $scope.response = JSON.parse(response.data);
            })
    };
    $scope.fetchCategoryList(1);


    $scope.$watch('ticketCategory',function(value){
        if($scope.response && value)
        {
            $scope.subCategoryList = $scope.response[value].tickets;  
        }
    });

    $scope.log = '';
    $scope.filenames = '';

    function convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date(inputFormat);
      return [pad(d.getFullYear()), pad(d.getMonth()+1), d.getDate()].join('-');
    }

    $scope.uploadTickets = function(){
        var files = $scope.filenames;
        if (files && files.length) {
            var file1 = files[0];
            Upload.upload({
                url: '/operations/ticket/multiple/',
                data: {
                    'type_ticket': 1,
                    'category_id': $scope.ticketSubCategory,
                    'description': $scope.ticketDetails,
                    'amount': $scope.ticketFine,
                    'payment_cycle' : $scope.ticketPaymentCycle,
                    'closed_date': convertDate($scope.ticketPayoutDate)
                },
                file: file1
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
                progress = 'progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n' ;
            }).success(function (data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : ' + data.failed_rows;
                    }
                    $scope.log += '\n' + progress;
                    $scope.uploaded = true;
                });
                $rootScope.$broadcast("tickets:uploaded:successfully");
            }).error(function(data, status, headers, config) {
                $timeout(function() {
                    $scope.log = 'File: ' + config.file.name + '\n' + 'Response: ' + data.message;
                    if(data.failed_rows != []) {
                        $scope.log += '\n' + 'Failed Rows : '
                        angular.forEach(data.failed_rows, function(value, key){
                            $scope.log += "\n  " + value.row+ " - " + value.errors;
                        })
                    }   
                    $scope.log += '\n' + progress;

                })
            })
        }
    };

    $scope.selectFile = function (files) {
        $scope.filenames = files
    };
}