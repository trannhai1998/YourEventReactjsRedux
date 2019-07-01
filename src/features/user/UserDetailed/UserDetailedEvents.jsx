import React from "react";
import {
  Grid,
  Segment,
  Card,
  Image,
  Header,
  Tab
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

const panes = [
  { menuItem: "All Events", pane: { key: "allEvents" } },
  { menuItem: "Past Events", pane: { key: "passEvents" } },
  { menuItem: "Future Events", pane: { key: "futureEvents" } },
  { menuItem: "Hosting Events", pane: { key: "hostingEvents" } }
];


const UserDetailedEvents = ({ events, eventsLoading, changeTab }) => {
  let events2 = events.filter( event => event.title)
  return (
    <Grid.Column width={12}>
      <Segment attached loading={eventsLoading}>
        <Header icon="calendar" content="Events" />
        <Tab
          panes={panes}
          menu={{ secondary: true, pointing: true }}
          style={{ marginBottom: "10px" }}
          onTabChange={(e, data) => {
            changeTab(e, data);
          }}
        />

        <Card.Group itemsPerRow={5}>
          {events2 &&
            events2.map(event => (
              <Card key={event.id} as={Link} to={`/event/${event.id}`}>
                <Image
                  src={`/assets/categoryImages/${
                    event.category &&
                    event.category.length >= 2
                      ? event.category[0]
                      : event.category
                  }.jpg`}
                />
                <Card.Content>
                  <Card.Header textAlign="center">{event.title}</Card.Header>
                  <Card.Meta textAlign="center">
                    <div>{format(event.date && event.date, "h:mm A")}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
        </Card.Group>
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedEvents;
