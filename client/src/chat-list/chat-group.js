import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Table, Button, Header, List, Label } from 'semantic-ui-react';


class ChatGroup extends Component {
  render() {
    const {
      id,
      name,
      description,
      createdAt,
      messages,
      userId,
    } = this.props;
    const openURL = `chat/group-${id}`;
    const editURL = `edit/group-${id}`;
    const messagePrv = messages.length ? {
      from: messages[0].from.id === userId
        ? 'You'
        : messages[0].from.username,
      text: messages[0].text,
      createdAt: messages[0].createdAt,
    } : {
      from: 'No One',
      text: 'No Messages',
      createdAt: new Date(),
    };
    return (
      <Table.Row>
        <Table.Cell collapsing>
          <Header as='h4'>
            <Icon name='group' /> {name}
          </Header>
        </Table.Cell>
        <Table.Cell>
          <Header as='h5'>
            {description}
            <Header.Subheader>
              <List.Item>
                <div className='last-message-cont'>
                  <div className='last-message-label'>
                    <Label size='mini' horizontal>
                      {messagePrv.from}
                      <div className='opacity-60'>
                        {moment(messagePrv.createdAt).startOf('minute').fromNow()}
                      </div>
                    </Label>
                  </div>
                  <div className='last-message-text'>
                    {messagePrv.text}
                  </div>
                </div>
              </List.Item>
            </Header.Subheader>
          </Header>
        </Table.Cell>
        <Table.Cell collapsing textAlign='right'>{moment(createdAt).format('MMM Do YY')}</Table.Cell>
        <Table.Cell collapsing textAlign='right'>
          <Link to={editURL}>
            <Button>Edit</Button>
          </Link>
        </Table.Cell>
        <Table.Cell collapsing textAlign='right'>
          <Link to={openURL}>
            <Button>Open</Button>
          </Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}
ChatGroup.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  age: PropTypes.string,
  createdAt: PropTypes.string,
  description: PropTypes.string,
  messages: PropTypes.array,
  userId: PropTypes.number,
};


export default ChatGroup;
