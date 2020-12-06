import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {Redirect} from 'react-router';
import './Classifier.css';
import Pixel from '../Pixel/Pixel';
import {Perceptron} from '../ClassificationMethods/Perceptron';
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import email from '../images/email.png';

import ScoreList from "../components/scores-list.component";
import ReviewSubmission from '../components/review-submission.component';
import AdminLogin from '../components/admin-login.component.js';
import Visualize from '../components/visualize.component.js';
import Heatmap from '../components/heatmap.component.js';
import About from '../components/about.component.js';
import { Navbar } from 'react-bootstrap';

//global vars
const numColumns = 28;
const numRows = 28;
const imageSize = numRows*numColumns;
//10 digits (0-9)
const numWeightVectors = 10;
//number of training iterations perceptron will run through
const numIterations = 25;


export default class Classifier extends Component{
    constructor(props){
        super(props);
        this.state={
            pixels: Array(imageSize).fill("e"),
            perceptronWeights: Array(numWeightVectors).fill(0),
            mouseIsDown: false,
            redirect: false,
            question: "",
            answer: -1,
            gameInProgress: false,
            timeRemaining: 30,
            score: 0,
            //[drawn image, label] pairing
            answerSet: [],
            lastInput: null,
            lastAnswer: null,

        };
    }

    //run initial perceptron training on page load
    async componentDidMount(){
        //set up flex container for animations
        //may need to uncomment later
        //document.getElementById("game-container").className = "game-container"
        
        //hide start-screen
        //show load notice
        var x = document.getElementById("start-screen");        
        var y = document.getElementById("loading-notice");

        //need to check since reloading the page while on other components will check for these elements when they dont exist
        if(x !== null && y !== null){
            x.style.display = "none";
            y.style.display = "block";
        }

        await this.handlePerceptronClick();
        
        //adjust display
        if(x !== null && y!==null){
            y.style.display = "none";
            x.style.display = "block";
        }
    }

    //primary drawing function, takes position 'i' on grid as input
    handleMouseDown(i){
        this.setState({mouseIsDown: true});
        var pixels = this.state.pixels.slice();
        
        //make 3x3 grid centered on selected pixel a "u"
        var currColumn = Math.floor(i/numColumns);
        
        pixels[i] = "u"


        if(i+1 >= 0 && i+1 <= imageSize && (currColumn === Math.floor((i+1)/numColumns)))
            pixels[i+1] = "u";
        if(i-1 >= 0 && i-1 <= imageSize && (currColumn === Math.floor((i-1)/numColumns)))
            pixels[i-1] = "u";
        if(i+numColumns >= 0 && i+numColumns <= imageSize && (currColumn+1 === Math.floor((i+numColumns)/numColumns)))
            pixels[i+numColumns] = "u";
        if(i-numColumns >= 0 && i-numColumns <= imageSize && (currColumn-1 === Math.floor((i-numColumns)/numColumns)))
            pixels[i-numColumns] = "u";
        if(i+numColumns+1 >= 0 && i+numColumns+1 <= imageSize && (currColumn+1 === Math.floor((i+numColumns+1)/numColumns)))
            pixels[i+numColumns+1] = "u";
        if(i+numColumns-1 >= 0 && i+numColumns-1 <= imageSize && (currColumn+1 === Math.floor((i+numColumns-1)/numColumns)))
            pixels[i+numColumns-1] = "u";
        if(i-numColumns+1 >= 0 && i-numColumns+1 <= imageSize && (currColumn-1 === Math.floor((i-numColumns+1)/numColumns)))
            pixels[i-numColumns+1] = "u";
        if(i-numColumns-1 >= 0 && i-numColumns-1 <= imageSize && (currColumn-1 === Math.floor((i-numColumns-1)/numColumns)))
            pixels[i-numColumns-1] = "u";
        
        
        this.setState({pixels: pixels});
    }

    //works in tandum with handleMouseDown
    handleMouseEnter(i){
        if(this.state.mouseIsDown){
            this.handleMouseDown(i);
        }
    }


