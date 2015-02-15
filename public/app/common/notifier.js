'use strict';

app.factory('notifier', function(toastr) {
    return {
        success: function(msg) {
            toastr.success(msg);
        },
        error: function(msg) {
            toastr.error(msg);
        },
        warning: function(msg){
            toastr.warning(msg);
        }
    };
});
