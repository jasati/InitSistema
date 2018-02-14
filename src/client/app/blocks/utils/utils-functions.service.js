(function() {
    'use strict';
    angular
        .module('blocks.utils')
        .factory('UtilsFunctions', UtilsFunctions);
    UtilsFunctions.$inject = ['$filter','$uibModal', 'Extencio','Provider'];
    /* @ngInject */
    function UtilsFunctions($filter,$uibModal, Extencio,Provider) {
        var service = {
            formatData       : formatData,
            formatDataView   : formatDataView,
            removeCamposInvalidos:removeCamposInvalidos,
            soma             : soma,
            permissao        : permissao,
            copiarObjecto    : copiarObjecto,
            porExtencio      : porExtencio,
            validaCPF        : validaCPF,
            existe           : existe,
            zoomImg          : zoomImg,
            isset            : isset,
            convDate         : convDate,
            getPrmPanel      : getPrmPanel,
            validarDataset   : validarDataset,
            isNumber         : isNumber,
            getPermissao     : getPermissao,
            stylePrintTable  : stylePrintTable,
            montarTabela     : montarTabela,
            escreverArquivo  : escreverArquivo,
            handleEnter      : handleEnter,
        };
        return service;
        ////////////////
        

        /*
        Essa função so funciona no IE, é preciso habilitar as permissoes ActiveX no navegador
         */
        function escreverArquivo(txt) {
          var dados = new ActiveXObject("Scripting.FileSystemObject");
          //pasta a ser salvo o arquivo
          var pasta="C:/jasatiTXTjs/";
          //se o parametro arq que é o nome do arquivo vier vazio ele salvará o arquivo com o nome “Sem Titulo”
          if(txt==""){txt="Sem Titulo";}
          //carrega o txt
          var esc = dados.CreateTextFile(pasta+"saida.txt", true);
          //escreve o que foi passado no parametro texto que é o texto contido no TextArea
          esc.WriteLine(txt);
          //fecha o txt
          esc.Close();
        }
        //Função para abrir o arquivo
        function abreArquivo(arq){
          var dados = new ActiveXObject("Scripting.FileSystemObject");
          //o parametro arq é o endereço do txt
          //carrega o txt
          var arquivo = dados.OpenTextFile(arq, 1, true);
          //varre o arquivo
          while(!arquivo.AtEndOfStream){
          //escreve o txt no TextArea
            document.getElementById("texto").value = arquivo.ReadAll();
          }
          //fecha o txt
          arquivo.Close();
        }        
        function formatData (data, hora) {
            var d, m, y, H, M, S, dt, hr;
            if (hora) {
                hr = hora;
            }
            d = data.getDate();
            m = data.getMonth()+1; //janeiro = 0
            y = data.getFullYear();
            H = data.getHours();
            M = data.getMinutes();
            S = data.getSeconds();
            if (isset(hr)) {
                dt = y+'-'+m+'-'+d+' '+hr;
            } else {
                dt = y+'-'+m+'-'+d+' '+H+':'+M+':'+S;
            }
            return dt;
        }

        function formatDataView (data, hora) {
            var d, m, y,hr='', dt;
            if (hora) {
                hr = hora;
            }
            d = data.getDate();
            m = data.getMonth()+1; //janeiro = 0
            y = data.getFullYear();
            if (hr !== '') {
                dt = m+'/'+d+'/'+y+' '+hr;
            } else {
                dt = m+'/'+d+'/'+y;
            }
            return dt;
        }

        function isNumber(val){
          return typeof val === "number"
        }

        function removeCamposInvalidos (dados,camposInv) {
          for (var i = 0; i < camposInv.length; i++) {
            delete dados[camposInv[i]];
          }
          return dados;
        }

        function soma(array,rowQt,rowValue,filtro) {
            var total = 0;
            var data = [];
            if (isset(filtro)) {
              data = $filter('filter')(array,filtro);
            } else {
              data = array;
            }
            
            angular.forEach(data, function(row, key){
                if (rowQt!=='') {
                    var valor = row[rowQt]*row[rowValue];
                    total = total + valor;
                } else {
                    total = total + row[rowValue];
                }
            });
            return total.toFixed(2);
        }

        function permissao(arrayModUser,idModSis) {
            //$filter('filter')(arrayModUser,{id_modulo:idModSis});
            var p = [];
            for (var i = 0; i < arrayModUser.length; i++) {
                if (arrayModUser[i].id_modulo===idModSis) {
                    p.push(arrayModUser[i]);
                    break;
                }
            }
            if (p.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        function copiarObjecto(obj) {
            if (obj === null || typeof obj !== 'object' || obj === undefined) {
                return obj;
            }
            var temp = obj.constructor();
            for (var key in obj) {
              if (key != 'child') {
                temp[key] = copiarObjecto(obj[key]);
              }
            }
            return temp;
        }

        function porExtencio(valor) {
            return Extencio.porExtencio(valor);
        }

      function validaCPF(str) {
        if (str) {
          str = str.replace('.', '');
          str = str.replace('.', '');
          str = str.replace('-', '');

          var cpf = str;
          var numeros, digitos, soma, i, resultado, digitos_iguais;
          digitos_iguais = 1;
          if (cpf.length < 11)
            return false;
          for (i = 0; i < cpf.length - 1; i++)
            if (cpf.charAt(i) != cpf.charAt(i + 1)) {
              digitos_iguais = 0;
              break;
            }
          if (!digitos_iguais) {
            numeros = cpf.substring(0, 9);
            digitos = cpf.substring(9);
            soma = 0;
            for (i = 10; i > 1; i--)
              soma += numeros.charAt(10 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
              return false;
            numeros = cpf.substring(0, 10);
            soma = 0;
            for (i = 11; i > 1; i--)
              soma += numeros.charAt(11 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
              return false;
            return true;
          }
          else
            return false;
        }
      }
        function existe(index,array) {
            /*verifica se um determinado valor existe em um array*/
          var x = false;
          for (var i = 0; i < array.length; i++) {
            if (array[i] == index) {
              return true;
            }
          }
          return x;
        }

        function zoomImg(i) {
            var data = {
              img:i,
            };
            var modalZoom = $uibModal.open({
              templateUrl: 'app/blocks/utils/templates/zoom-img.html',
              controller: controllModalZoom,
              controllerAs: 'vm',
              size: '',
              resolve: {
                Data: function () {
                  return data;
                }
              }
            });

            controllModalZoom.$inject = ['$uibModalInstance','Data','config'];
            function controllModalZoom($uibModalInstance,Data,config) {
                var vm = this;
                vm.img = Data.img;
                vm.pathImg = config.urlImagem;

                vm.ok = ok;
                vm.cancel = cancel;

                function ok(data) {
                    $uibModalInstance.close(data);
                }
                function cancel(){
                    $uibModalInstance.dismiss('cancel');
                }
            }
        }

        function isset(arg) {
            if (arg === undefined) {
                return false;
            } else if (arg === null) {
                return false;
            } else if (arg === '') {
                return false;
            } else {
                return true;
            }
        }

        function convDate (date) {
          var dt = new Date(date);
          return dt;
        }

        function getPrmPanel(prm,mdPanelRef) {
            var position;
            switch (prm.position){
                case 'center' :
                    position = prm.painel.newPanelPosition()
                      .absolute()
                      .center();
                    break;
                case 'event' :
                    position = prm.painel.newPanelPosition()
                        .relativeTo('#'+prm.event.currentTarget.id)
                        .addPanelPosition(
                            prm.painel.xPosition.ALIGN_START,
                            prm.painel.yPosition.BELOW
                        );
                    break;
            };

            var config = {
                    attachTo: angular.element(document.body),
                    controller: ctrlPanel,
                    controllerAs: 'vm',
                    disableParentScroll:true,
                    templateUrl: prm.templateUrl,
                    hasBackdrop: prm.hasBackdrop,
                    position: position,
                    trapFocus: true,
                    //zIndex: 150,
                    clickOutsideToClose: false,
                    escapeToClose: prm.escapeToClose,
                    focusOnOpen: true,
                    fullscreen:prm.fullscreen,
                    locals: {
                      Data: prm.data
                    }
            };

            ctrlPanel.$inject= ['Data','mdPanelRef'];
            function ctrlPanel(Data,mdPanelRef) {
              var vm = this;
                vm.funcoes = Data;
                vm.close = function () {
                  mdPanelRef.close();
                }
                vm.ok = function () {
                  vm.funcoes.filtrar();
                  mdPanelRef.close();
                }
            }
            return config;

        }

        function validarDataset(dataset) {
          if (!isset(dataset.left_join[0])) {
            delete dataset['left_join'];
          }
          if (!isset(dataset.inner_join[0])) {
            delete dataset['inner_join'];
          }
        }

        function getPermissao(modulo) {
          var modulos = Provider.getPermissoes();
          var perm = $filter('filter')(modulos,{'id_modulo':modulo},true);
          if (perm.length > 0) {
            return true;
          } else {
            return false;
          }
        }

        function stylePrintTable() {
          var style = 'p{padding:0px;margin:0px}'+
          '.table {width: 100%;max-width: 100%;margin-bottom: 20px; font-size:90%}'+
          'th {text-align: left;}'+
          '.table > thead > tr > th,'+
          '.table > tbody > tr > th,'+
          '.table > tfoot > tr > th,'+
          '.table > thead > tr > td,'+
          '.table > tbody > tr > td,'+
          '.table > tfoot > tr > td {'+
          'padding: 8px;line-height: 1.2;vertical-align: top;border-top: 1px solid #dddddd;}'+
          '.table > thead > tr > th {'+
          'vertical-align: bottom;border-bottom: 1px solid #dddddd;}'+
          '.table > caption + thead > tr:first-child > th,'+
          '.table > colgroup + thead > tr:first-child > th,'+
          '.table > thead:first-child > tr:first-child > th,'+
          '.table > caption + thead > tr:first-child > td,'+
          '.table > colgroup + thead > tr:first-child > td,'+
          '.table > thead:first-child > tr:first-child > td {border-top: 0;}'+
          '.table > tbody + tbody {border-top: 2px solid #dddddd;}'+
          '.table > tbody + tfoot {border-top: 2px solid #dddddd;}'+
          '.table-condensed > thead > tr > th,'+
          '.table-condensed > tbody > tr > th,'+
          '.table-condensed > tfoot > tr > th,'+
          '.table-condensed > thead > tr > td,'+
          '.table-condensed > tbody > tr > td,'+
          '.table-condensed > tfoot > tr > td {padding: 2px;}'+
          'table col[class*="col-"] {'+
          'position: static;float: none;display: table-column;}'+
          'table td[class*="col-"],'+
          'table th[class*="col-"] {'+
          'position: static;float: none;display: table-cell;}'+
          '.table-responsive {overflow-x: auto;min-height: 0.01%;}'+
          '.table-striped > tbody > tr:nth-of-type(odd) {background-color: #f9f9f9;}'+
          '.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {float: left;}'+
          '.col-xs-12 {width: 100%;}.col-xs-11 {width: 91.66666667%;}.col-xs-10 {width: 83.33333333%;}'+
          '.col-xs-9 {width: 75%;}.col-xs-8 {width: 66.66666667%;}.col-xs-7 {width: 58.33333333%;}.col-xs-6 {width: 50%;}'+
          '.col-xs-5 {width: 41.66666667%;}.col-xs-4 {width: 33.33333333%;}.col-xs-3 {width: 25%;}.col-xs-2 {width: 16.66666667%;}'+
          '.col-xs-1 {width: 8.33333333%;}'+
          '.text-left {text-align: left;}.text-right {text-align: right;}.text-center {text-align: center;}.text-justify {text-align: justify;}.text-nowrap {white-space: nowrap;}'+
          '.text-lowercase {  text-transform: lowercase;}.text-uppercase {text-transform: uppercase;}.text-capitalize {text-transform: capitalize;}'+
          '.striped:nth-child(even){background-color: #e6e6db;}';
          return style;
        }
        /*
          montarTabela:criar uma tabela html e retornar com os dados
          @dados: array de objetos com os dados
          @tipo:dinamico ou estatico, caso seja dinamico, as colunas será criadas
          atraves dos campo dos dados, caso seja estatico pegara os campos da var @col
          @col:array com os dados da coluna da tabela
          @repeat:objeto contendo as propriedades: id que é a descricao do campo id, rows que é a string com o nome da variavel que contem os dados do ng-repeat
         */
        function montarTabela(cols,repeat) {
          var table = '<table md-table class="table table-condensed table-striped">';
          table+='<thead md-head md-order="myOrder">';
          table+='<tr md-row>';
          //montar coluna
          var th='';
          //motar colunas dinamicamente, obtendo os dados da primeira posição do array
          for (var prop in cols) {
            if (cols.hasOwnProperty(prop)){
              if (prop!='$$hashKey') {
                th+='<th md-column md-order-by="'+prop+'">'+prop+'</th>'
              }
            }
          }
          //adicionar os valores da coluna
          table+=th;
          table+='</tr></thead>';
          table+='<tbody md-body>';
          table+='<tr md-row md-select="row" md-select-id="'+repeat.id+'" ng-repeat="row in '+repeat.rows+' | orderBy: myOrder">';
          //montar as linhas
          var td ='';
          for (var prop in cols) {
            if (cols.hasOwnProperty(prop)){
              if (prop!='$$hashKey') {
                td+='<td md-cell>{{row.'+prop+'}}</td>';
              }
            }
          }
          table+=td;
          table+='</tr></tbody></table>';
          return table;
        }

        function handleEnter ($event,el,select) {
          var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
          if (keyCode == 13) {
            document.getElementById(el).focus();
            if (select) {
              document.getElementById(el).select();
            }
          }
        }

    }
})();
