import React from 'react'
import { Grid, Segment, Header, List, Item, Icon} from 'semantic-ui-react';
import format from 'date-fns/format'
const UserDetailedDescription = ({ profile }) => {
    let createdAt;
    if (profile.createdAt){
        createdAt = format( profile.createdAt, 'D MMM YYYY');
    }
  return (
    <Grid.Column width={12}>
                    <Segment>
                        <Grid columns={2}>
                            <Grid.Column width={10}>
                                <Header icon='smile' content='About Display Name'/>
                                <p>I am a: <strong>{profile.occupation || 'Unknown'}</strong></p>
                                <p>Originally from :<strong>{profile.city || 'not yet update'}</strong></p>
                                <p>Member Since : <strong>{createdAt}</strong></p>
                                <p>{profile.about || "No have Description"}</p>

                            </Grid.Column>
                            <Grid.Column width={6}>

                                <Header icon='heart outline' content='Interests'/>
                                { profile.interests ?
                                <List >
                                { profile.interests && 
                                profile.interests.map((interest,index)=> (
                                    <Item key={index} >
                                        <Icon name='heart'/>
                                        <Item.Content>{interest}</Item.Content>
                                    </Item>
                                ))}
                                </List> : <h2>No Have Interests</h2>}
                               
                            </Grid.Column>
                        </Grid>

                    </Segment>
                </Grid.Column>
  )
}

export default UserDetailedDescription
