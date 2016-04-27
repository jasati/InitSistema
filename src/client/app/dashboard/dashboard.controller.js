(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$q', '$modal', 'dataservice', 'DataserviseProvider', 'logger','EmpresaService'];
    /* @ngInject */
    function DashboardController($q,$modal, dataservice, DataserviseProvider, logger,EmpresaService) {
        var vm = this;
        vm.news = {
            title: 'Base Sistema',
            description: 'Base Inicial para criação de Sistemas'
        };
        var dataset = DataserviseProvider.getPrmWebService()
        vm.messageCount = 0;
        vm.empresa = [];
        vm.title = 'Dashboard';
        vm.periodoChart = ['hora','dia','semana','mes','ano'];
        vm.opitionChartColor = ['#99e699', '#FF5252'];

        vm.chart = {
          dataIni:'',
          dataFim:'',
          dataGr:'',
          periodo:'hora'
        }

        vm.chartCx = {
          dataIni:'',
          dataFim:'',
        }
        vm.chartIm = {
          dataIni:'',
          dataFim:'',
        }        

        activate();

        function activate() {
            var promises = [
              getEmpresa(),
            ];
            return $q.all(promises).then(function() {
                logger.info('Janela Principal Ativa');
            });
        }

        function getMessageCount() {
            return dataservice.getMessageCount().then(function (data) {
                vm.messageCount = data;
                return vm.messageCount;
            });
        }

        function getEmpresa() {
            EmpresaService.load().then(function (data) {
                vm.empresa = data['reg'][0];
            });
        }

        function dataPadrao () {
          var dtIni = new Date();
          var dtFim = new Date();
          dtIni.setDate(1);
          vm.chart.dataIni = dtIni;
          vm.chart.dataFim = dtFim;
          vm.chartCx.dataIni = dtIni;
          vm.chartCx.dataFim = dtFim;
          vm.chartIm.dataIni = dtIni;
          vm.chartIm.dataFim = dtFim;          
        }

        function existe(index) {
          var x = false;
          for (var i = 0; i < vm.chartlabel.length; i++) {
            if (vm.chartlabel[i] == index) {
              return true;
            }
          }
          return x;
        }

    }
})();
