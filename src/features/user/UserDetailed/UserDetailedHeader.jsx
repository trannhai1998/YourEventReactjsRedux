import React from "react";
import { Grid, Segment, Item, Header, Label } from "semantic-ui-react";
import differenceInYears from "date-fns/difference_in_years";
const UserDetailedHeader = ({ profile }) => {
  let age;
  if (profile.dateOfBirth) {
    age = differenceInYears(Date.now(), profile.dateOfBirth);
  } else {
    age = "Unknown Age";
  }
  return (
    <Grid.Column width={16}>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              avatar
              size="small"
              src={profile.photoURL || "/assets/user.png"}
            />
            <Item.Content verticalAlign="bottom">
              <Label  style={{fontSize: '20px', marginBottom: '30px'}} color='teal' as="h1">{profile.displayName}</Label>
              <br />
              <Header as="h3" style={{ marginBottom: '10px'}}>
                {profile.occupation || "Unknown Occupation"}
              </Header>
              <br />
              <Header as="h3">{`${age}, ${profile.city ||
                "Unknown City"} `}</Header>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedHeader;
