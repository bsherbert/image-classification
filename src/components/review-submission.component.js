import React, {Component} from 'react';
import axios from 'axios';
import MiniPixel from '../MiniPixel/MiniPixel';
import './ReviewSubmission.css';
import Button from 'react-bootstrap/Button';
import email from '../images/email.png';

import Nav from 'react-bootstrap/Nav';
import { Navbar } from 'react-bootstrap';
import {BrowserRouter as Router} from "react-router-dom";

const numColumns = 28;
const numRows = 28;
const imageSize = numRows*numColumns;

export default class ReviewSubmission extends Component{
    constructor(props){
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state ={
            name: '',
            images: [],
            labels: [],
            date: new Date(),
            score: this.props.score,
        }
    }

    componentDidMount(){
        //set default value for selectors
        for(let i=0; i<this.props.answerSet.length;i++){
            let temp = document.getElementById("label"+i);
            console.log(temp);
            for(let q=0; q<temp.options.length; q++){
                if(Number(temp.options[q].value) === this.props.answerSet[i][1]){
                    temp.options[q].selected = true;
                    break;
                }
            }
        }
        //set current date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;

        this.setState({date: today});

        //hide form if nothing to submit
        //hide additional properties due to refresh problem
        if(this.props.redirected === undefined){
            var x = document.getElementById("submission-screen");
            var y = document.getElementById("review-nav");
            var z = document.getElementById("footer");
            x.style.display = "none";
            y.style.display = "none";
            z.style.display = "none";

        }
    }

    //[z][0][i]
    //image number z
    // 0/1 for imagepixels array / label
    //pixel number i
    renderMiniPixel(z, i){
        return(
           <MiniPixel
                value = {this.props.answerSet[z][0][i]}
            />
        );
    }

    handleDebugClick(){
        console.log(this.props.answerSet);
        console.log("-------");
        for(let i=0; i<this.props.answerSet.length; i++){
            console.log(this.props.answerSet[i])
            console.log("-------");
        }

        console.log(this.props.answerSet[0][0][0]);
    }

    onChangeName(e){
        this.setState({
            name: e.target.value,
        });
    }

    async onSubmit(e){
        e.preventDefault();

        //submit images/labels to review
        for(let i=0; i<this.props.answerSet.length; i++){
            //convert array of pixels into string
            var inputImage = "";
            for(let j=0; j<imageSize; j++){
                if(this.props.answerSet[i][0][j] === "e"){
                    inputImage += " ";
                }
                else if(this.props.answerSet[i][0][j] === "u"){
                    inputImage += "u";
                }
            }

            //get label based on selector
            var el = document.getElementById("label"+i);
            var label = el.options[el.selectedIndex].value;

            var review = {
                width: numColumns,
                height: numRows,
                label: label,
                pixels: inputImage,
            }

            console.log(review);

            //send data to backend
            await axios.post('http://206.189.192.230:5000/reviews/add', review)
                .then(res => console.log(res.data));

        }

        //submit score/name to scores
        const score = {
            username: this.state.name,
            value: this.state.score,
            date: this.state.date,
        }
        console.log(score);

        //send data to backend
        await axios.post('http://206.189.192.230:5000/scores/add', score)
            .then(res => console.log(res.data));
        
        //return to home page
        window.location ='/';
    }

    onBackClick(){
        window.location ='/';
    }

    render(){

        //set up image in proper dimensions for rendering
        var set = [];
        for(let z=0; z<this.props.answerSet.length; z++){
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
                </div>

            );
        }

        return(
            <Router>
            <div id="review-nav">
                <Navbar bg="light">
                <Navbar.Brand href="/">Digit Classifier</Navbar.Brand>
                <Nav defaultActiveKey="/">
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/visualize">Visualize Dataset</Nav.Link>
                    <Nav.Link href="/heatmap">View Heatmaps</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav>
                </Navbar>
            </div>
            <div id="submission-screen">
                {//prevent crash on reload of submission page
                }
                <div className="flex-container" id="flex-container" style = {{display: "none"}}></div>
                <h2>Congratulations!</h2>
                <h3>Your Score: {this.props.score}</h3>
                <h5>Please ensure that your images match the given label before submitting your score</h5>
                <form onSubmit={this.onSubmit}>
                    <div className = "imageSet">
                        {set}
                    </div>
                    <label>Name:</label><br />
                    <input required 
                    type="text" 
                    id="playerName" 
                    value={this.state.username}
                    onChange={this.onChangeName}/>
                    <div class="submission-buttons">
                        <Button id="submit-button" variant="primary" type="submit" value="Submit">Submit</Button>
                        <Button id="back-button" variant="secondary" onClick={() => this.onBackClick()}>Try Again Without Submitting</Button>
                    </div>
                </form>
            </div>
            <div id="footer" className="footer">
                    <div className="footer-box">
                        <div className="top-footer">
                            <h5>2020 Brian Sherbert. All rights reserved.</h5>
                        </div>
                        <div className="bottom-footer">
                            <img src={email} alt="email" />
                            <p>bsherbert12@gmail.com</p>
                        </div>
                    </div>
                </div>
            </Router>

        );
    }

}