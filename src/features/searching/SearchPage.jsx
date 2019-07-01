import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Segment, Search,Grid, Header } from 'semantic-ui-react';
import _ from 'lodash'


class SearchPage extends Component {
    state = {
        results : [],
        value : '',
        isLoading : false
    }
    render() {
        const {loading} = this.props;
        return (
            <Segment>
                    <Search
                        onResultSelect={this.handleResultSelect}
                        style={{width : '300px'}}
                    />
                <Header dividing content="Result Search" />
               <Grid>
                   <Grid.Column width={16}>

                   </Grid.Column>
               </Grid>
            </Segment>
        )
    }
}

const mapState = (state) => {
    loading: state.async.loading
}
export default connect(mapState)(SearchPage);