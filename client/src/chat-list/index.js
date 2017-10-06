import './index.styl';
// import { times } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Container, Loader } from 'semantic-ui-react';
import { compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import ChatGroup from './chat-group';
import { userQuery } from './action.query';


class ChatList extends Component {
  render() {
    const {
      loading,
      user,
      client: {
        userId,
      },
    } = this.props;
    const data = loading ? false : user;
    const numberOfGroups = loading ? 0 : user.groups.length;
    return (
      <Container>
        {loading ? <Loader size='massive' active /> : ''}
        <Link to={{pathname: '/group/new'}}>
          <Button
            color='green'
            content='Create Group'
            icon='comments'
            label={{ basic: true, color: 'green', pointing: 'left', content: numberOfGroups }}
          />
        </Link>
        <Table celled >
          <Table.Body>
            {data ? data.groups.map(({id, ...args}) =>
              <ChatGroup key={id} id={id} userId={userId} {...args} />
            ) : ''}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}
ChatList.propTypes = {
  loading: PropTypes.bool,
  client: PropTypes.shape({
    userId: PropTypes.number,
  }),
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};


const mapStateToProps = ({client}) => ({client});

const componentWithData = compose(
  connect(mapStateToProps),
  userQuery,
)(ChatList);


export default componentWithData;
