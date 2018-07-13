import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import Auth from '../../lib/Auth';
import Chart from '../charts/Chart';


class UsersShow extends React.Component{

  constructor(){
    super();
    this.state={
      isHidden: true,
      errors: {},
      user: {}
    };
  }

  getDisciplines(sessionsData) {
    //Using lodash we iterate of the sessions from the user and return all the unique values from the key discipline
    return _.uniq(sessionsData.map(session => {
      return session.discipline;
    }));
  }

  getKeyData(sessionsData, discipline, key) {
    return sessionsData
      //Return only the session that match the discipline
      .filter(session => {
        if(session.discipline === discipline) return session;
      })
      //Organise from oldest to newest dates
      .sort((a,b) => {
        return new Date(a.date) - new Date(b.date) ;
      })
      //Return only the data from session object from key provided
      .map(session => {
        return session[key];
      });
  }

  setDatasets(sessionsData, discipline) {
    //We return an object with the data laid out in the way that chartjs wants to receive it.
    //We take the discipline passed to by setChartData to define which discipline we are creating a chart for.
    //We also pass discipline through to getKeyData for us to the be able to extract specific pieces of data from the sessions array.
    return {
      labels: this.getKeyData(sessionsData, discipline, 'date'),
      datasets: [{
        label: discipline,
        backgroundColor:
        ['rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'],
        data: this.getKeyData(sessionsData, discipline, 'duration')
      }]
    };
  }

  setChartData(sessionsData) {
    //We use getDisciplines to go through sessionsData and return an array of unique disciplines.
    //We then map over it so that we can pass each discipline down to setDatasets.
    return this.getDisciplines(sessionsData).map(discipline => {
      return this.setDatasets(sessionsData, discipline);
    });
  }

  setImage(label, index) {
    switch(label) {
      case 'Kata':
        return ([<img src="https://i.imgur.com/ojsP9fT.png" key="kata" alt="kata"/>]);
      case 'Keiko':
        return ([<img src="https://i.imgur.com/rRAdVQL.png" key="keiko" alt="keiko"/>]);
      case 'Shiai':
        return ([<img src="https://i.imgur.com/1Wk6N6z.png" key="shiai" alt="shiai"/>]);
      case 'Jodan':
        return ([<img src="https://i.imgur.com/7Xc3Gml.png" key="jodan" alt="jodan"/>]);
      case 'Nito':
        return ([<img src="https://i.imgur.com/deWDhqH.png" key="nito" alt="nito"/>]);
      case 'Shin-sa':
        return ([<img src="https://i.imgur.com/tFwf0ca.png" key="shin-sa" alt="shin-sa"/>]);
      case 'Mitori-geiko':
        return ([<img src="https://i.imgur.com/kDsMFY4.png" key="mitori-geiko" alt="mitori-geiko"/>]);
      case 'Asa-geiko':
        return ([<img src="https://i.imgur.com/4GRTfgM.png" key="asa-geiko" alt="asa-geiko"/>]);
      default:
        return ([<img key={index} src="http://fillmurray.com/200/200"/>]);
    }
  }

  toggleHidden(){
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  componentDidMount(){
    axios.get(`/api/users/${this.props.match.params.id}`)
      .then(res => {

        this.setState({
          user: res.data,
          chartData: this.setChartData(res.data.sessions)
        });
      })

      .catch(err => this.setState({ error: err.message }));
  }


  render(){
    return(
      <section className="section">
        <div className="columns is-multiline is-mobile">
          <div className="column is-10">
            <h1 className="title is-3">{this.state.user.username}</h1>
            <hr />
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

          {this.state.user && !this.state.user.gender  &&
          <section className="section">
            <div className="no-sessions container ">
              <img src="https://imgur.com/Vsd3i2Y.png"/>
            </div>
            <p className="is-3 has-text-centered">You havent edited your profile yet.
              <Link to={`/users/${this.props.match.params.id}/edit`} className="is-3 "> Click here edit!</Link></p>
          </section>
          }

          {this.state.user && this.state.user.gender &&
          <section>
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
          </section>
          }


          {this.state.chartData &&
              this.state.chartData.map((chart, index) =>
                <div className="column is-12" key={index}>
                  <div
                    className="container chart-data-btn"
                    onClick={this.toggleHidden.bind(this)}
                  >
                    {this.setImage(chart.datasets[0].label, index)}
                    {!this.state.isHidden &&
                    <Chart
                      data={chart}
                    />
                    }
                  </div>
                </div>
              )}
        </div>
      </section>
    );
  }
}

export default UsersShow;




// chartData: {
//   labels: [ '2018-07-01', '2018-07-02','2018-07-03','2018-07-04','2018-07-05','2018-07-06','2018-07-07'],
//   datasets: [
//     {
//       label: 'Kata',
//       backgroundColor: 'rgba(54, 162, 235, 0.6)',
//       data: [20, 30, 80, 20, 40, 10, 60]
//     }, {
//       label: 'Keiko',
//       backgroundColor: 'rgba(255, 206, 86, 0.6)',
//       data: [60, 10, 40, 30, 80, 30, 20]
//     },
//     {
//       label: 'Shiai',
//       data: [
//         120,60,30,45,50,25,20
//       ],
//       backgroundColor: 'rgba(255, 99, 132, 0.6)'
//     }
//   ]
// }
