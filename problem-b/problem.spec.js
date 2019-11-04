const raf = require('raf') //fix raf warning, redux!

import React from 'react';
import Enzyme, {shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

//include custom matchers
const styleMatchers = require('jest-style-matchers');
expect.extend(styleMatchers);

//Enzyme config
Enzyme.configure({ adapter: new Adapter() });

//solution classes
import App from  './src/App';

//test data
const TEST_PETS = [
  {"name":"Pet A", "sex":"Male", "breed":"Breed A", "img":"imgA"},
  {"name":"Pet B", "sex":"Male", "breed":"Breed B", "img":"imgB"},
  {"name":"Pet C", "sex":"Male", "breed":"Breed A", "img":"imgC"},
];

/* Begin the tests */

describe('Source code is valid', () => {
  test('JavaScript lints without errors', async () => {
    const sources = ['App.js'].map((src) => __dirname + '/src/' + src);
    const linterOptions = {}; //this should be sufficient with other fields
    sources.forEach((source) => {
      expect([source]).toHaveNoEsLintErrors(linterOptions); //test each
    })
  })
});

describe('The pet adoption app', () => { 
  let wrapper; //the rendered app

  it('renders without crashing', () => {
    wrapper = mount(<App pets={TEST_PETS} />); //mount for further tests
  });

  it('renders the App page structure', () => {
    let appComponent = shallow(<App />); //shallow render; only this component (exclusive tests)

    //header
    expect(appComponent.find('.jumbotron.jumbotron-fluid').length).toBe(1);
    expect(appComponent.find('h1').text()).toEqual("Adopt a Pet");

    //main (includes columns)
    expect(appComponent.find('.col-3').length).toBe(1);
    expect(appComponent.find('.col-9').length).toBe(1);

    //footer
    expect(appComponent.find('footer').text()).toEqual("Images from Seattle Humane Society");

    //doesn't include sub-components
    expect(appComponent.find('nav').length).toBe(0); //should not include
    expect(appComponent.find('h2').length).toBe(0); //should not include 
    expect(appComponent.find('.card').length).toBe(0); //should not include
  });

  it('renders the AboutNav component', () => {
    let aboutNavComponent = wrapper.find('AboutNav');
    expect(aboutNavComponent.length).toBe(1); //page contains component
    expect(aboutNavComponent.find('h2').text()).toEqual("About");
    expect(aboutNavComponent.find('a').length).toBe(5); //includes all the links
  });

  it('renders the BreedNav component', () => {
    let breedNavComponent = wrapper.find('BreedNav');
    expect(breedNavComponent.length).toBe(1); //page contains component
    expect(breedNavComponent.find('h2').text()).toEqual("Pick a Breed");
    expect(breedNavComponent.find('a').length).toBeGreaterThan(0); //includes links (some)
  })

  it('renders BreedNav with correct props', () => {
    let breedNavComponent = wrapper.find('BreedNav');
    expect(breedNavComponent.props()).toMatchObject({ breeds: [ 'Breed A', 'Breed B' ] })
    let breedNavLinks = breedNavComponent.find('a');
    expect(breedNavLinks.length).toBe(2); //actually count
    expect(breedNavLinks.at(0).text()).toEqual('Breed A'); //check entries
    expect(breedNavLinks.at(1).text()).toEqual('Breed B'); //check entries
  })

  it('renders the PetCard components', () => {
    expect(wrapper.find('PetCard').length).toBe(3); //has 3 cards

    let card = wrapper.find('PetCard').at(0).render(); //static render of first card
    let pet = TEST_PETS[0]; //which pet
    let cardImg = card.find('img');
    expect(cardImg.attr('src')).toEqual(pet.img);
    expect(cardImg.attr('alt')).toEqual(pet.name);
    let cardTitle = card.find('.card-title');
    expect(cardTitle.text().trim()).toEqual(pet.name)
    let cardText = card.find('.card-text');
    expect(cardText.text().trim()).toEqual(`${pet.sex} ${pet.breed}`);
  })

  it('renders the PetList component', () => {
    let petList = wrapper.find('PetList');
    expect(petList.length).toBe(1);
    expect(petList.find('h2').text()).toEqual('Dogs for Adoption'); //check heading
    expect(Object.values( petList.props() )).toContainEqual(TEST_PETS); //has the prop (regardless of key name)
  })

  it('App tracks `pets` in the state', () => {
    expect(wrapper.state('pets')).toMatchObject(TEST_PETS); //should be there!
  })

  it('has an `App#adopt()` callback', () => {
    let instance = wrapper.instance();
    expect(instance.adopt).toBeDefined(); //has function
    instance.adopt('Pet A'); //call method!
    expect(wrapper.state('pets')[0].adopted).toBe(true); //should now be adopted!
  })

  it('cards respond to click events', () => {
    //spy on function!
    let instance = wrapper.instance();
    let spy = jest.spyOn(instance, 'adopt');
    instance.forceUpdate(); //refresh to actually attach the spy function

    let pet = TEST_PETS[1];
    let card = wrapper.find('PetCard').at(1); //card[1]
    card.simulate('click'); //click the card!

    expect(spy).toHaveBeenCalledWith(pet.name); //should have executed callback

    expect(wrapper.state('pets')[1].adopted).toBe(true); //is now adopted (in state)
  })

  it('cards show whether adopted', () => {
    let card1 = wrapper.find('PetCard').at(1); //who is adopted
    expect(card1.find('.card-title').text().trim()).toEqual(TEST_PETS[1].name+' (Adopted)');

    let card2 = wrapper.find('PetCard').at(2).render(); //who is NOT adopted
    expect(card2.find('.card-title').text().trim()).toEqual(TEST_PETS[2].name);
  })
})
