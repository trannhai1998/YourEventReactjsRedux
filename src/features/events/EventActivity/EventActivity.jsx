import React from "react";
import { Header, Segment, Feed, Sticky } from "semantic-ui-react";
import EventActivityItems from "./EventActivityItems";
const EventActivity = ({ activities, contextRef, followings}) => {
  return (
    <Sticky context={contextRef} offset={100}>
      <Header attached="top" content="Recent Activity" />
      <Segment attached >
        <Feed>
          {activities &&
            activities.map(
              activity =>
                followings &&
                followings.map(
                  following =>
                    activity.hostUid === following.id && (
                      <EventActivityItems
                        key={activity.id}
                        activity={activity}
                      />
                    )
                )
            )}
        </Feed>
      </Segment>
    </Sticky>
  );
};

export default EventActivity;
