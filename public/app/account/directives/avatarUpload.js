app.directive("avatarUpload", function(identity, Globals) {
    return {
        restrict: "A",
        templateUrl: "/partials/account/avatarUpload",
        link: function(scope, element, attrs) {
            var $img = element.find("img");

            scope.avatarUrl = Globals.avatarImgPrefix + identity.currentUser.avatarUrl;

            element.find("input[type='file']").change(function() {
                var reader,
                    fileComponents = $(this).val().split("."),
                    fileExtension = fileComponents[fileComponents.length - 1].toLowerCase();

                if (fileExtension !== "png" && fileExtension !== "jpg") {
                    return;
                }

                if (this.files && this.files[0]) {
                    reader = new FileReader();

                    reader.onload = function(e) {
                        $img.attr("src", e.target.result);
                    };

                    reader.readAsDataURL(this.files[0]);
                }
            });
        },
        replace: true
    };
});