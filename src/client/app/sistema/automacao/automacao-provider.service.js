(function() {
    'use strict';
    angular
        .module('app.automacao')
        .service('AutomacaoProvider', AutomacaoProvider);
    AutomacaoProvider.$inject = ['Provider','ApiService'];
    /* @ngInject */
    function AutomacaoProvider(Provider,ApiService) {
        this.provider = provider;
        ////////////////
        function provider() {
    		var empresa = Provider.getSessaoEmpresa;
	        // campos são os campos da tabela que são visiveis no sistema
	        //se nao for preenchido vira todos os campos
	        var inner_join = {
	              0:"",
	          };

	        var left_join = {
	              0:"",
	          };
	        var emp = empresa();
	        var dataSet = {
	          setForeignKey   : true,//esse campo determina se a cada novo registro será recibido o campo id_empresa
	          api             : ApiService,
  	          provider        : Provider,
	          empresa         : emp,
	          user            : Provider.getSessaoUsuario(),
	          filtroData      : Provider.getFiltroData(),
	          campos          : '',//campos da consulta sql
	          inner_join      : inner_join,
	          left_join       : left_join,
	          camposInvalidos : ['action','child'],//campos que sera removido na operaçõa de insert ou update
	          id_index_main   : 'id_empresa',//
	          valor_id_main   : emp.id_empresa,
	          moduloQuery     : '',//nome da tabela com alias para consultas ex: clientes c
	          modulo          : '',//nome da tabela ex: clientes
	          id_tabelaQuery  : '',//o id da tabela com o alias ex:c.id_cliente
	          id_tabela       : '',//o id da tabela
	          orderBy         : '',//order by na consulta sql
	          groupBy         : '',//group by da consulta sql
	          camposFiltro    : [],//os campos que sera apresentado no filtro
	          filtroDefault   : [],//filtro para ser chamado quando for carregado
	          camposData      : [],//são os campos do tipo date
	          camposForeignKey: [],//campos chave estrangeira
	          valueForeignKey : [emp.id_empresa],//será preenchido quando dentro da classe que chamar essa função
	          campoImagem     : '',//campo que leva o path de uma imagem a ser carregado
	          tableCols       : [],//sao os campos de colunas na tabela
	          campoDataQry    : ''//campo que sera filtrado por data
	        };
	        return dataSet;
        }
    }
})();