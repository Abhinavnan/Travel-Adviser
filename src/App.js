import React from 'react';
import { BrowserRouter as  Router, Route, Redirect, Switch } from 'react-router-dom';  // import BrowserRouter
import { useState, useCallback } from 'react';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';

const App = () => { 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // set the default value of isLoggedIn as false
  const login = useCallback(() => { 
    setIsLoggedIn(true); 
  }
  , []); // useCallback is used to prevent the function from being recreated on every render cycle  
  const logout = useCallback(() => { 
    setIsLoggedIn(false); 
  }
  , []); 
  let routes; // declare routes
  if (isLoggedIn) { // if isLoggedIn is true then set the routes
    routes = (
      <Switch>
        <Route path="/" exact>
          <h1>Home</h1>
        </Route>
        <Route path="/:userId/places" exact> {/* Add this route exctly while typing :userId/places */}
          <UserPlaces />
        </Route>
        <Route path="/users" exact> {/* Add this route exctly while typing users */}
          <Users />
        </Route>
        <Route path="/places/new" exact> {/* Add this route exctly while typing places/new */}
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact> {/* Add this route exctly while typing places/:placeId */}
          <UpdatePlace />
        </Route>
        <Redirect to="/" /> {/* Redirect to home page for invalid paths */}
      </Switch>
    );
  } else { // if isLoggedIn is false then set the routes
    routes = (
    <Switch>
      <Route path="/users" exact> {/* Add this route exctly while typing users */}
        <Users />
      </Route>
      <Route path="/:userId/places" exact> {/* Add this route exctly while typing :userId/places */}
        <UserPlaces />
      </Route>
      <Route path="/auth" exact> {/* Add this route exctly while typing auth */}
          <Auth />
      </Route>
      <Redirect to="/" /> {/* Redirect to home page for invalid paths */}
    </Switch>
    );
  } // if isLoggedIn is true then display the routes for logged in users else display the routes for logged out users

  
  return (
    <AuthContext.Provider value={{isLoggedIn: isLoggedIn, login: login, logout: logout}}> 
    {/* pass the value of isLoggedIn, login and logout to the components */}
      <Router>
        <MainNavigation />
        <main>
          {routes}  {/* display the routes based on the value of isLoggedIn */}
        </main>
      </Router>   
    </AuthContext.Provider> // componenents inside AuthContext.Provider changes according to the value of isLoggedIn
    );
}

export default App;
