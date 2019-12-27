import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadData } from '../actions/customerActions'


class Customers extends Component {

    componentWillMount() {
        this.props.loadData();
    }

    render() {
        const { customers } = this.props;
        let message = null, list = null;
        if(!customers || customers.length === 0) {
            message = "no customers"
        } else {
            list = customers.map(customer =>    
                <div style={{ marginBottom: 50 }}>
                    <p>{customer.name.firstName} {customer.name.lastName}</p>
                    <p>{customer.gender}</p>
                    <p>{customer.age}</p>
                    <p>{customer.address}</p>
                </div>
            )
        }

        return (
            <div>
                {list}
                {message}
            </div>
        )
    }
}


const mapStateToProps = state => ({
    ...state.counterReducer
});


export default connect(
    mapStateToProps, { loadData },
)(Customers)