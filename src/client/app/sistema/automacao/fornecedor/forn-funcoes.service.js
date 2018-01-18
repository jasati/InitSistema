(function() {
    'use strict';

    angular
        .module('app.automacao')
        .service('FornFuncService', FornFuncService);

    FornFuncService.$inject = [
      'UtilsFunctions','AutomacaoDataset','UtilsDataFunctionService','PessoaFuncService',
      '$state','$mdDialog','$filter'
    ];

    /* @ngInject */
    function FornFuncService(
      UtilsFunctions,AutomacaoDataset,UtilsDataFunctionService,PessoaFuncService,
      $state,$mdDialog,$filter
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetProvider = AutomacaoDataset.forn();
          vm.forn = new UtilsDataFunctionService.dataFuncoes(dataSetProvider);
          vm.pessoaFunc = new PessoaFuncService.funcoes();
          vm.divider = 'botton';
          vm.title = 'Modulo de Fornecedor';

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.forn.filtros.mainField)) {
              query += " and CONCAT(p.nome_comp,p.nome_red) LIKE '%"+vm.forn.filtros.mainField+"%'";
            }
            vm.forn.read(query,true);//limitar os registro
          }

          vm.filtroAutoComplete = function (prm,id) {
            var query = "";
            if (isset(prm)) {
              query += " and CONCAT(p.nome_comp,p.nome_red) LIKE '%"+prm+"%'";
            }
            if (isset(id)) {
              query += " and f.id_pessoa = "+id;
            }
            return vm.forn.load(query,true).then(function (result) {
              return result.reg;
            });
          }


          vm.print1 = function () {
            var styleTable = UtilsFunctions.stylePrintTable();
            var tpl = '<style>  #printable {display: block;font: 9pt courier;color: #000;line-height: 1.4em;}'+styleTable+'  </style>';
            tpl=tpl+"<div class='row'><div class='col-xs-12' id='printable'>";
            /*cabeçario*/
            tpl=tpl+"<div class='page-header'>";
            tpl=tpl+"<h1>Fornecedores</h1>";
            tpl=tpl+"</div>";

            /*corpo*/

            tpl=tpl+"<div><table class='table table-condensed'>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width: 2%'>ID</th>";
            tpl=tpl+"<th style='width: 30%'>Razão Social</th>";
            tpl=tpl+"<th style='width: 15%'>CPF/CNPJ</th>";
            tpl=tpl+"<th style='width: 20%'>Cidade</th>";
            tpl=tpl+"<th style='width: 15%'>Bairro</th>";
            tpl=tpl+"<th style='width: 18%'>Telefone</th>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            angular.forEach(vm.forn.rows, function(value, key){
                tpl=tpl+"<tr><td>"+value.id_fornecedor+"</td>";
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
            // vm.forn.showModal(config);
          }

          vm.novo = function (data) {
            vm.forn.novo(data,'layout.forn.cadastro');
            vm.pessoaFunc.pessoa.novo(data);
          }

          vm.alterar = function (row) {
            vm.forn.alterar(row,'layout.forn.cadastro');
            vm.pessoaFunc.load(row.id_pessoa);
          }

          vm.salvar = function () {
            vm.pessoaFunc.pessoa.salvar().then(function (result) {
              if (!isset(vm.forn.row.id_pessoa)) {
                vm.forn.row.id_pessoa = vm.pessoaFunc.pessoa.row.id_pessoa;
              }
              vm.forn.salvar();
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
            //   templateUrl: 'app/sistema/automacao/fornecedor/templates/forn-cad.html',
            //   size:'',
            //   data:vm,
            //   backdrop:'static',
            //   fullscreen:false,
            //   modal:{},
            // };
            // vm.forn.showModal(config);
          }

          vm.deletar = function (ev,data) {
            vm.forn.confirmDel(ev,data.nome_comp).then(function (result) {
              if (result) {
                vm.forn.deletar([data]).then(function (deletado) {
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
