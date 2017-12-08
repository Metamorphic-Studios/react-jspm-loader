'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _scriptjs = require('scriptjs');

var _scriptjs2 = _interopRequireDefault(_scriptjs);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// load remote component and return it when ready
// display current children while loading
var JsPmLoader = function (_Component) {
   _inherits(JsPmLoader, _Component);

   function JsPmLoader() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, JsPmLoader);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
         args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = JsPmLoader.__proto__ || Object.getPrototypeOf(JsPmLoader)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
         Component: null,
         error: null
      }, _temp), _possibleConstructorReturn(_this, _ret);
   }

   _createClass(JsPmLoader, [{
      key: '_parseComponent',
      value: function _parseComponent(Component) {
         //Identify component props
         var props = null;
         var err = null;
         var cmp = null;
         if ((typeof Component === 'undefined' ? 'undefined' : _typeof(Component)) == 'object' && Component.default) {
            cmp = Component.default;
            props = cmp.propTypes;
         } else if ((typeof Component === 'undefined' ? 'undefined' : _typeof(Component)) == 'object') {
            //Submodules
            cmp = Component;
         } else {
            cmp = Component;
            props = cmp.propTypes;
         }

         var _props = [];

         for (var k in props) {
            _props.push(k);
         }

         return { Component: cmp, props: _props, error: err };
      }
   }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
         var _this2 = this;

         // async load of remote UMD component
         (0, _scriptjs2.default)('https://jspm.io/system.js', function () {
            global.System.config({
               defaultExtensions: false,
               baseURL: 'https://npm.jspm.io',
               babelOptions: {
                  blacklist: [],
                  sourceMaps: false,
                  stage0: true,
                  react: true,
                  plugins: ['plugin-babel-remove-props']
               },
               packages: {
                  'https://npm.jspm.io/': { defaultExtension: 'js' },
                  'https://cdn.rawgit.com/*': { defaultExtension: false },
                  'https://unpkg.com/': { defaultExtension: false }
               },
               map: {
                  "react": "react-cdn",
                  'plugin-babel': 'unpkg:systemjs-plugin-babel@0/plugin-babel.js',
                  'systemjs-babel-build': 'unpkg:systemjs-plugin-babel@0/systemjs-babel-browser.js',
                  'plugin-babel-remove-props': 'unpkg:babel-plugin-transform-react-remove-prop-types'
               },
               transpiler: 'plugin-babel',
               paths: {
                  'react-cdn': 'https://unpkg.com/react@15.1.0/dist/react.min.js',
                  'unpkg:*': '//unpkg.com/*',
                  'npm:react': 'https://unpkg.com/react@15.1.0/dist/react.min.js',
                  'https://registry.jspm.io/*': '//npm.jspm.io/*',
                  'npm:react@16.0eta.*': 'https://unpkg.com/react@16.2.0/cjs/react.production.min.js'
               },
               meta: {}
            });
            global.System.import(_this2.props.module).then(function (Component) {
               var c = _this2._parseComponent(Component);
               if (c.Component) {
                  if (_typeof(c.Component) !== 'object') {
                     _this2.setState({
                        error: null,
                        Component: c.Component
                     });
                  }

                  if (_this2.props.onLoad) {
                     _this2.props.onLoad(c);
                  }
               }
            }).catch(function (e) {
               var message = 'Error loading ' + _this2.props.module + ' : ' + e;
               console.error(message);
               _this2.setState({
                  error: message,
                  Component: null
               });
            });
         });
      }
   }, {
      key: 'render',
      value: function render() {
         if (this.state.Component && _typeof(this.state.component) !== 'object') {
            return _react2.default.createElement(this.state.Component, this.props.props || {});
         } else if (this.state.error) {
            return _react2.default.createElement(
               'div',
               null,
               this.state.error
            );
         } else {
            return this.props.children;
         }
      }
   }]);

   return JsPmLoader;
}(_react.Component);

process.env.NODE_ENV !== "production" ? JsPmLoader.propTypes = {
   module: _propTypes2.default.string.isRequired,
   props: _propTypes2.default.object
} : void 0;
exports.default = JsPmLoader;