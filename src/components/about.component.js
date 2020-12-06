import React, {Component} from 'react';

export default class About extends Component{
    constructor(props){
        super(props);
        this.state={
        };

    }


    render(){
        return(
            <div>
                <div className="about">
                    <h1>How It Works</h1>
                    <div className="description">
                        <p>This project uses a <strong>perceptron</strong>; a machine learning algorithm that can evaluate images based on pre-defined features.
                        In this case, the <strong>image</strong> is a 28x28 grid (as seen on the home page), and the <strong>features</strong> are each individual box that makes up that grid.
                        Before the AI can properly understand a user's writing, it needs to be trained. This is done through a few main steps:</p>
                        
                        <ul>
                            <li>First, a set of training data needs to be established. For this project, the training data was created from a sample of multiple users drawing on the primary grid. The samples are stored in a database using MongoDB and are pulled when the main page loads to begin the training process.</li>
                            <li>Next, random weight values are assigned for every feature, for every digit. These values are used as a starting point, so that the AI can make guesses before training is completed.</li>
                            <li>The AI then evaluates an item in the training set, calculating a score for each digit. If a feature is occupied, it adds points equal to the weight of that feature. It does this for every feature in the image to get a final score, and finally tries to guess which digit is correct using the highest score.</li>
                            <li>If it was correct, it moves on to the next digit in the training set. If it is incorrect, it adjusts the weights for both the guessed digit and the correct one before moving on.</li>
                            <li>It continues guessing for every digit in the training set, using the most recent weight values. </li>
                            <li>To ensure the weights are reliable, it repeats this process on the full training set several times.</li>
                        </ul>

                        <p>The training process is performed when the webpage is loaded. During the game, whenever someone draws a digit in the grid, the AI can make a fairly accurate guess as to what the digit is using the weight values it came up with.
                        After a user has finished playing the game, they may submit their drawings to further increase the sample size of the training set, which will help improve the accuracy of its guesses in the future.</p>
                    </div>
                </div>
            </div>
        );
    }

}