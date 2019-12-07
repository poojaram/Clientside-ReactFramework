import React, { Component } from 'react'; //import React Component

const EXAMPLE_SENATORS = [  
  { id: 'C000127',  name: 'Maria Cantwell', state: 'WA',  party: 'Democrat', phone: '202-224-3441', twitter: 'SenatorCantwell' },
  { id: 'M001111', name: 'Patty Murray', state: 'WA', party: 'Democrat', phone: '202-224-2621', twitter: 'PattyMurray' }
];

/* Your code goes here */

export class App extends Component {
  render(){
      

      return(
          <div className="container">
              <h1>US Senators 2019</h1>
              <SenatorTable senators={this.props.senators}/>
          </div>
      );
  }
}

export class SenatorTable extends Component{
  render(){
      let cols1 = ['Name','Party-State','Tel','Twitter']
      return (
          <table className='table' className='table-bordered'>
              <TableHeader cols={cols1}/>
              <tbody>
                  {this.props.senators.map((senatorrow)=>{
                  return(<SenatorRow senator={senatorrow}/>)
                  })}
              </tbody>
          </table>
      )
  }
}

export class TableHeader extends Component{
  render(){
      return (
          <thead>
              <tr>
                  {this.props.cols.map((name)=>{
                      return (<th>{name}</th>)
                  })}
               </tr>
          </thead>
      )
  }
}

export class SenatorRow extends Component{
  render(){
      let headertext = 'tel:';
      return (
      <tr>
          <td>{this.props.senator.name}</td>
          <td>{this.props.senator.party.slice(0,1)} - {this.props.senator.state}</td>
          <td><a href="tel:123-456-789">123-456-789</a></td>
          <td><a href="https://twitter.com/test1">@test1</a></td>
      </tr>
      )
  }
}