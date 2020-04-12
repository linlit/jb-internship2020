import React from 'react';
import { Layout, Menu, Typography, DatePicker, Row, Select } from 'antd'
import * as productActions from './actions'

import './App.scss';

import { connect } from 'react-redux';
const { RangePicker } = DatePicker;
const { SubMenu } = Menu;

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography

const { Option } = Select


class AppUnwrapped extends React.Component {
  state = {
    collapsed: false,
    data_range: null,
    start_date: null
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  handleRangeChange = value => {
    this.setState({data_range : value})
  }

  handleDateChange = date => {
    console.log(date._d)
    const dat = new Date(date._d).setHours(0, 0, 0, 0)
    console.log(dat)
    this.setState({ start_date : dat })
  }

  componentDidMount() {
    this.props.get_products_info();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.data_range !== prevState.data_range) { 
        this.setState({ start_date : null })
        this.handlePanelChange(null, this.state.data_range)
    }
  }

  handlePanelChange = (value, data_range) => {
    this.setState({ data_range : data_range });
  };

  render() {
    const { products_info = {} } = this.props; 
    
    const disabledDate = current => {
      // 18.03.2019 and 18.03.2020 in milliseconds
      const min_date_in_db = 1552856400000
      const max_date_in_db = 1584478800000
      const curr_date = new Date(current._d).setHours(0, 0, 0, 0)
      console.log(min_date_in_db, max_date_in_db, curr_date)
      if (min_date_in_db <= curr_date && curr_date <= max_date_in_db) {
        return false
      }
      return true
    };
    
    return (
      <Layout style={{ minHeight: '100vh' }}>
        
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} 
          style={{padding: '3%'}}>
          <Row>
            <Title level={3} style={{color: 'white'}}> Parameters </Title>
          </Row>

          <Row>
            <Select placeholder="Choose date range" style={{ width: '100%', marginBottom: 16 }} onChange={this.handleRangeChange}>
              <Option value="quarter"> One quater </Option>
              <Option value="month"> One month </Option>
              <Option value="week"> One week </Option>
              <Option value="date"> One day </Option>
            </Select>
          </Row>

          <Row>
            {this.state.data_range && <DatePicker style={{ width: '100%' }}
              allowClear={false}
              mode={this.state.data_range}
              picker={this.state.data_range}
              disabledDate={disabledDate}
              onChange={this.handleDateChange}
              onPanelChange={this.handlePanelChange}
            />}
             
          </Row>
        </Sider>

        <Layout className="site-layout">
          <Header justify='middle' className="site-layout-background" style={{ padding: 0}}>
            <Title style={{ height: '100%', padding: '2%', marginLeft: 20}}> Stats </Title>
          </Header>
          
          <Content style={{ margin: '16px 16px' }}>
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
