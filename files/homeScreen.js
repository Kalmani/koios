var HomeScreen = new Class ({

  initialize : function(app, screen_id) {
    this.app = app;
    this.ID = screen_id;
    this.SCS = this.app.SCS;
  },

  show : function() {
    this.app.current_screen = this.ID;
    this.container = document.body.empty();
    var context = {},
        dom = this.app.render('home_screen', context).inject(this.container);
  }
});
