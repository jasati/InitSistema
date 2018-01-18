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
        tabelaItem : tabelaItem,
        cliente    : cliente,
        categoria  : categoria,
        pessoa     : pessoa,
        forn       : forn,
        unidade    : unidade,
        tabelaItensPreco : tabelaItensPreco,
        classeTabela : classeTabela,
        meioPag    : meioPag,
        numeroNf   : numeroNf,
        movSaldoEstoque : movSaldoEstoque,
      };

      return service;


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
        var campos = 'c.id_cliente, c.id_pessoa, c.status, c.id_tabela, c.limite_credito, p.id_empresa, p.data_cad, p.nome_comp, p.nome_red, p.data_nasc, p.tipo, p.cpf_cnpj, p.rg, p.uf, p.cidade, p.bairro, p.logradouro, p.numero, p.complemento, p.cep, p.email, p.tel, p.cel1, p.cel2, p.email_acess, p.senha, p.obs, t.descricao as tabela';
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
              0:"tabela t ON c.id_tabela = t.id_tabela",
          };

        var tableCols = [
          {prop:'id_cliente',name:'Código',show:true,width:5},
          {prop:'nome_red',name:'Apelido',show:true,width:20},
          {prop:'nome_comp',name:'Nome',show:true,width:30},
          {prop:'cpf_cnpj',name:'CPF/CNPJ',show:true,width:10},
          {prop:'cidade',name:'Cidade',show:true,width:15},
          {prop:'bairro',name:'Bairro',show:true,width:10},
          {prop:'tel',name:'Telefone',show:true,width:10},
        ];

        var camposInvalidos = ['action','id_empresa', 'data_cad', 'nome_comp', 'nome_red', 'data_nasc', 'tipo', 'cpf_cnpj', 'rg', 'uf', 'cidade', 'bairro', 'logradouro', 'numero', 'complemento', 'cep', 'email', 'tel','cel1', 'cel2', 'email_acess', 'senha','obs','tabela'];
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
          tableCols       : tableCols,
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
        var campos = 'p.id_pessoa, p.id_empresa, p.data_cad, p.nome_comp, p.nome_red, p.data_nasc, p.tipo, p.cpf_cnpj, p.rg, p.uf, p.cidade, p.bairro, p.logradouro, p.numero, p.complemento, p.cep, p.email, p.tel, p.cel1, p.cel2, p.email_acess, p.senha, p.obs, c.id_cliente,c.limite_credito,c.id_tabela,t.descricao as tabela, f.id_fornecedor, v.id_vendedor, fl.id_filial';
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
              4:"tabela t on c.id_tabela = t.id_tabela",
          };
        var tableCols = [];
        var camposInvalidos = ['action','status','id_tabela','limite_credito','representante','id_cliente','id_fornecedor','id_vendedor','id_filial','tabela'];
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
