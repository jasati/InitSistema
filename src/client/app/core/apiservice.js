(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$http', '$q', 'logger', 'config','UtilsFunctions'];
    /* @ngInject */
  
    function ApiService($http, $q, logger, config,UtilsFunctions) {
        var service = {
            read                : read,
            create              : create,
            update              : update,
            deletar             : deletar,
        };

        return service;

        function read(prm) {
            var api = 'consulta';
            return API(prm.dataSet,api,prm.msgErro,prm.msgSucess)
                .then(function (data) {
                    return data;
                 });
        }

        function create (prm) {
            var api = 'novo';
            //o objeto ja deve vim copiado
            //var nData = UtilsFunctions.copiarObjecto(prm.estrutura);
            if (prm.dataset.estrutura.length) {
                for (var i = 0; i < prm.dataset.estrutura.length; i++) {
                    prm.dataset.estrutura[i] = UtilsFunctions.removeCamposInvalidos(prm.dataset.estrutura[i],prm.camposInvalidos);
                }
            } else {
                prm.dataset.estrutura = UtilsFunctions.removeCamposInvalidos(prm.dataset.estrutura,prm.camposInvalidos);
            }
            return API(prm.dataset,api,prm.msgErro,prm.msgSucess)
                .then(function (result){
                    return result;
                });
        } 

        function update (prm) {
            var api = 'editar';
            if (prm.dataset.estrutura.length) {
                for (var i = 0; i < prm.dataset.estrutura.length; i++) {
                    prm.dataset.estrutura[i] = UtilsFunctions.removeCamposInvalidos(prm.dataset.estrutura[i],prm.camposInvalidos);
                }
            } else {
                prm.dataset.estrutura = UtilsFunctions.removeCamposInvalidos(prm.dataset.estrutura,prm.camposInvalidos);
            }
            return API(prm.dataset,api,prm.msgErro,prm.msgSucess)
                .then(function (result){
                    return result;
                });
        }         

        function deletar (prm) {
            var api = 'delete';
            return API(prm.dataset,api,prm.msgErro,prm.msgSucess)
                .then(function (result){
                    return result;
                });
        }            

        function API(prmWebService, servico, msgErro, msgSucess) {
            prmWebService.db = config.dbase;
            var req = {
                    url    : config.urlWebService+servico,
                    method : 'POST',
                    data   :  prmWebService,
                    withCredentials: false,
                    headers: {
                       'Authorization': 'Basic bashe64usename:password',
                    }
                }

            return $http(req)
                .then(success)
                .catch(fail);

            function success(response) {
                if (response.data.status) {
                    if (response.data.status == "ok") {
                        if ( msgSucess !== null) {
                            logger.success(msgSucess);
                        }                        
                    } else {
                        logger.error(msgErro+' Erro: '+response.data.msg);
                    }
                }
                return response.data;
            }

            function fail(error) {
                if (error.status == -1) {
                    logger.error(msgErro+' Erro : Falha na conexão com o servidor, verifique sua conexão.');
                } else {
                    logger.error(msgErro+' Erro : '+error.statusText);
                }
                return $q.reject(msgErro);
            }                

            
        }
    }
})();
