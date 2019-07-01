import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Switch,Route,Redirect } from 'react-router-dom';
import SettingsNav from './SettingsNav';
import BasicPage from './BasicPage';
import AboutPage from './AboutPage';
import PhotosPage from './PhotosPage';
import AccountPage from './AccountPage';
import { updatePassword } from './../../auth/AuthActions'
import { connect } from 'react-redux';
import { updateProfile } from './../UserActions'
const SettingDashboard = ({ updatePassword, providerId,user, updateProfile }) => {
  return (
      <Grid>
        <Grid.Column width={12}>
          <Switch>
            <Redirect exact from='/settings' to='/settings/basics'/>
            <Route path='/settings/basics' component={ () => <BasicPage updateProfile={updateProfile} initialValues={ user }  />}/>
            <Route path='/settings/about' component={ () => <AboutPage updateProfile={updateProfile} initialValues={ user }  /> }/>
            <Route path='/settings/photos' component={ PhotosPage }/>
            <Route path='/settings/account' component={() => <AccountPage 
                  updatePassword ={updatePassword}
                  providerId = { providerId }
                   />}/>
          </Switch>
        </Grid.Column>
        <Grid.Column width={4}>
          <SettingsNav/>
        </Grid.Column>
      </Grid>
  )
}

const actions = {
  updatePassword ,
  updateProfile
}
const mapStates = (state) => ({
  providerId : state.firebase.auth.isLoaded && state.firebase.auth.providerData[0].providerId,
  user : state.firebase.profile
})
export default connect(mapStates,actions)(SettingDashboard);
