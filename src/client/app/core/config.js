(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-top-center';
    }
    var index = 2;/*indice abaixo do sistema que esta sendo executado */
    var sistemas = [
      {nome:"psicanalise",ambiente:1,/*0 = Local; 1 = producao*/api:["http://mucontratos.alan.dev/v1/","http://swishi.psicorpo.com.br/api/v1/"]},
      {nome:"ecc",ambiente:0,/*0 = Local; 1 = producao*/api:["http://localhost/v1/","https://ws.ecc.pibdecoite.com.br/v1/"]},
      {nome:"automacao",ambiente:1,/*0 = Local; 1 = producao*/api:["http://localhost/v1/","http://35.198.44.190/api/v1/"]}
    ];

    /*
    esses parametros serão preenchidos no start do sistema, de acordor
    com o aquivo sistemas.json na pasta sistema
    */
    var config = {
        index         : index,
        sistema       : sistemas[index],
        urlWebService : sistemas[index].api[sistemas[index].ambiente],
        appErrorPrefix: '[Ops! Dados Não Processados] ',
        corLayoute    : "",
        versao        : "",
        appTitle      : '',
        appSubtitle   : '',
        urlImagem     : '',
        dbase         : '',
        report        : '',
        urlSistema    : '',
        vLayoute      : '1',

        // true ou false para habilitar o modulo de permissao, caso esteja false
        // o sistema ira libera os modulos sem verificar
        modPerm : '',
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
            .primaryPalette('blue',{
                'default':'800'
            })
            .accentPalette('indigo',{
                'default':'500'
            })
            .warnPalette('orange',{
                'default':'400'
            })
            .backgroundPalette('grey',{
                'default':'A100'
            });
        $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
        $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
        $mdThemingProvider.theme('dark-teal').backgroundPalette('teal').dark();
        $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
        //configurar formato da data
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };


    }

})();
