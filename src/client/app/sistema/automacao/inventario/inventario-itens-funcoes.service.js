(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('InvItensFuncService', InvItensFuncService);

    InvItensFuncService.$inject = [
      'UtilsFunctions','InventarioDataSet','UtilsDataFunctionService','FiltroService',
      '$state','$mdDialog','$filter','logger'
    ];

    /* @ngInject */
    function InvItensFuncService(
      UtilsFunctions,InventarioDataSet,UtilsDataFunctionService,FiltroService,
      $state,$mdDialog,$filter,logger
    )
    {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.onEnter = UtilsFunctions.handleEnter;
          var dataSetDetalhe = new InventarioDataSet.dataSetDetalhe();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetDetalhe);
          vm.data.title = "Itens do inventário de estoque";

          vm.activate = function () {
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionDinamic = vm.filtroAutoComplete;//função que aciona o auto complete do filtro
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.data.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.data.filtros.functionRead();//chama a consulta
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.data.rowParent)) {
              query += ' and ei.id_inventario = '+vm.data.rowParent.id_inventario;
            }
            if (isset(vm.data.filtros.mainField)) {
              query += " and i.descricao LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,false);//limitar os registro            
          }

          vm.filtroAutoComplete = function (prm) {
            var query = " and i.descricao LIKE '"+prm+"%'";
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.addItens = function (itens) {
            for (var i = 0; i < itens.length; i++) {
              vm.data.adicionar(itens[i]);
            }
          }

          vm.validarContagem = function (data) {
            if (!data || data <= 0) {
                return 'A quantidade deve ser igual ou maior que 0.01';
            }
          }

          vm.printContInv = function (master,detal) {
            var styleTable = UtilsFunctions.stylePrintTable();
            var tpl = '<style>  #printable {display: block;font: 8pt courier;color: #000;line-height: 1.4em;}'+styleTable+'  </style>';
            tpl=tpl+"<div class='row'><div class='col-xs-12' id='printable'>";
            /*cabeçario*/
            tpl=tpl+"<div align='center'> <h1>Inventário de Estoque</h1></div>";
            tpl=tpl+"<div class='col-xs-4'>";
            tpl=tpl+"<p><b>Data : </b> "+$filter('date')(master.data_cad,'dd/MM/yyyy HH:mm')+"</p>";
            tpl=tpl+"</div>"
            tpl=tpl+"<div class='col-xs-8'>";
            tpl=tpl+"<p><b>Categoria da Contagem : </b> "+master.categoria+"</p>";
            tpl=tpl+"</div> <hr>"

            /*corpo*/

            tpl=tpl+"<div class=''><table class='table table-condensed table-striped'>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width: 10%'>Código.</th>";
            tpl=tpl+"<th style='width: 50%'>Item</th>";
            tpl=tpl+"<th style='width: 20%'>Marca</th>";
            tpl=tpl+"<th style='width: 5%'>UNI</th>";
            tpl=tpl+"<th style='width: 15%'>Quantidade</th>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            angular.forEach(detal, function(value, key){
                tpl=tpl+"<tr class='striped'>";
                tpl=tpl+"<td>"+value.codigo+"</td>";
                tpl=tpl+"<td>"+value.descricao+"</td>";
                tpl=tpl+"<td>"+value.marca+"</td>";
                tpl=tpl+"<td>"+value.sigla+"</td>";
                tpl=tpl+"<td>________</td></tr>"
            });
            tpl=tpl+"</tbody></table></div>";
            /*fim container*/
            tpl=tpl+"</div></div>";


            window.frames["print_frame"].document.body.innerHTML = tpl;
            window.frames["print_frame"].window.focus();
            window.frames["print_frame"].window.print();// 

          }

        }
    }
})();
