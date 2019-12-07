import React, { Component } from 'react'; //import React Component
import './style.css';
import _ from 'lodash';


class App extends Component {

constructor(props) {
    super(props);
    
    this.state = { pets : this.props.pets };
    
  }

  render() {
    return (
    	<div>
      <header className="jumbotron jumbotron-fluid py-4">
        <div className="container">
          <h1>Adopt a Pet</h1>
        </div>
      </header>

    <main className="container">
      <div className="row">
        <div id="navs" className="col-3">
        <AboutNav />   
        <BreedNav breeds={Object.keys(_.groupBy(this.state.pets, 'breed'))}/>  
        </div>
        <PetList className="col-9" pets={this.state.pets} adoptCallback={(petName) => {this.adopt(petName);}}/>
      </div> 
    </main>

    <footer className="container">
      <small>Images from <a href="http://www.seattlehumane.org/adoption/dogs">Seattle Humane Society</a></small>
    </footer>
    </div>
    );
  }

  adopt(name) {
    let activePets = this.state.pets;
    let pet = _.find(activePets, ['name', name]);
    pet.adopted = true;

    this.setState({ pets : activePets });

  }
}

export class AboutNav extends Component {
  render() {
    return (
    <div>
    <nav id="aboutLinks">
      <h2>About</h2>
      <ul className="list-unstyled">
        <li><a href="">How to Adopt</a></li>
        <li><a href="">Volunteering</a></li>
        <li><a href="">Events</a></li>
        <li><a href="">Donate</a></li>
        <li><a href="">About Us</a></li>
      </ul>
    </nav>
  </div>
  );
  }
}

export class BreedNav extends Component {
  render() {
    let petBreeds = this.props.breeds.map((breed) => {
      return <li key={breed}><a href="">{breed}</a></li>;
    });

    return (
      <div>
      <nav id="breedLinks">
      <h2>Pick a Breed</h2>
      <ul className="list-unstyled">
        {petBreeds}
      </ul>            
    </nav>
    </div>
    );
  }
}

export class PetCard extends Component {
  render() {
    let displayName = this.props.pet.adopted ? "(Adopted)" : "";

    return (
       <div className="card" onClick={() => this.props.adoptCallback(this.props.pet.name)}>
        <img className="card-img-top" src={this.props.pet.img} alt={this.props.pet.name} />
        <div className="card-body">
          <h3 className="card-title">{this.props.pet.name} {displayName}</h3>
          <p className="card-text">{this.props.pet.sex} {this.props.pet.breed}</p>
        </div>
      </div>
    );
  }
}

export class PetList extends Component {
  render() {
    let petCards = this.props.pets.map((pet) => {
      return <PetCard pet={pet} key={pet.name} adoptCallback={this.props.adoptCallback}/>;
    });

    return (
      <div id="petList" className="col-9">
        <h2>Dogs for Adoption</h2>
        <div className="card-deck">
          {petCards}
        </div>
    </div>
    );
  }
}

export default App;