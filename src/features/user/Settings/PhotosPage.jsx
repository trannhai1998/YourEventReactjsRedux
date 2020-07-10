import React, { Component } from "react";
import {
  Image,
  Segment,
  Header,
  Divider,
  Grid,
  Button,
  Card,
  Icon,
  Label,
} from "semantic-ui-react";
import Dropzone from "react-dropzone";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import {
  uploadProfileImage,
  deletePhoto,
  setMainPhoto,
} from "./../UserActions";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";

class PhotosPage extends Component {
  state = {
    files: [],
    fileName: "",
    cropResult: null,
    image: {},
  };
  onDrop = (files) => {
    this.setState({
      files,
      fileName: files[0].name,
    });
  };
  cropImage = () => {
    if (typeof this.refs.cropper.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.refs.cropper.getCroppedCanvas().toBlob((blob) => {
      let imageUrl = URL.createObjectURL(blob);
      this.setState({
        cropResult: imageUrl,
        image: blob,
      });
    }, "image/jpeg");
  };

  uploadImage = async () => {
    try {
      await this.props.uploadProfileImage(
        this.state.image,
        this.state.fileName
      );
      this.cancelCrop();
      toastr.success("Success ", " Photo has been Updated ");
    } catch (error) {
      toastr.error(error.message);
    }
  };
  cancelCrop = () => {
    this.setState({
      files: [],
      image: {},
    });
  };

  HandlePhotoDelete = (photo) => () => {
    try {
      this.props.deletePhoto(photo);
      toastr.success("Success ", " Photo has been Deleted ");
    } catch (error) {
      toastr.error(error.message);
    }
  };
  HandleSetMainPhoto = (photo) => async () => {
    try {
      await this.props.setMainPhoto(photo);
      toastr.success("Success ", " Main Photo has been Updated");
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const { photos, profile, loading } = this.props;
    const { files, cropResult } = this.state;
    let filteredPhotos;
    if (photos) {
      filteredPhotos = photos.filter((photo) => {
        return photo.url !== profile.photoURL;
      });
    }
    return (
      <Segment>
        <Label color="teal" style={{ fontSize: "20px" }} ribbon>
          Your Photos
        </Label>
        <Grid>
          <Grid.Row />
          <Grid.Column width={4}>
            <Header
              color="teal"
              sub
              content="Step 1 - Add Photo"
              style={{ marginBottom: "10px" }}
            />
            <Dropzone onDrop={this.onDrop} multiple={false}>
              <div
                style={{
                  paddingTop: "30px",
                  textAlign: "center",
                }}
              >
                <Icon name="upload" size="huge" />
                <Header content="Drop image here or click to add" />
              </div>
            </Dropzone>
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header
              sub
              color="teal"
              content="Step 2 - Resize image"
              style={{ marginBottom: "10px" }}
            />
            {files[0] && (
              <Cropper
                style={{
                  height: 200,
                  width: "100%",
                }}
                ref="cropper"
                src={files[0].preview}
                aspectRatio={1}
                viewMode={0}
                dragMode="move"
                guides={false}
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                crop={this.cropImage}
              />
            )}
          </Grid.Column>

          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header
              sub
              color="teal"
              content="Step 3 - Preview and Upload"
              style={{ marginBottom: "10px" }}
            />

            {files[0] && (
              <div>
                <Image
                  style={{
                    minHeight: "200px",
                    minWidth: "200px",
                  }}
                  src={cropResult}
                />
                <Button.Group>
                  <Button
                    loading={loading}
                    onClick={this.uploadImage}
                    style={{ width: "100px" }}
                    positive
                    icon="check"
                  />
                  <Button
                    disabled={loading}
                    onClick={this.cancelCrop}
                    style={{ width: "100px" }}
                    icon="close"
                  />
                </Button.Group>
              </div>
            )}
          </Grid.Column>
        </Grid>

        <Divider />
        <Label
          color="teal"
          style={{ fontSize: "20px", marginBottom: "20px" }}
          ribbon
        >
          All Photos
        </Label>

        <Card.Group itemsPerRow={5}>
          <Card>
            <Image src={profile.photoURL || "/assets/user.png"} />
            <Button positive>Main Photo</Button>
          </Card>
          {photos &&
            filteredPhotos.map((photo) => (
              <Card key={photo.id}>
                <Image src={photo.url} />
                <div className="ui two buttons">
                  <Button
                    loading={loading}
                    onClick={this.HandleSetMainPhoto(photo)}
                    basic
                    color="green"
                  >
                    Main
                  </Button>
                  <Button
                    onClick={this.HandlePhotoDelete(photo)}
                    basic
                    icon="trash"
                    color="red"
                  />
                </div>
              </Card>
            ))}
        </Card.Group>
      </Segment>
    );
  }
}
const actions = {
  uploadProfileImage,
  deletePhoto,
  setMainPhoto,
};
const mapState = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  photos: state.firestore.ordered.photos,
  loading: state.async.loading,
});
const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "photos" }],
      storeAs: "photos",
    },
  ];
};
export default compose(
  connect(mapState, actions),
  firestoreConnect((auth) => query(auth))
)(PhotosPage);
