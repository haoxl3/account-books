import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import axios from 'axios'
import Home from './containers/Home'
import Create from './containers/Create'
import {flatternArr, ID, parseToYearAndMonth} from './utility'
// 创建一个context来实现非父子组件间数据传递
import { AppContext } from './AppContext'


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: {},
            categories: {},
            isLoading: false,
            currentDate: parseToYearAndMonth()
        }
        const withLoading = (cb) => {
            return (...args) => {
                this.setState({
                    isLoading: true
                })
                return cb(...args)
            }
        }
        // 顶部actions包括所有的数据处理方法，通过AppContext.provider的actions自顶向下传
        this.actions = {
            getInitalData: withLoading(async () => {
                const {currentDate} = this.state
                const getURLWithData = `/items?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`
                const results = await Promise.all([axios.get('/categories'), axios.get(getURLWithData)])
                const [categories, items] = results
                this.setState({
                    items: flatternArr(items.data),
                    categories: flatternArr(categories.data),
                    isLoading: false
                })
            }),
            selectNewMonth: withLoading(async (year, month) => {
                const getURLWithData = `/items?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`
                const items = await axios.get(getURLWithData)
                this.setState({
                    items: flatternArr(items.data),
                    currentDate: {year, month}
                })
                return items
            }),
            deleteItem: withLoading(async (item) => {
                const deleteItem = await axios.delete(`/items/${item.id}`)
                delete this.state.items[item.id]
                this.setState({
                    items: this.state.items
                })
            }),
            getEditData: withLoading(async (id) => {
                const {items, categories} = this.state
                let promiseArr = []
                if (Object.keys(categories).length === 0) {
                    promiseArr.push(axios.get('/categories'))
                }
                const itemAlreadyFeched = (Object.keys(items).indexOf(id) > -1)
                if (id && !itemAlreadyFeched) {
                    const getURLWithID = `/items/${id}`
                    promiseArr.push(axios.get(getURLWithID))
                }
                const [categories, editItem] = await Promise.all(promiseArr)
                if (id) {
                    this.setState({
                        categories: flatternArr(categories.data),
                        isLoading: false,
                        items: {...this.state.items, [id]: editItem.data}
                    })
                }
                else {
                    this.setState({
                        categories: flatternArr(categories.data),
                        isLoading: false
                    })
                }
                return {
                    categories: flatternArr(categories.data),
                    editItem: editItem ? editItem.data : null
                }
            }),
            createItem: withLoading(async (data, categoryId) => {
                const newId = ID()
                const parsedDate = parseToYearAndMonth(data.date)
                data.monthCategory = `${parsedDate.year}-${parsedDate.month}`
                data.timestamp = new Date(data.date).getTime()
                const newItem = await axios.post('/items', {...data, id: newId, cid: categoryId})
                // 将新项添加到items最后
                this.setState({
                    items: {...this.state.items, [newId]: newItem.data},
                    isLoading: false
                })
                return newItem.data
            }),
            updateItem: withLoading(async (item, updatedCategoryId) => {
                const updateData = {
                    ...item,
                    cid: updatedCategoryId,
                    timestamp: new Date(item.date).getTime()
                }
                const modifedItem = await axios.put(`/items/${item.id}`, updatedData)
                this.setState({
                    items: {...this.state.items, [modifedItem.id]: modifedItem.data},
                    isLoading: false
                })
                return modifedItem.data
            })
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
