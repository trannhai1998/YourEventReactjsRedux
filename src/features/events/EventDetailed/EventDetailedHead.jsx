import React from "react";
import { Header, Segment, Item, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import moment from "moment";

const eventImageStyle = {
  filter: "brightness(30%)",
};

const eventImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

const EventDetailedHead = ({
  event,
  isHost,
  isGoing,
  goingToEvent,
  cancelGoingToEvent,
  loading,
  authenticated,
  openModal,
}) => {
  const category =
    event.category && event.category.length !== 0
      ? event.category[0]
      : event.category;
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={`/assets/categoryImages/${category}.jpg`}
          style={eventImageStyle}
          fluid
        />
        <Segment basic style={eventImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={event.title}
                  style={{ color: "white" }}
                />
                <p>
                  {moment(event.date.seconds * 1000).format("dddd Do MMMM")} at{" "}
                  {moment(event.date.seconds * 1000).format("HH:mm")}
                </p>
                <p>
                  Hosted by <strong>{event.hostedBy}</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom">
        <div>
          {isGoing && !isHost && (
            <Button onClick={() => cancelGoingToEvent(event)}>
              Cancel My Place
            </Button>
          )}

          {!isGoing && authenticated && (
            <Button
              loading={loading}
              color="teal"
              onClick={() => goingToEvent(event)}
            >
              JOIN THIS EVENT
            </Button>
          )}
          {!authenticated && (
            <Button
              loading={loading}
              color="teal"
              onClick={() => openModal("UnAuthModal")}
            >
              JOIN THIS EVENT
            </Button>
          )}
        </div>
        {isHost && (
          <Button as={Link} to={`/manage/${event.id}`} color="orange">
            Manage Event
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default EventDetailedHead;
