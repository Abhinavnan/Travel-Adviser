import React from 'react';
import { BrowserRouter as  Router, Route, Redirect, Switch } from 'react-router-dom';  // import BrowserRouter
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';

const App = () => { 
  return (
    <Router>
      <MainNavigation />
      <main>
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
      </main>
    </Router>    
    );
}

export default App;
