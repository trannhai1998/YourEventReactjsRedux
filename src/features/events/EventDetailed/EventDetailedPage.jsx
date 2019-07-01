import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { compose } from "redux";
import EventDetailedHead from "./EventDetailedHead";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { withFirestore, firebaseConnect, isEmpty } from "react-redux-firebase";
import { ObjectToArray } from "./../../../app/util/helpers";
import { goingToEvent, cancelGoingToEvent } from "./../../user/UserActions";
import LoadingComponent from "./../../../app/layout/Loading";
import { addEventComment } from "./../eventActions";
import { createDataTree } from './../../../app/util/helpers';
import { openModal } from './../../modals/ModalsActions';
import { toastr } from 'react-redux-toastr'

class EventDetailedPage extends Component {
  state = {
    initialLoading : true
  }
  async componentDidMount() {
    const { firestore, match } = this.props;
    let event = await firestore.get(`events/${match.params.id}`);
    if (!event.exists){
      toastr.error('Not Fount ', 'Dont have event What you looking For ');
      this.props.history.push('/error');
    }
    await firestore.setListener(`events/${match.params.id}`);
    this.setState({
      initialLoading : false
    })
  }
  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }
  render() {
    const {
      match,
      event,
      auth,
      goingToEvent,
      cancelGoingToEvent,
      requesting,
      addEventComment,
      eventChat,
      loading,
      openModal
    } = this.props;
    const attendees =
      event && event.attendees && ObjectToArray(event.attendees);
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    
    const authenticated = auth.isLoaded && !auth.isEmpty;
     const loading2 = requesting[`events/${match.params.id}`];
    if (loading2 || this.state.initialLoading) return <LoadingComponent inverted={true} />;
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHead
            event={event}
            isHost={isHost}
            isGoing={isGoing}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
            authenticated={authenticated}
            openModal={openModal}
            loading= {loading}
          />
          <EventDetailedInfo event={event} />
          { authenticated && 
          <EventDetailedChat
            eventChat={chatTree}
            addEventComment={addEventComment}
            eventId={event.id}
          />
          }
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailedSidebar  attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapState = (state,ownProps) => {
  let event = {};
  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0];
  }
  return {
    event,
    loading : state.async.loading,
    auth: state.firebase.auth,
    requesting: state.firestore.status.requesting,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) &&
      ObjectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
  };
};
const actions = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal
};
export default compose(
  withFirestore,
  connect(
    mapState,
    actions
  ),
  firebaseConnect(props => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
