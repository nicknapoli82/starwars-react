import React from 'react';
import ReactDOM from 'react-dom';

const swApiRoot = 'https://swapi.co/api/people/';

////////////////////////////////////////////////////////////////////////////////////////
// I put everything for this page in one file I didn't feel the application	      //
// is large enough to break everything out into separate files. Just FYI.	      //
// 										      //
// The hash changes are handled in two ways. If the user loads a link with the	      //
// hash value already there it is loaded in the constructor of Everything, as	      //
// soon as the data is loaded from the swapi then the details are populated.	      //
// Otherwise we set the hash always by using the browser location.hash		      //
// The function changeHash handles that, though the code is redundant between	      //
// both. 									      //
// 										      //
// this.state.people is all the persons loaded from swapi			      //
// this.state.selected is just a reference in this.state.people			      //
// 										      //
// The person details load based on this.state.selected being a reference or null     //
// 										      //
// The only thing I consider not done is creating a mobile view for this, and	      //
// now I have other things to do. Maybe you can think of something extra I didn't do. //
// Let me know. I could spend some time refining the code now. I think I'll save      //
// that for another day.							      //
// 										      //
// PS. I chose specifically not to use axios in this project because I really don't   //
// get anything from it in this case. I think its real use will come out when	      //
// we start using routing.							      //
////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// PPS. It would have been fun to add the sort functionality like I did in the last //
// project. Alas also. Another day.						    //
//////////////////////////////////////////////////////////////////////////////////////


class Everything extends React.Component {
  constructor () {
    super();
    let lHash = location.hash;
    if (location.hash){
      lHash = lHash.split('#')[1];
      if(lHash.includes('%20')) {
        lHash = lHash.split('%20').join(' ');
      }
    }
    this.loadPeople = this.loadPeople.bind(this);
    this.peopleFetcher = this.peopleFetcher.bind(this);
    this.selectPerson = this.selectPerson.bind(this);
    this.changeHash = this.changeHash.bind(this);
    this.state = {
      people: [],
      selected: null,
      lHash: lHash
    };
  }

  componentDidMount() {
    this.loadPeople();
    window.addEventListener("hashchange", this.changeHash, false);
  }

  changeHash(e) {
    let lHash = location.hash;
    if (location.hash){
      lHash = lHash.split('#')[1];
      if(lHash.includes('%20')) {
        lHash = lHash.split('%20').join(' ');
      }
      for (let idx in this.state.people) {
        if (this.state.people[idx].name === lHash) {
          this.setState( { selected: this.state.people[idx] } );
        }
      }
    }    
    else this.setState( { selected: null } );
  }

  async loadPeople () {
    let response = await fetch(swApiRoot);
    response = await response.json();
    this.setState( { people: response.results });

    // Get the rest of the people
    let fetchTotal = Math.ceil(response.count / response.results.length);
    for (let i = 2; i <= fetchTotal; i++) {
      this.peopleFetcher(i);
    }
    if (this.state.lHash) {
      for (let idx in response.results) {
        if (response.results[idx].name === this.state.lHash) {
          this.setState({ selected: response.results[idx]});
        }
      }
    }
  }

  async peopleFetcher(index) {
    let response = await fetch(swApiRoot + `?page=${index}`);
    response = await response.json();
    const newPeople = this.state.people;
    newPeople.push(...response.results);
    this.setState( { people: newPeople } );
    if (this.state.lHash) {
      for (let idx in response.results) {
        if (response.results[idx].name === this.state.lHash) {
          this.setState({ selected: response.results[idx]});
        }
      }
    }
  }

  selectPerson(e) {
    let name = e.target.innerText;
    location.hash = name;
    for (let idx in this.state.people) {
      if (this.state.people[idx].name === name) {
        this.setState( { selected: this.state.people[idx] } );
      }
    }
  }
  
  render () {
    return (
      <div>
	<div className="header"><h1>StarWars People - Reactified</h1></div>
	<div className="react-base">
	  <div id="people-list">
            <PeopleList people={this.state.people} selectPerson={this.selectPerson} selected={this.state.selected}/>
	  </div>
	  <div className="singlePerson">
            <SinglePerson selected={this.state.selected}/>
	  </div>
	</div>
      </div>
    );
  }
}

const PeopleList = (props) => {
  return (
    <ol onClick={props.selectPerson}>
      {
        props.people.map(p => {
	  return <PersonLI key={p.name} name={p.name} selected={props.selected}/> })
      }
    </ol>
  );
};

const PersonLI = (props) => {
  if (props.selected) {
    let s = props.selected.name;
    if (s === props.name) return <li className='selected'>{props.name}</li>;
  }
  return <li>{props.name}</li>;
};

const SinglePerson = (props) => {
  if (props.selected) {
    const keysAvailable = ['height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender'];
    let result = [];
    result.push(<a key="anchor" href="#">Hide Details</a>);
    result.push(<h2 key="heading">{props.selected.name}</h2>);
    for (let k in props.selected) {
      if (keysAvailable.includes(k)) {
	result.push(<p key={k}><b>{k}</b>: {props.selected[k]}</p>);
      }
    }
    return result;
  }
  else return <p align="center">None Selected</p>;
};

ReactDOM.render(<Everything />, document.getElementById("main"));
