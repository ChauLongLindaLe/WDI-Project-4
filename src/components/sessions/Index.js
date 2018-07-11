import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class SessionsIndex extends React.Component {

  state = {};

  componentDidMount() {
    axios.get(`/api/users/${this.props.match.params.id}/sessions`)
      .then(res => this.setState({ sessions: res.data }));
  }

  render() {
    return(
      <section>
        <h1 className="title is-3">Sessions</h1>
        <div>
          <ul>
            { this.state.sessions && this.state.sessions.map(session =>
              <li key={session._id}>
                <Link to={`/users/${this.props.match.params.id}/sessions/${session._id}`}>
                  {session.title}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </section>
    );
  }
}

export default SessionsIndex;
