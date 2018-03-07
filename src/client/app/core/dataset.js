/*
        	var campos = '';

	    	var inner_join = {
	            0:"",
	        };

	    	var left_join = {
	            0:"",
	        };

	        var camposInvalidos = [''];

        	var dataset = {
        		campos          : campos,
        		inner_join      : inner_join,
        		left_join       : left_join,
        		camposInvalidos : camposInvalidos,
        		id_index_main   : 'id_empresa',
        		valor_id_main   : empresa.id_empresa,
        		moduloQuery     : '',//modulo com alias para consultas
        		modulo          : '',
        		id_tabela       : '',
        		orderBy         : '',
        		groupBy         : '',
        	};
        	return dataset;

 */

(function() {
    'use strict';
    angular
        .module('app.core')
        .factory('Dataset', Dataset);
    Dataset.$inject = ['Provider','ApiService'];
    /* @ngInject */
    function Dataset(Provider,ApiService) {

        var empresa = Provider.getSessaoEmpresa;
        var api = {
            create       : ApiService.create,
            read         : ApiService.read,
            update       : ApiService.update,
            deletar      : ApiService.deletar,
            aplayUpdates : ApiService.aplayUpdates,
            enviarEmail  : ApiService.enviarEmail,
        };
        var service = {
        	usuario        : usuario,
          empresas       : empresas,
          perfil         : perfil,
          perfilModulos  : perfilModulos,
          modulosGrp     : modulosGrp,
          modulosSis     : modulosSis,
        };
        return service;
        ////////////////

        function usuario() {
          // campos são os campos da tabela que são visiveis no sistema
        	var campos = ' u.id_usuario, u.id_empresa, u.id_galeria, u.nome, u.status, u.email, u.id_perfil, u.data_acess, u.ip_acess, u.id_vendedor,u.id_filial, g.imagem as foto, p.nome_red as vendedor,pf.nome_red as filial,pf.id_pessoa as id_pessoa_filial';
          // camposFiltro são os campos usados para fazer a pesquisa no sistema
          var camposFiltro = [
              {field:"u.status",alias:"Status",type:"fixed",values:[{value:1,alias:"Ativo"},{value:0,alias:"Inativo"}]},
              {field:"u.email",alias:"Email",type:"string"},
              {field:"u.id_usuario",alias:"Código",type:"number"}
          ];
          // filtroDefault é a pesquisa que ja vem padrao pelo sistema
          var filtroDefault = [
            {campo:"u.status",express:"=",value:"1",alias:"Status",aliasValue:"Ativo",type:"fixed"},
          ];

  	    	var inner_join = {
  	            0:"filial f on u.id_filial = f.id_filial",
                1:"pessoas pf on f.id_pessoa = pf.id_pessoa",
  	        };

  	    	var left_join = {
  	            0:"galeria g on u.id_galeria = g.id_galeria",
                1:"vendedor v on  u.id_vendedor = v.id_vendedor",
                2:"pessoas p on v.id_pessoa = p.id_pessoa",
  	        };
          var camposData = [];
          var camposForeignKey = ['id_empresa'];
	        var camposInvalidos = ['action','foto','vendedor','filial','id_pessoa_filial'];
          var emp = empresa();
        	var dataset = {
            setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
            api             : api,
        		empresa         : emp,
        		campos          : campos,
        		inner_join      : inner_join,
        		left_join       : left_join,
        		camposInvalidos : camposInvalidos,
        		id_index_main   : 'u.id_empresa',
        		valor_id_main   : emp.id_empresa,
        		moduloQuery     : 'usuarios u',//modulo com alias para consultas
        		modulo          : 'usuarios',
        		id_tabelaQuery  : 'u.id_usuario',
        		id_tabela       : 'id_usuario',
        		orderBy         : '',
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

        function empresas() {
          // campos são os campos da tabela que são visiveis no sistema
          /*
SELECT 
e.id_empresa,
e.nome,
e.cpf_cnpj,
e.endereco,
e.responsavel,
e.data_cad,
e.email,
e.cel,
e.status,
e.tel1,
e.tel2,
e.slogan,
e.cidade,
e.id_galeria,
e.fantasia,
e.estado,
e.cad_confirm,
e.config_n_nf,
e.config_data_estoque,
e.config_id_tp_padrao,
e.config_id_tipo_mov_ven_cons,
e.config_id_pessoa_cons,

CONCAT(t.descricao," ",tp.descricao) as tabela,
g.imagem,
tme.descricao as tipo_mov,
CONCAT(p.nome_red," - ",p.nome_comp) as consumidor

FROM empresas e 
LEFT JOIN tabela_prazos tp ON e.config_id_tp_padrao = tp.id_tp
LEFT JOIN tabela t ON tp.id_tabela = t.id_tabela
LEFT JOIN galeria g on e.id_galeria = g.id_galeria
LEFT JOIN tipo_mov_estoque tme ON e.config_id_tipo_mov_ven_cons = tme.id_tipo_mov
LEFT JOIN pessoas p ON e.config_id_pessoa_cons = p.id_pessoa
           */
          // 
          var campos = 'e.id_empresa, e.nome, e.cpf_cnpj, e.endereco, e.responsavel, e.data_cad, e.email, e.cel, e.status, e.tel1, e.tel2, e.slogan, e.cidade, e.id_galeria, e.fantasia, e.estado, e.cad_confirm, e.config_n_nf, e.config_data_estoque, e.config_id_tp_padrao,e.config_id_tipo_mov_ven_cons,e.config_id_pessoa_cons,config_show_qt_pdv,  CONCAT(t.descricao," ",tp.descricao) as tabela, g.imagem,  tme.descricao as tipo_mov, CONCAT(p.nome_red," - ",p.nome_comp) as consumidor';
          // camposFiltro são os campos usados para fazer a pesquisa no sistema
          var camposFiltro = [
          ];
          // filtroDefault é a pesquisa que ja vem padrao pelo sistema
          var filtroDefault = [
          ];

          var inner_join = {
                0:"",
            };

          var left_join = {
                0:"galeria g on e.id_galeria = g.id_galeria",
                1:"tabela_prazos tp ON e.config_id_tp_padrao = tp.id_tp",
                2:"tabela t ON tp.id_tabela = t.id_tabela",
                3:"tipo_mov_estoque tme ON e.config_id_tipo_mov_ven_cons = tme.id_tipo_mov",
                4:"pessoas p ON e.config_id_pessoa_cons = p.id_pessoa",
            };
          var camposData = [];
          var camposForeignKey = [];
          var camposInvalidos = ['action','tabela','imagem','tipo_mov','consumidor'];
          var emp = empresa();
          var dataset = {
            setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
            api             : api,
            empresa         : emp,
            campos          : campos,
            inner_join      : inner_join,
            left_join       : left_join,
            camposInvalidos : camposInvalidos,
            id_index_main   : '1',
            valor_id_main   : '1',
            moduloQuery     : 'empresas e',//modulo com alias para consultas
            modulo          : 'empresas',
            id_tabelaQuery  : 'e.id_empresa',
            id_tabela       : 'id_empresa',
            orderBy         : '',
            groupBy         : '',
            provider        : Provider,
            camposFiltro    : camposFiltro,
            filtroDefault   : filtroDefault,
            camposData      : camposData,
            camposForeignKey: camposForeignKey,
            valueForeignKey : [],//será preenchido quando dentro da classe que chamar essa função
            campoImagem     : 'imagem',

          };
          return dataset;
        }

        function perfil() {
          // campos são os campos da tabela que são visiveis no sistema
          //se nao for preenchido vira todos os campos
        	var campos = '';
          // camposFiltro são os campos usados para fazer a pesquisa no sistema
          var camposFiltro = [
              {field:"nome",alias:"Descrição",type:"string"},
              {field:"id_perfil",alias:"Código",type:"number"}
          ];
          // filtroDefault é a pesquisa que ja vem padrao pelo sistema
          var filtroDefault = [];

  	    	var inner_join = {
  	            0:"",
  	        };

  	    	var left_join = {
  	            0:"",
  	        };
          var camposData = [];
          var camposForeignKey = ['id_empresa'];
	        var camposInvalidos = ['action'];
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
        		moduloQuery     : 'perfils',//modulo com alias para consultas
        		modulo          : 'perfils',
        		id_tabelaQuery  : 'id_perfil',
        		id_tabela       : 'id_perfil',
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

        function perfilModulos() {
          // campos são os campos da tabela que são visiveis no sistema
          //se nao for preenchido vira todos os campos
        	var campos = 'pm.id_pm, pm.id_modulo, pm.id_perfil, pm.permitido, m.nome as modulo, m.id_mg';
          // camposFiltro são os campos usados para fazer a filtros avançados no sistema
          var camposFiltro = [];
          // filtroDefault é a pesquisa que ja vem padrao pelo sistema
          var filtroDefault = [];

  	    	var inner_join = {
  	            0:"modulos m on pm.id_modulo = m.id_modulo",
                1:"perfils p on pm.id_perfil = p.id_perfil",
  	        };

  	    	var left_join = {
  	            0:"",
  	        };

	        var camposInvalidos = ['action','modulo','id_mg'];
          var emp = empresa();
        	var dataset = {
            indexEmp        : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
            api             : api,
        		empresa         : emp,
        		campos          : campos,
        		inner_join      : inner_join,
        		left_join       : left_join,
        		camposInvalidos : camposInvalidos,
        		id_index_main   : 'p.id_empresa',
        		valor_id_main   : emp.id_empresa,
        		moduloQuery     : 'perfil_modulos pm',//modulo com alias para consultas
        		modulo          : 'perfil_modulos',
        		id_tabelaQuery  : 'pm.id_pm',
        		id_tabela       : 'id_pm',
        		orderBy         : '',
        		groupBy         : '',
            provider        : Provider,
            camposFiltro    : camposFiltro,
            camposData      : [],
            filtroDefault   : filtroDefault,
        	};
        	return dataset;
        }

        function modulosSis() {
          // campos são os campos da tabela que são visiveis no sistema
          //se nao for preenchido vira todos os campos
          var campos = '';
          // camposFiltro são os campos usados para fazer a pesquisa no sistema
          var camposFiltro = [];
          // filtroDefault é a pesquisa que ja vem padrao pelo sistema
          var filtroDefault = [];

          var inner_join = {
                0:"",
            };

          var left_join = {
                0:"",
            };

          var camposInvalidos = ['action'];
          var emp = empresa();
          var dataset = {
            indexEmp        : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
            api             : api,
            empresa         : emp,
            campos          : campos,
            inner_join      : inner_join,
            left_join       : left_join,
            camposInvalidos : camposInvalidos,
            id_index_main   : '1',
            valor_id_main   : '1',
            moduloQuery     : 'modulos',//modulo com alias para consultas
            modulo          : 'modulos',
            id_tabelaQuery  : 'id_modulo',
            id_tabela       : 'id_modulo',
            orderBy         : '',
            groupBy         : '',
            provider        : Provider,
            camposFiltro    : camposFiltro,
            camposData      : [],
            filtroDefault   : filtroDefault,
          };
          return dataset;
        }

        function modulosGrp() {
          // campos são os campos da tabela que são visiveis no sistema
          //se nao for preenchido vira todos os campos
          var campos = '';
          // camposFiltro são os campos usados para fazer a pesquisa no sistema
          var camposFiltro = [];
          // filtroDefault é a pesquisa que ja vem padrao pelo sistema
          var filtroDefault = [];

          var inner_join = {
                0:"",
            };

          var left_join = {
                0:"",
            };

          var camposInvalidos = ['action'];
          var emp = empresa();
          var dataset = {
            indexEmp        : false,//esse campo determina se a cada novo registro será recibido o campo id_empresa
            api             : api,
            empresa         : emp,
            campos          : campos,
            inner_join      : inner_join,
            left_join       : left_join,
            camposInvalidos : camposInvalidos,
            id_index_main   : '1',
            valor_id_main   : '1',
            moduloQuery     : 'modulos_grupo',//modulo com alias para consultas
            modulo          : 'modulos_grupo',
            id_tabelaQuery  : 'id_mg',
            id_tabela       : 'id_mg',
            orderBy         : '',
            groupBy         : '',
            provider        : Provider,
            camposFiltro    : camposFiltro,
            camposData      : [],
            filtroDefault   : filtroDefault,
          };
          return dataset;
        }
    }
})();
