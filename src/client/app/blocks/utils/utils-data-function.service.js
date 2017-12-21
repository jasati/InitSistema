(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .service('UtilsDataFunctionService', UtilsDataFunctionService);

    UtilsDataFunctionService.$inject = ['UtilsFunctions','config','FileUploader','$state','$mdDialog','$mdMedia','$mdPanel','$uibModal','$document','$filter','logger'];

    /* @ngInject */
    function UtilsDataFunctionService(UtilsFunctions,config,FileUploader,$state,$mdDialog,$mdMedia,$mdPanel,$uibModal,$document,$filter,logger) {
        this.dataFuncoes = dataFuncoes;

        function dataFuncoes(dataSetProvider) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var _flexcad = 60;
          vm.title = '';
          vm.flexCad = 0;
          vm.ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
          vm.verPermissao = UtilsFunctions.getPermissao;
          vm.dataSetProvider = dataSetProvider;
          vm.pathImg = config.urlImagem;
          vm.rows = [];//lista de objetos
          vm.row = null;//obejeto unico
          vm.rowsSelected = []; //lista de objetos selecionados
          vm.empresa = dataSetProvider.empresa;
          vm.camposFiltro = dataSetProvider.camposFiltro;
          vm.filtroDefault = dataSetProvider.filtroDefault;
          vm.filtroExterno = '';
          vm.uploader = {}; //tratamento de imagens,
          vm.filtros = {};
          vm.salvando = false;
          vm.reading = false;
          vm.orderBy = dataSetProvider.orderBy;
          vm.actionRow = '';
          vm.label = '';
          vm.pagination = {
            limit:15,
            pagina:1,
            total:0,
            limitOptions:[5,10,15],//quantidade de registro por pagina
            label:{
                page: 'Página:',
                rowsPerPage: 'Registros por página:',
                of: 'de'
            }
          }

          var setOptionLimitPagination = function (max) {
            var options = [5,10,15,20,50,100,200,300];
            if (max > 300) {
              options = [5, 10, 15,20,50,100,200,300, {
                label: 'Todos',
                value: function () {
                  return max;
                }
              }];
            }
            vm.pagination.limitOptions = options;
          }

          vm.table = {
            rowHeight: 50,
            headerHeight: 50,
            footerHeight: false,
            scrollbarV: false,
            selectable: false,
            columns: [],
          };

          vm.montarFiltro = function(campo,expr,valor) {
            if (expr==='LIKE') {
              var qry = " and "+campo+' '+expr+" '%"+valor+"%' ";
            } else if (expr==='LOGICO') {
              var qry = " and "+campo+' '+valor;
            } else {
              var qry = " and "+campo+expr+"'"+valor+"' ";
            }
            return qry;

          }
          //organiza os dados para ser enviado para api no post
          vm.getDataset = function (isQuery) {
      			var dts = dataSetProvider.provider.getPrmWebService();
      			dataSetProvider.provider.setValor(dts,'inner_join',dataSetProvider.inner_join);
      			dataSetProvider.provider.setValor(dts,'left_join',dataSetProvider.left_join);
      			dataSetProvider.provider.setValor(dts,'order by',dataSetProvider.orderBy);
      			dataSetProvider.provider.setValor(dts,'group by',dataSetProvider.groupBy);
      			dataSetProvider.provider.setValor(dts,'campos',dataSetProvider.campos);
      			dataSetProvider.provider.setValor(dts,'id_index_main',dataSetProvider.id_index_main);
      			dataSetProvider.provider.setValor(dts,'valor_id_main',dataSetProvider.valor_id_main);
      			if (isQuery) {
      				dataSetProvider.provider.setValor(dts,'modulo',dataSetProvider.moduloQuery);
      				dataSetProvider.provider.setValor(dts,'id_tabela',dataSetProvider.id_tabelaQuery);
      			} else {
      				dataSetProvider.provider.setValor(dts,'modulo',dataSetProvider.modulo);
      				dataSetProvider.provider.setValor(dts,'id_tabela',dataSetProvider.id_tabela);
      			}
      			return dts;
      		}

          //funçao que atualiza os valores do array rows que estao marcados o campos
          //active com c u d caso nao tenha esse campo presente nao será enviado nenhum registro
          vm.aplyUpdates = function (filterAfterPost) {
            vm.salvando = true;
            var nData = UtilsFunctions.copiarObjecto(vm.rows);
            var dts = vm.getDataset(false);
            dataSetProvider.provider.setValor(dts,'estrutura',nData);
            var post = {
              camposInvalidos : dataSetProvider.camposInvalidos,
              dataset         : dts,
            };
            return dataSetProvider.api.aplayUpdates(post).then(function (resp) {
              vm.salvando = false;
              if (isset(resp[0])||isset(resp[1])||isset(resp[2])) {
                if (filterAfterPost) {
                  vm.filtros.functionRead();
                }
                logger.success('Dados atualizados com sucesso!');
                return true;
              } else {
                logger.error('Descupe, ocorreu uma falha ao atualizar os dados.');
                return false;
              }
            });
          }

          var create = function (data) {
      			//metodo privado
      			vm.salvando = true;
      			var nData = UtilsFunctions.copiarObjecto(data);
      			var dts = vm.getDataset(false);
            //se tiver campos com data formatar a data para o servidor
            if (dataSetProvider.camposData.length > 0) {
              for (var i = 0; i < dataSetProvider.camposData.length; i++) {
                //pegar a data original, pq depois que passa por copiarObjecto() fica a data default
                if (isset(data[0][dataSetProvider.camposData[i]])) {
                  var dt = new Date(data[0][dataSetProvider.camposData[i]]);
                  nData[0][dataSetProvider.camposData[i]] = UtilsFunctions.formatData(dt);
                }
              }
            }
      			dataSetProvider.provider.setValor(dts,'estrutura',nData);
      			var post = {
      				camposInvalidos : dataSetProvider.camposInvalidos,
      				dataset         : dts,
      			};
      			return dataSetProvider.api.create(post).then(function (resp) {
      				vm.salvando = false;
              var dados = isset(resp[0])?resp[0]:resp;
      				if (dados.status == 'ok') {
                vm.row[dataSetProvider.id_tabela] = dados.last_insert;
                vm.rows.push(vm.row);//adiciona novo row em rows;
                vm.actionRow = 'update';
                vm.label = 'Alterar ';
                logger.success('Salvo com sucesso!');
      					return true;
      				} else {
                logger.error('Descupe, ocorreu uma falha ao salvar'+' Erro: '+dados.msg);
      					return false;
      				}
      			});
      		}

          vm.read = function (dados,limit) {
            vm.reading = true;
            var dts = vm.getDataset(true);
            var query = dados + vm.filtroExterno;
            if (isset(vm.filtros.fildsQuery)) {
              for (var i = 0; i < vm.filtros.fildsQuery.length; i++) {
                  vm.filtros.fildsQuery[i]
                  query += vm.montarFiltro(
                    vm.filtros.fildsQuery[i].campo,
                    vm.filtros.fildsQuery[i].express,
                    vm.filtros.fildsQuery[i].value
                  );
              }
            }

            dataSetProvider.provider.setValor(dts,'consulta',query);
            if (limit) {
              dataSetProvider.provider.setValor(dts,'limit',vm.getLimite());
            }
            if (isset(vm.orderBy)) {
              var desc = ''
              if (vm.orderBy.substring(0,1) == '-') {
                desc = ' desc';
              } 
              dataSetProvider.provider.setValor(dts,'order by',vm.orderBy+desc);
            }
            var post = {
              dataset:dts,
            };
            return dataSetProvider.api.read(post).then(function (resp) {
              if (isset(resp.status)) {
                if (resp.status == 'error') {
                  logger.error('Descupe, ocorreu na consulta dos registros.'+' Erro: '+resp.msg);
                } else {
                  logger.warning('Atenção! Código Não definido');
                }
              } else {
                vm.rows = resp.reg;
                vm.pagination.total = resp.qtde;
                setOptionLimitPagination(resp.qtde);
                vm.reading = false;
                return resp;
              }
            });
          }

          vm.load = function (query,limit) {
            vm.reading = true;
            var dts = vm.getDataset(true);
            dataSetProvider.provider.setValor(dts,'consulta',query);
            if (limit) {
              dataSetProvider.provider.setValor(dts,'limit',vm.getLimite());
            }
            var post = {
              dataset:dts,
            };
            return dataSetProvider.api.read(post).then(function (resp) {
              if (isset(resp.status)) {
                if (resp.status == 'error') {
                  logger.error('Descupe, ocorreu na consulta dos registros.'+' Erro: '+resp.msg);
                } else {
                  logger.warning('Atenção! Código Não definido');
                }
              } else {
                vm.reading = false;
                return resp;
              }
            });
          }

          var update = function (data) {
            //metodo privado
            vm.salvando = true;
            var nData = UtilsFunctions.copiarObjecto(data);
            var dts = vm.getDataset(false);
            //se tiver campos com data formatar a data para o servidor
            if (dataSetProvider.camposData.length > 0) {
              for (var i = 0; i < dataSetProvider.camposData.length; i++) {
                //pegar a data original, pq depois que passa por copiarObjecto() fica a data default
                if (isset(data[0][dataSetProvider.camposData[i]])) {
                  var dt = new Date(data[0][dataSetProvider.camposData[i]]);
                  nData[0][dataSetProvider.camposData[i]] = UtilsFunctions.formatData(dt);
                }
              }
            }
            dataSetProvider.provider.setValor(dts,'estrutura',nData);
            var post = {
              camposInvalidos : dataSetProvider.camposInvalidos,
              dataset         : dts,
            };
            return dataSetProvider.api.update(post).then(function (resp) {
              vm.salvando = false;
              if (resp.status == 'ok') {
                logger.success('Alterado com sucesso!');
                return true;
              } else {
                logger.error('Descupe, ocorreu uma falha na alteração.'+' Erro: '+resp.msg);
                return false;
              }
            });
          }

          vm.deletar = function (data) {
            //metodo privado
            var dts = vm.getDataset(false);
            dataSetProvider.provider.setValor(dts,'estrutura',data);
            var post = {
              dataset         : dts,
            };
            return dataSetProvider.api.deletar(post).then(function (resp) {
              if (resp.status == 'ok') {
                logger.success('Excluido com sucesso!');
                return true;
              } else {
                logger.error('Descupe, ocorreu uma falha na exclusão.'+' Erro: '+resp.msg);
                return false;
              }
            });
          }

          vm.enviarEmail = function (email) {
            return dataSetProvider.api.enviarEmail(email).then(function (resp) {
              return resp;
            });
          }

          var gerarPdf = function (prm) {
            return dataSetProvider.api.gerarPdf(prm).then(function (resp) {
              return resp;
            });
          }

          vm.functionSql = function () {
            var dts = vm.getDataset();
            dataSetProvider.provider.setValor(dts,'valor_id',vm.empresa.id_empresa);
            dataSetProvider.provider.setValor(dts,'json','text');
            var post = {
              dataset:dts,
            };
            return dataSetProvider.api.callFunction(post).then(function (result) {
              return result;
            });
          }

          vm.procedureSql = function (dados,limit) {
            vm.reading = true;
            var dts = vm.getDataset(true);
            var query = dados;
            if (isset(vm.filtros.fildsQuery)) {
              for (var i = 0; i < vm.filtros.fildsQuery.length; i++) {
                  vm.filtros.fildsQuery[i]
                  query += vm.montarFiltro(
                    vm.filtros.fildsQuery[i].campo,
                    vm.filtros.fildsQuery[i].express,
                    vm.filtros.fildsQuery[i].value
                  );
              }
            }
            dataSetProvider.provider.setValor(dts,'tab',dataSetProvider.tab);
            dataSetProvider.provider.setValor(dts,'consulta',dados);
            if (limit) {
              dataSetProvider.provider.setValor(dts,'limit',vm.getLimite());
            }
            var post = {
              dataset:dts,
            };
            return dataSetProvider.api.callProcedure(post).then(function (resp) {
              if (isset(resp.status)) {
                if (resp.status == 'error') {
                  logger.error('Descupe, ocorreu na consulta dos registros.'+' Erro: '+resp.msg);
                } else {
                  logger.warning('Atenção! Código Não definido');
                }
              } else {
                vm.rows = resp.reg;
                vm.pagination.total = resp.qtde;
                setOptionLimitPagination(resp.qtde);
                vm.reading = false;
                return resp;
              }
            });
          }


          //adiciona um registro a lista de registros
          vm.adicionar = function (data) {
            data.action = 'c';
            if (dataSetProvider.setForeignKey) {
              for (var i = 0; i < dataSetProvider.camposForeignKey.length; i++) {
                data[dataSetProvider.camposForeignKey[i]] = dataSetProvider.valueForeignKey[i];
              }
            }
            vm.rows.push(data);
          }

          vm.onChange = function (row) {
            if (!isset(row.action)) {
              row.action = 'u';
            }
          }

          //seta para ser excluido no aplyUpdates
          vm.remover = function (data) {
            if (data[dataSetProvider.id_tabela]) {
              data.action = 'd'
            } else {
              data.action = '-d'
            }
          }


          //inicia a criação de um novo registro
          vm.novo = function (data,state) {
            vm.row = data;
            vm.actionRow = 'create';
            vm.label = 'Cadastrando ';
            vm.row.action = 'c';
            if (dataSetProvider.setForeignKey) {
              for (var i = 0; i < dataSetProvider.camposForeignKey.length; i++) {
                vm.row[dataSetProvider.camposForeignKey[i]] = dataSetProvider.valueForeignKey[i];
              }
            }
            vm.setflexCad(_flexcad);
            if (isset(state)) {
              $state.go(state);
            }            
          }


          vm.alterar = function (data,state) {
            vm.actionRow = 'update';
            vm.label = 'Alterar ';
            //verifica se existe campo do tipo data configurado
            if (dataSetProvider.camposData.length > 0) {
              for (var i = 0; i < dataSetProvider.camposData.length; i++) {
                //converter para a data no formato 00-00-0000
                //para o tipo objeto, que usado no elemento tipo date
                var dt = new Date($filter('date')(data[dataSetProvider.camposData[i]],'MM/dd/yyyy'));
                data[dataSetProvider.camposData[i]] = dt;
              }
            }
            vm.row = data;
            vm.setflexCad(_flexcad);
            if (isset(state)) {
              $state.go(state);
            }
          }

          //função utilizada para salvar ou atualizar um registro
          //nao preciza esta marcado com o campo action
          vm.salvar = function () {
            if (!vm.row[dataSetProvider.id_tabela]) {
              return create([vm.row]).then(function (result) {
                return result;
              });
            } else {
              return update([vm.row]).then(function (result) {
                return result
              });
            }
          }

          vm.confirmDel = function(ev,descricao) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
              .title('exclusão do registro')
              .textContent('Confirma a exclusão do registro '+descricao+' ?')
              .ariaLabel('Excluir')
              .targetEvent(ev)
              .ok('Confirmar')
              .cancel('cancelar');

            return $mdDialog.show(confirm).then(function(result) {
              return true
            }, function () {
              return false
            });
          }          

          vm.select = function () {
            vm.actionRow = 'select';
            vm.label = 'Selecionar ';
          }

          vm.getLimite = function() {
            var inicio = (vm.pagination.pagina - 1) * vm.pagination.limit;
            return inicio +','+vm.pagination.limit;
          }

          vm.showState = function (prm) {
            if (isset(prm.child)) {
              if (prm.hide) {
                vm.hide = true;
              }
            } else {
              vm.hide = false;
            }
            $state.go(prm.state,prm.params);
          }
          vm.convDT = function (date) {
            var dt = new Date(date);
            return dt;          // body..
          }

          vm.mediaxs = function() {
            return $mdMedia('xs');
          }

          vm.setflexCad = function (value) {
            if (isset(vm.row)) {
              vm.flexCad = value;
            } else {
              vm.flexCad = 0;
            }
          }

          vm.setToolbar = function (prm) {
            vm.funcToolbar = {
              toolbarModelo : '1',//com botao novo
              mediaxs       : vm.mediaxs,
              btAddNovo     : prm.btAddNovo,
              btAddTootip   : prm.btAddTootip,
              title         : vm.title,
              filtros       : vm.filtros,
              report        : '',
            };
          }

          vm.setTable = function (prm) {
            vm.funcTable = {
              responsive:true,
              dados     :vm,
              colunas   :dataSetProvider.tableCols,
              id        :dataSetProvider.id_tabela,
              alterar   :prm.alterar,
              deleteAll :vm.deleteAll,
            }
          }
          vm.setPagination = function (f) {
            vm.funcPag = {
              dados     :vm,
              filtrar   :vm.filtros.functionRead,
            }
          }

          vm.showPainel = function (prm) {
            var painel = $mdPanel;
            var conf = {
              painel:painel,
              position:prm.position,
              event:prm.event,
              data:prm.data,
              templateUrl:prm.templateUrl,
              hasBackdrop:prm.hasBackdrop,
              escapeToClose:prm.escapeToClose,
              fullscreen:prm.fullscreen,
            };
            var show = UtilsFunctions.getPrmPanel(conf);
            painel.open(show);
          }

          vm.showModal = function (prm,parentSelector) {

            var parentElem = parentSelector?angular.element(parentSelector):angular.element('body');
            prm.modal = $uibModal.open({
              templateUrl: prm.templateUrl,
              controller: controller,
              ariaLabelledBy: prm.ariaLabelledBy,
              ariaDescribedBy: prm.ariaDescribedBy,
              controllerAs: '$ctrl',
              size: prm.size,
              appendTo: parentElem,
              backdrop:prm.backdrop,
              resolve: {
                Data: function () {
                  return prm.data;
                }
              }
            });
            controller.$inject = ['$uibModalInstance','Data'];
            function controller($uibModalInstance,Data) {
              var vm = this;
              vm.funcoes = Data;
              vm.ok = function(data) {
                $uibModalInstance.close(data);
              }
              vm.cancel = function (){
                $uibModalInstance.dismiss('cancel');
              }
            }
            return prm.modal.result.then(function (data) {
              return data;
            }, function () {
              return false;
            });
          }


          vm.report = {
            prefix:'Report',
            title:'',
            orientacaoPage:'R',//R Retrato L Landscap
            template:null,
            pdf:null,
            pdfName:'',
            createPdf:function () {
              //validações
              if (isset(this.template)) {
                var n = new Date();
                var usuario = dataSetProvider.provider.getSessaoUsuario();
                var data = {
                  prm:'C',
                  html:this.template,
                  nomePrefix:this.prefix+usuario.id_usuario+'_',
                  numero:n.getTime(),
                  page:this.orientacaoPage//R retrato L Landscape
                };
                return gerarPdf(data).then(function (result) {
                  vm.report.pdfName = result.report_name;
                  vm.report.pdf = config.report+result.report_name;
                  return true;
                });
              } else {
                logger.warning('O template do relatório não está definido!');
              }

            },
            deletePdf:function () {
              var usuario = dataSetProvider.provider.getSessaoUsuario();
              var data = {
                prm:'D',
                nomePrefix:this.prefix+usuario.id_usuario+'_',
              };
              gerarPdf(data);
            },
          }

          //tratamento de upload de imagens
          var upload = function(idEmp,tipo) {
            var Uploader = new FileUploader({
                url:config.urlWebService+'upload/'+idEmp+',true,'+config.dbase+','+tipo,
                autoUpload:true,
                removeAfterUpload:true,
                withCredentials:false,
            });
            return Uploader;
          }
          vm.uploader = upload(dataSetProvider.valor_id_main,0);
          vm.uploader.filters.push({
            name: 'imageFilter',
            fn: function(i /*{File|FileLikeObject}*/, options) {
                var type = '|' + i.type.slice(i.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
          });
          vm.uploader.onSuccessItem = function(item, response, status, headers) {
              if (response.status === 'ok') {
                  vm.row.id_galeria = response.last_insert;
                  vm.row[dataSetProvider.campoImagem] = response.imagem;
              } else {
                  logger.error(response.msg);
              }
          };

        }
    }
})();
