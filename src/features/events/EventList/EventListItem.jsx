import React, { Component } from "react";
import { Segment, Item, Icon, List, Button, Label } from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import { ObjectToArray } from "./../../../app/util/helpers";
import isToday from 'date-fns/is_today';
import isPast from 'date-fns/is_past';

class EventListItem extends Component {
  render() {
    const { event} = this.props;
    const istoday = isToday(event.date);
    const ispast = isPast(event.date);
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/event/${event.id}`}>
                  {event.title}
                </Item.Header>
                <Item.Description>
                  Hosted by{" "}
                  <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
                </Item.Description>
                {event.cancelled && (
                  <Label
                    style={{ top: "-50px" }}
                    ribbon="right"
                    color="red"
                    content="This event has been Cancelled"
                  />
                )}
                {!event.cancelled && istoday && (
                  <Label
                    style={{ top: "-50px" }}
                    ribbon="right"
                    color="teal"
                    content="This event is coming soon in Today"
                  />
                )}
                {!event.cancelled && ispast && (
                  <Label
                    style={{ top: "-50px" }}
                    ribbon="right"
                    color="orange"
                    content="This event was happened"
                  />
                )}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {format(event.date, "dddd Do MMMM")} at{" "}
            {format(event.date, "HH:mm")} |
            <Icon name="marker" />
            {event.venue}
          </span>
        </Segment>
        <Segment secondary>
          <List horizontal>
            {event.attendees &&
              ObjectToArray(event.attendees).map(attendee => (
                <EventListAttendee key={attendee.id} attendee={attendee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>
          <Button
            as={Link}
            to={`/event/${event.id}`}
            color="teal"
            floated="right"
            content="View"
          />
        </Segment>
      </Segment.Group>
    );
  }
}
export default EventListItem;