    //if a game is currently in progress, will submit the current drawing as a response after .5 seconds have passed
    handleMouseUp(i){
        this.setState({mouseIsDown: false});
        //reset className for animation
        document.getElementById("game-container").className = "game-container";

        //check after x miliseconds if mouse is down, otherwise, submit response
        if(this.state.gameInProgress){
            this.sleep(500).then(() =>{
                if(!this.state.mouseIsDown && this.state.gameInProgress){
                    //check answer
                    if(this.handleCheckClick() === this.state.answer){
                        this.setState({score: this.state.score + 1});
                        document.getElementById("game-container").className = "game-correct";
                    }
                    else{
                        document.getElementById("game-container").className = "game-incorrect";
                    }
                    //store result
                    this.state.answerSet.push([this.state.pixels, this.state.answer]);
                    //update last answer
                    this.setState({lastAnswer: this.state.answer});
                    //generate new question
                    this.generateQuestion();
                    //clear display
                    this.handleClearClick();



                }
            });
        }
    }

    //helper function to add delay to handleMouseUp
    sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //run game timer for given miliseconds
    gameTimer(ms){
        //allow access to states while inside promise
        var app = this;
        return new Promise(resolve =>{


            var now = new Date().getTime();
            //set target to miliseconds from current time
            var target = now + ms;
    
            
            var x = setInterval(function(){
                now = new Date().getTime();
                var distance = target - now;
               
    
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                app.setState({timeRemaining: seconds});
    
    
                if(distance <= 0){
                    clearInterval(x);
                }
    
            }, 1000);

            setTimeout(() =>{
                resolve();
            }, ms);
        });
    }

    //sets up states to prepare for game start, creates timers/questions, and redirects on game end
    async handleStartClick(){
        //train perceptron with most recent data


        //update state to prepare for game
        this.setState({gameInProgress: true,
            pixels: Array(imageSize).fill("e"),
            score: 0,
            timeRemaining: 30,
            answerSet: [],
            lastInput: null,
            lastAnswer: null,
            mouseIsDown: false,});

        //adjust display
        var w = document.getElementById("score");
        w.style.display = "block";
        var x = document.getElementById("start-screen");
        x.style.display = "none";
        var y = document.getElementById("game-display");
        y.style.display = "block";
        var z = document.getElementById("clear-button")
        z.style.display = "none";
        this.generateQuestion();

        //run game for 30 seconds
        await this.gameTimer(30000);

        //adjust display
        w.style.display = "none";
        x.style.display = "block";
        y.style.display = "none";
        z.style.display = "block";
        this.setState({gameInProgress: false});
        this.handleClearClick();
        
        //go to new page to review labels and submit high score
        this.setState({redirect: true});

    }

    //clears the grid on button press
    handleClearClick(){
        this.setState({pixels: Array(imageSize).fill("e")});
    }

    //get training data from server
    getDataFromServer(){
        var data;
        data = axios.get('http://206.189.192.230:5000/datums/')
        .then(response => {
            return response.data;
        });

        return data;
    }

    //train perceptron based on data in database
    async handlePerceptronClick(){
        var numFeatures = numColumns * numRows;
        var data = await this.getDataFromServer();
        var digitWeights = Perceptron(numFeatures, data, numWeightVectors, numIterations);
        
        this.setState({perceptronWeights: digitWeights});

        //console.log(this.state.perceptronWeights);
    }

    //function used to calculate a guess for the current image based on weights generated by perceptron
    handleCheckClick(){
        //check if perceptronWeights is empty?
        
        //initialize score for each digit to 0
        var score = [];
        for(let i=0; i<numWeightVectors; i++){
            score[i] = 0;
        }

        //for each digit
        for(let digit=0; digit<numWeightVectors; digit++){
            //if pixel is occupied
            for(let q=0; q<imageSize; q++){
                if(this.state.pixels[q] === "u"){
                    //increase score by feature weight
                    score[digit] += this.state.perceptronWeights[digit][q];
                }
            }

            //add bias
            score[digit] += this.state.perceptronWeights[digit][imageSize];
        }

        //pick highest scoring digit
        var bestScore = Number.MIN_VALUE;
        var bestDigit = -1;
        for(let digit=0; digit<numWeightVectors; digit++){
            if(score[digit] > bestScore){
                bestDigit = digit;
                bestScore = score[digit];
            }
        }

        //set up to display guess
        this.setState({lastInput: bestDigit});

        return bestDigit;

    }

