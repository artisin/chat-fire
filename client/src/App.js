// import './App.css';
import './App.styl';
import 'semantic-ui-css/semantic.min.css';
import React, {Component} from 'react';
import { Route, Switch, NavLink, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import { Menu } from 'semantic-ui-react';
import Navigation from './navigation';
import Login from './login';
import SignUp from './signup';
import ChatList from './chat-list';
import ChatGroup from './chat-group';
import GroupNew from './group-new';
import GroupEdit from './group-edit';
import NotFound from './lib/NotFound';
import Modal from './modal';



class App extends Component {
  render() {
    const {
      router,
      client,
    } = this.props;
    return (
      <div className='App'>
        <Modal/>
        <section className='App-body'>
          <Navigation pathname={router.location.pathname} />
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/signup' component={SignUp} />
            <Route path='/group/new' component={GroupNew} />
            <Route path='/edit/:id' component={GroupEdit} />
            <Route path='/chat/:id' component={ChatGroup} />
            <Route path='/chat' component={ChatList} />
            <Route component={NotFound} />
          </Switch>
        </section>
      </div>
    );
  }
}



const mapStateToProps = ({router, client}) => {
  return {
    router,
    client,
  };
};

const connected = withRouter(connect(mapStateToProps)(App));

export default connected;
