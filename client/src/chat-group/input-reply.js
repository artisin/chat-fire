import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Button, Form } from 'semantic-ui-react';
import { compose } from 'react-apollo';
import { createMessage } from './action.mutation';


class InputReply extends Component {
  constructor(props) {
    super(props);
  }

  submit = (message) => {
    const props = this.props;
    this.props.createMessage({
      ...this.props.group,
      text: message.chatReply
    });
    props.reset();
    props.blur();
  }

  validate = (val) => {
    return val ? undefined : 'Reply Required';
  }

  renderReply = ({ input, type, meta: { touched, error } }) => (
    <div>
      {touched && error && (
        <div style={{ color: '#cc7a6f', margin: '-10px 0 15px', fontSize: '0.7rem' }}>
          {error}
        </div>)
      }
      <Form.TextArea {...input} type={type} />
      <Button
        action='submit'
        disabled={this.props.invalid}
        content='Add Reply'
        labelPosition='left'
        icon='edit'
        primary />
    </div>
  )


  render() {
    const {
      handleSubmit,
    } = this.props;
    return (
      <Form reply onSubmit={handleSubmit(this.submit)}>
        <Field
          name='chatReply'
          type='text'
          id='name'
          className='name'
          component={this.renderReply}
          validate={this.validate}
        />
      </Form>
    );
  }
}
InputReply.propTypes = {
  handleSubmit: PropTypes.func,
  group: PropTypes.object,
  createMessage: PropTypes.func,
};



const componentWithData = compose(
  createMessage,
  // connect(),
)(InputReply);


const formed = reduxForm({
  form: 'chat-reply'
})(componentWithData);

export default formed;
