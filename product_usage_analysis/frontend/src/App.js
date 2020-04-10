import React from 'react';
import { Row, Col, Typography } from 'antd'
import * as productActions from './actions'

import './App.scss';
import { connect } from 'react-redux';

const { Title } = Typography

class AppUnwrapped extends React.Component {
  
  componentDidMount() {
    this.props.get_products_info();
  }

  render() {
    const { products_info = {} } = this.props; 
    console.log(products_info)
    return (
      <div className="App">
        <header className="App-header">
          
        </header>
      </div>
    );
  }
}

function mapStateToProps(state, productProps) {
  return { products_info : state.products_info }
}

const actionCreators = {
  get_products_info: productActions.get_product_usage_list,
}

const App = connect(mapStateToProps, actionCreators)(AppUnwrapped)

export default App;
