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
        }
    }
    // onDocumentLoad({ numPages }) {
    //     this.setState({ numPages });
    //   }
    render(){
        const {PDF,pageNumber, numPages} = this.state;
        return (
            <div>
                <div style={{height:350,overflow:'auto',border:'1px solid #d9d9d9'}}>
                <Document
                    file={PDF}
                    // onLoadSuccess={this.onDocumentLoad.bind(this)}
                >
                    <Page pageNumber={pageNumber} />
                </Document>
                {/* <p>Page {pageNumber} of {numPages}</p> */}
                </div>
                <div className='save_btn'>
                {
                    this.props.category === '1'?<a download={PDF} href={PDF} target="blank"><Button type="primary" size='large' style={{width:240,height:35}}>
                                                    保存</Button></a>
                                                :null
                }
                </div>
            </div>
          );
    }
    componentDidMount(){
        var data = this.props.data;
        var dataObj = {};
        var dataParams = []
        data.map((item,i)=>{
            item.map((item2,i2)=>{
                dataObj[item2.problemId+'_'] = {
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
        console.log('YYYYYYYY',dataParams)
        var result = Post('http://118.31.16.70/api/v3/students/me/getPoints/',dataParams);  
        result.then((response)=>{
            if(response.status === 200){
                this.setState({
                    PDF : response.data
                })
            }
        })
    }
    
}

export default KnowledgePoint;