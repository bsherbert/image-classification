export const Perceptron = (numFeatures, data, numWeightVectors, numIterations) => {



    console.log("starting perceptron training");

    //one feature per pixel, +1 bias feature
    //var digitWeights = [10][numFeatures + 1];
    //initialize 2-d array
    var digitWeights = [];
    for(let i=0; i<numWeightVectors; i++){
        digitWeights[i] = [];
    }


    //initialize weights to random value between -1 and 1 for each of the 10 digits
    for(let i=0; i<numWeightVectors; i++){
        for(let j=0; j<numFeatures+1; j++){

            //pick random number from [0,1)
            let r = Math.random(); 

            //make negative at ~50% chance
            let n = Math.random();
            if(n < 0.5){
                r = r*-1;
            }

            digitWeights[i][j] = r
        }
    }

    //check weights
    // console.log("initial weights: ");
    // console.log(digitWeights);

    // console.log(data);
    // console.log("length is: " + data.length);

    //repeat for designated number of training iterations
    for(let i=0; i<numIterations; i++){
        
        //track info
        var matches = 0;
        var correctDigits = [];
        var totalDigits = [];
        for(let j=0; j<numWeightVectors; j++){
            correctDigits[j] = 0;
            totalDigits[j] = 0;
        }



        //for each image in training data
        //calculate score based on digit weights
        for(let j =0; j<data.length; j++){
            
            //initialize score for each digit to 0
            var score = [];
            for(let q=0; q<numWeightVectors; q++){
                score[q] = 0;
            }

            //for each digit
            for(let digit=0; digit<numWeightVectors; digit++){
                

                /*
                    if you want to use different feature values (i.e. quadrants
                    rather than per pixel), need to create a feature array
                    based on how many "u"'s show up in the given feature
                    then multiply that value by the weight

                    also need to adjust weight updates on incorrect guess
                */

                //calculate score for current image in dataset for each digit
                //for each feature (pixel)
                for(let q=0; q<numFeatures;q++){
                    //if pixel is occupied
                    if(data[j].pixels.charAt(q) === "u"){
                        //increase score by feature weight
                        score[digit] += digitWeights[digit][q];
                
                    }
                }

                //add bias
                score[digit] += digitWeights[digit][numFeatures];
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

            // console.log("guess: " + bestDigit);
            // console.log("actual: " + data[j].label);

            //if results match reality
            if(bestDigit === Number(data[j].label)){
                matches++;
                correctDigits[data[j].label]++;
                totalDigits[data[j].label]++;
            }
            //results don't match
            else{
                totalDigits[data[j].label]++;

                //update digitWeights according to result
                
                //decrease weight of guessed digit
                //(could be numFeatures-1 based on old project)
                for(let q=0; q<numFeatures; q++){
                    //decrease by value of corresponding feature
                    if(data[j].pixels.charAt(q) === "u"){
                        digitWeights[bestDigit][q] -= 1;
                    }
                }
                //reduce bias
                digitWeights[bestDigit][numFeatures] -= 1;

                //increase weight of correct digit
                for(let q=0; q<numFeatures; q++){
                    //increase by value of corresponding feature
                    if(data[j].pixels.charAt(q) === "u"){
                        digitWeights[data[j].label][q] += 1;
                    }
                }
                //increase bias
                digitWeights[data[j].label][numFeatures] += 1;

            }

        }

        console.log("Digit accuracy: ");
        for(let q=0; q<numWeightVectors; q++){
            console.log(q + ": (" + correctDigits[q] + "/" + totalDigits[q] + ") " + (correctDigits[q]/totalDigits[q] * 100) + "%");
        }

        console.log("Success rate for iteration " + i + ": (" + matches + "/" + data.length + ") " + (matches/data.length * 100) + "%");
    }

    return digitWeights;
    //return digit weights, create a "check" button on classifier page
    //save digit weights as part of the state
    //in check method, use digit weights to calculate a guess based on input grid

}
