/* global google */

import React, { Component } from "react";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Script from "react-load-script";
import { createEvent, updateEvent, cancelToggle } from "../eventActions";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan,
} from "revalidate";
import TextInput from "./../../../app/common/form/TextInput";
import TextArea from "./../../../app/common/form/TextArea";
import SelectedInput from "./../../../app/common/form/SelectedInput";
import DateInput from "./../../../app/common/form/DateInput";
import PlaceInput from "./../../../app/common/form/PlaceInput";
import { withFirestore } from "react-redux-firebase";

const categories = [
  { key: "drink", text: "Drink", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
];

const validate = combineValidators({
  title: isRequired({ message: "The event title is required" }),
  category: isRequired({ message: "please Provide a category" }),
  description: composeValidators(
    isRequired({ message: "Please Enter a description " }),
    hasLengthGreaterThan(4)({
      message: "Description needs to be at least 5 character !",
    })
  )(),
  city: isRequired("city"),
  venue: isRequired("venua"),
  date: isRequired("date Event"),
});
class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false,
  };

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }
  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  handleCitySelect = (selectedCity) => {
    geocodeByAddress(selectedCity)
      .then((results) => getLatLng(results[0]))
      .then((latlng) => {
        this.setState({
          cityLatLng: latlng,
        });
      })
      .then(() => {
        this.props.change("city", selectedCity);
      });
  };
  handleVenueSelect = (selectedVenue) => {
    geocodeByAddress(selectedVenue)
      .then((results) => getLatLng(results[0]))
      .then((latlng) => {
        this.setState({
          venueLatLng: latlng,
        });
      })
      .then(() => {
        this.props.change("venue", selectedVenue);
      });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedEvent !== this.props.selectedEvent) {
      this.setState({
        event: nextProps.selectedEvent || this.props.event,
      });
    }
  }
  onFormSubmit = async (values) => {
    values.venueLatLng = this.state.venueLatLng;
    if (this.props.initialValues.id) {
      values.venueLatLng = this.props.event.venueLatLng;

      await this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      this.props.createEvent(values);
      this.props.history.push("/events");
    }
  };
  handleScriptLoaded = () => {
    this.setState({ scriptLoaded: true });
  };
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.event,
    };
  }
  render() {
    const {
      invalid,
      submitting,
      pristine,
      event,
      cancelToggle,
      loading,
    } = this.props;
    console.log(event);
    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCSV1AmlA-ArhLJz9u0TXS8zQEXt5wmdAU&v=3.exp&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        <Grid.Column width={10}>
          <Segment>
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Header
                sub
                color="teal"
                content="Event Details"
                style={{ fontSize: "20px" }}
              />
              <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Đặt tên cho sự kiện của bạn ..."
              />
              <Field
                name="category"
                type="text"
                component={SelectedInput}
                multiple={true}
                options={categories}
                placeholder="Sự Kiện Về Cái gì ... "
              />
              <Field
                name="description"
                type="text"
                rows={5}
                component={TextArea}
                placeholder="Thông Tin Về Sự Kiện ..."
              />
              <Header
                sub
                color="teal"
                content="Event Location Details"
                style={{ fontSize: "20px" }}
              />
              <Field
                name="city"
                type="text"
                component={PlaceInput}
                options={{ types: ["(cities)"] }}
                placeholder="Thành Phố Tổ Chức..."
                onSelect={this.handleCitySelect}
              />
              {this.state.scriptLoaded && (
                <Field
                  name="venue"
                  type="text"
                  component={PlaceInput}
                  options={{
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000,
                    types: ["establishment"],
                  }}
                  placeholder="Địa Điểm Tổ Chức ..."
                  onSelect={this.handleVenueSelect}
                />
              )}
              <Field
                name="date"
                type="date"
                component={DateInput}
                dateFormat="YYYY-MM-DD HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                placeholder="Thời Gian Tổ Chức ..."
              />
              <Button
                loading={loading}
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>

              <Button
                disabled={loading}
                onClick={this.props.history.goBack}
                type="button"
              >
                Cancel
              </Button>
              {Object.entries(event).length !== 0 &&
                event.constructor === Object && (
                  <Button
                    type="button"
                    color={event.cancelled ? "green" : "red"}
                    floated="right"
                    content={
                      event.cancelled ? "Reactivate Event" : "Cancel Event"
                    }
                    onClick={() => cancelToggle(!event.cancelled, event.id)}
                  />
                )}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapState = (state) => {
  let event = {};
  if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
    event = state.firestore.ordered.events[0];
  }
  return {
    initialValues: event,
    event,
    loading: state.async.loading,
  };
};
const actions = {
  updateEvent,
  createEvent,
  cancelToggle,
};

export default withFirestore(
  connect(
    mapState,
    actions
  )(
    reduxForm({
      form: "eventForm",
      enableReinitialize: true,
      destroyOnUnmount: false,
      validate,
    })(EventForm)
  )
);
