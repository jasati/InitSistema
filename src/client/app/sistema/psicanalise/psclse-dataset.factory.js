(function() {
    'use strict';

    angular
        .module('app.psclse')
        .factory('PsicanaliseDataset', PsicanaliseDataset);

    PsicanaliseDataset.$inject = ['Provider','ApiService'];

    /* @ngInject */
    function PsicanaliseDataset(Provider,ApiService) {
      var empresa = Provider.getSessaoEmpresa;
      var usuario = Provider.getSessaoUsuario;
      var api = {
          create       : ApiService.create,
          read         : ApiService.read,
          update       : ApiService.update,
          deletar      : ApiService.deletar,
          aplayUpdates : ApiService.aplayUpdates,
          enviarEmail  : ApiService.enviarEmail,
      };
      var service = {
        sessao        : sessao,
        configShowCor : configShowCor,
      };

      return service;

      function sessao() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"descricao",alias:"Descrição",type:"string"},
            {field:"codigo_acesso",alias:"Código de acesso",type:"string"}
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
        var camposForeignKey = ['id_usuario'];
        var user = usuario();
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_usuario',
          valor_id_main   : user.id_usuario?user.id_usuario:1,
          moduloQuery     : 'sessao',//modulo com alias para consultas
          modulo          : 'sessao',
          id_tabelaQuery  : 'id_sessao',
          id_tabela       : 'id_sessao',
          orderBy         : 'id_sessao desc',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [user.id_usuario],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
        };
        return dataset;
      }

      function configShowCor() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
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
        var camposForeignKey = [];
        var camposData = [];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido os campos chave estrangeira
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : '1',
          valor_id_main   : '1',
          moduloQuery     : 'config_show_cores',//modulo com alias para consultas
          modulo          : 'config_show_cores',
          id_tabelaQuery  : 'id_confg',
          id_tabela       : 'id_confg',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
        };
        return dataset;
      }

    }
})();
