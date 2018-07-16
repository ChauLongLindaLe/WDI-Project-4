import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import Auth from '../../lib/Auth';
import Chart from '../charts/Chart';
import DoughnutChart from '../charts/PieChart';


class Statistics extends React.Component{

  constructor(){
    super();
    this.state={
      isHidden: true,
      errors: {},
      user: {}
    };
  }

  selectColour() {
    return _.sample([
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(128, 255, 0, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(200, 5, 173, 0.6)',
      'rgba(200, 105, 92, 0.6)',
      'rgba(250, 85, 3, 0.6)',
      'rgba(250, 5, 103, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(25, 2, 122, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(153, 252, 255, 0.6)',
      'rgba(85, 165, 13, 0.6)',
      'rgba(155, 27, 7, 0.6)'
    ]);
  }

  getKeyData(userData, discipline, key) {
    return userData.sessions
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

  //We take the discipline passed to by setChartData to define which discipline we are creating a chart for.
  //We also pass discipline through to getKeyData for us to the be able to extract specific pieces of data from the sessions array.

  getData(userData, chartType) {

    if(chartType === 'line') {
      return {
        labels: userData.sessions.map(session => session.date),
        datasets: [{
          label: userData.discipline,
          backgroundColor: this.selectColour(),
          data: userData.sessions.map(session => session.duration)
        }]
      };
    }

    if(chartType === 'doughnut') {
      return {
        labels: userData.practicedDisciplines.map(discipline => discipline.discipline),
        datasets: [{
          data: userData.practicedDisciplines.map(discipline => {
            // console.log(discipline.sessions,'discipline.sessions');
            return discipline.sessions
              .reduce((session, value) => {
                console.log(session, value);
                session.duration + value;
              });
          }),
          backgroundColor: userData.practicedDisciplines.map(() => {
            return this.selectColour();
          })
        }]

      };
    }
  }

  // setDatasets(userData, chartType, discipline) {
  //   //We return an object with the data laid out in the way that chartjs wants to receive it.
  //   return {
  //     labels: this.getData(userData, chartType, discipline).labels,
  //     datasets: [{
  //       label: discipline || '',
  //       backgroundColor: this.getData(userData, chartType, discipline).backgroundColor,
  //       data: this.getData(userData, chartType, discipline).data
  //     }]
  //   };
  // }
  //
  // setLineChartData(userData, chartType) {
  //   //We use getDisciplines to go through userData and return an array of unique disciplines.
  //   //We then map over it so that we can pass each discipline down to setDatasets.
  //   return userData.practicedDisciplines.map(discipline => {
  //     return this.setDatasets(userData, chartType, discipline);
  //   });
  // }

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
    axios.get(`api/users/${Auth.getPayload().sub}`)
      .then(res => {
        this.setState({
          user: res.data,
          chartData: res.data.practicedDisciplines.map(discipline => this.getData(discipline, 'line')),
          pieChart: this.getData(res.data, 'doughnut')
        });
        console.log(this.state.pieChart);
      })

      .catch(err => this.setState({ error: err.message }));
  }

  reformatMinutes = (timeInMinutes) => {
    return timeInMinutes / 60 > 1 ? `${Math.floor(timeInMinutes/60)} hours, ${timeInMinutes % 60} mins` : `${timeInMinutes} mins`;
  }


  render(){
    return(
      <section className="section">
        <div className="columns is-multiline is-mobile">
          <div className="column is-10">
            <h1 className="title is-3">Statistics</h1>
            <hr />
            <h3>A total of</h3>
            {/* <h2>{this.reformatMinutes(this.state.sessions.totalPracticed)}</h2> */}
          </div>
          <div className="column is-1">
            <div className="container">
              <Link to={`/users/${Auth.getPayload().sub}/sessions`}>
                <button className="edit">
                  <i className="fas fa-pencil-alt   fa-2x"></i>
                  <p className="is-8">Sessions</p>
                </button>
              </Link>
            </div>
          </div>

          {this.state.chartData && this.state.chartData.length === 0 &&
          <section className="section">
            <div className="no-sessions container ">
              <img src="https://imgur.com/Vsd3i2Y.png"/>
            </div>
            <p className="is-3 has-text-centered">No sessions have been recorded.
              <Link to={`/users/${this.props.match.params.id}/edit`} className="is-3 "> Click here to add your first session</Link></p>
          </section>
          }

          {this.state.chartData && this.state.chartData.length !== 0 &&
            this.state.chartData.map((chart, index) =>
              <div className="column is-12" key={index}>
                <div
                  className="container chart-data-btn"
                  onClick={this.toggleHidden.bind(this)}
                >
                  {this.setImage(chart.datasets[0].label, index)}
                  {!this.state.isHidden &&
                    <section>

                      <Chart
                        data={chart}
                      />
                    </section>
                  }
                </div>
              </div>
            )}
          <div className="column is-12">
            <div className="container">
              {this.state.pieChart &&
                <DoughnutChart
                  data={this.state.pieChart}
                />}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Statistics;
