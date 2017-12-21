(function() {
    'use strict';

    angular
        .module('app.automacao')
        .factory('AutomacaoDataset', AutomacaoDataset);

    AutomacaoDataset.$inject = ['Provider','ApiService'];

    /* @ngInject */
    function AutomacaoDataset(Provider,ApiService) {
      var empresa = Provider.getSessaoEmpresa;
      var api = {
          create       : ApiService.create,
          read         : ApiService.read,
          update       : ApiService.update,
          deletar      : ApiService.deletar,
          aplayUpdates : ApiService.aplayUpdates,
          enviarEmail  : ApiService.enviarEmail,
          gerarPdf     : ApiService.gerarPdf,
          callFunction : ApiService.callFunction,
          callProcedure: ApiService.callProcedure,
      };
      var service = {
        item       : item,
        tabelaItem : tabelaItem,
        cliente    : cliente,
        categoria  : categoria,
        pessoa     : pessoa,
        forn       : forn,
        unidade    : unidade,
        tabelaItensPreco : tabelaItensPreco,
        classeTabela : classeTabela,
        tipoMov : tipoMov,
        movEstoque : movEstoque,
        movItensEstoque : movItensEstoque,
        meioPag    : meioPag,
        numeroNf   : numeroNf,
        movSaldoEstoque : movSaldoEstoque,
      };

      return service;

      function item() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = '';
        var camposDinamicos = function(prm) {
          var c = ' i.id_empresa, i.id_item, i.id_galeria, i.id_categoria, i.codigo, i.ref, i.descricao,i.id_unidade, '+
          'i.detalhes, i.marca, i.status, i.saldo, i.data_cad, i.saldo_min, i.saldo_max, i.perc_preco, i.preco, i.custo, i.id_fornecedor, '+
          'iu.sigla, cf.descricao as categoria, g.imagem, p.nome_comp as fornecedor';
          var f =', @perc_tabela := (select ip.percentual from itens_preco ip where ip.id_item_preco = '+prm+') as perc_tabela,'+
            'CASE WHEN @perc_tabela is null THEN i.preco ELSE round((@perc_tabela * i.preco /100)+i.preco,2) END as valor';
          return c+f;
        }
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"i.codigo",alias:"Código",type:"string"},
            {field:"i.ref",alias:"Referência",type:"string"},
            {field:"i.marca",alias:"Marca",type:"string"},
            {field:"p.nome_comp",alias:"Fornecedor",type:"string"},
            {field:"iu.sigla",alias:"Unidade de Medida",type:"string"},
            {field:"i.status",alias:"Status",type:"fixed",values:[{value:1,alias:"Ativo"},{value:0,alias:"Inativo"}]},
            {field:"cf.descricao",alias:"Categoría",type:"dinamic",values:'parent'}//funciona o autocomplete no filtro> values é o campo texto que sera apresentado no template do autocomplete
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"galeria g on i.id_galeria = g.id_galeria",
              1:"item_unidade iu on i.id_unidade = iu.id_unidade",
              2:"categorias cf on i.id_categoria = cf.id_categoria",
              3:"categorias cp on cf.id_cat_pai = cp.id_categoria",
              4:"categorias ca on cp.id_cat_pai = ca.id_categoria",
              5:"fornecedor f ON i.id_fornecedor = f.id_fornecedor",
              6:"pessoas p ON f.id_pessoa = p.id_pessoa",

          };

        var camposInvalidos = ['action','imagem','perc_tabela','valor','sigla','categoria','fornecedor',
        'id_mov_item','id_mov','qt','desconto','desc_perc','acres'];
        var camposData = [];
        var camposForeignKey = ['id_empresa'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          camposDinamicos : camposDinamicos,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'i.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'itens i',//modulo com alias para consultas
          modulo          : 'itens',
          id_tabelaQuery  : 'i.id_item',
          id_tabela       : 'id_item',
          orderBy         : 'i.descricao',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : 'imagem',
        };
        return dataset;
      }

      function tabelaItem() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"descricao",alias:"Descrição",type:"string"},
            {field:"id_item",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"",
          };

        var camposInvalidos = [];
        var camposData = [];
        var camposForeignKey = ['id_empresa'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'tabelapreco',//modulo com alias para consultas
          modulo          : 'tabelapreco',
          id_tabelaQuery  : 'id_item',
          id_tabela       : 'id_item',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tab             : '',//Todas as tabelas
        };
        return dataset;
      }

      function categoria(argument) {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'cf.id_categoria, cf.id_empresa, cf.descricao, cf.tipo, cf.id_cat_pai, cp.descricao as cat_pai, '+
        '@parent:=CASE WHEN ca.descricao is null AND cp.descricao is null THEN CONCAT(cf.descricao) '+
        'WHEN ca.descricao is null THEN CONCAT(cp.descricao," > ",cf.descricao) '+
        'ELSE CONCAT(ca.descricao," > ",cp.descricao," > ",cf.descricao) END AS parent';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var f = 'CASE WHEN ca.descricao is null AND cp.descricao is null THEN CONCAT(cf.descricao) WHEN ca.descricao is null THEN CONCAT(cp.descricao," > ",cf.descricao) ELSE CONCAT(ca.descricao," > ",cp.descricao," > ",cf.descricao) END';
        var camposFiltro = [
            {field:"cf.tipo",alias:"Classificação",type:"fixed",values:[{value:"P",alias:"PRODUTO"},{value:"S",alias:"SERVIÇO"}]},
            {field:f,alias:"Categoría Pai",type:"dinamic",values:'parent'}//funciona o altocomplete no filtro> values é o campo texto que sera apresentado no template do autocomplete
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"categorias cp on cf.id_cat_pai = cp.id_categoria",
              1:"categorias ca on cp.id_cat_pai = ca.id_categoria",
          };
        var tableCols = [
          {prop:'parent',name:'Descrição da categoría',show:true},
          {prop:'tipo',name:'Classificação',express:function(prm){if(prm=="P"){ return "PRODUTO";}else{return "SERVIÇO";}},show:true}
        ]
        var camposInvalidos = ['action','cat_pai','parent'];
        var camposData = [];
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
          id_index_main   : 'cf.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'categorias cf',//modulo com alias para consultas
          modulo          : 'categorias',
          id_tabelaQuery  : 'cf.id_categoria',
          id_tabela       : 'id_categoria',
          orderBy         : 'parent',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }

      function classeTabela() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"descricao",alias:"Descrição",type:"string"},
            {field:"id_tabela_preco",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"",
          };

        var camposInvalidos = [];
        var camposData = [];
        var camposForeignKey = ['id_empresa'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'tabela_precos',//modulo com alias para consultas
          modulo          : 'tabela_precos',
          id_tabelaQuery  : 'id_tabela_preco',
          id_tabela       : 'id_tabela_preco',
          orderBy         : '',
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

      function tabelaItensPreco() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'ip.id_item_preco,ip.descricao,ip.id_tabela_preco,ip.percentual';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"ip.descricao",alias:"Descrição",type:"string"},
            {field:"ip.id_item_preco",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"tabela_precos tp on ip.id_tabela_preco = tp.id_tabela_preco",
          };

        var left_join = {
              0:"",
          };

        var camposInvalidos = ['action'];
        var camposData = [];
        var camposForeignKey = ['id_tabela_preco'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'tp.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'itens_preco ip',//modulo com alias para consultas
          modulo          : 'itens_preco',
          id_tabelaQuery  : 'ip.id_tabela_preco',
          id_tabela       : 'id_tabela_preco',
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

      function cliente() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'c.id_cliente, c.id_pessoa, c.status, c.id_tabela_preco, c.limite_credito, p.id_empresa, p.data_cad, p.nome_comp, p.nome_red, p.data_nasc, p.tipo, p.cpf_cnpj, p.rg, p.uf, p.cidade, p.bairro, p.logradouro, p.numero, p.complemento, p.cep, p.email, p.tel, p.cel1, p.cel2, p.email_acess, p.senha, p.obs, tp.descricao as tabela_preco';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"p.nome_comp",alias:"Descrição",type:"string"},
            {field:"c.id_cliente",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"pessoas p ON c.id_pessoa = p.id_pessoa",
          };

        var left_join = {
              0:"tabela_precos tp ON c.id_tabela_preco = tp.id_tabela_preco",
          };

        var camposInvalidos = ['action','id_empresa', 'data_cad', 'nome_comp', 'nome_red', 'data_nasc', 'tipo', 'cpf_cnpj', 'rg', 'uf', 'cidade', 'bairro', 'logradouro', 'numero', 'complemento', 'cep', 'email', 'tel','cel1', 'cel2', 'email_acess', 'senha','obs','tabela_preco'];
        var camposData = [];
        var camposForeignKey = ['id_pessoa'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'p.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'clientes c',//modulo com alias para consultas
          modulo          : 'clientes',
          id_tabelaQuery  : 'c.id_cliente',
          id_tabela       : 'id_cliente',
          orderBy         : 'p.nome_comp',
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

      function forn() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'f.id_fornecedor, f.id_pessoa, f.representante, f.cel1, f.status, p.id_empresa, p.data_cad, p.nome_comp, p.nome_red, p.data_nasc, p.tipo, p.cpf_cnpj, p.rg, p.uf, p.cidade, p.bairro, p.logradouro, p.numero, p.complemento, p.cep, p.email, p.tel, p.cel1, p.cel2, p.email_acess, p.senha, p.obs';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"p.nome_comp",alias:"Descrição",type:"string"},
            {field:"f.id_fornecedor",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"pessoas p ON f.id_pessoa = p.id_pessoa",
          };

        var left_join = {
              0:"",
          };

        var camposInvalidos = ['action','id_empresa', 'data_cad', 'nome_comp', 'nome_red', 'data_nasc', 'tipo', 'cpf_cnpj', 'rg', 'uf', 'cidade', 'bairro', 'logradouro', 'numero', 'complemento', 'cep', 'email', 'tel','cel1', 'cel2', 'email_acess', 'senha','obs'];
        var camposData = [];
        var camposForeignKey = ['id_pessoa'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'p.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'fornecedor f',//modulo com alias para consultas
          modulo          : 'fornecedor',
          id_tabelaQuery  : 'f.id_fornecedor',
          id_tabela       : 'id_fornecedor',
          orderBy         : 'p.nome_comp',
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

      function pessoa() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'p.id_pessoa, p.id_empresa, p.data_cad, p.nome_comp, p.nome_red, p.data_nasc, p.tipo, p.cpf_cnpj, p.rg, p.uf, p.cidade, p.bairro, p.logradouro, p.numero, p.complemento, p.cep, p.email, p.tel, p.cel1, p.cel2, p.email_acess, p.senha, p.obs, c.id_cliente, f.id_fornecedor, v.id_vendedor, fl.id_filial';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"nome_comp",alias:"Descrição",type:"string"},
            {field:"id_pessoa",alias:"Código",type:"number"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"clientes c ON p.id_pessoa = c.id_pessoa",
              1:"fornecedor f ON p.id_pessoa = f.id_pessoa",
              2:"vendedor v ON p.id_pessoa = v.id_pessoa",
              3:"filial fl ON p.id_pessoa = fl.id_pessoa",
          };
        var tableCols = [];
        var camposInvalidos = ['action','status','id_tabela_preco','limite_credito','representante','id_cliente','id_fornecedor','id_vendedor','id_filial'];
        var camposData = ['data_cad','data_nasc'];
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
          id_index_main   : 'p.id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'pessoas p',//modulo com alias para consultas
          modulo          : 'pessoas',
          id_tabelaQuery  : 'p.id_pessoa',
          id_tabela       : 'id_pessoa',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }

      function unidade() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"sigla",alias:"Sigla",type:"string"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"",
          };
        var tableCols = [
          {prop:'descricao',name:'Descrição da Unidade',show:true},
          {prop:'sigla',name:'Sigla',show:true}
        ]
        var camposInvalidos = ['action'];
        var camposData = [];
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
          moduloQuery     : 'item_unidade',//modulo com alias para consultas
          modulo          : 'item_unidade',
          id_tabelaQuery  : 'id_unidade',
          id_tabela       : 'id_unidade',
          orderBy         : 'descricao',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }

      function tipoMov() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        var campos = 'id_tipo_mov, id_empresa, descricao, tipo, status, alt_cad_item, mov_estoque, CASE WHEN tipo = "S" THEN "Saida do estoque" WHEN tipo = "E" THEN "Entrada no estoque" WHEN tipo = "P" THEN "Não movimenta estoque" END AS desc_tipo';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"tipo",alias:"Tipo",type:"string"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [
          {campo:"status",express:"=",value:"1",alias:"Status",aliasValue:"Ativo",type:"fixed"},
        ];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"",
          };
        var tableCols = [
          {prop:'descricao',name:'Tipo de movimentação',show:true},
        ]
        var camposInvalidos = ['action'];
        var camposData = [];
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
          moduloQuery     : 'tipo_mov_estoque',//modulo com alias para consultas
          modulo          : 'tipo_mov_estoque',
          id_tabelaQuery  : 'id_tipo_mov',
          id_tabela       : 'id_tipo_mov',
          orderBy         : '',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }

      function movEstoque() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        /*

      SELECT 
          em.id_mov,
          em.id_filial,
          em.id_pessoa_emitente,
          em.id_pessoa_destinatario,
          em.id_tipo_mov,
          em.id_vendedor,
          em.id_item_preco,
          em.data_mov,
          em.status,
          em.n_nf,
          em.data_emissao,
          em.data_saida,
          em.obs,
      
      CASE 
      WHEN em.status = 'A' THEN 'ABERTO'
      WHEN em.status = 'C' THEN 'CANCELADO'
      WHEN em.status = 'F' THEN 'FECHADO'
      END AS desc_status,

          tmp.descricao as desc_tipo_mov,
          tmp.tipo as tipo_mov,

          vf.nome_comp as filial_nome_comp,
          vf.nome_red as filial_nome_red,
          vf.logradouro as filial_logradouro,
          vf.cpf_cnpj as filial_cpf_cnpj,
          vf.numero as filial_numero,
          vf.cidade as filial_cidade,
          vf.uf as filial_uf,
          vf.tel as filial_tel,
          emp.id_empresa,
          emp.slogan,

          vv.nome_comp as vendedor_nome_comp,
          vv.nome_red as vendedor_nome_red,
      
      pe.nome_comp as p_emi_nome_comp,
      pe.nome_red as p_emi_nome_red,
      pe.cpf_cnpj as p_emi_cpf_cnpj,
      pe.logradouro as p_emi_logradouro,
      pe.numero as p_emi_numero,
      pe.uf as p_emi_uf,
      pe.tel as p_emi_tel,
      pe.cel1 as p_emi_cel1,
      pe.complemento as p_emi_complemento,
      
      pd.nome_comp as p_dest_nome_comp,
      pd.nome_red as p_dest_nome_red,
      pd.cpf_cnpj as p_dest_cpf_cnpj,
      pd.logradouro as p_dest_logradouro,
      pd.numero as p_dest_numero,
      pd.uf as p_dest_uf,
      pd.tel as p_dest_tel,
      pd.cel1 as p_dest_cel1,
      pd.complemento as p_dest_complemento,
      c.id_tabela_preco,
      f.id_fornecedor,
      
          (SELECT SUM(emi.qt*emi.valor) as total FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total,
          (SELECT SUM(emi.desconto) as desconto FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total_desc,
          (SELECT SUM(emi.acres) as acres FROM estoque_mov_itens emi WHERE emi.id_mov = em.id_mov) as total_acres          

          FROM estoque_mov em

          INNER JOIN view_filial vf ON em.id_filial = vf.id_filial
          INNER JOIN empresas emp ON vf.id_empresa = emp.id_empresa
          INNER JOIN tipo_mov_estoque tmp ON em.id_tipo_mov = tmp.id_tipo_mov

          LEFT JOIN pessoas pe ON em.id_pessoa_emitente = pe.id_pessoa
          LEFT JOIN pessoas pd ON em.id_pessoa_destinatario = pd.id_pessoa
          LEFT JOIN clientes c ON pd.id_pessoa = c.id_pessoa
          LEFT JOIN fornecedor f ON pe.id_pessoa = f.id_pessoa
          LEFT JOIN view_vendedor vv ON em.id_vendedor = vv.id_vendedor
          WHERE 1
         */

        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"data_mov",alias:"Data",type:"string"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"",
          };
        var tableCols = [
          // {prop:'data_mov',name:'Data',width:'10',show:true},
          // {prop:'desc_pdv',name:'PDV',width:'10',show:function (tipo) {if(tipo=='S'){return true}else{return false}}},
          // {prop:'pessoa_mov_nome_comp',name:function (tipo) {if(tipo=='S'){return 'Cliente'}else{return 'Fornecedor'}},width:'30',show:true},
          // {prop:'status',name:function (prm) {if(tipo=='A'){return 'ABERTO'}else{return 'CONCLUIDO'}},width:'10',show:true},
        ];
        var camposInvalidos = [
          'action','desc_status','desc_tipo_mov','tipo_mov','filial_nome_comp',
          'filial_nome_red','filial_logradouro','filial_cpf_cnpj',
          'filial_numero','filial_cidade','filial_uf','filial_tel',
          'id_empresa','slogan','vendedor_nome_comp','vendedor_nome_red',
          'p_emi_nome_comp','p_emi_nome_red','p_emi_cpf_cnpj','p_emi_logradouro',
          'p_emi_numero','p_emi_uf','p_emi_tel','p_emi_cel1','p_emi_complemento',
          'p_dest_nome_comp','p_dest_nome_red','p_dest_cpf_cnpj','p_dest_logradouro',
          'p_dest_numero','p_dest_uf','p_dest_tel','p_dest_cel1','p_dest_complemento','p_dest_cidade',
          'limite_credito','total','total_desc','total_acres','id_tabela_preco','id_fornecedor'
        ];
        var camposData = ['data_mov','data_emissao','data_saida'];
        var camposForeignKey = ['id_filial','id_tipo_mov'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro sera preenchido as foreignkey
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'view_estoque_mov',//modulo com alias para consultas
          modulo          : 'estoque_mov',
          id_tabelaQuery  : 'id_mov',
          id_tabela       : 'id_mov',
          orderBy         : 'data_mov',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }

      function movItensEstoque() {
        // campos são os campos da tabela que são visiveis no sistema
        //se nao for preenchido vira todos os campos
        /*
SELECT 
emi.id_mov_item,
emi.id_mov,
emi.id_item,
emi.qt,
emi.valor,
emi.desconto,
emi.desc_perc,
emi.acres,

i.descricao,
i.detalhes,
i.marca,
i.perc_preco,
i.preco,
i.codigo,
i.id_empresa,

iu.sigla


FROM estoque_mov_itens emi
INNER JOIN itens i ON emi.id_item = i.id_item
LEFT JOIN item_unidade iu ON i.id_unidade = iu.id_unidade        
         */

        var campos = '';
        // camposFiltro são os campos usados para fazer a pesquisa no sistema
        var camposFiltro = [
            {field:"data_mov",alias:"Data",type:"string"}
        ];
        // filtroDefault é a pesquisa que ja vem padrao pelo sistema
        var filtroDefault = [];

        var inner_join = {
              0:"",
          };

        var left_join = {
              0:"",
          };
        var tableCols = [
        ];
        var camposInvalidos = [
          'action',
          'descricao',
          'detalhes',
          'marca',
          'perc_preco',
          'preco',
          'codigo',
          'id_empresa',
          'sigla',
          'categoria',
          'codigo',
          'custo',
          'data_cad',
          'fornecedor',
          'id_fornecedor',
          'id_categoria',
          'id_galeria',
          'id_unidade',
          'imagem',
          'perc_preco',
          'perc_tabela',
          'preco',
          'ref',
          'saldo',
          'saldo_max',
          'saldo_min',
          'status'
        ];
        var camposData = [];
        var camposForeignKey = ['id_mov'];
        var emp = empresa();
        var dataset = {
          setForeignKey   : true,//esse campo determina se a cada novo registro sera preenchido as foreignkey
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'view_estoque_mov_itens',//modulo com alias para consultas
          modulo          : 'estoque_mov_itens',
          id_tabelaQuery  : 'id_mov_item',
          id_tabela       : 'id_mov_item',
          orderBy         : 'id_mov_item',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }

      function meioPag() {
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
        var tableCols = [
          {prop:'descricao',name:'Meio de Pagamento',show:true},
        ]
        var camposInvalidos = ['action'];
        var camposData = [];
        var camposForeignKey = [];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : '1',
          valor_id_main   : emp.id_empresa,
          moduloQuery     : 'meios_pag',//modulo com alias para consultas
          modulo          : 'meios_pag',
          id_tabelaQuery  : 'id_meio_pag',
          id_tabela       : 'id_meio_pag',
          orderBy         : 'id_meio_pag',
          groupBy         : '',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }

      function numeroNf() {
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
        var tableCols = []
        var camposInvalidos = ['action'];
        var camposData = [];
        var camposForeignKey = [];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          modulo          : 'getNumNf',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }      

      function movSaldoEstoque() {
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
        var tableCols = []
        var camposInvalidos = ['action'];
        var camposData = [];
        var camposForeignKey = [];
        var emp = empresa();
        var dataset = {
          setForeignKey   : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
          api             : api,
          empresa         : emp,
          campos          : campos,
          inner_join      : inner_join,
          left_join       : left_join,
          camposInvalidos : camposInvalidos,
          id_index_main   : 'id_empresa',
          valor_id_main   : emp.id_empresa,
          modulo          : 'prep_atual_sald_est',
          provider        : Provider,
          camposFiltro    : camposFiltro,
          filtroDefault   : filtroDefault,
          camposData      : camposData,
          camposForeignKey: camposForeignKey,
          valueForeignKey : [],//será preenchido quando dentro da classe que chamar essa função
          campoImagem     : '',
          tableCols       : tableCols,
        };
        return dataset;
      }      

    }
})();
