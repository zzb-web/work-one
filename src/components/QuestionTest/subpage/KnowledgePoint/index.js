import React from 'react';
import {Button} from 'antd';
import { Document, Page } from 'react-pdf';
import{Post} from '../../../../fetch/data.js';
class KnowledgePoint extends React.Component{
    constructor(){
        super();
        this.state={
            PDF:'',
            numPages: null,
            pageNumber: 1,
            scale: 2,
            data:[]
        }
    }
    onDocumentLoad({ numPages }) {
        this.setState({ numPages });
      }
      wheelEvent(event){
        var {pageNumber,numPages} = this.state;
        // console.log(pageNumber)
        var pdf = this.refs.pdf;
        var box = this.refs.box;
        var scrollHeight = box.scrollTop;
         //判断鼠标滚轮的上下滑动
         let deta = event.deltaY;
         var heightDiff = 841-350;
         if(deta > 0){
            if(scrollHeight > heightDiff){
                if(pageNumber< numPages){
                    this.setState({
                        pageNumber:pageNumber+1
                    })
                    this.refs.top.scrollIntoView();
                }
                
            }
         }
         if(deta < 0){
            if(scrollHeight === 0){
                if(pageNumber>1){
                    this.setState({
                        pageNumber:pageNumber-1
                    })
                    this.refs.top.scrollIntoView();
                }
            }
         }
    }
    render(){
        // console.log('知识点')
        const {PDF,pageNumber, scale} = this.state;
        return (
            <div>
                <div ref='box' style={{height:350,overflow:'auto',border:'1px solid #d9d9d9'}} onWheel={this.wheelEvent.bind(this)}>
                <div ref='top'></div>
                <Document
                    file={PDF}
                    scale={scale}
                    onLoadSuccess={this.onDocumentLoad.bind(this)}
                    ref = 'pdf'
                >
                    <Page pageNumber={pageNumber} />
                </Document>
                </div>
                <div className='save_btn'>
                {
                    this.props.category === '1'?<a download={PDF} href={PDF} target="blank"><Button type="primary" size='large' style={{width:240,height:35}}>
                                                    下载</Button></a>
                                                :null
                }
                </div>
            </div>
          );
    }
    componentWillReceiveProps(nextProps){
        // console.log('willreceive');
        var data = nextProps.data;
        if(JSON.stringify(this.state.data)!==JSON.stringify(nextProps.data)){
            // console.log('不一样')
            this.setState({
                data : data
            })
            var dataObj = {};
            var dataParams = []
            data.map((item,i)=>{
                item.map((item2,i2)=>{
                    dataObj[item2.problemId+'_'+i2] = {
                                                    index:item2.index,
                                                    subIdx: item2.subIdx, 
                                                    }
                })
            })
            for(var key in dataObj){
                dataParams.push({
                    problemId: key.split('_')[0],
                    subIdx:dataObj[key].subIdx,
                    index: dataObj[key].index
                })
            }
            // console.log('YYYYYYYY',dataParams)
            var result = Post('/api/v3/students/me/getPointsFile/',dataParams);  
            result.then((response)=>{
                if(response.status === 200){
                    this.setState({
                        PDF : response.data.pdfurl
                    })
                }
            })
        }
    }
    shouldComponentUpdate(nextProps,nextState){
        if(JSON.stringify(nextProps.data)!==JSON.stringify(this.state.data)|| nextState.PDF!==this.state.PDF||nextState.pageNumber!==this.state.pageNumber){
            // console.log('知识点不一样')
            return true;
        }else{
            // console.log('知识点一样')
            return false;
        }
       
    }
    componentDidMount(){
        var data = this.props.data;
        this.setState({
            data : data
        })
        var dataObj = {};
        var dataParams = []
        data.map((item,i)=>{
            item.map((item2,i2)=>{
                dataObj[item2.problemId+'_'+i2] = {
                                                index:item2.index,
                                                subIdx: item2.subIdx, 
                                                }
            })
        })
        for(var key in dataObj){
            dataParams.push({
                problemId: key.split('_')[0],
                subIdx:dataObj[key].subIdx,
                index: dataObj[key].index
            })
        }
        // console.log('YYYYYYYY',dataParams)
        var result = Post('/api/v3/students/me/getPointsFile/',dataParams);  
        result.then((response)=>{
            if(response.status === 200){
                this.setState({
                    PDF : response.data.pdfurl
                })
            }
        })
    }
    
}

export default KnowledgePoint;