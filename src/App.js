import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Home from './containers/Home'
import Create from './containers/Create'
import {testItems, testCategories} from './testData'
import {flatternArr, ID, parseToYearAndMonth} from './utility'

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
            },
            createItem: (data, categoryId) => {
                debugger
                const newId = ID()
                const parsedDate = parseToYearAndMonth(data.date)
                data.monthCategory = `${parsedDate.year}-${parsedDate.month}`
                data.timestamp = new Date(data.date).getTime()
                const newItem = {...data, id: newId, cid: categoryId}
                // 将新项添加到items最后
                this.setState({
                    items: {...this.state.items, [newId]: newItem}
                })
            },
            updateItem: (item, updatedCategoryId) => {
                const modifedItem = {
                    ...item,
                    cid: updatedCategoryId,
                    timestamp: new Date(item.date).getTime()
                }
                this.setState({
                    items: {...this.state.items, [modifedItem.id]: modifedItem}
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
