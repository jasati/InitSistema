(function() {
    'use strict';
    angular
        .module('blocks.utils')
        .factory('UtilsFunctions', UtilsFunctions);
    UtilsFunctions.$inject = ['$filter','$uibModal', 'Extencio'];
    /* @ngInject */
    function UtilsFunctions($filter,$uibModal, Extencio) {
        var service = {
            formatData: formatData,
            formatDataView : formatDataView,
            removeCamposInvalidos:removeCamposInvalidos,
            soma  : soma,
            permissao : permissao,
            copiarObjecto: copiarObjecto,
            porExtencio:porExtencio,
            validaCPF:validaCPF,
            existe : existe,
            zoomImg : zoomImg,
            isset  : isset,
            convDate : convDate,
            getPrmPanel : getPrmPanel,
            validarDataset : validarDataset,
        };
        return service;
        ////////////////
        function formatData (data, hora) {
            var d, m, y,hr='', dt;
            if (hora) {
                hr = hora;
            }
            d = data.getDate();
            m = data.getMonth()+1; //janeiro = 0
            y = data.getFullYear();
            if (hr !== '') {
                dt = y+'-'+m+'-'+d+' '+hr;
            } else {
                dt = y+'-'+m+'-'+d;
            }
            return dt;
        }

        function formatDataView (data, hora) {
            var d, m, y,hr='', dt;
            if (hora) {
                hr = hora;
            }
            d = data.getDate();
            m = data.getMonth()+1; //janeiro = 0
            y = data.getFullYear();
            if (hr !== '') {
                dt = m+'/'+d+'/'+y+' '+hr;
            } else {
                dt = m+'/'+d+'/'+y;
            }
            return dt;
        }

        function removeCamposInvalidos (dados,camposInv) {
          for (var i = 0; i < camposInv.length; i++) {
            delete dados[camposInv[i]];
          }
          return dados;
        }

        function soma(array,rowQt,rowValue) {
            var total = 0;
            angular.forEach(array, function(row, key){
                if (rowQt!=='') {
                    var valor = row[rowQt]*row[rowValue];
                    total = total + valor;
                } else {
                    total = total + row[rowValue];
                }
            });
            return total.toFixed(2);
        }

        function permissao(arrayModUser,idModSis) {
            //$filter('filter')(arrayModUser,{id_modulo:idModSis});
            var p = [];
            for (var i = 0; i < arrayModUser.length; i++) {
                if (arrayModUser[i].id_modulo===idModSis) {
                    p.push(arrayModUser[i]);
                    break;
                }
            }
            if (p.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        function copiarObjecto(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            var temp = obj.constructor();
            for (var key in obj) {
                temp[key] = copiarObjecto(obj[key]);
            }
            return temp;
        }

        function porExtencio(valor) {
            return Extencio.porExtencio(valor);
        }

      function validaCPF(str) {
        if (str) {
          str = str.replace('.', '');
          str = str.replace('.', '');
          str = str.replace('-', '');

          var cpf = str;
          var numeros, digitos, soma, i, resultado, digitos_iguais;
          digitos_iguais = 1;
          if (cpf.length < 11)
            return false;
          for (i = 0; i < cpf.length - 1; i++)
            if (cpf.charAt(i) != cpf.charAt(i + 1)) {
              digitos_iguais = 0;
              break;
            }
          if (!digitos_iguais) {
            numeros = cpf.substring(0, 9);
            digitos = cpf.substring(9);
            soma = 0;
            for (i = 10; i > 1; i--)
              soma += numeros.charAt(10 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
              return false;
            numeros = cpf.substring(0, 10);
            soma = 0;
            for (i = 11; i > 1; i--)
              soma += numeros.charAt(11 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
              return false;
            return true;
          }
          else
            return false;
        }
      }
        function existe(index,array) {
            /*verifica se um determinado valor existe em um array*/
          var x = false;
          for (var i = 0; i < array.length; i++) {
            if (array[i] == index) {
              return true;
            }
          }
          return x;
        }

        function zoomImg(i) {
            var data = {
              img:i,
            };
            var modalZoom = $uibModal.open({
              templateUrl: 'app/blocks/utils/templates/zoom-img.html',
              controller: controllModalZoom,
              controllerAs: 'vm',
              size: '',
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });

            controllModalZoom.$inject = ['$uibModalInstance','Data','config'];
            function controllModalZoom($uibModalInstance,Data,config) {
                var vm = this;
                vm.img = Data.img;
                vm.pathImg = config.urlImagem;

                vm.ok = ok;
                vm.cancel = cancel;

                function ok(data) {
                    $uibModalInstance.close(data);
                }
                function cancel(){
                    $uibModalInstance.dismiss('cancel');
                }
            }
        }

        function isset(arg) {
            if (arg === undefined) {
                return false;
            } else if (arg === null) {
                return false;
            } else if (arg === '') {
                return false;
            } else {
                return true;
            }
        }

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function getPrmPanel(prm,mdPanelRef) {
            var position;
            switch (prm.position){
                case 'center' :
                    position = prm.painel.newPanelPosition()
                      .absolute()
                      .center();
                    break;
                case 'event' :
                    position = prm.painel.newPanelPosition()
                        .relativeTo('#'+prm.event.currentTarget.id)
                        .addPanelPosition(
                            prm.painel.xPosition.ALIGN_START,
                            prm.painel.yPosition.BELOW
                        );
                    break;
            };

            var config = {
                    attachTo: angular.element(document.body),
                    controller: function (Data,mdPanelRef) {
                      var vm = this;
                        vm.funcoes = Data;
                        vm.close = function () {
                          mdPanelRef.close();
                        }
                        vm.ok = function () {
                          vm.funcoes.filtrar();
                          mdPanelRef.close();
                        }
                    },
                    controllerAs: 'vm',
                    disableParentScroll:false,
                    templateUrl: prm.templateUrl,
                    hasBackdrop: prm.hasBackdrop,
                    position: position,
                    trapFocus: false,
                    zIndex: 2,
                    clickOutsideToClose: false,
                    escapeToClose: prm.escapeToClose,
                    focusOnOpen: true,
                    fullscreen:prm.fullscreen,
                    locals: {
                      Data: prm.data
                    }
            };
            return config;

        }

        function validarDataset(dataset) {
          if (!isset(dataset.left_join[0])) {
            delete dataset['left_join'];
          }
          if (!isset(dataset.inner_join[0])) {
            delete dataset['inner_join'];
          }
        }

    }
})();
