import React, { Component } from "react";
import { Form, Label } from "semantic-ui-react";
import Script from "react-load-script";
import PlacesAutocomplete from "react-places-autocomplete";
const styles = {
  autocompleteContainer: {
    zIndex: 1000,
  },
};
class PlaceInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scriptLoader: false,
      address: "",
    };
  }

  handleScriptLoaded = () => this.setState({ scriptLoader: true });
  onChangeAddress = (address) => {
    this.setState((prev) => ({
      ...prev,
      address,
    }));
  };
  render() {
    const {
      input,
      width,
      onSelect,
      placeholder,
      options,
      meta: { touched, error },
    } = this.props;

    return (
      <Form.Field error={touched && !!error} width={width}>
        <Script
          url="https://maps.googleapis.com/maps/api/js?v=weekly&key=AIzaSyC8uPt5LGB9_U0wipyvugntWnyZpuVS4Y0&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        {this.state.scriptLoader && (
          <PlacesAutocomplete
            inputProps={{ ...input, placeholder }}
            options={options}
            onSelect={onSelect}
            styles={styles}
            onChange={this.onChangeAddress}
            value={this.state.address}
          />
        )}
        {touched && error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
      </Form.Field>
    );
  }
}
export default PlaceInput;
