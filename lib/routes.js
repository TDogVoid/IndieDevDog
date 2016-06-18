FlowRouter.route('/testpage', {
  action: function() {
    BlazeLayout.render("main", {content: "testpage", top: "header"});
  }
});

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("main", {content: "homeContent", top: "header"});
  }
});
