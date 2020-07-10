import React from "react";
//Import Modules
import { Container } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
//Import Components
import EventDashboard from "../../features/events/EventDashboard/eventDashboard";
import NavBar from "./../../features/Nav/NavBar/NavBar";
import EventDetailedPage from "./../../features/events/EventDetailed/EventDetailedPage";
import PeopleDashboard from "./../../features/user/PeopleDashboard/PeopleDashboard";
import SettingDashboard from "./../../features/user/Settings/SettingDashboard";
import UserDetailed from "./../../features/user/UserDetailed/UserDetailedPage";
import EventForm from "./../../features/events/EventForm/EventForm";
import HomePage from "./../../features/home/HomePage";
import TestComponent from "./../../features/TestArea/TestComponent";
import ModalManager from "../../features/modals/ModalsManager";
import { UserIsAuthenticated } from "./../../features/auth/AuthWrapper";
import NotFound from "./NotFound";

function App() {
  return (
    <div>
      <ModalManager />
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
      <Route
        path="/(.+)"
        render={() => (
          <div>
            <NavBar />
            <Container className="main">
              <Switch>
                <Route path="/events" component={EventDashboard} />
                <Route path="/test" component={TestComponent} />
                <Route path="/event/:id" component={EventDetailedPage} />
                <Route
                  path="/manage/:id"
                  component={UserIsAuthenticated(EventForm)}
                />
                <Route
                  path="/people"
                  component={UserIsAuthenticated(PeopleDashboard)}
                />
                <Route
                  path="/profile/:id"
                  component={UserIsAuthenticated(UserDetailed)}
                />
                <Route
                  path="/settings"
                  component={UserIsAuthenticated(SettingDashboard)}
                />
                <Route
                  path="/createEvent"
                  component={UserIsAuthenticated(EventForm)}
                />
                <Route path="/error" component={NotFound} />
              </Switch>
            </Container>
          </div>
        )}
      />
    </div>
  );
}

export default App;
