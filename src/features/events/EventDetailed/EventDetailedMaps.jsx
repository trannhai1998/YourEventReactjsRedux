import React from "react";
import { Segment, Icon } from "semantic-ui-react";
import GoogleMapReact from "google-map-react";

const EventDetailedMaps = ({ lat, lng }) => {
  const zoom = 14;
  const center = [lat, lng];
  const Marker = () => <Icon name="marker" size="big" color="red" />;
  return (
    <Segment>
      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyCSV1AmlA-ArhLJz9u0TXS8zQEXt5wmdAU&v=3.exp",
          }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <Marker lat={lat} lng={lng} text="My Marker" />
        </GoogleMapReact>
      </div>
    </Segment>
  );
};

export default EventDetailedMaps;
