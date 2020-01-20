import React, {Component} from 'react';
import Ionicon from 'react-ionicons'
import {withRouter} from 'react-router-dom'
import PriceList from '../components/PriceList';
import ViewTab from '../components/ViewTab';
import {LIST_VIEW,CHART_VIEW, TYPE_OUTCOME, TYPE_INCOME, parseToYearAndMonth, padLeft} from '../utility'
import MonthPicker from '../components/MonthPicker'
import CreateBtn from '../components/CreateBtn'
import TotalPrice from '../components/TotalPrice'
import {Tabs, Tab} from '../components/Tabs'
import withContext from '../WithContext'
import Loader from '../components/Loader'


const tabsText = [LIST_VIEW,CHART_VIEW]

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabView: tabsText[0]
        }
    }
    componentDidMount() {
        this.props.actions.getInitalData()
    }
    changeView = (index) => {
        this.setState({
            tabView: tabsText[index]
        })
    }
    changeDate = (year, month) => {
        this.props.actions.selectNewMonth(year, month)
    }
    modifyItem = (item) => {
        this.props.history.push(`/edit/${item.id}`)
    }
    createItem = () => {
        // 路由跳转到create页面
        this.props.history.push('/create')
    }
    deleteItem = (item) => {
        this.props.actions.deleteItem(item)
    }
    render() {
        const {data} = this.props
        const {items, categories, currentDate, isLoading} = data
        const {tabView} = this.state
        debugger
        const itemsWithCategory = items.map(item => {
            item.category = categoies[item.cid]
            return item
        })
        let totalIncome = 0, totalOutcome = 0
        itemsWithCategory.forEach(item => {
            if (item.category.type === TYPE_OUTCOME) {
                totalOutcome += item.price
            }
            else {
                totalIncome += item.price
            }
        })
        return (
            <React.Fragment>
                <header className="App-header">
                    <div className="row">
                        <div className="col">
                            <MonthPicker
                                year={currentDate.year}
                                month={currentDate.month}
                                onChange={this.changeDate}
                            />
                        </div>
                        <div className="col">
                            <TotalPrice
                                income={totalIncome}
                                outcome={totalOutcome}
                            />
                        </div>
                    </div>
                </header>
                <div className="content-area py-3 px-3">
                    {isLoading && <Loader/>}
                    {!isLoading &&
                        <React.Fragment>
                            <Tabs activeIndex={0} onTabChange={this.changeView}>
                                <Tab>
                                <Ionicon 
                                    className="rounded-circle mr-2"
                                    fontSize="25px"
                                    color={'#007bff'}
                                    icon='ios-paper'
                                />
                                列表模式
                                </Tab>
                                <Tab>
                                <Ionicon 
                                    className="rounded-circle mr-2"
                                    fontSize="25px"
                                    color={'#007bff'}
                                    icon='ios-pie'
                                />
                                图表模式
                                </Tab>
                            </Tabs>
                            <ViewTab activeTab={tabView} onTabChange={this.changeView }></ViewTab>
                            <CreateBtn onClick={this.createItem}/>
                            {tabView === LIST_VIEW &&
                                <PriceList
                                    items={items}
                                    onModifyItem={this.modifyItem}
                                    onDeleteItem={this.deleteItem}
                                />
                            }
                            {tabView === CHART_VIEW &&
                                <h1>图表区域</h1>
                            }
                        </React.Fragment>
                    }
                </div>
            </React.Fragment>
        )
    }
}
export default withRouter(withContext(Home))