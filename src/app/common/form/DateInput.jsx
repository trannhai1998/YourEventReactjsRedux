import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";

const DateInput = ({
  input: { value, onBlur, onChange, ...restInput },
  width,
  placeholder,
  meta: { touched, error },
  ...rest
}) => {
  console.log("Value: ", value);
  if (value) {
    if (value.seconds) {
      value = moment(moment(value.seconds * 1000)).toDate();
      console.log(value);
    }
    console.log(value);
  }
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DatePicker
        {...rest}
        placeholderText={placeholder}
        onChange={onChange}
        scrollableYearDropdown
        onBlur={() => onBlur()}
        selected={value ? value : null}
        {...restInput}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
