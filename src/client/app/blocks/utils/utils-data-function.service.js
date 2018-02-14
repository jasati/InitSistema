(function() {
    'use strict';

    angular
        .module('blocks.utils')
        .service('UtilsDataFunctionService', UtilsDataFunctionService);

    UtilsDataFunctionService.$inject = ['UtilsFunctions','config','FileUploader','$state','$mdDialog','$mdMedia','$mdPanel','$uibModal','$document','$filter','logger','$rootScope'];

    /* @ngInject */
    function UtilsDataFunctionService(UtilsFunctions,config,FileUploader,$state,$mdDialog,$mdMedia,$mdPanel,$uibModal,$document,$filter,logger,$rootScope) {
        this.dataFuncoes = dataFuncoes;

        function dataFuncoes(dataSetProvider) {
          var vm = this;
          var isset = UtilsFunctions.isset;
          var _flexcad = 60;
          vm.flexCad = 0;
          vm.ufs = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
          vm.verPermissao = UtilsFunctions.getPermissao;
          vm.dataSetProvider = dataSetProvider;
          vm.pathImg = config.urlImagem;
          vm.rows = [];//lista de registros
          vm.row = null;//obejeto unico
          vm.rowParent = null;//objeto que chamou a instancia
          vm.rowsSelected = []; //lista de registros selecionados
          vm.rowIndex = -1;//indice do registro atual
          vm.rowIndexTop = 0;//indice do registro top do virtual repeat
          vm.empresa = dataSetProvider.empresa;
          vm.userLogado = dataSetProvider.user;
          vm.filtroData = dataSetProvider.filtroData;
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

          /*
          função ideal para aninhar objetos pai e filhos, de acordo com o relacionamento
           */
          vm.setNewChilder = function (classChild,rowParent,activate) {
            if (!rowParent.child) {//se nao existir a instancia child, cria uma nova
              var parent = rowParent;
              rowParent.child = new classChild.funcoes();
              rowParent.child.data.rowParent = parent;
              if (activate) {
                rowParent.child.activate();
              }
            }

          }

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

            //se tiver campos com data formatar a data para o servidor
            if (dataSetProvider.camposData.length > 0) {
              for (var i = 0; i < dataSetProvider.camposData.length; i++) {
                //pegar a data original, pq depois que passa por copiarObjecto() fica a data default
                for (var x = 0;  x < vm.rows.length;  x++) {
                  if (isset(vm.rows[x][dataSetProvider.camposData[i]])) {
                    var dt = new Date(vm.rows[x][dataSetProvider.camposData[i]]);
                    nData[x][dataSetProvider.camposData[i]] = UtilsFunctions.formatData(dt);
                  }
                }

              }
            }

            dataSetProvider.provider.setValor(dts,'estrutura',nData);
            var post = {
              camposInvalidos : dataSetProvider.camposInvalidos,
              dataset         : dts,
            };
            return dataSetProvider.api.aplayUpdates(post).then(function (resp) {
              vm.salvando = false;
              var res = true;
                if (resp[0]!=0) {
                  if (resp[0].status == 'ok') {
                    logger.success('Os dados de '+vm.title+' foram inseridos com sucesso!');
                  } else {
                    logger.error('Os dados de '+vm.title+' não foram inseridos, Erro : '+resp[0].msg);
                    res = false;
                  }
                }

                if (resp[1]!=0) {
                  if (resp[1].status == 'ok') {
                    logger.success('Os dados de '+vm.title+' foram atualizados com sucesso!');
                  } else {
                    logger.error('Os dados de '+vm.title+' não foram atualizados, Erro : '+resp[1].msg);
                    res = false;
                  }
                }

                if (resp[2]!=0) {
                  if (resp[2].status == 'ok') {
                    logger.success('Os dados de '+vm.title+' foram excluidos com sucesso!');
                  } else {
                    logger.error('Os dados de '+vm.title+' não foram excluidos, Erro : '+resp[2].msg);
                    res = false;
                  }
                }

                if (filterAfterPost&&res) {
                  if (isset(vm.filtros.functionRead)) {
                    vm.filtros.functionRead();
                  }
                }
                return res;
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
                //remove o campo action
                delete vm.row['action'];
                logger.success('Salvo com sucesso!');
      					return true;
      				} else {
                logger.error('Descupe, ocorreu uma falha ao salvar o '+vm.title+'.'+' Erro: '+dados.msg);
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
            //filtro por data
            if (isset(dataSetProvider.campoDataQry)) {
              if (isset(vm.filtros.filtroData.dtIni)) {
                query += " and "+dataSetProvider.campoDataQry+" BETWEEN '"+UtilsFunctions.formatData(vm.filtros.filtroData.dtIni,'00:00')
                +"' and '"+UtilsFunctions.formatData(vm.filtros.filtroData.dtFim,'23:59')+"'";
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
              vm.reading = false;
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
                return resp;
              }
            });
          }

          vm.load = function (query,limit) {
            vm.reading = true;
            var dts = vm.getDataset(true);
            dataSetProvider.provider.setValor(dts,'consulta',query);
            if (limit==true) {
              dataSetProvider.provider.setValor(dts,'limit',vm.getLimite());
            }
            if (limit=="FIRST") {
              dataSetProvider.provider.setValor(dts,'order by',dataSetProvider.id_tabela);
              dataSetProvider.provider.setValor(dts,'limit','1');
            }
            if (limit=="LAST") {
              dataSetProvider.provider.setValor(dts,'order by',dataSetProvider.id_tabela+' DESC');
              dataSetProvider.provider.setValor(dts,'limit','1');
            }
            var post = {
              dataset:dts,
            };
            return dataSetProvider.api.read(post).then(function (resp) {
              vm.reading = false;
              if (isset(resp.status)) {
                if (resp.status == 'error') {
                  logger.error('Descupe, ocorreu na consulta dos registros.'+' Erro: '+resp.msg);
                } else {
                  logger.warning('Atenção! Código Não definido');
                }
              } else {
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
                //remove o campo action
                delete vm.row['action'];
                logger.success('Alterado com sucesso!');
                return true;
              } else {
                logger.error('Descupe, ocorreu uma falha na alteração do '+vm.title+'.'+' Erro: '+resp.msg);
                return false;
              }
            });
          }

          vm.deleteAll = function (ev) {
            for (var i = 0; i < vm.rowsSelected.length; i++) {
              vm.remover(vm.rowsSelected[i]);
            }
            vm.confirmDel(ev,'Todos os registros selecionados').then(function (result) {
              if (result) {
                vm.aplyUpdates(/*atualizar apos a alterao*/true).then(function (result) {
                  if (result) {
                    vm.rowsSelected = [];
                  }
                });
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
                logger.error('Descupe, ocorreu uma falha na exclusão do '+vm.title+'.'+' Erro: '+resp.msg);
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

          vm.functionSql = function (prm) {
            if (isset(prm)) {
              var dts = vm.getDataset();
              vm.reading = true;
              dataSetProvider.provider.setValor(dts,'valor_id',prm);
              dataSetProvider.provider.setValor(dts,'json','text');
              var post = {
                dataset:dts,
              };
              return dataSetProvider.api.callFunction(post).then(function (result) {
                vm.reading = false;
                return result;
              });
            } else {
              logger.warning('O parametro para a chamada da functionSql, não foi definido.');
            }
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
              vm.reading = false;
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
                return resp;
              }
            });
          }

          vm.setForengKey = function (id,pos) {
            dataSetProvider.valueForeignKey.splice(pos,1,id);//coloca o id na posição 0 quantidade de itens no array 1
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

          vm.removerIndex = function (index) {
            var rem = function (i) {
              vm.rows.splice(i,1);
            }
            if (isset(index)) {
              rem(index)
            } else if (vm.rowIndex>=0) {
                rem(vm.rowIndex);
            } else {
              logger.warning('O indice deve ser definido para remover o item pelo index.');
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
                var dt = new Date($filter('date')(data[dataSetProvider.camposData[i]],'MM/dd/yyyy HH:mm:ss'));
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

          vm.showMenssage = function(ev,msg) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
              .title('Menssagem')
              .textContent(msg)
              .ariaLabel('Menssagem')
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

          vm.setTitle = function (title) {
            vm.title = title;
            config.docTitle = vm.title;
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

          vm.setIndex = function () {
            vm.row = vm.rows[vm.rowIndex];
          }
          vm.nextRow = function () {
            vm.rowIndex++;
            if (isset(vm.rows[vm.rowIndex])) {
              vm.row = vm.rows[vm.rowIndex];
            } else {
              vm.pagination.limit += vm.pagination.limit;
              vm.filtros.functionRead().then(function () {
                if (isset(vm.rows[vm.rowIndex])) {
                  vm.row = vm.rows[vm.rowIndex];
                }
              });
            }
          }

          vm.acionarMainFiltro = function () {
            var showFilter = function () {
              if (isset(vm.filtros)) {
                vm.filtros.onClick();
              }
            }
            setTimeout(showFilter,1000);

          }

          vm.loadVirtualRepeat = {
            // Required.
            getItemAtIndex: function(index) {
              if (index >= vm.rows.length) {
                if (vm.rows.length < vm.pagination.total && !vm.reading) {
                  vm.pagination.limit += 15;
                  vm.filtros.functionRead().then(function (result) {
                    return vm.rows[index];
                  });
                } else {
                  return null;
                }
              } else {
                return vm.rows[index];
              }
            },
            getLength: function() {
              return vm.rows.length;
            },
          };

          vm.moverRowIndexTop = function () {
            if (vm.rowIndex>=-1) {
              if (vm.rowIndex>vm.rowIndexTop) {
                var r = vm.rowIndex - vm.rowIndexTop;
                if (r>5) {
                  vm.rowIndexTop++;
                }
              } 
              if (vm.rowIndex<vm.rowIndexTop || vm.rowIndex==0) {
                  vm.rowIndexTop = vm.rowIndex;
              }
              vm.setIndex();
            }
          }

          vm.keyDownPress = function ($event,i) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode==40||keyCode==38) {
              vm.changeRowIndexkey(keyCode);
              return false;
            } else if (keyCode==13) {
              return vm.rowIndexEnter(i);
            }

          }

          vm.changeRowIndexkey = function (key) {
            if (key==40) {
              if (vm.rowIndex<(vm.rows.length-1)) {
                vm.rowIndex++
              } else {
                vm.rowIndex = vm.rows.length -1;
              }
            } else {
              if (vm.rowIndex>0) {
                vm.rowIndex--
              }
            }
            vm.moverRowIndexTop();
          }

          vm.rowIndexClick = function (index) {
            vm.rowIndex = index;
            vm.setIndex();
            vm.acionarMainFiltro();
            return true;
          }

          vm.rowIndexEnter = function () {
            if (isset(vm.row)) {
              return true;
            } else {
              return false;
            }
          }

          vm.resetRowIndex = function () {
            vm.rowIndex = -1;
            vm.rowIndexTop = 0;
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
              keyboard:isset(prm.keyboard)?prm.keyboard:true,
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
