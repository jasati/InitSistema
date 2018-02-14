(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('VendedorFuncService', VendedorFuncService);

    VendedorFuncService.$inject = [
      'UtilsFunctions','VendedorDataSet','UtilsDataFunctionService','PessoaFuncService','FiltroService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function VendedorFuncService(
      UtilsFunctions,VendedorDataSet,UtilsDataFunctionService,PessoaFuncService,FiltroService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = VendedorDataSet.vendedor();
          vm.data = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.pessoaFunc = new PessoaFuncService.funcoes();
          vm.data.title = 'Vendedores';

          vm.activate = function () {
            var funcFiltros = new FiltroService.funcoes();
            var toobarPrm = {
              btAddNovo  : vm.novo,
              btAddTootip: 'Novo Vendedor',
            };
            funcFiltros.filtros.fields = vm.data.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.data.filtroDefault;//setar o filtro default
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
              query += " and CONCAT(p.nome_comp,p.nome_red) LIKE '"+vm.data.filtros.mainField+"%'";
            }
            vm.data.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,id) {
            var query = "";
            if (isset(prm)) {
              query += " and CONCAT(p.nome_comp,p.nome_red) LIKE '"+prm+"%'";
            }
            if (isset(id)) {
              query += " and v.id_pessoa = "+id;
            }
            return vm.data.load(query,true).then(function (result) {
              return result.reg;
            });
          }


          vm.print1 = function () {
            var styleTable = UtilsFunctions.stylePrintTable();
            var tpl = '<style>  #printable {display: block;font: 9pt courier;color: #000;line-height: 1.4em;}'+styleTable+'  </style>';
            tpl=tpl+"<div class='row'><div class='col-xs-12' id='printable'>";
            /*cabeçario*/
            tpl=tpl+"<div class='page-header'>";
            tpl=tpl+"<h1>datas</h1>";
            tpl=tpl+"</div>";

            /*corpo*/

            tpl=tpl+"<div><table class='table table-condensed'>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width: 2%'>ID</th>";
            tpl=tpl+"<th style='width: 30%'>data</th>";
            tpl=tpl+"<th style='width: 15%'>CPF/CNPJ</th>";
            tpl=tpl+"<th style='width: 20%'>Cidade</th>";
            tpl=tpl+"<th style='width: 15%'>Bairro</th>";
            tpl=tpl+"<th style='width: 18%'>Telefone</th>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            angular.forEach(vm.data.rows, function(value, key){
                tpl=tpl+"<tr><td>"+value.id_vendedor+"</td>";
                tpl=tpl+"<td>"+value.nome_comp+"</td>";
                tpl=tpl+"<td>"+value.cpf_cnpj+"</td>";
                tpl=tpl+"<td>"+value.cidade+"</td>";
                tpl=tpl+"<td>"+value.bairro+"</td>";
                tpl=tpl+"<td>"+value.tel+"</td></tr>"
            });
            tpl=tpl+"</tbody></table></div>";
            /*roda pe*/
            tpl=tpl+"<hr>";
            /*fim container*/
            tpl=tpl+"</div></div>";

              window.frames["print_frame"].document.body.innerHTML = tpl;
              window.frames["print_frame"].window.focus();
              window.frames["print_frame"].window.print();// 
          }

          vm.novo = function (data) {
            var prm = {tipo:0};
            vm.data.novo(prm,'layout.vendedores.cadastro');
            vm.pessoaFunc.pessoa.novo(prm);
          }

          vm.alterar = function (row) {
            vm.data.alterar(row,'layout.vendedores.cadastro');
            vm.pessoaFunc.load(row.id_pessoa);
          }

          vm.salvar = function () {
            vm.pessoaFunc.pessoa.salvar().then(function (result) {
              if (!isset(vm.data.row.id_pessoa)) {
                vm.data.row.id_pessoa = vm.pessoaFunc.pessoa.row.id_pessoa;
              }
              vm.data.salvar();
            });
          }

          vm.cadastro = function (action,row,ev) {
            switch (action) {
              case 'create':
                vm.novo(row);
                break;
              case 'update':
                vm.alterar(row);
                break;
              default:
            }
          }

          vm.deletar = function (ev,data) {
            vm.data.confirmDel(ev,data.nome_comp).then(function (result) {
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
