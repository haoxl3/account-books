import React from 'react'
import {AppContext} from './App'

// 高阶组件，因为所有的组件都要用consumer包裹起来，所以可用
// 高阶组件返回出去一个组件来实现,将state通过data属性传递出去
const withContext = (Component) => {
    return (props) => (
        <AppContext.Consumer>
            {({state}) => {
                return <Component {...props} data={state}/>
            }}
        </AppContext.Consumer>
    )
}
export default withContext