(function() {
    'use strict';

    angular
        .module('app.psclse')
        .service('CoresFuncService', CoresFuncService);

    CoresFuncService.$inject = [
      'UtilsFunctions','UtilsDataFunctionService','PsicanaliseDataset','FiltroService','config',
      '$state','$mdDialog','$filter','$document','$mdPanel','$mdSidenav'
    ];

    /* @ngInject */
    function CoresFuncService(
      UtilsFunctions,UtilsDataFunctionService,PsicanaliseDataset,FiltroService,config,
      $state,$mdDialog,$filter,$document,$mdPanel,$mdSidenav
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var dataSetSessao = PsicanaliseDataset.sessao();
          var dataSetConfig = PsicanaliseDataset.configShowCor();
          vm.sessao = new UtilsDataFunctionService.dataFuncoes(dataSetSessao);
          vm.configShowCor = new UtilsDataFunctionService.dataFuncoes(dataSetConfig);
          vm.divider = 'botton';
          vm.title = 'Sessão';
          vm.linkAcesso = config.urlSistema+'?externo=psclse';
          function activate() {
            vm.configShowCor.read('',true).then(function functionName() {
              vm.startFiltro();
              vm.resetar();
            });
          }

          vm.filtrar = function () {
            var query = '';
            if (isset(vm.sessao.filtros.mainField)) {
              query += " and nome LIKE '%"+vm.sessao.filtros.mainField+"%'";
            }
            if (isset(vm.sessao.filtroExterno)) {
              query += vm.sessao.filtroExterno;
            }
            vm.sessao.read(query,true);//limitar os registros
          }

          vm.cadastro = function (action,row,parent) {
            switch (action) {
              case 'create':
                row = {
                  hue1:0,
                  sat1:100,
                  light1:50,
                  hue2:30,
                  sat2:100,
                  light2:50,
                }
                vm.sessao.novo(row);
                break;
              case 'update':
                vm.sessao.alterar(row);
                break;
            }
            var config = {
              templateUrl: 'app/sistema/psicanalise/cores/templates/sessao-cadastro.html',
              ariaLabelledBy: 'sessao',
              ariaDescribedBy: 'sessao-modal',
              size:'',
              data:vm,
              backdrop:'static',
              fullscreen:false,
              modal:{},
            };
            return vm.sessao.showModal(config,parent).then(function (data) {
              return data
            });
          }

          vm.color = {
            hues:[0,30,60,90,120,150,180,210,240,270],

            changeHue:function (nCor,hue) {
              if (nCor == 1) {
                vm.sessao.row.hue1 = hue;
              } else {
                vm.sessao.row.hue2 = hue;
              }
              this.setCor(nCor);
            },
            setCor:function (nCor) {
              if (nCor==1) {
                vm.sessao.row.cor1 = 'hsl('+vm.sessao.row.hue1+','+vm.sessao.row.sat1+'%,'+vm.sessao.row.light1+'%)';
              } else {
                vm.sessao.row.cor2 = 'hsl('+vm.sessao.row.hue2+','+vm.sessao.row.sat2+'%,'+vm.sessao.row.light2+'%)';
              }
            }
          };
          vm.movimentar = function () {
            vm.movimentando = true;
            vm.movimento();
          }
          vm.convDate = function (data) {
            var dt = new Date(data);
            return dt;
          }

          vm.movimento = function () {
            if (vm.movimentando) {
              var valor = setInterval(crecer,vm.tempo);
              function crecer() {
                vm.tam += vm.configShowCor.rows[0].perc_tam;
                if (vm.tam <= 100) {
                  var width = document.getElementById('cor-filho');
                  var height = document.getElementById('cor-filho');
                  width.style.width=vm.tam+"%";
                  height.style.height=vm.tam+"%";
                }
                if (vm.tam >= 100) {
                  vm.movimentando = false;
                  clearInterval(valor);
                }
              }
            }
          }
          vm.reiniciar = function () {
            if (!vm.movimentando) {
              vm.tempo -=vm.configShowCor.rows[0].red_temp_rep;
              vm.tam = vm.configShowCor.rows[0].perc_tam;
              var width = document.getElementById('cor-filho').style.width=vm.tam+"%";
              var height = document.getElementById('cor-filho').style.height=vm.tam+"%";
              setTimeout(vm.movimentar,1000);
            }
          }

          vm.showPainel = function () {
            var painel = $mdPanel;
            var prm = {
              painel:painel,
              templateUrl:'app/sistema/psicanalise/cores/templates/cores-show.html',
              hasBackdrop: true,
              position: 'center',
              trapFocus: true,
              clickOutsideToClose: false,
              escapeToClose: true,
              focusOnOpen: true,
              fullscreen:true,
              data:vm,
            };
            var conf = UtilsFunctions.getPrmPanel(prm);
            painel.open(conf).then(function () {
              vm.resetar();
            });
          }
          vm.resetar = function () {
            vm.tempo = vm.configShowCor.rows[0].tempo;
            vm.tam = vm.configShowCor.rows[0].perc_tam;
            vm.velocidade = vm.configShowCor.rows[0].red_temp_rep;
            vm.showSwishi = false;
          }
          vm.toogleView = function () {
            $mdSidenav('right').open();
          }
          vm.toogleClose = function () {
            $mdSidenav('right').close();
            $state.go('layout.cores');
          }

          vm.deletar = function (ev,data) {
            vm.sessao.confirmDel(ev,data.descricao).then(function (result) {
              if (result) {
                vm.sessao.deletar([data]).then(function (deletado) {
                  if (deletado) {
                    vm.filtrar();
                  }
                });
              }
            });
          }

          vm.startFiltro = function () {
            // função para instanciar o modulo de filtros
            // so deve ser chamado uma vez apos criado
            var funcFiltros = new FiltroService.funcoes();
            funcFiltros.filtros.fields = vm.sessao.camposFiltro;//setar os campos de consulta
            funcFiltros.filtros.fildsQuery = vm.sessao.filtroDefault;//setar o filtro default
            funcFiltros.filtros.functionRead = vm.filtrar;//setar a função de gatilho para consulta
            vm.sessao.filtros = funcFiltros.filtros;//injeta as funçoes de filtro na classe
            vm.sessao.filtros.functionRead();//chama a consulta
          }

          activate();

        }
    }
})();
