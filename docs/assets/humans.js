'use strict';



;define('humans/adapters/application', ['exports', 'ember-data', 'npm:blockstack', 'ember-inflector'], function (exports, _emberData, _npmBlockstack, _emberInflector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.JSONAPIAdapter.extend({
    createRecord(store, type, snapshot) {
      let data = {};
      let serializer = store.serializerFor(type.modelName);

      serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

      return new Promise((resolve, reject) => {
        _npmBlockstack.default.putFile(`${_emberInflector.default.inflector.pluralize(type.modelName)}/${snapshot.id}`, JSON.stringify(data), {
          encrypt: false
        }).then(() => {
          resolve(data);
        }).catch(reject);
      });
    },

    findRecord(store, type, id) {
      return new Promise((resolve, reject) => {
        _npmBlockstack.default.getFile(`${_emberInflector.default.inflector.pluralize(type.modelName)}/${id}`, {
          decrypt: false
          //username: store.blockstackName
        }).then(file => {
          resolve(JSON.parse(file));
        }).catch(error => {
          console.error(error);
          reject();
        });
      });
    },

    updateRecord(store, type, snapshot) {
      return this.createRecord(store, type, snapshot);
    }
  });
});
;define('humans/app', ['exports', 'humans/resolver', 'ember-load-initializers', 'humans/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
;define('humans/components/app-intro-section', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNameBindings: ['showImages'],
    classNames: ['app-intro', 'hero'],
    tagName: 'section',
    imagesLoaded: 0,

    didInsertElement() {
      this.$('img').on('load', () => {
        this.incrementProperty('imagesLoaded');
      });
    },

    showImages: Ember.computed('imagesLoaded', function () {
      return this.get('imagesLoaded') == 2;
    })
  });
});
;define('humans/components/app-nav', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNameBindings: ['nav.hidden:hidden'],
    classNames: ['app'],
    nav: Ember.inject.service(),
    session: Ember.inject.service(),
    tagName: 'nav',

    actions: {
      authenticate() {
        this.get('session').authenticate();
      },

      deauthenticate() {
        this.get('session').deauthenticate();
      }
    }
  });
});
;define('humans/components/blockstack-intro-section', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNameBindings: ['showImages'],
    classNames: ['blockstack-intro', 'hero'],
    session: Ember.inject.service(),
    tagName: 'section',
    imagesLoaded: 0,

    didInsertElement() {
      this.$('img').on('load', () => {
        this.incrementProperty('imagesLoaded');
      });
    },

    showImages: Ember.computed('imagesLoaded', function () {
      return this.get('imagesLoaded') == 2;
    }),

    actions: {
      authenticate() {
        this.get('session').authenticate();
      }
    }
  });
});
;define('humans/components/cover-section', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNames: ['cover', 'hero'],
    tagName: 'section'
  });
});
;define('humans/components/customize-url-section', ['exports', 'humans/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNames: ['customize-url-section'],
    domain: _environment.default.host.domain,
    ipAddress: _environment.default.host.ipAddress,
    tagName: 'section',
    session: Ember.inject.service(),

    profileUrl: Ember.computed(function () {
      return `https://${this.get('domain')}/${this.get('session.blockstackName')}`;
    })
  });
});
;define('humans/components/edit-profile-welcome', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNameBindings: ['hidden'],
    classNames: ['edit-profile-welcome'],
    cookies: Ember.inject.service(),
    dismissed: false,

    hidden: Ember.computed('dismissed', 'cookies', function () {
      return this.get('dismissed') || this.get('cookies').read('aeditProfileWelcomeHidden') === 'true';
    }),

    actions: {
      dismiss: function () {
        this.get('cookies').write('aeditProfileWelcomeHidden', true);
        this.set('dismissed', true);
      }
    }
  });
});
;define('humans/components/editable-view', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    attributeBindings: ['contenteditable', 'placeholder', 'spellcheck'],
    editable: false,
    isUserTyping: false,
    store: Ember.inject.service(),

    contenteditable: Ember.computed(function () {
      return this.get('editable') ? 'true' : 'false';
    }),

    didInsertElement: function () {
      return this.setContent();
    },

    focusOut: function () {
      return this.set('isUserTyping', false);
    },

    keyDown: function (event) {
      if (!event.metaKey) {
        return this.set('isUserTyping', true);
      }
    },

    keyUp: function () {
      this.set('value', this.$().text());

      if (this.get('model')) {
        this.get('store').queueSave(this.get('model'));
      }
    },

    processValue: function () {
      if (!this.get('isUserTyping') && this.get('value')) {
        return this.setContent();
      }
    },

    setContent: function () {
      return this.$().html(Ember.Handlebars.Utils.escapeExpression(this.get('value')));
    },

    valueObserver: function () {
      Ember.run.once(this, 'processValue');
    }.observes('value', 'isUserTyping')
  });
});
;define('humans/components/store-indicator', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNameBindings: ['hasContent:hasContent'],
    classNames: ['store-indicator'],
    store: Ember.inject.service(),

    hasContent: Ember.computed('store.{saving,savedAt}', function () {
      return this.get('store.saving') || this.get('store.savedAt');
    })
  });
});
;define('humans/controllers/application', ['exports', 'humans/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    blockstackName: _environment.default.blockstackName
  });
});
;define('humans/controllers/customize-url', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    session: Ember.inject.service()
  });
});
;define('humans/controllers/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({
    session: Ember.inject.service()
  });
});
;define('humans/helpers/app-version', ['exports', 'humans/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  function appVersion(_, hash = {}) {
    const version = _environment.default.APP.version;
    // e.g. 1.0.0-alpha.1+4jds75hf

    // Allow use of 'hideSha' and 'hideVersion' For backwards compatibility
    let versionOnly = hash.versionOnly || hash.hideSha;
    let shaOnly = hash.shaOnly || hash.hideVersion;

    let match = null;

    if (versionOnly) {
      if (hash.showExtended) {
        match = version.match(_regexp.versionExtendedRegExp); // 1.0.0-alpha.1
      }
      // Fallback to just version
      if (!match) {
        match = version.match(_regexp.versionRegExp); // 1.0.0
      }
    }

    if (shaOnly) {
      match = version.match(_regexp.shaRegExp); // 4jds75hf
    }

    return match ? match[0] : version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
;define('humans/helpers/is-after', ['exports', 'ember-moment/helpers/is-after'], function (exports, _isAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isAfter.default;
    }
  });
});
;define('humans/helpers/is-before', ['exports', 'ember-moment/helpers/is-before'], function (exports, _isBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBefore.default;
    }
  });
});
;define('humans/helpers/is-between', ['exports', 'ember-moment/helpers/is-between'], function (exports, _isBetween) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBetween.default;
    }
  });
});
;define('humans/helpers/is-same-or-after', ['exports', 'ember-moment/helpers/is-same-or-after'], function (exports, _isSameOrAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrAfter.default;
    }
  });
});
;define('humans/helpers/is-same-or-before', ['exports', 'ember-moment/helpers/is-same-or-before'], function (exports, _isSameOrBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrBefore.default;
    }
  });
});
;define('humans/helpers/is-same', ['exports', 'ember-moment/helpers/is-same'], function (exports, _isSame) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSame.default;
    }
  });
});
;define('humans/helpers/moment-add', ['exports', 'ember-moment/helpers/moment-add'], function (exports, _momentAdd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentAdd.default;
    }
  });
});
;define('humans/helpers/moment-calendar', ['exports', 'ember-moment/helpers/moment-calendar'], function (exports, _momentCalendar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentCalendar.default;
    }
  });
});
;define('humans/helpers/moment-diff', ['exports', 'ember-moment/helpers/moment-diff'], function (exports, _momentDiff) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDiff.default;
    }
  });
});
;define('humans/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _momentDuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDuration.default;
    }
  });
});
;define('humans/helpers/moment-format', ['exports', 'ember-moment/helpers/moment-format'], function (exports, _momentFormat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFormat.default;
    }
  });
});
;define('humans/helpers/moment-from-now', ['exports', 'ember-moment/helpers/moment-from-now'], function (exports, _momentFromNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFromNow.default;
    }
  });
});
;define('humans/helpers/moment-from', ['exports', 'ember-moment/helpers/moment-from'], function (exports, _momentFrom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFrom.default;
    }
  });
});
;define('humans/helpers/moment-subtract', ['exports', 'ember-moment/helpers/moment-subtract'], function (exports, _momentSubtract) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentSubtract.default;
    }
  });
});
;define('humans/helpers/moment-to-date', ['exports', 'ember-moment/helpers/moment-to-date'], function (exports, _momentToDate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToDate.default;
    }
  });
});
;define('humans/helpers/moment-to-now', ['exports', 'ember-moment/helpers/moment-to-now'], function (exports, _momentToNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToNow.default;
    }
  });
});
;define('humans/helpers/moment-to', ['exports', 'ember-moment/helpers/moment-to'], function (exports, _momentTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentTo.default;
    }
  });
});
;define('humans/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
});
;define('humans/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _moment.default;
    }
  });
});
;define('humans/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _now) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _now.default;
    }
  });
});
;define('humans/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
;define('humans/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
;define('humans/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
});
;define('humans/helpers/utc', ['exports', 'ember-moment/helpers/utc'], function (exports, _utc) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _utc.default;
    }
  });
  Object.defineProperty(exports, 'utc', {
    enumerable: true,
    get: function () {
      return _utc.utc;
    }
  });
});
;define('humans/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'humans/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  let name, version;
  if (_environment.default.APP) {
    name = _environment.default.APP.name;
    version = _environment.default.APP.version;
  }

  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
;define('humans/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
;define('humans/initializers/dns', ['exports', 'humans/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(app) {
    if (!window) {
      return;
    }

    app.deferReadiness();

    Ember.$.getJSON(`https://dns.google.com/resolve?name=${window.location.origin}&type=TXT`).then(data => {
      if (data && data.Answer && data.Answer[0].data && data.Answer[0].data.indexOf('blockstack=') === 1) {
        _environment.default.blockstackName = data.Answer[0].data.replace(/"/g, '').substr(11);
      }

      app.advanceReadiness();
    });
  }

  exports.default = {
    initialize
  };
});
;define('humans/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
;define('humans/initializers/export-application-global', ['exports', 'humans/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
;define('humans/initializers/inflector', ['exports', 'ember-inflector'], function (exports, _emberInflector) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    _emberInflector.default.inflector = new _emberInflector.default({
      irregularPairs: [['human', 'humans']]
    });
  }

  exports.default = {
    initialize
  };
});
;define('humans/instance-initializers/ember-data', ['exports', 'ember-data/initialize-store-service'], function (exports, _initializeStoreService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _initializeStoreService.default
  };
});
;define('humans/locations/router-scroll', ['exports', 'ember-router-scroll/locations/router-scroll'], function (exports, _routerScroll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _routerScroll.default;
    }
  });
});
;define('humans/models/human', ['exports', 'ember-data/attr', 'ember-data', 'ember-data/model', 'npm:blockstack'], function (exports, _attr, _emberData, _model, _npmBlockstack) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    description: (0, _attr.default)('string'),
    name: (0, _attr.default)('string'),

    blockstackName: Ember.computed('blockstackNames.length', function () {
      return this.get('blockstackNames.firstObject');
    }),

    blockstackNames: Ember.computed('id', function () {
      return _emberData.default.PromiseArray.create({
        promise: new Promise((resolve, reject) => {
          _npmBlockstack.default.config.network.getNamesOwned(this.get('id')).then(resolve).catch(reject);
        })
      });
    })
  });
});
;define('humans/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
;define('humans/router', ['exports', 'ember-router-scroll', 'humans/config/environment'], function (exports, _emberRouterScroll, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const Router = Ember.Router.extend(_emberRouterScroll.default, {
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    if (_environment.default.blockstackName) {
      this.route('human', { path: '/' });
    } else {
      this.route('human', { path: '/:blockstack_name' });
      this.route('create-profile');
      this.route('customize-url');
    }
  });

  exports.default = Router;
});
;define('humans/routes/application', ['exports', 'npm:blockstack'], function (exports, _npmBlockstack) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    session: Ember.inject.service(),

    beforeModel() {
      return new Promise((resolve, reject) => {
        if (_npmBlockstack.default.isSignInPending()) {
          _npmBlockstack.default.handlePendingSignIn().then(resolve).catch(reject);
        } else {
          resolve();
        }
      });
    },

    model() {
      return this.get('session.human');
    }
  });
});
;define('humans/routes/create-profile', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    session: Ember.inject.service(),

    beforeModel() {
      if (this.get('session.authenticated')) {
        this.transitionTo('index');
      }
    }
  });
});
;define('humans/routes/human', ['exports', 'npm:blockstack', 'humans/config/environment'], function (exports, _npmBlockstack, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    nav: Ember.inject.service(),

    model(params) {
      let blockstackName = params.blockstack_name ? params.blockstack_name : _environment.default.blockstackName;

      return new Promise((resolve, reject) => {
        _npmBlockstack.default.config.network.getNameInfo(blockstackName).then(info => {
          this.store.findRecord(blockstackName, 'human', info.address).then(resolve).catch(reject);
        });
      });
    },

    afterModel() {
      this.set('nav.hidden', true);
    },

    actions: {
      willTransition() {
        this.set('nav.hidden', false);
      }
    }
  });
});
;define('humans/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define('humans/services/cookies', ['exports', 'ember-cookies/services/cookies'], function (exports, _cookies) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _cookies.default;
});
;define('humans/services/moment', ['exports', 'ember-moment/services/moment', 'humans/config/environment'], function (exports, _moment, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const { get } = Ember;

  exports.default = _moment.default.extend({
    defaultFormat: get(_environment.default, 'moment.outputFormat')
  });
});
;define('humans/services/nav', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({});
});
;define('humans/services/router-scroll', ['exports', 'ember-router-scroll/services/router-scroll'], function (exports, _routerScroll) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _routerScroll.default;
    }
  });
});
;define('humans/services/session', ['exports', 'ember-data', 'npm:blockstack'], function (exports, _emberData, _npmBlockstack) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Service.extend({
    store: Ember.inject.service(),

    authenticate() {
      _npmBlockstack.default.redirectToSignIn(undefined, undefined, ['store_write', 'publish_data', 'email']);
    },

    authenticated: Ember.computed(() => {
      return _npmBlockstack.default.isUserSignedIn();
    }),

    deauthenticate() {
      _npmBlockstack.default.signUserOut(window ? window.location.origin : null);
    },

    human: Ember.computed('findOrCreateHuman', function () {
      return this.get('findOrCreateHuman.content') ? this.get('findOrCreateHuman.content') : this.get('findOrCreateHuman');
    }),

    findOrCreateHuman: Ember.computed('authenticated', function () {
      if (!this.get('authenticated')) {
        return;
      }

      return _emberData.default.PromiseObject.create({
        promise: new Promise(resolve => {
          this.get('store').findRecord(this.get('blockstackName'), 'human', this.get('userId')).then(resolve).catch(() => {
            this.get('store').unloadRecord(this.get('store').getReference('human', this.get('userId')).internalModel); // fix for https://github.com/locks/ember-localstorage-adapter/issues/219

            resolve(this.get('store').createRecord('human', {
              id: this.get('userId')
            }));
          });
        })
      });
    }),

    unauthenticated: Ember.computed(() => {
      return !_npmBlockstack.default.isUserSignedIn();
    }),

    userData: Ember.computed(() => {
      return _npmBlockstack.default.loadUserData();
    }),

    userId: Ember.computed('userData', function () {
      return this.get('userData.identityAddress');
    }),

    blockstackName: Ember.computed('userData', function () {
      return this.get('userData.username');
    })
  });
});
;define('humans/services/store', ['exports', 'ember-data', 'npm:p-queue'], function (exports, _emberData, _npmPQueue) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Store.extend({
    init: function () {
      this.set('queue', new _npmPQueue.default({ concurrency: 1 }));
      return this._super(arguments);
    },

    queueSave: function (record) {
      this.get('queue').add(() => {
        this.set('saving', true);

        record.get('content').save().finally(() => {
          this.get('queue').onIdle().then(() => {
            this.set('savedAt', Date.now());
            this.set('saving', false);
          });
        });
      });
    },

    findRecord(blockstackName, modelName, id, options) {
      this.set('blockstackName', blockstackName);
      return this._super(modelName, id, options);
    }
  });
});
;define("humans/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "GBQpxFhT", "block": "{\"symbols\":[],\"statements\":[[4,\"unless\",[[23,[\"blockstackName\"]]],null,{\"statements\":[[0,\"  \"],[1,[21,\"app-nav\"],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[1,[21,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/application.hbs" } });
});
;define("humans/templates/components/app-intro-section", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DZfJUek3", "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"images\"],[9],[0,\"\\n  \"],[7,\"img\"],[11,\"class\",\"laptop-preview\"],[11,\"src\",\"/images/laptop-preview.png\"],[9],[10],[0,\"\\n  \"],[7,\"img\"],[11,\"class\",\"mobile-preview\"],[11,\"src\",\"/images/mobile-preview.png\"],[9],[10],[0,\"\\n\"],[10],[0,\"\\n\"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n  \"],[7,\"h1\"],[9],[0,\"Create an independent profile on the web within minutes\"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"Let's admit it: profiles on Facebook, LinkedIn etc. are \"],[7,\"em\"],[9],[0,\"ugly\"],[10],[0,\". And no company should control your identity or personal content online.\"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"With Humans, you'll put your best face forward while maintaining full control over your profile, now and forever.\"],[10],[0,\"\\n  \"],[4,\"link-to\",[\"create-profile\"],null,{\"statements\":[[0,\"Create your profile\"]],\"parameters\":[]},null],[0,\"\\n\"],[10]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/components/app-intro-section.hbs" } });
});
;define("humans/templates/components/app-nav", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "2RNPszYc", "block": "{\"symbols\":[],\"statements\":[[4,\"link-to\",[\"index\"],[[\"tabindex\"],[\"1\"]],{\"statements\":[[0,\"Humans.\"]],\"parameters\":[]},null],[0,\"\\n\"],[7,\"div\"],[9],[0,\"\\n\"],[4,\"if\",[[23,[\"session\",\"unauthenticated\"]]],null,{\"statements\":[[0,\"    \"],[7,\"a\"],[11,\"title\",\"View on GitHub\"],[11,\"href\",\"https://github.com/markmhx/humans\"],[9],[7,\"i\"],[11,\"class\",\"fab fa-github\"],[9],[10],[10],[0,\"\\n    \"],[7,\"span\"],[11,\"title\",\"Sign in\"],[12,\"onclick\",[27,\"action\",[[22,0,[]],\"authenticate\"],null]],[11,\"tabindex\",\"2\"],[9],[7,\"i\"],[11,\"class\",\"fas fa-sign-in-alt\"],[9],[10],[10],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[4,\"link-to\",[\"human\",[23,[\"session\",\"blockstackName\"]]],[[\"title\",\"tabindex\",\"target\"],[\"View public profile\",\"2\",\"_blank\"]],{\"statements\":[[7,\"i\"],[11,\"class\",\"far fa-eye\"],[9],[10]],\"parameters\":[]},null],[0,\"\\n    \"],[4,\"link-to\",[\"customize-url\"],[[\"tabindex\",\"title\"],[\"3\",\"Customize URL\"]],{\"statements\":[[7,\"i\"],[11,\"class\",\"fas fa-cog\"],[9],[10]],\"parameters\":[]},null],[0,\"\\n    \"],[7,\"span\"],[11,\"tabindex\",\"4\"],[11,\"title\",\"Sign out\"],[3,\"action\",[[22,0,[]],\"deauthenticate\"]],[9],[7,\"i\"],[11,\"class\",\"fas fa-sign-out-alt\"],[9],[10],[10],[0,\"\\n\"]],\"parameters\":[]}],[10]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/components/app-nav.hbs" } });
});
;define("humans/templates/components/blockstack-intro-section", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "dBciulOw", "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[11,\"class\",\"images\"],[9],[0,\"\\n  \"],[7,\"img\"],[11,\"class\",\"create-blockstack-id\"],[11,\"src\",\"/images/blockstack-preview1.png\"],[9],[10],[0,\"\\n  \"],[7,\"img\"],[11,\"class\",\"create-blockstack-name\"],[11,\"src\",\"/images/blockstack-preview2.png\"],[9],[10],[0,\"\\n\"],[10],[0,\"\\n\"],[7,\"div\"],[11,\"class\",\"content\"],[9],[0,\"\\n  \"],[7,\"h1\"],[9],[0,\"Get started with Blockstack\"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"Humans uses Blockstack to ensure that you own your identity and data completely upon creating your new profile.\"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"Never heard of Blockstack? Don't worry – it's easy! Simply register for a new \\\"Blockstack ID\\\" and you'll be ready to start creating on Humans.\"],[10],[0,\"\\n  \"],[7,\"button\"],[3,\"action\",[[22,0,[]],\"authenticate\"]],[9],[0,\"Get started with Blockstack\"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/components/blockstack-intro-section.hbs" } });
});
;define("humans/templates/components/cover-section", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "suP3zMKZ", "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[9],[0,\"\\n  \"],[1,[27,\"editable-view\",null,[[\"editable\",\"tagName\",\"model\",\"name\",\"placeholder\",\"spellcheck\",\"value\"],[[23,[\"editable\"]],\"h1\",[23,[\"human\"]],\"full-name\",\"Name\",false,[23,[\"human\",\"name\"]]]]],false],[0,\"\\n  \"],[1,[27,\"editable-view\",null,[[\"class\",\"editable\",\"model\",\"name\",\"placeholder\",\"spellcheck\",\"value\"],[\"subheader\",[23,[\"editable\"]],[23,[\"human\"]],\"description\",\"Description\",false,[23,[\"human\",\"description\"]]]]],false],[0,\"\\n\"],[10]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/components/cover-section.hbs" } });
});
;define("humans/templates/components/customize-url-section", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "R2PhgoD9", "block": "{\"symbols\":[],\"statements\":[[7,\"div\"],[9],[0,\"\\n  \"],[7,\"h1\"],[9],[0,\"Customize your profile URL\"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"Your profile is always available publicly at this address:\"],[10],[0,\"\\n  \"],[7,\"pre\"],[9],[1,[21,\"profileUrl\"],false],[10],[0,\"  \"],[7,\"p\"],[9],[0,\"However, if you'd like to make your profile available on your own domain as well, simply add the following \"],[7,\"a\"],[11,\"href\",\"https://www.digitalocean.com/community/tutorials/an-introduction-to-dns-terminology-components-and-concepts\"],[9],[0,\"DNS records\"],[10],[0,\" to the account with which you manage the domain (e.g. Domain.com, GoDaddy, Namecheap):\"],[10],[0,\"\\n  \"],[7,\"ul\"],[9],[0,\"\\n    \"],[7,\"li\"],[9],[0,\"\\\"A\\\" record should contain \"],[7,\"code\"],[9],[1,[21,\"ipAddress\"],false],[10],[10],[0,\"\\n    \"],[7,\"li\"],[9],[0,\"\\\"TXT\\\" record should contain \"],[7,\"code\"],[9],[0,\"blockstack=\"],[1,[23,[\"session\",\"blockstackName\"]],false],[10],[10],[0,\"\\n    \"],[7,\"li\"],[9],[0,\"\\\"CNAME\\\" record for \"],[7,\"code\"],[9],[0,\"www\"],[10],[0,\" should contain \"],[7,\"code\"],[9],[1,[21,\"domain\"],false],[10],[0,\" (optional)\"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"For example, to make your profile available at \"],[7,\"code\"],[9],[0,\"example.com\"],[10],[0,\" and \"],[7,\"code\"],[9],[0,\"www.example.com\"],[10],[0,\", add the following records:\"],[10],[0,\"\\n  \"],[7,\"div\"],[11,\"class\",\"table\"],[9],[0,\"\\n    \"],[7,\"table\"],[9],[0,\"\\n      \"],[7,\"thead\"],[9],[0,\"\\n        \"],[7,\"th\"],[9],[0,\"Type\"],[10],[0,\"\\n        \"],[7,\"th\"],[9],[0,\"Hostname\"],[10],[0,\"\\n        \"],[7,\"th\"],[9],[0,\"Value\"],[10],[0,\"\\n      \"],[10],[0,\"\\n      \"],[7,\"tbody\"],[9],[0,\"\\n        \"],[7,\"tr\"],[9],[0,\"\\n          \"],[7,\"td\"],[9],[0,\"A\"],[10],[0,\"\\n          \"],[7,\"td\"],[9],[0,\"example.com\"],[10],[0,\"\\n          \"],[7,\"td\"],[9],[1,[21,\"ipAddress\"],false],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"tr\"],[9],[0,\"\\n          \"],[7,\"td\"],[9],[0,\"TXT\"],[10],[0,\"\\n          \"],[7,\"td\"],[9],[0,\"example.com\"],[10],[0,\"\\n          \"],[7,\"td\"],[9],[0,\"blockstack=\"],[1,[23,[\"session\",\"blockstackName\"]],false],[10],[0,\"\\n        \"],[10],[0,\"\\n        \"],[7,\"tr\"],[9],[0,\"\\n          \"],[7,\"td\"],[9],[0,\"CNAME\"],[10],[0,\"\\n          \"],[7,\"td\"],[9],[0,\"www\"],[10],[0,\"\\n          \"],[7,\"td\"],[9],[1,[21,\"domain\"],false],[10],[0,\"\\n        \"],[10],[0,\"\\n      \"],[10],[0,\"\\n    \"],[10],[0,\"\\n  \"],[10],[0,\"\\n  \"],[7,\"p\"],[9],[0,\"Once making these changes, please wait up to 24 hours for them to take effect.\"],[10],[0,\"\\n\"],[10]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/components/customize-url-section.hbs" } });
});
;define("humans/templates/components/edit-profile-welcome", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jnXTkT9F", "block": "{\"symbols\":[],\"statements\":[[7,\"h2\"],[9],[0,\"Start creating!\"],[10],[0,\"\\n\"],[7,\"p\"],[9],[0,\"Fill out your profile here and changes will be saved automatically to your new public profile.\"],[10],[0,\"\\n\"],[7,\"p\"],[9],[0,\"Select \\\"\"],[7,\"i\"],[11,\"class\",\"far fa-eye\"],[9],[10],[0,\"\\\" in the navigation above to view your profile as it appears to others and share the URL with friends.\"],[10],[0,\"\\n\"],[7,\"button\"],[3,\"action\",[[22,0,[]],\"dismiss\"]],[9],[0,\"Ok\"],[10]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/components/edit-profile-welcome.hbs" } });
});
;define("humans/templates/components/editable-view", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "dHRWepQS", "block": "{\"symbols\":[\"&default\"],\"statements\":[[14,1]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/components/editable-view.hbs" } });
});
;define("humans/templates/components/store-indicator", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "BHpYOjb8", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[23,[\"store\",\"saving\"]]],null,{\"statements\":[[0,\"  Saving changes...\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[23,[\"store\",\"savedAt\"]]],null,{\"statements\":[[0,\"  Last saved \"],[1,[27,\"moment-from-now\",[[23,[\"store\",\"savedAt\"]]],[[\"interval\"],[1000]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/components/store-indicator.hbs" } });
});
;define("humans/templates/create-profile", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "zItNbIsW", "block": "{\"symbols\":[],\"statements\":[[1,[21,\"blockstack-intro-section\"],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/create-profile.hbs" } });
});
;define("humans/templates/customize-url", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "/sPDP4Vr", "block": "{\"symbols\":[],\"statements\":[[1,[27,\"customize-url-section\",null,[[\"human\"],[[23,[\"session\",\"human\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/customize-url.hbs" } });
});
;define("humans/templates/human", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "vm8y0ku0", "block": "{\"symbols\":[],\"statements\":[[1,[27,\"cover-section\",null,[[\"human\"],[[23,[\"model\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/human.hbs" } });
});
;define("humans/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "1HCQ3emL", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[23,[\"session\",\"authenticated\"]]],null,{\"statements\":[[0,\"  \"],[1,[21,\"store-indicator\"],false],[0,\"\\n  \"],[1,[21,\"edit-profile-welcome\"],false],[0,\"\\n  \"],[1,[27,\"cover-section\",null,[[\"human\",\"editable\"],[[23,[\"session\",\"human\"]],true]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[1,[21,\"app-intro-section\"],false],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "humans/templates/index.hbs" } });
});
;

;define('humans/config/environment', [], function() {
  var prefix = 'humans';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("humans/app")["default"].create({"name":"humans","version":"0.0.0+a6915fdf"});
          }
        
//# sourceMappingURL=humans.map
