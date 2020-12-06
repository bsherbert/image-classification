import React, {Component} from 'react';
import axios from 'axios';
import MiniPixel from '../MiniPixel/MiniPixel';
import './ReviewSubmission.css';
import Button from 'react-bootstrap/Button';


const numColumns = 28;
const numRows = 28;

export default class AdminReview extends Component{
    constructor(props){
        super(props);

        this.state={
            isAdmin: this.props.isAdmin,
            images: [],
            delete: [],
            approve: [],
        };
    }

    async componentDidMount(){
        //get images from database
        var data = await this.loadImages();

        this.setState({images: data});

        console.log(this.state.images);

        //set default value for selectors
        for(let i=0; i<this.state.images.length;i++){
            let temp = document.getElementById("label"+i);
            console.log(temp);
            for(let q=0; q<temp.options.length; q++){
                if(temp.options[q].value === this.state.images[i].label){
                    temp.options[q].selected = true;
                    break;
                }
            }
        }

    }

    updateLabels(){

        //update default labels
        for(let i=0; i<this.state.images.length;i++){
            let temp = document.getElementById("label"+i);
            console.log(temp);
            for(let q=0; q<temp.options.length; q++){
                if(temp.options[q].value === this.state.images[i].label){
                    temp.options[q].selected = true;
                    break;
                }
            }
        }
        

    }

    //get review data from server
    loadImages(){
        var data;
        data = axios.get('http://206.189.192.230:5000/reviews/')
            .then(response =>{
                return response.data;
            })
            .catch((error) =>{
                console.log(error);
            });

            return data;
    }

    deleteImage(id){
        return new Promise(resolve =>{
            axios.delete('http://206.189.192.230:5000/reviews/'+id)
            .then(res => {
                console.log(res.data);
                resolve();
            });
        });
    }

    approveImage(datum){
        return new Promise(resolve =>{
            axios.post('http://206.189.192.230:5000/datums/add', datum)
            .then(res => {
                console.log(res.data);
                resolve();
            });
        });
    }
    

    async handleDeleteClick(imgNum){
        console.log("in delete");
        console.log("number of images: " + this.state.images.length);
        var id = this.state.images[imgNum]._id;
        await this.deleteImage(id);

        //return images that are not equal to the id of the image that was just deleted
        this.setState({
            images: this.state.images.filter(el => el._id !== id)
        });

        this.updateLabels();
        
    }

    async handleApproveClick(imgNum){
        
        console.log("in approve");
        
        //add image to dataset
        
        //get label
        var newLabel= document.getElementById("label"+imgNum).value;
        
        console.log(newLabel);

        const datum = {
            width: numColumns,
            height: numRows,
            label: newLabel,
            pixels: this.state.images[imgNum].pixels,
        }

        await this.approveImage(datum);
        
        //remove image from review set
        var id = this.state.images[imgNum]._id;
        await this.deleteImage(id);

        //return images that are not equal to the id of the image that was just deleted
        this.setState({
            images: this.state.images.filter(el => el._id !== id)
        });

        this.updateLabels();
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
        if(!this.state.isAdmin){
            return(
                <div>
                    you aren't allowed here!
                </div>
            );
        }
        else{

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
                        <select name="label" id={"label"+z} className="label">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                        </select>
                        <Button name="delete" 
                        variant="secondary"
                        id={"delete"+z} 
                        className="delete2" 
                        onClick={()=>this.handleDeleteClick(z)}>
                            Delete Image
                        </Button>
                        <Button name="approve"
                        variant="secondary"
                        id={"approve"+z}
                        className="approve2"
                        onClick={()=>this.handleApproveClick(z)}>
                            Approve Image
                        </Button>
                    </div>

                );
            }

            return(
                <div>
                    <h1>Review</h1>
                    <div className = "imageSet">
                        {set}
                    </div>

                </div>
            );
        }
    }
}