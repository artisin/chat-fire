import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { reduxForm, Field } from 'redux-form';
import { Button, Form, Container, Dropdown, Segment, Divider, Icon } from 'semantic-ui-react';
import { push } from 'react-router-redux';
import { getGroupFromUrl } from '../lib/util';
import { userFriendQuery } from './action.query';
import { updateGroupMutation, deleteGroupMutation } from './action.mutation';
import { modalAction } from '../modal/action.js';


const CircleDivider = () => <Divider horizontal><Icon disabled name='genderless' /></Divider>;



class ChatNew extends Component {
  componentWillMount() {
    this.setState({
      init: false,
      initDropdown: false,
      dropdownValues: [],
      initState: {},
    });
  }


  /**
   * Error modal action
   * @param  {str} msg -> error message
   */
  error(msg) {
    this.props.modalAction({
      modalOpen: true,
      title: 'Server Error',
      icon: 'exclamation triangle',
      errorMsg: msg,
      content: `Try again in a minute, however, if the
      error persist please contact us at contact@email.com`,
      negButtonShow: false,
      posButtonText: 'Ok',
    });
  }


  /**
   * Sucsess modal action
   * @param  {str} options.name -> name of group
   */
  sucsess({name}) {
    const self = this;
    self.props.modalAction({
      modalOpen: true,
      title: 'Success',
      content: `Your new ${name} group was successfully edited!`,
      negButtonText: 'Edit Again',
      posButtonText: 'Go To Chat List',
      posButtonFn: () => {
        return () => {
          self.props.modalAction({modalOpen: false});
          this.props.dispatch(push('/chat'));
        };
      },
    });
  }


  /**
   * Delete mutation action
   */
  deleteGroup() {
    const self = this;
    const props = self.props;
    const name = this.state.initState.name;
    self.props.modalAction({
      modalOpen: true,
      title: 'Are You Sure?',
      content: `You are about to delete the ${name} group? Once you delete it will be gone forever!`,
      negButtonText: 'Cancel!',
      posButtonText: 'Yes, Delete',
      posButtonFn: () => {
        return () => {
          props.deleteGroup({
            id: self.state.groupId,
            userId: self.props.client.userId,
          }).then((res) => {
            if (!res.errors) {
              self.props.modalAction({modalOpen: false});
              this.props.dispatch(push('/chat'));
            }else {
              self.props.modalAction({modalOpen: false});
              self.error(res.errors);
            }
          }).catch((e) => {
            self.props.modalAction({modalOpen: false});
            self.error(e.message);
          });
        };
      },
    });
  }


  /**
   * Edit mutation action
   */
  edit(val) {
    const self = this;
    const props = this.props;
    props.updateGroup({
      ...val,
      id: self.state.groupId,
      userId: self.props.client.userId
    }).then((res) => {
      if (!res.errors) {
        props.reset();
        props.blur();
        self.sucsess({...val});
      }else {
        self.error(res.errors);
      }
    }).catch((e) => {
      self.error(e.message);
    });
  }


  /**
   * Basic feild validation
   * @param  {str} val -> field value
   */
  validateInput = (val) => {
    return val ? undefined : 'Reply Required';
  }


  /**
   * Checks for duplicates
   * @param  {str} val -> field value
   */
  validateDuplicate = (val) => {
    let res = undefined;
    if (this.props.groups) {
      this.props.groups.forEach((group) => {
        if (group === val) {
          res = 'Chat Group Already Exists!';
        }
      });
    }
    return res;
  }


  /**
   * Creates/renders field forms for name + desc of groups
   */
  renderField = ({ input, label, type, placeholder, meta: { touched, error } }) => (
    <div>
      <Form.Field>
        <label>{label}</label>
        <input {...input} type={type} placeholder={placeholder} />
        {touched && error && (
          <div style={{ color: '#cc7a6f', margin: '5px 5px 5px', fontSize: '0.7rem' }}>
            {error}
          </div>)
        }
      </Form.Field>
    </div>
  )


