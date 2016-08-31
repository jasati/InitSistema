(function(){
    'use strict';

    angular
        .module('cad.perfil')
        .controller('PerfilModalController', PerfilModalController);
    PerfilModalController.$inject = ['Data', '$modalInstance', '$scope','$filter', '$modal', 'PerfilService'];
    /* @ngInject */
    function PerfilModalController(Data, $modalInstance, $scope, $filter, $modal, PerfilService) {
        var vm = this;
        vm.title = 'Cadastro de Perfil do Usuário';
        vm.perfils= Data; 
        vm.addreg;
        vm.consulta = {id_perfil:"",nome:""}
        vm.totalRegPag = 10;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        vm.salvar = salvar;
        vm.novo = novo;
        vm.editar = editar;
        vm.deletar = deletar;
        vm.addNovoReg = addNovoReg;
        vm.addModulos = addModulos;        
        vm.ok = ok;
        vm.cancel = cancel;

        function getPerfils() {
            PerfilService.read(vm.consulta).then(function(data){
              vm.perfils = data['reg'];
            });            
        }    

        function salvar(reg) {
            if (reg.id_perfil) {
                editar(reg);
            } else {
                novo(reg);
                vm.addreg = null;
            }
        }
        function addNovoReg() {
            vm.addreg = {
                nome:''
            }
            vm.perfils.push(vm.addreg);
        }

        function addModulos(perfil) {
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/perfil/templates/perfil-mod-cadastro.html',
              controller: 'PerfilModModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',   
              resolve: {
                Perfil: function () {
                  return perfil;
                }
              }                          
            });
            
            modalInstance.result.then(function (save) {

            });
        }

        function novo(save) {
            PerfilService.create(save).then(function(data){
                getPerfils();
            });
        }

        function editar(save) {
            PerfilService.update(save).then(function(data){

            });            
        }

        function deletar(del,index) {
            PerfilService.deletar(del).then(function(data){
                getPerfils();
            });
        }
        function ok(data) {
            $modalInstance.close(data);
        }
        function cancel(){
        	$modalInstance.dismiss('cancel');
        }
        angular.element(document.body).popover({
            selector: '[rel=popover]',
            trigger: "click"
        }).on("show.bs.popover", function(e){
            angular.element("[rel=popover]").not(e.target).popover("destroy");
             angular.element(".popover").remove();
        });        
    }
})();