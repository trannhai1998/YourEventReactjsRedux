import React from 'react';
import { Form, Segment, Button, Label } from 'semantic-ui-react';
import {connect} from 'react-redux';
import { registerUser } from './../AuthActions'
import { Field, reduxForm } from 'redux-form';
import TextInput from './../../../app/common/form/TextInput';
import { combineValidators, isRequired , } from 'revalidate';


const validate = combineValidators({
  displayName : isRequired('displayName'),
  email : isRequired('email'),
  password : isRequired('password'),
})


const RegisterForm = ({ handleSubmit , registerUser, error , invalid , submitting}) => {
  return (
    <div>
      <Form size="large" onSubmit={handleSubmit(registerUser)} > 
        <Segment>
          <Field
            name="displayName"
            type="text"
            component={TextInput}
            placeholder="Nhập Tên Của Bạn ..."
          />
          <Field
            name="email"
            type="text"
            component={TextInput}
            placeholder="Nhập Email "
          />
          <Field
            name="password"
            type="password"
            component={TextInput}
            placeholder="Nhập Password"
          />
          {error &&<Label color='red' basic >{error}</Label>}
          <Button disabled={invalid || submitting} style={{marginTop : '10px'}} fluid size="large" color="teal">
            Register
          </Button>
        </Segment>
      </Form>
    </div>
  );
};

const actions = {
  registerUser
}

export default connect(null,actions)(reduxForm({form : "registerForm" ,validate})(RegisterForm));