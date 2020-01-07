import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Home from './containers/Home'
import Create from './containers/Create'
import {testItems, testCategories} from './testData'
import {flatternArr} from './utility'

// 创建一个context来实现非父子组件间数据传递
export const AppContext = React.createContext()
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: flatternArr(testItems),
            categories: flatternArr(testCategories)
        }
        // 顶部actions包括所有的数据处理方法，通过AppContext.provider的actions自顶向下传
        this.actions = {
            deleteItem: (item) => {
                debugger
                delete this.state.items[item.id]
                this.setState({
                    items: this.state.items
                })
            }
        }
    }
    render() {
        return (
            <AppContext.Provider value={{
                state: this.state,
                actions: this.actions
            }}>
                <Router>
                    <div className="App">
                        <div className="container pb-5">
                            <Route path="/" exact component={Home}></Route>
                            <Route path="/create" component={Create}></Route>
                            <Route path="/edit/:id" component={Create}></Route>
                        </div>
                    </div>
                </Router>
            </AppContext.Provider>
        )
    }
}

export default App;
