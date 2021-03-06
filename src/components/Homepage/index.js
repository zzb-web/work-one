import React, { Component } from 'react';
import {Table , Row , Col,Popconfirm, message,Button} from 'antd';

import axios from 'axios';
import './style.css';
import Result from './subpage/Result/index.js';
import {Get, Post, Delete} from '../../fetch/data.js';
class Homepage extends Component{
    state={
      data : [],
      detailData : [],
      showDetail : false,
      showFail : false,
      taskTime : 0,
      failMsg : '',
      markIndex : ''
    }
    _add(m){return m<10?'0'+m:m }  
    _getDate(timeStamp) {   
      var time = new Date(timeStamp*1000);  
      var y = time.getFullYear();  
      var m = time.getMonth()+1;  
      var d = time.getDate();  
      return y +'-'+this._add(m)+'-'+this._add(d); 
    }
    markHandle(index){
      const {data} = this.state;
      const time = data[index].time;
      var url = `/api/v3/students/me/uploadTasks/${time}/`;
      Get(url).then(resp=>{
        if(resp.status ===200){
            var data1 = {};
            var detailData = [];
            console.log(resp.data);
            resp.data.wrongProblems.map((item,index)=>{
                item.problems.map((item2,index2)=>{
                    if(data1[item2.problemId+'_']===undefined){
                        data1[item2.problemId+'_']=[];
                        data1[item2.problemId+'_'].push(item2)
                    }else{
                        data1[item2.problemId+'_'].push(item2)
                    }
                })
            })
            for(var key in data1){
                detailData.push(data1[key])
            }
            this.setState({
                showDetail : true,
                detailData : detailData,
                markIndex : index,
                showFail : false,
                taskTime : time
            })
        }else if(resp.status === 404){
          this.setState({
            showFail : true,
            showDetail : false,
            failMsg : 'CS没有数据'
        })
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    confirm(index){
      const {data} = this.state;
      const time = data[index].time;
      var url = `/api/v3/students/me/uploadTasks/${time}/`
      Delete(url).then(resp=>{
        if(resp.status === 200){
          data.splice(index,1)
          this.setState({
            data:data
          })
        }
      }).catch(err=>{

      })
    }
    saveHandle(flag){
      // const {data,markIndex} = this.state;
      // console.log(markIndex)
      // data.splice(markIndex,1)
      var url = `/api/v3/students/me/uploadTasks/`;
          Get(url).then(resp=>{
            this.setState({
              data : resp.data
            })
          }).catch(err=>{
            console.log(err)
          })
        
      this.setState({
          showDetail : flag,
          // data:data
      })
    }
    render(){
      console.log(this.state.markIndex)
      const columns = [{
        title: '日期',
        dataIndex: 'date',
        className: 'column-date',
        key: 'date',
        width:70
      }, {
        title: '描述',
        dataIndex: 'desc',
        className: 'column-desc',
        key: 'desc',
        width:60
      }, {
        title: '操作',
        dataIndex: 'operate',
        className: 'column-operate',
        key: 'operate',
        width:60
      }];
      const {data,showDetail,detailData,showFail,failMsg,taskTime} = this.state;
      const text = "确定不再标记做题结果了吗?"
      var dataSource = [];
      data.map((item,index)=>{
        dataSource.push(
          {
            key : index,
            date : this._getDate(item.time),
            desc: item.type === 1?"纠错本" : "检验题",
            operate : <div>
                        <span onClick={this.markHandle.bind(this,index)} style={{marginRight:10,cursor:"pointer",color:"#108ee9"}}>标记</span>
                        {/* <Popconfirm placement="right" title={text} onConfirm={this.confirm.bind(this,index)} okText="Yes" cancelText="No">
                          <span style={{cursor:"pointer",color:"#108ee9"}}>忽略</span>
                        </Popconfirm> */}
                      </div>
          }
        )
      })
      return(
        <div>
          <Row>
            <Col span={8}>
              <h2 className='home-title'>未标记的纠错本</h2>
              <div className='home-table'>
                 <Table columns={columns}
                        dataSource = {dataSource}
                        bordered
                        pagination={false}
                        scroll={{y:225}}/> 
              </div>
              {
                showFail? <div className='save-success'>
                   <span style={{color:'red'}}>{failMsg}</span>
                </div> : null
                            }
            </Col>
            <Col span={2}></Col>
            <Col span={13}>
              {showDetail ? <Result taskTime={taskTime} data={detailData} saveHandle={this.saveHandle.bind(this)}/> : null}
            </Col>
            <Col span={1}></Col>
          </Row>
        </div>
      )
    }
    componentWillMount(){
          axios.defaults.withCredentials = true;
          var url = `/api/v3/students/me/uploadTasks/`;
          Get(url).then(resp=>{
            console.log(resp)
            this.setState({
              data : resp.data
            })
          }).catch(err=>{
            console.log(err)
          })
    }
}


  export default Homepage;