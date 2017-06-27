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
    var prmAmbiente = 0;//0:local 1:teste 2:producao
    var ambiente = {
        0:{//local
            api:"http://mucontratos.alan.dev/v1/",
            db:"base_inicial",
            img:"http://mucontratos.alan.dev/App/Upload/",
            report:"http://mucontratos.alan.dev/App/Tmp/",
            urlSistema:"http://localhost:3000/",
        },
        1:{//teste
            api:"",
            db:"",
            img:"",
            report:"",
            urlSistema:"",
        },
        2:{//producao
            api:"",
            db:"",
            img:"",
            report:"",
            urlSistema:"",
        }        
    };
    var config = {
        versao        :'0.0.0',
        appErrorPrefix: '[Ops! Dados Não Processados] ',
        appTitle      : 'Sistema Boot',
        appSubtitle   : 'Sistema de boot para um novo sistema',
        urlWebService :ambiente[prmAmbiente].api,
        urlImagem     :ambiente[prmAmbiente].img,
        dbase         :ambiente[prmAmbiente].db,
        report        :ambiente[prmAmbiente].report,
        urlSistema    :ambiente[prmAmbiente].urlSistema,
        getResponseKey:'e2f46f53a4c7c590c472f65c0f3504b1',

        // true ou false para habilitar o modulo de permissao, caso esteja false
        // o sistema ira libera os modulos sem verificar
        modPerm : true, 
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider', '$httpProvider','$mdIconProvider','$mdThemingProvider','$mdDateLocaleProvider'];
    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider, $httpProvider,$mdIconProvider,$mdThemingProvider,$mdDateLocaleProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});
        //permitir chamada de dominio cruzado CORS
        $httpProvider.defaults.useXDomain = true;

        $mdThemingProvider.theme('default')
            .primaryPalette('grey',{
                'default':'700'
            })
            .accentPalette('blue')
            .warnPalette('orange',{
                'default':'400'
            })
            .backgroundPalette('grey',{
                'default':'200'
            });

        //configurar formato da data
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };
    }

})();
