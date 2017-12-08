import React, { Component } from 'react';
import script from 'scriptjs';
import PropTypes from 'prop-types';
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

   _parseComponent(Component){
      //Identify component props
		var props = null;
		var err = null;
		var cmp = null;
		if(typeof(Component) == 'object' && Component.default){
			cmp = Component.default;
			props = cmp.propTypes;
		}else if(typeof(Component) == 'object'){
			//Submodules
			cmp = Component;          
		}else{
			cmp = Component;
			props = cmp.propTypes;
		}
		
		var _props = [];

		for(var k in props){
		   _props.push(k);
		}

      return { Component: cmp, props: _props, error: err};
   }
  
  componentDidMount() {
    // async load of remote UMD component
    script('https://jspm.io/system.js', () => {
      global.System.config({
         baseURL: 'https://npm.jspm.io',
         babelOptions: {
            blacklist: [],
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
         transpiler: 'plugin-babel',
         paths: {
            'react-cdn': 'https://unpkg.com/react@15.1.0/dist/react.min.js',
            'unpkg:*' : '//unpkg.com/*',
            'npm:react': 'https://unpkg.com/react@15.1.0/dist/react.min.js',
            'https://registry.jspm.io/*':  '//npm.jspm.io/*',
            'npm:react@16.0eta.*': 'https://unpkg.com/react@16.2.0/cjs/react.production.min.js'
         },
         meta: {
         } 
      });
      global.System.import(this.props.module).then(Component => {
         var c = this._parseComponent(Component);
         if(c.Component){
            if(typeof(c.Component) !== 'object'){
               this.setState({
                  error: null,
                  Component: c.Component
               });
            }

            if(this.props.onLoad){
               this.props.onLoad(c);
            }
         }
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
    if (this.state.Component && typeof(this.state.component) !== 'object') {
      return <this.state.Component {...this.props.props || {} } />
    } else if (this.state.error) {
      return <div>{ this.state.error }</div>
    } else {
      return this.props.children
    }
  }
}


export default JsPmLoader
