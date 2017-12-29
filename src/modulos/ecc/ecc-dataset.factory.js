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
          enviarEmail  : ApiService.enviarEmail,
          gerarPdf     : ApiService.gerarPdf,
      };
      var service = {
          encontro: encontro,
          casal  : casal,
          encontreiros : encontreiros,
          encontristas : encontristas,
          equipes      : equipes,
          equipesCasais: equipesCasais,
          conjuge      : conjuge,
      };

      return service;

      function encontro() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = ' e.id_encontro, e.id_empresa, e.descricao, e.data_ini, e.data_fim, e.valor_insc, e.valor_ficha, e.id_galeria, g.imagem as logo';
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
              0:"galeria g on e.id_galeria = g.id_galeria",
          };

        var camposInvalidos = ['action','logo'];
        var camposData = ['data_ini','data_fim'];
        var camposForeignKey = ['id_empresa'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'encontro e',//modulo com alias para consultas
          modulo          : 'encontro',
          id_tabelaQuery  : 'e.id_encontro',
          id_tabela       : 'id_encontro',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : 'logo',
        };
        return dataset;
      }

      function casal() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos =
          'c.id_casal,'+
          'c.id_empresa,' +
          'c.id_usuario,'+
          'c.id_conjuge_marido,'+
          'c.id_conjuge_esposa,'+
          'c.marido,' +
          'c.esposa,' +
          'c.endereco, '+
          'c.cidade, '+
          'c.telefone1, '+
          'c.telefone2, '+
          'c.email, '+
          'c.id_encontro, '+
          'c.situacao, '+
          'c.numero,'+
          'c.complemento,'+
          'c.bairro,'+
          'c.cep,'+
          'c.uf,'+
          'c.data_casamento,'+
          'c.possui_conducao,'+
          'c.tem_filhos,'+
          'c.qt_filhos,'+
          'c.resp_filhos,'+
          'c.end_resp_filhos,'+
          'c.bairro_resp_filhos,'+
          'c.cidade_resp_filhos,'+
          'c.tel_resp_filhos,'+
          'c.casal_convite,'+
          'c.tel_casal_convite,'+
          'CASE WHEN c.id_conjuge_marido is null or (c.id_conjuge_marido = 0) THEN CONCAT(c.marido," - ",c.esposa) ELSE CONCAT(cm.nome_red," - ",ce.nome_red) END as casal,'+
          'g.imagem as foto, '+
          'e.descricao as encontro';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"situacao",alias:"Status",type:"fixed",values:[{value:1,alias:"Encontreiro"},{value:0,alias:"Encontrista"}]},
            {field:"cidade",alias:"Cidade",type:"string"},
            {field:"id_casal",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"galeria g on c.id_galeria = g.id_galeria",
              1:"encontro e on c.id_encontro = e.id_encontro",
              2:"conjuge cm ON c.id_conjuge_marido = cm.id_conjuge",
              3:"conjuge ce ON c.id_conjuge_esposa = ce.id_conjuge",
          };

        var camposInvalidos = [
          'action',
          'casal',
          'foto',
          'encontro'
        ];
        var camposForeignKey = ['id_empresa','id_usuario'];
        var camposData = ['data_casamento'];
        var emp = empresa();
        var dataset = {
          setForeignKey    : true,//esse campo determina se a cada novo registro será recibido os campos chave estrangeira
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'c.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'casais c',//modulo com alias para consultas
          modulo          : 'casais',
          id_tabelaQuery  : 'c.id_casal',
          id_tabela       : 'id_casal',
          orderBy         : 'c.id_casal desc',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : 'foto',
        };
        return dataset;
      }

      function conjuge() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"situacao",alias:"Status",type:"fixed",values:[{value:1,alias:"Encontreiro"},{value:0,alias:"Encontrista"}]},
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
        var camposForeignKey = ['id_empresa'];
        var camposData = ['nascimento'];
        var emp = empresa();
        var dataset = {
          setForeignKey    : true,//esse campo determina se a cada novo registro será recibido os campos chave estrangeira
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'conjuge',//modulo com alias para consultas
          modulo          : 'conjuge',
          id_tabelaQuery  : 'id_conjuge',
          id_tabela       : 'id_conjuge',
          orderBy         : 'id_conjuge',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
        };
        return dataset;
      }

      function encontreiros(idEncontro) {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'ce.id_casal, ce.id_encontro, ce.id_enc_eiro, ce.pago, e.valor_insc,'
        +' @valor_conv:=(SELECT SUM(e1.valor_ficha) FROM enc_encontrista ci inner join encontro e1 on ci.id_encontro = e1.id_encontro WHERE ci.id_enc_eiro = ce.id_enc_eiro) as total_conv,'
        +' (CASE WHEN ce.pago = 1 THEN(CASE WHEN @valor_conv IS NULL THEN e.valor_insc ELSE e.valor_insc+@valor_conv END) ELSE 0.00 END) as total_invest, '
        +'c.id_empresa, c.id_usuario, c.marido, c.esposa, c.endereco, c.cidade, c.telefone1, c.telefone2, c.email,'
        +' CASE WHEN c.id_conjuge_marido is null or (c.id_conjuge_marido = 0) THEN CONCAT(c.marido," - ",c.esposa) ELSE CONCAT(cm.nome_red," - ",ces.nome_red) END as casal, g.imagem as foto';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"ce.pago",alias:"Situação do Pagamento",type:"fixed",values:[{value:1,alias:"Pago"},{value:0,alias:"Pendente"}]},
            {field:"c.cidade",alias:"Cidade",type:"string"},
            {field:"c.id_casal",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"casais c ON ce.id_casal = c.id_casal",
              1:"encontro e ON ce.id_encontro = e.id_encontro",
          };

        var left_join = {
              0:"galeria g on c.id_galeria = g.id_galeria",
              1:"conjuge cm ON c.id_conjuge_marido = cm.id_conjuge",
              2:"conjuge ces ON c.id_conjuge_esposa = ces.id_conjuge",
          };

        var camposInvalidos = [
          'action',
          'valor_insc',
          'total_conv',
          'total_invest',
          'id_empresa',
          'id_usuario',
          'id_conjuge_marido',
          'id_conjuge_esposa',
          'marido',
          'esposa',
          'endereco',
          'cidade',
          'telefone1',
          'telefone2',
          'casal',
          'foto',
          'email',
          'situacao',
          'encontro',
          'numero',
          'complemento',
          'bairro',
          'cep',
          'uf',
          'data_casamento',
          'possui_conducao',
          'tem_filhos',
          'qt_filhos',
          'resp_filhos',
          'end_resp_filhos',
          'bairro_resp_filhos',
          'cidade_resp_filhos',
          'tel_resp_filhos',
          'casal_convite',
          'tel_casal_convite'
        ];
        var camposForeignKey = ['id_encontro'];
        var camposData = [];
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'c.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'enc_encontreiro ce',//modulo com alias para consultas
          modulo          : 'enc_encontreiro',
          id_tabelaQuery  : 'ce.id_enc_eiro',
          id_tabela       : 'id_enc_eiro',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [idEncontro],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : 'foto',
        };
        return dataset;
      }

      function encontristas(idEncontro,idEncontreiro) {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'ci.id_casal, ci.id_encontro, ci.id_enc_eiro, ci.id_enc_ista,ci.status, e.valor_ficha, c.id_empresa, c.id_usuario, c.marido, c.esposa, c.endereco, c.cidade, c.telefone1, c.telefone2, c.email, CASE WHEN c.id_conjuge_marido is null or (c.id_conjuge_marido = 0) THEN CONCAT(c.marido," - ",c.esposa) ELSE CONCAT(cm.nome_red," - ",ces.nome_red) END as casal, CONCAT(c2.marido," - ",c2.esposa) as casal_encontreiro, g.imagem as foto';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {id:1,field:"c.cidade",alias:"Cidade",type:"string"},
            {id:2,field:"c.id_casal",alias:"Código",type:"number"},
            {id:3,field:"CONCAT(case when cm.dieta_alim is null then '' else cm.dieta_alim end,case when ces.dieta_alim is null then '' else ces.dieta_alim end)",alias:"Com Restrição Alimentar?",type:"fixed",values:[{value:'<> ""',alias:"Sim"},{value:'= ""',alias:"Não"}],logico:true},
            {id:4,field:"(CONCAT(case when cm.dieta_alim is null then '' else cm.dieta_alim end,case when ces.dieta_alim is null then '' else ces.dieta_alim end))",alias:"Restrição Alimentar",type:"string"},
            {id:5,field:"CONCAT(case when cm.alergias is null then '' else cm.alergias end,case when ces.alergias is null then '' else ces.alergias end)",alias:"Usa Medicamentos ou tem Alergias?",type:"fixed",values:[{value:'<> ""',alias:"Sim"},{value:'= ""',alias:"Não"}],logico:true},
            {id:6,field:"(CONCAT(case when cm.alergias is null then '' else cm.alergias end,case when ces.alergias is null then '' else ces.alergias end))",alias:"Medicamentos ou Alergias",type:"string"},

        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"casais c ON ci.id_casal = c.id_casal",
              1:"encontro e ON ci.id_encontro = e.id_encontro",
          };

        var left_join = {
              0:"galeria g on c.id_galeria = g.id_galeria",
              1:"enc_encontreiro ce ON ce.id_enc_eiro = ci.id_enc_eiro",
              2:"casais c2 ON c2.id_casal = ce.id_casal",
              3:"conjuge cm ON c.id_conjuge_marido = cm.id_conjuge",
              4:"conjuge ces ON c.id_conjuge_esposa = ces.id_conjuge",              
          };

          var camposInvalidos = [
            'action',
            'id_empresa',
            'id_usuario',
            'id_conjuge_marido',
            'id_conjuge_esposa',
            'marido',
            'esposa',
            'endereco',
            'cidade',
            'telefone1',
            'telefone2',
            'casal',
            'foto',
            'email',
            'valor_ficha',
            'situacao',
            'encontro',
            'numero',
            'complemento',
            'bairro',
            'cep',
            'uf',
            'data_casamento',
            'possui_conducao',
            'tem_filhos',
            'qt_filhos',
            'resp_filhos',
            'end_resp_filhos',
            'bairro_resp_filhos',
            'cidade_resp_filhos',
            'tel_resp_filhos',
            'casal_convite',
            'tel_casal_convite'
          ];
        var camposData = [];
        var camposForeignKey = ['id_encontro','id_enc_eiro'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'c.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'enc_encontrista ci',//modulo com alias para consultas
          modulo          : 'enc_encontrista',
          id_tabelaQuery  : 'ci.id_enc_ista',
          id_tabela       : 'id_enc_ista',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [idEncontro,idEncontreiro],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : 'foto',
        };
        return dataset;
      }

      function equipes(idEncontro) {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'ee.id_enc_eq, ee.id_encontro, ee.descricao';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
            0:"encontro e ON ee.id_encontro = e.id_encontro",
        };

        var left_join = {
          };

          var camposInvalidos = [
            'action',
          ];
        var camposData = [];
        var camposForeignKey = ['id_encontro'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'e.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'enc_equipe ee',//modulo com alias para consultas
          modulo          : 'enc_equipe',
          id_tabelaQuery  : 'ee.id_enc_eq',
          id_tabela       : 'id_enc_eq',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [idEncontro],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
        };
        return dataset;
      }
      function equipesCasais(idEncontro,idEquipe) {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'eq.id_enc_eq_eiro, eq.id_enc_eq, eq.id_enc_eiro,e.id_encontro, e.descricao, CONCAT(c.marido," - ",c.esposa) as casal, c.cidade, c.endereco, c.telefone1, c.telefone2, c.email';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
            0:"enc_equipe e ON eq.id_enc_eq = e.id_enc_eq",
            1:"enc_encontreiro ee ON eq.id_enc_eiro = ee.id_enc_eiro",
            2:"casais c ON ee.id_casal = c.id_casal",
        };

        var left_join = {
          };

          var camposInvalidos = [
            'action',
            'id_encontro',
            'descricao',
            'casal',
            'cidade',
            'endereco',
            'telefone1',
            'telefone2',
            'email',
            'valor_insc',
            'total_invest',
            'total_conv',
            'pago',
            'id_usuario',
            'id_empresa',
            'id_casal',
            'foto',
            'esposa',
            'marido',
          ];
        var camposData = [];
        var camposForeignKey = [];
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'c.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'enc_equipe_eiro eq',//modulo com alias para consultas
          modulo          : 'enc_equipe_eiro',
          id_tabelaQuery  : 'eq.id_enc_eq_eiro',
          id_tabela       : 'id_enc_eq_eiro',
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
