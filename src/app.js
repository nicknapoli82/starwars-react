import React from 'react';
import ReactDOM from 'react-dom';

const swApiRoot = 'https://swapi.co/api/people/';

const testPerson = {
            "name": "Luke Skywalker", 
            "height": "172", 
            "mass": "77", 
            "hair_color": "blond", 
            "skin_color": "fair", 
            "eye_color": "blue", 
            "birth_year": "19BBY", 
            "gender": "male", 
            "homeworld": "https://swapi.co/api/planets/1/", 
            "films": [
                "https://swapi.co/api/films/2/", 
                "https://swapi.co/api/films/6/", 
                "https://swapi.co/api/films/3/", 
                "https://swapi.co/api/films/1/", 
                "https://swapi.co/api/films/7/"
            ], 
            "species": [
                "https://swapi.co/api/species/1/"
            ], 
            "vehicles": [
                "https://swapi.co/api/vehicles/14/", 
                "https://swapi.co/api/vehicles/30/"
            ], 
            "starships": [
                "https://swapi.co/api/starships/12/", 
                "https://swapi.co/api/starships/22/"
            ], 
            "created": "2014-12-09T13:50:51.644000Z", 
            "edited": "2014-12-20T21:17:56.891000Z", 
            "url": "https://swapi.co/api/people/1/"
};

async function peopleFetcher(index) {
  let response = await fetch(url + `?page=${index}`);
  response = await response.json();
  data.push(...response.results);
  populateNames(data);	
}

export default class Everything extends React.Component {
  constructor () {
    super();
    this.loadPeople = this.loadPeople.bind(this);
    this.state = {
      people: []
    };
  }

  componentDidMount() {
    this.loadPeople();
  }

  async loadPeople () {
    let response = await fetch(swApiRoot);
    response = await response.json();
    this.setState( { people: response.results });
    console.log(response.results);
  }
  
  render () {
    return (
      <div>
	<div className="header"><h1>StarWars People</h1></div>
	<div className="react-base">
	  <div>
	    <PeopleList people={this.state.people}/>
	  </div>
	  <div>
	    <h1>Other Side</h1>
	  </div>
	</div>
      </div>
    );
  }
}

const PeopleList = (props) => {
  return (
    <ol>
      {
        props.people.map(p => { <PersonLI name={props.person.name}/> })
      }
    </ol>
  );
};

const PersonLI = (props) => {
  return (
    <li>
      {props.name}
    </li>
  );
};
