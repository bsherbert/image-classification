import React, {Component} from 'react';
import './Pixel.css';

export default class Pixel extends Component{
    render(){
        switch(this.props.value){
            case "e":
                return( 
                    <button 
                        className="pixel empty-pixel"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >
                    </button>
                );
            case "u":
                return( 
                    <button 
                        className="pixel used-pixel"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >
                    </button>
                );
            default:
                return( 
                    <button 
                        className="pixel empty-pixel"
                        onMouseDown= {() => this.props.onMouseDown()}
                        onMouseEnter= {() => this.props.onMouseEnter()}
                        onMouseUp= {() => this.props.onMouseUp()}
                    >

                    </button>
                );
        }
    }
}