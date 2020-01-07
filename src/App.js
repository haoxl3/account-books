import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Home from './containers/Home'
import Create from './containers/Create'
import {testItems, testCategories} from './testData'
import {flatternArr} from './utility'

console.log(flatternArr(testItems))
class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <div className="container pb-5">
                        <Route path="/" exact component={Home}></Route>
                        <Route path="/create" component={Create}></Route>
                        <Route path="/edit/:id" component={Create}></Route>
                    </div>
                </div>
            </Router>
        )
    }
}

export default App;
