var Main = new Class ({

  Implements : Events,

  locales : {},
  templates  : {},
  current_screen : null,
  default_page : 'HOME',

  initialize : function() {
    console.log('initializing api');
    this.sess = new Session(this);
    this.SCS = new ScreenManager(this);
  },

  init : function() {
    var load_ready = {};

    this.addEvent('init', function(step) {
      load_ready[step] = true;
      console.info("Load ", step, " > Finish");

      if(load_ready.templates && load_ready.locales) {
        this.show_content();
      }
    });
    this.load_config();
  },

  load_config : function() {
    new Request({
      url : 'config.json',
      onSuccess : function(txt) {
        this.config = JSON.decode(txt);
        if (Cookie.read('current_language') === null) {
          var language = new Cookie('current_language', false);
          language.write(this.config.default_language || 'en-us');
        }
        this.current_language = Cookie.read('current_language') || this.config.default_language || 'en-us';
        // Build endpoints
        this.load_locales();
        this.load_templates();
      }.bind(this)
    }).post();
  },

  load_locales : function() {
    new Request({
      url : 'locales.json',
      onSuccess : function(txt) {
        var tmp = {},
            locales = JSON.decode(txt);

        Object.each(locales, function(trad, lang) {
          tmp[lang] = {};
          Object.each(trad, function(v, k) {
            tmp[lang]['$' + k + ';'] = v;
          });
        });
        Object.each(tmp, function(v, k) {
          tmp[k] = Object.merge({}, tmp['fr-fr'], v);
        });

        this.locales = tmp;
        this.fireEvent('init', 'locales');
      }.bind(this)
    }).get();
  },

  load_templates : function() {
    var that = this;
    new Request({
      url : 'templates.xml',
      onSuccess : function(txt, xml) {
        var serializer = new XMLSerializer();
        Array.each(xml.xpath("//script[@type='text/template']"), function(node) {
          var str = "";
          Array.each(node.childNodes, function(child) {
            str += serializer.serializeToString(child);
          });
          that.templates[node.getAttribute('id')] = str;
        });
        that.fireEvent('init', 'templates');
      }
    }).get();
  },

  render : function(template_id, view) {
    var res, output = Mustache.render(this.templates[template_id], view, this.templates);
    output = this.translate_full(output);
    return new Element('div', {'html' : output});
  },

  translate : function(i) {
    if(i === "" || !i) return "";
    return this.translate_full('$' + i + ';');
  },

  translate_full : function(i) {
    var tmp = '', lang = this.current_language || 'fr-fr';
    do {
      tmp = i;
      i = i.replaces(this.locales[lang]);
    } while (tmp != i);
    return tmp;
  },

  show_content : function() {
    var context = {},
        dom = this.render('global', context).inject(document.body);
    this.current_screen = this.default_page;
    if (!this.sess.user) {
      this.make_nav();
      this.SCS.switchRubric(this.default_page);
    } else {
      // default value for login page
      JimmyAdmin[this.default_page] = this.default_page;
      this.SCS.register(new HomeScreen(this, this.default_page));
      this.SCS.screens_list[this.default_page].show_login_panel();
    }
  }
});
