import React from 'react';
import { Layout, Typography, DatePicker, Row, Select, Col } from 'antd'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts'
import * as productActions from './actions'
import * as _ from 'lodash'
import './App.scss';

import { connect } from 'react-redux';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography
const { Option } = Select

class AppUnwrapped extends React.Component {
  state = {
    collapsed: false,
    data_range: null,
    start_date: null,
    chart_data_ws: null,
    chart_data_idea: null,
    chart_data_php: null
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

  makeDataArray(pr_name, pr_info, start, end) {
    const filtered = _.pickBy(pr_info, function(record) {
      const milli_time = new Date(record.time).setHours(0, 0, 0, 0)
      return (record.product_name === pr_name) && (milli_time >= start) && (milli_time <= end);
    })

    let data_array = []
    for (const record in filtered) {
      data_array.push(filtered[record])
    }
    return data_array
  }

  parseUsageData() {
    const { products_info = {} } = this.props 
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

    const filtered_ws = this.makeDataArray("WebStorm", products_info, start_date, end_time)
    const filtered_idea = this.makeDataArray("IntelliJ IDEA", products_info, start_date, end_time)
    const filtered_php = this.makeDataArray("PhpStorm", products_info, start_date, end_time)   

    return [filtered_ws, filtered_idea, filtered_php]
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
      const sets = this.parseUsageData()
      const ws = sets[0]
      const idea = sets[1]
      const php = sets[2]
      this.setState({ chart_data_ws : ws, chart_data_idea : idea, chart_data_php : php })
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
    
    const tickFormatter = (dat) => {
      return new Date(dat).toLocaleString().split(',')[0]
    }

    const find_min = (data) => {
      console.log(data)
      const values  = Object.values(data);
      const l = Math.min.apply(null, values.map(function(x) { return x['count']} ));
      return l
    }

    const find_max = (data) => {
      const keys  = Object.values(data);
      const h = Math.max.apply(null, keys.map(function(x) { return x['count']} ));
      return h
    }


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


          {this.state.data_range && this.state.start_date &&
            <Row>

            </Row>}
        </Sider>

        <Layout className="site-layout">
          <Header justify='middle' className="site-layout-background" style={{ padding: 0}}>
            <Title style={{ height: '100%', padding: 10, marginLeft: 20}}> Stats </Title>
          </Header>
          
          <Content style={{ margin: '16px 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>              
              {this.state.data_range && this.state.start_date &&
                <Col>
                  {this.state.chart_data_idea && 
                    <Row align='center' justify='middle' type='flex' style={{width: '100%'}}>
                      <Col style={{width: '100%'}}>
                        <Title align='center' level={3} > IntelliJ IDEA </Title>   
                        
                        <Title align='center' level={4} style={{ margin: "5px 0"}}> 
                          Min: {find_min(this.state.chart_data_idea)} &emsp;
                          Max: {find_max(this.state.chart_data_idea)}
                        </Title> 
                      </Col>  

                      <Col>
                        <BarChart height={500} width={1200} data={this.state.chart_data_idea}
                          margin={{ top: 5, right: 30, left: 20, bottom: 15 }} barSize={20} >
                          <XAxis dataKey="time" tickFormatter={tickFormatter} scale="point" padding={{ left: 10, right: 10 }} />
                          <YAxis /> 
                          <Tooltip />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Bar dataKey="count" fill='#00474f' />
                      </BarChart>
                      </Col>
                  </Row>}

                  {this.state.chart_data_ws && 
                    <Row align='center' justify='middle' type='flex'>
                      <Col style={{width: '100%'}}>
                        <Title level={3} align='center'> WebStorm </Title>
                        
                        <Title level={4}  align='center' style={{ margin: "5px 0"}}> 
                          Min: {find_min(this.state.chart_data_ws)} &emsp;
                          Max: {find_max(this.state.chart_data_ws)}
                        </Title>   
                      </Col>

                      <Col>
                        <BarChart height={500} width={1200} data={this.state.chart_data_ws}
                          margin={{ top: 5, right: 30, left: 20, bottom: 15 }} barSize={20} >
                          <XAxis dataKey="time" tickFormatter={tickFormatter} scale="point" padding={{ left: 10, right: 10 }} />
                          <YAxis /> 
                          <Tooltip />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Bar dataKey="count" fill="#00474f" />
                        </BarChart>
                      </Col>
                  </Row>}

                  {this.state.chart_data_php && 
                    <Row align='center' justify='middle' type='flex'>
                      <Col style={{width: '100%'}}>
                        <Title level={3} align='center'> PhpStorm </Title>
                      
                        <Title level={4} align='center' style={{margin: "5px 0"}}> 
                          Min: {find_min(this.state.chart_data_php)} &emsp;
                          Max: {find_max(this.state.chart_data_php)}
                        </Title>
                      </Col>   

                      <Col>
                        <BarChart height={500} width={1200} data={this.state.chart_data_php}
                          margin={{ top: 5, right: 30, left: 20, bottom: 15 }} barSize={20} >
                          <XAxis dataKey="time" tickFormatter={tickFormatter} scale="point" padding={{ left: 10, right: 10 }} />
                          <YAxis /> 
                          <Tooltip />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Bar dataKey="count" fill="#00474f"/>
                        </BarChart>
                      </Col>
                  </Row>}
                </Col>
              }
              
              {!(this.state.data_range && this.state.start_date) &&
                <Title justify='middle' level={3}> You should choose parameters first! </Title>}
        
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
