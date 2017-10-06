import './index.styl';
import { throttle, debounce } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import randomColor from 'randomcolor';
import {Container, Loader } from 'semantic-ui-react';
import { compose } from 'react-apollo';
import { groupQuery } from './action.query';
import Message from './message';
import InputReply from './input-reply';
import { changeTitle } from '../navigation/action';
require('smoothscroll-polyfill').polyfill();


class ChatGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: {},
      scrollComplete: false,
      lastNode: null,
    };
    this.scrollFetchEvent = this.scrollFetchEvent.bind(this);
    this.scrollToLastMessage = debounce(this.scrollToLastMessage.bind(this), 300);
  }


  /**
   * Scrolls to the last NEW message
   */
  scrollToLastMessage() {
    const self = this;
    if (this.node && this.node.scrollIntoView) {
      const parent = this.parentNode;
      const node = this.node;
      const contPost = parent.getBoundingClientRect();
      const msgPos = node.getBoundingClientRect();
      const scrollPos = parent.scrollHeight - (parent.scrollTop + parent.getBoundingClientRect().height);
      if (msgPos.bottom > contPost.bottom) {
        //this if gate ensures we don't scroll to the bottom of the screen
        //when we fetch more messages or other state changes. It will only
        //scroll into view on init load or if a new message has been posted
        //and the uses is near/at the bottom of the scroll container
        if (!this.state.scrollComplete || (this.state.lastNode !== node && scrollPos < (parent.scrollHeight / 2.5))) {
          node.scrollIntoView({behavior: 'smooth'});
          this.setState({lastNode: node});
          //since there's no callback or completeion trigger for scrollIntoView
          //we have to use this janky setTimeout
          setTimeout(() => self.setState({scrollComplete: true}), 200);
        }
      }
    }
  }


  /**
   * Fetches more messages if user scroll to top of parentNode container
   */
  scrollFetchEvent() {
    const parent = this.parentNode;
    //fetmore when 300px away from top
    if (this.state.scrollComplete && parent.scrollTop < 300) {
      this.props.fetchMoreMessages();
    }
  }


  /**
   * Adds scroll event for pagnation/fetch more
   */
  componentDidMount() {
    const parentNode = this.parentNode;
    parentNode.addEventListener('scroll', throttle(this.scrollFetchEvent, 200));
  }


  /**
   * Check to see if we should scroll to new last message
   */
  componentDidUpdate() {
    this.scrollToLastMessage();
  }

  /**
   * Reset state/change title
   */
  componentWillUnmount() {
    //reset state so that if/when the user return it scrolls backinto view
    this.setState({
      scrollComplete: false,
      lastNode: null,
    });
    //set app title back to default
    this.props.changeTitle('Chat Fire');
  }


  /**
   * Generates the color groups for the chat messages
   * @param  obj nextProps
   */
  createColorGroup(nextProps) {
    const colors = {};
    if (nextProps.group.users) {
      //update title
      this.props.changeTitle(nextProps.group.name);
      //set colors
      nextProps.group.users.forEach((user) => {
        colors[user.username] = this.state.colors[user.username] || randomColor();
      });
      this.setState({
        colors
      });
    }
  }


  /**
   * sets up the ws subscription in action.query.js
   * @param  {obj} nextProps
   */
  apolloSubscription(nextProps) {
    //no need to resubscribe on change of the props sicne it never happens
    if (!this.subscription) {
      this.subscription = this.props.subscribeToNewMessages(nextProps);
    }
  }


  /**
   * Creates colors for groups
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.group) {
      this.createColorGroup(nextProps);
      this.apolloSubscription(nextProps);
    }
  }


  /**
   * Formats the messages to be displayed and consumbed by the
   * Message component
   * @param  {arr} messages -> arrar of messages from query
   * @return {arr}          -> formated messages
   */
  formatMessages(messages) {
    const self = this;
    return messages.map((val) => {
      const {username} = val.from;
      const color = self.state.colors[username];
      const isCurrentUser = val.from.id === 1;
      return {
        color,
        isCurrentUser,
        message: {
          ...val,
          from: {
            username
          }
        }
      };
    });
  }


  /**
   * Render
   */
  render() {
    const self = this;
    const {
      loading,
      group,
    } = this.props;
    const data = loading ? [] : this.formatMessages(group.messages);
    return (
      <Container className='chat-group-cont'>
        {loading ? <Loader size='massive' active /> : ''}
        <div className='chat-message-cont' ref={node => self.parentNode = node}>
          {data.reverse().map((val) => <Message key={val.message.id} {...val} assignRef={self}/>)}
        </div>
        <div className='chat-reply-cont'>
          <InputReply group={{id: group ? group.id : null, userId: 1}} />
        </div>
      </Container>
    );
  }
}
ChatGroup.propTypes = {
  loading: PropTypes.bool,
  group: PropTypes.object,
  changeTitle: PropTypes.func,
  fetchMoreMessages: PropTypes.func,
  subscribeToNewMessages: PropTypes.func,
};



const componentWithData = compose(
  groupQuery,
  connect(null, {changeTitle}),
)(ChatGroup);


export default componentWithData;

