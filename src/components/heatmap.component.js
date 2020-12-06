import React, {Component} from 'react';
import axios from 'axios';
import HeatPixel from '../HeatPixel/HeatPixel';
import './ReviewSubmission.css';

const numColumns = 28;
const numRows = 28;
const numWeightVectors = 10;
const imageSize = numRows*numColumns;

export default class Heatmap extends Component{
    constructor(props){
        super(props);

        this.state={
            images: [],
            sortedData: [],
            heatmaps: [],    

        }

    }

    async componentDidMount(){
        //get data from database
        var data = await this.loadImages();

        this.setState({images: data});


        console.log(this.state.images);
        
        //initialize sortedData
        for(let i=0; i<numWeightVectors; i++){
            this.state.sortedData[i] = [];
        }

        this.fillHeatmaps();

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

    //sort each image into array based on label value
    fillHeatmaps(){
        for(let i=0; i<this.state.images.length; i++){
            this.state.sortedData[this.state.images[i].label].push(this.state.images[i]);
        
        }

        console.log(this.state.sortedData);

        var temp = [];
        var totalPixels = Array(numWeightVectors).fill(0);
        for(let i=0; i<numWeightVectors; i++){
            temp[i] = Array(imageSize).fill(0);
        }

        

        //fill temp [0] with a counter for each pixel location that increments each time 
        //an image has a pixel in that location

        //for each number value
        for(let i=0; i<this.state.sortedData.length; i++){
            //for each image with that value
            for(let j=0; j<this.state.sortedData[i].length; j++){
                //for each pixel in that image
                for(let k=0; k<this.state.sortedData[i][j].pixels.length; k++){
                    //if a pixel is occupied, increment
                    if(this.state.sortedData[i][j].pixels.charAt(k) === "u"){
                        temp[i][k]++;
                        totalPixels[i]++;
                    }
                }
            }
        }
        console.log(temp);
        console.log(totalPixels);
        //convert temp values to percentage of images that have a pixel in that spot
        //5-10
        //10-20
        //20-30
        //30-50
        //50+

        //for each number value
        for(let i=0; i<temp.length; i++){
            //for each pixel value
            for(let j=0; j<temp[i].length; j++){
                //convert flat value to percentage
                temp[i][j] = temp[i][j]/this.state.sortedData[i].length;
            }
        }

        console.log(temp);

        this.setState({heatmaps: temp});



    }

    //image number z
    //pixel number i
    renderHeatPixel(z, i){
        return(
           <HeatPixel
                value = {this.state.heatmaps[z][i]}
            />
        );
    }

    render(){

        //set up image in proper dimensions for rendering
        var set = [];
        for(let z=0; z<this.state.heatmaps.length; z++){
            var image = [];
            for(let i=0; i<numRows; i++){
                var row = [];
                for(let j=0; j<numColumns; j++){
                    row.push(
                        <div key={i*numColumns+j} className="minipixel">
                            {this.renderHeatPixel(z, i*numColumns+j)}
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
                </div>

            );
        }

        return(
            <div>
                <h1>Heatmaps</h1>
                <div className="imageSet">
                    {set}
                </div>
            </div>
        );
    }


}
