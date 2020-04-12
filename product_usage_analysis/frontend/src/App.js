import React from 'react';
import { Layout, Menu, Typography } from 'antd'
import * as productActions from './actions'

import './App.scss';
import { connect } from 'react-redux';

const { SubMenu } = Menu;

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography

class AppUnwrapped extends React.Component {
  state = {
    collapsed: false,
    active_tab: 0
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  componentDidMount() {
    this.props.get_products_info();
  }

  render() {
    const { products_info = {} } = this.props; 
    
    return (
      <Layout style={{ minHeight: '100vh' }}>
        
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          Some parameters
        </Sider>

        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 , marginLeft: 24}}>
            <Title> Stats </Title>
          </Header>
          
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Some graphs
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>JetBrains © 2020</Footer>
        </Layout>

      </Layout>
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
