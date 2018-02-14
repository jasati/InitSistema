(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ApiService', ApiService);

    ApiService.$inject = ['$filter','$http', '$q', 'config','UtilsFunctions','logger'];
    /* @ngInject */

    function ApiService($filter, $http, $q, config,UtilsFunctions,logger) {
      var isset = UtilsFunctions.isset;
      var reconect = 0;
      var prmReconect = {};
        var service = {
            read                : read,
            create              : create,
            update              : update,
            deletar             : deletar,
            aplayUpdates        : aplayUpdates,
            enviarEmail         : enviarEmail,
            gerarPdf            : gerarPdf,
            callFunction        : callFunction,
            callProcedure       : callProcedure,
        };

        return service;

        function read(prm) {
          UtilsFunctions.validarDataset(prm.dataset);
            var api = 'consulta';
            return API(prm.dataset,api)
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
            return API(prm.dataset,api)
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
            return API(prm.dataset,api)
                .then(function (result){
                    return result;
                });
        }

        function deletar (prm) {
            var api = 'delete';
            return API(prm.dataset,api)
                .then(function (result){
                    return result;
                });
        }

        function callFunction(prm) {
          var api = 'functionSql';
          return API(prm.dataset,api)
              .then(function (result) {
                return result;
              });
        }

        function callProcedure(prm) {
          var api = 'procedureSql';
          return API(prm.dataset,api)
              .then(function (result) {
                return result;
              });
        }

        function enviarEmail(email) {
            var api = 'enviarEmail';
            return API(email,api)
                .then(function (result) {
                    return result;
                });
        }
        function gerarPdf(data) {
          var api = 'report';
          return API(data,api)
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
                var pos = arr_c.length-1;
                return res[pos];
              });
            } else {
              return 0;
            }
          };

          var updateArr = function () {
            if (arr_u.length > 0) {
              prm.dataset.estrutura = arr_u;
              return update(prm).then(function (res) {
                  return res;
              });
            } else {
              return 0;
            }
          };

          var deleteArr = function () {
            if (arr_d.length > 0) {
              prm.dataset.estrutura = arr_d;
              return deletar(prm).then(function (res) {
                  return res;
              });
            } else {
              return 0;
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

        function API(prmWebService, servico) {
            setPrmReconect(prmWebService, servico);
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
                return response.data;
            }

            function fail(error) {
              var msgErro = 'Solicitação não concluida, tente outra vez!'
                if (error.status == -1) {
                  if (reconect<=3) {
                    reconect++;
                    API(prmReconect.prmWebService,prmReconect.servico);
                    logger.info(reconect+' - Reconectando ao serviço web...');
                  } else {
                    return $q.reject('Falha na conexão com o servidor, verifique sua conexão. Detalhes : '+ error.statusText);
                  }
                } else {
                    return $q.reject(msgErro+' Detalhes : '+error.statusText);
                }
            }

        }

        function setPrmReconect(prmWebService, servico) {
          prmReconect = {
            prmWebService:prmWebService, 
            servico:servico,
          };
        }
        
    }
})();
