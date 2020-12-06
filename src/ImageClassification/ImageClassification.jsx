import React, {Component} from 'react';
import './ImageClassification.css';
import Classifier from '../Classifier/Classifier';

export default class ImageClassification extends Component{

    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return(
                <div className="classifier">
                    <Classifier />
                </div>
        )
    }

}