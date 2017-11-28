import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import {Get, Post} from '../../fetch/data.js';
// import ErrorSum from '../ErrorSum/index.js';
import ErrorSum from '../ErrorSum/index.js';
import InfoInput from '../InfoInput/index.js';
import UserMsgForm from '../UserMsg/index.js';
import PassWordForm from '../PassWord/index.js';
import ReviewOfError from '../ReviewOfError/index.js';
import Test from '../Test/index.js';
import './style.css';
const { Header, Sider, Content} = Layout;
class Navigation extends Component {
  state = {
    collapsed: true,
    key: '0',
    showUser : 'none',
    contentHeight :　0,
    userMsg : {},
    userName : '',
    phone:'',
    gender:''
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  clickHandle(e) {
    this.setState({
      key: e.key
    })
  }
  usermsgHandle(){
    this.setState({
      key : '3'
    })
  }
  passwordHandle(){
    this.setState({
      key : '4'
    })
  }
  userMouseEnter(e){
    this.setState({
      showUser : 'block'
    })
  }
  userMouseLeave(e){
    this.setState({
      showUser : 'none'
    })
  }
  logoutHandle(){
    var result =Post('http://118.31.16.70/api/v3/students/me/logout/');
    result.then((response)=>{
      if(response.status === 200){
        // sessionStorage.removeItem('userId');
        this.props.history.push('/')
      }
    })
  }
  componentWillMount(){
    console.log(sessionStorage.userId);
     if(sessionStorage.userId === undefined){
        this.props.history.push('/');
     }
  }
  render() {
    const {userMsg,userName,phone,gender} = this.state;
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          width={130}
        >
          <div className='head-font'>达摩纠错本</div>
          <Icon
            className="trigger trigger-icon"
            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
          <Menu theme="dark" mode="inline" onClick={this.clickHandle.bind(this)}>
            <Menu.Item key="1">
              <Icon type="book" />
              <span>错题标记</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="appstore" />
              <span>错题归类</span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="scan" />
              <span>错题复习</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ /*position: 'fixed',*/ width: '100%', padding: 0 }}>
           <div className='user-main' onMouseLeave={this.userMouseLeave.bind(this)}>
            <div className='user-msg' onMouseEnter={this.userMouseEnter.bind(this)}>
              <div className='user-icon-content'>
                <Icon type="user" className='user-icon'/>
              </div>
              <div className='user-name'>{userName ||userMsg.learnId}</div>
            </div>
            <ul className='user-content' onMouseLeave={this.userMouseLeave.bind(this)} style={{display:this.state.showUser}}>
              <li onClick={this.usermsgHandle.bind(this)}>个人信息</li>
              <li onClick={this.passwordHandle.bind(this)}>修改密码</li>
              <li onClick={this.logoutHandle.bind(this)}>退出登录</li>
            </ul>
          </div>
          </Header>
          <Content style={{ margin: '16px 16px', padding: 24, background: '#fff', minHeight:this.state.contentHeight,/*marginTop:80 */ }}>
            {
                 this.state.key === '0' ? <Test/> : null
            }
            {
                 this.state.key === '1' ? <InfoInput /> : null
            }
            {
                this.state.key === '2' ? <ErrorSum /> : null
            }
            {
                 this.state.key === '3' ? <UserMsgForm userMsg={userMsg}
                                                       name={userName}
                                                       phone={phone}
                                                       gender={gender}
                                                       modifyUserMsg={this.modifyUserMsg.bind(this)}/> : null
            }
            {
                 this.state.key === '4' ? <PassWordForm/> : null
            }
            {
                this.state.key === '5' ? <ReviewOfError/> : null
            }
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer> */}
        </Layout>
      </Layout>
    );
  }
  modifyUserMsg(name,phone,gender){
    this.setState({
      userName : name,
      phone:phone,
      gender:gender
    })
  }
  componentDidMount(){
    let that = this;
    let allHeight = document.documentElement.clientHeight;
    this.setState({
      contentHeight :　allHeight-112
    })
    window.onresize = function(){
      let allHeight = document.documentElement.clientHeight;
      that.setState({
        contentHeight :　allHeight-112
      })
    }
    var msg =Get('http://118.31.16.70/api/v3/students/me/profile/');
    msg.then((response)=>{
        this.setState({
            userMsg : response.data,
            userName : response.data.realName,
            phone : response.data.telephone,
            gender:response.data.gender
        })
    })
  }
}
export default Navigation;
