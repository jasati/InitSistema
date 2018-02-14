(function() {
    'use strict';
    angular
        .module('app.core')
        .provider('Provider', Provider);
    Provider.$inject = ['$locationProvider','$stateProvider'];
    /* @ngInject */
    function Provider($locationProvider,$stateProvider) {
        this.$get = webService;

        function webService() {
            var pub = {
                id:''
            }

            var sessao = {
                empresa:'',
                cliente:'',
                usuario:'',
                permissoes:'',
                filtroData:{},
            };

            var service = {
                getPrmWebService    : getPrmWebService,
                setValor            : setValor,
                setSessaoEmpresa    : setSessaoEmpresa,
                setSessaoCliente    : setSessaoCliente,
                setSessaoUsuario    : setSessaoUsuario,
                getSessaoEmpresa    : getSessaoEmpresa,
                getSessaCliente     : getSessaCliente,
                getSessaoUsuario    : getSessaoUsuario,
                finishSessao        : finishSessao,
                setPubId            : setPubId,
                getPubId            : getPubId,
                setPermissoes       : setPermissoes,
                getPermissoes       : getPermissoes,
                setFiltroData       : setFiltroData,
                getFiltroData       : getFiltroData,
            };

            return service;
            /////////////


            function getPrmWebService(){
                var prmWebService = {
                    "db":"",
                    "modulo":"",
                    "id_index_main":"",
                    "valor_id_main":"",
                    "id_tabela":"",
                    "valor_id":"",
                    "estrutura":{"":""},
                    "campos":"",
                    "inner_join":"",
                    "left_join":"",
                    "order by":"",
                    "group by":"",
                    "consulta":"",
                    "limit":"",
                    "nomeImg":""

                } ;
                return prmWebService;
            }

            function setValor (dataset,index,value) {
                dataset[index]=value;
            }

            function clearPrmWebServise () {
                prmWebService.modulo="";
                prmWebService.id_index_main="";
                prmWebService.valor_id_main="";
                prmWebService.id_tabela="";
                prmWebService.valor_id="";
                prmWebService.estrutura={"":""};
                prmWebService.consulta="";
                prmWebService.limit="";
                prmWebService.campos="";
                prmWebService.inner_join="";
                prmWebService.left_join="";
                prmWebService.consulta="";
                prmWebService.limit="";
                prmWebService.nomeImg="";
            }

            function setSessaoEmpresa(empresa) {
                sessao.empresa = empresa;
            }

            function setSessaoCliente(cliente) {
                sessao.cliente = cliente;
            }

            function setSessaoUsuario(usuario) {
                sessao.usuario = usuario;
            }

            function setFiltroData(prm) {
                sessao.filtroData = prm;
            }

            function getSessaoEmpresa() {
                return sessao.empresa;
            }

            function getSessaCliente() {
                return sessao.cliente;
            }

            function getSessaoUsuario() {
                return sessao.usuario;
            }

            function finishSessao() {
                sessao.cliente = '';
                sessao.usuario = '';
                sessao.empresa = '';
                sessao.permissoes = '';
            }

            function setPubId(id) {
                pub.id = id;
            }

            function getPubId() {
                return pub.id;
            }

            function setPermissoes(perm) {
              sessao.permissoes = perm;
            }

            function getPermissoes() {
              return sessao.permissoes;
            }

            function getFiltroData() {
                return sessao.filtroData;
            }

        }
    }
})();
