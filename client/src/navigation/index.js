import './index.styl';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import { Menu } from 'semantic-ui-react';


class Navigation extends Component {
  render() {
    const {
      pathname,
      navigation: {
        title
      },
    } = this.props;
    return (
      <Menu className='menu-cont'>
        <div className='app-title-cont'>
          <h3>{title}</h3>
        </div>
        <NavLink to='/chat' activeClassName='active'>
          <Menu.Item name='browse' active={pathname === '/chat'}>
            Chat
          </Menu.Item>
        </NavLink>


        <Menu.Menu position='right'>
          <NavLink to='/login' activeClassName='active'>
            <Menu.Item name='browse' active={pathname === '/login'}>
              Login
            </Menu.Item>
          </NavLink>

          <NavLink to='/signup' activeClassName='active'>
            <Menu.Item name='browse' active={pathname === '/signup'}>
              Sign Up
            </Menu.Item>
          </NavLink>
        </Menu.Menu>
      </Menu>
    );
  }
}
Navigation.propTypes = {
  pathname: PropTypes.string,
  navigation: PropTypes.shape({
    title: PropTypes.string,
  }),
};


const mapStateToProps = ({navigation}) => {
  return {navigation};
};

export default connect(mapStateToProps)(Navigation);
