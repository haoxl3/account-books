import React from 'react'
import PropTypes from 'prop-types'
import {padLeft, range} from '../utility'

class MonthPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            selectedYear: this.props.year
        }
    }
    // 如果不想使用bind，可使用() => {}代替，默认在create-react-app中开启
    toggleDropdown = (event) => {
        event.preventDefault()
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    // 关闭下拉框，并回传选择的年月
    selectYear = (event, yearNumber) => {
        event.preventDefault()
        this.setState({
            selectedYear: yearNumber
        })
    }
    // 高亮当前点击的月份
    selectMonth = (event, monthNumber) => {
        event.preventDefault()
        this.setState({
            isOpen: false
        })
        this.props.onChange(this.state.selectedYear, monthNumber)
    }
    render() {
        const {year, month} = this.props
        const {isOpen} = this.state
        const {selectedYear} = this.state
        const monthRange = range(12, 1)
        const yearRange = range(9, -4).map(number => number + year)
        return (
            <div className="dropdown month-picker-component">
                <h4>选择月份</h4>
                <button 
                    className="btn btn-lg btn-secondary dropdown-toggle"
                    onClick={this.toggleDropdown}
                >
                    {`${year}年 ${padLeft(month)}月`}
                </button>
                { isOpen &&
                    <div className="dropdown-menu" style={{display:'block'}}>
                        <div className="row">
                            <div className="col border-right">
                                { yearRange.map((yearNumber, index) => 
                                    <a 
                                        key={index} 
                                        className={(yearNumber === selectedYear) ? 'dropdown-item active':'dropdown-item'}
                                        onClick={(event) => {this.selectYear(event, yearNumber)}}
                                    >
                                        {yearNumber}年
                                    </a>
                                )}
                            </div>
                            <div className="col">
                                { monthRange.map((monthNumber, index) => 
                                    <a 
                                        key={index} 
                                        className={(monthNumber === month) ? 'dropdown-item active':'dropdown-item'}
                                        onClick={(event) => {this.selectMonth(event, monthNumber)}}
                                    >
                                        {padLeft(monthNumber)}月
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
MonthPicker.propTypes = {
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}
export default MonthPicker