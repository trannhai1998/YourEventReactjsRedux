import React, { Component } from "react";
import { Menu, Container, Button} from "semantic-ui-react";
import { NavLink, Link, withRouter } from "react-router-dom";
//For Login Form
import { withFirebase } from "react-redux-firebase";
import SignedOutMenu from "./../Menus/SignedOutMenu";
import SignedInMenu from "./../Menus/SignedInMenu";
import { connect } from "react-redux";
import { openModal } from "./../../modals/ModalsActions";
import { logout } from "./../../auth/AuthActions";
import ld from "lodash";
class NavBar extends Component {
 
  handleSignOut = () => {
    this.props.firebase.logout();
    this.props.history.push("/");
  };
  handleSignIn = () => {
    this.props.openModal("ModalLogin");
  };
  handleRegister = () => {
    this.props.openModal("ModalRegister");
  };
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });
    const re = new RegExp(ld.escapeRegExp(this.props), 'i');
    const isMatch = result => re.test(result.title);
    this.setState({
      isLoading: false,
      results: ld.filter(this.props.events, isMatch),
    })
  };
  handleResultSelect = (e, { result }) => this.setState({ value: result.title })
  render() {
    const { auth, profile} = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={NavLink} to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            Your Events
          </Menu.Item>
          <Menu.Item as={NavLink} to="/events" name="Events" />
          {authenticated && (
            <Menu.Item as={NavLink} to="/people" name="People" />
          )}

          {authenticated && (
            <Menu.Item>
              <Button
                as={Link}
                to="/createEvent"
                floated="right"
                positive
                inverted
                content="Create Event"
                title="Tạo Sự Kiện"
              />
            </Menu.Item>
          )}
          {authenticated ? (
            <SignedInMenu
              auth={auth}
              profile={profile}
              signout={this.handleSignOut}
            />
          ) : (
            <SignedOutMenu
              signin={this.handleSignIn}
              register={this.handleRegister}
            />
          )}
        </Container>
      </Menu>
    );
  }
}

const actions = {
  openModal,
  logout
};
const mapState = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  loading: state.async.loading,
  events: state.event, 
});
export default withRouter(
  withFirebase(
    connect(
      mapState,
      actions
    )(NavBar)
  )
);
