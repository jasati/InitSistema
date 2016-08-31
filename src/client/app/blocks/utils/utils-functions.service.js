(function() {
    'use strict';
    angular
        .module('blocks.utils')
        .factory('UtilsFunctions', UtilsFunctions);
    UtilsFunctions.$inject = ['$filter', 'Extencio'];
    /* @ngInject */
    function UtilsFunctions($filter, Extencio) {
        var service = {
            formatData: formatData,
            formatDataView : formatDataView,
            removeCamposInvalidos:removeCamposInvalidos,
            soma  : soma,
            permissao : permissao,
            copiarObjecto: copiarObjecto,
            porExtencio:porExtencio
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
            if (hr != '') {
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
            if (hr != '') {
                dt = m+'/'+d+'/'+y+' '+hr;  
            } else {
                dt = m+'/'+d+'/'+y;  
            }
            return dt;              
        }        

        function removeCamposInvalidos (dados,camposInv) {
          for (var i = 0; i < camposInv.length; i++) {
            delete dados[camposInv[i]];
          };
          return dados;
        }

        function soma(array,rowQt,rowValue) {
            var total = 0;
            angular.forEach(array, function(row, key){
                if (rowQt!='') {
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
    }
})();