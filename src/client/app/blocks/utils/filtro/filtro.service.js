(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .service('FiltroService', FiltroService);

    FiltroService.$inject = ['UtilsFunctions'];

    /* @ngInject */
    function FiltroService(UtilsFunctions) {
        this.funcoes = funcoes ;

        function funcoes () {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.filtros = {
              placeholder:'',
              showField:false,//mostrar o campo principal mainField
              flex:'0',
              mainField:'',//campo de pesquisa principal
              digitando:false,//saber se o campo estar sendo digitado
              configFiltro : false,//exibir ou nao a div de adicionar filtro
              fields : [],//campos que podem ser pesquisados
              fildsQuery:[],//campos que foram adicionados para pesquisar
              functionRead:{},//função que chama a pesquisa na api
              functionDinamic:{},//funçao que faz a pesquisa em autocomplete
              fieldDinamic:'',//campo que liga ao text de pesquisa do autocomplete
              filtro:{},
              onClick:function(){//gatilho que seta a var showField e faz o procedimento para exibir o campo
                  vm.filtros.showField = !vm.filtros.showField;
                  if (vm.filtros.showField) {
                      vm.filtros.flex = '50';
                      var startFoco = function (argument) {
                        document.getElementById('filtro').focus();
                      }
                      setTimeout(startFoco,500);
                  } else {
                      vm.filtros.flex = '0';
                      vm.filtros.cleanFilter();
                  }
              },

              onChange:function () {//gatilho que seta a var digitando e faz a pesquisa automaticamente
                if (!vm.filtros.digitando) {
                  vm.filtros.digitando = true;
                  setTimeout(function(){
                    vm.filtros.digitando = false;
                    vm.filtros.functionRead();
                  }, 2000);
                }
              },

              showExpress:function (argument) {
                if (isset(vm.filtros.filtro.campo)) {
                  if (isset(vm.filtros.filtro.express)) {
                    if (vm.filtros.filtro.express == 'LOGICO') {
                      return false;
                    } else {
                      return true;
                    }
                  } else {
                    return true
                  }
                } else {
                  return false
                }
              },

              onCheangeFields:function (field) {//quando alterar o campo do filtro
                vm.filtros.filtro.alias=field.alias;
                vm.filtros.filtro.type=field.type;
                vm.filtros.filtro.typeValues=field.values;
                if (field.logico) {//ira conter no campo as expressoes : is, in ou not 
                  vm.filtros.filtro.express="LOGICO";
                } else if (vm.filtros.filtro.express) {
                  vm.filtros.filtro.express = '';
                }
                vm.filtros.filtro.value = null;
              },

              cleanFilter:function () {//gatilho que limpa o campo de pesquisa e faz a consulta
                if (vm.filtros.mainField != '') {
                  vm.filtros.mainField = '';
                  vm.filtros.functionRead();
                }
              },

              setConfigFiltro:function () {//gatilho que exibi a div de adicionar filtro
                vm.filtros.configFiltro = !vm.filtros.configFiltro;
              },

              addFiltro:function () {//gatilho que adiciona o filtro
                vm.filtros.fildsQuery.push(vm.filtros.filtro);
                vm.filtros.setConfigFiltro();
                vm.filtros.filtro = {};
                vm.filtros.functionRead();
              },

              onChangeDinamic:function (row) {
                vm.filtros.filtro.value = row[vm.filtros.filtro.typeValues];
              }
          };
        }
    }
})();
