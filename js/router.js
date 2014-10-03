function Router() {
  this.routes = []

  window.location.onhashchange = function() {
    var hash = window.location.hash

    var route = hash.split("/")

    this.routes.forEach(function(route) {
      if (route.route[0] === route[0]) {
        route.cb(route.route)
      }
    })
  }
}

Router.prototype = {
  route: function(str, cb) {
    var route = str.split("/")
    this.routes.push({route: route, cb: cb})
  }

}
