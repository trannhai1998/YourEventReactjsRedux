import React, { Component } from "react";
import Script from "react-load-script";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

class TestComponent extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33,
    },
    zoom: 11,
  };
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      scriptLoaded: false,
    };
  }
  handleScriptLoad = () => {
    this.setState({
      scriptLoaded: true,
    });
  };
  handleChange = (address) => {
    this.setState({ address });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    geocodeByAddress(this.state.address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success ", latLng))
      .then((error) => console.error("Error ", error));
  };

  onChange = (address) => {
    this.setState({
      address,
    });
  };

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    };
    return (
      <div>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyAeln-S0wWoC72CQSz_vJlFVRV3bdzXPU8&libraries=places"
          onLoad={this.handleScriptLoad}
        />

        <br />
        <br />
        <form onSubmit={this.handleFormSubmit}>
          {this.state.scriptLoaded && (
            <PlacesAutocomplete inputProps={inputProps} />
          )}

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default TestComponent;
