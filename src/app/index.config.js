angular.module('b').config(config);

function config($logProvider, toastrConfig, $resourceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    $resourceProvider.defaults.stripTrailingSlashes = false;

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.preventDuplicates = false;
    toastrConfig.progressBar = true;
}
