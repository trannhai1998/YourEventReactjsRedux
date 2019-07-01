import React, { Component } from "react";
import { Grid, Segment, Header, Card, Label,Input, Icon} from "semantic-ui-react";
import PersonCard from "./PersonCard";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";
class PeopleDashboard extends Component {
  state = {
    isLoading: false,
    results: [],
    value: "",
    valueSelected: ""
  };
  handleResultSelect = (e, { result }) =>
    this.setState({ value: result, valueSelected: result.displayName });
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.displayName);

      this.setState({
        isLoading: false,
        results: _.filter(this.props.allUsers, isMatch)
      });
    }, 300);
  };

  resultRenderer = ({id , photoURL, displayName}) => (
    <Card.Group itemsPerRow={8} stackable>
    {this.state.results &&
      this.state.results.map(result => (
        <PersonCard key={result.id} user={result} />
      ))}
  </Card.Group>
  )
  render() {
    const { followers, following} = this.props;
    const { results, value } = this.state;
    return (
      <Grid>
        <Grid.Column width={16} height={400}>
          <Segment style={{minHeight: '300px'}}>
            <Header dividing content="Search to Make Friend" />
            <Input  onChange={this.handleSearchChange} icon={<Icon name='search' inverted circular link />} placeholder='Search...' />
            <Header dividing  />
            {results && (
                <Card.Group itemsPerRow={8} stackable>
                {results &&
                  results.map(result => (
                    <PersonCard key={result.id} user={result} />
                  ))}
              </Card.Group>
            )}
            {results.length === 0 && value !=='' &&(
                <Label >không Tìm Thấy Thành Viên này</Label>
            )}
            {value === '' && (
              <Label style={{marginTop: '20px'}}>Tìm Kiếm Bạn bè để tham gia nhiều sự kiện hấp dẫn hơn</Label>
            )}
          </Segment>
        </Grid.Column>

        <Grid.Column width={16}>
          <Segment>
            <Header dividing content="People following me" />
            <Card.Group itemsPerRow={8} stackable>
              {followers &&
                followers.map(follow => (
                  <PersonCard key={follow.id} user={follow} />
                ))}
            </Card.Group>
          </Segment>
          <Segment>
            <Header dividing content="People I'm following" />
            <Card.Group
              itemsPerRow={8}
              stackable
              style={{ padding: " 20px 0 20px 0" }}
            >
              {following ? (
                following.map(follow => (
                  <PersonCard key={follow.id} user={follow} />
                ))
              ) : (
                <Label
                  color="teal"
                  as={Link}
                  to={`/events`}
                  content=" Oops . Please Following Somebody else To Make a Rela "
                />
              )}
            </Card.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapState = state => ({
  auth: state.firebase.auth,
  followers: state.firestore.ordered.followers,
  following: state.firestore.ordered.following,
  allUsers: state.firestore.ordered.allUsers
});
const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "followers" }],
      storeAs: "followers"
    },
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "following" }],
      storeAs: "following"
    },
    {
      collection: "users",
      storeAs: "allUsers"
    }
  ];
};
export default compose(
  connect(mapState),
  firestoreConnect(props => query(props))
)(PeopleDashboard);
