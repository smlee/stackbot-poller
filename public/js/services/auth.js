/**
 * Created by sangmin on 5/22/15.
 */
botApp.factory('AuthServices', function($http, Session){
    return {
        isAuthenticated: function(){
            return !!Session.userId
        },
        checkAuthentication: function() {
            $http.get('/session').then(function(res){
                Session.create(null,res.data.user,null);
                console.log(res);
                return res.data;
            })
        }
    }
});

botApp.service('Session', function(){
    this.create = function (sessionId, userId, userRole) {
        this.id = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destory = function () {
        this.id = null;
        this.userId = null;
        this.userRole = null;
    };
});