    //generate simple math question with an answer in [0-9]
    generateQuestion(){
        //generate number [0-9]
        var answer = Math.floor((Math.random() * 10));
        
        //generate first value [(-10)-(10)]
        var first = Math.floor((Math.random() * 10) + 1);

        //calculate second value
        var second = answer - first;

        this.setState({question: first + " + " + second + " = ?",
                        answer: answer});

    }

    //render a single pixel in the image
    renderPixel(i){
        return(
            <Pixel  
                value = {this.state.pixels[i]}
                onMouseDown = {() => this.handleMouseDown(i)}
                onMouseEnter = {() => this.handleMouseEnter(i)}
                onMouseUp = {() => this.handleMouseUp(i)}/>
        );
    }
    
    render(){
        //set up image in proper dimensions for rendering
        var image = [];
        for(let i=0; i<numRows; i++){
            var row = [];
            for(let j=0; j<numColumns; j++){
                row.push(
                    <div key={i*numColumns+j} className="pixel">
                        {this.renderPixel(i*numColumns+j)}
                    </div>
                );
            }
            image.push(
                <div key={"row"+i} className="row">
                    {row}
                </div>
            );
        }

        //redirect after a game
        if(this.state.redirect){
            return( 
            <Router>
                <Route path="/review"
                        render = {() => <ReviewSubmission answerSet={this.state.answerSet} score={this.state.score} redirected={this.state.redirect} />}
                 />                
            <Redirect push to="/review" />
            </Router>   
            );
        }
        
        return(
            
            <Router>
            {/*
            Links set the address bar to desired value (read by Routes below)
            */}
            <Navbar bg="light">
                <Navbar.Brand href="/">Digit Classifier</Navbar.Brand>
            <Nav defaultActiveKey="/">
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/visualize">Visualize Dataset</Nav.Link>
                    <Nav.Link href="/heatmap">View Heatmaps</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            </Navbar>
            {/*
            Routes will display the desired components when the address bar requirement is met
            */}
            <div className="page-container">
                <div className="content" id="content">
                    <Route path="/" exact>

                    <h1>Classifier</h1>

                    <div id = "game-container" className="game-container">
                        <div id = "flex-container" className = "flex-container">
                            <div id = "loading-notice"
                                style = {{display: "none"}}>
                                <h3>Training the AI, please wait...</h3>
                            </div>
                            <div className = "start-screen" id="start-screen">
                                <h3>Answer as many questions as you can before time runs out!</h3>
                                <p>Simple math questions will be displayed here. <br />Draw a number in the grid on the right to answer.</p>
                                <Button variant="primary" size="lg" 
                                    className = "start-button"
                                    id="start-button"
                                    onClick={() => this.handleStartClick()}>
                                    click here to start
                                </Button>
                            </div>
                            <div className = "game-display"
                                    id = "game-display"
                                    style = {{display: "none"}}>
                                <div id="guess-answer"><h3>Last Input: {this.state.lastInput}</h3>
                                                        <h3>Last Answer: {this.state.lastAnswer}</h3></div>
                                <div><h2>Time Remaining:</h2></div>
                                <div><h2>{this.state.timeRemaining + " sec"}</h2><br></br></div>
                                <div><h2>Question:</h2></div>
                                <div><h2>{this.state.question}</h2></div>
                            </div>
                            <div className = "image">
                                {image}
                            </div>  
                        </div>
                        <Button variant="secondary" size="sm"
                        className = "clear-button"
                        id = "clear-button"
                        onClick={() => this.handleClearClick()}
                        >clear grid</Button>
                    <h4 className="score" id="score" style ={{display: "none"}}>{"score: " + this.state.score}</h4>
    
                    </div>
                
                    <ScoreList />
                    </Route>

                    <Route path="/visualize" component ={Visualize} />
                    <Route path="/heatmap" component = {Heatmap} />
                    <Route path="/review"
                            render = {() => <ReviewSubmission answerSet={this.state.answerSet} score={this.state.score} />}
                    />
                    <Route path="/login" component={AdminLogin} />
                    <Route path="/about" component={About} />
                </div>
                <div className="footer">
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
            </div>

            </Router>
            
        );
    }

}