import React from 'react'
import {withRouter} from 'react-router-dom'
import CategorySelect from '../components/CategorySelect'
import {Tabs, Tab} from '../components/Tabs'
import PriceForm from '../components/PriceForm'
import {testCategories} from '../testData'
import {TYPE_INCOME, TYPE_OUTCOME} from '../utility'
import withContext from '../WithContext'
const tabsText = [TYPE_OUTCOME, TYPE_INCOME]

class Create extends React.Component {
    constructor(props) {
        super(props)
        const {id} = props.match.params
        const {categories, items} = props.data
        this.state = {
            selectedTab: (id && items[id]) ? categories[items[id].cid].type : TYPE_OUTCOME,
            selectedCategory: (id && items[id]) ? categories[items[id].cid].type : null
        }
    }
    componentDidMount() {
        const {id} = this.props.match.params
        this.props.actions.getEditData(id)
    }
    tabChange = (index) => {
        this.setState({
            selectedTab: tabsText[index]
        })
    }
    cancelSubmit = () => {
        this.props.history.push('/')
    }
    submitForm = (data, isEditMode) => {
        // react isEditMode判断是否是修改
        if(!isEditMode) {
            // create, 将表单的内容及分类传出去
            this.props.actions.createItem(data, this.state.selectedCategory.id).then(() => {
                this.props.history.push('/')
            })
        } else {
            // update
            this.props.actions.updateItem(data, this.state.selectedCategory.id).then(() => {
                this.props.history.push('/')
            })
        }
    }
    selectCategory = (category) => {
        this.setState({
            selectedCategory: category
        })
    }
    render() {
        const {data} = this.props
        const {items, categories} = data
        // 有路由后，props自带的match可取出地址栏上的参数
        const {id} = this.props.match.params
        const editItem = (id && items[id]) ? items[id] : {}
        console.log('****editItem', editItem)
        const {selectedTab, selectedCategory} = this.state
        const filterCategories = testCategories.filter(category => category.type === TYPE_OUTCOME)
        const tabIndex = tabsText.findIndex(text => text === selectedTab)
        return (
            <div className="create-page py-3 px-3 rounded mt-3" style={{background: '#fff'}}>
                <Tabs activeIndex={tabIndex} onTabChange={this.tabChange}>
                    <Tab>支出</Tab>
                    <Tab>收入</Tab>
                </Tabs>
                <CategorySelect 
                    categories={filterCategories} 
                    onSelectCategory={this.selectCategory}
                    selectedCategory={selectedCategory}
                >
                </CategorySelect>
                <PriceForm
                    onFormSubmit={this.submitForm}
                    onCancelSubmit={this.cancelSubmit}
                    // 回显要修改的行的内容
                    item={editItem}
                ></PriceForm>
            </div>
        )
    }
}
export default withRouter(withContext(Create))