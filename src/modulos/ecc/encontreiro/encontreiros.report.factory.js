(function() {
    'use strict';
    angular
        .module('app.ecc')
        .factory('EncontreiroReport', EncontreiroReport);
    EncontreiroReport.$inject = ['UtilsFunctions'];
    /* @ngInject */
    function EncontreiroReport(UtilsFunctions) {
        var service = {
            listagem: listagem,
        };
        return service;
        ////////////////
        function validarCampo(valor) {
            if (!UtilsFunctions.isset(valor)) {
                return '';
            } else {
                return valor;
            }
        }
        function listagem(data) {
        	var tpl = "<html> <head>";
        	tpl=tpl+"</head><body>";
        	/*Container*/
        	tpl=tpl+"<div class='row'><div class='col-xs-12'>";
            /*cabeçario*/
            tpl=tpl+"<div class='page-header'>";
            tpl=tpl+"<h1>Encontreiros</h1>";
            tpl=tpl+"</div>";

            /*corpo*/

            tpl=tpl+"<table>";
            tpl=tpl+"<thead><tr>";
            tpl=tpl+"<th style='width: 20%'>Casal</th>";
            tpl=tpl+"<th style='width: 30%'>Endereço</th>";
            tpl=tpl+"<th style='width: 20%'>Cidade</th>";
            tpl=tpl+"<th style='width: 15%'>Telefone</th>";
            tpl=tpl+"<th style='width: 15%'>Email</th>";
            tpl=tpl+"</thead></tr>";
            tpl=tpl+"</tr></thead>";
            tpl=tpl+"<tbody>";
            angular.forEach(data, function(value, key){
                tpl=tpl+"<tr><td>"+validarCampo(value.casal)+"</td>";
                tpl=tpl+"<td>"+validarCampo(value.endereco)+"</td>";
                tpl=tpl+"<td>"+validarCampo(value.cidade)+"</td>";
                tpl=tpl+"<td>"+validarCampo(value.telefone1)+"</td>";
                tpl=tpl+"<td>"+validarCampo(value.email)+"</td></tr>"
            });
            tpl=tpl+"</tbody></table></div>";


            /*roda pe*/
            tpl=tpl+"<hr>";


        	/*fim container*/
        	tpl=tpl+"</div></div></body></html>";
        	return tpl;
        }
    }
})();