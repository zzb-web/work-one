import React, { Component } from 'react';
import {Table, Switch, Button} from 'antd';
import {Post} from '../../../fetch/data.js';
import './style.css';
class TopicResult extends Component{
   constructor(props){
     super();
     this.state={
       data : [],
       showSure: true,
       bookType : props.bookType
     }
   }
    saveBtnHandle(){
      this.setState({showSure : false})
      setTimeout(()=>{
          this.setState({showSure:true})
      },500)
      const {bookType} = this.state;
        let msg = [];
        this.state.data.map((item,index)=>{
          if(item.status){
            let position = item.position.split('/');
            if(position.length !== 3){
              if(!item.isCorrect){
                msg.push({
                  isCorrect : item.isCorrect,
                  problemId: item.problemId,
                  subIdx : -1
                })
              }
            }else{
              var subIdx = Number(position[2].split('')[1]);
              if(!item.isCorrect){
                msg.push({
                  isCorrect : item.isCorrect,
                  problemId: item.problemId,
                  subIdx : subIdx
                })
              }
            }
          }
        })
        const url = '/api/v3/students/me/problems/';
        var params = {
          time : this.props.date,
          type : bookType,
          problems : msg
        }
        var response = Post(url,params);
        response.then((resp)=>{
          // console.log(resp)
          if(resp.status === 200){
            this.props.handleDetail();
          }
        })
        
     }
    cancelBtnHandle(){
      this.props.handleCancel();
    }
    change(e){
      let data = this.state.data;
      if(e){
        data.forEach((item,index)=>{
          data[index].status = true;
          data[index].isCorrect = true;
        })
      }else{
        data.forEach((item,index)=>{
          data[index].status = false;
        })
      }
      this.setState({
        data : data
      })
    }
    tdClick(index){
      let data = this.state.data;
      if(data[index].status){
        data[index].status  = false
      }else{
        data[index].status  = true
      }
      data[index].isCorrect = true;
      this.setState({
        data : data
      })
    }
    tdClick2(index){
      let data = this.state.data;
      if(data[index].isCorrect){
        data[index].isCorrect  = false
      }else{
        data[index].isCorrect  = true
      }
      this.setState({
        data : data
      })
    }
    _handleData(topicAll){
      let data = [];
      topicAll.map((item,index)=>{
        if(item.subIdx===-1){
          if(item.idx === -1){
            data.push({
              key : index +1,
              position : `${item.column}`,
              status : false,
              isCorrect : false,
              problemId : item.problemId,
            })
          }else{
            data.push({
              key : index +1,
              position : `${item.column}/${item.idx}`,
              status : false,
              isCorrect : false,
              problemId : item.problemId,
            })
          }
        }else{
          data.push({
            problemId : item.problemId,
            key : index +1,
            position : `${item.column}/${item.idx}/(${item.subIdx})`,
            status : false,
            isCorrect : false,
            problemId : item.problemId,
          })
        }
      })
      return data;
    }
    componentWillMount(){
      const {page,topicAll} = this.props;
      const data = this._handleData(topicAll)
      data.map((item,index)=>{
        item.status = true;
        item.isCorrect = true
      })
     this.setState({
       data : data
     })
    }
    componentWillReceiveProps(nextProps){
      const {topicAll} = nextProps;
      const data = this._handleData(topicAll)
      data.map((item,index)=>{
        item.status = true;
        item.isCorrect = true
      })
      this.setState({
        data : data,
        bookType : nextProps.bookType
      })
    }
    render(){
      const columns = [{
        title: '题目位置',
        className: 'column-position',
        dataIndex: 'position',
        width:280
      },
      //  {
      //   title: <Switch checkedChildren="全布置了" unCheckedChildren="全没布置" onChange={this.change.bind(this)}/>,
      //   className: 'column-status',
      //   dataIndex: 'status',
      //   width:200,
      //   render : (text, record, index)=><div onClick={()=>this.tdClick(index)}>{text}</div>
      // },
      {
        title: '做题结果',
        className: 'column-result',
        dataIndex: 'isCorrect',
        render : (text, record, index)=>{
                                          return(
                                          <div onClick={()=>this.tdClick2(index)}>{text}</div>
                                          )
                                        }
      },
    ];
      let data1=[];
      this.state.data.map((data, i)=>{
        let a ={};
        a.key = data.key;
        a.position = data.position;
        if(!data.status){
          a.status = <Switch checkedChildren="布置了" unCheckedChildren="没布置" checked={false}/>
          a.isCorrect = null
        } else{
          a.status = <Switch checkedChildren="布置了" unCheckedChildren="没布置" checked/>
          if(!data.isCorrect){
            a.isCorrect = <Switch style={{width:60}} checkedChildren="" unCheckedChildren="×" checked={false}/>
          } else{
            a.isCorrect = <Switch style={{width:60}} checkedChildren="" unCheckedChildren="×" checked/>
          }
        }
        data1.push(a)
      })
      const {showSure} = this.state;
        return(
                <div className='topic-result daily-work'>
                    <h2 className='select-info-h2'>选择做题结果</h2>
                    <Table
                        columns={columns}
                        dataSource={data1}
                        bordered
                        pagination={false}
                        scroll={{ y: 255 }}
                        style={{marginTop:20}}
                        rowClassName={(record, index)=>{
                          if(record.isCorrect){
                            if(record.isCorrect.props.checked){
                              return ''
                            }else{
                              return 'wrong-row'
                            }
                          }else{
                            return ''
                          }
                        }}
                    />
                    <div className='btn-content'>
                        <Button type="primary"
                                size='large'
                                style={{width:150,height:40,marginRight:'20px'}}
                                onClick={this.saveBtnHandle.bind(this)}
                                disabled={!showSure}>保存</Button>
                        {/* <Button size='large'
                                style={{width:150,height:40,marginLeft:'20px'}}
                                onClick={this.cancelBtnHandle.bind(this)}
                                >取消</Button> */}
                    </div>
                </div>
        )
    }
}

export default TopicResult;
