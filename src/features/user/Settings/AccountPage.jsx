import React from 'react';
import { Segment, Header, Form, Divider, Label, Button, Icon } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import {
  combineValidators, matchesField , isRequired , composeValidators,hasLengthGreaterThan ,
  hasLengthLessThan
} from 'revalidate';
import TextInput from '../../../app/common/form/TextInput';

const validate = combineValidators({
  newPassword1 :  composeValidators(
    isRequired({message : ' Please Enter Your Password '}),
    hasLengthLessThan(14)({
      message : 'Password be 14 characters or less.'
    }),
    hasLengthGreaterThan(5)({
      message : 'Password be 6 characters or more.'
    })
    )(),
  newPassword2 : composeValidators(
    isRequired({message : 'Please Confirm Your new Password'}),
    matchesField('newPassword1')({message : 'Your Passwords do not MATCH '})
  )()
})

const AccountPage = ({ error, updatePassword,handleSubmit, providerId }) => {
  return (
    <Segment>
      <Header dividing size="large" content="Account" />
      { providerId && providerId === 'password' &&
      <div>
        <Header color="teal" sub content="Change password" />
        <p>Use this form to update your account settings</p>
        <Form onSubmit={ handleSubmit(updatePassword) }>
          <Field
            width={8}
            name="newPassword1"
            type="password"
            pointing="left"
            inline={true}
            component={TextInput}
            basic={true}
            placeholder="New Password"
          />
          <Field
            width={8}
            name="newPassword2"
            type="password"
            inline={true}
            basic={true}
            pointing="left"
            component={TextInput}
            placeholder="Confirm Password"
          />
          {error && (
            <Label basic color="red">
              {error}
            </Label>
          )}
          <Divider />
          <Button size="large" positive content="Update Password" style={{marginBottom : '15px'}} />
        </Form>
      </div>
      }

      { providerId && providerId === 'facebook.com' && 
      <div>
        <Header color="teal" sub content="Facebook Account"  />
        <p style={{marginBottom : '10px'}}>Please visit Facebook to update your account settings</p>
        <Button type="button" color="facebook" style={{marginBottom : '20px'}}>
          <Icon name="facebook" />
          Go to Facebook
        </Button>
      </div>
      }

      { providerId && providerId === 'google.com' && 
      <div>
        <Header color="teal" sub content="Google Account" />
        <p>Please visit Google to update your account settings</p>
        <Button type="button" color="google plus">
          <Icon name="google plus" />
          Go to Google
        </Button>
      </div>
      }
    </Segment>

  );
};

export default reduxForm({ form: 'account',validate })(AccountPage);