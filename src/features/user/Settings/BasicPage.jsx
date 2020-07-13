import React, { Component } from "react";
import { Segment, Form, Divider, Button, Label } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import moment from "moment";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import TextInput from "../../../app/common/form/TextInput";
import RadioInput from "./../../../app/common/form/RadioInput";

class Basics extends Component {
  render() {
    const { pristine, submitting, handleSubmit, updateProfile } = this.props;
    return (
      <Segment>
        <Label color="red" style={{ fontSize: "20px" }} ribbon>
          Basics
        </Label>
        <Divider />
        <Form onSubmit={handleSubmit(updateProfile)}>
          <Form.Group inline>
            <Label
              color="teal"
              content="Tên Của Bạn :"
              style={{ marginRight: "10px" }}
            />
            <Field
              width={8}
              name="displayName"
              type="text"
              component={TextInput}
              placeholder="Your Name"
            />
          </Form.Group>
          <Form.Group inline>
            <Label
              color="teal"
              content="Gender :"
              style={{ marginRight: "10px" }}
            />
            <Field
              type="radio"
              name="gender"
              value="male"
              label="Male"
              component={RadioInput}
            ></Field>
            <Field
              type="radio"
              name="gender"
              value="female"
              label="Female"
              component={RadioInput}
            ></Field>
          </Form.Group>
          <Form.Group inline>
            <Label
              color="teal"
              content="Ngày Sinh :"
              style={{ marginRight: "10px" }}
            />
            <Field
              width={8}
              name="dateOfBirth"
              component={DateInput}
              dateFormat="MMM dd yyyy"
              placeholder="Date of Birth"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </Form.Group>

          <Form.Group inline>
            <Label
              color="teal"
              content="Địa Chỉ :"
              style={{ marginRight: "10px" }}
            />
            <Field
              width={11}
              name="city"
              placeholder="Home Town"
              options={{ types: ["(cities)"] }}
              component={PlaceInput}
            />
          </Form.Group>
          <Divider />
          <Button
            disabled={pristine || submitting}
            size="large"
            positive
            content="Update Profile"
          />
        </Form>
      </Segment>
    );
  }
}
export default reduxForm({
  form: "userProfile",
  enableReinitialize: true,
  destroyOnUnmount: false,
})(Basics);
