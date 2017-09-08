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
          perfil         : perfil,
          perfilModulos  : perfilModulos,
          modulosGrp     : modulosGrp,
          modulosSis     : modulosSis,
        };
        return service;
        ////////////////

        function usuario() {
          // campos são os campos da tabela que são visiveis no sistema
        	var campos = '';
          // camposFiltro são os campos usados para fazer a pesquisa no sistema
          var camposFiltro = [
              {field:"status",alias:"Status",type:"fixed",values:[{value:1,alias:"Ativo"},{value:0,alias:"Inativo"}]},
              {field:"email",alias:"Email",type:"string"},
              {field:"id_usuario",alias:"Código",type:"number"}
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
            campoImagem     : '',

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
            filtroDefault   : filtroDefault,
          };
          return dataset;
        }
    }
})();
