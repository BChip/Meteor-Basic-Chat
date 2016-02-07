Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {
    Template.body.helpers({
        resolutions: function() {
            if(Session.get('hideFinished')){
                return Resolutions.find({checked: {$ne: true}});
            } 
            else{
               return Resolutions.find(); 
            }
        },
        hideFinished : function(){
            return Session.get('hideFinished');
        }
    });
    
    Template.body.events({
        
        'submit .new-resolution': function(event){
            var title = event.target.title.value;
            //var user = Meteor.users.find({}, {fields: {_id: 1}}).fetch()
            if(title != ""){
                Meteor.call("addResolution", title)
                event.target.title.value = "";
                return false;
            }
        },
        
        'change .hide-finished': function(event){
            Session.set('hideFinished', event.target.checked);    
        },
        
        'click .superDelete': function(){
            Meteor.call('clearUsers');
        }
        
        
        
    });
    
    Template.resolution.events({
       'click .toggle-checked': function(){
           Meteor.call("updateResolution", this._id, !this.checked);
       },
       'click .delete': function(){
           Meteor.call('deleteResolution', this._id);
       },
        'click .deleteChecked': function(){
            Resolutions.remove(this.event.target.checked);
        }
       
    });
    
    Accounts.ui.config({
       passwordSignupFields: "USERNAME_ONLY" 
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
    
  Meteor.methods({
    clearUsers: function() {
      Resolutions.remove({});
    },
    getId: function(){
        Meteor.userId();
    }
  });
}

Meteor.methods({
   addResolution: function(title, user){
       Resolutions.insert({
        title : title,
        user : Meteor.user().username,
        createdAt: new Date()  
       });
   },
   deleteResolution: function(id){
       Resolutions.remove(id);
   },
   updateResolution: function(id, checked){
       Resolutions.update(id, {$set: {checked: checked}})
   }
});