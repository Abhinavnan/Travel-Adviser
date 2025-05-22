import React,{Suspense} from 'react';
import { BrowserRouter as  Router, Route, Redirect, Switch } from 'react-router-dom';  // import BrowserRouter
import Users from './user/pages/Users';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));
// make components load only when route is accessed

const App = () => { 
  const { token, login, logout, userId } = useAuth(); // useAuth is a custom hook that returns the value of token, login and logout
  let routes; // declare routes
  
  if (token) { // if isLoggedIn is true then set the routes
    routes = (
      <Switch> {/* Switch is used to render the first child Route or Redirect that matches the location */}
        <Route path="/" exact>
          <Users />
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
      <Redirect to="/auth" /> {/* Redirect to auth page for invalid paths */}
    </Switch>
    );
  } // if isLoggedIn is true then display the routes for logged in users else display the routes for logged out users

  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId}}>     
    {/* pass the value of isLoggedIn, login and logout to the components */}
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={<div className="center"><LoadingSpinner /></div>}> 
          {/* Suspense is used to display a fallback UI while the component is loading */}
          {routes}  {/* display the routes based on the value of isLoggedIn */}
          </Suspense>
        </main>
      </Router>   
    </AuthContext.Provider> // componenents inside AuthContext.Provider changes according to the value of isLoggedIn
    );
}

export default App;
