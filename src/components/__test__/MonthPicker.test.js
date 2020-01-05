import React from 'react'
import ReactDOM from 'react-dom'
import {mount} from 'enzyme'
import MonthPicker from '../MonthPicker'

let props = {
    year: 2018,
    month: 8,
    onChange: jest.fn()
}
let wrapper

describe('test MOnthPicker component', () => {
    beforeEach(() => {
        wrapper = mount(<MonthPicker {...props}/>)
    })
    it('after the dropdown is shown, click the document should close the', () => {
        let eventMap = {}
        document.addEventListener = jest.fn((event, cb) => {
            eventMap[event] = cb
        })
        const wrapper = mount(<MonthPicker {...props}/>)
        wrapper.find('.dropdown-toggle').simulate('click')
        expect(wrapper.state('isOpen')).toEqual(true)
        expect(wrapper.find('.dropdown-menu').length).toEqual(1)
        // 找到dom节点
        eventMap.click({
            target: ReactDOM.findDOMNode(wrapper.instance())
        })
        expect(wrapper.state('isOpen')).toEqual(true)

        eventMap.click({
            target: document
        })
        expect(wrapper.state('isOpen')).toEqual(false)
    })
})