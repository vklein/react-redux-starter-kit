import * as dataActions from "actions/data";
import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ReactComponent} from "apparena-patterns-react";
import Form from "components/form";

class FormContainer extends ReactComponent {
    getInitState() {
        this.handleInputChange = ::this.handleInputChange;
        return {
            data: {}
        };
    }

    handleInputChange(e) {
        const name = e.target.name;
        const data = {
            [name]: e.target.value
        };
        this.props.addData(data);
    }

    render() {
        const {data} = this.props;
        return (
            <Form
                data={data}
                handleInputChange={this.handleInputChange}
            />
        )
    }
}

export default connect(
    (state) => ({
        data: state.data,
    }),
    (dispatch) => ({
        ...bindActionCreators(dataActions, dispatch),
    })
)(FormContainer);