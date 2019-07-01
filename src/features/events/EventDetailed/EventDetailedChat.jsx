import { Segment, Comment, Header, Label } from "semantic-ui-react";
import EventDetailedChatForm from "./EventDetailedChatForm";
import { Link } from "react-router-dom";
import distanceInWords from "date-fns/distance_in_words";
import React, { Component } from "react";


class EventDetailedChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplyFrom: false,
      selectedCommentId : null
    };
  }

  handleOpenFormReply = (id) => () => {
    this.setState({
      showReplyFrom: true,
      selectedCommentId : id
    });
  };

  handleCloseFormReply = () => {
    this.setState({
      showReplyFrom: false
    })
  }
  render() {
    const { addEventComment, eventId, eventChat } = this.props;
    const { showReplyFrom, selectedCommentId } = this.state;
    return (
      <div>
        <Segment
          textAlign="center"
          attached="top"
          inverted
          color="teal"
          style={{ border: "none" }}
        >
          <Header>Chat about this event</Header>
        </Segment>

        <Segment attached>
          <Comment.Group>
            {eventChat &&
              eventChat.map((comment, index) => (
                <Comment key={comment.id}>
                  <Comment.Avatar src={comment.photoURL} />
                  <Comment.Content>
                    <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                      {comment.displayName}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>{distanceInWords(comment.date, Date.now())}</div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.text}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action onClick={this.handleOpenFormReply(comment.id)}>
                        <Label color="teal" content="Reply" />
                      </Comment.Action>
                      {showReplyFrom && selectedCommentId === comment.id && (
                        <EventDetailedChatForm
                          addEventComment={addEventComment}
                          content={'Reply'}
                          eventId={eventId}
                          form={`reply_${comment.id}`}
                          closeForm= {this.handleCloseFormReply}
                          parentId={comment.id}
                        />
                      )}
                    </Comment.Actions>
                  </Comment.Content>

                  {comment.childNodes &&  comment.childNodes.map((child) => (
                    <Comment.Group key={child.id}>
                      <Comment >
                        <Comment.Avatar src={child.photoURL} />
                        <Comment.Content>
                    <Comment.Author as={Link} to={`/profile/${child.uid}`}>
                      {child.displayName}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>{distanceInWords(child.date, Date.now())}</div>
                    </Comment.Metadata>
                    <Comment.Text>{child.text}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action onClick={this.handleOpenFormReply(child.id)}>
                        <Label color="teal" content="Reply" />
                      </Comment.Action>
                      {showReplyFrom && selectedCommentId === child.id && (
                        <EventDetailedChatForm
                          addEventComment={addEventComment}
                          content={'Reply'}
                          eventId={eventId}
                          form={`reply_${child.id}`}
                          closeForm= {this.handleCloseFormReply}
                          parentId={child.parentId}
                        />
                      )}
                      </Comment.Actions>
                      </Comment.Content>
                      </Comment>
                    </Comment.Group>
                  ))}
                </Comment>
              ))}
            <br/>
            <EventDetailedChatForm
              style={{ marginTop: "30px" }}
              addEventComment={addEventComment}
              eventId={eventId}
              content={'Comment'}
              form={'newComment'}
              parentId={0}
            />
          </Comment.Group>
        </Segment>
      </div>
    );
  }
}

export default EventDetailedChat;
