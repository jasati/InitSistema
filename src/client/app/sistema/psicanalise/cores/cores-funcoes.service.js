(function() {
    'use strict';

    angular
        .module('app.psclse')
        .service('CoresFuncService', CoresFuncService);

    CoresFuncService.$inject = [
      'UtilsFunctions','UtilsDataFunctionService',
      '$state','$mdDialog','$filter','$document','$mdPanel'
    ];

    /* @ngInject */
    function CoresFuncService(
      UtilsFunctions,UtilsDataFunctionService,
      $state,$mdDialog,$filter,$document,$mdPanel
    ) {
        this.funcoes = funcoes;

        function funcoes() {
          var vm = this;
          var isset = UtilsFunctions.isset;
          vm.tam = 5;
          vm.showReinstart = false;
          vm.tempo = 100;
          vm.divider = 'botton';
          vm.title = 'Lista de encontros';
          vm.usuario = {
            nome:'Jose',
            color_one:'',
            color_two:'',
          };
          vm.colorOptions = {
            hue: true,
            saturation: true,
            lightness: true, // Note: In the square mode this is HSV and in round mode this is HSL
            alpha: true,
            round: false,
            format:'hsl',
            horizontal:false,
            inline:true,
          };
          vm.color = {
            hues:[0,30,60,90,120,150,180,210,240,270],
            hue1:0,
            sat1:100,
            light1:50,
            hue2:0,
            sat2:100,
            light2:50,
            changeHue:function (nCor,hue) {
              if (nCor == 1) {
                this.hue1 = hue;
              } else {
                this.hue2 = hue;
              }
              this.setCor(nCor);
            },
            setCor:function (nCor) {
              if (nCor==1) {
                vm.usuario.color_one = 'hsl('+this.hue1+','+this.sat1+'%,'+this.light1+'%)';
              } else {
                vm.usuario.color_two = 'hsl('+this.hue2+','+this.sat2+'%,'+this.light2+'%)';
              }
            }
          };
          vm.movimentar = function () {
            vm.movimentando = true;
            vm.movimento();
          }

          vm.movimento = function () {
            if (vm.movimentando) {
              var valor = setInterval(crecer,vm.tempo);
              function crecer() {
                vm.tam += 5;
                if (vm.tam <= 100) {
                  var width = document.getElementById('cor-filho').style.width=vm.tam+"%";
                  var height = document.getElementById('cor-filho').style.height=vm.tam+"%";
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
              vm.tempo -=20;
              vm.tam = 5;
              var width = document.getElementById('cor-filho').style.width=vm.tam+"%";
              var height = document.getElementById('cor-filho').style.height=vm.tam+"%";
              setTimeout(vm.movimentar,1000);
            }
          }

          vm.showPainel = function () {
            var painel = $mdPanel;
            var prm = {
              painel:painel,
              templateUrl: 'app/sistema/psicanalise/cores/templates/cores-show.html',
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
            vm.tam = 5;
            vm.showReinstart = false;
            vm.tempo = 100;
          }

        }
    }
})();
