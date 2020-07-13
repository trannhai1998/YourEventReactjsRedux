import React, { Component } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { getEventsForDashboard } from "./../eventActions";
import { deleteEvent } from "./../eventActions";
//Import Component
import EventList from "./../EventList/EventList";
import LoadingComponent from "./../../../app/layout/Loading";
import EventActivity from "./../EventActivity/EventActivity";
import EventTop from "./../eventsTop/EventTop";

class EventDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moreEvents: false,
      loadingInitial: true,
      loadedEvents: [],
      contextRef: {},
    };
  }
  async componentDidMount() {
    let next = await this.props.getEventsForDashboard();
    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        loadingInitial: false,
      });
    } else {
      this.setState({
        loadingInitial: false,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.events !== nextProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...nextProps.events],
      });
    }
  }

  getNextEvents = async () => {
    const { events } = this.props;
    let lastEvent = events && events[events.length - 1];
    let next = await this.props.getEventsForDashboard(lastEvent);
    if ((next && next.docs && next.docs.length <= 1) || !next) {
      this.setState({
        moreEvents: false,
      });
    }
  };
  handleContextRef = (contextRef) => this.setState({ contextRef });
  render() {
    const { loading, activities, followings } = this.props;
    const { moreEvents, loadingInitial, loadedEvents, contextRef } = this.state;
    if (loadingInitial) return <LoadingComponent inverted={true} />;
    return (
      <Grid>
        <Grid.Column width={16}>
          <EventTop />
        </Grid.Column>
        <Grid.Column width={10}>
          <div ref={this.handleContextRef}>
            <EventList
              followings={followings}
              onEventOpen={this.HandleOpenEvent}
              events={loadedEvents}
              deleteEvent={this.HandleDeleteEvent}
              loading={loading}
              moreEvents={moreEvents}
              getNextEvents={this.getNextEvents}
            />
          </div>
        </Grid.Column>
        {/* <Grid.Column width={6}>
          <EventActivity
            activities={activities}
            followings={followings}
            contextRef={contextRef}
          />
        </Grid.Column> */}
        <Grid.Column width={10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapState = (state) => {
  return {
    events: state.event,
    loading: state.async.loading,
    activities: state.firestore.ordered.activity,
    followings: state.firestore.ordered.following,
    auth: state.firebase.auth,
  };
};
const Actions = {
  deleteEvent,
  getEventsForDashboard,
};
const query = ({ auth }) => {
  return [
    {
      collection: "activity",
      orderBy: ["timestamp", "desc"],
      limit: 5,
    },
  ];
};
export default connect(
  mapState,
  Actions
)(firestoreConnect((props) => query(props))(EventDashboard));
