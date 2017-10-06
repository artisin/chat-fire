import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Header, Button, Icon } from 'semantic-ui-react';
import { modalAction } from './action';


class NotificationModal extends Component {
  state = { modalOpen: true }

  handleNeg = () => {
    this.props.modalAction({
      modalOpen: false,
    });
  }

  handlePos = () => {
    this.props.modalAction({
      modalOpen: false,
    });
  }


  render() {
    const {
      modalOpen,
      title,
      icon,
      content,
      errorMsg,
      negButtonText,
      posButtonText,
      negButtonShow,
      posButtonShow,
    } = this.props.modal;
    let {
      negButtonFn,
      posButtonFn,
    } = this.props.modal;

    negButtonFn = negButtonFn ? negButtonFn.apply(this, [this.props.modalAction]) : this.handleNeg.bind(this);
    posButtonFn = posButtonFn ? posButtonFn.apply(this, [this.props.modalAction]) : this.handlePos.bind(this);

    return (
      <Modal open={modalOpen} basic size='small'>
        <Header icon={icon} content={title} />
        <Modal.Content>
          {errorMsg ? <p>{errorMsg}</p> : <span></span>}
          <p>{content}</p>
        </Modal.Content>
        <Modal.Actions>
          {negButtonShow
            ?
            <Button basic color='red' inverted onClick={negButtonFn}>
              <Icon name='remove' /> {negButtonText}
            </Button>
            :
            <span></span>
          }
          {posButtonShow
            ?
            <Button color='green' inverted onClick={posButtonFn}>
              <Icon name='checkmark' /> {posButtonText}
            </Button>
            :
            <span></span>
          }
        </Modal.Actions>
      </Modal>
    );
  }
}
NotificationModal.propTypes = {
  modalAction: PropTypes.func,
  modal: PropTypes.shape({
    modalOpen: PropTypes.bool,
    title: PropTypes.string,
    errorMsg: PropTypes.string,
    icon: PropTypes.string,
    content: PropTypes.string,
    negButtonText: PropTypes.string,
    posButtonText: PropTypes.string,
    posButtonFn: PropTypes.func,
    negButtonFn: PropTypes.func,
    posButtonShow: PropTypes.bool,
    negButtonShow: PropTypes.bool,
  })
};


const mapStateToProps = ({modal}) => {
  return {
    modal,
  };
};


export default connect(mapStateToProps, { modalAction })(NotificationModal);
