import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {Row , Col, Select, Button} from 'antd';
import AccordingTime from './subpage/AccordingTime.js';
import AccordingTopicTypes from './subpage/AccordingTopicTypes.js';
// import AccordingMasteryLevel from './subpage/AccordingMasteryLevel.js';
// import AccordingReview from './subpage/AccordingReview.js';
import {Get} from '../../fetch/data.js';
import './style.css';
const Option = Select.Option;
class ErrorSum extends Component {
    constructor(){
        super();
        this.state = {
            category : '0',
            selectValue : '0',
            chapters : [],
            chapters_sections : {},
            currentSections : [],
            defaultSections : '',
            currentChapterNum : 0,
            currentSectionNum : 0,
            checkWay : '',
            detailData : [],
            showFail:false,
            failMsg:'',
            showDetail:false
        }
    }
    changeCategory(value){
        this.setState({
            selectValue : value
        })
        if(value === '1'){
            this.setState({
                checkWay : 'problemsSortByTime'
            })
        }else if(value === '2'){
            this.setState({
                checkWay : 'problemsSortByType'
            })
        }else if(value === '3'){
            this.setState({
                checkWay : 'problemsSortByAccuracy'
            })
        }else if(value === '4'){
            this.setState({
                checkWay : 'problemsSortByType'
            })
        }
    }
    sureBtnHandle(){
        this.setState({
            category : this.state.selectValue
        })
        const {selectValue ,currentChapterNum ,currentSectionNum, checkWay} = this.state;
        if(selectValue !== '0' && currentChapterNum !== 0 && currentSectionNum !==0){
            let url = `/api/v3/students/me/${checkWay}/?chapter=${currentChapterNum}&section=${currentSectionNum}`;
            let data = Get(url);
            data.then((response)=>{
                // console.log(response)
                if(response.status ===200){
                    if(response.data.length === 0){
                        this.setState({
                            showFail : true,
                            category:'0',
                            failMsg:'CS无数据',
                            showDetail:true
                        })
                    }else{
                        this.setState({
                            detailData : response.data,
                            showFail : false,
                            showDetail:true,
                        })
                 }
                }else if(response.status ===404){
                    this.setState({
                        showFail : true,
                        failMsg:'CS无数据',
                        category:'0'
                    })
                }else if(response.status ===401){
                    this.props.history.push('/');
                }
            })
        }else if(currentChapterNum ===0){
            this.setState({
                showFail : true,
                failMsg:'章信息不正常'
            })
        }else if(selectValue === '0' && this.state.showDetail ===false){
            this.setState({
                showFail : true,
                failMsg:'归类方法不正常'
            })
        }
    }
    chaptersChange(value){
        this.setState({
            currentSections : this.state.chapters_sections[value],
            defaultSections : '',
            currentChapterNum : Number(value.split('_')[1]),
            currentSectionNum : 1
        })
    }
    sectionChange(value){
        this.setState({
            defaultSections : value,
            currentSectionNum : Number(value.split('_')[1])
        })
    }
    render(){
        const {chapters, currentSections,chapters_sections,defaultSections,currentChapterNum,currentSectionNum, detailData} = this.state;
        // console.log(currentSections)
        return(
            <div className='error-sum'>
                <Row>
                    <Col span={8}>
                        <div className='select-info'>
                            <h2 className='select-info-h2'>选择归类信息</h2>
                            <div className='select-info-content'>
                                <div className='select-category-1'>
                                    <span>章&nbsp;&nbsp;:</span>
                                    <Select placeholder='分析哪一章?' style={{ width: 240, marginLeft:'10px' }} onChange={this.chaptersChange.bind(this)}>
                                        {chapters.map((item,index)=><Option value={item} key={index}>{`第${item.split('_')[1]}章`}<span style={{marginLeft:10}}>{item.split('_')[0]}</span></Option>)}
                                    </Select>
                                </div>
                                <div className='select-category-1'>
                                    <span>节&nbsp;&nbsp;:</span>
                                    <Select placeholder='分析哪一节?' style={{ width: 240, marginLeft:'10px' }} value={defaultSections===''?currentSections[0]:defaultSections} onChange={this.sectionChange.bind(this)}>
                                        {currentSections.map((item,index)=><Option value={item} key={index}>{`第${item.split('_')[1]}节`}<span style={{marginLeft:10}}>{item.split('_')[0]}</span></Option>)}
                                    </Select>
                                </div>
                                <div className='select-category-1'>
                                    <span>归类方法&nbsp;&nbsp;:</span>
                                    <Select placeholder='如何分析?' style={{ width: 240, marginLeft:'10px' }} onChange={this.changeCategory.bind(this)}>
                                        <Option value="1">按时间</Option>
                                        <Option value="2">按类型</Option>
                                    </Select>
                                </div>
                                <div className='select-category-1'>
                                    <span></span>
                                    <Button type="primary" size='large' style={{width:240,height:35,marginLeft:'10px'}} onClick={this.sureBtnHandle.bind(this)}>确定</Button>
                                </div>
                            </div>
                            {
                                this.state.showFail? <div className='save-success'>
                                                           <span style={{color:'red'}}>{this.state.failMsg}</span>
                                                        </div> : null
                            }
                        </div>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={13}>
                        <div className='category-detail'>
                            {
                                this.state.category === '1' ? <AccordingTime data={detailData}/> :
                                this.state.category === '2' ? <AccordingTopicTypes data={detailData}/> :null
                                // this.state.category === '3' ? <AccordingMasteryLevel data={detailData}/> :
                                // this.state.category === '4' ? <AccordingReview data={detailData}/> : null
                            }
                        </div>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </div>
        )
    }
    componentDidMount(){
        const that = this;
        const data = Get('/api/v3/students/me/info/?chapter=1&section=1');
        data.then((response)=>{
            let chapters = [];
            let chapters_sections = {};
            if(response.status ===200){
            response.data.map((item,index)=>{
                if(chapters.indexOf(`${item.chapterName}_${item.chapter}`)===-1){
                    chapters.push(`${item.chapterName}_${item.chapter}`);
                }
                // chapters.push();
                if(chapters_sections[`${item.chapterName}_${item.chapter}`] === undefined){
                    chapters_sections[`${item.chapterName}_${item.chapter}`] = [];
                    chapters_sections[`${item.chapterName}_${item.chapter}`].push(`${item.sectionName}_${item.section}`);
                }else{
                    chapters_sections[`${item.chapterName}_${item.chapter}`].push(`${item.sectionName}_${item.section}`);
                }
            })  
         }else if(response.status ===401){
            //  console.log('xxxxx')
            //  console.log(this)
            this.props.history.push('/');
        }
         this.setState({
            chapters : chapters,
            chapters_sections : chapters_sections
        })
        })
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if(nextState.category === this.state.category){
    //         return false
    //     }
    //     return true
    // }
}

export default withRouter(ErrorSum);