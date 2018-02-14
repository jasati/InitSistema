(function() {
    'use strict';

    angular
        .module('cad.perfil')
        .service('PerfilFuncService', PerfilFuncService);

    PerfilFuncService.$inject = [
      'UtilsFunctions','Dataset','UtilsDataFunctionService','FiltroService','ModulosFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function PerfilFuncService(
      UtilsFunctions,Dataset,UtilsDataFunctionService,FiltroService,ModulosFuncService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = Dataset.perfil();
          var datasetModulosPerfil = Dataset.perfilModulos();
          var datasetModulosGrupo = Dataset.modulosGrp();
          var datasetModulosSis = Dataset.modulosSis();
          vm.perfil = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.modulosGrp = new UtilsDataFunctionService.dataFuncoes(datasetModulosGrupo);
          vm.modulosSis = new UtilsDataFunctionService.dataFuncoes(datasetModulosSis);
          vm.title = 'Perfil de acesso';
          vm.divider = 'botton';

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.perfil.filtros.mainField)) {
              query += " and nome LIKE '%"+vm.perfil.filtros.mainField+"%'";
            }
            vm.perfil.read(query);
          }

          vm.showModulos = function (row) {

            vm.perfil.alterar(row,'layout.ctrlAcesso.perfils.permissoes');
            vm.modulosGrp.read('',false);
            vm.modulosSis.read('',false);

            vm.perfil.setNewChilder(ModulosFuncService,row,true);
          }

          vm.novoPerfil = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
              .title('Adicionar novo Perfil')
              .placeholder('Descrição do perfil')
              .ariaLabel('Perfil')
              .targetEvent(ev)
              .ok('salvar')
              .cancel('cancelar');

            $mdDialog.show(confirm).then(function(result) {
              if (isset(result)) {
                var perfil = {nome:result};
                vm.perfil.novo(perfil);
                vm.perfil.salvar();
              }
            }, function (result) {
              console.log('cancelou');
            });
          }
          vm.alterarPerfil = function(ev,data) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
              .title('Alterar Perfil')
              .placeholder('Descrição do perfil')
              .ariaLabel('Perfil')
              .initialValue(data.nome)
              .targetEvent(ev)
              .ok('salvar')
              .cancel('cancelar');

            $mdDialog.show(confirm).then(function(result) {
              if (isset(result)) {
                data.nome=result;
                vm.perfil.alterar(data);
                vm.perfil.salvar();
              }
            }, function (result) {
              console.log('cancelou');
            });
          }

          vm.deletar = function (ev,data) {
            vm.perfil.confirmDel(ev,data.nome).then(function (result) {
              if (result) {
                vm.perfil.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.verificarModulos = function () {
            var qtModulosPerfil = vm.perfil.row.child.data.rows.length;
            var qtModulosSis = vm.modulosSis.rows.length;
            if (qtModulosPerfil < qtModulosSis) {
              return true;
            } else {
              return false;
            }
          }

          vm.atualizarModulos = function () {
            for (var i = 0; i < vm.modulosSis.rows.length; i++) {
              var data = $filter('filter')(vm.perfil.row.child.data.rows,{'id_modulo':vm.modulosSis.rows[i].id_modulo},true);
              if (data.length === 0) {
                var row = {
                  id_modulo:vm.modulosSis.rows[i].id_modulo,
                  id_perfil:vm.perfil.row.id_perfil,
                  modulo   :vm.modulosSis.rows[i].nome,
                  id_mg    :vm.modulosSis.rows[i].id_mg,
                };
                vm.perfil.row.child.data.adicionar(row);
              }
            }
          }

          vm.startFiltro = function () {
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.perfil.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.perfil.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.perfil.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.perfil.filtros.functionRead();//chama a consulta
          }


        }
    }
})();
