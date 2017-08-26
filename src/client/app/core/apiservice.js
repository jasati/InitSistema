(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$filter','$http', '$q', 'logger', 'config','UtilsFunctions'];
    /* @ngInject */

    function ApiService($filter, $http, $q, logger, config,UtilsFunctions) {
      var isset = UtilsFunctions.isset;
        var service = {
            read                : read,
            create              : create,
            update              : update,
            deletar             : deletar,
            aplayUpdates        : aplayUpdates,
        };

        return service;

        function read(prm) {
          UtilsFunctions.validarDataset(prm.dataSet);
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

        function aplayUpdates(prm) {
          var arr = prm.dataset.estrutura;
          /*fazer um filtro para separar cada action 'c' create  'u' update 'd' delete*/
          var arr_c = $filter('filter')(arr,{action:'c'},true);
          var arr_u = $filter('filter')(arr,{action:'u'},true);
          /*deletar somente os que ja estao do DB*/
          var arr_d = $filter('filter')(arr,{action:'d'},true);

          var createArr = function () {
            if (arr_c.length > 0) {
              prm.dataset.estrutura = arr_c;
              return create(prm).then(function (res) {
                  return res;
              });
            }
          };

          var updateArr = function () {
            if (arr_u.length > 0) {
              prm.dataset.estrutura = arr_u;
              return update(prm).then(function (res) {
                  return res;
              });
            }
          };

          var deleteArr = function () {
            if (arr_d.length > 0) {
              prm.dataset.estrutura = arr_d;
              return deletar(prm).then(function (res) {
                  return res;
              });
            }
          };

          var promises = [
            createArr(),
            updateArr(),
            deleteArr()
          ];
          return $q.all(promises).then(function (data) {
            return data;
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
                    },
                    timeout :30000,
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
