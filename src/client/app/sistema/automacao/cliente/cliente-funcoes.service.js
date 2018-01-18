(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('ClienteFuncService', ClienteFuncService);

    ClienteFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService','PessoaFuncService','TabelaFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function ClienteFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,PessoaFuncService,TabelaFuncService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = AutomacaoDataset.cliente();
          var dataSetTabela = AutomacaoDataset.classeTabela();
          vm.cliente = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.pessoaFunc = new PessoaFuncService.funcoes();
          vm.tabela = new TabelaFuncService.funcoes();
          vm.divider = 'botton';
          vm.title = 'Modulo de cliente';

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.cliente.filtros.mainField)) {
              query += " and p.nome_comp LIKE '"+vm.cliente.filtros.mainField+"%'";
            }
            vm.cliente.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,id) {
            var query = "";
            if (isset(prm)) {
              query += " and p.nome_comp LIKE '"+prm+"%'";
            }
            if (isset(id)) {
              query += " and c.id_pessoa = "+id;
            }
            return vm.cliente.load(query,true).then(function (result) {
              return result.reg;
            });
          }

          vm.filtrarTabela = function () {
            if (vm.tabela.data.rows.length == 0) {
              vm.tabela.data.read('');
            }
          }

          vm.print1 = function () {
            var styleTable = UtilsFunctions.stylePrintTable();
            var tpl = '<style>  #printable {display: block;font: 9pt courier;color: #000;line-height: 1.4em;}'+styleTable+'  </style>';
            tpl=tpl+"<div class='row'><div class='col-xs-12' id='printable'>";
            /*cabeçario*/
            tpl=tpl+"<div class='page-header'>";
            tpl=tpl+"<h1>Clientes</h1>";
            tpl=tpl+"</div>";

            /*corpo*/

            tpl=tpl+"<div><table class='table table-condensed'>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width: 2%'>ID</th>";
            tpl=tpl+"<th style='width: 30%'>Cliente</th>";
            tpl=tpl+"<th style='width: 15%'>CPF/CNPJ</th>";
            tpl=tpl+"<th style='width: 20%'>Cidade</th>";
            tpl=tpl+"<th style='width: 15%'>Bairro</th>";
            tpl=tpl+"<th style='width: 18%'>Telefone</th>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            angular.forEach(vm.cliente.rows, function(value, key){
                tpl=tpl+"<tr><td>"+value.id_cliente+"</td>";
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

            //  document.getElementById('print').innerHTML = tpl;
            // setTimeout(function () {
            //   print();
            // },3000);

             // var newWin= window.open("");
             // newWin.document.write(tpl);
             // newWin.print();
             // newWin.close();
             // 
              window.frames["print_frame"].document.body.innerHTML = tpl;
              window.frames["print_frame"].window.focus();
              window.frames["print_frame"].window.print();// 
            
            // var config = {
            //   template: tpl,
            //   size:'',
            //   data:vm,
            //   backdrop:true,
            //   fullscreen:false,
            //   modal:{},
            // };
            // vm.cliente.showModal(config);
          }

          vm.novo = function (data) {
            vm.cliente.novo(data,'layout.cliente.cadastro');
            vm.pessoaFunc.pessoa.novo(data);
          }

          vm.alterar = function (row) {
            vm.cliente.alterar(row,'layout.cliente.cadastro');
            vm.pessoaFunc.load(row.id_pessoa);
          }

          vm.salvar = function () {
            vm.pessoaFunc.pessoa.salvar().then(function (result) {
              if (!isset(vm.cliente.row.id_pessoa)) {
                vm.cliente.row.id_pessoa = vm.pessoaFunc.pessoa.row.id_pessoa;
              }
              vm.cliente.salvar();
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

            // var config = {
            //   templateUrl: 'app/sistema/automacao/cliente/templates/cliente-cad.html',
            //   size:'',
            //   data:vm,
            //   backdrop:'static',
            //   fullscreen:false,
            //   modal:{},
            // };
            // vm.cliente.showModal(config);
          }

          vm.deletar = function (ev,data) {
            vm.cliente.confirmDel(ev,data.nome_comp).then(function (result) {
              if (result) {
                vm.cliente.deletar([data]).then(function (deletado) {
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
