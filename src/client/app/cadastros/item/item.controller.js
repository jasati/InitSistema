(function () {
    'use strict';

    angular
        .module('cad.item')
        .controller('ItemController', ItemController);

    ItemController.$inject = ['$q', '$modal', 'logger', 'ItemService', 'routerHelper','CategoriaService','SubCategoriaService','UnidadeService'];
    /* @ngInject */
    function ItemController($q, $modal, logger, ItemService, routerHelper,CategoriaService,SubCategoriaService,UnidadeService) {
        var vm = this;

        vm.title = 'Item';
        vm.itens = [];
        vm.categorias = [];
        vm.subcategorias = [];
        vm.unidades = [];
        vm.consulta = {descricao:"",status:1,codigo:"",id_categoria:"",id_subcategoria:"",sigla:"",id_unidade:"",avancado:false}
        vm.optionConsulta = [
                {valor:"0",desc:"Inativo"},
                {valor:"1",desc:"Ativo"}
        ];
        vm.popover = {
          templateUrl: 'app/cadastros/item/templates/pesquisa.html',
          title: 'Pesquisa Avançada'
        }; 
        vm.permissao = ItemService.verificarPermissao;
        vm.getItem = getItem;
        vm.getCategorias = getCategorias;
        vm.getSubCategorias = getSubCategorias;
        vm.getUnidade = getUnidade;
        vm.editItem = editItem;
        vm.newItem = newItem;
        vm.deleteItem = deleteItem;
        vm.setPage = setPage;
        vm.pesquisaAvancada = pesquisaAvancada;
        vm.limparPesqAvancada = limparPesqAvancada;
        vm.cadCategoria = cadCategoria;
        vm.cadSubCategoria = cadSubCategoria;
        vm.cadUnidade = cadUnidade;

        vm.totalRegPag = 15;//quantidade de registro por pagina
        vm.nPagina = 1;//numero da pagina
        vm.inicio = 0;

        activate();

        function activate() {
            $q.all([vm.permissao(5)]).then(function(data){
              if (data) {
                var promises = [ItemService.startDataset(), getItem(),getCategorias(),getSubCategorias(),getUnidade()];
                return $q.all(promises).then(function() {
                    logger.info('Janela Item Ativada');
                }); 
              } else {
                logger.warning('Acesso Negado!');
              }
            });
        }

        function getItem() {
            ItemService.read(vm.consulta,getLimite()).then(function(data){
              vm.itens = data['reg'];
              vm.totalReg = data['qtde'];              
            });            
        } 

        function getCategorias() {
            CategoriaService.read(vm.consulta).then(function(data){
              vm.categorias = data['reg'];
            });            
        }    

        function getSubCategorias() {
            SubCategoriaService.read(vm.consulta).then(function(data){
              vm.subcategorias = data['reg'];
            });            
        }  
        function getUnidade() {
            UnidadeService.read(vm.consulta,'').then(function(data){
              vm.unidades = data['reg'];
            });            
        }          

        function pesquisaAvancada() {
          vm.consulta.avancado = true;
          getItem();
        }
        function limparPesqAvancada() {
          vm.consulta.descricao = "";
          vm.consulta.status = 1;
          vm.consulta.codigo = "";
          vm.consulta.id_categoria = "";
          vm.consulta.id_subcategoria = "";
          vm.consulta.id_unidade = "";
          vm.consulta.sigla = "";
          // body...
        }

        function newItem() {
          if (vm.permissao(6)) {
            var item = {};
            item.id_prefeitura = 0;
            var tabs = {item:item,categorias:vm.categorias,subcategorias:vm.subcategorias,unidades:vm.unidades}
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/item/templates/item-cadastro.html',
              controller: 'ItemModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Item: function () {
                  return tabs;
                }
              }              
            });
            
            modalInstance.result.then(function (save) {
              ItemService.create(save).then(function(data){
                getItem();
              })
            });
          }
        }   

        function editItem(index) {
          if (vm.permissao(7)) {
          var tabs = {item:index,categorias:vm.categorias,subcategorias:vm.subcategorias,unidades:vm.unidades}
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/item/templates/item-cadastro.html',
              controller: 'ItemModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Item: function () {
                  return tabs;
                }
              }              
            });
            
            modalInstance.result.then(function (save) {
              ItemService.update(save).then(function(data){

              })
            });
          }
        }


         function deleteItem(index) {
          if (vm.permissao(6)) {
            var tab = {item:index}
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/item/templates/delete.html',
              controller: 'ItemModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static',
              resolve: {
                Item: function () {
                  return tab;
                }
              }              
            });
            
            modalInstance.result.then(function (del) {
              ItemService.deletar(del).then(function(data){
                getItem();
              })
            });
          }
        }    

        function cadCategoria() {
          if (vm.permissao(8)) {
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/categorias/templates/categoria-cadastro.html',
              controller: 'CategoriaModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static', 
              resolve: {
                Categorias: function () {
                  return vm.categorias;
                }
              }                          
            });
            
            modalInstance.result.then(function (save) {
              getCategorias();
            });
          }
        }

        function cadSubCategoria() {
          if (vm.permissao(9)) {
            var data = {
              categorias : vm.categorias,
              subcategorias:vm.subcategorias
            }
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/subcategorias/templates/subcategoria-cadastro.html',
              controller: 'SubCategoriaModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static', 
              resolve: {
                Data: function () {
                  return data;
                }
              }                          
            });
            
            modalInstance.result.then(function (save) {
              getSubCategorias();
            });
          }
        }

        function cadUnidade() {
          if (vm.permissao(10)) {
            var modalInstance = $modal.open({
              templateUrl: 'app/cadastros/unidademedida/templates/unidade-cadastro.html',
              controller: 'UnidadeModalController',
              controllerAs: 'vm',
              size: '',
              backdrop:'static', 
              resolve: {
                Data: function () {
                  return vm.unidades;
                }
              }                          
            });
            
            modalInstance.result.then(function (save) {
              getUnidade();
            });
          }
        }        

        function getLimite() {
            vm.inicio = (vm.nPagina - 1) * vm.totalRegPag;
            return vm.inicio +','+vm.totalRegPag;
        }
        function setPage () {
            getItem();
        }

    }
})();
