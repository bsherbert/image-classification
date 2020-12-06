import React, {Component} from 'react';
import './HeatPixel.css';

export default class HeatPixel extends Component{
    render(){
        switch(true){
            case this.props.value < .05:
                return( 
                    <button 
                        className="heatpixel zero-heatpixel"
                    >
                    </button>
                );
            case this.props.value < .1:
                return( 
                    <button 
                        className="heatpixel one-heatpixel"
                    >
                    </button>
                );
            case this.props.value < .2:
                return( 
                    <button 
                        className="heatpixel two-heatpixel"
                    >
                    </button>
                );
            case this.props.value < .3:
                return( 
                    <button 
                        className="heatpixel three-heatpixel"
                    >
                    </button>
                );
            case this.props.value < .5:
                return( 
                    <button 
                        className="heatpixel four-heatpixel"
                    >
                    </button>
                );
            case this.props.value > .5:
                return( 
                    <button 
                        className="heatpixel five-heatpixel"
                    >
                    </button>
                );        
            default:
                return( 
                    <button 
                        className="heatpixel zero-heatpixel"
                    >
                    </button>
                );
        }
    }
}