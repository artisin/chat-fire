import './index.styl';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { reduxForm, Field } from 'redux-form';
import { Button, Form, Container, Dropdown, Segment, Divider, Icon } from 'semantic-ui-react';
import { push } from 'react-router-redux';
import { userFriendQuery } from './action.query';
import { createGroupMutation } from './action.mutation';
import { modalAction } from '../modal/action.js';


/**
 * Helper to create circle/divider between fields
 */
const CircleDivider = () => <Divider horizontal><Icon disabled name='genderless' /></Divider>;


class ChatNew extends Component {
  componentWillMount() {
    this.setState({
      name: '',
      description: '',
      goodToGo: false,
      dropdownValues: [],
    });
  }


  /**
   * Error action modal
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
   * Sucsess actiom modal
   */
  sucsess({name}) {
    const self = this;
    self.props.modalAction({
      modalOpen: true,
      title: 'Success',
      content: `Your new ${name} group was successfully created!`,
      negButtonText: 'Create Another Group',
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
   * Form sumbit handling
   * 1. passes vals to createGroup mutation
   * 2. modal pop-up
   * 3. action of modal
   */
  submit(val) {
    const self = this;
    const props = this.props;
    props.createGroup({
      ...val,
      userId: this.props.client.userId
    }).then((res) => {
      if (!res.errors) {
        self.setState({dropdownValues: []});
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
   * Validates to make sure it has a value
   */
  validateBasic = (val) => {
    return val ? undefined : 'Field Required';
  }


  /**
   * Checks for duplicates
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
   * Controls button disable state, if both fiels button good to go
   */
  onChangeCheck = (event, val) => {
    const self = this;
    const name = event.target.name;
    const check = (elm) =>
      (elm === name && val.length !== 0)
      || self.state[elm].length !== 0;
    const state = {
      [event.target.name]: val,
      goodToGo: check('name') && check('description')
    };
    self.setState(state);
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
  renderDropdown = ({friends, loading}) => {
    const self = this;

    //adds dropdown fiends values to redux-form state
    const handleChange = (prox, { value }) => {
      self.props.change('userIds', value);
      self.setState({dropdownValues: value});
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
          value={self.state.dropdownValues}
          loading={loading}
          onChange={handleChange}
          placeholder='Your Friends'
          options={friends} />
      </div>
    );
  }


  /**
   * Render create new group form
   */
  render() {
    const {
      handleSubmit,
      loading,
      friends,
    } = this.props;
    return (
      <Container>
        <Segment padded className='group-new-wrap'>
          <Form onSubmit={handleSubmit(this.submit.bind(this))}>
            <Field
              name='name'
              type='text'
              className='name-field'
              label='Name Of Group'
              placeholder='My Kool Group'
              onChange={this.onChangeCheck}
              component={this.renderField}
              validate={this.validateBasic && this.validateDuplicate}
            />

            <CircleDivider/>
            <Field
              name='description'
              type='text'
              className='description-field'
              label='Description Of Group'
              placeholder='Where we talk about Kool thingz.'
              onChange={this.onChangeCheck}
              component={this.renderField}
              validate={this.validateBasic}
            />

            <CircleDivider/>
            <Field
              name='userIds'
              type='input'
              className='friend-dropdown'
              loading={loading}
              friends={friends}
              component={this.renderDropdown}
            />

            <div className='button-wrap'>
              <Button
                action='submit'
                disabled={!this.state.goodToGo}
                content='Create Group'
                labelPosition='left'
                icon='plus'
                primary />
            </div>
          </Form>
        </Segment>
      </Container>
    );
  }
}
ChatNew.propTypes = {
  loading: PropTypes.bool,
  friends: PropTypes.array,
  handleSubmit: PropTypes.func,
  dispatch: PropTypes.func,
  modalAction: PropTypes.func,
  groups: PropTypes.array,
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
  createGroupMutation,
  //redux for dispatch
  connect(null, {modalAction})
)(ChatNew);


const formed = reduxForm({
  form: 'group-new'
})(componentWithData);

export default formed;
