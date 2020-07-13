import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedEvents from "./UserDetailedEvents";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedSidebar from "./UserDetailedSidebar";
import { UserDetailedQuery } from "./../UserQueries";
import LoadingComponent from "./../../../app/layout/Loading";
import { getUserEvents, followUser, unfollowUser } from "./../UserActions";
import { toastr } from "react-redux-toastr";

class UserDetailedPage extends Component {
  async componentDidMount() {
    let user = await this.props.firestore.get(
      `users/${this.props.match.params.id}`
    );
    if (!user.exists) {
      toastr.error("Not Fount ", " This is not the User you are looking For ");
      this.props.history.push("/error");
    }
    await this.props.getUserEvents(this.props.userUid);
  }
  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  };

  render() {
    const {
      profile,
      photos,
      match,
      auth,
      requesting,
      events,
      eventsLoading,
      followUser,
      following,
      unfollowUser,
    } = this.props;
    const isCurrentUser = auth.uid === match.params.id;
    const loading = requesting[`users/${match.params.id}`];
    const isFollowing = !isEmpty(following);
    let noHavePhoto;
    if (isCurrentUser && photos) {
      noHavePhoto = photos.length === 0;
    }
    if (loading) return <LoadingComponent inverted={true} />;
    console.log(profile);
    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar
          isCurrentUser={isCurrentUser}
          profile={profile}
          isFollowing={isFollowing}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
        <UserDetailedPhotos noHavePhoto={noHavePhoto} photos={photos} />
        <UserDetailedEvents
          changeTab={this.changeTab}
          events={events}
          eventsLoading={eventsLoading}
        />
      </Grid>
    );
  }
}
const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = {};
  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }
  return {
    profile,
    userUid,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
    events: state.event,
    eventsLoading: state.async.loading,
    following: state.firestore.ordered.following,
  };
};
const actions = {
  getUserEvents,
  followUser,
  unfollowUser,
};

export default compose(
  connect(mapState, actions),
  firestoreConnect((auth, userUid, match) =>
    UserDetailedQuery(auth, userUid, match)
  )
)(UserDetailedPage);
