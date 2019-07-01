import React from "react";
import { Grid, Segment, Image, Header, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import LazyLoad from "react-lazyload";

const UserDetailedPhotos = ({ photos, noHavePhoto }) => {
  return (
    <Grid.Column width={12}>
      <Segment attached>
        <Header icon="image" content="Photos" />
        <Image.Group size="small">
          {photos &&
            photos.map((photo, index) => (
              <LazyLoad
                key={photo.id}
                height={150}
                placeholder={<Image src="/assets/user.png" />}
              >
                <Image src={photo.url} />
              </LazyLoad>
            ))}
        </Image.Group>
        {noHavePhoto && (
          <Button
            as={Link}
            to="/settings/photos"
            color="orange"
            content="Add Image Hurry "
          />
        )}
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedPhotos;
