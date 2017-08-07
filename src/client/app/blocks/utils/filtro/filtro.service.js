(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .service('FiltroService', FiltroService);

    //FiltroService.$inject = [];

    /* @ngInject */
    function FiltroService() {
        this.funcoes = funcoes ;

        function funcoes () {
          var vm = this;
          vm.filtros = {
              showField:false,//mostrar o campo principal mainField
              flex:'0',
              mainField:'',//campo de pesquisa principal
              digitando:false,//saber se o campo estar sendo digitado
              configFiltro : false,//exibir ou nao a div de adicionar filtro
              fields : [],//campos que podem ser pesquisados
              fildsQuery:[],//campos que foram adicionados para pesquisar
              functionRead:{},//função que chama a pesquisa na api
              filtro:{},
              onClick:function(){//gatilho que seta a var showField e faz o procedimento para exibir o campo
                  vm.filtros.showField = !vm.filtros.showField;
                  if (vm.filtros.showField) {
                      vm.filtros.flex = '50';
                      document.getElementById('filtro').focus();
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

              onCheangeFields:function (field) {//quando alterar o campo do filtro
                vm.filtros.filtro.alias=field.alias;
                vm.filtros.filtro.type=field.type;
                vm.filtros.filtro.typeValues=field.values;
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
          };
        }
    }
})();
