import React, {Component} from 'react';
import axios from 'axios';

//class component for table rows (no state/lifecycle methods)
//only accepts props and returns jsx
const Score = props => (
    <tr>
        <td>{props.score.username}</td>
        <td>{props.score.value}</td>
        <td>{props.score.date.substring(0,10)}</td>
    </tr>
)

export default class ScoresList extends Component{
    constructor(props){
        super(props);

        this.state = {scores: []};
    }
    
    //lifecycle method called right before anything displayed on page
    componentDidMount(){
        axios.get('http://206.189.192.230:5000/scores/')
            .then(response => {
                this.setState({scores: response.data});
            })
            .catch((error) => {
                console.log(error);
            })

    }


    //return Score component (table row) for every score that exists
    scoreList(){
        this.state.scores.sort((a,b) => (a.value > b.value) ? -1 : 1);

        return this.state.scores.slice(0,10).map(currentscore => {
            return <Score score={currentscore} key={currentscore._id} />;
        })
    }

    render(){

        return(
            <div>
                <h1>High Scores</h1>
                <table className="table">
                    <tbody className ="table-header">
                        <tr>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </tbody>            
                    <tbody className="table-content" id="table-content">
                        {this.scoreList()}
                    </tbody>
                </table>
            </div>
        )
    }
}