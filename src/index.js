import React, { Component } from 'react';
import script from 'scriptjs';
import PropTypes from 'prop-types';
var Plugin = require('./test-plugin');
// load remote component and return it when ready
// display current children while loading
class JsPmLoader extends Component {
  state = {
    Component: null,
    error: null
  }
  static propTypes = {
    module: PropTypes.string.isRequired,
    props: PropTypes.object
  }
  componentDidMount() {
    // async load of remote UMD component
    script('https://jspm.io/system.js', () => {
      global.System.config({
         transpiler: 'plugin-babel',
         babelOptions: {
            sourceMaps: false,
            stage0: true,
            react: true,
            plugins: [
               'plugin-babel-remove-props'
            ]
         },
         packages: {
             'https://npm.jspm.io/' : { defaultExtension: 'js' },
            'https://cdn.rawgit.com/*' : { defaultExtension: false },
            'https://unpkg.com/' : { defaultExtension: false },
         },
         map: {
            "react": "react-cdn",
            'plugin-babel': 'unpkg:systemjs-plugin-babel@0/plugin-babel.js',
            'systemjs-babel-build': 'unpkg:systemjs-plugin-babel@0/systemjs-babel-browser.js',
            'plugin-babel-remove-props': 'unpkg:babel-plugin-transform-react-remove-prop-types'
         },
         paths: {
            'react-cdn': 'https://fb.me/react-15.1.0.min.js',
            'unpkg:*' : '//unpkg.com/*',
         },
         meta: {
         } 
      });
      global.System.import(this.props.module).then(Component => {
         console.log(Component);
        this.setState({
          error: null,
          Component: Component
        });
      }).catch(e => {
        const message = `Error loading ${this.props.module} : ${e}`;
        console.error(message);
        this.setState({
          error: message,
          Component: null
        });
      });
    });
  }

  render() {
    if (this.state.Component) {
      return <this.state.Component {...this.props.props || {} } />
    } else if (this.state.error) {
      return <div>{ this.state.error }</div>
    } else {
      return this.props.children
    }
  }
}


export default JsPmLoader
