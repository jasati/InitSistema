(function() {
    'use strict';

    angular
        .module('cad.empresa')
        .service('EmpresaFuncService', EmpresaFuncService);

    EmpresaFuncService.$inject = [
      'UtilsFunctions','Dataset','UtilsDataFunctionService','FiltroService','TabPrazosFuncService','TipoMovFuncService','ClienteFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function EmpresaFuncService(
      UtilsFunctions,Dataset,UtilsDataFunctionService,FiltroService,TabPrazosFuncService,TipoMovFuncService,ClienteFuncService,
      $state,$mdDialog,$filter
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSet = new Dataset.empresas();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSet);
          vm.tabela = new TabPrazosFuncService.funcoes();
          vm.tipoMov = new TipoMovFuncService.funcoes();
          vm.cliente = new ClienteFuncService.funcoes();
          vm.data.title = "Configurações";
          vm.activate = function () {
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Nova Empresa',
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
            var query = '';
            if (isset(vm.data.filtros.mainField)) {
              query += " and nome LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.load = function () {
            vm.data.alterar(dataSet.empresa);
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and nome LIKE '"+prm+"%'";
            return vm.data.load(query,false).then(function (result) {
              return result.reg;
            });
          }

          vm.changeAutoCompleteTab = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.descricao)) {
                rowEdit.tabela = rowSelect.tabela+' '+rowSelect.descricao;
                rowEdit.config_id_tp_padrao = rowSelect.id_tp;
              }
            } else {
              rowEdit.tabela = '';
              rowEdit.config_id_tp_padrao = null;
            }
          }

          vm.changeAutoCompleteTipoMov = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.descricao)) {
                rowEdit.tipo_mov = rowSelect.descricao;
                rowEdit.config_id_tipo_mov_ven_cons = rowSelect.id_tipo_mov;
              }
            } else {
              rowEdit.tipo_mov = '';
              rowEdit.config_id_tipo_mov_ven_cons = null;
            }
          }

          vm.changeAutoCompleteCli = function (rowEdit,rowSelect) {
            if (isset(rowSelect)) {
              if (isset(rowSelect.nome_comp)) {
                rowEdit.consumidor = rowSelect.nome_red+" - "+rowSelect.nome_comp;
                rowEdit.config_id_pessoa_cons = rowSelect.id_pessoa;
              }
            } else {
              rowEdit.consumidor = '';
              rowEdit.config_id_pessoa_cons = null;
            }
          }

          vm.novo = function () {
            var data = {id_empresa:null};
            vm.data.novo(data,'');
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'');
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


        }
    }
})();
