import React from 'react';
import { Layout, Menu, Typography, DatePicker, Row, Select } from 'antd'
import * as productActions from './actions'
import * as _ from 'lodash'
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
    const dat = new Date(date._d).setHours(0, 0, 0, 0)
    this.setState({ start_date : dat })
  }

  handlePanelChange = (value, data_range) => {
    this.setState({ data_range : data_range });
  };

  parseUsageData() {
    const { products_info = {} } = this.props 
  
    let data_to_show = {}
    const start_date = this.state.start_date
    let end_time = this.state.start_date

    switch (this.state.data_range) {
      case 'quarter':
        end_time += 7776000000
        break;
      case 'month':
        end_time += 2592000000
        break;
      case 'week':
        end_time += 604800000
        break;
      case 'date':
        end_time += 86400000
        break;
    }

    const filtered = _.pickBy(products_info, function(record) {
      const milli_time = new Date(record.time).setHours(0, 0, 0, 0)
      return (milli_time >= start_date) && (milli_time <= end_time);
    })
  }

  componentDidMount() {
    this.props.get_products_info();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.data_range !== prevState.data_range) { 
      this.setState({ start_date : null })
      this.handlePanelChange(null, this.state.data_range)
    }

    if (this.state.start_date !== prevState.start_date) {
      this.parseUsageData() 
    }
  }

  render() {
    const { products_info = {} } = this.props; 
    
    const disabledDate = current => {
      // 18.03.2019 and 18.03.2020 in milliseconds
      const min_date_in_db = 1552856400000
      const max_date_in_db = 1584478800000
      const curr_date = new Date(current._d).setHours(0, 0, 0, 0)

      if (min_date_in_db <= curr_date && curr_date <= max_date_in_db) {
        return false
      }
      return true
    };
    
    return (
      <Layout style={{ minHeight: '100vh' }}>
        
        <Sider align='center' collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} >
          <Row style={{ padding: 8}}>
            {this.state.collapsed ? <Title level={3} style={{color: 'white'}}> ... </Title> :
                <Title justify='middle' level={3} style={{color: 'white'}}> Parameters </Title>}
          </Row>

          <Row align='center' style={{padding: 8}}>
            <Select placeholder="Choose date range" style={{ width: '100%'}} onChange={this.handleRangeChange}>
              <Option value="quarter"> One quater </Option>
              <Option value="month"> One month </Option>
              <Option value="week"> One week </Option>
              <Option value="date"> One day </Option>
            </Select>
          </Row>

          <Row style={{padding: 8}}>
            {this.state.data_range && <DatePicker style={{ width: '100%', textAlign: 'center' }} allowClear={false} mode={this.state.data_range}
              picker={this.state.data_range} disabledDate={disabledDate} onChange={this.handleDateChange} 
                onPanelChange={this.handlePanelChange}/>}
          </Row>
        </Sider>

        <Layout className="site-layout">
          <Header justify='middle' className="site-layout-background" style={{ padding: 0}}>
            <Title style={{ height: '100%', padding: 10, marginLeft: 20}}> Stats </Title>
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
