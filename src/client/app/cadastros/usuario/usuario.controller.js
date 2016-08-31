(function () {
    'use strict';

    angular
        .module('cad.usuario')
        .controller('UsuarioController', UsuarioController);

    UsuarioController.$inject = ['$q', 'logger', 'routerHelper','UsuarioService'];
    /* @ngInject */
    function UsuarioController($q, logger, routerHelper,UsuarioService) {
        var vm = this;
        vm.title = 'Usuarios';
        vm.itens = [];
        vm.usuarios = [];
        vm.perfils = [];
        vm.modPerfils = [];
        vm.secretarias = [];
        vm.consulta = {nome:"",status:1,codigo:"",id_perfil:"",email:"",avancado:false}
        vm.optionConsulta = [
                {valor:"0",desc:"Inativo"},
                {valor:"1",desc:"Ativo"}
        ];
        vm.popover = {
          templateUrl: 'app/cadastros/usuario/templates/pesquisa.html',
          title: 'Pesquisa Avançada'
        }; 
        vm.permissao = UsuarioService.verificarPermissao;
        vm.getUsuario = getUsuario;
        vm.getPerfil = getPerfil;
        vm.getModPerfil = getModPerfil;
        vm.editUsuario = editUsuario;
        vm.newUsuario = newUsuario;
        vm.deleteUsuario = deleteUsuario;
        vm.setPage = setPage;
        vm.pesquisaAvancada = pesquisaAvancada;
        vm.limparPesqAvancada = limparPesqAvancada;
        vm.cadPerfil = cadPerfil;
        vm.edtPerfil = edtPerfil;

        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
          $q.all([vm.permissao(1)]).then(function(data){
            if (data) {
              var promises = [getUsuario(),getPerfil()];
              return $q.all(promises).then(function() {
                  logger.info('Janela Usuário Ativada');
              });
            } else {
              logger.warning('Acesso Negado!');
            }
          });
        }

        function getUsuario() {
            UsuarioService.getUsuario(vm.consulta,getLimite()).then(function(data){
              vm.usuarios = data.reg;
              vm.totalReg = data.qtde;              
            });            
        } 

        function getPerfil() {
            UsuarioService.getPerfil(vm.consulta).then(function(data){
              vm.perfils = data.reg;
            });            
        }
        function getModPerfil(perfil) {
          var cons = {id_perfil:perfil}
            UsuarioService.getModPerfil(cons).then(function(data){
              vm.modPerfils = data.reg;
            });            
        }
        function pesquisaAvancada() {
          vm.consulta.avancado = true;
          getUsuario();
        }
        function limparPesqAvancada() {
          vm.consulta.nome = "";
          vm.consulta.status = 1;
          vm.consulta.codigo = "";
          vm.consulta.id_perfil = "";
          vm.consulta.email = "";
          // body...
        }

        function newUsuario() {
          if (vm.permissao(2)) {
            UsuarioService.newUsuario().then(function (save) {
              UsuarioService.create(save).then(function(data){
                getUsuario();
              })
            });
          }
        }   

        function edtPerfil(index) {
          UsuarioService.editPerfil(index).then(function (save){
            alert(save);
          })
        }

        function editUsuario(index) {
          if (vm.permissao(2)) {
            UsuarioService.editUsuario(index).then(function (save) {
              UsuarioService.update(save).then(function(data){

              })
            });
          }
        }

        function deleteUsuario(index) {
          if (vm.permissao(2)) {
            UsuarioService.deleteUsuario(index).then(function (del) {
              UsuarioService.deletar(del).then(function(data){
                getUsuario();
              })
            });
          }
        }    

        function cadPerfil() {
          if (vm.permissao(3)) {
            UsuarioService.cadPerfil().then(function (save) {
              getPerfil();
            });
          }
        }
      

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getUsuario();
        }

    }
})();
