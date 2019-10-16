import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import Home from '../home'
import Monitors from '../monitors'
import About from '../about'
import Settings from '../settings'
//import logo from '../../img/logo.png'

const App = () => (
  <div>
    <header>
      {/* <img alt={logo} src={logo} height="100px"/> */}
      <NavLink activeClassName="is-active" exact={true} to="/">Home</NavLink>
      <NavLink activeClassName="is-active" to="/monitors">Monitors</NavLink>
      <NavLink activeClassName="is-active" to="/settings">Settings</NavLink>
      <a href="/docs/" target="_blank">Documentation</a>
      <NavLink activeClassName="is-active" to="/about-us">About</NavLink>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/monitors" component={Monitors} />
      <Route exact path="/about-us" component={About} />
      <Route exact path="/settings" component={Settings} />
    </main>
  </div>
)

export default App
