(function() {
    'use strict';

    angular
        .module('app.ecc')
        .factory('EccDataset', EccDataset);

    EccDataset.$inject = ['Provider','ApiService'];

    /* @ngInject */
    function EccDataset(Provider,ApiService) {
      var empresa = Provider.getSessaoEmpresa;
      var api = {
          create       : ApiService.create,
          read         : ApiService.read,
          update       : ApiService.update,
          deletar      : ApiService.deletar,
          aplayUpdates : ApiService.aplayUpdates,
      };
      var service = {
          encontro: encontro
      };

      return service;

      function encontro() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"descricao",alias:"Descrição",type:"string"},
            {field:"id_encontro",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"",
          };

        var camposInvalidos = ['action'];
        var camposData = ['data_ini','data_fim'];
        var emp = empresa();
        var dataset = {
          indexEmp        : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'encontro',//modulo com alias para consultas
          modulo          : 'encontro',
          id_tabelaQuery  : 'id_encontro',
          id_tabela       : 'id_encontro',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
        };
        return dataset;
      }

      function casais() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'id_casal, id_empresa, id_usuario, marido, esposa, endereco, cidade, telefone1, telefone2, id_encontro, (marido||' - '||esposa) as casal';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"cidade",alias:"Cidade",type:"string"},
            {field:"id_casal",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"",
          };

        var camposInvalidos = ['action'];
        var camposData = [];
        var emp = empresa();
        var dataset = {
          indexEmp        : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'casais',//modulo com alias para consultas
          modulo          : 'casais',
          id_tabelaQuery  : 'id_encontro',
          id_tabela       : 'id_encontro',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
        };
        return dataset;
      }
    }
})();
