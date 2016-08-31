(function() {
    'use strict';
    angular
        .module('cad.item')
        .factory('ItemService', ItemService);
    ItemService.$inject = ['$q','dataservice','DataserviseProvider','UtilsFunctions'];
    /* @ngInject */
    function ItemService($q,dataservice,DataserviseProvider,UtilsFunctions) {
        var inner_join = {0 :"categoria c on i.id_categoria = c.id_categoria",
                          1 :"subcategoria sc on i.id_subcategoria = sc.id_subcat",
                          2 :"unidade_medidas u on i.id_unidade = u.id_unidade" 
            };
        var campos = " i.id_item, i.id_empresa, i.id_categoria, i.id_subcategoria, i.nome, "
        +"i.nome_detalhado, i.id_unidade, i.status, c.descricao as categoria, sc.descricao as subcategoria," 
        +"u.descricao as unidade_medida"
        var camposInvalidos = ['categoria','subcategoria','unidade_medida'];    	
        var dataset = DataserviseProvider.getPrmWebService();
        var itens = [];
        var service = {
            startDataset : startDataset,
            read         : read,
            create       : create,
            update       : update,
            deletar      : deletar,
            verificarPermissao : verificarPermissao
        };
        return service;
        ////////////////
        function startDataset() {          
            DataserviseProvider.setDataset(dataset,'id_index_main','id_empresa');
            DataserviseProvider.setDataset(dataset,'valor_id_main',DataserviseProvider.indexGeral.id_emp);
            DataserviseProvider.setDataset(dataset,'modulo','itens');
            DataserviseProvider.setDataset(dataset,'id_tabela','id_item');
            DataserviseProvider.setDataset(dataset,'campos',campos);
            DataserviseProvider.setDataset(dataset,'inner_join',inner_join);       
        }

        function read (prmConsulta,prmLimit) {
            var msgErro = 'Falha na Consulta do Item';
            var servico = 'consulta';
            var consulta = "";
            if (prmConsulta.codigo != "") {
                consulta += " and i.id_item = "+prmConsulta.codigo;
            };
            if (prmConsulta.descricao != "") {
                consulta += " and i.nome LIKE '%"+prmConsulta.descricao+"%'";
            }

            if (prmConsulta.avancado) {
                if (prmConsulta.id_categoria != "") {
                    consulta += " and i.id_categoria = "+prmConsulta.id_categoria;
                }
                if (prmConsulta.id_subcategoria != "") {
                    consulta += " and i.id_subcategoria = "+prmConsulta.id_subcategoria;
                }
                if (prmConsulta.id_unidade != "") {
                    consulta += " and i.id_unidade = "+prmConsulta.id_unidade;
                }
                if (prmConsulta.status != ""){
                    consulta += " and i.status = "+prmConsulta.status;
                }
            }

            DataserviseProvider.setDataset(dataset,'modulo','itens i');
            DataserviseProvider.setDataset(dataset,'id_tabela','i.id_item');                     
            DataserviseProvider.setDataset(dataset,'id_index_main','i.id_empresa');            
            DataserviseProvider.setDataset(dataset,'consulta',consulta);   
            DataserviseProvider.setDataset(dataset,'limit',prmLimit);          
            return dataservice.dadosWeb(dataset,servico,msgErro)
            	.then(function (data) {
                    if (consulta == "") {itens = data;}
                	return data;
           		});            
        }
        function cache() {
            return itens;
        }
        function create (data) {
            var msgErro = 'Falha na inclusão do item.';
            var msgSucess = 'Inclusão realizada com sucesso!';
            var action = 'novo';
            data.id_empresa = DataserviseProvider.indexGeral.id_emp;    	
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        } 

        function update (data) {
            var msgErro = 'Falha na Atualização do Item.';
            var msgSucess = 'Atualização realizada com sucesso!';
            var action = 'editar';	
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_item);
	        DataserviseProvider.setDataset(dataset,'estrutura',data);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }         

        function deletar (data) {
            var msgErro = 'Falha na exclusão do item.';
            var msgSucess = 'Exclusão realizada com sucesso!';
            var action = 'delete';
	        data = UtilsFunctions.removeCamposInvalidos(data,camposInvalidos);
            startDataset();
            DataserviseProvider.setDataset(dataset,'valor_id',data.id_item);
	        return dataservice.dadosWeb(dataset,action,msgErro,msgSucess)
	        	.then(function (data){
	        		return data;
	        	});
        }
        function verificarPermissao(idMod) {
            var modulos = DataserviseProvider.userLogado.modulos
            return UtilsFunctions.permissao(modulos,idMod);
        }
    }
})();