import React, {Component} from 'react';
import axios from 'axios';
import MiniPixel from '../MiniPixel/MiniPixel';
import './ReviewSubmission.css';
import Button from 'react-bootstrap/Button';


const numColumns = 28;
const numRows = 28;
const subsetSize = 20;

export default class Visualize extends Component{
    constructor(props){
        super(props);

        this.state={
            images: [],
            pageNumber: 0,
            startIndex: 0,
            endIndex: 20,
        };

    }

    async componentDidMount(){
        //get data from database
        var data = await this.loadImages();

        this.setState({images: data});

        if(this.state.images.length > subsetSize){
            this.setState({imagesSubset: this.state.images.slice(0,20)});
        }
        else{
            this.setState({imagesSubset: data});
        }

    }

    //get dataset from server
    loadImages(){
        var data;
        data = axios.get('http://206.189.192.230:5000/datums/')
            .then(response =>{
                return response.data;
            })
            .catch((error) =>{
                console.log(error);
            })

            return data;
    }

    async handleNextClick(){
        if(this.state.endIndex >= this.state.images.length){
            return;
        }
        var newStart = this.state.startIndex + subsetSize;
        var newEnd = this.state.endIndex + subsetSize;
        this.setState({startIndex: newStart,
                        endIndex: newEnd});
        console.log("paged forwards");
    }

    async handlePrevClick(){
        if(this.state.startIndex === 0){
            return;
        }
        var newStart = this.state.startIndex - subsetSize;
        var newEnd = this.state.endIndex - subsetSize;
        this.setState({startIndex: newStart,
                        endIndex: newEnd});
        console.log("paged backwards");
    }

    //image number z
    //pixel number i
    renderMiniPixel(z, i){
        return(
           <MiniPixel
                value = {this.state.images[z].pixels.charAt(i)}
            />
        );
    }

    render(){

        //set up image in proper dimensions for rendering
        var set = [];
        for(let z=0; z<this.state.images.length; z++){
            var image = [];
            for(let i=0; i<numRows; i++){
                var row = [];
                for(let j=0; j<numColumns; j++){
                    row.push(
                        <div key={i*numColumns+j} className="minipixel">
                            {this.renderMiniPixel(z, i*numColumns+j)}
                        </div>
                    );
                }
                image.push(
                    <div key={"minirow"+i} className="minirow">
                        {row}
                    </div>
                );
            }
            set.push(
                <div key={"miniimage-box"+z} className="miniimage-box">
                    <div key={"miniimage"+z} className="miniimage">
                        {image}
                        <br />
                    </div>
                    <div className="labelValue">
                        {this.state.images[z].label}
                    </div>
                    <div className="idValue">
                        {this.state.images[z]._id.substring(20)}
                    </div>
                </div>

            );
        }

        return(
            <div>
                <h1>Dataset</h1>
                <h4>Please be patient with loading times</h4>
                <div className = "imageSet">
                    {set.slice(this.state.startIndex,this.state.endIndex)}
                    <div className="imageControls">
                        <Button variant="secondary" className="left-button"
                        onClick={() => this.handlePrevClick()}>
                           View Prev 20 
                        </Button>
                        <Button variant="secondary" className="right-button"
                        onClick={()=> this.handleNextClick()}>
                            View Next 20
                        </Button>
                    </div>
                </div>
                <div className="pageDisplay">
                    <h5>Viewing {this.state.startIndex + 1}-{this.state.endIndex} of {this.state.images.length}</h5>
                </div>
            </div>
        );
    }
}