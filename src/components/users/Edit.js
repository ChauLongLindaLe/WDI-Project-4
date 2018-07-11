import React from 'react';
import axios from 'axios';
import Auth from '../../lib/Auth';

import UsersForm from './Form';

class UsersEdit extends React.Component{
  state ={
    errors: {},
    user: {}
  }

  componentDidMount() {
    axios.get(`/api/users/${this.props.match.params.id}`)
      .then(res => {
        this.setState({user: res.data});
      })
      .catch(err => this.setState({ error: err.message }));
  }

  handleChange=({ target: { name, value }})=> {
    console.log(name, 'name');
    console.log(value, 'value');
    const newState = { ...this.state.user, [name]: value};
    console.log(newState);
    this.setState({ user: newState });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios({
      url: `/api/users/${this.props.match.params.id}`,
      method: 'PUT',
      data: this.state.user,
      headers: { Authorization: `Bearer ${Auth.getToken()}`}
    })
      .then(() => this.props.history.push(`/users/${Auth.getPayload().sub}`))
      .catch(err => this.setState({errors: err.response.data.errors}));
  }

  render(){
    return(
      <UsersForm
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        data={this.state.user}
        errors={this.state.errors}
      />
    );
  }
}

export default UsersEdit;
