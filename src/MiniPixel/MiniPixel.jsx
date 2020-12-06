import React, {Component} from 'react';
import './MiniPixel.css';

export default class MiniPixel extends Component{
    render(){
        switch(this.props.value){
            case "e":
                return( 
                    <button 
                        className="minipixel empty-minipixel"
                    >
                    </button>
                );
            case "u":
                return( 
                    <button 
                        className="minipixel used-minipixel"
                    >
                    </button>
                );
            default:
                return( 
                    <button 
                        className="minipixel empty-minipixel"
                    >

                    </button>
                );
        }
    }
}