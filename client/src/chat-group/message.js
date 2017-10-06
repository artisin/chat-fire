import React, { Component } from 'react';
import moment from 'moment';
// import { times } from 'lodash';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
// import randomColor from 'randomcolor';
// import { reduxForm, Field } from 'redux-form';
// import { Icon, Table, Button, Form } from 'semantic-ui-react';


class Message extends Component {
  constructor(props) {
    super(props);
  }

  conditionalStyles(isCurrentUser) {
    const background = isCurrentUser ? '#2ecc71' : '#eee';
    const float = isCurrentUser ? 'right' : 'left';
    return {background: background, float: float};
  }

  render() {
    const {
      color,
      isCurrentUser,
      assignRef,
      message: {
        createdAt,
        text,
        from: {
          username
        }
      }
    } = this.props;

    const styles = this.conditionalStyles(isCurrentUser);
    return (
      <div className='message-cont' ref={node => assignRef.node = node}>
        <div className='message-wrap' style={styles}>
          <div className='username' style={{color}}>{username}</div>
          <div className='text'>{text}</div>
          <div className='created-at'>{moment(createdAt).startOf('minute').fromNow()}</div>
        </div>
      </div>
    );
  }
}
Message.propTypes = {
  color: PropTypes.string,
  isCurrentUser: PropTypes.bool,
  assignRef: PropTypes.any,
  message: PropTypes.shape({
    createdAt: PropTypes.string,
    text: PropTypes.string,
    from: PropTypes.shape({
      username: PropTypes.string,
    })
  })
};



export default Message;

