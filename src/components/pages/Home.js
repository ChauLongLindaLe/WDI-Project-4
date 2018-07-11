import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../lib/Auth';

class Home extends React.Component {

  state={

  }

  render() {
    return <div>
      <section className="hero is-primary is-fullheight header-image">
        <div className="hero-head">
        </div>
        <div className="hero-body">
          <div className="container home-container has-text-left">
            <h1 className="title">
              kendo.io
            </h1>
            <h2 className="subtitle">
              Focus on being better than you were yesterday
            </h2>
            {!Auth.isAuthenticated() && <Link className="navbar-item" to="/register"><i className="fas fa-arrow-alt-circle-right fa-5x"></i></Link>}
            {Auth.isAuthenticated() && <Link className="navbar-item" to={`/users/${Auth.getPayload().sub}`}><i className="fas fa-arrow-alt-circle-right fa-5x"></i></Link>}

          </div>
        </div>
      </section>
    </div>;
  }
}

export default Home;
