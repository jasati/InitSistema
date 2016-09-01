(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }
    var prmAmbiente = 0;//0 local 1 producao
    var ambiente = {
        local:{
            api:"http://mucontratos.alan.dev/v1/",
            db:"locdress",
            img:"http://mucontratos.alan.dev/App/Upload/",
            report:"http://mucontratos.alan.dev/App/Tmp/"
        },
        producao:{
            api:"http://mucompras.jasati.com.br/service/v1/",
            db:"jasatico_muc_db",
            img:"http://mucompras.jasati.com.br/service/App/Upload/",
            report:"http://mucompras.jasati.com.br/service/App/Tmp/"
        }
    };
    var config = {
        versao:'0.0.1',
        appErrorPrefix: '[Ops! Dados Não Processados] ',
        appTitle: 'Base Sistema',
        appSubtitle : 'Base inicial de projetos',
        urlWebService:prmAmbiente===0?ambiente.local.api:ambiente.producao.api,
        urlImagem    :prmAmbiente===0?ambiente.local.img:ambiente.producao.img,
        dbase        :prmAmbiente===0?ambiente.local.db:ambiente.producao.db,
        report       :prmAmbiente===0?ambiente.local.report:ambiente.producao.report,
        // true ou false para habilitar o modulo de permissao, caso esteja false
        // o sistema ira libera os modulos sem verificar
        modPerm : false 
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider', '$httpProvider'];
    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider, $httpProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});
        //permitir chamada de dominio cruzado CORS
        $httpProvider.defaults.useXDomain = true;        
    }

})();
