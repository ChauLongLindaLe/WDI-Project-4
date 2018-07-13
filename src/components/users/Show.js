import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Auth from '../../lib/Auth';
import Chart from '../charts/Chart';
import _ from 'lodash';


class UsersShow extends React.Component{

  constructor(){
    super();
    this.state={
      errors: {},
      user: {}
    };
  }

  getDisciplines(sessionsData) {
    return _.uniq(sessionsData.map(session => {
      return session.discipline;
    }));
  }

  setChartData(sessionsData, discipline) {

    return {
      labels:

      sessionsData.filter(session => {
        if(session.discipline === discipline) return session;
      }).map(session => {
        return session.date;
      }),


      datasets: this.getDisciplines(sessionsData).map(discipline => {
        return {
          label: discipline,
          backgroundColor: 'rgba(255, 206, 86, 0.6)',
          data: sessionsData.filter(session => {
            if (session.discipline === discipline) return session;
          }).map(obj => {
            return obj.duration;
          })
        };
      })
    };
  }



  setDatasets(sessionsData, discipline) {
    return {
      labels: sessionsData.filter(session => {
        if(session.discipline === discipline) return session;
      }).map(session => {
        return session.date;
      }),
      datasets: [{
        label: discipline,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        data: sessionsData.filter(session => {
          if (session.discipline === discipline) return session;
        }).map(obj => {
          return obj.duration;
        })
      }]
    };
  }


  componentDidMount(){
    axios.get(`/api/users/${this.props.match.params.id}`)
      .then(res => {

        this.setState({
          user: res.data,
          chartData: this.getDisciplines(res.data.sessions).map(discipline => {
            //returns an array of objects with a key labels and the array inside is of the unique dates for that discipline
            return this.setDatasets(res.data.sessions, discipline);
          })
        });
        console.log(this.state.chartData);
      })

      .catch(err => this.setState({ error: err.message }));
  }

  render(){
    if(this.state.error) return <h2 className="title is-2">{this.state.error}</h2>;
    if(!this.state.user) return <h2 className="title">Loading...</h2>;
    return(
      <section className="section">
        <div className="columns is-multiline is-mobile">
          <div className="column is-10">
            <h1 className="title is-3">{this.state.user.username}</h1>
          </div>
          <div className="column is-1">
            <div className="container">
              <Link to={`/users/${Auth.getPayload().sub}/edit`}>
                <button className="edit">
                  <i className="fas fa-pencil-alt   fa-2x"></i>
                  <p className="is-8">Edit Profile</p>
                </button>
              </Link>
            </div>
          </div>
          <div className="column is-10">
            <h5 className="is-5">I was born on:</h5>
            <h2 className="subtitle"><strong>{this.state.user.dob}</strong></h2>
            <h5 className="is-5">My height:</h5>
            <h2 className="subtitle"><strong>{this.state.user.height}</strong> cm</h2>
            <h5 className="is-5">My Weight:</h5>
            <h2 className="subtitle"><strong>{this.state.user.weight}</strong> kilos</h2>
            <h5 className="is-5">Grade:</h5>
            <h2 className="subtitle"><strong>{this.state.user.grade}</strong></h2>
          </div>
          {this.state.chartData &&
            <div className="container text-is-centered">
            </div>
          }

          {this.state.chartData &&
                this.state.chartData.map((chart, index) =>
                  <Chart
                    key={index}
                    data={chart}
                  />
                )}

          <div className="bottomBtn">
            <Link to={`/users/${Auth.getPayload().sub}/edit`}>
              <button className="edit">
                <i className="fas fa-pencil-alt fa-3x"></i>
                <p>Edit Profile</p>
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export default UsersShow;