  /**
   * Creates/renders dropdown for friend selection
   */
  renderDropdown = ({friends, loading, dropdownValues}) => {
    const self = this;
    //adds dropdown fiends values to redux-form state
    const handleChange = (prox, { value }) => {
      self.props.change('userIds', value);
      self.setState({dropdownValues: value, initDropdown: true, hasChanges: true});
    };
    //re-format data
    friends = friends.map((val) => {
      return {
        key: val.id,
        value: val.id,
        text: val.username
      };
    });
    return (
      <div className='friend-dropdown'>
        <label>Add Some Firends</label>
        <Dropdown
          fluid
          multiple
          search
          selection
          value={this.state.initDropdown ? this.state.dropdownValues : dropdownValues}
          loading={loading}
          onChange={handleChange}
          placeholder='Your Friends'
          options={friends} />
      </div>
    );
  }


  /**
   * Sets default values to be eddited
   * @param  {obj} nextProps -> probs to populate
   */
  componentWillReceiveProps (nextProps) {
    if (!this.state.init && nextProps.groups && nextProps.groups.length) {
      //get id from url path
      const id = getGroupFromUrl(this.props.location.pathname);
      //find sepcific group to populate data with
      const groups = nextProps.groups;
      const group = groups.find((val) => {
        if (val.id === id) {
          return val;
        }
      });
      if (group) {
        const dropdownValues = group.users.map(val => val.id);
        this.setState({
          init: true,
          groupId: id,
          initState: {
            name: group.name,
            description: group.description,
            dropdownValues,
          },
        });
        this.props.initialize({...group, userIds: dropdownValues});
      }
    }
  }


  /**
   * Render dat fender
   */
  render() {
    const self = this;
    const {
      handleSubmit,
      loading,
      friends,
    } = this.props;
    const {
      hasChanges,
      initState: {
        dropdownValues,
      }
    } = this.state;
    const onChange = () => self.setState({hasChanges: true});
    return (
      <Container>
        <Segment padded className='group-new-wrap'>
          <Form onChange={onChange}>
            <Field
              name='name'
              type='text'
              className='name-field'
              label='Name Of Group'
              placeholder='My Kool Group'
              component={this.renderField}
              validate={this.validateInput && this.validateDuplicate}
            />

            <CircleDivider/>
            <Field
              name='description'
              type='text'
              className='description-field'
              label='Description Of Group'
              placeholder='Where we talk about Kool thingz.'
              component={this.renderField}
              validate={this.validateInput}
            />

            <CircleDivider/>
            <Field
              name='userIds'
              type='input'
              className='friend-dropdown'
              loading={loading}
              friends={friends}
              dropdownValues={dropdownValues}
              component={this.renderDropdown}
            />

            <div className='button-wrap'>
              <Button
                content='Edit Group'
                labelPosition='left'
                icon='plus'
                disabled={hasChanges ? false : true}
                onClick={handleSubmit(this.edit.bind(this))}
                primary />

              <Button
                content='Delete Group'
                labelPosition='right'
                icon='exclamation triangle'
                onClick={this.deleteGroup.bind(this)}
                color='red' />
            </div>
          </Form>
        </Segment>
      </Container>
    );
  }
}
ChatNew.propTypes = {
  modalAction: PropTypes.func,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
  friends: PropTypes.array,
  handleSubmit: PropTypes.func,
  initialize: PropTypes.func,
  groups: PropTypes.array,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  client: PropTypes.shape({
    userId: PropTypes.number,
  }),
};



const mapStateToProps = ({client}) => {
  return {
    client,
  };
};

const componentWithData = compose(
  connect(mapStateToProps),
  userFriendQuery,
  updateGroupMutation,
  deleteGroupMutation,
  //redux for dispatch
  connect(null, {modalAction})
)(ChatNew);


const formed = reduxForm({
  form: 'group-edit',
})(componentWithData);

export default formed;
