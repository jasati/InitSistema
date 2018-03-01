(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('TipoMovFuncService', TipoMovFuncService);

    TipoMovFuncService.$inject = [
      'UtilsFunctions','TipoMovDataSet','UtilsDataFunctionService','FiltroService',
      '$state','$mdDialog','$filter','$rootScope'
    ];

    /* @ngInject */
    function TipoMovFuncService(
      UtilsFunctions,TipoMovDataSet,UtilsDataFunctionService,FiltroService,
      $state,$mdDialog,$filter,$rootScope
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = TipoMovDataSet.tipomov();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.data.setTitle('Tipos de Movimentação');
          vm.tabela =0;

          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Novo tipo de movimentação',
            };            
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionDinamic = vm.filtroAutoComplete;//função que aciona o auto complete do filtro      
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.data.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.data.setToolbar(toobarPrm);
            vm.data.setTable({alterar:vm.alterar});
            vm.data.setPagination();
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.filtrar = function () {
            var query = ' and tme.status = 1';
            if (isset(vm.data.filtros.mainField)) {
              query += " and tme.descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,false);//nao limitar os registro
          }

          vm.filtroAutoComplete = function (prm,tipo,id) {
            var query = " and tme.status = 1 ";
            if (isset(prm)) {
              query += " and tme.descricao LIKE '"+prm+"%'";;
            }
            if (isset(tipo)) {
              query += " and tme.tipo = '"+tipo+"'";
            }
            if (isset(id)) {
              query += " and tme.id_tipo_mov = "+id;
            }            
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.showMovs = function (row) {
            // função que altera o state para movs
            // as funçoes serao injetada via binds atraves do component e no resolve do router 
            vm.data.alterar(row);
            $state.go('layout.tipomov.movs',{tipomovDesc:row.descricao})
          }


          vm.novo = function () {
            var data = {};
            vm.data.novo(data,'layout.pgconfig.tipomovs.tipomovcad');
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.pgconfig.tipomovs.tipomovcad');
          }


          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.data.novo(row);
                break;
              case 'update':
                vm.data.alterar(row);
                break;
              default:
            }

            var config = {
              templateUrl: 'app/sistema/automacao/tipoMov/templates/tipoMov-cad.html',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            vm.data.showModal(config);
          }

          vm.deletar = function (ev,data) {
            vm.data.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.data.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.qtMovsOnTipo = function (tipo,id) {
            return vm.filtroAutoComplete('',tipo,id).then(function (result) {
              return result[0];
            });
          }

        }
    }
})();
