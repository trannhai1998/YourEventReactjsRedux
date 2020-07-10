import React from "react";
import { Grid, Segment, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
const UserDetailedSidebar = ({
  isCurrentUser,
  profile,
  followUser,
  isFollowing,
  unfollowUser,
  OpenFormChat,
}) => {
  return (
    <Grid.Column width={4}>
      <Segment>
        {isCurrentUser && (
          <Button
            as={Link}
            to="/settings"
            color="teal"
            fluid
            basic
            content="Edit Profile"
          />
        )}
        {isFollowing && !isCurrentUser && (
          <Button
            onClick={() => unfollowUser(profile)}
            color="green"
            fluid
            basic
            content="Unfollow User"
          />
        )}
        {!isFollowing && !isCurrentUser && (
          <Button
            onClick={() => followUser(profile)}
            color="green"
            fluid
            basic
            content="Follow User"
          />
        )}
        <Button color="teal" content=" Chat " />
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedSidebar;
