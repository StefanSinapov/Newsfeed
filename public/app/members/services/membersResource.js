app.factory("MembersResource", function($resource) {
    return $resource("/api/members/:name", { name: "@name" });
});